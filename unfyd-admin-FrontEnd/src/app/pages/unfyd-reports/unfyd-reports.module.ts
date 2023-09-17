import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnfydReportsRoutingModule } from './unfyd-reports-routing.module';
import { UnfydReportsComponent } from './unfyd-reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InteractionDetailsComponent } from './interaction-details/interaction-details.component';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';



@NgModule({
  declarations: [
    UnfydReportsComponent,InteractionDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FilterModule,
    MaterialModule,
    LoaderModule,
    UnfydReportsRoutingModule,
    LoaderModule
  ]
})
export class UnfydReportsModule { }
