import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay, Observable, of, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';

import { DEFAULT_UX_DELAY } from '../../common/constants/common.constants';

import { LoginPayload } from '../model/auth.model';

import { authActions } from '../store/auth.actions';
import { selectAuthEvent } from '../store/auth.selectors';
import { AuthEvent, AuthEventName, AuthEventType, AuthState } from '../store/auth.state';

import { ToastHandlerComponent } from '../../common/components/toast-handler/toast-handler.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslatePipe,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    PasswordModule,
  ],
  providers: [TranslateService],
})
export class LoginComponent extends ToastHandlerComponent implements OnInit, OnDestroy {
  // ngrx
  authEvent$!: Observable<AuthEvent | undefined>;

  // state flags
  isSubmitInProgress = signal(false);

  // form
  loginForm!: FormGroup;

  // other
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<AuthState>,
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
    return this.loginForm.get('email');
  }

  get passwordControl(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  // trip

  submitForm(): void {
    if (this.loginForm.invalid) {
      // TODO - show error?
      return;
    }

    this.isSubmitInProgress.set(true);
    // artificial delay to improve UX
    of({})
      .pipe(delay(DEFAULT_UX_DELAY))
      .subscribe(() => {
        this.store.dispatch(authActions.login({ ...this.processFormValue() }));
      });
  }

  // initialization

  private init(): void {
    this.initForm();
    this.initState();
  }

  private initState(): void {
    this.authEvent$ = this.store.select(selectAuthEvent);
    this.subscription.add(this.authEvent$.subscribe((event: AuthEvent | undefined) => this.handleAuthEvent(event)));
  }

  private handleAuthEvent(event: AuthEvent | undefined): void {
    if (!event) {
      return;
    }

    switch (event.name) {
      case AuthEventName.Login:
        this.handleAuthEventLogin(event);
        break;
    }
  }

  private handleAuthEventLogin(event: AuthEvent): void {
    switch (event.type) {
      case AuthEventType.Success:
        this.router.navigate([`/dashboard`]);
        break;
      case AuthEventType.Error:
        this.showToastError(event?.message);
        break;
    }
    this.isSubmitInProgress.set(false);
  }

  // form

  private processFormValue(): LoginPayload {
    const { email, password } = this.loginForm.getRawValue();

    return {
      email,
      password,
    } as LoginPayload;
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
}
