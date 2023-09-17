import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { BusinessUnitsRoutingModule } from './business-units-routing.module';
import { BusinessUnitsComponent } from './business-units.component';


@NgModule({
  declarations: [BusinessUnitsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BusinessUnitsRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class BusinessUnitsModule { }
