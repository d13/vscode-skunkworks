import { LitElement } from "lit";
import type { Disposable } from "../utils/disposable";

export class BaseElement extends LitElement {
  protected disposables: Disposable[] = [];

  override disconnectedCallback() {
    super.disconnectedCallback();

    this.disposables.forEach((disposable) => disposable.dispose());
  }
}
