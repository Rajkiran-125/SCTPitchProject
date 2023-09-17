import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskGroupComponent } from './task-group.component';
const routes: Routes = [
  {
    path: 'add',
    component: TaskGroupComponent,
  },
  {
    path: 'update/:id',
    component: TaskGroupComponent,
  },
  {
    path: 'view/:id',
    loadChildren : () => import('../task-group-view/task-group-view.module').then(mod => mod.TaskGroupViewModule)
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskGroupComponentRoutingModule { }
