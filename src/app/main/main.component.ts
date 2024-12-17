import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
  imports: [RouterModule, ButtonModule, DividerModule, DrawerModule, ToolbarModule],
})
export class MainComponent {
  darkMode = false;
  sidebarVisible = false;

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleDarkMode(): void {
    document.querySelector('html')?.classList.toggle('dark-mode');
  }
}
