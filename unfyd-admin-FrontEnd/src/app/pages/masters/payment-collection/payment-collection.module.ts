import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { PaymentModule } from 'src/app/components/payment/payment.module';
import { PaymentCollectionRoutingModule } from './payment-collection-routing.module';
import { PaymentCollectionComponent } from './payment-collection.component';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { CollectionSummaryComponent } from '../collection-summary/collection-summary.component';

@NgModule({
  declarations: [
    PaymentCollectionComponent,
    CollectionSummaryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    FilterModule,
    PaymentModule,
    // CollectionSummaryModule,
    StepsModule,
    PaymentCollectionRoutingModule
  ]
})
export class PaymentCollectionModule { }
