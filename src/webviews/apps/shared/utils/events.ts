import type { Disposable} from './disposable';
import { toDisposable } from './disposable';

// References:
// https://github.com/d13/d13.github.io/blob/main/src/system/events.ts
// https://github.com/gitkraken/vscode-gitlens/blob/main/src/webviews/apps/shared/dom.ts

export function on<K extends keyof WindowEventMap>(
  element: Window,
  name: K,
  listener: (e: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): Disposable;
export function on<K extends keyof DocumentEventMap>(
  element: Document,
  name: K,
  listener: (e: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): Disposable;
export function on<K extends keyof ElementEventMap>(
  element: Element,
  name: K,
  listener: (e: ElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
): Disposable;
export function on<K extends keyof (ElementEventMap | DocumentEventMap | WindowEventMap)>(
  element: Element | Document | Window,
  name: K,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): Disposable {
  options ??= false;
  element.addEventListener(name, listener, options);

  return toDisposable(() => {
    element.removeEventListener(name, listener, options);
  });
}

export function delegateOn<T extends HTMLElement, K extends keyof ElementEventMap>(
  element: Element,
  selector: string,
  name: K,
  listener: (e: ElementEventMap[K], target: T) => void,
  options?: boolean | AddEventListenerOptions,
): Disposable {
  const delegateListener = (e: ElementEventMap[K]) => {
    const target: T | null | undefined = (e.target as HTMLElement | null)?.closest(selector);
    if (!target) {
      return;
    }

    listener(e, target);
  };

  return on(element, name, delegateListener, options ?? true);
}
