import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { TenantComponent } from './tenant.component';
import { TenantRoutingModule } from './tenant-routing.module';
import { DatePipe } from '@angular/common';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { OrderModule } from 'ngx-order-pipe';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { UploadLicenseComponent } from './upload-license/upload-license.component';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { UploadLicenseModule } from './upload-license/upload-license.module';
import { TenantsummaryModule } from './tenantsummary/tenantsummary.module';
import { TenantsummaryComponent } from './tenantsummary/tenantsummary.component';
import { MatChipsModule } from '@angular/material/chips';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
  // import { NgSelectModule } from "@ng-select/ng-select";



@NgModule({
  declarations: [
    TenantComponent,
    BillingDetailsComponent,
    ProductDetailsComponent,
    TenantsummaryComponent
    // UploadLicenseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TenantRoutingModule,
    MaterialModule,
    LoaderModule,
    StepsModule,  
    OrderModule,
    UploadLicenseModule,
    TenantsummaryModule,
    MatChipsModule
    // AngularMultiSelectModule
  ],
  providers: [DatePipe]
})
export class TenantModule { }
