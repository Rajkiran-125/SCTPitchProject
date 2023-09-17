import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnyARecord } from 'dns';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull, checknull1, masters, regex, voiceConfigurationsteps } from 'src/app/global/json-data';

@Component({
  selector: 'app-voice-service',
  templateUrl: './voice-service.component.html',
  styleUrls: ['./voice-service.component.scss']
})
export class VoiceServiceComponent implements OnInit {
  form: FormGroup;
  reset: boolean;
  loader: boolean = false;
  userDetails: any;
  path: any;
  eventkey: any;
  uniqueId: any;
  voiceConfigurationsteps: any;
  labelName: any;
  subscription: Subscription[] = [];
  submittedForm: boolean = false;
  isUpdate: any = 'false';
  voiceuniquedata: any;
  channel: any;
  dataTemp: any;
  requestObj: any;
  VoiceServiceProvider: any;
  userConfig: any;

  constructor(

    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public common: CommonService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private el: ElementRef,
  ) {Object.assign(this, { masters, regex, voiceConfigurationsteps }); }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');

    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {
      this.loader = false;
      this.router.navigate(['/masters/channel-configuration/voice-configuration/voice-detail', this.path, 'add'])
    }
    else {
      if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
        this.editvoice('edit', this.uniqueId)
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

    this.common.setMasterConfig();
    this.subscription.push(
       this.common.getMasterConfig$.subscribe((data) => {
        this.VoiceServiceProvider = JSON.parse(data["VoiceServiceProvider"]);
        console.log( this.VoiceServiceProvider);

      })
    )
    this.form = this.formBuilder.group({
      SRNNumber: ['', [Validators.required]],
      voiceServiceProvider: ['', [Validators.required]],
      RequestBody: ['',[Validators.required]],
    },
    { validator: [checknull('SRNNumber'),checknull1('SRNNumber'),checknull('RequestBody'),checknull1('RequestBody')] },
    )
  }

  backspace(){
    this.router.navigate(['masters/channel-configuration/voice-configuration/view/'+this.path]);
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
          id: this.path
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

  editvoice(type, uid) {
    this.loader = true
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
      };
    }

    savevoiceservice(event) {
    this.loader = true;
      this.submittedForm = true;
      if (this.form.invalid) {
        this.loader = false;
        this.form.markAllAsTouched()
        for (const key of Object.keys(this.form.controls)) {
          if (this.form.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
          }
        }
        return;
      }
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');


    var keys = Object.keys(this.form.value);
    var values = Object.values(this.form.value);
    let cntr = values.length;
    var updateData = [];
    this.dataTemp.forEach((element, index) => {
      keys.forEach((object, j) => {
        if (element.Key == object) {


          if(element.Key  == "SRNNumber"  || element.Key  =="RequestBody")
          {
            let val : any = values[j]
            values[j] = values[j] == null ? null : values[j] == undefined ? null : val.trim()
            // val.trim()
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
            CHANNELNAME: this.channel?.ChannelName.toUpperCase(),
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
          this.loader = false;
          if (updateData.length == cntr) {
            this.loader = false
            // this.common.snackbar(res.results.data[0].result, "success");
            this.common.snackbar("Saved Success");
            if (event == 'save') {
              this.router.navigate(['masters/channel-configuration/voice-configuration/voice-service', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);            }
            else if (event == 'next') {
              this.router.navigate(['masters/channel-configuration/voice-configuration/telepathy-action', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
            }
          }
          cntr++;
        } else {
          this.loader = false;
        }
      });
    });

  }
ngOnDestroy() {
  if (this.subscription) {
    this.subscription.forEach((e) => {
      e.unsubscribe();
    });
  }
}

}
