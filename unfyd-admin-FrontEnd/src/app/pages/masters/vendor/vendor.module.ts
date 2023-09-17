import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { VendorComponent } from './vendor.component';
import { VendorRoutingModule } from './vendor-routing.module';


@NgModule({
  declarations: [ 
    VendorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VendorRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class VendorModule { }
