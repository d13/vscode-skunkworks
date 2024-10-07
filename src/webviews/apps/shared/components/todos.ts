import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('todo-item')
export class TodoItem extends LitElement {
  @property({ type: Boolean, reflect: true })
  done = false;

  override render() {
    return html`<li>
      <input id="control" type="checkbox" ?checked=${this.done} />
      <label for="control"><slot></slot></label>
    </li>`;
  }
}

@customElement('todo-items')
export class TodoItems extends LitElement {
  override render() {
    return html`<div role="group">
      <ul>
        <slot></slot>
      </ul>
    </div>`;
  }
}
