// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
//
import type { Disposable, ExtensionContext } from 'vscode';

import { Container } from './container';
// import { registerWebviewPanel } from './webviews/hosts/register';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "skunkworks" is now active!');

  const disposables: Disposable[] = [];
  context.subscriptions.push(...disposables);

  const version: string = context.extension.packageJSON.version;
  const container = Container.create(context, version);

  // waiting for container to be fully loaded first
  await container.ready();
}

// This method is called when your extension is deactivated
export function deactivate() {
  Container.instance.deactivate();
}
