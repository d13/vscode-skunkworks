export interface Disposable {
  dispose(): unknown;
}

export function disposableFrom(...disposables: Disposable[]): Disposable {
  return {
    dispose: () => {
      disposables.forEach((disposable) => disposable.dispose());
    },
  };
}
