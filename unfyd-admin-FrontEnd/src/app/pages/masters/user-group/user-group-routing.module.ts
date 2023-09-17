import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGroupComponent } from './user-group.component';

const routes: Routes = [
  {
    path: 'add',
    component: UserGroupComponent,
  },
  {
    path: 'update/:id',
    component: UserGroupComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserGroupRoutingModule { }
