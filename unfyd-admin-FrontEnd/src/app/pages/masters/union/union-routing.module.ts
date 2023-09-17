import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnionComponent } from './union.component';

const routes: Routes =[
  {
    path: 'add',
    component: UnionComponent,
  },
  {
    path: 'update/:id',
    component: UnionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnionRoutingModule { }
