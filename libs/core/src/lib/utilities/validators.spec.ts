import { FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CustomValidators } from './validators';

const names = [ 'name1', 'name2', 'name3' ];
const namesAsync = of(names);

describe('forbiddenNames', () => {
  const validator = CustomValidators.forbiddenNames(names);

  it('should return error, if list contains value', () => {
    names.forEach((name) => {
      const control = new FormControl(name);
      expect(validator(control)).toEqual({ nameExists: expect.anything() });
    });
  });

  it('should not return error, if list does not contain value', () => {
    const control = new FormControl('test-not-in-list');
    expect(validator(control)).toEqual(null);
  });

  it('should return null if control.value is null', () => {
    const control = new FormControl(null);
    expect(validator(control)).toEqual(null);
  });
});

describe('forbiddenNamesAsync', () => {
  const validator = CustomValidators.forbiddenNamesAsync(namesAsync);

  it('should return error, if list contains value', (done) => {
    const control = new FormControl(names[0]);
    const error$ = validator(control) as Observable<ValidationErrors>;

    error$.subscribe((value) => {
      expect(value).toEqual({ nameExists: expect.anything() });
      done();
    });
  });

  it('should not return error, if list does not contain value', (done) => {
    const control = new FormControl('not-in-list');
    const error$ = validator(control) as Observable<ValidationErrors>;

    error$.subscribe((value) => {
      expect(value).toEqual(null);
      done();
    });
  });
});
