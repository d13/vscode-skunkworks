export interface Disposable {
  dispose(): unknown;
}

export const NO_OP_DISPOSABLE: Readonly<Disposable> = Object.freeze({
  dispose: () => {},
});

export function toDisposable(dispose: () => unknown): Disposable {
  let disposed = false;

  return {
    dispose: () => {
      if (disposed) return;

      disposed = true;
      dispose();
    },
  };
}

export function disposableFrom(...disposables: Disposable[]): Disposable {
  let disposed = false;

  return {
    dispose: () => {
      if (disposed) return;

      disposed = true;
      disposables.forEach(disposable => disposable.dispose());
    },
  };
}
