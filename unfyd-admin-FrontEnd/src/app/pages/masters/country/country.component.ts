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
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {


 
  form: FormGroup;
  producttypelist: any;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  masters:any;
  requestObj: any;
  path: any;
  editObj: any;
  constructor(private formBuilder: FormBuilder, private api: ApiService, private common: CommonService, private router: Router,
    private auth: AuthService, public datepipe: DatePipe, private activatedRoute: ActivatedRoute,private location: Location,private el: ElementRef,) {
      Object.assign(this, { masters, regex });
  }
  ngOnInit(): void {
    this.common.hubControlEvent('Country','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.form = this.formBuilder.group({
      countryname:['', [Validators.required, Validators.pattern(regex.char)]],
      countrycode: ['', Validators.required],
      description :  ['', [Validators.nullValidator]]
    })
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_countries",
          parameters: {
            "flag": "EDIT",
            "countryid": this.path,
           
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
        
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/country/add'])
    }
    this.common.hubControlEvent('Country','click','pageloadend','pageloadend','','ngOnInit');

  }


  config: any;
  getSnapShot() {
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
    this.common.hubControlEvent('Country','click','back','back','','back');

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
        countryid: this.editObj.CountryID
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
        "spname": "usp_unfyd_countries",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.Id,
          ...this.form.value,
          ...this.commonObj
        }
      }
    }
    this.common.hubControlEvent('Country','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/country']);
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
}
