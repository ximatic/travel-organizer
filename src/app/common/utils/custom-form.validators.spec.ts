import { FormGroup, FormControl } from '@angular/forms';

import { valueMatchValidator } from './custom-form.validators';

describe('valueMatchValidator', () => {
  const password = 'password';
  const passwordRepeat = 'passwordRepeat';
  let formGroup: FormGroup;

  beforeEach(() => {
    formGroup = new FormGroup({
      [password]: new FormControl('', { validators: valueMatchValidator(passwordRepeat) }),
      [passwordRepeat]: new FormControl('', { validators: valueMatchValidator(password) }),
    });
  });

  it('should has valueMatch error if values do not match', () => {
    formGroup.patchValue({
      [password]: 'abc',
      [passwordRepeat]: 'cba',
    });
    formGroup.updateValueAndValidity();
    formGroup.get(password)?.updateValueAndValidity();
    formGroup.get(passwordRepeat)?.updateValueAndValidity();

    expect(formGroup.get(password)?.hasError('valueMatch')).toBe(true);
    expect(formGroup.get(password)?.invalid).toBe(true);
    expect(formGroup.get(passwordRepeat)?.hasError('valueMatch')).toBe(true);
    expect(formGroup.get(passwordRepeat)?.invalid).toBe(true);
  });

  it('should be valid if values match', () => {
    formGroup.patchValue({
      [password]: 'abc',
      [passwordRepeat]: 'abc',
    });
    formGroup.updateValueAndValidity();
    formGroup.get(password)?.updateValueAndValidity();
    formGroup.get(passwordRepeat)?.updateValueAndValidity();

    expect(formGroup.get(password)?.hasError('valueMatch')).toBe(false);
    expect(formGroup.get(password)?.invalid).toBe(false);
    expect(formGroup.get(passwordRepeat)?.hasError('valueMatch')).toBe(false);
    expect(formGroup.get(passwordRepeat)?.invalid).toBe(false);
  });
});
