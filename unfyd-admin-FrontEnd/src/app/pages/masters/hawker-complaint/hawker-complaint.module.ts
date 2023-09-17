import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { PaymentModule } from 'src/app/components/payment/payment.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { HawkerComplaintRoutingModule } from './hawker-complaint-routing.module';
import { HawkerComplaintComponent } from './hawker-complaint.component';



@NgModule({
  declarations: [
    HawkerComplaintComponent
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
    HawkerComplaintRoutingModule
  ]
})
export class HawkerComplaintModule { }
