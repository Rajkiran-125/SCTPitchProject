import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex, validateregexField, masters, startIndexIsGreaterThanStartIndex, checknull, checknull1 } from 'src/app/global/json-data';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Subscription } from "rxjs";
import { ThisReceiver } from '@angular/compiler';
import {encode,decode} from 'html-entities';


@Component({
  selector: 'app-masking-rule',
  templateUrl: './masking-rule.component.html',
  styleUrls: ['./masking-rule.component.scss']
})
export class MaskingRuleComponent implements OnInit {
  loader: boolean = false;
  path: any
  userDetails: any;
  regex: any;
  masters: any;
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  minMessage: any;
  labelName: any;
  reset: boolean;
  agents = [];
  public filteredList2 = this.agents.slice();
  changeModuleDisplayName: string;
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  userConfig: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog
  ) {
    Object.assign(this, { masters });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('MaskingRule', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)


    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'MaskingRule');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.minMessage = masters.MinLengthMessage;
    this.loader = true;

    this.form = this.formBuilder.group({
      ruleName: ['', [Validators.required, Validators.pattern(regex.alphnumericWithSpaceHyphen), Validators.maxLength(50)]],
      description: ['', [ Validators.maxLength(500)]],
      regex: ['', [Validators.required, Validators.maxLength(800)]],
      maskChar: ['#', [Validators.required, Validators.maxLength(1)]],
      status: [true, [Validators.required]],
      startIndex: ['', [Validators.required, Validators.pattern(regex.numeric), Validators.maxLength(1)]],
      endIndex: ['', [Validators.required, Validators.pattern(regex.numeric), Validators.maxLength(1)]],
    }, { validator: [startIndexIsGreaterThanStartIndex('startIndex', 'endIndex'), validateregexField('regex'), checknull('ruleName'), checknull1('ruleName'), checknull('regex'), checknull1('regex'), checknull1('description')] },




    );

    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_masking_rule",
          parameters: {
            flag: "EDIT",
            Id: this.path
          }
        }
      }

      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.form.patchValue({
            ruleName: res.results.data[0].RuleName,
            description: decode(res.results.data[0].Description),
            regex: res.results.data[0].Regex,
            maskChar: res.results.data[0].MaskChar,
            status: res.results.data[0].Status,
            startIndex: res.results.data[0].StartIndex,
            endIndex: res.results.data[0].EndIndex
          })
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/masking-rule/add'])
    }
    this.changeModuleDisplayName = this.common.changeModuleLabelName()
    this.common.hubControlEvent('MaskingRule', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }


  setLabelByLanguage(data) {
    this.common.hubControlEvent('MaskingRule', 'click', 'label', 'label', JSON.stringify(data), 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'MaskingRule', data)
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('MaskingRule', 'click', '', '', '', 'getSnapShot');

    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.url.subscribe((url) => {
      let path = 'MaskingRule'
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      })
      )
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }




  back(): void {
    this.common.hubControlEvent('MaskingRule', 'click', 'back', 'back', '', 'back');

    this.router.navigate(['masters/masking-rule']);
  }


  submit(event): void {
    this.loader = true;
    this.submittedForm = true;
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
      // this.common.snackbar("General Error");
      return;
    }



    if (this.path == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_masking_rule",
          parameters: {
            flag: 'INSERT',
            ruleName: this.form.value.ruleName == null ? null : this.form.value.ruleName.trim(),
            description: encode(this.form.value.description == null ? null : this.form.value.description.trim()),
            regex: this.form.value.regex == null ? null : this.form.value.regex.trim(),
            maskChar: this.form.value.maskChar,
            status: this.form.value.status,
            startIndex: this.form.value.startIndex,
            endIndex: this.form.value.endIndex,
            // ...this.form.value,
            processid: this.userDetails.Processid,
            createdby: this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version
          }
        }
      }
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_masking_rule",
          parameters: {
            flag: "UPDATE",
            ID: this.path,
            ruleName: this.form.value.ruleName == null ? null : this.form.value.ruleName.trim(),
            description: encode(this.form.value.description == null ? null : this.form.value.description.trim()),
            regex: this.form.value.regex == null ? null : this.form.value.regex.trim(),
            maskChar: this.form.value.maskChar,
            status: this.form.value.status,
            startIndex: this.form.value.startIndex,
            endIndex: this.form.value.endIndex,
            // ...this.form.value,

            processid: this.userDetails.Processid,
            MODIFIEDBY: this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version



          }
        }
      }
    }
    this.common.hubControlEvent('MaskingRule', 'click', 'submit', 'submit', JSON.stringify(this.requestObj), 'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == 'Data added successfully') {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.router.navigate(['masters/masking-rule']);
          } else if (event == 'saveAndAddNew') {
            // this.form.reset()
            this.resetfunc()
          }
        } else if ((res.results.data[0].result == 'Data already exists') && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        } else if (res.results.data[0].result == 'Data updated successfully') {
          this.common.snackbar('Update Success');
          this.router.navigate(['masters/masking-rule']);
        }
        else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_masking_rule",
                    parameters: {
                      flag: 'ACTIVATE',
                      RULENAME: this.form.value.ruleName,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                    }
                  }
                };
                this.common.hubControlEvent('MaskingRule', 'click', 'submit', 'submit', JSON.stringify(this.requestObj), 'submit');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (event == 'add') {
                      this.router.navigate(['masters/masking-rule']);
                      this.common.snackbar('Record add');
                    } 
                    // if (event == 'saveAndAddNew') {
                    //   this.common.snackbar('Record add');
                    //   // this.form.reset()
                    //   this.resetfunc()
                    // }
                  }
                });


              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))



        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }

  submitSaveAdd(event): void {
    this.loader = true;
    this.submittedForm = true;
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
      // this.common.snackbar("General Error");
      return;
    }

    if (this.path == null) {


      this.requestObj = {
        data: {
          spname: "usp_unfyd_masking_rule",
          parameters: {
            flag: 'INSERT',

            // ...this.form.value,
            // ID: this.path,
            ruleName: this.form.value.ruleName == null ? null : this.form.value.ruleName.trim(),
            description: encode(this.form.value.description == null ? null : this.form.value.description.trim()),
            regex: this.form.value.regex == null ? null : this.form.value.regex.trim(),
            maskChar: this.form.value.maskChar,
            status: this.form.value.status,
            startIndex: this.form.value.startIndex,
            endIndex: this.form.value.endIndex,
            processid: this.userDetails.Processid,
            createdby: this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version
          }
        }
      }

    }
    else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_masking_rule",
          parameters: {
            flag: "UPDATE",
            // ID: this.path,
            // ...this.form.value,
            ID: this.path,
            ruleName: this.form.value.ruleName == null ? null : this.form.value.ruleName.trim(),
            description: encode(this.form.value.description == null ? null : this.form.value.description.trim()),
            regex: this.form.value.regex == null ? null : this.form.value.regex.trim(),
            maskChar: this.form.value.maskChar,
            status: this.form.value.status,
            startIndex: this.form.value.startIndex,
            endIndex: this.form.value.endIndex,
            processid: this.userDetails.Processid,
            MODIFIEDBY: this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version


          }
        }
      }
    }
    this.common.hubControlEvent('MaskingRule', 'click', 'submit', 'submit', JSON.stringify(this.requestObj), 'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;

        if (res.results.data[0].result == 'Data added successfully') {
          this.common.snackbar('Record add')
          this.form.controls.ruleName.reset();
          this.form.controls.description.reset();
          this.form.controls.regex.reset();
          this.form.controls.startIndex.reset();
          this.form.controls.endIndex.reset();


          this.router.navigate(['masters/masking-rule/add']);
        }
        else if (res.results.data[0].result == 'Data updated successfully') {
          this.common.snackbar('Update Success');
          // this.form.reset()
          this.resetfunc()
          this.router.navigate(['masters/masking-rule/add']);
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {


                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_masking_rule",
                    parameters: {
                      flag: 'ACTIVATE',
                      RULENAME: this.form.value.ruleName,
                      // regex: this.form.value.regex,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                    }
                  }
                };
                this.common.hubControlEvent('MaskingRule', 'click', 'submit', 'submit', JSON.stringify(this.requestObj), 'submit');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (event == 'saveAndAddNew') {
                      this.common.snackbar('Record add');
                      this.resetfunc()
                    }
                  }
                });

              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))



        }
        else if (res.results.data[0].result == 'Data already exists') {
          this.common.snackbar('Data Already Exist');
        }
        else {
          this.common.snackbar(res.results.data[0].result, "error");
        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }

  updateStartIndex() {
    this.common.hubControlEvent('MaskingRule', 'click', '', '', '', 'updateStartIndex');

    this.form.controls['startIndex'].updateValueAndValidity()
    this.form.controls['endIndex'].updateValueAndValidity()

    this.form.updateValueAndValidity()
  }



  preview() {
    this.common.hubControlEvent('MaskingRule', 'click', '', '', '', 'preview');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'previewMasking',
        value: this.form.value
      },
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(status => { })
  }

  resetfunc() {

    this.form.controls.ruleName.reset();
    this.form.controls.description.reset();
    this.form.controls.regex.reset();
    this.form.controls.startIndex.reset();
    this.form.controls.endIndex.reset();
    setTimeout(() => {
      this.form.patchValue({
        status: true,
        maskChar: '#'
      })
    })
  }

  numericOnly(event: any): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43 ||
      charCode === 33 || charCode === 35 || charCode === 47 || charCode === 36 ||
      charCode === 37 || charCode === 38 || charCode === 40 || charCode === 41 || charCode === 42
      || charCode === 46 || charCode > 47 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (event.target.value.length >= 20) {
      return false;
    }
    return true;
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}
