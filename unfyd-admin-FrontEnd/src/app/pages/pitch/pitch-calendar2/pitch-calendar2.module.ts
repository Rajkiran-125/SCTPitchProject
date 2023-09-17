import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PitchCalendar2RoutingModule } from './pitch-calendar2-routing.module';
import { PitchCalendar2Component } from './pitch-calendar2.component';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    PitchCalendar2Component
  ],
  imports: [
    CommonModule,
    PitchCalendar2RoutingModule,
    FormsModule,
    NgbModule,
    NgbModalModule,
    // BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  
  ]
})
export class PitchCalendar2Module { }
