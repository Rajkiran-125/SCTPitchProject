import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {
  loader: boolean = false;
  submittedForm = false;
  masters: any;
  form: FormGroup;
  requestObj: { data: { spname: string; parameters: any } };
  path: any;
  userDetails: any;
  labelName: any;
  editobj: any;
  reset: boolean;
  modules: any;
  submodules: any;
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

  ngOnInit() {
    this.common.hubControlEvent('Error-Message','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.getModule();
    this.loader = false;
    this.form = this.formBuilder.group({
      module: ['', Validators.nullValidator],
      submodule: ['NULL', Validators.nullValidator],
      errormessage: ['', Validators.nullValidator],
      errormessagecode: ['', Validators.nullValidator],
      errormessagedescription: ['', Validators.nullValidator],
      processid: [this.userDetails.Processid, Validators.nullValidator],
      publicip: [this.userDetails.ip, Validators.nullValidator],
      privateip: ['', Validators.nullValidator],
      browsername: [this.userDetails.browser, Validators.nullValidator],
      browserversion: [this.userDetails.browser_version, Validators.nullValidator]
    });
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {                                     //when ngoninit is loaded ,  path is not present then data is fetched 
      var Obj = {
        data: {
          spname: 'usp_unfyd_error_message',
          parameters: {
            flag: 'EDIT',
            processid: this.userDetails.Processid,
            productid: 1,
            Id: this.path
          },
        },
      };
      this.api.post('index', Obj).subscribe((res: any) => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          const myObjLower = this.common.ConvertKeysToLowerCase();
          this.editobj = res.results.data[0];
          this.form.patchValue(myObjLower(res.results.data[0]));
          this.form.updateValueAndValidity();
        }
      });
    } else {                                                                  //when user click add btn 
      this.loader = false;
      this.router.navigate(['/masters/error-message/add']);
    }
    this.common.hubControlEvent('Error-Message','click','pageloadend','pageloadend','','ngOnInit');

  }
  
  get f() {
    return this.form.controls;
  }
  back(): void {
    this.common.hubControlEvent('Error-Message','click','back','back','','back');

    this.location.back()
  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('Error-Message','click','back','back',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'Error-Message', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('Error-Message','click','back','back','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'Error-Message');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }
  getModule() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET',
          processid: this.userDetails.Processid,
          productid: 1,
        },
      },
    };
    this.common.hubControlEvent('Error-Message','click','','',JSON.stringify(this.requestObj),'getModule');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.modules = res.results.data;
      }
    });
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

    if (this.path == null) {                                               //on the basis of skillid from params it gets inerted or updated  
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_error_message',
          parameters: {
            flag: 'INSERT',
            createdby: this.userDetails.Id,
            productid: 1,
            ...this.form.value,
          },
        },
      };
    } else {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_error_message',
          parameters: {
            flag: 'UPDATE',
            ID: this.path,
            MODIFIEDBY: this.userDetails.Id,
            ...this.form.value,
          },
        },
      };
    }
    this.common.hubControlEvent('Error-Message','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe(                         //every  api response in fee component                
      (res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.router.navigate(['masters/error-message']);
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
