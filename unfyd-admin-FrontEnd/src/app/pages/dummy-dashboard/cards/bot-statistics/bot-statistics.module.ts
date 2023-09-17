import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotStatisticsRoutingModule } from './bot-statistics-routing.module';
import { CommonImportsModule } from '../../common-imports.module';
import { BotStatisticsComponent } from './bot-statistics.component';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [ BotStatisticsComponent ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    CommonModule,
    CommonImportsModule,
    BotStatisticsRoutingModule
  ]
})
export class BotStatisticsModule { }
