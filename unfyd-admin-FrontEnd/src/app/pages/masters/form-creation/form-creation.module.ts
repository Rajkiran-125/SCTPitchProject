import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormCreationRoutingModule } from './form-creation-routing.module';
import { FormCreationComponent } from './form-creation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { WrapFormComponent } from './wrap-form/wrap-form.component';
import { OrderModule } from 'ngx-order-pipe';
import { FormPreviewModule } from 'src/app/pages/masters/form-creation/form-preview/form-preview.module'
// '../../form-preview/form-preview.module';
import { WrapFormModule } from './wrap-form/wrap-form.module';
import { FormSubCategoryModule } from './form-sub-category/form-sub-category.module';
// import { DynamicFeildsComponent } from './dynamic-feilds/dynamic-feilds.component';


@NgModule({
  declarations: [
    FormCreationComponent,
    // DynamicFeildsComponent,
    // WrapFormComponent
  ],
  imports: [
    CommonModule,
    WrapFormModule,
    FormsModule,
    FilterModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    OrderModule,
    FormPreviewModule,
    FormSubCategoryModule,
    WrapFormModule,
    FormCreationRoutingModule
  ]
})
export class FormCreationModule { }
