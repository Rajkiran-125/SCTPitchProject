import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HawkerHomeComponent } from './hawker-home/hawker-home.component';
import { HawkerInformationComponent } from './hawker-information.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MastersRoutingModule } from '../masters/masters-routing.module';
import { HawkerInformationRoutingModule } from './hawker-information-routing.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { HawkerHomeModule } from './hawker-home/hawker-home.module';
import { HawkerBillPaymentModule } from './hawker-bill-payment/hawker-bill-payment.module';
import { HawkerTrainingModule } from './hawker-training/hawker-training.module';
import { HawkerGrievancesModule } from './hawker-grievances/hawker-grievances.module';
import { HawkerPaymentModule } from './hawker-payment/hawker-payment.module';
@NgModule({
  declarations: [
    HawkerInformationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MastersRoutingModule,
    MaterialModule,
    LoaderModule,
    HawkerHomeModule,
    HawkerGrievancesModule,
    HawkerBillPaymentModule,
    HawkerPaymentModule,
    HawkerInformationRoutingModule,
    HawkerTrainingModule,
    StepsModule
  ]
})
export class HawkerInformationModule { }
