import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public form: FormGroup;

  constructor(@Inject(FormBuilder) private readonly _fb: FormBuilder) {
    this._initForm();
  }

  ngOnInit(): void {}

  onSubmit() {
    this.form.get('messageTypes').markAsTouched();
    this.form.get('messageTypes').updateValueAndValidity();

    this.form.get('messageTypes').get('taf').markAsTouched();
    this.form.get('messageTypes').get('taf').updateValueAndValidity();

    this.form.get('messageTypes').get('sigmet').markAsTouched();
    this.form.get('messageTypes').get('sigmet').updateValueAndValidity();

    this.form.get('messageTypes').get('metar').markAsTouched();
    this.form.get('messageTypes').get('metar').updateValueAndValidity();

    console.log(this.form);
    if (this.form.valid) {
      // Form is valid, do something with the data
    }
  }

  private _initForm() {
    this.form = this._fb.group({
      messageTypes: this._fb.group(
        {
          metar: [null],
          sigmet: [null],
          taf: [null],
        },
        { validator: this._atLeastOneCheckboxCheckedValidator() }
      ),
    });
  }

  private _atLeastOneCheckboxCheckedValidator(): ValidatorFn {
    return (group: FormGroup): { [key: string]: boolean } | null => {
      const result = Object.keys(group.controls).some(
        (key) => group.get(key).value
      );
      console.log(result ? false :  true );
      return result ? null : { atLeastOneCheckedCheckboox: true };
    };
  }

}
