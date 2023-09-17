import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, employeeFormSteps, regex } from 'src/app/global/json-data';

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
  createuserObj: any;
  generatedContactId: any;
  path: any;
  userType: any;
  masters: any;
  regex: any;
  employeeFormSteps: string[] = [];
  form: FormGroup;
  submittedForm = false;
  newDate = new Date();
  dobDate = new Date();
  countrylist: any;
  zipcodes: any = [];
  states: any = [];
  district: any = [];
  filteredstates = this.states.slice();
  filtereddistrict = this.district.slice();
  filtereddzipcodes = this.zipcodes.slice();
  masterConfig: any;
  casteCertificate: any = '';
  aadharCard : any = '';
  panCard : any = '';
  signature : any = '';
  photo : any = '';
  healthinsurance : any = '';
  covidCertificate : any = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
  ) {
    Object.assign(this, { masters, employeeFormSteps, regex });
  }

  ngOnInit(): void {

    this.getCountries('', 'Country');
    this.generateCustomId();
    this.getSnapShot();



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
      dateofmarriage: [null, Validators.nullValidator],
      mothertongue: ['', Validators.nullValidator],
      languages: ['', Validators.nullValidator],
      countryid: ['', Validators.required],
      stateid: ['', Validators.required],
      districtid: ['', Validators.required],
      pincodeid: ['', Validators.required],
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

    this.common.getIndividualUpload$.subscribe(res => {
      if (res.category == 'Caste Certificate') {
        this.form.get('iscastecertificatesubmitted').setValue(res.status == false ? false : true);
        this.casteCertificate = res;
      }
      if (res.category == 'Aadhar Card') {
        this.form.get('isaadharcarduploaded').setValue(res.status == false ? false : true);
        this.aadharCard = res;
      }
      if (res.category == 'PanCard') {
        this.form.get('ispancarduploaded').setValue(res.status == false ? false : true);
        this.panCard = res;
      }
      if (res.category == 'Signature') {
        this.form.get('issignatureuploaded').setValue(res.status == false ? false : true);
        this.signature = res;
      }
      if (res.category == 'Photograpgh') {
        this.form.get('isphotographuploaded').setValue(res.status == false ? false : true);
        this.photo = res;
      }
      if (res.category == 'Health Insurance') {
        this.form.get('ishealthinsurancecheck').setValue(res.status == false ? false : true);
        this.healthinsurance = res;
      }
      if (res.category == 'Covid Vaccination Certificate') {
        this.form.get('covidvaccinationstatus').setValue(res.status == false ? false : true);
        this.covidCertificate = res;
      }
      this.form.updateValueAndValidity();
    })
  }

  viewDocument(val, type) {
    var data = {
      type: type,
      processid: this.userDetails.Processid,
      category: val,
      contactid: this.editObj !== undefined ? this.path : this.generatedContactId,
    }
    this.common.setSingleImageEmp(data)
  }

  config: any;
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      this.common.setUserConfig(this.userDetails.EmployeeId, 'employee');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.masterConfig = {
        salutation: JSON.parse(data.Salutation),
        gender: JSON.parse(data.Gender),
        nationality: JSON.parse(data.Nationality),
        religion: JSON.parse(data.Religion),
        caste: JSON.parse(data.Caste),
        educationLevel: JSON.parse(data.EducationLevel),
        bloodGroup: JSON.parse(data.BloodGroup),
        languages: JSON.parse(data.KnownLanguages),
        maritalStatus: JSON.parse(data.MaritalStatus),
        uniformSize: JSON.parse(data.UniformSize),
        dateformat: data.dateformat,
      }
      this.form.get('nationality').setValue(this.masterConfig?.nationality[0].Key);
    }
    );

    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        "data": {
          spname: "usp_unfyd_emp_personal",
          parameters: {
            flag: 'EDIT',
            processid: this.userDetails.Processid,
            productid: 1,
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
            this.getDistrict(this.editObj.StateID);
            this.getZipcodes(this.editObj.DistrictID);
            this.form.patchValue(lowerObj(this.editObj));
            this.form.get('languages').patchValue(this.editObj.Languages.split(','));
            if(this.editObj.DOB!=null && this.editObj.DOB!='')
            {
              this.form.get('dob').setValue(this.formatDate(this.editObj.DOB));
            }
            if(this.editObj.DateOfMarriage!=null && this.editObj.DateOfMarriage!='')
            {
              this.form.get('dateofmarriage').setValue(this.formatDate(this.editObj.DateOfMarriage));
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

  getsalutation(event) {
    let gender = this.masterConfig?.gender;
    let salutation = this.masterConfig?.salutation;
    let findGender = event == salutation[0].Key ? gender[0].Key : event == salutation[1].Key ? gender[1].Key : event == salutation[2].Key ? gender[1].Key : '';
    this.form.get('gender').setValue(findGender)
  }

  getGender(event) {
    let gender = this.masterConfig?.gender;
    let salutation = this.masterConfig?.salutation;
    let findSalutation = event == gender[0].Key ? salutation[0].Key : event == gender[1].Key ? salutation[1].Key : event == gender[2].Key ? salutation[0].Key : '';
    this.form.get('salutation').setValue(findSalutation)
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
      processid: this.userDetails.Processid,
      productid: 1,
      id: this.path !== null ? this.editObj.Id : '',
      contactid: this.path !== null ? this.editObj.ContactID : this.generatedContactId,
      userid: this.userDetails.EmployeeId,
      usertype: this.userType,
      usersubtype: '',
      roletype: 'employee',
      status: 'PA',
      publicip: this.userDetails.ip,
      privateip: '',
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version
    }

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_emp_personal",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.Id,
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
          this.createUser();
          this.router.navigate(['masters/employee/social-details', this.commonObj.contactid]);
        } else if (btnType == 'save') {
          this.createUser();
          this.router.navigate(['masters/employee/personal-details', this.commonObj.contactid]);
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

  uploadDocument(event, imgData, category) {
    var data = {
      flag: imgData !== '' ? 'UPDATE' : 'INSERT',
      documentId: imgData.Actionable,
      category: category,
      createdby: imgData !== '' ? imgData['Created By'] : this.userDetails.Id,
      modifiedby: imgData !== '' ? this.userDetails.Id : null,
      contactid: this.editObj !== undefined ? this.editObj.ContactID : this.generatedContactId,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUploadEmp(data)
    }
  }

  generateCustomId() {
    let Obj = {
      data: {
        prefix: "employee"
      }
    }
    this.api.post('getcustomid', Obj).subscribe(res => {
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
    this.common.getLocation(event, 'State').subscribe(res => {
      this.states = res;
      this.filteredstates = res;
    });
  }

  getDistrict(event) {
    this.common.getLocation(event, 'District').subscribe(res => {
      this.district = res;
      this.filtereddistrict = res;
    })
  }


  getZipcodes(event) {
    this.common.getLocation(event, 'Pincode').subscribe(res => {
      this.zipcodes = res;
      this.filtereddzipcodes = res;
    })
  }

  marriageStatus(status) {
    if (status == 'Married') {
      this.form.controls['dateofmarriage'].setValidators(Validators.required);
      this.form.controls['dateofmarriage'].setValue('');
    } else {
      this.form.controls['dateofmarriage'].setValidators(Validators.nullValidator);
      this.form.controls['dateofmarriage'].setValue('');
    }
    this.form.updateValueAndValidity();
  }

  createUser() {
    this.createuserObj = {
      "data": {
        "spname": "usp_unfyd_adm_users",
        "parameters": {
          flag: "INSERTUSER",
          createdby: this.userDetails.EmployeeId,
          username: this.generatedContactId,
          firstname: this.form.controls['firstname'].value,
          lastname: this.form.controls['lastname'].value,
          emailid: this.form.controls['personalemail'].value !== undefined ? this.form.controls['personalemail'].value : "",
          contactnumber: this.form.controls['mobilenumber'].value,
          capacity: 1,
          skillsmap: "",
          groupid: "",
          channelid: "",
          profileid: 1,
          profiletypeid: 13,
          languagecode: "en",
          locationid: "",
          productid: 2,
          employeeid: this.generatedContactId,
          agentid: "",
          password: this.common.setEncrypted('123456$#@$^@1ERF', 'Smart@123'),
          port: "",
          channelwisecapacity: "",
          ip: "",
          processid: this.userDetails.Processid,
          publicip: this.userDetails.ip,
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
          id: ""
        }
      }
    }
    this.api.post('index', this.createuserObj).subscribe(res => {
      if (res.code == 200) {
      }
    })
  }
}
