import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAudienceComponent } from './add-audience.component';

const routes: Routes = [
  {path:'',component:AddAudienceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAudienceRoutingModule { }
