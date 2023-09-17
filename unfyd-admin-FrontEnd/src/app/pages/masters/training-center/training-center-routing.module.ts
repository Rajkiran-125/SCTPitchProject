import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingCenterComponent } from './training-center.component';

const routes: Routes = [
  {
    path: 'add',
    component: TrainingCenterComponent,
  },
  {
    path: 'update/:id',
    component: TrainingCenterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingCenterRoutingModule { }
