import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
  isReload = 0;
  refreshIntervalId:any
  firstTimeLoader = true
  constructor(private api: ApiService	,public common: CommonService,private router :Router) { }

  ngOnInit(): void {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

      this.getInformation('usp_unfyd_total_header_dashboard','All')
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
          this.getInformation('usp_unfyd_total_header_dashboard','All')
        }, this.isReload*1000);
      } else{
        clearInterval(this.refreshIntervalId)
      }
  }
  getInformation(spname, flag) {
    if(this.firstTimeLoader){
      this.loader = true;
      this.firstTimeLoader = false
    } else{
      this.firstTimeLoader = false
      this.loader = false
    }

    let obj = {
      "data": {
        "spname": spname,
        "parameters": {
          "flag": flag
        }
      }
    }

    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(this.endPoint),'getInformation');

    this.api.post(this.endPoint, obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.trainingData = res.results.data[0];
      }
    })
  }
}
