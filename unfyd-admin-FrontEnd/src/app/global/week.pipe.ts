import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'week'
})
export class WeekPipe implements PipeTransform {

  transform(date: Date | string): any {
    let currentDate:any = new Date(date);
    let startDate:any = new Date(currentDate.getFullYear(), 0, 1);
    var days:any = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    var weekNumber = Math.ceil(days / 7);
    return weekNumber + 1;
  }

}
