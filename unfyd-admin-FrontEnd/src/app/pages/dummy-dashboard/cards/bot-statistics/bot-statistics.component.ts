import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EChartsOption,ECharts } from "echarts";
import { graphic } from 'echarts';
import { ApiService } from "src/app/global/api.service";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";

@Component({
  selector: 'app-bot-statistics',
  templateUrl: './bot-statistics.component.html',
  styleUrls: ['./bot-statistics.component.scss']
})
export class BotStatisticsComponent implements OnInit {
  loader: boolean = false;
  spname = "usp_unfyd_bot_dashboard";
  innerSpName = "GET_BOT_STATISTICS";
  userDetails:any
  flag = "DAY";
  endPoint = "index";
  hawkerAppButton = "DAY";
  keys: any;
  nextDisable: boolean = true;
  previousDisable: boolean = false;
  values: any;
  hawkerAppDate: any = new Date();
  today: any = new Date();
  tommorow: any = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);
  hawkerAppSum = 0;
  trainingData: any;
  selectedGrievance: any = "Day";
  options: EChartsOption = {};
  colorPalette = ["#36BC9B", "#ECF2FB"];
  isReload = 0;
  refreshIntervalId: any;
  inner_content_height =getComputedStyle(document.body).getPropertyValue('--inner_content');
  content_height =getComputedStyle(document.body).getPropertyValue('--content');
  constructor(
    private api: ApiService,
    public common: CommonService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.userDetails = this.auth.getUser();
    this.today = new Date(this.today.setHours(0, 0, 0, 0));
    this.hawkerAppDate = new Date(this.hawkerAppDate.setHours(0, 0, 0, 0));
    this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
    this.common.reloadTime$.subscribe((res) => {
      this.isReload = res;
      clearInterval(this.refreshIntervalId);
      this.reloadData();
    });
    this.reloadData();
  }

  reloadData() {
    this.isReload = JSON.parse(localStorage.getItem("reload"));
    if (
      this.isReload != 0 &&
      this.isReload != null &&
      this.isReload != undefined
    ) {
      this.refreshIntervalId = setInterval(() => {
        if (this.router.url == "/dashboard")
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
      }, this.isReload * 1000);
    } else {
      clearInterval(this.refreshIntervalId);
    }
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  changeDate(direction: any) {
    if (direction == "next") {
      if (this.selectedGrievance == "Day") {
        this.getTomorrowDate();
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
        if (this.hawkerAppDate.getTime() == this.today.getTime()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == "Month") {
        if (this.hawkerAppDate.getMonth() == 11) {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear() + 1,
            0,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);

          if (
            this.hawkerAppDate.getMonth() == this.today.getMonth() &&
            this.hawkerAppDate.getFullYear() == this.today.getFullYear()
          ) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        } else {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear(),
            this.hawkerAppDate.getMonth() + 1,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
          if (
            this.hawkerAppDate.getMonth() == this.today.getMonth() &&
            this.hawkerAppDate.getFullYear() == this.today.getFullYear()
          ) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        }
      } else if (this.selectedGrievance == "Year") {
        this.hawkerAppDate = new Date(
          this.hawkerAppDate.getFullYear() + 1,
          this.hawkerAppDate.getMonth(),
          1
        );
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
        if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      }
    } else if (direction == "prev") {
      if (this.selectedGrievance == "Day") {
        this.getYesterdayDate();
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
        this.nextDisable = false;
      } else if (this.selectedGrievance == "Month") {
        if (this.hawkerAppDate.getMonth() == 0) {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear() - 1,
            11,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
          this.nextDisable = false;
        } else {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear(),
            this.hawkerAppDate.getMonth() - 1,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == "Year") {
        this.hawkerAppDate = new Date(
          this.hawkerAppDate.getFullYear() - 1,
          this.hawkerAppDate.getMonth(),
          1
        );
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance);
        this.nextDisable = false;
      }
    }
  }

  getTomorrowDate() {
    this.hawkerAppDate = new Date(
      this.hawkerAppDate.getTime() + 24 * 60 * 60 * 1000
    );
  }

  getYesterdayDate() {
    this.hawkerAppDate = new Date(
      this.hawkerAppDate.getTime() - 24 * 60 * 60 * 1000
    );
  }

  getInformation(spname,innerSpName, flag) {
    this.loader = true;
    let obj = {
      data: {
        spname: spname,
        parameters: {
          flag: innerSpName,
          processid: this.userDetails.Processid,
          "DATE":"2022-08-17"
        },
      },
    };

  
    this.api
      .post(this.endPoint, obj)
      .subscribe((res) => {
        this.loader = false;
        if (res.code == 200) {
          this.trainingData = res.results.data;
          if (this.selectedGrievance == "Day") {
            if (
              this.hawkerAppDate.toISOString().slice(0, 10) ==
              this.today.toISOString().slice(0, 10)
            ) {
              this.nextDisable = true;
            } else {
              this.nextDisable = false;
            }
          } else if (this.selectedGrievance == "Month") {
            if (
              this.hawkerAppDate.getMonth() == this.today.getMonth() &&
              this.hawkerAppDate.getFullYear() == this.today.getFullYear()
            ) {
              this.nextDisable = true;
            } else {
              this.nextDisable = false;
            }
          } else if (this.selectedGrievance == "Year") {
            if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
              this.nextDisable = true;
            } else {
              this.nextDisable = false;
            }
          }
        }
      })
      .add(() => {
        this.getGraphData();
      });
  }

  keepOrder = (a) => {
    return a;
  };

  getGraphData() {
    let TransferredToAgentCount :any = []
    let HandledByBOTCount:any = [];
    let overruled:any = [];
    let labels:any=  []

    this.trainingData.forEach(element => {
      TransferredToAgentCount?.push(parseInt(element?.TransferredToAgentCount))
      HandledByBOTCount?.push(parseInt(element?.HandledByBOTCount))
      overruled?.push(parseInt(element?.OverruledCount))
      labels?.push(element?.TimeInterval)

    });
    this.options = {
    
      tooltip: {
        trigger:'axis',
        textStyle:{
          fontSize:this.inner_content_height.substring(0, this.inner_content_height.length -2)
        },
        position: function(point, params, dom, rect, size){
        var x = point[0];
        var y = point[1];
        var viewWidth = size.viewSize[0];
        var viewHeight = size.viewSize[1];
        var boxWidth = size.contentSize[0];
        var boxHeight = size.contentSize[1];
        var posX = 0;
        var posY = 0;

        if(x<boxWidth){
            posX = 5;
        }else{
            posX = x-boxWidth;
        }

        if(y<boxHeight){
            posY = 5;
        }else{
            posY = y-boxHeight;
        }

        return [posX,posY];

    }
    },
      legend: {
        icon: "rect",
        orient: "horizontal",
    
        itemWidth: 7,
        itemHeight: 7,
        textStyle: {
          fontSize: 8,
        },
      },
    
      grid: {
        top:'12%',
        left: '0%',
        right: '3%',
        bottom: '0%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: labels
        }
      ],
      yAxis: {
        type: "value",
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: function (value: any) {
            if(value< 1000){
              return value
            } else if(value >= 100000){
              let a= (value/100000).toFixed(0)
              return `${a}L`;
            } else if(value > 9999){
              let a= (value/1000).toFixed(0)
              return `${a}k`;
            } else{
              let a= (value/1000).toFixed(0)
              return `${a}k`;
              }
          },
        },
      },
      series: [

        {
          name: 'Handled By BOT',
          type: 'line',
          stack: '',
          label: {
            show: false,
            position: 'top'
          },
          emphasis: {
            focus: 'series'
          },
          lineStyle: {
            width: 2,
            color: '#4B89DC'
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#4B89DC'
              },
              {
                offset: 1,
                color: '#D0E0F8'
              }
            ])
          },
          data: HandledByBOTCount
        },
        {
          name: 'Transferred To Agent ',
          type: 'line',
          stack: '',
          lineStyle: {
            width: 2,
            color: '#36BC9B'
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#36BC9B'
              },
              {
                offset: 1,
                color: '#C8FFF1'
              }
            ])
          },      emphasis: {
            focus: 'series'
          },
          color:'#36BC9B',
          data: TransferredToAgentCount
        },
            {
          name: 'Overruled',
          type: 'line',
          stack: '',
          lineStyle: {
            width: 2,
            color: '#DB4453'
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#DB4453'
              },
              {
                offset: 1,
                color: '#FFD9DB'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          color:'#DB4453',
          data: overruled
        },




      ]
    };
    }
    selectedOptionValue(){
      this.hawkerAppDate= new Date();
    }
}
