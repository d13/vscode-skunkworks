import { createHash, randomBytes, randomUUID } from "crypto";

export function getNonce(): string {
  return randomBytes(16).toString("base64");
}
