import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, regex, countryCode, facebookMessengerConfigurationsteps, checknull, checknull1 } from 'src/app/global/json-data';

@Component({
  selector: 'app-facebook-messenger-details',
  templateUrl: './facebook-messenger-details.component.html',
  styleUrls: ['./facebook-messenger-details.component.scss']
})
export class FacebookMessengerDetailsComponent implements OnInit {

  key: any;
  hide = true;
  form: FormGroup;
  loader: boolean = false;
  facebookMessengerConfigurationsteps: any;
  submittedForm: boolean = false;
  path: any;
  userDetails: any;
  requestObj: any;
  eventkey: string;
  uniqueId: string;
  userLanguageName: any = [];
  reset: boolean;
  facebookicon: any = '';
  channel: any;
  isUpdate: any = 'false';
  dataTemp: any[];
  facebookuniquedata: string;
  subscription: Subscription[] = [];
  userConfig: any;
  labelName: any;
  subscriptionAcitivateData: Subscription[] = [];
  @Input() isDialog: boolean = false;


  constructor(public common: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private api: ApiService,
    private auth: AuthService,
    public dialogRef: MatDialogRef<DialogComponent>,

    private el: ElementRef,) {   Object.assign(this, { masters, regex, countryCode, facebookMessengerConfigurationsteps }); }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');

    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {

      this.loader = false;
      this.router.navigate(['/masters/channel-configuration/facebook-messenger/facebook-messenger-details', this.path, 'add'])
    }
    else {
      if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
        this.isUpdate = 'true';
        this.editFacebook('edit', this.uniqueId)
      }
    }
    this.getChannel();
    this.getLanguageStorage()
    // this.getfacebooklist()

    this.form = this.formBuilder.group({
      profilepic: ['', Validators.required],
      ChannelSourceName: ['', [Validators.required]],
      VersionNumber: ['', [Validators.required]],
      SendMessageUrl: ['',[Validators.required, Validators.pattern(regex.urlregexwithhttp)]],
      PageID: ['', [Validators.required]],
      ListOptions: [false, Validators.nullValidator],
      ListOptionslength: ['', Validators.nullValidator],
      NumericButton: [false, Validators.nullValidator],
      QuickReply: [false, Validators.nullValidator],
      QuickReplylength: ['', Validators.nullValidator],
      QuickReplytitlelength: ['',Validators.nullValidator],
      // auth
      PageAccessToken:[''],
      VerifyTokenName:[],

      //database
      DBName: [''],
      UserName: [''],
      Password: [''],
      HostName: [''],
      PortNo: [''],
      IP: [''],

      // api
      SaveIncomingData: [''],
      SaveOutgoingData: [''],
      CreateCustomerAgentSession: [''],
      DeleteCustomerAgentSession: [''],
      ValidateCustomerAgentSession: [''],

      //media
      MediaDownloadAPI: [''],
      StorageLocation: [''],


      // attribute
      ProfileName: [''],
      Time: [''],
      MobileNo: [''],
    },
    { validator: [checknull('ChannelSourceName'),checknull1('ChannelSourceName'),checknull('SendMessageUrl'),checknull1('SendMessageUrl'), checknull('VersionNumber'),checknull1('VersionNumber'), checknull('PageID'),checknull1('PageID'), checknull('ListOptionslength'), checknull('QuickReplylength'), checknull('QuickReplytitlelength') ] },
    )


    this.common.setUserConfig(this.userDetails.ProfileType, 'FaceBookChat');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'FaceBookChat', data)

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
  getLanguage() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        localStorage.setItem("userLanguageName", res.results.data[1][0].UserLanguage);
        this.getLanguageStorage()
      }
    })
  }
  getLanguageStorage() {
    this.loader = true;
    this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName') || '{}');
    if (this.userLanguageName == null || this.userLanguageName == undefined) {
      this.getLanguage();
    } else {
      let chlen = this.userLanguageName.length
      this.userLanguageName.forEach(element => {
        if (element.ChannelName == 'Voice') {
          this.userLanguageName = true;
        }

        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }
  back(): void{
    this.router.navigate(['masters/channel-configuration/facebook-messenger/view/'+this.path]);
  }
  hideChange() {
    this.hide = !this.hide
  }
  editFacebook(type, uid) {
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
          this.dataTemp = [];
          for (var i = 0; i < tmpt.length; ++i) {

            if(tmpt[i].ConfigKey == "QuickReply" || tmpt[i].ConfigKey == "ListOptions" || tmpt[i].ConfigKey == "NumericButton" )
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

          }

          this.form.updateValueAndValidity();
          this.loader = false;
        } else {
          this.loader = false;
        }
      });
    }

  }

  saveFacebook(event): void {
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
            if(key == "profilepic"){
              if(this.form.value.profilepic == "" || this.form.value.profilepic == null){
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
            CHANNELSRCNAME:this.form.value.ChannelSourceName
          }
        }
      }

      this.api.post('index', obj1).subscribe((res: any) => {
        if (res.code == 200) {
          if(res.results.data[0].result == 'success')          {
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
                this.facebookuniquedata = this.channel?.ChannelName.toUpperCase() + dd + mm + yyyy + time;
                for (let i = 0; i < temp.length; i++) {
                  if(temp[i] == "ChannelSourceName" || temp[i] =="VersionNumber"  || temp[i] =="SendMessageUrl" || temp[i] =="PageID")
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
                        uniqueid: this.facebookuniquedata,
                        CHANNELSRCID: ChSrcId
                      }
                    }
                  };
                  this.api.post('index', obj).subscribe((res: any) => {
                    if (res.code == 200) {
                      if (temp.length - 1 == counter) {
                        this.loader = false;
                        if(event == 'save') {this.router.navigate(['masters/channel-configuration/facebook-messenger/facebook-messenger-details', this.activatedRoute.snapshot.paramMap.get('id'), 'update', ChSrcId]);  this.isUpdate = 'true';}
                        else if(event == 'next')this.router.navigate(['masters/channel-configuration/facebook-messenger/facebook-messenger-auth', this.activatedRoute.snapshot.paramMap.get('id'), 'update', ChSrcId]);
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
              //   this.common.snackbar("ChannelSourceName Exists");
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
                            CHANNELSRCNAME: this.form.value.ChannelSourceName,
                           
      
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
                            this.router.navigate(['masters/channel-configuration/facebook-messenger/view/'+this.path]);
    
                          } 
                          if (event == 'next') {
                            if (this.isDialog == true) {
                              this.dialogRef.close(true);
    
                            }
                            this.router.navigate(['masters/channel-configuration/facebook-messenger/view/'+this.path]);
    
                          } 
                        }
                      });
      
                    }
      
                    this.subscriptionAcitivateData.forEach((e) => {
                      e.unsubscribe();
                    });
                  }))
      
              }
          }
        else {
          this.loader = false;
        }
      });
    }
    else if (this.isUpdate.toUpperCase() === 'TRUE') {
      if (this.form.invalid) {
        this.loader = false;
        this.form.markAllAsTouched()
        for (const key of Object.keys(this.form.controls)) {
          if(key == "profilepic"){
            if(this.form.value.profilepic == "" || this.form.value.profilepic == null){
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
      var keys = Object.keys(this.form.value);
      var values = Object.values(this.form.value);
      let counter = values.length;
      var updateData = [];
      this.dataTemp.forEach((element, index) => {
        keys.forEach((object, j) => {

          if (element.Key == object) {

            if(element.Key  == "ChannelSourceName" || element.Key  =="VersionNumber"|| element.Key  =="SendMessageUrl" || element.Key  =="PageID")
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
        this.api.post('index', obj).subscribe((res: any) => {
          if (res.code == 200) {
            counter--;
            if (counter == 0) {
              this.loader = false
              this.common.snackbar("Saved Success");
              if(event == 'save') this.router.navigate(['masters/channel-configuration/facebook-messenger/facebook-messenger-details', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);
              else if(event == 'next')this.router.navigate(['masters/channel-configuration/facebook-messenger/facebook-messenger-auth', this.activatedRoute.snapshot.paramMap.get('id'), 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);

            }
          } else {
            this.loader = false;
          }
        });
      });

    }
  }

  onButtonSelected() {
    if (this.form.value.QuickReply) {
      this.form.get('QuickReplylength').setValidators(Validators.required);
      this.form.get('QuickReplylength').updateValueAndValidity()
      this.form.get('QuickReplytitlelength').setValidators(Validators.required);
      this.form.get('QuickReplytitlelength').updateValueAndValidity()

    }
    else {
      this.form.get('QuickReplylength').setValidators(Validators.nullValidator);
      this.form.get('QuickReplylength').updateValueAndValidity()
      this.form.get('QuickReplytitlelength').setValidators(Validators.nullValidator);
      this.form.get('QuickReplytitlelength').updateValueAndValidity()
    }
  }
  onButtonSelected2() {
    if (this.form.value.ListOptions) {
      this.form.get('ListOptionslength').setValidators(Validators.required);
      this.form.get('ListOptionslength').updateValueAndValidity()
    }
    else {
      this.form.get('ListOptionslength').setValidators(Validators.nullValidator);
      this.form.get('ListOptionslength').updateValueAndValidity()
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



   resetFunc(){
    this.submittedForm = false;
    this.form.reset()
   }
}

