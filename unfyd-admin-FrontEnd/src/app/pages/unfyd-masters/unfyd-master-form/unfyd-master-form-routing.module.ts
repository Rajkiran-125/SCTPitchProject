import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnfydMasterFormComponent } from './unfyd-master-form.component';

const routes: Routes = [
  {
    path:'',
    component:UnfydMasterFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnfydMasterFormRoutingModule { }
