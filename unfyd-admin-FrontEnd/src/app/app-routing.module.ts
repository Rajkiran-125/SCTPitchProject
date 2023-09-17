import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './global/auth.guard';
import { HawkerBillPaymentComponent } from './pages/hawker-information/hawker-bill-payment/hawker-bill-payment.component';
import { HawkerGrievancesComponent } from './pages/hawker-information/hawker-grievances/hawker-grievances.component';
import { HawkerHomeComponent } from './pages/hawker-information/hawker-home/hawker-home.component';
import { HawkerPaymentComponent } from './pages/hawker-information/hawker-payment/hawker-payment.component';
import { HawkerTrainingComponent } from './pages/hawker-information/hawker-training/hawker-training.component';
import { AbandonedReportComponent } from './pages/reports/report-abandoned/report-abandoned.component';
import { ReportAgentPerformanceComponent } from './pages/reports/report-agent-performance/report-agent-performance.component';
import { ReportAgentStatusComponent } from './pages/reports/report-agent-status/report-agent-status.component';
import { ReportAgentUtilizationComponent } from './pages/reports/report-agent-utilization/report-agent-utilization.component';
import { ReportBatchWiseStatusComponent } from './pages/reports/report-batch-wise-status/report-batch-wise-status.component';
import { ReportBotComponent } from './pages/reports/report-bot/report-bot.component';
import { ReportChatScriptComponent } from './pages/reports/report-chat-script/report-chat-script.component';
import { ReportFunnelApplicationComponent } from './pages/reports/report-funnel-application/report-funnel-application.component';
import { ReportGrievanceStatusComponent } from './pages/reports/report-grievance-status/report-grievance-status.component';
import { ReportHourlyWiseInteractionComponent } from './pages/reports/report-hourly-wise-interaction/report-hourly-wise-interaction.component';
import { ReportInteractionDetailsComponent } from './pages/reports/report-interaction-details/report-interaction-details.component';
import { ReportLoginLogoutComponent } from './pages/reports/report-login-logout/report-login-logout.component';
import { ReportMedicalClearanceComponent } from './pages/reports/report-medical-clearance/report-medical-clearance.component';
import { ReportMisSummaryComponent } from './pages/reports/report-mis-summary/report-mis-summary.component';
import { ReportNotReadyComponent } from './pages/reports/report-not-ready/report-not-ready.component';
import { ReportOfflineMessageComponent } from './pages/reports/report-offline-message/report-offline-message.component';
import { ReportOutstandingPaymentComponent } from './pages/reports/report-outstanding-payment/report-outstanding-payment.component';
import { ReportPaymentCollectionComponent } from './pages/reports/report-payment-collection/report-payment-collection.component';
import { ReportPccComponent } from './pages/reports/report-pcc/report-pcc.component';
import { ReportTrainingComponent } from './pages/reports/report-training/report-training.component';
import { ReportVendorRegistrationComponent } from './pages/reports/report-vendor-registration/report-vendor-registration.component';
import { BusinessUnitComponent } from './pages/unfyd-masters/business-unit/business-unit.component';
import { CannedResponsesComponent } from './pages/unfyd-masters/canned-responses/canned-responses.component';
import { ReportChannelwisePerformanceComponent } from './pages/reports/report-channelwise-performance/report-channelwise-performance.component';
import { ReportHsmDetailsComponent } from './pages/reports/report-hsm-details/report-hsm-details.component';
import { ReportVideosessionDetailsComponent } from './pages/reports/report-videosession-details/report-videosession-details.component';
import { ReportVkycInteractionDetailsComponent } from './pages/reports/report-vkyc-interaction-details/report-vkyc-interaction-details.component';
import { ReportWmInteractionDetailsComponent } from './pages/reports/report-wm-interaction-details/report-wm-interaction-details.component';
import { ReportExcelDownloadComponent } from './pages/reports/report-excel-download/report-excel-download.component';
import { ReportHsmSummaryComponent } from './pages/reports/report-hsm-summary/report-hsm-summary.component';
import { ReportHsmComponent } from './pages/reports/report-hsm/report-hsm.component';
import { ReportInteractionDashboardComponent } from './pages/reports/report-interaction-dashboard/report-interaction-dashboard.component';
import { ReportInteractionTypeComponent } from './pages/reports/report-interaction-type/report-interaction-type.component';
import { ReportRepeatCustomersComponent } from './pages/reports/report-repeat-customers/report-repeat-customers.component';
import { ReportInteractionFeedbackComponent } from './pages/reports/report-interaction-feedback/report-interaction-feedback.component';
import { ReportOfflineMessagePendingComponent } from './pages/reports/report-offline-message-pending/report-offline-message-pending.component';
import { ReportsComponent } from './pages/reports/reports.component';
// import {InteractionDetailsComponent} from './pages/unfyd-reports/interaction-details/interaction-details.component';


const routes: Routes = [
  {path : '',loadChildren:()=>import('./pages/session/session.module').then(mod=>mod.SessionModule)},
  {path : 'beneficiary-details/:id',data:{title:'Reports'},loadChildren:()=>import('./pages/hawker-details/hawker-details.module').then(mod=>mod.HawkerDetailsModule)},
  {path : 'dummy-dashboard',canActivate:[AuthGuard],data:{title:'Dashboard'},loadChildren:()=>import('./pages/dashboard/dashboard.module').then(mod=>mod.DashboardModule)},
  {path : 'masters',canActivate:[AuthGuard],data:{title:'Masters'},loadChildren:()=>import('./pages/masters/masters.module').then(mod=>mod.MastersModule)},
  {path : 'pitch',canActivate:[AuthGuard],data:{title:'Pitch'},loadChildren:()=>import('./pages/pitch/pitch.module').then(mod=>mod.PitchModule)},
  {path : 'reports',canActivate:[AuthGuard],data:{title:'Reports'},loadChildren:()=>import('./pages/reports/reports.module').then(mod=>mod.ReportsModule)},
  {path : 'unfyd-masters',canActivate:[AuthGuard],data:{title:'Unfyd Masters'},loadChildren:()=>import('./pages/unfyd-masters/unfyd-masters.module').then(mod=>mod.UnfydMastersModule)},
  {
    path: 'vendor-registration-report',
    data: { title: 'Vendor Registration Report' },
    component:ReportVendorRegistrationComponent
  },
  {
    path: 'reports',
    data: { title: 'Reports' },
    component: ReportsComponent
  },
  {
    path: 'pcc-report',
    data: { title: 'PCC Report' },
    component:ReportPccComponent
  },
  {
    path: 'medical-clearance-report',
    data: { title: 'Medical Clearance Report' },
    component:ReportMedicalClearanceComponent
  },
  {
    path: 'training-report',
    data: { title: 'Training Report' },
    component:ReportTrainingComponent
  },
  {
    path: 'payment-collection-report',
    data: { title: 'payment Report' },
    component:ReportPaymentCollectionComponent
  },
  {
    path: 'funnel-application-report',
    data: { title: 'Funnel Application Report' },
    component:ReportFunnelApplicationComponent
  },
  {
    path: 'outstanding-payment-report',
    data: { title: 'Outstanding Payment Report' },
    component:ReportOutstandingPaymentComponent
  },
  {
    path: 'grievance-status-report',
    data: { title: 'Grievance Status Report' },
    component:ReportGrievanceStatusComponent
  },
  // {
  //   path: 'interaction-details',
  //   data: { title: 'Interaction Details' },
  //   component:InteractionDetailsComponent
  // },
  {
    path: 'summary-report',
    data: { title: 'Summary Report' },
    component:ReportMisSummaryComponent
  },
  {
    path: 'batch-wise-status-report',
    data: { title: 'Batch Wise Status Report' },
    component:ReportBatchWiseStatusComponent
  },
  {
    path: 'report-abandoned',
    data: { title: 'Abandoned Report' },
    component:AbandonedReportComponent
  },
  {
    path: 'report-agent-performance',
    data: { title: 'Agent Performance Report' },
    component:ReportAgentPerformanceComponent
  },
  {
    path: 'report-agent-status',
    data: { title: 'Agent Status Report' },
    component:ReportAgentStatusComponent
  },
  {
    path: 'report-agent-utilization',
    data: { title: 'Agent Utilization Report' },
    component:ReportAgentUtilizationComponent
  },
  {
    path: 'report-bot',
    data: { title: 'Bot Report' },
    component:ReportBotComponent
  },
  {
    path: 'report-transcripts',
    data: { title: 'Transcripts Report' },
    component:ReportChatScriptComponent
  },
  {
    path: 'report-hourly-wise-interaction',
    data: { title: 'Hourly Wise Interaction Report' },
    component:ReportHourlyWiseInteractionComponent
  },
  {
    path: 'report-interaction-details',
    data: { title: 'Interaction Details Report' },
    component:ReportInteractionDetailsComponent
  },
  {
    path: 'report-login-logout',
    data: { title: 'Login Logout Report' },
    component:ReportLoginLogoutComponent
  },
  {
    path: 'report-not-ready',
    data: { title: 'Not Ready Report' },
    component:ReportNotReadyComponent
  },
  {
    path: 'channelwise-performance-report',
    data : {title: 'Channelwise Performance Report'},
    component : ReportChannelwisePerformanceComponent
  },
  {
    path :'hsm-details-report',
    data : {title: 'HSM Details Reports'},
    component : ReportHsmDetailsComponent
  },
  {
    path :'videosession-details-report',
    data : {title: 'Videosession Details Report'},
    component : ReportVideosessionDetailsComponent
  },
  {
    path : 'vkyc-interaction-details-report',
    data : {title : 'VKYC Details Report'},
    component : ReportVkycInteractionDetailsComponent
  },
  {
    path :'wm-interaction-details-report',
    data : {title : 'WM Interaction Details Report'},
    component : ReportWmInteractionDetailsComponent
  },
  {
    path: 'report-offline-message',
    data: { title: 'Offline Message Report' },
    component:ReportOfflineMessageComponent
  },
  {
    path: 'report-hsm-summary',
    data: { title: 'HSM Summary Report' },
    component:ReportHsmSummaryComponent
  },
  {
    path: 'report-hsm',
    data: { title: 'HSM' },
    component: ReportHsmComponent
  },
  {
    path: 'report-interaction-dashboard',
    data: { title: 'Interaction Dashboard' },
    component: ReportInteractionDashboardComponent
  },
  {
    path: 'report-interaction-type',
    data: { title: 'Interaction Type' },
    component: ReportInteractionTypeComponent
  },
  {
    path: 'report-repeat-customers',
    data: { title: 'Repeat Customers' },
    component: ReportRepeatCustomersComponent
  },
  {
    path: 'report-interaction-feedback',
    data: { title: 'Interaction Feedback' },
    component: ReportInteractionFeedbackComponent
  },
  {
    path: 'report-offline-message-pending',
    data: { title: 'Offline Message Pending Report' },
    component: ReportOfflineMessagePendingComponent
  },
  {path : 'hawkerrr',canActivate:[AuthGuard],data:{title:'Hawker'},loadChildren:()=>import('./pages/hawker-information/hawker-information.module').then(mod=>mod.HawkerInformationModule)},
  {path:'beneficiary-home',canActivate:[AuthGuard],component:HawkerHomeComponent},
  {path:'beneficiary-bill-payment',canActivate:[AuthGuard],component:HawkerBillPaymentComponent},
  {path:'beneficiary-training',canActivate:[AuthGuard],component:HawkerTrainingComponent},
  {path:'beneficiary-grievances',canActivate:[AuthGuard],component:HawkerGrievancesComponent},
  {path:'beneficiary-payment',canActivate:[AuthGuard],component:HawkerPaymentComponent},
  {path : 'canned-responses',data:{title:'Reports'},
    // loadChildren:()=>import('./pages/unfyd-masters/unfyd-masters.module').then(mod=>mod.UnfydMastersModule)
    component:CannedResponsesComponent
  },
  {
    path :'report-excel-download',
    data : {title : 'Excel Download'},
    component:ReportExcelDownloadComponent
  },
  {path : 'dashboard',canActivate:[AuthGuard],data:{title:'Dummy Dashboard'},loadChildren:()=>import('./pages/dummy-dashboard/dummy-dashboard.module').then(mod=>mod.DummyDashboardModule)},  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
