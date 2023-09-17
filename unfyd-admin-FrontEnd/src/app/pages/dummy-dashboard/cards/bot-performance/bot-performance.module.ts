import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotPerformanceRoutingModule } from './bot-performance-routing.module';
import { CommonImportsModule } from '../../common-imports.module';
import { BotPerformanceComponent } from './bot-performance.component';


@NgModule({
  declarations: [ BotPerformanceComponent ],
  imports: [
    CommonModule,
    CommonImportsModule,
    BotPerformanceRoutingModule
  ]
})
export class BotPerformanceModule { }
