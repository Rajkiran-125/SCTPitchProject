import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull, checknull1, voiceConfigurationsteps, masters, regex, } from 'src/app/global/json-data';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';


@Component({
  selector: 'app-voice-detail',
  templateUrl: './voice-detail.component.html',
  styleUrls: ['./voice-detail.component.scss']
})
export class VoiceDetailComponent implements OnInit {
  userDetails: any;
  uniqueId: string;
  local: any;
  path: any;
  eventkey: string;
  loader: boolean = false;
  isUpdate: any = 'false';
  form: FormGroup;
  reset: boolean;
  voiceConfigurationsteps: any;
  submittedForm: boolean = false;
  labelName: any;
  subscription: Subscription[] = [];
  voiceuniquedata: any;
  channel: any;
  dataTemp: any;
  requestObj: any;
  AccountType: any;
  userConfig: any;
  subscriptionAcitivateData: Subscription[] = [];
  @Input() isDialog: boolean = false;




  constructor(
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public common: CommonService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,

    private el: ElementRef,)  { Object.assign(this, { masters, regex, voiceConfigurationsteps }); }


  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');

    this.common.setMasterConfig();
    this.subscription.push(
       this.common.getMasterConfig$.subscribe((data) => {
        this.AccountType = JSON.parse(data["AccountType"]);
      })
    )

    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {

      this.loader = false;
      this.router.navigate(['/masters/channel-configuration/voice-configuration/voice-detail', this.path, 'add'])
    }
    else {
      if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
        this.isUpdate = 'true';
        this.editVoice('edit', this.uniqueId)
      }
    }
    this.common.setUserConfig(this.userDetails.ProfileType, 'VoiceConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }) )
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.getChannel();
    this.form = this.formBuilder.group({
      Profilepic: ['', [Validators.required]],
      voiceChannelSource: ['', [Validators.required]],
      AccountType: ['', [Validators.required]],
      CallbackWebhookMessage: ['',[Validators.required]],
      CallbackWebhookNotification: ['', [Validators.required]],
      NewInteractionFormarray: [''],
      NotificationFormarray: [''],
      SRNNumber: [''],
      voiceServiceProvider: [''],
      RequestBody: [''],
      InboundNumber: [''],
      Queue: [''],
      Enable:[''],
      DialWebhook: [''],
      ConsultWebhook: [''],
      HoldWebhook: [''],
      OnCallCompletion: [''],
      NewInteraction: [''],
      NotificationWebhook: [''],
    },
    { validator: [checknull('voiceChannelSource'),checknull1('voiceChannelSource'),checknull('CallbackWebhookMessage'),checknull1('CallbackWebhookMessage'),checknull('CallbackWebhookNotification'),checknull1('CallbackWebhookNotification')] },
    )


  }

  back(): void{
    this.router.navigate(['masters/channel-configuration/voice-configuration/view/'+this.path]);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getChannel() {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_channel_config ',
        parameters: {
          flag: "CHANNEL",
          id: parseInt(this.path)
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        this.channel = res.results.data[0];
      }
    });
  }

  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1

      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'VoiceConfiguration', data);
  }

  editVoice(type, uid) {
    this.loader = true;
    if (type == 'edit') {
      let obj = {
        data: {
          spname: "usp_unfyd_channel_config",
          parameters: {
            flag: 'EDIT',
            CHANNELID: parseInt(this.activatedRoute.snapshot.paramMap.get('id')),
            uniqueid: this.activatedRoute.snapshot.paramMap.get('uniqueid'),
          }
        }
      };
      this.api.post('index', obj).subscribe(res => {
        this.reset = true;

        if (res.code == 200) {
          var tmpt = res.results.data;

          console.log('tmpt',tmpt);

          this.dataTemp = [];
          for (var i = 0; i < tmpt.length; ++i) {
              this.form.patchValue({ [tmpt[i].ConfigKey]: tmpt[i].ConfigValue })

            this.dataTemp.push({ 'Key': tmpt[i].ConfigKey, 'Value': tmpt[i].ConfigValue, 'Id': tmpt[i].Id });
          }

          this.form.updateValueAndValidity();
          this.loader = false;
        } else {
          this.loader = false;
        }
      });
    }

  }

  savevoice(event){
    // this.loader = true
    this.submittedForm = true;
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    if (this.isUpdate.toUpperCase() === 'FALSE') {

      // this.loader = true;
      this.submittedForm = true;
      if (this.form.invalid) {
        this.loader = false;
        this.form.markAllAsTouched()
        for (const key of Object.keys(this.form.controls)) {
          if (this.form.controls[key].invalid) {
            if(key == "Profilepic"){
              if(this.form.value.Profilepic == "" || this.form.value.Profilepic == null){
              this.common.snackbar('iconRequired');
              // this.iconRequired = true;
              return;
              }
            }
          if (this.form.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
          }
        }
        return;
      }
     }

      let obj1 = {
        data: {
          spname: "usp_unfyd_channel_config",
          parameters: {
            flag: 'INSERT_CHANNELSOURCE_MST',
            processid: this.userDetails.Processid,
            CHANNELID: this.path,
            CREATEDBY:this.userDetails.Id,
            CHANNELSRCNAME:this.form.value.voiceChannelSource
          }
        }
      }

      this.api.post('index', obj1).subscribe((res: any) => {
        if (res.code == 200) {
          if(res.results.data[0].result == 'success')
          {
            let ChSrcId = res.results.data[0].Id
                var temp = [];
                var temp2 = [];
                var today = new Date();
                var dd = new Date().getDate();
                var mm = new Date().getMonth() + 1;
                var yyyy = new Date().getFullYear();
                var time = today.getHours().toString() + today.getMinutes().toString();
                temp = Object.keys(this.form.value);
                temp2 = Object.values(this.form.value);
                let counter = 0;
                this.voiceuniquedata = this.channel?.ChannelName.toUpperCase() + dd + mm + yyyy + time;
                for (let i = 0; i < temp.length; i++) {
                  if(temp[i] == "voiceChannelSource" || temp[i] == "CallbackWebhookMessage" || temp[i] == "CallbackWebhookNotification")
                  {
                    temp2[i] = temp2[i] == null ? null : temp2[i] == undefined ? null : temp2[i].trim()
                  }

                  let obj = {
                    data: {
                      spname: "usp_unfyd_channel_config",
                      parameters: {
                        flag: 'INSERT',
                        CHANNELID: this.path,
                        CHANNELNAME: this.channel?.ChannelName.toUpperCase(),
                        ConfigKey: temp[i],
                        ConfigValue: temp2[i],
                        ConfigType: typeof (temp2[i]),
                        STATUS: 1,
                        processid: this.userDetails.Processid,
                        productid: 1,
                        uniqueid: this.voiceuniquedata,
                        CHANNELSRCID: ChSrcId
                      }
                    }
                  };
                  this.api.post('index', obj).subscribe((res: any) => {
                    if (res.code == 200) {
                      if (temp.length - 1 == counter) {
                        this.loader = false;
                        if(event == 'save') this.router.navigate(['masters/channel-configuration/voice-configuration/voice-detail', this.activatedRoute.snapshot.paramMap.get('id'), 'update', ChSrcId]);

                        else if(event == 'next')this.router.navigate(['masters/channel-configuration/voice-configuration/voice-service', this.activatedRoute.snapshot.paramMap.get('id'), 'update', ChSrcId]);

                        this.common.snackbar("Record add");
                      }
                      counter++;
                    } else {
                      this.loader = false;
                    }
                  });
                }
          }
          // else
          // {
          //   this.common.snackbar(res.results.data[0].result,'error');
          //   this.loader = false;
          //   return;
          // }
          
          else if(res.results.data[0].result.includes('already exists')&& (res.results.data[0].ChannelSourceStatus == true)){
            this.common.snackbar("ChannelSourceName Exists")

          }

          else if (res.results.data[0].ChannelSourceStatus == false){
            this.common.confirmationToMakeDefault('AcitvateDeletedData');
            this.subscriptionAcitivateData.push(
              this.common.getIndividualUpload$.subscribe(status => {
                if (status.status) {
  
                  // this.loader = true;
                  this.requestObj = {
                    data: {
                      spname: "usp_unfyd_channel_config",
                      parameters: {
                        flag: 'ACTIVATE_CHANNELSOURCE',
                        processid: this.userDetails.Processid,
                        CHANNELID: this.path,
                        MODIFIEDBY: this.userDetails.Id,
                        CHANNELSRCNAME:this.form.value.voiceChannelSource
                       
  
                      }
                    }
                  };
  
                  this.api.post('index', this.requestObj).subscribe((res: any) => {
                    if (res.code == 200) {
                      this.common.snackbar('Record add');
                      if (event == 'save') {
                        if (this.isDialog == true) {
                          this.dialogRef.close(true);

                        }
                        this.router.navigate(['masters/channel-configuration/voice-configuration/view/'+this.path]);

                      } 
                      if (event == 'next') {
                        if (this.isDialog == true) {
                          this.dialogRef.close(true);

                        }
                        this.router.navigate(['masters/channel-configuration/voice-configuration/view/'+this.path]);

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

      // this.router.navigate(['masters/channel-configuration/voice-configuration/voice-service', this.activatedRoute.snapshot.paramMap.get('id'), 'update']);
  }else if (this.isUpdate.toUpperCase() === 'TRUE') {

    this.loader = true;
      this.submittedForm = true;
      if (this.form.invalid) {
        this.loader = false;
        this.form.markAllAsTouched()
        for (const key of Object.keys(this.form.controls)) {
          if (this.form.controls[key].invalid) {
            if(key == "Profilepic"){
              if(this.form.value.Profilepic == "" || this.form.value.Profilepic == null){
              this.common.snackbar('iconRequired');
              // this.iconRequired = true;
              return;
              }
            }
          if (this.form.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
          }
        }
        return;
      }
     }
    var keys = Object.keys(this.form.value);
      var values = Object.values(this.form.value);
      let counter = values.length;
      var updateData = [];
      this.dataTemp.forEach((element, index) => {
        keys.forEach((object, j) => {
          if (element.Key == object) {
            if(element.Key  == "voiceChannelSource" || element.Key  == "CallbackWebhookMessage" || element.Key  == "CallbackWebhookNotification")
            {
              let val : any = values[j]
              values[j] = values[j] == null ? null : values[j] == undefined ? null : val.trim()
            }
            updateData.push({ "Id": element.Id, "ConfigKey": element.Key, "ConfigValue": values[j] })
          }
        });
      });
      updateData.forEach(element => {
        let obj = {
          data: {
            spname: "usp_unfyd_channel_config",
            parameters: {
              flag: 'UPDATE',
              // CHANNELNAME: this.channel?.ChannelName.toUpperCase(),
              ConfigKey: element.ConfigKey,
              ConfigValue: element.ConfigValue,
              CHANNELID: parseInt(this.path),
              STATUS: 1,
              processid: this.userDetails.processid,
              productid: 1,
              Id: element.Id,
            }
          }
        };
        this.api.post('index', obj).subscribe((res: any) => {
          if (res.code == 200) {
            counter--;
            if (counter == 0) {
              this.loader = false
              this.common.snackbar("Saved Success");
              if(event == 'save') this.router.navigate(['masters/channel-configuration/voice-configuration/voice-detail', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
              else if(event == 'next')this.router.navigate(['masters/channel-configuration/voice-configuration/voice-service', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);

            }
          } else {
            this.loader = false;
          }
        });
      });
  }
}


resetFunc(){
  this.form.reset();
  this.submittedForm = false
}

ngOnDestroy() {
  if (this.subscription) {
    this.subscription.forEach((e) => {
      e.unsubscribe();
    });
  }
}

}
