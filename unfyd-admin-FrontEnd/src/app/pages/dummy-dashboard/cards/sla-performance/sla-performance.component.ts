import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EChartsOption,ECharts } from "echarts";
import { graphic } from 'echarts';
import { ApiService } from "src/app/global/api.service";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";

@Component({
  selector: 'app-sla-performance',
  templateUrl: './sla-performance.component.html',
  styleUrls: ['./sla-performance.component.scss']
})
export class SlaPerformanceComponent implements OnInit {
  loader: boolean = false;
  spname = "usp_unfyd_hub_dashboard_graphs";
  flag = "DAY";
  endPoint = "dashboard/workspace";
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
  data:any = [];
  data1:any = [];
  userDetails:any;
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
    this.common.reloadTime$.subscribe((res) => {
      this.isReload = res;
      clearInterval(this.refreshIntervalId);
      this.reloadData();
    });
    this.getData()
    this.reloadData();
    this.getGraphData();

    this.common.workspaceSession$.subscribe((res:any)=>{

    })
  }

  getData(){
    this.common.workspaceSession$.subscribe((res)=>{
      this.data = res
      this.common.workspaceAgent$.subscribe((res1)=>{
        this.data1 = res1
        this.getGraphData();

      })

    })


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
          this.getInformation("usp_unfyd_hub_dashboard_graphs", "Day");
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
        this.getInformation("usp_unfyd_hub_dashboard_graphs", "Day");
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
          this.getInformation("usp_unfyd_hub_dashboard_graphs", "Month");

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
          this.getInformation("usp_unfyd_hub_dashboard_graphs", "Month");
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
        this.getInformation("usp_unfyd_hub_dashboard_graphs", "Year");
        if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      }
    } else if (direction == "prev") {
      if (this.selectedGrievance == "Day") {
        this.getYesterdayDate();
        this.getInformation("usp_unfyd_hub_dashboard_graphs", "Day");
        this.nextDisable = false;
      } else if (this.selectedGrievance == "Month") {
        if (this.hawkerAppDate.getMonth() == 0) {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear() - 1,
            11,
            1
          );
          this.getInformation("usp_unfyd_hub_dashboard_graphs", "Month");
          this.nextDisable = false;
        } else {
          this.hawkerAppDate = new Date(
            this.hawkerAppDate.getFullYear(),
            this.hawkerAppDate.getMonth() - 1,
            1
          );
          this.getInformation("usp_unfyd_hub_dashboard_graphs", "Month");
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == "Year") {
        this.hawkerAppDate = new Date(
          this.hawkerAppDate.getFullYear() - 1,
          this.hawkerAppDate.getMonth(),
          1
        );
        this.getInformation("usp_unfyd_hub_dashboard_graphs", "Year");
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

  getInformation(spname, flag) {
    this.loader = true;
    let obj = {
      data: {
        spname: spname,
        parameters: {
          flag: flag,
        },
      },
    };

    if (flag == "Day") {
      obj.data.parameters["date"] = this.convert(this.hawkerAppDate);
    } else if (flag == "Month") {
      obj.data.parameters["Month"] = this.hawkerAppDate.getMonth() + 1;
      obj.data.parameters["Year"] = this.hawkerAppDate.getFullYear();
    } else if (flag == "Year") {
      obj.data.parameters["Year"] = this.hawkerAppDate.getFullYear();
    }

    this.api
      .post(this.endPoint, obj)
      .subscribe((res) => {
        this.loader = false;
        if (res.code == 200) {
          if(Object.keys(res.results).length > 0){
            this.trainingData = res.results.data;
            this.trainingData[0].color = "#ECF2FB";
            this.trainingData[1].color = "#36BC9B";
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
    this.options = {
      series: [
        {
          type: 'gauge',
          progress: {
            show: true,
            width: 28,
            itemStyle: {
            color: '#DB4453'
            }
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            width: 10,
            offsetCenter: [0, '5%'],
            itemStyle: {
            color: '#EAEAEA'
            },

          },
          radius:"80%",
          axisLine: {
            lineStyle: {
              width: 28
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            length: 10,
            lineStyle: {
              width: 2,
              color: '#EAEAEA'
            }
          },
          axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 20,
            show:false
          },
          anchor: {
            show: false,
            showAbove: false,
            size: 5,
            itemStyle: {
              color:'#EAEAEA',
              borderWidth: 10
            }
          },
          title: {
            show: false
          },
          detail: {
            backgroundColor: '#F8F8F8',
            borderColor: '#EAEAEA',
            color:'#DB4453',
            borderWidth: 2,
            width: '100%',
            lineHeight: 20,
            fontSize:12,
            height: 20,
            borderRadius: 4,
            offsetCenter: [0, '100%'],
            valueAnimation: true,
            formatter: function (value) {
              return 'SLA ' + value+'%'
            },
          },
          data: [
            {
              value: this.data?.SLA ? this.data?.SLA : 0
            }
          ]
        }
      ]
    };
    }
    selectedOptionValue(){
      this.hawkerAppDate= new Date();
    }
}
