import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormSubCategoryRoutingModule } from './form-sub-category-routing.module';
import { FormSubCategoryComponent } from './form-sub-category.component';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
  declarations: [
    FormSubCategoryComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LoaderModule,
    FormSubCategoryRoutingModule
  ]
})
export class FormSubCategoryModule { }
