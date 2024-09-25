import { CSSResultGroup } from "lit";
import { applyAdoptableStyles } from "./utils/stylesheets";
import { property } from "lit/decorators.js";
import { getCodiconsFont } from "./styles/codicons.css";
import { BaseElement } from "./components/base-element";
import type { Disposable } from "./utils/disposable";

export const DEFAULT_APP_TAG_NAME = "webview-app";

export abstract class WebviewApp<SerializedState> extends BaseElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...BaseElement.shadowRootOptions,
    delegatesFocus: true,
  };
  protected sharedStyles: CSSResultGroup = [];

  @property({ type: String })
  placement: "editor" | "view" = "editor";

  @property({ type: Object })
  roots!: {
    root: string;
    webviewsRoot: string;
    webviewRoot: string;
  };

  @property({ type: Object })
  bootstrap?: SerializedState;

  protected abstract createStateProviders(
    bootstrap?: SerializedState
  ): Disposable;

  override connectedCallback() {
    super.connectedCallback();

    this.disposables.push(this.createStateProviders(this.bootstrap));

    if (document.body.classList.contains("preload")) {
      window.requestAnimationFrame(() => {
        document.body.classList.remove("preload");
      });
    }
  }

  override firstUpdated() {
    const sharedStyles = [
      this.sharedStyles,
      getCodiconsFont(this.roots.webviewsRoot),
    ];
    applyAdoptableStyles(document, sharedStyles);
  }
}
