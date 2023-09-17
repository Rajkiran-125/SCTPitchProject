import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructureFormComponent } from './structure-form.component';

const routes: Routes = [
  {path : '', component:StructureFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructureFormRoutingModule { }
