import type { Container } from '../../../container';
import type { IpcMessage } from '../../protocol';
import type { WebviewHost } from '../host';
import type { WebviewStateProviderHooks } from '../state-provider';
import { WebviewStateProvider } from '../state-provider';

import type { TodoState } from './protocol';

export class TodosWebviewProvider extends WebviewStateProvider implements WebviewStateProviderHooks<TodoState> {
  constructor(namespace: string, container: Container, host: WebviewHost) {
    super(namespace, container, host);

    console.log('TodosWebview');
  }

  onMessageReceived(e: IpcMessage) {
    console.log('TodosWebview', e);
  }

  async includeBootstrap() {
    return {
      todos: await this.container.todos.getAll(),
    };
  }
}
