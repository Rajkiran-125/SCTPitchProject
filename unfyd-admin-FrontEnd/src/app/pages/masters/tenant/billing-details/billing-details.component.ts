import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, masters, timeZones, countryCode, tenantFormSteps, checknull } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { tap, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { element } from 'protractor';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrls: ['./billing-details.component.scss']
})
export class BillingDetailsComponent implements OnInit {
  userDetails: any;
  path: any;
  labelName: any;
  form: FormGroup;
  tenantFormSteps: any;
  loader: boolean = false;
  requestObj: any;
  checked: boolean = false;
  editObj: any;
  count = 0;
  pincodevar: any;
  public isSameAddressControl: FormControl = new FormControl(false);



  masters: any;
  regex: any;
  hawkerFormSteps: string[] = [];
  submittedForm: boolean = false;
  country: any = [];
  presentStates: any = [];
  presentDistrict: any = [];
  presentOthers: boolean = false;
  presentPincode: any = [];
  filteredPresentPincode: Observable<any[]>;
  permanentForm: boolean = true;
  permanentStates: any = [];
  permanentDistrict: any = [];
  permanentOthers: boolean = false;
  permanentPincode: any = [];
  filteredPermanentPincode: Observable<any[]>;
  photoidno: boolean = false;
  selectedPhotoId: any = '';
  whatsappBox: boolean = false;
  policeStationlist: any = [];
  ifSame: boolean = false;
  filterepresentStates = this.presentStates.slice();
  filtereddistrict = this.presentDistrict.slice();
  filtereddPincode = this.presentPincode.slice();
  filterepresentStatesPermanent = this.presentStates.slice();
  filtereddPincodePermanent = this.presentPincode.slice();
  filtereddistrictPermanent = this.presentPincode.slice();
  isActivetextbox: boolean = false;
  userConfig: any
  masterConfig: any;
  addressidno: boolean = false;
  selectedAddressId: any = '';
  isAddressProof: boolean;
  isIDProof: boolean;
  isSignature: boolean;
  PermanentpoliceStationlist: any = [];
  idDocument: any = '';
  addressDocument: any = '';
  signatureDocument: any = '';
  reset: boolean = false;
  statesvar: any = [];
  egvar: any = [];
  distvar: any = [];
  zipvar: any = [];
  country2: any = [];
  presentStates2: any = [];
  statesvar2: any = [];
  filterepresentStates2: any = [];
  presentDistrict2: any = [];
  filtereddistrict2: any = [];
  distvar2: any = [];
  presentPincode2: any = [];
  filtereddPincode2 = this.presentPincode2.slice();
  zipvar2: any = [];
  policeStationlist2: any = [];
  permanentStates2: any = [];
  filterepresentStatesPermanent2: any = [];
  permanentDistrict2: any = [];
  filtereddistrictPermanent2: any = [];
  permanentPincode2: any = [];
  filtereddPincodePermanent2: any = [];
  PermanentpoliceStationlist2: any;
  quotevar: any;
  subscription: Subscription[] = [];
  public countryfilter1 = this.country.slice();
  public searchState = this.filterepresentStates.slice();
  public filteredcountry2 = this.country2.slice();
  public searchstate1 = this.filterepresentStates2.slice();
  sameaddressval: boolean = false;
  public searchdistrict = this.filtereddistrict.slice();
  public searchdistrict2 = this.filtereddistrict2.slice();
  public searchzipcode2 = this.filtereddPincode2.slice();
  public searchzipcode = this.filtereddPincode.slice();

  localizationData: any;
  allowedISD: any = [];
  selectedcountrycode: any;



  EmailRequired: boolean = false;
  visible = true;
  selectable = true;
  // removable = true;
  addOnBlur = true;
  readonly separatorKeysCodesf: number[] = [ENTER, COMMA];


  name = 'Angular 6';
  public separatorKeysCodes = [ENTER, COMMA];
  public emailList = [];
  removable = true;
  rulesForm: FormGroup;
  fb: FormBuilder = new FormBuilder();


  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog) { Object.assign(this, { masters, timeZones, countryCode, tenantFormSteps }); }

  ngOnInit(): void {
    this.common.hubControlEvent('Tenant', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.getSnapShot();

    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.common.setUserConfig(this.userDetails.ProfileType, 'Tenant');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.form = this.formBuilder.group({
      sendingAddress: this.formBuilder.group({
        address: ['', Validators.required],
        presentaddresscountry: ['', Validators.required],
        presentaddressstate: ['', Validators.required],
        presentaddressdistrict: ['', Validators.required],
        presentaddresspincode: ['', [Validators.required, Validators.pattern(regex.pincode)]]
      },
        { validator: [checknull('address')] },

      ),
      billingAddress: this.formBuilder.group({
        address: ['', Validators.required],
        presentaddresscountry: ['', Validators.required],
        presentaddressstate: ['', Validators.required],
        presentaddressdistrict: ['', Validators.required],
        presentaddresspincode: ['', [Validators.required, Validators.pattern(regex.pincode)]]
      },
        { validator: [checknull('address')] },
      ),

      // email: ['', [Validators.required, Validators.pattern(regex.email1)]],
      emails: ['', [Validators.nullValidator]],
      // emails: this.formBuilder.array([]),

    });
    this.path = this.activatedRoute.snapshot.paramMap.get('id');


    if (this.path != "null") {
      this.loader = true;
      var Obj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "GETBYID",
            PROCESSID: this.path
          }
        }
      }
      this.api.post('index', Obj).subscribe((res: any) => {
        if (res.code == 200) {

          this.editObj = res.results.data[0];

          if (this.editObj) {


            this.form.patchValue({
              sendingAddress: {
                presentaddresscountry: this.editObj.ShipCountry
              },
              billingAddress:
              {
                presentaddresscountry: this.editObj.BillCountry
              }
            });

            if (this.editObj.ShipAddress != null) {
              this.statefunc();
              this.districtfunc();
              this.statefunc2();
              this.districtfunc2();
              this.zipcodefunc()
              this.zipcodefunc2();
              this.patchfunc();

            }

            this.loader = false;

          }
        }
      })
    } else {
      this.router.navigate(['/masters/tenant/add'])

    }



    this.isSameAddressControl.valueChanges.pipe(
      distinctUntilChanged(),
      switchMap(isSameAddress => {
        if (isSameAddress) {

          return this.form.get('sendingAddress').valueChanges.pipe(
            startWith(this.form.get('sendingAddress').value),
            tap(value =>
              this.form.get('billingAddress').setValue(value)
            )
          )
        } else {
          this.form
            .get('billingAddress')
            .reset();

          return EMPTY;
        }
      })
    )
      .subscribe();


    this.common.hubControlEvent('Tenant', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');


  }



  openedChange(opened: boolean) {
    this.common.hubControlEvent('Tenant', 'click', 'pageloadend', 'pageloadend', opened, 'openedChange');
  }





  statefunc() {
    let state = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "STATES",
          countryid: this.editObj.ShipCountry
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
          sendingAddress: {
            presentaddressstate: this.editObj.ShipState
          },
        });
        this.searchState = this.filterepresentStates.slice();
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
          stateid: this.editObj.ShipState
        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(district), 'districtfunc');
    this.api.post('index', district).subscribe((res: any) => {
      if (res.code == 200) {
        this.filtereddistrict = res.results.data
        this.form.patchValue({
          sendingAddress: {
            presentaddressdistrict: this.editObj.ShipDistrict
          },
        });
        this.searchdistrict = this.filtereddistrict.slice();
        this.form.updateValueAndValidity();
        this.count++;
        this.loader = false;
      }
    })
  }

  zipcodefunc() {
    let zipcode = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "ZIPCODES",
          districtid: this.editObj.ShipDistrict
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
          sendingAddress: {
            presentaddresspincode: this.editObj.ShipZipcode.toString()
          },
        });
        this.searchzipcode = this.filtereddPincode.slice();
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
          countryid: this.editObj.BillCountry
        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(state), 'statefunc2');

    this.api.post('index', state).subscribe((res: any) => {
      if (res.code == 200) {
        this.filterepresentStates2 = res.results.data
        this.form.patchValue({
          billingAddress:
          {
            presentaddressstate: this.editObj.BillState
          }
        });
        this.searchstate1 = this.filterepresentStates2.slice();
        this.form.updateValueAndValidity();
        this.count++;
      }
    })
  }


  districtfunc2() {
    let district = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "DISTRICT",
          stateid: this.editObj.BillState
        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(district), 'districtfunc2');

    this.api.post('index', district).subscribe((res: any) => {
      this.loader = false;
      if (res.code == 200) {
        this.filtereddistrict2 = res.results.data
        this.form.patchValue({
          billingAddress:
          {
            presentaddressdistrict: this.editObj.BillDistrict
          },
        });
        this.searchdistrict2 = this.filtereddistrict2.slice();
        this.form.updateValueAndValidity();
        this.count++;
        this.loader = false;
      }
    })
  }

  zipcodefunc2() {
    let zipcode = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "ZIPCODES",
          districtid: this.editObj.BillDistrict
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
          billingAddress:
          {
            presentaddresspincode: this.editObj.BillZipcode.toString()
          }
        });
        this.searchzipcode2 = this.filtereddPincode2.slice();
        this.form.updateValueAndValidity();
        this.count++;
      }
    })
  }


  patchfunc() {
    this.common.hubControlEvent('Tenant', 'click', '', '', '', 'patchfunc');

    if (this.count = 4) {
      this.checked = this.editObj.SameShipAddress;
      if (this.checked == true) {
        this.permanentForm = false
      }
      this.form.patchValue({
        sendingAddress: {
          address: this.editObj.ShipAddress,
        },
        billingAddress:
        {
          address: this.editObj.BillAddress,
        },
        // email: this.editObj.RecipientEmailID
      });
      this.form.controls.emails.patchValue(this.editObj.RecipientEmailID.split(','))
      this.form.updateValueAndValidity();
      this.count++;
    }
  }










  SamevalueStatus() {
    this.common.hubControlEvent('Tenant', 'click', '', '', '', 'SamevalueStatus');
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Tenant', 'click', '', '', data, 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Tenant', data)
    this.subscription.push(this.common.getLabelConfig$.subscribe(data => {

      this.labelName = data;
    }));
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('Tenant', 'click', '', '', '', 'getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });
    this.getCountryLocalization()
    this.getCountries('', 'Country');
    this.getCountries2('', 'Country');

  }






  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('Tenant', 'click', 'back', 'back', '', 'back');

    this.location.back()
  }

  changetext() {
    this.common.hubControlEvent('Tenant', 'click', '', '', '', 'changetext');

    this.form.value('address')
  }
















  samePresentAddPermanent(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', event, 'samePresentAddPermanent');

    this.sameaddressval = event;
    if (event == true) {
      this.checked = true;
      this.permanentForm = false;
      this.form.get(['billingAddress', 'address']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddresscountry']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddressstate']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddressdistrict']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddresspincode']).setValidators(Validators.nullValidator);

      this.form.get(['billingAddress', 'address']).setValue(this.form.value.sendingAddress.address)
      this.form.get(['billingAddress', 'presentaddresscountry']).setValue(this.form.value.sendingAddress.presentaddresscountry)
      this.form.get(['billingAddress', 'presentaddressstate']).setValue(this.form.value.sendingAddress.presentaddressstate)
      this.form.get(['billingAddress', 'presentaddressdistrict']).setValue(this.form.value.sendingAddress.presentaddressdistrict)
      this.form.get(['billingAddress', 'presentaddresspincode']).setValue(this.form.value.sendingAddress.presentaddresspincode)
    } else {
      this.permanentForm = true;


      this.form.get(['billingAddress', 'address']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddresscountry']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddressstate']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddressdistrict']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddresspincode']).setValidators([Validators.required, Validators.pattern(regex.pincode)]);

      this.form.get(['billingAddress', 'address']).setValue('')
      this.form.get(['billingAddress', 'presentaddresscountry']).setValue('')
      this.form.get(['billingAddress', 'presentaddressstate']).setValue('')
      this.form.get(['billingAddress', 'presentaddressdistrict']).setValue('')
      this.form.get(['billingAddress', 'presentaddresspincode']).setValue('')
    }
    this.form.updateValueAndValidity();
  }







  changeValue(value) {
    this.common.hubControlEvent('Tenant', 'click', '', '', value, 'changeValue');

    this.checked = !value;
  }

  billsave() {
    let emailval: any = [];
    this.emailList.forEach(element => {
      emailval.push(element.value);
    })
    // console.log('emailval',emailval);
    let finalemalVal = emailval.join()

    // console.log('finalemalVal',finalemalVal);

    // return;

    if (this.form.get('emails').hasError('incorrectEmail')) {
      return;
    }
    if (this.form.get('emails').hasError('sameEmail')) {
      return;
    }

    if (this.form.value.emails.length == 0) {
      this.EmailRequired = true;
      return;
    } else {
      this.EmailRequired = false;
    }




    if (this.form.invalid) {
      // console.log('this.form',this.form);


      if (this.form.controls['email'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'email' + '"]');

        invalidControl.focus();

      }

      if (this.form.controls.sendingAddress.get('address').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "address" + '"]');
        this.form.controls.sendingAddress.get('address').markAsTouched();
        invalidControl.focus();
      }

      if (this.form.controls.sendingAddress.get('presentaddresscountry').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddresscountry" + '"]');
        this.form.controls.sendingAddress.get('presentaddresscountry').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.sendingAddress.get('presentaddressstate').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddressstate" + '"]');
        this.form.controls.sendingAddress.get('presentaddressstate').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.sendingAddress.get('presentaddressdistrict').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddressdistrict" + '"]');
        this.form.controls.sendingAddress.get('presentaddressdistrict').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.sendingAddress.get('presentaddresspincode').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddresspincode" + '"]');
        this.form.controls.sendingAddress.get('presentaddresspincode').markAsTouched();
        invalidControl.focus();
      }









      if (this.form.controls.billingAddress.get('address').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "address" + '"]');
        this.form.controls.billingAddress.get('address').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.billingAddress.get('presentaddresscountry').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddresscountry" + '"]');
        this.form.controls.billingAddress.get('presentaddresscountry').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.billingAddress.get('presentaddressstate').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddressstate" + '"]');
        this.form.controls.billingAddress.get('presentaddressstate').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.billingAddress.get('presentaddressdistrict').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddressdistrict" + '"]');
        this.form.controls.billingAddress.get('presentaddressdistrict').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.billingAddress.get('presentaddresspincode').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddresspincode" + '"]');
        this.form.controls.billingAddress.get('presentaddresspincode').markAsTouched();
        invalidControl.focus();
      }


      this.form.markAsTouched();

      // this.common.snackbar("General Error");
      return;
    }


    if (this.path == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "INSERT",

            FirstName: this.form.value.firstname,
            lastname: this.form.value.lastname,
            designation: this.form.value.designation,
            ProcessName: this.form.value.companyname,
            employeestrength: this.form.value.employeestrength,
            ShortCode: this.form.value.domainshortcode,
            country: this.form.value.country,
            countrycode: this.form.value.countrycode,
            MobileNo: this.form.value.phoneno,
            // emailid: this.form.value.emailid,
            emailid: this.form.value.emails.length > 0 ? this.form.value.emails.join(',') : "",
            contracttype: this.form.value.contracttype,
            startDate: this.form.value.startDate,
            endDate: this.form.value.endDate
          }
        }
      }

    }
    else {

      if (this.form.value.sendingAddress.address == '' ||
        this.form.value.sendingAddress.presentaddresscountry == '' ||
        this.form.value.sendingAddress.presentaddresspincode == '' ||
        this.form.value.sendingAddress.presentaddressdistrict == '' ||
        this.form.value.sendingAddress.presentaddressstate == '' ||
        this.form.value.billingAddress.address == '' ||
        this.form.value.billingAddress.presentaddresscountry == '' ||
        this.form.value.billingAddress.presentaddresspincode == '' ||
        this.form.value.billingAddress.presentaddressdistrict == '' ||
        this.form.value.billingAddress.presentaddressstate == ''
        // this.form.value.emails== ''
      ) {
        this.common.snackbar("Fill all fields");
      }
      else {


        this.requestObj = {
          data: {
            spname: "usp_unfyd_tenant",
            parameters: {
              flag: "UPDATE",
              SAMESHIPADDRESS: this.sameaddressval,
              SHIPADDRESS: this.form.value.sendingAddress.address == null ? null : this.form.value.sendingAddress.address.trim(),
              SHIPCOUNTRY: this.form.value.sendingAddress.presentaddresscountry,
              SHIPZIPCODE: this.form.value.sendingAddress.presentaddresspincode,
              SHIPDISTRICT: this.form.value.sendingAddress.presentaddressdistrict,
              SHIPSTATE: this.form.value.sendingAddress.presentaddressstate,
              BILLADDRESS: this.form.value.billingAddress.address == null ? null : this.form.value.billingAddress.address.trim(),
              BILLCOUNTRY: this.form.value.billingAddress.presentaddresscountry,
              BILLZIPCODE: this.form.value.billingAddress.presentaddresspincode,
              BILLDISTRICT: this.form.value.billingAddress.presentaddressdistrict,
              BILLSTATE: this.form.value.billingAddress.presentaddressstate,
              RECIPIENTEMAILID: this.form.value.emails.length > 0 ? this.form.value.emails.join(',') : "",
              // RECIPIENTEMAILID:  this.form.value.email,
              PROCESSID: this.editObj.ProcessId,

              FirstName: this.editObj.FirstName,
              LastName: this.editObj.LastName,
              designation: this.editObj.Designation,
              ProcessName: this.editObj.ProcessName,
              employeestrength: this.editObj.EmployeeStrength,
              ShortCode: this.editObj.ShortCode,
              country: this.editObj.Country,
              countrycode: this.editObj.CountryCode,
              MobileNo: this.editObj.MobileNo,
              emailid: this.editObj.EmailId,
              contracttype: this.editObj.ContractType,
              startDate: this.editObj.StartDate,
              endDate: this.editObj.EndDate,

              AllowLOB: this.editObj.AllowLOB,
              Address: this.editObj.Address,
              ArchiveConnectionString: this.editObj.ArchiveConnectionString,
              BrowserName: this.editObj.BrowserName,
              BrowserVersion: this.editObj.BrowserVersion,
              CampaignCount: this.editObj.CampaignCount,
              ChannelMapped: this.editObj.ChannelMapped,
              CompanyName: this.editObj.CompanyName,
              ConnectionString: this.editObj.ConnectionString,
              CopyDataMst: this.editObj.CopyDataMst,
              CreateDB: this.editObj.CreateDB,
              CreatedBy: this.editObj.CreatedBy,
              CreatedOn: this.editObj.CreatedOn,
              DailyTransLimit: this.editObj.DailyTransLimit,
              DeletedBy: this.editObj.DeletedBy,
              DeletedOn: this.editObj.DeletedOn,
              EmailIDverified: this.editObj.EmailIDverified,
              IP: this.editObj.IP,
              IsDeleted: this.editObj.IsDeleted,
              LanguageMapped: this.editObj.LanguageMapped,
              LicenseGenerated: this.editObj.LicenseGenerated,
              LicenseUpload: this.editObj.LicenseUpload,
              LinkUrl: this.editObj.LinkUrl,
              Mobilenoverified: this.editObj.Mobilenoverified,
              ModifiedBy: this.editObj.ModifiedBy,
              ModifiedOn: this.editObj.ModifiedOn,
              ModuleId: this.editObj.ModuleId,
              Name: this.editObj.Name,
              ParentProcessId: this.editObj.ParentProcessId,
              PrivateIP: this.editObj.PrivateIP,
              ProcessStatus: this.editObj.ProcessStatus,
              PublicIP: this.editObj.PublicIP,
              TimezoneOffset: this.editObj.TimezoneOffset,
              Website: this.editObj.Website,





            }
          }
        }



      }

      this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(this.requestObj), 'billsave');

      this.api.post('index', this.requestObj).subscribe((res: any) => {

        if (res.code == 200) {

          this.router.navigate(['masters/tenant/upload-license', this.path == null ? res.results.data[0].ProcessId : this.path]);
          this.common.snackbar("Saved Success");
          this.common.sendCERequest('UPDATETENANT', this.userDetails.Processid)
        } else {
          this.common.snackbar(res.results.data[0]);
        }
      },
        (error) => {
          this.common.snackbar("General Error");
        })



    }

  }






  getCountries(event, type) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event, type), 'billsave');

    this.common.getLocation(event, type).subscribe(res => {
      this.country = res;
      this.countryfilter1 = this.country.slice();
      this.getCountryLocalization()
      // this.form.patchValue({ sendingAddress: { 'presentaddresscountry': this.country[0].CountryID } })
      // this.form.patchValue({ sendingAddress: { 'permanentaddresscountry': this.country[0].CountryID } })

    })
  }

  getPresentStates(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentStates');

    this.presentStates = [];

    this.form.get(['sendingAddress', 'presentaddressstate']).setValue('')
    this.form.get(['sendingAddress', 'presentaddressdistrict']).setValue('')
    this.form.get(['sendingAddress', 'presentaddresspincode']).setValue('')

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

  getPresentDistrict(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentDistrict');

    this.presentDistrict = [];



    this.form.get(['sendingAddress', 'presentaddressdistrict']).setValue('')
    this.form.get(['sendingAddress', 'presentaddresspincode']).setValue('')

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

  getPresentPincode(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentPincode');

    this.form.get(['sendingAddress', 'presentaddresspincode']).setValue('');


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

  filterPresentPincode(value) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(value), 'filterPresentPincode');

    return this.presentPincode.filter(data => data.Pincode.indexOf(value) === 0);
  }

  getPermanentStates(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPermanentStates');

    this.permanentStates = [];
    this.common.getLocation(event, 'State').subscribe(res => {
      this.permanentStates = res
      this.filterepresentStatesPermanent = res;
    })
  }

  getPermanentDistrict(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPermanentDistrict');

    this.permanentDistrict = [];
    this.common.getLocation(event, 'District').subscribe(res => {
      this.permanentDistrict = res
      this.filtereddistrictPermanent = res;
    })
  }

  getPermanentPincode(event) {

    this.form.get(['sendingAddress', 'presentaddresspincode']).setValue('');
    this.common.getLocation(event, 'Pincode').subscribe(res => {
      this.permanentPincode = res;
      this.filtereddPincodePermanent = res;
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
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(obj), 'getPermanentPincode');

    this.api.post('index', obj).subscribe(res => {
      let Policelist = res.results.data;
      Policelist.forEach(element => {
        this.PermanentpoliceStationlist.push({ policeStationName: element['Police Station Name'] + ' -- ' + element['PIN Code'], Id: element['Actionable'] })
      });
    })

  }

  filterPermanentPincode(value) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(value), 'filterPermanentPincode');

    return this.permanentPincode.filter(data => data.Pincode.indexOf(value) === 0);
  }







  getCountries2(event, type) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event, type), 'getCountries2');

    this.common.getLocation(event, type).subscribe(res => {
      this.country2 = res;
      this.filteredcountry2 = this.country2.slice();
      // this.form.patchValue({ billingAddress: { 'presentaddresscountry': this.country2[0].CountryID } })
      // this.form.patchValue({ billingAddress: { 'permanentaddresscountry': this.country2[0].CountryID } })
    })
  }

  getPresentStates2(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentStates2');

    this.presentStates2 = [];


    this.form.get(['billingAddress', 'presentaddressstate']).setValue('')
    this.form.get(['billingAddress', 'presentaddressdistrict']).setValue('')
    this.form.get(['billingAddress', 'presentaddresspincode']).setValue('')



    this.presentStates2 = []
    this.filterepresentStates2 = [];
    this.statesvar2 = [];
    this.searchstate1 = [];


    this.presentDistrict2 = [];
    this.filtereddistrict2 = [];
    this.distvar2 = [];
    this.searchdistrict2 = [];


    this.presentPincode2 = [];
    this.filtereddPincode2 = [];
    this.zipvar2 = [];
    this.searchzipcode2 = [];


    this.common.getLocation(event, 'State').subscribe(res => {
      this.presentStates2 = res
      this.filterepresentStates2 = res;
      this.statesvar2 = res;

      this.searchstate1 = this.filterepresentStates2.slice();
    })
  }

  getPresentDistrict2(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPresentDistrict2');

    this.presentDistrict2 = [];


    this.form.get(['billingAddress', 'presentaddressdistrict']).setValue('')
    this.form.get(['billingAddress', 'presentaddresspincode']).setValue('')


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

  getPresentPincode2(event) {


    this.form.get(['billingAddress', 'presentaddresspincode']).setValue('')


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

  filterPresentPincode2(value) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(value), 'filterPresentPincode2');

    return this.presentPincode2.filter(data => data.Pincode.indexOf(value) === 0);
  }

  getPermanentStates2(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPermanentStates2');

    this.permanentStates2 = [];
    this.common.getLocation(event, 'State').subscribe(res => {
      this.permanentStates2 = res
      this.filterepresentStatesPermanent2 = res;
    })
  }

  getPermanentDistrict2(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'getPermanentDistrict2');

    this.permanentDistrict2 = [];
    this.common.getLocation(event, 'District').subscribe(res => {
      this.permanentDistrict2 = res
      this.filtereddistrictPermanent2 = res;
    })
  }

  getPermanentPincode2(event) {

    this.form.get(['billingAddress', 'presentaddresspincode']).setValue('');
    this.common.getLocation(event, 'Pincode').subscribe(res => {
      this.permanentPincode2 = res;
      this.filtereddPincodePermanent2 = res;
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
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(obj), 'getPermanentPincode2');

    this.api.post('index', obj).subscribe(res => {
      let Policelist = res.results.data;
      Policelist.forEach(element => {
        this.PermanentpoliceStationlist2.push({ policeStationName: element['Police Station Name'] + ' -- ' + element['PIN Code'], Id: element['Actionable'] })
      });
    })

  }

  filterPermanentPincode2(value) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(value), 'filterPermanentPincode2');

    return this.permanentPincode2.filter(data => data.Pincode.indexOf(value) === 0);
  }







  mobileDeviceChange(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'mobileDeviceChange');

    this.form.get('handsetmodel').setValue(event);
    this.form.updateValueAndValidity();
  }

  photoIdProofChange(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'photoIdProofChange');

    this.photoidno = true;
    this.selectedPhotoId = event
    if (this.selectedPhotoId == 'Aadhaar Card') {
      this.form.get('photoidproofnum').setValidators([Validators.required, Validators.pattern(regex.aadhaar)]);
    }
    if (this.selectedPhotoId == 'Passport') {
      this.form.get('photoidproofnum').setValidators([Validators.required, Validators.pattern(regex.passport)]);
    }
    if (this.selectedPhotoId == 'Driving Licence') {
      this.form.get('photoidproofnum').setValidators([Validators.required, Validators.pattern(regex.drivingLicence)]);
    }
    if (this.selectedPhotoId == 'PAN Card') {
      this.form.get('photoidproofnum').setValidators([Validators.required, Validators.pattern(regex.pan)]);
    }
    this.form.get('photoidproofnum').setValue('');
    this.form.updateValueAndValidity();
  }

  checkWhatsapp(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'checkWhatsapp');

    if (event == true) {
      this.whatsappBox = true;
      this.form.controls['whatsappnumber'].setValidators([Validators.required, Validators.pattern(regex.mobile)])
    } else {
      this.whatsappBox = false;
      this.form.controls['whatsappnumber'].setValidators(Validators.nullValidator)
    }
    this.form.controls['whatsappnumber'].setValue('');
    this.form.updateValueAndValidity();
  }

  checkSameMobleNo(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'checkSameMobleNo');

    if (event == true) {
      this.isActivetextbox = true;
      this.form.get('whatsappnumber').setValue(this.form.value.mobileno);
    } else {
      this.isActivetextbox = false;
      this.form.controls['whatsappnumber'].setValue('');
    }
  }

  numericOnly(event: any): boolean {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'numericOnly');

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43 ||
      charCode === 33 || charCode === 35 || charCode === 47 || charCode === 36 ||
      charCode === 37 || charCode === 38 || charCode === 40 || charCode === 41 || charCode === 42
      || charCode > 47 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (event.target.value.length >= 20) {
      return false;
    }
    return true;
  }
  addressProofChange(event) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'addressProofChange');

    this.addressidno = true;
    this.selectedAddressId = event
    if (this.selectedAddressId == 'Aadhaar Card') {
      this.form.get('addressproofnum').setValidators([Validators.required, Validators.pattern(regex.aadhaar)]);
    }
    if (this.selectedAddressId == 'Passport') {
      this.form.get('addressproofnum').setValidators([Validators.required, Validators.pattern(regex.passport)]);
    }
    if (this.selectedAddressId == 'Gas Bill') {
      this.form.get('addressproofnum').setValidators([Validators.required]);
    }
    if (this.selectedAddressId == 'Electricity Bill') {
      this.form.get('addressproofnum').setValidators([Validators.required]);
    }
    if (this.selectedAddressId == 'Voters Card') {
      this.form.get('addressproofnum').setValidators([Validators.required]);
    }

    this.form.get('addressproofnum').setValue('');
    this.form.updateValueAndValidity();
  }

  uploadDocument(event, imgData, category) {
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(event), 'uploadDocument');

    var data = {
      flag: imgData !== '' ? 'UPDATE' : 'INSERT',
      documentId: imgData !== '' ? imgData.Actionable : '',
      category: category,
      createdby: imgData !== '' ? imgData['Created By'] : this.userDetails.Id,
      modifiedby: imgData !== '' ? this.userDetails.Id : null,
      hawkerid: this.path,
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
      contactid: this.path,
    }
    this.common.setSingleImage(data)
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(val, type), 'viewDocument');

  }


  emailValidation: boolean = false;

  blocklist(event) {
    let obj = {
      data: {
        spname: 'usp_unfyd_block_list',
        parameters: {
          flag: 'CHECK_DATA_EXISTS',
          blocklist: event?.target?.value
        }
      }
    }
    this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(obj), 'blocklist');

    this.api.post('index', obj).subscribe(res => {
      var emailStatus = res.results.data[0].result
      if (emailStatus == 1) {
        this.emailValidation = true
      } else {
        this.emailValidation = false
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    var regex1 = new RegExp(regex.email1);
    if (!regex1.test(value)) {
      this.form.controls['emails'].setErrors({ incorrectEmail: true });
      return;
    }
    else if (this.form.value.emails.length > 0) {
      const totalSelected = this.form.controls['emails'].value
      const hasDuplicate = totalSelected.some((e, index) => {
        if (e === value) {
          this.form.controls['emails'].setErrors({ sameEmail: true });
          this.form.markAllAsTouched()
          return hasDuplicate ? { duplicate: true } : null;
        }
      });
    }
    let val = this.form.value.emails ? this.form.value.emails : []
    if (value) {
      val.push(value);
      // delete this.form.get('emails').errors['sameEmail'];
      this.form.controls['emails'].setErrors(null)
      this.form.controls['emails'].clearValidators();
    }
    this.form.controls['emails'].patchValue(val)
    event.chipInput!.clear();
  }
  removeEmail(data: any): void {
    let val = this.form.value.sendto
    const index = val.indexOf(data);
    if (index >= 0) {
      val.splice(index, 1);
    }
    this.form.controls['sendto'].patchValue(val)

    if (val.length == 0) {
      delete this.form.get('emails').errors['incorrectEmail'];
      delete this.form.get('emails').errors['sameEmail'];
      this.form.controls['emails'].setErrors(null)
      this.form.controls['emails'].clearValidators();
    }

  }


  RemoveEmailRequired() {
    this.EmailRequired = false;
  }











  savefunction() {

    let emailval: any = [];
    this.emailList.forEach(element => {
      emailval.push(element.value);
    })
    // console.log('emailval',emailval);
    let finalemalVal = emailval.join()

    // console.log('finalemalVal',finalemalVal);


    if (this.form.get('emails').hasError('incorrectEmail')) {
      return;
    }
    if (this.form.get('emails').hasError('sameEmail')) {
      return;
    }
    if (this.emailList.length == 0) {
      this.EmailRequired = true;
      return;
    } else {
      this.EmailRequired = false;
    }

    if (this.form.invalid) {
      // console.log('this.form',this.form);


      if (this.form.controls['email'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'email' + '"]');

        invalidControl.focus();

      }

      if (this.form.controls.sendingAddress.get('address').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "address" + '"]');
        this.form.controls.sendingAddress.get('address').markAsTouched();
        invalidControl.focus();
      }

      if (this.form.controls.sendingAddress.get('presentaddresscountry').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddresscountry" + '"]');
        this.form.controls.sendingAddress.get('presentaddresscountry').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.sendingAddress.get('presentaddressstate').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddressstate" + '"]');
        this.form.controls.sendingAddress.get('presentaddressstate').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.sendingAddress.get('presentaddressdistrict').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddressdistrict" + '"]');
        this.form.controls.sendingAddress.get('presentaddressdistrict').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.sendingAddress.get('presentaddresspincode').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddresspincode" + '"]');
        this.form.controls.sendingAddress.get('presentaddresspincode').markAsTouched();
        invalidControl.focus();
      }









      if (this.form.controls.billingAddress.get('address').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "address" + '"]');
        this.form.controls.billingAddress.get('address').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.billingAddress.get('presentaddresscountry').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddresscountry" + '"]');
        this.form.controls.billingAddress.get('presentaddresscountry').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.billingAddress.get('presentaddressstate').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddressstate" + '"]');
        this.form.controls.billingAddress.get('presentaddressstate').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.billingAddress.get('presentaddressdistrict').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddressdistrict" + '"]');
        this.form.controls.billingAddress.get('presentaddressdistrict').markAsTouched();
        invalidControl.focus();
      }
      if (this.form.controls.billingAddress.get('presentaddresspincode').invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "presentaddresspincode" + '"]');
        this.form.controls.billingAddress.get('presentaddresspincode').markAsTouched();
        invalidControl.focus();
      }


      this.form.markAsTouched();

      // this.common.snackbar("General Error");
      return;
    }

    if (this.path == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "INSERT",

            FirstName: this.form.value.firstname,
            lastname: this.form.value.lastname,
            designation: this.form.value.designation,
            ProcessName: this.form.value.companyname,
            employeestrength: this.form.value.employeestrength,
            ShortCode: this.form.value.domainshortcode,
            country: this.form.value.country,
            countrycode: this.form.value.countrycode,
            MobileNo: this.form.value.phoneno,
            // emailid: this.form.value.emailid,
            emailid: finalemalVal,
            contracttype: this.form.value.contracttype,
            startDate: this.form.value.startDate,
            endDate: this.form.value.endDate
          }
        }
      }

    }
    else {


      this.requestObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "UPDATE",
            SAMESHIPADDRESS: this.sameaddressval,
            SHIPADDRESS: this.form.value.sendingAddress.address,
            SHIPCOUNTRY: this.form.value.sendingAddress.presentaddresscountry,
            SHIPZIPCODE: this.form.value.sendingAddress.presentaddresspincode,
            SHIPDISTRICT: this.form.value.sendingAddress.presentaddressdistrict,
            SHIPSTATE: this.form.value.sendingAddress.presentaddressstate,
            BILLADDRESS: this.form.value.billingAddress.address,
            BILLCOUNTRY: this.form.value.billingAddress.presentaddresscountry,
            BILLZIPCODE: this.form.value.billingAddress.presentaddresspincode,
            BILLDISTRICT: this.form.value.billingAddress.presentaddressdistrict,
            BILLSTATE: this.form.value.billingAddress.presentaddressstate,

            RECIPIENTEMAILID: finalemalVal,
            // RECIPIENTEMAILID:  this.form.value.email,
            PROCESSID: this.editObj.ProcessId,

            AllowLOB: this.editObj.AllowLOB,

            FirstName: this.editObj.FirstName,
            LastName: this.editObj.LastName,
            designation: this.editObj.Designation,
            ProcessName: this.editObj.ProcessName,
            employeestrength: this.editObj.EmployeeStrength,
            ShortCode: this.editObj.ShortCode,
            country: this.editObj.Country,
            countrycode: this.editObj.CountryCode,
            MobileNo: this.editObj.MobileNo,
            emailid: this.editObj.EmailId,
            contracttype: this.editObj.ContractType,
            startDate: this.editObj.StartDate,
            endDate: this.editObj.EndDate,

            Address: this.editObj.Address,
            ArchiveConnectionString: this.editObj.ArchiveConnectionString,
            BrowserName: this.editObj.BrowserName,
            BrowserVersion: this.editObj.BrowserVersion,
            CampaignCount: this.editObj.CampaignCount,
            ChannelMapped: this.editObj.ChannelMapped,
            CompanyName: this.editObj.CompanyName,
            ConnectionString: this.editObj.ConnectionString,
            CopyDataMst: this.editObj.CopyDataMst,
            CreateDB: this.editObj.CreateDB,
            CreatedBy: this.editObj.CreatedBy,
            CreatedOn: this.editObj.CreatedOn,
            DailyTransLimit: this.editObj.DailyTransLimit,
            DeletedBy: this.editObj.DeletedBy,
            DeletedOn: this.editObj.DeletedOn,
            EmailIDverified: this.editObj.EmailIDverified,
            IP: this.editObj.IP,
            IsDeleted: this.editObj.IsDeleted,
            LanguageMapped: this.editObj.LanguageMapped,
            LicenseGenerated: this.editObj.LicenseGenerated,
            LicenseUpload: this.editObj.LicenseUpload,
            LinkUrl: this.editObj.LinkUrl,
            Mobilenoverified: this.editObj.Mobilenoverified,
            ModifiedBy: this.editObj.ModifiedBy,
            ModifiedOn: this.editObj.ModifiedOn,
            ModuleId: this.editObj.ModuleId,
            Name: this.editObj.Name,
            ParentProcessId: this.editObj.ParentProcessId,
            PrivateIP: this.editObj.PrivateIP,
            ProcessStatus: this.editObj.ProcessStatus,
            PublicIP: this.editObj.PublicIP,
            TimezoneOffset: this.editObj.TimezoneOffset,
            Website: this.editObj.Website,





          }
        }
      }




      this.common.hubControlEvent('Tenant', 'click', '', '', JSON.stringify(this.requestObj), 'savefunction');

      this.api.post('index', this.requestObj).subscribe((res: any) => {
        if (res.code == 200) {
          this.common.snackbar("Saved Success");
          this.common.sendCERequest('UPDATETENANT', this.userDetails.Processid)
        } else {
          this.common.snackbar(res.results.data[0]);
        }
      },
        (error) => {
          this.common.snackbar("General Error");
        })



    }









  }




  getCountryLocalization() {

    this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {
      this.localizationData = res1;
      // if (this.localizationDataAvailble) {
      if ((this.localizationData.allowedISD).length > 0) {
        this.allowedISD = this.localizationData.allowedISD.split(",")
        if (this.path) {
          if (this.localizationData.numberFormat == '+91') {
            this.country.forEach(element12 => {
              if (element12.CountryCode == '91') {

                // this.form.patchValue({ sendingAddress: { 'presentaddresscountry': parseInt(element12?.CountryID) } })
                // this.form.patchValue({sendingAddress:{presentaddresscountry: element12.CountryID.toString()}});
                (<FormGroup>this.form.controls['sendingAddress']).controls['presentaddresscountry'].patchValue(element12.CountryID)
                // this.form.get('sendingAddress').get('presentaddresscountry').patchValue(element12.CountryCode)
                // this.form.patchValue({ sendingAddress: { 'permanentaddresscountry': parseInt(element12?.CountryID) } })
                this.getPresentStates(element12.CountryID)
                this.form.updateValueAndValidity();


                console.log(this.localizationData.numberFormat, "this.localizationData.numberFormat")
                console.log("country:", this.countryfilter1, this.country, this.form.value);
              }
            });
            // this.form.patchValue({
            //   sendingAddress: {
            //     presentaddresscountry: this.editObj.ShipCountry
            //   },
            // this.form.controls.presentaddresscountry.patchValue({ country: '91' });
            // this.getCountries(event, type)
            // this.form.patchValue({sendingAddress:{presentaddresscountry:1}})
            // this.form.patchValue({ sendingAddress: { 'presentaddresscountry': this.country[0].CountryID } })

            //   this.form.patchValue({ sendingAddress: { 'presentaddresscountry': this.country[1].CountryID } })
            //  this.form.patchValue({ sendingAddress: { 'permanentaddresscountry': this.country[1].CountryID } })
            // this.form.updateValueAndValidity();
            this.selectedcountrycode = 91
            // console.log(this.form.value);
          }
        }
      }
      // }
    }))


  }




  // getCountryLocalization() {




  //   this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {

  //     this.localizationData = res1;

  //     // if (this.localizationDataAvailble) {

  //       if ((this.localizationData.allowedISD).length > 0) {

  //         this.allowedISD = this.localizationData.allowedISD.split(",")

  //         if (this.path) {

  //           if (this.localizationData.numberFormat == '+91') {

  //             this.country.forEach(element12 => {

  //               if (element12.CountryCode == '91') {

  //                 this.form.patchValue({ sendingAddress: { 'presentaddresscountry': '91' } })

  //                 this.form.updateValueAndValidity();

  //                 // this.form.patchValue({ sendingAddress: { 'permanentaddresscountry': parseInt(element12?.CountryID) } })

  //               }

  //             });




  //             console.log(this.localizationData.numberFormat, "this.localizationData.numberFormat")




  //             console.log("country:", this.countryfilter1, this.country, this.form.value);




  //             // this.form.patchValue({

  //             //   sendingAddress: {

  //             //     presentaddresscountry: this.editObj.ShipCountry

  //             //   },

  //             // this.form.controls.presentaddresscountry.patchValue({ country: '91' });

  //             // this.getCountries(event, type)

  //             // this.form.patchValue({sendingAddress:{presentaddresscountry:1}})

  //             // this.form.patchValue({ sendingAddress: { 'presentaddresscountry': this.country[0].CountryID } })




  //             //   this.form.patchValue({ sendingAddress: { 'presentaddresscountry': this.country[1].CountryID } })

  //             //  this.form.patchValue({ sendingAddress: { 'permanentaddresscountry': this.country[1].CountryID } })

  //             // this.form.updateValueAndValidity();

  //             this.selectedcountrycode = 91

  //             // console.log(this.form.value);




  //           }





  //         }

  //       }




  //   }))

  // }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }







  backClicked() {
    this.location.back();
  }





  validateArrayNotEmpty(c: FormControl) {
    if (c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false },
      };
    }
    if (c.value.length > 0) {
      return {
        validateArrayNotEmpty: { valid: true },
      };
    }
    return null;
  }

  validateEmail(email) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }





}
