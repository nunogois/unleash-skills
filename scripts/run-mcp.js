#!/usr/bin/env node
import { createConnectionContextStream } from './connection-context.js';
import { homedir } from 'node:os';
import { spawn } from 'node:child_process';
import { MCP_PACKAGE, readSettings, serverEnvironment } from './local-mcp.js';

try {
  if (process.argv.length !== 2) throw new Error('Usage: node scripts/run-mcp.js');
  if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('Unleash MCP needs Node 24 or newer.');
  const settings = await readSettings({ env: process.env, home: homedir() });
  const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['-y', MCP_PACKAGE], {
    env: serverEnvironment({ env: process.env, settings }),
    stdio: ['inherit', 'pipe', 'inherit'],
  });
  child.stdout.pipe(createConnectionContextStream(settings.instanceUrl)).pipe(process.stdout);
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
  child.on('error', () => {
    console.error('Cannot start npx. Install Node 24 or newer with npm, then restart your agent.');
    process.exitCode = 1;
  });
  child.on('exit', (code) => { process.exitCode = code ?? 1; });
} catch (error) {
  console.error(`${error.message}\nCheck the plugin connection settings. For Codex, run node scripts/setup-codex.js from your unleash-skills checkout.`);
  process.exitCode = 2;
}
