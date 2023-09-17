import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {
  loader: boolean = false;
  data = [
    {
      label:'Total Tasks',
      value:'0'
    },
    {
      label:'Assigned',
      value:'0'
    },
    {
      label:'Overdue',
      value:'0'
    },
    {
      label:'Completed',
      value:'0'
    },
    {
      label:'SLA Breached',
      value:'0'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }


}
