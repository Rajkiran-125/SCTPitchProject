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
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

 
  form: FormGroup;
  producttypelist: any;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  requestObj: any;
  path: any;
  editObj: any;
  masters : any;
  minMessage:any;
  maxMessage:any;
  maxMessage1:any;
  labelName: any;
  constructor(private formBuilder: FormBuilder, private api: ApiService, private common: CommonService, private router: Router,
    private auth: AuthService, public datepipe: DatePipe, private activatedRoute: ActivatedRoute,private location: Location,private el: ElementRef,) {
      Object.assign(this, { masters, regex });
  }
  ngOnInit(): void {
    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.minMessage = masters.MinLengthMessage;
    this.maxMessage = masters.MaxLengthMessage1;
    this.maxMessage1 = masters.MaxLengthMessage2;
    this.form = this.formBuilder.group({
      profile:['', [Validators.required, Validators.pattern(regex.char),Validators.maxLength(100)]],
      role: ['', Validators.required],
      roledesc : ['',Validators.maxLength(250)],
      view : [false],
      add  : [false],
      update : [false],
      delete : [false],
      import : [false],
      export : [false],
      report : [false]
      
    })
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_role",
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
      this.router.navigate(['/masters/role/add'])
    }
  }

  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'Role', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  config: any;
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path  = this.activatedRoute.snapshot.data.title
        this.common.setUserConfig(this.userDetails.ProfileType, path);
        this.common.getUserConfig$.subscribe(data => {
            this.config = data;
          });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"));
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
   
    this.commonObj = {
      // view	: '',
      // add   : '',
      edit  : '',
      // update : '',	
      // delete : '', 
      // import	: '',
      // export : '',
      modifiedby	: '',
      deletedby	: '',
      isdeleted	: '',
      privateip : '',
      processid: this.userDetails.Processid,
      productid: 1,
      publicip: this.userDetails.ip,
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version,
      id: this.path !== null ? this.path : '',
    }

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_role",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.EmployeeId,
          ...this.form.value,
          ...this.commonObj,
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/role']);
        this.common.snackbar("Saved Success");
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
