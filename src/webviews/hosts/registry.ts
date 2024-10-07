import { Disposable, commands, window } from 'vscode';

import type { Container } from '../../container';

import type { WebviewDescriptor } from './host';
import { WebviewHost } from './host';
import type { WebviewStateProvider } from './state-provider';

export class WebviewRegistry implements Disposable {
  private readonly _panels = new Map<string, Disposable>();

  constructor(private readonly container: Container) {}

  registerWebviewPanel<BootstrapState = unknown>(
    command: string,
    descriptor: WebviewDescriptor,
    createStateProviders: (container: Container, host: WebviewHost) => Promise<WebviewStateProvider[]>,
  ): WebviewHost {
    let host: WebviewHost<BootstrapState> | undefined;
    const createWebview = async () => {
      const panel = window.createWebviewPanel(
        descriptor.id,
        descriptor.title,
        {
          viewColumn: window.activeTextEditor?.viewColumn ?? 1,
        },
        {
          enableScripts: true,
          ...descriptor.webviewOptions,
        },
      );

      host = await WebviewHost.create<BootstrapState>(this.container, descriptor, panel, createStateProviders);

      // handle deleting the panel
      this._panels.set(
        descriptor.id,
        Disposable.from(
          host.onDidDispose(() => {
            this._panels.delete(descriptor.id);
          }),
          host,
          panel,
        ),
      );

      host.show();
    };

    // TODO need a more robust way to handle this
    const commandDisposable = commands.registerCommand(command, () => createWebview());

    return new Proxy<WebviewHost>({} as WebviewHost, {
      get: function (_target, prop: keyof WebviewHost) {
        if (prop === 'dispose') {
          return () => {
            commandDisposable.dispose();
            host?.dispose();
          };
        }
        return host?.[prop];
      },
    });
  }

  dispose() {
    this._panels.forEach(panel => void panel.dispose());
    this._panels.clear();
  }
}
