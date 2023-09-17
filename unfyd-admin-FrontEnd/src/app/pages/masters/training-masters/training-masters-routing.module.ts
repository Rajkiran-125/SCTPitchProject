import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingMastersComponent } from './training-masters.component';

const routes: Routes = [
  {
    path: 'list',
    component: TrainingMastersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingMastersRoutingModule { }
