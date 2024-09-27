import { LitElement } from 'lit';

import type { Disposable } from '../utils/disposable';

type CustomEventTypesInElementEventMap = {
  [K in keyof ElementEventMap]: ElementEventMap[K] extends CustomEvent<infer D> ? D : never;
};

export class BaseElement extends LitElement {
  protected disposables: Disposable[] = [];

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.disposables.forEach(disposable => disposable.dispose());
  }

  emit<K extends keyof CustomEventTypesInElementEventMap>(
    name: K,
    detail?: CustomEventTypesInElementEventMap[K],
    options?: Omit<CustomEventInit<CustomEventTypesInElementEventMap[K]>, 'detail'>,
  ): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        cancelable: false,
        composed: true,
        ...options,
        detail,
      }),
    );
  }
}
