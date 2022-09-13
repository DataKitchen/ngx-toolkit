import { AbstractControl, AsyncValidatorFn, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { first, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CustomValidators extends Validators {
  static emails(separator = ','): ValidatorFn {
    return (control: AbstractControl) => {
      const emails = control.value?.split(separator) || [];

      for (const email of emails) {

        if (email.length > 0 && Validators.email(new FormControl(email.trim())) !== null) {
          return {
            email: true,
          };
        }
      }

      return null;
    };
  }

  static forbiddenNames(names: string[]): ValidatorFn {
    return (control: AbstractControl) => {
      return !control.value ? null : names.map(name => name.toLowerCase()).includes(control.value.toLowerCase()) ? { nameExists: true } : null;
    };
  }

  static forbiddenNamesAsync(names$: Observable<string[]>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ nameExists: boolean } | null> => {
      return names$.pipe(
        map(names => {

          if (names.includes(control.value)) {

            return { nameExists: true };
          }

          return null;
        }),
        // observable must be finite https://angular.io/guide/form-validation#creating-asynchronous-validators
        first(),
      );
    };
  }
}
