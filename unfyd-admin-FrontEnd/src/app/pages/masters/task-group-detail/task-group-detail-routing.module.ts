import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskGroupDetailComponent } from './task-group-detail.component';
const routes: Routes = [
  {
    path: 'edit',
    component: TaskGroupDetailComponent,
  },
  {
    path: 'update/:id',
    component: TaskGroupDetailComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskGroupDetailComponentRoutingModule { }
