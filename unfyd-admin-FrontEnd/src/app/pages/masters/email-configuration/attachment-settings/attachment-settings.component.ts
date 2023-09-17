import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { masters, regex, countryCode, emailConfigurationsteps, checknull } from 'src/app/global/json-data';


@Component({
  selector: 'app-attachment-settings',
  templateUrl: './attachment-settings.component.html',
  styleUrls: ['./attachment-settings.component.scss']
})
export class AttachmentSettingsComponent implements OnInit {
  key: any;
  hide = true;
  form: FormGroup;
  requestObj: any;
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
  subscription: Subscription[] = [];
  Email_Extension:any = [];
  filteredList1:any = [];
  extensionRequired:boolean = false;
  errorval:boolean = false;
  userConfig: any;
  labelName: any;
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

      Max_Attachment_Size: ['', Validators.required],
      Allowed_Extension: ['',[Validators.required]],
      MIME_Type: ['', [Validators.required]],
      Allow_Attachment: [false, Validators.nullValidator]

    },{validator: [checknull('MIME_Type')]
    })
    this.filteredList1 = this.Email_Extension.slice()
    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.Email_Extension = JSON.parse(data.EmailExtension),
          this.filteredList1 = this.Email_Extension.slice();
        }
      })
    )
    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {
      this.loader = false;
      this.router.navigate(['/masters/channel-configuration/email-configuration/account-credentials', this.path, 'add'])
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
            if(tmpt[i].ConfigKey == "Allowed_Extension"){
              this.form.patchValue({ [tmpt[i].ConfigKey]: (tmpt[i].ConfigValue).split(",") })
            }
            else if(tmpt[i].ConfigKey == "Allow_Attachment" )
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
            else this.form.patchValue({ [tmpt[i].ConfigKey]: tmpt[i].ConfigValue })
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
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  backspace(): void {

    this.router.navigate(['masters/channel-configuration/email-configuration/view/'+this.path]);
  }
  back(): void{
    this.router.navigate(['masters/channel-configuration/email-configuration/view/'+this.path]);
   }


  saveEmail(event) {
    this.loader = true;
    this.submittedForm = true;
      // if( this.form.value.Allowed_Extension != '' || (this.form.value.Allowed_Extension.length == 0 && (this.form.value.Allowed_Extension.length>0 && !this.form.value.Allowed_Extension[0]))) {
      //   this.form.controls['Allowed_Extension'].patchValue('')
      //   console.log(this.form.value.Allowed_Extension,'this.form.value.Allowed_Extension')
      // }
      // if(key == "Allowed_Extension")
      // {
     
      // }

    if (this.form.invalid) {
      this.loader = false;
      this.form.markAllAsTouched()

      if(this.form.value.Allowed_Extension.length <= 1 )
      {
        this.loader = false;
        // this.common.snackbar('FooterIsRequired');
        this.extensionRequired = true;
      }

      for (const key of Object.keys(this.form.controls)) {


        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }

      }
      return;
    }

    console.log(this.form.value.Allowed_Extension.length);

    if(this.form.value.Allowed_Extension.length <= 1 )
    {
      this.loader = false;
      // this.common.snackbar('FooterIsRequired');
      this.extensionRequired = true;
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
          if(element.Key  =="MIME_Type" )
          {
            let val : any = values[j]
            values[j] = values[j] == null ? null : values[j] == undefined ? null : val.trim()
          }
          else if(element.Key  =="Allowed_Extension"){let val : any = values[j]
            values[j] = values[j] == null ? null : values[j] == undefined ? null : val.join(",") }
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
            this.common.snackbar("Saved Success");
            if (event == 'save') {
              this.router.navigate(['masters/channel-configuration/email-configuration/attachment-settings', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
            } else if (event == 'next') {
              this.router.navigate(['masters/channel-configuration/email-configuration/case-properties', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
            }
          }
          cntr++;
        } else {
          this.loader = false;
        }
      });
    });

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
  ifselectall(e, val) {
    if (e.includes(0) && this.form.value.Allowed_Extension.length >= this.filteredList1.length) {
      if (this.form.value.Allowed_Extension.includes(0)) {
        for (var i = 0; i < this.form.value.Allowed_Extension.length; i++) {
          if (this.form.value.Allowed_Extension[i] == 0) {
            let a = []
            a = this.form.value.Allowed_Extension
            a.splice(a.indexOf(0), 1);
            this.form.controls.Allowed_Extension.patchValue(a);
            this.form.get('Allowed_Extension').updateValueAndValidity()
            this.form.updateValueAndValidity();
           }
        }
      }
    }
  }
  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.form.controls['Allowed_Extension'].patchValue(this.filteredList1.map(item => item.Key));
      this.form.updateValueAndValidity()

    } else {
      this.form.controls['Allowed_Extension'].patchValue('');
      this.form.updateValueAndValidity()
    }
  }

}
