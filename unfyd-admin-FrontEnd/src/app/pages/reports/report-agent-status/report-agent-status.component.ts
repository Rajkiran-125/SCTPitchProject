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
  selector: 'app-report-agent-status',
  templateUrl: './report-agent-status.component.html',
  styleUrls: ['./report-agent-status.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ReportAgentStatusComponent implements OnInit {

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
  today = new Date();
  minDate = new Date();
  maxDate = new Date();
  shake = false;
  proccessId: any;
  paginationArray: any = [];
  type: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  userConfig: any;
  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  searchText: string;
  dateFormat: any;
  filter: boolean = false;
  startDate = new Date();
  endDate = new Date();
  Date = new Date();
  Name: any;
  Status: any;
  Channel: any;
  UserId: any;
  Reason: any;
  StartTime: any;
  EndTime: any;
  Duration: any;
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
    this.common.hubControlEvent('AgentStatusReport','click','pageload','pageload','','ngOnInit');

    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    this.form = this.formBuilder.group({
      fromDate: [moment(), Validators.required],
      toDate: [moment(), Validators.required]
    });
    this.getFilter();
    this.userDetails = this.auth.getUser();
    this.type = this.router.url.substring(1, this.router.url.length);
    if (this.type == "report-agent-status") {
      this.type = "AgentStatusReport"
    }
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.dateFormat = (data.DatePickerFormat);
    });
    this.feildChooser();
    this.loadAgentFilter();
    this.loadReportsData();
    
    this.changeModuleDisplayName=this.common.changeModuleLabelName()

    this.common.hubControlEvent('AgentStatusReport','click','pageloadend','pageloadend','','ngOnInit');

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  loadAgentFilter() {
    this.common.hubControlEvent('AgentStatusReport','click','','','','loadAgentFilter');

    this.subscriptionPopupModal = this.common.agentFilterDynamic.subscribe((data: any) => {
      this.filter = true;
      this.Export = false;
      this.startDate = data?.FROMDATE;
      this.endDate = data?.TODATE;
      this.Name = data?.AgentName;
      this.Status = data?.AgentStatus;
      this.UserId = data?.UserId;
      this.Reason = data?.ReasonCode;
      this.Duration = data?.Duration;
      this.StartTime = data?.StartTime;
      this.EndTime = data?.EndTime;
      this.currentpage = 1;
      this.Channel = data?.ChannelId;
      this.searchHawker(this.currentpage, this.itemsReportPerPage, null);
    });
    this.exportValue = this.common.exportEmitter.subscribe((data: any) => {
      this.Export = data?.Export;
      this.searchHawker(this.currentpage, this.itemsReportPerPage, this.filter == true ? null : this.Date);
    });
  }

  loadReportsData() {
    this.common.hubControlEvent('AgentStatusReport','click','','','','loadReportsData');

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

  getFilter() {
    this.common.hubControlEvent('AgentStatusReport','click','','','','getFilter');

    this.common.getreportItemsPerPage$.subscribe(data => {
      this.itemsReportPerPage = data
      this.searchHawker(this.currentpage, this.itemsReportPerPage, this.filter == false ? this.Date : null)
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
    this.common.hubControlEvent('AgentStatusReport','click','','',JSON.stringify(obj),'feildChooser');

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

    //console.log(value, "-+-+-+-+-+")
  }



  searchHawker(currentpage, itemsReportPerPage, date) {
    if (date == '') {
      this.filter = false;
    }
    this.userDetails = this.auth.getUser();
    this.proccessId = this.userDetails.Processid;
    if (this.Export == false || this.Export == undefined) {
      this.loader = true;
    }
    this.submittedForm = true;
    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("Select dates properly.", 'error');
      return;
    } else if (this.form.value.fromDate > this.form.value.toDate && this.form.value.fromDate != this.form.value.toDate) {
      this.loader = false;
      this.common.snackbar("FromDate cannot be greater than ToDate.", 'error');
      return;
    }

    this.requestObj = {
      data: {
        spname: "UNFYD_ADM_RPT_V1_AGENTSTATUS",
        parameters: {
          FROMDATE: this.filter == true ? this.startDate : date,
          TODATE: this.filter == true ? this.endDate : date,
          PROCESSID: this.proccessId,
          FLAG: this.Export == true ? 'EXPORT' : "BIND_DATA",
          ID: this.userDetails.Id,
          ChannelId: this.filter == false ? undefined : this.Channel == null ? undefined : this.Channel,
          USERID: this.filter == false ? undefined : this.UserId == null ? undefined : this.UserId,
          AGENTNAME: this.filter == false ? undefined : this.Name == null ? undefined : this.Name,
          AGENTSTATUS: this.filter == false ? undefined : this.Status == null ? undefined : this.Status,
          REASONCODE: this.filter == false ? undefined : this.Reason == null ? undefined : this.Reason,
          STARTTIME: this.filter == false ? undefined : this.StartTime == null ? undefined : this.StartTime,
          ENDTIME: this.filter == false ? undefined : this.EndTime == null ? undefined : this.EndTime,
          DURATION: this.filter == false ? undefined : this.Duration == null ? undefined : this.Duration,
          PAGESIZE: itemsReportPerPage,
          PAGENO: currentpage
        }
      }
    }
    this.common.hubControlEvent('AgentStatusReport','click','','',JSON.stringify(this.requestObj),'searchHawker');

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
          var tempRes = res.results.data;
          this.paginationArray = [];
          this.tabValue = [];
          this.tabKey = [];
          for (let data of tempRes[0]) {
            var newObj = {
              "Sr No": '',
              "Date": data['Date'],
              "Channel": this.htmlDecode(data['Channel']),
              "UserId": data['UserId'],
              "Agent Name": data['Agent Name'],
              "Agent Status": data['Agent Status'],
              "Reason Code": data['Reason Code'],
              "Start Time": data['Start Time'],
              "End Time": data['End Time'],
              "Duration": data['Duration'],
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

  pageChange(currentpage) {
    this.common.hubControlEvent('AgentStatusReport','click','','',JSON.stringify(currentpage),'pageChange');

    this.currentpage = currentpage;
    this.Export = false;
    this.searchHawker(currentpage, this.itemsReportPerPage, this.filter == false ? this.Date : null)
  }

  htmlDecode(data: any) {
    this.common.hubControlEvent('AgentStatusReport','click','','',JSON.stringify(data),'htmlDecode');

    data = data.replace(/\&amp;/g, '&');
    data = data.replace(/\&gt;/g, '>');
    data = data.replace(/\&lt;/g, '<');
    data = data.replace(/\&quot;/g, '');
    data = data.replace(/\&apos;/g, '');
    return data;
  }


  reset() {
    this.common.hubControlEvent('AgentStatusReport','click','','','','reset');

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


      let x=this.tabValue.filter(n => n[by])
      let k=this.tabValue.filter(n => n[by]==null)
      let s=this.tabValue.filter(n => n[by]=='')
      let y=x.sort((a, b) =>a[by].localeCompare(b[by]))
      this.tabValue=[...y, ...k, ...s]
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
   
  }
}
