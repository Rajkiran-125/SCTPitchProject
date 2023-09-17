import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, ActivatedRoute } from '@angular/router';
import { log } from 'console';
import { min } from 'moment';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, masters, checknull, checknull1, validateNumberRange } from 'src/app/global/json-data';

@Component({
  selector: 'app-sla',
  templateUrl: './sla.component.html',
  styleUrls: ['./sla.component.scss']
})
export class SlaComponent implements OnInit {
  @ViewChild('panel1') public panel1: MatDrawer;
  @ViewChild('mapanel') public mapanel: MatDrawer;
  @ViewChild('mapanel1') public mapanel1: MatDrawer;
  regex
  configdata: any = {}
  keysIncludeTimeInSecond = []
  loader: boolean = false
  reminderToggleStatus = true
  escalationToggleStatus = true
  productid: any
  id: any;
  userDetails: any;
  form: FormGroup;
  form1: FormGroup;
  commonDetails: any
  userConfig: any;
  subscriptionBulkDelete: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  requestObj: any;
  subscription: Subscription[] = [];
  dummyJson = [1, 2, 3, 4, 5]
  channelType = [];
  userChannelName = []
  channelSourceId = []
  SLAType = []
  SlaRequestType = []
  // comparisonOperator = ['<', '<=', '>', '>=', '==', '!=']
  comparisonOperator = ['==']
  internal = [{ Actionable: 1, Name: 'Internal Reminder 1' }, { Actionable: 2, Name: 'Internal Reminder 2' }, { Actionable: 3, Name: 'Internal Reminder 3' }]
  external = [{ Actionable: 1, Name: 'External Reminder 1' }, { Actionable: 2, Name: 'External Reminder 2' }, { Actionable: 3, Name: 'External Reminder 3' }]
  dummyJsonRemindTo = [{ Key: 'Owner', Value: 'Owner' },
  { Key: 'Routed Agent', Value: 'Routed Agent' },
  { Key: 'Routed Team', Value: 'Routed Team' },
  { Key: 'Collaborators', Value: 'Collaborators' },
  { Key: 'Others', Value: 'Others' }]
  minValue = 1
  maxValue = 60
  valueArray = {}
  valueTypeArray = []
  maxValueForCondition = 0
  durationDropDown = [
    { Key: 'day', Value: 'Day' },
    { Key: 'hour', Value: 'Hrs.' },
    { Key: 'minute', Value: 'Min.' }
  ]
  mainDurationDropDown = [
    { Key: 'day', Value: 'Day' },
    { Key: 'hour', Value: 'Hrs.' },
    { Key: 'minute', Value: 'Min.' }
  ]
  mainDurationDropDownCopy = [
    { Key: 'day', Value: 'Day' },
    { Key: 'hour', Value: 'Hrs.' },
    { Key: 'minute', Value: 'Min.' }
  ]
  labelName: any;
  invalidemail: boolean = false

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private api: ApiService, private auth: AuthService, private common: CommonService, private formBuilder: FormBuilder, private el: ElementRef) {

  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.productid = this.activatedRoute.snapshot.paramMap.get('productid')
    this.id = this.activatedRoute.snapshot.paramMap.get('id')
    this.common.setUserConfig(this.userDetails.ProfileType, 'sla');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.commonDetails = {
      PROCESSID: this.userDetails.Processid,
      PRODUCTID: this.productid,
      publicip: this.userDetails?.ip,
      PRIVATEIP: '',
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version
    }
    this.formCreation();
    this.valueChanged()
    this.getChannelStorage();
    this.returnValueType()
    this.getInternal('Internal')
    this.getInternal('External')

    if (this.productid == 6 && !this.id) {
      this.linkConfigManagerData()
    }
    if (this.id) {
      this.getSLAData()
    }

    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.SLAType = JSON.parse(data["SLAType"]);
          this.SlaRequestType = JSON.parse(data["SlaRequestType"]);
          this.mainDurationDropDown = JSON.parse(data["DurationDropdown"])
          this.mainDurationDropDownCopy = JSON.parse(data["DurationDropdown"])
        }
      }))
  }

  back() {
    let a = {}
    Object.assign(a, { productId: this.productid })
    this.common.selectedApprovalDetails.next(a)
    this.router.navigate(['masters/sla']);
  }
  setLabelByLanguage(data) {

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'sla', data)

  }
  getSLAData() {
    this.loader = true
    let obj = {
      data: {
        spname: "usp_unfyd_sla",
        parameters: {
          flag: 'EDIT',
          id: this.id
        }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.form.patchValue(res.results.data[0])
        setTimeout(() => {
          this.ChangedSLA();
          // this.changeMainDropdown();
          // this.responsetimetypeChanged()
          // this.valueChanged();
          // this.returnValueType()
          // responsetimetypeChanged();returnValueType();valueChanged();
        });
        if (res.results.data[0].ChannelSourceId) this.form.controls['ChannelSourceId'].patchValue((res.results.data[0].ChannelSourceId).toString())
        if (res.results.data[0].SLAPriority) this.form.controls['SLAPriority'].patchValue(parseInt(res.results.data[0].SLAPriority))
        if (res.results.data[0].ResponseTime) this.form.controls['ResponseTime'].patchValue(parseInt(res.results.data[0].ResponseTime))
        if (this.productid == 6) this.linkConfigManagerData(res.results.data[0])
        else {
          this.responsetimetypeChanged()
          this.changeMainDropdown();
          this.valueChanged();
          this.returnValueType();
          this.getSLACategoryData(res.results.data[0])
        }
        if (this.form.value.ChannelId) {
          // this.getChannelSource()
          this.channelChanged()
          // this.responsetimetypeChanged();this.returnValueType();this.valueChanged();
        }
        if (res.results.data[0].ChannelSourceId) this.form.controls['ChannelSourceId'].patchValue((res.results.data[0].ChannelSourceId).toString())

        // this.ChangedSLA();
        // this.changeMainDropdown();
        // this.responsetimetypeChanged()
        // this.returnValueType()
        // this.valueChanged();


        this.loader = false
      } else {
        this.loader = false;
        this.common.snackbar('General Error')
      }
    }, error => {
      this.loader = false;
      this.common.snackbar('General Error')
    })
  }

  getSLACategoryData(val) {
    this.loader = true
    let obj = {
      data: {
        spname: "usp_unfyd_sla_category",
        parameters: {
          flag: 'EDIT',
          SLAID: this.id
        }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        if (val.ResponseTime) this.form.controls['ResponseTime'].patchValue(parseInt(val.ResponseTime))
        this.valueChanged()
        this.f1.removeAt(0);
        // this.f2.removeAt(0);
        this.f3.removeAt(0);
        // this.f4.removeAt(0);
        this.form1.updateValueAndValidity()
        res.results.data.forEach((element, index) => {

          if (element.SLACategory == 'REMINDER') {
            if (element.SLAType == 'RESPONSE') {
              this.add(1)
              this.form1.controls['responsetimereminders']['controls'][this.form1.value.responsetimereminders.length - 1].patchValue(element);
              if (element.NotificationId) this.form1.controls['responsetimereminders']['controls'][this.form1.value.responsetimereminders.length - 1]['controls']['NotificationId'].patchValue(element.NotificationId.toString());
              if (element.Value) this.form1.controls['responsetimereminders']['controls'][this.form1.value.responsetimereminders.length - 1]['controls']['Value'].patchValue(parseInt(element.Value));
              if (element.EmailID) this.form1.controls['responsetimereminders']['controls'][this.form1.value.responsetimereminders.length - 1]['controls']['EmailID'].patchValue(element.EmailID.split(','));
            }
            //  else if(element.SLAType == 'RESOLUTION'){
            //   this.add(2)
            //   this.form1.controls['resolutiontimereminders']['controls'][this.form1.value.resolutiontimereminders.length-1].patchValue(element);
            //   if(element.NotificationId) this.form1.controls['resolutiontimereminders']['controls'][this.form1.value.resolutiontimereminders.length-1]['controls']['NotificationId'].patchValue(parseInt(element.NotificationId));
            //   if(element.EmailID) this.form1.controls['resolutiontimereminders']['controls'][this.form1.value.resolutiontimereminders.length-1]['controls']['EmailID'].patchValue(element.EmailID.split());
            // }
          } else if (element.SLACategory == 'ESCALATION') {
            if (element.SLAType == 'RESPONSE') {
              this.add(3)
              this.form1.controls['responsetimeescalation']['controls'][this.form1.value.responsetimeescalation.length - 1].patchValue(element);
              if (element.NotificationId) this.form1.controls['responsetimeescalation']['controls'][this.form1.value.responsetimeescalation.length - 1]['controls']['NotificationId'].patchValue(element.NotificationId.toString());
              if (element.Value) this.form1.controls['responsetimeescalation']['controls'][this.form1.value.responsetimeescalation.length - 1]['controls']['Value'].patchValue(parseInt(element.Value));
              if (element.EmailID) this.form1.controls['responsetimeescalation']['controls'][this.form1.value.responsetimeescalation.length - 1]['controls']['EmailID'].patchValue(element.EmailID.split());
            }
            // else if(element.SLAType == 'RESOLUTION'){
            //   this.add(4)
            //   this.form1.controls['resolutiontimeescalation']['controls'][this.form1.value.resolutiontimeescalation.length-1].patchValue(element);
            //   if(element.NotificationId) this.form1.controls['resolutiontimeescalation']['controls'][this.form1.value.resolutiontimeescalation.length-1]['controls']['NotificationId'].patchValue(parseInt(element.NotificationId));
            //   if(element.EmailID) this.form1.controls['resolutiontimeescalation']['controls'][this.form1.value.resolutiontimeescalation.length-1]['controls']['EmailID'].patchValue(element.EmailID.split());
            // }
          }
        });


        if (this.form1.value.responsetimereminders.length == 0) {
          this.f1.push(this.createHeader('REMINDER', 'RESPONSE'));
        }
        // if(this.form1.value.resolutiontimereminders.length == 0){
        //   this.f2.push(this.createHeader('REMINDER','RESOLUTION'));
        // }
        if (this.form1.value.responsetimeescalation.length == 0) {
          this.f3.push(this.createHeader('ESCALATION', 'RESPONSE'));
        }
        // if(this.form1.value.resolutiontimeescalation.length == 0){
        //   this.f4.push(this.createHeader('ESCALATION','RESOLUTION'));
        // }
        // if(this.form.value.EnableEscalation){
        //   this.toggleStatus(2)
        // }
        // if(this.form.value.EnableReminder){
        //   this.toggleStatus(1)
        // }

        this.reminderToggleStatus = this.form.value.EnableReminder
        this.escalationToggleStatus = this.form.value.EnableEscalation
        // if(this.form.value.EnableEscalation){
        // this.toggleStatus(2)
        this.setValidators('responsetimeescalation', this.escalationToggleStatus)
        // }
        // if(this.form.value.EnableReminder){
        // this.toggleStatus(1)
        this.setValidators('responsetimereminders', this.reminderToggleStatus)
        setTimeout(() => {
          this.updateValuesAtEnd(val, res.results.data)
        });
        this.loader = false
      } else {
        this.loader = false;
        this.common.snackbar('General Error')
      }
    }, error => {
      this.loader = false;
      this.common.snackbar('General Error')
    })
  }

  toggleStatusCheck(val) {
    if (!this.form.value.SLAType || !this.form.value.ResponseTime) {
      this.common.snackbar('Select SLA type')
      setTimeout(() => {
        if (val == 1) this.reminderToggleStatus = false
        else this.escalationToggleStatus = false
      })
      return;
    } else {
      this.toggleStatus(val)
    }
  }

  toggleStatus(val) {
    if (val == 1) {
      this.reminderToggleStatus = !this.reminderToggleStatus
      this.form.controls['EnableReminder'].patchValue(this.reminderToggleStatus);
      this.setValidators('responsetimereminders', this.reminderToggleStatus)
      // this.setValidators('responsetimeescalation',this.escalationToggleStatus)
      // this.setValidators('resolutiontimereminders',this.reminderToggleStatus)
    }
    else {
      this.escalationToggleStatus = !this.escalationToggleStatus
      this.form.controls['EnableEscalation'].patchValue(this.escalationToggleStatus);
      // this.setValidators('responsetimereminders',this.reminderToggleStatus)
      this.setValidators('responsetimeescalation', this.escalationToggleStatus)
      // this.setValidators('resolutiontimeescalation',this.escalationToggleStatus)
    }
    this.form.updateValueAndValidity()
  }

  formCreation() {
    let finalregex = '^(?:[1-9]|[1-5][0-9]|60)$'
    this.form = this.formBuilder.group({
      SLAName: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      SLADesc: ['', [Validators.nullValidator, Validators.pattern(regex.alphanumericwithspecialcharacter), Validators.maxLength(300)]],
      ChannelId: ['', [Validators.required]],
      ChannelSourceId: ['', [Validators.nullValidator]],
      RequestType: ['', [this.productid != 10 ? Validators.required : Validators.nullValidator]],
      SLAType: ['', [Validators.required]],
      SLAPriority: ['', [this.productid != 10 ? Validators.required : Validators.nullValidator]],
      ResponseType: ['minute', [Validators.required]],
      ResponseTime: [this.minValue, [Validators.required]],
      EnableBusinessHrs: [false, [Validators.required]],
      EnableReminder: [false, [Validators.required]],
      EnableEscalation: [false, [Validators.required]]
    }, {
      validator: [checknull('SLAName'), checknull1('SLADesc')
        // ,validateNumberRange('ResponseTime',this.minValue,this.maxValue)
      ]
    })

    this.form.controls['ResponseTime'].setValidators([Validators.required, this.emailMatchValidator.bind(this, this.form.value.SLAType, this.form.value.ResponseType)]);
    this.form.updateValueAndValidity()
    this.form1 = this.formBuilder.group({
      responsetimereminders: this.formBuilder.array([this.createHeader('REMINDER', 'RESPONSE')]),
      // resolutiontimereminders: this.formBuilder.array([this.createHeader('REMINDER','RESOLUTION')]),
      responsetimeescalation: this.formBuilder.array([this.createHeader('ESCALATION', 'RESPONSE')]),
      // resolutiontimeescalation: this.formBuilder.array([this.createHeader('ESCALATION','RESOLUTION')])
    })

    if (this.productid == 10) {
      this.form.controls['RequestType'].setValidators([Validators.nullValidator]);
    }
    // this.responsetimetypeChanged()
    // this.resolutiontimetypeChanged()

    this.toggleStatus(1)
    this.toggleStatus(2)

    // this.timetypeChanged('responsetimereminders',0)
    // this.timetypeChanged('resolutiontimereminders',0)
    // this.timetypeChanged('responsetimeescalation',0)
    // this.timetypeChanged('resolutiontimeescalation',0)
  }

  emailMatchValidator(SLAType, ResponseType, control: AbstractControl) {


    if (ResponseType == 'minute') {
      if (this.configdata.hasOwnProperty('SLA_MinValueType_' + SLAType) &&
        this.configdata['SLA_MinValueType_' + SLAType] == ResponseType && this.configdata['SLA_MaxValueType_' + SLAType] == ResponseType) {
        if (control.value < this.minValue) {
          return { min: true };
        } else if (control.value > this.maxValue) {
          return { max: true };
        }
      } else if (this.configdata.hasOwnProperty('SLA_MaxValueType_' + SLAType) && this.configdata['SLA_MaxValueType_' + SLAType] == ResponseType) {
        if (control.value > this.maxValue) {
          return { max: true };
        } else if (control.value < 1) {
          return { min: true };
        }
      } else if (this.configdata.hasOwnProperty('SLA_MinValueType_' + SLAType) && this.configdata['SLA_MinValueType_' + SLAType] == ResponseType) {
        if (control.value < this.minValue) {
          return { min: true };
        } else if (control.value > 60) {
          return { max: true };
        }
      } else if (control.value < 1) {
        return { min: true };
      } else if (control.value > 60) {
        return { max: true };
      }
    }

    if (ResponseType == 'hour') {
      if (this.configdata.hasOwnProperty('SLA_MinValueType_' + SLAType) &&
        this.configdata['SLA_MinValueType_' + SLAType] == ResponseType && this.configdata['SLA_MaxValueType_' + SLAType] == ResponseType) {
        if (control.value < this.minValue) {
          return { min: true };
        } else if (control.value > this.maxValue) {
          return { max: true };
        }
      } else if (this.configdata.hasOwnProperty('SLA_MaxValueType_' + SLAType) && this.configdata['SLA_MaxValueType_' + SLAType] == ResponseType) {
        if (control.value > this.maxValue) {
          return { max: true };
        } else if (control.value < 1) {
          return { min: true };
        }
      } else if (this.configdata.hasOwnProperty('SLA_MinValueType_' + SLAType) && this.configdata['SLA_MinValueType_' + SLAType] == ResponseType) {
        if (control.value < this.minValue) {
          return { min: true };
        } else if (control.value > 24) {
          return { max: true };
        }
      } else if (control.value < 1) {
        return { min: true };
      } else if (control.value > 24) {
        return { max: true };
      }
    }

    if (ResponseType == 'day') {
      if (this.configdata.hasOwnProperty('SLA_MinValueType_' + SLAType) &&
        this.configdata['SLA_MinValueType_' + SLAType] == ResponseType && this.configdata['SLA_MaxValueType_' + SLAType] == ResponseType) {
        if (control.value < this.minValue) {
          return { min: true };
        } else if (control.value > this.maxValue) {
          return { max: true };
        }
      } else if (this.configdata.hasOwnProperty('SLA_MaxValueType_' + SLAType) && this.configdata['SLA_MaxValueType_' + SLAType] == ResponseType) {
        if (control.value > this.maxValue) {
          return { max: true };
        } else if (control.value < 1) {
          return { min: true };
        }
      } else if (this.configdata.hasOwnProperty('SLA_MinValueType_' + SLAType) && this.configdata['SLA_MinValueType_' + SLAType] == ResponseType) {
        if (control.value < this.minValue) {
          return { min: true };
        } else if (control.value > 365) {
          return { max: true };
        }
      } else if (control.value < 1) {
        return { min: true };
      } else if (control.value > 365) {
        return { max: true };
      }
    }

    if (ResponseType == 'percentage') {
      if (this.configdata.hasOwnProperty('SLA_MinValueType_' + SLAType) &&
        this.configdata['SLA_MinValueType_' + SLAType] == ResponseType && this.configdata['SLA_MaxValueType_' + SLAType] == ResponseType) {
        if (control.value < this.minValue) {
          return { min: true };
        } else if (control.value > this.maxValue) {
          return { max: true };
        }
      } else if (this.configdata.hasOwnProperty('SLA_MaxValueType_' + SLAType) && this.configdata['SLA_MaxValueType_' + SLAType] == ResponseType) {
        if (control.value > this.maxValue) {
          return { max: true };
        } else if (control.value < 1) {
          return { min: true };
        }
      } else if (this.configdata.hasOwnProperty('SLA_MinValueType_' + SLAType) && this.configdata['SLA_MinValueType_' + SLAType] == ResponseType) {
        if (control.value < this.minValue) {
          return { min: true };
        } else if (control.value > 100) {
          return { max: true };
        }
      } else if (control.value < 1) {
        return { min: true };
      } else if (control.value > 100) {
        return { max: true };
      }
    }
  }

  conditionValueValidator(formControlName, index, control: AbstractControl) {
    // return (formGroup: FormGroup) => {
    // const control = controlName;
    // const a = this
    // console.log("bbb",formControlName);
    // console.log('formValue:',this.minValue,this.form?.value,this.form1?.value);


    // console.log("control.errors:",control.errors)
    if (control.errors && (!control.errors.min && !control.errors.max)) {
      return;
    }

    if (!this.form1 || !this.form1.value[formControlName]) {
      if (control.value < this.maxValue && control.value > this.minValue) {
        return false;
      } else if (control.value < this.minValue) {
        return { min: true };
      } else if (control.value > this.maxValue) {
        return { max: true };
      }
    } else {
      if (control.touched) {
        if (this.form1.value[formControlName][index].Value && this.form1.value[formControlName][index].Condition) {

          // if(this.form1.value[formControlName][index].ValueType == this.form1.value[formControlName][index].IntervalType){
          //   if(control.value < this.form1.value[formControlName][index].Value && control.value > this.minValue){
          //     return false;
          //   } else if(control.value < this.minValue){
          //     return { min: true};
          //   } else if(control.value > this.form1.value[formControlName][index].Value){
          //     return { max: true};
          //   }
          // }else{
          //   if(control.value < this.maxValue && control.value > this.minValue){
          //     return false;
          //   } else if(control.value < this.minValue){
          //     return { min: true};
          //   } else if(control.value > this.maxValue){
          //     return { max: true};
          //   }
          // }

          // if(this.form1.value[formControlName][index].IntervalType == 'minute'){
          //   if(this.configdata.hasOwnProperty('SLA_MinValueType_'+this.form.value.SLAType) &&
          //     this.configdata['SLA_MinValueType_'+this.form.value.SLAType] == this.form1.value[formControlName][index].IntervalType
          //     && this.configdata['SLA_MaxValueType_'+this.form.value.SLAType] == this.form1.value[formControlName][index].IntervalType){
          //     if(control.value < this.minValue){
          //       return { min: true};
          //     } else if(control.value > this.form1.value[formControlName][index].Value){
          //       return { max: true};
          //     }
          //   } else if(this.configdata.hasOwnProperty('SLA_MaxValueType_'+this.form.value.SLAType) && this.configdata['SLA_MaxValueType_'+this.form.value.SLAType] == this.form1.value[formControlName][index].IntervalType){
          //     if(control.value > this.form1.value[formControlName][index].Value){
          //       return { max: true};
          //     } else if(control.value < 1){
          //       return { min: true};
          //     }
          //   } else if(this.configdata.hasOwnProperty('SLA_MinValueType_'+this.form.value.SLAType) && this.configdata['SLA_MinValueType_'+this.form.value.SLAType] == this.form1.value[formControlName][index].IntervalType){
          //     if(control.value < this.minValue){
          //       return { min: true};
          //     } else if(control.value > this.form1.value[formControlName][index].Value){
          //       return { max: true};
          //     }
          //   }  else if(control.value < 1){
          //     return { min: true};
          //   } else if(control.value > 60){
          //     return { max: true};
          //   }
          // }

          let minVal = 1, maxVal = 1;
          if (this.configdata.hasOwnProperty('SLA_MinValueType_' + this.form.value.SLAType)
            && this.configdata['SLA_MinValueType_' + this.form.value.SLAType] == this.form1.value[formControlName][index].IntervalType) {
            minVal = parseInt(this.configdata['SLA_MinValue_' + this.form.value.SLAType])
          }

          if (this.form1.value[formControlName][index].ValueType == this.form1.value[formControlName][index].IntervalType) {
            maxVal = parseInt(this.form1.value[formControlName][index].Value)
          } else if (this.configdata.hasOwnProperty('SLA_MaxValueType_' + this.form.value.SLAType)
            && this.form1.value[formControlName][index].IntervalType == this.configdata['SLA_MaxValueType_' + this.form.value.SLAType]) {
            maxVal = parseInt(this.configdata['SLA_MaxValue_' + this.form.value.SLAType])
          } else if (this.form1.value[formControlName][index].IntervalType == 'day') {
            maxVal = 365
          } else if (this.form1.value[formControlName][index].IntervalType == 'hour') {
            maxVal = 24
          } else if (this.form1.value[formControlName][index].IntervalType == 'minute') {
            maxVal = 60
          } else if (this.form1.value[formControlName][index].IntervalType == 'percentage') {
            maxVal = 100
          }

          if (control.value < minVal) {
            return { min: true };
          } else if (control.value > maxVal) {
            return { max: true };
          }
        }
      }
    }
    // }
  }

  get f(): { [key: string]: AbstractControl } { return this.form.controls }

  get f1() { return this.form1.get('responsetimereminders') as FormArray; }
  // get f2() { return this.form1.get('resolutiontimereminders') as FormArray; }
  get f3() { return this.form1.get('responsetimeescalation') as FormArray; }
  // get f4() { return this.form1.get('resolutiontimeescalation') as FormArray; }

  responsetimetypeChanged() {
    let finalregex: any
    let capacity = 0
    let capacityminus1 = 0

    if (this.form.value.ResponseType) {
      this.minValue = this.configdata['SLA_MinValue_' + this.form.value.SLAType] ? parseFloat(this.configdata['SLA_MinValue_' + this.form.value.SLAType]) : 1
      this.maxValue = this.configdata['SLA_MaxValue_' + this.form.value.SLAType] ? parseFloat(this.configdata['SLA_MaxValue_' + this.form.value.SLAType]) : 1
    }
    // if(this.form.value.ResponseType == 'minute'){
    //   // finalregex = '^(?:[1-9]|[1-5][0-9]|60)$'
    //   this.maxValue = 60
    // }
    // if(this.form.value.ResponseType == 'hour'){
    //   // finalregex = '^(?:[1-9]|[1][0-9]|[2][0-3]|24)$'
    //   this.maxValue = 24
    // }
    // if(this.form.value.ResponseType == 'day'){
    //   // finalregex = '^(?:[1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|[3][0-6][0-5])$'
    //   this.maxValue = 365
    // }
    setTimeout(() => {
      // if(finalregex){
      // this.form.controls['ResponseTime'].patchValue('');
      // this.form.controls['ResponseTime'].setValidators([Validators.required,Validators.pattern(finalregex)]);

      this.form.controls['ResponseTime'].patchValue(this.minValue);
      this.form.controls['ResponseTime'].setValidators([Validators.required, this.emailMatchValidator.bind(this, this.form.value.SLAType, this.form.value.ResponseType)]);
      this.form.updateValueAndValidity()
      // }
    })
  }

  resolutiontimetypeChanged() {
    let finalregex: any
    let capacity = 0
    let capacityminus1 = 0
    if (this.form.value.ResolutionType == 'minute') {
      finalregex = '^(?:[1-9]|[1-5][0-9]|60)$'
      // capacity = 60
      // capacityminus1 =capacity
      // if(Math.floor(capacity% 10) == 0){
      //   capacityminus1 = capacity - 1
      // }
      // finalregex = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ capacity +')$'
    }
    if (this.form.value.ResolutionType == 'hour') {
      finalregex = '^(?:[1-9]|[1][0-9]|[2][0-3]|24)$'
      // capacity = 24
      // capacityminus1 =capacity
      // if(Math.floor(capacity% 10) == 0){
      //   capacityminus1 = capacity - 1
      // }
      // finalregex = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ capacity +')$'
    }
    if (this.form.value.ResolutionType == 'day') {
      finalregex = '^(?:[1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-6][0-5])$'
      // capacity = 365
      // capacityminus1 =capacity
      // if(Math.floor(capacity% 100) == 0){
      //   capacityminus1 = capacity - 1
      // }
      // finalregex = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ capacity +')$'
    }
    setTimeout(() => {
      if (finalregex) {
        this.form.controls['ResolutionTime'].patchValue('');
        this.form.controls['ResolutionTime'].setValidators([Validators.required, Validators.pattern(finalregex)]);
        this.form.updateValueAndValidity()
      }
    })
  }

  timetypeChanged(formControlName, index) {
    let finalregex: any
    if (this.form1.controls[formControlName]['controls'][index]['controls']['IntervalType'].value == 'minute') {
      finalregex = '^(?:[1-9]|[1-5][0-9]|60)$'
    }
    if (this.form1.controls[formControlName]['controls'][index]['controls']['IntervalType'].value == 'hour') {
      finalregex = '^(?:[1-9]|[1][0-9]|[2][0-3]|24)$'
    }
    if (this.form1.controls[formControlName]['controls'][index]['controls']['IntervalType'].value == 'day') {
      finalregex = '^(?:[1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-6][0-5])$'
    }
    setTimeout(() => {
      if (finalregex) {
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalValue'].patchValue('');
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalValue'].setValidators([Validators.required, this.conditionValueValidator.bind(this, formControlName, index)]);
        // this.form1.controls[formControlName]['controls'][index]['controls']['IntervalValue'].setValidators([Validators.required,Validators.pattern(finalregex)]);
        this.form1.updateValueAndValidity()
      }
    })
  }

  setValidators(formControlName, status) {
    for (let index in this.form1.value[formControlName]) {
      if (!status) {
        this.form1.controls[formControlName]['controls'][index]['controls']['SLACategory'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['SLACategory'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['SLAType'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['SLAType'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['Field'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['Field'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['Condition'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['Condition'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['Value'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['Value'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['ValueType'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['ValueType'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['RemindTo'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['RemindTo'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['NotificationId'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['NotificationId'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['BeforeAfter'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['BeforeAfter'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalType'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalType'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalValue'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalValue'].updateValueAndValidity();

        this.form1.controls[formControlName]['controls'][index]['controls']['EmailID'].clearValidators()
        this.form1.controls[formControlName]['controls'][index]['controls']['EmailID'].updateValueAndValidity()
      } else {
        this.form1.controls[formControlName]['controls'][index]['controls']['SLACategory'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['SLACategory'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['SLAType'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['SLAType'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['Field'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['Field'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['Condition'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['Condition'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['Value'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['Value'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['ValueType'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['ValueType'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['RemindTo'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['RemindTo'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['NotificationId'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['NotificationId'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['BeforeAfter'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['BeforeAfter'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalType'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalType'].updateValueAndValidity()
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalValue'].setValidators([Validators.required])
        this.form1.controls[formControlName]['controls'][index]['controls']['IntervalValue'].updateValueAndValidity()

        if (this.form1.controls[formControlName]['controls'][index]['controls']['RemindTo'].value == 'Others') {
          this.form1.controls[formControlName]['controls'][index]['controls']['EmailID'].setValidators([Validators.required])
          this.form1.controls[formControlName]['controls'][index]['controls']['EmailID'].updateValueAndValidity()
        }
      }
      if (status) this.timetypeChanged(formControlName, index);
      // console.log(this.form.valid,":",this.form1.valid,":",status);

    }
    this.form1.updateValueAndValidity();
  }

  createHeader(type, subType): FormGroup {
    let finalregex = '^(?:[1-9]|[1-5][0-9]|60)$'
    return this.formBuilder.group({
      SLAID: '',
      SLACategory: [type, [Validators.required]],
      SLAType: [subType, [Validators.required]],
      Field: [this.form.value.SLAType, [Validators.required]],
      Condition: ['', [Validators.required]],
      Value: ['', [Validators.required]],
      ValueType: ['', [Validators.required]],
      RemindTo: ['', [Validators.required]],
      NotificationGrp: '',
      NotificationId: ['', [Validators.required]],
      BeforeAfter: [subType.toLowerCase() == 'response' ? 'BEFORE' : 'AFTER', [Validators.required]],
      IntervalType: ['minute', [Validators.required]],
      IntervalValue: ['', [Validators.required, , this.conditionValueValidator.bind(this, type == 'REMINDER' ? 'responsetimereminders' : 'responsetimeescalation', this.form1 ? this.form1.value[type == 'REMINDER' ? 'responsetimereminders' : 'responsetimeescalation'].length : 0)]],
      EmailID: [[]],
      Id: ''
    })
  }

  getInternal(type) {
    this.loader = true
    let obj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION",
        parameters: {
          flag: 'GET_FOR_SLA',
          PROCESSID: this.userDetails?.Processid,
          PRODUCTID: this.productid,
          NotificationGrp: type
        }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false
        if (res.results.data.length > 0) {
          console.log(res.results.data);

          if (type == 'Internal') this.internal = res.results.data[0]
          if (type == 'External') this.external = res.results.data[0]
        }
      }
    })
  }

  remindToChanged(formControlName, i) {
    if (this.form1.controls[formControlName]['controls'][i]['controls']['RemindTo'].value == 'Others') {
      this.form1.controls[formControlName]['controls'][i]['controls']['EmailID'].setValidators([Validators.required])
      this.form1.controls[formControlName]['controls'][i]['controls']['EmailID'].updateValueAndValidity()
      this.form1.controls[formControlName]['controls'][i]['controls']['NotificationGrp'].patchValue('EXTERNAL')
    } else {
      this.form1.controls[formControlName]['controls'][i]['controls']['EmailID'].clearValidators()
      this.form1.controls[formControlName]['controls'][i]['controls']['EmailID'].updateValueAndValidity()
      this.form1.controls[formControlName]['controls'][i]['controls']['NotificationGrp'].patchValue('INTERNAL')
    }
    this.form1.updateValueAndValidity()
  }

  add(e) {
    if (e == 1) {
      this.f1.push(this.createHeader('REMINDER', 'RESPONSE'));
    }
    //  else if(e == 2){
    //   this.f2.push(this.createHeader('REMINDER','RESOLUTION'));
    // }
    else if (e == 3) {
      this.f3.push(this.createHeader('ESCALATION', 'RESPONSE'));
    }
    //  else if(e == 4){
    //   this.f4.push(this.createHeader('ESCALATION','RESOLUTION'));
    // }
  }


  removeKeyword(keyword: string, formControlName, i) {
    let val = this.form1.value[formControlName][i].EmailID
    const index = val.indexOf(keyword);
    if (index >= 0) {
      val.splice(index, 1);
    }
    this.form1.controls[formControlName]['controls'][i]['controls']['EmailID'].patchValue(val)
  }

  addKeywordFromInput(event: MatChipInputEvent, formControlName, i): void {
    const value = (event.value || '').trim();

    var regex1 = new RegExp(regex.email1);
    if (!regex1.test(value)) {
      this.common.snackbar('Email Invalid');
      // this.invalidemail = true
      return;
    }
    else if (this.form1.value[formControlName][i].EmailID.length > 0) {
      const totalSelected = this.form1.value[formControlName][i].EmailID
      const hasDuplicate = totalSelected.some((e, index) => {
        if (e === value) {
          this.form.markAllAsTouched()
          this.form1.controls[formControlName]['controls'][i]['controls']['EmailID'].setErrors({ sameEmail: true });
          return hasDuplicate ? { duplicate: true } : null;
        }
      });
    }
    let val = this.form1.value[formControlName][i].EmailID ? this.form1.value[formControlName][i].EmailID : []
    // Add our keyword
    if (value) {
      val.push(value);
     this.form1.controls[formControlName]['controls'][i]['controls']['EmailID'].setErrors(null)
     this.form1.controls[formControlName]['controls'][i]['controls']['EmailID'].clearValidators();
    }
    this.form1.controls[formControlName]['controls'][i]['controls']['EmailID'].patchValue(val)
    // Clear the input value
    event.chipInput!.clear();
  }

  reset() {
    this.form.reset({});
    this.form1.reset({});
    this.reminderToggleStatus = true
    this.escalationToggleStatus = true
    this.formCreation();
    this.mapanel.close();
    this.mapanel1.close();
  }


  submit(event): void {

    // if(!this.form.value.EnableReminder && !this.form.value.EnableEscalation){
    // form.invalid || form1.invalid
    if (this.form.invalid) {
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl?.focus();
          this.form.markAllAsTouched();
          break;
        }
      }
      this.panel1.open()
      return;
    }
    if (!this.reminderToggleStatus && !this.escalationToggleStatus) {
      this.common.snackbar('Select Reminder or Escalation')
      return
    }
    if (this.form1.invalid) {
      for (const key of Object.keys(this.form1.controls)) {
        if (this.form1.controls[key].invalid) {

          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl?.focus();
          this.form1.markAllAsTouched();
          break;
        }
      }
      if (this.reminderToggleStatus) {
        this.mapanel.open()
      }
      if (this.escalationToggleStatus) {
        this.mapanel1.open()
      }
      return;
    }
    if ( this.form1.controls['responsetimereminders']['controls'].forEach(e => {
            //  console.log(e.controls.EmailID.hasError('sameEmail'));
            //  (e.controls.EmailID.hasError('sameEmail'))

    })) {
      return;
    }
    this.loader = true
    let obj: any
    if (this.id) {
      obj = {
        data: {
          spname: "usp_unfyd_sla",
          parameters: {
            flag: 'UPDATE',
            id: this.id,
            // ...this.form.value,

            SLAName: this.form.value.SLAName == null ? null : this.form.value.SLAName.trim(),
            SLADesc: this.form.value.SLADesc == null ? null : this.form.value.SLADesc.trim(),
            ChannelId: this.form.value.ChannelId,
            ChannelSourceId: this.form.value.ChannelSourceId,
            RequestType: this.form.value.RequestType,
            SLAType: this.form.value.SLAType,
            SLAPriority: this.form.value.SLAPriority,
            ResponseType: this.form.value.ResponseType,
            ResponseTime: this.form.value.ResponseTime,
            EnableBusinessHrs: this.form.value.EnableBusinessHrs,
            EnableReminder: this.form.value.EnableReminder,
            EnableEscalation: this.form.value.EnableEscalation,

            MODIFIEDBY: this.userDetails.Id,
            ...this.commonDetails
          }
        }
      };
    } else {
      obj = {
        data: {
          spname: "usp_unfyd_sla",
          parameters: {
            flag: 'INSERT',
            // ...this.form.value,

            SLAName: this.form.value.SLAName == null ? null : this.form.value.SLAName.trim(),
            SLADesc: this.form.value.SLADesc == null ? null : this.form.value.SLADesc.trim(),
            ChannelId: this.form.value.ChannelId,
            ChannelSourceId: this.form.value.ChannelSourceId,
            RequestType: this.form.value.RequestType,
            SLAType: this.form.value.SLAType,
            SLAPriority: this.form.value.SLAPriority,
            ResponseType: this.form.value.ResponseType,
            ResponseTime: this.form.value.ResponseTime,
            EnableBusinessHrs: this.form.value.EnableBusinessHrs,
            EnableReminder: this.form.value.EnableReminder,
            EnableEscalation: this.form.value.EnableEscalation,

            createdby: this.userDetails.Id,
            ...this.commonDetails
          }
        }
      };
    }
    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          if (res.results.data[0].hasOwnProperty('result')) {
            // if(res.results.data[0].hasOwnProperty('result') && res.results.data[0].hasOwnProperty('Id')){
            if (this.id) {
              if (res.results.data[0].result.includes("success")) {
                this.submitCategory(this.id, event)
              } else {
                this.loader = false;
                this.common.snackbar("General Error");
              }
            } if (res.results.data[0].Status == true) {

              this.common.confirmationToMakeDefault('AcitvateDeletedData');
              this.subscriptionAcitivateData.push(
                this.common.getIndividualUpload$.subscribe(status => {
                  if (status.status) {
                    // this.loader = true;
                    this.requestObj = {
                      data: {
                        spname: "usp_unfyd_sla",
                        parameters: {
                          flag: 'ACTIVATE',
                          SLAName: this.form.value.SLAName == null ? null : this.form.value.SLAName,
                          productId: Number(this.productid),
                          processid: this.userDetails.Processid,
                        }
                      }
                    };

                    this.api.post('index', this.requestObj).subscribe((res: any) => {
                      if (res.code == 200) {
                        this.common.snackbar('Record add');
                        if (event == 'save') {
                          this.back();
                        } if (event == 'saveAndAddNew') {
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
            if ((res.results.data[0].result == "Data already exists" && (res.results.data[0].Status == false))) {
              this.common.snackbar('Data Already Exist');
              this.loader = false;
            } else {
              if (res.results.data[0].result.includes("success")) {
                this.submitCategory(res.results.data[0].Id, event)
              } else {
                this.loader = false;
                // this.common.snackbar("General Error");
              }
            }
          } else {
            this.loader = false;
            this.common.snackbar("General Error");
          }
        } else {
          this.loader = false;
          this.common.snackbar("General Error");
        }
      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    }, error => {
      this.loader = false
    })
  }

  submitCategory(slaid, event) {
    let arrayObj = []
    if (this.form.value.EnableReminder) {
      arrayObj = [...arrayObj, ...JSON.parse(JSON.stringify(this.form1.value.responsetimereminders))]
      // arrayObj = [...arrayObj,...JSON.parse(JSON.stringify(this.form1.value.resolutiontimereminders))]
    }
    if (this.form.value.EnableEscalation) {
      arrayObj = [...arrayObj, ...JSON.parse(JSON.stringify(this.form1.value.responsetimeescalation))]
      // arrayObj = [...arrayObj,...JSON.parse(JSON.stringify(this.form1.value.resolutiontimeescalation))]
    }
    let count = arrayObj.length
    arrayObj.forEach(element => {
      let obj: any
      if (element.Id) {
        element.EmailID = element.EmailID.length > 0 ? element.EmailID.join(',') : ''
        obj = {
          data: {
            spname: "usp_unfyd_sla_category",
            parameters: {
              flag: 'UPDATE',
              ...element,
              MODIFIEDBY: this.userDetails.Id,
              ...this.commonDetails
            }
          }
        };
        // obj.data.parameters.SLAID = this.id
      } else {
        element.EmailID = element.EmailID.length > 0 ? element.EmailID.join(',') : ''
        obj = {
          data: {
            spname: "usp_unfyd_sla_category",
            parameters: {
              flag: 'INSERT',
              ...element,
              createdby: this.userDetails.Id,
              ...this.commonDetails
            }
          }
        };
        obj.data.parameters.SLAID = slaid
        delete obj.data.parameters.Id;

      }

      this.api.post("index", obj).subscribe((res) => {
        if (res.code == 200) {
          if (res.results.data.length > 0) {
            if (res.results.data[0].hasOwnProperty('result')) {
              if (res.results.data[0].result.includes("success")) {
                count--;
                if (count == 0) {
                  this.loader = false
                  if (this.id) {
                    this.common.snackbar('Update Success');
                    if (event == 'saveAndAddNew') { this.reset() }
                    else if (event == 'save') this.back()
                  } else {
                    this.common.snackbar('Record add')
                    if (event == 'saveAndAddNew') { this.reset() }
                    else if (event == 'save') this.back()
                  }
                }

              } else {
                this.loader = false;

              }
            } else {
              this.loader = false;

            }
          } else {
            this.loader = false;

          }
        } else {
          this.loader = false;

        }
      }, error => {
        this.loader = false
        this.common.snackbar("General Error");
      })
    });
  }


  delete(e, index) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status) {
        // console.log(this.form1.get(e).value[index].Id);
        if (this.form1.get(e).value[index].Id) {
          this.deleteCategoryAPI(e, index)
        } else {
          this.deleteCategoryLocal(e, index)
        }
      }
    }))
  }

  deleteCategoryAPI(e, i) {
    let obj = {
      data: {
        spname: "usp_unfyd_sla_category",
        parameters: {
          flag: 'DELETE',
          DELETEDBY: this.userDetails.Id,
          Id: this.form1.get(e).value[i].Id
        }
      }
    };
    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          if (res.results.data[0].hasOwnProperty('result')) {
            if (res.results.data[0].result.includes("success")) {
              this.deleteCategoryLocal(e, i)
            } else {
              this.loader = false;
              this.common.snackbar("General Error");
            }
          } else {
            this.loader = false;
            this.common.snackbar("General Error");
          }
        } else {
          this.loader = false;
          this.common.snackbar("General Error");
        }
      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    }, error => {
      this.loader = false
      this.common.snackbar("General Error");
    })
  }

  deleteCategoryLocal(e, i) {
    let a = this.form1.controls[e] as FormArray
    a.removeAt(i)
    this.common.snackbar("Delete Record");
  }

  channelChanged() {
    this.form.controls['ChannelSourceId'].patchValue('')
    // this.linkConfigManagerData()
    this.getChannelSource()
  }

  getChannelSource() {
    // this.loader = true
    let obj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          channelid: this.form.value.ChannelId,
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'getChannel');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        // this.loader  = false;
        this.channelSourceId = res.results['data']
      }
    });
  }

  getChannel() {
    let obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ConfigManager', 'click', '', '', '', 'getChannel');

    this.api.post('index', obj).subscribe((res: any) => {
      this.channelType = res.results['data']
      if (res.code == 200) {
        localStorage.setItem("userChannelName", res.results.data[0][0].UserLanguage);
        this.getChannelStorage()
      }
    });
  }


  getChannelStorage() {
    this.loader = true;
    this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))
    // console.log('this.userChannelName all', this.userChannelName)
    if (this.userChannelName == null || this.userChannelName == undefined) {
      this.getChannel();
    } else {
      let chlen = this.userChannelName.length
      this.userChannelName.forEach(element => {
        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }

  ChangedSLA() {
    this.form.controls['ResponseTime'].setValidators([Validators.required, this.emailMatchValidator.bind(this, this.form.value.SLAType, this.form.value.ResponseType)]);
    this.form.updateValueAndValidity()
    console.log("this.f1.length:", this.f1.length);
    this.f1.controls.forEach((element, index) => {
      this.f1.at(index).get('Field').patchValue(this.form.value.SLAType)
    });
    this.f3.controls.forEach((element, index) => {
      this.f3.at(index).get('Field').patchValue(this.form.value.SLAType)
    });

    if (this.form.value.SLAType == 'CSAT' || this.form.value.SLAType == 'QCScore') {
      // this.mainDurationDropDown = [{Key:'percentage',Value:'%'}]
      // this.durationDropDown = [{Key:'percentage',Value:'%'}]
    }
    // setTimeout(()=>{
    //   this.form.value.SLAType
    // })
  }

  valueChanged() {
    // this.valueArray = Array.from({length: this.form.value.ResponseTime - this.minValue+1}, (_, i) => i + this.minValue)
    // this.configdata['SLA_MinValueType_'+SLAType] == ResponseType
    // if(this.form.value.ResponseTime){
    if (this.form.value.ResponseType == 'day') {
      if (this.configdata['SLA_MinValueType_' + this.form.value.SLAType] == this.form.value.ResponseType) {
        this.valueArray['day'] = Array.from({ length: this.form.value.ResponseTime - this.minValue + 1 }, (_, i) => i + this.minValue)
      } else {
        this.valueArray['day'] = Array.from({ length: this.form.value.ResponseTime - 1 + 1 }, (_, i) => i + 1)
      }

      // this.valueArray[''] = Array.from({length: this.form.value.ResponseTime - this.minValue+1}, (_, i) => i + this.minValue)
      this.valueArray['hour'] = Array.from({ length: 24 - this.minValue + 1 }, (_, i) => i + this.minValue)
      this.valueArray['minute'] = Array.from({ length: 60 - this.minValue + 1 }, (_, i) => i + this.minValue)
    }
    if (this.form.value.ResponseType == 'hour') {
      this.valueArray['day'] = Array.from({ length: this.maxValue - this.minValue + 1 }, (_, i) => i + this.minValue)
      if (this.configdata['SLA_MinValueType_' + this.form.value.SLAType] == this.form.value.ResponseType) {
        this.valueArray['hour'] = Array.from({ length: this.form.value.ResponseTime - this.minValue + 1 }, (_, i) => i + this.minValue)
      } else {
        this.valueArray['hour'] = Array.from({ length: this.form.value.ResponseTime - 1 + 1 }, (_, i) => i + 1)
      }

      // this.valueArray[''] = Array.from({length: this.form.value.ResponseTime - this.minValue+1}, (_, i) => i + this.minValue)
      this.valueArray['minute'] = Array.from({ length: 60 - this.minValue + 1 }, (_, i) => i + this.minValue)
    }
    if (this.form.value.ResponseType == 'minute') {
      this.valueArray['day'] = Array.from({ length: this.maxValue - this.minValue + 1 }, (_, i) => i + this.minValue)
      this.valueArray['hour'] = Array.from({ length: this.maxValue - this.minValue + 1 }, (_, i) => i + this.minValue)
      if (this.configdata['SLA_MinValueType_' + this.form.value.SLAType] == this.form.value.ResponseType) {
        this.valueArray['minute'] = Array.from({ length: this.form.value.ResponseTime - this.minValue + 1 }, (_, i) => i + this.minValue)
      } else {
        this.valueArray['minute'] = Array.from({ length: this.form.value.ResponseTime - 1 + 1 }, (_, i) => i + 1)
      }
      // this.valueArray[''] = Array.from({length: this.form.value.ResponseTime - this.minValue+1}, (_, i) => i + this.minValue)
    }
    if (this.form.value.ResponseType == 'percentage') {
      // this.valueArray['day'] = Array.from({length: this.maxValue - this.minValue+1}, (_, i) => i + this.minValue)
      // this.valueArray['hour'] = Array.from({length: this.maxValue - this.minValue+1}, (_, i) => i + this.minValue)
      // this.valueArray['minute'] = Array.from({length: this.form.value.ResponseTime - this.minValue+1}, (_, i) => i + this.minValue)
      this.valueArray['percentage'] = Array.from({ length: this.form.value.ResponseTime - this.minValue + 1 }, (_, i) => i + this.minValue)
    }
    // }
  }

  conditionValueChanged(formControlName, index) {
    setTimeout(() => {
      this.form1.controls[formControlName]['controls'][index]['controls']['IntervalValue'].setValidators([Validators.required, this.conditionValueValidator.bind(this, formControlName, index)]);
      this.form1.updateValueAndValidity()
    });
  }
  conditionValueTypeChanged(formControlName, index) {
    setTimeout(() => {
      // this.form.value.ResponseTime
      this.form1.controls[formControlName]['controls'][index]['controls']['IntervalValue'].setValidators([Validators.required, this.conditionValueValidator.bind(this, formControlName, index)]);
      this.form1.updateValueAndValidity();
    });
  }

  returnValueType() {
    let a = []
    if (this.form.value.ResponseType) {
      // if( this.form.value.ResponseType == 'day') a = this.mainDurationDropDown
      if (this.form.value.ResponseType == 'day') a = this.mainDurationDropDown.filter(element => element.Key == 'day')
      if (this.form.value.ResponseType == 'hour') a = this.mainDurationDropDown.filter(element => element.Key != 'day' && element.Key != 'percentage')
      if (this.form.value.ResponseType == 'minute') a = this.mainDurationDropDown.filter(element => element.Key != 'day' && element.Key != 'hour' && element.Key != 'percentage')
      if (this.form.value.ResponseType == 'percentage') a = this.mainDurationDropDown.filter(element => element.Key == 'percentage')
    } else a = this.mainDurationDropDown
    this.valueTypeArray = a;
    this.responseTypeChanged()
  }

  returnIntervalType(formControlName, index) {
    let a = []
    if (this.form1.value[formControlName][index]['ValueType']) {
      if (this.form1.value[formControlName][index]['ValueType'] == 'percentage') a = this.mainDurationDropDown.filter(element => element.Key == 'percentage')
      if (this.form1.value[formControlName][index]['ValueType'] == 'day') a = this.mainDurationDropDown.filter(element => element.Key != 'percentage')
      if (this.form1.value[formControlName][index]['ValueType'] == 'hour') a = this.mainDurationDropDown.filter(element => element.Key != 'day' && element.Key != 'percentage')
      if (this.form1.value[formControlName][index]['ValueType'] == 'minute') a = this.mainDurationDropDown.filter(element => element.Key != 'day' && element.Key != 'hour' && element.Key != 'percentage')
    } else a = this.mainDurationDropDown
    return a;
  }

  responseTypeChanged() {
    this.f1.controls.forEach((element, index) => {
      this.f1.at(index).get('Value').patchValue('')
      this.f1.at(index).get('ValueType').patchValue('')
      this.f1.at(index).get('IntervalValue').patchValue('')
      this.f1.at(index).get('IntervalType').patchValue('')
    });
    this.f3.controls.forEach((element, index) => {
      this.f3.at(index).get('Value').patchValue('')
      this.f3.at(index).get('ValueType').patchValue('')
      this.f3.at(index).get('IntervalValue').patchValue('')
      this.f3.at(index).get('IntervalType').patchValue('')
    });
  }


  linkConfigManagerData(val?) {
    let obj = {
      data: {
        spname: "usp_unfyd_link_config ",
        parameters: {
          flag: "GET",
          // channelid: this.form.value.channel,
          // languagecode: this.form.value.language,
          // processid: this.userDetails.Processid,
        }
      }
    }

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.configdata = {}
        if (res.results.data.length > 0) {
          res.results.data.forEach(element => {
            let time = {
              hour: 0,
              minute: 0,
              second: 0
            }
            if (element.ConfigName == 'Collaborator_Data' || element.ConfigName == 'SLA_RequestType' || element.ConfigName == 'SLA_Type') {
              element.ConfigValue = element.ConfigValue ? element.ConfigValue.split(",") : []
            }
            if (element.controltype == 'time') {
              if (element.ConfigName) {
                let a = parseInt(element.ConfigValue);
                time.hour = Math.floor(a / (60 * 60)) ? Math.floor(a / (60 * 60)) : 0
                time.minute = Math.floor((a % (60 * 60)) / 60) ? Math.floor((a % (60 * 60)) / 60) : 0
                time.second = Math.floor((((a % (60 * 60)) / 60) * 60) % 60) ? Math.floor((((a % (60 * 60)) / 60) * 60) % 60) : 0
              }
            }

            Object.assign(this.configdata, { [element.ConfigName]: element.ConfigValue == "false" ? false : (this.keysIncludeTimeInSecond.includes(element.ConfigName) || element.controltype == 'time') ? time : element.ConfigValue })
          })
          console.log("link config data:", this.configdata);
          if (this.configdata['SLA_Type'].length > 0) {
            let newArrayForSLAType = []
            this.configdata['SLA_Type'].forEach(element => {
              newArrayForSLAType.push({ Key: element, Value: element })
            });
            this.SLAType = newArrayForSLAType
          }
          if (this.configdata['SLA_RequestType'].length > 0) {
            let newArrayForSLARequestType = []
            this.configdata['SLA_RequestType'].forEach(element => {
              newArrayForSLARequestType.push({ Key: element, Value: element })
            });
            this.SlaRequestType = newArrayForSLARequestType
          }
          // this.changeMainDropdown()
          // this.responsetimetypeChanged()
          // this.valueChanged()

          this.responsetimetypeChanged()
          this.changeMainDropdown();
          this.valueChanged();
          this.returnValueType()
          this.getSLACategoryData(val)
          this.loader = false
        }
      }
    })

  }

  changeMainDropdown() {
    let a = []
    this.mainDurationDropDown = JSON.parse(JSON.stringify(this.mainDurationDropDownCopy))
    if (this.form.value.SLAType && this.configdata['SLA_MinValueType_' + this.form.value.SLAType] && this.configdata['SLA_MaxValueType_' + this.form.value.SLAType]) {

      if (this.configdata['SLA_MinValueType_' + this.form.value.SLAType] == 'percentage') a = this.mainDurationDropDown.filter(element => element.Key == 'percentage')
      // if( this.configdata['SLA_MinValueType_'+this.form.value.SLAType] == 'day') a =  this.durationDropDown.filter(element => element.Key == 'day' && element.Key != 'percentage' )

      if (this.configdata['SLA_MinValueType_' + this.form.value.SLAType] == 'day') {
        a = this.mainDurationDropDown.filter(element => element.Key == 'day')
      }

      if (this.configdata['SLA_MinValueType_' + this.form.value.SLAType] == 'hour') {
        if (this.configdata['SLA_MaxValueType_' + this.form.value.SLAType] == 'hour') {
          a = this.mainDurationDropDown.filter(element => element.Key == 'hour')
        } else {
          a = this.mainDurationDropDown.filter(element => element.Key != 'percentage' && element.Key != 'minute')
        }
      }
      if (this.configdata['SLA_MinValueType_' + this.form.value.SLAType] == 'minute') {
        if (this.configdata['SLA_MaxValueType_' + this.form.value.SLAType] == 'minute') {
          a = this.mainDurationDropDown.filter(element => element.Key == 'minute')
        } else if (this.configdata['SLA_MaxValueType_' + this.form.value.SLAType] == 'hour') {
          a = this.mainDurationDropDown.filter(element => element.Key != 'day' && element.Key != 'percentage')
        } else {
          a = this.mainDurationDropDown.filter(element => element.Key != 'percentage')
        }
      }
      // if( this.form.value.ResponseType == 'hour') a =  this.durationDropDown.filter(element => element.Key != 'day')
      // if( this.form.value.ResponseType == 'minute') a =  this.durationDropDown.filter(element => element.Key != 'day' && element.Key != 'hour')
    }
    // else a = this.durationDropDown
    if (a.length > 0) this.mainDurationDropDown = [...a];
  }

  updateValuesAtEnd(form, form1) {
    // this.form.patchValue(form)
    // if(form.ChannelSourceId)this.form.controls['ChannelSourceId'].patchValue((form.ChannelSourceId).toString())
    // if(form.SLAPriority)this.form.controls['SLAPriority'].patchValue(parseInt(form.SLAPriority))
    // if(form.ResponseTime)this.form.controls['ResponseTime'].patchValue(parseInt(form.ResponseTime))
    let a = 0
    let b = 0
    form1.forEach((element, index) => {
      if (element.SLACategory == 'REMINDER') {
        if (element.SLAType == 'RESPONSE') {
          // this.add(1)

          // this.form1.controls['responsetimereminders']['controls'][a].patchValue(element);
          // if(element.NotificationId) this.form1.controls['responsetimereminders']['controls'][a]['controls']['NotificationId'].patchValue(parseInt(element.NotificationId));
          if (element.IntervalValue) this.form1.controls['responsetimereminders']['controls'][a]['controls']['IntervalValue'].patchValue(parseInt(element.IntervalValue));
          // if(element.EmailID) this.form1.controls['responsetimereminders']['controls'][a]['controls']['EmailID'].patchValue(element.EmailID.split());
          console.log(this.form1.value.responsetimereminders[a].IntervalValue);
          this.form1.controls['responsetimereminders']['controls'][a]['controls']['IntervalValue'].markAllAsTouched()
          a++;
          this.form1.updateValueAndValidity()
        }
      } else if (element.SLACategory == 'ESCALATION') {
        if (element.SLAType == 'RESPONSE') {
          // this.add(3)
          // this.form1.controls['responsetimeescalation']['controls'][b].patchValue(element);
          // if(element.NotificationId) this.form1.controls['responsetimeescalation']['controls'][b]['controls']['NotificationId'].patchValue(parseInt(element.NotificationId));
          if (element.IntervalValue) this.form1.controls['responsetimeescalation']['controls'][b]['controls']['IntervalValue'].patchValue(parseInt(element.IntervalValue));
          // if(element.EmailID) this.form1.controls['responsetimeescalation']['controls'][b]['controls']['EmailID'].patchValue(element.EmailID.split());
          console.log(this.form1.value.responsetimeescalation[b].IntervalValue);
          this.form1.controls['responsetimeescalation']['controls'][b]['controls']['IntervalValue'].markAllAsTouched()
          b++;
          this.form1.updateValueAndValidity()
        }
      }
    });
    // this.form1.updateValueAndValidity()
    console.log(this.form1.value);
    setTimeout(() => {
      this.form1.patchValue(this.form1.value)
    });
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


  // returnSubmit():boolean{
  //   if(!this.reminderToggleStatus && !this.escalationToggleStatus) return true;
  //   else return false;
  // }

  // updateFormValidity(){
  //   this.form.updateValueAndValidity()
  //   this.form1.updateValueAndValidity()
  // }

}
