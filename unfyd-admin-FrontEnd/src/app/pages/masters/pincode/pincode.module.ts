import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { PincodeComponent } from './pincode.component';
import { PincodeRoutingModule } from './pincode-routing.module';
@NgModule({
  declarations: [ 
    PincodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PincodeRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class PincodeModule { }
