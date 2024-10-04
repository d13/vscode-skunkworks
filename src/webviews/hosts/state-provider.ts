import type { Disposable } from 'vscode';

import type { Container } from '../../container';
import type { IpcMessage } from '../protocol';

import type { WebviewHost } from './host';

export interface WebviewStateProviderHooks<State> extends Disposable {
  includeBootstrap?(): Partial<State>;

  // lifecycle hooks
  onShowing?(): void;
  onReady?(): void;
  onRefresh?(force?: boolean): void;
  // onMessageReceived?(e: IpcMessage): void;
  onActiveChanged?(focused: boolean): void;
  onFocusChanged?(focused: boolean): void;
  onVisibilityChanged?(visible: boolean): void;
}

export abstract class WebviewStateProvider<State = unknown> implements WebviewStateProviderHooks<State> {
  protected readonly _disposables: Disposable[] = [];
  protected readonly container: Container;
  protected readonly host: WebviewHost;

  constructor(container: Container, host: WebviewHost) {
    this.container = container;
    this.host = host;

    this._disposables.push(host.onRecieveMessage(e => this.onMessageReceived(e)));
  }

  protected abstract onMessageReceived(e: IpcMessage): void;

  dispose() {
    this._disposables.forEach(disposable => void disposable.dispose());
  }
}
