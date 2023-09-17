
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, masters, timeZones, countryCode, tenantFormSteps, checknull } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

declare const require: any;

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

@Component({
  selector: 'app-tenant',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.scss'],
})
export class TenantComponent implements OnInit {
  form: FormGroup;
  loader: boolean = false;
  path: any;
  userDetails: any;
  labelName: any;
  tenantFormSteps: any;
  countryCodeSelected: any = {};
  countryCode: any = [];
  public filteredList2 = this.countryCode.slice();
  phone: any;
  email: any;
  isDisabled = false;
  isemailotpDisabled = false;
  requestObj: any;
  editObj: any;
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
  empstr: any;
  contractselect: any;
  localizationData: any;
  localizationDataAvailble: boolean = false;
  allowedISD: any = []
  todayDate: Date = new Date();
  maxDate = new Date();
  public searchcountry = this.country.slice();
  selectedcountrycode: any;
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  countryjson: any;
  phmaxlength: any;
  phminlength: any;
  phvalid: boolean;

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
    this.common.hubControlEvent('Tenant','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'Tenant');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.subscription.push(this.common.localizationDataAvailable$.subscribe((res) => {
      this.localizationDataAvailble = res;
    }))
    this.getSnapShot();
    this.form = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(30)]],
      lastname: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(30)]],
      designation: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(30)]],
      companyname: ['', [Validators.required, Validators.maxLength(30)]],

      employeestrength: ['', Validators.required],
      domainshortcode: ['', [Validators.required, Validators.maxLength(6),Validators.minLength(3), Validators.pattern(regex.alphabet)]],
      country: ['', Validators.required],
      countrycode: [this.countryCode[95], Validators.required],
      phoneno: ['', [Validators.required, Validators.pattern(regex.mobile)]],
      emailid: ['', [Validators.required, Validators.pattern(regex.email1)]],
      contracttype: ['', [Validators.nullValidator, Validators.required]],
      startDate: [new Date(), [Validators.nullValidator]],
      endDate: ['', [Validators.nullValidator, Validators.required]]
    },
    {validator:[checknull('firstname'),checknull('lastname'),checknull('designation'),checknull('companyname'),checknull('domainshortcode'),checknull('emailid')]},


    )





    this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {
      this.localizationData = res1;
      if (this.localizationDataAvailble) {
        if ((this.localizationData.allowedISD).length > 0) {
          this.allowedISD = this.localizationData.allowedISD.split(",")
          if (this.path == null) {
            if (this.localizationData.numberFormat == '+91')
            this.form.patchValue({ country: '91' });
            this.form.updateValueAndValidity();
            this.selectedcountrycode = 91
          }
        }
      }
    }))
    
    this.countryCodeSelected = this.countryCode[95];
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.empstr = "abc";
    if (this.path == null) {
      this.form.patchValue({
        contracttype: "License",
      });
      this.form.updateValueAndValidity();
    }
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
          this.loader = false;
          this.editObj = res.results.data[0];



          if (this.editObj) {

            let countrycodevalue = this.editObj.CountryCode
            const index = this.countryCode.findIndex(object => {
              return object.dial_code == countrycodevalue
            });
            this.countryCodeSelected = this.countryCode[index];


            this.form.patchValue({

              firstname: this.editObj.FirstName,
              lastname: this.editObj.LastName,
              designation: this.editObj.Designation,
              companyname: this.editObj.ProcessName,
              employeestrength: this.editObj.EmployeeStrength,
              domainshortcode: this.editObj.ShortCode,
              country: this.editObj.Country.toString(),
              phoneno: this.editObj.MobileNo,
              emailid: this.editObj.EmailId,
              contracttype: this.editObj.ContractType,
              startDate: this.editObj.StartDate,
              endDate: this.editObj.EndDate,



        
            });
          

            const variableOne = this.countryCode.filter(item => item.dial_code == this.editObj.CountryCode);
            this.form.controls['countrycode'].setValue(variableOne[0]);
            this.form.get('companyname').disable();
            this.form.get('companyname').clearValidators();
            this.form.get('domainshortcode').disable();
            this.form.get('domainshortcode').clearValidators();

            this.todayDate = new Date(this.editObj.StartDate);
            this.form.updateValueAndValidity();
            this.subscription.push(this.common.localizationDataAvailable$.subscribe((res) => {
              if (res) {
                this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {
                  this.form.updateValueAndValidity();
                }))
              }
            }))
          }
        }
      })
    } else {
      this.router.navigate(['/masters/tenant/add'])
    }
    this.common.hubControlEvent('Tenant','click','pageloadend','pageloadend','','ngOnInit');

  }


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Tenant','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Tenant', data)

  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('Tenant','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });
    this.common.getIndividualUpload$.subscribe(res => {
      this.form.controls.profilepic.setValue(res.status.attachmenturl);
    })
    this.getCountries('', 'Country');

  }

  back(): void {
    this.common.hubControlEvent('Tenant','click','back','back','','back');

    this.location.back()
  }

  selectCountry(value) {
    this.common.hubControlEvent('Tenant','click','','',value,'selectCountry');

    this.countryCodeSelected = value;
    this.selectedcountrycode = value.dial_code;

    this.form.patchValue({ country: this.selectedcountrycode.toString() })
    this.form.updateValueAndValidity();
  }
  AutoSelectCountryCode(e) {
    this.common.hubControlEvent('Tenant','click','','',e,'AutoSelectCountryCode');

    this.selectedcountrycode = e.value;
    let countrycodevalue = e.value



    const index = this.countryCode.findIndex(object => {
          if(object.dial_code==countrycodevalue)
          {
            this.countryjson = object

          }
      return object.dial_code == countrycodevalue
    });
    this.countryCodeSelected = this.countryCode[index];

    let phonelength =  this.countryCodeSelected.max_length

    this.phminlength =  phonelength[0]
    this.phmaxlength =   phonelength[phonelength.length-1]



  }


  proper = false;

  valPhone(e) {
    this.common.hubControlEvent('Tenant','click','','',e,'valPhone');


    let countryjsonvalphone = e;

    this.countryjson  = countryjsonvalphone;

    let phonelength =   this.countryjson.max_length

    this.phminlength =  phonelength[0]
    this.phmaxlength =   phonelength[phonelength.length-1]


    let regex =  this.countryjson.regex

    let phone = this.phone;

    if (phone.length > 1) {
        if(regex == undefined || null)
        {
          this.form.controls['phoneno'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength)]);
        }
        else{
          this.form.controls['phoneno'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength), Validators.pattern(regex)]);
        }
      }

      let countrycodeEN = this.countryjson.country_code
      let isValid = false;
      if( this.form.controls['phoneno'].status !== "INVALID")
      {
        const number = phoneUtil.parseAndKeepRawInput(phone, countrycodeEN.toUpperCase());
        isValid = phoneUtil.isValidNumberForRegion(number, countrycodeEN.toUpperCase());
        this.phvalid = isValid
        this.form.get('phoneno').markAsTouched();
      }
      this.form.get('phoneno').markAsTouched();



  if (phone.length >= 10) {


      this.proper = true;
      return true;
    } else {
      this.proper = false;
    }
    return false;
  }


  numericOnly(e): boolean {
    this.common.hubControlEvent('Tenant','click','','',e,'numericOnly');

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

  properemail = false;
  valemail() {
    this.common.hubControlEvent('Tenant','click','','','','valemail');

    let email = this.email;
   
    if (email.length >= 2) {

      this.properemail = true;
      return true;
    } else {
      this.properemail = false;
    }
    return false;

  }



  uploadDocument(event, category) {
    this.common.hubControlEvent('Tenant','click','','','','uploadDocument');

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

  flip() {
    this.common.hubControlEvent('Tenant','click','','','','flip');

    this.proper = false;
    this.isDisabled = !this.isDisabled;
  }

  phoneverify() {
    this.common.hubControlEvent('Tenant','click','','','','phoneverify');

    this.proper = false;
    this.isDisabled = false;
  }

  flipemail() {
    this.common.hubControlEvent('Tenant','click','','','','flipemail');

    this.properemail = false;
    this.isemailotpDisabled = !this.isemailotpDisabled;
  }

  emailverify() {
    this.common.hubControlEvent('Tenant','click','','','','emailverify');

    this.properemail = false;
    this.isemailotpDisabled = false;
  }
  nextfunction() {
    this.common.hubControlEvent('Tenant','click','','','','nextfunction');

    if (this.form.invalid) {
      this.form.markAllAsTouched()

      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();

      


          break;
        }
      }
      // this.common.snackbar("TenantFillAllField");
      return;
    }
    if (this.path == null) {
      let startd = new Date(this.form.value.startDate)
      let endd = new Date(this.form.value.endDate)
      if (startd > endd) {
        this.common.snackbar("RenewalDateShouldBeGreater");
        return;
      }

      this.requestObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "INSERT",
       


            FirstName: this.form.value.firstname == null ? null : this.form.value.firstname.trim(),
            lastname: this.form.value.lastname == null ? null : this.form.value.lastname.trim(),
            designation: this.form.value.designation == null ? null : this.form.value.designation.trim(),
            ProcessName: this.form.value.companyname == null ? null : this.form.value.companyname.trim(),
            employeestrength: this.form.value.employeestrength,
            ShortCode: this.form.value.domainshortcode  == null ? null : this.form.value.domainshortcode.trim(),
            country: this.form.value.country,
            countrycode: this.selectedcountrycode,
            MobileNo: this.form.value.phoneno,
            emailid: this.form.value.emailid,
            contracttype: this.form.value.contracttype,
            // startDate: this.form.value.startDate,
            // endDate: this.form.value.endDate,
            startDate: this.datepipe.transform(this.form.value.startDate, 'yyyy-MM-dd HH:mm:ss'),
            endDate: this.datepipe.transform(this.form.value.endDate, 'yyyy-MM-dd HH:mm:ss'),
            CREATEDBY: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    }
    else {
      let startd = new Date(this.form.value.startDate)
      let endd = new Date(this.form.value.endDate)
      if (startd > endd) {
        this.common.snackbar('RenewalDateShouldBeGreater');
        return;
      }

      if (this.selectedcountrycode == undefined || this.selectedcountrycode == null) {
        this.selectedcountrycode = this.editObj.CountryCode;
      }

      this.requestObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "UPDATE",
         
            FirstName: this.form.value.firstname == null ? null : this.form.value.firstname.trim(),
            lastname: this.form.value.lastname == null ? null : this.form.value.lastname.trim(),
            designation:  this.form.value.designation == null ? null : this.form.value.designation.trim(),
            ProcessName: this.editObj.ProcessName,
            employeestrength: this.form.value.employeestrength,
            ShortCode: this.editObj.ShortCode,
            country: this.form.value.country,
            countrycode: this.selectedcountrycode,
            MobileNo: this.form.value.phoneno,
            emailid: this.form.value.emailid,
            contracttype: this.form.value.contracttype,
            // startDate: this.form.value.startDate,
            // endDate: this.form.value.endDate,
            startDate: this.datepipe.transform(this.form.value.startDate, 'yyyy-MM-dd HH:mm:ss'),
            endDate: this.datepipe.transform(this.form.value.endDate, 'yyyy-MM-dd HH:mm:ss'),
            PROCESSID: this.path,


            SameShipAddress: this.editObj.SameShipAddress,
            ShipAddress: this.editObj.ShipAddress,
            ShipCountry: this.editObj.ShipCountry,
            ShipZipcode: this.editObj.ShipZipcode,
            ShipDistrict: this.editObj.ShipDistrict,
            ShipState: this.editObj.ShipState,
            BillAddress: this.editObj.BillAddress,
            BillCountry: this.editObj.BillCountry,
            BillZipcode: this.editObj.BillZipcode,
            BillDistrict: this.editObj.BillDistrict,
            BillState: this.editObj.BillState,
            RecipientEmailID: this.editObj.RecipientEmailID,

            Address: this.editObj.Address,
            ArchiveConnectionString: this.editObj.ArchiveConnectionString,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version,
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
            ModifiedBy: this.userDetails.Id,
            ModuleId: this.editObj.ModuleId,
            Name: this.editObj.Name,
            ParentProcessId: this.editObj.ParentProcessId,
            PrivateIP: this.editObj.PrivateIP,
            ProcessStatus: this.editObj.ProcessStatus,
            TimezoneOffset: this.editObj.TimezoneOffset,
            Website: this.editObj.Website,
            PUBLICIP: this.userDetails.ip,
            AllowLOB: this.editObj.AllowLOB
          }
        }
      }
    }
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'nextfunction');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false
        if ((Object.keys(res.results.data[0])).includes('result')) {
          if ((res.results.data[0].result.includes("already exists")) && (res.results.data[0].Status == false)) {
            this.common.snackbar('Exists')
          }
          else if (res.results.data[0].Status == true) {



            // const dialogRef = this.dialog.open(DialogComponent, {
            //   data: {
            //     type: 'softdeleted',
            //     subTitle: 'Record already exist and it is Inactive,Do you want to activate?',
            //   },
            //   width: '300px',
            //   disableClose: true,
            // });
            // dialogRef.afterClosed().subscribe(status => {
            //   if (status == true) {



            //     this.loader = true;
            //     this.requestObj = {
            //       data: {
            //         spname: "usp_unfyd_tenant",
            //         parameters: {
            //           flag: 'ACTIVATE',
            //           ProcessName: this.form.value.companyname,
            //           ShortCode: this.form.value.domainshortcode,
            //           modifiedby: this.userDetails.Id,
            //         }
            //       }
            //     };
            //     this.common.hubControlEvent('Tenant','click','','ACTIVATE',JSON.stringify(this.requestObj),'nextfunction');

            //     this.api.post('index', this.requestObj).subscribe((res: any) => {
            //       if (res.code == 200) {
            //         this.common.snackbar("Record add");
            //          this.router.navigate(['masters/tenant']);
            //       }
            //     });
              
              
            //   }
            // });
          
            this.common.confirmationToMakeDefault('AcitvateDeletedData');
            this.subscriptionAcitivateData.push(
               this.common.getIndividualUpload$.subscribe(status => {
             if(status.status){
           
              // this.loader = true;
              this.requestObj = {
                data: {
                  spname: "usp_unfyd_tenant",
                  parameters: {
                    flag: 'ACTIVATE',
                    ProcessName: this.form.value.companyname,
                    ShortCode: this.form.value.domainshortcode,
                    modifiedby: this.userDetails.Id,
                  }
                }
              };
              this.common.hubControlEvent('Tenant','click','','ACTIVATE',JSON.stringify(this.requestObj),'nextfunction');

              this.api.post('index', this.requestObj).subscribe((res: any) => {
                if (res.code == 200) {
                  this.common.snackbar("Record add");
                   this.router.navigate(['masters/tenant']);
                }
              });
           
            }
             
             this.subscriptionAcitivateData.forEach((e) => {
               e.unsubscribe();
             });
             }))
          
          
          }
          else if((res.results.data[0].result == "Tenant Added Successfully")){ this.common.snackbar("Record add");
        this.router.navigate(['masters/tenant/product-details', this.path == null ? res.results.data[0].ProcessId : this.path]);
        }
        else if((res.results.data[0].result == "Tenant Updated Successfully")){ this.common.snackbar('Update Success');
        this.router.navigate(['masters/tenant/product-details', this.path == null ? res.results.data[0].ProcessId : this.path]);
        }
        }
        this.common.sendCERequest('UPDATE tenant', this.userDetails.processid);
      }
      else {
        this.loader = false;
        this.common.snackbar(res.results.data[0]);
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }
  getCountries(event, type) {
    this.common.hubControlEvent('Tenant','click','','ACTIVATE',event,'getCountries');


    this.common.getLocation(event, type).subscribe(res => {

      this.country = res;
      this.searchcountry = this.country.slice();
      this.form.patchValue({ 'presentaddresscountry': this.country[0].CountryID })
      this.form.patchValue({ 'permanentaddresscountry': this.country[0].CountryID })
    })
  }
  savefunction() {
    this.common.hubControlEvent('Tenant','click','','','','savefunction');

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      // this.common.snackbar("TenantFillAllField");
      return;
    }


    if (this.path == null) {
      let startd = new Date(this.form.value.startDate)
      let endd = new Date(this.form.value.endDate)
      if (startd > endd) {
        this.common.snackbar('RenewalDateShouldBeGreater', 'error');
        return;
      }

      this.requestObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "INSERT",
           

            FirstName: this.form.value.firstname == null ? null : this.form.value.firstname.trim(),
            lastname: this.form.value.lastname == null ? null : this.form.value.lastname.trim(),
            designation: this.form.value.designation == null ? null : this.form.value.designation.trim(),
            ProcessName: this.form.value.companyname == null ? null : this.form.value.companyname.trim(),
            employeestrength: this.form.value.employeestrength,
            ShortCode: this.form.value.domainshortcode  == null ? null : this.form.value.domainshortcode.trim(),
            country: this.form.value.country,
            countrycode: this.selectedcountrycode,
            MobileNo: this.form.value.phoneno,
            emailid: this.form.value.emailid,
            contracttype: this.form.value.contracttype,
            // startDate: this.form.value.startDate,
            // endDate: this.form.value.endDate
            startDate: this.datepipe.transform(this.form.value.startDate, 'yyyy-MM-dd HH:mm:ss'),
            endDate: this.datepipe.transform(this.form.value.endDate, 'yyyy-MM-dd HH:mm:ss'),
          }
        }
      }
    }
    else {
      let startd = new Date(this.form.value.startDate)
      let endd = new Date(this.form.value.endDate)
      if (startd > endd) {
        this.common.snackbar('RenewalDateShouldBeGreater');
        return;
      }
      if (this.selectedcountrycode == undefined || this.selectedcountrycode == null) {
        this.selectedcountrycode = this.editObj.CountryCode;
      }

      this.requestObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "UPDATE",
         
            FirstName: this.form.value.firstname == null ? null : this.form.value.firstname.trim(),
            lastname: this.form.value.lastname == null ? null : this.form.value.lastname.trim(),
            designation: this.form.value.designation == null ? null : this.form.value.designation.trim(),
            ProcessName: this.editObj.ProcessName,
            employeestrength: this.form.value.employeestrength,
            ShortCode: this.editObj.ShortCode,
            country: this.form.value.country,
            countrycode: this.selectedcountrycode,
            MobileNo: this.form.value.phoneno,
            emailid: this.form.value.emailid,
            contracttype: this.form.value.contracttype,
            // startDate: this.form.value.startDate,
            // endDate: this.form.value.endDate,
            startDate: this.datepipe.transform(this.form.value.startDate, 'yyyy-MM-dd HH:mm:ss'),
            endDate: this.datepipe.transform(this.form.value.endDate, 'yyyy-MM-dd HH:mm:ss'),
            PROCESSID: this.path,


            SameShipAddress: this.editObj.SameShipAddress,
            ShipAddress: this.editObj.ShipAddress,
            ShipCountry: this.editObj.ShipCountry,
            ShipZipcode: this.editObj.ShipZipcode,
            ShipDistrict: this.editObj.ShipDistrict,
            ShipState: this.editObj.ShipState,
            BillAddress: this.editObj.BillAddress,
            BillCountry: this.editObj.BillCountry,
            BillZipcode: this.editObj.BillZipcode,
            BillDistrict: this.editObj.BillDistrict,
            BillState: this.editObj.BillState,
            RecipientEmailID: this.editObj.RecipientEmailID,

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
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'savefunction');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false
        if ((Object.keys(res.results.data[0])).includes('result')) {
          if ((res.results.data[0].result.includes("already exists")) && (res.results.data[0].Status == false) ) {
            this.common.snackbar('Exists')
          }
          else if (res.results.data[0].Status == true) {


            // const dialogRef = this.dialog.open(DialogComponent, {
            //   data: {
            //     type: 'softdeleted',
            //     subTitle: 'Record already exist and it is Inactive,Do you want to activate?',
            //   },
            //   width: '300px',
            //   disableClose: true,
            // });
            // dialogRef.afterClosed().subscribe(status => {
            //   if (status == true) {


            //     this.loader = true;
            //     this.requestObj = {
            //       data: {
            //         spname: "usp_unfyd_tenant",
            //         parameters: {
            //           flag: 'ACTIVATE',
            //           ProcessName: this.form.value.companyname,
            //           ShortCode: this.form.value.domainshortcode,
            //           modifiedby: this.userDetails.Id,
            //         }
            //       }
            //     };
            //     this.common.hubControlEvent('Tenant','click','','ACTIVATE',JSON.stringify(this.requestObj),'savefunction');

            //     this.api.post('index', this.requestObj).subscribe((res: any) => {
            //       if (res.code == 200) {
            //         this.common.snackbar("Record add");
            //         this.router.navigate(['masters/tenant']);
            //       }
            //     });
              
              
              
            //   }
            // });



                
              
              this.common.confirmationToMakeDefault('AcitvateDeletedData');
              this.subscriptionAcitivateData.push(
                  this.common.getIndividualUpload$.subscribe(status => {
                if(status.status){
              
                  // this.loader = true;
                  this.requestObj = {
                    data: {
                      spname: "usp_unfyd_tenant",
                      parameters: {
                        flag: 'ACTIVATE',
                        ProcessName: this.form.value.companyname,
                        ShortCode: this.form.value.domainshortcode,
                        modifiedby: this.userDetails.Id,
                      }
                    }
                  };
                  this.common.hubControlEvent('Tenant','click','','ACTIVATE',JSON.stringify(this.requestObj),'savefunction');
  
                  this.api.post('index', this.requestObj).subscribe((res: any) => {
                    if (res.code == 200) {
                      this.common.snackbar("Record add");
                      this.router.navigate(['masters/tenant']);
                    }
                  });
                
              
              }
                
                this.subscriptionAcitivateData.forEach((e) => {
                  e.unsubscribe();
                });
                }))
                
          
          
          }
          else if((res.results.data[0].result == "Tenant Added Successfully")){ this.common.snackbar("Record add");
          this.router.navigate(['masters/tenant/update', this.path == null ? res.results.data[0].ProcessId : this.path]);
          }
          else if((res.results.data[0].result == "Tenant Updated Successfully")){ this.common.snackbar('Update Success');
          this.router.navigate(['masters/tenant/update', this.path == null ? res.results.data[0].ProcessId : this.path]);
          }
        }
      }
      else {
        this.loader = false;
        this.common.snackbar(res.results.data[0]);
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })




  }


  resetFunc(){
    this.form.reset();
    this.submittedForm = false;
    setTimeout(() => {
      this.form.patchValue({
        countrycode:this.countryCode[95],
        contracttype: "License",
        country:'91',
        startDate:new Date()
        // this.form.patchValue({ country: '91' });



      })
      // this.form.patchValue({
      // });

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
