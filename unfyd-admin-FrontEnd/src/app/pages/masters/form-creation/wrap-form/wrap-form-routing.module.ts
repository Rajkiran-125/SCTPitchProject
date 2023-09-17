import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrapFormComponent } from './wrap-form.component';

const routes: Routes = [
  {
    path: "",
    component: WrapFormComponent,
  },
  // {
  //   path: "add",
  //   component: WrapFormComponent,
  // },
  // {
  //   path: "update/:id",
  //   component: WrapFormComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WrapFormRoutingModule { }
