import { Transform } from 'node:stream';
import { StringDecoder } from 'node:string_decoder';

// The pinned beta keeps its URL in the server process; expose only that URL at initialization.
export function createConnectionContextStream(instanceUrl) {
  const decoder = new StringDecoder('utf8');
  let pending = '';
  const enrich = (line) => {
    let message;
    try { message = JSON.parse(line); } catch { return line; }
    if (!message?.result?.serverInfo || !message.result.protocolVersion) return line;
    const context = `Connected Unleash instance URL: ${instanceUrl}\nReuse this URL for SDK configuration and UI links; preserve its base path.`;
    message.result.instructions = [message.result.instructions, context].filter(Boolean).join('\n');
    return JSON.stringify(message);
  };
  return new Transform({
    transform(chunk, _encoding, callback) {
      pending += decoder.write(chunk);
      let newline;
      while ((newline = pending.indexOf('\n')) !== -1) {
        this.push(enrich(pending.slice(0, newline)) + '\n');
        pending = pending.slice(newline + 1);
      }
      callback();
    },
    flush(callback) {
      pending += decoder.end();
      if (pending) this.push(enrich(pending));
      callback();
    },
  });
}
