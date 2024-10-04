import type { Container } from '../../../container';
import type { IpcMessage } from '../../protocol';
import type { WebviewHost } from '../host';
import { WebviewStateProvider } from '../state-provider';

export class TodosWebviewProvider extends WebviewStateProvider {
  constructor(container: Container, host: WebviewHost) {
    super(container, host);

    console.log('TodosWebview');
  }

  onMessageReceived(e: IpcMessage) {
    console.log('TodosWebview', e);
  }
}
