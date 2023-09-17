import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { MatDialog } from '@angular/material/dialog';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { regex,checkDates } from 'src/app/global/json-data';
import { AuthService } from 'src/app/global/auth.service';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-interaction-details',
  templateUrl: './interaction-details.component.html',
  styleUrls: ['./interaction-details.component.scss']
})
export class InteractionDetailsComponent implements OnInit {

  form: FormGroup;
  submittedForm: boolean = false;
  minDate = new Date();
  maxDate = new Date();
  loader: boolean = false;
  page: number = 1;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  itemsPerPage: number = 10;
  search: any;
  userDetails:any;

  constructor(
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private common: CommonService,
    private api: ApiService,
    public dialog: MatDialog,
    private auth:AuthService
  ) {
    Object.assign(this, { regex });
  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.form = this.formBuilder.group({
      fromDate: [moment(), Validators.required],
      toDate: [moment(), Validators.required]
    }, {
      validator: checkDates('fromDate', 'toDate')
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  reset(){
    this.form.reset();
    this.form.markAllAsTouched();
  }

  getData(){
    this.loader = true;
    this.page = 1
    this.submittedForm = true;

    if(this.form.invalid || this.form.value.fromDate > this.form.value.toDate){
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

    let a= (new Date( (this.form.value.fromDate?.toDate().getTime() + Math.abs((this.form.value.fromDate?.toDate().getTimezoneOffset()*60000))))).toISOString().slice(0, 10);
    let b= (new Date( (this.form.value.toDate?.toDate().getTime() + Math.abs((this.form.value.toDate?.toDate().getTimezoneOffset()*60000))))).toISOString().slice(0, 10)
    
    this.requestObj = {
      data: {
        spname: 'UNFYD_ADM_RPT_V1_INTERACTIONDETAILS',
        parameters: {
          FromDate: a,
          ToDate :b,
          ProcessId:this.userDetails.Processid,
          Flag:'SESSION_DATA'
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        this.tabValue = res.results.data;
        
        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
        if (this.tabValue.length == 0) {
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
        this.common.snackbar(error.message);
      })
  }

}
