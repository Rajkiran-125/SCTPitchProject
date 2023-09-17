import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrapFormRoutingModule } from './wrap-form-routing.module';
import { WrapFormComponent } from './wrap-form.component';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MaterialModule } from 'src/app/global/material.module';
import { OrderModule } from 'ngx-order-pipe';
import { FormPreviewModule } from 'src/app/pages/masters/form-creation/form-preview/form-preview.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { ApiModuleModule } from 'src/app/shared/api-module/api-module.module';


@NgModule({
  declarations: [
    WrapFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LoaderModule,
    OrderModule,
    FormsModule,
    FilterModule,
    ReactiveFormsModule,
    FormPreviewModule,
    WrapFormRoutingModule,
    ApiModuleModule
  ],
  exports:[WrapFormComponent]
})
export class WrapFormModule { }
