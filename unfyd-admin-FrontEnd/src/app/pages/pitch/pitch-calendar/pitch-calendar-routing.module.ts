import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PitchCalendarComponent } from './pitch-calendar.component';

const routes: Routes = [
  {path : 'c',data:{title:'calendar'},component:PitchCalendarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PitchCalendarRoutingModule { }
