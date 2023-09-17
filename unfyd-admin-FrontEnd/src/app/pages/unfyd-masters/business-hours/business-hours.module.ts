import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessHoursRoutingModule } from './business-hours-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { BusinessHoursComponent } from './business-hours.component';


@NgModule({
  declarations: [BusinessHoursComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FilterModule,
    MaterialModule,
    LoaderModule,
    BusinessHoursRoutingModule
  ],
  exports:[BusinessHoursComponent]
})
export class BusinessHoursModule { }
