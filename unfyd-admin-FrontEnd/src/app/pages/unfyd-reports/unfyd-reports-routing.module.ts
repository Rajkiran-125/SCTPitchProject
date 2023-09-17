import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InteractionDetailsComponent } from './interaction-details/interaction-details.component';

const routes: Routes = [
  {
    path: 'interaction-details',
    data: { title: 'Interaction Details' },
    component:InteractionDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnfydReportsRoutingModule { }
