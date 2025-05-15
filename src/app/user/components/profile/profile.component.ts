import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
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
import { selectUserData, selectUserEvent } from '../../store/user.selectors';
import { UserEvent, UserEventName, UserEventType, UserState } from '../../store/user.state';

import { UserProfile } from '../../models/user-profile.model';
import { UserData, UserPassword } from '../../models/user.model';

import { ToastHandlerComponent } from '../../../common/components/toast-handler/toast-handler.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
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
export class ProfileComponent extends ToastHandlerComponent implements OnInit, OnDestroy {
  // ngrx
  userData$!: Observable<UserData | null>;
  userEvent$!: Observable<UserEvent | undefined>;

  // state flags
  isSubmitInProgress = signal(false);

  // form
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  // other
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<UserState>,
  ) {
    super();
  }

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

  get firstnameControl(): AbstractControl | null {
    return this.profileForm.get('firstname');
  }

  get lastnameControl(): AbstractControl | null {
    return this.profileForm.get('lastname');
  }

  get currentPasswordControl(): AbstractControl | null {
    return this.passwordForm.get('currentPassword');
  }

  get passwordControl(): AbstractControl | null {
    return this.passwordForm.get('password');
  }

  get passwordRepeatControl(): AbstractControl | null {
    return this.passwordForm.get('passwordRepeat');
  }

  // trip

  submitProfileForm(): void {
    if (this.profileForm.invalid) {
      // TODO - show error?
      return;
    }

    this.isSubmitInProgress.set(true);
    // artificial delay to improve UX
    of({})
      .pipe(delay(DEFAULT_UX_DELAY))
      .subscribe(() => {
        this.store.dispatch(userActions.updateUserData({ userData: this.processProfileFormValue() }));
      });
  }

  submitPasswordForm(): void {
    if (this.passwordForm.invalid) {
      // TODO - show error?
      return;
    }

    // TODO - add dispatch action
    this.isSubmitInProgress.set(true);
    // artificial delay to improve UX
    of({})
      .pipe(delay(DEFAULT_UX_DELAY))
      .subscribe(() => {
        this.store.dispatch(userActions.updateUserPassword({ userPassword: this.processPasswordFormValue() }));
      });
  }

  // initialization

  private init(): void {
    this.initForm();
    this.initState();
  }

  private initState(): void {
    this.userData$ = this.store.select(selectUserData);
    this.subscription.add(
      this.userData$.subscribe((data: UserData | null) => {
        if (data) {
          this.fillProfileForm(data);
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
      case UserEventName.UpdateUserData:
        this.handleUserEventUpdateUserData(event);
        break;
      case UserEventName.UpdateUserPassword:
        this.handleUserEventUpdateUserPassword(event);
        break;
    }
  }

  private handleUserEventUpdateUserData(event: UserEvent): void {
    switch (event.type) {
      case UserEventType.Success:
        this.showToastSuccess(event?.message);
        break;
      case UserEventType.Error:
        this.showToastError(event?.message);
        break;
    }
    this.isSubmitInProgress.set(false);
  }

  private handleUserEventUpdateUserPassword(event: UserEvent): void {
    switch (event.type) {
      case UserEventType.Success:
        this.showToastSuccess(event?.message);
        break;
      case UserEventType.Error:
        this.showToastError(event?.message);
        break;
    }
    this.isSubmitInProgress.set(false);
  }

  // form

  private processProfileFormValue(): UserData {
    const { email, firstname, lastname } = this.profileForm.getRawValue();

    return {
      email,
      profile: {
        firstname,
        lastname,
      } as UserProfile,
    } as UserData;
  }

  // TODO - update types
  private processPasswordFormValue(): UserPassword {
    const { currentPassword, password, passwordRepeat } = this.passwordForm.getRawValue();

    return {
      currentPassword,
      password,
      passwordRepeat,
    } as UserPassword;
  }

  private initForm(): void {
    this.profileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      password: ['', Validators.required],
      passwordRepeat: ['', Validators.required],
    });
  }

  private fillProfileForm(data: UserData): void {
    const { email, profile } = data;
    this.profileForm.patchValue({
      email,
      firstname: profile?.firstname,
      lastname: profile?.lastname,
    });
  }
}
