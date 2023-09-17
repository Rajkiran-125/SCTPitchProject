import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardCardRoutingModule } from './dashboard-card-routing.module';
import { DashboardCardComponent } from './dashboard-card.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonImportsModule } from '../common-imports.module';
import { DateFormatPipe } from 'src/app/global/date-format.pipe';
import { WeekPipe } from 'src/app/global/week.pipe';
import { DateTimeFormatPipe } from 'src/app/global/date-time-format.pipe';


@NgModule({
  declarations: [DashboardCardComponent],
  imports: [
    CommonModule,
    CommonImportsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    DashboardCardRoutingModule
  ],
  providers:[DateFormatPipe,DateTimeFormatPipe,WeekPipe],
  exports:[DashboardCardComponent]
})
export class DashboardCardModule { }
