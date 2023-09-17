import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { TaskGroupDetailComponent } from './Task-group-detail.component';
import { TaskGroupDetailComponentRoutingModule } from './Task-group-detail-routing.module';
@NgModule({
  declarations: [ 
    TaskGroupDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskGroupDetailComponentRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class TaskGroupDetailModule { }
