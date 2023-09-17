import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.scss']
})
export class EventAddComponent implements OnInit {

  form: FormGroup;
  modules: any;
  submittedForm : any;
  userDetails: any;
  requestObj: any;
  labelName: any;
  config: any;
  loader: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    public dialog: MatDialog,
    private location: Location,
    private el: ElementRef,
  ) { }

  ngOnInit(){
    this.userDetails = this.auth.getUser();
    // this.getSnapShot();
    this.getModule();
    this.loader = false;
    this.form = this.formBuilder.group({
      moduleid: ['', Validators.required],
      actionlist:['', Validators.required],
      processid: [this.userDetails.Processid, Validators.nullValidator],
      publicip: [this.userDetails.ip, Validators.nullValidator],
      privateip: ["", Validators.nullValidator],
      browsername: [this.userDetails.browser, Validators.nullValidator],
      browserversion: [this.userDetails.browser_version, Validators.nullValidator]
    });
  }
  back(): void {
    this.location.back()
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
    this.requestObj = {
      data: {
        spname: "usp_unfyd_module_action_list",
        parameters: {
          flag: 'INSERT',
          CREATEDBY: this.userDetails.Id,
          productid:1,
          ...this.form.value,
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/form-event']);
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
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  // setLabelByLanguage(data) {
  //   this.common.setLabelConfig(this.userDetails.Processid, 'FORM', data)
  //   this.common.getLabelConfig$.subscribe(data => {
  //     this.labelName = data;
  //   });
  // }
  // getSnapShot() {
  //   this.userDetails = this.auth.getUser();
  //   this.activatedRoute.url.subscribe(url => {
  //     this.common.setUserConfig(this.userDetails.ProfileType, 'form');
  //     this.common.getUserConfig$.subscribe(data => {
  //       this.config = data;
  //     });
  //   });
  //   this.common.getLanguageConfig$.subscribe(data => {
  //     this.setLabelByLanguage(data)
  //   });
  //   this.setLabelByLanguage(localStorage.getItem("lang"))
  // }
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
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.modules = res.results.data;
      }
    });
  }
}
