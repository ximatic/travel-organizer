import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [RouterModule, TranslatePipe, ButtonModule, CardModule],
})
export class DashboardComponent {}
