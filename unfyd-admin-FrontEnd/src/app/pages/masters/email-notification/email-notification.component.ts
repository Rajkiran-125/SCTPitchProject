import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-email-notification',
  templateUrl: './email-notification.component.html',
  styleUrls: ['./email-notification.component.scss']
})
export class EmailNotificationComponent implements OnInit {
  loader: boolean = false;
  requestObj: { data: { spname: string; parameters: any } };
  agentForm: FormGroup;
  contcactForm: FormGroup;
  userDetails : any;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef) { }
  ngOnInit(): void {
    this.loader = true;
    this.userDetails = this.auth.getUser();
    this.agentForm = this.formBuilder.group({
      agent: this.formBuilder.array([]),
    });
    this.contcactForm = this.formBuilder.group({
      contact: this.formBuilder.array([]),
    });
    this.getAgentNotifications();
    this.getContactNotifications();
  }
  getAgentNotifications() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_email_notification_master',
        parameters: {
          flag: 'EDIT',
          Category: 'Agent'
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = true;
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          var tempAgent = res.results.data;
          var dataAgent = [];
          tempAgent.forEach(element => {
            var tempData = JSON.parse(JSON.parse(JSON.stringify(element.Template)));
            dataAgent.push({ "Category": element.Category, "Event": tempData.NotifyEvent, "Status": tempData.Status, "Key": tempData.TemplateKey, "Value": tempData.TemplateValue });
          });
          dataAgent.forEach(element => {
            this.addUser(element)
          });
        }
        this.loader = false;
      }
    });
  }
  getContactNotifications() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_email_notification_master',
        parameters: {
          flag: 'EDIT',
          Category: 'Contact'
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = true;
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          var temp = res.results.data;
          var data = [];
          temp.forEach(element => {
            var tempData = JSON.parse(JSON.parse(JSON.stringify(element.Template)));
            data.push({ "Category": element.Category, "Event": tempData.NotifyEvent, "Status": tempData.Status, "Key": tempData.TemplateKey, "Value": tempData.TemplateValue });
          });
          data.forEach(element => {
            this.addContact(element)
          });
        }
        this.loader = false;
      }
    });
  }
  addUser(user?: any) {
    var status = user?.Status == 'true' ? true : false;
    let fg = this.formBuilder.group({
      agentChecked: [user ? status : false],
      ConfigKey: [user ? user?.Event : ''],
      textfield: [user ? user?.Key : ''],
      ConfigValue: [user ? status : false],
      Category: [user ? user?.Category : '']
    });
    (<FormArray>this.agentForm.get('agent')).push(fg);
  }
  addContact(contactNotification?: any) {
    var status = contactNotification?.Status == 'true' ? true : false;
    let fg = this.formBuilder.group({
      agentChecked: [contactNotification ? status : false],
      ConfigKey: [contactNotification ? contactNotification?.Event : ''],
      textfield: [contactNotification ? contactNotification?.Key : ''],
      ConfigValue: [contactNotification ? status : false],
      Category: [contactNotification ? contactNotification?.Category : '']
    });
    (<FormArray>this.contcactForm.get('contact')).push(fg);
  }
  editpanel(key) {
    this.router.navigateByUrl('masters/email-notification/editTemplate/' + key.ConfigKey);
  }
  Save() {
    var agentArray = (this.agentForm.get('agent') as FormArray).value;
    var contactArray = (this.contcactForm.get('contact') as FormArray).value;
    var data = [];
    agentArray.forEach(element => {
      if (element.agentChecked == true) {
        data.push({ "TemplateCategory": element.Category, "TemplateDescription": element.textfield, "TemplateKey": element.ConfigKey, "TemplateStatus": element.agentChecked });
      }
    });
    contactArray.forEach(element => {
      if (element.agentChecked == true) {
        data.push({ "TemplateCategory": element.Category, "TemplateDescription": element.textfield, "TemplateKey": element.ConfigKey, "TemplateStatus": element.agentChecked });
      }
    });
    var i = 0;
    data.forEach(element => {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_email_templates',
          parameters: {
            flag: 'INSERT',
            TemplateKey : element.TemplateKey,
            TemplateDescription : element.TemplateDescription,
            TemplateCategory : element.TemplateCategory,
            TemplateStatus : element.TemplateStatus,
            CreatedBy: this.userDetails.Id,
            ProcessId: this.userDetails.Processid,
            productid: 1,
            PublicIp: this.userDetails.ip,
            PrivateIp: '',
            BrowserName: this.userDetails.browser,
            BrowserVersion: this.userDetails.browser_version
          },
        },
      };
      this.api.post('index', this.requestObj).subscribe(res => {
        this.loader = true;
        if (res.code == 200) {
        }
      });
    });
  }
}
