import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { VendorProductRoutingModule } from './vendor-product-routing.module';
import { VendorProductComponent } from './vendor-product.component';


@NgModule({
  declarations: [
    VendorProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    VendorProductRoutingModule
  ]
})
export class VendorProductModule { }
