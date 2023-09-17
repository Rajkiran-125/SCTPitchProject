import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex, paymentCollection,checkDates } from 'src/app/global/json-data';
import { ActivatedRoute } from '@angular/router';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-payment-collection',
  templateUrl: './payment-collection.component.html',
  styleUrls: ['./payment-collection.component.scss']
})
export class PaymentCollectionComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  submittedForm: boolean = false;
  paymentSearch : boolean = true;
  paymentCollection:any;
  path:any;
  tabSelected:any
  tab:any;
  configData:any;
  showPaymentCollectionTab=false;
  showCollectionSummaryTab=false;
  minDate = new Date();
  maxDate = new Date();

  constructor(
    
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute
  ) {
    Object.assign(this, { regex,paymentCollection });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('PaymentCollection','click','pageload','pageload','','ngOnInit');

    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.tabSelected = paymentCollection[0].label

this.userDetails = this.auth.getUser();
// this.activatedRoute.url.subscribe(url => {
  this.common.setUserConfig(this.userDetails.ProfileType, 'PaymentCollection');
  this.common.getUserConfig$.subscribe(data => {
    this.configData = data;
    if(('CollectionSummaryTab' in this.configData)){
      if(!this.configData.CollectionSummaryTab) this.showCollectionSummaryTab = false;
      if(this.configData.CollectionSummaryTab) this.showCollectionSummaryTab = true;
    }
    if(('PaymentCollectionTab' in this.configData)){
     if(!this.configData.PaymentCollectionTab) {
       this.tabSelected = paymentCollection[1].label
       this.showPaymentCollectionTab = false;
     }
     if(this.configData.PaymentCollectionTab) this.showPaymentCollectionTab = true;
   }
  });
// })

    this.form = this.formBuilder.group({
      hawkerid: [null, Validators.nullValidator],
      registrationno: [null, Validators.nullValidator],
      firstname: [null, Validators.nullValidator],
      middlename: [null, Validators.nullValidator],
      lastname: [null, Validators.nullValidator],
      mobilenumber: [null, Validators.nullValidator],
      fromDate: [moment(), Validators.nullValidator],
      toDate: [moment(), Validators.nullValidator]
    },{
      validator: checkDates('fromDate','toDate'),
    });
    this.getSnapShot();
    this.getFilter();
    this.searchHawker()
    this.common.hubControlEvent('PaymentCollection','click','pageloadend','pageloadend','','ngOnInit');

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getSnapShot() {
    this.common.hubControlEvent('PaymentCollection','click','','','','getSnapShot');

    this.common.closeComponent()

    this.common.openComponent$.subscribe(openComponent => {
        this.paymentSearch = openComponent;
        this.reset()
    })
  }


  searchHawker() {
    this.loader = true;
    this.tabKey = [];
    this.tabValue = [];
    this.submittedForm = true;
    if(this.form.value.fromDate != null && this.form.value.toDate == null){
      this.loader = false;
      this.common.snackbar("To Date error");
     
      return;
    }
    if(this.form.value.fromDate == null && this.form.value.toDate != null){
      this.loader = false;
      this.common.snackbar("From Date error");
     
      return;
    }
    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("General Error");
    
      return;
    }

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_haw_personal',
        parameters: {
          flag: 'GET_FOR_FINANCE',
          processid: this.userDetails.Processid,
          productid: 1,
          ...this.form.value,
        }
      }
    }
    this.common.hubControlEvent('PaymentCollection','click','','',JSON.stringify(this.requestObj),'searchHawker');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        var tempRes = res.results.data
      
        for (let data of tempRes) {
          var newObj = {
            "Sr No": '',
            "Applicant No.": data['Applicant Id'],
            "Registration No.": data['Registration No'],
            "Registration Status": data['RegistrationStatus'],
            "First Name": data['First Name'],
            "Middle Name": data['Middle Name'],
            "Last Name": data['Last Name'],
            "Mobile No.": data['MobileNo'],
            "Discount": data['Discount'],
            "Action": data['DiscountStatus'],
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
        this.common.snackbar("General Errror");
      })
  }

  reset(){
    this.common.hubControlEvent('PaymentCollection','click','','','','reset');

    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
  }

  openComponent(data) {
    this.common.hubControlEvent('PaymentCollection','click','','',JSON.stringify(data),'openComponent');

    this.paymentSearch = false;
    this.data = {
      display: true,
      contactid: data['Applicant No.'],
      registation: data['Registration No.'],
      RegistrationStatus: data['Registration Status'],
      hawkerfirstname: data['First Name'],
      hawkermiddlename: data['Middle Name'],
      hawkerlastname: data['Last Name'],
      mobileNo: data['Mobile No.'],
      uniformsize: data['UniformSize'],
    }
  }

  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  getFilter() {
    this.common.getItemsPerPage$.subscribe(getItemsPerPage => {
      this.itemsPerPage = getItemsPerPage
    });
    this.common.getSearch$.subscribe(getSearch => {
      this.search = getSearch
    });
  }

  applyDiscount(data) {
    this.common.hubControlEvent('PaymentCollection','click','','',JSON.stringify(data),'applyDiscount');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'discount',
        application: data['Applicant No.'],
        firstname: data['First Name'],
        middlename: data['Middle Name'],
        lastname: data['Lastdle Name'],
        mobileno: data['Mobile No.'],
        userDetails: this.userDetails
      },
      width: '380px'

    });
    dialogRef.afterClosed().subscribe(status => {
      this.searchHawker()
    });
  }

  changeTab(val){
    this.common.hubControlEvent('PaymentCollection','click','','',JSON.stringify(val),'changeTab');

    this.tabSelected = val
  }

}
