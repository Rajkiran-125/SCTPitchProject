import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { PitchCommonService } from 'src/app/global/pitch-common.service';
import { MatDialog } from '@angular/material/dialog';
import { PitchDialogComponent } from '../pitch-dialog/pitch-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pitch-table',
  templateUrl: './pitch-table.component.html',
  styleUrls: ['./pitch-table.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PitchTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() tabValue = [];
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  tabKey = []
  search
  itemsPerPage = 10
  page = 1
  @Input() type = '';
  loader: boolean = false;
  toggleValue: boolean;
  message: string;
  ChannelNameIcon=[];
  ChannelName: any

  userDetails: any;
  channelID: any;
  //currentPage: number = 1;
  ChannelNameIconArray = [];

  constructor(private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private router: Router,
    private pitchCommon: PitchCommonService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
    
    ) {

  }
  // ngOnChanges() {
  //     // if (!this.tabValue) return null;
  //     // console.log(this.tabValue);
  //     for (var key in this.tabValue[0]) {
  //         if (this.tabValue[0].hasOwnProperty(key)) {
  //         //   this.tabKey.push({value:key});
  //         this.tabKey.push(key);
  //         }
  //       }
  // }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.getFilter();
    this.feildChooser();
    //this.getChannelNameWithIcon(null);
    //this.getChannelNameWithIcon();

  }
  private subscription: Subscription;
  ngOnChanges(changes: SimpleChanges): void {
    //  console.log(this.tabValue);
    
    if (changes.tabValue.currentValue) {
      this.tabValue = changes.tabValue.currentValue;
    }
    this.getChannelNameWithIcon(this.tabValue);
  }

  formatDateTime(dateTime): string {
    //console.log('dateTime:', dateTime); // Add this line
    if (!dateTime) {
      return ''; // Handle null or undefined dateTime
    }else{
      const utcDate = new Date(dateTime);
      const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
      const formattedDateTime = this.datePipe.transform(localDate, 'dd/MM/yyyy HH:mm:ss');
      //const formattedDateTime = this.datePipe.transform(localDate, 'dd/MM/yyyy hh:mm:ss a');
      // console.log(formattedDateTime);
      return formattedDateTime || '';
    } 
  }

  getFilter() {
    this.loader = true;
    this.common.hubControlEvent('Masters', 'click', '', '', '', 'getFilter');

    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data;
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data;
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        // this.getContacts();
      }
    });
    this.common.getTableKey$.subscribe(data => {
      //console.log(data);

      if (data[1]?.value == "CampaignID") {
        data = data.filter((item) => item.value !== 'CampaignID');
      }
      this.finalField = []
      this.finalField = data;
      // console.log(this.finalField);
      this.loader = false;

    });

  }

  feildChooser() {
    this.loader = true;
    var obj = {
      data: {
        spname: "usp_unfyd_user_field_chooser",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
          modulename: this.type,
          language: localStorage.getItem('lang')
        }
      }
    }
    this.common.hubControlEvent('Masters', 'click', '', '', '', 'feildChooser');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        // if(res?.value=="RunningStatus"){
        //     res = res.filter((item) => item.value !== 'RunningStatus');          
        //    }

        if (res.results.data.length == 0) {
          this.selctedField = this.tabKey;
        } else {
          this.selctedField = res.results.data[0].FieldChooser.split(',');
        }
        this.unSelctedField = this.tabKey.filter(field => !this.selctedField.includes(field));
        var selctedField = [];
        for (let i = 0; i < this.selctedField.length; i++) {
          selctedField.push({ value: this.selctedField[i], className: '' })

        }
        var unSelctedField = [];
        for (let i = 0; i < this.unSelctedField.length; i++) {
          unSelctedField.push({ value: this.unSelctedField[i], className: 'tabCol' })

        }


        this.finalField = [
          ...selctedField,
          ...unSelctedField
        ]
        //console.log(this.finalField);
        this.loader = false;
      }
    },
      (error) => {
      })
  }



  getChannelNameWithIcon(data) {
    this.tabValue.forEach((x, index) => {
      const channelIds = x.Channels.split(',');
      this.getChannelDetails(channelIds,x.CampaignID);
    });
  }
  
  getChannelDetails(channelIds, CampaignID) {
    const trimmedChannelIds = channelIds.map(element => element.trim());
    const uniqueChannelIds = this.removeDuplicates(trimmedChannelIds);
    const iconArray = [];
  
    uniqueChannelIds.forEach((x) => {
      var obj = {
        data: {
          spname: "usp_unfyd_channel_config",
          parameters: {
            FLAG: "GET_CHANNEL_NAME",
            CHANNELID: x
          }
        }
      };
  
      this.api.post('index', obj).subscribe(res => {
        if (res.code == 200) {
          const icon = res.results.data[0]?.ChannelIcon;
          if (icon) {
            iconArray.push(icon);
          }
  
          // Check if all icons have been fetched for this record
          if (iconArray.length === uniqueChannelIds.length) {
            // Create a row object with channel IDs and icons
            const row = { CampaignID, icons: iconArray };
            // Push the row object to ChannelNameIconArray
            this.ChannelNameIconArray.push(row);
            this.cdr.detectChanges();
          }
        }
      });
    });
  }

  removeDuplicates(arr: any[]): any[] {
    return arr.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }
  


  
  


  changeCampaignStatus(val: any, i: any) {
    const index = ((this.page-1) * this.itemsPerPage) + i;
    // console.log(index); 
    this.loader = true;
    // console.log(val);
    // console.log(index);
    const startDateTime = val.StartDateTime;
    const startUtcDate = new Date(startDateTime);
    const finalstartDateTime = new Date(startUtcDate.getTime() + startUtcDate.getTimezoneOffset() * 60000);
    const endDateTime = val.EndDateTime;
    const endUtcDate = new Date(endDateTime);
    const finalEndDateTime = new Date(endUtcDate.getTime() + endUtcDate.getTimezoneOffset() * 60000);  
    const currentDateTime = new Date();
    // console.log(finalstartDateTime);

    if(val.Type == 'One Time'){
      if(currentDateTime > finalstartDateTime){
        // console.log("finalstartDateTime"); 
        let campaignStatus = val.RunningStatus === 'Stop' ? 'Start' : 'Stop';
      let obj = {
        data: {
          spname: "usp_unfyd_add_started_campaign_audiencelist_in_unfydleads",
          parameters: {
            campaignid: val.CampaignID,
            // campaignstatus: val.RunningStatus == "Stop" ? "Start" : "Stop"
            campaignstatus: campaignStatus
          }
        }
      }
      this.api.post('pitch/index', obj).subscribe((res: any) => {
        if (res.code == 200) {
          //this.message = res.results.data[0].Result;
          // console.log(res.results.data[0].Result);
          // this.tabValue[index].RunningStatus = val.RunningStatus == "Stop" ? "Start" : "Stop";
          // this.tabValue[index].Status = val.Status == "Active" ? "Inactive" : "Active";

          if (res.results.data[0].Result.toLowerCase() == "campaign started successfully") {
            this.tabValue[index].RunningStatus = campaignStatus;
            this.tabValue[index].Status = val.Status === "Active" ? "Inactive" : "Active";
            this.common.snackbar("Campaign Started Successfully", "success");
          } 
          else if (res.results.data[0].Result.toLowerCase() == "campaign stopped successfully") {
            this.tabValue[index].RunningStatus = campaignStatus;
            this.tabValue[index].Status = val.Status === "Active" ? "Inactive" : "Active";
            this.common.snackbar("Campaign Stopped Successfully", "success");
          }
          //  else if (res.results.data[0].Result.toLowerCase() == "campaign expired") {
          //   this.tabValue[index].RunningStatus = "Start";
          //   setTimeout(() => {
          //     this.tabValue[index].RunningStatus = "Stop";
          //   });
          //   this.tabValue[index].Status = val.Status == "Inactive" ? "Inactive" : "Inactive";
          //   this.common.snackbar("Campaign Expired");
          // }
          this.loader = false;
        }
       });  
      }else{
        // console.log("currentDateTime"); 
        this.common.snackbar("The campaign cannot be triggered before the start datetime",'warning');   
        this.tabValue[index].RunningStatus = "Start";
        setTimeout(() => {
          this.tabValue[index].RunningStatus = "Stop";
        },100);
        this.tabValue[index].Status = val.Status == "Inactive" ? "Inactive" : "Inactive";
        this.loader = false;
      }
    }
    else if(val.Type == 'Recurring'){
      if( finalEndDateTime > currentDateTime ){
        if(currentDateTime > finalstartDateTime){
            // console.log("finalEndDateTime"); 
        let campaignStatus = val.RunningStatus === 'Stop' ? 'Start' : 'Stop';
        let obj = {
        data: {
          spname: "usp_unfyd_add_started_campaign_audiencelist_in_unfydleads",
          parameters: {
            campaignid: val.CampaignID,
            // campaignstatus: val.RunningStatus == "Stop" ? "Start" : "Stop"
            campaignstatus: campaignStatus
          }
        }
      }
      this.api.post('pitch/index', obj).subscribe((res: any) => {
        if (res.code == 200) {
          //this.message = res.results.data[0].Result;
          // console.log(res.results.data[0].Result);
          // this.tabValue[index].RunningStatus = val.RunningStatus == "Stop" ? "Start" : "Stop";
          // this.tabValue[index].Status = val.Status == "Active" ? "Inactive" : "Active";
          if (res.results.data[0].Result.toLowerCase() == "campaign started successfully") {
            this.tabValue[index].RunningStatus = campaignStatus;
            this.tabValue[index].Status = val.Status === "Active" ? "Inactive" : "Active";
            this.common.snackbar("Campaign Started Successfully", "success");
          } 
          else if (res.results.data[0].Result.toLowerCase() == "campaign stopped successfully") {
            this.tabValue[index].RunningStatus = campaignStatus;
            this.tabValue[index].Status = val.Status === "Active" ? "Inactive" : "Active";
            this.common.snackbar("Campaign Stopped Successfully", "success");
          } 
          else if (res.results.data[0].Result.toLowerCase() == "campaign expired") {
            this.tabValue[index].RunningStatus = "Start";
            setTimeout(() => {
              this.tabValue[index].RunningStatus = "Stop";
            });
            this.tabValue[index].Status = val.Status == "Inactive" ? "Inactive" : "Inactive";
            this.common.snackbar("Campaign Expired",'warning');
          }
          this.loader = false;
        }
       });
        }else{
          this.common.snackbar("The campaign cannot be triggered before the start datetime",'warning');   
          this.tabValue[index].RunningStatus = "Start";
          setTimeout(() => {
            this.tabValue[index].RunningStatus = "Stop";
          },100);
          this.tabValue[index].Status = val.Status == "Inactive" ? "Inactive" : "Inactive";
          this.loader = false;
        }   
      }else{
        // console.log("currentDateTime"); 
        this.common.snackbar("Campaign Expired",'warning');   
        this.tabValue[index].RunningStatus = "Start";
        setTimeout(() => {
          this.tabValue[index].RunningStatus = "Stop";
        },100);
        this.tabValue[index].Status = val.Status == "Inactive" ? "Inactive" : "Inactive";
        this.loader = false;
      }
    }
    else if(val.Type == 'Send Now'){
         // console.log("finalstartDateTime"); 
         let campaignStatus = val.RunningStatus === 'Stop' ? 'Start' : 'Stop';
         let obj = {
           data: {
             spname: "usp_unfyd_add_started_campaign_audiencelist_in_unfydleads",
             parameters: {
               campaignid: val.CampaignID,
               // campaignstatus: val.RunningStatus == "Stop" ? "Start" : "Stop"
               campaignstatus: campaignStatus
             }
           }
         }
         this.api.post('pitch/index', obj).subscribe((res: any) => {
           if (res.code == 200) {
             //this.message = res.results.data[0].Result;
             // console.log(res.results.data[0].Result);
             // this.tabValue[index].RunningStatus = val.RunningStatus == "Stop" ? "Start" : "Stop";
             // this.tabValue[index].Status = val.Status == "Active" ? "Inactive" : "Active";
   
             if (res.results.data[0].Result.toLowerCase() == "campaign started successfully") {
               this.tabValue[index].RunningStatus = campaignStatus;
               this.tabValue[index].Status = val.Status === "Active" ? "Inactive" : "Active";
               this.common.snackbar("Campaign Started Successfully", "success");
             } 
             else if (res.results.data[0].Result.toLowerCase() == "campaign stopped successfully") {
               this.tabValue[index].RunningStatus = campaignStatus;
               this.tabValue[index].Status = val.Status === "Active" ? "Inactive" : "Active";
               this.common.snackbar("Campaign Stopped Successfully", "success");
             }
              else if (res.results.data[0].Result.toLowerCase() == "campaign expired") {
               this.tabValue[index].RunningStatus = "Start";
               setTimeout(() => {
                 this.tabValue[index].RunningStatus = "Stop";
               });
               this.tabValue[index].Status = val.Status == "Inactive" ? "Inactive" : "Inactive";
               this.common.snackbar("Campaign Expired",'warning');
             }
             this.loader = false;
           }
          }); 
    }
   
    
    
  }


  openCampaignDetailsView(Data: any, index: number, RunningStatus: any) {
    // console.log(Data);
    // console.log(RunningStatus);
    this.api.campaignListTableIndex = index;
    if (this.router.url == '/pitch/campaign/list') {
      // this.router.navigate([`pitch/campaign/view/${Data.CampaignID}`])
      this.router.navigate(['pitch/campaign/view/', Data.RunningStatus, Data.CampaignID]);
    }
    if (this.router.url == '/pitch/audience/list') {
      // this.router.navigate([`pitch/campaign/view/${Data.CampaignID}`])
      this.router.navigate([`pitch/audience/details/${index}`, Data]);
    }
  }
  editCampaign(Data: any){
    this.pitchCommon.CampaignData = Data;
    // this.router.navigate(['pitch/campaign/edit/', Data.CampaignID, Data]);
    this.router.navigate(['pitch/campaign/edit', Data.CampaignID]);
}

    

  deleteCampaign(data) {
    this.dialog.open(PitchDialogComponent, {
      data:{
        type : "deleteCampaign",
        data : data
       },
      disableClose: true,
      height: '55%',
      width: '30%'
    })
  }

  ngOnDestroy() {
  
  }

}


