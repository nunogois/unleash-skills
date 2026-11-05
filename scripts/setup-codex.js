#!/usr/bin/env node
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { normalizeInstanceUrl, validateSettings, writeSettings } from './local-mcp.js';

function askToken() {
  return new Promise((resolveToken, reject) => {
    if (!process.stdin.isTTY) return reject(new Error('Run setup in an interactive terminal to enter the token.'));
    let token = '';
    process.stdout.write('Personal access token (hidden): ');
    process.stdin.setRawMode(true);
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.removeListener('data', onData);
      process.stdin.pause();
      process.stdout.write('\n');
    };
    const onData = (chunk) => {
      for (const character of chunk) {
        if (character === '\u0003') { finish(); reject(new Error('Setup canceled.')); return; }
        if (character === '\r' || character === '\n') { finish(); resolveToken(token); return; }
        if (character === '\u007f' || character === '\b') token = token.slice(0, -1);
        else if (character >= ' ') token += character;
      }
    };
    process.stdin.on('data', onData);
  });
}

async function main() {
  if (process.argv.length !== 2) throw new Error('Usage: node scripts/setup-codex.js');
  if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('Install Node 24 or newer first.');
  if (!process.stdin.isTTY) throw new Error('Run setup in an interactive terminal.');
  console.log('Configure the Unleash plugin connection. Previously saved URL/token values will be replaced.');
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const enteredUrl = await prompt.question('Unleash instance URL (including base path, without /api): ');
  prompt.close();
  const instanceUrl = normalizeInstanceUrl(enteredUrl);
  console.log(`Open ${instanceUrl}/profile/personal-api-tokens to create a personal API token for your agent.`);
  console.log('Choose a name and expiry, then copy the full token (shown only once). It gives the agent your permissions; your app will use a separate SDK token.');
  console.log('Paste it into the hidden prompt below, never into chat. Help: https://docs.getunleash.io/concepts/api-tokens-and-client-keys#personal-access-tokens');
  const personalAccessToken = await askToken();
  const settings = validateSettings({ instanceUrl, personalAccessToken });
  await writeSettings({ home: homedir(), settings });
  console.log('Connection settings saved. Restart the plugin MCP connection or Codex, then use $onboarding.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 2; });
}
