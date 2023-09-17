import { Component, OnInit, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull, checknull1, masters, regex, viberConfigurationsteps, } from 'src/app/global/json-data';

@Component({
  selector: 'app-viber-database',
  templateUrl: './viber-database.component.html',
  styleUrls: ['./viber-database.component.scss']
})
export class ViberDatabaseComponent implements OnInit {

  form: FormGroup;
  reset: boolean;
  loader: boolean = false;
  path: any;
  eventkey: any;
  uniqueId: any;
  subscription: Subscription[] = [];
  requestObj: any;
  channel: any;
  viberConfigurationsteps: any;
  userDetails: any;
  submittedForm: boolean = false;
  dataTemp: any;
  isUpdate: any = 'false';
  hide = true;
  labelName: any;
  userConfig: any;



  constructor(
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public common: CommonService,
    private formBuilder: FormBuilder,
    private el: ElementRef,)  { Object.assign(this, { masters, viberConfigurationsteps, regex }); }

  ngOnInit(): void {

    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');

    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {

      this.loader = false;
      this.router.navigate(['/masters/channel-configuration/viber-configuration/viber-details', this.path, 'add'])
    }
    else {
      if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
        this.isUpdate = 'true';
        this.editViber('edit', this.uniqueId)
      }
    }
    this.common.setUserConfig(this.userDetails.ProfileType, 'ViberConfiguration');
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

    this.form = this.formBuilder.group({
      DBName: ['', [Validators.required]],
      HostName: ['', [Validators.required]],
      IP: ['', [Validators.required, Validators.pattern(regex.ipaddress)]],
      PortNo: ['', [Validators.required]],
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
    },
    { validator: [checknull('DBName'),checknull1('DBName'),checknull('HostName'),checknull1('HostName'),checknull('IP'),checknull('PortNo'),checknull1('UserName'),checknull('Password')] },);

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  backspace(){
    this.router.navigate(['masters/channel-configuration/viber-configuration/view/'+this.path]);
  }

  back(){
    this.router.navigate(['masters/channel-configuration/viber-configuration/view/'+this.path]);
  }

  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1

      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ViberConfiguration', data);
  }

  hideChange() {
    this.hide = !this.hide
  }

  editViber(type, uid) {
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

  SaveViber(event){
    // this.router.navigate(['masters/channel-configuration/viber-configuration/viber-attributeMapping/40/add']);
    // this.router.navigate(['masters/channel-configuration/viber-configuration/viber-authType', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
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

          if(element.Key  == "DBName" || element.Key  == "HostName" || element.Key  == "IP" || element.Key  == "PortNo" || element.Key  == "UserName" || element.Key  == "Password")
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
            this.common.snackbar("Saved Success");
            if (event == 'save') {
              this.router.navigate(['masters/channel-configuration/viber-configuration/viber-database', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
            }
           else if (event == 'next') {
              this.router.navigate(['masters/channel-configuration/viber-configuration/viber-attributeMapping', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
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
