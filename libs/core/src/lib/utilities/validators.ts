import { AbstractControl } from '@angular/forms';

export class CustomValidators {
  static forbiddenNames(names: string[]) {
    return (control: AbstractControl) => {
      return !control.value ? null : names.map(name => name.toLowerCase()).includes(control.value.toLowerCase()) ? { nameExists: true } : null;
    };
  }
}
