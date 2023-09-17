import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoliceStationRoutingModule } from './police-station-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';

import { PoliceStationComponent } from './police-station.component';


@NgModule({
  declarations: [
    PoliceStationComponent
  ],
  imports: [
    CommonModule,
    PoliceStationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
  ]
})
export class PoliceStationModule { }
