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
  selector: 'app-report-hourly-wise-interaction',
  templateUrl: './report-hourly-wise-interaction.component.html',
  styleUrls: ['./report-hourly-wise-interaction.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ReportHourlyWiseInteractionComponent implements OnInit {
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
  today = new Date();
  minDate = new Date();
  maxDate = new Date();
  proccessId: any;
  paginationArray: any = []
  currentpage: number = 1;
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
  OnlineCount: any;
  OfflineCount: any;
  TimeSlot: any;
  subscriptionPopupModal: Subscription | undefined;
  reportsData: Subscription | undefined;
  exportValue: Subscription | undefined; Export: boolean = false;
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
    this.common.hubControlEvent('HourlyWiseInteractionReport','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.proccessId = this.userDetails.Processid;
    this.type = this.router.url.substring(1, this.router.url.length);
    if (this.type == "report-hourly-wise-interaction") {
      this.type = "HourlyWiseInteractionReport"
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

    this.changeModuleDisplayName=this.common.changeModuleLabelName()

    this.common.hubControlEvent('HourlyWiseInteractionReport','click','pageloadend','pageloadend','','ngOnInit');

  }

  loadAgentFilter() {
    this.common.hubControlEvent('HourlyWiseInteractionReport','click','','','','loadAgentFilter');

    this.subscriptionPopupModal = this.common.agentFilterDynamic.subscribe((data: any) => {
      this.filter = true;
      this.Export = false;
      this.startDate = data?.FROMDATE;
      this.endDate = data?.TODATE;
      this.currentpage = 1;
      this.Channel = data?.ChannelId;
      this.OnlineCount = data?.OnlineInteractionCount;
      this.OfflineCount = data?.OfflineInteractionCount;
      this.TimeSlot = data?.TimeSlot == null ? undefined : new Date(data?.TimeSlot)?.getHours() + '_' + String(new Date(data?.TimeSlot)?.getMinutes()).padStart(2, "0");
      this.searchHawker(this.currentpage, this.itemsReportPerPage, null);
    });
    this.exportValue = this.common.exportEmitter.subscribe((data: any) => {
      this.Export = data?.Export;
      this.searchHawker(this.currentpage, this.itemsReportPerPage, this.filter == true ? null : this.Date);
    });
  }

  loadReportsData() {
    this.common.hubControlEvent('HourlyWiseInteractionReport','click','','','','loadReportsData');

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
    this.common.hubControlEvent('HourlyWiseInteractionReport','click','','','','getFilter');

    this.common.getreportItemsPerPage$.subscribe(data => {
      this.itemsReportPerPage = data
      this.searchHawker(this.currentpage, this.itemsReportPerPage, this.filter == false ? this.Date : null);
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
    this.common.hubControlEvent('HourlyWiseInteractionReport','click','','',JSON.stringify(obj),'feildChooser');

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
      return;
    }

    let requestObj = {
      data: {
        spname: "USP_HOURLY_INTERACTION_COUNT_DASHBOARD",
        parameters: {
          FROMDATE: this.filter == true ? this.startDate : date,
          TODATE: this.filter == true ? this.endDate : date,
          PROCESSID: this.proccessId,
          FLAG: this.Export == true ? 'EXPORT' : "BIND_DATA",
          TIMESLOT: this.filter == false ? undefined : this.TimeSlot == null ? undefined : this.TimeSlot == 'NaN_NaN' ? undefined : this.TimeSlot,
          ONLINECOUNT: this.filter == false ? undefined : this.OnlineCount == null ? undefined : Number(this.OnlineCount),
          OFFLINECOUNT: this.filter == false ? undefined : this.OfflineCount == null ? undefined : Number(this.OfflineCount),
          ChannelId: this.filter == false ? undefined : this.Channel == null ? undefined : this.Channel,
          PAGESIZE: itemsReportPerPage,
          PAGENO: currentpage
        }
      }
    }
    this.common.hubControlEvent('HourlyWiseInteractionReport','click','','',JSON.stringify(requestObj),'searchHawker');

    this.api.post('index', requestObj).subscribe((res) => {

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
              "Time Slot": data['TimeSlot'],
              "Channel": this.htmlDecode(data['Channel']),
              "Online Interaction Count": data['Online Interaction Count'],
              "Offline Interaction Count": data['Offline Interaction Count']
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
  htmlDecode(data: any) {
    this.common.hubControlEvent('HourlyWiseInteractionReport','click','','',JSON.stringify(data),'htmlDecode');

    data = data.replace(/\&amp;/g, '&');
    data = data.replace(/\&gt;/g, '>');
    data = data.replace(/\&lt;/g, '<');
    data = data.replace(/\&quot;/g, '');
    data = data.replace(/\&apos;/g, '');
    return data;
  }

  pageChange(currentpage) {
    this.common.hubControlEvent('HourlyWiseInteractionReport','click','','',JSON.stringify(currentpage),'pageChange');

    this.currentpage = currentpage;
    this.Export = false;
    this.searchHawker(currentpage, this.itemsReportPerPage, this.filter == false ? this.Date : null)
  }

  reset() {
    this.common.hubControlEvent('HourlyWiseInteractionReport','click','','','','reset');

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
      if (by == 'Online Interaction Count' || by == 'Offline Interaction Count' ) {
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
