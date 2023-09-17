import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskGroupViewComponent } from './task-group-view.component';

const routes: Routes = [{
  path: '', component : TaskGroupViewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskGroupViewRoutingModule { }
