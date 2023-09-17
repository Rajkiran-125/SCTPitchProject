import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PitchCalendarRoutingModule } from './pitch-calendar-routing.module';
import { PitchCalendarComponent } from './pitch-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';



@NgModule({
  declarations: [
    PitchCalendarComponent
  ],
  imports: [
    CommonModule,
    PitchCalendarRoutingModule,
    FullCalendarModule,
  
  ],
  exports:[PitchCalendarComponent]
})
export class PitchCalendarModule { }
