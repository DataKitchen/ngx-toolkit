import { Component, EventEmitter } from '@angular/core';
import { Class } from 'utility-types';

export function MockComponent({selector, inputs, outputs}: Component): Class<any> {

  return Component({
    template: `mock-${selector}-mock`,
    selector,
    inputs,
    outputs,
  })(class {
    constructor() {
      for (const output of outputs || []) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[output] = new EventEmitter();
      }
    }
  });
}
