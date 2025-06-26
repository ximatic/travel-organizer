import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject, effect, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { AdminEvent, AdminEventName, AdminEventType, AdminStore } from '../../store/admin.store';

import { AuthToken } from '../../../auth/model/auth.model';
import { selectAuthToken } from '../../../auth/store/auth.selectors';
import { AuthState } from '../../../auth/store/auth.state';

import { TokenHelper } from '../../../common/utils/token.helper';

import { AdminUser } from '../../models/admin-user.model';
import { UserRole } from '../../../user/models/user.enum';

import { ToastHandlerComponent } from '../../../common/components/toast-handler/toast-handler.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss',
  imports: [
    // Angular imports
    CommonModule,
    RouterModule,
    // 3rd party imports
    TranslatePipe,
    ButtonModule,
    PanelModule,
    ProgressSpinnerModule,
    TableModule,
    TagModule,
    ToastModule,
  ],
  providers: [TranslateService, MessageService],
})
export class AdminUsersComponent extends ToastHandlerComponent implements OnInit, OnDestroy {
  // di
  adminStore = inject(AdminStore);
  authStore = inject(Store<AuthState>);

  // state flags
  isLoading = signal(true);

  // data
  userId = signal('');

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

  // admin user handling

  deleteAdminUser(event: Event, user: AdminUser): void {
    event.stopPropagation();
    if (user.id) {
      this.adminStore.deleteUser(user.id);
    }
  }

  getRoleSeverity(role: UserRole) {
    switch (role) {
      case UserRole.Admin:
        return 'success';
      case UserRole.User:
        return 'info';
    }
  }

  // initialization

  private init(): void {
    this.adminStore.loadUsers();
  }

  private initState(): void {
    // auth store
    this.subscription.add(
      this.authStore.select(selectAuthToken).subscribe((authToken: AuthToken | null) => {
        if (authToken) {
          this.userId.set(TokenHelper.getTokenId(authToken));
        }
      }),
    );

    // admin store
    if (this.adminStore.event()) {
      this.handleAdminEvent(this.adminStore.event() as AdminEvent);
    }
  }

  private handleAdminEvent(event: AdminEvent): void {
    switch (event.name) {
      case AdminEventName.LoadAll:
        this.handleAdminEventLoadAll(event);
        break;
      case AdminEventName.Delete:
        this.handleAdminEventDelete(event);
        break;
    }
  }

  private handleAdminEventLoadAll(event: AdminEvent): void {
    switch (event.type) {
      case AdminEventType.Processing:
        this.isLoading.set(true);
        break;
      case AdminEventType.Success:
        this.isLoading.set(false);
        break;
      case AdminEventType.Error:
        this.isLoading.set(false);
        this.showToastError(event.message);
        break;
    }
  }

  private handleAdminEventDelete(event: AdminEvent): void {
    switch (event.type) {
      case AdminEventType.Success:
        this.showToastSuccess(event.message);
        break;
      case AdminEventType.Error:
        this.showToastError(event.message);
        break;
    }
  }
}
