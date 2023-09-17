import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-dashboard-grievance',
  templateUrl: './dashboard-grievance.component.html',
  styleUrls: ['./dashboard-grievance.component.scss']
})
export class DashboardGrievanceComponent implements OnInit {
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
  options: EChartsOption = {};
  colorPalette = ["#36BC9B","#ECF2FB"]
  isReload = 0;
  refreshIntervalId:any
  constructor(private api: ApiService,public common: CommonService,private router :Router) { }

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.today = new Date(this.today.setHours(0, 0, 0, 0))
    this.hawkerAppDate = new Date(this.hawkerAppDate.setHours(0, 0, 0, 0))
    this.getInformation("usp_unfyd_grievance_dashboard", "Day")
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
          this.getInformation("usp_unfyd_grievance_dashboard", "Day")
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
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(direction),'changeDate');

    if (direction == 'next') {
      if (this.selectedGrievance == 'Day') {
        this.getTomorrowDate()
        this.getInformation("usp_unfyd_grievance_dashboard", "Day")
        if (this.hawkerAppDate.getTime() == this.today.getTime()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == 'Month') {
        if (this.hawkerAppDate.getMonth() == 11) {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() + 1, 0, 1);
          this.getInformation("usp_unfyd_grievance_dashboard", "Month")

          if (this.hawkerAppDate.getMonth() == this.today.getMonth() && this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        } else {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear(), this.hawkerAppDate.getMonth() + 1, 1);
          this.getInformation("usp_unfyd_grievance_dashboard", "Month")
          if (this.hawkerAppDate.getMonth() == this.today.getMonth() && this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        }
      } else if (this.selectedGrievance == 'Year') {
        this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() + 1, this.hawkerAppDate.getMonth(), 1);
        this.getInformation("usp_unfyd_grievance_dashboard", "Year")
        if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      }
    } else if (direction == "prev") {
      if (this.selectedGrievance == 'Day') {
        this.getYesterdayDate()
        this.getInformation("usp_unfyd_grievance_dashboard", "Day")
        this.nextDisable = false;
      } else if (this.selectedGrievance == 'Month') {
        if (this.hawkerAppDate.getMonth() == 0) {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() - 1, 11, 1);
          this.getInformation("usp_unfyd_grievance_dashboard", "Month")
          this.nextDisable = false;
        } else {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear(), this.hawkerAppDate.getMonth() - 1, 1);
          this.getInformation("usp_unfyd_grievance_dashboard", "Month")
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == 'Year') {
        this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() - 1, this.hawkerAppDate.getMonth(), 1);
        this.getInformation("usp_unfyd_grievance_dashboard", "Year")
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
        this.trainingData = res.results.data;
        this.trainingData[0].color = '#ECF2FB'
        this.trainingData[1].color = '#36BC9B'
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
      this.getGraphData();
    })
  }

  keepOrder = (a) => {
    this.common.hubControlEvent('Dashboard','click','','',a,'keepOrder');

    return a;
  }

  getGraphData() {
    this.common.hubControlEvent('Dashboard','click','','','','getGraphData');

    this.colorPalette = []
    let sum = 0
    this.trainingData.forEach(element => {
      sum = sum + element.value
    });

    var ar = [];
    this.trainingData.forEach(element => {
      if(element.value != 0){
        ar.push(element)
      }
    });

    if(ar.every((val,i,ar)=> val.value == 0))
    ar=[{
      value : 0,
      name : 'No Data'
    }]

    ar.forEach((element)=>{
      if(element.name == 'Resolved'){
        this.colorPalette.push('#36BC9B')
      }else if(element.name == 'Pending'){
        this.colorPalette.push('#ECF2FB')
      } else if(element.name == 'No Data'){
        this.colorPalette.push('#ECF2FB')
      }
    })
    this.options = {
      title: {
        text: JSON.stringify(sum) ,
        subtext:'Grievances',
        left: 'center',
        top:'center',
        textStyle:{
          fontSize: 25,
        },
        itemGap:0,
        subtextStyle:{
        },
      },

    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: 'Grievances',
        type: 'pie',
        color: this.colorPalette,
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          position: 'outer',
          overflow:'break',
            formatter: '{a|{c}}',
          distanceToLabelLine:-10,
          fontSize:'12px',
          color:'#707070',
          rich: {
            a: {
              color: '#212121',
              fontSize:'16px',
              fontWeight:'bold'
            },
          }
          },
          labelLine: {
            show: false
          },
        clockwise:true,
        data: ar
      }
    ]
  };
  }
}
