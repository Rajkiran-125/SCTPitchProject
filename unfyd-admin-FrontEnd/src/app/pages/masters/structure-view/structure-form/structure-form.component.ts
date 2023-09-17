import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import {checknull1, regex, masters, formControlObj} from 'src/app/global/json-data';

@Component({
  selector: 'app-structure-form',
  templateUrl: './structure-form.component.html',
  styleUrls: ['./structure-form.component.scss']
})
export class StructureFormComponent implements OnInit {
  id:string
  resetform: boolean = true;
  loader: boolean = false
  @Input() isDialog = false
  selectedIndex = 0
  dummyAllFormControl = []
  userDetails :any = this.auth?.getUser() || {};
  commonDetails = {
    PROCESSID: this.userDetails?.Processid,
    PRODUCTID: this.userDetails?.Productid,
    publicip: this.userDetails?.ip,
    PRIVATEIP: '',
    browsername: this.userDetails?.browser,
    browserversion: this.userDetails?.browser_version
  }
  form : FormGroup
  userConfig:any
  subscription : Subscription[]= []
  subscriptionAcitivateData : Subscription[]= []
  labelName
  public masters:any = {}
  constructor(private activatedRoute : ActivatedRoute, private common: CommonService, private auth: AuthService, private router: Router, private formBuilder: FormBuilder, private api: ApiService,private el: ElementRef) {
    Object.assign(this.masters,{...masters})
  }

  ngOnInit(): void {
    console.log(this.commonDetails);

    this.loader = true;
    this.form = this.formBuilder.group({
      structurename: ['', [Validators.required,Validators.pattern(regex?.alphanumericwithspecialcharacter), Validators.maxLength(100)]],
      description: ['', [ Validators.minLength(3), Validators.maxLength(500)]],
      jsondata: [[], [ Validators.nullValidator]]
    },{ validator: [checknull1('structurename'),checknull1('description')] });
    this.getSnapShot()
  }

  getSnapShot() {
    this.subscription.push(this.activatedRoute.params.subscribe((params) => {
      if(params.hasOwnProperty('id')){
        this.id = params?.id
        this.getData()
      } else{
        this.loader = false
        setTimeout(() => {
          this.common.addFormControl.next(true)
        });
      }
    }))
    this.common.setUserConfig(this.userDetails.ProfileType, 'structure');
    this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
    }))
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }

  setLabelByLanguage(data) {
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'structure', data)

  }

  back() {
    this.router.navigate(['masters/structure/view']);
  }

  getData(){
    let obj = {
      data: {
        spname: "usp_unfyd_form_structure",
        parameters: {
          FLAG :'EDIT',
          ID : this.id
        }
      }
    }
    this.api.post('index',obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.resetform = true
        if(res.results.data.length > 0){
            this.loader = false;
            const lowerObj = this.common.ConvertKeysToLowerCase();
            res.results.data[0] = lowerObj(res.results.data[0]);
            this.form.controls['structurename'].patchValue(res.results.data[0].structurename)
            this.form.controls['description'].patchValue(res.results.data[0].description)
            this.form.controls['jsondata'].patchValue(res.results.data[0].jsondata && JSON.parse(res.results.data[0].jsondata).length > 0 ? JSON.parse(res.results.data[0].jsondata) : [] )
            this.dummyAllFormControl = [...this.form.value.jsondata]
          }
        }
    })
  }

  get f(){ return this.form.controls;}

  changesDone(val){
    this.dummyAllFormControl = val
    console.log(val);

  }

  resetTaskGroup(val){
    this.form.controls['structurename'].patchValue('')
    this.form.controls['description'].patchValue('')
    this.form.controls['jsondata'].patchValue([])
    this.dummyAllFormControl = []
    this.form.updateValueAndValidity()
  }

  changesDone1(val){
    this.dummyAllFormControl = val
    this.form.controls['jsondata'].patchValue(val)
    this.form.updateValueAndValidity()
  }

  selectedIndexValue(value: any) {
    this.selectedIndex = value
  }

  reset(){
    this.form.reset()
    this.form.controls['jsondata'].patchValue([])
    this.dummyAllFormControl = []
    setTimeout(() => {
     this.common.addFormControl.next(true)
    });
  }

  submit(event){
    this.loader = true;
    let validform = this.form.value.jsondata.filter(r => !this.common.checkTruthyValue(r.formControlName) || !this.common.checkTruthyValue(r.label))
    if (this.form.invalid || this.form.value.jsondata.length == 0 || validform.length > 0) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          return
        }
      }
      if(validform.length  > 0){
        this.common.snackbar("Invalid Form Fields");
        return
      }

      if(this.form.value.jsondata.length == 0){
        this.common.snackbar("Form Fields Required");
        return
      }
    }

    let obj = {}
    if(!this.id){
      obj = {
        data: {
          spname: "usp_unfyd_form_structure",
          parameters: {
            FLAG :'INSERT',
            STRUCTURENAME: this.form.value.structurename,
            DESCRIPTION: this.form.value.description,
            JSONDATA : this.form.value?.jsondata.length > 0 ? JSON.stringify(this.form.value?.jsondata) : '',
            CREATEDBY: this.userDetails?.Id,
            ...this.commonDetails
          }
        }
      }
    }else{
      obj = {
        data: {
          spname: "usp_unfyd_form_structure",
          parameters: {
            FLAG :'update',
            STRUCTURENAME: this.form.value.structurename,
            DESCRIPTION: this.form.value.description,
            JSONDATA : this.form.value?.jsondata ? JSON.stringify(this.form.value?.jsondata) : '',
            MODIFIEDBY: this.userDetails.Id,
            ID : this.id,
            ...this.commonDetails
          }
        }
      }
    }

    this.api.post('index',obj).subscribe((res: any) => {
      this.loader = false;
        if (res.code == 200) {
          if(res.results.data.length > 0){
            // this.common.refreshMenu(true);
            if(!this.id && res.results.data[0].result?.toLowerCase().includes("success")){
              this.common.snackbar('Record add');
              if(event == 'saveAndAddNew'){
                this.reset()
              }else{
                this.router.navigate(['masters/structure/view']);
              }
            }
            else if(this.id && res.results.data[0].result?.toLowerCase().includes("success")) {
              this.common.snackbar('Update Success');
              this.router.navigate(['masters/structure/view']);
            }
            else if (res.results.data[0].Status == true) {
              this.common.confirmationToMakeDefault('AcitvateDeletedData');
              this.subscriptionAcitivateData.push(this.common.getIndividualUpload$.subscribe(status => {
                if(status.status){
                  let obj1 = {
                    data: {
                      spname: "usp_unfyd_form_structure",
                      parameters: {
                        flag: 'ACTIVATE',
                        structurename: this.form.value.structurename,
                        modifiedby: this.userDetails.Id,
                        processid: this.userDetails.Processid,
                      }
                    }
                  };
                  this.api.post('index', obj1).subscribe((res: any) => {
                    if (res.code == 200) {
                      if(event == 'add'){
                        this.common.snackbar('Record add');
                        this.router.navigate(['masters/structure/view']);
                      } else if (event == 'saveAndAddNew') {
                        this.common.snackbar('Record add');
                        this.reset()
                      }
                    }
                  });
                }
                this.subscriptionAcitivateData.forEach((e) => {
                  e.unsubscribe();
                });
              }))
            }
            else if((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)){
              this.common.snackbar('Data Already Exist');
            }
          }
        }
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
