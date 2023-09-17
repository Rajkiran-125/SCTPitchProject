import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { AuthService } from 'src/app/global/auth.service';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';
import { DatePipe } from '@angular/common';
// import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { checknull, checknull1, regex } from 'src/app/global/json-data';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FlushingComponent } from './flushing/flushing.component';
@Component({
  selector: 'app-business-orchestration',
  templateUrl: './business-orchestration.component.html',
  styleUrls: ['./business-orchestration.component.scss']
})
export class BusinessOrchestrationComponent implements OnInit {

  form: FormGroup;
  to_whom: boolean[] = [];
  subscription: Subscription[] = [];
  loader: boolean = false;
  subscriptionAcitivateData: Subscription[] = []
  group_name: boolean[] = [];
  responseArray: any[] = [];
  condition: any[] = ['And', 'Or'];
  // action: any[] = ['Route To', 'End Session'];
  // offline_list: any[] = ['End Session', 'Route To', 'Create Task', 'Create Missed Interaction']
  comparison_conditions: any[] = ['<', '<=', '>', '>=', '==', '===', '!=', '!=='];
  group_list: any[] = [];
  userDetails: any;
  channelType: any[] = [];
  channelSource: any[] = [];
  actionGroup: any[] = [];
  time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  patchValueObj: any;
  boId: number;
  dropdown: boolean[] = [];
  requestObj: any;
  labelName: any;
  userConfig: any;
  productid: any;
  Condition_field:any = [];
  public staticField = this.Condition_field.slice()
  whom_field:any = [];
  public whom_list = this.whom_field.slice()
  Action_field:any = [];
  offline_list = this.Action_field.slice();
  @ViewChild('flushingmodule') flushingmodule: FlushingComponent; // Get a reference to the child component

  constructor(
    private router: Router,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private el: ElementRef,
    private api: ApiService,
    public common: CommonService
  ) { }
  ngOnInit(): void {
    this.productid = this.activatedRoute.snapshot.paramMap.get('productid')
    this.userDetails = this.auth.getUser();
    this.getChannel();
    this.getProduct();
    this.patchValue();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.common.setUserConfig(this.userDetails.ProfileType, 'BusinessOrchestration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.Condition_field = JSON.parse(data.Condition_Field),
          this.staticField = this.Condition_field.slice();
          this.whom_field = JSON.parse(data.Whom_list),
          this.whom_list = this.whom_field.slice();
          this.Action_field = JSON.parse(data.Action_field),
          this.offline_list = this.Action_field.slice();
        }
      })
    )

  };
  Reset() {
    this.form.reset()
    setTimeout(() => {
      this.form.controls.appname.patchValue(Number(this.productid))
    });
    this.flushingmodule.reset()

  }
  resetBO(i){
    this.form.get('routing_condition')['at'](i).get('flushing')
  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'BusinessOrchestration', data)

  }
  back() {
    let a = {}
    Object.assign(a, { productId: this.productid })
    this.common.selectedApprovalDetails.next(a)
    this.router.navigate(['masters/business-orchestration']);
  }
  product: any[] = []
  getProduct() {
    let query = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "USER_MAPPED_PRODUCTS",
          processid: this.userDetails.Processid,
          userid: this.userDetails.Id,
          roletypeid: this.userDetails.ProfileType,
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      this.product = res.results['data'];
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  getChannel() {
    let query = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      this.channelType = res.results['data'];
    });
  }
  getChannelSource(id) {
    var query = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          channelid: id,
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      this.channelSource = res.results['data'];
    })
  }
  getDisposition(type, parentIndex) {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_data_collection_form',
        parameters: {
          flag: 'GET_DISPOSITION',
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      // this.Disposition = res.results['data'];
      var data = res.results['data']
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.Disposition, value: element.Disposition })
        });
        this.actionGroup[parentIndex] = tempActionGroup
      }
    })

  }
  getCustom( parentIndex) {
    this.requestObj = {
      data: {
        spname: "UNFYD_CONFIG_MANAGER",
        parameters: {
          flag: "GET_CUSTOMERATTRIBUTE_MAPPING",
          processid: this.userDetails.Processid,
          LANGUAGECODE: 'en',
          CHANNELID: this.form.value.channel
        }
      }
    }
    console.log(this.requestObj);

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      var data = res.results['data']
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.ConfigValue, value: element.ConfigName })
        });
        this.actionGroup[parentIndex] = tempActionGroup
      }
    })

  }
  getSkills(parentIndex) {
    var query = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "SKILL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      var data: any[] = res.results['data'];
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.SkillName, value: element.Id })
        });
        this.actionGroup[parentIndex] = tempActionGroup
      }
      console.log(this.actionGroup);

    })
  }
  getSupervisor(parentIndex) {
    var query = {
      data: {
        spname: "agentrouting",
        parameters: {
          ACTIONFLAG: "GET_SUPERVISOR_NAME",
          ProcessId: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      var data: any[] = res.results['data'];
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.UserName, value: element.id })
        });
        this.actionGroup[parentIndex] = tempActionGroup
      }
    })
  }
  getGroups(parentIndex) {
    var query = {
      data: {
        spname: "getdropdowndetails",
        parameters: {
          flag: "GROUP",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      var data = res.results['data'];
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.GroupName, value: element.GroupID })
        });
        this.actionGroup[parentIndex] = tempActionGroup
      }
    })
  }
  getCacheData(parentIndex) {
    let query = {
      data: {
        spname: "usp_unfyd_adminconfig",
        cachename: "cacheconfig",
        cache: true,
        parameters: {
          flag: "GET_API",
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
        },
      },
    };
    this.api.post('cachedata', query).subscribe(res => {
      var cacheArray = res.results.data[0];
      cacheArray.forEach(element => {
        if (element.ConfigName == "NotificationPriority") {
          var data = JSON.parse(element.ConfigValue)
          var tempActionGroup: any[] = [];
          if (data.length > 0) {
            data.forEach(obj => {
              tempActionGroup.push({ label: obj.Key, value: obj.Value })
            });
            this.actionGroup[parentIndex] = tempActionGroup
          }
        }
      });
    });
  }

  createForm(element?) {

    this.form = this.fb.group({
      appname: [element ? element.appname : Number(this.productid), [Validators.required]],
      name: [element ? element.name : '', [Validators.required,Validators.pattern(regex.alphanumericwithspecialcharacter),Validators.maxLength(100)]],
      priority: [element ? element.priority : '', Validators.nullValidator],
      description: [element ? element.description : '', [Validators.nullValidator,Validators.pattern(regex.alphanumericwithspecialcharacter), Validators.maxLength(100)]],
      channel: [element ? element.channel : '', Validators.required],
      source: [element ? element.source : '', Validators.nullValidator],
      blacklist: this.fb.group({
        isTrue: [element ? element.Blacklist.isTrue : false],
        // isTrue: [false],
        ...this.messageObj(element ? element.Blacklist : {})
      }),
      customer_profile: this.fb.group({
        isTrue: [element ? element.CustomerProfile.isTrue : false],
        // isTrue: [false],
        ...this.apiCheckerObj(element ? element.CustomerProfile : ''),
        token_generation_isTrue: [element ? element.CustomerProfile.token_generation_isTrue : false],
        token_generation: this.fb.group(this.apiCheckerObj(element ? element.CustomerProfile.token_generation : ''))
      }),
      nlp: this.fb.group({
        isTrue: [element ? element.Nlp.isTrue : false],
        // isTrue: [false],
        ...this.apiCheckerObj(element ? element.Nlp : ''),
        token_generation_isTrue: [element ? element.Nlp.token_generation_isTrue : false],
        token_generation: this.fb.group(this.apiCheckerObj(element ? element.Nlp.token_generation : ''))
      }),
      holiday_business_hour: this.fb.group({
        isTrue: [element ? element.HolidayBusinessHour.isTrue : false],
        // isTrue: [false],
        action: this.fb.array(element ? [] : [this.createAction()])
      }),
      routing_condition: this.fb.array([]),
    }, { validator: [checknull('name'), checknull1('description')] })
  }

  messageObj(element?) {
    return {
      media_status: [element ? element.media_status : false],
      media_url: [element ? element.media_url : ''],
      message: [element ? element.message : '', Validators.nullValidator],
    }
  }

  apiCheckerObj(element?) {
    return {
      api: [element ? element.api : '', Validators.nullValidator],
      method: [element ? element.method : '', Validators.nullValidator],
      body: [element ? element.body : '', Validators.nullValidator],
      header: this.fb.array(element ? [] : [this.createHeader()]),
      params: this.fb.array(element ? [] : [this.createHeader()]),
      auth: this.fb.group({
        type: [element ? element.auth?.type : '', Validators.nullValidator],
        key: [element ? element.auth?.key : '', Validators.nullValidator],
        value: [element ? element.auth?.value : '', Validators.nullValidator],
        add_to: [element ? element.auth?.add_to : '', Validators.nullValidator],
        token: [element ? element.auth?.token : '', Validators.nullValidator],
      }),
      response_format: [element ? element.response_format : '', Validators.nullValidator],
      response: this.fb.array(element ? [] : [this.createResponse()])
    }
  }

  createHeader(element?): FormGroup {
    return this.fb.group({
      key: [element ? element.key : '', Validators.nullValidator],
      value: [element ? element.value : '', Validators.nullValidator]
    },{validator:[checknull('key'),checknull('value')]});
  }

  createResponse(element?): FormGroup {
    return this.fb.group({
      field: [element ? element.field : '', Validators.nullValidator],
      response: [element ? element.response : '', Validators.nullValidator]
    });
  }

  get chbh() { return this.form.get('holiday_business_hour').get('action') as FormArray; }

  createAction(element?): FormGroup {
    return this.fb.group({
      offline_action: element ? element.offline_action : '',
      ...this.apiCheckerObj(element),
      ...this.messageObj(element),
      action: element ? element.action : '',
      whom: element ? element.whom : '',
      group: element ? element.group : '',
    });
  }

  get crc() { return this.form.get('routing_condition') as FormArray; }

  createRoutingCondition(element?): FormGroup {
    return this.fb.group({
      name: element ? element.name : '',
      condition: this.fb.array(element ? [] : [this.createCondition()]),
      action: this.fb.array(element ? [] : [this.createAction()]),
      flushing: this.fb.group({
        isTrue: element ? element.flushing.isTrue : false,
        time: element ? element.flushing.time : '',
      }),
    });
  }

  conditionObj(i, type): FormArray {
    return this.form.get('routing_condition')['at'](i).get(type) as FormArray
  }

  createCondition(element?): FormGroup {
    return this.fb.group({
      field: element ? element.field : '',
      condition: element ? element.condition : '',
      custom: element ? element.custom : '',
      value: element ? element.value : '',
      additional_condition: element ? element.additional_condition : ''
    })
  }

  add(type) {
    if (type == 'holiday_business_hour_action') {
      this.chbh.push(this.createAction());
    } else if (type == 'routing_condition') {
      this.crc.push(this.createRoutingCondition());
    }
  }

  remove(i, type) {
    if (type == 'holiday_business_hour_action') {
      this.chbh.removeAt(i);
    } else if (type == 'routing_condition') {
      // console.log(this.patchValueObj?.RoutingCondition[i]?.action);
      // console.log(this.patchValueObj?.RoutingCondition[i].condition);
      // console.log(this.patchValueObj?.RoutingCondition[i].flushing);
      let a = this.patchValueObj?.RoutingCondition[i]?.action.length
      let b = this.patchValueObj?.RoutingCondition[i].condition.length
      let d = this.form.get('routing_condition') as FormArray;
      d.removeAt(i)
        d.updateValueAndValidity()
      // this.patchValueObj?.RoutingCondition[i].action.patchValue([])
      // this.form.get('routing_condition')['at'](i).get('action')['controls'].value.patchValue([])
      // this.form.get('routing_condition')['at'](i).get('flushing')['controls'].value.patchValue([])
      //  this.form.controls['routing_condition'].patchValue([])
    // this.form.get('routing_condition')['at'](i)['controls'].value.patchValue('')
    // this.crc.removeAt(i);
    }
  }

  addCondition(i, type, element?) {
    this.conditionObj(i, type).push(type == 'condition' ? this.createCondition(element) : type == 'action' ? this.createAction(element) : this.fb.group({}));
  }

  addCondition1(e, element?) {
    this.addCondition(e.index, e.type, element)
  }

  removeCondition(i, j, type) {
    this.conditionObj(i, type).removeAt(j);
  }

  removeCondition1(e) {
    this.removeCondition(e.parent, e.child, e.type)
  }

  changeEvent(event, index) {
    if (event !== '') {
      this.actionGroup[index] = [];
      this.group_name[index] = event !== '' ? true : false;
      if (event == this.whom_list[0].Key) {
        this.getGroups(index);
      } else if (event == this.whom_list[1].Key) {
        this.getSupervisor(index);
      } else if (event == this.whom_list[2].Key) {
        this.getSkills(index);
      }
    }
  }

  fieldChange(event, parentIndex) {
    var dropdownCondition = event === this.staticField[0].Key || event === this.staticField[1].Key || event === this.staticField[2].Key || event === this.staticField[3].Key
    this.dropdown[parentIndex] = dropdownCondition ? true : false;
    if (event == this.staticField[0].Key) {
      this.getCacheData(parentIndex);
    } else if (event == this.staticField[1].Key) {
      this.getSkills(parentIndex);
    } else if (event == this.staticField[2].Key) {
      this.getCustom(parentIndex);
    }else if (event == this.staticField[3].Key) {
      this.getDisposition(this.staticField[3], parentIndex);
    }
  }

  submit(event, formDirective: FormGroupDirective): void {

    if (this.form.invalid ) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    this.form.markAllAsTouched();
    if (this.form.valid) {
      let customObj = this.boId == undefined ? {
        processid: this.userDetails.Processid,
      } : {
        Id: this.boId
      }
      var formValue = this.form.value
      var query = {
        data: {
          spname: "USP_UNFYD_BUSINESSORCHESTRATION",
          parameters: {
            flag: this.boId == undefined ? "INSERT" : "UPDATE",
            ProductId: this.form.value.appname,
            RuleName: this.form.value.name,
            Priority: this.form.value.priority,
            Channel: this.form.value.channel,
            ChannelSource: this.form.value.source,
            Description: this.form.value.description,
            RULEDETAILS: JSON.stringify(formValue.ruledetails),
            BLACKLIST: JSON.stringify(formValue.blacklist),
            CUSTOMERPROFILE: JSON.stringify(formValue.customer_profile),
            NLP: JSON.stringify(formValue.nlp),
            HOLIDAYBUSINESSHOUR: JSON.stringify(formValue.holiday_business_hour),
            ROUTINGCONDITION: JSON.stringify(formValue.routing_condition),
            ...customObj,
            UserId: this.userDetails.Id
          }
        }
      }
      this.api.post('index', query).subscribe((res: any) => {
        if (res.code == 200) {
          // this.loader = false;
          if (res.results.data[0].result == 'Data added successfully') {
            this.common.snackbar('Record add');
            if (event == 'add') {
              this.back()
            } else if (event == 'saveAndAddNew') {
              this.common.refreshMenu(true);
              this.Reset()
              formDirective.resetForm()
            }
          } else if ((res.results.data[0].result == 'Data already exists') && (res.results.data[0].Status == false)) {
            this.common.snackbar('Data Already Exist');
          } else if (res.results.data[0].result == 'Data updated successfully') {
            this.common.snackbar('Update Success');
            this.back()
          }
          else if (res.results.data[0].Status == true) {
            this.common.confirmationToMakeDefault('AcitvateDeletedData');
            this.subscriptionAcitivateData.push(
              this.common.getIndividualUpload$.subscribe(status => {
                if (status.status) {
                  this.requestObj = {
                    data: {
                      spname: "USP_UNFYD_BUSINESSORCHESTRATION",
                      parameters: {
                        flag: 'ACTIVATE',
                        ProductId: this.form.value.appname,
                        RuleName: this.form.value.name,
                        processid: this.userDetails.Processid,
                        modifiedby: this.userDetails.Id,
                      }
                    }
                  };
                  this.api.post('index', this.requestObj).subscribe((res: any) => {
                    if (res.code == 200) {
                      this.common.snackbar('Record add');
                      if (event == 'add') {
                        this.back()
                      } else if (event == 'saveAndAddNew') {
                        this.common.refreshMenu(true);
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
      })
    }
  }

  // timeChanged(i){
  //   if(this.time !== null){
  //     var timeControl = this.form.get('routing_condition')  as FormArray;
  //     timeControl.at(i).get('flushing').get('time').patchValue(this.time?.hour+':'+this.time?.minute+':'+this.time?.second)
  //   }
  // }

  patchValue() {
    this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        var query = {
          data: {
            spname: "USP_UNFYD_BUSINESSORCHESTRATION",
            parameters: {
              flag: "GETBYID",
              Id: params.id
            }
          }
        }
        this.api.post('index', query).subscribe(res => {
          if (res.code == 200) {
            var data = res.results.data[0];
            this.getChannelSource(data.Channel);
            this.patchValueObj = {
              channel: Number(data.Channel),
              appname: Number(data.ProductId),
              name: data.RuleName,
              priority: data.Priority,
              description: data.Description,
              source: data.ChannelSource,
              Blacklist: JSON.parse(data.Blacklist !== null ? data.Blacklist : {}),
              CustomerProfile: JSON.parse(data.CustomerProfile !== null ? data.CustomerProfile : {}),
              HolidayBusinessHour: JSON.parse(data.HolidayBusinessHour !== null ? data.HolidayBusinessHour : {}),
              Nlp: JSON.parse(data.Nlp !== null ? data.Nlp : {}),
              RoutingCondition: JSON.parse(data.RoutingCondition !== null ? data.RoutingCondition : {}),
            };
            // this.getChannelSource(data.Channel)
            this.boId = data.Id;
            this.createForm(this.patchValueObj);
            var holiday_business_hour_action = this.patchValueObj.HolidayBusinessHour.action;
            for (var i = 0; i < holiday_business_hour_action.length; i++) {
              this.chbh.push(this.createAction(holiday_business_hour_action[i]));
              this.changeEvent(holiday_business_hour_action[i]['whom'], i)
            }
            var routing_condition = this.patchValueObj.RoutingCondition;
            for (var i = 0; i < routing_condition.length; i++) {
              this.crc.push(this.createRoutingCondition(routing_condition[i]));
              var condition = routing_condition[i].condition;
              for (var j = 0; j < condition.length; j++) {
                this.addCondition(i, 'condition', condition[j])
                this.fieldChange(condition[j].field, i + j)
              }
              var action = routing_condition[i].action;
              for (var j = 0; j < action.length; j++) {
                this.addCondition(i, 'action', action[j])
                this.changeEvent(action[j]['whom'], i + j)
              }
            };
          }
        })
      } else {
        this.createForm()
      }
    })
  }

  formvalue(e) {
    var resArray = this.form.value.customer_profile.response;

    resArray.forEach(element => {
      if (element.response !== '' && element.field !== '') {
        this.responseArray = resArray
      }
    });

  }

  conditionvalue(e) {
    this.form.get('routing_condition')['at'](e.parent).get('condition')['controls'][e.child].patchValue(e.group);
  }

  actionvalue(e) {
    this.form.get('routing_condition')['at'](e.parent).get('action')['controls'][e.child].patchValue(e.group);
  }

  directUpload(event, max_width, max_height, form_control) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + 'media' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);
    if (size > 2000) {
      this.common.snackbar("File Size");
    }
    else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    }
    else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("FileReso");
          }
          else {
            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                form_control.patchValue(res.results.URL);
                console.log(this.form.value);
              }
            })
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }
  reduceOfflineList(i, formGroup): any[] {
    let result = formGroup.map(a => a.offline_action);
    let selectedValue: any;
    this.offline_list.forEach(element => {
      if (element.Key == formGroup[i].offline_action && formGroup[i].offline_action != undefined) {
        selectedValue = element
      }
    });
    let filteredArray = this.offline_list.filter(p => !result.includes(p.Key));
    if (selectedValue) {
      filteredArray.unshift(selectedValue);
    }
    return filteredArray;
  }

}


