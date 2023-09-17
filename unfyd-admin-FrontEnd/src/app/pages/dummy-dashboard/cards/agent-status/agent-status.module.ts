import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentStatusRoutingModule } from './agent-status-routing.module';
import { AgentStatusComponent } from './agent-status.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [
    AgentStatusComponent
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    CommonModule,
    CommonImportsModule,
    AgentStatusRoutingModule
  ]
})
export class AgentStatusModule { }
