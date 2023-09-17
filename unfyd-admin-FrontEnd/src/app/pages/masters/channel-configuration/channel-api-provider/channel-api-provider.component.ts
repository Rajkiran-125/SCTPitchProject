import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, regex, channelConfigurationSteps, checknull } from 'src/app/global/json-data';

@Component({
  selector: 'app-channel-api-provider',
  templateUrl: './channel-api-provider.component.html',
  styleUrls: ['./channel-api-provider.component.scss']
})
export class ChannelApiProviderComponent implements OnInit {
  channelname: any = '';
  key: any;
  form: FormGroup;
  loader: boolean = false;
  path: any;
  local: any;
  requestObj: any;
  whtsdata: any;
  userDetails: any;
  channel: any;
  channelType: any;
  chanelid: any;
  whtsachannel: any = [];
  array: any = [];
  uniquedata: any;
  emailuniquedata: any;
  stringJson: any;
  channelData: any = [];
  reset: boolean;
  dataTemp: any = [];
  channelConfigurationSteps: any;
  submittedForm: boolean = false;
  whatsappchanelform: FormGroup;
  whatsappicon: any = '';
  hide = true;
  hide1 = true;
  hide2 = true;
  isDropDown: boolean;
  editwts: boolean = false;
  uniqueId: any;
  eventkey: any;
  isUpdate: any = 'false';
  labelName: any;
  subscription: Subscription[] = [];
  userConfig: any;
  constructor(private common: CommonService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private api: ApiService, private auth: AuthService, private el: ElementRef,) { Object.assign(this, { masters, regex, channelConfigurationSteps }); }


  ngOnInit(): void {
    this.common.hubControlEvent('ChannelConfiguration','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'ChannelConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))

    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {
      this.loader = false;
      this.router.navigate(['masters/channel-configuration/channel-details', this.path, 'add'])
    }
    else {
      if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
        this.editwhatsapp('edit', this.uniqueId)
      }

    }

    this.getChannel();
    this.getWhatsapplist();

    this.form = this.formBuilder.group({
      Auth_Type: [, [Validators.required]],
      Send_Message_Length: ['', [Validators.required,Validators.pattern(regex.numeric)]],
      Send_Message_URL: ['', [Validators.required,Validators.pattern(regex.urlregexwithhttp)]],

      Enable_Quick_Reply: [false, [Validators.nullValidator]],
      Quick_Reply_Length: ['', [Validators.nullValidator]],
      Quick_Reply_Title_Length: ['', [Validators.nullValidator]],
      Quick_Reply_URL: ['', [Validators.nullValidator,Validators.pattern(regex.urlregexwithhttp)]],

      Enable_List_Options: [false, [Validators.nullValidator]],
      List_Options_URL: ['', [Validators.nullValidator,Validators.pattern(regex.urlregexwithhttp)]],
      List_Options_Length: ['', [Validators.nullValidator]],


      authtoken: ['', [Validators.nullValidator]],

      Token_URL: ['', [Validators.nullValidator,Validators.pattern(regex.urlregexwithhttp)]],
      Token_Username: ['', [Validators.nullValidator]],
      Token_Password: ['', [Validators.nullValidator]],
      tokenValidityDuration: ['', [Validators.nullValidator]],
      Token_Transaction_API: ['', [Validators.nullValidator]],
    },
    {validator:[checknull('Send_Message_URL')]}
    // {validator:[checknull('Send_Message_URL'),checknull('Quick_Reply_URL'),checknull('List_Options_URL'),checknull('Token_URL'),checknull('Token_Transaction_API'),checknull('Token_Username'),checknull('Token_Password')]}
    )

    this.changeListOptions();
    this.changeQuickReply();
    this.changeAuthType();
        this.common.hubControlEvent('ChannelConfiguration','click','pageloadend','pageloadend','','ngOnInit');

  }


  checknull(control:AbstractControl){
    if(control.value !== "")
    {
      if (control.value.trim(' ').length === 0) {
        return { checknull: true };
      }
      else {
        control.setErrors(null);
        }
      }
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',data,'ngOnInit');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        // (data1);
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ChannelConfiguration', data)

  }
  Changelogo(event) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',event,'Changelogo');

    this.whatsappicon = event
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }



  savewhatsapp(event) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',event,'savewhatsapp');



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
    let cntr = 0;
    var updateData = [];
    this.dataTemp.forEach((element, index) => {
      keys.forEach((object, j) => {
        if (element.Key == object) {


          if(element.Key  == "Send_Message_URL" || element.Key  =="Quick_Reply_URL" || element.Key  =="List_Options_URL" || element.Key  =="authtoken" ||
          element.Key  == "Token_URL" || element.Key  =="Token_Username" || element.Key  =="Token_Password" || element.Key  =="Token_Transaction_API")
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
      this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj),'savewhatsapp');

      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
          this.loader = false;
          if (updateData.length - 1 == cntr) {
            this.loader = false
            this.common.snackbar("Update Success");
            if(event == 'save') {this.router.navigate(['/masters/channel-configuration/channel-api-provider', this.path, 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);}
             else if(event == 'next') this.router.navigate(['masters/channel-configuration/channel-data-management', this.path, 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);

          }
          cntr++;
        } else {
          this.loader = false;
        }
      });
    });

  }


  editwhatsapp(type, uid) {
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
      this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj),'editwhatsapp');

      this.api.post('index', obj).subscribe(res => {
        this.reset = true;
        if (res.code == 200) {
          var tmpt = res.results.data;

          this.dataTemp = [];
          for (var i = 0; i < tmpt.length; ++i) {


            if(tmpt[i].ConfigKey == "Enable_Quick_Reply" || tmpt[i].ConfigKey == "Enable_List_Options")
            {
              if(tmpt[i].ConfigValue.toLowerCase() == "true")
              {
                this.form.patchValue({ [tmpt[i].ConfigKey]: true })
              }
              if(tmpt[i].ConfigValue.toLowerCase() == "false")
              {
                this.form.patchValue({ [tmpt[i].ConfigKey]: false })
              }
            }
            else{
              this.form.patchValue({ [tmpt[i].ConfigKey]: tmpt[i].ConfigValue })
            }
            // this.form.patchValue({ [tmpt[i].ConfigKey]: tmpt[i].ConfigValue })


            this.dataTemp.push({ 'Key': tmpt[i].ConfigKey, 'Value': tmpt[i].ConfigValue, 'Id': tmpt[i].Id });

            if(tmpt[i].ConfigKey == 'Auth_Type')
            {
              this. changeAuthType();
            }
          }
          this.loader = false;

          // this.form.patchValue({ Enable_Quick_Reply: "false" })
          // this.form.patchValue({ Enable_List_Options: "false" })

          this.form.updateValueAndValidity();
        } else {
          this.loader = false;
        }
      });
    }

  }

  get w(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getWhatsapplist() {
    this.chanelid = this.activatedRoute.snapshot.paramMap.get('id');
    this.loader = true;
    this.whtsdata = {
      data: {
        spname: 'usp_unfyd_channel_config ',
        parameters: {
          flag: "GET_CHANNEL_DATA",
          processid: this.userDetails.Processid,
          productid: 1,
          CHANNELID: parseInt(this.chanelid),

        }
      }
    };
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify( this.whtsdata),'getWhatsapplist');

    this.api.post('index', this.whtsdata).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        let a: any = [];
        var temp = []

        this.whtsachannel = res.results.data;
        this.whtsachannel.forEach(element => {
          var myArray = JSON.parse(element.ChannelData)
          for (var i = 0; i < myArray.length; ++i) {
            temp.push({ [myArray[i].ConfigKey]: myArray[i].ConfigValue })
          }
          let obj = temp.reduce(function (acc, val) {
            return Object.assign(acc, val);
          }, {});
          let x = {
            UniqueId: element.UniqueId,
            value: obj
          }
          a.push(x)

        });
        this.stringJson = JSON.parse(JSON.stringify(this.whtsachannel));
        this.channelData = a;
      }
    });


  }


  back(): void {
    this.common.hubControlEvent('ChannelConfiguration','click','back','back','','back');

    this.router.navigate(['masters/channel-configuration/configuration-add-channel/'+this.path]);
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
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(this.requestObj),'getChannel');

    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        this.channel = res.results.data[0];
      }
    });
  }
  Changechannel(event) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',event,'Changechannel');

    this.channelname = event
  }
  changeAuthType(){
    if(this.form.value.Auth_Type == null || this.form.value.Auth_Type == undefined)
    {this.form.patchValue({Auth_Type :'basic'})
    this.form.updateValueAndValidity()}

    if(this.form.value.Auth_Type == 'basic'){
      this.form.get("authtoken").setValidators(Validators.required);
      this.form.get("authtoken").updateValueAndValidity()
      this.form.get("Token_URL").setValidators(Validators.nullValidator);
      this.form.get("Token_URL").updateValueAndValidity()
      this.form.get("Token_Username").setValidators(Validators.nullValidator);
      this.form.get("Token_Username").updateValueAndValidity()
      this.form.get("Token_Password").setValidators(Validators.nullValidator);
      this.form.get("Token_Password").updateValueAndValidity()
      this.form.get("tokenValidityDuration").setValidators(Validators.nullValidator);
      this.form.get("tokenValidityDuration").updateValueAndValidity()
      this.form.get("Token_Transaction_API").setValidators(Validators.nullValidator);
      this.form.get("Token_Transaction_API").updateValueAndValidity()
    } else{
      this.form.get("authtoken").setValidators(Validators.nullValidator);
      this.form.get("authtoken").updateValueAndValidity()
      this.form.get("Token_URL").setValidators([Validators.required,this.checknull.bind(this),Validators.pattern(regex.urlregexwithhttp)]);
      this.form.get("Token_URL").updateValueAndValidity()
      this.form.get("Token_Username").setValidators([Validators.required,this.checknull.bind(this)]);
      this.form.get("Token_Username").updateValueAndValidity()
      this.form.get("Token_Password").setValidators([Validators.required,this.checknull.bind(this)]);
      this.form.get("Token_Password").updateValueAndValidity()
      this.form.get("tokenValidityDuration").setValidators([Validators.required,this.checknull.bind(this)]);
      this.form.get("tokenValidityDuration").updateValueAndValidity()
      this.form.get("Token_Transaction_API").setValidators([Validators.required,this.checknull.bind(this)]);
      this.form.get("Token_Transaction_API").updateValueAndValidity()
    }

    this.common.hubControlEvent('ChannelConfiguration','click','','','','changeAuthType');

  }

  changeQuickReply(){
    this.common.hubControlEvent('ChannelConfiguration','click','','','','changeQuickReply');

    if(this.form.value.Enable_Quick_Reply){
      this.form.get("Quick_Reply_Length").setValidators(Validators.required);
      this.form.get("Quick_Reply_Length").updateValueAndValidity()
      this.form.get("Quick_Reply_Title_Length").setValidators(Validators.required);
      this.form.get("Quick_Reply_Title_Length").updateValueAndValidity()
      this.form.get("Quick_Reply_URL").setValidators([Validators.required,this.checknull.bind(this)]);
      this.form.get("Quick_Reply_URL").updateValueAndValidity()
    } else{
      this.form.get("Quick_Reply_Length").setValidators(Validators.nullValidator);
      this.form.get("Quick_Reply_Length").updateValueAndValidity()
      this.form.get("Quick_Reply_Title_Length").setValidators(Validators.nullValidator);
      this.form.get("Quick_Reply_Title_Length").updateValueAndValidity()
      this.form.get("Quick_Reply_URL").setValidators(Validators.nullValidator);
      this.form.get("Quick_Reply_URL").updateValueAndValidity()
    }
  }

  changeListOptions(){
    this.common.hubControlEvent('ChannelConfiguration','click','','','','changeListOptions');

    if(this.form.value.Enable_List_Options){
      this.form.get("List_Options_URL").setValidators([Validators.required,this.checknull.bind(this),Validators.pattern(regex.urlregexwithhttp)]);
      this.form.get("List_Options_URL").updateValueAndValidity()
      this.form.get("List_Options_Length").setValidators(Validators.required);
      this.form.get("List_Options_Length").updateValueAndValidity()
    } else{
      this.form.get("List_Options_URL").setValidators(Validators.nullValidator);
      this.form.get("List_Options_URL").updateValueAndValidity()
      this.form.get("List_Options_Length").setValidators(Validators.nullValidator);
      this.form.get("List_Options_Length").updateValueAndValidity()
    }
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
}
