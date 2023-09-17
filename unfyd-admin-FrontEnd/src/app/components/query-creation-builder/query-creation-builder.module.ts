import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QueryCreationBuilderRoutingModule } from './query-creation-builder-routing.module';
import { QueryCreationBuilderComponent } from './query-creation-builder.component';
import { MaterialModule } from 'src/app/global/material.module';
import { QueryBuilderModule } from 'angular2-query-builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    QueryCreationBuilderComponent
  ],
  imports: [
    CommonModule,
    QueryCreationBuilderRoutingModule,
    QueryBuilderModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ], exports:[QueryCreationBuilderComponent]

})
export class QueryCreationBuilderModule { }
