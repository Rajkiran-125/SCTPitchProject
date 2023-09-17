import { DatePipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, masters, timeZones, countryCode, checknull, } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { EMPTY } from 'rxjs';
import { tap, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { log } from 'console';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, deps: [CommonService], useFactory: (common: CommonService) => {
        let a: any = {
          parse: {
            dateInput: 'DD/MM/YYYY', 
          },
          display: {
            dateInput: 'dddd/MMM/YYYY', 
            monthYearLabel: 'MMMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY'
          }
        };
        common.localizationInfo$.subscribe((res1) => {
          a.display.dateInput = res1.selectedDateFormats.toUpperCase()
        })
        common.localizationDataAvailable$.subscribe((res) => {
          if (res) {
            common.localizationInfo$.subscribe((res1) => {
              a.display.dateInput = res1.selectedDateFormats.toUpperCase()
            })
          }
        })
        return a
      }
    }
  ]

})
export class AccountsComponent implements OnInit {
  loader: boolean = false;  
  submittedForm = false;
  userDetails: any;
  path: any;
  requestObj: any;
  labelName: any;
  form: FormGroup;
  todayDate: Date = new Date();
  maxDate = new Date();
  subscription: Subscription[] = [];
  userConfig: any;
  AccId: string;
  country: any = [];
  presentStates: any = [];
  presentDistrict: any = [];
  presentOthers: boolean = false;
  presentPincode: any = [];
  policeStationlist2: any = [];
  statesvar: any = [];
  egvar: any = [];
  distvar: any = [];
  reset: boolean;
  zipvar: any = [];
  country2: any = [];
  pincodevar: any;
  presentStates2: any = [];
  statesvar2: any = [];
  filterepresentStates2: any = [];
  presentDistrict2: any = [];
  filtereddistrict2: any = [];
  distvar2: any = [];
  presentPincode2: any = [];  
  subscriptionAcitivateData: Subscription[] = [];
  checked: boolean = false;
  permanentForm: boolean = true;
  filtereddPincode2 = this.presentPincode2.slice();
  zipvar2: any = [];
  count = 0;
  filterepresentStates = this.presentStates.slice();
  filtereddistrict = this.presentDistrict.slice();
  filtereddPincode = this.presentPincode.slice();
  public isSameAddressControl: FormControl = new FormControl(false);
  public countryfilter1 = this.country.slice();
  public searchState = this.filterepresentStates.slice();
  public filteredcountry2 = this.country2.slice();
  public searchstate1 = this.filterepresentStates2.slice();
  sameaddressval: boolean = false;
  public searchdistrict = this.filtereddistrict.slice();
  public searchdistrict2 = this.filtereddistrict2.slice();
  public searchzipcode2 = this.filtereddPincode2.slice();
  public searchzipcode = this.filtereddPincode.slice();
  editObj: any;
  quotevar: string;
  errorval: boolean= false;  
  contracttype: boolean = false
  validEmail:boolean = false
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private location: Location,
    private el: ElementRef,) { Object.assign(this, { masters, timeZones, countryCode }); }

  ngOnInit(): void {
    // this.common.hubControlEvent('Accounts','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.AccId = this.activatedRoute.snapshot.paramMap.get('id')
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.getSnapShot();
    this.common.setUserConfig(this.userDetails.ProfileType, 'Accounts');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    // this.statefunc();
    // this.districtfunc();
    // this.statefunc2();
    // this.districtfunc2();
    // this.zipcodefunc()
    // this.zipcodefunc2();
    this.form = this.formBuilder.group({
      firstname: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(30), Validators.required]],
      lastname: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(30), Validators.required]],
      designation: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(30), Validators.required]],
      companyname: ['', [Validators.maxLength(30), Validators.required]],
      domainshortcode: ['', Validators.required],
      country: ['',Validators.required],
      emailAddr: ['',Validators.required],
      phoneno: ['', [Validators.pattern(regex.mobile), Validators.required]],
      emailid: ['', [Validators.pattern(regex.email1), Validators.required]],
      startDate: [new Date(), [Validators.required]],
      endDate: ['', [Validators.required]],
      contracttype: ['', [Validators.nullValidator]],
      BillSameAsShipAddress: [''],
      sendingAddress: this.formBuilder.group({
        Building: ['',[Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
        Street: ['',[Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
        Landmark: ['',[Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
        presentaddresscountry: ['', Validators.required],
        presentaddressstate: ['', Validators.required],
        presentaddressdistrict: ['', Validators.required],
        presentaddresspincode: ['', [Validators.required, Validators.pattern(regex.pincode)]]
      },{validator:[checknull('Building'),checknull('Street'), checknull('Landmark'),]}),
      // , {validator:[checknull('Building'),checknull('Street'), checknull('Landmark')]}
      billingAddress: this.formBuilder.group({
        Building: ['',[Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
        Street: ['',[Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
        Landmark: ['',[Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
        presentaddresscountry: ['', Validators.required],
        presentaddressstate: ['', Validators.required],
        presentaddressdistrict: ['', Validators.required],
        presentaddresspincode: ['', [Validators.required, Validators.pattern(regex.pincode)]]
      },{validator:[checknull('Building'),checknull('Street'), checknull('Landmark'),]}),
      // 
      // emailAdd: this.formBuilder.array([
      //   this.newemailAdd()
      // ],
      //   this.isNameDup()
      // ),
    },{validator:[checknull('firstname'),checknull('lastname'), checknull('designation'),checknull('companyname'), checknull('domainshortcode')]});

    if (this.AccId != null) {
      this.loader = true;
      var Obj = {
        data: {
          spname: "usp_unfyd_hub_accounts",
          parameters: {
            flag: "EDIT",
            Id: this.AccId
          }
        }
      }
      this.api.post('index', Obj).subscribe((res: any) => {
        if (res.code == 200) {
          this.reset = true;
          this.editObj = res.results.data[0];
          if (this.editObj) {
            let temp = [];
            // temp = this.editObj?.RecipientEmail.split(':');
            // for (let i = 1; i < temp.length; i++) {
            //   this.addemailAdd();
            // }
            // var arrayControl = this.form.get('emailAdd') as FormArray;
            // arrayControl.controls.forEach((element, index) => {
            //   (arrayControl.at(index) as FormGroup).get('emailAddr').patchValue(temp[index]);
            // });
            
            this.form.controls.emailAddr.patchValue(res.results.data[0].RecipientEmail.split(','))
            this.form.patchValue({
              firstname: this.editObj.FirstName,
              lastname: this.editObj.LastName,
              designation: this.editObj.Designation,
              companyname: this.editObj.CompanyName,
              domainshortcode: this.editObj.DomainShortCode,
              country: Number(this.editObj.Country),
              phoneno: this.editObj.PhoneNo,
              emailid: this.editObj.Email,
              contracttype: this.editObj.ContractType,
              startDate: this.editObj.StartDate,
              endDate: this.editObj.RenewalDate,
              BillSameAsShipAddress: this.editObj.BillSameAsShipAddress,
              sendingAddress: {
                presentaddresscountry: Number(this.editObj.ShipCountry)
              },
              billingAddress:
              {
                presentaddresscountry: Number(this.editObj.BillCountry)
              }
            });

            if (this.editObj.ShipAddress1 != null) {
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
      this.router.navigate(['/masters/accounts/add'])
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
      // this.common.hubControlEvent('Accounts','click','pageloadend','pageloadend','','ngOnInit');

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
    // this.common.hubControlEvent('Accounts','click','','',JSON.stringify(state),'statefunc');

    this.api.post('index', state).subscribe((res: any) => {
      if (res.code == 200) {
        let statesapi = []
        statesapi = res;
        this.statesvar = res.results.data
        this.filterepresentStates = res.results.data
        this.form.patchValue({
          sendingAddress: {
            presentaddressstate: Number(this.editObj.ShipState)
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
    // this.common.hubControlEvent('Accounts','click','','',JSON.stringify(district),'districtfunc');

    this.api.post('index', district).subscribe((res: any) => {
      if (res.code == 200) {
        this.filtereddistrict = res.results.data
        this.form.patchValue({
          sendingAddress: {
            presentaddressdistrict: Number(this.editObj.ShipCity)
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
          districtid: this.editObj.ShipCity
        }
      }
    }
    // this.common.hubControlEvent('Accounts','click','','',JSON.stringify(zipcode),'zipcodefunc');

    this.api.post('index', zipcode).subscribe((res: any) => {
      if (res.code == 200) {
        this.filtereddPincode = res.results.data
        this.pincodevar = this.editObj.ShipPincode;
        let quotepin = '515001'
        let pinwoq = 515001
        let pintostring = pinwoq.toString();
        this.form.patchValue({
          sendingAddress: {
            presentaddresspincode: this.editObj.ShipPincode.toString()
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
    // this.common.hubControlEvent('Accounts','click','','',JSON.stringify(state),'statefunc2');

    this.api.post('index', state).subscribe((res: any) => {
      if (res.code == 200) {

        this.filterepresentStates2 = res.results.data
        this.form.patchValue({
          billingAddress:
          {
            presentaddressstate: Number(this.editObj.BillState)
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
    // this.common.hubControlEvent('Accounts','click','','',JSON.stringify(district),'districtfunc2');

    this.api.post('index', district).subscribe((res: any) => {
      this.loader = false;
      if (res.code == 200) {
        this.filtereddistrict2 = res.results.data;
        this.form.patchValue({
          billingAddress:
          {
            presentaddressdistrict: Number(this.editObj.BillCity)
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
          districtid: this.editObj.BillCity
        }
      }
    }
    // this.common.hubControlEvent('Accounts','click','','',JSON.stringify(zipcode),'zipcodefunc2');

    this.api.post('index', zipcode).subscribe((res: any) => {
      if (res.code == 200) {

        this.zipvar2 = res;
        this.filtereddPincode2 = res.results.data;
        this.quotevar = "'" + 788001 + "'"
        this.form.patchValue({
          billingAddress:
          {
            presentaddresspincode: this.editObj.BillPincode.toString()
          }
        });
        this.searchzipcode2 = this.filtereddPincode2.slice();
        this.form.updateValueAndValidity();
        this.count++;
      }
    })
  }
  button(e) {
   this.contracttype = false
  }

  patchfunc() {
    // this.common.hubControlEvent('Accounts','click','','','','patchfunc');

    if (this.count = 4) {
      this.checked = this.editObj.BillSameAsShipAddress;
      if (this.checked == true) {
        this.permanentForm = false
      }
      this.form.patchValue({
        sendingAddress: {
          Building: this.editObj.ShipAddress1,
          Street: this.editObj.ShipAddress2,
          Landmark: this.editObj.ShipAddress3,
        },
        billingAddress:
        {
          Building: this.editObj.BillAddress1,
          Street: this.editObj.BillAddress2,
          Landmark: this.editObj.BillAddress3,
        },

      });
      this.form.updateValueAndValidity();
      this.count++;
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  back(): void {
    this.router.navigate(['masters/accounts']);
  }
  newemailAdd(): FormGroup {
    return this.formBuilder.group({
      emailAddr: new FormControl('', [ Validators.pattern(regex.email1),Validators.required]),
    });
  }
  emailAdd(): FormArray {
    return this.form.get("emailAdd") as FormArray
  }
  addemailAdd() {
    this.emailAdd().push(this.newemailAdd())
  }
  removeemailAdd(i: number) {
    this.emailAdd().removeAt(i);
    // this.form.updateValueAndValidity()
  }
  cmpare(index) {
    // this.common.hubControlEvent('Accounts','click','','',index,'cmpare');

    return index;
  }  
  setLabelByLanguage(data) {
    // this.common.hubControlEvent('Accounts','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Accounts', data)

  }
  config: any;
  getSnapShot() {
    // this.common.hubControlEvent('Accounts','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, 'Accounts');
      this.subscription.push(
        this.common.getUserConfig$.subscribe(data => {
          this.config = data;
        }))
    });
    this.getCountries('', 'Country');
    this.getCountries2('', 'Country');
  }
  getCountries(event, type) {
    this.common.getLocation(event, type).subscribe(res => {
      this.country = res;
      this.countryfilter1 = this.country.slice();
      // this.form.patchValue({ sendingAddress: { 'presentaddresscountry': this.country[0].CountryID } })
      // this.form.patchValue({ sendingAddress: { 'permanentaddresscountry': this.country[0].CountryID } })

    })
  }
  getCountries2(event, type) {
    // this.common.hubControlEvent('Accounts','click','','',event,'getCountries2');

    this.common.getLocation(event, type).subscribe(res => {
      this.country2 = res;
      this.filteredcountry2 = this.country2.slice();
      // this.form.patchValue({ billingAddress: { 'presentaddresscountry': this.country2[0].CountryID } })
      // this.form.patchValue({ billingAddress: { 'permanentaddresscountry': this.country2[0].CountryID } })
    })
  }

  getPresentStates(event) {
    // this.common.hubControlEvent('Accounts','click','','',event,'getPresentStates');

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
    // this.common.hubControlEvent('Accounts','click','','',event,'getPresentDistrict');

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
    // this.common.hubControlEvent('Accounts','click','','',event,'getPresentPincode');

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
  samePresentAddPermanent(event) {
    // this.common.hubControlEvent('Accounts','click','','',event,'samePresentAddPermanent');


    this.sameaddressval = event;
    if (event == true) {
      this.checked = true;
      this.permanentForm = false;
      this.form.get(['billingAddress', 'Building']).clearValidators()
      this.form.get(['billingAddress', 'Street']).clearValidators()
      this.form.get(['billingAddress', 'Landmark']).clearValidators()
      this.form.get(['billingAddress', 'presentaddresscountry']).clearValidators()
      this.form.get(['billingAddress', 'presentaddressstate']).clearValidators()
      this.form.get(['billingAddress', 'presentaddressdistrict']).clearValidators()
      this.form.get(['billingAddress', 'presentaddresspincode']).clearValidators()
      this.form.get(['billingAddress', 'Building']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'Street']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'Landmark']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddresscountry']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddressstate']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddressdistrict']).setValidators(Validators.nullValidator);
      this.form.get(['billingAddress', 'presentaddresspincode']).setValidators(Validators.nullValidator);

      this.form.get(['billingAddress', 'Building']).setValue(this.form.value.sendingAddress.Building)
      this.form.get(['billingAddress', 'Street']).setValue(this.form.value.sendingAddress.Street)
      this.form.get(['billingAddress', 'Landmark']).setValue(this.form.value.sendingAddress.Landmark)
      this.form.get(['billingAddress', 'presentaddresscountry']).setValue(this.form.value.sendingAddress.presentaddresscountry)
      this.form.get(['billingAddress', 'presentaddressstate']).setValue(this.form.value.sendingAddress.presentaddressstate)
      this.form.get(['billingAddress', 'presentaddressdistrict']).setValue(this.form.value.sendingAddress.presentaddressdistrict)
      this.form.get(['billingAddress', 'presentaddresspincode']).setValue(this.form.value.sendingAddress.presentaddresspincode)
    } else {
      this.permanentForm = true;
      this.form.get(['billingAddress', 'Building']).setValidators([Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]);
      this.form.get(['billingAddress', 'Street']).setValidators([Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]);
      this.form.get(['billingAddress', 'Landmark']).setValidators([Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]);
      this.form.get(['billingAddress', 'presentaddresscountry']).setValidators(Validators.required);
      this.form.get(['billingAddress', 'presentaddressstate']).setValidators(Validators.required);
      this.form.get(['billingAddress', 'presentaddressdistrict']).setValidators(Validators.required);
      this.form.get(['billingAddress', 'presentaddresspincode']).setValidators([Validators.required, Validators.pattern(regex.pincode)]);

      this.form.get(['billingAddress', 'Building']).setValue('')
      this.form.get(['billingAddress', 'Street']).setValue('')
      this.form.get(['billingAddress', 'Landmark']).setValue('')
      this.form.get(['billingAddress', 'presentaddresscountry']).setValue('')
      this.form.get(['billingAddress', 'presentaddressstate']).setValue('')
      this.form.get(['billingAddress', 'presentaddressdistrict']).setValue('')
      this.form.get(['billingAddress', 'presentaddresspincode']).setValue('')
    }
    this.form.updateValueAndValidity();
  }

  getPresentStates2(event) {
    // this.common.hubControlEvent('Accounts','click','','',event,'getPresentStates2');

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
    this.presentDistrict2 = [];
    // this.common.hubControlEvent('Accounts','click','','',event,'getPresentDistrict2');

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
    // this.common.hubControlEvent('Accounts','click','','',event,'getPresentPincode2');

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
    // this.common.hubControlEvent('Accounts','click','','',JSON.stringify(obj),'getPresentPincode2');

    this.api.post('index', obj).subscribe(res => {
      let Policelist = res.results.data;
      Policelist.forEach(element => {
        this.policeStationlist2.push({ policeStationName: element['Police Station Name'], Id: element['Actionable'] })
      });
    })
  }
  openedChange(opened: boolean) {
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
  submit(event): void {
    // let a:any= (document.getElementById('abcd') as HTMLInputElement)
    // this.validEmailID(a)
    this.loader = true;
    this.submittedForm = true;
    let starts = new Date(this.form.value.startDate)
    let startd=starts.getDate()
    
    let Ends = new Date(this.form.value.endDate)
    let endd=Ends.getDate()
    // let startd = new Date(this.form.value.startDate)
    // let endd = new Date(this.form.value.endDate)
    if (startd >= endd) {
      // this.common.snackbar("Renewal Date Should be Greater than Start Date", 'error');
      this.errorval = true;
      this.loader = false
      return;
    }
    else  this.errorval = false;    
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid && key != 'sendingAddress' && key != 'billingAddress' && key != 'emailAdd') {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
       
      }
      // this.common.snackbar("General Error", "error");
      return;
    }
    for (const key of Object.keys(this.form.controls)) {
      if (key == "contracttype") {
        if (!this.form.value.contracttype) {
          this.contracttype = true;
          this.loader = false;
          return;
        }
      }
    }
    // var temp = [];
    // var arrayControl = this.form.get('emailAdd') as FormArray
    // arrayControl.controls.forEach((element, index) => {
    //   var emailAddress = (arrayControl.at(index) as FormGroup).get('emailAddr').value;
    //   temp.push(emailAddress);
    // })
  
    this.requestObj = {
      data: {
        spname: "usp_unfyd_hub_accounts",
        parameters: {
          flag: this.AccId != null ? 'UPDATE' : "INSERT",
          ID: this.AccId == null ? undefined : this.AccId,
          FirstName: this.form.value.firstname,
          LastName: this.form.value.lastname,
          Email: this.form.value.emailid,
          PhoneNo: this.form.value.phoneno,
          Designation: this.form.value.designation,
          CompanyName: this.form.value.companyname,
          Country: this.form.value.country,
          DomainShortCode: this.form.value.domainshortcode,
          StartDate: this.form.value.startDate,
          RenewalDate: this.form.value.endDate,
          ContractType: this.form.value.contracttype,
          ShipAddress1: this.form.value.sendingAddress.Building,
          ShipAddress2: this.form.value.sendingAddress.Street,
          ShipAddress3: this.form.value.sendingAddress.Landmark,
          ShipCountry: this.form.value.sendingAddress.presentaddresscountry,
          ShipState: this.form.value.sendingAddress.presentaddressstate,
          ShipCity: this.form.value.sendingAddress.presentaddressdistrict,
          ShipPincode: this.form.value.sendingAddress.presentaddresspincode,
          BillSameAsShipAddress: this.form.value.BillSameAsShipAddress,
          BillAddress1: this.form.value.billingAddress.Building,
          BillAddress2: this.form.value.billingAddress.Street,
          BillAddress3: this.form.value.billingAddress.Landmark,
          BillCountry: this.form.value.billingAddress.presentaddresscountry,
          BillState: this.form.value.billingAddress.presentaddressstate,
          BillCity: this.form.value.billingAddress.presentaddressdistrict,
          BillPincode: this.form.value.billingAddress.presentaddresspincode,
          ProcessId: this.userDetails.Processid,
          // RecipientEmail: temp.join(':'),
          RecipientEmail: this.form.value.emailAddr.length > 0 ? this.form.value.emailAddr.join(',') : "",
          CREATEDBY: this.AccId == null ? this.userDetails.Id : undefined,
          ModifiedBy: this.AccId == null ? undefined : this.userDetails.Id,
          PUBLICIP: this.userDetails.ip,
          BROWSERNAME: this.userDetails.browser,
          BROWSERVERSION: this.userDetails.browser_version
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == "Data added successfully") {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.router.navigate(['masters/accounts']);
          } else if (event == 'saveAndAddNew') {            
            this.form.reset();
            setTimeout(() => { this.form.get(['sendingAddress', 'presentaddresspincode']).reset();})
            this.form.get('startDate').setValue(new Date());
          }
        }
        else if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');
          if (event == 'add') {
            this.router.navigate(['masters/accounts']);
          } else if (event == 'saveAndAddNew') {
            setTimeout(() => { this.form.get(['sendingAddress', 'presentaddresspincode']).reset();})
            this.form.reset();
          }
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
           if(status.status){
              this.requestObj = {
                data: {
                  spname: "usp_unfyd_hub_accounts",
                  parameters: {
                    flag: 'ACTIVATE',
                    DomainShortCode: this.form.value.domainshortcode,
                    modifiedby: this.userDetails.Id,
                    processid: this.userDetails.Processid,
                  }
                }
              };
              this.api.post('index', this.requestObj).subscribe((res: any) => {
                if (res.code == 200) {
                  if (event == 'add') {
                    this.router.navigate(['masters/accounts']);
                    this.common.snackbar('Record add');
                  } if (event == 'saveAndAddNew') {
                    this.common.snackbar('Record add');
                    this.form.reset()
                    setTimeout(() => { this.form.get(['sendingAddress', 'presentaddresspincode']).reset();})

                  }
                }
              });
            }
            this.subscriptionAcitivateData.forEach((e) => {
              e.unsubscribe();
            });
          }));
        }
        else if ((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }
      } else {
        this.loader = false;
      }

    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }

  removeKeyword(keyword: string) {

      let val = this.form.value.emailAddr    
      const index = val.indexOf(keyword);   
      if (index >= 0) {    
       val.splice(index, 1);    
      }    
      this.form.controls['emailAddr'].patchValue(val)   
     } 
    
     validEmailID(event: MatChipInputEvent){
      console.log((document.getElementById('abcd') as HTMLInputElement).value);
      
      if((document.getElementById('abcd') as HTMLInputElement).value.trim().length == 0) {
        this.validEmail = false
        // return 
      } 
     }
     addKeywordFromInput(event: MatChipInputEvent): void {  
     
      const value = (event.value || '').trim();
      // if(!value){
      //   this.validEmail = false   
      //   return;    
      // }
      var regex1 = new RegExp(regex.email1);    
      if (!regex1.test(value)) { 
        // this.validEmail = true 
        this.common.snackbar('Email Invalid');  
       return;    
      } 
      let val = this.form.value.emailAddr ? this.form.value.emailAddr : []    
      if (value) {    
        // this.validEmail = false
       val.push(value);    
      }    
      this.form.controls['emailAddr'].patchValue(val)    
      event.chipInput!.clear();
    
     }
     isNameDup() {

      const validator: ValidatorFn = (formArray: FormArray) => {
        const totalSelected = formArray.controls
          .map(control => control.value);
        const names = totalSelected.map(value => value.emailAddr)
        const hasDuplicate = names.some(
          (name, index) => names.indexOf(name, index + 1) != -1
        );
        return hasDuplicate ? { duplicate: true } : null;
      }
      return validator;
    }
}
