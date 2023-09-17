import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { ScheduleComponent } from '../schedule/schedule.component';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonImportsModule } from '../../dummy-dashboard/common-imports.module';



@NgModule({
  declarations: [
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    LoaderModule,
    CommonImportsModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderModule
  ]
})
export class ScheduleModule { }
