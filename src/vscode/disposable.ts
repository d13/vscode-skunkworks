import type { Disposable } from 'vscode';

export const NO_OP_DISPOSABLE: Readonly<Disposable> = Object.freeze({ dispose: () => {} });
