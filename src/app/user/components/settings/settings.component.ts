import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

import { ToastHandlerComponent } from '../../../common/components/toast-handler/toast-handler.component';

export interface SettingsFormOption {
  name: string;
  code: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class SettingsComponent extends ToastHandlerComponent implements OnInit, AfterViewInit, OnDestroy {
  // ngrx
  userSettings$!: Observable<UserSettings | null>;
  userEvent$!: Observable<UserEvent | undefined>;

  // form
  settingsForm!: FormGroup;

  // state flags
  isSubmitInProgress = signal(false);

  // form options
  languages: SettingsFormOption[] = [];
  dateFormats: SettingsFormOption[] = [];
  timeFormats: SettingsFormOption[] = [];
  themes: SettingsFormOption[] = [];

  // other
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private userStore: Store<UserState>,
  ) {
    super();
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

  // settings

  submitSettings(): void {
    if (this.settingsForm.invalid) {
      // TODO - show error?
      return;
    }

    this.isSubmitInProgress.set(true);
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
        this.translateService.use(userSettings.language);
        this.translateService.get('APP.TITLE').subscribe(() => {
          this.initFormOptions();
        });
        this.fillForm(userSettings);
        this.isSubmitInProgress.set(false);
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
    this.isSubmitInProgress.set(false);
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

  private fillForm(settings: UserSettings): void {
    const { language, dateFormat, timeFormat, theme } = settings;
    this.settingsForm.patchValue({
      language,
      dateFormat,
      timeFormat,
      theme,
    });
  }
}
