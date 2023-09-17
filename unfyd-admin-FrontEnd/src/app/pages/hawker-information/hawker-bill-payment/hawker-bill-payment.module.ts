import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HawkerBillPaymentComponent } from './hawker-bill-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
@NgModule({
  declarations: [
    HawkerBillPaymentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
  ]
})
export class HawkerBillPaymentModule { }
