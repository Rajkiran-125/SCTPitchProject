import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiPerformanceRoutingModule } from './api-performance-routing.module';
import { ApiPerformanceComponent } from './api-performance.component';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [ ApiPerformanceComponent ],
  imports: [
    CommonModule,
    CommonImportsModule,
    ApiPerformanceRoutingModule
  ]
})
export class ApiPerformanceModule { }
