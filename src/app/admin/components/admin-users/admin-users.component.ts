import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InterpolationParameters, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { AdminEvent, AdminEventName, AdminEventType, AdminStore } from '../../store/admin.store';

import { AdminUser } from '../../models/admin-user.model';
import { UserRole } from '../../../user/models/user.enum';

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
export class AdminUserComponent implements OnInit {
  // di
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);
  store = inject(AdminStore);

  // state flags
  isLoading = signal(true);

  constructor() {
    effect(() => {
      this.initState();
    });
  }

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  // admin user handling

  deleteAdminUser(event: Event, user: AdminUser): void {
    event.stopPropagation();
    // TODO - add code to remove users
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
    this.store.loadUsers();
  }

  private initState(): void {
    if (!!this.store.event()) {
      this.handleAdminEvent(this.store.event() as AdminEvent);
    }
  }

  private handleAdminEvent(event: AdminEvent | null): void {
    if (!event) {
      return;
    }

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
        this.showToastError(event?.message);
        break;
    }
  }

  private handleAdminEventDelete(event: AdminEvent): void {
    switch (event.type) {
      case AdminEventType.Success:
        this.showToastSuccess(event?.message, { trip: event.user?.email });
        break;
      case AdminEventType.Error:
        this.showToastError(event?.message, { trip: event.user?.email });
        break;
    }
  }

  // toast

  private showToastSuccess(detail?: string, detailsParams?: InterpolationParameters) {
    this.showToast(
      'success',
      this.translateService.instant('EVENT.TYPE.SUCCESS'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`, detailsParams),
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
