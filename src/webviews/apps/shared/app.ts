import { CSSResultGroup, LitElement } from "lit";
import { applyAdoptableStyles } from "./utils/stylesheets";
import { property } from "lit/decorators.js";
import { getCodiconsFont } from "./styles/codicons.css";

export const DEFAULT_APP_TAG_NAME = "webview-app";

export class WebviewApp extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  protected sharedStyles: CSSResultGroup = [];

  @property({ type: Object })
  roots!: {
    root: string;
    webviewsRoot: string;
    webviewRoot: string;
  };

  override connectedCallback() {
    super.connectedCallback();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
  }

  override firstUpdated() {
    const sharedStyles = [
      this.sharedStyles,
      getCodiconsFont(this.roots.webviewsRoot),
    ];
    applyAdoptableStyles(document, sharedStyles);
  }
}
