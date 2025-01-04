import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { AlertDialogFilterComponent } from './alert-dialog-filter/alert-dialog-filter.component';

@NgModule({
  declarations: [
    DashboardViewComponent,
    AlertDialogFilterComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DashboardModule { }
