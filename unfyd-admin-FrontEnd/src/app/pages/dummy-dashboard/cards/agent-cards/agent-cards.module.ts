import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentCardsRoutingModule } from './agent-cards-routing.module';
import { AgentCardsComponent } from './agent-cards.component';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    AgentCardsComponent
  ],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    AgentCardsRoutingModule
  ],
  exports: [AgentCardsComponent],
})
export class AgentCardsModule { }
