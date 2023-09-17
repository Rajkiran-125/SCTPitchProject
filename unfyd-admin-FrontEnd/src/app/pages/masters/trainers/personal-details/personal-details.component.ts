import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, trainerFormSteps, regex } from 'src/app/global/json-data';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  commonObj: any;
  requestObj: any;
  editObj: any;
  generatedContactId: any;
  path: any;
  userType: any;
  masters: any;
  regex: any;
  trainerFormSteps: string[] = [];
  form: FormGroup;
  submittedForm = false;
  newDate = new Date();
  dobDate = new Date();
  countrylist: any;
  states: any;
  cities: any;

  constructor( 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
  ) {
      Object.assign(this, { masters, trainerFormSteps, regex });
  }

  ngOnInit(): void {

    this.getCountries('', 'Country');
    this.generateCustomId();
    this.getSnapShot();

    this.userDetails = this.auth.getUser();

    this.form = this.formBuilder.group({
      personalemail: ['', Validators.pattern(regex.email)],
      salutation: ['', Validators.required],
      firstname: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
      middlename: ['', Validators.pattern(regex.alphabet)],
      lastname: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
      mobilenumber: ['', [Validators.required, Validators.pattern(regex.mobile)]],
      alternatemobilenumber: ['', Validators.pattern(regex.mobile)],
      emergencycontactnumber: ['', Validators.pattern(regex.mobile)],
      emergencycontactname: ['', Validators.pattern(regex.alphabet)],
      relation: ['', Validators.required],
      landlinenumber: ['', Validators.pattern(regex.mobile)],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      religion: ['', Validators.required],
      maritalstatus: ['', Validators.nullValidator],
      dateofmarriage: ['', Validators.nullValidator],
      mothertongue: ['', Validators.nullValidator],
      languages: ['', Validators.nullValidator],
      countryid: ['', Validators.nullValidator],
      stateid: ['', Validators.nullValidator],
      cityid: ['', Validators.nullValidator],
      pincodeid: ['', Validators.nullValidator],
      addressline1: ['', Validators.nullValidator],
      addressline2: ['', Validators.nullValidator],
      addressline3: ['', Validators.nullValidator],
      currentaddress: ['', Validators.nullValidator],
      permanentaddress: ['', Validators.nullValidator],
      communicationaddress: ['', Validators.nullValidator],
      caste: ['', Validators.required],
      iscastecertificatesubmitted: [false, Validators.nullValidator],
      medicalhistory: ['', Validators.nullValidator],
      medicalhistoryifother: ['', Validators.nullValidator],
      isaadharcarduploaded: [false, Validators.nullValidator],
      ispancarduploaded: [false, Validators.nullValidator],
      ageproof: ['', Validators.nullValidator],
      passport: ['', Validators.pattern(regex.passport)],
      rationcard: ['', Validators.pattern(regex.rationCard)],
      drivinglicense: ['', Validators.pattern(regex.drivingLicence)],
      issignatureuploaded: [false, Validators.nullValidator],
      timezone: ['', Validators.nullValidator],
      nationality: ['', Validators.nullValidator],
      isphotographuploaded: [false, Validators.nullValidator],
      ishealthinsurancecheck: [false, Validators.nullValidator],
      bloodgroup: ['', Validators.nullValidator],
      addressprooftype: ['', Validators.nullValidator],
      covidvaccinationstatus: [false, Validators.nullValidator]
    });

    this.dobDate.setFullYear(this.dobDate.getFullYear() - 18);

  }

  getSnapShot() {

    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
    this.loader = true;

      this.requestObj = {
        "data": {
          spname: "usp_unfyd_trainer_personal",
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
          this.editObj = res.results.data[0];
          if (this.editObj) {
            const lowerObj = this.common.ConvertKeysToLowerCase();
            this.getStates(this.editObj.CountryID);
            this.getCities(this.editObj.StateID);
            this.form.patchValue(lowerObj(this.editObj));
            this.form.get('languages').setValue(this.editObj.Languages.split(',')),
            this.form.updateValueAndValidity();
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
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  submit(btnType): void {
    this.loader = true;

    this.submittedForm = true;
    if (this.form.invalid) {
      this.loader = false;
      this.common.snackbar("Please fill form carefully", "error");
      return;
    }

    this.commonObj = {
      processid: this.userDetails.Processid,
      productid: 1,
      id: this.path !== null ? this.editObj.Id : '',
      contactid: this.path !== null ? this.editObj.ContactID : this.generatedContactId,
      userid: this.userDetails.EmployeeId,
      usertype: this.userType,
      usersubtype: '',
      roletype: 'trainer',
      status: 'PA',
      publicip: this.userDetails.ip,
      privateip: '',
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version
    }

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_trainer_personal",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.EmployeeId,
          ...this.form.value,
          ...this.commonObj,
          languages: this.form.get('languages').value.toString()
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        if (btnType == 'next') {
          this.router.navigate(['masters/trainers/social-details', this.commonObj.contactid]);
        } else if (btnType == 'save') {
          this.router.navigate(['masters/trainers/personal-details', this.commonObj.contactid]);
        }

        this.common.snackbar(res.results.data[0].result, "success");
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      })
  }

  generateCustomId() {
    let Obj = {
      data: {
        prefix: "trainers"
      }
    }
    this.api.post('getcustomid', Obj).subscribe((res) => {
      if (res.code == 200) {
        this.generatedContactId = res.results.data[0].Result;
        this.userType = res.results.data[0].RoleType;
      }
    })
  }

  getCountries(event, type) {
    this.countrylist = [];
    this.common.getLocation(event, type).subscribe(res => {
      this.countrylist = res;
    })
  }

  getStates(event) {
    let Obj = {
      flag: "STATES",
      countryid: event,
      stateid: "",
      cityid: ""
    }
    this.api.postMaster('GetLocationDetails', Obj).subscribe((res) => {
      this.states = res
    })
  }

  getCities(event) {
    let Obj = {
      flag: "CITIES",
      countryid: "",
      stateid: event,
      cityid: ""
    }
    this.api.postMaster('GetLocationDetails', Obj).subscribe((res) => {
      this.cities = res
    })
  }

  marriageStatus(status){
    if(status == 'Married'){
      this.form.controls['dateofmarriage'].setValidators(Validators.required);
      this.form.controls['dateofmarriage'].setValue('');
    } else {
      this.form.controls['dateofmarriage'].setValidators(Validators.nullValidator);
      this.form.controls['dateofmarriage'].setValue('');
    }
    this.form.updateValueAndValidity();
  }

}
