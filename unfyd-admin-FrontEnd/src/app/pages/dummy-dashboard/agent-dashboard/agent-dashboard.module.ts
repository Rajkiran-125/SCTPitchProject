import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentDashboardRoutingModule } from './agent-dashboard-routing.module';
import { AgentDashboardComponent } from './agent-dashboard.component';
import { CommonImportsModule } from '../common-imports.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { AgentCardsModule } from '../cards/agent-cards/agent-cards.module';


@NgModule({
  declarations: [ AgentDashboardComponent ],
  imports: [
    CommonModule,
    CommonImportsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    AgentCardsModule,
    AgentDashboardRoutingModule
  ]
})
export class AgentDashboardModule { }
