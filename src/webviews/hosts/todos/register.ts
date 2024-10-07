import type { Container } from '../../../container';
import type { WebviewHost } from '../host';
import type { WebviewRegistry } from '../registry';

import { namespace } from './protocol';
import { TodosWebviewProvider } from './todosWebview';

export function registerTodosWebviewPanel(registry: WebviewRegistry) {
  return registry.registerWebviewPanel(
    'skunkworks.todos',
    {
      id: 'todos',
      folderName: 'todos',
      title: 'Todos',
    },
    async (container: Container, host: WebviewHost) => {
      return Promise.resolve([new TodosWebviewProvider(namespace, container, host)]);
    },
  );
}
