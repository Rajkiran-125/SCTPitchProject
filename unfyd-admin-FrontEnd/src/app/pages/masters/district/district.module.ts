import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { DistrictRoutingModule } from './district-routing.module';
import { DistrictComponent } from './district.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  declarations: [ 
    DistrictComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DistrictRoutingModule,
    MaterialModule,
    Ng2SearchPipeModule,
    LoaderModule
  ]
})
export class DistrictModule { }
