import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { namespace, type BootstrapState } from '../../hosts/todos/protocol';
import { DEFAULT_APP_TAG_NAME, WebviewApp } from '../shared/app';
import type { AppIpc } from '../shared/app-ipc';

import { TodoStateProvider } from './state';
// TODO move to app?
import '../vscode-community-ui-toolkit';
import './todo-list';

@customElement(DEFAULT_APP_TAG_NAME)
export class TodosApp extends WebviewApp<BootstrapState> {
  protected createStateProviders(ipc: AppIpc, bootstrap?: BootstrapState) {
    return new TodoStateProvider(this, ipc, bootstrap?.[namespace]);
  }

  override render() {
    return html`
      <h1><vscode-icon name="checklist"></vscode-icon> TODOs</h1>
      <todo-list></todo-list>
    `;
  }
}
