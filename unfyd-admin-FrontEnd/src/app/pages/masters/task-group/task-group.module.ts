import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { OrderModule } from 'ngx-order-pipe';
import { CreateFormModule } from 'src/app/components/create-form/create-form.module';
import { FormPreviewModule } from '../form-creation/form-preview/form-preview.module';
import { TaskGroupComponentRoutingModule } from './task-group-routing.module';
import { TaskGroupComponent } from './task-group.component';
import { BusinessHoursModule } from '../../unfyd-masters/business-hours/business-hours.module';
import { QueryCreationBuilderModule } from 'src/app/components/query-creation-builder/query-creation-builder.module';

@NgModule({
  declarations: [
    TaskGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskGroupComponentRoutingModule,
    MaterialModule,
    LoaderModule,
    CreateFormModule,
    FormPreviewModule,
    BusinessHoursModule,
    QueryCreationBuilderModule,
    OrderModule,
  ],
  exports:[TaskGroupComponent]
})
export class TaskGroupModule { }
