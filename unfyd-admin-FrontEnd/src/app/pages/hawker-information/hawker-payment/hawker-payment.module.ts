import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HawkerPaymentComponent } from './hawker-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';



@NgModule({
  declarations: [
    HawkerPaymentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule
    ]
})
export class HawkerPaymentModule { }
