import { css, unsafeCSS } from 'lit';

export function getCodiconsFont(pathToFont: string) {
  const path = unsafeCSS(pathToFont);

  return css`
    @font-face {
      font-family: 'codicon';
      font-display: block;
      src: url('${path}/codicon.ttf?38dcd33a732ebca5a557e04831e9e235') format('truetype');
    }
  `;
}
