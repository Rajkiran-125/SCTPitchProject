import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss']
})
export class BatchComponent implements OnInit {
  loader: boolean = false;
  submittedForm = false;
  masters: any;
  form: FormGroup;
  requestObj: { data: { spname: string; parameters: any } };
  batchId: any;
  userDetails: any;
  labelName: any;
  editobj: any;
  reset: boolean;
  config: any;
  constructor(private formBuilder: FormBuilder,
    private common: CommonService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private location: Location,
    private el: ElementRef,
  ) {

    Object.assign(this, { masters });
  }

  ngOnInit() {
    this.common.hubControlEvent('batch','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.batchId = this.activatedRoute.snapshot.paramMap.get('id');
    this.form = this.formBuilder.group({
      batchid: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.pattern(regex.numeric)]],
      batchstartdate: ['', [Validators.required]],
      batchenddate: ['', [Validators.required]],
      processid: [this.userDetails.Processid, Validators.nullValidator],
      publicip: [this.userDetails.ip, Validators.nullValidator],
      privateip: ['', Validators.nullValidator],
      browsername: [this.userDetails.browser, Validators.nullValidator],
      browserversion: [this.userDetails.browser_version, Validators.nullValidator]
    });

    if (this.batchId !== null) {
      var Obj = {
        data: {
          spname: 'usp_unfyd_batch',
          parameters: {
            flag: 'EDIT',
            processid: this.userDetails.Processid,
            productid: 1,
            Id: this.batchId
          },
        },
      };
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          const lowerObj = this.common.ConvertKeysToLowerCase();
          this.editobj = res.results.data[0];
          this.form.patchValue(lowerObj(res.results.data[0]));
          this.form.updateValueAndValidity();
        }
      });
    } else {                                                                  //when user click add btn 
      this.loader = false;
      this.router.navigate(['/masters/batch/add']);
    }
    this.common.hubControlEvent('batch','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('batch','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'batch', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  getSnapShot() {
    this.common.hubControlEvent('batch','click','','','','getSnapShot');

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
  get f() {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('batch','click','back','back','','back');

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
    if (this.batchId == null) {                                               //on the basis of skillid from params it gets inerted or updated  
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_batch',
          parameters: {
            flag: 'INSERT',
            productid: 1,
            createdby: this.userDetails.Id,
            ...this.form.value,
          },
        },
      };
    } else {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_batch',
          parameters: {
            flag: 'UPDATE',
            ID: this.batchId,
            MODIFIEDBY: this.userDetails.Id,
            ...this.form.value,
          },
        },
      };
    }
    this.common.hubControlEvent('batch','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe(                         //every  api response in fee component                
      (res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.router.navigate(['masters/batch']);
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
}
