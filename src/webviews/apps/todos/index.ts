import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { DEFAULT_APP_TAG_NAME, WebviewApp } from "../shared/app";

@customElement(DEFAULT_APP_TAG_NAME)
export class TodosApp extends WebviewApp {
  override render() {
    return html` <h1>Hello World</h1> `;
  }
}
