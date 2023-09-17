import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DummyDashboardComponent } from './dummy-dashboard.component';

const routes: Routes = [
  {path:'',component:DummyDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DummyDashboardRoutingModule { }
