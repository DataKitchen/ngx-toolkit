import { AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { TypedFormGroup } from '../typed-form/typed-forms';

export interface HasSearchForm<E extends { [key: string]: any }> {
  search: TypedFormGroup<E>;
  search$: Subject<E>;
}

export function hasSearchForm(c: unknown): c is HasSearchForm<any> {
  return (c as { [key: string]: any; })['search'] instanceof AbstractControl && (c as { [key: string]: any; })['search$'] instanceof Subject;
}
