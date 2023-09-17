import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TenantsummaryComponent } from './tenantsummary.component';

const routes: Routes = [
  // {
  //   path: ':id',
  //   component: TenantsummaryComponent,
  // }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantsummaryRoutingModule { }
