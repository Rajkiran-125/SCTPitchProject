import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabelComponent} from './label.component';

const routes: Routes = [
  // {
  //   path: 'add',
  //   component: LabelComponent ,
  // },
  // {
  //   path: 'update/:id',
  //   component: LabelComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabelRoutingModule { }
