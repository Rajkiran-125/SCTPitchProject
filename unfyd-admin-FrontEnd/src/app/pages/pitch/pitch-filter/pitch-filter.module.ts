import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { PitchFilterRoutingModule } from './pitch-filter-routing.module';
import { PitchFilterComponent } from './pitch-filter.component';


@NgModule({
  declarations: [
    PitchFilterComponent
  ],
  imports: [
    CommonModule,
    PitchFilterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule
  ], 
  exports :[
    PitchFilterComponent
  ]
})
export class PitchFilterModule { }
