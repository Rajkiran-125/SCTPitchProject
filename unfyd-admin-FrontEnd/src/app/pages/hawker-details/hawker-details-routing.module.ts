import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HawkerDetailsComponent } from './hawker-details.component';

const routes: Routes = [
  {
    path:'',
    component:HawkerDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HawkerDetailsRoutingModule { }
