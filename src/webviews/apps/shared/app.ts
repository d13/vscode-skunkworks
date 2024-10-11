import { provide } from '@lit/context';
import type { CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';

import { ipcContext, AppIpc } from './app-ipc';
import { BaseElement } from './components/base-element';
import { getCodiconsFont } from './styles/codicons.css';
import type { Disposable } from './utils/disposable';
import { applyAdoptableStyles } from './utils/stylesheets';

export const DEFAULT_APP_TAG_NAME = 'webview-app';

export abstract class WebviewApp<SerializedState = unknown> extends BaseElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...BaseElement.shadowRootOptions,
    delegatesFocus: true,
  };
  protected sharedStyles: CSSResultGroup = [];

  @property({ type: String })
  name!: string;

  @property({ type: String, attribute: 'webview-placement' })
  placement: 'editor' | 'view' = 'editor';

  @property({ type: Object })
  roots!: {
    root: string;
    webviewsRoot: string;
    webviewRoot: string;
  };

  @property({ type: Object })
  bootstrap?: SerializedState;

  @provide({ context: ipcContext })
  protected _ipc!: AppIpc;

  protected abstract createStateProviders(ipc: AppIpc, bootstrap?: SerializedState): Disposable;

  override connectedCallback() {
    super.connectedCallback();

    this._ipc = new AppIpc(this.name);
    this.disposables.push(this.createStateProviders(this._ipc, this.bootstrap));

    if (document.body.classList.contains('preload')) {
      window.requestAnimationFrame(() => {
        document.body.classList.remove('preload');
      });
    }
  }

  override firstUpdated() {
    const sharedStyles = [this.sharedStyles, getCodiconsFont(this.roots.webviewsRoot)];
    applyAdoptableStyles(document, sharedStyles);
  }
}
