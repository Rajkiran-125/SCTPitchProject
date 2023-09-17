import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { regex } from 'src/app/global/json-data';
import moment from 'moment';
// import * as $ from 'jquery'
declare var $: any;

@Component({
  selector: 'app-config-manager',
  templateUrl: './config-manager.component.html',
  styleUrls: ['./config-manager.component.scss']
})
export class ConfigManagerComponent implements OnInit {
  @Input() newChannelID: string;
  formName: any;
  selectedTab: any;
  form: FormGroup;
  submittedForm: boolean = false;
  loader: boolean = false;
  formData: any = null;
  unfydMaster: any;
  masterName: any;
  panelOpenState = false;
  panelOpenStateAutoResponse = false;
  panelOpenStateKeyConfiguration = false;
  panelOpenStateVideoCall = false;
  panelOpenStateSupervisor = false;
  panelOpenStateSupervisorBargeIn = false;
  panelOpenStateSupervisorCoaching = false;
  panelOpenStateSupervisorAssignToMe = false;
  panelOpenStateSupervisorConference = false;
  panelOpenStateCustomerAttribute = false;
  requestObj = {};
  // : { data: { spname: string; parameters: any } };
  channelType = [];
  userDetails: any;
  configdata: any = {};
  languageData: any = [];
  objectKeys = Object.keys;
  myFlagForButtonToggle: boolean = false;
  changeModuleDisplayName: string;
  allConfigData = []
  headerImg: any;
  subscription: Subscription[] = [];
  subscriptionBulkdelete: Subscription[] = [];
  labelName: any;
  userConfig: any;
  edit: boolean = false;
  view: boolean = false;
  addAutoResponse = [];
  userChannelName: any = [];
  userLanguageName: any = [];
  newDate = new Date()
  dateformat = 'ddMMyy'
  list = []
  channel: any = [];
  durationDropDown = [
    { Key: 'day', Value: 'Day' },
    { Key: 'hour', Value: 'Hrs.' },
    { Key: 'minute', Value: 'Min.' }
  ]

  addKeyConfiguration = []
  addVideoCall = []
  addBargeIn = []
  addCoaching = []
  addAssignToMe = []
  addConference = []
  nobarge: boolean = false;
  nocoaching: boolean = false;
  noassign: boolean = false;
  noconfrence: boolean = false;
  addCustomerAttribute = []
  keysIncludeTimeInSecond = ['NoResponseTimeOut-FirstWarningTimeInSeconds',
    'NoResponseTimeOut-SecondWarningTimeInSeconds',
    'NoResponseTimeOutinMinutes',
    'Agent-AutoWrapTimeInMinutes',
    'MaxQueueWaitTimeInSeconds',
    'QueueDurationInSeconds',
    'QueueReminder1-DurationInSeconds',
    'QueueReminder2-DurationInSeconds',
    'AutoRouteOfflineMessage_FollowUpTime',
    'FlushingTimeOutInMinutes',
    'ParkedInteraction-Reminder-Before-Time',
    'ParkingTimerFrequency',
    'ParkedInteraction-ExpiryTimeInHours',
    'OfflineTimeFrom',
    'OfflineTimeTo',
    'OfflinePickDataSinceLast'


  ]
  keysIncludeTimeInMinute = ['NoResponseTimeOutinMinutes',
    'Agent-AutoWrapTimeInMinutes',
    'FlushingTimeOutInMinutes',
    'GreetingEveningStart',
    'GreetingsEveningEnd',
    'GreetingsNoonStart',
    'GreetingsMorningStart',
    'GreetingsMorningEnd',
    'GreetingsNoonEnd']
  greetingsKeys = ['GreetingEveningStart',
    'GreetingsEveningEnd',
    'GreetingsNoonStart',
    'GreetingsMorningStart',
    'GreetingsMorningEnd',
    'GreetingsNoonEnd']
  controlTypes = [
    { key: 'textbox', value: 'textbox' },
    { key: 'textarea', value: 'textarea' },
    { key: 'time', value: 'time' },
    { key: 'number', value: 'number' },
    { key: 'toggle', value: 'toggle' },
    { key: 'checkbox', value: 'checkbox' },
  ]
  allDropdowns = {
    reopenActions: [{ Key: 'Create New Ticket', Value: 'Create New Ticket' },
    { Key: 'Re-open existing ticket', Value: 'Re-open existing ticket' }],
    reopenAsignTo: [{ Key: 'Same Agent', Value: 'Same Agent' },
    { Key: 'Same Queue', Value: 'Same Queue' },
    { Key: 'Main Queue', Value: 'Main Queue' }],
    BusinessObject: [
      // {Key:'abcd',Value:'abcd'},
      // {Key:'xyz',Value:'xyz'},
      // {Key:'pqr',Value:'pqr'}
    ],
    TenantCode: [{ Key: 'abcd', Value: 'abcd' },
    { Key: 'xyz', Value: 'xyz' },
    { Key: 'pqr', Value: 'pqr' }],
    ProductCode: [{ Key: 'abcd', Value: 'abcd' },
    { Key: 'xyz', Value: 'xyz' },
    { Key: 'pqr', Value: 'pqr' }],
    DateTimeFormat: [{ Key: 'abcd', Value: 'abcd' },
    { Key: 'xyz', Value: 'xyz' },
    { Key: 'pqr', Value: 'pqr' }],
    NumericLength: [{ Key: 'abcd', Value: 'abcd' },
    { Key: 'xyz', Value: 'xyz' },
    { Key: 'pqr', Value: 'pqr' }]
  }
  expiryAction = [{ Key: 'Route to skill', Value: 'Route to skill' },
  { Key: 'Route to next available agent', Value: 'Route to next available agent' },
  { Key: 'Wait till next login', Value: 'Wait till next login' },
  { Key: 'Close park interaction', Value: 'Close park interaction' }]
  channelName: any;
  productType = []
  channelSourceId = []
  InitiateInteractionWith = []
  logType = []
  logFileSize = []
  notReadyReasonCode = []
  hsmData = []
  RouteTo = []
  VideoCall = []
  scorSamplingData = []
  scorSamplingDataObj = []
  ReportControlType = []
  agents = []
  comparisonOperator = ['==', '<', '>']
  regex: any;
  SLATypeMinValue = 1
  SLATypeMaxValue = 100
  // customerAttributes = [...Array(60).keys()]
  CustomerAttributes = []
  allCustomerAttributes = []
  ReminderClick: boolean = false;
  novideoCall: boolean = false;
  noautoResponse: boolean = false;
  nokeyConfiguration: boolean = false;
  nocustomerAttribute: boolean = false;
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) {
    Object.assign(this, { regex });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('ConfigManager', 'click', 'pageload', 'pageload', '', 'ngOnInit');
    this.productType = JSON.parse(localStorage.getItem('products'))
    this.form = this.fb.group({
      // productName: [this.productType.length > 0 ? this.productType[0].Id : '', [Validators.nullValidator]],
      productName: ['', [Validators.nullValidator]],
      language: ['', [Validators.nullValidator]],
      channel: ['', [Validators.required]],
      channelSRC: ['', [Validators.nullValidator]],
    });
    this.userDetails = this.auth.getUser();
    // this.getAdminConfig()
    // this.linkTicketNumberFormatRequiredData()
    // this.getChannel();
    // this.getLanguage();
    this.getLanguageStorage();
    this.getChannelStorage();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.allDropdowns.DateTimeFormat = JSON.parse(data["DateFormatSettings"]);
          this.durationDropDown = JSON.parse(data["DurationDropdown"]);
          this.InitiateInteractionWith = JSON.parse(data["InitiateInteractionWith"])
          this.logType = JSON.parse(data["GeneralSettingLogType"])
          this.logFileSize = JSON.parse(data["GeneralSettingLogFileSize"])
          this.RouteTo = JSON.parse(data["RouteTo"])
          this.VideoCall = JSON.parse(data["VideoCall"])
          this.ReportControlType = JSON.parse(data["ReportControlType"])
          this.SLATypeMinValue = JSON.parse(data["SLATypeMinValue"])
          this.SLATypeMaxValue = JSON.parse(data["SLATypeMaxValue"])
          this.CustomerAttributes = JSON.parse(data["CustomerAttributes"])
        }
      })
    )
    this.changeModuleDisplayName = this.common.changeModuleLabelName()
    this.common.getIndividualUpload$.subscribe(res => {
      this.headerImg = res.status.attachmenturl
    });
    this.common.hubControlEvent('ConfigManager', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }
  changeEdit() {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'changeEdit');
    this.edit = !this.edit;

  }
  setEditFalse() {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'setEditFalse');

    this.edit = true;
  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', JSON.stringify(data), 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false
      this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ConfigManager', data)
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let skillId = 'ConfigManager'
      this.common.setUserConfig(this.userDetails.ProfileType, skillId);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }))
    });
  }
  FuncHolidays() {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'FuncHolidays');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'holiday',
      },
      width: "900px",
      height: "80vh",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(status => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  FuncOnHrs() {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'FuncOnHrs');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'OnlineHours',
        ChannelId: this.channel,
      },
      width: "900px",
      height: "80vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  FuncOffDays() {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'FuncOffDays');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'OfflineDays',
      },
      width: "900px",
      height: "80vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }

  configValuesForAll = {}

  getAdminConfig() {
    this.loader = true

    if (this.form.value.productName == undefined || this.form.value.productName == null || this.form.value.productName == "") {
      this.loader = false;
      this.common.snackbar('SelectApplication');
      return;
    }
    if (this.form.value.channel == undefined || this.form.value.channel == '') {
      this.loader = false;
      this.common.snackbar('SelectChannel');
      return;
    }
    if (this.form.value.language == undefined || this.form.value.language == '') {
      this.loader = false;
      this.common.snackbar('SelectLanguage');
      return;
    }
    this.view = true
    this.common.configView.next({ channel: this.form.value.channel, language: this.form.value.language })


    if (this.form.value.productName == 6) {
      // this.getAuditLog()scorSamplingDataObj
      this.addConference = []
      this.addAssignToMe = []
      this.addCoaching = []
      this.addBargeIn = []
      this.addVideoCall = []
      this.addAutoResponse = []
      this.addKeyConfiguration = []
      this.scorSamplingDataObj = []
      this.linkTicketNumberFormatRequiredData()
      this.requestObj = {
        data: {
          spname: "usp_unfyd_link_config ",
          parameters: {
            flag: "GET",
          }
        }
      }
    } else if (this.form.value.productName == 9) {
      this.scorSampling();
      this.scorDropdownData()
      this.addConference = []
      this.addAssignToMe = []
      this.addCoaching = []
      this.addBargeIn = []
      this.addVideoCall = []
      this.addAutoResponse = []
      this.addKeyConfiguration = []
      this.scorSamplingDataObj = []
      // this.linkTicketNumberFormatRequiredData()
      this.requestObj = {
        data: {
          spname: "usp_unfyd_scor_config",
          parameters: {
            flag: "GET",
            processid: this.userDetails.Processid,
            channelid: this.form.value.channel,
            languagecode: this.form.value.language,
            productid: this.form.value.productName
          }
        }
      }
    } else {
      this.getNotReadyResonCode()
      // this.scorSampling();
      // this.scorDropdownData()
      this.getChannelSource()
      this.requestObj = {
        data: {
          spname: "UNFYD_CONFIG_MANAGER",
          parameters: {
            flag: "GETCONFIGVALUE",
            processid: this.userDetails.Processid,
            channelid: this.form.value.channel,
            languagecode: this.form.value.language,
            productid: this.form.value.productName
          }
        }
      }
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'getAdminConfig');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false


        if (res.results.data.length > 0) {
          this.view = true;
          this.configdata = {}
          this.allConfigData = res.results.data
          res.results.data.forEach(element => {
            let time = {
              hour: 0,
              minute: 0,
              second: 0
            }
            if (element.ConfigName == 'Collaborator_Data' || element.ConfigName == 'SLA_RequestType' || element.ConfigName == 'SLA_Type') {
              element.ConfigValue = element.ConfigValue ? element.ConfigValue.split(",") : []
            }
            if (element.ConfigName == 'SCORSampling') {
              element.ConfigValue = element.ConfigValue ? JSON.parse(element.ConfigValue) : []
              this.scorSamplingDataObj = element.ConfigValue
            }
            if (element.SubCategory == 'bargeIn') {
              this.nobarge = true
            }
            if (element.SubCategory == 'coaching') {
              this.nocoaching = true
            }
            if (element.SubCategory == 'assignToMe') {
              this.noassign = true
            }
            if (element.SubCategory == 'conference') {
              this.noconfrence = true
            }
            if (element.SubCategory == 'videoCall') {
              this.novideoCall = true
            }
            if (element.SubCategory == 'autoResponse') {
              this.noautoResponse = true
            }
            if (element.SubCategory == 'keyConfiguration') {
              this.nokeyConfiguration = true
            }
            if (element.SubCategory == 'customerAttribute') {
              this.nocustomerAttribute = true
            }
            if (this.keysIncludeTimeInSecond.includes(element.ConfigName) || element.controltype == 'time' || this.greetingsKeys.includes(element.ConfigName)) {
              if (element.ConfigName) {
                if (this.greetingsKeys.includes(element.ConfigName) && element.ConfigValue) {
                  let x = element.ConfigValue
                  let a = x.split(":");
                  time.hour = parseInt(a[0]);
                  time.minute = parseInt(a[1]);
                  time.second = parseInt(a[2]);
                }
                else {
                  let a = parseInt(element.ConfigValue);
                  time.hour = Math.floor(a / (60 * 60)) ? Math.floor(a / (60 * 60)) : 0
                  time.minute = Math.floor((a % (60 * 60)) / 60) ? Math.floor((a % (60 * 60)) / 60) : 0
                  time.second = Math.floor((((a % (60 * 60)) / 60) * 60) % 60) ? Math.floor((((a % (60 * 60)) / 60) * 60) % 60) : 0
                }
              }





            }

            Object.assign(this.configdata, { [element.ConfigName]: element.ConfigValue == "false" ? false : (this.keysIncludeTimeInSecond.includes(element.ConfigName) || element.controltype == 'time' || this.greetingsKeys.includes(element.ConfigName)) ? time : element.ConfigValue })
            let newObj = {
              SubCategory: element.SubCategory,
              DisplayName: element.DisplayName,
              controltype: element.controltype,
              value: (this.keysIncludeTimeInSecond.includes(element.ConfigName) || element.controltype == 'time') ? time : element.ConfigValue,
              imageEnable: element.hasOwnProperty('ImageEnable') ? element.ImageEnable : false,
              imageHostPath: element.hasOwnProperty('ImageHostPath') ? element.ImageHostPath : null,
            }
            Object.assign(this.configValuesForAll, { [element.ConfigName]: {} })
            Object.assign(this.configValuesForAll[element.ConfigName], newObj)
          });
          this.getHsmData()
          this.getAllCustomerAttribute()

          this.configdata['OfflineMsgToCustomerChannelSRC'] = this.form.value.channelSRC ? this.form.value.channelSRC : this.configdata['OfflineMsgToCustomerChannelSRC']
        } else {
          this.configdata = {}
          this.allConfigData = []
          this.configValuesForAll = {}
        }
      }
    });
    // }
    // else{
    //   this.common.snackbar('SelectLanguage')
    // }
  }

  updateAdminConfig() {
    let requestArray = []
    let keyCount = 0
    if (this.firstReminderGreater()) {
      return false;
    }
    if (this.TimeOutGreater()) {
      return false;
    }
    if(this.configdata['NORESPONSETIMEOUT-DISPOSITON']){
      if(this.configdata['NORESPONSETIMEOUT-DISPOSITON'].length >= 100){
        return false;
      }
    }
    if(this.configdata['NORESPONSETIMEOUT-SUBDISPOSITION']){
      if(this.configdata['NORESPONSETIMEOUT-SUBDISPOSITION'].length >= 100){
        return false;
      }
    }
    if (this.configdata['GreetingsMorningStart']?.hour > this.configdata['GreetingsMorningEnd']?.hour) {

      return false;
    }
    if (this.configdata['GreetingsNoonStart']?.hour > this.configdata['GreetingsNoonEnd']?.hour) {

      return false;
    }
    if (this.configdata['GreetingEveningStart']?.hour > this.configdata['GreetingsEveningEnd']?.hour) {

      return false;
    }
    if (this.returnScorSamplingDataObjInvalid()) {
      this.common.snackbar('Invalid Sampling Data')
      return false;
    }
    if (this.returnSLATypeValidation()) {
      this.common.snackbar('Validate SLA Type Data')
      return false;
    }
    if (this.configdata['GreetingsMorningStart']?.hour > this.configdata['GreetingsMorningEnd']?.hour) return false;
    if (this.configdata['GreetingsNoonStart']?.hour > this.configdata['GreetingsNoonEnd']?.hour) return false;
    if (this.configdata['GreetingEveningStart']?.hour > this.configdata['GreetingsEveningEnd']?.hour) return false;
    if (this.configdata['SCORGetInteractions'] < 1) {
      this.common.snackbar('Inavlid Sampling Interaction')
      return false
    };


    let i = 0
    for (let key in this.configValuesForAll) {
      i++;
      let a;
      let arrayData: any = ''
      this.loader = true
      if (this.keysIncludeTimeInSecond.includes(key) || this.configValuesForAll[key].controltype == 'time' || this.greetingsKeys.includes(key)) {
        if (this.configdata[key]) {
          if (this.greetingsKeys.includes(key)) {
            a = JSON.parse(JSON.stringify(this.configdata[key]));
            let hour = a.hour.toString()
            let minute = a.minute.toString()
            let second = a.second.toString()
            a = hour.padStart(2, "0") + ":" + (minute).padStart(2, "0") + ":" + (second).padStart(2, "0")
          } else {
            a = JSON.parse(JSON.stringify(this.configdata[key]));
            a = (a.hour * 60 * 60) + (a.minute * 60) + a.second
          }
        }
      }

      if (this.form.value.productName == 6) {
        let arrayAvailable = false
        if (key == 'Collaborator_Data' || key == 'SLA_RequestType' || key == 'SLA_Type') {
          arrayAvailable = true
          arrayData = this.configdata[key].join(",")
        }

        this.requestObj = {
          data: {
            spname: "usp_unfyd_link_config",
            parameters: {
              flag: 'UPDATE',
              CONFIGNAME: key,
              CONFIGVALUE: a ? a : arrayAvailable ? arrayData : this.configdata[key],
              CHANNELID: this.form.value.channel,
              CHANNELSRCID: this.form.value.channelSRC ? this.form.value.channelSRC : 0,
              LANGUAGECODE: this.form.value.language,
              PROCESSID: this.userDetails.Processid,
              PRODUCTID: this.form.value.productName,
            }
          }
        }
        // this.requestObj = {
        //   FLAG:'UPDATE',
        //   CONFIGNAME: key,
        //   CONFIGVALUE :  a ? a : arrayData ? arrayData : this.configdata[key],
        //   CHANNELID: this.form.value.channel,
        //   CHANNELSRCID: this.form.value.channelSRC,
        //   LANGUAGECODE: this.form.value.language,
        //   PROCESSID : this.userDetails.Processid,
        //   PRODUCTID:  this.form.value.productName,
        // }
      } else if (this.form.value.productName == 9) {
        if (key == 'SCORSampling') {
          this.scorSamplingDataObj = this.scorSamplingDataObj.splice(0, this.configdata['SCORGetInteractions'])
          a = JSON.stringify(this.scorSamplingDataObj)
        }
        this.requestObj = {
          data: {
            spname: "usp_unfyd_scor_config",
            parameters: {
              flag: "update",
              CONFIGSTATUS: 1,
              CONTROLTYPE: '',
              CATEGORY: '',
              DESCRIPTION: '',
              IMAGEACTION: '',
              IMAGESAVEPATH: '',
              PUBLICIP: this.userDetails.ip,
              PRIVATEIP: '',
              BROWSERNAME: this.userDetails.browser,
              BROWSERVERSION: this.userDetails.browser_version,
              processid: this.userDetails.Processid,
              productid: this.form.value.productName,
              configName: key,
              channelId: this.form.value.channel,
              configvalue: a ? a : this.configdata[key],
              imageEnable: this.configValuesForAll[key]['imageEnable'],
              imageHostPath: this.configValuesForAll[key]['imageHostPath'],
              subcategory: this.configValuesForAll[key]['SubCategory'],
              displayname: this.configValuesForAll[key]['DisplayName'],
              languagecode: this.form.value.language,
              modifiedby: this.userDetails.Id,
              clientip: this.userDetails.ip
            }
          }
        }

      } else {
        if (key == 'SCORSampling') {
          this.scorSamplingDataObj = this.scorSamplingDataObj.splice(0, this.configdata['SCORGetInteractions'])
          a = JSON.stringify(this.scorSamplingDataObj)
        }
        this.requestObj = {
          processid: this.userDetails.Processid,
          productid: this.form.value.productName,
          configName: key,
          channelId: this.form.value.channel,
          configvalue: a ? a : this.configdata[key],
          imageEnable: this.configValuesForAll[key]['imageEnable'],
          imageHostPath: this.configValuesForAll[key]['imageHostPath'],
          subcategory: this.configValuesForAll[key]['SubCategory'],
          displayname: this.configValuesForAll[key]['DisplayName'],
          languagecode: this.form.value.language,
          modifiedby: this.userDetails.Id,
          clientip: this.userDetails.ip,
        }
      }


      if (this.form.value.productName == 6 || this.form.value.productName == 9) {
        this.api.post('index', this.requestObj).subscribe((res: any) => {
          if (res.code == 200) {
            keyCount++;
            // console.log(keyCount);

            if (keyCount == Object.keys(this.configValuesForAll).length) {
              this.loader = false;
              this.common.snackbar('Update Success')
              this.common.sendCERequest('UpdateAdminConfigMaster', this.userDetails.Processid)
            }
            this.edit = false;
          }
        });
      }
      else {
        requestArray.push(this.requestObj)
        if (requestArray.length == 20 || i == Object.keys(this.configValuesForAll).length) {
          keyCount++;
          let obj =
          {
            data: {
              spname: "UNFYD_CONFIG_MANAGER",
              parameters: {
                flag: 'UPDATE_CHANNELWISE_CONFIG',
                configjson: JSON.stringify(requestArray)
              }
            }
          }
          this.api.post('index', obj).subscribe((res: any) => {
            if (res.code == 200) {
              keyCount--;
              // console.log(keyCount);

              if (keyCount == 0) {
                this.loader = false;
                this.common.snackbar('Update Success')
                this.common.sendCERequest('UpdateAdminConfigMaster', this.userDetails.Processid)
              }
              this.edit = false;
            }
          });
          requestArray = []

        }
      }


    }
  }


  getChannelStorage() {
    this.loader = true;
    this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))
    // console.log('this.userChannelName all', this.userChannelName)
    if (this.userChannelName == null || this.userChannelName == undefined) {
      this.getChannel();
    } else {
      let chlen = this.userChannelName.length
      this.userChannelName.forEach(element => {


        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }

  getChannel() {
    let obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'getChannel');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        localStorage.setItem("userChannelName", res.results.data[0][0].UserChannel);
        this.getChannelStorage()
      }
      // this.channelType = res.results['data']
      // this.channelName = this.channelType[0].Id
    });
  }

  getLanguageStorage() {
    this.loader = true;
    this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName'))
    // console.log('this.LanguageStore all', this.userLanguageName)
    if (this.userLanguageName == null || this.userLanguageName == undefined) {
      this.getLanguage();
    } else {
      let chlen = this.userLanguageName.length
      this.userLanguageName.forEach(element => {
        // if(element.ChannelName == 'Voice')
        // {
        //   this.userLanguageName = true;
        // }

        // chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }


  getLanguage() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'getLanguage');

    this.api.post('index', this.requestObj).subscribe((res: any) => {


      if (res.code == 200) {
        localStorage.setItem("userLanguageName", res.results.data[1][0].UserLanguage);
        this.getLanguageStorage()
      }

      // this.languageData = res.results['data'];
    });
  }

  uploadDocument(event, category) {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', event, 'uploadDocument');

    var data = {
      category: category,
      flag: "INSERT",
      createdby: this.userDetails.Id,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUpload(data)

    }

  }

  changeMediaEnabledOrNot(configKey, event) {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', JSON.stringify(configKey, event), 'changeMediaEnabledOrNot');

    let a = this.allConfigData.filter(
      res => {
        return res.ConfigName == configKey

      })
  }

  mediaEnabledOrNot(configKey) {
    this.common.hubControlEvent('ConfigManager', 'click', '', '', JSON.stringify(configKey), 'mediaEnabledOrNot');

    let a = this.allConfigData.filter(
      res => {
        if (res.ConfigName == configKey) {
          if (res.hasOwnProperty('imagEnable')) {
            Object.assign(res, { imagEnable: false })
            return res
          } else if (!res.hasOwnProperty('imagEnable')) {
            Object.assign(res, { imagEnable: false })
            return res
          }
        }

      })
    return a[0].imagEnable;
  }


  directUpload(event, type, max_width, max_height, parameter) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + 'icon' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {

      this.common.snackbar("File Size");

    }
    else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    }
    else {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("FileReso");
          }
          else {

            this.common.hubControlEvent('ConfigManager', 'click', '', '', JSON.stringify(formData), 'directUpload');

            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                this.configValuesForAll[parameter].imageHostPath = res.results.URL;
                this.common.snackbar('Image Upload Success')

              }

            })
          }
        };
      };

      reader.readAsDataURL(file);

    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

  displayImage(key) {
    if (this.configValuesForAll[key].imageHostPath) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'displayImage',
          data: {
            img: this.configValuesForAll[key].imageHostPath,
            mediaEnabled: this.configValuesForAll[key].imageEnable
          }
        },
        width: "70vw",
        height: "60vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');

        this.configValuesForAll[key].imageHostPath = status.data.img
      })
    }

  }

  FirstReminderClick() {
    this.ReminderClick = false;
  }
  SecondReminderClick() {
    this.ReminderClick = true;
  }


  firstReminderGreater() {
    let a = this.configdata['NoResponseTimeOut-FirstWarningTimeInSeconds']
    if (a) {
      a = (a.hour * 60 * 60) + (a.minute * 60) + a.second
    }
    let b = this.configdata['NoResponseTimeOut-SecondWarningTimeInSeconds']
    if (b) {
      b = (b.hour * 60 * 60) + (b.minute * 60) + b.second
    }

    return a >= b ? true : false
  }

  addNewKeyConfiguration(group) {
    if (group == 'keyConfiguration') {
      this.addKeyConfiguration.push(
        {
          ConfigLabel: '',
          ConfigKey: '',
          ConfigValue: '',
          ConfigType: 'textbox',
          AlreadyExists: false
        }
      )
    } else if (group == 'autoResponse') {
      this.addAutoResponse.push(
        {
          ConfigLabel: '',
          ConfigKey: '',
          ConfigValue: '',
          imageEnable: '',
          imageHostPath: '',
          AlreadyExists: false
        }
      )
    } else if (group == 'videoCall') {
      this.addVideoCall.push(
        {
          ConfigLabel: '',
          ConfigKey: '',
          ConfigValue: '',
          ConfigType: 'textbox',
          AlreadyExists: false
        }
      )
    } else if (group == 'bargeIn') {
      this.addBargeIn.push(
        {
          ConfigLabel: '',
          ConfigKey: '',
          ConfigValue: '',
          ConfigType: 'textbox',
          AlreadyExists: false
        }
      )
    } else if (group == 'coaching') {
      this.addCoaching.push(
        {
          ConfigLabel: '',
          ConfigKey: '',
          ConfigValue: '',
          ConfigType: 'textbox',
          AlreadyExists: false
        }
      )
    } else if (group == 'assignToMe') {
      this.addAssignToMe.push(
        {
          ConfigLabel: '',
          ConfigKey: '',
          ConfigValue: '',
          ConfigType: 'textbox',
          AlreadyExists: false
        }
      )
    } else if (group == 'conference') {
      this.addConference.push(
        {
          ConfigLabel: '',
          ConfigKey: '',
          ConfigValue: '',
          ConfigType: 'textbox',
          AlreadyExists: false
        }
      )
    } else if (group == 'scor') {
      if (this.returnScorSamplingDataObj()) {
        this.common.snackbar('Invalid Sampling');
        return false;
      }
      this.scorSamplingDataObj.push(
        {
          Field: '',
          Condition: '',
          ConfigValue: '',
          ConfigType: 'textbox',
          AlreadyExists: false
        }
      )
    } else if (group == 'customerAttribute') {
      this.addCustomerAttribute.push(
        {
          ConfigLabel: '',
          ConfigKey: '',
          ConfigValue: '',
          ConfigType: 'textbox',
          AlreadyExists: false
        }
      )
    }
  }

  addNewVideoCall() {
    this.addVideoCall.push(
      {
        ConfigLabel: '',
        ConfigKey: '',
        ConfigValue: '',
        ConfigType: 'textbox',
        AlreadyExists: false
      }
    )
  }

  addNewAutoResponse() {
    this.addAutoResponse.push(
      {
        ConfigLabel: '',
        ConfigKey: '',
        ConfigValue: '',
        imageEnable: '',
        imageHostPath: '',
        AlreadyExists: false
      }
    )
  }

  addNewKeyConfigurationISTrue(group) {
    let a = false
    if (group == 'keyConfiguration') {
      if (this.addKeyConfiguration.length == 0) {
        a = false
      } else {
        this.addKeyConfiguration.forEach(element => {
          if ((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType) {
            a = true
          }
        });
      }
    } else if (group == 'autoResponse') {
      if (this.addAutoResponse.length == 0) {
        a = false
      } else {
        this.addAutoResponse.forEach(element => {
          if ((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigValue) {
            a = true
          }
        });
      }
    } else if (group == 'videoCall') {
      if (this.addVideoCall.length == 0) {
        a = false
      } else {
        this.addVideoCall.forEach(element => {
          if ((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType) {
            a = true
          }
        });
      }
    } else if (group == 'bargeIn') {
      if (this.addBargeIn.length == 0) {
        a = false
      } else {
        this.addBargeIn.forEach(element => {
          if ((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType) {
            a = true
          }
        });
      }
    } else if (group == 'coaching') {
      if (this.addCoaching.length == 0) {
        a = false
      } else {
        this.addCoaching.forEach(element => {
          if ((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType) {
            a = true
          }
        });
      }
    } else if (group == 'assignToMe') {
      if (this.addAssignToMe.length == 0) {
        a = false
      } else {
        this.addAssignToMe.forEach(element => {
          if ((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType) {
            a = true
          }
        });
      }
    } else if (group == 'conference') {
      if (this.addConference.length == 0) {
        a = false
      } else {
        this.addConference.forEach(element => {
          if ((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType) {
            a = true
          }
        });
      }
    } else if (group == 'customerAttribute') {
      if (this.addCustomerAttribute.length == 0) {
        a = false
      } else {
        this.addCustomerAttribute.forEach(element => {
          if ((element.ConfigKey.trim().length == 0) || (element.ConfigValue.trim().length == 0)) {
            a = true
          }
        });
      }
    }
    return a;
  }

  TimeOutGreater() {
    let a = this.configdata['NoResponseTimeOut-FirstWarningTimeInSeconds']
    if (a) {
      a = (a.hour * 60 * 60) + (a.minute * 60) + a.second
    }
    let b = this.configdata['NoResponseTimeOut-SecondWarningTimeInSeconds']
    if (b) {
      b = (b.hour * 60 * 60) + (b.minute * 60) + b.second
    }
    let c = this.configdata['NoResponseTimeOutinMinutes']
    if (c) {
      c = (c.hour * 60 * 60) + (c.minute * 60) + c.second
    }

    return (a + b) > c ? true : false
  }

  validationKey(group, index, key, type) {
    let a = false
    var regexForKey = new RegExp(this.regex.key);
    var regex1 = new RegExp(this.regex.alphabetwithspaceandhypen);
    if (group == 'keyConfiguration') {
      if (type == 1) {
        if (!this.addKeyConfiguration[index][key]) {
          a = true
        } else if (this.addKeyConfiguration[index][key].trim().length == 0) {
          a = true
        }
      } else if (type == 2) {
        if (!regexForKey.test(this.addKeyConfiguration[index][key])) {
          a = true
        }
      } else if (type == 3) {
        if (!regex1.test(this.addKeyConfiguration[index][key])) {
          a = true
        }
      }
    } else if (group == 'autoResponse') {
      // if(this.addAutoResponse.length == 0){
      //   a = false
      // } else{
      //   this.addAutoResponse.forEach(element => {
      //     if((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType){
      //       a = true
      //     }
      //   });
      // }
      if (type == 1) {
        if (!this.addAutoResponse[index][key]) {
          a = true
        } else if (this.addAutoResponse[index][key].trim().length == 0) {
          a = true
        }
      } else if (type == 2) {
        if (!regexForKey.test(this.addAutoResponse[index][key])) {
          a = true
        }
      } else if (type == 3) {
        if (!regex1.test(this.addAutoResponse[index][key])) {
          a = true
        }
      }
    } else if (group == 'videoCall') {
      if (type == 1) {
        if (!this.addVideoCall[index][key]) {
          a = true
        } else if (this.addVideoCall[index][key].trim().length == 0) {
          a = true
        }
      } else if (type == 2) {
        if (!regexForKey.test(this.addVideoCall[index][key])) {
          a = true
        }
      } else if (type == 3) {
        if (!regex1.test(this.addVideoCall[index][key])) {
          a = true
        }
      }
    } else if (group == 'bargeIn') {
      // if(this.addBargeIn.length == 0){
      //   a = false
      // } else{
      //   this.addBargeIn.forEach(element => {
      //     if((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType){
      //       a = true
      //     }
      //   });
      // }
      if (type == 1) {
        if (!this.addBargeIn[index][key]) {
          a = true
        } else if (this.addBargeIn[index][key].trim().length == 0) {
          a = true
        }
      } else if (type == 2) {
        if (!regexForKey.test(this.addBargeIn[index][key])) {
          a = true
        }
      } else if (type == 3) {
        if (!regex1.test(this.addBargeIn[index][key])) {
          a = true
        }
      }
    } else if (group == 'coaching') {
      // if(this.addCoaching.length == 0){
      //   a = false
      // } else{
      //   this.addCoaching.forEach(element => {
      //     if((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType){
      //       a = true
      //     }
      //   });
      // }
      if (type == 1) {
        if (!this.addCoaching[index][key]) {
          a = true
        } else if (this.addCoaching[index][key].trim().length == 0) {
          a = true
        }
      } else if (type == 2) {
        if (!regexForKey.test(this.addCoaching[index][key])) {
          a = true
        }
      } else if (type == 3) {
        if (!regex1.test(this.addCoaching[index][key])) {
          a = true
        }
      }
    } else if (group == 'assignToMe') {
      // if(this.addAssignToMe.length == 0){
      //   a = false
      // } else{
      //   this.addAssignToMe.forEach(element => {
      //     if((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType){
      //       a = true
      //     }
      //   });
      // }
      if (type == 1) {
        if (!this.addAssignToMe[index][key]) {
          a = true
        } else if (this.addAssignToMe[index][key].trim().length == 0) {
          a = true
        }
      } else if (type == 2) {
        if (!regexForKey.test(this.addAssignToMe[index][key])) {
          a = true
        }
      } else if (type == 3) {
        if (!regex1.test(this.addAssignToMe[index][key])) {
          a = true
        }
      }
    } else if (group == 'conference') {
      // if(this.addConference.length == 0){
      //   a = false
      // } else{
      //   this.addConference.forEach(element => {
      //     if((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType){
      //       a = true
      //     }
      //   });
      // }
      if (type == 1) {
        if (!this.addConference[index][key]) {
          a = true
        } else if (this.addConference[index][key].trim().length == 0) {
          a = true
        }
      } else if (type == 2) {
        if (!regexForKey.test(this.addConference[index][key])) {
          a = true
        }
      } else if (type == 3) {
        if (!regex1.test(this.addConference[index][key])) {
          a = true
        }
      }
    } else if (group == 'sampling') {
      if (type == 1) {
        if (!this.scorSamplingDataObj[index][key]) {
          a = true
        } else if (((this.scorSamplingDataObj[index][key]).toString()).trim().length == 0) {
          a = true
        }
      }
      else if (type == 3) {
        if (!regex1.test(this.addCoaching[index][key])) {
          a = true
        }
      }
    } else if (group == 'customerAttribute') {
      if (type == 1) {
        if (!this.addCustomerAttribute[index][key]) {
          a = true
        } else if (this.addCustomerAttribute[index][key].trim().length == 0) {
          a = true
        }
      } else if (type == 2) {
        if (!regexForKey.test(this.addCustomerAttribute[index][key])) {
          a = true
        }
      } else if (type == 3) {
        if (!regex1.test(this.addCustomerAttribute[index][key])) {
          a = true
        }
      }
    }
    return a;
  }

  addNewVideoCallISTrue() {
    let a = false
    if (this.addVideoCall.length == 0) {
      a = false
    } else {
      this.addVideoCall.forEach(element => {
        if ((element.ConfigLabel.trim().length == 0) || (element.ConfigKey.trim().length == 0) || !element.ConfigType) {
          a = true
        }
      });
    }
    return a;
  }

  addAutoResponceISTrue() {
    let a = false
    if (this.addAutoResponse.length == 0) {
      a = false
    } else {
      this.addAutoResponse.forEach(element => {
        if ((element.ConfigLabel.trim().length == 0)) {
          a = true
        }

      });
    }
    return a;
  }

  deleteAddedKey(i, group) {
    // this.common.confirmationToMakeDefault('ConfirmationToDelete');
    // this.subscriptionBulkdelete.push(this.common.getIndividualUpload$.subscribe(status => {
    //   this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    //   if(status.status){
    if (group == 'keyConfiguration') this.addKeyConfiguration.splice(i, 1)
    else if (group == 'autoResponse') this.addAutoResponse.splice(i, 1)
    else if (group == 'videoCall') this.addVideoCall.splice(i, 1)
    else if (group == 'bargeIn') this.addBargeIn.splice(i, 1)
    else if (group == 'coaching') this.addCoaching.splice(i, 1)
    else if (group == 'assignToMe') this.addAssignToMe.splice(i, 1)
    else if (group == 'conference') this.addConference.splice(i, 1)
    else if (group == 'scor') this.scorSamplingDataObj.splice(i, 1)
    else if (group == 'customerAttribute') this.addCustomerAttribute.splice(i, 1)
    // }


    //   this.subscriptionBulkdelete.forEach((e) => {
    //     e.unsubscribe();
    //   });
    // }
    // ))
  }



  deleteAddedAutoResponseKey(i) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkdelete.push(this.common.getIndividualUpload$.subscribe(status => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
      if (status.status) {
        this.addAutoResponse.splice(i, 1)
      }


      this.subscriptionBulkdelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
  }



  insertKeyConfiguration(group) {
    this.loader = true
    let success = 0;
    let a = group == 'keyConfiguration' ? this.addKeyConfiguration.length
      : group == 'autoResponse' ? this.addAutoResponse.length
        : group == 'videoCall' ? this.addVideoCall.length
          : group == 'bargeIn' ? this.addBargeIn.length
            : group == 'coaching' ? this.addCoaching.length
              : group == 'assignToMe' ? this.addAssignToMe.length
                : group == 'conference' ? this.addConference.length
                  : group == 'customerAttribute' ? this.addCustomerAttribute.length : this.addKeyConfiguration.length
    let dummyObj = group == 'keyConfiguration' ? JSON.parse(JSON.stringify(this.addKeyConfiguration))
      : group == 'autoResponse' ? JSON.parse(JSON.stringify(this.addAutoResponse))
        : group == 'videoCall' ? JSON.parse(JSON.stringify(this.addVideoCall))
          : group == 'bargeIn' ? JSON.parse(JSON.stringify(this.addBargeIn))
            : group == 'coaching' ? JSON.parse(JSON.stringify(this.addCoaching))
              : group == 'assignToMe' ? JSON.parse(JSON.stringify(this.addAssignToMe))
                : group == 'conference' ? JSON.parse(JSON.stringify(this.addConference))
                  : group == 'customerAttribute' ? JSON.parse(JSON.stringify(this.addCustomerAttribute)) : JSON.parse(JSON.stringify(this.addKeyConfiguration))
    dummyObj.forEach((element, i) => {
      if (element.ConfigType == 'time') {
        if (element.ConfigValue) {
          let a = JSON.parse(JSON.stringify(element.ConfigValue));
          element.ConfigValue = (a.hour * 60 * 60) + (a.minute * 60) + a.second
        }
      }
      let obj = {
        data: {
          spname: "UNFYD_CONFIG_MANAGER",
          parameters: {
            FLAG: 'INSERT',
            CONFIGNAME: element.ConfigKey,
            CONFIGVALUE: element.ConfigValue,
            CONTROLTYPE: element.ConfigType,
            DISPLAYNAME: element.ConfigLabel,
            SUBCATEGORY: group ? group : 'keyConfiguration',
            CONFIGDESC: '',
            APPNAME: '',
            CHANNELID: this.form.value.channel,
            LANGUAGECODE: this.form.value.language,
            CREATEDBY: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            PROCESSID: this.userDetails.Processid
          }
        }
      }
      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
          if (res.results.data[0].result == 'Data already exists') {
            element.AlreadyExists = true;
            Object.assign(dummyObj[i], { success: false })
          } else {
            Object.assign(dummyObj[i], { success: true })
            success++;
          }
          a--;
          if (a == 0) {
            this.loader = false;
            if (success) this.common.snackbar("Saved Success");
            else this.common.snackbar('Exists');
            if (group == 'keyConfiguration') this.addKeyConfiguration = dummyObj.filter(xyz => !xyz.success)
            else if (group == 'autoResponse') this.addAutoResponse = dummyObj.filter(xyz => !xyz.success)
            else if (group == 'videoCall') this.addVideoCall = dummyObj.filter(xyz => !xyz.success)
            else if (group == 'bargeIn') this.addBargeIn = dummyObj.filter(xyz => !xyz.success)
            else if (group == 'coaching') this.addCoaching = dummyObj.filter(xyz => !xyz.success)
            else if (group == 'assignToMe') this.addAssignToMe = dummyObj.filter(xyz => !xyz.success)
            else if (group == 'conference') this.addConference = dummyObj.filter(xyz => !xyz.success)
            else if (group == 'customerAttribute') this.addCustomerAttribute = dummyObj.filter(xyz => !xyz.success)
            this.getAdminConfig()
          }
        }
      })
    });

  }

  insertVideoCall() {
    this.loader = true
    let success = 0;
    let a = this.addVideoCall.length
    let dummyObj = JSON.parse(JSON.stringify(this.addVideoCall))
    dummyObj.forEach((element, i) => {
      if (element.ConfigType == 'time') {
        if (element.ConfigValue) {
          let a = JSON.parse(JSON.stringify(element.ConfigValue));
          element.ConfigValue = (a.hour * 60 * 60) + (a.minute * 60) + a.second
        }
      }
      let obj = {
        data: {
          spname: "UNFYD_CONFIG_MANAGER",
          parameters: {
            FLAG: 'INSERT',
            CONFIGNAME: element.ConfigKey,
            CONFIGVALUE: element.ConfigValue,
            CONTROLTYPE: element.ConfigType,
            DISPLAYNAME: element.ConfigLabel,
            SUBCATEGORY: 'videoCall',
            CONFIGDESC: '',
            APPNAME: '',
            CHANNELID: this.form.value.channel,
            LANGUAGECODE: this.form.value.language,
            CREATEDBY: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            PROCESSID: this.userDetails.Processid
          }
        }
      }
      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
          if (res.results.data[0].result == 'Data already exists') {
            element.AlreadyExists = true;
            Object.assign(dummyObj[i], { success: false })
          } else {
            Object.assign(dummyObj[i], { success: true })
            success++;
          }
          a--;
          if (a == 0) {
            this.loader = false;
            if (success) this.common.snackbar("Saved Success");
            else this.common.snackbar('Exists');
            this.addVideoCall = dummyObj.filter(xyz => !xyz.success)

            this.getAdminConfig()
          }
        }
      })
    });

  }


  insertAutoResponse() {
    this.loader = true
    let success = 0;
    let a = this.addAutoResponse.length
    let dummyObj = JSON.parse(JSON.stringify(this.addAutoResponse))
    this.addAutoResponse.forEach((element, i) => {
      let obj = {
        data: {
          spname: "UNFYD_CONFIG_MANAGER",
          parameters: {
            FLAG: 'INSERT',
            CONFIGNAME: element.ConfigKey,
            CONFIGVALUE: element.ConfigValue,
            CONTROLTYPE: '',
            imageEnable: element.imageEnable,
            imageHostPath: element.imageHostPath,
            DISPLAYNAME: element.ConfigLabel,
            SUBCATEGORY: 'autoResponse',
            CONFIGDESC: '',
            APPNAME: '',
            CHANNELID: this.form.value.channel,
            LANGUAGECODE: this.form.value.language,
            CREATEDBY: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            PROCESSID: this.userDetails.Processid
          }
        }
      }
      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
          if (res.results.data[0].result == 'Data already exists') {
            element.AlreadyExists = true;
            Object.assign(dummyObj[i], { success: false })
          } else {
            Object.assign(dummyObj[i], { success: true })
            success++;
          }
          a--;
          if (a == 0) {
            this.loader = false;
            if (success) this.common.snackbar("Saved Success");
            else this.common.snackbar('Exists');
            this.addAutoResponse = dummyObj.filter(xyz => !xyz.success)
            this.getAdminConfig()
          }
        }
      })
    });

  }

  displayImageAddAutoResponse(i) {
    if (this.addAutoResponse[i].imageHostPath) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'displayImage',
          data: {
            img: this.addAutoResponse[i].imageHostPath,
            mediaEnabled: this.addAutoResponse[i].imageEnable
          }
        },
        width: "70vw",
        height: "60vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');

        this.addAutoResponse[i].imageHostPath = status.data.img
      })
    }
  }

  directUploadAddAutoResponse(event, type, max_width, max_height, i) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + 'icon' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {

      this.common.snackbar("File Size");

    }
    else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    }
    else {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("FileReso");
          }
          else {


            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                this.addAutoResponse[i].imageHostPath = res.results.URL;
                this.common.snackbar('Image Upload Success')

              }

            })
          }
        };
      };

      reader.readAsDataURL(file);

    }
  }

  chnageControlType(i) {
    if (this.addKeyConfiguration[i].ConfigType == 'time') {
      this.addKeyConfiguration[i].ConfigValue = {
        hour: 0,
        minute: 0,
        second: 0
      }
    } else {
      this.addKeyConfiguration[i].ConfigValue = ''
    }
  }

  chnageControlTypeForScoreSampling(i) {
    this.scorSamplingData.forEach(element => {
      if (element.columnType == this.scorSamplingDataObj[i].Field) {
        this.scorSamplingDataObj[i].ConfigType = element.controlType
      }
    });
    // this.ReportControlType.forEach(element => {
    //   if(element.Key == this.scorSamplingDataObj[i].Field){
    //     this.scorSamplingDataObj[i].ConfigType = element
    //   }
    // });
    if (this.scorSamplingDataObj[i].ConfigType == 'timepicker') {
      this.scorSamplingDataObj[i].ConfigValue = {
        hour: 0,
        minute: 0,
        second: 0
      }
    } else if (this.scorSamplingDataObj[i].ConfigType == 'dropdown') this.scorSamplingDataObj[i].ConfigValue = []
    else if (this.scorSamplingDataObj[i].ConfigType == 'multiselect') this.scorSamplingDataObj[i].ConfigValue = []
    else {
      this.scorSamplingDataObj[i].ConfigValue = ''
    }
  }

  remove(val, key?): void {
    if (this.edit) {
      let index: any
      if (key == 'AuditLog') {
        this.list.forEach((element: any, index1) => {
          if (element.action == val.action) {
            index = index1
          }
        });
      } else index = this.configdata[key].indexOf(val);

      if (index >= 0 && key == 'AuditLog') {
        // this.list.splice(index, 1)
        this.removeAuditLog(index, val)
      } else if (index >= 0) {
        this.configdata[key].splice(index, 1);
      }
    }
  }

  addAction(key) {
    let action = ''
    if (key == 1) {
      action = 'action'
    } else if (key == 2) {
      action = 'event'
    } else if (key == 3) {
      action = 'SLARequestType'
    } else if (key == 4) {
      action = 'SLAType'
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'addAction',
        action,
        slaTypeData: key == 3 ? this.configdata['SLA_RequestType'] : this.configdata['SLA_Type']
      },
      width: "35vw",
      height: action == 'event' ? '41vh' : "28vh",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(status => {
      if (status) {
        if (key == 1) this.configdata['Collaborator_Data'].push(status)
        // if(key == 2) this.list.push(status);
        if (key == 2) this.getAuditLog()
        if (key == 3) this.configdata['SLA_RequestType'] = status
        if (key == 4) this.configdata['SLA_Type'] = status
      }
    })
  }

  linkTicketNumberFormatRequiredData() {
    this.getAuditLog()
    this.getBusinessObjectForTicketNumberFormat();
    this.getProductForTicketNumberFormat();
    this.getProcessForTicketNumberFormat();
    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.allDropdowns.DateTimeFormat = JSON.parse(data["DateFormatSettings"]);
          this.durationDropDown = JSON.parse(data["DurationDropdown"]);
          this.InitiateInteractionWith = JSON.parse(data["InitiateInteractionWith"])
          this.logType = JSON.parse(data["GeneralSettingLogType"])
          this.logFileSize = JSON.parse(data["GeneralSettingLogFileSize"])
          this.RouteTo = JSON.parse(data["RouteTo"])
          this.VideoCall = JSON.parse(data["VideoCall"])
          this.ReportControlType = JSON.parse(data["ReportControlType"])
          this.SLATypeMinValue = JSON.parse(data["SLATypeMinValue"])
          this.SLATypeMaxValue = JSON.parse(data["SLATypeMaxValue"])
          this.CustomerAttributes = JSON.parse(data["CustomerAttributes"])
        }
      })
    )

  }

  removeAuditLog(i, val) {
    let obj = {
      storedproc: "Events",
      table: "",
      type: "single",
      query: {
        "EventID": val.EventId,
        "EventName": "",
        "EventDesc": "",
        "UserID": "",
        "Flag": "Delete"
      },
      processingType: "callSp"
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'PRODUCTS');

    this.api.postDataForLink('link', obj.storedproc, obj.query).subscribe((res: any) => {
      if (res.statusCode == 200) {
        if (res['data'].length > 0) {
          this.list.splice(i, 1);
          this.common.snackbar("Delete Record");
        }
      } else {
        this.common.snackbar("General Error");
      }
    }, error => {
      // console.log(error);
      this.common.snackbar("General Error");

    });
  }

  getAuditLog() {
    let obj = {
      storedproc: "Events",
      table: "",
      type: "single",
      query: {
        "EventID": "",
        "EventName": "",
        "EventDesc": "",
        "UserID": "",
        "Flag": "Getdata"
      },
      processingType: "callSp"
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'PRODUCTS');

    this.api.postDataForLink('link',obj.storedproc, obj.query).subscribe((res: any) => {
      if(res.statusCode == 200){
        // if(res['data'].length > 0) this.list= JSON.parse(res['data'])
        if(res['data'].length > 0) this.list= res['data']
      }else{
        this.common.snackbar("General Error");
      }
    }, error => {
      // console.log(error);
      this.common.snackbar("General Error");

    });
  }

  getBusinessObjectForTicketNumberFormat() {
    let obj = {
      storedproc: "BindRptDrp",
      table: "",
      type: "single",
      query: {
        flag: "BusinessObj"
      },
      processingType: "callSp"
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'PRODUCTS');

    this.api.postData(obj.storedproc, obj.query).subscribe((res: any) => {
      if(res.statusCode == 200){
        // if(res['data'].length > 0) this.allDropdowns.BusinessObject = JSON.parse(res['data'])
        if(res['data'].length > 0) this.allDropdowns.BusinessObject = res['data']
      }else{
        this.common.snackbar("General Error");
      }
    }, error => {
      // console.log(error);/\
      this.common.snackbar("General Error");

    });
  }

  getProductForTicketNumberFormat() {
    let obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "PRODUCTS",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'PRODUCTS');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        if (res.results['data'].length > 0) this.allDropdowns.ProductCode = res.results['data']
      }
    });
  }

  getProcessForTicketNumberFormat() {
    let obj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GETBYID",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'PROCESS');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        if (res.results['data'].length > 0) this.allDropdowns.TenantCode = res.results['data']
      }
    });
  }

  dateFormat() {
    let a = this.allDropdowns.DateTimeFormat.filter(res => res.Key == this.configdata['TicketNumberFormat_DateTimeFormat'])
    if (a.length > 0) return a[0].Value
    // moment().format(this.configdata['TicketNumberFormat_DateTimeFormat'])
  }

  getChannelSource() {
    this.loader = true
    let obj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          channelid: this.form.value.channel,
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'getChannel');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.channelSourceId = res.results['data']
      }
    });
  }

  returnConfigName(prefix, suffix) {
    return prefix + suffix
  }

  returnConfigNameValidation(value, suffix) {
    let minVal = 'SLA_MinValue_'
    let minType = 'SLA_MinValueType_'
    let maxVal = 'SLA_MaxValue_'
    let maxType = 'SLA_MaxValueType_'

    if (value == 1) {
      if (!this.configdata[minType + suffix]) {
        return 'Type is required'
      } else if (!this.configdata[minVal + suffix]) {
        return 'Min value is required'
      } else if (this.configdata[minVal + suffix] < this.SLATypeMinValue || this.configdata[minVal + suffix] > this.SLATypeMaxValue) {
        return 'Min value should between 1 to 100'
      } else if (this.configdata[minType + suffix] == this.configdata[maxType + suffix]) {
        if (this.configdata[minVal + suffix] > this.configdata[maxVal + suffix])
          return 'Min value is greter than Max value'
      } else if (this.configdata[minType + suffix] == 'percentage' && this.configdata[maxType + suffix] != 'percentage') {
        return 'Select appropriate type'
      } else if (this.configdata[minType + suffix] != this.configdata[maxType + suffix]) {
        if (this.configdata[minType + suffix] == 'day' && this.configdata[maxType + suffix] != 'day') {
          return 'Select appropriate type'
        } else if (this.configdata[minType + suffix] == 'hour' && this.configdata[maxType + suffix] == 'min') {
          return 'Select appropriate type'
        }
      }
    }
    if (value == 2) {
      if (!this.configdata[maxType + suffix]) {
        return 'Type is required'
      } else if (!this.configdata[maxVal + suffix]) {
        return 'Max value is required'
      } else if (this.configdata[maxVal + suffix] < this.SLATypeMinValue || this.configdata[maxVal + suffix] > this.SLATypeMaxValue) {
        return 'Max value should between 1 to 100'
      } else if (this.configdata[minType + suffix] == this.configdata[maxType + suffix]) {
        if (this.configdata[minVal + suffix] > this.configdata[maxVal + suffix])
          return 'Min value is greter than Max value'
      } else if (this.configdata[minType + suffix] != 'percentage' && this.configdata[maxType + suffix] == 'percentage') {
        return 'Select appropriate type'
      }
    }
  }

  returnSLATypeValidation() {
    let minVal = 'SLA_MinValue_'
    let minType = 'SLA_MinValueType_'
    let maxVal = 'SLA_MaxValue_'
    let maxType = 'SLA_MaxValueType_'
    let status = false
    if (this.configdata['SLA_Type'] && this.configdata['SLA_Type'].length > 0) {
      this.configdata['SLA_Type'].forEach(suffix => {
        if (!this.configdata[minType + suffix]) {
          status = true
        } else if (!this.configdata[minVal + suffix]) {
          status = true
        } else if (this.configdata[minVal + suffix] < 1 || this.configdata[minVal + suffix] > 100) {
          return 'Min value should between 1 to 100'
        } else if (this.configdata[minType + suffix] == this.configdata[maxType + suffix]) {
          if (this.configdata[minVal + suffix] > this.configdata[maxVal + suffix])
            status = true
        } else if (this.configdata[minType + suffix] == 'percentage' && this.configdata[maxType + suffix] != 'percentage') {
          status = true
        } else if (this.configdata[minType + suffix] != this.configdata[maxType + suffix]) {
          if (this.configdata[minType + suffix] == 'day' && this.configdata[maxType + suffix] != 'day') {
            status = true
          } else if (this.configdata[minType + suffix] == 'hour' && this.configdata[maxType + suffix] == 'min') {
            status = true
          }
        }

        if (!this.configdata[maxType + suffix]) {
          status = true
        } else if (!this.configdata[maxVal + suffix]) {
          status = true
        } else if (this.configdata[maxVal + suffix] < 1 || this.configdata[maxVal + suffix] > 100) {
          status = true
        } else if (this.configdata[minType + suffix] == this.configdata[maxType + suffix]) {
          if (this.configdata[minVal + suffix] > this.configdata[maxVal + suffix])
            status = true
        } else if (this.configdata[minType + suffix] != 'percentage' && this.configdata[maxType + suffix] == 'percentage') {
          status = true
        }
      });
    }
    return status
  }


  getNotReadyResonCode() {
    let obj = {
      data: {
        spname: 'usp_unfyd_notready',
        parameters: {
          flag: 'GET',
          processid: this.userDetails.Processid,
          languagecode: 'en'
        },
      },
    };

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.notReadyReasonCode = res.results['data']
      }
    });
  }

  getHsmData() {
    let obj = {
      "data": {
        "spname": "usp_unfyd_hsm_template",
        "parameters": {
          "FLAG": "GET_HSM",
          "PROCESSID": this.userDetails.Processid,
          "CHANNELID": this.form.value.channel,
          "UNIQUEID": this.form.value.channelSRC ? this.form.value.channelSRC : this.configdata['OfflineMsgToCustomerChannelSRC']
        }
      }
    }

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.hsmData = res.results['data']
      }
    });
  }

  videoCallAlreadyAdded(index, configKey, val, htmlID) {
    let cursorPos

    cursorPos = $(htmlID + index).prop('selectionStart')
    var v = this.configdata[configKey];
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos, v.length);

    this.configdata[configKey] = textBefore + val + textAfter
  }

  videoCallTemp(index, val, htmlID, group) {
    let cursorPos

    cursorPos = $(htmlID + index).prop('selectionStart')
    var v = group == 'videoCall' ? this.addVideoCall[index].ConfigValue :
      group == 'bargeIn' ? this.addBargeIn[index].ConfigValue :
        group == 'coaching' ? this.addCoaching[index].ConfigValue :
          group == 'assignToMe' ? this.addAssignToMe[index].ConfigValue :
            group == 'conference' ? this.addConference[index].ConfigValue : this.addVideoCall[index].ConfigValue
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos, v.length);

    if (group == 'videoCall') this.addVideoCall[index].ConfigValue = textBefore + val + textAfter
    if (group == 'bargeIn') this.addBargeIn[index].ConfigValue = textBefore + val + textAfter
    if (group == 'coaching') this.addCoaching[index].ConfigValue = textBefore + val + textAfter
    if (group == 'assignToMe') this.addAssignToMe[index].ConfigValue = textBefore + val + textAfter
    if (group == 'conference') this.addConference[index].ConfigValue = textBefore + val + textAfter
  }


  scorSampling() {
    let obj = {
      "data": {
        "spname": "usp_unfyd_dynamic_filter",
        "parameters": {
          "FLAG": "GET",
          ModuleName: "InteractionDetailsReport"
        }
      }
    }

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res?.results?.data.length > 0) {
          this.scorSamplingData = JSON.parse(res.results.data[0].DynamicData)
        }
      }
    });
  }

  returnScorSamplingDataObj() {
    let a = false;
    this.scorSamplingDataObj.forEach(element => {
      // || ((element.ConfigType).toLowerCase() !== 'datepicker' && (element.ConfigValue).trim().length === 0)
      if (!element.Field || (element.Field).trim().length === 0 || !element.Condition || (element.Condition).trim().length === 0 || !element.ConfigValue) {
        a = true
      }
    });
    if (this.scorSamplingDataObj.length >= this.configdata['SCORGetInteractions']) a = true;
    return a;
  }

  returnScorSamplingDataObjInvalid() {
    let a = false;
    this.scorSamplingDataObj.forEach(element => {
      // || ((element.ConfigType).toLowerCase() !== 'datepicker' && (element.ConfigValue).trim().length === 0)
      if (!element.Field || (element.Field).trim().length === 0 || !element.Condition || (element.Condition).trim().length === 0 || !element.ConfigValue) {
        a = true
      }
    });
    // if(this.scorSamplingDataObj.length >= this.configdata['SCORGetInteractions']) a = true;
    return a;
  }

  scorDropdownData() {
    let obj = {
      data: {
        spname: "USP_UNFYD_TALK_AGENTROUTING",
        parameters: {
          ACTIONFLAG: "GET_AGENT_NAME",
          processid: this.userDetails.Processid,
        },
      },
    };
    this.common.hubControlEvent('configManager', 'click', '', '', JSON.stringify(obj), 'getDynamicFilter');

    this.api.post("index", obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.agents = res.results.data
      }
    });
  }

  productChange() {
    this.form.controls['channel'].patchValue('');
    this.addConference = []
    this.addAssignToMe = []
    this.addCoaching = []
    this.addBargeIn = []
    this.addVideoCall = []
    this.addAutoResponse = []
    this.addKeyConfiguration = []
    this.scorSamplingDataObj = []
    this.configdata = {}
    this.allConfigData = []
    this.view = false
    this.edit = false
  }


  uniqueCustomerAttribute(people: any[], i: any): any[] {
    let result = this.addCustomerAttribute.map(a => a.ConfigKey);
    if (this.allCustomerAttributes.length > 0) {
      result = [...result, ...this.allCustomerAttributes.map(a => a.ConfigName)]
    }
    let selectedValue: any
    people.forEach(element => {
      if (element.Key == this.addCustomerAttribute[i].ConfigKey && this.addCustomerAttribute[i].ConfigKey != undefined) {
        selectedValue = element
      }
    });
    let filteredArray = people.filter(p => !result.includes(p.Key));

    if (selectedValue)
      filteredArray.unshift(selectedValue)
    return filteredArray
  }

  getAllCustomerAttribute() {
    this.allCustomerAttributes = []
    if (this.allConfigData.length > 0) this.allCustomerAttributes = this.allConfigData.filter(res => { if (res.SubCategory) { return (res.SubCategory).toLowerCase() == 'customerattribute' } })

  }
  numericOnly(event: any): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43 ||
      charCode === 33 || charCode === 35 || charCode === 47 || charCode === 36 ||
      charCode === 37 || charCode === 38 || charCode === 40 || charCode === 41 || charCode === 42
      || charCode === 46 || charCode > 47 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (event.target.value.length >= 20) {
      return false;
    }
    return true;
  }
}
