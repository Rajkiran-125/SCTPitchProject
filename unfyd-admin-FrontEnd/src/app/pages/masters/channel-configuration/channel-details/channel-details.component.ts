import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, regex, countryCode, channelConfigurationSteps, checknull } from 'src/app/global/json-data';




declare const require: any;

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

@Component({
  selector: 'app-channel-details',
  templateUrl: './channel-details.component.html',
  styleUrls: ['./channel-details.component.scss']
})
export class ChannelDetailsComponent implements OnInit {
  channelvalue:any = []
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
  countryCode: any = [];
  localizationData:any;
  localizationDataAvailble:boolean  = false;
  allowedISD:any = [];
  countryCodeSelected: any = {};
  subscription: Subscription[] = [];
  labelName: any;
  countryjson: any;
  phminlength: any;
  phmaxlength: any;
  phone: any;
  phvalid: boolean;
  proper: boolean;
  userConfig: any;
  subscriptionAcitivateData: Subscription[] = [];
  @Input() isDialog: boolean = false;

  constructor(public common: CommonService,    public dialogRef: MatDialogRef<DialogComponent>,
    private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private api: ApiService, private auth: AuthService, private el: ElementRef,)
  { Object.assign(this, { masters, regex, countryCode, channelConfigurationSteps }); }


  ngOnInit(): void {
    this.common.hubControlEvent('ChannelConfiguration','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.getchannelvalue()
    this.countryCodeSelected = this.countryCode[95];
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
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
    this.common.localizationDataAvailable$.subscribe((res)=>{
      this.localizationDataAvailble = res;
    })
    this.common.localizationInfo$.subscribe((res1)=>{
      this.localizationData = res1;
      if(this.localizationDataAvailble){
        if((this.localizationData.allowedISD).length > 0){
          this.allowedISD = this.localizationData.allowedISD.split(",")
        }
      }
    })

    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');

    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {

      this.loader = false;
      this.router.navigate(['/masters/channel-configuration/channel-details', this.path, 'add'])
    }
    else {
      if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
        this.isUpdate = 'true';
        this.editwhatsapp('edit', this.uniqueId)
      }
    }

    this.getChannel();
    this.getWhatsapplist();
    this.form = this.formBuilder.group({
      iconColor:['', [Validators.required]],
      WhatsApp_Provider: ['', [Validators.required]],
      Channel_Source_Name: ['', [Validators.required,Validators.pattern(regex.alphnumericWithHyphen)]],
      Version_Number: ['', [Validators.required]],
      countrycode: [this.countryCode[95], Validators.required],
      contactnumber: ['', Validators.required],
      Auth_Type: ['basic'],
      tokenValidityDuration:[''],
      Enable_Auto_Download:[],
      Send_HSM: [''],
      storeHSM: [''],
      Profile_Name: [''],
      Time: [''],
      Mobile_No: [''],
      DB_Name: [''],
      DB_Username: [''],
      DB_Password: [''],
      Host_Name: [''],
      Port_No: [''],
      IP: [''],
      source: [''],
      Send_Message_Length: [''],
      Send_Message_URL: [''],
      Enable_Quick_Reply: [''],
      Quick_Reply_Length: [''],
      Quick_Reply_Title_Length: [''],
      Quick_Reply_URL: [''],
      Enable_List_Options: [''],
      List_Options_URL: [''],
      List_Options_Length: [''],
      authtoken: [''],
      Token_URL: [''],
      Token_Username: [''],
      Token_Password: [''],
      Token_Transaction_API: [''],
      customerattribute: [''],
      Save_Incoming_Data: [''],
      Save_Outgoing_Data: [''],
      Create_Customer_Agent_Session: [''],
      Delete_Customer_Agent_Session: [''],
      Validate_Customer_Agent_Session: [''],
      Media_Download_API: [''],
      Authentication_API: [''],
      Storage_Location: ['']

    },
    {validator:[checknull('Channel_Source_Name'),checknull('Version_Number')]},
    )
    this.common.hubControlEvent('ChannelConfiguration','click','pageloadend','pageloadend','','ngOnInit');

  }
  Changelogo(event) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',event,'ngOnInit');

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
  get w(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  Reset(){
    this.form.reset()
    setTimeout(() => {
      this.form.patchValue({
        countrycode:this.countryCode[95],
        languagecode:['en'] })

    });

  }

  savewhatsapp(event) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',event,'savewhatsapp');

    // this.loader = true
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    if (this.isUpdate.toUpperCase() === 'FALSE') {

      // this.loader = true;
      this.submittedForm = true;
      if (this.form.invalid) {
        this.loader = false;
        this.form.markAllAsTouched()
        for (const key of Object.keys(this.form.controls)) {
          if (this.form.controls[key].invalid) {
            if(key == "iconColor"){
              if(this.form.value.iconColor == "" || this.form.value.iconColor == null){
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
            CHANNELSRCNAME:this.form.value.Channel_Source_Name
          }
        }
      }
      this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj1),'savewhatsapp');

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
                              temp2[temp.indexOf('countrycode')] = this.countryCodeSelected.dial_code
                              let counter = 0;
                              this.emailuniquedata = this.channel?.ChannelName.toUpperCase() + dd + mm + yyyy + time;
                              for (let i = 0; i < temp.length; i++) {
                                if(temp[i] == "Channel_Source_Name" || temp[i] =="Version_Number")
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
                                      uniqueid: this.emailuniquedata,
                                      CHANNELSRCID: ChSrcId
                                    }
                                  }
                                };
                                this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj),'savewhatsapp');

                                this.api.post('index', obj).subscribe((res: any) => {
                                  if (res.code == 200) {
                                    if (temp.length - 1 == counter) {
                                      this.loader = false;
                                      if(event == 'save') {this.router.navigate(['/masters/channel-configuration/channel-details', this.path, 'update', ChSrcId]);  this.isUpdate = 'true'}
                                      else if(event == 'next') this.router.navigate(['masters/channel-configuration/channel-api-provider', this.path, 'update', ChSrcId]);
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
                            CHANNELSRCNAME: this.form.value.Channel_Source_Name,
                           
      
                          }
                        }
                      };
                      // this.common.hubControlEvent('Skills', 'click', 'ACTIVATE_BROADCAST', '', JSON.stringify(this.requestObj), 'submit');
      
                      this.api.post('index', this.requestObj).subscribe((res: any) => {
                        if (res.code == 200) {
                          this.common.snackbar('Record add');
                          if (event == 'save') {
                            if (this.isDialog == true) {
                              this.dialogRef.close(true);
    
                            }
                            this.router.navigate(['masters/channel-configuration/configuration-add-channel/' + this.path]);
    
                          } 
                          if (event == 'next') {
                            if (this.isDialog == true) {
                              this.dialogRef.close(true);
    
                            }
                            this.router.navigate(['masters/channel-configuration/configuration-add-channel/' + this.path]);
    
                            // else {
                            //   this.router.navigate(['masters/broadcast/view',], { queryParams: { Product: this.productName } })
                            // }
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
      this.loader = true;
      this.submittedForm = true;
      if (this.form.invalid) {
        this.loader = false;
        this.form.markAllAsTouched()
        for (const key of Object.keys(this.form.controls)) {
          if (this.form.controls[key].invalid) {
            if(key == "iconColor"){
              if(this.form.value.iconColor == "" || this.form.value.iconColor == null){
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
      values[keys.indexOf('countrycode')] = this.countryCodeSelected.dial_code
      let counter = values.length;
      var updateData = [];
      this.dataTemp.forEach((element, index) => {
        keys.forEach((object, j) => {
          if (element.Key == object) {

            if(element.Key  == "Channel_Source_Name" || element.Key  =="Version_Number")
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
        this.common.hubControlEvent('ChannelConfiguration','click','UPDATE','',JSON.stringify(obj),'savewhatsapp');

        this.api.post('index', obj).subscribe((res: any) => {
          if (res.code == 200) {
            counter--;
            if (counter == 0) {
              this.loader = false
              this.common.snackbar("Saved Success");
              if(event == 'save') {this.router.navigate(['/masters/channel-configuration/channel-details', this.path, 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]); this.isUpdate = true}
             else if(event == 'next') this.router.navigate(['masters/channel-configuration/channel-api-provider', this.path, 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);


            }
          } else {
            this.loader = false;
          }
        });
      });

    }
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
      this.common.hubControlEvent('ChannelConfiguration','click','UPDATE','',JSON.stringify(obj),'editwhatsapp');

      this.api.post('index', obj).subscribe(res => {
        this.reset = true;

        if (res.code == 200) {
          var tmpt = res.results.data;

          this.dataTemp = [];
          for (var i = 0; i < tmpt.length; ++i) {

            if(tmpt[i].ConfigKey == 'countrycode'){
              const variableOne = this.countryCode.filter(item => item.dial_code == tmpt[i].ConfigValue);
              this.form.patchValue({ [tmpt[i].ConfigKey]: variableOne[0] })

              let countrycodevalue = variableOne[0].dial_code
              const index = this.countryCode.findIndex(object => {
                 return object.dial_code == countrycodevalue
                });
              this.countryCodeSelected = this.countryCode[index];

            } else{
              this.form.patchValue({ [tmpt[i].ConfigKey]: tmpt[i].ConfigValue })
            }
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
            temp.push({ [myArray[i].ConfigKey]: myArray[i].ConfigValue });
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


  getWhatsappVender() {
    this.chanelid = this.activatedRoute.snapshot.paramMap.get('id');
    this.loader = true;
    this.whtsdata = {
      data: {
        spname: 'usp_unfyd_channel_config ',
        parameters: {
          flag: "GET_VENDER_DATA",
          processid: this.userDetails.Processid,
          uniqueId: 1,
        }
      }
    };
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(this.whtsdata),'getWhatsappVender');

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

  getchannelvalue(){
    this.requestObj={
      data:{
        spname:"USP_RULEMASTER_PROC",
        parameters:{
          flag:"CHANNELSOURCE",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(this.requestObj),'getchannelvalue');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.channelvalue = res.results['data'];
    })
  }

  numericOnly(e): boolean {
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(e),'numericOnly');

    const charCode = (e.which) ? e.which : e.keyCode;
    if (charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43 ||
      charCode === 33 || charCode === 35 || charCode === 47 || charCode === 36 ||
      charCode === 37 || charCode === 38 || charCode === 40 || charCode === 41 || charCode === 42
      || charCode > 47 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (e.target.value.length >= 20) {
      return false;
    }
    return true;
  }





  valPhone(e) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(e),'valPhone');
    let countryjsonvalphone = e;
    this.countryjson  = countryjsonvalphone;
    let phonelength =   this.countryjson.max_length
    this.phminlength =  phonelength[0]
    this.phmaxlength =   phonelength[phonelength.length-1]
    let regex =  this.countryjson.regex
    let phone = this.phone;
    if (phone.length > 1) {
        if(regex == undefined || null)
        {
          this.form.controls['contactnumber'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength)]);
        }
        else{
          // this.form.controls['contactnumber'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength), Validators.pattern(regex)]);
          this.form.controls['contactnumber'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength)]);
        }
      }
      let countrycodeEN = this.countryjson.country_code
      let isValid = false;
      if( this.form.controls['contactnumber'].status !== "INVALID")
      {
        const number = phoneUtil.parseAndKeepRawInput(phone, countrycodeEN.toUpperCase());
        isValid = phoneUtil.isValidNumberForRegion(number, countrycodeEN.toUpperCase());
        this.phvalid = isValid
         this.form.get('contactnumber').markAsTouched();
      }
      this.form.get('contactnumber').markAsTouched();
  if (phone.length >= 10) {
      this.proper = true;
      return true;
    } else {
      this.proper = false;
    }
    return false;
  }

  selectCountry(value) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(value),'selectCountry');

    this.countryCodeSelected = value;
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}

