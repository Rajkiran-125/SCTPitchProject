import { Component, Inject, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/global/api.service';
import { PitchCommonService } from 'src/app/global/pitch-common.service';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-pitch-dialog',
  templateUrl: './pitch-dialog.component.html',
  styleUrls: ['./pitch-dialog.component.scss']
})
export class PitchDialogComponent implements OnInit {
  requestObj: {};
  masters: any;
  addAlert: any;
  sendEmail: any;
  minDate1 = new Date();
  maxDate1 = new Date();
  dateObj: any;
  readonly imageTrigger: Subject<void> = new Subject<void>();
  croppedImage: any;
  uploadWithForm: boolean = true;
  cropPanel: boolean = false;
  minDateDeposit = new Date();
  form: FormGroup;
  formChangePassword: any;
  submittedForm: boolean = false;
  loaderSmall: boolean = false;
  disabled: boolean = true;
  category: any = '';
  channelname: any = '';
  whatsappicon: any = '';
  // reset: boolean;
  format: any;
  file: any;
  fileName: any = '';
  imageUrl: any;
  extention: any;
  imgPreview: any = '';
  QRdata: any;
  saveJson: boolean = true;
  hide = true;
  hide1 = true;
  hide2 = true;
  isDropDown: boolean;
  totalCollection: number = 0;
  inbound: FormGroup;
  outbound: FormGroup;
  req: { data: { spname: string; parameters: { flag: string; processid: any; }; }; };
  Icon: string;
  deletePopup: boolean;
  profileImg: any = null;
  person: any = null;
  errorImg: any = null;
  checkImg: any = null;
  substring: string = '';
  abc: any;
  masterConfig: any
  loader: boolean;
  GST: any;
  userDetails: any;
  tabData: number;
  tabKey: any = [];
  noData: boolean = true;
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  userConfig: any
  type: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  tabValue = [];
  push: any;
  channelType: any;
  whatsappchanelform: FormGroup;
  disableInput: FormGroup;
  paginationArray: any = [];
  tempRes: any = [];
  tempKey: any = [];
  commonObj: any;
  path: any;
  editObj: any;
  languageType: any = [];
  states: any = [];
  filteredstates = this.states.slice();
  labelName: any;
  lastYear = new Date();
  regex: any;
  skillId: any;
  modules: any;
  configData: any;
  location: any;
  updateModules: any;
  addBtn: boolean;
  formOnlineHrs: FormGroup;
  unfydMaster: any;
  formData: any;
  formName: any;
  formOfflineDays: FormGroup;
  masterSelected: boolean;
  checklist: { id: number; value: string; isSelected: boolean; }[];
  checkedList: any;
  item: any;
  categoryImg: any;
  loginLoader: boolean = false;
  loginImg: any;
  isDisabled = false;
  check: boolean = false;
  serviceContract: any;
  cities: any;
  parentAccount: any;
  profilepic: any = null;
  editobj: any;
  dateFormat: any;
  products: any;
  icons: string;
  channel: any;
  channelSource: any;
  custom: any;
  skill: any;
  UID: any;
  Rule: any;
  accessControlsLst: any;
  actionname: any;
  agents: any;
  skillType: any;
  getGroupList: any;
  rule: any;
  channelvalue: any;
  RMType: any;
  customtype: any;
  description: any;
  roleid: any;
  productid: any;
  isnot: boolean = false;
  errorvalue: any;
  securitycomplainceresponse: boolean = false;
  PasswordStrength: any;
  PasswordStrengthval: any = false;
  tenantproid: any;
  ConfigValue: any;
  passwordmatch: boolean = false;
  passwordNotMatchval: boolean = false;
  hsmbody: any;
  totalItems = 0
  drilldownURL
  drilldownRequest
  localizationData = []
  languagesByTenant = []
  defaultLabels = []
  panelOpenState = false
  tabValue1=[];
  type1:any ='audienceList';




  dialogData: any = { type: "Campaign-Details" };
  campaignDetails:any = [];
  fieldMappingViewArr = [
    {campaignField : "Customer Name", audienceListField : "F1"},
    {campaignField : "Account Number", audienceListField : "F2"},
    {campaignField : "Date", audienceListField : "F3"},
    {campaignField : "Time", audienceListField : "F4"}
  ];
  dataFilterViewArr = [
    {field : "Status", condition : "Equal To", value:"Undelivered"},
    {field : "Last attempted", condition : "Greater Than", value:"12 Hours"},
  ]
  Channel: any;
  ChannelSource: any;
  StartTime: any;
  EndTime: any;
  Type: any;
  Description: any;
  CampaignName: any;
  count: boolean;
  targetAudienceTableDetails = [];
  ruleTableDetails = [];
  ChannelNameIcon:any;
  ChannelName:any;
  selectedImageIndex: number = 0;
  imagePaths: string[] = [
    "assets/images/viewTemplate/DeskFrame.svg",
    "assets/images/viewTemplate/MobileFrame.png",
    "assets/images/viewTemplate/TabFrame.svg",
    // Add more paths as needed
 ];

  

  constructor(
    public pitchCommon : PitchCommonService,
    private api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PitchDialogComponent>,
    private auth :  AuthService,
    public common: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.getAudienceList();
    
    this.userDetails = this.auth.getUser();
    if (this.data.type == 'hsmTemplate') {
      Object.assign(this.data,{tabValue:[]})
      this.getHsmTemplate();
    }
    if (this.data.type == 'CampaignInfo') {
      this.campaignDetails = this.data;
      //console.log(this.campaignDetails); 
      this.StartTime = this.campaignDetails?.data?.[0]?.StartDateTime;
      this.EndTime = this.campaignDetails?.data?.[0]?.EndDateTime;
      this.Description = this.campaignDetails?.data?.[0]?.Description;
      this.CampaignName = this.campaignDetails?.data?.[0]?.CampaignName;
      // if(this.campaignDetails){
        this.getCampaignMoreDetailsbyCampaignId();
      // }
    }
   
   
  }

  closeDialog(status: any): void {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(status), 'closeDialog');

    this.dialogRef.close(status);
    if (this.data.type == "addPriv") {
      this.common.reloadDataMethod(true);
    }
    //this.common.closePopupvalues(status, this.category, this.imageUrl);
    if (this.data?.data?.data?.icon != undefined && this.data?.data?.data?.icon != null) {
      this.common.closePopupDeleteImg(this.data.data.data.icon)
    }
  }

  sendDataToNotification(data) {
    this.dialogRef.close({ status: true, data: data });
    console.log("s:", data);
  }

  getHsmTemplate() {
    this.loader = true;
    let obj = {
      "data": {
        "spname": "usp_unfyd_hsm_template",
        "parameters": {
          "FLAG": "GET_HSM",
          "PROCESSID": this.userDetails.Processid,
          "CHANNELID": this.data.channelId,
          "UNIQUEID": this.data.channelSRCID
        }
      }
    }

    this.api.post('index', obj).subscribe((res) => {
      if (res.code == 200) {
        console.log("response", obj, res);
        this.loader = false;
        Object.assign(this.data,{tabValue:res.results.data})
      }
    });

  }


  getAudienceList() {
    var Obj1 = {
      data: {
        spname: "usp_unfyd_getaudiencelist",
        parameters: {
        }
      }
    }

    this.api.post('pitch/index', Obj1).subscribe(res => {
      // console.log(res);  
      //this.loader = false;
      if (res.code == 200) {
        this.tabValue1 = res.results.data;
       // console.log(this.tabValue1);
          
      }
    })
  }


  closeDialog2() {
    this.dialogRef.close();
  }
  closeDialog1(val:any) {
    this.pitchCommon.setbuttonToggle(val);
    this.dialogRef.close();
  }
  simpleModeAudienceList(event){
    //this.type = event;
    this.router.navigate(['pitch/audience/list-type/'+ event]);
    this.dialogRef.close();
  }

  sortUsers(by: string, order: string): void {
    if (by == 'Actionable') return
    if (by == 'Sr No') return
    if (by == 'Sr No.') return
    this.finalField.map(data => {

        if (data.value === by) {
            if (!data.order) {
                data.order = 'desc'
            } else {
                data.order = (data.order === 'desc') ? 'asc' : 'desc';
            }
        } else {
            data.order = null
        }
    })
    if (by == 'Level' || by == "Start Index" || by == "End Index" || by == "No of Channels" || by == "No of Products" || by == "User License count") {
        let x = this.tabValue.filter(n => n[by])
        let k = this.tabValue.filter(n => n[by] == null)
        let s = this.tabValue.filter(n => n[by] == '')
        let y = x.sort((a, b) => parseInt(a[by]) - parseInt(b[by]));
        this.tabValue = [...y, ...k, ...s]
        this.count = !this.count
        this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
        return
    }
    if (by == 'Holiday') {
        this.tabValue.sort((a, b) => {
            const dateA = new Date(a[by]);
            const dateB = new Date(b[by]);
            return dateA.getTime() - dateB.getTime();
        });
        this.count = !this.count
        this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
        return
    }

    if (by == 'Created On' || by == 'Modified On' || by == 'Launch Date' || by == 'Expiry Date' || by == 'Start Date' || by == 'Renewal Date') {
        let x = this.tabValue.filter(n => n[by])
        let k = this.tabValue.filter(n => n[by] == null)
        let s = this.tabValue.filter(n => n[by] == '')
        let y = x.sort((a, b) => {
            const dateA = moment(a[by], this.format);
            const dateB = moment(b[by], this.format);
            return dateA.valueOf() - dateB.valueOf();
        });
        this.tabValue = [...y, ...k, ...s]
        this.count = !this.count
        this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
        return
    }
    if (by == 'Message') {
        let x = this.tabValue.filter(n => n[by])
        let k = this.tabValue.filter(n => n[by] == null)
        let s = this.tabValue.filter(n => n[by] == '')
        let y = x.sort((a, b) => this.convertToPlain(a[by]).localeCompare(this.convertToPlain(b[by])))
        this.tabValue = [...y, ...k, ...s]

        this.count = !this.count
        this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
        return
    }
    if (by == 'Start Time' || by == 'End Time') {
        let x = this.tabValue.filter(n => n[by])
        let k = this.tabValue.filter(n => n[by] == null)
        let s = this.tabValue.filter(n => n[by] == '')

        function sortValues(a: string, b: string) {
            const aParts = a[by].split(':').map(Number);
            const bParts = b[by].split(':').map(Number);

            if (aParts[0] < bParts[0]) return -1;
            if (aParts[0] > bParts[0]) return 1;

            if (aParts[1] < bParts[1]) return -1;
            if (aParts[1] > bParts[1]) return 1;

            if (aParts[2] < bParts[2]) return -1;
            if (aParts[2] > bParts[2]) return 1;

            return 0;
        }

        let y = x.sort(sortValues);
        this.tabValue = [...y, ...k, ...s]
        this.count = !this.count
        this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

        return
    }
    let x = this.tabValue.filter(n => n[by])
    let k = this.tabValue.filter(n => n[by] == null)
    let s = this.tabValue.filter(n => n[by] == '')
    let y = x.sort((a, b) => a[by].toString().localeCompare(b[by]))
    this.tabValue = [...y, ...k, ...s]
    this.count = !this.count
    this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

}
  convertToPlain(html) {
    // return html.replace(/<[^>]*>/g, '');
    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

getCampaignMoreDetailsbyCampaignId(){

    this.loader = true;
    let obj = {
      "data": {
        "spname": "usp_unfyd_getcampaignmoredetailbycampaignid",
        "parameters": {
          "campaignid": this.campaignDetails?.data?.[0]?.CampaignID
        }
      }
    }
    this.api.post('pitch/index', obj).subscribe((res) => {
      if (res.code == 200) {
        //console.log(res);
        let CampaignMoreDetails = res.results.data;
        this.targetAudienceTableDetails = this.getTargetAudienceTableDetails(CampaignMoreDetails);
         this.ruleTableDetails = this.getRuleTableDetails(CampaignMoreDetails);
         this.getChannelNameWithIcon();
      }
    });
  }

  getTargetAudienceTableDetails(CampaignMoreDetails: any[]): any[] | null {
    for (const innerArray of CampaignMoreDetails) {
      const targetObject = innerArray.find((item) => item.hasOwnProperty('AudienceList'));
      if (targetObject) {
        //console.log(innerArray);
        return innerArray;
      }
    }
    return null; 
  }

  getRuleTableDetails(CampaignMoreDetails: any[]): any[] | null {
    for (const innerArray of CampaignMoreDetails) {
      const targetObject = innerArray.find((item) => item.hasOwnProperty('rulename'));
      if (targetObject) {
        console.log(innerArray);
        return innerArray;
      }
    }
    return null; 
  }

  getChannelNameWithIcon() {
    // this.loader = true;
    var obj = {
    data: {
        spname: "usp_unfyd_channel_config",
        parameters: {
            FLAG: "GET_CHANNEL_NAME",
            CHANNELID: 1
        }
    }
  }
  this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        // console.log(res.results.data[0]);
         this.ChannelNameIcon = res.results.data[0].ChannelIcon;
         console.log(this.ChannelNameIcon);
         
         this.ChannelName = res.results.data[0].ChannelName;
         console.log(this.ChannelName);
      }
    })
  }

  templateView() {
    this.dialog.open(PitchDialogComponent, {
      data:{
        type : "templateView",
        //data : this.campaignDetails
       },
      disableClose: true,
      height: '75%',
      width: '50%'
    })
  }
  changeImage(index: number): void {
    this.selectedImageIndex = index;
   }

   getImagePath(index: number): string {
    return this.imagePaths[index];
   }

  fieldMappingView() {
    this.dialog.open(PitchDialogComponent, {
      data:{
        type : "fieldMappingView",
        // data : this.campaignDetails
       },
      disableClose: true,
      height: 'auto',
      width: '40%'
    })
  }

  dataFilterView() {
    this.dialog.open(PitchDialogComponent, {
      data:{
        type : "dataFilterView",
        // data : this.campaignDetails
       },
      disableClose: true,
      height: 'auto',
      width: '40%'
    })
  }








}
