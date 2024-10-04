export type IpcScope = string;

export interface IpcMessage<T = unknown> {
  id: string;
  scope: IpcScope;
  method: string;
  params: T;
  completionId?: string;
}

export class IpcCall<Params = void> {
  public readonly method: string;

  constructor(
    public readonly scope: IpcScope,
    method: string,
    public readonly reset: boolean = false,
  ) {
    this.method = `${scope}/${method}`;
  }

  is(msg: IpcMessage): msg is IpcMessage<Params> {
    return msg.method === this.method;
  }
}
