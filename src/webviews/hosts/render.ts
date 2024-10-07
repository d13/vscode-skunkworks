import { getNonce } from '@env/crypto';
import type { Webview } from 'vscode';
import { Uri } from 'vscode';

import type { WebviewDescriptor } from './host';

export interface IncludeTokens<SerializedState> {
  bootstrap?: SerializedState;
  head?: string;
  body?: string;
  endOfBody?: string;
}

export interface RenderConfig<SerializedState> {
  webviewId: string;
  webviewInstanceId: string | undefined;
  placement: 'editor' | 'view';
  descriptor: WebviewDescriptor;
  html?: string;
  tokens?: IncludeTokens<SerializedState>;
}

export interface WebviewTokens<SerializedState> extends IncludeTokens<SerializedState> {
  webviewId: string;
  webviewInstanceId: string | undefined;
  cspSource: string;
  cspNonce: string;
  root: string;
  webviewsRoot: string;
  webviewRoot: string;
  placement: 'editor' | 'view';
}

export function getWebviewContent<SerializedState>(
  webview: Webview,
  extensionUri: Uri,
  config: RenderConfig<SerializedState>,
): string {
  const rootUri = webview.asWebviewUri(extensionUri);
  const webviewsRootPathUri = Uri.joinPath(extensionUri, 'dist', 'webviews');
  const webviewsRootUri = webview.asWebviewUri(webviewsRootPathUri);
  const webviewRootPathUri = Uri.joinPath(extensionUri, 'dist', 'webviews', config.descriptor.folderName);
  const webviewRootUri = webview.asWebviewUri(webviewRootPathUri);
  const cspSource = webview.cspSource;
  const cspNonce = getNonce();

  return getHtml(config.html, {
    webviewId: config.webviewId,
    webviewInstanceId: config.webviewInstanceId,
    cspSource,
    cspNonce,
    root: rootUri.toString(),
    webviewsRoot: webviewsRootUri.toString(),
    webviewRoot: webviewRootUri.toString(),
    placement: config.placement,
    ...config.tokens,
  } satisfies WebviewTokens<SerializedState>);
}

export function getHtml<SerializedState>(html?: string, tokens?: WebviewTokens<SerializedState>): string {
  function replaceTokens(html: string) {
    if (!tokens) {
      return html;
    }

    type ReplacementToken = keyof typeof tokens | 'roots';
    return html.replace(
      /#{(head|body|endOfBody|webviewId|webviewInstanceId|placement|cspSource|cspNonce|roots|root|webviewsRoot|webviewRoot|bootstrap)}/g,
      (_substring: string, token: ReplacementToken) => {
        switch (token) {
          case 'bootstrap':
            return tokens.bootstrap !== undefined ? JSON.stringify(tokens.bootstrap).replace(/"/g, '&quot;') : '';
          case 'roots':
            return JSON.stringify({
              root: tokens.root,
              webviewsRoot: tokens.webviewsRoot,
              webviewRoot: tokens.webviewRoot,
            }).replace(/"/g, '&quot;');
          default:
            return tokens[token] ?? '';
        }
      },
    );
  }

  if (html) {
    return replaceTokens(html);
  }

  return replaceTokens(`<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <!--
                Use a content security policy to only allow loading styles from our extension directory,
                and only allow scripts that have a specific nonce.
                (See the 'webview-sample' extension sample for img-src content security policy examples)
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src #{cspSource}; style-src #{cspSource}; script-src #{cspSource} 'nonce-#{cspNonce}';">

            <link href="#{webviewsRoot}/webview.css" rel="stylesheet">

            <script type="module" nonce="#{cspNonce}" src="#{webviewRoot}.js" defer></script>
        </head>
        <body class="preload">
            <webview-app roots="#{roots}" placement="#{placement}" bootstrap="#{bootstrap}"></webview-app>
        </body>
    </html>`);
}
