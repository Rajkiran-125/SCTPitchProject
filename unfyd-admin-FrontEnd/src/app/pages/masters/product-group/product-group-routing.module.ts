import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductGroupComponent } from './product-group.component';
const routes: Routes = [
    {
        path: 'add',
        component: ProductGroupComponent,        
      },
      {
        path: 'update/:id',
        component: ProductGroupComponent,
      },
      {
        path: 'update/:category/:id',
        component: ProductGroupComponent,
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductGroupRoutingModule { }
