import type { Webview, WebviewOptions, WebviewPanel, WebviewView } from 'vscode';
import { Disposable, EventEmitter } from 'vscode';

import type { Container } from '../../container';
import type { IpcMessage } from '../protocol';

import { getWebviewContent } from './render';
import type { WebviewStateProvider } from './state-provider';

export interface WebviewDescriptorBase {
  id: string;
  folderName: string;
  title: string;
  webviewOptions?: WebviewOptions;
}

export interface WebviewPanelDescriptor extends WebviewDescriptorBase {
  type: 'panel';
  // TODO add panel-specific options
}

export interface WebviewViewDescriptor extends WebviewDescriptorBase {
  type: 'view';
  // TODO add view-specific options
}

// TODO: remove WebviewDescriptorBase
export type WebviewDescriptor = WebviewPanelDescriptor | WebviewViewDescriptor | WebviewDescriptorBase;

export class WebviewHost {
  static async create(
    container: Container,
    descriptor: WebviewDescriptor,
    parent: WebviewPanel | WebviewView,
    createStateProviders: (container: Container, host: WebviewHost) => Promise<WebviewStateProvider[]>,
  ): Promise<WebviewHost> {
    const host = new WebviewHost(container, descriptor, parent, createStateProviders);
    return host.initializing.then(() => host);
  }

  private readonly id: string;
  private readonly webview: Webview;
  private _isInEditor: boolean;
  private readonly _originalTitle: string;
  private stateProviders!: WebviewStateProvider[];

  private readonly _onDidDispose = new EventEmitter<void>();
  get onDidDispose() {
    return this._onDidDispose.event;
  }

  private _onRecieveMessage = new EventEmitter<IpcMessage>();
  get onRecieveMessage() {
    return this._onRecieveMessage.event;
  }

  private _disposed = false;
  private disposable: Disposable | undefined;
  private _initializing: Promise<void>;
  get initializing() {
    return this._initializing;
  }

  private constructor(
    private readonly container: Container,
    private readonly descriptor: WebviewDescriptor,
    public readonly parent: WebviewPanel | WebviewView,
    createStateProviders: (container: Container, host: WebviewHost) => Promise<WebviewStateProvider[]>,
  ) {
    this.id = descriptor.id;
    this.webview = parent.webview;

    const isInEditor = 'onDidChangeViewState' in parent;
    this._isInEditor = isInEditor;

    this._originalTitle = descriptor.title;
    parent.title = descriptor.title;

    this._initializing = createStateProviders(container, this).then(stateProviders => {
      this.stateProviders = stateProviders;
      if (this._disposed) {
        this.stateProviders.forEach(stateProvider => stateProvider.dispose());
        return;
      }
      this.disposable = Disposable.from(
        parent.onDidDispose(this.onParentDisposed, this),
        parent.webview.onDidReceiveMessage(this.onMessageRecieved, this),
      );
    });
  }

  get isView() {
    return !this._isInEditor;
  }

  get isEditor() {
    return this._isInEditor;
  }

  get extensionUri() {
    return this.container.context.extensionUri;
  }

  private onMessageRecieved(e: IpcMessage) {
    this._onRecieveMessage.fire(e);
  }

  private notify() {}

  private async postMessage(message: IpcMessage): Promise<boolean> {
    return this.webview.postMessage(message).then(
      success => success,
      () => false,
    );
  }

  private render() {
    this.webview.html = getWebviewContent(this.webview, this.extensionUri, {
      webviewId: this.id,
      webviewInstanceId: undefined,
      placement: this.isView ? 'view' : 'editor',
      descriptor: this.descriptor,
    });
  }

  show() {
    this.render();

    if (this.isEditor) {
      (this.parent as WebviewPanel).reveal();
    }
  }

  private onParentDisposed() {
    this.dispose();
  }

  dispose() {
    this._disposed = true;
    this.disposable?.dispose();
  }
}
