import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { regex, hawkerFormSteps, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { log } from 'console';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

  masters: any;
  form: FormGroup;
  producttypelist: any;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  requestObj: any;
  path: any;
  editObj: any;
  ddgst: any;
  minMessage: any;
  maxMessage: any;
  maxMessage1: any;
  labelName: any;
  regex: any;
  hawkerFormSteps: string[] = [];
  reset: boolean;
  masterConfig: any;
  modules: any = [];
  userConfig: any;
  LabelId: any;
  tabKey: any;
  tabValue: any;
  tabValueReplica: any;
  array: any;
  updateModules: any[];
  languageType = []
  product: any;
  subscription: Subscription[] = [];
  categories: any;
  categoryname: any;
  subcategory: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private location: Location
  ) {
    Object.assign(this, { regex, hawkerFormSteps, masters });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('label','click','pageload','pageload','','ngOnInit');
    this.getSnapShot();
    // this.getModule();
    this.getCategory();

    this.form = this.formBuilder.group({
      ProcessId: ['', Validators.nullValidator],
      ProductId: ['', Validators.nullValidator],
      Category: ['', Validators.nullValidator],
      Subcategory: ['', Validators.nullValidator],
      ModuleName: ['', Validators.required],
      SubModule: ['NULL', Validators.nullValidator],
      ColumnName: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      LabelName: ['', [Validators.required]],
      Title: ['', [Validators.pattern(regex.alphabetWithUnderScore), Validators.maxLength(100)]],
      ValidationMessage: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      Insert: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      Select: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      Update: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      Delete: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      Language: ['', Validators.required],
      Key: ['', [Validators.required, Validators.pattern(regex.alphabetWithUnderScore), Validators.maxLength(100)]],
      IsVisible: [false, Validators.nullValidator],
    })
    this.subscription.push(this.common.labelView$.subscribe(res => {
      if (res != false){
         this.product = res.product
        //  console.log(res);

      }}))
    this.LabelId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.LabelId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_form_validation",
          parameters: {
            flag: "EDIT",
            Id: this.LabelId,
            ProcessId: this.userDetails.Processid,

          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.loader = false;
          this.editObj = res.results.data[0];
          this.getCategory()
          this.form.patchValue(this.editObj);
          this.form.get('Category').patchValue(this.editObj.ParentModule)
          // this.form.controls.PARENTMODULE.patchValue(this.editObj.Category)
          this.form.controls.Subcategory.patchValue(res.results.data[0].SubModule)
          this.getSubCategory(this.form.value.Category)
          this.getModule(this.form.value.ParentModule)
          this.form.get('ModuleName').patchValue(this.editObj.ModuleName.toString());
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/label/add'])
    }

    this.getLanguage()
    this.common.hubControlEvent('label','click','pageloadend','pageloadend','','ngOnInit');

  }
  get f(): { [Key: string]: AbstractControl } {
    return this.form.controls;
  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('label','click','pageloadend','pageloadend',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'Label', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('label','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.getCategory();
    this.common.setUserConfig(this.userDetails.ProfileType, 'label');
    this.common.getUserConfig$.subscribe(data => {
      this.userConfig = data
      // console.log(this.userConfig,"userconfig label")
    });

    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.masterConfig = {
        languages: JSON.parse(data.KnownLanguages),
      }
    }
    );
  }



  back(): void {
    this.common.hubControlEvent('label','click','back','back','','back');

    this.location.back()
  }
  submit() {
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
    if (this.LabelId == null) {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_form_validation',
          parameters: {
            flag: 'INSERT',
            CREATEDBY: this.userDetails.Id,
            ProcessId: this.userDetails.Processid,
            ProductId: this.product,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
            modulename: this.form.get('ModuleName').value,
            PARENTMODULE: this.form.get('Category').value,
            SUBMODULE: this.form.get('Subcategory').value,
            columnname: this.form.get('ColumnName').value,
            labelname: this.form.get('LabelName').value,
            // title: this.form.get('Title').value,
            language: this.form.get('Language').value,
            key: this.form.get('Key').value,
            validationmessage: this.form.get('ValidationMessage').value,
            isvisible: this.form.get('IsVisible').value,
            insert: this.form.get('Insert').value,
            update: this.form.get('Update').value,
            select: this.form.get('Select').value,
            delete: this.form.get('Delete').value
          },
        },
      };
    } else {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_form_validation',
          parameters: {
            flag: 'UPDATE',
            ID: this.LabelId,
            MODIFIEDBY: this.userDetails.Id,
            PARENTMODULE: this.form.get('Category').value,
            SUBMODULE: this.form.get('Subcategory').value,
            modulename: this.form.get('ModuleName').value,
            columnname: this.form.get('ColumnName').value,
            labelname: this.form.get('LabelName').value,
            title: this.form.get('Title').value,
            language: this.form.get('Language').value,
            key: this.form.get('Key').value,
            validationmessage: this.form.get('ValidationMessage').value,
            isvisible: this.form.get('IsVisible').value
          },
        },
      };
    }

    this.common.hubControlEvent('label','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.router.navigate(['masters/label']);
          this.common.snackbar("Success",'success');
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

  getSubCategory(category: any) {

    this.categoryname = category
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET_SUB_MODULE_CATEGORY',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          MODULEGROUPPING: this.categoryname
        },
      },
    };
    this.common.hubControlEvent('Privilege','click','','',JSON.stringify(this.requestObj),'getSubCategory');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.subcategory = res.results.data;

      }
    });
  }

  getCategory() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          FLAG: 'GET_MODULE_CATEGORY',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,

        },
      },
    };
    this.common.hubControlEvent('Privilege','click','','',JSON.stringify(this.requestObj),'getCategory');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.categories = res.results.data;
      }
    });

  }
  getModule(subcategories: any) {

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET_MODULE_LIST',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          MODULEGROUPPING: this.categoryname,
          SUBMODULEGROUPPING: subcategories
        },
      },
    };
    this.common.hubControlEvent('Privilege','click','','',JSON.stringify(this.requestObj),'getModule');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.modules = res.results.data;
      }
    });
  }
  getLanguage() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('label','click','','',JSON.stringify(this.requestObj),'getLanguage');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.languageType = res.results['data']
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
