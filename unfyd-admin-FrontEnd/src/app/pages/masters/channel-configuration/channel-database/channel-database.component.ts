import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { channelConfigurationSteps, checknull, masters, regex } from 'src/app/global/json-data';

@Component({
  selector: 'app-channel-database',
  templateUrl: './channel-database.component.html',
  styleUrls: ['./channel-database.component.scss']
})
export class ChannelDatabaseComponent implements OnInit {
  key: any;
  form: FormGroup;
  loader: boolean = false;
  path: any;
  uniqueId: any;
  local: any;
  requestObj: any;
  whtsdata: any;
  userDetails: any;
  channel: any;
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
  editObj: any;
  eventkey: any;
  isUpdate: any = 'false';
  subscription: Subscription[] = [];
  labelName: any;
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
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'ChannelConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))

    this.setLabelByLanguage(localStorage.getItem("lang"))
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

      DB_Name: ['', [Validators.required]],
      DB_Username: ['', [Validators.required,Validators.pattern(regex.alphanumericwithspecialcharacter)]],
      DB_Password: ['', [Validators.required,Validators.pattern(regex.alphanumericwithspecialcharacter)]],
      Host_Name: ['', [Validators.required,Validators.pattern(regex.alphanumericwithspecialcharacter)]],
      Port_No: ['', [Validators.required]],
      IP: ['', [Validators.required]]
    },
    {validator:[checknull('DB_Name'),checknull('DB_Username'),checknull('DB_Password'),checknull('Host_Name'),checknull('Port_No'),checknull('IP')]}
    )
    //}
    this.common.hubControlEvent('ChannelConfiguration','click','pageloadend','pageloadend','','ngOnInit');

  }
  Changelogo(event) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',event,'Changelogo');

    this.whatsappicon = event
  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ChannelConfiguration', data)

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  get w(): { [key: string]: AbstractControl } {
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

    this.isUpdate = 'true';
    var keys = Object.keys(this.form.value);
    var values = Object.values(this.form.value);
    let cntr = 0;
    var updateData = [];
    this.dataTemp.forEach((element, index) => {
      keys.forEach((object, j) => {
        if (element.Key == object) {

              let val : any = values[j]
              values[j] = values[j] == null ? null : values[j] == undefined ? null : val.trim()

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
            if(event == 'save') {this.router.navigate(['/masters/channel-configuration/channel-database', this.path, 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);}
             else if(event == 'next') this.router.navigate(['masters/channel-configuration/channel-attribute-mapping', this.path, 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);

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
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(this.whtsdata),'getWhatsapplist');

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
          id: parseInt(this.path)
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
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
