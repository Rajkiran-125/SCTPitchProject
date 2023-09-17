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
import { Output, EventEmitter } from '@angular/core';

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
  selector: 'app-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss'],
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
export class MonthPickerComponent implements OnInit {
  date = new FormControl(moment(),Validators.required);
  @Output() newItemEvent = new EventEmitter<string>();

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);    
    datepicker.close();
  }
  loader: boolean = false;
  userDetails: any;
  requestObj1: any = {};
  tabKey: any = [];
  tabValue: any = [];
  tabKey1: any = [];
  tabValue1: any = [];
  noData: boolean = false;
  noData1: boolean = false;
  data: any;
  form: FormGroup;
  data1: any;
  form1: FormGroup;
  submittedForm: boolean = false;
  submittedForm1: boolean = false;
  paymentSearch: boolean = true
  vendorRegistration:boolean = true
  page: number = 1;
  itemsPerPage: number = 10;
  page1: number = 1;
  itemsPerPage1: number = 10;
  search: any;
  search1: any;
  minDate = new Date();
  maxDate = new Date();

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
  ) {
    Object.assign(this, { regex });
  }

  ngOnInit(): void {
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.form1 = this.formBuilder.group({
      month: [moment(), Validators.required]
    });
  }

  get f1(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }

  searchHawker1() {
    this.loader = true;
    this.tabKey1 = [];
    this.tabValue1 = [];
    this.submittedForm1 = true;
    // this.form1.value.month =  'ggg';
    var mm = String(this.date.value._d.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = this.date.value._d.getFullYear();

    if (this.date.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form1.controls)) {
        if (this.form1.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          // invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("Select dates properly.",'error');
      return;
    }

    this.requestObj1 = {
          Month:mm,
          Year: yyyy
    }
    this.newItemEvent.emit(this.requestObj1);

  }

  reset1(){
    this.form1.reset();
    this.date.setValue(moment())
    this.date.setErrors({'require':true})
    
  }

}
