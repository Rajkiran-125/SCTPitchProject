import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HawkersRoutingModule } from './hawkers-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination'; 
// import { TitleCaseDirective } from 'src/app/global/title-case.directive';
import { PaymentModule } from 'src/app/components/payment/payment.module';
import { StockModule } from 'src/app/components/stock/stock.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { OtherDetailsComponent } from './other-details/other-details.component';
import { KycComponent } from './kyc/kyc.component';
import { HawkerDetailsComponent } from './hawker-details/hawker-details.component';
import { PccDetailsComponent } from './pcc-details/pcc-details.component';
import { MedicalDetailsComponent } from './medical-details/medical-details.component';
import { TrainingDetailsComponent } from './training-details/training-details.component';
import { OrderModule } from 'ngx-order-pipe';


@NgModule({
  declarations: [ 
    PersonalDetailsComponent,
    ContactDetailsComponent,
    OtherDetailsComponent,
    KycComponent,
    HawkerDetailsComponent,
    PccDetailsComponent,
    MedicalDetailsComponent,
    TrainingDetailsComponent,
    // TitleCaseDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HawkersRoutingModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    PaymentModule,
    StockModule,
    StepsModule,
    LoaderModule,
    OrderModule,
    FilterModule
  ]
})
export class HawkersModule { }
