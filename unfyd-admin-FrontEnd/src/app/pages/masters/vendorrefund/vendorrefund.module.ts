import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorrefundRoutingModule } from './vendorrefund-routing.module';
import { VendorrefundComponent } from './vendorrefund.component';
import { MaterialModule } from 'src/app/global/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    VendorrefundComponent
  ],
  imports:  [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    VendorrefundRoutingModule
  ]
})
export class VendorrefundModule { }
