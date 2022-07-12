import {EventEmitter, Type} from "@angular/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IComponent = { [index: string]: EventEmitter<unknown> | any };
type KeysMatching<T extends { [index: string]: EventEmitter<unknown> | unknown }, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export type OutputKeys<LAZY_COMPONENT extends IComponent> = KeysMatching<LAZY_COMPONENT, EventEmitter<unknown>>;

export class LazyComponentCreator<LAZY_COMPONENT extends IComponent> {
  constructor(
    private lazyComponent: {
      component: () => Promise<Type<LAZY_COMPONENT>>;
      outputs?: {
        [index in OutputKeys<LAZY_COMPONENT>]?: LAZY_COMPONENT[index]['emit'];
      };
    },
  ) {
  }

  outputs = this.lazyComponent.outputs;

  async component() {
    return await this.lazyComponent.component();
  }
}
