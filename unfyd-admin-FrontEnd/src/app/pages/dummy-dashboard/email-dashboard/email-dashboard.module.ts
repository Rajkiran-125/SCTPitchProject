import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailDashboardRoutingModule } from './email-dashboard-routing.module';
import { EmailDashboardComponent } from './email-dashboard.component';
import { CommonImportsModule } from '../common-imports.module';


@NgModule({
  declarations: [ EmailDashboardComponent ],
  imports: [
    CommonModule,
    CommonImportsModule,
    EmailDashboardRoutingModule
  ]
})
export class EmailDashboardModule { }
