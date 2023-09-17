import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';

import { VendorServiceRoutingModule } from './vendor-service-routing.module';
import { VendorServiceComponent } from './vendor-service.component';

@NgModule({
  declarations: [
    VendorServiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    VendorServiceRoutingModule
  ]
})
export class VendorServiceModule { }
