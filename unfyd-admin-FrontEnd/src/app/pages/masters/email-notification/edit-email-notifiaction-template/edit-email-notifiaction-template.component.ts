import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { NgxSummernoteModule } from 'ngx-summernote';
import { Location } from '@angular/common';
@Component({
  selector: 'app-edit-email-notifiaction-template',
  templateUrl: './edit-email-notifiaction-template.component.html',
  styleUrls: ['./edit-email-notifiaction-template.component.scss']
})
export class EditEmailNotifiactionTemplateComponent implements OnInit {
  config = {
    placeholder: '',
    tabsize: 1,
    height: '300px',  
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    dialogsInBody: true,
  }
  template: any = [];
  requestObj: any;
  loader: boolean = false;
  modules = {};
  description: any;
  getvaribleList: any;
  emailNotificationForm!: FormGroup;
  isHtmlCheck: boolean = false;
  variables: any;
  userDetails: any;
  update: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef) { }

  ngOnInit() {
    this.loader = true;
    this.userDetails = this.auth.getUser();
    this.template = this.activatedRoute.snapshot.paramMap.get('id');
    this.emailNotificationForm = this.formBuilder.group({
      htmlList: [null, Validators.nullValidator],
      subject: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      Ishtml: [false, Validators.nullValidator],
    });
    this.getVariableList();
    if (this.template != null || this.template != undefined) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_message_templates",
          parameters: {
            flag: 'GET',
            ProcessId: this.userDetails.Processid,
            productid: 1,
            TemplateName: this.template
          }
        }
      }
      this.api.post('index', this.requestObj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          if (res.results.data.length > 0) {
            this.update = true;
            var obj = res.results.data[0];
            this.isHtmlCheck = obj.ContentType == 'html' ? true : false;
            this.emailNotificationForm.get('subject').patchValue(obj.Subject);
            var tempSelect = [];
            var data = obj.Subject.replace(/[\}]+/g,",").replace(/[\{]+/g,"").split(",");
            data.forEach(element => {
              if(element != ''){
                tempSelect.push('{'+element+'}');
              }
            });
            this.emailNotificationForm.get('htmlList').patchValue(tempSelect);
            this.emailNotificationForm.get('description').patchValue(obj.BodyTemplate);
          }
        }
      });
    }
  }
  getVariableList() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_Get_fields",
        parameters: {
          Type: "Email_NotiFication_Field"
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          this.variables = res.results.data;
        }
      }
    });
  }
  selectHtmlValue(val) {
    this.emailNotificationForm.patchValue({
      subject: JSON.stringify((Object.values({ ...this.emailNotificationForm.value.htmlList }))).replace(/[\[\]"\",\,']+/g, '')
    })
  }
  save() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_message_templates",
        parameters: {
          flag: this.update == true ? 'UPDATE' : 'INSERT',
          TemplateName: this.template,
          TemplateDesc: this.template,
          BodyTemplate: this.emailNotificationForm.value.description,
          ContentType: this.emailNotificationForm.value.Ishtml == true ? 'html' : 'text',
          Subject: this.emailNotificationForm.value.subject,
          Sender: 'smartserve@smartnapp.com',
          CreatedBy: this.userDetails.Id,
          ProcessId: this.userDetails.Processid,
          productid: 1,
          PublicIp: this.userDetails.ip,
          PrivateIp: '',
          BrowserName: this.userDetails.browser,
          BrowserVersion: this.userDetails.browser_version
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.common.snackbar("Success");
      }
    });
  }
}
