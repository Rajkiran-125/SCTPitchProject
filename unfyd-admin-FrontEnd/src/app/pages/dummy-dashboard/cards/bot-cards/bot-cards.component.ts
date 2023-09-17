import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { EChartsOption } from "echarts";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from "src/app/global/common.service";


@Component({
  selector: "app-bot-cards",
  templateUrl: "./bot-cards.component.html",
  styleUrls: ["./bot-cards.component.scss"],
})
export class BotCardsComponent implements OnInit {
  value = 40;
  outof = 100;
  userDetails: any;
  options1: EChartsOption = {};
  options2: EChartsOption = {};
  options3: EChartsOption = {};
  options4: EChartsOption = {};
  options5: EChartsOption = {};

  a = JSON.stringify(this.value) + JSON.stringify(this.outof);

  infocards = [
    {
      title: "entered",
      value: 21000,
    },
    {
      title: "closed",
      value: 12000,
    },
    {
      title: "active",
      value: 2100,
    },
    {
      title: "overruled",
      value: 1050,
    },
    {
      title: "agent transferred",
      value: 5850,
    },
  ];

  constructor(public auth: AuthService,public dialog: MatDialog,public common: CommonService) {}

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.getGraphData();
    this.common.hubControlEvent('Dashboard','click','pageloadend','pageloadend','','ngOnInit');

  }

  getGraphData() {
    this.common.hubControlEvent('Dashboard','click','','','','getGraphData');

    this.options1 = {
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          detail: {
            formatter: "{value}%",
            offsetCenter: ["0%", "8%"],
            color: "#ffffff",
            align: "center",
            fontSize: "12px",
          },
          color: "#ffffff",
          radius: "60%",

          pointer: {
            show: false,
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 0.5,
              borderColor: "#FFFFFF",
            },
          },
          axisLine: {
            lineStyle: {
              width: 5,
              shadowColor: "#FBAD17",
              opacity: 0.5,
            },
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 1,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            distance: 5,
          },
          data: [
            {
              value: 12,
            },
          ],
        },
      ],
    };

    this.options2 = {
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          detail: {
            formatter: "{value}%",
            offsetCenter: ["0%", "8%"],
            color: "#ffffff",
            align: "center",
            fontSize: "12px",
          },
          color: "#ffffff",
          radius: "60%",

          pointer: {
            show: false,
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 0.5,
              borderColor: "#FFFFFF",
            },
          },
          axisLine: {
            lineStyle: {
              width: 5,
              shadowColor: "#FBAD17",
              opacity: 0.5,
            },
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 1,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            distance: 5,
          },
          data: [
            {
              value: 12,
            },
          ],
        },
      ],
    };

    this.options3 = {
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          detail: {
            formatter: "{value}%",
            offsetCenter: ["0%", "8%"],
            color: "#ffffff",
            align: "center",
            fontSize: "12px",
          },
          color: "#ffffff",
          radius: "60%",

          pointer: {
            show: false,
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 0.5,
              borderColor: "#FFFFFF",
            },
          },
          axisLine: {
            lineStyle: {
              width: 5,
              shadowColor: "#FBAD17",
              opacity: 0.5,
            },
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 1,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            distance: 5,
          },
          data: [
            {
              value: 12,
            },
          ],
        },
      ],
    };

    this.options4 = {
      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          detail: {
            formatter: "{value}%",
            offsetCenter: ["0%", "8%"],
            color: "#ffffff",
            align: "center",
            fontSize: "12px",
          },
          color: "#ffffff",
          radius: "60%",

          pointer: {
            show: false,
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 0.5,
              borderColor: "#FFFFFF",
            },
          },
          axisLine: {
            lineStyle: {
              width: 5,
              shadowColor: "#FBAD17",
              opacity: 0.5,
            },
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 1,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            distance: 5,
          },
          data: [
            {
              value: 12,
            },
          ],
        },
      ],
    };

    this.options5 = {
      xAxis: {
        type: "category",
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff",
            width: 2,
          },
        },
      },
      tooltip: {
        confine: true,
        trigger: "axis",
        formatter: "{c}",
        borderWidth: 0,
        padding: 5,
      },
      yAxis: {
        type: "value",
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#ffffff",
            width: 2,
          },
        },
        splitLine: {
          show: false,
        },
      },
      grid: {
        top: "5%",
        left: "0%",
        right: "0%",
        bottom: "5%",
      },

      series: [
        {
          data: [20, 20, 10, 8, 1, 5, 15],
          type: "line",
          symbolSize: 5,
          color: "#ffffff",
          lineStyle: {
            color: "#ffffff",
            width: 2,
            type: "solid",
          },
          itemStyle: {
          },
        },
      ],
    };
  }

  openDrillDown(title,action){
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(title,action),'openDrillDown');

    let sp ='UNFYD_ADM_REALTIMEDASHBOARD_Details_V2';
    var obj = {
      data: {
          spname: sp,
          parameters: {
            ACTION:action,
            PROCESSID: this.userDetails.Processid,
            CHANNELID:'',
            CHANNELSOURCEID:'',
            SKILLID:'',
            GROUPID:'',
            ADMINID:this.userDetails.Id
          }
      }
  }

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
          type: 'openDrillDown',
          title:title,
          req:obj,
      },
      width: '50vw',
  });
  dialogRef.afterClosed().subscribe(status => {

  })
  }
}
