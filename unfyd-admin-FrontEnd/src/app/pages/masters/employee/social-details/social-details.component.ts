import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { employeeFormSteps, regex , masters} from 'src/app/global/json-data';

@Component({
  selector: 'app-social-details',
  templateUrl: './social-details.component.html',
  styleUrls: ['./social-details.component.scss']
})
export class SocialDetailsComponent implements OnInit {
  loader: boolean = false;
  editObj: any;
  commonObj: any;
  userDetails: any;
  path: any;
  employeeFormSteps: string[] = [];
  form: FormGroup;
  submittedForm = false;
  requestObj: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private el: ElementRef,
    private api: ApiService
  ) {
    Object.assign(this, { employeeFormSteps, regex ,masters});
  }

  ngOnInit(): void {

    this.getSnapShot();

    this.userDetails = this.auth.getUser();

    this.form = this.formBuilder.group({
      whatsappnumber: ['', Validators.pattern(regex.mobile)],
      authorisingwhatsapp: [false, Validators.nullValidator],
      facebookid: ['', Validators.nullValidator],
      twitterhandle: ['', Validators.nullValidator],
      linkedin: ['', Validators.nullValidator],
      skype: ['', Validators.nullValidator],
      instagram: ['', Validators.nullValidator]
    });


  }

  getSnapShot() {
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_emp_social",
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
      userid: this.userDetails.EmployeeId,
      modifiedby: this.userDetails.EmployeeId,
      publicip: this.userDetails.ip,
      privateip: '',
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version
    }

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_emp_social",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.EmployeeId,
          ...this.form.value,
          ...this.commonObj
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        if (btnType == 'next') {
          this.router.navigate(['masters/employee/bank-details', this.commonObj.contactid]);
        } else if (btnType == 'save') {
          this.router.navigate(['masters/employee/social-details', this.commonObj.contactid]);
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
