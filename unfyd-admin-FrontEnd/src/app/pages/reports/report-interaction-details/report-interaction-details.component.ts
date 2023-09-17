import { Component, ElementRef, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex } from 'src/app/global/json-data';
import * as _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { default as _rollupMoment, Moment } from 'moment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-report-interaction-details',
  templateUrl: './report-interaction-details.component.html',
  styleUrls: ['./report-interaction-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ReportInteractionDetailsComponent implements OnInit {

  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  submittedForm: boolean = false;
  paymentSearch: boolean = true
  vendorRegistration: boolean = true
  currentpage: number = 1;
  itemsReportPerPage: number = 10;
  search: any;
  minDate = new Date();
  maxDate = new Date();
  proccessId: any;
  paginationArray: any = [];
  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  searchText: string;
  type: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  dateFormat: any;
  filter: boolean = false;
  startDate = new Date();
  endDate = new Date();
  Date = new Date();
  Channel: any;
  AgentCount: any;
  AgentName: any;
  AgentPrivateIP: any;
  AgentRouteTime: any;
  AverageResponseTime: any;
  Blacklisted: any;
  ChannelSource: any;
  ChatEndTime: any;
  CustomerCount: any;
  CustomerFeedback: any;
  CustomerName: any;
  CustomerPrivateIP: any;
  CustomerRating: any;
  DisconnectionStatus: any;
  Disposition: any;
  Email: any;
  FirstResponse: any;
  HandleTime: any;
  InteractionDuration: any;
  InteractionType: any;
  Number: any;
  QueueTime: any;
  Remarks: any;
  SessionEndTime: any;
  SessionID: any;
  SessionStartTime: any;
  SkillName: any;
  SubDisposition: any;
  SubSubDisposition: any;
  SystemCount: any;
  UserID: any;
  subscriptionPopupModal: Subscription | undefined;
  reportsData: Subscription | undefined;
  exportValue: Subscription | undefined;
  Export: boolean = false;
  changeModuleDisplayName: string;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private router: Router
  ) {
    Object.assign(this, { regex });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('InteractionDetailsReport', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.userDetails = this.auth.getUser();
    this.proccessId = this.userDetails.Processid;
    this.type = this.router.url.substring(1, this.router.url.length);
    if (this.type == "report-interaction-details") {
      this.type = "InteractionDetailsReport"
    }
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.form = this.formBuilder.group({
      fromDate: [moment(), Validators.required],
      toDate: [moment(), Validators.required]
    });
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.dateFormat = (data.DatePickerFormat);
    });
    this.getFilter();
    this.feildChooser();
    this.loadAgentFilter();
    this.loadReportsData();

    this.changeModuleDisplayName = this.common.changeModuleLabelName()

    this.common.hubControlEvent('InteractionDetailsReport', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }

  loadAgentFilter() {
    this.common.hubControlEvent('InteractionDetailsReport', 'click', '', '', '', 'loadAgentFilter');

    this.subscriptionPopupModal = this.common.agentFilterDynamic.subscribe((data: any) => {
      this.filter = true;
      this.Export = false;
      this.startDate = (data?.FROMDATE);
      this.endDate = (data?.TODATE);
      this.currentpage = 1;
      this.Channel = data?.ChannelId;
      this.AgentCount = data?.AgentCount;
      // this.AgentName = data?.AgentName.length > 1 ? data?.AgentName.join(',') : data?.AgentName;
      // this.AgentName = data && data.AgentName && data.AgentName.length > 1 ? data.AgentName.join(',') : data?.AgentName;
      this.AgentName = data.AgentName
      this.AgentPrivateIP = data?.AgentPrivateIP;
      this.AgentRouteTime = data?.AgentRouteTime;
      this.AverageResponseTime = data?.AverageResponseTime;
      this.Blacklisted = data?.Blacklisted;
      this.ChannelSource = data?.ChannelSource;
      this.ChatEndTime = data?.ChatEndTime;
      this.CustomerCount = data?.CustomerCount;
      this.CustomerFeedback = data?.CustomerFeedback;
      this.CustomerName = data?.CustomerName;
      this.CustomerPrivateIP = data?.CustomerPrivateIP;
      this.CustomerRating = data?.CustomerRating;
      this.DisconnectionStatus = data?.DisconnectionStatus;
      this.Disposition = data?.Disposition;
      this.Email = data?.Email;
      this.FirstResponse = data?.FirstResponse;
      this.HandleTime = data?.HandleTime;
      this.InteractionDuration = data?.InteractionDuration;
      this.InteractionType = data?.InteractionType;
      this.Number = data?.Number;
      this.QueueTime = data?.QueueTime;
      this.Remarks = data?.Remarks;
      this.SessionEndTime = data?.SessionEndTime;
      this.SessionID = data?.SessionID;
      this.SessionStartTime = data?.SessionStartTime;
      this.SkillName = data?.SkillName;
      this.SubDisposition = data?.SubDisposition;
      this.SubSubDisposition = data?.SubSubDisposition;
      this.SystemCount = data?.SystemCount;
      this.UserID = data?.UserID;
      this.searchHawker(this.currentpage, this.itemsReportPerPage, null);
    });
    this.exportValue = this.common.exportEmitter.subscribe((data: any) => {
      this.Export = data?.Export;
      this.searchHawker(this.currentpage, this.itemsReportPerPage, this.filter == true ? null : this.Date);
    });
  }

  loadReportsData() {
    this.common.hubControlEvent('InteractionDetailsReport', 'click', '', '', '', 'loadReportsData');

    this.reportsData = this.common.reportsDataEmitter.subscribe((data: any) => {
      this.filter = false;
      this.Export = false;
      this.Date = data;
      this.currentpage = 1;
      this.searchHawker(this.currentpage, this.itemsReportPerPage, this.Date);
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionPopupModal?.unsubscribe();
    this.reportsData?.unsubscribe();
    this.exportValue?.unsubscribe();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getFilter() {
    this.common.hubControlEvent('InteractionDetailsReport', 'click', '', '', '', 'getFilter');

    this.common.getreportItemsPerPage$.subscribe(data => {
      this.itemsReportPerPage = data
      this.searchHawker(this.currentpage, this.itemsReportPerPage, '');
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.searchHawker(this.currentpage, this.itemsReportPerPage, '');
      }
    });
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
    });
  }
  feildChooser() {

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
    this.common.hubControlEvent('InteractionDetailsReport', 'click', '', '', JSON.stringify(obj), 'feildChooser');

    this.api.post('index', obj).subscribe(res => {
      console.log(res,"res interaction")
      if (res.code == 200) {

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
      } else {
        // this.common.snackbar(res.results.data[0].result);
      }
    },
      (error) => {
        // this.common.snackbar(error.message);
      })
  }


  onOptionsSelected(value: string) {

    //console.log(value, "-+-+-+-+-+")
  }


  searchHawker(currentpage, itemsReportPerPage, date) {
    if (date == '') {
      this.filter = false;
    }
    if (this.Export == false || this.Export == undefined) {
      this.loader = true;
    }
    this.submittedForm = true;
    if (this.form.invalid || this.form.value.fromDate > this.form.value.toDate) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("Select dates properly.", 'error');
      //console.log(this.form.value)
      return;
    }

    this.requestObj = {
      data: {
        spname: "UNFYD_ADM_RPT_V1_INTERACTIONDETAILS",
        parameters: {
          FROMDATE: this.filter == true ? this.startDate : date,
          TODATE: this.filter == true ? this.endDate : date,
          PROCESSID: this.proccessId,
          FLAG: this.Export == true ? 'EXPORT' : "SESSION_DATA",
          ID: this.userDetails.Id,
          AgentCount: this.filter == false ? undefined : this.AgentCount == null ? undefined : this.AgentCount,
          AgentName: this.filter == false ? undefined : this.AgentName == null ? undefined : this.AgentName,
          AgentPrivateIP: this.filter == false ? undefined : this.AgentPrivateIP == null ? undefined : this.AgentPrivateIP,
          AgentRouteTime: this.filter == false ? undefined : this.AgentRouteTime == null ? undefined : this.AgentRouteTime,
          AverageResponseTime: this.filter == false ? undefined : this.AverageResponseTime == null ? undefined : this.AverageResponseTime,
          Blacklisted: this.filter == false ? undefined : this.Blacklisted == null ? undefined : this.Blacklisted,
          ChannelId: this.filter == false ? undefined : this.Channel == null ? undefined : this.Channel,
          ChannelSource: this.filter == false ? undefined : this.ChannelSource == null ? undefined : this.ChannelSource,
          ChatEndTime: this.filter == false ? undefined : this.ChatEndTime == null ? undefined : this.ChatEndTime,
          CustomerCount: this.filter == false ? undefined : this.CustomerCount == null ? undefined : this.CustomerCount,
          CustomerFeedback: this.filter == false ? undefined : this.CustomerFeedback == null ? undefined : this.CustomerFeedback,
          CustomerName: this.filter == false ? undefined : this.CustomerName == null ? undefined : this.CustomerName,
          CustomerPrivateIP: this.filter == false ? undefined : this.CustomerPrivateIP == null ? undefined : this.CustomerPrivateIP,
          CustomerRating: this.filter == false ? undefined : this.CustomerRating == null ? undefined : this.CustomerRating,
          DisconnectionStatus: this.filter == false ? undefined : this.DisconnectionStatus == null ? undefined : this.DisconnectionStatus,
          Disposition: this.filter == false ? undefined : this.Disposition == null ? undefined : this.Disposition,
          Email: this.filter == false ? undefined : this.Email == null ? undefined : this.Email,
          FirstResponse: this.filter == false ? undefined : this.FirstResponse == null ? undefined : this.FirstResponse,
          HandleTime: this.filter == false ? undefined : this.HandleTime == null ? undefined : this.HandleTime,
          InteractionDuration: this.filter == false ? undefined : this.InteractionDuration == null ? undefined : this.InteractionDuration,
          InteractionType: this.filter == false ? undefined : this.InteractionType == null ? undefined : this.InteractionType,
          Number: this.filter == false ? undefined : this.Number == null ? undefined : this.Number,
          QueueTime: this.filter == false ? undefined : this.QueueTime == null ? undefined : this.QueueTime,
          Remarks: this.filter == false ? undefined : this.Remarks == null ? undefined : this.Remarks,
          SessionEndTime: this.filter == false ? undefined : this.SessionEndTime == null ? undefined : this.SessionEndTime,
          SessionID: this.filter == false ? undefined : this.SessionID == null ? undefined : this.SessionID,
          SessionStartTime: this.filter == false ? undefined : this.SessionStartTime == null ? undefined : this.SessionStartTime,
          SkillName: this.filter == false ? undefined : this.SkillName == null ? undefined : this.SkillName,
          SubDisposition: this.filter == false ? undefined : this.SubDisposition == null ? undefined : this.SubDisposition,
          SubSubDisposition: this.filter == false ? undefined : this.SubSubDisposition == null ? undefined : this.SubSubDisposition,
          SystemCount: this.filter == false ? undefined : this.SystemCount == null ? undefined : this.SystemCount,
          UserID: this.filter == false ? undefined : this.UserID == null ? undefined : this.UserID,
          PAGESIZE: itemsReportPerPage,
          PAGENO: currentpage
        }
      }
    }
    this.common.hubControlEvent('InteractionDetailsReport', 'click', '', '', JSON.stringify(this.requestObj), 'feildChooser');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        if (this.Export == true) {
          var tempData: any = [];
          tempData = res.results.data;
          if (tempData?.length > 0) {
            this.common.exportReport(tempData);
          }
        }
        else {
          this.loader = false;
          var tempRes = res.results.data
          this.paginationArray = [];
          this.tabValue = [];
          this.tabKey = [];

          for (let data of tempRes[0]) {
            var newObj = {
              "Sr No": '',
              "Id": data['ID'],
              "Transcript": '',
              "Session ID": data['SESSIONID'],
              "Channel": this.htmlDecode(data['Channel']),
              "Channel Source ": data['ChannelSource'],
              "Interaction Type": data['InteractionType'],
              "Agent Name": data['AGENTNAME'],
              "User ID": data['UserName'],
              "Customer Name": data['CUSTOMERNAME'],
              "Number": data['MOBILENUMBER'],
              "Email": data['EMAIL'],
              "Disconnection Status": data['status'],
              "Session Start Time ": data['SESSIONSTARTTIME'],
              "Agent Route Time ": data['AGENTROUTETIME'],
              "First Response": data['FirstResponseTime'],
              "Session End Time": data['SESSIONENDTIME'],
              "Chat End Time ": data['ChatEndTime'],
              "Interaction Duration": data['DURATION'],
              "Handle Time": data['HANDLETIME'],
              "Queue Time": data['QUEUETIME'],
              "Average Response Time": data['AvgResponseTime'],
              "Disposition": data['Disposition'],
              "SubDisposition": data['SubDisposition'],
              "SubSubDisposition": data['SubSubDisposition'],
              "Remarks": data['Remarks'],
              "Customer Rating": data['Rating2'],
              "Customer Feedback": data['CustomerFeedback'],
              "System Count": data['SystemMsgCount'],
              "Customer Count": data['CustomerMsgCount'],
              "Agent Count": data['AgentMsgCount'],
              "Blacklisted": data['BLACKLISTEDCUSTOMER'],
              "Skill Name": data['SKILLNAME'],
              "Customer Private IP": data['CustomerPrivateIP'],
              "Agent Private IP": data['CustomerPublicIP'],

            }
            this.tabValue.push(newObj);
          }
          for (var i = 1; i <= tempRes[1][0]['Total']; i++) {
            this.paginationArray.push(i)
          }

          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
          }
          this.common.tabValueLengthData(tempRes[1][0]['Total']);
          this.common.reportTabKeyData(this.tabKey);
          if (tempRes[0].length == 0) {
            this.noData = true
          } else {
            this.noData = false
          }
        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message);
      })
  }
  getTranscript(event) {
    this.common.hubControlEvent('InteractionDetailsReport', 'click', '', '', JSON.stringify(event), 'getTranscript');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'Transcript',
        Id: event
      },
      width: '60%'
    });
    dialogRef.afterClosed().subscribe(status => {
      this.loader = false;
      this.searchHawker(this.currentpage, this.itemsReportPerPage, this.filter == false ? this.Date : null)
    });
  }
  htmlDecode(data: any) {
    this.common.hubControlEvent('InteractionDetailsReport', 'click', '', '', JSON.stringify(data), 'htmlDecode');

    data = data.replace(/\&amp;/g, '&');
    data = data.replace(/\&gt;/g, '>');
    data = data.replace(/\&lt;/g, '<');
    data = data.replace(/\&quot;/g, '');
    data = data.replace(/\&apos;/g, '');
    return data;
  }
  pageChange(currentpage) {
    this.common.hubControlEvent('InteractionDetailsReport', 'click', '', '', JSON.stringify(currentpage), 'htmlDecode');

    this.currentpage = currentpage;
    this.Export = false;
    this.searchHawker(currentpage, this.itemsReportPerPage, this.filter == false ? this.Date : null)
  }
  reset() {
    this.common.hubControlEvent('InteractionDetailsReport', 'click', '', '', '', 'reset');

    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
  }

  count = true
  sortUsers(by: string, order: string): void {
    if (by == 'Actionable') return
    if (by == 'Sr No') return

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


    let x = this.tabValue.filter(n => n[by])
    let k = this.tabValue.filter(n => n[by] == null)
    let s = this.tabValue.filter(n => n[by] == '')
    let y = x.sort((a, b) => a[by].localeCompare(b[by]))
    this.tabValue = [...y, ...k, ...s]
    this.count = !this.count
    this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

  }
}
