import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex } from 'src/app/global/json-data';
import * as _moment from 'moment';
import { Output, EventEmitter } from '@angular/core';

import {default as _rollupMoment, Moment} from 'moment';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-full-date-picker',
  templateUrl: './full-date-picker.component.html',
  styleUrls: ['./full-date-picker.component.scss']
})
export class FullDatePickerComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();

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
  today = new Date();
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

    this.form = this.formBuilder.group({
      fromDate: [moment(), Validators.required],
      toDate: [moment(), Validators.required]
    });
    this.getFilter();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getFilter() {
    this.common.getItemsPerPage$.subscribe(getItemsPerPage => {
      this.itemsPerPage = getItemsPerPage
    });
    this.common.getSearch$.subscribe(getSearch => {
      this.search = getSearch
    });
  }

  

  searchHawker() {
    let a:any;
    let b:any;
    if(this.form.value.fromDate != null || this.form.value.toDate != null){
      a= (new Date( (this.form.value.fromDate?.toDate().getTime() + Math.abs((this.form.value.fromDate?.toDate().getTimezoneOffset()*60000))))).toISOString().slice(0, 10);
      b= (new Date( (this.form.value.toDate?.toDate().getTime() + Math.abs((this.form.value.toDate?.toDate().getTimezoneOffset()*60000))))).toISOString().slice(0, 10)
    }
    
    this.loader = true;
    this.tabKey = [];
    this.tabValue = [];
    this.page = 1
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
      this.common.snackbar("Select dates properly.",'error');
      return;
    }

    this.requestObj = {
          FromDate: a,
          ToDate :b
    }
    this.newItemEvent.emit(this.requestObj);
  }

  reset(){
    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
  }
}