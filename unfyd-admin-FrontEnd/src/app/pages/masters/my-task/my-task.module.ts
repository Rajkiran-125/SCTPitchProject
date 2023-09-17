import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyTaskRoutingModule } from './my-task-routing.module';
import { MyTaskComponent } from './my-task.component';
import { MaterialModule } from 'src/app/global/material.module';

@NgModule({
  declarations: [
    MyTaskComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MyTaskRoutingModule
  ]
})
export class MyTaskModule { }
