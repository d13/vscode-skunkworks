import { css } from "lit";

export const screenReaderOnly = css`
  .h-sr-only,
  .h-sr-only-focusable:not(:focus):not(:active) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;
