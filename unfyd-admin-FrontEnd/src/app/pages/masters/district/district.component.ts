import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters,regex } from 'src/app/global/json-data';
import { Location } from '@angular/common'
@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.scss']
})
export class DistrictComponent implements OnInit {
  form: FormGroup;
  producttypelist: any;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  requestObj: any;
  path: any;
  masters:any;
  editObj: any;
  countrylist : any =[];
  stateslist : any =[];
  filteredstates = this.stateslist.slice();
  constructor(private formBuilder: FormBuilder, private api: ApiService, private common: CommonService, private router: Router,
    private auth: AuthService, public datepipe: DatePipe, private activatedRoute: ActivatedRoute,private location: Location,private el: ElementRef,) {
      Object.assign(this, { masters, regex });
  }
  ngOnInit(): void {
    this.common.hubControlEvent('District','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.getCountries('', 'Country');
    this.userDetails = this.auth.getUser();
    this.form = this.formBuilder.group({
      districtname:['', [Validators.required, Validators.pattern(regex.char)]],
      districtcode: ['', Validators.required],
      stateid :['', [Validators.nullValidator]],
      description :  ['', [Validators.nullValidator]],
      countryid :['', [Validators.nullValidator]],
    })

    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_district",
          parameters: {
            "flag": "EDIT",
            "districtid": this.path,
            
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          this.editObj = res.results.data[0];
          const lowerObj = this.common.ConvertKeysToLowerCase();
          this.form.patchValue(lowerObj(this.editObj));
        this.getStates(this.editObj.CountryId)
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/district/add'])
    }
    this.common.hubControlEvent('District','click','pageloadend','pageloadend','','ngOnInit');

  }
  

  config: any;
  getSnapShot() {
    this.common.hubControlEvent('District','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      let path  = this.activatedRoute.snapshot.data.title
        this.common.setUserConfig(this.userDetails.ProfileType, path);
        this.common.getUserConfig$.subscribe(data => {
            this.config = data;
          });
    });
}
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('District','click','back','back','','back');

    this.location.back()
  }

  submit() {
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
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
    if (this.editObj !== undefined) {
      this.commonObj = {
        flag: 'UPDATE',
        modifiedby: this.userDetails.Id,
        districtid: this.editObj.DistrictId
      }
    } else {
      this.commonObj = {
        flag: 'INSERT',
        createdby: this.userDetails.Id,
        publicip: this.userDetails.ip,
        privateip: '',
        browsername: this.userDetails.browser,
        browserversion: this.userDetails.browser_version,
      }
    }

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_district",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.Id,
          ...this.form.value,
          ...this.commonObj
        }
      }
    }
    this.common.hubControlEvent('District','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/district']);
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
    this.common.hubControlEvent('District','click','','',JSON.stringify(event, type),'getCountries');

    this.countrylist = [];
    this.common.getLocation(event, type).subscribe(res => {
      this.countrylist = res;
    })
  }
getStates(event) {
  this.common.hubControlEvent('District','click','','',JSON.stringify(event),'getStates');

  this.common.getLocation(event, 'State').subscribe(res => {
      this.stateslist = res;
      this.filteredstates = res;
  });
}
}
