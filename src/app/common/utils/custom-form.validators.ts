import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

export function valueMatchValidator(controlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const otherControl = control.parent?.get(controlName);
    if (!control.parent || !otherControl || !otherControl.value) {
      return null;
    }

    return control.value === otherControl.value ? null : { valueMatch: true };
  };
}
