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
import { default as _rollupMoment, Moment } from 'moment';
import { Router } from '@angular/router';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Subscription } from 'rxjs';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-report-agent-performance',
  templateUrl: './report-agent-performance.component.html',
  styleUrls: ['./report-agent-performance.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ReportAgentPerformanceComponent implements OnInit {

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
  page: number = 1;
  itemsReportPerPage: number = 10;
  search: any;
  minDate = new Date();
  maxDate = new Date();
  proccessId: any;
  paginationArray: any = []

  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  searchText: string;
  type: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  userConfig: any;
  dateFormat: any;
  filter: boolean = false;
  startDate = new Date();
  endDate = new Date();
  Date = new Date();
  Channel: any;
  AHT: any;
  ActiveDuration: any;
  AgentName: any;
  AvgRating: any;
  InteractionCount: any;
  LoginDuration: any;
  NotReadyDuration: any;
  ReadyDuration: any;
  RequeueCount: any;
  StopInteractionDuration: any;
  TotalSurveyReceived: any;
  TransferCount: any;
  UserName: any;
  fiveRating: any;
  fourRating: any;
  oneRating: any;
  threeRating: any;
  twoRating: any;
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
    this.common.hubControlEvent('AgentPerformanceReport','click','pageload','pageload','','ngOnInit');

    //console.log(this.minDate, "======", this.maxDate)
    this.userDetails = this.auth.getUser();
    this.type = this.router.url.substring(1, this.router.url.length);
    if (this.type == "report-agent-performance") {
      this.type = "AgentPerformanceReport"
    }
    this.proccessId = this.userDetails.Processid;
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    //console.log(this.minDate, "++++++++", this.maxDate)

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

    this.changeModuleDisplayName=this.common.changeModuleLabelName()
    
    this.common.hubControlEvent('AgentPerformanceReport','click','pageloadend','pageloadend','','ngOnInit');

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  loadAgentFilter() {
    this.common.hubControlEvent('AgentPerformanceReport','click','','','','loadAgentFilter');

    this.subscriptionPopupModal = this.common.agentFilterDynamic.subscribe((data: any) => {
      this.filter = true;
      this.Export = false;
      this.startDate = data?.FROMDATE;
      this.endDate = data?.TODATE;
      this.AHT = data?.AHT;
      this.ActiveDuration = data?.ActiveDuration;
      this.AgentName = data?.AgentName;
      this.AvgRating = data?.AvgRating;
      this.InteractionCount = data?.InteractionCount;
      this.LoginDuration = data?.LoginDuration;
      this.NotReadyDuration = data?.NotReadyDuration;
      this.ReadyDuration = data?.ReadyDuration;
      this.RequeueCount = data?.RequeueCount;
      this.StopInteractionDuration = data?.StopInteractionDuration;
      this.TotalSurveyReceived = data?.TotalSurveyReceived;
      this.TransferCount = data?.TransferCount;
      this.UserName = data?.UserName;
      this.fiveRating = data?.fiveRating;
      this.fourRating = data?.fourRating;
      this.oneRating = data?.oneRating;
      this.threeRating = data?.threeRating;
      this.twoRating = data?.twoRating;
      this.page = 1;
      this.Channel = data?.ChannelId;
      this.searchHawker(this.page, this.itemsReportPerPage, null);
    });
    this.exportValue = this.common.exportEmitter.subscribe((data: any) => {
      this.Export = data?.Export;
      this.searchHawker(this.page, this.itemsReportPerPage, this.filter == true ? null : this.Date);
    });
  }

  loadReportsData() {
    this.common.hubControlEvent('AgentPerformanceReport','click','','','','loadReportsData');

    this.reportsData = this.common.reportsDataEmitter.subscribe((data: any) => {
      this.filter = false;
      this.Export = false;
      this.Date = data;
      this.page = 1;
      this.searchHawker(this.page, this.itemsReportPerPage, this.Date);
    });
  }

  ngOnDestroy() {
    this.subscriptionPopupModal?.unsubscribe();
    this.reportsData?.unsubscribe();
    this.exportValue?.unsubscribe();
  }

  getFilter() {
    this.common.hubControlEvent('AgentPerformanceReport','click','','','','getFilter');

    this.common.getreportItemsPerPage$.subscribe(data => {
      this.itemsReportPerPage = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.searchHawker(this.page, this.itemsReportPerPage, '');
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
    this.common.hubControlEvent('AgentPerformanceReport','click','','',JSON.stringify(obj),'feildChooser');

    this.api.post('index', obj).subscribe(res => {
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
    //
    //console.log(value, "-+-+-+-+-+")
  }

  searchHawker(page, itemsReportPerPage, date) {
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
    //console.log(a, "=========", b)
    this.requestObj = {
      data: {
        spname: "UNFYD_ADM_RPT_V1_AGENTPERFORM",
        parameters: {
          FROMDATE: this.filter == true ? this.startDate : date,
          TODATE: this.filter == true ? this.endDate : date,
          PROCESSID: this.proccessId,
          FLAG: this.Export == true ? 'EXPORT' : "BIND_DETAILS",
          ID: this.userDetails.Id,
          ChannelId: this.filter == false ? undefined : this.Channel == null ? undefined : this.Channel,
          AHT: this.filter == false ? undefined : this.AHT == null ? undefined : this.AHT,
          ACTIVEDURATION: this.filter == false ? undefined : this.ActiveDuration == null ? undefined : this.ActiveDuration,
          AGENTNAME: this.filter == false ? undefined : this.AgentName == null ? undefined : this.AgentName,
          AVGRATING: this.filter == false ? undefined : this.AvgRating == null ? undefined : Number(this.AvgRating),
          INTERACTIONCOUNT: this.filter == false ? undefined : this.InteractionCount == null ? undefined : Number(this.InteractionCount),
          LOGINDURATION: this.filter == false ? undefined : this.LoginDuration == null ? undefined : this.LoginDuration,
          NOTREADYDURATION: this.filter == false ? undefined : this.NotReadyDuration == null ? undefined : this.NotReadyDuration,
          READYDURATION: this.filter == false ? undefined : this.ReadyDuration == null ? undefined : this.ReadyDuration,
          REQUEUECOUNT: this.filter == false ? undefined : this.RequeueCount == null ? undefined : Number(this.RequeueCount),
          STOPINTERACTIONDURATION: this.filter == false ? undefined : this.StopInteractionDuration == null ? undefined : this.StopInteractionDuration,
          TOTALSURVEYRECEIVED: this.filter == false ? undefined : this.TotalSurveyReceived == null ? undefined : Number(this.TotalSurveyReceived),
          TRANSFERCOUNT: this.filter == false ? undefined : this.TransferCount == null ? undefined : Number(this.TransferCount),
          USERNAME: this.filter == false ? undefined : this.UserName == null ? undefined : this.UserName,
          FIVERATING: this.filter == false ? undefined : this.fiveRating == null ? undefined : Number(this.fiveRating),
          FOURRATING: this.filter == false ? undefined : this.fourRating == null ? undefined : Number(this.fourRating),
          ONERATING: this.filter == false ? undefined : this.oneRating == null ? undefined : Number(this.oneRating),
          THREERATING: this.filter == false ? undefined : this.threeRating == null ? undefined : Number(this.threeRating),
          TWORATING: this.filter == false ? undefined : this.twoRating == null ? undefined : Number(this.twoRating),
          PAGESIZE: itemsReportPerPage,
          PAGENO: page
        }
      }
    }
    this.common.hubControlEvent('AgentPerformanceReport','click','','',JSON.stringify(this.requestObj),'searchHawker');

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
          let tempRes = res.results.data
          this.paginationArray = [];
          this.tabValue = [];
          this.tabKey = [];
          for (let data of tempRes[0]) {
            var newObj = {
              "Sr No": '',
              "Date": data['Date'],
              "Channel": data['Channel'] == null || data['Channel'] == undefined ? '' : this.htmlDecode(data['Channel']),
              "UserName": data['UserName'],
              "Agent Name": data['Agent Name'],
              "AHT": data['AHT'],
              "Interaction Count": data['Interaction Count'],
              "Transfer Count": data['Transfer Count'],
              "Requeue Count": data['Requeue Count'],
              "Login Duration": data['Login Duration'],
              "Active Duration": data['Active Duration'],
              "Not Ready Duration": data['Not Ready Duration'],
              "Ready Duration": data['Ready Duration'],
              "Stop Interaction Duration": data['Stop Interaction Duration'],
              "Total Survey Received": data['Total Survey Received'],
              "Avg Rating": data['Avg Rating'],
              "1* Rating": data['1* Rating'],
              "2* Rating": data['2* Rating'],
              "3* Rating": data['3* Rating'],
              "4* Rating": data['4* Rating'],
              "5* Rating": data['5* Rating'],
            }
            this.tabValue.push(newObj);
          }
          for (var i = 1; i <= tempRes[1][0]['Total']; i++) {
            this.paginationArray.push(i);
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
  htmlDecode(data: any) {
    this.common.hubControlEvent('AgentPerformanceReport','click','','',JSON.stringify(data),'htmlDecode');

    data = data.replace(/\&amp;/g, '&');
    data = data.replace(/\&gt;/g, '>');
    data = data.replace(/\&lt;/g, '<');
    data = data.replace(/\&quot;/g, '');
    data = data.replace(/\&apos;/g, '');
    return data;
  }
  pageChange(currentpage) {
    this.common.hubControlEvent('AgentPerformanceReport','click','','',JSON.stringify(currentpage),'pageChange');

    this.page = currentpage;
    this.Export = false;
    this.searchHawker(currentpage, this.itemsReportPerPage, this.filter == false ? this.Date : null);
  }

  reset() {
    this.common.hubControlEvent('AgentPerformanceReport','click','','','','reset');

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
      if (by == 'Interaction Count' || by == 'Total Survey Received' || by == '1* Rating'|| by == '2* Rating'|| by == '3* Rating' || by == '4* Rating'|| by == '5* Rating') {
        this.tabValue.sort((a, b) => parseInt(a[by]) - parseInt(b[by]));
        this.count = !this.count
        this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
        return
    }
      let x=this.tabValue.filter(n => n[by])
      let k=this.tabValue.filter(n => n[by]==null)
      let s=this.tabValue.filter(n => n[by]=='')
      let y=x.sort((a, b) =>a[by].localeCompare(b[by]))
      this.tabValue=[...y, ...k, ...s]
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
   
  }
}

