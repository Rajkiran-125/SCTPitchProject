import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessHoursComponent } from './business-hours.component';

const routes: Routes = [
  {
    path:'list',
    component:BusinessHoursComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessHoursRoutingModule { }
