import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/global/common.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable, Subscription } from 'rxjs';
import { threadId } from 'worker_threads';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { data } from 'jquery';

@Component({
  selector: 'app-channel-configuration-edit',
  templateUrl: './channel-configuration-edit.component.html',
  styleUrls: ['./channel-configuration-edit.component.scss']
})
export class ChannelConfigurationEditComponent implements OnInit {
  userDetails: any;
  local: string;
  uniqueid: string;
  hsminput: any;
  chconfval: boolean = false;
  hsmtempval: boolean= false;
  dataTemp = []
  channel :any;
  labelName:any;
  iconColor: any;
  whatsappvender: any;
  channelvalue = []
  loader = false;
  subscription: Subscription[] = [];
  userConfig: any;
  constructor(public common: CommonService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private api: ApiService, private auth: AuthService,) { }

  ngOnInit(): void {
    this.common.hubControlEvent('ChannelConfiguration','click','pageload','pageload','','ngOnInit');

    this.loader = true
    this.chconfval = true;
    this.hsmtempval = false;
    this.hsminput = 'hsm';
    this.userDetails = this.auth.getUser();
    this.getchannelvalue()
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'ChannelConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          
    }))

    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.local = this.activatedRoute.snapshot.paramMap.get('id');
    this.uniqueid = this.activatedRoute.snapshot.paramMap.get('uniqueid');


    this.activatedRoute.queryParams.subscribe(params => {
     this.iconColor = params.iconColor;
     this.whatsappvender = params.whatsappvender;
          if(params.filter == 'HsmTemplate')
          {
            this.chconfval = false;
            this.hsmtempval = true;
          }
     })
    this.getChaneelDetails()
    this.common.hubControlEvent('ChannelConfiguration','click','pageloadend','pageloadend','','ngOnInit');

  }

  setLabelByLanguage(data) {
  

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ChannelConfiguration', data)
   

  }

  ChannelConfigurationFunc(){
    
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'ChannelConfiguration');

    this.chconfval = true;
    this.hsmtempval = false;

    this.common.hubControlEvent('ChannelConfiguration','click','','','','ChannelConfigurationFunc');
  }


  HSMTemplateFunc(){
    this.hsmtempval = true;
    this.chconfval = false;
    
    this.common.hubControlEvent('ChannelConfiguration','click','','','','HSMTemplateFunc');
  }

  getChaneelDetails(){
    this.loader = true
    let obj= {
      data: {
        spname: 'usp_unfyd_channel_config',
        parameters: {
          flag: "EDIT",
          CHANNELID: parseInt(this.activatedRoute.snapshot.paramMap.get('id')),
          uniqueid: this.activatedRoute.snapshot.paramMap.get('uniqueid'),
        }
      }
    };
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj),'getChaneelDetails');

    this.api.post('index', obj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        var tmpt = res.results.data;
          this.dataTemp = [];
          for (var i = 0; i < tmpt.length; ++i) {
            this.dataTemp.push({ 'Key': tmpt[i].ConfigKey, 'Value': tmpt[i].ConfigValue, 'Id': tmpt[i].Id });
          }

          let obj = {}
          this.dataTemp.reduce(function (acc, val) {
            return Object.assign(obj,{[val.Key]: val.Value});
          }, {});
        this.channel = obj;
        this.whatsappvender = this.channel.WhatsApp_Provider
        this.iconColor = this.channel.iconColor
      }
    });
  }

  getchannelvalue(){
    let obj={
      data:{
        spname:"USP_RULEMASTER_PROC",
        parameters:{
          flag:"CHANNELSOURCE",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj),'getchannelvalue');

    this.api.post('index', obj).subscribe((res: any) => {
      this.channelvalue = res.results['data'];
    })
  }


  editPage(){
    this.common.hubControlEvent('ChannelConfiguration','click','','','','editPage');

    this.router.navigate(['masters/channel-configuration/channel-details', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')])
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
