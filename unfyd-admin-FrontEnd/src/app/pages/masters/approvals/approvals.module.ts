import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalsRoutingModule } from './approvals-routing.module';
import { ApprovalsComponent } from './approvals.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { DateTimeFormatPipe } from 'src/app/global/date-time-format.pipe';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ApprovalsComponent
  ],
  imports: [
    CommonModule,
    ApprovalsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule
  ],
  providers:[DateTimeFormatPipe]
})
export class ApprovalsModule { }
