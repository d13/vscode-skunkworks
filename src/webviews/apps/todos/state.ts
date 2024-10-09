import { createContext } from '@lit/context';

import type { IpcMessage } from '../../providers/protocol';
import { AllTodosRequest, AllTodosResponse, namespace } from '../../providers/todos/protocol';
import type { TodoState } from '../../providers/todos/protocol';
import type { AppIpc } from '../shared/app-ipc';
import { StateProvider } from '../shared/state-provider';

export const stateContext = createContext<TodoState>(`state:${namespace}`);

export class TodoStateProvider extends StateProvider<TodoState> {
  constructor(host: HTMLElement, ipc: AppIpc, bootstrap?: TodoState) {
    super(host, ipc, stateContext, bootstrap ?? { todos: [] });
  }
  onReceiveMessage(e: IpcMessage) {
    console.log('TodoStateProvider', e);
    switch (true) {
      case AllTodosResponse.is(e):
        this.state.todos = e.params.todos;
        this.provider.setValue(this.state);
        break;
      default:
        break;
    }
  }
  getAll() {
    this._ipc.send(AllTodosRequest, undefined);
  }
}
