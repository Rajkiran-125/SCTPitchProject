import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { MaterialModule } from 'src/app/global/material.module';
import { DashboardComponent } from './dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { DashboardTrainingComponent } from './dashboard-training/dashboard-training.component';
import { DashboardHawkerApplicationComponent } from './dashboard-hawker-application/dashboard-hawker-application.component';
import { DashboardGrievanceComponent } from './dashboard-grievance/dashboard-grievance.component';
import { DashboardTopPerformerComponent } from './dashboard-top-performer/dashboard-top-performer.component';
import { DashboardPaymentCollectionComponent } from './dashboard-payment-collection/dashboard-payment-collection.component';
import { DashboardOverallCollectionComponent } from './dashboard-overall-collection/dashboard-overall-collection.component';
import { DashboardRegistrationRatioComponent } from './dashboard-registration-ratio/dashboard-registration-ratio.component';
import { DashboardTopPerformerByLocationComponent } from './dashboard-top-performer-by-location/dashboard-top-performer-by-location.component';


@NgModule({
  declarations: [ 
    DashboardComponent, DashboardTrainingComponent, DashboardHawkerApplicationComponent, DashboardGrievanceComponent, DashboardTopPerformerComponent, DashboardPaymentCollectionComponent, DashboardOverallCollectionComponent, DashboardRegistrationRatioComponent, DashboardTopPerformerByLocationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    DashboardRoutingModule,
    MaterialModule,
    LoaderModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ]
})
export class DashboardModule { }
