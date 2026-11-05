import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';

export const MCP_PACKAGE = '@unleash/mcp@0.6.0-beta.5';

export const settingsPath = (home) => join(home, '.config', 'unleash-skills', 'mcp.json');

export function normalizeInstanceUrl(instanceUrl) {
  let url;
  try {
    url = new URL(instanceUrl);
  } catch {
    throw new Error('Enter a complete Unleash instance URL.');
  }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('Use an HTTP(S) instance URL without credentials, a query, or a fragment.');
  }
  return url.href.replace(/\/+$/, '');
}

export function validateSettings({ instanceUrl, personalAccessToken }) {
  const normalizedUrl = normalizeInstanceUrl(instanceUrl);
  if (typeof personalAccessToken !== 'string' || !personalAccessToken.trim()) {
    throw new Error('A personal access token is required.');
  }
  return { instanceUrl: normalizedUrl, personalAccessToken: personalAccessToken.trim() };
}

export async function readSettings({ env, home }) {
  let saved = {};
  if (!env.UNLEASH_BASE_URL || !env.UNLEASH_PAT) {
    try {
      saved = JSON.parse(await readFile(settingsPath(home), 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw new Error('Cannot read Unleash settings. Run the Codex setup helper again.');
    }
  }
  return validateSettings({
    instanceUrl: env.UNLEASH_BASE_URL || saved.instanceUrl,
    personalAccessToken: env.UNLEASH_PAT || saved.personalAccessToken,
  });
}

export async function writeSettings({ home, settings }) {
  const validated = validateSettings(settings);
  const directory = join(home, '.config', 'unleash-skills');
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const temporary = join(directory, `.mcp-${process.pid}.json`);
  await writeFile(temporary, `${JSON.stringify(validated, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
  await rename(temporary, settingsPath(home));
}

export function serverEnvironment({ env, settings }) {
  return {
    ...env,
    UNLEASH_BASE_URL: settings.instanceUrl,
    UNLEASH_PAT: settings.personalAccessToken,
    npm_config_ignore_scripts: 'true',
  };
}
