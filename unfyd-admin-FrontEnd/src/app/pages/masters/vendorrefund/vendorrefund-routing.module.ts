import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorrefundComponent } from './vendorrefund.component';

const routes: Routes = [
  {
    path: 'add',
    component: VendorrefundComponent,
  },
  {
    path: 'update/:id',
    component: VendorrefundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorrefundRoutingModule { }
