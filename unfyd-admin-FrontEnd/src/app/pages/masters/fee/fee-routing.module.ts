import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeeComponent } from './fee.component';

const routes: Routes = [
  {
    path: 'add',
    component: FeeComponent,
  },
  {
    path: 'update/:id',
    component: FeeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeRoutingModule { }
