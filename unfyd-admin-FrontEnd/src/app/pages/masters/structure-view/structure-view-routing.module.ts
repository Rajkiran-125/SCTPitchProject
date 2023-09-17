import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructureViewComponent } from './structure-view.component';

const routes: Routes = [
  {path : 'view', component:StructureViewComponent},
  {path : 'add', loadChildren : () => import('./structure-form/structure-form.module').then(e => e.StructureFormModule)},
  {path : 'update/:id', loadChildren : () => import('./structure-form/structure-form.module').then(e => e.StructureFormModule)},
  {path : '**', redirectTo : 'view'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructureViewRoutingModule { }
