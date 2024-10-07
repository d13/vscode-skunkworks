import type { Disposable } from 'vscode';

import type { Container } from '../container';

export class TodoService implements Disposable {
  constructor(private readonly container: Container) {}

  async getAll() {
    return Promise.resolve([{ label: 'Hello World', done: false }]);
  }

  dispose() {}
}
