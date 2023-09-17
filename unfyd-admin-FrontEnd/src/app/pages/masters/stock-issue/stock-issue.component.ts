import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex } from 'src/app/global/json-data';
import { Location } from '@angular/common'

@Component({
  selector: 'app-stock-issue',
  templateUrl: './stock-issue.component.html',
  styleUrls: ['./stock-issue.component.scss']
})
export class StockIssueComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  submittedForm: boolean = false;
  stockSearch : boolean = true;
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  labelName: any;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private location: Location,
  ) {
    Object.assign(this, { regex });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('StockIssue','click','pageload','pageload','','ngOnInit');

    this.form = this.formBuilder.group({
      hawkerid: [null, Validators.nullValidator],
      registrationno: [null, Validators.nullValidator],
      firstname: [null, Validators.nullValidator],
      middlename: [null, Validators.nullValidator],
      lastname: [null, Validators.nullValidator],
      mobilenumber: [null, Validators.nullValidator]
    });
    this.getSnapShot();
    this.getFilter();
    this.common.hubControlEvent('StockIssue','click','pageloadend','pageloadend','','ngOnInit');

  }

  back(): void {
    this.location.back()
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('StockIssue','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'StockIssue', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }

  getSnapShot() {
    this.common.hubControlEvent('StockIssue','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.common.closeComponent()
    this.common.openComponent$.subscribe(openComponent => {
        this.stockSearch = openComponent
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }

  searchHawker() {
    this.loader = true;
    this.tabKey = [];
    this.tabValue = [];
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
    this.common.hubControlEvent('StockIssue','click','','',JSON.stringify(this.requestObj),'searchHawker');

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
            "First Name": data['First Name'],
            "Middle Name": data['Middle Name'],
            "Last Name": data['Last Name'],
            "Mobile No.": data['MobileNo'],
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
        this.common.snackbar("General Error");
      })
  }

  reset(){
    this.common.hubControlEvent('StockIssue','click','','','','reset');

    this.tabKey = [];
    this.tabValue = [];
  }

  openDialog(data) {
    this.common.hubControlEvent('StockIssue','click','','',JSON.stringify(data),'openDialog');

    this.stockSearch = false;
    this.data = {
      display: true,
      contactid: data['Applicant No.'],
      registration: data['Registration No.'],
      hawkerfirstname: data['First Name'],
      hawkermiddlename: data['Middle Name'],
      hawkerlastname: data['Last Name'],
      mobileNo: data['Mobile No.'],
      UniformSize: data['UniformSize'],
    }
  }

  getFilter() {
    this.common.hubControlEvent('StockIssue','click','','','','getFilter');

    this.common.getItemsPerPage$.subscribe(getItemsPerPage => {
      this.itemsPerPage = getItemsPerPage
    });
    this.common.getSearch$.subscribe(getSearch => {
      this.search = getSearch
    });
  }

}
