import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskGroupViewRoutingModule } from './task-group-view-routing.module';
import { TaskGroupViewComponent } from './task-group-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { QueryCreationBuilderModule } from 'src/app/components/query-creation-builder/query-creation-builder.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DateFormatPipe } from 'src/app/global/date-format.pipe';
import { MastersModule } from '../masters.module';

@NgModule({
  declarations: [
    TaskGroupViewComponent
  ],
  imports: [
    UiSwitchModule,
    CommonModule,
    TaskGroupViewRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    QueryCreationBuilderModule,
    OrderModule,
    MastersModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ],
  providers:[DateFormatPipe]
})
export class TaskGroupViewModule { }
