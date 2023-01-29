import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  distinctUntilChanged,
  filter,
  finalize,
  Subject,
  takeUntil,
  delay,
} from 'rxjs';
import {
  QUERY_TYPE,
  ReportTypes,
  wordValidationRegex,
} from './constants/constants';
import { IBLRequest, IBLResponse } from './models/models';
import { DataService } from './services/data.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading = false;
  response: IBLResponse | null;

  private _destroy$ = new Subject();

  constructor(
    @Inject(FormBuilder) private readonly _fb: FormBuilder,
    @Inject(DataService) private readonly _dataService: DataService
  ) {
    this._initForm();
  }

  ngOnInit() {
    this._initValueChanges();
  }

  ngOnDestroy() {
    this._destroy$.next(true);
    this._destroy$.complete();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    console.log(this.form);
    if (this.form.valid) {
      this._sendBriefing();
    }
  }

  onResetForm() {
    this.form.reset();
    this.response = null;
  }

  get countriesControl() {
    return this.form && this.form.get('countries');
  }

  get stationsControl() {
    return this.form && this.form.get('stations');
  }

  get countriesOrStations() {
    return this.stationsControl.value || this.countriesControl.value;
  }

  get messageTypesControl() {
    return this.form && this.form.get('messageTypes');
  }

  get metarControl() {
    return this.messageTypesControl && this.messageTypesControl.get('metar');
  }

  get sigmetControl() {
    return this.messageTypesControl && this.messageTypesControl.get('sigmet');
  }

  get tafControl() {
    return this.messageTypesControl && this.messageTypesControl.get('taf');
  }

  private _initValueChanges() {
    // this uppercase could be done by directive
    this.stationsControl.valueChanges
      .pipe(
        filter((value) => value !== null),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe((value) => {
        this.stationsControl &&
          this.stationsControl.setValue(value.toUpperCase());
      });

    // this uppercase could be done by directive
    this.countriesControl.valueChanges
      .pipe(
        filter((value) => value !== null),
        distinctUntilChanged(),
        takeUntil(this._destroy$)
      )
      .subscribe((value) => {
        this.countriesControl &&
          this.countriesControl.setValue(value.toUpperCase());
      });
  }

  private _getMessageTypesAsString() {
    let arrayOfMessageTypes = [];
    if (this.tafControl.value) {
      arrayOfMessageTypes.push(ReportTypes.TAF);
    }
    if (this.metarControl.value) {
      arrayOfMessageTypes.push(ReportTypes.METAR);
    }
    if (this.sigmetControl.value) {
      arrayOfMessageTypes.push(ReportTypes.SIGMET);
    }
    return arrayOfMessageTypes;
  }

  private _sendBriefing() {
    console.log('brief', this._createBriefingRequest());
    this._setFormState(false);

    this._dataService
      .postData(this._createBriefingRequest())
      .pipe(
        //delay(3000),
        finalize(() => this._setFormState(true)),
        takeUntil(this._destroy$)
      )
      .subscribe((response) => {
        console.log(response);
        this.response = response
      });
  }

  private _setFormState(enable: boolean) {
    this.isLoading = !enable;
    enable ? this.form.enable() : this.form.disable();
  }

  private _createBriefingRequest(): IBLRequest {
    const id = Date.now().toString();
    return Object.freeze({
      id,
      method: QUERY_TYPE,
      params: [
        {
          id,
          countries: this._splitStringToArray(this.countriesControl.value),
          stations: this._splitStringToArray(this.stationsControl.value),
          reportTypes: this._getMessageTypesAsString(),
        },
      ],
    });
  }

  private _splitStringToArray(stringToBeSplitted: string) {
    return stringToBeSplitted ? stringToBeSplitted.split(' ') : [];
  }

  private _initForm() {
    this.form = this._fb.group({
      messageTypes: this._fb.group(
        {
          metar: [false],
          sigmet: [false],
          taf: [false],
        },
        { validator: this._atLeastOneCheckboxCheckedValidator() }
      ),
      stations: [
        null,
        [Validators.pattern(wordValidationRegex), this._wordValidator],
      ],
      countries: [
        null,
        [Validators.pattern(wordValidationRegex), this._wordValidator],
      ],
    });
  }

  private _atLeastOneCheckboxCheckedValidator(): ValidatorFn {
    return (group: FormGroup): { [key: string]: boolean } | null => {
      const result = Object.keys(group.controls).some(
        (key) => group.get(key).value
      );
      return result ? null : { atLeastOneCheckedCheckboox: true };
    };
  }

  private _wordValidator(control: FormControl) {
    if (control.value !== '' && control.value !== null) {
      return wordValidationRegex.test(control.value)
        ? null
        : { invalidWords: true };
    }
  }
}
