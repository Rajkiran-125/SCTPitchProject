import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, OnDestroy, Renderer2, ElementRef, Injectable,} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, startOfWeek,} from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView,  CalendarMonthViewComponent} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { PitchCommonService } from 'src/app/global/pitch-common.service';
import moment from 'moment';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-pitch-calendar2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pitch-calendar2.component.html',
  styleUrls: ['./pitch-calendar2.component.scss'],
})
export class PitchCalendar2Component implements OnInit, OnDestroy {
  yourNewColumnData: any[];

  @ViewChild('modalContent', { static: true }) modalContent:any;

  view: CalendarView = CalendarView.Week;
 

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  randomColors: EventColor[] = [
    { primary: '#ad2121', secondary: '#00FFFF' },   // Red
    { primary: '#1e90ff', secondary: '#9932CC' },   // Blue
    { primary: '#e3bc08', secondary: '#FF7F50' },   // Yellow
    { primary: '#00a300', secondary: '#FFD700' },   // Green
    { primary: '#ff6f00', secondary: '#FF69B4' },   // Orange
  ];

  modalData: {
    action: string;
    event: any;
  };

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: any }): void => {
  //       this.handleEvent('Edited', event);
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: any }): void => {
  //       this.events = this.events.filter((iEvent) => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     },
  //   },
  // ];

  refresh = new Subject<void>();

  calendarEventsFromCampaign: any[] = [];
  private subscription: Subscription;

  // events: any = [
  //   {
  //     start: startOfDay(new Date(this.calendarEventsFromCampaign.StartDateTime)),
  //     end: endOfDay(new Date()),
  //     title: 'A 3 day event',
  //     color: { ...colors.red },
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   }
  // ];
  events: any[] = []; 
  selectedEvent: any; 

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private pitchCommon:PitchCommonService, private renderer: Renderer2, 
              private el: ElementRef, private router:Router, private api:ApiService) { }
            
  ngOnInit(){ 
    console.log("Nitesh");
    this.subscription = this.pitchCommon.dataObservable.subscribe((data:any) => {
      this.calendarEventsFromCampaign = data;
      this.updateEventsArray();
    });

  }

  updateEventsArray() {
    // Map the data structure to match events array structure
    const mappedEvents = this.calendarEventsFromCampaign.map(event => ({
      
      eventId:event?.CampaignID,
       start: new Date(event.StartDateTime), 
      end: new Date(event.end).getDate() + 1 ,
      title: event?.CampaignName,
      Channel:event?.Channel == 1 ? 'WhatsApp' : event?.Channel == 34 ? 'Email' : 'SMS', 
      ChannelSource:event?.Channel == 1 ? 'WhatsApp' : event?.Channel == 34 ? 'Email' : 'SMS', 
      color: this.getRandomColor(),
      extraColumn: 'Extra Column Data',
      // actions: [...event.actions],
      // allDay: event?.allDay,
      // resizable: { ...event.resizable },
      // draggable: event?.draggable,
    }));
    this.events = mappedEvents;
  }
 
  lastRandomIndex = -1;
  getRandomColor(): EventColor {
    let randomIndex = Math.floor(Math.random() * this.randomColors.length);
    while (randomIndex === this.lastRandomIndex) {
      randomIndex = Math.floor(Math.random() * this.randomColors.length);
    }
    this.lastRandomIndex = randomIndex; // Store the current random index
    return this.randomColors[randomIndex];
  }


  dayClicked({ date, events }: { date: Date; events: any }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({event, newStart, newEnd,}: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
     this.handleEvent('Dropped or resized', event, null);
  }

  handleEvent(action: string, event: any, eventColor: EventColor): void {
    console.log(event);
   
    // if (action === 'Hovered') {
    //   this.modalData = { event, action };
    //   this.modal.open(this.modalContent, { size: 'lg' });
    // }
    this.modalData = { event, action };
     this.modal.open(this.modalContent, { size: 'lg' });
     console.log(this.modalData);
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: any) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openCampaignDetailsView(CampaignId:number){
    // this.api.campaignListTableIndex = index;
    if(this.router.url == '/pitch/calendar/d'){   
         this.api.campaignId = CampaignId; 
         console.log(this.api.campaignId);   
        this.router.navigate([`pitch/campaign/view/${CampaignId}`])
    }
    //  else {
    //     this.router.navigate([`pitch/campaign/add`])
    // }
}


   


  ngOnDestroy() {
    this.subscription.unsubscribe();
 
  }


}
