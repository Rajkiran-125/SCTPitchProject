import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pitchDateFormat'
})
export class PitchDateFormatPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(dateTime): string {
    if (!dateTime) {
      return ''; // Handle null or undefined dateTime
    }else{
      const utcDate = new Date(dateTime);
      const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
      const formattedDateTime = this.datePipe.transform(localDate, 'dd/MM/yyyy HH:mm:ss');
      //const formattedDateTime = this.datePipe.transform(localDate, 'dd/MM/yyyy hh:mm:ss a');
      console.log(formattedDateTime);
      return formattedDateTime || '';
    } 
  }

}
