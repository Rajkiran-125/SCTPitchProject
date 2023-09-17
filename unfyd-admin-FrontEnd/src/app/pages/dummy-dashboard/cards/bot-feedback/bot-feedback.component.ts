import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EChartsOption,ECharts } from "echarts";
import { graphic } from 'echarts';
import { ApiService } from "src/app/global/api.service";
import { CommonService } from "src/app/global/common.service";
import * as Highcharts from 'highcharts';
import { Options} from "highcharts";
import  More from 'highcharts/highcharts-more';
More(Highcharts);
import Drilldown from 'highcharts/modules/drilldown';
import { AuthService } from "src/app/global/auth.service";
Drilldown(Highcharts);


@Component({
  selector: 'app-bot-feedback',
  templateUrl: './bot-feedback.component.html',
  styleUrls: ['./bot-feedback.component.scss']
})
export class BotFeedbackComponent implements OnInit {
  loader: boolean = false;
  spname = "usp_unfyd_bot_dashboard";
  innerSpName = "GET_BOT_FEEDBACK";
  userDetails:any;
  flag = "DAY";
  endPoint = "index";
  hawkerAppButton = "DAY";
  keys: any;
  nextDisable: boolean = true;
  previousDisable: boolean = false;
  hawkerAppDate: any = new Date();
  today: any = new Date();
  tommorow: any = new Date(this.today.getTime() + 24 * 60 * 60 * 1000);
  hawkerAppSum = 0;
  trainingData: any;
  selectedGrievance: any = "Day";
  options: EChartsOption = {};
  Highcharts: typeof Highcharts = Highcharts;
  values = [];
  labels = []
  chartOptions: any;


  colorPalette = ["#DB4453","#FBAD17","#36BC9B"];
  isReload = 0;
  refreshIntervalId: any;
  myChart:any
  inner_content_height =getComputedStyle(document.body).getPropertyValue('--inner_content');
  content_height =getComputedStyle(document.body).getPropertyValue('--content');
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
          "DATE":"2022-08-18"
        },
      },
    };

  
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(this.endPoint),'getInformation');

    this.api
      .post(this.endPoint, obj)
      .subscribe((res) => {
        this.loader = false;
        if (res.code == 200) {
          this.trainingData = res.results.data[0];
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
    this.common.hubControlEvent('Dashboard','click','','',a,'keepOrder');

    return a;
  };

  getGraphData() {
    this.common.hubControlEvent('Dashboard','click','','','','getGraphData');

    let dataSum = 0;
    this.labels = []
    this.values = []
  
      this.labels = (Object.keys(this.trainingData))
      this.values.push(parseInt(this.trainingData.DetractorsPercent))
      this.values.push(parseInt(this.trainingData.PassivesPercent))
      this.values.push(parseInt(this.trainingData.PromotersPercent))

    for (let i of this.values) {
      dataSum += i
  }

    this.  chartOptions = {
      chart: {
          type: 'column',
          marginLeft:-5,
        marginBottom:20,
        marginRight:0,
        marginTop:0,
      },
      title: {
          text: '',
          enabled:false
      },
      credits: {
        enabled: false
    },
      xAxis: {
          type: 'category',
        categories: this.labels,

      },
      yAxis: {
        enabled:false,
        visible:false,
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          column: {
              borderWidth: 0,
              pointPadding: 0,
              groupPadding: 0.2,
              dataLabels: {
                  enabled: true,
                  align: 'center',

                   useHTML: true,
                   position:'center',
            formatter: function () {
              if(this.point.x == 0){
                return "<div class='d-flex align-items-center' >"+ "<i class='icon-unhapy_smile red-color normal-font'></i>&nbsp;" + (this.y / dataSum * 100).toFixed(0) + '% '+ "</div>";
              }else if(this.point.x == 1){
                return "<div class='d-flex align-items-center'>" + "<i class='icon-smile yellow-color normal-font'></i>&nbsp;" + (this.y / dataSum * 100).toFixed(0) + '% '+"</div>";
              } else if(this.point.x == 2){
                return "<div class='d-flex align-items-center'>" + "<i class='icon-happy_smile green-color normal-font'></i>&nbsp;" + (this.y / dataSum * 100).toFixed(0) + '% '+"</div>";
              }
            },
            style: {
                    }
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
        color:'#9378D9',
        data: [
                {y:this.values[0],
                color:this.colorPalette[0]},
                {y:this.values[1],
                  color:this.colorPalette[1]},
                  {y:this.values[2],
                    color:this.colorPalette[2]},
              ],

      }],
  }

    }
    selectedOptionValue(){
      this.common.hubControlEvent('Dashboard','click','','','','selectedOptionValue');

      this.hawkerAppDate= new Date();
    }
}
