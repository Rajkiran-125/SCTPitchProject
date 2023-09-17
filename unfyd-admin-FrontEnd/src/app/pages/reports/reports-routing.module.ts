import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbandonedReportComponent } from './report-abandoned/report-abandoned.component';
import { ReportAgentPerformanceComponent } from './report-agent-performance/report-agent-performance.component';
import { ReportAgentStatusComponent } from './report-agent-status/report-agent-status.component';
import { ReportAgentUtilizationComponent } from './report-agent-utilization/report-agent-utilization.component';
import { ReportBotComponent } from './report-bot/report-bot.component';
import { ReportChatScriptComponent } from './report-chat-script/report-chat-script.component';
import { ReportHourlyWiseInteractionComponent } from './report-hourly-wise-interaction/report-hourly-wise-interaction.component';
import { ReportInteractionDetailsComponent } from './report-interaction-details/report-interaction-details.component';
import { ReportLoginLogoutComponent } from './report-login-logout/report-login-logout.component';
import { ReportPccComponent } from './report-pcc/report-pcc.component';
import { ReportVendorRegistrationComponent } from './report-vendor-registration/report-vendor-registration.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
},
{
    path: 'pcc-report',
    data: { title: 'Hawkers' },
    component:ReportPccComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
