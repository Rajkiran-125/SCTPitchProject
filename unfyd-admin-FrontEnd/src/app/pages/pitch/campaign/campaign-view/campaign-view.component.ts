import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from '../../../../global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { EChartsOption, graphic } from 'echarts';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { MatDialog } from '@angular/material/dialog';
import { PitchDialogComponent } from '../../pitch-dialog/pitch-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PitchCommonService } from 'src/app/global/pitch-common.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';


@Component({
  selector: 'app-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.scss']
})


export class CampaignViewComponent implements OnInit {
  tabValue = [];
  campaignDetails:any = {};
  type = 'campaignView';
  vennBlock1 = 10
  vennBlock2 = 20
  vennBlock3 = 30
  doughnutChartData: EChartsOption = {};
  inner_content_height = getComputedStyle(document.body).getPropertyValue(
    "--content"
  );
  content_height = getComputedStyle(document.body).getPropertyValue(
    "--content"
  );
  header_height = getComputedStyle(document.body).getPropertyValue("--header");
  colorPalette = this.common.colorArray.concat(this.common.colorArray);
  lineChartData: EChartsOption = {};
  chartandGraph: any;
  CampaignName:any;
  ChannelId: any;
  ChannelName:any;
  ChannelSource=[];
  ChannelSourceId:any;
  StartTime: any;
  EndTime: any;
  campaignId:any
  isChecked:any;
  campaignData:any;

  private subscription: Subscription;
  

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public common: CommonService,
    private dialog: MatDialog,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private pitchCommon:PitchCommonService,
    private datePipe: DatePipe,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      // console.log(params);
      this.pitchCommon.CampaignIdAndStatus = params;
      this.campaignId = params['id'];
      //console.log(this.campaignId);
      this.isChecked = params['isChecked'];
      //console.log(this.isChecked);
    });
    
    // this.campaignData = this.activatedRoute.snapshot.data;
    // console.log(this.campaignData);
    
    this.getCampaignDetailsById();
    this.doughnutData(); 
    this.lineData();
    this.getCampaignDetailsByCampaignId();
    
  }

 doughnutData(){
    let sum = 60;
    var colorPalette = [ '#d93523', '#64ccad',];
   this.doughnutChartData = {
     title: {
       show:true,
       text: sum.toString(),
       subtext: 'Audience',
       left: "center",
       top: "35%",
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
       show:true,
        bottom: '-1%',
       left: 'center',
       icon: "rect",
       orient: "horizontal",
       textStyle: {
         fontWeight: 'normal',
         color: '#707070'
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
         name: 'Header',
         type: "pie",
         radius: ["40%", "70%"],
         avoidLabelOverlap: false,
         center: ["50%", "60%"],
         color: colorPalette,
         label: {
           position: "outer",
           overflow: "break",
           formatter: "{a|{c}}",
           distanceToLabelLine: -20,
           width: 70,
           fontSize: 8,
           color: "#707070",
           rich: {
             a: {
               color: "#212121",
               fontSize: "12px",
               fontWeight: "bold",
             },
           },
         },
         top: "-18%",
         left: "0%",
         bottom:"15%",
         labelLine: {
           show: false,
         },
         clockwise: true,
         
         data: [
           { value: 27, name: 'pending',},
           { value: 33, name: 'sent' },
          
         ]
         
       },
       
     ],
   };
 }

 lineData(){
     this.lineChartData = {
       title:{
         subtext: "10K Per Minute  166 Per Second",
         
         backgroundColor:'#1c74c7',  
         subtextStyle:{
           color:'#fff',
           fontSize: '10px',
         },
         left: "center",
         bottom:'0px',
        
       },
       tooltip: {
         trigger:'axis',
         textStyle:{
           fontSize:this.inner_content_height.substring(0, this.inner_content_height.length -2)
         },
         position: function(point, params, dom, rect, size){
         var x = point[0];
         var y = point[1];
         var viewWidth = size.viewSize[0];
         var viewHeight = size.viewSize[1];
         var boxWidth = size.contentSize[0];
         var boxHeight = size.contentSize[1];
         var posX = 0;
         var posY = 0;
        //  console.log("a:"+boxWidth + "b:"+boxHeight);
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
     
       grid: {
         // top:this.chartandGraph.hideLegend ? '15%':'5%',
         top:'4%',
         left: '0%',
         right: '8%',
         bottom: '20%',
         containLabel: true,
       },
       xAxis: [
         {
           type: 'category',
           boundaryGap: false,
           data: [2,4,6,8,10,12],
         }
       ],
       yAxis: {
         type: "value",
         axisLine: {
           show: true,   
         },
         axisLabel: {
           formatter: function (value: any) {
                 if(value === 0){
                   return value;
                 }else {
                   return (value * 2) + 'L';
                 }
               },
             },
         },
       
       series: [
             {
           name: this.chartandGraph?.blocks[0].header ? this.chartandGraph?.blocks[0].header : 'Block1',
           type: 'line',
           stack: 'Total',
           lineStyle: {
             width: 2,
             color: this.colorPalette[0]
           },
           showSymbol: false,
           areaStyle: {
             opacity: 0.8,
             color: new graphic.LinearGradient(0, 0, 0, 1, [
               {
                 offset: 0,
                 color: this.colorPalette[0]                 
               },
               {
                 offset: 1,
                 color: '#F8F8F8'
               }
             ])
           },
           emphasis: {
             focus: 'series'
           },
           color: this.colorPalette[0],
           data: [6,4,6,4,5,6]
         },
       ]
     };
 }

  getCampaignDetailsById() {
    var Obj1 = {
      data: {
        spname: "usp_unfyd_getcampaignsentdetailsbycampaignid",
        parameters: {
          "CampaignId":this.campaignId ? this.campaignId : ""
        }
      }
    }

    this.api.post('pitch/index', Obj1).subscribe(res => {
      //this.loader = false;
      if (res.code == 200) {
        this.tabValue = res.results.data;
         // console.log(res.results.data)
      }
    })
  }


  getCampaignDetailsByCampaignId() {
  // console.log(this.campaignId);
    var Obj = {
      data: {
        spname: "usp_unfyd_getcampaigndetailbycampaignid",
        parameters: {
          "CampaignId": this.campaignId ? this.campaignId : ""
        }
      }
    }
    this.api.post('pitch/index', Obj).subscribe(res => { 
      //this.loader = false;
      if (res.code == 200) {
        this.campaignDetails = res.results.data;
         console.log(this.campaignDetails);
         
         this.ChannelId = this.campaignDetails?.[0]?.Channel;
         this.ChannelSourceId = this.campaignDetails?.[0]?.ChannelSource;
        this.StartTime = this.formatDateTime(this.campaignDetails?.[0]?.StartDateTime) 
         this.EndTime = this.formatDateTime(this.campaignDetails?.[0]?.EndDateTime);
         this.CampaignName = this.campaignDetails?.[0]?.CampaignName;
         this.getChannelName();
         this.getChannelSourceName();
         this.sendCampaignDataToPitchService();
      }
    })
  }
  sendCampaignDataToPitchService(){
    this.pitchCommon.StartTime = this.StartTime;
    this.pitchCommon.EndTime = this.EndTime;
    this.pitchCommon.ChannelName = this.ChannelName; 
    this.pitchCommon.CampaignName = this.CampaignName;
   }

  formatDateTime(dateTime): string {
    if (!dateTime) {
      return ''; // Handle null or undefined dateTime
    }else{
      const utcDate = new Date(dateTime);
      const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
      const formattedDateTime = this.datePipe.transform(localDate, 'dd/MM/yyyy HH:mm:ss');
      //const formattedDateTime = this.datePipe.transform(localDate, 'dd/MM/yyyy hh:mm:ss a');
      return formattedDateTime || '';
    } 
  }

  getChannelName(){
    if(this.ChannelId == 1){
      return this.ChannelName = 'WhatsApp'
    }
    if(this.ChannelId == 34){
      return this.ChannelName = 'Email'
    }
    if(this.ChannelId == 28){
      return this.ChannelName = 'SMS'
    }
  }

  getChannelSourceName() {
      var Obj = {
        data: {
          spname: "usp_unfyd_channel_config",
          parameters: {
            FLAG: "GET_CHANNELSOURCE_NAME",
            CHANNELID: this.ChannelId ? this.ChannelId : '',
            CHANNELSRCID: this.ChannelSourceId ? this.ChannelSourceId : ''
            // CHANNELID: 2,
            // CHANNELSRCID: 504
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => { 
        //this.loader = false;
        if (res.code == 200) {
          //console.log(res); 
          this.ChannelSource = res.results.data;
          // console.log(this.ChannelSource);
          this.pitchCommon.ChannelSource = this.ChannelSource;
          // console.log(this.pitchCommon.ChannelSource);       
        }
      })
    }


  dialogView() {
    this.dialog.open(PitchDialogComponent, {
      data:{
        type : "CampaignInfo",
        data : this.campaignDetails
       },
      disableClose: true,
      height: '80%',
      width: '90%'
    })
  }

  goToUpdateCampaign(){
    let activeRoute = this.activatedRoute.snapshot.params['id'];
    let id = this.api.campaignListTableIndex ? this.api.campaignListTableIndex : activeRoute ;
    this.router.navigate([`/pitch/campaign/update/${id}`])
  }

  goBack() {
    this.location.back();
  }


}
