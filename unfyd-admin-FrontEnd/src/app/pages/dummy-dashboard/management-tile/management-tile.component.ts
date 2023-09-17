import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { WeekPipe } from 'src/app/global/week.pipe';

@Component({
  selector: 'app-management-tile',
  templateUrl: './management-tile.component.html',
  styleUrls: ['./management-tile.component.scss']
})
export class ManagementTileComponent implements OnInit {
  @Input() tile:any;
  @Input() test:any;
  @Input() selectedGetGroupList:any = []
  @Input() selectedSkillType:any = []
  @Input() selectedChannelType:any = []
  @Input() selectedWorkflow:any = []
  @Input() selectedDateFilterDropdown:any = []
  @Input() autoReload:boolean = false;
  userDetails:any;
  options1: EChartsOption = {};
  mainPlaceholderData = 0
  subPlaceholder1Data :number|string= 1000
  subPlaceholder2Data :number|string= 7858
  isReload = 0;
  refreshIntervalId: any;
  gaugeValue = 0
  lineChartValue = [0]
  subscription: Subscription[] = [];
  queueTimeValue = '00:00:00'
  currentDateTime = new Date()
  labelName: any;
  loader: boolean;
  userConfig: any;
  fullscreen:boolean = false
  startOfWeek = new Date()
  endOfWeek = new Date()
  constructor(public common: CommonService,public auth: AuthService,private api: ApiService, private router:Router,public week: WeekPipe) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.userDetails = this.auth.getUser();

    this.callApi()
    this.subPlaceholder1Data = !this.tile.subPlaceHolder1Header ? 0 : this.tile.subPlaceHolder1Header && this.tile.subPlaceHolder1Header.toLowerCase() == ('avg'||'avg time') ? '00:00:00' : 0
    this.subPlaceholder2Data = !this.tile.subPlaceHolder2Header ? 0 : this.tile.subPlaceHolder2Header && this.tile.subPlaceHolder2Header.toLowerCase() == ('max'||'max time') ? '00:00:00' : 0
  }


  ngOnInit(): void {
    this.subscription.push(this.common.dashboardTabChanged$.subscribe(res => {
      clearInterval(this.refreshIntervalId);
      // this.ngOnDestroy()
    })
    )
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(this.common.applyFilterForDashboard$.subscribe(res=>{
      this.selectedGetGroupList = res.selectedGetGroupList
      this.selectedSkillType = res.selectedSkillType
      this.selectedChannelType = res.selectedChannelType
      this.selectedWorkflow = res.selectedWorkflow
      this.selectedDateFilterDropdown[0] = res.selectedDateFilterDropdown
      let week = this.week.transform(this.currentDateTime)
        this.endOfWeek = this.common.dateFromDay(((week -1) * 7)+1)
        this.startOfWeek = this.common.dateFromDay(((week -1) * 7) - 5)
      this.callApi()
      if(this.tile.subPlaceHolder3SelectedValue == 'lineChart'){
      }
    }))
    this.common.setUserConfig(this.userDetails.ProfileType, 'Dashboard');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
    }))
    this.subscription.push(this.common.dashboardFullScreen$.subscribe((res) => {
      this.fullscreen = res;
      clearInterval(this.refreshIntervalId);
      this.reloadData();
    }));
    this.subscription.push(this.common.autoRefreshDashboard$.subscribe((res) => {
      this.isReload = res;
      clearInterval(this.refreshIntervalId);
      this.reloadData();
    }));
    this.reloadData();
    this.common.hubControlEvent('Dashboard','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(
      this.userDetails.Processid,
      "Dashboard",
      data
    );
  }
  reloadData() {
    let milliSeconds = 0;
    if(this.tile.reloadTime && typeof(this.tile.reloadTime) == 'number'){
      if(this.tile.reloadTimeType && this.tile.reloadTimeType.toLowerCase() == 'min'){
        milliSeconds = this.tile.reloadTime * 60
      } else{
        milliSeconds = this.tile.reloadTime
      }
    } else{
      milliSeconds = 2
    }

    this.isReload = JSON.parse(localStorage.getItem("refreshDashboard"));
    if (this.tile.reloadTimeEnable && milliSeconds && this.isReload){
      this.refreshIntervalId = setInterval(() => {
        if (this.router.url == "/dashboard" && JSON.parse(localStorage.getItem("refreshDashboard"))) {
          this.callApi();
          if(this.tile.subPlaceHolder3SelectedValue == 'lineChart'){
          }
        }
      }, milliSeconds * 1000);
    } else {
      clearInterval(this.refreshIntervalId);
    }
  }

  callApi(){

    this.currentDateTime = new Date()
    let obj
    if(this.tile.countRequest) obj = this.returnObjectWithKeys(this.tile.countRequest);

    if(!this.test){
      if(this.tile.countApi && obj){
        this.api.dynamicDashboard(this.tile.countApi,obj).subscribe(res => {
          if (res.code == 200) {
            if(Object.keys(res.results).length > 0){
              if(res.results.data.length > 0){
                this.subPlaceholder1Data = !this.tile.subPlaceHolder1Key ? 0 :  res.results.data[0][this.tile.subPlaceHolder1Key] ? res.results.data[0][this.tile.subPlaceHolder1Key] : this.tile.subPlaceHolder1Key.toLowerCase() == ('avg'||'avg time') ? '00:00:00' : 0
                this.subPlaceholder2Data = !this.tile.subPlaceHolder2Key ? 0 : res.results.data[0][this.tile.subPlaceHolder2Key] ? res.results.data[0][this.tile.subPlaceHolder2Key] : this.tile.subPlaceHolder2Key.toLowerCase() == ('max'||'max time') ? '00:00:00' : 0
              } else{

              }
            } else{
            }
          } else{
          }
        },(error)=>{
        })
      } else{
      }
      } else{
      }
  }

  openDrillDown(num){
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(num),'openDrillDown');

    let header;
    let obj;
    let url;



    if(num == 1){
      obj = this.tile.apiRequest ? this.returnObjectWithKeys(this.tile.apiRequest) : this.tile.apiRequest
      header = this.tile.mainPlaceHolderHeader ? this.tile.mainPlaceHolderHeader : 'Main PlaceHolder';
      url = this.tile.api
    } else if(num == 2){
      obj = this.tile.subPlaceHolder1Request ? this.returnObjectWithKeys(this.tile.subPlaceHolder1Request) : this.tile.subPlaceHolder1Request
      header = this.tile.subPlaceHolder1Header ? this.tile.subPlaceHolder1Header : 'Sub Placeholder 1';
      url = this.tile.subPlaceHolder1Api
    } else if(num == 3){
      obj = this.tile.subPlaceHolder2Request ? this.returnObjectWithKeys(this.tile.subPlaceHolder2Request) : this.tile.subPlaceHolder2Request
      header = this.tile.subPlaceHolder2Header ? this.tile.subPlaceHolder2Header : 'Sub Placeholder 2';
      url = this.tile.subPlaceHolder2Api
    }

    if(this.tile.api && (this.tile.api.trim()).length > 0 && this.tile.apiRequest && (this.tile.apiRequest.trim()).length > 0){
      this.common.openDrillDown(header,obj,url)
    }
  }

  returnObjectWithKeys(inputObj:any){


    let obj = JSON.parse(inputObj)
    const lowerObj = this.common.ConvertKeysToLowerCase();
    obj = lowerObj(obj);
    obj.data.parameters = lowerObj(obj.data.parameters);

    if(obj?.data?.parameters?.processid){
      obj.data.parameters.processid = this.userDetails?.Processid
    } else{
      Object.assign(obj.data.parameters,{processid:this.userDetails.Processid})
    }

    if(obj?.data?.parameters?.adminid){
      obj.data.parameters.adminid = this.userDetails?.Id
    } else{
      Object.assign(obj.data.parameters,{adminid:this.userDetails.Id})
    }

    if(obj?.data?.parameters?.channelid){
      obj.data.parameters.channelid = this.selectedChannelType.join()
    } else{
      Object.assign(obj.data.parameters,{channelid:this.selectedChannelType.join()})
    }

    if(obj?.data?.parameters?.groupid){
      obj.data.parameters.groupid = this.selectedGetGroupList.join()
    } else{
      Object.assign(obj.data.parameters,{groupid:this.selectedGetGroupList.join()})
    }

    if(obj?.data?.parameters?.skillid){
      obj.data.parameters.skillid = this.selectedSkillType.join()
    } else{
      Object.assign(obj.data.parameters,{skillid:this.selectedSkillType.join()})
    }

    if(obj?.data?.parameters?.frequency){
      obj.data.parameters.frequency = this.selectedDateFilterDropdown[0] ? this.selectedDateFilterDropdown[0] : 'Day'
    } else{
      Object.assign(obj.data.parameters,{frequency:this.selectedDateFilterDropdown[0] ? this.selectedDateFilterDropdown[0] : 'Day'})
    }

    if (this.selectedDateFilterDropdown[0] == "Hour") {
      if(obj?.data?.parameters?.hour){
        obj.data.parameters.hour = this.currentDateTime.getHours()
      } else{
        Object.assign(obj.data.parameters,{hour:this.currentDateTime.getHours()})
      }
    }else if (this.selectedDateFilterDropdown[0] == "Day") {
      if(obj?.data?.parameters?.date){
        obj.data.parameters.date = this.convert(this.currentDateTime)
      } else{
        Object.assign(obj.data.parameters,{date:this.convert(this.currentDateTime)})
      }
    }else if (this.selectedDateFilterDropdown[0] == "Week") {
      if(obj?.data?.parameters?.from){
        obj.data.parameters.from = this.startOfWeek
      } else{
        Object.assign(obj.data.parameters,{from:this.startOfWeek})
      }

      if(obj?.data?.parameters?.to){
        obj.data.parameters.to = this.endOfWeek
      } else{
        Object.assign(obj.data.parameters,{to:this.endOfWeek})
      }
    } else if (this.selectedDateFilterDropdown[0] == "Month") {
      if(obj?.data?.parameters?.month){
        obj.data.parameters.month = this.currentDateTime.getMonth() + 1
      } else{
        Object.assign(obj.data.parameters,{month:this.currentDateTime.getMonth() + 1})
      }

      if(obj?.data?.parameters?.year){
        obj.data.parameters.year = this.currentDateTime.getFullYear()
      } else{
        Object.assign(obj.data.parameters,{year:this.currentDateTime.getFullYear()})
      }
    } else if (this.selectedDateFilterDropdown[0] == "Year") {
      if(obj?.data?.parameters?.year){
        obj.data.parameters.year = this.currentDateTime.getFullYear()
      } else{
        Object.assign(obj.data.parameters,{year:this.currentDateTime.getFullYear()})
      }
    } else if (!this.selectedDateFilterDropdown[0]) {
      if(obj?.data?.parameters?.date){
        obj.data.parameters.date = this.convert(this.currentDateTime)
      } else{
        Object.assign(obj.data.parameters,{date:this.convert(this.currentDateTime)})
      }
    }

    return obj;
  }

  convert(str) {

    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  jsonParseRefreshDashboard(){
    this.common.hubControlEvent('Dashboard','click','','','','jsonParseRefreshDashboard');

    return JSON.parse(localStorage.getItem('refreshDashboard'))
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}
