import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, regex } from 'src/app/global/json-data';
import { Location } from '@angular/common'

@Component({
  selector: 'app-role-subtype',
  templateUrl: './role-subtype.component.html',
  styleUrls: ['./role-subtype.component.scss']
})
export class RoleSubtypeComponent implements OnInit {

  form: FormGroup;
  submittedForm = false;
  userDetails: any;
  path: string;
  masters: any;
  editObj: any;
  modules: any;
  loader: boolean = false;
  requestObj: { data: { spname: string; parameters: any } };
  reset: boolean;
  constructor(private formBuilder: FormBuilder, private api: ApiService, private common: CommonService, private router: Router,
    private auth: AuthService, public datepipe: DatePipe, private activatedRoute: ActivatedRoute, private location: Location, private el: ElementRef,) {
    Object.assign(this, { masters, regex });
  }

  ngOnInit() {
    this.getSnapShot();
    this.getModule();
    this.userDetails = this.auth.getUser();
    this.form = this.formBuilder.group({
      subtype: ['', Validators.required],
      subtypedesc: ['', Validators.maxLength(250)],
      moduleid: ['', Validators.nullValidator]
    });
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_role_subtype",
          parameters: {
            "flag": "EDIT",
            Id: this.path,
            "ProcessId": this.userDetails.Processid,
            "ProductId": 1
          }
        }
      }
      this.api.post('index', Obj).subscribe((res: any) => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {        
          this.loader = false;
          this.editObj = res.results.data[0];       
          const lowerObj = this.common.ConvertKeysToLowerCase();
          this.form.get('subtype').disable();
          this.form.patchValue(lowerObj(this.editObj));
          this.form.get('moduleid').setValue(this.editObj.Actionable.split(',')),
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/profile-type/add'])
    }
  }
  getModule() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {      
        this.loader = false;
        this.modules = res.results.data;
      }
    });
  }
  config: any;
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, 'ProfileType');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  back(): void {
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
    if (this.path == null) {                                              
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_role_subtype',
          parameters: {
            flag: 'INSERT',
            processid: this.userDetails.Processid,
            productid: 1,
            createdby: this.userDetails.Id,
            moduleid: this.form.get('moduleid').value.toString(),
            subtype: this.form.get('subtype').value,
            subtypedesc: this.form.get('subtypedesc').value,
          },
        },
      };
    } else {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_role_subtype',
          parameters: {
            flag: 'UPDATE',
            ID: this.path,
            MODIFIEDBY: this.userDetails.Id,
            moduleid:this.form.get('moduleid').value.toString(),
            subtype: this.form.get('subtype').value,
            subtypedesc: this.form.get('subtypedesc').value,
          },
        },
      };
    }

    this.api.post('index', this.requestObj).subscribe(                         //every  api response in fee component                
      (res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.router.navigate(['/masters/profile-type']);
          this.common.snackbar("Saved Success");
        } else {
          this.loader = false;
        }
      },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    )
  }
}
