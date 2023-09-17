import { Component, ElementRef, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common'
import { map, startWith } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, hawkerFormSteps, regex, mustNotMatch } from 'src/app/global/json-data';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  commonObj: any;
  requestObj: any;
  editObj: any;
  path: any;
  userType: any;
  masters: any;
  regex: any;
  hawkerFormSteps: string[] = [];
  form: FormGroup;
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
  labelName : any;
  reset : boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private el: ElementRef,
    private common: CommonService,
    private api: ApiService,
    public dialog: MatDialog,
    private location: Location
  ) {
    Object.assign(this, { masters, hawkerFormSteps, regex });
  }

  ngOnInit(): void {
    this.getSnapShot();
    this.form = this.formBuilder.group({
      photoidprooftype: ['', Validators.required],
      photoidproofnum: ['', Validators.nullValidator],
      isphotoidattachment: [false, Validators.requiredTrue],
      addressprooftype: ['', Validators.required],
      isaddressproofattachment: [false, Validators.requiredTrue],
      presentaddress: ['', Validators.required],
      presentaddressstreetname: ['', [ Validators.nullValidator]],
      presentaddressarea: ['', Validators.required],
      presentaddresscountry: ['', Validators.required],
      presentaddressstate: ['', Validators.required],
      presentaddressdistrict: ['', Validators.required],
      presentaddresscity: ['', Validators.required],
      postofficepresentaddress: ['', Validators.nullValidator],
      blockpresentaddress: ['', Validators.required],
      presentaddresspincode: ['', [Validators.required, Validators.pattern(regex.pincode)]],
      policestationpresentaddress: ['', Validators.nullValidator],
      sameaspresentadd: [false, Validators.nullValidator],
      permanentaddress: ['', Validators.required],
      permanentaddressstreetname: ['', [ Validators.nullValidator]],
      permanentaddressarea: ['', Validators.required],
      permanentaddresscountry: ['', Validators.required],
      permanentaddressstate: ['', Validators.required],
      permanentaddressdistrict: ['', Validators.required],
      permanentaddresscity: ['', Validators.required],
      postofficepermanentaddress: ['', Validators.nullValidator],
      blockpermanentaddress: ['', Validators.required],
      permanentaddresspincode: ['', [Validators.required, Validators.pattern(regex.pincode)]],
      policestationpermanentaddress: ['', Validators.nullValidator],
      emailid: ['', Validators.pattern(regex.email)],
      mobileno: ['', [Validators.required, Validators.pattern(regex.mobile)]],
      alternatenumber: ['', [Validators.nullValidator, Validators.pattern(regex.mobile)]],
      emergencycontactnumber: ['', [Validators.required, Validators.pattern(regex.mobile)]],
      emergencycontactname: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
      whatsappnumber: ['', Validators.nullValidator],
      enablewhatsapp: [false, Validators.nullValidator],
      handsetmodel: ['', Validators.nullValidator],
      // mobiledatastatus: ['', Validators.nullValidator],
      addressproofnum: ['', Validators.nullValidator],
      signaturestatus: [false, Validators.requiredTrue],
    }, {
      validator: mustNotMatch('mobileno', 'emergencycontactnumber')
    });

    this.filteredPresentPincode = this.form.get('presentaddresspincode').valueChanges.pipe(
      startWith(''),
      map(data => data ? this.filterPresentPincode(data) : this.presentPincode.slice())
    );

    this.filteredPermanentPincode = this.form.get('permanentaddresspincode').valueChanges.pipe(
      startWith(''),
      map(data => data ? this.filterPermanentPincode(data) : this.permanentPincode.slice())
    );
    // this.closePopupReset();
  }

  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.common.setUserConfig(this.userDetails.ProfileType, 'beneficiary');
    this.common.getUserConfig$.subscribe(data => {
      this.userConfig = data
      if (!this.userConfig.Contact) {
        // this.router.navigate(['masters/beneficiary/payment', this.path]);
      }
    });

    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.masterConfig = {
        photoIdProof: JSON.parse(data.PhotoIDProof),
        addressProof: JSON.parse(data.AddressProof),
        mobileDevice:JSON.parse(data.Device),
      }
    });

    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.getCountries('', 'Country');

    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_contact",
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
            const lowerObj = this.common.ConvertKeysToLowerCase();
            if (this.editObj.PresentAddressCountry) {
              this.getPresentStates(this.editObj.PresentAddressCountry);
              if (this.editObj.PresentAddressState) {
                this.getPresentDistrict(this.editObj.PresentAddressState);
                if (this.editObj.PresentAddressDistrict) {
                  this.getPresentPincode(this.editObj.PresentAddressDistrict)
                }
              }
            }
            if (this.editObj.PermanentAddressCountry) {
              this.getPermanentStates(this.editObj.PermanentAddressCountry);
              if (this.editObj.PermanentAddressState) {
                this.getPermanentDistrict(this.editObj.PermanentAddressState);
                if (this.editObj.PermanentAddressDistrict) {
                  this.getPermanentPincode(this.editObj.PermanentAddressDistrict)
                }
              }
            }
            this.blocklist(this.editObj.EmailId)
            if (this.editObj.SameAsPresentAdd == true) {
              this.permanentForm = false
            }
            if (this.editObj.EnableWhatsapp == true) {
              this.whatsappBox = true
            }
            if (this.editObj.PhotoIDProofNum !== '') {
              this.photoidno = true;
              this.selectedPhotoId = this.editObj.PhotoIDProofType
            }
            if (this.editObj.addressproofnum !== '') {
              this.addressidno = true;
              this.selectedPhotoId = this.editObj.AddressProofType
            }

            if (this.editObj.MobileNo == this.editObj.WhatsappNumber) {
              this.ifSame = true;
              this.isActivetextbox = true;
            }


            this.form.patchValue(lowerObj(this.editObj));
            if (this.editObj.AlternateNumber === '0') { this.form.patchValue({ alternatenumber: "" }) }
          
           
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

    this.viewDocument('Id Proof', '')
    this.viewDocument('Address Proof', '')
    this.viewDocument('Signature', '')
    this.common.getSingleImage$.subscribe(res => {
      if (res?.Category == 'Id Proof') {
        this.idDocument = res;
      }
   
      if (res?.Category == 'Address Proof') {
        this.addressDocument = res;
      }
   
      if (res?.Category == 'Signature') {
        this.signatureDocument = res;
      }
    })

    this.common.getIndividualUpload$.subscribe(res => {
      if (res.category == 'Id Proof') {
        this.form.get('isphotoidattachment').setValue(res.status == false ? false : true);
        this.idDocument = res;
      }
      if (res.category == 'Address Proof') {
        this.form.get('isaddressproofattachment').setValue(res.status == false ? false : true);
        this.addressDocument = res
      }
      if (res.category == 'Signature') {
        this.form.get('signaturestatus').setValue(res.status == false ? false : true);
        this.signatureDocument = res
      }
      this.form.updateValueAndValidity();

    })
  }

  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'HawkerContactDetails', data)
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
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.form.markAllAsTouched()
      this.common.snackbar("General Error");
      return;
    }
    if (this.emailValidation == false) {
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
          hawkerid: this.path,
          roletype: 'hawker',
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
          usersubtype: '',
          createdby: this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }

      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_contact",
          parameters: {
            ...this.form.value,
            ...this.commonObj
          }
        }
      }

      this.api.post('index', this.requestObj).subscribe(res => {
        if (res.code == 200) {
          this.loader = false;
          if (btnType == 'next') {
            this.router.navigate(['masters/beneficiary/details/payment', this.commonObj.hawkerid]);
          } else if (btnType == 'save') {
            this.router.navigate(['masters/beneficiary/contact-details', this.commonObj.hawkerid]);
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
    } else {
      this.loader = false;
    }
  }

  getCountries(event, type) {
    this.country = [];
    this.common.getLocation(event, type).subscribe(res => {
      this.country = res;
      this.form.patchValue({ 'presentaddresscountry': this.country[0].CountryID })
      this.form.patchValue({ 'permanentaddresscountry': this.country[0].CountryID })
      this.getPresentStates(1)
      this.getPermanentStates(1)
    })
  }

  getPresentStates(event) {
    this.presentStates = [];
    this.common.getLocation(event, 'State').subscribe(res => {
      this.presentStates = res
      this.filterepresentStates = res;

    })
  }

  getPresentDistrict(event) {
    this.presentDistrict = [];
    this.common.getLocation(event, 'District').subscribe(res => {
      this.presentDistrict = res
      this.filtereddistrict = res;

    })
  }

  getPresentPincode(event) {
    this.form.get('presentaddresspincode').setValue('');
    this.common.getLocation(event, 'Pincode').subscribe(res => {
      this.presentPincode = res;
      this.filtereddPincode = res;

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
    this.api.post('index', obj).subscribe(res => {
      let Policelist = res.results.data;
      Policelist.forEach(element => {
        this.policeStationlist.push({ policeStationName: element['Police Station Name'], Id: element['Actionable'] })
      });
    })

  }

  filterPresentPincode(value) {
    return this.presentPincode.filter(data => data.Pincode.indexOf(value) === 0);
  }

  getPermanentStates(event) {
    this.permanentStates = [];
    this.common.getLocation(event, 'State').subscribe(res => {      
      this.permanentStates = res
      this.filterepresentStatesPermanent = res;
    })
  }

  getPermanentDistrict(event) {
    this.permanentDistrict = [];
    this.common.getLocation(event, 'District').subscribe(res => {
      this.permanentDistrict = res
      this.filtereddistrictPermanent = res;
    })
  }

  getPermanentPincode(event) {
    this.form.get('permanentaddresspincode').setValue('');
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
    this.api.post('index', obj).subscribe(res => {
      let Policelist = res.results.data;
      Policelist.forEach(element => {
        this.PermanentpoliceStationlist.push({ policeStationName: element['Police Station Name'] + ' -- ' + element['PIN Code'], Id: element['Actionable'] })
      });
    })

  }

  filterPermanentPincode(value) {
    return this.permanentPincode.filter(data => data.Pincode.indexOf(value) === 0);
  }


  samePresentAddPermanent(event) {
    if (event == true) {
      this.permanentForm = false;
      this.form.controls['permanentaddress'].setValidators(Validators.nullValidator);
      this.form.controls['permanentaddressstreetname'].setValidators(Validators.nullValidator);
      this.form.controls['permanentaddressarea'].setValidators(Validators.nullValidator);
      this.form.controls['permanentaddresscountry'].setValidators(Validators.nullValidator);
      this.form.controls['permanentaddressstate'].setValidators(Validators.nullValidator);
      this.form.controls['permanentaddressdistrict'].setValidators(Validators.nullValidator);
      this.form.controls['permanentaddresscity'].setValidators(Validators.nullValidator);
      this.form.controls['postofficepermanentaddress'].setValidators(Validators.nullValidator);
      this.form.controls['blockpermanentaddress'].setValidators(Validators.nullValidator);
      this.form.controls['permanentaddresspincode'].setValidators(Validators.nullValidator);
      this.form.controls['permanentaddress'].setValue(this.form.get('presentaddress').value);
      this.form.controls['permanentaddressstreetname'].setValue(this.form.get('presentaddressstreetname').value);
      this.form.controls['permanentaddressarea'].setValue(this.form.get('presentaddressarea').value);
      this.form.controls['permanentaddresscountry'].setValue(this.form.get('presentaddresscountry').value);
      this.form.controls['permanentaddressstate'].setValue(this.form.get('presentaddressstate').value);
      this.form.controls['permanentaddressdistrict'].setValue(this.form.get('presentaddressdistrict').value);
      this.form.controls['permanentaddresscity'].setValue(this.form.get('presentaddresscity').value);
      this.form.controls['postofficepermanentaddress'].setValue(this.form.get('postofficepresentaddress').value);
      this.form.controls['blockpermanentaddress'].setValue(this.form.get('blockpresentaddress').value);
      this.form.controls['permanentaddresspincode'].setValue(this.form.get('presentaddresspincode').value);
      this.form.controls['policestationpermanentaddress'].setValue(this.form.get('policestationpresentaddress').value);
    } else {
      this.permanentForm = true;
      this.form.controls['permanentaddress'].setValidators(Validators.required);
      this.form.controls['permanentaddressstreetname'].setValidators(Validators.nullValidator);
      this.form.controls['permanentaddressarea'].setValidators(Validators.required);
      this.form.controls['permanentaddresscountry'].setValidators(Validators.required);
      this.form.controls['permanentaddressstate'].setValidators(Validators.required);
      this.form.controls['permanentaddressdistrict'].setValidators(Validators.required);
      this.form.controls['permanentaddresscity'].setValidators(Validators.required);
      this.form.controls['postofficepermanentaddress'].setValidators(Validators.nullValidator);
      this.form.controls['blockpermanentaddress'].setValidators(Validators.required);
      this.form.controls['permanentaddresspincode'].setValidators([Validators.required, Validators.pattern(regex.pincode)]);
      this.form.controls['permanentaddress'].setValue('');
      this.form.controls['permanentaddressstreetname'].setValue('');
      this.form.controls['permanentaddressarea'].setValue('');
      this.form.controls['permanentaddresscountry'].setValue('');
      this.form.controls['permanentaddressstate'].setValue('');
      this.form.controls['permanentaddressdistrict'].setValue('');
      this.form.controls['permanentaddresscity'].setValue('');
      this.form.controls['postofficepermanentaddress'].setValue('');
      this.form.controls['blockpermanentaddress'].setValue('');
      this.form.controls['permanentaddresspincode'].setValue('');
      this.form.controls['policestationpermanentaddress'].setValue('');
    }
    this.form.updateValueAndValidity();
  }

  mobileDeviceChange(event) {
    this.form.get('handsetmodel').setValue(event);
    this.form.updateValueAndValidity();
  }

  photoIdProofChange(event) {
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
    if (event == true) {
      this.isActivetextbox = true;
      this.form.get('whatsappnumber').setValue(this.form.value.mobileno);
    } else {
      this.isActivetextbox = false;
      this.form.controls['whatsappnumber'].setValue('');
    }
  }

  numericOnly(event: any): boolean {
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
    var data = {
      flag: imgData !== '' ? 'UPDATE' : 'INSERT',
      documentId : imgData !== '' ? imgData.Actionable : '',
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

  back(): void {
    this.location.back()
  }

}
