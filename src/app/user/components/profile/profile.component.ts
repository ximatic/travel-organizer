import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { InterpolationParameters, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay, Observable, of, Subscription } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';

import { userActions } from '../../store/user.actions';
import { selectUserEvent, selectUserProfile } from '../../store/user.selectors';
import { UserEvent, UserEventName, UserEventType, UserState } from '../../store/user.state';
import { UserProfile } from '../../models/user-profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    PasswordModule,
    ToastModule,
  ],
  providers: [TranslateService, MessageService],
})
export class ProfileComponent implements OnInit, OnDestroy {
  // ngrx
  userProfile$!: Observable<UserProfile | null>;
  userEvent$!: Observable<UserEvent | undefined>;

  // state flags
  isSubmitInProgress = false;

  // form
  profileForm!: FormGroup;

  // other
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private messageService: MessageService,
    private store: Store<UserState>,
  ) {}

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // controls

  get emailControl(): AbstractControl | null {
    return this.profileForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.profileForm.get('password');
  }

  get passwordRepeatControl(): AbstractControl | null {
    return this.profileForm.get('passwordRepeat');
  }

  get firstnameControl(): AbstractControl | null {
    return this.profileForm.get('firstname');
  }

  get lastnameControl(): AbstractControl | null {
    return this.profileForm.get('lastname');
  }

  // trip

  submitForm(): void {
    if (this.profileForm.invalid) {
      // TODO - show error?
      return;
    }

    this.isSubmitInProgress = true;
    // artificial delay to improve UX
    of({})
      .pipe(delay(DEFAULT_UX_DELAY))
      .subscribe(() => {
        this.store.dispatch(userActions.updateUserProfile({ userProfile: this.processFormValue() }));
      });
  }

  // initialization

  private init(): void {
    this.initForm();
    this.initState();
  }

  private initState(): void {
    this.userProfile$ = this.store.select(selectUserProfile);
    this.subscription.add(
      this.userProfile$.subscribe((profile: UserProfile | null) => {
        if (profile) {
          this.fillForm(profile);
        }
      }),
    );

    this.userEvent$ = this.store.select(selectUserEvent);
    this.subscription.add(this.userEvent$.subscribe((event: UserEvent | undefined) => this.handleUserEvent(event)));
  }

  private handleUserEvent(event: UserEvent | undefined): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case UserEventName.UpdateUserProfile:
        this.handleAuthEventUpdate(event);
        break;
    }
  }

  private handleAuthEventUpdate(event: UserEvent): void {
    switch (event.type) {
      case UserEventType.Success:
        this.showToastSuccess(event?.message);
        break;
      case UserEventType.Error:
        this.showToastError(event?.message);
        break;
    }
    this.isSubmitInProgress = false;
  }

  // form

  private processFormValue(): UserProfile {
    const { email, password, passwordRepeat, firstname, lastname } = this.profileForm.getRawValue();

    return {
      email,
      password,
      passwordRepeat,
      firstname,
      lastname,
    } as UserProfile;
  }

  private initForm(): void {
    this.profileForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
    });
  }

  private fillForm(profile: UserProfile): void {
    const { firstname, lastname } = profile;
    this.profileForm.patchValue({
      //email,
      firstname,
      lastname,
    });
  }

  // toasts

  private showToastSuccess(detail?: string) {
    this.showToast(
      'success',
      this.translateService.instant('EVENT.TYPE.SUCCESS'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`),
    );
  }

  private showToastError(detail?: string, detailsParams?: InterpolationParameters) {
    this.showToast(
      'error',
      this.translateService.instant('EVENT.TYPE.ERROR'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`, detailsParams),
    );
  }

  private showToast(severity: string, summary: string, detail?: string) {
    this.messageService.add({ severity, summary, detail, key: 'toast', life: 3000 });
  }
}
