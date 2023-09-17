import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleSubtypeComponent } from './role-subtype.component';
const routes: Routes = [
  {
    path: 'add',
    component: RoleSubtypeComponent,
  },
  {
    path: 'update/:id',
    component: RoleSubtypeComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleSubtypeRoutingModule { }
