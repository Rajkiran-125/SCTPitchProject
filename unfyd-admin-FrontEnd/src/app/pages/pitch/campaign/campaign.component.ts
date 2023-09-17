import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from '../../../global/auth.service';
import { Subject } from 'rxjs';
import { CommonService } from 'src/app/global/common.service';
import { PitchCommonService } from 'src/app/global/pitch-common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {
  tabValue = [];
  tableData = [];
  type = 'campaignlist';
  loader: boolean = false;
  req: { data: { spname: string; parameters: { flag: string; processid: any; }; }; };
  userDetails: any;
  ddTypes: any;
  ddChannels: any;
  ddCampaigns: any;
  ddChannelSource: any;
  
  setMin:any;
  tileHeading = [
    {id:1, name:'Active Campaigns'},
    {id:2, name:'Total Audience'},
    {id:3, name:'Delivered'},
    {id:4, name:'Unique Views'},
    {id:5, name:'Responded'}
  ];
  activeCampaign:any;
  totalAudienceNumber:any;
  
  selectedTypeOption:any=1;
  //[(ngModel)]="selectedChannelsOption" use in select Tag
  selectedChannelsOption:any=1;
  filteredData= [];
  min: Date = new Date(); // Set a minimum date if needed
  defaultDate: Date = new Date(); // Set a default date if needed

  constructor( 
    private api: ApiService,
    private auth: AuthService,
    private common:CommonService,
    private pitchCommon :PitchCommonService,
    private router: Router
    ) { this.defaultDate = new Date(); }

    // ngOnChanges() {
    //   if (!this.ddTypes) return null;
    //   console.log(this.ddTypes);
    // }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.getCampaignList();
    
    // this.ddTypes = this.getDropdownData("CAMPAIGNSCHEDULETYPES");
    this.getDropdownData("CAMPAIGNSCHEDULETYPES");
    // this.getDropdownData("CHANNELTYPES");
    this.getDropdownData("CHANNELSOURCE");
    this.getDropdownData("CAMPAIGNS");
    this.getDropdownChannel();
    // console.log(this.ddTypes);
   
    
    
  }

  

  getCampaignList() {
    this.loader = true;
    var Obj1 = {
      data: {
        spname: "USP_UNFYD_GETCampaignList",
        parameters: {
        }
      }
    }

    this.api.post('pitch/index', Obj1).subscribe(res => {
      // console.log(res);  
      this.loader = false;
      if (res.code == 200) {
        this.tabValue = res.results.data;
        this.tableData = [...res.results.data];
         //console.log(this.tabValue); 
         this.totalActiveCampaign(); 
         this.sendArray(); 
      }
    })
  }
  sendArray() {
    this.pitchCommon.sendData(this.tabValue);
  }
  


  totalActiveCampaign(){
    // this.tabValue = this.tableData;
    let totalCampaigns = [...this.tableData];
    this.activeCampaign = totalCampaigns.filter((item)=>{
      return item.Status !== "Inactive"
    });
    //console.log(this.activeCampaign.length);    
  }
  // totalAudience(){
  //   let totalCampaigns = [...this.tableData];
  //   // this.activeCampaign = totalCampaigns.filter((item)=>{
  //   //   return item.Status !== "Inactive"
  //   // });
  //   //console.log(this.activeCampaign.length); 
  //   this.totalAudienceNumber = 
  // }


  getColor(index :number) : string {
    switch( index) { 
      case 0 : return this.common.color.green;
      case 1 : return this.common.color2.purple;
      case 2 : return this.common.color.red;
      case 3 : return this.common.color.blue;
      case 4 : return this.common.color.yellow;
    }
  }

  getHeading(index :number) : string {
    switch( index) { 
      case 0 : return 'Active Campaigns';
      case 1 : return 'Total Audience';
      case 2 : return 'Delivered';
      case 3 : return 'Unique Views';
      case 4 : return 'Responded';
    }
  }
  
  getTileCardLeftData(index :number) : string {
    switch( index) { 
      case 0 : return `Paused-10`;
      case 1 : return `Sent-24000`;
      case 2 : return 'Undelivered-3906';
      case 3 : return `Unique Click-Through-12451`;
      case 4 : return `Not Responded-1980`;
    }
  }
  getTileCardRightData(index :number) : string {
    switch( index) { 
      case 0 : return `Completed-290`;
      case 1 : return `Pending-154`;
      case 2 : return `Error-912`;
      case 3 : return ``;
      case 4 : return ``;
    }
  }
  getTileCardMainCount(index :number) : string{
    switch( index) { 
      case 0 : return `${this.activeCampaign?.length ? this.activeCampaign?.length : 0}`;
      case 1 : return `24154`;
      case 2 : return `18248`;
      case 3 : return `14875`;
      case 4 : return `10471`;
    }
  }
  getDropdownData(flag :any) {
    var Obj1 = {
      data: {
        spname: "USP_UNFYD_GetDropdownData",
        parameters: {
          "Flag" : flag
        }
      }
    }

  this.api.post('pitch/index', Obj1).subscribe(res => {
      //this.loader = false;
      if (res.code == 200) {
        // console.log(flag);
        if(flag == 'CAMPAIGNSCHEDULETYPES'){
          this.ddTypes = res.results.data;
        }
        // if(flag == 'CHANNELTYPES'){
        //   this.ddChannels = res.results.data;
        //   //console.log(this.ddChannels); 
        // }
        if(flag == 'CHANNELSOURCE'){
          this.ddChannelSource = res.results.data;
        }
        if(flag == 'CAMPAIGNS'){
          this.ddCampaigns = res.results.data;
        }
       
      }
    })
  }
  getDropdownChannel() {
    var Obj1 = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          "FLAG": "CHANNEL",
          "PROCESSID": 1
        }
      }
    }

  this.api.post('index', Obj1).subscribe(res => {
      //this.loader = false;
      if (res.code == 200) {
        // console.log(res);
        this.ddChannels = res.results.data;
        this.filterSpecificChannel(); 
        // console.log(this.ddChannels);
      }
    })
  }

  filterSpecificChannel(){	
    let filterChannelId = [34,28,1];	
    this.ddChannels =  this.ddChannels.filter((x) => filterChannelId.includes(x.ChannelId)).
    sort((a, b) => a.ChannelId - b.ChannelId);	
  }

  Type(event:any){
    console.log(event.value);
    // console.log(id);
    this.tabValue = this.tableData;
    //console.log(event.value);
      if(event.value == 1){
        event.value = "One Time"
      } 
      if(event.value == 2){
        event.value = "Recurring"
      }
      let filterData = this.tabValue.filter((item)=>{
        console.log(item.type);
        console.log(event.value);
        return  item.Type == event.value;
      })
      //console.log(filterData);   
      this.tabValue = filterData; 
  }
  Channels(event:any){
    // console.log(event);
    this.tabValue = this.tableData;
      let filterData = this.tabValue.filter((item)=>{
        return  item['Channel'] == event.value;
      })  
      this.tabValue = filterData; 
  }
  Campaigns(event:any){
    this.blankTypeAndChannelsDropDown();
    this.tabValue = this.tableData;
    //console.log(event.value);
   // var selectedValue = event.value
    let filterData = this.tabValue.filter((item) => {
      return item.CampaignID == event.value
      });  
      this.tabValue = filterData; 
  }

  blankTypeAndChannelsDropDown(){
    this.selectedTypeOption='';
    this.selectedChannelsOption='';
  }

  // filterTableData(event, type){
  //   if(type == 'typeOption'){
  //     if(event.value == 1){
  //       event.value  = "One Time"
  //     }else {
  //       event.value   = "Recurring"
  //     } 
  //   }
  //   if(type == 'channelOption'){
  //     if(event.value == 1){
  //       event.value  = "Email"
  //     }
  //     if(event.value == 2){
  //       event.value  = "WhatsApp"
  //     }
  //     if(event.value == 3){
  //       event.value  = "SMS"
  //     }
  //   }
  //   console.log(this.selectedTypeOption);
  //   console.log(event.value);
  //   this.filteredData = this.tabValue.filter((item) => {
  //     (this.selectedTypeOption == +'' || item.Type == event.value) &&
  //     (this.selectedChannelsOption == +'' ||  item['Channel,ChannelSource'] == this.selectedChannelsOption)
  //   });
  // }

  Navigate(){
    this.router.navigateByUrl('pitch/calendar/d')
  }

  boolValue:boolean;
  arrow = false;
  turnArrow(){
    this.arrow = true;
  }
  openMenu(){
    this.arrow = false;
    this.boolValue = true;    
    this.pitchCommon.sendBooleanVal(this.boolValue);
  }
  closeMenu(){
    this.turnArrow()
    this.boolValue = false;
    this.pitchCommon.sendBooleanVal(this.boolValue);
  }
  
}
