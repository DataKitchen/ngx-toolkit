/* istanbul ignore file */
import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export type AbstractControlFields<T extends { [key: string]: any }> = {
  [key in keyof T]: AbstractControl | UntypedFormControl | UntypedFormGroup;
};

export class TypedFormGroup<T extends { [key: string]: any }> extends FormGroup {

  override value!: T;
  override valueChanges!: Observable<T>;
  override controls!: AbstractControlFields<T>;

  constructor(controls: AbstractControlFields<T>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  override patchValue(value: Partial<T>, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.patchValue(value, options);
  }

  override setValue(value: T, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.setValue(value, options);
  }
}

export class TypedFormArray<T extends any[]> extends FormArray {

  override value!: T;
  override valueChanges!: Observable<T>;

  constructor(controls: AbstractControl[], validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[], asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]) {
    super(controls, validatorOrOpts, asyncValidator);
  }

  override patchValue(value: T, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.patchValue(value, options);
  }

  override setValue(value: T, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.setValue(value, options);
  }
}

export class TypedFormControl<T> extends FormControl {

  override value!: T;
  override valueChanges!: Observable<T>;

  constructor(formState: any = null, validatorOrOpts?: ValidatorFn | AbstractControlOptions | ValidatorFn[], asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  override patchValue(value: T, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.patchValue(value, options);
  }

  override setValue(value: T, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.setValue(value, options);
  }
}
