/**
 * Represents a type which can release resources, such
 * as event listening or a timer.
 */
export interface Disposable {
  /**
   * Function to clean up resources.
   */
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
