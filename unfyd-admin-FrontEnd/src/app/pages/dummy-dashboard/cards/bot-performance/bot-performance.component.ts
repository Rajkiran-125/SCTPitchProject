import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';


@Component({
  selector: 'app-bot-performance',
  templateUrl: './bot-performance.component.html',
  styleUrls: ['./bot-performance.component.scss']
})
export class BotPerformanceComponent implements OnInit {
  loader: boolean = false;
  data = [
    {
      label:'Avg Response Time',
      value:'00:00:07'
    },
    {
      label:'Avg Conversation Time',
      value:'00:00:07'
    },
    {
      label:'Longest Conversation Time',
      value:'00:00:08'
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }


  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
