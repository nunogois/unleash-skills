import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createConnectionContextStream } from './connection-context.js';

async function output(chunks) {
  const stream = Readable.from(chunks).pipe(createConnectionContextStream('https://example.com/unleash'));
  let result = '';
  for await (const chunk of stream) result += chunk;
  return result;
}

test('makes the configured instance URL available without changing the MCP version or tool instructions', async () => {
  const message = { jsonrpc: '2.0', id: 1, result: { protocolVersion: '2024-11-05', serverInfo: { name: 'unleash-mcp', version: '0.6.0-beta.5' }, instructions: 'Use the tools.' } };
  const wire = JSON.stringify(message) + '\n';

  const received = JSON.parse(await output([wire.slice(0, 25), wire.slice(25)]));

  assert.deepEqual(received.result.serverInfo, message.result.serverInfo);
  assert.equal(received.result.instructions, 'Use the tools.\nConnected Unleash instance URL: https://example.com/unleash\nReuse this URL for SDK configuration and UI links; preserve its base path.');
});

test('preserves normal tool results, errors, and UTF-8 across stream boundaries', async () => {
  const wire = '{"jsonrpc":"2.0","id":2,"result":{"content":[{"type":"text","text":"héllo"}]}}\n{"jsonrpc":"2.0","id":3,"error":{"code":-32601,"message":"Unknown tool"}}\n';
  const bytes = Buffer.from(wire);
  const split = bytes.indexOf(Buffer.from('é')) + 1;

  assert.equal(await output([bytes.subarray(0, split), bytes.subarray(split)]), wire);
});

test('preserves an unterminated final message and non-JSON output', async () => {
  assert.equal(await output(['not JSON\n', '{"jsonrpc":"2.0","id":1,"error":{"code":1}}']), 'not JSON\n{"jsonrpc":"2.0","id":1,"error":{"code":1}}');
});
