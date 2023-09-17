import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, hawkerFormSteps, regex } from 'src/app/global/json-data';
import { Location } from '@angular/common'

@Component({
  selector: 'app-other-details',
  templateUrl: './other-details.component.html',
  styleUrls: ['./other-details.component.scss']
})
export class OtherDetailsComponent implements OnInit {
  loader: boolean = false;
  editObj: any;
  commonObj: any;
  userDetails: any;
  path: any;
  masters: any;
  hawkerFormSteps: string[] = [];
  form: FormGroup;
  submittedForm : boolean = false;
  requestObj: any;
  batchList : any = [];
  unionList : any = [];
  tabkey : any = [];
  minDate = new Date();
  maxDate = new Date();
  userConfig: any;
  masterConfig: any;
  isappapprovalstatus : boolean;
  isregNo : boolean;
  labelName: any;
  reset : boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location
  ) {
    Object.assign(this, { masters, hawkerFormSteps, regex });
  }

  ngOnInit(): void {
    this.getSnapShot();
    this.getBatch();
    this.getUnion();
    this.form = this.formBuilder.group({
      productsservices : ['', Validators.nullValidator] ,
      coachtrainoperatingstn : ['', Validators.nullValidator] ,
      batchid : ['', Validators.nullValidator] ,
      refferdby : ['', Validators.nullValidator] ,
      bgverificationstatus :  ['', Validators.nullValidator] ,
      appsubmissiondatetoadmin : ['', Validators.nullValidator] ,
      appsubmittedtocontact : ['', Validators.nullValidator] ,
      appapprovalstatusfromadmin : ['', Validators.nullValidator] ,
      appapprovaldatebyadmin : ['', Validators.nullValidator] ,
      registrationlocation : ['', Validators.nullValidator] ,
      registrationno : ['', Validators.nullValidator] ,
      lifeinsurancestatus : ['', Validators.nullValidator] ,
      idcardreceipt : ['', Validators.nullValidator] ,
      uniformreceipt : ['', Validators.nullValidator] ,
      receiptdate : ['', Validators.nullValidator] ,
      policynumber: ['', Validators.nullValidator] ,
      policyprovider: ['', Validators.nullValidator] ,
      coverdetails: ['', Validators.nullValidator] ,
      fromdate: ['', Validators.nullValidator] ,
      todate: ['', Validators.nullValidator] ,
    });
      
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }

  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'HawkerOtherDetails', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
    this.common.setHawkerId(this.path)
  }
  
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');

    this.common.setUserConfig(this.userDetails.ProfileType, 'beneficiary');
    this.common.getUserConfig$.subscribe(data => {
      this.userConfig = data
      if(!this.userConfig.Other){
        // this.router.navigate(['masters/beneficiary/payment', this.path]);
      }
    });

    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
    this.masterConfig = {
      bgVerificationStatus : JSON.parse(data.BGVerificationStatus),
      applicantStatus : JSON.parse(data.ApplicantStatus),
    }
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_other",
          parameters: {
            flag: 'EDIT',
            hawkerid: this.path
          }
        }
      }
      this.api.post('index', this.requestObj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.loader = false;
          this.editObj = res.results.data[0];
          if (this.editObj) {
            const lowerObj = this.common.ConvertKeysToLowerCase();
            this.form.patchValue(lowerObj(this.editObj));
            this.form.get('appsubmissiondatetoadmin').setValue(this.formatDate(this.editObj.AppSubmissionDateToAdmin));
            this.form.get('receiptdate').setValue(this.formatDate(this.editObj.ReceiptDate));
            this.form.get('uniformreceipt').setValue(this.formatDate(this.editObj.UniformReceipt));
            if(this.editObj.FromDate !== '' || this.editObj.ToDate !== ''){
              this.form.get('fromdate').setValue(this.formatDate(this.editObj.FromDate));
              this.form.get('todate').setValue(this.formatDate(this.editObj.ToDate));
            } 
            if(this.editObj.RegistrationStatus == 'Active'){
              this.form.get('appapprovaldatebyadmin').setValue(this.formatDate(this.editObj.AppApprovalDateByAdmin));
            }
            this.form.get('appapprovalstatusfromadmin').setValue(this.editObj.RegistrationStatus);
            this.lifeinsurance(this.editObj.LifeInsuranceStatus)            
            this.form.updateValueAndValidity();
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
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  submit(btnType): void {
    this.loader = true;

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
      this.form.markAllAsTouched()
      this.common.snackbar("General Error");
      return;
    }
    if (this.editObj !== undefined) {
      this.commonObj = {
        flag: 'UPDATE',
        usersubtype: '',
        modifiedby: this.userDetails.Id,
        hawkerid: this.editObj.HawkerID
      }
    } else {
      this.commonObj = {
        flag: 'INSERT',
        hawkerid: this.path,
        roletype: 'hawker',
        processid: this.userDetails.Processid,
        productid: 1,
        userid: this.userDetails.Id,
        usersubtype: '',
        createdby: this.userDetails.Id,
        publicip: this.userDetails.ip,
        privateip: '',
        browsername: this.userDetails.browser,
        browserversion: this.userDetails.browser_version
      }
    }
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_haw_other",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.Id,
          ...this.form.value,
          ...this.commonObj
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        if (btnType == 'next') {
          this.router.navigate(['masters/beneficiary/details/payment', this.commonObj.hawkerid]);
        } else if (btnType == 'save') {
          this.router.navigate(['masters/beneficiary/other-details', this.commonObj.hawkerid]);
        }
        this.common.snackbar("Success");
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }

  lifeinsurancefieldsStatus : any;
  lifeinsurance(event){
this.lifeinsurancefieldsStatus = event == 'Active' || event == 1 ? true : false
  }
  getBatch(){
    this.loader = true;
   let  Obj = {
      data: {
        spname: "usp_unfyd_batch",
        parameters: {
          flag: 'EDIT',
          processid: this.userDetails.Processid,
          productid: 1
        }
      }
    }
    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.batchList = res.results.data;
      }
    })
  }


  getUnion(){
    this.loader = true;
   let  Obj = {
      data: {
        spname: "usp_unfyd_union",
        parameters: {
          flag: 'GET',
          processid: this.userDetails.Processid,
          productid: 1
        }
      }
    }
    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.unionList = res.results.data;
      }
    })
  }

  back(): void {
    this.location.back()
  }
}
