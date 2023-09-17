import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeeTypeComponent } from './fee-type.component';

const routes: Routes = [
  {
    path: 'list',
    component: FeeTypeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeeTypeRoutingModule { }