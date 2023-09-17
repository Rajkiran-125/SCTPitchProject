import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PitchCalendar2Component } from './pitch-calendar2.component';

const routes: Routes = [
  {path : 'd',data:{title:'calendar'},component:PitchCalendar2Component},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PitchCalendar2RoutingModule { }
