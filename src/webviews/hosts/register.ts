import { Webview, Uri, WebviewOptions, commands, window } from "vscode";
import { getNonce } from "../../env/crypto";

export function registerWebviewPanel(
  command: string,
  descriptor: WebviewDescriptor
) {
  function createWebview() {
    const panel = window.createWebviewPanel(descriptor.id, descriptor.title, {
      viewColumn: window.activeTextEditor?.viewColumn ?? 1,
      ...descriptor.webviewOptions,
    });
  }

  commands.registerCommand(command, () => createWebview());
}

export function registerWebviewView() {}

export interface WebviewDescriptor {
  id: string;
  folderName: string;
  title: string;
  webviewOptions?: WebviewOptions;
}

export interface IncludeTokens<SerializedState> {
  bootstrap?: SerializedState;
  head?: string;
  body?: string;
  endOfBody?: string;
}

export interface RenderConfig<SerializedState> {
  webviewId: string;
  webviewInstanceId: string | undefined;
  placement: "editor" | "view";
  descriptor: WebviewDescriptor;
  html?: string;
  tokens?: IncludeTokens<SerializedState>;
}

export interface WebviewTokens<SerializedState>
  extends IncludeTokens<SerializedState> {
  webviewId: string;
  webviewInstanceId: string | undefined;
  cspSource: string;
  cspNonce: string;
  root: string;
  webviewsRoot: string;
  webviewRoot: string;
  placement: "editor" | "view";
}

export function getWebviewContent<SerializedState>(
  webview: Webview,
  extensionUri: Uri,
  config: RenderConfig<SerializedState>
): string {
  const rootUri = webview.asWebviewUri(extensionUri);
  const webviewsRootPathUri = Uri.joinPath(extensionUri, "dist", "webviews");
  const webviewsRootUri = webview.asWebviewUri(webviewsRootPathUri);
  const webviewRootPathUri = Uri.joinPath(
    extensionUri,
    "dist",
    "webviews",
    config.descriptor.folderName
  );
  const webviewRootUri = webview.asWebviewUri(webviewRootPathUri);
  const cspSource = webview.cspSource;
  const cspNonce = getNonce();

  return getHtml(config.html, {
    webviewId: config.webviewId,
    webviewInstanceId: config?.webviewInstanceId,
    cspSource,
    cspNonce,
    root: rootUri.toString(),
    webviewsRoot: webviewsRootUri.toString(),
    webviewRoot: webviewRootUri.toString(),
    placement: config.placement,
    ...config?.tokens,
  } satisfies WebviewTokens<SerializedState>);
}

export function getHtml<SerializedState>(
  html?: string | undefined,
  tokens?: WebviewTokens<SerializedState>
): string {
  function replaceTokens(html: string) {
    if (!tokens) {
      return html;
    }

    return html.replace(
      /#{(head|body|endOfBody|webviewId|webviewInstanceId|placement|cspSource|cspNonce|root|webviewsRoot|webviewRoot|bootstrap)}/g,
      (_substring: string, token: keyof typeof tokens) => {
        switch (token) {
          case "bootstrap":
            return tokens.bootstrap !== undefined
              ? JSON.stringify(tokens.bootstrap).replace(/"/g, "&quot;")
              : "";
          default:
            return tokens[token] ?? "";
        }
      }
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
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src \${cspSource}; script-src 'nonce-\${cspNonce}';">

            <link href="\${webviewsRoot}/shared/vscode.css" rel="stylesheet">
        </head>
        <body class="preload">
            <webview-app state="\${bootstrap}"></webview-app>
            <script nonce="\${cspNonce}" src="\${webviewRoot}/index.js"></script>
        </body>
    </html>`);
}
