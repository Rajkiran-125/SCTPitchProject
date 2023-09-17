import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-email-notification-master',
  templateUrl: './email-notification-master.component.html',
  styleUrls: ['./email-notification-master.component.scss']
})
export class EmailNotificationMasterComponent implements OnInit {
  loader: boolean = false;
  submittedForm = false;
  masters: any;
  form: FormGroup;
  requestObj: { data: { spname: string; parameters: any } };
  id: any;
  userDetails: any;
  labelName: any;
  editobj: any;
  reset: boolean;
  config: any;
  check : boolean = false;
  constructor(private formBuilder: FormBuilder,
    private common: CommonService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private location: Location,
    private el: ElementRef,) { }

  ngOnInit() {
    this.userDetails = this.auth.getUser();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.form = this.formBuilder.group({
      category: ['', Validators.required],
      templatekey: ['', [Validators.required]],
      templatevalue: ['', [Validators.required]],
      notifyevent: ['', [Validators.required]],
      status: [false,[Validators.required]],
      processid: [this.userDetails.Processid, Validators.nullValidator],
      publicip: [this.userDetails.ip, Validators.nullValidator],
      privateip: ['', Validators.nullValidator],
      browsername: [this.userDetails.browser, Validators.nullValidator],
      browserversion: [this.userDetails.browser_version, Validators.nullValidator]
    });
    if (this.id !== null) {                                     //when ngoninit is loaded ,  id is not present then data is fetched 
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_email_notification_master',
          parameters: {
            flag: 'EDIT',
            Id: Number(this.id)
          },
        },
      };
      this.api.post('index', this.requestObj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          if (res.results.data.length > 0) {
            const lowerObj = this.common.ConvertKeysToLowerCase();
            this.editobj = lowerObj(res.results.data[0]);
            var temp = JSON.parse(JSON.parse(JSON.stringify(this.editobj.template)));
            this.form.get("templatekey").patchValue(temp.TemplateKey);
            this.form.get("templatevalue").patchValue(temp.TemplateValue);
            this.form.get("status").patchValue(temp.Status);
            this.form.get("notifyevent").patchValue(temp.NotifyEvent);
            this.check = temp.Status;
            this.form.patchValue(this.editobj);
            this.form.updateValueAndValidity();
          }
        }
      });
    } else {                                                                  //when user click add btn 
      this.loader = false;
      this.router.navigate(['/masters/email-notification-master/add']);
    }
  }
  get f() {
    return this.form.controls;
  }
  submit(){ 
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
    var tempKey = this.form.get("templatekey").value;
    var tempValue = this.form.get("templatevalue").value;
    var tempStatus = this.form.get("status").value;
    var tempEvent = this.form.get("notifyevent").value;
    var json = '{ "TemplateKey" : "'+tempKey+ '", "TemplateValue" : "'+tempValue+'", "NotifyEvent" : "'+tempEvent+'", "Status" : "'+tempStatus+ '"}';
    if (this.id == null) {  
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_email_notification_master',
          parameters: {
            flag: 'INSERT',
            productid: 1,
            processid : this.form.get("processid").value,
            createdby: Number(this.userDetails.Id),
            category : this.form.get("category").value,
            template : json,
            publicip : this.form.get("publicip").value,
            privateip : this.form.get("privateip").value,
            browsername : this.form.get("browsername").value,
            browserversion : this.form.get("browserversion").value
          },
        },
      };
    }else {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_email_notification_master',
          parameters: {
            flag: 'UPDATE',
            ID: this.id,
            MODIFIEDBY: this.userDetails.Id,
            category : this.form.get("category").value,
            template : json,
          },
        },
      };
    }
    this.api.post('index', this.requestObj).subscribe(                         //every  api response in fee component                
      (res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.router.navigate(['masters/email-notification-master']);
          this.common.snackbar("Saved Success");
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
  back(): void {
    this.location.back()
  }
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'batch');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }
  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'batch', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
}
