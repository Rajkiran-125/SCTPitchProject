import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { regex } from 'src/app/global/json-data';

@Component({
  selector: 'app-my-task',
  templateUrl: './my-task.component.html',
  styleUrls: ['./my-task.component.scss']
})
export class MyTaskComponent implements OnInit {
  
  loader: boolean = false;
  submittedForm = false;
  selectCampaignField:any;
  masters: any;
  campaignDetails: any;
  userDetails: any;
  campaignName : any;
  form: FormGroup;
  systemFields : any;
  requestObj: { data: { spname: string; parameters: any } };
  userFields: any;
  reset: any;
  regex: any;
  getSnapShot: any;
  capacity: any;

  constructor(
    private formBuilder:FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private common: CommonService,) {
      Object.assign(this, { regex });
      }


  ngOnInit(): void {
    this.common.hubControlEvent('MyTasks','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.isFormInvalid();
    this.userDetails = this.auth.getUser();
    this.form = this.formBuilder.group({
      enableChannelwiseCapacity: [false],
      channelid: [''],
      channelGroup: this.formBuilder.array([]),
      CampaignName: [''],
      TaskName: [''],
      Category: [''],
      SubCategory: [''],
      Source: [''],
      Priority: [''],
      Agent: [''],
      Channel: [''],
      WhatsappHSMName: [''],
      EmailTemplateName: [''],
      ScheduleName: [''],
      CustomerName: [''],
      Gender: [''],
      MobileNo: [''],
      WhatsappNo: [''],
      EmailID: [''],
      DOB: [''],
      DOA: [''],
      PreferredLanguage: [''],
      PreferredTimeConnect: [''],
      Attribute1: [''],
      Attribute2: [''],
      Attribute3: [''],
      Attribute4: [''],
      Attribute5: [''],
      Attribute6: [''],
      Attribute7: [''],
      Attribute8: [''],
      Attribute9: [''],
      Attribute10: [''],
      Attribute11: [''],
      Attribute12: [''],
      Attribute13: [''],
      Attribute14: [''],
      Attribute15: [''],
      Attribute16: [''],
      Attribute17: [''],
      Attribute18: [''],
      Attribute19: [''],
      Attribute20: ['']
    })
    this.common.hubControlEvent('MyTasks','click','pageload','pageload','','ngOnInit');

  }

  isFormInvalid(){
    this.common.hubControlEvent('MyTasks','click','','','','isFormInvalid');

    this.form?.value?.channelGroup.forEach(element => {
      if((element.inbound +  element.outbound) > this.capacity){
       return false;
      }

    });
}
  
  addTask () {
    var Obj = {
      data: {
        spname: "usp_unfyd_campaign_attribute",
        parameters: {
          flag: "INSERT",
          PROCESSID: this.userDetails.Processid,
          
          
        }
      }
    };
    this.common.hubControlEvent('MyTasks','click','','',JSON.stringify(Obj),'addTask');

    this.api.post('index', Obj).subscribe(res => {
      this.loader = false;
      // this.reset = true;
      if (res.code == 200) {
        this.campaignDetails = res.results.data;
      }      
    });    
  }
}
