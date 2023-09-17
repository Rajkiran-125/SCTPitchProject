import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { SafePipe, VendorMastersComponent } from './vendor-masters.component';
import { VendorMastersRoutingModule } from './vendor-masters-routing.module';


@NgModule({
  declarations: [
    VendorMastersComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VendorMastersRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class VendorMastersModule { }
