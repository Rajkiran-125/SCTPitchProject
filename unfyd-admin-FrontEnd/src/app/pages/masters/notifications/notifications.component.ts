import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { orderBy } from 'lodash';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, Validators } from '@angular/forms';
import { checknull, checknull1, masters, notificationsStep, regex } from 'src/app/global/json-data';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/global/api.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { Subscription } from 'rxjs';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxChange } from '@angular/material/checkbox';
import moment from 'moment';
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {



  form: FormGroup;
  loader: boolean = true;
  @Input() productName: any;
  path: any;
  master: any = 'internal';
  userConfig: any;
  requestObj: any;
  productType: any = [];
  labelName: any;
  userDetails: any;
  tabKey: any = [];
  tabValue: any = [];
  type: any = 'Notification';
  changeModuleLabelDisplayName: string;
  notificationsStep: any;
  page: number = 1;
  currentpage: number = 1;
  reset: boolean;
  itemsPerPage: number = 10;
  paginationArray: any = [];
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  search: any;
  filter: any;
  Id: any;
  actionname: any;
  notificationTriggers: any;
  count: number = 0;
  submittedForm: boolean = false;
  noData: boolean = false;
  hasChecked: any = [];
  allSelected: boolean = false;
  maxNo: boolean = false;
  priority: any;
  category: any;
  events: any;
  systemFields: any;
  skills: any;
  groups: any;
  viewData: any;
  @Input() data: any;
  isChild: any;
  ModuleGroupping: any = [];
  From: any;
  ReplyTo: any;
  Sender: any = [];
  Channel: any;
  ChannelSource: any;
  BrowserSystemFields: boolean = false;
  BellSystemFields: boolean = false;
  MobileSystemFields: boolean = false;
  emailChannel: boolean = false;
  whatsAppChannel: boolean = false;
  template: any = [];
  TemplateData: any = [];
  templateVisible: boolean = false;
  cardTemplate: any;
  channelSourceAvailable: boolean = false;
  templateID: any;
  minMessage: any;
  time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  timee: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  format: any;
  dateformat: any;
  @Input() isDialog: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    public common: CommonService,
    public dialog: MatDialog,
    private el: ElementRef,
    private api: ApiService,
    public dialogRef: MatDialogRef<DialogComponent>,

  ) {
    Object.assign(this, { notificationsStep });
  }

  ngOnInit(): void {
    this.loader = true;
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.getMasterConfig$.subscribe(data => {
      this.notificationTriggers = JSON.parse(data.NotificationTrigger);
      this.priority = JSON.parse(data.NotificationPriority);
    }));
    this.commonForm();
    this.changeModuleLabelDisplayName = this.common.changeModuleLabelName();

    var menu = JSON.parse(localStorage.getItem('menu'))
    var parent_menu = localStorage.getItem('parent_menu')
    var isChild = menu.filter(function (item) { return (item.ModuleGroupping == parent_menu) })[0].Keys;

    this.dateformat = JSON.parse(localStorage.getItem("localizationData"));
    this.format = this.dateformat.selectedDateFormats.toUpperCase().concat(" ",this.dateformat.selectedTimeFormats)

    this.ModuleGroupping = isChild.map(function (elem) {
      return elem.Modulename
    });
    this.setLabelByLanguage(localStorage.getItem("lang"));
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }));
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }));
    this.minMessage = masters.MinLengthMessage;
    this.getSnapShots();


    this.setLabelByLanguage(localStorage.getItem("lang"));
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }));
    // this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.Id = this.activatedRoute.snapshot.paramMap.get('id');

    this.activatedRoute.queryParams.subscribe(params => {
      if(params.productID)
      {
      this.productName = Number(params.productID)
      }
      // this.productName = params.productID === undefined ? 1 : Number(params.productID);


      this.filter = params.filter;
      this.master = params.master == undefined ? 'internal' : params.master;
      if ((this.filter == 'add' || this.filter == 'edit') && this.master == 'internal') { this.internalform(); this.getCategory(); }
      if ((this.filter == 'add' || this.filter == 'edit') && this.master == 'external') { this.externalform(); this.getCategory(); }
      if (params.Id == undefined && params.filter == undefined) {
        this.getData();
      }
    });
    this.getSnapShots();
    this.common.setUserConfig(this.userDetails.ProfileType, 'Notification');
    if (this.Id !== null && (this.filter === 'view' || this.filter == 'edit')) {
      this.getDataById();
    }
  }

  getSnapShots() {
    this.feildChooser();
    this.getFilter();
    this.getProducts();
    if (this.master === 'external') { this.getChannel(); }
  }

  getTemplate(event) {
    this.TemplateData = [];
    this.template = [];
    this.templateVisible = false;
    this.cardTemplate = [];
    this.loader = true;
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_hsm_template",
        "parameters": {
          "FLAG": "GET_NOTIFICATION",
          "PROCESSID": this.userDetails.Processid,
          "CHANNELID": this.form.value.Channel,
          "UNIQUEID": event
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.TemplateData = res.results.data;
        this.loader = false;
        if (this.channelSourceAvailable) {
          this.TemplateData.forEach(element => {
            if (element.Actionable === this.templateID) {
              this.template.push({ Key: element['Actionable'], Value: element['Template Name'] })
              this.cardTemplate = element;
              this.templateVisible = true;
            }
          });
        }
      } else this.loader = false;
    });
  }

  show() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'template',
        tabValue: this.TemplateData
      },
      width: "1060px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status.status === true) {
        this.templateVisible = status.status;
        this.template = [];
        this.cardTemplate = status.data;
        this.template.push({ Key: status.data['Actionable'], Value: status.data['Template Name'] });
        this.form.get('Template').patchValue(status.data['Actionable']);
        this.form.updateValueAndValidity();
      }
    });
  }

  getDataById() {
    this.loader = true
    this.requestObj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION",
        parameters: {
          flag: 'GETBYID',
          Id: this.Id
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.reset = true;
        if (this.filter === 'view') {
          this.viewData = res.results.data[0];
        } else if (this.filter === 'edit' && this.Id !== undefined) {
          this.patchFormData(res.results.data[0]);
        } else if (this.filter === 'edit' && this.Id === undefined) {
          this.patchFormData(this.viewData);
        }
        this.loader = false;
      } else this.loader = false;
    });
  }

  getFields(event) {
    this.TemplateData = [];
    this.template = [];
    this.templateVisible = false;
    this.cardTemplate = [];
    this.form.get('ChannelSource').reset();
    this.form.get('Template').reset();
    this.form.updateValueAndValidity();
    // let channel = this.Channel.filter(obj => {
    //   if (obj.ChannelId === event) {
    //     return obj;
    //   }
    // });
    // if (channel[0].ChannelName === 'Email') {
    //   this.emailChannel = true;
    //   this.whatsAppChannel = false;
    // } else if (channel[0].ChannelName === 'WhatsApp') {
    //   this.whatsAppChannel = true;
    //   this.emailChannel = false;
    // } else {
    //   this.emailChannel = false;
    //   this.whatsAppChannel = false;
    // }
  }

  getSenderData(channel, sourceId) {
    // this.loader = true;
    // let channelData = this.Channel.filter(obj => {
    //   if (obj.ChannelId === channel) {
    //     return obj;
    //   }
    // });
    // if (channelData[0].ChannelName === 'WhatsApp') {
    //   this.requestObj = {
    //     data: {
    //       spname: "USP_UNFYD_NOTIFICATION",
    //       parameters: {
    //         flag: 'GET_CONTACT_NUMBER',
    //         CHANNELSOURCE: sourceId
    //       }
    //     }
    //   };
    //   this.api.post('index', this.requestObj).subscribe(res => {
    //     if (res.code == 200) {
    //       res.results.data.forEach(element => {
    //         this.Sender.push({ Key: element.WhatsAppNumber, Value: element.WhatsAppNumber })
    //       });
    //       this.loader = false;
    //     } else this.loader = false;
    //   });
    // } else this.loader = false;
  }

  patchFormData(data) {
    this.loader = true;
    this.filter = 'edit';
    if (this.filter == 'edit' && this.master == 'internal') { this.internalform(); this.getCategory(); }
    if (this.filter == 'edit' && this.master == 'external') { this.externalform(); this.getCategory(); }
    this.form.patchValue(data);

    this.form.patchValue({
        Description: decode(data.Description)
      });
    
    
    if (data.Browser) {
      this.createForm('Browser');
      let BrowserDuration = new Date("1970-01-01 " + data.BrowserDuration);
      this.form.get('BrowserDuration').patchValue({
        hour: BrowserDuration.getHours(),
        minute: BrowserDuration.getMinutes(),
        second: BrowserDuration.getSeconds()
      });
      this.form.get('BrowserTriggerKey').patchValue(data.BrowserTriggerKey);
      this.form.get('BrowserMessage').patchValue(data.BrowserMessage);
      this.getTriggerValue(data.BrowserTriggerKey);
      let array = data.BrowserTriggerValue === null ? [] : data.BrowserTriggerValue.split(',');
      this.form.get('BrowserTriggerValue').patchValue(array);
    }
    if (data.Bell) {
      this.createForm('Bell');
      let BellDuration = new Date("1970-01-01 " + data.BellDuration);
      this.form.get('BellDuration').patchValue({
        hour: BellDuration.getHours(),
        minute: BellDuration.getMinutes(),
        second: BellDuration.getSeconds()
      });
      this.form.get('BellTriggerKey').patchValue(data.BellTriggerKey);
      this.form.get('BellMessage').patchValue(data.BellMessage);
      this.getTriggerValue(data.BellTriggerKey);
      let array = data.BellTriggerValue === null ? [] : data.BellTriggerValue.split(',');
      this.form.get('BellTriggerValue').patchValue(array);
    }
    if (data.Mobile) {
      this.createForm('Mobile');
      this.form.get('MobileTriggerKey').patchValue(data.MobileTriggerKey);
      this.form.get('MobileMessage').patchValue(data.MobileMessage);
      this.getTriggerValue(data.MobileTriggerKey);
      let array = data.MobileTriggerValue === null ? [] : data.MobileTriggerValue.split(',');
      this.form.get('MobileTriggerValue').patchValue(array);
    }
    this.form.get('Category').patchValue(data.CategoryId);
    this.getEvents(data.CategoryId);
    this.getSystemFields(data.CategoryId);
    this.form.get('Event').patchValue(data.EventsId);
    if (this.master === 'external') {
      this.form.get('Channel').patchValue(Number(data.ChannelId));
      this.getChannelSource(data.ChannelId);
      this.getFields(Number(data.ChannelId));
      this.getSenderData(Number(data.ChannelId), data.ChannelSourceId);
      this.templateID = data.Template;
      this.form.get('ChannelSource').patchValue(data.ChannelSourceId );
      this.form.get('From').patchValue(data.From);
      this.form.get('ReplyTo').patchValue(data.ReplyTo);
      this.form.get('Sender').patchValue(data.Sender);
      if (data.Template !== '' && data.Template !== null && data.Template !== undefined && data.Template !== 0) {
        this.channelSourceAvailable = true;
      }
      this.template = [];
      this.getTemplate(data.ChannelSourceId);
      this.form.get('Template').patchValue(data.Template);
    }
    this.form.updateValueAndValidity();
    this.loader = false;
  }

  getData() {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION",
        parameters: {
          flag: this.master === 'internal' ? 'GET_INTERNAL' : 'GET_EXTERNAL',
          productid: this.productName,
          processid: this.userDetails.Processid,
          PAGESIZE: this.itemsPerPage,
          PAGENO: this.currentpage,
          NotificationGrp: this.master
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.tabValue = [];
        this.tabKey = [];
        this.paginationArray = [];
        this,this.hasChecked = []
        this.tabValue = res.results.data[0];
        for (var i = 1; i <= res.results.data[1][0]['Total']; i++) {
          this.paginationArray.push(i);
        }
        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key) && key !== 'Sr No') {
            this.tabKey.push(key);
          }
        }
        this.common.tabValueLengthData(res.results.data[1][0]['Total']);
        this.common.reportTabKeyData(this.tabKey);
        if (res.results.data[0].length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
        this.loader = false;
      } else this.loader = false;
    });
  }

  getCategory() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_notification_category",
        parameters: {
          flag: 'GET_DRP',
          productid: this.productName,
          processid: this.userDetails.Processid,
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.category = res.results.data;
        this.loader = false;
      } else this.loader = false;
    });
  }

  getEvents(categoryId) {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: "usp_unfyd_notification_events",
        parameters: {
          flag: 'GET_DRP',
          productid: this.productName,
          processid: this.userDetails.Processid,
          categoryId: categoryId
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.events = res.results.data;
      } else this.loader = false;
    });
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

  getChannelSource(ChannelId) {
    this.TemplateData = []
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

  getTriggerValue(value) {
    if (value === 'UserSkills') {
      this.getSkills();
    } else if (value === 'UserGroups') {
      this.getGroups();
    }
  }

  emptyTriggerValue(type) {
    let control = type + 'TriggerValue';
    this.form.get(control).reset();
  }

  getSystemFields(categoryId) {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_notification_fields",
        parameters: {
          flag: 'GET_DRP',
          productid: this.productName,
          processid: this.userDetails.Processid,
          categoryId: categoryId
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.systemFields = res.results.data;
      } else this.loader = false;
    });
  }

  getSkills() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "SKILL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.skills = res.results.data;
      } else this.loader = false;
    });
  }

  getGroups() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "GROUP",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.groups = res.results.data;
      } else this.loader = false;
    });
  }

  commonForm() {
    this.form = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(regex.alphabet)]],
      Event: ['', Validators.nullValidator],
      Category: ['', Validators.required],
      Description: ['', [Validators.nullValidator, Validators.maxLength(500)]],
    });
  }


  internalform() {
    this.form = this.formBuilder.group({
      ...this.form.controls,
      Priority: ['', Validators.required],
      Browser: ['', Validators.nullValidator],
      Bell: ['', Validators.nullValidator],
      Mobile: ['', Validators.nullValidator],
    }, { validators: [ checknull('Name'),checknull1('Name'), checknull1('Description')] });
  }

  externalform() {
    this.form = this.formBuilder.group({
      ...this.form.controls,
      Channel: ['', Validators.required],
      Template: ['', Validators.nullValidator],
      ChannelSource: ['', Validators.required],
      From: ['', Validators.nullValidator],
      ReplyTo: ['', Validators.nullValidator],
      Sender: ['', Validators.nullValidator],
    }, { validators: [ checknull('Name'),checknull1('Name'), checknull1('Description')] });
  }
  createForm(event) {
    if (event == 'Browser') {
      this.form.addControl('BrowserDuration', new FormControl({ hour: 0, minute: 0, second: 0 }, Validators.required));
      this.form.addControl('BrowserMessage', new FormControl('', [Validators.required, Validators.pattern(regex.notificationmessage),Validators.maxLength(300), checknull]));
      this.form.addControl('BrowserTriggerKey', new FormControl('', Validators.required));
      this.form.addControl('BrowserTriggerValue', new FormControl('', Validators.required));
      this.form.addControl('BrowserSystemFields', new FormControl('', Validators.nullValidator));
    } else if (event == 'Bell') {
      this.form.addControl('BellDuration', new FormControl({ hour: 0, minute: 0, second: 0 }, Validators.required));
      this.form.addControl('BellMessage', new FormControl('', [Validators.required, Validators.pattern(regex.notificationmessage),Validators.maxLength(300), checknull]));
      this.form.addControl('BellTriggerKey', new FormControl('', Validators.required));
      this.form.addControl('BellTriggerValue', new FormControl('', Validators.required));
      this.form.addControl('BellSystemFields', new FormControl('', Validators.nullValidator));
    } else if (event == 'Mobile') {
      this.form.addControl('MobileMessage', new FormControl('', [Validators.required, Validators.pattern(regex.notificationmessage),Validators.maxLength(300), checknull]));
      this.form.addControl('MobileTriggerKey', new FormControl('', Validators.required));
      this.form.addControl('MobileTriggerValue', new FormControl('', Validators.required));
      this.form.addControl('MobileSystemFields', new FormControl('', Validators.nullValidator));
    }
    if (this.form.value.Browser === true && this.form.value.Bell !== true && this.form.value.Mobile !== true) {
      this.form = this.formBuilder.group({
        ...this.form.controls,
      }, { validators: [checknull('BrowserMessage'), checknull1('Name'), checknull('Name'), checknull1('Description')] });
    }else if (this.form.value.Browser !== true && this.form.value.Bell === true && this.form.value.Mobile !== true) {
      this.form = this.formBuilder.group({
        ...this.form.controls,
      }, { validators: [checknull('BellMessage'), checknull1('Name'), checknull('Name'), checknull1('Description')] });
    } else if (this.form.value.Browser !== true && this.form.value.Bell !== true && this.form.value.Mobile === true) {
      this.form = this.formBuilder.group({
        ...this.form.controls,
      }, { validators: [checknull('MobileMessage'), checknull1('Name'), checknull('Name'), checknull1('Description')] });
    }else if (this.form.value.Browser === true && this.form.value.Bell === true && this.form.value.Mobile !== true) {
      this.form = this.formBuilder.group({
        ...this.form.controls,
      }, { validators: [checknull('BrowserMessage'), checknull('BellMessage'), checknull1('Name'), checknull('Name'), checknull1('Description')] });
    }else if (this.form.value.Browser === true && this.form.value.Bell !== true && this.form.value.Mobile === true) {
      this.form = this.formBuilder.group({
        ...this.form.controls,
      }, { validators: [checknull('BrowserMessage'), checknull('MobileMessage'), checknull1('Name'), checknull('Name'), checknull1('Description')] });
    }else if (this.form.value.Browser !== true && this.form.value.Bell === true && this.form.value.Mobile === true) {
      this.form = this.formBuilder.group({
        ...this.form.controls,
      }, { validators: [checknull('BellMessage'), checknull('MobileMessage'), checknull1('Name'), checknull('Name'), checknull1('Description')] });
    }else if (this.form.value.Browser !== true && this.form.value.Bell !== true && this.form.value.Mobile !== true) {
      this.form = this.formBuilder.group({
        ...this.form.controls,
      }, { validators: [checknull1('Name'), checknull('Name'), checknull1('Description')] });
    }
     else if (this.form.value.Browser === true && this.form.value.Bell === true && this.form.value.Mobile === true) {
      this.form = this.formBuilder.group({
        ...this.form.controls,
      }, { validators: [checknull('BrowserMessage'), checknull('BellMessage'), checknull('MobileMessage'), checknull1('Name'), checknull('Name'), checknull1('Description')] });
    }
    this.form.updateValueAndValidity();
  }

  removeForm(event) {
    if (event == 'Browser') {
      this.form.removeControl('BrowserDuration');
      this.form.get('BrowserMessage').clearValidators();
      this.form.removeControl('BrowserMessage');
      this.form.removeControl('BrowserTriggerKey');
      this.form.removeControl('BrowserTriggerValue');
      this.form.removeControl('BrowserSystemFields');
      this.form.updateValueAndValidity();

    } else if (event == 'Bell') {
      this.form.removeControl('BellDuration');
      this.form.get('BellMessage').clearValidators();
      this.form.removeControl('BellMessage');
      this.form.removeControl('BellTriggerKey');
      this.form.removeControl('BellTriggerValue');
      this.form.removeControl('BellSystemFields');
      this.form.updateValueAndValidity();

    } else if (event == 'Mobile') {
      this.form.removeControl('MobileMessage');
      this.form.get('MobileMessage').clearValidators();
      this.form.removeControl('MobileTriggerKey');
      this.form.removeControl('MobileTriggerValue');
      this.form.removeControl('MobileSystemFields');
      this.form.updateValueAndValidity();

    }
    // this.form.updateValueAndValidity();

  }

  onTabChange(event) {
    this.master = event;
    this.getData();
  }

  selectedProduct(e) {
    this.productName = e;
    this.getData();
  }

  getProducts() {
    this.productType = JSON.parse(localStorage.getItem('products'))
    // this.productName = this.productName == undefined ? this.productType[0].Id : this.productName;
  }

  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
        console.log(this.labelName,"this.labelName")
        console.log(data1,"data1")

      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Notification', data);
  }

  getFilter() {
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data;
    }));
    this.subscription.push(this.common.reloadData$.subscribe((data) => {
      if (data == true) {
        this.hasChecked = [];
        this.currentpage = 1
        this.getData();
      }
    }));
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }));
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }));
    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.getData();
      }
    });
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
    });
  }

  feildChooser() {
    var obj = {
      data: {
        spname: "usp_unfyd_user_field_chooser",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
          modulename: this.master === 'internal' ? 'NotificationInternal' : 'NotificationExternal',
          language: localStorage.getItem('lang')
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        if (res.results.data.length == 0) {
          this.selctedField = this.tabKey;
        } else {
          this.selctedField = res.results.data[0].FieldChooser.split(',');
        }
        this.unSelctedField = this.tabKey.filter(field => !this.selctedField.includes(field));
        var selctedField = [];
        for (let i = 0; i < this.selctedField.length; i++) {
          selctedField.push({ value: this.selctedField[i], className: '' })
        }
        var unSelctedField = [];
        for (let i = 0; i < this.unSelctedField.length; i++) {
          unSelctedField.push({ value: this.unSelctedField[i], className: 'tabCol' })
        }
        this.finalField = [
          ...selctedField,
          ...unSelctedField
        ]
      }
    },
      (error) => {
      });
  }

  hideChange(event, value) {
    if (event == true) {
      this.createForm(value);
    } else {
      this.removeForm(value);
    }
  }

  SendToWorkspace(obj){
    obj.forEach(element => {
        this.api.post('notification', element).subscribe(res => {
          if (res.code == 200) {
            console.log(res);
          } else {
          }
        },
          (error) => {
            this.loader = false;
            console.log(error);
            this.common.snackbar("Add Error");
          }
        );
    })
  }


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  Submit(event,formDirective: FormGroupDirective): void {
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid || this.oneType()) {
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.loader = false;
      // this.common.snackbar('Please select one ')
      return;
    }
    let submitArray = [];
    let ResSubmitArray = [];
    let count = 0;
    if (this.master === 'internal') {
      if (this.form.value.Browser === true) {
        submitArray.push({
          MESSAGE: this.form.value.BrowserMessage.trim(),
          DURATION: this.form.value.BrowserDuration == '' ? '00:00:00' : this.form.value.BrowserDuration?.hour + ':' + this.form.value.BrowserDuration?.minute + ':' + this.form.value.BrowserDuration?.second,
          TRIGGERKEY: this.form.value.BrowserTriggerKey,
          TRIGGERVALUE: this.form.value.BrowserTriggerValue?.length === 1 ? this.form.value.BrowserTriggerValue[0] : this.form.value.BrowserTriggerValue.join(','),
          NOTIFICATIONTYPE: 'Browser'
        });
      }
      if (this.form.value.Bell === true) {
        submitArray.push({
          MESSAGE: this.form.value.BellMessage.trim(),
          DURATION: this.form.value.BellDuration == '' ? '00:00:00' : this.form.value.BellDuration?.hour + ':' + this.form.value.BellDuration?.minute + ':' + this.form.value.BellDuration?.second,
          TRIGGERKEY: this.form.value.BellTriggerKey,
          TRIGGERVALUE: this.form.value.BellTriggerValue?.length === 1 ? this.form.value.BellTriggerValue[0] : this.form.value.BellTriggerValue.join(','),
          NOTIFICATIONTYPE: 'Bell'
        });
      }
      if (this.form.value.Mobile === true) {
        submitArray.push({
          MESSAGE: this.form.value.MobileMessage.trim(),
          TRIGGERKEY: this.form.value.MobileTriggerKey,
          TRIGGERVALUE: this.form.value.MobileTriggerValue?.length === 1 ? this.form.value.MobileTriggerValue[0] : this.form.value.MobileTriggerValue.join(','),
          NOTIFICATIONTYPE: 'Mobile'
        });
      }
    }
    this.requestObj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION",
        parameters: {
          flag: this.filter == 'add' ? 'INSERT' : 'UPDATE',
          USERID: this.userDetails.Id,
          productid: this.productName,
          processid: this.userDetails.Processid,
          Name: this.form.value.Name.trim(),
          CATEGORYID: this.form.value.Category,
          EVENTSID: this.form.value.Event,
          DESCRIPTION: encode(this.form.value.Description.trim()),
          PRIORITY: this.form.value.Priority,
          Id: this.filter == 'add' ? undefined : this.Id,
          PUBLICIP: this.userDetails.ip,
          PrivateIp: this.userDetails.ip,
          BROWSERNAME: this.userDetails.browser,
          BROWSERVERSION: this.userDetails.browser_version,
          NOTIFICATIONGRP: this.master,
          Channel: this.form.value.Channel,
          ChannelSource: this.form.value.ChannelSource,
          From: this.form.value.From,
          ReplyTo: this.form.value.ReplyTo,
          Sender: this.form.value.Sender,
          Template: this.form.value.Template,
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        if ((res.results.data[0].result == "Notification already exists") &&  (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
          this.loader = false
        }
        else if( (res.results.data[0].Status == true) ){
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              this.loader=false;
              if (status.status) {
                this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "USP_UNFYD_NOTIFICATION",
                    parameters: {
                      flag: 'ACTIVATE',
                      // Id:this.filter == 'add' ? undefined : this.Id,
                      // Id: this.Id
                      Name: this.form.value.Name,
                      CATEGORYID: this.form.value.Category,
                      EVENTSID: this.form.value.Event,
                      NOTIFICATIONGRP: this.master,

                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar(this.filter == 'add' ? 'Record add' : 'Update Success');
                    if (event == 'add') {
                      if(this.isDialog == true){
                        this.dialogRef.close(true);
                      }
                      else{
                      // this.router.navigate(['masters/notifications/view']);
                      this.router.navigate(['masters/notifications/view'], { queryParams: { master: this.master, productID: this.productName } });
                    }

                    }
                    this.loader = false;
                    if (event == 'addNew') {
                      this.form.reset()
                      this.submittedForm = false;
                      this.resetfunc()
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
        else {
          if (this.master === 'internal' && submitArray.length > 0) {
            submitArray.forEach(element => {
              this.requestObj = {
                data: {
                  spname: "USP_UNFYD_NOTIFICATION",
                  parameters: {
                    flag: this.filter == 'add' ? 'INSERT_TYPE' : 'UPDATE_TYPE',
                    NOTIFICATIONID: this.filter == 'add' ? res.results.data[0].NotificationId : this.Id,
                    ...element
                  }
                }
              }
              ResSubmitArray.push(this.requestObj)
             
              this.api.post('index', this.requestObj).subscribe(res => {
                if (res.code == 200) {                              
                  count++;
                  if (count == submitArray.length) {
                    
                    ///SEND API TO WORKSPACE 
                    // this.SendToWorkspace(ResSubmitArray)
                    /////COMMENTED CODE 

                    this.common.snackbar(this.filter == 'add' ? 'Record add' : 'Update Success');
                    if (event == 'add') {
                      this.router.navigate(['masters/notifications/view'], { queryParams: { master: this.master, productID: this.productName } });
                    }
                    this.loader = false;
                    if (event == 'addNew') {
                      this.form.reset()
                      this.submittedForm = false;

                      formDirective.resetForm()

                    }
                  }
                } else this.loader = false;
              });
            });
          }
          else {
            this.common.snackbar(this.filter == 'add' ? 'Record add' : 'Update Success');
            if (event == 'add') {
              this.router.navigate(['masters/notifications/view'], { queryParams: { master: this.master, productID: this.productName } });
            }
            this.loader = false;
            if (event == 'addNew') {
              this.form.reset()
              this.resetfunc()
              formDirective.resetForm()

            }
          }
        }
      }
    });
  }

  contactAction(id) {
    this.router.navigate(['/masters/notifications/summary/' + id], { queryParams: { filter: 'view', master: this.master, productID: this.productName } });
  }
  edit(id) {
    this.router.navigate(['/masters/notifications/edit/' + id], { queryParams: { filter: 'edit', master: this.master, productID: this.productName } });
  }

  pageChange(currentpage) {
    this.currentpage = currentpage;
    this.getData();
  }

  bulkCheckboxCheck(event, element) {
    let startingOfArray = this.page * this.itemsPerPage - this.itemsPerPage;
    let endingOfArray: any;
    if (this.itemsPerPage * this.page > this.tabValue.length) {
      endingOfArray = this.tabValue.length;
    } else {
      endingOfArray = this.page * this.itemsPerPage;
    }
    for (let i = startingOfArray; i < endingOfArray; i++) {
      if (event) {
        if (this.tabValue[i] != undefined)
          this.tabValue[i].CHECKBOX = true;
        this.allSelected = true;
      } else if (!event) {
        if (this.tabValue[i] != undefined)
          this.tabValue[i].CHECKBOX = false;
        this.allSelected = false;
      }
    }
    this.checkChecks();
  }

  singleCheckboxCheck(event, element) {
    if (event) {
      element.CHECKBOX = true;
    } else if (!event) {
      element.CHECKBOX = false;
    }
    this.checkChecks();
  }

  checkChecks() {
    this.hasChecked = []
    let startingOfArray = this.page * this.itemsPerPage - this.itemsPerPage;
    let endingOfArray: any;
    if (this.itemsPerPage * this.page > this.tabValue.length) {
      endingOfArray = this.tabValue.length;
    } else {
      endingOfArray = this.page * this.itemsPerPage;
    }
    for (let i = startingOfArray; i < endingOfArray; i++) {
      if (this.tabValue[i]?.CHECKBOX) {
        this.hasChecked.push(this.tabValue[i].Actionable);
      }
    }
    if (this.hasChecked.length == (endingOfArray - startingOfArray)) {
      this.allSelected = true;
    } else {
      this.allSelected = false;
    }
  }

  openDialog(type, id) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');

    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {

      if (status.status && type == 'delete') {
        this.requestObj = {
          data: {
            spname: 'USP_UNFYD_NOTIFICATION',
            parameters: {
              flag: 'DELETE',
              Id: id,
              UserId: this.userDetails.Id,
            },
          },
        };
        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            this.common.snackbar("Delete Record");
            this.router.navigate(['masters/notifications/view'], { queryParams: { master: this.master, productID: this.productName } });

            this.hasChecked = [];
            this.currentpage = 1
            this.getData();
            this.loader = false;
          } else this.loader = false;
        });
      } this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
      // this.feildChooser()

    }))
  }

  back() {
    this.router.navigate(['masters/notifications/view'], { queryParams: { master: this.master, productID: this.productName } });
  }

  showSystemFields(event) {
    if (event === 'Browser') {
      this.BrowserSystemFields = true;
    } else if (event === 'Bell') {
      this.BellSystemFields = true;
    } else if (event === 'Mobile') {
      this.MobileSystemFields = true;
    }
  }

  addToMessage(type, value) {
    let msg: any;
    let control = type + 'Message';
    if(this.form.value[control] === null) this.form.value[control] = ''
    msg = this.form.value[control] + '{{' + value + '}}';
    this.form.get(control).patchValue(msg);
    let field = type + 'SystemFields';
    this.form.get(field).reset();
  }


  flip(Id, event) {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: 'USP_UNFYD_NOTIFICATION',
        parameters: {
          flag: 'STATUS',
          Id: Id,
          Status: event,
          UserId: this.userDetails.Id,
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.common.snackbar("Update Success");
        this.getData();
      } else {
        this.common.snackbar('General Error');
        this.loader = false;
      }
    });
  }

  dropdown(type, module) {
    if (this.ModuleGroupping.includes(module)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: this.data,
          isDialog: true,
          productID: this.productName,

        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.common.setUserConfig(this.userDetails.ProfileType, 'Notification');
        this.setLabelByLanguage(localStorage.getItem("lang"))
        this.getCategory()
        this.feildChooser()
        this.getProducts()
        this.common.refreshMenu(status);
        if (status) {
          if(this.filter == 'edit') this.feildChooser()
          // this.common.refreshMenu(status);
          // this.setLabelByLanguage(localStorage.getItem("lang"))
        }
      })
    }
    else {
      this.common.snackbar('ModuleInDialog')
    }

  }

  ontouch = true
  sortUsers(by: string, order: string): void {
    if (by == 'Actionable') return
    if (by == 'Sr No') return
    if (by == 'Status') return
    this.finalField.map(data => {
      if (data.value === by) {
        if (!data.order) {
          data.order = 'desc'
        } else {
          data.order = (data.order === 'desc') ? 'asc' : 'desc';
        }
      } else {
        data.order = null
      }
    })
    if (by == 'Created On' || by == 'Modified On') {
      let x=this.tabValue.filter(n => n[by])
      let k=this.tabValue.filter(n => n[by]==null)
      let s=this.tabValue.filter(n => n[by]=='')
      let y = x.sort((a, b) => {
          const dateA = moment(a[by], this.format);
          const dateB = moment(b[by], this.format);
          return dateA.valueOf() - dateB.valueOf();
      });
        this.tabValue=[...y, ...k, ...s]
        this.ontouch = !this.ontouch
        this.tabValue = this.ontouch == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
        return
    }
    let x = this.tabValue.filter(n => n[by])
    let k = this.tabValue.filter(n => n[by] == null)
    let s = this.tabValue.filter(n => n[by] == '')
    let y = x.sort((a, b) => a[by].localeCompare(b[by]))
    this.tabValue = [...y, ...k, ...s]
    this.ontouch = !this.ontouch
    this.tabValue = this.ontouch == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

  }
  resetfunc() {
    this.submittedForm=false
    this.templateVisible = false;
    this.submittedForm=false;
    this.ChannelSource = []
    this.TemplateData = [];
    if(this.master == 'internal'){
    setTimeout(() => {
      if(this.form.value.BrowserDuration === null) this.form.controls['BrowserDuration'].patchValue(this.time)
      if(this.form.value.BellDuration === null){
         this.form.controls['BellDuration'].patchValue(this.timee)}
      this.form.updateValueAndValidity()
    });}


  }
  oneType(): boolean {
    let a = false;
    if (!this.form.value.Browser && !this.form.value.Bell && !this.form.value.Mobile && this.master === 'internal') a = true
    return a;
  }
  toggleSelectionBS(change: MatCheckboxChange): void {

    if (change.checked) {
      this.form.controls['BrowserTriggerValue'].patchValue(this.skills.map(data => data.Id));
      this.form.updateValueAndValidity()

    } else {
      this.form.controls['BrowserTriggerValue'].patchValue('');
      this.form.updateValueAndValidity()
    }
  }
  allBrowserSkills(e, val) {
    if (e.includes(0) && this.form.value.BrowserTriggerValue.length >= this.skills.length) {
      if (this.form.value.BrowserTriggerValue.includes(0)) {
        for (var i = 0; i < this.form.value.BrowserTriggerValue.length; i++) {
          if (this.form.value.BrowserTriggerValue[i] == 0) {
            let a = []
            a = this.form.value.BrowserTriggerValue
            a.splice(a.indexOf(0), 1);
            this.form.controls.BrowserTriggerValue.patchValue(a);
            this.form.get('BrowserTriggerValue').updateValueAndValidity()
            this.form.updateValueAndValidity();
          }
        }
      }
    }
  }
  toggleSelectionBG(change: MatCheckboxChange): void {

    if (change.checked) {
      this.form.controls['BrowserTriggerValue'].patchValue(this.groups.map(data => data.GroupID));
      this.form.updateValueAndValidity()

    } else {
      this.form.controls['BrowserTriggerValue'].patchValue('');
      this.form.updateValueAndValidity()
    }
  }
  allBrowserGroups(e, val) {
    if (e.includes(0) && this.form.value.BrowserTriggerValue.length >= this.groups.length) {
      if (this.form.value.BrowserTriggerValue.includes(0)) {
        for (var i = 0; i < this.form.value.BrowserTriggerValue.length; i++) {
          if (this.form.value.BrowserTriggerValue[i] == 0) {
            let a = []
            a = this.form.value.BrowserTriggerValue
            a.splice(a.indexOf(0), 1);
            this.form.controls.BrowserTriggerValue.patchValue(a);
            this.form.get('BrowserTriggerValue').updateValueAndValidity()
            this.form.updateValueAndValidity();
          }
        }
      }
    }
  }
  toggleSelectionBeS(change: MatCheckboxChange): void {

    if (change.checked) {
      this.form.controls['BellTriggerValue'].patchValue(this.skills.map(data => data.Id));
      this.form.updateValueAndValidity()

    } else {
      this.form.controls['BellTriggerValue'].patchValue('');
      this.form.updateValueAndValidity()
    }
  }
  allBellSkills(e, val) {
    if (e.includes(0) && this.form.value.BellTriggerValue.length >= this.skills.length) {
      if (this.form.value.BellTriggerValue.includes(0)) {
        for (var i = 0; i < this.form.value.BellTriggerValue.length; i++) {
          if (this.form.value.BellTriggerValue[i] == 0) {
            let a = []
            a = this.form.value.BellTriggerValue
            a.splice(a.indexOf(0), 1);
            this.form.controls.BellTriggerValue.patchValue(a);
            this.form.get('BellTriggerValue').updateValueAndValidity()
            this.form.updateValueAndValidity();
          }
        }
      }
    }
  }
  toggleSelectionBeG(change: MatCheckboxChange): void {

    if (change.checked) {
      this.form.controls['BellTriggerValue'].patchValue(this.groups.map(data => data.GroupID));
      this.form.updateValueAndValidity()

    } else {
      this.form.controls['BellTriggerValue'].patchValue('');
      this.form.updateValueAndValidity()
    }
  }
  allBellGroups(e, val) {
    if (e.includes(0) && this.form.value.BellTriggerValue.length >= this.groups.length) {
      if (this.form.value.BellTriggerValue.includes(0)) {
        for (var i = 0; i < this.form.value.BellTriggerValue.length; i++) {
          if (this.form.value.BellTriggerValue[i] == 0) {
            let a = []
            a = this.form.value.BellTriggerValue
            a.splice(a.indexOf(0), 1);
            this.form.controls.BellTriggerValue.patchValue(a);
            this.form.get('BellTriggerValue').updateValueAndValidity()
            this.form.updateValueAndValidity();
          }
        }
      }
    }
  }
  toggleSelectionMS(change: MatCheckboxChange): void {

    if (change.checked) {
      this.form.controls['MobileTriggerValue'].patchValue(this.skills.map(data => data.Id));
      this.form.updateValueAndValidity()

    } else {
      this.form.controls['MobileTriggerValue'].patchValue('');
      this.form.updateValueAndValidity()
    }
  }
  allMobileSkills(e, val) {
    if (e.includes(0) && this.form.value.MobileTriggerValue.length >= this.skills.length) {
      if (this.form.value.MobileTriggerValue.includes(0)) {
        for (var i = 0; i < this.form.value.MobileTriggerValue.length; i++) {
          if (this.form.value.MobileTriggerValue[i] == 0) {
            let a = []
            a = this.form.value.MobileTriggerValue
            a.splice(a.indexOf(0), 1);
            this.form.controls.MobileTriggerValue.patchValue(a);
            this.form.get('MobileTriggerValue').updateValueAndValidity()
            this.form.updateValueAndValidity();
          }
        }
      }
    }
  }
  toggleSelectionMG(change: MatCheckboxChange): void {
    if (change.checked) {
      this.form.controls['MobileTriggerValue'].patchValue(this.groups.map(data => data.GroupID));
      this.form.updateValueAndValidity()

    } else {
      this.form.controls['MobileTriggerValue'].patchValue('');
      this.form.updateValueAndValidity()
    }
  }
  allMobileGroups(e, val) {
    if (e.includes(0) && this.form.value.MobileTriggerValue.length >= this.groups.length) {
      if (this.form.value.MobileTriggerValue.includes(0)) {
        for (var i = 0; i < this.form.value.MobileTriggerValue.length; i++) {
          if (this.form.value.MobileTriggerValue[i] == 0) {
            let a = []
            a = this.form.value.MobileTriggerValue
            a.splice(a.indexOf(0), 1);
            this.form.controls.MobileTriggerValue.patchValue(a);
            this.form.get('MobileTriggerValue').updateValueAndValidity()
            this.form.updateValueAndValidity();
          }
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
