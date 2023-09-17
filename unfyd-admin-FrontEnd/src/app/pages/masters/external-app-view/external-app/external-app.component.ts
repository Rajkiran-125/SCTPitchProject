import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { orderBy } from 'lodash';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { checknull, checknull1, notificationsStep, regex } from 'src/app/global/json-data';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
// import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/global/api.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatAccordion } from '@angular/material/expansion';
import { Subscription } from 'rxjs';
import { I } from '@angular/cdk/keycodes';
import { MatDialog } from '@angular/material/dialog';
import { ApiModuleComponent } from 'src/app/shared/api-module/api-module.component';

@Component({
  selector: 'app-external-app',
  templateUrl: './external-app.component.html',
  styleUrls: ['./external-app.component.scss']
})
export class ExternalAppComponent implements OnInit {
  form: FormGroup;
  loader: boolean = true;
  escalationToggleStatus = true;
  postmanData: any
  dataFromPostman = {};
  allFormControl: any = [];
  showAPIModule = true;
  item : any = {};
  item2 : any = {};
  item3 : any = {};
  submittedForm: boolean = false;
  ID: any;
  userDetails: any;
  requestformat : any = {
    RequestFormat : true
  };
  SSOval : any = {
    RequestFormat : true
  };
  SSODetail: any = {
    RequestFormat : true
  };
  SSOLogout: any = {
    RequestFormat : true
  };
  externalAPIData: any;
  isFormDisabled: boolean = true;
  isFormDisabled2: boolean = true;
  isFormDisabled3: boolean = true;
  UpdateSSOval: any = {};
  UpdateSSODetail:  any = {};
  UpdateSSOLogout:  any = {};
  subscription: Subscription[] = [];
  labelName : any;
  userConfig: any;


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private common: CommonService,
    public dialog: MatDialog,
    private el: ElementRef,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.loader = false;

    this.form = this.formBuilder.group({
      AppName: ['', [Validators.pattern(regex.alphabet), Validators.required]],
      Description: ['', [Validators.nullValidator, Validators.maxLength(500)]]
    },
      { validator: [checknull('AppName'),checknull1('AppName'), checknull1('Description')] });
      this.ID = this.activatedRoute.snapshot.paramMap.get('id');

      this.userDetails = this.auth.getUser();
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))

      this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))

      this.common.setUserConfig(this.userDetails.ProfileType, 'externalApp');
this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

}))
this.setLabelByLanguage(localStorage.getItem("lang"))
      this.isFormDisabled = false;      
      this.isFormDisabled2 = false;      
      this.isFormDisabled3 = false;      
      this.PatchValue()
  }


  back(){
    this.router.navigate(['masters/externalApp/view/']);
  }

  addItem(newItem: string) {
    this.dataFromPostman = newItem
    // console.log(newItem);
  }

 
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  formval3(a){
    // console.log("formvalue:",event);
    this.SSOLogout = a
  }


  formval2(b){
    // console.log("formvalue:",event);
    this.SSODetail = b
  }

  formvalue(e) {
    console.log("formvalue:",e);

    this.SSOval = e
    
  }

  returnControlDropdown() {
    let parentArray = [];
    this.allFormControl.forEach(element => {
      if (element.type === 'list') {
        if (element.formControlName != null && element.formControlName != '' && element.formControlName != undefined && !(element.formControlName.trim().length === 0)) {
          parentArray.push(element.label);
        }
      }
    });
    return parentArray;
  }

  
  returnControlLists() {
    let parentArray = [];
    this.allFormControl.forEach(element => {
      if (element.type !== 'checkbox') {
        if (element.label != null && element.label != '' && element.label != undefined && !(element.label.trim().length === 0)) {
        element.formControlName = element.label.replace(/[ ]/g, '');
        }
      }
      if (element.type !== 'button') {
        if (element.formControlName != null && element.formControlName != '' && element.formControlName != undefined && !(element.formControlName.trim().length === 0)) {
          parentArray.push(element.label);
        }
      }
    });
    return parentArray;
  }

  PatchValue(){
    this.loader = true;
    let obj = {
      data: {
        spname: "USP_EXTERNAL_APP",
        parameters: {
          FLAG: "EDIT",
          id: this.ID
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0 && res.results.data.length > 0) {
          this.externalAPIData = res.results.data[0]
          this.form.controls.AppName.patchValue(res.results.data[0].ExternalAppName)
          this.form.controls.Description.patchValue(res.results.data[0].Description)
          this.item = {...this.requestformat,...JSON.parse(this.externalAPIData["SSO"])}
          this.item2 = {...this.requestformat,...JSON.parse(this.externalAPIData["SSODetail"])}
          this.item3 = {...this.requestformat,...JSON.parse(this.externalAPIData["SSOLogout"])}
          this.SSOval = this.item
          this.SSODetail = this.item2
          this.SSOLogout = this.item3
          // this.SSOval = { ...this.SSOval, ...this.item}
          // this.SSODetail = { ...this.SSOval, ...this.item2}
          // this.SSOLogout = { ...this.SSOval, ...this.item3}

          setTimeout(() => {
            this.isFormDisabled = this.externalAPIData["SSOToggle"]
            this.isFormDisabled2 = this.externalAPIData["SSOToggleDetail"]
            this.isFormDisabled3 = this.externalAPIData["SSOToggleLogout"]          
          });
        

        }
      }
    });
  }

  resetfunc() {
    this.common.triggerReset();
  }

  setLabelByLanguage(data) {

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1        
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'externalApp', data)

  }


  toggleStatusChanged(event: any) {
    this.isFormDisabled = !event.checked;
  }
  toggleStatusChanged2(event: any) {
    this.isFormDisabled2 = !event.checked;
  }
  toggleStatusChanged3(event: any) {
    this.isFormDisabled3 = !event.checked;
  }


  submit(event) {
    this.submittedForm = true;
    this.loader = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }

    this.UpdateSSOval = delete this.SSOval.item;
    this.UpdateSSODetail = delete this.SSODetail.item;
    this.UpdateSSOLogout = delete this.SSOLogout.item;




    this.loader = true;
    let requestObj
    if (this.ID) {
      requestObj = {
        data: {
          spname: "USP_EXTERNAL_APP",
          parameters: {
            flag: "UPDATE",
            id: this.ID,
            Name: this.form.value.AppName,
            Description: this.form.value.Description,
            SSO: JSON.stringify(this.SSOval),
            SSODetail: JSON.stringify(this.SSODetail),
            SSOLogout:JSON.stringify(this.SSOLogout),
            SSOToggle:this.isFormDisabled,
            SSOToggleDetail:this.isFormDisabled2,
            SSOToggleLogout:this.isFormDisabled3,
            MODIFIEDBY: this.userDetails.Id,
          }
        }
      }
    } else {
      requestObj = {
        data: {
          spname: "USP_EXTERNAL_APP",
          parameters: {
            flag: "INSERT",
            Name: this.form.value.AppName,
            Description: this.form.value.Description,
            SSO: JSON.stringify(this.SSOval),
            SSODetail: JSON.stringify(this.SSODetail),
            SSOLogout:JSON.stringify(this.SSOLogout),
            SSOToggle:this.isFormDisabled,
            SSOToggleDetail:this.isFormDisabled2,
            SSOToggleLogout:this.isFormDisabled3,
            PROCESSID: this.userDetails.Processid,
            CREATEDBY: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            PRIVATEIP: '',
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    }
    // console.log("requestObj:",requestObj);

    this.api.post('index', requestObj).subscribe((res: any) => {
      // console.log("additionapi:",res)
      this.loader = false;
      if (res.code == 200) {
        this.common.snackbar('Saved Success');
        if(event == 'add'){
          this.router.navigate(['masters/externalApp/view/']);
        }
        if(event == 'saveaddnew'){
          this.form.reset()
        }

      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    }, error => {
      this.loader = false;
      this.common.snackbar("General Error");
    })

    // }

  }


}
