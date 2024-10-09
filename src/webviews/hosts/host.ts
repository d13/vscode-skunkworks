import type { Webview, WebviewOptions, WebviewPanel, WebviewView } from 'vscode';
import { Disposable, EventEmitter } from 'vscode';

import type { Container } from '../../container';
import { asyncReduce } from '../../system/array';
import type { IpcCall, IpcMessage } from '../providers/protocol';
import type { WebviewStateProvider, WebviewStateProviderHooks } from '../providers/state-provider';

import { getWebviewContent } from './render';

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

export class WebviewHost<
  BootstrapState = Record<string, unknown>,
  StateProvider extends WebviewStateProvider & WebviewStateProviderHooks = WebviewStateProvider &
    WebviewStateProviderHooks,
> implements Disposable
{
  static async create<
    BootstrapState = Record<string, unknown>,
    StateProvider extends WebviewStateProvider & WebviewStateProviderHooks = WebviewStateProvider &
      WebviewStateProviderHooks,
  >(
    container: Container,
    descriptor: WebviewDescriptor,
    parent: WebviewPanel | WebviewView,
    createStateProviders: (container: Container, host: WebviewHost) => Promise<StateProvider[]>,
  ): Promise<WebviewHost> {
    const host = new WebviewHost<BootstrapState>(container, descriptor, parent, createStateProviders);
    return host.initializing.then(() => host);
  }

  private readonly id: string;
  private readonly webview: Webview;
  private _isInEditor: boolean;
  private readonly _originalTitle: string;
  private stateProviders!: StateProvider[];

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
    createStateProviders: (container: Container, host: WebviewHost) => Promise<StateProvider[]>,
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

  async send<T extends IpcCall<unknown>, P = unknown>(ipcCall: T, params?: P) {
    return this.postMessage({
      id: `${Date.now()}`,
      scope: ipcCall.scope,
      method: ipcCall.method,
      params,
    });
  }

  private async postMessage(message: IpcMessage): Promise<boolean> {
    return this.webview.postMessage(message).then(
      success => success,
      () => false,
    );
  }

  private async render() {
    const bootstrapState = (await asyncReduce(
      this.stateProviders,
      async (state, provider) => {
        if (provider.includeBootstrap) {
          // FIXME: this is a hack to get the type assertion to work
          (state as Record<string, unknown>)[provider.namespace] = await provider.includeBootstrap();
        }

        return state;
      },
      {} as BootstrapState,
    )) as BootstrapState;

    this.webview.html = getWebviewContent<BootstrapState>(this.webview, this.extensionUri, {
      webviewId: this.id,
      webviewInstanceId: undefined,
      placement: this.isView ? 'view' : 'editor',
      descriptor: this.descriptor,
      tokens: {
        bootstrap: bootstrapState,
      },
    });
  }

  show() {
    void this.render();

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
