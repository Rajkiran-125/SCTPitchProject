import { Component, OnInit, ElementRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { log } from 'console';
import { Subscription } from 'rxjs/internal/Subscription';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull, checknull1, masters, regex, voiceConfigurationsteps } from 'src/app/global/json-data';

@Component({
  selector: 'app-telepathy-action',
  templateUrl: './telepathy-action.component.html',
  styleUrls: ['./telepathy-action.component.scss']
})
export class TelepathyActionComponent implements OnInit {
  userDetails: any;
  path: any;
  eventkey: any;
  uniqueId: any;
  form: FormGroup;
  loader: boolean = false;
  reset: boolean;
  showSelectField = false;
  showsecondSelectField = false;
  voiceConfigurationsteps: any;
  labelName: any;
  subscription: Subscription[] = [];
  submittedForm: boolean = false;
  dataTemp: any = [];
  requestObj: any;
  channel: any;
  NotificationFormarray: FormArray;
  NewInteractionFormarray: FormArray;
  tabKey: any[];
  tabValue: any[];
  TemplateData: any = [];
  ChannelSource: any = [];
  Channel: any;
  selectchannel = [
    { id: 1, value: 'Trigger HSM' },
    { id: 28, value: 'Send SMS' },
    { id: 34, value: 'Send Email' }
  ];
  template: any[];
  cardTemplate: any[];
  channelSourceAvailable: any;
  templateID: any;
  templateVisible: boolean;
  NewChannelSource: any = [];
  NewTemplateData: any = [];
  AdditionalPropValueArray: any = [];
  nonAdultsChSource: any;
  VoiceDropdown: any;
  userConfig: any;


  constructor(
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public common: CommonService,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private el: ElementRef,
  ) { Object.assign(this, { masters, regex, voiceConfigurationsteps }); }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');

    this.common.setUserConfig(this.userDetails.ProfileType, 'VoiceConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        this.VoiceDropdown = JSON.parse(data["VoiceDropdown"]);
        console.log(this.VoiceDropdown);

      })
    )
    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {

      this.loader = false;
      this.router.navigate(['/masters/channel-configuration/voice-configuration/voice-detail', this.path, 'add'])
    }
    else {
      if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
        this.editvoice('edit', this.uniqueId)
      }
    }

    this.getchannel();

    this.form = this.formBuilder.group({
      InboundNumber: ['', [Validators.required]],
      Queue: ['', [Validators.required, Validators.pattern(regex.urlregexwithhttp)]],
      Enable: ['', Validators.nullValidator],
      DialWebhook: ['', [Validators.required, Validators.pattern(regex.urlregexwithhttp)]],
      ConsultWebhook: ['', [Validators.required, Validators.pattern(regex.urlregexwithhttp)]],
      HoldWebhook: ['', [Validators.required, Validators.pattern(regex.urlregexwithhttp)]],
      OnCallCompletion: ['', [Validators.required, Validators.pattern(regex.urlregexwithhttp)]],
      NewInteraction: ['', [Validators.required, Validators.pattern(regex.urlregexwithhttp)]],
      NotificationWebhook: ['', [Validators.required, Validators.pattern(regex.urlregexwithhttp)]],
      NewInteractionFormarray: this.formBuilder.array([]),
      NotificationFormarray: this.formBuilder.array([])
    },
      {
        validator: [checknull('InboundNumber'), checknull1('InboundNumber'), checknull('Queue'), checknull1('Queue'), checknull('DialWebhook'), checknull1('DialWebhook')
          , checknull('ConsultWebhook'), checknull1('ConsultWebhook'), checknull('HoldWebhook'), checknull1('HoldWebhook'), checknull('OnCallCompletion'), checknull1('OnCallCompletion')
          , checknull('NewInteraction'), checknull1('NewInteraction'), checknull('NotificationWebhook'), checknull1('NotificationWebhook')]
      },
    )
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  backspace() {
    this.router.navigate(['masters/channel-configuration/voice-configuration/view/' + this.path]);

  }

  back() {
    this.router.navigate(['masters/channel-configuration/voice-configuration/view/' + this.path]);
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

  resetfunc() {
    this.showSelectField = false;
    this.showsecondSelectField = false
  }

  createItem() {
    return this.formBuilder.group({
      sechsmvalue: ['', Validators.required],
      sechsmtemplate: ['', Validators.required],
      newChannelSource: ['', Validators.required],
    });

  }
  createfiled() {
    return this.formBuilder.group({
      hsmvalue: ['', [Validators.required]],
      hsmtemplate: ['', [Validators.required]],
      ChannelSource: ['', Validators.required],
    });

  }

  addItem(): void {
    this.NotificationFormarray = this.Field() as FormArray;
    this.Field().push(this.createItem());

  }

  removeGroup(index) {
    const form = this.form.get('NotificationFormarray') as FormArray;
    form.removeAt(index);
  }
  addField(): void {
    this.NewInteractionFormarray = this.Group() as FormArray;
    this.Group().push(this.createfiled());

  }

  removeField(index) {
    const form = this.form.get('NewInteractionFormarray') as FormArray;
    form.removeAt(index);
  }

  Field(): FormArray {
    return this.form.get("NotificationFormarray") as FormArray
  }
  Group(): FormArray {
    return this.form.get("NewInteractionFormarray") as FormArray
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

  getchannel() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid,
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.Channel = res.results.data;
      }
    });
  }

  getChannelSource(ChannelId, index) {
    // this.TemplateData = []
    this.loader = true;
    this.requestObj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          processid: this.userDetails.Processid,
          channelid: parseInt(ChannelId)
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        if (this.ChannelSource.length <= index) {
          this.ChannelSource.push(res.results.data)
        } else {
          this.ChannelSource[index] = res.results.data;
        }
        console.log("............ggggg..", this.ChannelSource)

        this.loader = false;
      } else this.loader = false;
    });
  }

  getTemplate(event, index) {
    var temp = this.form.value.NewInteractionFormarray;
    // this.TemplateData = [];
    this.template = [];
    this.cardTemplate = [];
    this.loader = true;
    if (parseInt(temp[index].hsmvalue) == 1) {
      this.requestObj = {
        "data": {
          "spname": "usp_unfyd_hsm_template",
          "parameters": {
            "FLAG": "GET_NOTIFICATION",
            "PROCESSID": this.userDetails.Processid,
            "CHANNELID": parseInt(temp[index].hsmvalue),
            "UNIQUEID": event
          }
        }
      };
    } else if (parseInt(temp[index].hsmvalue) == 34) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_email_template",
          parameters: {
            FLAG: "GET",
            PROCESSID: 1,
            CHANNELID: parseInt(temp[index].hsmvalue),
            UNIQUEID: event
          }
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {

        if (this.TemplateData.length <= index) {
          this.TemplateData.push(res.results.data)
        } else {
          this.TemplateData[index] = res.results.data;
        }
        // this.TemplateData = res.results.data;
        console.log("..............", this.TemplateData)
        this.loader = false;
      } else this.loader = false;
    });
  }
  getNewChannelSource(ChannelId, index) {
    // this.TemplateData = []
    this.loader = true;
    this.requestObj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          processid: this.userDetails.Processid,
          channelid: parseInt(ChannelId)
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        if (this.NewChannelSource.length <= index) {
          this.NewChannelSource.push(res.results.data)
        } else {
          this.NewChannelSource[index] = res.results.data;
        }
        console.log("............ggggg..", this.NewChannelSource)

        this.loader = false;
      } else this.loader = false;
    });
  }

  getNewTemplate(event, index) {
    var temp = this.form.value.NotificationFormarray;
    // this.TemplateData = [];
    this.template = [];
    this.cardTemplate = [];
    this.loader = true;
    if (parseInt(temp[index].sechsmvalue) == 1) {
      this.requestObj = {
        "data": {
          "spname": "usp_unfyd_hsm_template",
          "parameters": {
            "FLAG": "GET_NOTIFICATION",
            "PROCESSID": this.userDetails.Processid,
            "CHANNELID": parseInt(temp[index].sechsmvalue),
            "UNIQUEID": event
          }
        }
      };
    } else if (parseInt(temp[index].sechsmvalue) == 34) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_email_template",
          parameters: {
            FLAG: "GET",
            PROCESSID: 1,
            CHANNELID: parseInt(temp[index].sechsmvalue),
            UNIQUEID: event
          }
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {

        if (this.NewTemplateData.length <= index) {
          this.NewTemplateData.push(res.results.data)
        } else {
          this.NewTemplateData[index] = res.results.data;
        }
        // this.NewTemplateData = res.results.data;
        console.log("..............", this.NewTemplateData)
        this.loader = false;
      } else this.loader = false;
    });
  }

  findNonAdults(people: any[], i: any): any[] {
    if (people) {
      let result = this.form.value.NewInteractionFormarray.map(a => a.hsmtemplate);
      let selectedValue: any
      // Assuming 'people' is an array of objects with 'TemplateName' property

      if (people && people.length > 0) {
        people.forEach(element => {
          if (element.Actionable === this.form.value.NewInteractionFormarray[i].hsmtemplate && this.form.value.NewInteractionFormarray[i].hsmtemplate !== undefined) {
            selectedValue = element;
          }
        });
      }

      let filteredArray = people.filter(p => !result.includes(p.Actionable));

      if (selectedValue)
        filteredArray.unshift(selectedValue)
      return filteredArray
    }
  }

  findNonAdults2(people: any[], i: any): any[] {
    if (people) {
      let result = this.form.value.NotificationFormarray.map(a => a.sechsmtemplate);
      let selectedValue: any
      // Assuming 'people' is an array of objects with 'TemplateName' property

      if (people && people.length > 0) {
        people.forEach(element => {
          if (element.Actionable === this.form.value.NotificationFormarray[i].sechsmtemplate && this.form.value.NotificationFormarray[i].sechsmtemplate !== undefined) {
            selectedValue = element;
          }
        });
      }

      let filteredArray = people.filter(p => !result.includes(p.Actionable));

      if (selectedValue)
        filteredArray.unshift(selectedValue)
      return filteredArray
    }
  }




  editvoice(type, uid) {
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

            if (tmpt[i].ConfigKey == 'NewInteractionFormarray') {
              console.log('formary1');
              var temp1 = JSON.parse('[' + JSON.parse(JSON.stringify(tmpt[i].ConfigValue)) + ']');
              for (let i = 0; i < temp1.length; i++) {
                this.addField();
              }
              var arrayControl = this.form.get('NewInteractionFormarray') as FormArray;
              arrayControl.controls.forEach((element, index) => {

                this.requestObj = {
                  data: {
                    spname: "USP_RULEMASTER_PROC",
                    parameters: {
                      flag: "CHANNELSOURCE",
                      processid: this.userDetails.Processid,
                      channelid: parseInt(temp1[index].ChannelId)
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.ChannelSource[index] = res.results.data;

                    if (parseInt(temp1[index].ChannelId) == 1) {
                      this.requestObj = {
                        "data": {
                          "spname": "usp_unfyd_hsm_template",
                          "parameters": {
                            "FLAG": "GET_NOTIFICATION",
                            "PROCESSID": this.userDetails.Processid,
                            "CHANNELID": parseInt(temp1[index].ChannelId),
                            "UNIQUEID": temp1[index].ChannelSourceId
                          }
                        }
                      };
                    } else if (parseInt(temp1[index].ChannelId) == 34) {
                      this.requestObj = {
                        data: {
                          spname: "usp_unfyd_email_template",
                          parameters: {
                            FLAG: "GET",
                            PROCESSID: 1,
                            CHANNELID: parseInt(temp1[index].ChannelId),
                            UNIQUEID: temp1[index].ChannelSourceId
                          }
                        }
                      }
                    }
                    this.api.post('index', this.requestObj).subscribe(res => {
                      if (res.code == 200) {

                        this.TemplateData[index] = res.results.data;
                        this.loader = false;
                      } else this.loader = false;
                    });

                    this.loader = false;
                  } else this.loader = false;
                });


                (arrayControl.at(index) as FormGroup).get('hsmvalue').patchValue(temp1[index].ChannelId);
                (arrayControl.at(index) as FormGroup).get('hsmtemplate').patchValue(temp1[index].TemplateName);
                (arrayControl.at(index) as FormGroup).get('ChannelSource').patchValue(temp1[index].ChannelSourceId);
              });

            }
            else if (tmpt[i].ConfigKey == 'NotificationFormarray') {
              console.log('formary2');

              var temp2 = JSON.parse('[' + JSON.parse(JSON.stringify(tmpt[i].ConfigValue)) + ']');
              for (let i = 0; i < temp2.length; i++) {
                this.addItem();
              }



              var arrayControl2 = this.form.get('NotificationFormarray') as FormArray;
              arrayControl2.controls.forEach((element, index) => {


                this.requestObj = {
                  data: {
                    spname: "USP_RULEMASTER_PROC",
                    parameters: {
                      flag: "CHANNELSOURCE",
                      processid: this.userDetails.Processid,
                      channelid: parseInt(temp2[index].ChannelId)
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.NewChannelSource[index] = res.results.data;


                    if (parseInt(temp2[index].ChannelId) == 1) {
                      this.requestObj = {
                        "data": {
                          "spname": "usp_unfyd_hsm_template",
                          "parameters": {
                            "FLAG": "GET_NOTIFICATION",
                            "PROCESSID": this.userDetails.Processid,
                            "CHANNELID": parseInt(temp2[index].ChannelId),
                            "UNIQUEID": temp2[index].ChannelSourceId
                          }
                        }
                      };
                    } else if (parseInt(temp2[index].ChannelId) == 34) {
                      this.requestObj = {
                        data: {
                          spname: "usp_unfyd_email_template",
                          parameters: {
                            FLAG: "GET",
                            PROCESSID: 1,
                            CHANNELID: parseInt(temp2[index].ChannelId),
                            UNIQUEID: temp2[index].ChannelSourceId
                          }
                        }
                      }
                    }
                    this.api.post('index', this.requestObj).subscribe(res => {
                      if (res.code == 200) {

                        this.NewTemplateData[index] = res.results.data;

                        let chSid = temp2[index].ChannelSourceId
                        let tempname = temp2[index].TemplateName
                        console.log('chSid.toString()', chSid.toString());
                        console.log('tempname.toString()', tempname.toString());
                        (arrayControl2.at(index) as FormGroup).get('sechsmvalue').patchValue(temp2[index]?.ChannelId);
                        (arrayControl2.at(index) as FormGroup).get('sechsmtemplate').patchValue(temp2[index].TemplateName);
                        (arrayControl2.at(index) as FormGroup).get('newChannelSource').patchValue(temp2[index].ChannelSourceId);

                        this.loader = false;
                      } else this.loader = false;
                    });


                    this.loader = false;
                  } else this.loader = false;
                });





              });

            }
            else {
              this.form.patchValue({ [tmpt[i].ConfigKey]: tmpt[i].ConfigValue })
            }


            this.dataTemp.push({ 'Key': tmpt[i].ConfigKey, 'Value': tmpt[i].ConfigValue, 'Id': tmpt[i].Id });





          }

          // }


          this.form.updateValueAndValidity();
          this.loader = false;
        } else {
          this.loader = false;
        }
      });
    };
  }

  savevoice(event) {
    var SecArrayControl = [];
    var FirstArrayControl = [];
    var arrayval = [];

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



    FirstArrayControl = (this.form.get('NewInteractionFormarray') as FormArray).value;
    var temp2 = [];
    FirstArrayControl.forEach(element => {
      temp2.push('{"ChannelId" : "' + element.hsmvalue + '","TemplateName" : "' + element.hsmtemplate.trim() + '","ChannelSourceId" : "' + element.ChannelSource.trim() + '"}');
    });

    SecArrayControl = (this.form.get('NotificationFormarray') as FormArray).value;
    var temp3 = [];
    SecArrayControl.forEach(element => {
      temp3.push('{"ChannelId" : "' + element.sechsmvalue + '","TemplateName" : "' + element.sechsmtemplate.trim() + '","ChannelSourceId" : "' + element.newChannelSource.trim() + '"}');

    });



    var keys = Object.keys(this.form.value);
    var values = Object.values(this.form.value);
    let cntr = values.length;
    var updateData = [];

    this.dataTemp.forEach((element, index) => {
      keys.forEach((object, j) => {
        if (element.Key == object) {
          if (element.Key == "InboundNumber" || element.Key == "Queue" || element.Key == "DialWebhook"
            || element.Key == "ConsultWebhook" || element.Key == "HoldWebhook" || element.Key == "OnCallCompletion"
            || element.Key == "NewInteraction" || element.Key == "NotificationWebhook") {
            let val: any = values[j]
            values[j] = values[j] == null ? null : values[j] == undefined ? null : val.trim()
            updateData.push({ "Id": element.Id, "ConfigKey": element.Key, "ConfigValue": values[j] })

          } else if (element.Key == "NewInteractionFormarray") {
            updateData.push({ "Id": element.Id, "ConfigKey": element.Key, "ConfigValue": (temp2 && temp2.length > 0) ? temp2.join(",") : '' })
          }
          else if (element.Key == "NotificationFormarray") {
            updateData.push({ "Id": element.Id, "ConfigKey": element.Key, "ConfigValue": (temp3 && temp3.length > 0) ? temp3.join(",") : '' })
          } else updateData.push({ "Id": element.Id, "ConfigKey": element.Key, "ConfigValue": values[j] })

        }
      });




    });

    console.log('updateData', updateData);

    // return
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
            processid: this.userDetails.Processid,
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


            if (event == 'next') {
              this.router.navigate(['/masters/channel-configuration/voice-configuration/voice-detail', this.path, 'add']);
            }
            else if (event == 'save') {
              this.router.navigate(['masters/channel-configuration/voice-configuration/view/' + this.path]);
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
