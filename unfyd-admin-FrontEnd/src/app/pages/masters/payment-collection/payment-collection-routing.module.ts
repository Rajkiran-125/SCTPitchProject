import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentCollectionComponent } from './payment-collection.component';

const routes: Routes = [
  {
    path: 'list',
    component: PaymentCollectionComponent,
    data : { title: 'Payment Collection'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentCollectionRoutingModule { }
