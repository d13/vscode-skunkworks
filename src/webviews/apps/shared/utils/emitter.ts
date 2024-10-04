import type { EventEmitter as VSCodeEventEmitter } from 'vscode';

import type { Disposable } from './disposable';
import { NO_OP_DISPOSABLE, toDisposable } from './disposable';

/**
 * An event emitter that manages a single event type.
 *
 * @template T The type of event data.
 */
export class EventEmitter<T> implements VSCodeEventEmitter<T> {
  static readonly eventName = 'emitterChange';

  private _eventTarget?: EventTarget;
  private _disposed = false;
  private _listeners?: Set<Disposable>;

  /**
   * Registers an event listener.
   *
   * @param listener The function to be called when the event is fired.
   * @param thisArgs The `this` context to use when calling the listener.
   * @param disposables An optional array of disposables to which the returned disposable will be added.
   * @returns A disposable object that can be used to remove the listener.
   */
  event(listener: (e: T) => unknown, thisArgs?: unknown, disposables?: Disposable[]): Disposable {
    if (this._disposed) return NO_OP_DISPOSABLE as Disposable;

    this._listeners ??= new Set();
    this._eventTarget ??= new EventTarget();

    const handler = (e: Event) => {
      try {
        listener.call(thisArgs, (e as CustomEvent<T>).detail);
      } catch (error) {
        console.error('Error in event listener:', error);
        // debugger;
      }
    };

    this._eventTarget.addEventListener(EventEmitter.eventName, handler);

    const dispose = toDisposable(() => {
      this._eventTarget?.removeEventListener(EventEmitter.eventName, handler);
      this._listeners?.delete(dispose);
    });

    disposables?.push(dispose);
    this._listeners.add(dispose);

    return dispose;
  }

  /**
   * Fires the event, notifying all registered listeners.
   *
   * @param data The event data to be passed to listeners.
   */
  fire(data: T): void {
    if (this._disposed) return;

    this._eventTarget?.dispatchEvent(new CustomEvent('change', { detail: data }));
  }

  /**
   * Disposes of the emitter, removing all listeners and freeing resources.
   */
  dispose() {
    if (this._disposed) return;

    this._disposed = true;
    this._eventTarget = undefined;
    if (this._listeners) {
      this._listeners.forEach(disposable => disposable.dispose());
      this._listeners.clear();
    }
  }
}
