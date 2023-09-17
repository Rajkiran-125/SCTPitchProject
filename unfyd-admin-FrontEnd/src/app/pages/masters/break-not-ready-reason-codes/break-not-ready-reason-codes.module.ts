import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreakNotReadyReasonCodesRoutingModule } from './break-not-ready-reason-codes-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { BreakNotReadyReasonCodesComponent } from './break-not-ready-reason-codes.component';
@NgModule({
  declarations: [BreakNotReadyReasonCodesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreakNotReadyReasonCodesRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class BreakNotReadyReasonCodesModule { }
