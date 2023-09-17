import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, regex, DoctorSpeciality } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { AuthService } from 'src/app/global/auth.service';
@Component({
  selector: 'app-hospitalmaster',
  templateUrl: './hospitalmaster.component.html',
  styleUrls: ['./hospitalmaster.component.scss']
})

export class HospitalMasterComponent implements OnInit {
    loader:boolean = false;
    masters: any;
    DoctorSpeciality:any;
    hmId: any;
    pesonalId: number;
    hospitalname: number;
    specializedin: any;
    doctorname: any;
    Emergency: any;
    deanname: any;
    isdoctor: any;
    mobile: any;
    landline: any;
    email: any;
    website: any;
    address1: any;
    address2: any;
    working_hours: any;
    form: FormGroup;
    submittedForm = false;
    newDate = new Date();
    dobDate = new Date();
    requestObj: any;
    editObj: any;
    states: any = [];
    district: any = [];
    countrylist: Object;
    zipcodes: any = [];
    filteredstates = this.states.slice();
    filtereddistrict = this.district.slice();
    filtereddzipcodes = this.zipcodes.slice();
    mobileMessage:any;
    minMessage:any;
  maxMessage:any;
  maxMessage1:any;
  userDetails : any;
  labelName: any;
  reset : boolean = false;
    constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private formBuilder: FormBuilder,
      public datepipe: DatePipe,
      private common: CommonService,
      private api: ApiService,
      private location: Location,
      private auth: AuthService,
      private el: ElementRef,
      ) {
      Object.assign(this, { masters, regex, DoctorSpeciality});
    }
    ngOnInit(): void {
      this.common.hubControlEvent('hospital','click','pageload','pageload','','ngOnInit');

      this.getSnapShot();
      this.userDetails = this.auth.getUser();
        this.getCountries('', 'Country');
          this.minMessage = masters.MinLengthMessage;
      this.maxMessage = masters.MaxLengthMessage1;
    this.mobileMessage = masters.MobileNumberLength;
          this.form = this.formBuilder.group({
            hospital_name: ['', [Validators.required,Validators.maxLength(100)]],
            specializedin: ['',  Validators.required],
            doctorname: ['', [Validators.required,Validators.pattern(regex.alphabet),Validators.maxLength(100)]],
            emergency: [false, Validators.nullValidator],
            dean_name: ['', [Validators.pattern(regex.alphabet),Validators.maxLength(100)]],
            isdoctor: [false, Validators.nullValidator],
            mobile:['', [Validators.required, Validators.pattern(regex.mobile)]],
            landline: ['', Validators.nullValidator],
            email: ['', [Validators.nullValidator, Validators.pattern(regex.email)]],            
            country: ['', Validators.required],
            state: ['', Validators.required],
            district: ['', Validators.required],
            pincode: ['', Validators.required],
            website: ['',Validators.nullValidator ],
            working_hours: ['', Validators.nullValidator],
            address1: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
            address2: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
            registrationno : ['',[Validators.nullValidator,Validators.pattern(regex.alphnumericWithHyphen),Validators.maxLength(100)]],
          });
          this.hmId = this.activatedRoute.snapshot.paramMap.get('id');
          if (this.hmId !== null) {
            var Obj = {
              data: {
                spname: "usp_unfyd_hospital_doc",
                parameters: {
                  flag: "EDIT",
                  Id: this.hmId,
                  PRODUCTID:1, 
                  PROCESSID:1
                }
              }
            }
            this.api.post('index', Obj).subscribe(res => {
              this.loader = false;
              this.reset = true;
              if(res.code == 200){
                let _hnObj=res.results.data[0];
                const lowerObj = this.common.ConvertKeysToLowerCase();
                this.form.controls['hospital_name'].setValue(_hnObj.Hospital);
                this.form.controls['specializedin'].setValue(_hnObj.Speciality);
                this.form.controls['doctorname'].setValue(_hnObj.Doctor);
                this.form.controls['emergency'].setValue(_hnObj.Emergency)
                this.form.controls['dean_name'].setValue(_hnObj.Dean);
                this.form.controls['isdoctor'].setValue(_hnObj.IsDoctor);
                this.form.controls['mobile'].setValue(_hnObj.Mobile);
                this.form.controls['landline'].setValue(_hnObj.Landline);
                this.form.controls['email'].setValue(_hnObj.EmailID)
                this.form.controls['website'].setValue(_hnObj.Website);               
                this.form.controls['working_hours'].setValue(_hnObj.Hours);
                this.form.controls['address1'].setValue(_hnObj.Line1);
                this.form.controls['address2'].setValue(_hnObj.Line2);
                this.form.controls['country'].setValue(Number(_hnObj.Country));
                this.getStates(Number(_hnObj.Country));
                this.form.controls['state'].setValue(Number(_hnObj.State));
                this.getDistrict(Number(_hnObj.State));
                this.form.controls['district'].setValue(Number(_hnObj.District));
                this.getZipcodes(Number(_hnObj.District));
                this.form.controls['pincode'].setValue(_hnObj.PIN);   
                this.form.updateValueAndValidity(); 
              }
            })
          } else {
            this.loader = false;
            this.router.navigate(['/masters/hospital/add'])
          }
          this.common.hubControlEvent('hospital','click','pageloadend','pageloadend','','ngOnInit');

    }

    setLabelByLanguage(data) {
      this.common.hubControlEvent('hospital','click','pageloadend','pageloadend',data,'setLabelByLanguage');

      this.common.setLabelConfig(this.userDetails.Processid, 'HospitalDoctor', data)
      this.common.getLabelConfig$.subscribe(data => {
        this.labelName = data;
      });
    }

    config: any;
    getSnapShot() {
      this.common.hubControlEvent('hospital','click','pageloadend','pageloadend','','getSnapShot');

      this.userDetails = this.auth.getUser();
      this.activatedRoute.url.subscribe(url => {
          this.common.setUserConfig(this.userDetails.ProfileType, 'hospital');
          this.common.getUserConfig$.subscribe(data => {
              this.config = data;
            });
      });
      this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      });
      this.setLabelByLanguage(localStorage.getItem("lang"))
  }

    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
    back(): void {
      this.common.hubControlEvent('hospital','click','back','back','','back');

      this.location.back()
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

      var convertedObj = {
        HOSPITAL: this.form.get('hospital_name').value,
        SPECIALITY: this.form.get('specializedin').value,
        DOCTOR: this.form.get('doctorname').value,
        EMERGENCY: Boolean(this.form.get('emergency').value),
        DEAN: this.form.get('dean_name').value,
        ISDOCTOR: Boolean(this.form.get('isdoctor').value),
        MOBILE: Number(this.form.get('mobile').value),
        LANDLINE: Number(this.form.get('landline').value),
        EMAILID: this.form.get('email').value,
        WEBSITE: this.form.get('website').value,        
        HOURS: this.form.get('working_hours').value,
        LINE1: this.form.get('address1').value,
        LINE2: this.form.get('address2').value,
        COUNTRY: Number(this.form.get('country').value),
        STATE: Number(this.form.get('state').value),
        DISTRICT: Number(this.form.get('district').value),
        PIN: Number(this.form.get('pincode').value),       
        createdBy: '',
        modifiedBy: '',
        deletedBy: '',
      }

      if (this.hmId == null) {
     
        this.requestObj = {
          data: {
            spname: "usp_unfyd_hospital_doc",
            parameters: {
              flag: 'INSERT',
              HOSPITAL: this.form.get('hospital_name').value,
              SPECIALITY: this.form.get('specializedin').value,
              DOCTOR: this.form.get('doctorname').value,
              EMERGENCY: Boolean(this.form.get('emergency').value),
              DEAN: this.form.get('dean_name').value,
              ISDOCTOR: Boolean(this.form.get('isdoctor').value),
              MOBILE: Number(this.form.get('mobile').value),
              LANDLINE: Number(this.form.get('landline').value),
              EMAILID: this.form.get('email').value,
              WEBSITE: this.form.get('website').value,        
              HOURS: this.form.get('working_hours').value,
              LINE1: this.form.get('address1').value,
              LINE2: this.form.get('address2').value,
              COUNTRY: Number(this.form.get('country').value),
              STATE: Number(this.form.get('state').value),
              DISTRICT: Number(this.form.get('district').value),
              PIN: Number(this.form.get('pincode').value), 
              PRODUCTID:1, 
              PROCESSID:1,     
              createdBy: '',
              modifiedBy: '',
              deletedBy: ''              
            }
          }
        }
        
      } else {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_hospital_doc",
            parameters: {
              flag: "UPDATE",
              ID: this.hmId,
              HOSPITAL: this.form.get('hospital_name').value,
              SPECIALITY: this.form.get('specializedin').value,
              DOCTOR: this.form.get('doctorname').value,
              EMERGENCY: Boolean(this.form.get('emergency').value),
              DEAN: this.form.get('dean_name').value,
              ISDOCTOR: Boolean(this.form.get('isdoctor').value),
              MOBILE: Number(this.form.get('mobile').value),
              LANDLINE: Number(this.form.get('landline').value),
              EMAILID: this.form.get('email').value,
              WEBSITE: this.form.get('website').value,        
              HOURS: this.form.get('working_hours').value,
              LINE1: this.form.get('address1').value,
              LINE2: this.form.get('address2').value,
              COUNTRY: Number(this.form.get('country').value),
              STATE: Number(this.form.get('state').value),
              DISTRICT: Number(this.form.get('district').value),
              PIN: Number(this.form.get('pincode').value),  
              PRODUCTID:1, 
              PROCESSID:1,     
              createdBy: '',
              modifiedBy: '',
              deletedBy: '' 
            }
          }
        }
        
      }
      this.common.hubControlEvent('hospital','click','','',JSON.stringify(this.requestObj),'submit');

      this.api.post('index', this.requestObj).subscribe(res => {
        if (res.code == 200) {
          this.loader = false;
          this.router.navigate(['masters/hospital']);
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
    getCountries(event, type) {
      this.common.hubControlEvent('hospital','click','','',JSON.stringify(event),'getCountries');

      this.countrylist = [];
      this.common.getLocation(event, type).subscribe(res => {
        this.countrylist = res;
      })
    }
  getStates(event) {
    this.common.hubControlEvent('hospital','click','','',JSON.stringify(event),'getStates');

      this.common.getLocation(event, 'State').subscribe(res => {
          this.states = res;
          this.filteredstates = res;
      });
  }

  getDistrict(event) {
    this.common.hubControlEvent('hospital','click','','',JSON.stringify(event),'getDistrict');

      this.common.getLocation(event, 'District').subscribe(res => {
          this.district = res;
           this.filtereddistrict = res;
      })
  }


  getZipcodes(event) {
    this.common.hubControlEvent('hospital','click','','',JSON.stringify(event),'getZipcodes');

      this.common.getLocation(event, 'Pincode').subscribe(res => {
          this.zipcodes = res;
          this.filtereddzipcodes = res;
      })
  }
}  