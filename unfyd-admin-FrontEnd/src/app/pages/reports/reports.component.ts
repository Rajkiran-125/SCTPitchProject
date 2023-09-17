import { Component, ElementRef, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex } from 'src/app/global/json-data';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'src/app/global/interface';
import { asideBarReportmenu } from 'src/app/global/json-data';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
import { hawkerStatusSteps } from 'src/app/global/json-data';
import { Subscription } from 'rxjs/internal/Subscription';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  @ViewChild('exelUpload') myInputVariable: ElementRef;
  public breadcrumbs: Breadcrumb[];
  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  currentpage: number = 1;
  itemsPerPage: number = 10;
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
  searchText: string;
  dateFormat: any;
  filter: boolean = false;
  Date = new Date();
  subscriptionPopupModal: Subscription | undefined;
  reportsData: Subscription | undefined;
  exportValue: Subscription | undefined;
  Export: boolean = false;
  reportname: any;
  filterData: any;
  spname: any;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
  ) {
    Object.assign(this, { regex });
    Object.assign(this, { hawkerStatusSteps });
    Object.assign(this, { asideBarReportmenu });
  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.loader = true;
    this.activatedRoute.queryParams.subscribe(params => {
      this.reportname = params.reportname;
      this.spname = params.spname;
    });
    let report = this.reportname.replace(/[ /-]/g, '') + 'Report';
    this.type = report == 'OfflineInteractionsReport' ? 'OfflineMessageReport' : report == 'TranscriptReport' ? 'TranscriptsReport' : report;
    this.common.ReportChange$.subscribe((res => {
      if (res.status == true) {
        this.getSnapshot();
        this.reportname = res.data.reportname;
        this.type = res.data.type;
        this.getFilter();
        this.feildChooser();
        this.loadFilter();
        this.loadReportsData();
        this.common.setReportChange(this.type);
      }
    }));
    this.getSnapshot();
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.form = this.formBuilder.group({});
    this.getFilter();
    this.userDetails = this.auth.getUser();
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.dateFormat = (data.DatePickerFormat);
    });
    this.feildChooser();
    this.loadFilter();
    this.loadReportsData();
  }

  getSnapshot() {
    this.ngOnDestroy(); this.requestObj = {}; this.tabKey = []; this.tabValue = [];
    this.paginationArray = []; this.selctedField = []; this.unSelctedField = [];
    this.finalField = []; this.currentpage = 1; this.loader = true; this.Export = false;
    this.filter = false; this.filterData = undefined; this.noData = false;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  loadFilter() {
    this.subscriptionPopupModal = this.common.agentFilterDynamic.subscribe((data: any) => {
      this.filter = true;
      this.Export = false;
      this.filterData = data;
      this.getData(this.currentpage, this.itemsPerPage, null);
    });
    this.exportValue = this.common.exportEmitter.subscribe((data: any) => {
      this.Export = data?.Export;
      this.getData(this.currentpage, this.itemsPerPage, this.filter == true ? null : this.Date);
    });
  }

  loadReportsData() {
    this.loader = false;
    this.reportsData = this.common.reportsDataEmitter.subscribe((data: any) => {
      this.filter = false;
      this.Export = false;
      this.Date = data;
      this.currentpage = 1;
      this.getData(this.currentpage, this.itemsPerPage, this.Date);
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionPopupModal?.unsubscribe();
    this.reportsData?.unsubscribe();
    this.exportValue?.unsubscribe();
  }

  getFilter() {
    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.getData(this.currentpage, this.itemsPerPage, '');
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

  getData(currentpage, itemsPerPage, date) {
    if (date == '') {
      this.filter = false;
    }
    if (this.Export == false || this.Export == undefined) {
      this.loader = true;
    }
    let obj = this.filter == true ? this.filterData : undefined;
    this.requestObj = {
      data: {
        spname: this.spname,
        parameters: {
          FROMDATE: this.filter == true ? undefined : date,
          TODATE: this.filter == true ? undefined : date,
          PROCESSID: this.userDetails.Processid,
          FLAG: this.Export == true ? 'EXPORT' : "BIND_DATA",
          PAGESIZE: itemsPerPage,
          PAGENO: currentpage,
          ...obj
        }
      }
    }
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
          if (tempRes == undefined || tempRes == null) {
            this.noData = true
          } else {
            for (let data of tempRes[0]) {
              this.tabValue.push(data);
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
    this.currentpage = currentpage;
    this.Export = false;
    this.getData(currentpage, this.itemsPerPage, this.filter == false ? this.Date : null)
  }

  getTranscript(event) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'Transcript',
        Id: event
      },
      width: '60%'
    });
    dialogRef.afterClosed().subscribe(status => {
      this.loader = false;
      this.getData(this.currentpage, this.itemsPerPage, this.filter == false ? this.Date : null)
    });
  }

  htmlDecode(data: any) {
    data = data.replace(/\&amp;/g, '&');
    data = data.replace(/\&gt;/g, '>');
    data = data.replace(/\&lt;/g, '<');
    data = data.replace(/\&quot;/g, '');
    data = data.replace(/\&apos;/g, '');
    return data;
  }

  reset() {
    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
  }
}
