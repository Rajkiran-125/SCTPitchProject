import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeTypeRoutingModule } from './fee-type-routing.module';
import { FeeTypeComponent } from './fee-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    FeeTypeComponent
  ],
  imports: [
    CommonModule,
    FeeTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule
  ]
})
export class FeeTypeModule { }
