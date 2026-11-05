import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, stat, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { MCP_PACKAGE, validateSettings, readSettings, writeSettings, settingsPath, serverEnvironment } from './local-mcp.js';

const settings = { instanceUrl: 'https://example.com/unleash', personalAccessToken: 'test-only-token' };

async function temporaryHome(t) {
  const home = await mkdtemp(join(tmpdir(), 'unleash-settings-'));
  t.after(() => rm(home, { recursive: true, force: true }));
  return home;
}

test('keeps the instance base path when normalizing a URL', () => {
  assert.deepEqual(validateSettings({ ...settings, instanceUrl: 'https://example.com/unleash/' }), settings);
});

for (const instanceUrl of ['invalid', 'file:///tmp/unleash', 'https://user:secret@example.com', 'https://example.com/?token=secret', 'https://example.com/#secret']) {
  test(`rejects an unsuitable instance URL: ${instanceUrl}`, () => {
    assert.throws(() => validateSettings({ ...settings, instanceUrl }));
  });
}

test('stores credentials privately and replaces them on reconfiguration', async (t) => {
  const home = await temporaryHome(t);
  await writeSettings({ home, settings });
  const updated = { ...settings, personalAccessToken: 'replacement-test-token' };
  await writeSettings({ home, settings: updated });

  assert.deepEqual(await readSettings({ env: {}, home }), updated);
  if (process.platform !== 'win32') assert.equal((await stat(settingsPath(home))).mode & 0o777, 0o600);
});

test('explicit environment values take precedence over saved credentials', async (t) => {
  const home = await temporaryHome(t);
  await writeSettings({ home, settings });
  const explicit = { instanceUrl: 'https://second.example.com', personalAccessToken: 'environment-test-token' };

  const loaded = await readSettings({ env: { UNLEASH_BASE_URL: explicit.instanceUrl, UNLEASH_PAT: explicit.personalAccessToken }, home });

  assert.deepEqual(loaded, explicit);
});

test('missing configuration fails without echoing a credential', async (t) => {
  const home = await temporaryHome(t);

  await assert.rejects(readSettings({ env: { UNLEASH_PAT: 'do-not-echo-this' }, home }), (error) => {
    assert.ok(!error.message.includes('do-not-echo-this'));
    return true;
  });
});

test('the launcher and Claude plugin target the same pinned MCP package', async () => {
  const manifest = JSON.parse(await readFile(new URL('../.mcp.json', import.meta.url), 'utf8'));

  assert.equal(manifest.mcpServers.mcp.command, 'node');
  assert.deepEqual(manifest.mcpServers.mcp.args, ['${CLAUDE_PLUGIN_ROOT}/scripts/run-mcp.js']);
  assert.equal(MCP_PACKAGE, '@unleash/mcp@0.6.0-beta.5');
});

test('passes credentials through the child environment instead of command arguments', () => {
  const environment = serverEnvironment({ env: { PATH: '/test/bin' }, settings });

  assert.equal(environment.UNLEASH_PAT, settings.personalAccessToken);
  assert.equal(environment.UNLEASH_BASE_URL, settings.instanceUrl);
  assert.equal(environment.PATH, '/test/bin');
  assert.equal(environment.npm_config_ignore_scripts, 'true');
});
