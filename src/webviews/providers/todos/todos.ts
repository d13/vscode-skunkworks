import type { Container } from '../../../container';
import type { WebviewHost } from '../../hosts/host';
import type { IpcMessage } from '../protocol';
import type { WebviewStateProviderHooks } from '../state-provider';
import { WebviewStateProvider } from '../state-provider';

import { AllTodosRequest, AllTodosResponse, type TodoState } from './protocol';

export class TodosWebviewProvider extends WebviewStateProvider implements WebviewStateProviderHooks<TodoState> {
  constructor(namespace: string, container: Container, host: WebviewHost) {
    super(namespace, container, host);

    console.log('TodosWebview');
  }

  async onMessageReceived(e: IpcMessage): Promise<void> {
    console.log('TodosWebview', e);

    switch (true) {
      case AllTodosRequest.is(e):
        void this.host.send(AllTodosResponse, await this.getAll());
        break;
      default:
        break;
    }
  }

  async includeBootstrap() {
    return {
      todos: await this.getAll(),
    };
  }

  getAll() {
    return this.container.todos.getAll();
  }
}
