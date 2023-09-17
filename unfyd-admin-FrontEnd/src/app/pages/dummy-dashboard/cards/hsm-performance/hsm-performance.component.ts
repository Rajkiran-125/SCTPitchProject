import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EChartsOption } from "echarts";
import { ApiService } from "src/app/global/api.service";
import { CommonService } from "src/app/global/common.service";
import * as Highcharts from 'highcharts';
import { AuthService } from "src/app/global/auth.service";
@Component({
  selector: "app-hsm-performance",
  templateUrl: "./hsm-performance.component.html",
  styleUrls: ["./hsm-performance.component.scss"],
})
export class HsmPerformanceComponent implements OnInit {
  loader: boolean = false;
  spname = "usp_unfyd_bot_dashboard";
  innerSpName = "GET_HSM_PERFORMANCE";
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
  Highcharts = Highcharts;
  chartOptions:any;
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

  reloadData() {
    this.common.hubControlEvent('Dashboard','click','','','','reloadData');

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

  

    let labels = []
    let Acknowledged = []
    let Delivered = []
    let Failed = []
    this.trainingData.forEach(element => {
      labels.push(element.TemplateName);
      Acknowledged.push(element.Acknowledge)
      Delivered.push(element.Delivered)
      Failed.push(element.Failed)
    });
    this.chartOptions ={
      chart: {
        type: 'column',
        marginLeft:25,
        marginBottom:25
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
          text: 'Total consumption',
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
      }
      },
      legend: {
        align: 'center',
        itemStyle: {
         
          fontSize: this.inner_content_height
      },
        x: 0,
        verticalAlign: 'top',
        y: 0,
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
        name: 'Failed',
        data: Failed,
        color: "#DB4453",
        dataLabels:{
          align:'center',
          style: {
                    color: '#FFFFFF',
                    textOutline: 'none',
                }
          }
      }, {
        name: 'Delivered',
        data: Delivered,
        dataLabels:{
          align:'center',
          style: {
                    color: '#FFFFFF',
                    textOutline: 'none',
                }
          }
     

      }, {
        name: 'Acknowledged',
        data: Acknowledged,
        color: "#36BC9B",
        dataLabels:{
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
    this.common.hubControlEvent('Dashboard','click','','','','selectedOptionValue');

    this.hawkerAppDate= new Date();
  }
}
