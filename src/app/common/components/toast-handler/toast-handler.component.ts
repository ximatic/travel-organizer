import { Component, inject } from '@angular/core';

import { InterpolationParameters, TranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-toast-handler',
  template: '',
  providers: [TranslateService],
})
export class ToastHandlerComponent {
  // di
  protected translateService = inject(TranslateService);
  protected messageService = inject(MessageService);

  // toast

  protected showToastSuccess(detail?: string, detailsParams?: InterpolationParameters) {
    this.showToast(
      'success',
      this.translateService.instant('EVENT.TYPE.SUCCESS'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`, detailsParams),
    );
  }

  protected showToastError(detail?: string, detailsParams?: InterpolationParameters) {
    this.showToast(
      'error',
      this.translateService.instant('EVENT.TYPE.ERROR'),
      this.translateService.instant(`EVENT.MESSAGE.${detail}`, detailsParams),
    );
  }

  protected showToast(severity: string, summary: string, detail?: string) {
    this.messageService.add({ severity, summary, detail, key: 'toast', life: 3000 });
  }
}
