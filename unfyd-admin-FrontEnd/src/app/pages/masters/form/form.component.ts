import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit {
    loader: boolean = false;
    regex: any;
    form: FormGroup;
    submittedForm = false;
    requestObj: any;
    userDetails: any;
    formId:any;
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
      this.getSnapShot();
        this.userDetails = this.auth.getUser();
        this.loader = false;
        this.form = this.formBuilder.group({
            Module: ['', Validators.required],
            DisplayName: ['', Validators.nullValidator],
            ModuleURL: ['', Validators.required],
            ModuleGroupping: ['', Validators.required],
            processid: [this.userDetails.Processid, Validators.nullValidator],
            publicip: [this.userDetails.ip, Validators.nullValidator],
            privateip: ['', Validators.nullValidator],
            browsername: [this.userDetails.browser, Validators.nullValidator],
            browserversion: [this.userDetails.browser_version, Validators.nullValidator],
            Icon:['', Validators.nullValidator],
            Description:['', Validators.nullValidator],
          });

          this.formId = this.activatedRoute.snapshot.paramMap.get('id');
          if (this.formId !== null) {
            var Obj = {
              data: {
                spname: "usp_unfyd_form_module",
                parameters: {
                  flag: "EDIT",
                  Id: this.formId
                }
              }
            }
            this.api.post('index', Obj).subscribe(res => {
              this.loader = false;
              this.reset = true;
              if(res.code == 200){
                this.form.patchValue(res.results.data[0]);
                this.form.get('Module').disable();
                this.form.updateValueAndValidity(); 
              }
            })
          } else {
            this.loader = false;
            this.router.navigate(['/masters/form/add'])
          }
    }
    
    setLabelByLanguage(data) {
      this.common.setLabelConfig(this.userDetails.Processid, 'FORM', data)
      this.common.getLabelConfig$.subscribe(data => {
        this.labelName = data;
      });
    }
    config: any;
    getSnapShot() {
      this.userDetails = this.auth.getUser();
      this.activatedRoute.url.subscribe(url => {
          this.common.setUserConfig(this.userDetails.ProfileType, 'form');
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
    
    if (this.formId == null) {
     
      this.requestObj = {
        data: {
          spname: "usp_unfyd_form_module",
          parameters: {
            flag: 'INSERT',
            CREATEDBY: this.userDetails.Id,
            processid: this.userDetails.Processid,
            productid:1,
            ...this.form.value,
          }
        }
      }
      
     } else {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_form_module",
          parameters: {
            flag: "UPDATE",
            ID: this.formId,
            MODIFIEDBY: this.userDetails.Id,
            ...this.form.value,
          }
        }
      }
     }

     this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/form']);
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
