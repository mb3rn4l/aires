import { Directive, Attribute } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appValidatorPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useClass: ValidatorPasswordDirective,
      multi: true
    }
  ]
})

export class ValidatorPasswordDirective implements Validator {

  constructor(@Attribute('appValidatorPassword') public PasswordControl: string) { }

  validate(c: FormControl) {
    const Password = c.root.get(this.PasswordControl);
    const ConfirmPassword = c;

    if (ConfirmPassword.value === null) {
      return null;
    }

    if (Password) {
      const subscription: Subscription = Password.valueChanges.subscribe(() => {
        ConfirmPassword.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return Password && Password.value !== ConfirmPassword.value ? { passwordMatchError: true } : null;
  }
}
