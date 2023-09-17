import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PincodeComponent } from './pincode.component';


const routes: Routes = [
  {
    path: 'add',
    component: PincodeComponent,
  },
  {
    path: 'update/:id',
    component: PincodeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PincodeRoutingModule { }
