import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, hawkerFormSteps, regex } from 'src/app/global/json-data';
import { MatDialog } from '@angular/material/dialog';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { DatePipe, Location } from '@angular/common'

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
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
  hawkerFormSteps: string[] = [];
  form: FormGroup;
  submittedForm: boolean = false;
  currentDate = this.formatDate(new Date());
  currentDateReadonly: boolean = false;
  minDate = new Date();
  maxDate = new Date();
  lastYear = new Date();
  isDsableSpeciallyAbled: boolean;
  isDsablecovid: boolean;
  userConfig: any;
  masterConfig: any;
  viewSpeciallyAbled = false;
  viewCovidVax = false;
  category: any
  labelName: any;
  profileImg: any = null;
  profileDocument: any = '';
  abledDocument: any = '';
  covidDocument: any = '';
  reset : boolean = false;  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private el: ElementRef,
    private api: ApiService,
    public dialog: MatDialog,
    private location: Location,
    public datepipe: DatePipe
  ) {
    Object.assign(this, { masters, hawkerFormSteps, regex });
  }

  ngOnInit(): void {
    this.getSnapShot();
    this.form = this.formBuilder.group({
      photographstatus: [false, Validators.requiredTrue],
      applicationdate: [new Date(), Validators.nullValidator],
      salutation: ['', Validators.required],
      firstname: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(30)]],
      middlename: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(30)]],
      lastname: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(30)]],
      relativeof: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      religion: ['', Validators.required],
      caste: ['', Validators.required],
      languagesknown: ['', Validators.required],
      mothertongue: ['', Validators.required],
      educationqual: ['', Validators.required],
      maritalstatus: ['', Validators.nullValidator],
      nationality: ['', Validators.nullValidator],
      bloodgroup: ['', Validators.nullValidator],
      speciallyabled: [false, Validators.nullValidator],
      covidvaxcertificatestatus: [false, Validators.nullValidator],
      // signaturestatus: ['', Validators.nullValidator],
      uniformsize: ['', Validators.nullValidator],
      relativename: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
    });
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.lastYear.setFullYear(this.lastYear.getFullYear() - 1);
    // this.closePopupReset();
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
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.common.setUserConfig(this.userDetails.ProfileType, 'beneficiary');
    this.common.getUserConfig$.subscribe(data => {
      this.userConfig = data
      if (!this.userConfig.Personal) {
        // this.router.navigate(['masters/beneficiary/contact-details', this.path]);
      }
    });

    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))

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

    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_personal",
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
            this.form.get('photographstatus').clearValidators();
            const lowerObj = this.common.ConvertKeysToLowerCase();
            this.form.patchValue(lowerObj(this.editObj));
            this.form.get('languagesknown').setValue(this.editObj.LanguagesKnown.split(',')),
              this.form.get('applicationdate').setValue(this.formatDate(this.editObj.ApplicationDate)),
              this.form.get('dob').setValue(this.formatDate(this.editObj.DOB)),
              this.form.updateValueAndValidity();
            this.currentDate = this.formatDate(this.editObj.ApplicationDate);
            this.lastYear = new Date(this.editObj.ApplicationDate);
            this.currentDateReadonly = true;
            if (this.editObj.PhotographStatus) {
              this.viewDocument('Photograph', 'avatar')
              this.common.getSingleImage$.subscribe(res => {
                if (res?.Category == 'Photograph') {
                  this.profileImg = res.AttachmentUrl;
                  this.profileDocument = res;
                }
              })
            }
          }
        } else {
          this.loader = false;
        }
      },
        (error) => {
          this.loader = false;
          this.common.snackbar("General Error");
        })
    } else {
      this.generateCustomId();
    }

    this.common.getIndividualUpload$.subscribe(res => {
      if (res.category == 'Photograph') {
        this.form.get('photographstatus').setValue(res.status == false ? false : true);
        this.viewDocument(res.category, 'avatar')
        this.common.getSingleImage$.subscribe(res => {
          if (res?.Category == 'Photograph') {
            this.profileImg = res.AttachmentUrl;
            this.profileDocument = res;
          }
        })
      }
      if (res?.category == 'Specially Abled') {
        this.form.get('speciallyabled').setValue(res.status == false ? false : true);
        this.abledDocument = res;
      }
      if (res?.category == 'Covid Vaccination') {
        this.form.get('covidvaxcertificatestatus').setValue(res.status == false ? false : true);
        this.covidDocument = res;
      }
      this.form.updateValueAndValidity();
    })
  }

  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'HawkerPersonalDetails', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
    this.common.setHawkerId(this.path)
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  submit(btnType): void {
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      this.loader = false;
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
        hawkerid: this.generatedContactId,
        roletype: 'hawker',
        processid: this.userDetails.Processid,
        productid: 1,
        userid: this.userDetails.Id,
        usersubtype: '',
        createdby: this.userDetails.Id,
        publicip: this.userDetails.ip,
        privateip: '',
        browsername: this.userDetails.browser,
        browserversion: this.userDetails.browser_version,
        registrationstatus: 'Pending-FE',
        hawkerstatusid: '17',
        medverificationstatus: 'Not Initiated',
        pccverificationstatus: 'Not Initiated',
        erstatus: 'Not Initiated',
        trainingstatus: 'Not Initiated'
      }
    }
    this.requestObj = {
      data: {
        spname: "usp_unfyd_haw_personal",
        parameters: {
          ...this.form.value,
          ...this.commonObj,
          languagesknown: this.form.get('languagesknown').value.toString()
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        if (btnType == 'next') {
          this.router.navigate(['masters/beneficiary/contact-details', this.commonObj.hawkerid]);
        } else if (btnType == 'save') {
          this.router.navigate(['masters/beneficiary/personal-details', this.commonObj.hawkerid]);
        }
        this.common.snackbar("Success");
        if (this.editObj == undefined) {
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

  generateCustomId() {
    let Obj = {
      data: {
        prefix: "hawker"
      }
    }
    this.api.post('getcustomid', Obj).subscribe(res => {
      if (res.code == 200) {
        this.generatedContactId = res.results.data[0].Result;
        this.userType = res.results.data[0].RoleType;
      }
    })
  }
  uploadDocument(event, imgData, category) {
    var data = {
      flag: imgData !== '' ? 'UPDATE' : 'INSERT',
      documentId: imgData.Actionable,
      category: category,
      createdby: imgData !== '' ? imgData['Created By'] : this.userDetails.Id,
      modifiedby: imgData !== '' ? this.userDetails.Id : null,
      hawkerid: this.editObj !== undefined ? this.editObj.HawkerID : this.generatedContactId,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUpload(data)
    }
  }
  viewDocument(val, type) {
    var data = {
      type: type,
      processid: this.userDetails.Processid,
      category: val,
      contactid: this.editObj !== undefined ? this.path : this.generatedContactId,
    }
    this.common.setSingleImage(data)
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
  openDialog(type, data) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
        master: this.path
      },
      width: '30%'
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status !== undefined) {
        // this.common.snackbar(status);
        // this.getSnapShot();
      }
    });
  }

  back(): void {
    this.location.back()
  }
}
