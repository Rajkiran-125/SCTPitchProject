import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockContentComponent } from './block-content.component';

const routes: Routes = [
  {
    path:'add',
    component: BlockContentComponent,
  },
  {
    path: 'update/:id',
    component: BlockContentComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlockContentRoutingModule { }
