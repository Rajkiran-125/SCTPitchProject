import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerproductComponent } from './customerproduct.component';

const routes: Routes = [
    {
        path: 'add',
        component: CustomerproductComponent,
        
      },
      {
        path: 'update/:id',
        component: CustomerproductComponent,
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerproductRoutingModule { }
