import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotMenuUsageRoutingModule } from './bot-menu-usage-routing.module';
import { CommonImportsModule } from '../../common-imports.module';
import { BotMenuUsageComponent } from './bot-menu-usage.component';


@NgModule({
  declarations: [BotMenuUsageComponent],
  imports: [
    CommonModule,
    CommonImportsModule,
    BotMenuUsageRoutingModule
  ]
})
export class BotMenuUsageModule { }
