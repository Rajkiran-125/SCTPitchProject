import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';




@Component({
  selector: 'app-pitch-calendar',
  templateUrl: './pitch-calendar.component.html',
  styleUrls: ['./pitch-calendar.component.scss'],
})
export class PitchCalendarComponent implements OnInit {
  events:any = [
    {title:'Present', date:'2023-07-26', color:'#E9573E'},
    {title:'Present', date:'2023-07-28', color:'#36BC9B'},
    {title:'Absent', date:'2023-07-30', color:'#9378D9'},
    {
      title: 'Festivals',
      start: '2023-07-12',
      end: '2023-07-15',
      color:'#8CC051'
      // extendedProps: {
      //   department: 'BioChemistry'
      // },
      // description: 'Lecture'
    }
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events:this.events,
  };

 
  constructor() { }

  ngOnInit(): void {
  }


}
