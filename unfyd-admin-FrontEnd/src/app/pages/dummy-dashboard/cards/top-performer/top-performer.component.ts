import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/app/global/api.service";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";

@Component({
  selector: 'app-top-performer',
  templateUrl: './top-performer.component.html',
  styleUrls: ['./top-performer.component.scss']
})
export class TopPerformerComponent implements OnInit {
  filterByPerformance:any = 'By Count'
  loader: boolean = false;
  spname = "usp_unfyd_hub_dashboard_graphs";
  innerSpName = "GET_TOP_PERFORMER";
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
  colorPalette = ["#36BC9B", "#ECF2FB"];
  isReload = 0;
  refreshIntervalId: any;
  userDetails: any;
  data = [
    {
      icon:'icon-cam',
      label:'Ajay Pandey',
      value:'400'
    },
    {
      icon:'icon-call',
      label:'Vishal Rindhe',
      value:'400'
    },
    {
      icon:'icon-screenShare',
      label:'Vishal More',
      value:'400'
    },
    {
      icon:'icon-ticket',
      label:'Vishal Kale',
      value:'400'
    },
    {
      icon:'icon-calender',
      label:'Vishal Abcd',
      value:'400'
    }
  ]
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

    // this.getGraphData();
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
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(direction),'changeDate');

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

  getTomorrowDate() {    this.common.hubControlEvent('Dashboard','click','','','','getTomorrowDate');

    this.hawkerAppDate = new Date(
      this.hawkerAppDate.getTime() + 24 * 60 * 60 * 1000
    );
  }

  getYesterdayDate() {    this.common.hubControlEvent('Dashboard','click','','','','getYesterdayDate');

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
          GRAPHFILTER:this.filterByPerformance,
          FREQUENCY : flag,
          processid:  this.userDetails.Processid,
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
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(obj),'getInformation');

    this.api
      .post(this.endPoint, obj)
      .subscribe((res) => {
        this.loader = false;
        if (res.code == 200) {
          this.data = res.results.data
          // this.trainingData[0].color = "#ECF2FB";
          // this.trainingData[1].color = "#36BC9B";
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
        // this.getGraphData();
      });
  }

  keepOrder = (a) => {
    return a;
  };

  numSequence(n: number): Array<number> {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(n),'numSequence');

    return Array(n);
  }

  selectedOptionValue(){
    this.common.hubControlEvent('Dashboard','click','','','','selectedOptionValue');

    this.hawkerAppDate= new Date();
  }
}
