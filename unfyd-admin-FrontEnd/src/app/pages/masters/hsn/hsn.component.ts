import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
@Component({
  selector: 'app-hsn',
  templateUrl: './hsn.component.html',
  styleUrls: ['./hsn.component.scss']
})
export class HsnComponent implements OnInit {

  loader: boolean = false;
  HSNCodeId: any;
  userDetails: any;
  regex: any;
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  labelName: any;
  reset: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    this.common.hubControlEvent('hsn','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.loader = true;

    this.form = this.formBuilder.group({
      hsncode: ['', [Validators.required, Validators.pattern(regex.numeric)]],
      gst: ['', [Validators.required, Validators.pattern(regex.numeric)]],
      description: ['', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
      processid: [this.userDetails.Processid, Validators.nullValidator],
      publicip: [this.userDetails.ip, Validators.nullValidator],
      privateip: ["", Validators.nullValidator],
      browsername: [this.userDetails.browser, Validators.nullValidator],
      browserversion: [this.userDetails.browser_version, Validators.nullValidator]
    });

    this.HSNCodeId = this.activatedRoute.snapshot.paramMap.get('id');
   
    if (this.HSNCodeId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_hsn_gst_master",
          parameters: {
            flag: "EDIT",
            Id: this.HSNCodeId
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if(res.code == 200){
          const myObjLower = this.common.ConvertKeysToLowerCase();
          this.form.get('hsncode').disable();
          this.form.patchValue(myObjLower(res.results.data[0]));
        
          this.form.updateValueAndValidity(); 
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/hsn/add'])
    }
    this.common.hubControlEvent('hsn','click','pageloadend','pageloadend','','ngOnInit');


  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('hsn','click','pageloadend','pageloadend',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'HSN', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  config: any;
    getSnapShot() {
      this.common.hubControlEvent('hsn','click','pageloadend','pageloadend','','getSnapShot');

      this.userDetails = this.auth.getUser();
      this.activatedRoute.url.subscribe(url => {
          this.common.setUserConfig(this.userDetails.ProfileType, 'hsn');
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
    this.common.hubControlEvent('hsn','click','','','','back');

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
    
    if (this.HSNCodeId == null) {
     
      this.requestObj = {
        data: {
          spname: "usp_unfyd_hsn_gst_master",
          parameters: {
            flag: 'INSERT',
            CREATEDBY: this.userDetails.EmployeeId,
            productid:1,
            ...this.form.value,
          }
        }
      }
      
    } else {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_hsn_gst_master",
          parameters: {
            flag: "UPDATE",
            ID: this.HSNCodeId,
            MODIFIEDBY: this.userDetails.EmployeeId,
            ...this.form.value,
          }
        }
      }
      
    }
    this.common.hubControlEvent('hsn','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/hsn']);
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
