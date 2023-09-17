import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HawkerDetailsRoutingModule } from './hawker-details-routing.module';
import { HawkerDetailsComponent } from './hawker-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { MastersRoutingModule } from '../masters/masters-routing.module';


@NgModule({
  declarations: [
    HawkerDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MastersRoutingModule,
    MaterialModule,
    LoaderModule,
    StepsModule,
    HawkerDetailsRoutingModule
  ]
})
export class HawkerDetailsModule { }
