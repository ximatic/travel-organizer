import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject, effect, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { delay, of, Subscription } from 'rxjs';

import { MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { AdminEvent, AdminEventName, AdminEventType, AdminStore } from '../../store/admin.store';

import { AdminUser, CreateAdminUserPayload } from '../../models/admin-user.model';
import { UserRole } from '../../../user/models/user.enum';

import { ToastHandlerComponent } from '../../../common/components/toast-handler/toast-handler.component';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DEFAULT_UX_DELAY } from '../../../common/constants/common.constants';
import { valueMatchValidator } from '../../../common/utils/custom-form.validators';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.scss',
  imports: [
    // Angular imports
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // 3rd party imports
    TranslatePipe,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
    PasswordModule,
    ProgressSpinnerModule,
    SelectModule,
    TableModule,
    TagModule,
    ToastModule,
  ],
  providers: [TranslateService, MessageService],
})
export class AdminUserComponent extends ToastHandlerComponent implements OnInit, OnDestroy {
  // di
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  store = inject(AdminStore);

  // user
  user = signal<AdminUser | null>(null);
  roles = signal<SelectItem[]>([]);

  // state flags
  isLoading = signal(true);
  isSubmitInProgress = signal(false);

  // form
  userForm!: FormGroup;

  // other
  private subscription = new Subscription();

  constructor() {
    super();
    effect(() => {
      this.initState();
    });
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
    return this.userForm.get('email');
  }

  get firstnameControl(): AbstractControl | null {
    return this.userForm.get('firstname');
  }

  get lastnameControl(): AbstractControl | null {
    return this.userForm.get('lastname');
  }

  get roleControl(): AbstractControl | null {
    return this.userForm.get('role');
  }

  get passwordControl(): AbstractControl | null {
    return this.userForm.get('password');
  }

  get passwordRepeatControl(): AbstractControl | null {
    return this.userForm.get('passwordRepeat');
  }

  // admin user

  submitUser(): void {
    if (this.userForm.invalid) {
      // TODO - show error?
      return;
    }

    this.isSubmitInProgress.set(true);
    // artificial delay to improve UX
    of({})
      .pipe(delay(DEFAULT_UX_DELAY))
      .subscribe(() => {
        if (this.user()) {
          const payload = {
            ...this.user(),
            ...this.processFormValue(),
          };
          // TODO - uncomment when ready
          // this.store.updateUser(payload);
        } else {
          const payload = this.processFormValue();
          this.store.createUser(payload);
        }
      });
  }

  validateForm(): void {
    this.userForm.updateValueAndValidity();
    this.passwordControl?.updateValueAndValidity();
    this.passwordRepeatControl?.updateValueAndValidity();
  }

  // initialization

  private init(): void {
    this.initForm();
    this.initFormOptions();

    this.subscription.add(
      this.route.params.subscribe((params: Params) => {
        if (params['id']) {
          this.store.loadUser(params['id']);
        } else {
          this.isLoading.set(false);
        }
      }),
    );
  }

  private initState(): void {
    if (this.store.event()) {
      this.handleAdminEvent(this.store.event() as AdminEvent);
    }
  }

  private handleAdminEvent(event: AdminEvent): void {
    switch (event.name) {
      case AdminEventName.Load:
        this.handleAdminEventLoad(event);
        break;
      case AdminEventName.Create:
        this.handleAdminEventCreate(event);
        break;
    }
  }

  private handleAdminEventLoad(event: AdminEvent): void {
    switch (event.type) {
      case AdminEventType.Processing:
        this.isLoading.set(true);
        break;
      case AdminEventType.Success:
        if (event.user) {
          this.user.set(event.user);
          this.fillForm();
        }
        this.isLoading.set(false);
        break;
      case AdminEventType.Error:
        this.isLoading.set(false);
        this.showToastError(event?.message);
        break;
    }
  }

  private handleAdminEventCreate(event: AdminEvent): void {
    switch (event.type) {
      case AdminEventType.Processing:
        this.isSubmitInProgress.set(true);
        break;
      case AdminEventType.Success:
        this.isSubmitInProgress.set(false);
        this.showToastSuccess(event.message, { user: event.user?.email });
        break;
      case AdminEventType.Error:
        this.isSubmitInProgress.set(false);
        this.showToastError(event.message);
        break;
    }
  }

  // form

  private initForm(): void {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [Validators.required, valueMatchValidator('passwordRepeat')]],
      passwordRepeat: ['', [Validators.required, valueMatchValidator('password')]],
    });
  }

  private initFormOptions(): void {
    this.translateService.get('APP.TITLE').subscribe(() => {
      this.roles.set(
        Object.values(UserRole).map((value: string) => ({
          label: this.translateService.instant(`ADMIN.USER.FORM.ROLE.OPTION.${value.toUpperCase()}`),
          value,
        })),
      );
    });
  }
  private fillForm(): void {
    if (this.user()) {
      const { email, firstname, lastname, role } = this.user() as AdminUser;
      this.userForm.patchValue({
        email,
        role,
        firstname,
        lastname,
      });
    }
  }

  private processFormValue(): CreateAdminUserPayload {
    const { email, firstname, lastname, role, password, passwordRepeat } = this.userForm.getRawValue();
    const payload: CreateAdminUserPayload = {
      email,
      firstname,
      lastname,
      role,
      password,
      passwordRepeat,
    };

    return payload;
  }
}
