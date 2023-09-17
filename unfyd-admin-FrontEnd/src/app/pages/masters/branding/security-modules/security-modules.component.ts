import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input, ElementRef, } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Location } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { checknull, checknull1, regex } from 'src/app/global/json-data';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { encode, decode } from 'html-entities';
import { MatChipInputEvent } from '@angular/material/chips';
export class noSpaceValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if ((control.value && control.value as string).indexOf(' ') === 0) {
        return { cannotContainSpace: true }
      }

    }
    return null;
  }
}
@Component({
  selector: 'app-security-modules',
  templateUrl: './security-modules.component.html',
  styleUrls: ['./security-modules.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, deps: [CommonService], useFactory: (common: CommonService) => {
        let a: any = {
          parse: {
            dateInput: 'DD/MM/YYYY',
          },
          display: {
            dateInput: 'dddd/MMM/YYYY',
            monthYearLabel: 'MMMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY'
          }
        };
        common.localizationInfo$.subscribe((res1) => {
          a.display.dateInput = res1.selectedDateFormats.toUpperCase()
        })
        common.localizationDataAvailable$.subscribe((res) => {
          if (res) {
            common.localizationInfo$.subscribe((res1) => {
              a.display.dateInput = res1.selectedDateFormats.toUpperCase()
            })
          }
        })
        return a
      }
    }
  ]
})
export class SecurityModulesComponent implements OnInit {
  formBlockContent: FormGroup;
  formBlocklocation: FormGroup;
  formBlockIPAdd: FormGroup
  formSpamControl: FormGroup
  formBlackList: FormGroup
  userDetails: any;
  loader: boolean = false;
  @Input() moduleName: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  count = 0;
  searchStates: any = [];
  filteredStates = this.searchStates.slice();
  searchdistrict: any = [];
  filtereddistrict = this.searchdistrict.slice()
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = []
  Rule: any = [];
  filteredRule = this.Rule.slice()
  SpamAction: any = [];
  filteredSpamAction = this.SpamAction.slice()
  requestObj: any;
  reset: boolean = false;
  editObj: any;
  securityproduct: any;
  Channel: any;
  ChannelSource: any;
  todayDate: Date = new Date();
  maxDate = new Date();
  @Input() ruleType: any
  @Input() contentType: any
  @Input() typevisible: any
  IsDateGreater: boolean = false;
  labelName: any;
  userConfig: any;
  channelvalue: any;
  agentblockdata: any;
  agentanalyzerdata: any;
  tabValue: any;
  tabKey: any;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<DialogComponent>,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.subscription.push(this.common.securityView$.subscribe(res => {
      if (res != false) {
        this.securityproduct = res.securityproduct
      }
    }))
    if (this.Id == null) {
      this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'SecurityAndCompliance');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    if (this.moduleName == 'BlockLocation') {
      this.formBlocklocation = this.formBuilder.group({
        region: ['', [Validators.required]],
        state: ['', [Validators.required]]
      });
      this.statefunc()
      if (this.Id !== null) {
        this.loader = true
        var Obj = {
          data: {
            spname: "usp_unfyd_block_location",
            parameters: {
              flag: "EDIT",
              Id: this.Id,
            }
          }
        };
        this.api.post('index', Obj).subscribe(res => {
          this.reset = true;
          if (res.code == 200) {
            this.loader = false
            this.editObj = res.results.data[0];
            this.districtfunc(this.editObj.State)
            this.formBlocklocation.patchValue({
              region: Number(this.editObj.Region),
              state: Number(this.editObj.State),
            })
            this.formBlocklocation.updateValueAndValidity();
          }
        });
      } else {
        this.loader = false;
      }
    }
    if (this.moduleName == 'BlockIPAdd') {
      this.formBlockIPAdd = this.formBuilder.group({
        from: ['', [Validators.required, Validators.pattern(regex.ipaddress)]],
        to: ['', [Validators.required, Validators.pattern(regex.ipaddress)]]
      }, { validator: [checknull('from'), checknull('to')] });

      if (this.Id !== null) {
        this.loader = true
        var Obj = {
          data: {
            spname: 'usp_unfyd_block_ipAddress',
            parameters: {
              flag: "EDIT",
              Id: this.Id,
            }
          }
        };
        this.api.post('index', Obj).subscribe(res => {
          this.reset = true;
          if (res.code == 200) {
            this.loader = false
            this.editObj = res.results.data[0];
            this.districtfunc(this.editObj.Region)
            this.formBlockIPAdd.patchValue({
              from: this.editObj.FromIP,
              to: this.editObj.ToIP,
            })
            this.formBlockIPAdd.updateValueAndValidity();
          }
        });
      } else {
        this.loader = false;
      }
    }
    if (this.moduleName == 'SpamControl') {
      this.formSpamControl = this.formBuilder.group({
        Rule: ['', [Validators.required]],
        RuleName: ['', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
        Condition: ['', [Validators.nullValidator]],
        Value: ['', [Validators.nullValidator]],
        From: ['', [Validators.nullValidator]],
        To: ['', [Validators.nullValidator]],
        Action: ['', [Validators.required]],
      }, { validator: [checknull('RuleName'), checknull('Condition'), checknull('Value'), checknull('From'), checknull('To')] })

      this.common.setMasterConfig();
      this.subscription.push(
        this.common.getMasterConfig$.subscribe((data) => {
          if (Object.keys(data).length > 0) {
            this.Rule = JSON.parse(data.Rule),
              this.SpamAction = JSON.parse(data.SpamAction)
            this.filteredRule = this.Rule.slice();
            this.filteredSpamAction = this.SpamAction.slice()

          }
        })
      )
      if (this.Id == null && this.ruleType !== '') {
        if (this.ruleType == 'Email') this.formSpamControl.controls.Rule.patchValue(this.filteredRule[0].Key)
        else if (this.ruleType == 'Domain') this.formSpamControl.controls.Rule.patchValue(this.filteredRule[1].Key)
        else if (this.ruleType == 'IPAddress') this.formSpamControl.controls.Rule.patchValue(this.filteredRule[2].Key)
        this.onButtonSelected(this.ruleType)
      }
      if (this.Id !== null) {
        this.loader = true
        var Obj = {
          data: {
            spname: 'usp_unfyd_spam_control',
            parameters: {
              flag: "EDIT",
              Id: this.Id,
            }
          }
        };
        this.api.post('index', Obj).subscribe(res => {
          this.reset = true;
          if (res.code == 200) {
            this.loader = false
            this.editObj = res.results.data[0];
            this.formSpamControl.patchValue({
              Rule: this.editObj.RuleType,
              RuleName: this.editObj.RuleName,
              Condition: this.editObj.Condition,
              Value: this.editObj.Value,
              Action: this.editObj.Action,
              From: this.editObj.FromIP,
              To: this.editObj.ToIP,
            })
            this.formSpamControl.updateValueAndValidity();
          }
        });
      } else {
        this.loader = false;
      }
    }
    if (this.moduleName == 'BlackList') {
      const currentYear = new Date().getFullYear();
      this.maxDate = new Date(currentYear + 1, 11, 31);

      this.formBlackList = this.formBuilder.group({
        Channel: ['', [Validators.required]],
        ChannelSource: ['', [Validators.nullValidator]],
        StartDate: ['', [Validators.nullValidator]],
        EndDate: ['', [Validators.nullValidator]],
        Value: ['', [Validators.required]],
        reason: this.formBuilder.array([
          this.newreason()
        ], this.isNameDup())
      }, { validator: [checknull('Value')] });

      this.getChannel()
      if (this.Id !== null) {
        this.loader = true
        var Obj = {
          data: {
            spname: 'usp_unfyd_blacklist',
            parameters: {
              flag: "EDIT",
              Id: this.Id,
            }
          }
        };
        this.api.post('index', Obj).subscribe(res => {
          this.reset = true;
          if (res.code == 200) {
            this.loader = false
            this.editObj = res.results.data[0];
            let temp = [];
            temp = this.editObj?.Reason.split(':');
            for (let i = 1; i < temp.length; i++) {
              this.addreason();
            }
            var arrayControl = this.formBlackList.get('reason') as FormArray;
            arrayControl.controls.forEach((element, index) => {
              (arrayControl.at(index) as FormGroup).get('reason').patchValue(temp[index]);
            });
            this.getChannelSource(this.editObj.Channel)
            if (this.editObj.StartDate !== '1900-01-01T00:00:00.000Z') this.formBlackList.controls.StartDate.patchValue(moment(this.editObj.StartDate));
            if (this.editObj.EndDate !== '1900-01-01T00:00:00.000Z') this.formBlackList.controls.EndDate.patchValue(moment(this.editObj.EndDate));
            this.formBlackList.controls.Channel.patchValue(Number(this.editObj.Channel))
            this.formBlackList.controls.ChannelSource.patchValue(this.editObj.ChannelSource)
            this.formBlackList.controls.Value.patchValue(this.editObj.ChannelValue)
            this.todayDate = new Date(this.editObj.StartDate);
            this.formBlackList.updateValueAndValidity();

          }
        });
      } else {
        this.loader = false;
      }
    }
    if (this.moduleName == 'agentBlockContent' || this.moduleName == 'ContentAnalyser' || this.moduleName == 'BlockContent') {
      this.formBlockContent = this.formBuilder.group({
        blockcontent: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
        // desc: ['', [Validators.nullValidator, Validators.minLength(3), Validators.maxLength(500)]],
        type: ['', [Validators.required]]
      }, { validator: [checknull('blockcontent'), checknull1('blockcontent')] });
      if (this.Id == null && this.contentType !== '') {
        if (this.contentType == 'Block Content') this.formBlockContent.controls.type.patchValue('Block Content')
        else if (this.contentType == 'Customer Content Analyzer') this.formBlockContent.controls.type.patchValue('Customer Content Analyzer')
      }
      this.getblockcontent()
      this.getCustomerAnalyser()
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.formBlocklocation.controls;
  }
  get fia(): { [key: string]: AbstractControl } {
    return this.formBlockIPAdd.controls;
  }
  get fbl(): { [key: string]: AbstractControl } {
    return this.formBlackList.controls
  }
  get fSC(): { [key: string]: AbstractControl } {
    return this.formSpamControl.controls
  }
  get fBC(): { [key: string]: AbstractControl } {
    return this.formBlockContent.controls;
  }
  resetblockcontent() {
    this.formBlockContent.reset
    setTimeout(() => {
      if (this.Id == null && this.contentType !== '') {
        if (this.contentType == 'Block Content') this.formBlockContent.controls.type.patchValue('Block Content')
        else if (this.contentType == 'Customer Content Analyzer') this.formBlockContent.controls.type.patchValue('Customer Content Analyzer')
      }
    })

  }
  back(){
    this.close.emit(true);
  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data => {
      this.loader = false
      this.labelName = data
    }));
    console.log(this.labelName);

    this.common.setLabelConfig(this.userDetails.Processid, 'SecurityAndCompliance', data)
  }
  removeBlockContent(event) {
    let val = event.Content
    var contentid = event.Actionable
    if (this.contentType == '') { }
    if (this.contentType == '') { }
    this.loader = true;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_block_content',
        parameters: {
          flag: 'DELETE_BlockContent',
          Id: contentid,
          deletedby: this.userDetails?.Id,
          PUBLICIP: this.userDetails.ip,
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        this.common.snackbar("Delete Record");
        this.getCustomerAnalyser()
        this.getblockcontent()
        // this.common.reloadDataMethod(true)
        // this.getContacts();
      }
    });
  }
  removecontentAnalyser(event) {
    let val = event.Content
    var contentid = event.Actionable
    if (this.contentType == '') { }
    if (this.contentType == '') { }
    this.loader = true;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_block_content',
        parameters: {
          flag: 'DELETE_ContentAnalyser',
          Id: contentid,
          deletedby: this.userDetails?.Id,
          PUBLICIP: this.userDetails.ip,
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        this.common.snackbar("Delete Record");
        this.getCustomerAnalyser()
      }
    });
  }
  getblockcontent() {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_block_content',
        parameters: {
          flag: 'GET_AgentBlockContent',
          processid: this.userDetails.Processid,
          productid: this.securityproduct,
          IsBlockContent: 1,
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.agentblockdata = res.results.data
        this.tabValue = res.results.data;
      }
    })
  }
  getCustomerAnalyser() {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_block_content',
        parameters: {
          flag: 'GET_ContentAnalyser',
          processid: this.userDetails.Processid,
          productid: this.securityproduct,
          IsContentAnalyser: 1
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.agentanalyzerdata = res.results.data
        this.tabValue = res.results.data;
      }
    })

  }
  spamReset() {
    this.formSpamControl.reset()
    setTimeout(() => {
      if (this.ruleType == 'Email') this.formSpamControl.controls.Rule.patchValue(this.filteredRule[0].Key)
      else if (this.ruleType == 'Domain') this.formSpamControl.controls.Rule.patchValue(this.filteredRule[1].Key)
      else if (this.ruleType == 'IPAddress') this.formSpamControl.controls.Rule.patchValue(this.filteredRule[2].Key)
    })
  }
  // blockcontentType(): boolean {
  //   let a = false;
  //   if (!this.formBlockContent.value.type) a = true
  //   return a;
  // }
  blackListReset() {
    this.formBlackList.reset();
    setTimeout(() => {
      var arrayControl = this.formBlackList.get("reason") as FormArray
      let length = arrayControl.length;
      for (let i = length; i > 0; i--) {
        this.removereason(i);
      }
      this.formBlackList.updateValueAndValidity()
    });
  }
  onButtonSelected(e) {
    var tempSelection = e.value === undefined ? e : e.value

    if (tempSelection == 'Email' || tempSelection == 'Domain') {
      this.formSpamControl.get('Condition')!.setValidators(Validators.required);
      this.formSpamControl.get('Value')!.setValidators(Validators.required);
      this.formSpamControl.get('From').removeValidators
      this.formSpamControl.get('To').removeValidators
    }
    else if (tempSelection == 'IPAddress') {
      let ipaddress = '^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$'
      // this.formSpamControl.get('From')?.setValidators(Validators.pattern(regex.ipaddress));
      this.formSpamControl.controls['From'].setValidators([Validators.required, Validators.pattern(ipaddress)]);
      this.formSpamControl.controls['To'].setValidators([Validators.required, Validators.pattern(ipaddress)]);
      this.formSpamControl.get('Condition').removeValidators
      this.formSpamControl.get('Value').removeValidators
    }
    this.formSpamControl.updateValueAndValidity()
  }

  newreason(): FormGroup {
    return this.formBuilder.group({
      reason: new FormControl('', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter), noSpaceValidator.cannotContainSpace]),
    });
  }
  reason(): FormArray {
    return this.formBlackList.get("reason") as FormArray
  }
  addreason() {
    this.reason().push(this.newreason())
  }
  removereason(i: number) {
    this.reason().removeAt(i);
    this.formBlackList.updateValueAndValidity();
  }

  isNameDup() {

    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value);
      const names = totalSelected.map(value => value.reason)
      const hasDuplicate = names.some(
        (name, index) => names.indexOf(name, index + 1) != -1
      );
      return hasDuplicate ? { duplicate: true } : null;
    }
    return validator;
  }

  closeDialog(status: any): void {
    this.dialogRef.close(status);

  }

  statefunc() {
    let state = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "STATES",
          countryid: 1
        }
      }
    }
    this.api.post('index', state).subscribe((res: any) => {
      if (res.code == 200) {
        this.filteredStates = res.results.data
        this.searchStates = this.filteredStates.slice();
        this.count++;
      }
    })
  }
  districtfunc(StateID: any) {
    let district = {
      data: {
        spname: "usp_unfyd_locations",
        parameters: {
          flag: "DISTRICT",
          stateid: StateID
        }
      }
    }
    this.api.post('index', district).subscribe((res: any) => {
      if (res.code == 200) {
        this.filtereddistrict = res.results.data
        this.searchdistrict = this.filtereddistrict.slice();
        this.count++;
        this.loader = false;
      }
    })
  }
  getChannel() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid,
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.Channel = res.results.data;
      }
    });
  }
  channelValue(requestObj) {
    this.channelvalue = this.Channel.filter(p => p.ChannelId == requestObj)[0].ChannelName;
  }
  getChannelSource(ChannelId) {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          processid: this.userDetails.Processid,
          channelid: ChannelId
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.ChannelSource = res.results.data;
        this.loader = false;
      } else this.loader = false;
    });
  }
  submitBlockLocation(event, formDirective: FormGroupDirective): void {
    this.loader = true
    if (this.formBlocklocation.invalid) {
      this.formBlocklocation.markAllAsTouched()
      this.loader = false
      for (const key of Object.keys(this.formBlocklocation.controls)) {
        if (this.formBlocklocation.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    this.requestObj = {
      data: {
        spname: "usp_unfyd_block_location",
        parameters: {
          flag: this.Id == null ? 'INSERT' : 'UPDATE',
          ID: this.Id == null ? undefined : this.Id,
          Region: this.formBlocklocation.value.region,
          State: this.formBlocklocation.value.state,
          processid: this.userDetails.Processid,
          productId: this.securityproduct,
          createdby: this.Id == null ? this.userDetails.Id : undefined,
          Modifiedby: this.Id == null ? undefined : this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }
    }
    console.log(this.requestObj);
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == 'Data added successfully') {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.close.emit(true);
          } else if (event == 'saveAndAddNew') {
            this.common.refreshMenu(true);
            this.formBlocklocation.reset()
            formDirective.resetForm()
          }
        } else if ((res.results.data[0].result == 'Data already exists') && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        } else if (res.results.data[0].result == 'Data updated successfully') {
          this.common.snackbar('Update Success');
          this.close.emit(true);
          //  this.dialogRef.close(true);
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_block_location",
                    parameters: {
                      flag: 'ACTIVATE',
                      Region: this.formBlocklocation.value.region,
                      State: this.formBlocklocation.value.state,
                      processid: this.userDetails.Processid,
                      productId: this.securityproduct,
                      modifiedby: this.userDetails.Id,
                      publicip: this.userDetails.ip,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    if (event == 'add') {
                      this.close.emit(true);
                    } else if (event == 'saveAndAddNew') {
                      this.common.refreshMenu(true);
                      this.formBlocklocation.reset()
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
    })
  }
  submitIPAddress(event, formDirective1: FormGroupDirective): void {
    this.loader = true
    if (this.formBlockIPAdd.invalid) {
      this.formBlockIPAdd.markAllAsTouched()
      this.loader = false
      for (const key of Object.keys(this.formBlockIPAdd.controls)) {
        if (this.formBlockIPAdd.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_block_ipAddress',
        parameters: {
          flag: this.Id == null ? 'INSERT' : 'UPDATE',
          ID: this.Id == null ? undefined : this.Id,
          FromIP: this.formBlockIPAdd.value.from == null ? null : this.formBlockIPAdd.value.from.trim(),
          ToIP: this.formBlockIPAdd.value.to == null ? null : this.formBlockIPAdd.value.to.trim(),
          processid: this.userDetails.Processid,
          productId: this.securityproduct,
          createdby: this.Id == null ? this.userDetails.Id : undefined,
          Modifiedby: this.Id == null ? undefined : this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }
    }
    console.log(this.requestObj);
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == 'Data added successfully') {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.close.emit(true);
          } else if (event == 'saveAndAddNew') {
            this.common.refreshMenu(true);
            this.formBlockIPAdd.reset()
            formDirective1.resetForm()
          }

        } else if ((res.results.data[0].result == 'Data already exists') && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        } else if (res.results.data[0].result == 'Data updated successfully') {
          this.common.snackbar('Update Success');
          this.close.emit(true);
          // this.dialogRef.close(true);
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.requestObj = {
                  data: {
                    spname: 'usp_unfyd_block_ipAddress',
                    parameters: {
                      flag: 'ACTIVATE',
                      FromIP: this.formBlockIPAdd.value.from == null ? null : this.formBlockIPAdd.value.from.trim(),
                      ToIP: this.formBlockIPAdd.value.to == null ? null : this.formBlockIPAdd.value.to.trim(),
                      productId: this.securityproduct,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                      publicip: this.userDetails.ip,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    if (event == 'add') {
                      this.close.emit(true);
                    } else if (event == 'saveAndAddNew') {
                      this.common.refreshMenu(true);
                      this.formBlockIPAdd.reset()
                      formDirective1.resetForm()
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
    })
  }
  submitSpam(event, formDirective2: FormGroupDirective): void {
    this.loader = true
    if (this.formSpamControl.invalid) {
      this.formSpamControl.markAllAsTouched()
      this.loader = false
      for (const key of Object.keys(this.formSpamControl.controls)) {
        if (this.formSpamControl.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_spam_control',
        parameters: {
          flag: this.Id == null ? 'INSERT' : 'UPDATE',
          ID: this.Id == null ? undefined : this.Id,
          RuleType: this.formSpamControl.value.Rule,
          RuleName: this.formSpamControl.value.RuleName == null ? null : this.formSpamControl.value.RuleName.trim(),
          Condition: this.formSpamControl.value.Condition == null ? null : this.formSpamControl.value.Condition.trim(),
          Value: this.formSpamControl.value.Value == null ? null : this.formSpamControl.value.Value.trim(),
          Action: this.formSpamControl.value.Action,
          FromIP: this.formSpamControl.value.From == null ? null : this.formSpamControl.value.From.trim(),
          ToIP: this.formSpamControl.value.To == null ? null : this.formSpamControl.value.To.trim(),
          processid: this.userDetails.Processid,
          productId: this.securityproduct,
          createdby: this.Id == null ? this.userDetails.Id : undefined,
          Modifiedby: this.Id == null ? undefined : this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }
    }
    console.log(this.requestObj);
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == 'Data added successfully') {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.close.emit(true);
          } else if (event == 'saveAndAddNew') {
            this.common.refreshMenu(true);
            this.spamReset()
            formDirective2.resetForm()
          }

        } else if ((res.results.data[0].result == 'Data already exists') && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        } else if (res.results.data[0].result == 'Data updated successfully') {
          this.common.snackbar('Update Success');
          this.close.emit(true);
          // this.dialogRef.close(true);
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.requestObj = {
                  data: {
                    spname: 'usp_unfyd_spam_control',
                    parameters: {
                      flag: 'ACTIVATE',
                      RuleType: this.formSpamControl.value.Rule,
                      RuleName: this.formSpamControl.value.RuleName == null ? null : this.formSpamControl.value.RuleName.trim(),
                      productId: this.securityproduct,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                      publicip: this.userDetails.ip,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    if (event == 'add') {
                      this.close.emit(true);
                    } else if (event == 'saveAndAddNew') {
                      this.common.refreshMenu(true);
                      this.spamReset()
                      formDirective2.resetForm()
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
    })
  }
  submitBlackList(event, formDirective3: FormGroupDirective): void {
    this.loader = true
    if (this.formBlackList.invalid) {
      this.formBlackList.markAllAsTouched()
      this.loader = false
      for (const key of Object.keys(this.formBlackList.controls)) {
        if (this.formBlackList.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    let starts = new Date(this.formBlackList.value.StartDate)
    let Ends = new Date(this.formBlackList.value.EndDate)
    // if (starts >= Ends) {
    //   this.IsDateGreater = true;
    //   this.loader = false;
    //   return
    // }
    // else {
    //   this.IsDateGreater = false;
    // }
    var temp = [];
    var arrayControl = this.formBlackList.get('reason') as FormArray
    arrayControl.controls.forEach((element, index) => {
      var reasons = (arrayControl.at(index) as FormGroup).get('reason').value;
      temp.push(reasons);
    })
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_blacklist',
        parameters: {
          flag: this.Id == null ? 'INSERT' : 'UPDATE',
          ID: this.Id == null ? undefined : this.Id,
          Channel: this.formBlackList.value.Channel,
          ChannelSource: this.formBlackList.value.ChannelSource,
          StartDate: this.formBlackList.value.StartDate,
          EndDate: this.formBlackList.value.EndDate,
          Reason: temp.join(':'),
          ChannelValue: this.formBlackList.value.Value == null ? null : this.formBlackList.value.Value.trim(),
          processid: this.userDetails.Processid,
          productId: this.securityproduct,
          createdby: this.Id == null ? this.userDetails.Id : undefined,
          Modifiedby: this.Id == null ? undefined : this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }
    }
    console.log(this.requestObj);
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == 'Data added successfully') {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.close.emit(true);
          } else if (event == 'saveAndAddNew') {
            this.common.refreshMenu(true);
            this.blackListReset()
            formDirective3.resetForm()
          }

        } else if ((res.results.data[0].result == 'Data already exists') && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        } else if (res.results.data[0].result == 'Data updated successfully') {
          this.common.snackbar('Update Success');
          this.close.emit(true);
          // this.dialogRef.close(true);
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.requestObj = {
                  data: {
                    spname: 'usp_unfyd_blacklist',
                    parameters: {
                      flag: 'ACTIVATE',
                      Channel: this.formBlackList.value.Channel,
                      ChannelValue: this.formBlackList.value.Value == null ? null : this.formBlackList.value.Value.trim(),
                      productId: this.securityproduct,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                      publicip: this.userDetails.ip,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    if (event == 'add') {
                      this.close.emit(true);
                    } else if (event == 'saveAndAddNew') {
                      this.common.refreshMenu(true);
                      this.blackListReset()
                      formDirective3.resetForm()
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
    })
  }
  submit(event, formDirective4: FormGroupDirective) {

    if (this.formBlockContent.value.type == 'Both') {
      var IsContentAnalyser = 1
      var IsBlockContent = 1
    } else if (this.formBlockContent.value.type == 'Customer Content Analyzer') {
      IsContentAnalyser = 1
      IsBlockContent = 0
    }
    if (this.formBlockContent.value.type == 'Block Content') {
      IsContentAnalyser = 0
      IsBlockContent = 1
    }

    if (this.formBlockContent.get('blockcontent').hasError('incorrectEmail')) {
      return;
    }
    if (this.formBlockContent.get('blockcontent').hasError('sameEmail')) {
      return;
    }
    if (this.formBlockContent.invalid ) {
      this.formBlockContent.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.formBlockContent.controls)) {
        if (this.formBlockContent.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    this.requestObj = {
      data: {
        spname: "usp_unfyd_block_content",
        parameters: {
          flag: this.Id == null ? 'INSERT' : 'UPDATE',
          ID: this.Id == null ? undefined : this.Id,
          AbusiveWord: this.formBlockContent.value.blockcontent == null ? null : this.formBlockContent.value.blockcontent.trim(),
          // Description: encode(this.formBlockContent.value.desc == null ? null : this.formBlockContent.value.desc.trim()),
          // CONTENTTYPE: this.formBlockContent.value.type,
          IsBlockContent: IsBlockContent,
          IsContentAnalyser: IsContentAnalyser,
          publicip: this.userDetails.ip,
          privateip: this.userDetails.privateip,
          productId: this.securityproduct,
          createdby: this.Id == null ? this.userDetails.Id : undefined,
          Modifiedby: this.Id == null ? undefined : this.userDetails.Id,
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
          processid: this.userDetails.Processid,
        }
      }
    }

    this.common.hubControlEvent('block-content', 'click', '', '', JSON.stringify(this.requestObj), 'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == "Data added successfully") {
          this.getblockcontent()
          this.getCustomerAnalyser()
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.close.emit(true);
          } else if (event == 'saveAndAddNew') {
            this.resetblockcontent()
            formDirective4.resetForm()

          }
        } else if (res.results.data[0].result == "Data already exists" && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }
        else if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');
          this.close.emit(true);
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_block_content",
                    parameters: {
                      flag: 'ACTIVATE',
                      AbusiveWord: this.formBlockContent.value.blockcontent == null ? null : this.formBlockContent.value.blockcontent.trim(),
                      processid: this.userDetails.Processid,
                      productId: this.securityproduct,
                      MODIFIEDBY: this.userDetails.Id,
                      publicip: this.userDetails.ip,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.getblockcontent()
                    this.getCustomerAnalyser()
                    if (event == 'add') {
                      this.close.emit(true);
                      this.common.snackbar('Record add');
                    } if (event == 'saveAndAddNew') {
                      this.common.snackbar('Record add');
                      this.resetblockcontent()
                      formDirective4.resetForm()

                    }
                  }
                });


              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))



        }

      }

    });


  }
}
