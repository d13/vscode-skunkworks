export interface VsCodeApi {
  postMessage(msg: unknown): void;
  getState(): Record<string, unknown>;
  setState(state: Record<string, unknown>): Record<string, unknown>;
}
declare function acquireVsCodeApi(): VsCodeApi;

let _api: VsCodeApi | undefined;
export function getVsCodeApi() {
  return (_api ??= acquireVsCodeApi());
}
