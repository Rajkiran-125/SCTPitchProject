
import { orderBy } from 'lodash';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, EventEmitter, OnInit, OnChanges, SimpleChange, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable, Subject, Subscription } from "rxjs";
import { WebcamImage } from "ngx-webcam";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { masters, addAlert, userFormSteps, regex, paymentCollection, ConfirmedValidator, checknull, validateregex, channelConfigurationIcons, checknull1 } from 'src/app/global/json-data';
import html2canvas from "html2canvas"
import jsPDF from 'jspdf';
import { CurrencyPipe } from '@angular/common';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
import { ActivatedRoute, Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { ThisReceiver } from '@angular/compiler';
import { throws } from 'assert';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogComponent, noSpaceValidator } from '../../../../../components/dialog/dialog.component';
import { ApiService } from '../../../../../global/api.service';
import { AuthService } from '../../../../../global/auth.service';
import { CommonService } from '../../../../../global/common.service';
import { log } from 'console';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  form: FormGroup;
  data: any = {
    formType: ''
  };
  alertproductid: any
  alertlangid: any
  Id: any
  loader: boolean;
  addAlert: any;
  userLanguageName: any = [];
  channel: string;
  channelSource: string;
  skill: string;
  custom: string;
  UID: string;
  Icon: any;
  profileImg: any;
  requestObj: any;
  userDetails: any;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  labelName: any;
  userConfig: any;
  temp1 = [];
  existbutton: boolean = false;
  typeofbutton: boolean = false;
  buttonval: boolean = false;
  pophead: boolean = false
  popbody: boolean = false
  submittedForm: boolean = false;
  deletePopup: boolean;
  buttonname: any;
  reset: boolean = false;
  changeModuleDisplayName: string;
  product: any;

  constructor(private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogComponent>,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    public common: CommonService,
    private snackBar: MatSnackBar,

    private el: ElementRef,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private http: HttpClient) {
    Object.assign(this, { masters, userFormSteps, addAlert, channelConfigurationIcons });
  }
  ngOnInit(): void {
    console.log(this.data);
    this.userDetails = this.auth.getUser();

    this.common.hubControlEvent('alertMsgData', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.Id = this.activatedRoute.snapshot.paramMap.get('id');

    this.activatedRoute.queryParams.subscribe(params => {
      this.alertproductid = params.Product;
      this.alertlangid = params.Language;
      this.Id = params.id;
    })

    if (this.alertproductid && this.alertlangid) {
      // this.getAlertdetail()
    }
    if (this.Id !== null && this.Id !== undefined) {
      this.getAlertdetail()
    }
    this.getLanguageStorage()
    this.common._deleteImg.subscribe(res => {
      this.copyImgPath(res.icon)
    })
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.common.setUserConfig(this.userDetails.ProfileType, 'AlertMessage');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'alertmessage');
    this.form = this.formBuilder.group({
      alertMsg: ['', [Validators.required, Validators.pattern(regex.alphabetWithUnderScore),Validators.maxLength(100)]],
      alertMsgType: ['toaster', Validators.required],
      alertMsgSubType: ['success', Validators.required],
      language: [this.alertlangid, Validators.required],
      alertMsgPos: ['', Validators.required],
      alertMsgDur: ['', [Validators.nullValidator, Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.pattern(regex.alertmessage), Validators.minLength(3), Validators.maxLength(300)]],
      alertPopupIcon: [addAlert?.imgDropdown[0].Value, Validators.required],
      msgHead: ['', Validators.required],
      msgBody: ['', Validators.required],
      buttontype: ['', Validators.nullValidator],
      selectBtn: ['', Validators.nullValidator],
      place: this.formBuilder.array([
        this.newplace(),
      ]),
    },
      { validator: [checknull1('alertMsg'), checknull1('description')] },

    );
    var arrayControl = this.form.get('place') as FormArray;
    (arrayControl.at(0) as FormGroup).get('parameters').patchValue('Button1');
    this.applyMsgType();
    this.selectPos(this.form.value.alertMsgType)

    this.changeModuleDisplayName = this.common.changeModuleLabelName()



  }
  getAlertdetail() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_alert_msg_config',
        parameters: {
          flag: 'EDIT',
          ID: this.Id,
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.reset = true
        this.form.controls.alertMsg.patchValue(res.results.data[0].AlertMsg)
        this.form = this.formBuilder.group({
          alertMsg: [res.results.data[0]['AlertMsg'], [Validators.required, Validators.pattern(regex.alphabetWithUnderScore),Validators.maxLength(100)]],
          alertMsgType: [res.results.data[0]['AlertMsgType'], Validators.required],
          alertMsgSubType: [res.results.data[0]['AlertMsgSubType'], Validators.required],
          language: [res.results.data[0]['LanguageCode'], Validators.required],
          alertMsgPos: [res.results.data[0]['AlertMsgPosition'], Validators.required],
          alertMsgDur: [res.results.data[0]['AlertMsgDuration'], [Validators.nullValidator, Validators.minLength(0)]],
          description: [res.results.data[0]['MsgBody'], [Validators.required, Validators.pattern(regex.alertmessage), Validators.minLength(3), Validators.maxLength(300)]],
          msgHead: [res.results.data[0]['MsgHead'], Validators.required],
          msgBody: [res.results.data[0]['MsgBody'], Validators.required],
          selectBtn: [res.results.data[0]['ButtonType'], Validators.nullValidator],
          buttontype: [res.results.data[0]['ButtonCategory'], Validators.nullValidator],
          alertPopupIcon: [res.results.data[0]['PopUpIconUrl'], Validators.required],
          place: this.formBuilder.array([
            this.newplace(),
          ]),
        });

        if (res.results.data[0]['ButtonCategory'] == 'Custom') {
          this.temp1 = JSON.parse('[' + JSON.parse(JSON.stringify(res.results.data[0]['ButtonType'])) + ']');
          for (let i = 1; i < this.temp1.length; i++) {
            this.addplace();
          }
          var arrayControl = this.form.get('place') as FormArray;
          arrayControl.controls.forEach((element, index) => {
            (arrayControl.at(index) as FormGroup).get('parameters')?.patchValue(this.temp1[index].Button);
            (arrayControl.at(index) as FormGroup).get('holders')?.patchValue(this.temp1[index]?.Value);
          });
        }
        this.form.get('alertMsg')?.disable();
        this.form.get('alertMsg')?.clearValidators();
        if (this.form.value.alertMsgType == 'popup') this.button(this.form.value.buttontype)

        var arrayControl = this.form.get('place') as FormArray;
        (arrayControl.at(0) as FormGroup).get('parameters').patchValue('Button1');
        this.applyMsgType();
        this.selectPos(this.form.value.alertMsgType)

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

  back(): void {
    this.common.hubControlEvent('alertMsgData', 'click', 'back', 'back', '', 'back');
    this.router.navigate(['masters/branding/alert-setting'], { queryParams: { ProductId: this.alertproductid, LanguageID: this.alertlangid } });
  }

  getLanguageStorage() {
    this.loader = true;
    this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName') || '{}');
    if (this.userLanguageName == null || this.userLanguageName == undefined) {
      this.getLanguage();
    } else {
      let chlen = this.userLanguageName.length
      this.userLanguageName.forEach(element => {
        if (element.ChannelName == 'Voice') {
          this.userLanguageName = true;
        }

        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }

  button(e) {
    this.pophead = false
    this.typeofbutton = false
    // e.value === undefined ? e : e.value
    this.buttonname = e.value == 'Existing' || e.value == 'Custom' ? e.value : ''
    if (e.value == undefined) {
      this.buttonname = e == 'Existing' || e == 'Custom' ? e : ''
    }
  }
  selectPos(event) {
  }
  applicableChange(event) {
    this.existbutton = false
  }

  place(): FormArray {
    return this.form.get("place") as FormArray
  }
  addplace() {
    let placearr = this.place().controls.length
    this.place().push(this.newplace());
    let finalplacearr = placearr + 1;
    this.popbody = false
    var arrayControl = this.form.get('place') as FormArray;
    (arrayControl.at(placearr) as FormGroup).get('parameters')!.patchValue('Button' + finalplacearr);

  }

  removeplace(i: number) {
    // this.place().removeAt(this.place.length - 1);
    this.place().removeAt(i);
    this.form.updateValueAndValidity();
  }

  copyImgPath(res) {

    this.Icon = res
    this.profileImg = res

  }

  applyMsgSubType(event) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', event, 'applyMsgSubType');

    if (this.form.value.alertMsgType == 'popup') {
      this.deletePopup = true;
      this.form.controls['alertMsgDur'].setValidators(Validators.nullValidator);
      this.addAlert.alertMsgPos = ['top-right', 'bottom-right', 'top-center', 'bottom-center', 'center', 'top-left', 'bottom-left']
    } else if (this.form.value.alertMsgType == 'toaster') {
      this.deletePopup = false;
      this.form.controls['alertMsgDur'].setValidators(Validators.required);
      this.form.controls['buttontype'].setValidators(Validators.nullValidator);
    } else {
      this.deletePopup = false;
      this.addAlert.alertMsgPos = ['top-right', 'bottom-right', 'top-center', 'bottom-center']
    }
    if (event == 'Valid Duration') {
    } else {

    }
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
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getLanguage');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        localStorage.setItem("userLanguageName", res.results.data[1][0].UserLanguage);
        this.getLanguageStorage()
      }
    })
  }


  newplace(): FormGroup {
    return this.formBuilder.group({
      parameters: new FormControl('', [Validators.required]),
      holders: new FormControl('', [Validators.required, Validators.pattern(regex.alphabet),]),
    },
      { validator: [checknull1('holders'), checknull('holders')] },
    )
  }

  applyMsgType(event?) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', event, 'applyMsgType');

    if (this.form.value.alertMsgType == 'toaster') {
      this.addAlert.alertMsgSubType = [{ key: 'success', value: 'Success' }, { key: 'error', value: 'Error' }, { key: 'warning', value: 'Warning' }]
      if(this.form.controls.alertMsgSubType.value == 'success')this.form.controls.alertMsgSubType.patchValue(addAlert.alertMsgSubType[0].key)
      else if(this.form.controls.alertMsgSubType.value == 'error')this.form.controls.alertMsgSubType.patchValue(addAlert.alertMsgSubType[1].key)
      else if(this.form.controls.alertMsgSubType.value == 'warning')this.form.controls.alertMsgSubType.patchValue(addAlert.alertMsgSubType[2].key)
    } else if (this.form.value.alertMsgType == 'popup') {
      this.addAlert.alertMsgSubType = [{ key: 'confirmation', value: 'Confirmation' },{ key: 'information', value: 'Information' } ]
      if(this.form.controls.alertMsgSubType.value == 'information')this.form.controls.alertMsgSubType.patchValue(addAlert.alertMsgSubType[1].key)
      else if(this.form.controls.alertMsgSubType.value == 'confirmation')this.form.controls.alertMsgSubType.patchValue(addAlert.alertMsgSubType[0].key)
      else{
        this.form.controls.alertMsgSubType.patchValue('')
        this.form.controls.alertMsgSubType.updateValueAndValidity()
      }
    }
    if (this.form.value.alertMsgType == 'popup') {
      this.deletePopup = true;
      this.form.controls['alertMsgDur'].setValidators(Validators.nullValidator);
      this.addAlert.alertMsgPos = ['top-right', 'bottom-right', 'top-center', 'bottom-center', 'center', 'top-left', 'bottom-left']
    }

    else if (this.form.value.alertMsgType == 'toaster') {
      this.deletePopup = false;
      this.form.controls['alertMsgDur'].setValidators(Validators.required);
      this.form.controls['buttontype'].setValidators(Validators.nullValidator);
    } else {
      this.deletePopup = false;
      this.addAlert.alertMsgPos = ['top-right', 'bottom-right', 'top-center', 'bottom-center']
    }
    if (event == 'Valid Duration') {

    } else {

    }

  }

  Reset() {
    // this.common.hubControlEvent(type, 'click', '', '', '', 'reset');
    this.submittedForm = false
    this.form.reset();
    setTimeout(() => {
      this.form.controls.alertMsgType.patchValue(addAlert.alertMsgType[0].key)
      this.form.controls.language.patchValue(this.alertlangid)
      this.applyMsgType(this.form.value.alertMsgType);
      this.form.controls.alertMsgSubType.patchValue(addAlert.alertMsgSubType[0].key);
      this.form.controls.alertPopupIcon.patchValue(addAlert.imgDropdown[0].Value);
      var arrayControl = this.form.get('place') as FormArray;
      let length = arrayControl.length - 1;
      for (let i = length; i > 0; i--) {
        this.removeplace(i);
      }
      (arrayControl.at(0) as FormGroup).get('parameters').patchValue('Button1');
      this.form.updateValueAndValidity()
    });

    // }
  }

  alertMsgData(event,formDirective: FormGroupDirective) {
    this.submittedForm = true
    var actionArrayControl: any[] = [];
    if (this.form.controls['alertMsg'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsg' + '"]');
      invalidControl.focus();
      return;
    }
    if (this.form.controls['alertMsgType'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgType' + '"]');
      invalidControl.focus();
      return;
    }
    if (this.form.controls['alertMsgSubType'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgSubType' + '"]');
      invalidControl.focus();
      return;
    }
    if (this.form.controls['language'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'language' + '"]');
      invalidControl.focus();
      return;
    }
    if (this.form.controls['alertMsgPos'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgPos' + '"]');
      invalidControl.focus();
      return;
    }

    if (this.form.controls['description'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'description' + '"]');
      invalidControl.focus();
      return;
    }

    if (this.form.value.alertMsgType == 'toaster') {
      if (this.form.controls['alertMsgDur'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgDur' + '"]');
        invalidControl.focus();
        return;
      }
      if(this.form.value.alertMsgDur >= 999 ){
        return;
      }
    }
    if (this.form.value.buttontype == 'Existing') {
      for (const key of Object.keys(this.form.controls)) {
        if (key == "selectBtn") {
          if (this.form.value.selectBtn == '' || this.form.value.selectBtn == undefined || this.form.value.selectBtn == null) {
            this.existbutton = true;
            return;
          }
          else this.existbutton = false;
        }
      }
    }
    if (this.form.value.alertMsgType == 'popup') {
      for (const key of Object.keys(this.form.controls)) {
        if (key == "buttontype") {
          if (!this.form.value.buttontype) {
            this.buttonval = true;
            this.typeofbutton = true;
            return;
          }
        }
      }
    }
    if (this.form.value.buttontype == "Custom") {
      for (const key of Object.keys(this.form.controls)) {
        if (key == "place") {
          for (const element of this.form.value.place) {
            if (element.parameters == '') {
              this.buttonval = true;
              return;
            } else if (element.holders.trim() == '') {
              if(element.holders.trim().length < 1){
                this.buttonval = true;
                console.log(this.buttonval,"this.buttonval")
                return;
              }

            }
          }
        }
      }

    }
    if (this.form.value.buttontype == "Custom") {
      actionArrayControl = (this.form.controls['place'] as FormArray).value;
    }
    var temp: any[] = [];
    actionArrayControl.forEach((element, index) => {
      if (this.form.value.buttontype == "Custom") {
        temp.push('{"Button" : "' + element.parameters + '","Value" : "' + element.holders + '"}');
      }
    });
    // if (flag == 'DELETE') {
    //   this.requestObj = {
    //     data: {
    //       spname: 'usp_unfyd_alert_msg_config',
    //       parameters: {
    //         flag: 'DELETE',
    //         ID: this.userDetails.ID,
    //         DELETEDBY: this.userDetails.EmployeeId,
    //       },
    //     },
    //   };
    // }
    if (this.Id !== null && this.Id !== undefined) {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_alert_msg_config',
          parameters: {
            flag: 'UPDATE',
            ALERTMSG: this.form.value.alertMsg == null ? null : this.form.value.alertMsg.trim(),
            ALERTMSGTYPE: this.form.value.alertMsgType,
            ALERTMSGSUBTYPE: this.form.value.alertMsgSubType,
            LANGUAGECODE: this.form.value.language,
            ALERTMSGPOSITION: this.form.value.alertMsgPos,
            ALERTMSGDURATION: this.form.value.alertMsgDur,
            REMARKS: this.form.value.description == null ? null : this.form.value.description.trim(),
            ButtonCategory: this.form.value.buttontype,
            POPUPICON: this.form.value.alertMsgType == 'popup' ? true : false,
            POPUPICONURL: this.form.value.alertPopupIcon,
            MSGHEAD: this.form.value.msgHead == null ? null : this.form.value.msgHead.trim(),
            MSGBODY: this.form.value.msgBody == null ? null : this.form.value.msgBody.trim(),
            BUTTONTYPE: this.form.value.buttontype == "Existing" ? this.form.value.selectBtn : temp.join(","),
            MODIFIEDBY: this.userDetails.Id,
            PRODUCTID: this.alertproductid,
            ID: this.Id,
          },
        },
      };
    }
    else {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_alert_msg_config',
          parameters: {
            flag: 'INSERT',
            "ALERTMSG": this.form.value.alertMsg == null ? null : this.form.value.alertMsg.trim(),
            "ALERTMSGTYPE": this.form.value.alertMsgType,
            "ALERTMSGSUBTYPE": this.form.value.alertMsgSubType,
            "LANGUAGECODE": this.form.value.language,
            "ALERTMSGPOSITION": this.form.value.alertMsgPos,
            "ALERTMSGDURATION": this.form.value.alertMsgDur,
            "REMARKS": this.form.value.description == null ? null : this.form.value.description.trim(),
            "POPUPICON": this.form.value.alertMsgType == 'popup' ? true : false,
            "POPUPICONURL": this.form.value.alertPopupIcon,
            "MSGHEAD": this.form.value.msgHead == null ? null : this.form.value.msgHead.trim(),
            "MSGBODY": this.form.value.description == null ? null : this.form.value.description.trim(),
            "BUTTONTYPE": this.form.value.buttontype == "Existing" ? this.form.value.selectBtn : temp.join(","),
            "PRODUCTID": this.alertproductid,
            "PROCESSID": this.userDetails.Processid,
            "CREATEDBY": this.userDetails.Id,
            "ButtonCategory": this.form.value.buttontype,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
            ID: this.Id,
          },
        },
      };
    }
    // else if (flag == 'INSERT' && this.data.formType != "edit") {
    //   this.requestObj = {

    //     data: {
    //       spname: 'usp_unfyd_alert_msg_config',
    //       parameters: {
    //         flag: 'INSERT',
    //         "ALERTMSG": this.form.value.alertMsg == null ? null : this.form.value.alertMsg.trim(),
    //         "ALERTMSGTYPE": this.form.value.alertMsgType,
    //         "ALERTMSGSUBTYPE": this.form.value.alertMsgSubType,
    //         "LANGUAGECODE": this.form.value.language,
    //         "ALERTMSGPOSITION": this.form.value.alertMsgPos,
    //         "ALERTMSGDURATION": this.form.value.alertMsgDur,
    //         "REMARKS": this.form.value.description == null ? null : this.form.value.description.trim(),
    //         "POPUPICON": this.form.value.alertMsgType == 'popup' ? true : false,
    //         "POPUPICONURL": this.form.value.alertPopupIcon,
    //         "MSGHEAD": this.form.value.msgHead == null ? null : this.form.value.msgHead.trim(),
    //         "MSGBODY": this.form.value.description == null ? null : this.form.value.description.trim(),
    //         "ButtonCategory": this.form.value.buttontype,
    //         "BUTTONTYPE": this.form.value.buttontype == "Existing" ? this.form.value.selectBtn : temp.join(","),
    //         "PRODUCTID": this.alertproductid,
    //         "PROCESSID": this.userDetails.Processid,
    //         "CREATEDBY": this.userDetails.Id,
    //         publicip: this.userDetails.ip,
    //         privateip: '',
    //         browsername: this.userDetails.browser,
    //         browserversion: this.userDetails.browser_version,
    //         ID: this.Id,
    //       },
    //     },
    //   };
    // }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'alertMsgData');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = true;
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == "Data added successfully") {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.router.navigate(['masters/branding/alert-setting'], { queryParams: { ProductId: this.alertproductid, LanguageID: this.alertlangid } });
          } else if (event == 'saveAndAddNew') {
            this.Reset()
            formDirective.resetForm()

          }
        }
        else if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');
          this.router.navigate(['masters/branding/alert-setting'], { queryParams: { ProductId: this.alertproductid, LanguageID: this.alertlangid } });

        }
        else if ((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Exists');
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_alert_msg_config",
                    parameters: {
                      flag: 'ACTIVATE',
                      "ALERTMSG": this.form.value.alertMsg,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                    }
                  }
                };
                this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'alertMsgData');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    if (event == 'add') {
                      this.router.navigate(['masters/branding/alert-setting'], { queryParams: { ProductId: this.alertproductid, LanguageID: this.alertlangid } });
                    } else if (event == 'saveAndAddNew') {
                      this.Reset()
                      formDirective.resetForm()

                    }
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
        this.common.snackbar("Add Error");
      })

  }


  confirmationToMakeDefault(val) {
    let data2 = this.common.alertDataAPI.filter(
      (a) => a["Alert Message"] == val
    );
    let data = data2[0]
    let dataVal = {
      alertMsg: data['Alert Message'],
      alertMsgDur: data['Alert Message Duration'],
      alertMsgPos: data['Alert Message Position'],
      alertMsgType: data['Message Type'],
      alertMsgSubType: data['Message Sub Type'],
      description: data['Message Body'],
      language: data['Language Code'],
      msgBody: data['Message Body'],
      msgHead: data['Message Head'],
      selectBtn: data['Button Type'],
      icon: data['Pop-Up Icon URL'],
      buttontype: data['Button Category'],
    }
    let data1 = {
      data: dataVal
    }
    this.common.previewAlertPopup(data1);
  }

  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false
      this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'AlertMessage', data)
  }

  onButtonSelected(e) {
    var tempSelection = e.value === undefined ? e : e.value

    if (tempSelection == 'Existing') {
      this.form.get('selectBtn')!.setValidators(Validators.required);
      this.form.get('holders')!.setValidators(Validators.nullValidator);
      this.form.get('alertMsgDur')!.setValidators(Validators.nullValidator)
    }
    else if (tempSelection == 'Custom') {
      this.form.get('holders')!.setValidators(Validators.required);
      this.form.get('selectBtn')!.setValidators(Validators.nullValidator);
      this.form.get('alertMsgDur')!.setValidators(Validators.nullValidator)
    }
  }

  previewAlert(data) {

    if (data["alertMsgType"] == 'popup') {
      let dataVal = {
        alertMsg: data['alertMsg'],
        alertMsgDur: data['alertMsgDur'],
        alertMsgPos: data['alertMsgPos'],
        alertMsgType: data['alertMsgType'],
        alertMsgSubType: data['alertMsgSubType'],
        description: data['description'],
        language: data['language'],
        msgBody: data['msgBody'],
        msgHead: data['msgHead'],
        selectBtn: data['selectBtn'],
        icon: data['alertPopupIcon'],
        buttontype: data['buttontype'],
      }
      let data1 = {
        data: dataVal
      }
      this.common.previewAlertPopup(data1);

      // }
    } else {
      if (this.form.controls['alertMsg'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsg' + '"]');
        invalidControl.focus();
        return;
      }
      if (this.form.controls['alertMsgType'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgType' + '"]');
        invalidControl.focus();
        return;
      }
      if (this.form.controls['alertMsgSubType'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgSubType' + '"]');
        invalidControl.focus();
        return;
      }
      if (this.form.controls['language'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'language' + '"]');
        invalidControl.focus();
        return;
      }
      if (this.form.controls['alertMsgPos'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgPos' + '"]');
        invalidControl.focus();
        return;
      }
  
      if (this.form.controls['description'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'description' + '"]');
        invalidControl.focus();
        return;
      }
  
      if (this.form.value.alertMsgType == 'toaster') {
        if (this.form.controls['alertMsgDur'].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgDur' + '"]');
          invalidControl.focus();
          return;
        }
        if(this.form.value.alertMsgDur >= 999 ){
          return;
        }
      }



      let s;

      if (data['alertMsgSubType'].toLowerCase() == 'success') {
        s = 'greenMsg'
      } else if (data['alertMsgSubType'].toLowerCase() == 'error') {
        s = 'redMsg'
      } else if (data['alertMsgSubType'].toLowerCase() == 'warning') {
        s = 'yellowMsg'
      }
      return this.snackBar.open(data['description'], 'x', {

        horizontalPosition:
          data["alertMsgPos"] == "bottom-center" ? 'center' :
            data["alertMsgPos"] == "bottom-right" ? 'right' :
              data["alertMsgPos"] == "bottom-left" ? 'left' :
                data["alertMsgPos"] == "top-left" ? 'left' :
                  data["alertMsgPos"] == "top-center" ? 'center' :
                    data["alertMsgPos"] == "top-right" ? 'right' :
                      data["alertMsgPos"] == "center" ? 'center' : 'right',

        verticalPosition:
          data["alertMsgPos"] == "bottom-center" ? 'bottom' :
            data["alertMsgPos"] == "bottom-right" ? 'bottom' :
              data["alertMsgPos"] == "bottom-left" ? 'bottom' :
                data["alertMsgPos"] == "top-left" ? 'top' :
                  data["alertMsgPos"] == "top-center" ? 'top' :
                    data["alertMsgPos"] == "top-right" ? 'top' : 'top',

        duration: data["alertMsgDur"] ? data["alertMsgDur"] * 1000 : 5000,
        // horizontalPosition: 'right',
        // verticalPosition: 'top',
        // duration: snackDuration? snackDuration:5000,
        panelClass: [s],
      });
    }
  }

}
