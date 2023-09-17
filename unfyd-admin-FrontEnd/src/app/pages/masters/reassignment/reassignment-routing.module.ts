import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReassignmentComponent } from './reassignment.component';

const routes: Routes = [
  {
    path: 'list',
    component: ReassignmentComponent,
    data : { title: 'Reassignment'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReassignmentRoutingModule { }
