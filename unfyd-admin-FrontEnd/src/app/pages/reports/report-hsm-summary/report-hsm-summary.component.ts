import { Component, ElementRef, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import * as _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { default as _rollupMoment, Moment } from 'moment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-report-hsm-summary',
  templateUrl: './report-hsm-summary.component.html',
  styleUrls: ['./report-hsm-summary.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ReportHsmSummaryComponent implements OnInit {

  loader: boolean = false;
  userDetails: any;
  proccessId: any;
  requestObj: any = {};
  form: FormGroup;
  type: any;
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  paginationArray: any = [];
  currentpage: number = 1;
  itemsPerPage: number = 10;
  minDate = new Date();
  maxDate = new Date();
  dateFormat: any;
  filter: boolean = false;
  startDate = new Date();
  endDate = new Date();
  Date = new Date();
  Channel: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  search: any;
  SourceType: any;
  Count: any;
  TemplateName: any;
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
  ) { }

  ngOnInit() {
    this.common.hubControlEvent('HSMSummaryReport','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.proccessId = this.userDetails.Processid;
    this.type = this.router.url.substring(1, this.router.url.length);
    if (this.type == "report-hsm-summary") {
      this.type = "HSMSummaryReport"
    }
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.dateFormat = (data.DatePickerFormat);
    });
    this.form = this.formBuilder.group({});
    this.getFilter();
    this.feildChooser();
    this.loadAgentFilter();
    this.loadReportsData();

    this.changeModuleDisplayName=this.common.changeModuleLabelName()

    this.common.hubControlEvent('HSMSummaryReport','click','pageloadend','pageloadend','','ngOnInit');

  }
  loadAgentFilter() {
    this.common.hubControlEvent('HSMSummaryReport','click','','','','loadAgentFilter');

    this.subscriptionPopupModal = this.common.agentFilterDynamic.subscribe((data: any) => {
      this.filter = true;
      this.Export = false;
      this.startDate = data?.FROMDATE;
      this.endDate = data?.TODATE;
      this.SourceType = data?.SourceType;
      this.Count = data?.Count;
      this.TemplateName = data?.TemplateName;
      this.searchHawker(this.currentpage, this.itemsPerPage, null);
    });
    this.exportValue = this.common.exportEmitter.subscribe((data: any) => {
      this.Export = data?.Export;
      this.searchHawker(this.currentpage, this.itemsPerPage, this.filter == true ? null : this.Date);
    });
  }
  loadReportsData() {
    this.common.hubControlEvent('HSMSummaryReport','click','','','','loadReportsData');

    this.reportsData = this.common.reportsDataEmitter.subscribe((data: any) => {
      this.filter = false;
      this.Export = false;
      this.Date = data;
      this.currentpage = 1;
      this.searchHawker(this.currentpage, this.itemsPerPage, this.Date);
    });
  }
  pageChange(currentpage) {
    this.common.hubControlEvent('HSMSummaryReport','click','','',JSON.stringify(currentpage),'pageChange');

    this.currentpage = currentpage;
    this.Export = false;
    this.searchHawker(currentpage, this.itemsPerPage, this.filter == false ? this.Date : null)
  }
  searchHawker(currentpage, itemsPerPage, date) {
    if (date == '') {
      this.filter = false;
    }
    if (this.Export == false || this.Export == undefined) {
      this.loader = true;
    }
    this.requestObj = {
      data: {
        spname: "UNFYD_ADM_RPT_V1_HSMSummaryDETAILS",
        parameters: {
          FROMDATE: this.filter == true ? this.startDate : date,
          TODATE: this.filter == true ? this.endDate : date,
          PROCESSID: this.proccessId,
          FLAG: this.Export == true ? 'EXPORT' : "BIND_DETAILS",
          SourceType: this.filter == false ? undefined : this.SourceType == null ? undefined : this.SourceType,
          Count: this.filter == false ? undefined : this.Count == null ? undefined : Number(this.Count),
          TemplateName: this.filter == false ? undefined : this.TemplateName == null ? undefined : this.TemplateName,
          PAGESIZE: itemsPerPage,
          PAGENO: currentpage
        }
      }
    }
    this.common.hubControlEvent('HSMSummaryReport','click','','',JSON.stringify(this.requestObj),'searchHawker');

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
              "Date": data['Date'],
              "Source Type": data['SourceType'],
              "Template Name": data['TEMPLATE NAME'],
              "Count": data['Count']
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
      });
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionPopupModal?.unsubscribe();
    this.reportsData?.unsubscribe();
    this.exportValue?.unsubscribe();
  }
  getFilter() {
    this.common.hubControlEvent('HSMSummaryReport','click','','','','getFilter');

    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.searchHawker(this.currentpage, this.itemsPerPage, '');
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
    this.common.hubControlEvent('HSMSummaryReport','click','','',JSON.stringify(obj),'feildChooser');

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
