import { Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex } from 'src/app/global/json-data';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
// import {Moment} from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
// import * as moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-report-vendor-registration',
  templateUrl: './report-vendor-registration.component.html',
  styleUrls: ['./report-vendor-registration.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReportVendorRegistrationComponent implements OnInit {
  date = new FormControl(moment(),Validators.required);

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
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
  vendorRegistration:boolean = true
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  minDate = new Date();
  maxDate = new Date();
  userConfig:any
  type: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];

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
    this.common.hubControlEvent('VendorRegistrationReport','click','pageload','pageload','','ngOnInit');

    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    this.form = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });

    this.userDetails = this.auth.getUser();
    this.type = this.router.url.substring(1,this.router.url.length);
    if(this.type == "vendor-registration-report"){
      this.type = "VendorRegistrationReport"
    }
            this.common.setUserConfig(this.userDetails.ProfileType,this.type);
            this.common.getUserConfig$.subscribe(data => {
                this.userConfig = data;
            });
            this.getFilter();
            this.feildChooser()
            this.common.hubControlEvent('VendorRegistrationReport','click','pageloadend','pageloadend','','ngOnInit');

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
    this.common.hubControlEvent('VendorRegistrationReport','click','','',JSON.stringify(obj),'feildChooser');

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

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getFilter() {
    this.common.hubControlEvent('VendorRegistrationReport','click','','','','getFilter');

    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
  });
  this.common.getSearch$.subscribe(data => {
      this.search = data
  });
  this.common.getLoaderStatus$.subscribe(data => {
      // this.loader = data;
      if (data == false) {
          // this.getContacts()
          this.searchHawker()
      }
  });
  this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
  });
  }

  searchHawker() {
    this.loader = true;
    this.tabKey = [];
    this.tabValue = [];
    this.submittedForm = true;


    if (this.date.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          // invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("Select dates properly.",'error');
      return;
    }
    var mm = String(this.date.value._d.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = this.date.value._d.getFullYear();
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_vendor_registration_report',
        parameters: {
          Month:mm,
          Year: yyyy
        }
      }
    }
    this.common.hubControlEvent('VendorRegistrationReport','click','','',JSON.stringify(this.requestObj),'searchHawker');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        var tempRes = res.results.data;
        for (let data of tempRes) {
          var newObj = {
            "Sr No": '',
            "Active Registered Hawkers": data['Active Registered Hawkers'],
            "Hawkers With Outstanding Payment": data['Hawkers With Outstanding Payment'],
            "Month": data['Month'],
            "Open Applications": data['Open Applications']
          }
          this.tabValue.push(newObj);
        }

        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
        if (tempRes.length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      })
  }

  reset(){
    this.common.hubControlEvent('VendorRegistrationReport','click','','','','reset');

    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
    this.date.reset();
  }
}
