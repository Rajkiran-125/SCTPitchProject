import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from './common.service';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  clientconfig:any
  TimeZoneFinal
  DayLightSavingTime: any;
  DateFormat
  TimeFormat: any;
  SetDefaultDateTime: any;
  localization: any;
  dateTimeFormat: string;

  constructor( private common:CommonService ){

    this.common.localizationInfo$.subscribe((data:any)=>{

      this.TimeZoneFinal=data.selectedTimeZoneFormat.substring(data?.selectedTimeZoneFormat.indexOf("(") + 4, data?.selectedTimeZoneFormat.indexOf(")"))
        this.DayLightSavingTime=data.selectedDayLightSavingTime
        this.DateFormat=data.selectedDateFormats
        this.TimeFormat=data.selectedTimeFormats
        this.dateTimeFormat=this.DateFormat+" "+this.TimeFormat
    })
  }
  transform(date: Date | string, format: string = this.dateTimeFormat): string {
    let t = new Date(date);
    let t1 = t.getTimezoneOffset();
    let t2 = t.getTime();
    let t3 = new Date(t2 + (t1) * 60000);
    return new DatePipe('en-US').transform(t, format,this.TimeZoneFinal);
}

}
