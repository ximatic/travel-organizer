import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';

import { SettingsActionState, SettingsActionType, SettiongsActionName } from '../../store/settings.state';
import { selectSettings, selectSettingsActionState } from '../../store/settings.selectors';
import { settingsActions } from '../../store/settings.actions';
import { Settings, SettingsDateFormat, SettingsLanguage, SettingsTheme, SettingsTimeFormat } from '../../models/settings.model';
import { DEFAULT_DATE_FORMAT, DEFAULT_LANGUAGE, DEFAULT_THEME, DEFAULT_TIME_FORMAT } from '../../constants/settings.constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    SelectModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  // ngrx
  settings$!: Observable<Settings>;
  actionState$!: Observable<SettingsActionState | undefined>;

  // settings
  settings?: Settings;

  // form
  settingsForm!: FormGroup;

  // form options
  languages = Object.entries(SettingsLanguage).map(([key, value]) => ({ name: key, code: value }));
  dateFormats = Object.values(SettingsDateFormat).map((value: string) => ({ name: value.toLowerCase(), code: value }));
  timeFormats = Object.values(SettingsTimeFormat).map((value: string) => ({ name: value, code: value }));
  themes = Object.entries(SettingsTheme).map(([key, value]) => ({ name: key, code: value }));

  // other
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private store: Store<SettingsActionState>,
  ) {}

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

    const settings = this.processFormValue();
    this.store.dispatch(settingsActions.updateSettings({ settings }));
  }

  // initialization

  private init(): void {
    this.initForm();
  }

  private initState(): void {
    this.settings$ = this.store.select(selectSettings);
    this.subscription.add(
      this.settings$.subscribe((settings: Settings) => {
        this.settings = { ...settings };
        this.fillForm();
      }),
    );

    this.actionState$ = this.store.select(selectSettingsActionState);
    this.subscription.add(
      this.actionState$
        //.pipe(filter((actionState: SettingsActionState | undefined) => this.filterActionState(actionState)))
        .subscribe((actionState: SettingsActionState | undefined) => this.handleActionState(actionState)),
    );
  }

  // private filterActionState(actionState: SettingsActionState | undefined): boolean {
  //   return actionState?.name === SettiongsActionName.LoadSettings || actionState?.name === SettiongsActionName.UpdateSettings;
  // }

  private handleActionState(actionState: SettingsActionState | undefined): void {
    if (!actionState) {
      return;
    }

    switch (actionState?.name) {
      case SettiongsActionName.LoadSettings:
        this.handleLoadSettings(actionState);
        break;
      case SettiongsActionName.UpdateSettings:
        this.handleUpdateSettings(actionState);
        break;
    }
  }

  private handleLoadSettings(actionState: SettingsActionState): void {
    switch (actionState.type) {
      case SettingsActionType.Error:
        this.showToast('error', 'Error', actionState?.message);
        break;
    }
  }

  private handleUpdateSettings(actionState: SettingsActionState): void {
    switch (actionState.type) {
      case SettingsActionType.Success:
        this.showToast('success', 'Success', actionState?.message);
        break;
      case SettingsActionType.Error:
        this.showToast('error', 'Error', actionState?.message);
        break;
    }
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

  private showToast(severity: string, summary: string, detail?: string) {
    this.messageService.add({ severity, summary, detail, key: 'toast', life: 3000 });
  }
}
