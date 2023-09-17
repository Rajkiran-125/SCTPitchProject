import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { WeekPipe } from 'src/app/global/week.pipe';

@Component({
  selector: 'app-tile-card',
  templateUrl: './tile-card.component.html',
  styleUrls: ['./tile-card.component.scss']
})
export class TileCardComponent implements OnInit, OnChanges {
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
  subPlaceholder1Data :number|string= 0
  subPlaceholder2Data :number|string= 0
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
    this.changeTileDropdown()
    if(this.tile.subPlaceHolder3SelectedValue == 'lineChart'){
      this.callApiForLineChart()
    }else{

    }
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
      this.changeTileDropdown()
      if(this.tile.subPlaceHolder3SelectedValue == 'lineChart'){
        this.callApiForLineChart()
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
      console.log(this.tile.reloadTimeEnable  ,":", milliSeconds ,":", this.isReload);

      this.refreshIntervalId = setInterval(() => {
        if (this.router.url == "/dashboard" && JSON.parse(localStorage.getItem("refreshDashboard"))) {
          this.callApi();
          this.changeTileDropdown()
          if(this.tile.subPlaceHolder3SelectedValue == 'lineChart'){
            this.callApiForLineChart()
          }
        }
      }, milliSeconds * 1000);
    } else {
      clearInterval(this.refreshIntervalId);
    }
  }

  callApi1(){

    let obj;
    if(this.tile.countRequest){
    obj = JSON.parse(this.tile.countRequest)
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
    }

    if(!this.tile.countApi || !this.tile.countRequest){

    }else{
      this.api.dynamicDashboard(this.tile.countApi, obj).subscribe(res => {
        if (res.code == 200) {

          this.mainPlaceholderData = res.results.data[0][this.tile.mainPlaceHolderHeader] ? res.results.data[0][this.tile.mainPlaceHolderHeader] : 0
          this.subPlaceholder1Data = res.results.data[0][this.tile.mainPlaceHolderHeader+this.tile.subPlaceHolder1Header] ? res.results.data[0][this.tile.mainPlaceHolderHeader+this.tile.subPlaceHolder1Header] : 0
          this.subPlaceholder2Data = res.results.data[0][this.tile.mainPlaceHolderHeader+this.tile.subPlaceHolder2Header] ? res.results.data[0][this.tile.mainPlaceHolderHeader+this.tile.subPlaceHolder2Header]: 0
        }
      },(error)=>{
        this.common.snackbar("Something Went Wrong","error");
      }
      )
    }
  }

  callApiForLineChart(){

    let obj
    if(this.tile.subPlaceHolder3Request) obj = this.returnObjectWithKeys(this.tile.subPlaceHolder3Request);
    if(!this.test){
      if(this.tile.subPlaceHolder3Api && obj){
        this.api.dynamicDashboard(this.tile.subPlaceHolder3Api,obj).subscribe(res => {
          if (res.code == 200) {
            if(Object.keys(res.results).length > 0){
              if(res.results.data.length > 0){
                this.lineChartValue = (res.results.data[0].HourStats).split(",").map(Number);
                this.changeTileDropdown()
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
        this.lineChartValue = [20, 20, 10, 8, 1, 5, 15];
        this.changeTileDropdown()
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

                this.mainPlaceholderData = res.results.data[0][this.tile.mainPlaceHolderHeader] ? res.results.data[0][this.tile.mainPlaceHolderHeader] : 0
                this.subPlaceholder1Data = !this.tile.subPlaceHolder1Header ? 0 :  res.results.data[0][this.tile.mainPlaceHolderHeader+ '_' +this.tile.subPlaceHolder1Header] ? res.results.data[0][this.tile.mainPlaceHolderHeader+ '_' +this.tile.subPlaceHolder1Header] : this.tile.subPlaceHolder1Header.toLowerCase() == ('avg'||'avg time') ? '00:00:00' : 0
                this.subPlaceholder2Data = !this.tile.subPlaceHolder2Header ? 0 : res.results.data[0][this.tile.mainPlaceHolderHeader+ '_' +this.tile.subPlaceHolder2Header] ? res.results.data[0][this.tile.mainPlaceHolderHeader+ '_' +this.tile.subPlaceHolder2Header] : this.tile.subPlaceHolder2Header.toLowerCase() == ('max'||'max time') ? '00:00:00' : 0
                this.gaugeValue = this.mainPlaceholderData && res.results.data[0]['TotalEntered'] ?  Math.round((this.mainPlaceholderData  / res.results.data[0]['TotalEntered']) * 100) : 0
                this.queueTimeValue = res.results.data[0]['LongestInQueue'] ? res.results.data[0]['LongestInQueue'] :  '00:00:00'
                this.changeTileDropdown()
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
        this.lineChartValue = [20, 20, 10, 8, 1, 5, 15];
        this.changeTileDropdown()
      }
  }

  changeTileDropdown(){

    this.options1 = {}

    if(this.tile.subPlaceHolder3SelectedValue == 'lineChart'){
      this.options1 = {
        xAxis: {
          type: "category",

          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ffffff",
              width: 2,
            },
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: "{c}",
          borderWidth: 0,
          padding: [0,6],
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ffffff",
              width: 2,
            },
          },
          splitLine: {
            show: false,
          },
        },
        grid: {
          top: "5%",
          left: "0%",
          right: "0%",
          bottom: "5%",
        },

        series: [
          {
            data: this.lineChartValue,
            type: "line",
            symbolSize: 5,
            color: "#ffffff",
            lineStyle: {
              color: "#ffffff",
              width: 2,
              type: "solid",
            },
            itemStyle: {
            },
          },
        ],
      };
    } else if(this.tile.subPlaceHolder3SelectedValue == 'gaugeChart'){
      this.options1 = {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            detail: {
              formatter: "{value}%",
              offsetCenter: ["0%", "8%"],
              color: "#ffffff",
              align: "center",
              fontSize: "14px",
            },
            color: "#ffffff",
            radius: "100%",

            pointer: {
              show: false,
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 0.5,
                borderColor: "#FFFFFF",
              },
            },
            axisLine: {
              lineStyle: {
                width: 2,
                shadowColor: "#FBAD17",
                opacity: 0.5,
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 1,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              distance: 5,
            },
            data: [
              {
                value: this.gaugeValue,
              },
            ],
          },
        ],
      };
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
    setTimeout(() => {
      if(this.subscription){
        this.subscription.forEach((e) => {
          e.unsubscribe();
        });
      }
    });
  }

}
