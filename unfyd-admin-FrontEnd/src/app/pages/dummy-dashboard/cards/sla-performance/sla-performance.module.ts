import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlaPerformanceRoutingModule } from './sla-performance-routing.module';
import { SlaPerformanceComponent } from './sla-performance.component';
import { CommonImportsModule } from '../../common-imports.module';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    SlaPerformanceComponent
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    CommonModule,
    CommonImportsModule,
    SlaPerformanceRoutingModule
  ]
})
export class SlaPerformanceModule { }
