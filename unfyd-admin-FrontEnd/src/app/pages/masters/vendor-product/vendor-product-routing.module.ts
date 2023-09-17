import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorProductComponent } from './vendor-product.component';

const routes: Routes = [
  {
    path: 'add',
    component: VendorProductComponent,
  },
  {
    path: 'update/:id',
    component: VendorProductComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorProductRoutingModule { }
