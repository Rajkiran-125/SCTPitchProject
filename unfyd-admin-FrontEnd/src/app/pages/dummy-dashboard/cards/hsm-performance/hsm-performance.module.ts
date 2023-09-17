import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HsmPerformanceRoutingModule } from './hsm-performance-routing.module';
import { HsmPerformanceComponent } from './hsm-performance.component';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [ HsmPerformanceComponent ],
  imports: [
    CommonModule,
    CommonImportsModule,
    HsmPerformanceRoutingModule
  ]
})
export class HsmPerformanceModule { }
