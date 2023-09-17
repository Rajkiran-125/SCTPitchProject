import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotDashboardRoutingModule } from './bot-dashboard-routing.module';
import { BotDashboardComponent } from './bot-dashboard.component';
import { CommonImportsModule } from '../common-imports.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { BotCardsModule } from '../cards/bot-cards/bot-cards.module';


@NgModule({
  declarations: [ BotDashboardComponent ],
  imports: [
    CommonModule,
    CommonImportsModule,
    BotCardsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    BotDashboardRoutingModule
  ]
})
export class BotDashboardModule { }
