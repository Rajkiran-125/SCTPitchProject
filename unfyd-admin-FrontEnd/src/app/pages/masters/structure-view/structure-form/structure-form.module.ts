import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureFormRoutingModule } from './structure-form-routing.module';
import { StructureFormComponent } from './structure-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateFormModule } from 'src/app/components/create-form/create-form.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FormPreviewModule } from '../../form-creation/form-preview/form-preview.module';


@NgModule({
  declarations: [
    StructureFormComponent
  ],
  imports: [
    CommonModule,
    StructureFormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CreateFormModule,
    FormPreviewModule,
    MaterialModule,
    LoaderModule
  ]
})
export class StructureFormModule { }
