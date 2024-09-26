import type { Event } from 'vscode';
import { EventEmitter } from 'vscode';

export class Container {
  static #instance: Container | undefined;
  static #proxy = new Proxy<Container>({} as Container, {
    get: function (target, prop: keyof Container) {
      // In case anyone has cached this instance

      if (Container.#instance !== undefined) {
        return Container.#instance[prop];
      }

      // Allow access to config before we are initialized
      //   if (prop === "config") {
      //     return configuration.getAll();
      //   }

      // debugger;
      throw new Error('Container is not initialized');
    },
  });

  static create() {
    if (Container.#instance !== undefined) {
      throw new Error('Container already created');
    }
    Container.#instance = new Container();
    return Container.#instance;
  }

  static get instance() {
    return Container.#instance ?? Container.#proxy;
  }

  private _onReady: EventEmitter<void> = new EventEmitter<void>();
  get onReady(): Event<void> {
    return this._onReady.event;
  }

  // constructor() {}
}
