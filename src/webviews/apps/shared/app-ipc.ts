import type { IpcMessage } from '../../protocol';

import type { VsCodeApi } from './api';
import { getVsCodeApi } from './api';
import type { Disposable } from './utils/disposable';
import { EventEmitter } from './utils/emitter';
import { on } from './utils/events';

export class AppIpc implements Disposable {
  private readonly _api!: VsCodeApi;
  private readonly _disposables: Disposable[] = [];

  private _onRecieveMessage = new EventEmitter<IpcMessage>();
  get onRecieveMessage() {
    return this._onRecieveMessage.event;
  }

  constructor(private readonly _appName: string) {
    this._api = getVsCodeApi();
    this._disposables.push(on(window, 'message', e => this.onMessageRecieved(e as MessageEvent<IpcMessage>)));
  }

  private onMessageRecieved(e: MessageEvent<IpcMessage>) {
    this._onRecieveMessage.fire(e.data);
  }

  send(type: string, params: unknown) {
    this.postMessage({
      id: `${Date.now()}`,
      scope: type,
      method: type,
      params,
    });
  }

  private postMessage(message: IpcMessage) {
    this._api.postMessage(message);
  }

  getState() {
    return this._api.getState();
  }

  setState<T>(state: Partial<T>) {
    this._api.setState(state);
  }

  dispose() {
    this._disposables.forEach(disposable => disposable.dispose());
  }
}