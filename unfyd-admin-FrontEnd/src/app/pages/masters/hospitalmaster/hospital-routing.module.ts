import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HospitalMasterComponent } from './hospitalmaster.component';

const routes: Routes = [
  {
    path: 'add',
    component: HospitalMasterComponent,
  },
  {
    path: 'update/:id',
    component: HospitalMasterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalModuleRoutingModule { }
