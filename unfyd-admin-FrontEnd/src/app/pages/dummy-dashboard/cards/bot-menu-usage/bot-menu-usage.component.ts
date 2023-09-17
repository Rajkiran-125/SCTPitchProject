import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EChartsOption,ECharts } from "echarts";
import { graphic } from 'echarts';
import { ApiService } from "src/app/global/api.service";
import { CommonService } from "src/app/global/common.service";
import * as Highcharts from 'highcharts';
import  More from 'highcharts/highcharts-more';
More(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
import { AuthService } from "src/app/global/auth.service";
Drilldown(Highcharts);
@Component({
  selector: 'app-bot-menu-usage',
  templateUrl: './bot-menu-usage.component.html',
  styleUrls: ['./bot-menu-usage.component.scss']
})
export class BotMenuUsageComponent implements OnInit {
  inner_content_height =getComputedStyle(document.body).getPropertyValue('--inner_content');
  content_height =getComputedStyle(document.body).getPropertyValue('--content');
  loader: boolean = false;
  spname = "usp_unfyd_bot_dashboard";
  innerSpName = "GET_BOT_MENU_USAGE";
  userDetails:any;
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
  Highcharts = Highcharts;
  chartOptions :any;

  colorPalette = ["#36BC9B", "#ECF2FB"];
  isReload = 0;
  refreshIntervalId: any;
  myChart:any

  constructor(
    private api: ApiService,
    public common: CommonService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

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
    this.common.hubControlEvent('Dashboard','click','pageloadend','pageloadend','','ngOnInit');

  }

  onChartInit(e: any) {
    this.common.hubControlEvent('Dashboard','click','','',e,'onChartInit');

    this.myChart = e;
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
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
      }, this.isReload * 1000);
    } else {
      clearInterval(this.refreshIntervalId);
    }
  }
  convert(str) {
    this.common.hubControlEvent('Dashboard','click','','',str,'convert');

    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  changeDate(direction: any) {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(direction),'changeDate');

    if (direction == "next") {
      if (this.selectedGrievance == "Day") {
        this.getTomorrowDate();
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
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
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)

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
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
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
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
        if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      }
    } else if (direction == "prev") {
      if (this.selectedGrievance == "Day") {
        this.getYesterdayDate();
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
        this.nextDisable = false;
      } else if (this.selectedGrievance == "Month") {
        if (this.hawkerAppDate.getMonth() == 0) {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear() - 1,
            11,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
          this.nextDisable = false;
        } else {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear(),
            this.hawkerAppDate.getMonth() - 1,
            1
          );
          this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == "Year") {
        this.hawkerAppDate = new Date(
          this.hawkerAppDate.getFullYear() - 1,
          this.hawkerAppDate.getMonth(),
          1
        );
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
        this.nextDisable = false;
      }
    }
  }

  getTomorrowDate() {
    this.common.hubControlEvent('Dashboard','click','','','','getTomorrowDate');

    this.hawkerAppDate = new Date(
      this.hawkerAppDate.getTime() + 24 * 60 * 60 * 1000
    );
  }

  getYesterdayDate() {
    this.common.hubControlEvent('Dashboard','click','','','','getYesterdayDate');

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

  
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(this.endPoint),'getInformation');

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
    this.common.hubControlEvent('Dashboard','click','','','','getGraphData');

    this.chartOptions = {
      chart: {
          type: 'column',
          marginLeft:25,
        marginBottom:20,
        marginTop:0,
      },
      title: {
          text: '',
          enabled:false
      },
      accessibility: {
          announceNewData: {
              enabled: true
          }
      },
      credits: {
        enabled: false
    },
      xAxis: {
          type: 'category',
          labels:{
            rotation:0
            }
      },
      yAxis: {
        x:-20,
        min: 0,
        visibility:true,
        lineWidth: 1,
        lineColor: '#ccc',
          title: {
            text: null,
            enabled:false
        },
        labels: {
          formatter: function () {
            if(this.value == 0){
              return this.value;
            }
            if(this.value.toString().length <=3){
              return this.value;
            }
            if(this.value.toString().length >3){
              var a = this.value / 1000
              if(a == 0)
              return a;
              var b = a. toFixed(1) + 'k'
              return b;
            }
          },
            align: 'center',
            x: -3,
            y: 0
      }
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              pointPadding: 0,
              groupPadding: 0.1,
              dataLabels: {
                  enabled: true,
              }
          }
      },
      tooltip: {
        distance:30,
        style:{
            fontSize:this.inner_content_height.substring(0, this.inner_content_height.length -2)
        }
      },


      series: [{
        name: 'OS',
        color:'#9378D9',
        data: [
          {
            name: 'Windows',
            y: 880.19,
            drilldown: 'windows-versions'
          },
          ['MacOSX', 9.22],
          ['Linux', 1.58],
          ['Others', 1.01]
        ],
      }],
      drilldown: {
        activeAxisLabelStyle: {
          textDecoration: 'none',
          fontStyle: 'none',
          color:'undefined'
      },
      activeDataLabelStyle: {
          textDecoration: 'none',
          fontStyle: 'none',
          color:'undefined'
      },
        breadcrumbs: {
          textDecoration: 'none',
          fontStyle: 'none',
          color:'undefined',
          buttonSpacing:0,
          showFullPath: false,
          format: '{level.name}'
      },
        series: [{
          name: 'Windows versions',
          id: 'windows-versions',
          data: [{
            name: 'Win 7',
            y: 55.03,
            drilldown: 'Win-7'
          },
            ['Win XP', 15.83],
            ['Win Vista', 3.59],
            ['Win 8', 7.56],
            ['Win 8.1', 6.18]
          ]
        },
        {
          name: 'Win-7',
          id: 'Win-7',
          data: [{
            name: 'Win 1',
            y: 55.03,
            drilldown: 'Win-1'
          },
            ['Win XP', 15.83],
            ['Win Vista', 3.59],
            ['Win 8', 7.56],
            ['Win 8.1', 6.18]
          ]
        },
        {
          name: 'Win-7',
          id: 'Win-1',
          data: [{
            name: 'Win 1',
            y: 55.03,
            drilldown: 'Win-1'
          },
            ['Win XP', 15.83],
            ['Win Vista', 3.59],
            ['Win 8', 7.56],
            ['Win 8.1', 6.18]
          ]
        }]
      }
  }
    }
    selectedOptionValue(){
      this.common.hubControlEvent('Dashboard','click','','','','selectedOptionValue');

      this.hawkerAppDate= new Date();
    }
}
