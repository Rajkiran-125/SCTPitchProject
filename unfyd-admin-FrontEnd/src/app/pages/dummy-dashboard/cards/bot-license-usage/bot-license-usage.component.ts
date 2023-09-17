import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EChartsOption } from "echarts";
import { ApiService } from "src/app/global/api.service";
import { CommonService } from "src/app/global/common.service";
import * as Highcharts from 'highcharts';
import { DateFormatPipe } from "src/app/global/date-format.pipe";
import { AuthService } from "src/app/global/auth.service";
@Component({
  selector: 'app-bot-license-usage',
  templateUrl: './bot-license-usage.component.html',
  styleUrls: ['./bot-license-usage.component.scss']
})
export class BotLicenseUsageComponent implements OnInit {
  loader: boolean = false;
  spname = "usp_unfyd_bot_dashboard";
  innerSpName = "GET_BOT_LICENSE_USAGE";
  userDetails:any
  flag = "DAY";
  endPoint = "index";
  hawkerAppButton = "DAY";
  nextDisable: boolean = true;
  previousDisable: boolean = false;
  values: any = [105,102,210,106,90,102,50,100,85,5];
  keys:any = [1,2,3,4,5,6,7,8,9,10];
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

  Highcharts = Highcharts;
 
  //     chart: {
  //        type: "spline"
  //     },
  //     title: {
  //        text: "Monthly Average Temperature"
  //     },
  //     subtitle: {
  //        text: "Source: WorldClimate.com"
  //     },
  //     xAxis:{
  //        categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  //     },
  //     yAxis: {
  //        title:{
  //           text:"Temperature °C"
  //        }
  //     },
  //     tooltip: {
  //        valueSuffix:" °C"
  //     },
  //     series: [
  //        {
  //           name: 'Tokyo',
  //           data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,26.5, 23.3, 18.3, 13.9, 9.6]
  //        },
  //        {
  //           name: 'New York',
  //           data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8,24.1, 20.1, 14.1, 8.6, 2.5]
  //        },
  //        {
  //           name: 'Berlin',
  //           data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
  //        },
  //        {
  //           name: 'London',
  //           data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
  //        }
  //     ]
  //  };
  chartOptions:any;
  inner_content_height =getComputedStyle(document.body).getPropertyValue('--inner_content');
  content_height =getComputedStyle(document.body).getPropertyValue('--content');
 
  constructor(
    private api: ApiService,
    public common: CommonService,
    private router: Router,
    private dateFormatPipe: DateFormatPipe,
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
        this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
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
   
    let NoOfLicenseUsage:any = [];
    let used:any = [];
    let overruled:any = [];
    let labels:any=  []
    let maxlicensedUsed = this.trainingData[0].TotalLicense;

    let maxlicensedUsedTime = this.dateFormatPipe.transform(this.hawkerAppDate)
    this.trainingData.forEach(element => {
      NoOfLicenseUsage?.push(parseInt(element?.NoOfLicenseUsage))
      overruled?.push(parseInt(element?.OverruledCount))
      labels?.push(element?.TimeInterval)

    });

    let i = 0
    NoOfLicenseUsage.forEach(element => {
      used.push(element - overruled[i])
      i++;
    });
  
    this.chartOptions ={
      chart: {
        type: 'column',
        marginLeft:25,
        marginBottom:20,
        marginTop:30
      },
      title: {
        text: '',
        enabled:false

      },

      xAxis: {
        categories: labels,
      },
      yAxis: {
        x:-20,
        min: 0,
        visibility:true,
        lineWidth: 1,
        lineColor: '#ccc',
        title: {
          text: 'Total fruit consumption',
          enabled:false
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: ( 
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color
            ) || 'gray',
            textOutline: 'none'
          }
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
      },
      plotLines: [{
        color: '#4B89DC',
        width: 2,
        value: this.trainingData[0]?.MaxTotalLicense
    }]
      },
      legend: {
        align: 'left',
        itemStyle: {
          fontSize: this.inner_content_height
      },
        x: 0,
        y: -45,
        overflow:true,
        verticalAlign: 'top',
        padding:0,
        symbolRadius:0,
        itemDistance:5,
        floating: false,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 0,
        shadow: false
      },
      subtitle: {
        text: '<span style="margin:20px 0; font-size:8px;">Max license used: </span><b style="font-size:8px;">'+maxlicensedUsed
        +'</b><br><span style="font-size:8px;">On '+maxlicensedUsedTime+'</span>',
        align: 'right',
        x:-10,
        y:5
    },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
        style:{
       
            fontSize:this.inner_content_height.substring(0, this.inner_content_height.length -2)
        }
      },
      plotOptions: {
    
        column: {
                pointPadding: 0,
                groupPadding: 0.1,
                borderWidth: 0,

          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      credits: {
        enabled: false
    },
      series: [{
        name: 'Overruled',
        data: overruled,
        color: "#DB4453",
        dataLabels:{
          enabled:false,
          visible:false,
          align:'center',
          style: {
                    color: '#FFFFFF',
                    textOutline: 'none',
                }
          }
      }, {
        name: 'Used',
        data: used,
        color: "#4B89DC",
        dataLabels:{
          enabled:false,
          visible:false,
          align:'center',
          style: {
                    color: '#FFFFFF',
                    textOutline: 'none',
                }
          }

      }]
    };
  }
  selectedOptionValue(){
    this.hawkerAppDate= new Date();
  }
}
