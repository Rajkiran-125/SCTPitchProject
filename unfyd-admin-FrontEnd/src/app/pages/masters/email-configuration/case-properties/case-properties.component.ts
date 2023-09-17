import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, regex, countryCode, emailConfigurationsteps, checknull } from 'src/app/global/json-data';



@Component({
  selector: 'app-case-properties',
  templateUrl: './case-properties.component.html',
  styleUrls: ['./case-properties.component.scss']
})
export class CasePropertiesComponent implements OnInit {
  key: any;
  hide = true;
  form: FormGroup;
  loader: boolean = false;
  emailConfigurationsteps: any;
  path: any;
  userDetails: any;
  eventkey: string;
  uniqueId: string;
  channel: any;
  channelType: any;
  chanelid: any;
  emaildata: any;
  emailchannel: any;
  channelData: any = [];
  submittedForm: boolean = false;
  reset: boolean;
  dataTemp: any = [];
  stringJson: any;
  requestObj: any;
  masterConfig:any;
  subscription: Subscription[] = [];
  case_priority:any = [];
  case_category: any = [];
  public filteredList2 = this.case_priority.slice()
  public filteredList1 = this.case_category.slice();
  labelName: any;
  userConfig: any;
  constructor(public common: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private api: ApiService,
    private auth: AuthService,
    private el: ElementRef,)  { Object.assign(this, { masters, regex, countryCode, emailConfigurationsteps }); }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');
    this.getChannel();
    this.getemaillist();
    this.form = this.formBuilder.group({

      Case_Priority: ['', [Validators.required]],
      Case_Category: ['', [Validators.required]],
      Channel_Source: ['', [Validators.required, Validators.pattern(regex.email1)]],
      Ack_Delivery_Notification: [false, Validators.nullValidator],
      Channel_Priority: [false, Validators.nullValidator]

    },{validator: [checknull('Channel_Source')]})
    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.case_priority = JSON.parse(data.CasePriority),
          this.case_category = JSON.parse(data.CaseCategory)
          this.filteredList2 = this.case_priority.slice()
          this.filteredList1 = this.case_category.slice();
        }
      })
    )
    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {
      this.loader = false;
      this.router.navigate(['/masters/channel-configuration/email-configuration/attachment-settings', this.path, 'add'])
    }
    else {
      if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
        this.editemail('edit', this.uniqueId)
      }

    }
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'EmailConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'EmailConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
    }))


  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'EmailConfiguration', data)

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  backspace(): void {

    this.router.navigate(['masters/channel-configuration/email-configuration/view/'+this.path]);
  }
  back(): void{
    this.router.navigate(['masters/channel-configuration/email-configuration/view/'+this.path]);
   }
  getemaillist() {
    this.chanelid = this.activatedRoute.snapshot.paramMap.get('id');
    this.loader = true;
    this.emaildata = {
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
    this.api.post('index', this.emaildata).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        let a: any = [];
        var temp = []

        this.emailchannel = res.results.data;
        this.emailchannel.forEach(element => {
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
        this.stringJson = JSON.parse(JSON.stringify(this.emailchannel));
        this.channelData = a;
      }
    });
    }
    editemail(type, uid) {
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
            if(tmpt[i].ConfigKey == "Ack_Delivery_Notification" || tmpt[i].ConfigKey == "Channel_Priority" )
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

              else  this.form.patchValue({ [tmpt[i].ConfigKey]: tmpt[i].ConfigValue })
              this.dataTemp.push({ 'Key': tmpt[i].ConfigKey, 'Value': tmpt[i].ConfigValue, 'Id': tmpt[i].Id });
              this.form.updateValueAndValidity();
            }
            this.loader = false;

          } else {
            this.loader = false;
          }
        });
      }

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
  saveEmail(event) {
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

          if(element.Key  == "Case_Priority" || element.Key  =="Case_Category" || element.Key  =="Channel_Source" || element.Key  =="Ack_Delivery_Notification" || element.Key == "Channel_Priority" )
          {
            let val : any = values[j]
            values[j] = values[j] == null ? null : values[j] == undefined ? null : val
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
          if (updateData.length - 1 == cntr) {
            this.loader = false
            // this.common.snackbar(res.results.data[0].result, "success");
            this.common.snackbar("Saved Success");
            if (event == 'save') {
              this.router.navigate(['masters/channel-configuration/email-configuration/case-properties', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
            } else  if (event == 'next'){
              this.router.navigate(['masters/channel-configuration/email-configuration/email-settings', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
            }
          }
          cntr++;
        } else {
          this.loader = false;
        }
      });
    });

  }
}
