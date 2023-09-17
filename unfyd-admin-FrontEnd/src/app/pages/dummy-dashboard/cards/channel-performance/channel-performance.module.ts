import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelPerformanceRoutingModule } from './channel-performance-routing.module';
import { ChannelPerformanceComponent } from './channel-performance.component';
import { CommonImportsModule } from '../../common-imports.module';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    ChannelPerformanceComponent
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    CommonModule,
    CommonImportsModule,
    ChannelPerformanceRoutingModule
  ]
})
export class ChannelPerformanceModule { }
