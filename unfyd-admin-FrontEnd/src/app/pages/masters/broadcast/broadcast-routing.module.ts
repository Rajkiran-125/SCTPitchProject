import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BroadcastComponent } from './broadcast.component';

const routes: Routes = [
  {
    path: 'view',
    component: BroadcastComponent
  },
  {
    path: 'add',
    component: BroadcastComponent
  },
  {
    path: 'edit',
    component: BroadcastComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BroadcastRoutingModule { }
