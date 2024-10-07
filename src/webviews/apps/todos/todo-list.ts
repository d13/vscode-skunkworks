import { consume } from '@lit/context';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import type { TodoState } from 'src/webviews/hosts/todos/protocol';

import { stateContext } from './state';
import '../shared/components/todos';

@customElement('todo-list')
export class TodoList extends LitElement {
  @consume({ context: stateContext })
  state?: TodoState;

  override render() {
    return html`<todo-items>
      ${this.state?.todos.map(todo => html`<todo-item .done=${todo.done}>${todo.label}</todo-item>`)}
    </todo-items>`;
  }
}
