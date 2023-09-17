import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { TenantComponent } from './tenant.component';
import { TenantsummaryComponent } from './tenantsummary/tenantsummary.component';
import { UploadLicenseComponent } from './upload-license/upload-license.component';

const routes: Routes = [
  {
    path: 'add',
    component: TenantComponent,
  },
  {
    path: 'update/:id',
    component: TenantComponent,
  },
  {
    path: 'billing-details/:id',
    component: BillingDetailsComponent,
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'upload-license/:id',
    component: UploadLicenseComponent,
  },
  {
    path: 'tenantSummary/:id',
    // loadChildren: () => import('./tenantsummary/tenantsummary.module').then(mod => mod.TenantsummaryModule),
    component:TenantsummaryComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantRoutingModule { }
