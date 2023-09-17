import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HawkerComplaintComponent } from './hawker-complaint.component';

const routes: Routes = [
  {
    path: 'list',
    component: HawkerComplaintComponent,
    data : { title: 'Hawker Complaint'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HawkerComplaintRoutingModule { }
