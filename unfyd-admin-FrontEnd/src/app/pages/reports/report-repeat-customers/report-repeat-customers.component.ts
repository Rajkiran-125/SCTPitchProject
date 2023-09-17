import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
@Component({
  selector: 'app-report-repeat-customers',
  templateUrl: './report-repeat-customers.component.html',
  styleUrls: ['./report-repeat-customers.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class ReportRepeatCustomersComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  submittedForm: boolean = false;
  currentpage: number = 1;
  itemsPerPage: number = 10;
  search: any;
  today = new Date();
  minDate = new Date();
  maxDate = new Date();
  paginationArray: any = [];
  Export: boolean = false;
  subscriptionPopupModal: Subscription | undefined;
  reportsData: Subscription | undefined;
  exportValue: Subscription | undefined;
  type: any;
  filter: boolean = false;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  dateFormat: any;
  Date = new Date();
  filterData: any;
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private router: Router) {
    Object.assign(this, { regex });
  }

  ngOnInit() {
    this.common.hubControlEvent('RepeatCustomers','click','pageload','pageload','','ngOnInit');

    this.filter = false;
    this.userDetails = this.auth.getUser();
    this.type = this.router.url.substring(1, this.router.url.length);
    if (this.type == "report-repeat-customers") {
      this.type = "RepeatCustomers"
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
    this.loadFilter();
    this.loadReportsData();
    this.common.hubControlEvent('RepeatCustomers','click','pageloadend','pageloadend','','ngOnInit');

  }
  loadReportsData() {
    this.common.hubControlEvent('RepeatCustomers','click','','','','loadReportsData');

    this.reportsData = this.common.reportsDataEmitter.subscribe((data: any) => {
      this.filter = false;
      this.Export = false;
      this.Date = data;
      this.currentpage = 1;
      this.getData(this.currentpage, this.itemsPerPage, this.Date);
    });
  }

  loadFilter() {
    this.common.hubControlEvent('RepeatCustomers','click','','','','loadFilter');

    this.subscriptionPopupModal = this.common.agentFilterDynamic.subscribe((data: any) => {
      this.filter = true;
      this.Export = false;
      this.filterData = data;
      this.getData(this.currentpage, this.itemsPerPage, null);
    });
    this.exportValue = this.common.exportEmitter.subscribe((data: any) => {
      // console.log(data);
      this.Export = data?.Export;
      this.getData(this.currentpage, this.itemsPerPage, this.filter == true ? null : this.Date);
    });
  }

  getData(currentpage, itemsPerPage, date) {
    if (date == '') {
      this.filter = false;
    }
    if (this.Export == false || this.Export == undefined) {
      this.loader = true;
    }
    let obj = this.filter == true ? this.filterData : undefined;
    let requestObj = {
      data: {
        spname: "USP_REPEAT_CUSTOMERS_DASHBOARD",
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
    this.common.hubControlEvent('RepeatCustomers','click','','',JSON.stringify(requestObj),'getData');

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
          var tempRes = res.results.data;
          this.paginationArray = [];
          this.tabValue = [];
          this.tabKey = [];
          for (let data of tempRes[0]) {
            var newObj = {
              "Sr No": '',
              "Date": data['Date'],
              "Channel": this.htmlDecode(data['Channel']),
              "Session Id": data['SessionId'],
              "Name": data['Name'],
              "Number": data['Number'],
              "Email": data['Email'],
              "Disposition": data['Disposition'],
              "Sub-Disposition": data['SubDisposition'],
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
      }
      else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message);
      })
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionPopupModal?.unsubscribe();
    this.reportsData?.unsubscribe();
    this.exportValue?.unsubscribe();
  }

  pageChange(currentpage) {
    this.common.hubControlEvent('RepeatCustomers','click','','',JSON.stringify(currentpage),'pageChange');

    this.currentpage = currentpage;
    this.Export = false;
    this.getData(currentpage, this.itemsPerPage, this.filter == false ? this.Date : null);
  }

  getFilter() {
    this.common.hubControlEvent('RepeatCustomers','click','','','','getFilter');

    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        // this.getData(this.currentpage, this.itemsPerPage, '');
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
    this.common.hubControlEvent('RepeatCustomers','click','','',JSON.stringify(obj),'feildChooser');

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
  htmlDecode(data: any) {
    this.common.hubControlEvent('RepeatCustomers','click','','',JSON.stringify(data),'htmlDecode');

    data = data.replace(/\&amp;/g, '&');
    data = data.replace(/\&gt;/g, '>');
    data = data.replace(/\&lt;/g, '<');
    data = data.replace(/\&quot;/g, '');
    data = data.replace(/\&apos;/g, '');
    return data;
  }

}
