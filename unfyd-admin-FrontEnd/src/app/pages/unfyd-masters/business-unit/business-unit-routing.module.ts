import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessUnitComponent } from './business-unit.component';

const routes: Routes = [
  {
    path:'list',
    component:BusinessUnitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessUnitRoutingModule { }
