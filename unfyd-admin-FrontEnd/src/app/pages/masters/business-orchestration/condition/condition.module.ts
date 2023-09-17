import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionComponent } from './condition.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';



@NgModule({
  declarations: [
    ConditionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    ConditionComponent
  ]
})
export class ConditionModule { }
