import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { employeeFormSteps, regex, masters } from 'src/app/global/json-data';

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
  employeeFormSteps: string[] = [];
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  masters:any;
  userConfig:any;
  medTestReport : any = '';
  pccReport : any = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private el: ElementRef,
    private api: ApiService
  ) {
    Object.assign(this, { employeeFormSteps, regex, masters });
  }

  ngOnInit(): void {

   

    this.userDetails = this.auth.getUser();
    this.getSnapShot();
    this.form = this.formBuilder.group({
      medtestinitiationdate: ['', Validators.nullValidator],
      medteststatus: ['', Validators.nullValidator],
      medtestresultdate: ['', Validators.nullValidator],
      ismedtestreportuploaded: [false, Validators.nullValidator],
      verificationinitiationdate: ['', Validators.nullValidator],
      policeverificationstatus: ['', Validators.nullValidator],
      ispoliceclearanceattached: [false, Validators.nullValidator],
      undertakingifapplicable: ['', Validators.nullValidator],
      pfuandetailsifapplicable: ['', Validators.nullValidator],
    });

    this.common.getIndividualUpload$.subscribe(res => {
      if (res.category == 'Medical Test Report') {
        this.form.get('ismedtestreportuploaded').setValue(res.status == false ? false : true);
        this.medTestReport = res;
      }
      if (res.category == 'Pcc Clearance Report') {
        this.form.get('ispoliceclearanceattached').setValue(res.status == false ? false : true);
        this.pccReport = res;
      }
      this.form.updateValueAndValidity();
    })

  }

  uploadDocument(event, imgData, category) {
    var data = {
      flag: imgData !== '' ? 'UPDATE' : 'INSERT',
      documentId: imgData.Actionable,
      category: category,
      createdby: imgData !== '' ? imgData['Created By'] : this.userDetails.Id,
      modifiedby: imgData !== '' ? this.userDetails.Id : null,
      contactid: this.path,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUploadEmp(data)
    }
  }

  viewDocument(val, type) {
    var data = {
      type: type,
      processid: this.userDetails.Processid,
      category: val,
      contactid:this.path,
    }
    this.common.setSingleImageEmp(data)
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

  getSnapShot() {
    this.common.setUserConfig(this.userDetails.ProfileId, 'hawker');
      this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
      });
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_emp_other",
          parameters: {
            flag: 'EDIT',
            contactid: this.path
          }
        }
      }

      this.api.post('index', this.requestObj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          this.editObj = res.results.data[0]
          if (this.editObj) {
            const lowerObj = this.common.ConvertKeysToLowerCase();
            this.form.patchValue(lowerObj(this.editObj));
            if(this.editObj.MedTestInitiationDate!=null && this.editObj.MedTestInitiationDate!='')
            {
              this.form.get('medtestinitiationdate').setValue(this.formatDate(this.editObj.MedTestInitiationDate));
            }
            if(this.editObj.MedTestResultDate!=null && this.editObj.MedTestResultDate!='')
            {
              this.form.get('medtestresultdate').setValue(this.formatDate(this.editObj.MedTestResultDate));
            }
            if(this.editObj.VerificationInitiationDate!=null && this.editObj.VerificationInitiationDate!='')
            {
              this.form.get('verificationinitiationdate').setValue(this.formatDate(this.editObj.VerificationInitiationDate));
            }
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
      this.common.snackbar("General Error");
      return;
    }

    this.commonObj = {
      id: this.editObj !== undefined ? this.editObj.Id : '',
      contactid: this.editObj !== undefined ? this.editObj.ContactID : this.path,
      userid: this.userDetails.Id,
      modifiedby: this.userDetails.Id,
      publicip: this.userDetails.ip,
      privateip: '',
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version
    }

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_emp_other",
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
          this.router.navigate(['masters/employee/details/kyc', this.commonObj.contactid]);
        } else if (btnType == 'save') {
          this.router.navigate(['masters/employee/other-details', this.commonObj.contactid]);
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
}
