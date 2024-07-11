import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asPureFunction',
  standalone: true,
})
export class AsPureFunctionPipe implements PipeTransform {
  transform<V, T extends Array<unknown>, R>(
    value: V,
    f: (value: V, ...args: T) => R,
    ...args: T
  ): R {
    return f(value, ...args);
  }
}
