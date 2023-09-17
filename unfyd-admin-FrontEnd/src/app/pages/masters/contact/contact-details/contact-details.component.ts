import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ContactSteps, checknull, countryCode, masters, regex, timeZones } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { Subscription } from 'rxjs';

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {
  [x: string]: any;
  loader: any;
  form: any;
  ContactSteps: any;
  contactpath: any;
  userDetails: any;
  submittedForm: boolean;
  whatsappSelected: boolean= false;;
  WebchatSelected: boolean= false;;
  EmailSelected: boolean= false;;
  subscription: Subscription[] = [];
  config: any;
  userChannelName: any = [];
  obj: {};
  samecontact: boolean = false;
  permanentForm: boolean = true;
  path: any;
  countryjson: any;
  phminlength: any;
  phmaxlength: any;
  phone: any;
  phvalid: boolean;
  countryCode: any = [];
  public filteredList2 = this.countryCode.slice();
  allowedISD: any = [];
  channelData: any = [];
  
  contactData: any;
  checked: any;
  editObj: any;
  userConfig: any;
  ChannelName: any;
  ContactID: any;
  presentStates: any = [];
  presentDistrict: any = [];
  distvar: any = [];
  country: any = [];
  presentStates2: any = [];
  filterepresentStates2: any = [];
  statesvar2: any = [];
  presentDistrict2: any = [];
  filtereddistrict2: any = [];
  distvar2: any = [];
  country2: any = [];
  count = 0;
  presentPincode: any = [];
  filtereddPincode = this.presentPincode.slice();
  public searchzipcode = this.filtereddPincode.slice();
  zipvar: any = [];
  pincodevar: any;
  zipvar2: any = [];
  quotevar: any;
  presentPincode2: any = [];
  policeStationlist2: any = [];
  proper: boolean;
  countryCodeSelected: any = {};
  countryCodeAlternateNo:any = {};
  countryCodeEmergencyNo:any = {};

  showChannelDropdown = false;
  filtereddPincode2 = this.presentPincode2.slice();
  public searchzipcode2 = this.filtereddPincode2.slice();
  public searchdistrict2 = this.filtereddistrict2.slice();
  public filteredcountry2 = this.country2.slice();
  public searchstate1 = this.filterepresentStates2.slice();
  filtereddistrict = this.presentDistrict.slice();
  public searchdistrict = this.filtereddistrict.slice();
  public countryfilter1 = this.country.slice();
  filterepresentStates = this.presentStates.slice();
  public searchState = this.filterepresentStates.slice();
  
  statesvar: any = [];



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
    public dialog: MatDialog
  ) {
    Object.assign(this, { masters, ContactSteps, timeZones, countryCode });
    this.filteredList2 = this.countryCode.slice();
  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    if (this.path == null) {
      this.path = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.contactpath = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscription.push(this.common.contactId$.subscribe(res => {
      if (res != false) {
        this.ContactID = res.ContactID
      }
    }))
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
    this.getChannelStorage();
    this.getSnapShot()
    this.form = this.formBuilder.group({
      contactno: ['', [Validators.required, Validators.pattern(regex.mobile)]],
      alternateno: ['', [Validators.required ,Validators.maxLength(10),Validators.pattern(regex.mobile)]],
      emergencyno: ['', [Validators.required,Validators.maxLength(10),Validators.pattern(regex.mobile)]],
      email: ['', Validators.nullValidator],
      instagram: ['', Validators.nullValidator],
      facebook: ['', Validators.nullValidator],
      channeldropdown: ['', Validators.nullValidator],
      sameaddress: ['', Validators.nullValidator],
      channeltext: ['', Validators.nullValidator],
      countrycode: [this.countryCode[95], Validators.nullValidator],
      // countrycode1: [this.countryCode[95], Validators.nullValidator],
      // countrycode2: [this.countryCode[95], Validators.nullValidator],
      presentContact: this.formBuilder.group({
        housename: ['', Validators.required],
        streetname: ['', Validators.required],
        landmark: ['', Validators.required],
        pincode: ['', Validators.required],
        district: ['', Validators.required],
        state: ['', Validators.required],
        countryname: ['', Validators.required],

      },
      {validator: [checknull('housename'),checknull('streetname'),checknull('landmark')]}
      ),

      duplicateContact: this.formBuilder.group({
        housename: ['', Validators.nullValidator],
        streetname: ['', Validators.nullValidator],
        landmark: ['', Validators.nullValidator],
        pincode: ['', Validators.nullValidator],
        district: ['', Validators.nullValidator],
        state: ['', Validators.nullValidator],
        countryname: ['', Validators.nullValidator],
      }),

      place: this.formBuilder.array([
      ]),

      // this.newplace(),

    })



    this.countryCodeSelected = this.countryCode[95];
    // this.countryCodeAlternateNo = this.countryCode[95];
    // this.countryCodeEmergencyNo = this.countryCode[95];

    if (this.path != 'null') {
      var Obj = {
        data: {
          spname: "usp_unfyd_contact_personal",
          parameters: {
            flag: "EDIT",
            Id: this.path,
          }
        }
      }
      this.api.post('index', Obj).subscribe((res: any) => {
        if (res.code == 200) {
          console.log(res, "details res")
          this.contactData = res.results.data[0]
          console.log(this.contactData,"this.contactData")
          this.editObj = res.results.data[0];
          console.log(this.editObj,"this.editobj")

          this.form.patchValue({
            contactno: this.editObj.MobileNumber,
            alternateno: this.editObj.AlternateMobileNumber,
            emergencyno: this.editObj.EmergencyContactNumber,
            sameaddress: this.editObj.PresentAddForPermanent,
            countrycode: this.editObj.CountryCode,
            channeltext:this.editObj.Webchat
          })
          const variableOne = this.countryCode.filter(item => item.dial_code == this.editObj.CountryCode);
          this.form.controls['countrycode'].setValue(variableOne[0]);
          // const variableOne1 = this.countryCode.filter(item => item.dial_code == this.editObj.CountryCode);
          // this.form.controls['countrycode1'].setValue(variableOne1[0]);
          // const variableOne2 = this.countryCode.filter(item => item.dial_code == this.editObj.CountryCode);
          // this.form.controls['countrycode2'].setValue(variableOne2[0]);
          if (this.editObj.PresentAddLine1 != null) {
            this.patchfunc()
            this.statefunc()
            this.statefunc2()
            this.districtfunc()
            this.districtfunc2()
            this.zipcodefunc()
            this.zipcodefunc2()
          }
          // this.form.controls.contactno.patchValue(res.results.data[0].MobileNumber)
          // this.form.controls.alternateno.patchValue(res.results.data[0].AlternateMobileNumber)
          // this.form.controls.emergencyno.patchValue(res.results.data[0].EmergencyContactNumber)
          // this.form.controls.housename.presentContact.patchValue(res.results.data[0].PresentAddLine1)
          // this.form.controls.streetname.presentContact.patchValue(res.results.data[0].PresentAddLine2)
          // this.form.controls.landmark.presentContact.patchValue(res.results.data[0].PresentAddLine3)
          // this.form.controls.pincode.presentContact.patchValue(res.results.data[0].PresentPincode)
          // this.form.controls.city.presentContact.patchValue(res.results.data[0].PresentDistrict)
          // this.form.controls.state.presentContact.patchValue(res.results.data[0].PresentState)
          // this.form.controls.country.presentContact.patchValue(res.results.data[0].PresentCountry)

          // this.form.controls.housename.patchValue(res.results.data[0].PresentAddLine1)
          // this.form.controls.streetname.patchValue(res.results.data[0].PresentAddLine2)
          // this.form.controls.landmark.patchValue(res.results.data[0].PresentAddLine3)
          // this.form.controls.pincode.patchValue(res.results.data[0].PresentPincode)
          // this.form.controls.city.patchValue(res.results.data[0].PresentDistrict)
          // this.form.controls.state.patchValue(res.results.data[0].PresentState)
          // this.form.controls.country.patchValue(res.results.data[0].PresentCountry)

        }
      })
    }

  }

  newplace(): FormGroup {
    return this.formBuilder.group({
      channeldropdown: new FormControl('', [Validators.nullValidator]),
      channeltext: new FormControl('', [Validators.nullValidator])
    },


    )
  }

  place(): FormArray {
    return this.form.get("place") as FormArray
  }
  channelSelected = [];
  addplace(i) {
    // let placearr = this.place().controls.length
    this.channelSelected[i] = !this.channelSelected[i]
    this.place().push(this.newplace());
    console.log(this.form.value.place);
    console.log('this.form', this.form);


    // this.showChannelDropdown = true;


    // let finalplacearr = placearr + 1;

    // var arrayControl = this.form.get('place') as FormArray;
    // (arrayControl.at(placearr) as FormGroup).get('channeltext').patchValue('P'+finalplacearr);

  }

  patchfunc() {
    console.log(this.editObj);


    this.form.patchValue({
      presentContact: {
        housename: this.editObj.PresentAddLine1,
        streetname: this.editObj.PresentAddLine2,
        landmark: this.editObj.PresentAddLine3,
        pincode: this.editObj.PresentPincode,
        district: this.editObj.PresentDistrict,
        state: this.editObj.PresentState,
        countryname: this.editObj.PresentCountry,


      },
      duplicateContact:
      {
        housename: this.editObj.PermanentAddLine1,
        streetname: this.editObj.PermanentAddLine2,
        landmark: this.editObj.PermanentAddLine3,
        pincode: this.editObj.PermanentPincode,
        district: this.editObj.PermanentDistrict,
        state: this.editObj.PermanentState,
        countryname: this.editObj.PermanentCountry,
      },

    });
    this.form.updateValueAndValidity();

  }

// for(let temp of place().controls)

  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });
    this.common.setUserConfig(this.userDetails.ProfileType, 'scheduler');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
      console.log(this.userConfig, " this.userConfig")
      console.log(data, " this.userConfig data")

    }))
    this.getCountries('', 'Country');
    this.getCountries2('', 'Country');
    // this.subscription.push(this.common.getIndividualUpload$.subscribe(res => {
    //   this.form.controls.profilepic.setValue(res.status.attachmenturl);
    // }))
  }




  addAction = false
  addActionActionable() {
    this.common.hubControlEvent('HubModules', 'click', '', '', '', 'addActionActionable');

    this.addAction = false

  }

  getChannelStorage() {
    this.loader = true;
    this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))
    // console.log('this.userChannelName all', this.userChannelName)
    if (this.userChannelName == null || this.userChannelName == undefined) {
      this.getChannel();
    } else {
      let chlen = this.userChannelName.length
      this.userChannelName.forEach(element => {


        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }

  getChannel() {
    let obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'getChannel');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        localStorage.setItem("userChannelName", res.results.data[0][0].UserChannel);
        this.getChannelStorage()
      }
      // this.channelType = res.results['data']
      // this.channelName = this.channelType[0].Id
    });
  }




  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }




  channelSubmit() {
  this.whatsappSelected = false
  this.WebchatSelected =false
  this.EmailSelected =false


    let temp = this.form.value.place;
console.log(temp,"temp")
console.log(this.form.value.place,"this.form.value.place()")
    for(let i=0;i<temp.length;i++){    
//    if(temp[i].channeldropdown == 1){
//     this.whatsappSelected = true
//       }
//       if(temp[i].channeldropdown == 2){
// this.WebchatSelected = true          
// }

    }


    this.obj = {
      data: {
        spname: 'usp_unfyd_contact_social',
        parameters: {
          flag: "INSERT",
          Id: this.path,
          Email: this.form.value.email,
          Instagram: this.form.value.instagram,
          FacebookID: this.form.value.facebook,
          ContactID: this.ContactID,
          WhatsAppNumber:this.form.value.channeltext
          // WhatsAppNumber: this.whatsappSelected == true ? '1' : null,
          // Webchat:this.WebchatSelected == true ? '2':null,

        }
      }
    }
    this.api.post('index', this.obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.snackbar('Record add')
      }
    })
  }

  submit() {
    this.submittedForm = true;
    // if()
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
      return;
    }

    this.obj = {
      data: {
        spname: 'usp_unfyd_contact_personal',
        parameters: {
          flag: "UPDATE",
          Id: this.path,
          MobileNumber: this.form.value.contactno,
          AlternateMobileNumber: this.form.value.alternateno,
          EmergencyContactNumber: this.form.value.emergencyno,
          CountryCode: this.form.get('countrycode').value['dial_code'],
          // countrycode1:this.form.get('countrycode1').value['dial_code']

          PresentAddLine1: this.form.value.presentContact.housename,
          PresentAddLine2: this.form.value.presentContact.streetname,
          PresentAddLine3: this.form.value.presentContact.landmark,
          PresentPincode: this.form.value.presentContact.pincode,
          PresentDistrict: this.form.value.presentContact.district,
          PresentState: this.form.value.presentContact.state,
          PresentCountry: this.form.value.presentContact.countryname,

          PresentAddForPermanent: this.form.value.sameaddress,

          PermanentAddLine1: this.form.value.duplicateContact.housename,
          PermanentAddLine2: this.form.value.duplicateContact.streetname,
          PermanentAddLine3: this.form.value.duplicateContact.landmark,
          PermanentPincode: this.form.value.duplicateContact.pincode,
          PermanentDistrict: this.form.value.duplicateContact.district,
          PermanentState: this.form.value.duplicateContact.state,
          PermanentCountry: this.form.value.duplicateContact.countryname,

          ProfileImg: this.contactData.ProfileImg,
          FirstName: this.contactData.FirstName,
          Salutation: this.contactData.Salutation,
          MiddleName: this.contactData.MiddleName,
          LastName: this.contactData.LastName,
          Gender: this.contactData.Gender,
          DOB: this.contactData.DOB,
          BloodGroup: this.contactData.BloodGroup,
          Nationality: this.contactData.Nationality,
          Religion: this.contactData.Religion,
          Languages: this.contactData.Languages,
          MaritalStatus: this.contactData.MaritalStatus,

        }
      }
    }
    // }
    this.api.post('index', this.obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.snackbar('Record add')
        this.router.navigate(['masters/contact'])
        this.channelSubmit()
      }
    })
  }


  next() {
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
      return;
    }
    this.obj = {
      data: {
        spname: 'usp_unfyd_contact_personal',
        parameters: {
          flag: "UPDATE",
          Id: this.path,
          MobileNumber: this.form.value.contactno,
          AlternateMobileNumber: this.form.value.alternateno,
          EmergencyContactNumber: this.form.value.emergencyno,
          CountryCode: this.form.get('countrycode').value['dial_code'],

          PresentAddLine1: this.form.value.presentContact.housename,
          PresentAddLine2: this.form.value.presentContact.streetname,
          PresentAddLine3: this.form.value.presentContact.landmark,
          PresentPincode: this.form.value.presentContact.pincode,
          PresentDistrict: this.form.value.presentContact.district,
          PresentState: this.form.value.presentContact.state,
          PresentCountry: this.form.value.presentContact.countryname,

          PresentAddForPermanent: this.form.value.sameaddress,

          PermanentAddLine1: this.form.value.duplicateContact.housename,
          PermanentAddLine2: this.form.value.duplicateContact.streetname,
          PermanentAddLine3: this.form.value.duplicateContact.landmark,
          PermanentPincode: this.form.value.duplicateContact.pincode,
          PermanentDistrict: this.form.value.duplicateContact.district,
          PermanentState: this.form.value.duplicateContact.state,
          PermanentCountry: this.form.value.duplicateContact.countryname,

          ProfileImg: this.contactData.ProfileImg,
          FirstName: this.contactData.FirstName,
          Salutation: this.contactData.Salutation,
          MiddleName: this.contactData.MiddleName,
          LastName: this.contactData.LastName,
          Gender: this.contactData.Gender,
          DOB: this.contactData.DOB,
          BloodGroup: this.contactData.BloodGroup,
          Nationality: this.contactData.Nationality,
          Religion: this.contactData.Religion,
          Languages: this.contactData.Languages,
          MaritalStatus: this.contactData.MaritalStatus,

        }
      }
    }
    // }
    this.api.post('index', this.obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.snackbar('Record add')
        this.form.reset()
        // this.router.navigate(['masters/contact'])
        this.channelSubmit()
      }
    })
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
    // this.common.hubControlEvent('Users', 'click', '', '', e, 'valPhone');


    let countryjsonvalphone = e;
    this.countryjson = countryjsonvalphone;
    let phonelength = this.countryjson.max_length
    this.phminlength = phonelength[0]
    this.phmaxlength = phonelength[phonelength.length - 1]
    let regex = this.countryjson.regex

    let phone = this.phone;

    if (phone.length > 1) {
      if (regex == undefined || null) {
        this.form.controls['contactno'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength)]);
      }
      else {
        this.form.controls['contactno'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength), Validators.pattern(regex)]);
      }
    }
    this.form.get('contactno').markAsTouched();
    let countrycodeEN = this.countryjson.country_code
    let isValid = false;
    if (this.form.controls['contactno'].status !== "INVALID") {
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

  // alternatePhone(e) {
  //   // this.common.hubControlEvent('Users', 'click', '', '', e, 'valPhone');


  //   let countryjsonvalphone = e;
  //   this.countryjson = countryjsonvalphone;
  //   let phonelength = this.countryjson.max_length
  //   this.phminlength = phonelength[0]
  //   this.phmaxlength = phonelength[phonelength.length - 1]
  //   let regex = this.countryjson.regex

  //   let phone = this.phone;

  //   if (phone.length > 1) {
  //     if (regex == undefined || null) {
  //       this.form.controls['alternateno'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength)]);
  //     }
  //     else {
  //       this.form.controls['alternateno'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength), Validators.pattern(regex)]);
  //     }
  //   }
  //   this.form.get('alternateno').markAsTouched();
  //   let countrycodeEN = this.countryjson.country_code
  //   let isValid = false;
  //   if (this.form.controls['alternateno'].status !== "INVALID") {
  //     const number = phoneUtil.parseAndKeepRawInput(phone, countrycodeEN.toUpperCase());
  //     isValid = phoneUtil.isValidNumberForRegion(number, countrycodeEN.toUpperCase());
  //     this.phvalid = isValid
  //   }


  //   if (phone.length >= 10) {

  //     this.proper = true;
  //     return true;
  //   } else {
  //     this.proper = false;
  //   }
  //   return false;
  // }

  // emergencyPhone(e) {
  //   // this.common.hubControlEvent('Users', 'click', '', '', e, 'valPhone');


  //   let countryjsonvalphone = e;
  //   this.countryjson = countryjsonvalphone;
  //   let phonelength = this.countryjson.max_length
  //   this.phminlength = phonelength[0]
  //   this.phmaxlength = phonelength[phonelength.length - 1]
  //   let regex = this.countryjson.regex

  //   let phone = this.phone;

  //   if (phone.length > 1) {
  //     if (regex == undefined || null) {
  //       this.form.controls['emergencyno'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength)]);
  //     }
  //     else {
  //       this.form.controls['emergencyno'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength), Validators.pattern(regex)]);
  //     }
  //   }
  //   this.form.get('emergencyno').markAsTouched();
  //   let countrycodeEN = this.countryjson.country_code
  //   let isValid = false;
  //   if (this.form.controls['alternateno'].status !== "INVALID") {
  //     const number = phoneUtil.parseAndKeepRawInput(phone, countrycodeEN.toUpperCase());
  //     isValid = phoneUtil.isValidNumberForRegion(number, countrycodeEN.toUpperCase());
  //     this.phvalid = isValid
  //   }


  //   if (phone.length >= 10) {

  //     this.proper = true;
  //     return true;
  //   } else {
  //     this.proper = false;
  //   }
  //   return false;
  // }

  selectCountry(value) {
    this.countryCodeSelected = value;
  }
  selectCountryForAlternateNo(value) {
    this.countryCodeAlternateNo = value;
  }

  selectCountryForEmergencyNo(value) {
    this.countryCodeEmergencyNo = value;
  }

  samePresentAddPermanent(event) {

    this.samecontact = event;
    if (event == true) {
      this.checked = true;
      this.permanentForm = false;

      this.form.get(['duplicateContact', 'housename']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'streetname']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'landmark']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'pincode']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'district']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'state']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'countryname']).setValidators(Validators.nullValidator);


      this.form.get(['duplicateContact', 'housename']).setValue(this.form.value.presentContact.housename)
      this.form.get(['duplicateContact', 'streetname']).setValue(this.form.value.presentContact.streetname)
      this.form.get(['duplicateContact', 'landmark']).setValue(this.form.value.presentContact.landmark)
      this.form.get(['duplicateContact', 'pincode']).setValue(this.form.value.presentContact.pincode)
      this.form.get(['duplicateContact', 'district']).setValue(this.form.value.presentContact.district)
      this.form.get(['duplicateContact', 'state']).setValue(this.form.value.presentContact.state)
      this.form.get(['duplicateContact', 'countryname']).setValue(this.form.value.presentContact.country)

    } else {
      this.permanentForm = true;


      this.form.get(['duplicateContact', 'housename']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'streetname']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'landmark']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'pincode']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'district']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'state']).setValidators(Validators.nullValidator);
      this.form.get(['duplicateContact', 'countryname']).setValidators(Validators.nullValidator);

      this.form.get(['duplicateContact', 'housename']).setValue('')
      this.form.get(['duplicateContact', 'streetname']).setValue('')
      this.form.get(['duplicateContact', 'landmark']).setValue('')
      this.form.get(['duplicateContact', 'pincode']).setValue('')
      this.form.get(['duplicateContact', 'district']).setValue('')
      this.form.get(['duplicateContact', 'state']).setValue('')
      this.form.get(['duplicateContact', 'countryname']).setValue('')

    }
    this.form.updateValueAndValidity();
  }

  getPresentPincode(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentPincode');

    // this.form.get(['sendingAddress', 'presentaddresspincode']).setValue('');


    this.presentPincode = [];
    this.filtereddPincode = [];
    this.zipvar = [];
    this.searchzipcode = [];

    this.common.getLocation(event, 'Pincode').subscribe(res => {
      this.presentPincode = res;
      this.filtereddPincode = res;
      this.zipvar = res;

      this.searchzipcode = this.filtereddPincode.slice();
    })

  }



  getPresentStates(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentStates');

    this.presentStates = [];

    this.form.get(['presentContact', 'state']).setValue('')
    this.form.get(['presentContact', 'district']).setValue('')
    this.form.get(['presentContact', 'pincode']).setValue('')

    this.presentStates = []
    this.filterepresentStates = []
    this.statesvar = []
    this.searchState = []


    this.presentDistrict = []
    this.filtereddistrict = []
    this.distvar = []
    this.searchdistrict = []

    this.presentPincode = [];
    this.filtereddPincode = [];
    this.zipvar = [];
    this.searchzipcode = [];



    this.common.getLocation(event, 'State').subscribe(res => {
      this.presentStates = res
      this.filterepresentStates = res;
      this.statesvar = res;

      this.searchState = this.filterepresentStates.slice();


    })
  }


  getPresentStates2(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentStates2');

    this.presentStates2 = [];


    this.form.get(['duplicateContact', 'state']).setValue('')
    this.form.get(['duplicateContact', 'district']).setValue('')
    this.form.get(['duplicateContact', 'pincode']).setValue('')



    this.presentStates2 = []
    this.filterepresentStates2 = [];
    this.statesvar2 = [];
    this.searchstate1 = [];


    this.presentDistrict2 = [];
    this.filtereddistrict2 = [];
    this.distvar2 = [];
    this.searchdistrict2 = [];


    // this.presentPincode2 = [];
    // this.filtereddPincode2 = [];
    // this.zipvar2 = [];
    // this.searchzipcode2 = [];


    this.common.getLocation(event, 'State').subscribe(res => {
      this.presentStates2 = res
      this.filterepresentStates2 = res;
      this.statesvar2 = res;

      this.searchstate1 = this.filterepresentStates2.slice();
    })
  }

  openedChange(opened: boolean) {
    // this.common.hubControlEvent('Tenant','click','pageloadend','pageloadend',opened,'openedChange');
  }

  getCountries(event, type) {
    this.common.getLocation(event, type).subscribe(res => {
      this.country = res;
      console.log(res, "res country")
      console.log(this.country, "this.country")
      this.countryfilter1 = this.country.slice();

      // this.form.patchValue({ presentContact: { 'countryname': this.country[0].CountryID } })
      // this.form.patchValue({ sendingAddress: { 'permanentaddresscountry': this.country[0].CountryID } })

    })
  }


  getCountries2(event, type) {
    // this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event, type),'getCountries2');

    this.common.getLocation(event, type).subscribe(res => {
      this.country2 = res;
      this.filteredcountry2 = this.country2.slice();
      // this.form.patchValue({ duplicateContact: { 'countryname': this.country2[0].CountryID } })
      // this.form.patchValue({ billingAddress: { 'permanentaddresscountry': this.country2[0].CountryID } })
    })
  }



  statefunc() {
    let state = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "STATES",
          countryid: this.editObj.PresentCountry
        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', '', 'statefunc');

    this.api.post('index', state).subscribe((res: any) => {
      if (res.code == 200) {
        let statesapi = []
        statesapi = res;
        this.statesvar = res.results.data
        this.filterepresentStates = res.results.data
        this.form.patchValue({
          presentContact: {
            state: this.editObj.PresentState
          },

        });


        this.searchState = this.filterepresentStates.slice();
        this.form.updateValueAndValidity();

        this.count++;


      }
    })
  }

  statefunc2() {
    let state = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "STATES",
          countryid: this.editObj.PermanentCountry

        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(state), 'statefunc2');

    this.api.post('index', state).subscribe((res: any) => {
      if (res.code == 200) {

        this.filterepresentStates2 = res.results.data
        this.form.patchValue({
          duplicateContact:
          {
            state: this.editObj.PermanentState
          }
        });

        this.searchstate1 = this.filterepresentStates2.slice();

        this.form.updateValueAndValidity();
        this.count++;
      }
    })
  }


  districtfunc() {

    let district = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "DISTRICT",
          stateid: this.editObj.PresentState

        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(district), 'districtfunc');

    this.api.post('index', district).subscribe((res: any) => {

      if (res.code == 200) {

        this.filtereddistrict = res.results.data


        this.form.patchValue({
          presentContact: {

            district: this.editObj.PresentDistrict

          },

        });

        this.searchdistrict = this.filtereddistrict.slice();
        this.form.updateValueAndValidity();



        this.count++;
        this.loader = false;
      }
    })
  }


  districtfunc2() {
    let district = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "DISTRICT",
          stateid: this.editObj.PermanentState
        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(district), 'districtfunc2');

    this.api.post('index', district).subscribe((res: any) => {
      this.loader = false;
      if (res.code == 200) {

        this.filtereddistrict2 = res.results.data
        this.form.patchValue({
          duplicateContact:
          {
            district: this.editObj.PermanentDistrict
          },
        });

        this.searchdistrict2 = this.filtereddistrict2.slice();
        this.form.updateValueAndValidity();
        this.count++;
        this.loader = false;
      }
    })
  }


  getPresentDistrict2(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentDistrict2');

    this.presentDistrict2 = [];


    this.form.get(['duplicateContact', 'district']).setValue('')
    // this.form.get(['billingAddress', 'presentaddresspincode']).setValue('')


    this.presentDistrict2 = [];
    this.filtereddistrict2 = [];
    this.distvar2 = [];
    this.searchdistrict2 = [];


    this.presentPincode2 = [];
    this.filtereddPincode2 = [];
    this.zipvar2 = [];
    this.searchzipcode2 = [];





    this.common.getLocation(event, 'District').subscribe(res => {
      this.presentDistrict2 = res
      this.filtereddistrict2 = res;
      this.distvar2 = res;

      this.searchdistrict2 = this.filtereddistrict2.slice();


    })
  }

  getPresentDistrict(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentDistrict');

    this.presentDistrict = [];



    this.form.get(['presentContact', 'district']).setValue('')
    // this.form.get(['presentContact', 'presentaddresspincode']).setValue('')

    this.presentDistrict = []
    this.filtereddistrict = []
    this.distvar = []
    this.searchdistrict = []

    this.presentPincode = [];
    this.filtereddPincode = [];
    this.zipvar = [];
    this.searchzipcode = [];

    this.common.getLocation(event, 'District').subscribe(res => {
      this.presentDistrict = res
      this.filtereddistrict = res;
      this.distvar = res;

      this.searchdistrict = this.filtereddistrict.slice();


    })
  }


  getPresentPincode2(event) {


    // this.form.get(['billingAddress', 'presentaddresspincode']).setValue('')


    this.presentPincode2 = [];
    this.filtereddPincode2 = [];
    this.zipvar2 = [];
    this.searchzipcode2 = [];


    this.common.getLocation(event, 'Pincode').subscribe(res => {
      this.presentPincode2 = res;
      this.filtereddPincode2 = res;
      this.zipvar2 = res;


      this.searchzipcode2 = this.filtereddPincode2.slice();
    })

    let obj = {
      data: {
        spname: 'usp_unfyd_police_stn',
        parameters: {
          flag: 'GET_POLICESTN_BY_DISTRICT',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          district: event
        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(obj), 'getPresentPincode2');

    this.api.post('index', obj).subscribe(res => {
      let Policelist = res.results.data;
      Policelist.forEach(element => {
        this.policeStationlist2.push({ policeStationName: element['Police Station Name'], Id: element['Actionable'] })
      });
    })

  }

  zipcodefunc() {
    let zipcode = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "ZIPCODES",
          districtid: this.editObj.PresentDistrict

        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(zipcode), 'zipcodefunc');

    this.api.post('index', zipcode).subscribe((res: any) => {

      if (res.code == 200) {



        this.filtereddPincode = res.results.data
        this.pincodevar = this.editObj.ShipZipcode;
        let quotepin = '515001'
        let pinwoq = 515001
        let pintostring = pinwoq.toString();
        this.form.patchValue({
          presentContact: {
            pincode: this.editObj.PresentPincode
          },
        });
        this.searchzipcode = this.filtereddPincode.slice();
        this.form.updateValueAndValidity();
        this.count++;

      }
    })
  }

  zipcodefunc2() {
    let zipcode = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "ZIPCODES",
          districtid: this.editObj.PermanentDistrict
        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(zipcode), 'zipcodefunc2');

    this.api.post('index', zipcode).subscribe((res: any) => {
      if (res.code == 200) {

        this.zipvar2 = res;
        this.filtereddPincode2 = res.results.data;
        this.quotevar = "'" + 788001 + "'"
        this.form.patchValue({
          duplicateContact:
          {
            pincode: this.editObj.PermanentPincode

          }
        });
        this.searchzipcode2 = this.filtereddPincode2.slice();
        this.form.updateValueAndValidity();
        this.count++;
      }
    })
  }


  contactCancle() {
    this.router.navigate(['/masters/contact']);
  }



  addToMessage(value, i) {
    this.channelData = this.userChannelName.filter(obj => obj.ChannelId === value)[0];
    console.log(this.channelData, "this.channelData");
    let msg: any;
    if (this.form.value['channeltext'] === null) this.form.value['channeltext'] = ''
    msg = this.form.value['channeltext'] + value;
    this.form.get('channeltext').patchValue(msg);
    this.form.get('channeltext').patchValue(this.channelData.ChannelIcon)
    this.form.get('channeltext').patchValue(this.channelData.ChannelId)
    this.form.get('channeldropdown').patchValue(value);
    this.addAction = false
    this.channelSelected[i] = !this.channelSelected[i]



  }





}
