import type { Disposable } from 'vscode';

import type { Container } from '../../container';
import type { WebviewHost } from '../hosts/host';

import type { IpcMessage } from './protocol';

export interface WebviewStateProviderHooks<State = unknown> extends Disposable {
  readonly namespace: string;
  includeBootstrap?(): Promise<Partial<State>>;

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
  readonly namespace: string;

  constructor(namespace: string, container: Container, host: WebviewHost) {
    this.namespace = namespace;
    this.container = container;
    this.host = host;

    this._disposables.push(host.onRecieveMessage(e => this.onMessageReceived(e)));
  }

  protected abstract onMessageReceived(e: IpcMessage): void;

  dispose() {
    this._disposables.forEach(disposable => void disposable.dispose());
  }
}
