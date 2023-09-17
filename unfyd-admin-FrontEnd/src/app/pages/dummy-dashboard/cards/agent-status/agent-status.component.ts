import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EChartsOption, ECharts } from "echarts";
import { graphic } from "echarts";
import { ApiService } from "src/app/global/api.service";
import { CommonService } from "src/app/global/common.service";
import { AuthService } from 'src/app/global/auth.service';

@Component({
  selector: "app-agent-status",
  templateUrl: "./agent-status.component.html",
  styleUrls: ["./agent-status.component.scss"],
})
export class AgentStatusComponent implements OnInit {
  loader: boolean = false;
  data:any;
  spname = "";
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
  colorPalette = ["#36BC9B", "#4B89DC", "#FBAD17", "#DB4453"];
  isReload = 0;
  refreshIntervalId: any;
  inner_content_height = getComputedStyle(document.body).getPropertyValue(
    "--inner_content"
  );
  content_height = getComputedStyle(document.body).getPropertyValue(
    "--content"
  );
  header_height = getComputedStyle(document.body).getPropertyValue("--header");
  constructor(
    private api: ApiService,
    public common: CommonService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.today = new Date(this.today.setHours(0, 0, 0, 0));
    this.hawkerAppDate = new Date(this.hawkerAppDate.setHours(0, 0, 0, 0));
    this.common.reloadTime$.subscribe((res) => {
      this.isReload = res;
      clearInterval(this.refreshIntervalId);
      this.reloadData();
    });
    this.reloadData();
    this.getData()
    this.common.hubControlEvent('Dashboard','click','pageloadend','pageloadend','','ngOnInit');


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
        this.getData()
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
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(this.endPoint),'getYesterdayDate');

    this.api
      .post(this.endPoint, obj)
      .subscribe((res) => {
        this.loader = false;
        if (res.code == 200) {
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
      })
      .add(() => {
      });
  }

  keepOrder = (a) => {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(a),'keepOrder');

    return a;
  };

  getData(){
    this.common.hubControlEvent('Dashboard','click','','','','getData');

    this.common.workspaceAgent$.subscribe((res) => {
 
      this.data = res;
      if(res){
        this.getGraphData();
      }
    })
  }
  getGraphData() {
    this.common.hubControlEvent('Dashboard','click','','','','getGraphData');

    this.options = {
      title: {
        text: this.data?.LoggedInAgents,
        subtext: "Logged In",
        left: "center",
        top: "52%",
        textStyle: {
          fontSize: this.header_height,
        },
        itemGap: 0,
        subtextStyle: {
          fontSize: this.content_height,
        },
      },

      tooltip: {
        trigger: "item",
        textStyle: {
          fontSize: this.inner_content_height.substring(
            0,
            this.inner_content_height.length - 2
          ),
        },
      },
      legend: {
        icon: "rect",
        orient: "horizontal",
     
        itemWidth: 7,
        itemHeight: 7,
        textStyle: {
          fontSize: this.inner_content_height,
        },
      },

     
      grid: {
        left: "0%",
        right: "0%",
        bottom: "0%",
        containLabel: true,
      },
      selectedOffset: 10,
      series: [
        {
          name: "Agent Status",
          type: "pie",
          radius: ["45%", "80%"],
          avoidLabelOverlap: false,
          center: ["50%", "60%"],
          color: this.colorPalette,
          label: {
            position: "outer",
            overflow: "break",
            formatter: "{a|{c}}",
            distanceToLabelLine: -20,
            width: 70,
            fontSize: this.inner_content_height,
            color: "#707070",

            rich: {
              a: {
                color: "#212121",
                fontSize: "16px",
                fontWeight: "bold",
              },
            },
          },
          top: "0%",
          left: "0%",
          labelLine: {
            show: false,
          },
          clockwise: true,
     
          data:
          [
            { value: this.data?.ReadyAgents ? this.data?.ReadyAgents : 0, name: "Ready" },
            { value: this.data?.ActiveAgents ? this.data?.ActiveAgents : 0, name: "Active" },
            { value: this.data?.PausedAgents ? this.data?.PausedAgents : 0, name: "Stop Interaction" },
            { value: this.data?.NotReadyAgents ? this.data?.NotReadyAgents : 0, name: "Not Ready" },
          ],
        },
      ],
    };
  }

  selectedOptionValue(){
    this.common.hubControlEvent('Dashboard','click','','','','selectedOptionValue');

    this.hawkerAppDate= new Date();
  }
}
