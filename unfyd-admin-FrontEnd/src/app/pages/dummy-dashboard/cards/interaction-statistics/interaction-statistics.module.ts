import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InteractionStatisticsRoutingModule } from './interaction-statistics-routing.module';
import { InteractionStatisticsComponent } from './interaction-statistics.component';
import { CommonImportsModule } from '../../common-imports.module';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    InteractionStatisticsComponent
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    CommonModule,
    CommonImportsModule,
    InteractionStatisticsRoutingModule
  ]
})
export class InteractionStatisticsModule { }
