import { createContext } from '@lit/context';

import { namespace } from '../../hosts/todos/protocol';
import type { TodoState } from '../../hosts/todos/protocol';
import type { IpcMessage } from '../../protocol';
import type { AppIpc } from '../shared/app-ipc';
import { StateProvider } from '../shared/state-provider';

export const stateContext = createContext<TodoState>(`state:${namespace}`);

export class TodoStateProvider extends StateProvider<TodoState> {
  constructor(host: HTMLElement, ipc: AppIpc, bootstrap?: TodoState) {
    super(host, ipc, stateContext, bootstrap);
  }
  onReceiveMessage(e: IpcMessage) {
    console.log('TodoStateProvider', e);
  }
}
