import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionComponent } from './action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { ApiModuleModule } from '../api-module/api-module.module';



@NgModule({
  declarations: [
    ActionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ApiModuleModule
  ],
  exports: [
    ActionComponent
  ]
})
export class ActionModule { }
