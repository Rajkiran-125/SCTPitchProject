import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DummyDashboardRoutingModule } from './dummy-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { DummyDashboardComponent } from './dummy-dashboard.component';
import { DragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RepeatComponent } from './cards/repeat/repeat.component';
import { BotMenuUsageComponent } from './cards/bot-menu-usage/bot-menu-usage.component';
import { BotStatisticsComponent } from './cards/bot-statistics/bot-statistics.component';
import { BotLicenseUsageComponent } from './cards/bot-license-usage/bot-license-usage.component';
import { BotPerformanceComponent } from './cards/bot-performance/bot-performance.component';
import { ApiPerformanceComponent } from './cards/api-performance/api-performance.component';
import { FeedbackComponent } from './cards/feedback/feedback.component';
import { HsmPerformanceComponent } from './cards/hsm-performance/hsm-performance.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { HighchartsChartComponent, HighchartsChartModule } from 'highcharts-angular';
import { BotDashboardComponent } from './bot-dashboard/bot-dashboard.component';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { EmailDashboardComponent } from './email-dashboard/email-dashboard.component';
import { ApiPerformanceModule } from './cards/api-performance/api-performance.module';
import { BotDashboardModule } from './bot-dashboard/bot-dashboard.module';
import { AgentDashboardModule } from './agent-dashboard/agent-dashboard.module';
import { EmailDashboardModule } from './email-dashboard/email-dashboard.module';
import { BotLicenseUsageModule } from './cards/bot-license-usage/bot-license-usage.module';
import { BotMenuUsageModule } from './cards/bot-menu-usage/bot-menu-usage.module';
import { BotPerformanceModule } from './cards/bot-performance/bot-performance.module';
import { BotStatisticsModule } from './cards/bot-statistics/bot-statistics.module';
import { FeedbackModule } from './cards/feedback/feedback.module';
import { HsmPerformanceModule } from './cards/hsm-performance/hsm-performance.module';
import { RepeatModule } from './cards/repeat/repeat.module';
import { BotCardsModule } from './cards/bot-cards/bot-cards.module';
import { SlaPerformanceModule } from './cards/sla-performance/sla-performance.module';
import { ParkingModule } from './cards/parking/parking.module';
import { AgentCardsModule } from './cards/agent-cards/agent-cards.module';
import { AgentStatusModule } from './cards/agent-status/agent-status.module';
import { TicketPerformanceModule } from './cards/ticket-performance/ticket-performance.module';
import { InteractionStatisticsModule } from './cards/interaction-statistics/interaction-statistics.module';
import { ChannelPerformanceModule } from './cards/channel-performance/channel-performance.module';
import { OtherInteractionModule } from './cards/other-interaction/other-interaction.module';
import { TasksModule } from './cards/tasks/tasks.module';
import { TopDispositionModule } from './cards/top-disposition/top-disposition.module';
import { TopPerformerModule } from './cards/top-performer/top-performer.module';
import { RepeatUniqueModule } from './cards/repeat-unique/repeat-unique.module';
import { BotFeedbackModule } from './cards/bot-feedback/bot-feedback.module';
import { DashboardCardModule } from './dashboard-card/dashboard-card.module';
import { TileCardModule } from './tile-card/tile-card.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ManagementTileModule } from './management-tile/management-tile.module';


@NgModule({
  declarations: [
    DummyDashboardComponent,

  ],
  imports: [
    UiSwitchModule,
    DashboardCardModule,
    TileCardModule,
    ManagementTileModule,
    CommonModule,
    BotDashboardModule,
    AgentDashboardModule,
    EmailDashboardModule,
    BotCardsModule,

    FormsModule,
    ApiPerformanceModule,
    BotLicenseUsageModule,
    BotMenuUsageModule,
    BotPerformanceModule,
    BotStatisticsModule,
    FeedbackModule,
    HsmPerformanceModule,
    RepeatModule,
    SlaPerformanceModule,
    ParkingModule,
    AgentCardsModule,
    AgentStatusModule,
    TicketPerformanceModule,
    InteractionStatisticsModule,
    ChannelPerformanceModule,
    OtherInteractionModule,
    TasksModule,
    TopDispositionModule,
    TopPerformerModule,
    RepeatUniqueModule,
    BotFeedbackModule,

    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    DummyDashboardRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    HighchartsChartModule
  ],
  exports:[DummyDashboardComponent],
  schemas:[NO_ERRORS_SCHEMA]
})
export class DummyDashboardModule { }
