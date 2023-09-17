import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption,graphic } from 'echarts';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-dashboard-overall-collection',
  templateUrl: './dashboard-overall-collection.component.html',
  styleUrls: ['./dashboard-overall-collection.component.scss']
})
export class DashboardOverallCollectionComponent implements OnInit {
  loader: boolean = false;
  spname = '';
  flag = 'Year';
  endPoint = 'index';
  hawkerAppButton = "Year";
  keys: any;
  nextDisable: boolean = true;
  previousDisable: boolean = false;
  values: any;
  hawkerAppDate:any = new Date();
  today: any = new Date();
  tommorow: any = new Date(this.today.getTime() + 24 * 60 * 60 * 1000)
  sum = 0;
  trainingData: any;
  selectedGrievance: any = 'Year';
  options: EChartsOption = {}
  isReload = 0;
  refreshIntervalId:any

  constructor(private api: ApiService	,public common: CommonService,private router :Router) { }

  ngOnInit() {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.today = new Date(this.today.setHours(0, 0, 0, 0))
    this.hawkerAppDate = new Date(this.hawkerAppDate.setHours(0, 0, 0, 0))
    this.getInformation("usp_unfyd_overall_collection_dashboard", "Year")

    this.common.reloadTime$.subscribe(res => {
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
          this.getInformation("usp_unfyd_overall_collection_dashboard", "Year")
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
        this.getInformation("usp_unfyd_overall_collection_dashboard", "Day")
        if (this.hawkerAppDate.getTime() == this.today.getTime()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == 'Month') {
        if (this.hawkerAppDate.getMonth() == 11) {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() + 1, 0, 1);
          this.getInformation("usp_unfyd_overall_collection_dashboard", "Month")

          if (this.hawkerAppDate.getMonth() == this.today.getMonth() && this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        } else {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear(), this.hawkerAppDate.getMonth() + 1, 1);
          this.getInformation("usp_unfyd_overall_collection_dashboard", "Month")
          if (this.hawkerAppDate.getMonth() == this.today.getMonth() && this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
            this.nextDisable = true;
          } else {
            this.nextDisable = false;
          }
        }
      } else if (this.selectedGrievance == 'Year') {
        this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() + 1, this.hawkerAppDate.getMonth(), 1);
        this.getInformation("usp_unfyd_overall_collection_dashboard", "Year")
        if (this.hawkerAppDate.getFullYear() == this.today.getFullYear()) {
          this.nextDisable = true;
        } else {
          this.nextDisable = false;
        }
      }
    } else if (direction == "prev") {
      if (this.selectedGrievance == 'Day') {
        this.getYesterdayDate()
        this.getInformation("usp_unfyd_overall_collection_dashboard", "Day")
        this.nextDisable = false;
      } else if (this.selectedGrievance == 'Month') {
        if (this.hawkerAppDate.getMonth() == 0) {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() - 1, 11, 1);
          this.getInformation("usp_unfyd_overall_collection_dashboard", "Month")
          this.nextDisable = false;
        } else {
          this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear(), this.hawkerAppDate.getMonth() - 1, 1);
          this.getInformation("usp_unfyd_overall_collection_dashboard", "Month")
          this.nextDisable = false;
        }
      } else if (this.selectedGrievance == 'Year') {
        this.hawkerAppDate = new Date(this.hawkerAppDate.getFullYear() - 1, this.hawkerAppDate.getMonth(), 1);
        this.getInformation("usp_unfyd_overall_collection_dashboard", "Year")
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
    return a;
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(a),'keepOrder');

  }

  getGraphData() {
    this.common.hubControlEvent('Dashboard','click','','','','getGraphData');

let key=[];
let values=[];
  this.trainingData.forEach(element => {
    key.push(element.name)
    values.push(element.value)
  });

  this.sum = 0
  this.trainingData.forEach(element => {
    this.sum = this.sum + element.value
  });


  this.options = {
    xAxis: {
      type: 'category',
      data: key,
      axisTick:{
        show:false
      },
    },
    yAxis: {
      type: 'value',
      show: false
    },
  tooltip: {
    trigger:'axis',
    position: function(point, params, dom, rect, size){
    var x = point[0];//
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
    grid: { containLabel:true ,top:10,left:-43, bottom:0,right:0,show:false },

    series: [
      {
        data: values,
        type: 'line',
        showSymbol: false,
        smooth: false,
        lineStyle: {color: '#4B89DC'},
        areaStyle: {
          opacity: 0.8,
          color:  new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#D0E0F8'
            },
            {
              offset: 1,
              color: '#F8F8F8'
            }
          ])
        },
      }
    ]
  };
}
}
