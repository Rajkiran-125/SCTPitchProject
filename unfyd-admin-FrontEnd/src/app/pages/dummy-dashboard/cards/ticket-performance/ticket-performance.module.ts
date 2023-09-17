import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketPerformanceRoutingModule } from './ticket-performance-routing.module';
import { TicketPerformanceComponent } from './ticket-performance.component';
import { CommonImportsModule } from '../../common-imports.module';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    TicketPerformanceComponent
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    CommonModule,
    CommonImportsModule,
    TicketPerformanceRoutingModule
  ]
})
export class TicketPerformanceModule { }
