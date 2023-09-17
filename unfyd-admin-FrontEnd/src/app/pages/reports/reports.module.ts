import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MastersRoutingModule } from '../masters/masters-routing.module';
import { ReportPccComponent } from './report-pcc/report-pcc.component';
import { ReportVendorRegistrationComponent } from './report-vendor-registration/report-vendor-registration.component';
import { ReportMedicalClearanceComponent } from './report-medical-clearance/report-medical-clearance.component';
import { ReportTrainingComponent } from './report-training/report-training.component';
import { ReportPaymentCollectionComponent } from './report-payment-collection/report-payment-collection.component';
import { ReportFunnelApplicationComponent } from './report-funnel-application/report-funnel-application.component';
import { ReportOutstandingPaymentComponent } from './report-outstanding-payment/report-outstanding-payment.component';
import { ReportGrievanceStatusComponent } from './report-grievance-status/report-grievance-status.component';
import { MonthPickerComponent } from './month-picker/month-picker.component';
import { FullDatePickerComponent } from './full-date-picker/full-date-picker.component';
import { ReportMisSummaryComponent } from './report-mis-summary/report-mis-summary.component';
import { ReportBatchWiseStatusComponent } from './report-batch-wise-status/report-batch-wise-status.component';
import { ReportOfflineMessageComponent } from './report-offline-message/report-offline-message.component';
import { AbandonedReportComponent } from './report-abandoned/report-abandoned.component';
import { ReportAgentPerformanceComponent } from './report-agent-performance/report-agent-performance.component';
import { ReportAgentStatusComponent } from './report-agent-status/report-agent-status.component';
import { ReportAgentUtilizationComponent } from './report-agent-utilization/report-agent-utilization.component';
import { ReportBotComponent } from './report-bot/report-bot.component';
import { ReportChatScriptComponent } from './report-chat-script/report-chat-script.component';
import { ReportHourlyWiseInteractionComponent } from './report-hourly-wise-interaction/report-hourly-wise-interaction.component';
import { ReportInteractionDetailsComponent } from './report-interaction-details/report-interaction-details.component';
import { ReportLoginLogoutComponent } from './report-login-logout/report-login-logout.component';
import { ReportNotReadyComponent } from './report-not-ready/report-not-ready.component';
import { ReportChannelwisePerformanceComponent } from './report-channelwise-performance/report-channelwise-performance.component';
import { ReportHsmDetailsComponent } from './report-hsm-details/report-hsm-details.component';
import { ReportVideosessionDetailsComponent } from './report-videosession-details/report-videosession-details.component';
import { ReportVkycInteractionDetailsComponent } from './report-vkyc-interaction-details/report-vkyc-interaction-details.component';
import { ReportWmInteractionDetailsComponent } from './report-wm-interaction-details/report-wm-interaction-details.component';
import { ReportExcelDownloadComponent } from './report-excel-download/report-excel-download.component';
import { ReportHsmSummaryComponent } from './report-hsm-summary/report-hsm-summary.component';
import { ReportHsmComponent } from './report-hsm/report-hsm.component';
import { ReportInteractionDashboardComponent } from './report-interaction-dashboard/report-interaction-dashboard.component';
import { ReportInteractionTypeComponent } from './report-interaction-type/report-interaction-type.component';
import { ReportRepeatCustomersComponent } from './report-repeat-customers/report-repeat-customers.component';
import { ReportInteractionFeedbackComponent } from './report-interaction-feedback/report-interaction-feedback.component';
import { ReportOfflineMessagePendingComponent } from './report-offline-message-pending/report-offline-message-pending.component';


@NgModule({
  declarations: [ReportsComponent, ReportPccComponent, ReportVendorRegistrationComponent,
    ReportMedicalClearanceComponent, ReportTrainingComponent, ReportPaymentCollectionComponent,
    ReportFunnelApplicationComponent, ReportOutstandingPaymentComponent, ReportGrievanceStatusComponent,
    MonthPickerComponent, FullDatePickerComponent, ReportMisSummaryComponent, ReportBatchWiseStatusComponent,
    ReportOfflineMessageComponent, AbandonedReportComponent, ReportAgentPerformanceComponent, ReportAgentStatusComponent,
    ReportAgentUtilizationComponent, ReportBotComponent, ReportChatScriptComponent, ReportHourlyWiseInteractionComponent,
    ReportInteractionDetailsComponent, ReportLoginLogoutComponent, ReportNotReadyComponent, ReportChannelwisePerformanceComponent,
    ReportHsmDetailsComponent, ReportVideosessionDetailsComponent, ReportVkycInteractionDetailsComponent, ReportWmInteractionDetailsComponent,
    ReportExcelDownloadComponent, ReportHsmSummaryComponent, ReportHsmComponent, ReportInteractionDashboardComponent, ReportInteractionTypeComponent,
    ReportRepeatCustomersComponent,
    ReportInteractionFeedbackComponent,
    ReportOfflineMessagePendingComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MastersRoutingModule,
    FilterModule,
    MaterialModule,
    LoaderModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
