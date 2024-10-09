import { ContextProvider } from '@lit/context';
import type { ReactiveControllerHost } from 'lit';

import type { IpcMessage } from '../../providers/protocol';

import type { AppIpc } from './app-ipc';
import type { Disposable } from './utils/disposable';

type ReactiveElementHost = Partial<ReactiveControllerHost> & HTMLElement;

export abstract class StateProvider<State = unknown> implements Disposable {
  private readonly disposable!: Disposable;
  protected readonly provider: ContextProvider<{ __context__: State }, ReactiveElementHost>;
  protected readonly state: State;

  constructor(
    host: ReactiveElementHost,
    protected readonly _ipc: AppIpc,
    stateContext: { __context__: State },
    bootstrap: State,
  ) {
    this.state = bootstrap;
    this.provider = new ContextProvider(host, { context: stateContext, initialValue: bootstrap });

    this.disposable = this._ipc.onReceiveMessage(msg => this.onReceiveMessage(msg));
  }

  abstract onReceiveMessage(msg: IpcMessage): void;

  dispose() {
    this.disposable.dispose();
  }
}
