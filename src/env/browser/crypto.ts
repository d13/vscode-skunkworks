import { base64 } from './base64';

export function getNonce(): string {
  return base64(globalThis.crypto.getRandomValues(new Uint8Array(16)));
}
