import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorMastersComponent } from './vendor-masters.component'

const routes: Routes = [
  {
    path: 'list',
    component: VendorMastersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorMastersRoutingModule { }
