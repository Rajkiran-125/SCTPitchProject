import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormPreviewRoutingModule } from './form-preview-routing.module';
import { FormPreviewComponent } from './form-preview.component';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MaterialModule } from 'src/app/global/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
  declarations: [
    FormPreviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    OrderModule,
    FormPreviewRoutingModule,
  ],
  exports: [
    FormPreviewComponent
]
})
export class FormPreviewModule { }
