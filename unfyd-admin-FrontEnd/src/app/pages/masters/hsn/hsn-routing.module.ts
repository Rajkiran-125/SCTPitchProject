import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HsnComponent } from './hsn.component';

const routes: Routes = [
  {
    path: 'add',
    component: HsnComponent,
  },
  {
    path: 'update/:id',
    component: HsnComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HsnRoutingModule { }
