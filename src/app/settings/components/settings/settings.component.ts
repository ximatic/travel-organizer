import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay, Observable, of, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';

import { SettingsEvent, SettingsEventType, SettingsEventName, SettingsState } from '../../store/settings.state';
import { selectSettings, selectSettingsEvent } from '../../store/settings.selectors';
import { settingsActions } from '../../store/settings.actions';
import { Settings, SettingsDateFormat, SettingsLanguage, SettingsTheme, SettingsTimeFormat } from '../../models/settings.model';
import { DEFAULT_DATE_FORMAT, DEFAULT_LANGUAGE, DEFAULT_THEME, DEFAULT_TIME_FORMAT } from '../../constants/settings.constants';

export interface SettingsFormOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    SelectModule,
    ToastModule,
  ],
  providers: [TranslateService, MessageService],
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  // ngrx
  settings$!: Observable<Settings>;
  settingsEvent$!: Observable<SettingsEvent | undefined>;

  // settings
  settings?: Settings;

  // form
  settingsForm!: FormGroup;

  // state flags
  isSubmitInProgress = false;

  // form options
  languages: SettingsFormOption[] = [];
  dateFormats: SettingsFormOption[] = [];
  timeFormats: SettingsFormOption[] = [];
  themes: SettingsFormOption[] = [];

  // other
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private store: Store<SettingsState>,
  ) {
    this.initFormOptions();
  }

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  ngAfterViewInit(): void {
    this.initState();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // controls

  get nameControl(): AbstractControl | null {
    return this.settingsForm.get('name');
  }

  // settings

  submitSettings(): void {
    if (this.settingsForm.invalid) {
      // TODO - show error?
      return;
    }

    this.isSubmitInProgress = true;
    // artificial delay to improve UX
    of({})
      .pipe(delay(DEFAULT_UX_DELAY))
      .subscribe(() => {
        const settings = this.processFormValue();
        this.store.dispatch(settingsActions.updateSettings({ settings }));
      });
  }

  // initialization

  private init(): void {
    this.initForm();
  }

  private initFormOptions(): void {
    this.languages = Object.values(SettingsLanguage).map((value: string) => ({
      name: this.translateService.instant(`SETTINGS.FORM.LANGUAGE.OPTION.${value.toUpperCase()}`),
      code: value,
    }));
    this.dateFormats = Object.values(SettingsDateFormat).map((value: string) => ({ name: value.toLowerCase(), code: value }));
    this.timeFormats = Object.values(SettingsTimeFormat).map((value: string) => ({ name: value, code: value }));
    this.themes = Object.values(SettingsTheme).map((value: string) => ({
      name: this.translateService.instant(`SETTINGS.FORM.THEME.OPTION.${value.toUpperCase()}`),
      code: value,
    }));
  }

  private initState(): void {
    this.settings$ = this.store.select(selectSettings);
    this.subscription.add(
      this.settings$.subscribe((settings: Settings) => {
        this.settings = { ...settings };
        this.translateService.use(this.settings.language);
        this.translateService.get('APP.TITLE').subscribe(() => {
          this.initFormOptions();
        });
        this.fillForm();
        this.isSubmitInProgress = false;
      }),
    );

    this.settingsEvent$ = this.store.select(selectSettingsEvent);
    this.subscription.add(
      this.settingsEvent$.subscribe((settingsEvent: SettingsEvent | undefined) => this.handleSettingsEvent(settingsEvent)),
    );
  }

  private handleSettingsEvent(settingsEvent: SettingsEvent | undefined): void {
    if (!settingsEvent) {
      return;
    }

    switch (settingsEvent?.name) {
      case SettingsEventName.Load:
        this.handleSettingsEventLoad(settingsEvent);
        break;
      case SettingsEventName.Update:
        this.handleSettingsEventUpdate(settingsEvent);
        break;
    }
  }

  private handleSettingsEventLoad(settingsEvent: SettingsEvent): void {
    switch (settingsEvent.type) {
      case SettingsEventType.Error:
        this.showToastError(settingsEvent?.message);
        break;
    }
  }

  private handleSettingsEventUpdate(settingsEvent: SettingsEvent): void {
    switch (settingsEvent.type) {
      case SettingsEventType.Success:
        this.showToastSuccess(settingsEvent?.message);
        break;
      case SettingsEventType.Error:
        this.showToastError(settingsEvent?.message);
        break;
    }
    this.isSubmitInProgress = false;
  }

  // form

  private processFormValue(): Settings {
    const { language, dateFormat, timeFormat, theme } = this.settingsForm.getRawValue();
    const settings: Settings = {
      language,
      dateFormat,
      timeFormat,
      theme,
    };

    return settings;
  }

  private initForm(): void {
    this.settingsForm = this.formBuilder.group({
      language: [DEFAULT_LANGUAGE, Validators.required],
      dateFormat: [DEFAULT_DATE_FORMAT, Validators.required],
      timeFormat: [DEFAULT_TIME_FORMAT, Validators.required],
      theme: [DEFAULT_THEME, Validators.required],
    });
  }

  private fillForm(): void {
    if (this.settings) {
      const { language, dateFormat, timeFormat, theme } = this.settings;
      this.settingsForm.patchValue({
        language,
        dateFormat,
        timeFormat,
        theme,
      });
    }
  }

  // toasts

  private showToastSuccess(detail?: string) {
    this.showToast(
      'success',
      this.translateService.instant('EVENT.TYPE.SUCCESS'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`),
    );
  }

  private showToastError(detail?: string) {
    this.showToast(
      'error',
      this.translateService.instant('EVENT.TYPE.ERROR'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`),
    );
  }

  private showToast(severity: string, summary: string, detail?: string) {
    this.messageService.add({ severity, summary, detail, key: 'toast', life: 3000 });
  }
}
