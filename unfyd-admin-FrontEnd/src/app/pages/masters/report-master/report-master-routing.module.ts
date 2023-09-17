import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportMasterComponent } from './report-master.component';


const routes: Routes = [
  {
    path: 'add',
    component: ReportMasterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportMasterRoutingModule { }
