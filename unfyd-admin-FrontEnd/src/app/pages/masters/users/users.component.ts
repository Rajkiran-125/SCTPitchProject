import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, masters, timeZones, countryCode, userFormSteps, checknull, userStatusSteps, checknull1 } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ThisReceiver } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { I } from '@angular/cdk/keycodes';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
declare const require: any;

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  hide = true;
  masters: any;
  form: FormGroup;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  requestObj: any;
  path: any = null;
  editObj: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  reset: boolean;
  @Input() isDialog: boolean = false;
  labelName: any;
  userFormSteps: any;
  countryCode: any = [];
  countryCodeSelected: any = {};
  localizationData: any;
  localizationDataAvailble: boolean = false;
  allowedISD: any = [];
  temp: any;
  timeZones: any;
  languageType: any = [];
  subscription: Subscription[] = [];
  @Input() data: any;
  public filteredList2 = this.countryCode.slice();
  countryjson: any;
  phminlength: any;
  phmaxlength: any;
  phone: any;
  phvalid: boolean;
  proper: boolean;
  userConfig: any;
  userLanguageName: any = [];
  @Output() tabSelected: any = new EventEmitter<any>();
  @Output() addId: any = new EventEmitter<any>();
  @Output() notifyDialog: any = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogComponent>,) {
    Object.assign(this, { masters, timeZones, countryCode, userFormSteps });
    this.filteredList2 = this.countryCode.slice();
  }
  ngOnInit(): void {
    this.common.hubControlEvent('Users', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )


    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(this.common.localizationDataAvailable$.subscribe((res) => {
      this.localizationDataAvailble = res;
    }))
    this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {
      this.localizationData = res1;
      if (this.localizationDataAvailble) {
        if ((this.localizationData.allowedISD).length > 0) {
          this.allowedISD = this.localizationData.allowedISD.split(",")
        }
      }
    }))
    if (this.Id == null) {
      this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.common.setUserConfig(this.userDetails.ProfileType, 'Users');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
    }));
    this.form = this.formBuilder.group({
      profilepic: ['', Validators.nullValidator],
      firstname: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(30)]],
      lastname: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(30)]],
      aliasname: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(30)]],
      countrycode: [this.countryCode[95], Validators.required],
      contactnumber: ['', [Validators.required, Validators.pattern(regex.mobile)]],
      emailid: ['', [Validators.required, Validators.pattern(regex.email1)]],
      languagecode: [['en'], Validators.nullValidator],
      username: ['', [Validators.pattern(regex.alphnumericWithHyphen), Validators.required]],
      employeeid: ['', Validators.nullValidator],
      password: ['', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]]
    },
      { validator: [checknull('firstname'), checknull('lastname'), checknull('aliasname'), checknull('username'), checknull('password'), checknull('emailid')] },

    )
    this.countryCodeSelected = this.countryCode[95];
    // this.getLanguage();
    this.getLanguageStorage();

    this.path = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');

    if (this.path != "null") {
      this.loader = true;
      var Obj = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            flag: "GETUSERBYID",
            agentid: this.path
          }
        }
      }
      this.api.post('index', Obj).subscribe((res: any) => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.loader = false;
          this.editObj = res.results.data[0];

          if (this.editObj) {
            let a = this.editObj?.LanguageCode?.split(',')
            this.form.patchValue({
              profilepic: this.editObj.ProfilePic,
              firstname: this.editObj.FirstName,
              lastname: this.editObj.LastName,
              aliasname: this.editObj.AliasName,
              countrycode: this.editObj.CountryCode,
              contactnumber: this.editObj.ContactNumber,
              emailid: this.editObj.EmailId,
              languagecode: this.editObj.LanguageCode.split(','),
              username: this.editObj.UserName,
              employeeid: this.editObj.EmployeeId,
              password: this.editObj.Password,

            });
            const lowerObj = this.common.ConvertKeysToLowerCase();
            let lowerObjVal = lowerObj(this.editObj);
            let dummyLowerObjVal = lowerObjVal
            for (const [key, value] of Object.entries(lowerObjVal)) {
              if (key !== 'languagecode') {
                this.form.patchValue({ key: value })
              }
            }
            const variableOne = this.countryCode.filter(item => item.dial_code == this.editObj.CountryCode);
            this.form.controls['countrycode'].setValue(variableOne[0]);
            this.form.controls['languagecode'].setValue(this.editObj.LanguageCode.split(','));
            this.form.get('password').disable();
            this.form.get('password').clearValidators();
            this.form.updateValueAndValidity();
          }
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/users/add'])
    }
    this.common.hubControlEvent('Users', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('Users', 'click', 'label', 'label', data, 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Users', data)
  }

  hideChange() {
    this.common.hubControlEvent('Users', 'click', '', '', '', 'hideChange');

    this.hide = !this.hide
  }
  config: any;
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });
    this.subscription.push(this.common.getIndividualUpload$.subscribe(res => {
      this.form.controls.profilepic.setValue(res.status.attachmenturl);
    }))
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('Users', 'click', 'back', 'back', '', 'back');
    if (this.isDialog == true) {
      this.dialogRef.close(true);
    }
    else {
      // this.location.back()
      this.router.navigate(['/masters/users'])

    }
  
  }


  getLanguageStorage() {
    this.loader = true;
    this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName'))
    console.log('this.LanguageStore all', this.userLanguageName)
    if (this.userLanguageName == null || this.userLanguageName == undefined) {
      this.getLanguage();
    } else {
      let chlen = this.userLanguageName.length
      this.userLanguageName.forEach(element => {
        if (element.ChannelName == 'Voice') {
          this.userLanguageName = true;
        }

        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }


  getLanguage() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('Users', 'click', 'language', 'language', JSON.stringify(this.requestObj), 'getLanguage');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        localStorage.setItem("userLanguageName", res.results.data[1][0].UserLanguage);
        this.getLanguageStorage()
      }
      // this.languageType = res.results['data']
    })
  }



  uploadDocument(event, category) {
    this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(event, category), 'uploadDocument');

    var data = {
      category: category,
      flag: "INSERT",
      createdby: this.userDetails.Id,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUpload(data)
    }
  }

  resetForm() {
    this.common.hubControlEvent('Users', 'click', '', '', '', 'resetForm');

    this.form.reset();
    setTimeout(() => {
      this.form.get('countrycode').patchValue(this.countryCode[95]);
      this.form.get('languagecode').patchValue(['en']);
    }, 500);
  }
  numericOnly(e): boolean {
    this.common.hubControlEvent('Users', 'click', '', '', e, 'numericOnly');

    const charCode = (e.which) ? e.which : e.keyCode;
    if (charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43 ||
      charCode === 33 || charCode === 35 || charCode === 47 || charCode === 36 ||
      charCode === 37 || charCode === 38 || charCode === 40 || charCode === 41 || charCode === 42
      || charCode > 47 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (e.target.value.length >= 20) {
      return false;
    }
    return true;
  }



  valPhone(e) {
    this.common.hubControlEvent('Users', 'click', '', '', e, 'valPhone');


    let countryjsonvalphone = e;
    this.countryjson = countryjsonvalphone;
    let phonelength = this.countryjson.max_length
    this.phminlength = phonelength[0]
    this.phmaxlength = phonelength[phonelength.length - 1]
    let regex = this.countryjson.regex

    let phone = this.phone;

    if (phone.length > 1) {
      if (regex == undefined || null) {
        this.form.controls['contactnumber'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength)]);
      }
      else {
        this.form.controls['contactnumber'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength), Validators.pattern(regex)]);
      }
    }
    this.form.get('contactnumber').markAsTouched();
    let countrycodeEN = this.countryjson.country_code
    let isValid = false;
    if (this.form.controls['contactnumber'].status !== "INVALID") {
      const number = phoneUtil.parseAndKeepRawInput(phone, countrycodeEN.toUpperCase());
      isValid = phoneUtil.isValidNumberForRegion(number, countrycodeEN.toUpperCase());
      this.phvalid = isValid
    }


    if (phone.length >= 10) {

      this.proper = true;
      return true;
    } else {
      this.proper = false;
    }
    return false;
  }



  selectCountry(value) {
    this.common.hubControlEvent('Users', 'click', '', '', value, 'selectCountry');

    this.countryCodeSelected = value;
  }
  submit() {
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      // this.common.snackbar("General Error");
      return;
    }
    if (this.path == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            flag: "INSERT",
            profilepic: this.form.value.profilepic,
            firstname: this.form.value.firstname == null ? null : this.form.value.firstname.trim(),
            lastname: this.form.value.lastname == null ? null : this.form.value.lastname.trim(),
            aliasname: this.form.value.aliasname == null ? null : this.form.value.aliasname.trim(),
            contactnumber: this.form.value.contactnumber,
            emailid: this.form.value.emailid,
            username: this.form.value.username == null ? null : this.form.value.username.trim(),
            employeeid: this.form.value.employeeid == null ? null : this.form.value.employeeid.trim(),
            password: this.common.setEncrypted('123456$#@$^@1ERF', this.form.value.password),
            languagecode: this.form.get('languagecode').value.toString(),
            countrycode: this.form.get('countrycode').value['dial_code'],
            createdby: this.userDetails.Id,
            processid: this.userDetails.Processid,
          }
        }
      }
    } else {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            flag: "UPDATE_USER_PERSONALDETAILS",
            processid: this.userDetails.Processid,
            id: this.editObj.Id,
            profilepic: this.form.value.profilepic,
            firstname:  this.form.value.firstname == null ? null : this.form.value.firstname.trim(),
            lastname: this.form.value.lastname == null ? null : this.form.value.lastname.trim(),
            aliasname: this.form.value.aliasname == null ? null : this.form.value.aliasname.trim(),
            countrycode: this.form.get('countrycode').value['dial_code'],
            contactnumber: this.form.value.contactnumber,
            emailid: this.form.value.emailid,
            languagecode: this.form.get('languagecode').value.toString(),
            username: this.form.value.username == null ? null : this.form.value.username.trim(),
            employeeid:  this.form.value.employeeid == null ? null : this.form.value.employeeid.trim(),
            modifiedby: this.userDetails.Id,
          }
        }
      }


    }



    this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(this.requestObj), 'submit');

    this.api.post('usercreate', this.requestObj).subscribe((res: any) => {
      this.loader = true
      if (res.code == 200) {
        this.common.refreshMenu(true);
        if ((Object.keys(res.results.data[0])).includes('result')) {
          if (res.results.data[0].result.includes("already exists")) {
            this.common.snackbar('Exists');
            // this.form.reset(false)
          }
        }
        this.loader = false;
        if (this.isDialog == true) {}
        else{
        this.router.navigate(['masters/users/personal-details/update', this.path == null ? res.results.data[0].Id : this.path]);}
        if (this.path) this.common.snackbar("Update Success")
        else this.common.snackbar("Saved Success");
        // this.common.reloadDataMethod(true);
        let data = {
          Processid : this.userDetails.Processid,
          Agentid : this.path
        }
        this.common.sendCERequest('UpdateAgentMappingMaster', data)
        this.common.sendCEBotRequest('UpdateAgentMappingMaster',this.Id === null || this.Id === undefined ? res.results.data[0].Id : this.Id ,this.userDetails.Processid)
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }

  // addnewsteps(newItem: string) {
  //   this.data.newsteps = newItem }

  addnewsteps(event) {
    this.notifyDialog.emit(event)
  }

  addtabSelected(value: string) {
    this.tabSelected.emit(value);
  }

  addPathId(value: string) {
    this.addId.emit(value)
  }
  Next() {
    this.common.hubControlEvent('Users', 'click', '', '', '', 'Next');

    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      // this.common.snackbar("General Error");
      return;
    }

    if ((this.path == null) && ((this.temp == null) || (this.temp == undefined))) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            flag: "INSERT",
            profilepic: this.form.value.profilepic,
            firstname: this.form.value.firstname == null ? null :this.form.value.firstname.trim(),
            lastname: this.form.value.lastname == null ? null : this.form.value.lastname.trim(),
            aliasname: this.form.value.aliasname == null ? null : this.form.value.aliasname.trim(),
            contactnumber: this.form.value.contactnumber,
            emailid: this.form.value.emailid,
            username: this.form.value.username == null ? null : this.form.value.username.trim(),
            employeeid: this.form.value.employeeid == null ? null : this.form.value.employeeid.trim(),
            password: this.common.setEncrypted('123456$#@$^@1ERF', this.form.value.password),
            languagecode: this.form.get('languagecode').value.toString(),
            countrycode: this.form.get('countrycode').value['dial_code'],
            createdby: this.userDetails.Id,
            processid: this.userDetails.Processid,
          }
        }
      }
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            flag: "UPDATE_USER_PERSONALDETAILS",
            processid: this.userDetails.Processid,
            id: this.editObj.Id,
            profilepic: this.form.value.profilepic,
            firstname: this.form.value.firstname == null ? null :this.form.value.firstname.trim(),
            lastname: this.form.value.lastname == null ? null : this.form.value.lastname.trim(),
            aliasname: this.form.value.aliasname == null ? null : this.form.value.aliasname.trim(),
            countrycode: this.form.get('countrycode').value['dial_code'],
            contactnumber: this.form.value.contactnumber,
            emailid: this.form.value.emailid.trim(),
            languagecode: this.form.get('languagecode').value.toString(),
            username: this.form.value.username == null ? null : this.form.value.username.trim(),
            employeeid:this.form.value.employeeid == null ? null : this.form.value.employeeid.trim(),
            modifiedby: this.userDetails.Id,
          }
        }
      }
    }
    this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(this.requestObj), 'Next');

    this.api.post('usercreate', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.refreshMenu(true);
        if ((Object.keys(res.results.data[0])).includes('result')) {
          if (res.results.data[0].result.includes("already exists")) {
            this.common.snackbar('Exists');
          }
        }
        this.loader = false;
        if (this.isDialog == true) {
          // this.tabSelected.emit('Contact Center Details')
          this.tabSelected.emit(userFormSteps[1].label)
          this.addId.emit(this.Id === null || this.Id === undefined ? res.results.data[0].Id : this.Id);
        }
        else {
          this.router.navigate(['masters/users/contact-center-details', this.path == null ? res.results.data[0].Id : this.path]);
        }
        if (this.path) this.common.snackbar("Update Success")
        else this.common.snackbar("Saved Success");
        this.common.reloadDataMethod(true);
        let data = {
          Processid : this.userDetails.Processid,
          Agentid : this.path
        }
        this.common.sendCERequest('UpdateAgentMappingMaster', data)
        this.common.sendCEBotRequest('UpdateAgentMappingMaster',this.Id === null || this.Id === undefined ? res.results.data[0].Id : this.Id ,this.userDetails.Processid)

      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })

  }


  resetFunc(){
    this.form.reset()
    setTimeout(() => {
      this.form.patchValue({
        countrycode:this.countryCode[95],
        languagecode:['en']
      })
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
