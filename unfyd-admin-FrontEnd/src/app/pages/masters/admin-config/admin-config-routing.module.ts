import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminConfigComponent } from './admin-config.component';

const routes: Routes = [
  {
    path: "add",
    component: AdminConfigComponent,
  },
  {
    path: "update/:id",
    component: AdminConfigComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminConfigRoutingModule { }
