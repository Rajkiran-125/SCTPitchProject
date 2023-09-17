import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
// import { addSkillsObj, updateSkillsObj } from 'src/app/global/json-data';
import { masters, regex } from 'src/app/global/json-data';


@Component({
  selector: 'app-police-station',
  templateUrl: './police-station.component.html',
  styleUrls: ['./police-station.component.scss']
})
export class PoliceStationComponent implements OnInit {

  loader: boolean = false;
  submittedForm = false;
  zipcodes:any=[];
  form: FormGroup;
  requestObj: { data: { spname: string; parameters: any } };
  skillId: any;
  userDetails: any;
  masters: any= masters
    countrylist: Object;
    statess= [{ id: 0, name: 'One' }, { id: 1, name: 'Two' }];
    states : any = [];
    district: any = [];
    headquarterList  = [];
    editObj: any;
     filteredstates = this.states.slice();
     filtereddistrict =  this.district.slice();
     filtereddzipcodes = this.zipcodes.slice(); 
     minMessage:any;
     maxMessage:any;
     maxMessage1:any;
     mobileMessage:any;
  labelName: any;
  reset: boolean;
  constructor(
      private formBuilder: FormBuilder,
      private common: CommonService,
      private activatedRoute: ActivatedRoute,
      private api: ApiService,
      private router: Router,
      private auth: AuthService,
      private location: Location,
      private el: ElementRef,
  ) {}

  filteredheadquarter = this.headquarterList.slice(); 

  ngOnInit(): void {
    this.common.hubControlEvent('PoliceStation','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.getCountries('', 'Country');
    this.getHeadquarter();
      this.userDetails = this.auth.getUser();
      this.minMessage = masters.MinLengthMessage;
    this.maxMessage = masters.MaxLengthMessage1;	
	this.maxMessage1 = masters.MaxLengthMessage2;
  this.mobileMessage = masters.MobileNumberLength;
      //  this.loader=true
      const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
      this.form = this.formBuilder.group({
        psname: ['', [Validators.required,Validators.pattern(regex.alphabet),Validators.maxLength(100)]],
        ishq: [false],
        incharge: ['', [Validators.nullValidator,Validators.maxLength(100)]],
          hqname: ['', Validators.nullValidator],
          mobile: ['', [Validators.nullValidator]],
          landline: ['', Validators.nullValidator],
          emailid: ['',[ Validators.nullValidator,Validators.email]],
          website:  ['', Validators.nullValidator],
          line1: ['', Validators.nullValidator],
          line2: ['', Validators.nullValidator],
          // City: ['', Validators.required],
          pin: ['', Validators.nullValidator],
          State: ['', Validators.required],
          District: ['', Validators.required],
          Country: ['', Validators.required],
          publicip: [this.userDetails.ip, Validators.nullValidator],
          browsername: [this.userDetails.browser, Validators.nullValidator],
          browserversion: [this.userDetails.browser_version, Validators.nullValidator],
          processid:  [this.userDetails.Processid, Validators.nullValidator],
          productid:  [this.userDetails.ProductId, Validators.nullValidator],
          lat  : [this.userDetails.latitude, Validators.nullValidator],
          long : [this.userDetails.longitude, Validators.nullValidator],
      });

      this.skillId = this.activatedRoute.snapshot.paramMap.get('id');

      if (this.skillId !== null) {
          var Obj = {
            data: {
              spname: "usp_unfyd_police_stn",
              parameters: {
                flag: "EDIT",
                processid:this.userDetails.Processid,
                productid:this.userDetails.ProductId,
                Id:this.skillId
              }
            }
          };
          this.api.post('index', Obj).subscribe(res => {
              this.loader = false;
              this.reset = true;
              if (res.code == 200) {
                this.loader = false;
                this.editObj = res.results.data[0];
                
                const lowerObj = this.common.ConvertKeysToLowerCase();
                this.getStates(this.editObj.Country);
                this.getDistrict(this.editObj.State);
                this.getZipcodes(this.editObj.District);
                this.form.patchValue(lowerObj(this.editObj));
                this.form.patchValue({
                  Country: JSON.parse(this.editObj.Country),
                  State: JSON.parse(this.editObj.State),
                  District: JSON.parse(this.editObj.District),
                })
           
                this.form.updateValueAndValidity();
              }
          });
      } else {
          this.loader = false;
          this.router.navigate(['/masters/policeStation/add']);
      }
      this.common.hubControlEvent('PoliceStation','click','pageloadend','pageloadend','','ngOnInit');

  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('PoliceStation','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'PoliceStation', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }

  config: any;
  getSnapShot() {
    this.common.hubControlEvent('PoliceStation','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
        this.common.setUserConfig(this.userDetails.ProfileType, 'policeStation');
        this.common.getUserConfig$.subscribe(data => {
            this.config = data;
          });
    });

    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
    
}
getCountries(event, type) {
  this.common.hubControlEvent('PoliceStation','click','','',event,'getCountries');

  this.countrylist = [];
  this.common.getLocation(event, type).subscribe(res => {
    this.countrylist = res;
  })
}
getStates(event) {
  this.common.hubControlEvent('PoliceStation','click','','',event,'getStates');

    this.common.getLocation(event, 'State').subscribe(res => {
        this.states = res;
        this.filteredstates = res;
    });
}

getDistrict(event) {
  this.common.hubControlEvent('PoliceStation','click','','',event,'getDistrict');

      this.common.getLocation(event, 'District').subscribe(res => {
        this.district = res;
       this.filtereddistrict = res;
      })
}


getZipcodes(event){
  this.common.hubControlEvent('PoliceStation','click','','',event,'getZipcodes');

    this.common.getLocation(event, 'Pincode').subscribe(res => {
      this.zipcodes = res;
      this.filtereddzipcodes = res;
    })
  }

  getHeadquarter(){
  let obj =   {
      "data": {
          "spname": "usp_unfyd_police_stn",
          "parameters": {
              "flag": "GETHQ"
          }
      }
  }
  this.common.hubControlEvent('PoliceStation','click','','',JSON.stringify(obj),'getHeadquarter');

  this.api.post('index', obj).subscribe((res) => {
    if (res.code == 200) {
      this.headquarterList = res.results.data;
    }
  }) }

  get f() {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('PoliceStation','click','back','back','','back');

    this.location.back()
  }
  submit(): void {
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

      if (this.skillId == null) {
          this.requestObj = {
              data: {
                  spname: 'usp_unfyd_police_stn',
                  parameters: {
                  
                    flag: 'INSERT',
                    ...this.form.value,
                  },
              },
          };
      } else {
          this.requestObj = {
              data: {
                  spname: 'usp_unfyd_police_stn',
                  parameters: {
                      flag: 'UPDATE',
                      ID: this.skillId,
                      MODIFIEDBY: this.userDetails.EmployeeId,
                      ...this.form.value,
                  },
              },
          };
      }
      this.common.hubControlEvent('PoliceStation','click','','',JSON.stringify(this.requestObj),'submit');

      this.api.post('index', this.requestObj).subscribe(                              
          (res: any) => {
              if (res.code == 200) {
                  this.loader = false;
                  this.router.navigate(['masters/policeStation']);
                  this.common.snackbar("Success");
              } else {
                  this.loader = false;
              }
          },
          (error) => {
              this.loader = false;
              this.common.snackbar("General Error");
          }
      );
  }
}




