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
import {
  DEFAULT_USER_DATE_FORMAT,
  DEFAULT_USER_LANGUAGE,
  DEFAULT_USER_THEME,
  DEFAULT_USER_TIME_FORMAT,
} from '../../constants/settings.constants';

import {
  UserSettings,
  UserSettingsDateFormat,
  UserSettingsLanguage,
  UserSettingsTheme,
  UserSettingsTimeFormat,
} from '../../models/user-settings.model';
import { userActions } from '../../store/user.actions';
import { selectUserEvent, selectUserSettings } from '../../store/user.selectors';
import { UserEvent, UserEventName, UserEventType, UserState } from '../../store/user.state';

export interface SettingsFormOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
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
  userSettings$!: Observable<UserSettings | null>;
  userEvent$!: Observable<UserEvent | undefined>;

  // settings
  settings?: UserSettings;

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
    private userStore: Store<UserState>,
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
        const userSettings = this.processFormValue();
        this.userStore.dispatch(userActions.updateUserSettings({ userSettings }));
      });
  }

  // initialization

  private init(): void {
    this.initForm();
  }

  private initFormOptions(): void {
    this.languages = Object.values(UserSettingsLanguage).map((value: string) => ({
      name: this.translateService.instant(`SETTINGS.FORM.LANGUAGE.OPTION.${value.toUpperCase()}`),
      code: value,
    }));
    this.dateFormats = Object.values(UserSettingsDateFormat).map((value: string) => ({ name: value.toLowerCase(), code: value }));
    this.timeFormats = Object.values(UserSettingsTimeFormat).map((value: string) => ({ name: value, code: value }));
    this.themes = Object.values(UserSettingsTheme).map((value: string) => ({
      name: this.translateService.instant(`SETTINGS.FORM.THEME.OPTION.${value.toUpperCase()}`),
      code: value,
    }));
  }

  private initState(): void {
    this.userSettings$ = this.userStore.select(selectUserSettings);
    this.subscription.add(
      this.userSettings$.subscribe((userSettings: UserSettings | null) => {
        if (!userSettings) {
          return;
        }
        this.settings = { ...userSettings };
        this.translateService.use(this.settings.language);
        this.translateService.get('APP.TITLE').subscribe(() => {
          this.initFormOptions();
        });
        this.fillForm();
        this.isSubmitInProgress = false;
      }),
    );

    this.userEvent$ = this.userStore.select(selectUserEvent);
    this.subscription.add(this.userEvent$.subscribe((userEvent: UserEvent | undefined) => this.handleUserEvent(userEvent)));
  }

  private handleUserEvent(userEvent: UserEvent | undefined): void {
    if (!userEvent) {
      return;
    }

    switch (userEvent?.name) {
      case UserEventName.UpdateUserSettings:
        this.handleUserEventUpdateUserSettings(userEvent);
        break;
    }
  }

  private handleUserEventUpdateUserSettings(userEvent: UserEvent): void {
    switch (userEvent.type) {
      case UserEventType.Success:
        this.showToastSuccess(userEvent?.message);
        break;
      case UserEventType.Error:
        this.showToastError(userEvent?.message);
        break;
    }
    this.isSubmitInProgress = false;
  }

  // form

  private processFormValue(): UserSettings {
    const { language, dateFormat, timeFormat, theme } = this.settingsForm.getRawValue();

    return {
      language,
      dateFormat,
      timeFormat,
      theme,
    } as UserSettings;
  }

  private initForm(): void {
    this.settingsForm = this.formBuilder.group({
      language: [DEFAULT_USER_LANGUAGE, Validators.required],
      dateFormat: [DEFAULT_USER_DATE_FORMAT, Validators.required],
      timeFormat: [DEFAULT_USER_TIME_FORMAT, Validators.required],
      theme: [DEFAULT_USER_THEME, Validators.required],
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
