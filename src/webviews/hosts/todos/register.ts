import type { Container } from '../../../container';
import { namespace } from '../../providers/todos/protocol';
import { TodosWebviewProvider } from '../../providers/todos/todos';
import type { WebviewHost } from '../host';
import type { WebviewRegistry } from '../registry';

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
