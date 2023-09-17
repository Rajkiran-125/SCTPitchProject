import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role.component';
const routes: Routes = [
  {
    path: 'add',
    component: RoleComponent,
  },
  {
    path: 'update/:id',
    component: RoleComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
