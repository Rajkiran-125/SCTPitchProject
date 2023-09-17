import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantsummaryComponent } from './tenantsummary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { TenantRoutingModule } from '../tenant-routing.module';
import { TenantsummaryRoutingModule } from './tenantsummary-routing.module';



@NgModule({
  declarations: [
    // TenantsummaryComponent
  ],
  imports: [
    TenantsummaryRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TenantRoutingModule,
    MaterialModule,
    LoaderModule,
    StepsModule,  
    OrderModule,
    CommonModule
  ]
})
export class TenantsummaryModule { }
