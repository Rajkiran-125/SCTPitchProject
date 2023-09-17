import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-dashboard-top-performer',
  templateUrl: './dashboard-top-performer.component.html',
  styleUrls: ['./dashboard-top-performer.component.scss']
})
export class DashboardTopPerformerComponent implements OnInit {
  loader: boolean = false;
  spname = '';
  flag = 'DAY';
  endPoint = 'index';
  hawkerAppButton = "DAY";
  keys: any;
  nextDisable: boolean = true;
  previousDisable: boolean = false;
  values: any;
  hawkerAppDate:any = new Date();
  today: any = new Date();
  tommorow: any = new Date(this.today.getTime() + 24 * 60 * 60 * 1000)
  hawkerAppSum = 0;
  trainingData: any;
  selectedGrievance: any = 'Day';
  options: EChartsOption = {}
  topPerformers :any
  isReload = 0;
  refreshIntervalId:any

  constructor(private api: ApiService,public common: CommonService,private router :Router) { }

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.today = new Date(this.today.setHours(0, 0, 0, 0))
    this.hawkerAppDate = new Date(this.hawkerAppDate.setHours(0, 0, 0, 0))
    this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Day")
    this.common.reloadTime$.subscribe(res =>{
      this.isReload = res;
      clearInterval(this.refreshIntervalId)
      this.reloadData()
    })
    this.reloadData()
    this.common.hubControlEvent('Dashboard','click','pageloadend','pageloadend','','ngOnInit');


  }

  reloadData(){

    this.isReload = JSON.parse(localStorage.getItem('reload'));
      if(this.isReload != 0 && this.isReload != null && this.isReload != undefined){
        this.refreshIntervalId = setInterval(()=>{
          if(this.router.url == '/dummy-dashboard')
          this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Day")
        }, this.isReload*1000);
      } else{
        clearInterval(this.refreshIntervalId)
      }
  }
  convert(str) {

    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  changeDate(direction: any) {
    this.common.hubControlEvent('Dashboard','click','','',direction,'changeDate');

    if (direction == 'next') {
      if (this.selectedGrievance == 'Day') {
        this.getTomorrowDate()
        this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Day")
        if (this.hawkerAppDate.getTime() == this.today.getTime()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == 'Month') {
        if (this.hawkerAppDate.getMonth() == 11) {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() + 1, 0, 1);
          this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Month")

          if (this.hawkerAppDate.getMonth() == this.today.getMonth() && this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        } else {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear(), this.hawkerAppDate.getMonth() + 1, 1);
          this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Month")
          if (this.hawkerAppDate.getMonth() == this.today.getMonth() && this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        }
      } else if (this.selectedGrievance == 'Year') {
        this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() + 1, this.hawkerAppDate.getMonth(), 1);
        this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Year")
        if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      }
    } else if (direction == "prev") {
      if (this.selectedGrievance == 'Day') {
        this.getYesterdayDate()
        this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Day")
        this.nextDisable = false;
      } else if (this.selectedGrievance == 'Month') {
        if (this.hawkerAppDate.getMonth() == 0) {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() - 1, 11, 1);
          this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Month")
          this.nextDisable = false;
        } else {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear(), this.hawkerAppDate.getMonth() - 1, 1);
          this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Month")
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == 'Year') {
        this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() - 1, this.hawkerAppDate.getMonth(), 1);
        this.getInformation("usp_unfyd_top_performer_fe_dashboard", "Year")
        this.nextDisable = false;
      }
    }
  }

  getTomorrowDate() {
    this.common.hubControlEvent('Dashboard','click','','','','getTomorrowDate');

    this.hawkerAppDate = new Date(this.hawkerAppDate.getTime() + 24 * 60 * 60 * 1000)
  }

  getYesterdayDate() {
    this.common.hubControlEvent('Dashboard','click','','','','getYesterdayDate');

    this.hawkerAppDate = new Date(this.hawkerAppDate.getTime() - 24 * 60 * 60 * 1000);
  }

  getInformation(spname, flag) {
    this.loader = true;
    let obj = {
      "data": {
        "spname": spname,
        "parameters": {
          "flag": flag
        }
      }
    }

    if (flag == "Day") {
      obj.data.parameters["date"] = this.convert(this.hawkerAppDate);
    } else if (flag == "Month") {
      obj.data.parameters["Month"] = this.hawkerAppDate.getMonth() + 1;
      obj.data.parameters["Year"] = this.hawkerAppDate.getFullYear();
    } else if (flag == "Year") {
      obj.data.parameters["Year"] = this.hawkerAppDate.getFullYear();
    }

    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(this.endPoint),'getInformation');

    this.api.post(this.endPoint, obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.topPerformers = res.results.data;
        let a = 5 - this.topPerformers.length;
                if(a<=5){
                  for (var i = 0; i < a; i++) {
                    this.topPerformers.push({'Agent':'-','Count':'-'})
                  }
                }
        if (this.selectedGrievance == 'Day') {
          if (this.hawkerAppDate.toISOString().slice(0, 10) == this.today.toISOString().slice(0, 10)) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        } else if (this.selectedGrievance == 'Month') {
          if (this.hawkerAppDate.getMonth() == this.today.getMonth() && this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        } else if (this.selectedGrievance == 'Year') {
          if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        }
      }
    }).add(() => {
    })
  }

  keepOrder = (a) => {
    return a;
  }
}
