import { AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class CustomValidators extends Validators {
  static forbiddenNames(names: string[]) {
    return (control: AbstractControl) => {
      return !control.value ? null : names.map(name => name.toLowerCase()).includes(control.value.toLowerCase()) ? { nameExists: true } : null;
    };
  }

  static forbiddenNamesAsync(observable: Observable<any[]>) {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return observable.pipe(
        map(names => {
          if (names.includes(control?.value)) {
            return { nameExists: true };
          }

          return null;
        })
      );
    };
  }
}
