import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCenterRoutingModule } from './product-center-routing.module';
import { ProductCenterComponent } from './product-center.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
  declarations: [
    ProductCenterComponent
  ],
  imports: [
    CommonModule,
    ProductCenterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
  ]
})
export class ProductCenterModule { }
