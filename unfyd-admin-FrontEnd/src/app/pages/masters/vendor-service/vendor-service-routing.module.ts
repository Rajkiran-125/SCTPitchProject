import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorServiceComponent } from './vendor-service.component';

const routes: Routes = [
  {
    path: 'add',
    component: VendorServiceComponent,
  },
  {
    path: 'update/:id',
    component: VendorServiceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorServiceRoutingModule { }
