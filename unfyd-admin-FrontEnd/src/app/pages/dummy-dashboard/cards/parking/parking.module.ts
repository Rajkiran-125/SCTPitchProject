import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParkingRoutingModule } from './parking-routing.module';
import { ParkingComponent } from './parking.component';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [
    ParkingComponent
  ],
  imports: [
    CommonModule,
    CommonImportsModule,
    ParkingRoutingModule
  ]
})
export class ParkingModule { }
