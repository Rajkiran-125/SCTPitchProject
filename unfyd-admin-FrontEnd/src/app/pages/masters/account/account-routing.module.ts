import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component'; 
import { ContactInfoViewComponent } from './contact-info-view/contact-info-view.component';
import { ProductInfoViewComponent } from './product-info-view/product-info-view.component';

const routes: Routes = [
  {
    path: "view",
    component: AccountComponent,
  },
  {
    path: "productView/:id",
    component: ProductInfoViewComponent,
  },
  {
    path: "contactView/:id",
    component: ContactInfoViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
