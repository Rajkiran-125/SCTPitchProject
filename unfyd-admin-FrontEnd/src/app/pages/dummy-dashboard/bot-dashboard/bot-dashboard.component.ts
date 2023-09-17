import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EChartsOption } from 'echarts';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';
import { botDashboardTabs } from 'src/app/global/json-data';
import { AgentDashboardComponent } from '../agent-dashboard/agent-dashboard.component';
import { ApiPerformanceComponent } from '../cards/api-performance/api-performance.component';
import { BotFeedbackComponent } from '../cards/bot-feedback/bot-feedback.component';
import { BotLicenseUsageComponent } from '../cards/bot-license-usage/bot-license-usage.component';
import { BotMenuUsageComponent } from '../cards/bot-menu-usage/bot-menu-usage.component';
import { BotPerformanceComponent } from '../cards/bot-performance/bot-performance.component';
import { BotStatisticsComponent } from '../cards/bot-statistics/bot-statistics.component';
import { FeedbackComponent } from '../cards/feedback/feedback.component';
import { HsmPerformanceComponent } from '../cards/hsm-performance/hsm-performance.component';
import { RepeatComponent } from '../cards/repeat/repeat.component';
import { EmailDashboardComponent } from '../email-dashboard/email-dashboard.component';

@Component({
  selector: 'app-bot-dashboard',
  templateUrl: './bot-dashboard.component.html',
  styleUrls: ['./bot-dashboard.component.scss']
})
export class BotDashboardComponent implements OnInit {
  edit:any=true;
  tabSelected: any;
  tab: any;
  configData: any;
  loader = false
  botDashboardTabs;
  value = 40;
  outof=100;
  options: EChartsOption = {};
  a= JSON.stringify(this.value) +  JSON.stringify(this.outof);
  tabSelectedComponent = ''
infocards = [
  {
    title:'entered',
    value:21000
  },
  {
    title:'closed',
    value:12000
  },
  {
    title:'active',
    value:2100
  },
  {
    title:'overruled',
    value:1050
  },
  {
    title:'transfer to agent',
    value:5850
  }
]

navbar = [
  {
    label:'botDashboard',
    component:BotDashboardComponent
  },
  {
    label:'agentDashboard',
    component:AgentDashboardComponent
  },
  {
    label:'emailDashboard',
    component:EmailDashboardComponent
  }
]
  botCards = [
    'repeat','bot-feedback','bot-license-usage','bot-menu-usage','bot-statistics','hsm-performance','api-performance','bot-performance']
 

  public tabs ={
    'repeat': RepeatComponent,
    'bot-feedback':BotFeedbackComponent,
    'bot-statistics' : BotStatisticsComponent,
    'hsm-performance':HsmPerformanceComponent,
    'api-performance': ApiPerformanceComponent,
    'bot-license-usage': BotLicenseUsageComponent,
    'bot-menu-usage' : BotMenuUsageComponent,
    'bot-performance' : BotPerformanceComponent,
  }

  constructor(private dialog: MatDialog, private common:CommonService,private api: ApiService){
    Object.assign(this, { botDashboardTabs});
    this.common.editDashboard$.subscribe(element=>{
      this.edit = element;
      if(this.edit){
        this.setDashboardCardData()
      }
    })
  }

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.getDashboardCardData()
    this.getGraphData()
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

  }

getGraphData(){
  this.common.hubControlEvent('Dashboard','click','','','','getGraphData');

this.options = {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        detail: {
        formatter: "{value}%",
        offsetCenter: ['0%', '8%'],
            color:"#ffffff",
        align:"center",
        fontSize:"12px"
      },
      color:"#ffffff",
      radius: "60%",

        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 0.5,
            borderColor: '#FFFFFF'
          }
        },
        axisLine: {
          lineStyle: {
            width: 5,
            shadowColor:"#FBAD17",
            opacity:0.5
          }
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 1
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
          distance: 5
        },
        data: [{
          value:12
        }
        ],
      }
    ]
  };

}

items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  drop(event: CdkDragDrop<any>) {
    // this.common.hubControlEvent('Dashboard','click','','',event,'drop');

    this.botCards[event.previousContainer.data.index] = event.container.data.item;
    this.botCards[event.container.data.index] = event.previousContainer.data.item;
  }

  enableEdit(){
    this.common.hubControlEvent('Dashboard','click','','','','enableEdit');

    this.edit = !this.edit;
  }

  changeTab(val) {
    this.common.hubControlEvent('Dashboard','click','','',val,'changeTab');

    this.tabSelected = val.label;
    this.tabSelectedComponent = val.component;
  }

  getDashboardCardData(){
    let obj = {
      "data": {
        "flag": "get",
        "filename": "dashboardCards",
        "processId": 1,
        "product": "BOT"
      }
    }
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj),'getDashboardCardData');

    this.api.post('branding', obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.botCards = JSON.parse(res.results.data)
      }
    })
}

setDashboardCardData(){
  let obj = {
    "data": {
      "flag": "insert",
      "filename": "dashboardCards",
      "processId": 1,
      "product": "BOT",
      "brandingjson":this.botCards
    }
  }
  this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj),'setDashboardCardData');

  this.api.post('branding', obj).subscribe(res => {
    this.loader = false;
    if (res.code == 200) {
    }
  })
}

  changeDashboardCard(i){
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(i),'changeDashboardCard');

    let cards = this.botCards;

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "selectDashboardCards",
        data:this.botCards
      },
      width: "300px",
    });
    dialogRef.afterClosed().subscribe((status) => {

    })
  }
}
