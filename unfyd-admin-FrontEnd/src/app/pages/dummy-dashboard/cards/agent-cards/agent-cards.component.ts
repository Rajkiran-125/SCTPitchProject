import { Component, OnInit } from "@angular/core";
import { EChartsOption } from "echarts";
import { CommonService } from "src/app/global/common.service";
import { AuthService } from 'src/app/global/auth.service';
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { ApiService } from "src/app/global/api.service";

@Component({
  selector: "app-agent-cards",
  templateUrl: "./agent-cards.component.html",
  styleUrls: ["./agent-cards.component.scss"],
})
export class AgentCardsComponent implements OnInit {
  userDetails: any;
  value = 40;
  outof = 100;
  trainingData :any
  options1: EChartsOption = {};
  options3: EChartsOption = {};
  options4: EChartsOption = {};
  options5: EChartsOption = {};
  data: any = {
    TotalEntered: 0,
    EnteredToday: 0,
    EnteredPrevious: 0,
    TotalClosed: 0,
    ClosedToday: 0,
    PendingQueueClosed: 0,
    TotalQueue: 0,
    LongestInQueue: "00:00:00",
    AvgQueueTime: "00:00:00",
    Abandoned: null,
    Overruled: null,
    SLA: "",
    AHT: "00:00:00",
    ART: "00:00:00",
    Queue_Webchat: 0,
    Queue_Whatsapp: 0,
    Queue_SMS: 0,
    Queue_Viber: 0,
    Queue_Email: 0,
    TransferToSkill: 0,
    TransferToAgent: 0,
    Requeue: 0,
    Transfer: 0,
    OfflineCarryForwarded: 0,
    OfflineReceivedToday: 0,
    OfflineResponded: 0,
    OfflinePending: 0,
    ParkedCarryForwarded: 0,
    ParkedReceivedToday: 0,
    ParkedResponded: 0,
    ParkedPending: 0,
    MaxQueueTime: "00:00:00",
    OfflineMessage: 0,
    OfflineMessagePer: 0,
  };

  data1: any = {
    LoggedInAgents: 0,
    Capacity: 0,
    PausedAgents: 0,
    PausedAgentPer: 0,
    ActiveAgents: 0,
    ActiveAgentPer: 0,
    ReadyAgents: 0,
    ReadyAgentsPer: 0,
    NotReadyAgents: 0,
    NotReadyAgentsPer: 0,
    AvailbleSession: 0,
    AvailbleSessionPer: 0,
    ActiveSession: 0,
    LoggedInSupervisor: 0,
    SupervisorLoggedIn: 0,
    SupervisorReady: 0,
    SupervisorActive: 0,
    SupervisorCapacity: 0,
  };
  a = JSON.stringify(this.value) + JSON.stringify(this.outof);

  infocards = [
    {
      title: "entered",
      value: 8406,
    },
    {
      title: "closed",
      value: 8298,
    },
    {
      title: "Queue",
      value: 15,
    },
    {
      title: "Dropped",
      value: 8,
    },
    {
      title: "Active Sessions",
      value: 103,
    },
  ];

  constructor(private common: CommonService,public dialog: MatDialog,
    public auth: AuthService,private api: ApiService) {}

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.getEnteredData()
    this.data = {
      TotalEntered: 0,
      EnteredToday: 0,
      EnteredPrevious: 0,
      TotalClosed: 0,
      ClosedToday: 0,
      PendingQueueClosed: 0,
      TotalQueue: 0,
      LongestInQueue: "00:00:00",
      AvgQueueTime: "00:00:00",
      Abandoned: 0,
      Overruled: 0,
      SLA: 0,
      AHT: "00:00:00",
      ART: "00:00:00",
      Queue_Webchat: 0,
      Queue_Whatsapp: 0,
      Queue_SMS: 0,
      Queue_Viber: 0,
      Queue_Email: 0,
      TransferToSkill: 0,
      TransferToAgent: 0,
      Requeue: 0,
      Transfer: 0,
      OfflineCarryForwarded: 0,
      OfflineReceivedToday: 0,
      OfflineResponded: 0,
      OfflinePending: 0,
      ParkedCarryForwarded: 0,
      ParkedReceivedToday: 0,
      ParkedResponded: 0,
      ParkedPending: 0,
      MaxQueueTime: "00:00:00",
      OfflineMessage: 0,
      OfflineMessagePer: 0,
    };

    this.data1 = {
      LoggedInAgents: 0,
      Capacity: 0,
      PausedAgents: 0,
      PausedAgentPer: 0,
      ActiveAgents: 0,
      ActiveAgentPer: 0,
      ReadyAgents: 0,
      ReadyAgentsPer: 0,
      NotReadyAgents: 0,
      NotReadyAgentsPer: 0,
      AvailbleSession: 0,
      AvailbleSessionPer: 0,
      ActiveSession: 0,
      LoggedInSupervisor: 0,
      SupervisorLoggedIn: 0,
      SupervisorReady: 0,
      SupervisorActive: 0,
      SupervisorCapacity: 0,
    };
    this.getData();
    this.getGraphData();
    this.common.hubControlEvent('Dashboard','click','pageloadend','pageloadend','','ngOnInit');

  }

  getData() {
    this.common.hubControlEvent('Dashboard','click','','','','getData');

    this.common.workspaceSession$.subscribe((res) => {
      this.data = res;
      this.common.workspaceAgent$.subscribe((res) => {
        this.data1 = res;
        this.getGraphData();
      });
    });
  }

  getGraphData() {
    this.common.hubControlEvent('Dashboard','click','','','','getGraphData');

    let closed = 0;
    let dropped = 0;
    let activeSessions = 0;

    if (
      this.data?.TotalEntered != 0 ||
      this.data?.TotalEntered != undefined ||
      this.data?.TotalEntered != null
    ) {
  

      if(      this.data?.TotalClosed != 0 &&
        this.data?.TotalClosed != undefined &&
        this.data?.TotalClosed != null){
          closed = Math.round((this.data?.TotalClosed / this.data?.TotalEntered) * 100);
        }
        if(this.data?.Abandoned != 0 &&
          this.data?.Abandoned != undefined &&
          this.data?.Abandoned != null){
            dropped = Math.round((this.data?.Abandoned / this.data?.TotalEntered) * 100);
          }
          if(this.data?.AvailbleSessionPer != 0 ||
            this.data?.AvailbleSessionPer != undefined ||
            this.data?.AvailbleSessionPer != null){
              activeSessions = this.data1?.AvailbleSessionPer ? this.data1?.AvailbleSessionPer : 0;

            }
    }

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
          radius: "100%",

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
              value: closed,
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
          radius: "100%",

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
              value: dropped,
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
          radius: "100%",

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
              value: activeSessions,
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
        padding: 10,
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
          data: this.trainingData,
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

    let sp ='UNFYD_ADM_REALTIMEDASHBOARD_DETAILS_V2';
    let url = 'dashboard/workspace'
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
          url:url
      },
      width: '65vw',
  });
  dialogRef.afterClosed().subscribe(status => {

  })
  }


  convert(str) {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(str),'convert');

    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  getEnteredData(){
    let spname = "usp_unfyd_hub_dashboard_graphs";
  let innerSpName = "HOURLY_STATS"
  let flag = "DAY";
  let endPoint = "dashboard/workspace";
    let obj =
    {
      "data": {
          "spname": "dashboardgraphs",
          "parameters": {
              "flag": "HOURLY_STATS",
              "FREQUENCY": "Day",
              "processid": 214,
              "date": "2022-11-14"
          }
      }
  }
  obj.data.parameters["date"] = this.convert(new Date());
  

    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(endPoint),'getEnteredData');

    this.api.post(endPoint, obj).subscribe((res) => {
      if (res.code == 200) {
        this.trainingData = (res.results.data[0].HourStats).split(",").map(Number);;
        this.getGraphData()
      }
      })
  }
}
