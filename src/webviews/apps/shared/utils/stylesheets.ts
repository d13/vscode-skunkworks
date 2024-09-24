import { adoptStyles } from "lit";
import type { CSSResultGroup, CSSResultOrNative } from "lit";

export function applyAdoptableStyles(
  root: DocumentOrShadowRoot,
  styles: CSSResultGroup
): void {
  // Casting to ShadowRoot as a temporary fix for https://github.com/lit/lit/issues/3339
  adoptStyles(root as ShadowRoot, flattenResultGroup(styles));
}

export function flattenResultGroup(
  cssResults: CSSResultGroup
): CSSResultOrNative[] {
  if (!Array.isArray(cssResults)) {
    return [cssResults];
  }

  const flattened: CSSResultOrNative[] = [];
  for (const cssResult of cssResults) {
    if (!Array.isArray(cssResult)) {
      flattened.push(cssResult);
    } else {
      flattened.push(...flattenResultGroup(cssResult));
    }
  }
  return flattened;
}
