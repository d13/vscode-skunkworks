const { fromCharCode } = String;
const textEncoder = new TextEncoder();

export function base64(s: string): string;
export function base64(bytes: Uint8Array): string;
export function base64(data: string | Uint8Array): string {
  const bytes = typeof data === "string" ? textEncoder.encode(data) : data;

  let output = "";
  for (let i = 0, { length } = bytes; i < length; i++) {
    output += fromCharCode(bytes[i]);
  }

  return globalThis.btoa(output);
}
