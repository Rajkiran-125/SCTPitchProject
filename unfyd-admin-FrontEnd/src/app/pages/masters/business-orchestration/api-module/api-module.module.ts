import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiModuleComponent } from './api-module.component';
import { MaterialModule } from 'src/app/global/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ApiModuleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    ApiModuleComponent
  ]
})
export class ApiModuleModule { }
