import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliceStationComponent } from './police-station.component';

const routes: Routes = [
  {
    path: 'add',
    component: PoliceStationComponent,
  },
  {
    path: 'update/:id',
    component: PoliceStationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliceStationRoutingModule { }
