import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex } from 'src/app/global/json-data';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { Router } from '@angular/router';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-report-vkyc-interaction-details',
  templateUrl: './report-vkyc-interaction-details.component.html',
  styleUrls: ['./report-vkyc-interaction-details.component.scss']
})
export class ReportVkycInteractionDetailsComponent implements OnInit {
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
shake = false;
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
  this.minDate.setFullYear(this.minDate.getFullYear() - 60);
  this.maxDate.setFullYear(this.maxDate.getFullYear());

  this.form = this.formBuilder.group({
    fromDate: [moment(), Validators.required],
    toDate: [moment(), Validators.required]
  });
  this.userDetails = this.auth.getUser();
  this.type = this.router.url.substring(1,this.router.url.length);
  if(this.type == 'vkyc-interaction-details-report'){
    this.type = "VKYCInteractionDetailsReport"
  }
          this.common.setUserConfig(this.userDetails.ProfileType,this.type);
          this.common.getUserConfig$.subscribe(data => {
              this.userConfig = data;
          });

this.getFilter();
this.feildChooser()
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

get f(): { [key: string]: AbstractControl } {
  return this.form.controls;
}

getFilter() {
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
    this.finalField = data
});
}



searchHawker() {
  this.loader = true;
  this.tabKey = [];
  this.tabValue = [];
  this.page = 1
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
    this.common.snackbar("Select dates properly.",'error');
    return;
  } else if (this.form.value.fromDate > this.form.value.toDate && this.form.value.fromDate != this.form.value.toDate) {
    this.loader = false;
    this.common.snackbar("FromDate cannot be greater than ToDate.",'error');
    return;
  }
  let a= (new Date( (this.form.value.fromDate?.toDate().getTime() + Math.abs((this.form.value.fromDate?.toDate().getTimezoneOffset()*60000))))).toISOString().slice(0, 10);
  let b= (new Date( (this.form.value.toDate?.toDate().getTime() + Math.abs((this.form.value.toDate?.toDate().getTimezoneOffset()*60000))))).toISOString().slice(0, 10)

  this.requestObj = {
    data: {
      // spname: 'UNFYD_ADM_RPT_V1_KYC_INTERACTIONDETAILS',
      parameters: {
        FromDate: a,
        ToDate :b
      }
    }
  }
  this.api.post('index', this.requestObj).subscribe(res => {
    this.loader = false;
    if (res.code == 200) {
      this.loader = false;
      var tempRes = res.results.data

      for (let data of tempRes) {
        var newObj = {
          "Sr No": '',
          ...data
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
  this.tabKey = [];
  this.tabValue = [];
  this.form.reset();
this.submittedForm = false;
}
}
