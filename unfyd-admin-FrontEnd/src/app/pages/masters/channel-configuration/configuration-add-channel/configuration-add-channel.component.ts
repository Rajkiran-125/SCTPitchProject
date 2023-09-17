import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/global/common.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Observable, Subscription } from 'rxjs';
import { threadId } from 'worker_threads';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { data } from 'jquery';


@Component({
  selector: 'app-configuration-add-channel',
  templateUrl: './configuration-add-channel.component.html',
  styleUrls: ['./configuration-add-channel.component.scss']
})
export class ConfigurationAddChannelComponent implements OnInit {
  key: any;
  form: FormGroup;
  loader: boolean = false;
  path: any;
  local: any;
  type: any;
  data: any = [];
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
  webchatData1: any = [];
  reset: boolean;
  dataTemp: any = [];
  userConfig: any;
  subscription: Subscription[] = [];
  subscriptionBulkdelete: Subscription[] = [];
  labelName: any;
  webchatChannel: any;
  webchatData: { data: { spname: string; parameters: { flag: string; processid: any; }; }; };


  constructor(public common: CommonService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private api: ApiService, private auth: AuthService,) { }


  ngOnInit(): void {
    this.common.hubControlEvent('ChannelConfiguration', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.userDetails = this.auth.getUser();
    this.local = this.activatedRoute.snapshot.paramMap.get('id');
    this.getChannel();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))

    this.subscription.push(this.common.pageReloadforWebchat$.subscribe((data) => {
      this.getWebchatlist();
    }))

    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'ChannelConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))

    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'ChannelConfiguration');
    this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
    })

    this.form = this.formBuilder.group({

    })
    this.common.hubControlEvent('ChannelConfiguration', 'click', 'pageload', 'pageload', '', 'ngOnInit');


  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('ChannelConfiguration', 'click', '', '', data, 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ChannelConfiguration', data)

  }

  // deleteWebchatData(){
  //   let obj7 = {
  //     data:{
  //       spname:"usp_unfyd_webchat_config",
  //       parameters:{
  //         flag:"DELETE",
  //         CHANNELID: this.path,
  //         CHANNELSRCID: this.channelSRCID,
  //     }}
  //   }
  //   this.api.dynamicDashboard('https://cx1.unfyd.com:3001/api/index', obj7).subscribe((res: any) => {
  //   if (res.code == 200) {
  //       this.loader = false;
  //       // let a: any = [];
  //       // var temp1 = []
  //       // let obj

  //       // this.webchatChannel = res.results.data;

  //       //   for (var i = 0; i < res.results.data.length; ++i) {
  //       //     temp1.push({ [res.results.data[i].ConfigKey]: res.results.data[i].ConfigValue })
  //       //   }
  //       //   // console.log("Temporary:",temp1);
  //       //     obj = temp1.reduce(function (acc, val) {
  //       //       return Object.assign(acc, val);
  //       //     }, {});

  //       //     this.form.patchValue(obj);
  //       // });
  //     }
  //   })
  // }

  getWebchatlist() {
    this.chanelid = this.activatedRoute.snapshot.paramMap.get('id');
    this.webchatChannel = []
    this.webchatData1 = []
    this.loader = true;
    let obj1 = {
      data: {
        spname: 'usp_unfyd_webchat_config',
        parameters: {
          flag: "GET_WEBCHAT_DATA",
          processid: this.userDetails.Processid,
          productid: 11,
          CHANNELID: parseInt(this.chanelid),
        }
      }
    };

    //this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj1),'getWebchatList');

    this.api.post('index', obj1).subscribe((res) => {
      if (res.code == 200) {

        console.log("response", res);       

        this.loader = false;
        let a: any = [];
        var temp1 = []
        let obj

        this.webchatChannel = res.results.data;
        // console.log('Webchat Channel',this.webchatChannel)
        this.webchatChannel.forEach(element => {
          var myArray1 = JSON.parse(element.ChannelData)
          for (var i = 0; i < myArray1.length; ++i) {
            temp1.push({ [myArray1[i].ConfigKey]: myArray1[i].ConfigValue })
          }
          // console.log("Temporary:",temp1);
          obj = temp1.reduce(function (acc, val) {
            return Object.assign(acc, val);
          }, {});

          let x = {
            ChannelSrcID: element.ChannelSrcID,
            UniqueId: element.UniqueId,
            IsDefault: element.IsDefault,
            value: obj
          }
          a.push(x);
        });

        // console.log("a:",a);

        this.stringJson = JSON.parse(JSON.stringify(this.webchatChannel));
        // console.log("this.stringJson:",this.stringJson);

        this.webchatData1 = a;

        console.log("Vilas: ", this.webchatData1 );

      }
    });

  }

  getWhatsapplist() {
    this.chanelid = this.activatedRoute.snapshot.paramMap.get('id');
    this.loader = true;
    this.whtsdata = {
      data: {
        spname: 'usp_unfyd_channel_config ',
        parameters: {
          flag: "GET_CHANNEL_DATA",
          processid: this.userDetails.processid,
          productid: 1,
          CHANNELID: parseInt(this.chanelid),
        }
      }
    };
    this.common.hubControlEvent('ChannelConfiguration', 'click', '', '', JSON.stringify(this.whtsdata), 'getWhatsapplist');

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
            ChannelSrcID: element.ChannelSrcID,
            HSMCount: element.HSMCount,
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
    this.common.hubControlEvent('ChannelConfiguration', 'click', 'back', 'back', '', 'back');

    this.router.navigate(['masters/channel-configuration']);
  }
  enableWebchat(val) {
    console.log("vishal", val)

    // this.loader = true;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_channel_config ',
        parameters: {
          flag: "SET_DEFAULT_CHANNELSOURCE",
          id: val.ChannelSrcID
        }
      }
    };

    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        this.getWebchatlist();
      }
    });


  }
  getChannel() {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_channel_config ',
        parameters: {
          flag: "CHANNEL",
          id: this.local
        }
      }
    };
    this.common.hubControlEvent('ChannelConfiguration', 'click', '', '', JSON.stringify(this.requestObj), 'getChannel');

    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        this.channel = res.results.data[0];
        this.getWhatsapplist();
        this.getWebchatlist();
        this.getChanel()
      }
    });
  }
  fileDuplicate(data){

    var today = new Date();
    var dd = new Date().getDate();
    var mm = new Date().getMonth() + 1;
    var yyyy = new Date().getFullYear();
    var time = today.getHours().toString() + today.getMinutes().toString();
    var uniqueIdWebchat = 'WEBCHAT' + dd + mm + yyyy + time;

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_webchat_config',
        parameters: {
          flag: "REPLICATE_WEBCHAT",
          CHANNELID: this.local,
          CHANNELNAME: "WEBCHAT",
          CHANNELSRCID: data.ChannelSrcID,
          BROWSERNAME: "",
          BROWSERVALUE: "",
          CREATEDBY: "",        
          PROCESSID: this.userDetails.Processid,
          PRODUCTID: this.userDetails.ProductId,
          PUBLICIP: "",
          PRIVATEIP: "",
          UNIQUEID: uniqueIdWebchat
        }
      }
    };

    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        this.common.snackbar('Duplicate Created Succuessfully', 'success');
        this.getWebchatlist();        
      } else{
        this.common.snackbar('Something went wrong', 'error');
      }
    });
  }
  openWebchatDialog(type, data) {
    //this.common.hubControlEvent('AlertMessage','click','','',type,'openAlertDialog');
    console.log("ID", this.local);
    if (parseInt(this.local) == 2) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: this.data,
          productID: this.local,
          webchatList: this.webchatData1,
          id: this.local
        },
        width: '320px',
        disableClose: true,
        hasBackdrop: true
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          console.log("dialog closed");          
          this.getWebchatlist();
          //this.common.callGetAlertMethod(status)
        }
      });
    }
  }
  copyMSG(){
    this.common.snackbar("Script copied successfully", "success");	
  }
  openDialog(type) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
      },
      width: '80%',
      height: '80%'
    });
    dialogRef.afterClosed().subscribe(status => {

      var temp = [];
      var temp2 = [];
      var today = new Date();
      var dd = new Date().getDate();
      var mm = new Date().getMonth() + 1;
      var yyyy = new Date().getFullYear();
      var time = today.getHours().toString() + today.getMinutes().toString();
      if (status != undefined || status != null || status != false) {
        temp = Object.keys(status?.data);
        temp2 = Object.values(status?.data);
        this.emailuniquedata = this.channel?.ChannelName + dd + mm + yyyy + time;
        for (let i = 0; i < temp.length; i++) {
          let obj = {
            data: {
              spname: "usp_unfyd_channel_config",
              parameters: {
                flag: 'INSERT',
                CHANNELID: this.local,
                CHANNELNAME: this.channel?.ChannelName,
                ConfigKey: temp[i],
                ConfigValue: temp2[i],
                ConfigType: status.type,
                STATUS: 1,
                processid: this.userDetails.Processid,
                productid: 1,
                uniqueid: this.emailuniquedata
              }
            }
          };
          this.common.hubControlEvent('ChannelConfiguration', 'click', '', '', JSON.stringify(obj), 'openDialog');

          this.api.post('index', obj).subscribe(
            (res: any) => {
              if (res.code == 200) {
                this.loader = false;
                this.common.snackbar("Success");

              } else {
                this.loader = false;
              }
            });
        }

      }
    });
  }

  openwhatsapp(type, data) {
    if (type == 'edit') {
      let obj = {
        data: {
          spname: "usp_unfyd_channel_config",
          parameters: {
            flag: 'EDIT',
            CHANNELID: parseInt(this.chanelid),
            uniqueid: data,
          }
        }
      };
      this.common.hubControlEvent('ChannelConfiguration', 'click', '', '', JSON.stringify(obj), 'openwhatsapp');

      this.api.post('index', obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.dataTemp = [];
          var temp = res.results.data;
          temp.forEach((object, index) => {
            this.dataTemp.push({ 'Key': object.ConfigKey, 'Value': object.ConfigValue, 'Id': object.Id });

          });

          const dialogRef = this.dialog.open(DialogComponent, {
            data: {
              type: 'editWhatsappChannel',
              editwts: true,
              data: this.dataTemp,
              channelId: this.chanelid,
              UniqueID: data,
            },
            width: '80%',
            height: '80%'
          });
          dialogRef.afterClosed().subscribe(status => {
            if (status != false) {
              var dialogData = status.data;
              var keys = Object.keys(dialogData);
              var values = Object.values(dialogData);
              var updateData = [];
              this.dataTemp.forEach((element, index) => {
                keys.forEach((object, j) => {
                  if (element.Key == object) {
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
                      ConfigKey: element.ConfigKey,
                      ConfigValue: element.ConfigValue,
                      CHANNELID: parseInt(this.chanelid),
                      STATUS: 1,
                      processid: this.userDetails.Processid,
                      productid: 1,
                      Id: element.Id,
                    }
                  }
                };
                this.common.hubControlEvent('ChannelConfiguration', 'click', 'UPDATE', '', JSON.stringify(obj), 'openwhatsapp');

                this.api.post('index', obj).subscribe(
                  (res: any) => {
                    if (res.code == 200) {
                      this.loader = false;
                      this.getWhatsapplist();
                      this.getWebchatlist();
                    } else {
                      this.loader = false;
                    }
                  });
              });
            }
          });
        } else {
          this.loader = false;
        }
      });
    } else {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'whatsappchannel',
          data: data
        },
        width: '80%',
        height: '80%'
      });
      dialogRef.afterClosed().subscribe(wtsappdata => {
        var temp = [];
        var temp2 = [];
        var today = new Date();
        var dd = new Date().getDate();
        var mm = new Date().getMonth() + 1;
        var yyyy = new Date().getFullYear();
        var time = today.getHours().toString() + today.getMinutes().toString();
        if (wtsappdata != undefined || wtsappdata != null || wtsappdata != false) {
          temp = Object.keys(wtsappdata?.data);
          temp2 = Object.values(wtsappdata?.data);

          this.uniquedata = this.channel?.ChannelName + dd + mm + yyyy + time;
          for (let i = 0; i < temp.length; i++) {
            let obj = {
              data: {
                spname: "usp_unfyd_channel_config",
                parameters: {
                  flag: 'INSERT',
                  CHANNELID: parseInt(this.chanelid),
                  CHANNELNAME: this.channel?.ChannelName,
                  ConfigKey: temp[i],
                  ConfigValue: temp2[i],
                  ConfigType: wtsappdata.type,
                  STATUS: 1,
                  processid: this.userDetails.Processid,
                  productid: 1,
                  uniqueid: this.uniquedata,
                }
              }
            };
            this.common.hubControlEvent('ChannelConfiguration', 'click', 'INSERT', '', JSON.stringify(obj), 'openwhatsapp');

            this.api.post('index', obj).subscribe(
              (res: any) => {
                if (res.code == 200) {
                  this.loader = false;
                } else {
                  this.loader = false;
                }
              });
          }
          this.getWhatsapplist()
        }
      });
    }

  }

  channelType = []
  getChanel() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid,
        }
      }
    }
    this.common.hubControlEvent('ChannelConfiguration', 'click', 'INSERT', '', JSON.stringify(this.requestObj), 'getChanel');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          this.channelType = res.results.data.filter(item => item.ChannelId == this.channel.Id);
        }
      }

    });
  }

  ChannelWisePriority() {

  }

  // deleteChannel(data) {
  //   const dialogRef = this.dialog.open(DialogComponent, {
  //     data: {
  //       type: 'delete',
  //       title: 'Are you sure?',
  //       subTitle: 'Do you want to delete selected channel',
  //     },
  //     width: '300px',
  //   });
  //   dialogRef.afterClosed().subscribe(status => {
  //     if (status) {
  //       this.loader = true
  //       if (this.local == 2) {
  //         let obj7 = {
  //           data: {
  //             spname: "usp_unfyd_webchat_config",
  //             parameters: {
  //               flag: "DELETE",
  //               CHANNELID: this.channel.Id,
  //               CHANNELSRCID: data.ChannelSrcID,
  //             }
  //           }
  //         }
  //         this.api.dynamicDashboard('https://cx1.unfyd.com:3001/api/index', obj7).subscribe((res: any) => {
  //           if (res.code == 200) {
  //             this.common.snackbar("Delete Record");
  //             //this.webchatData1.splice(i, 1);
  //             this.loader = false
  //           } else {
  //             this.loader = false
  //             this.common.snackbar("General Error");
  //           }

  //         })
  //       }
  //     } else {
        
  //     }


  //     this.subscriptionBulkdelete.forEach((e) => {
  //       e.unsubscribe();
  //     });
  //   });
  // }

	
  deleteWebchatChannel(data, i) {	
    const dialogRef = this.dialog.open(DialogComponent, {	
      data: {	
        type: 'delete',	
        title: 'Are you sure?',	
        subTitle: 'Do you want to delete selected channel',	
      },	
      width: '300px',	
    });	
    dialogRef.afterClosed().subscribe(status => {	
      if (status) {	
        this.loader = true	
        if (this.local == 2) {	
          let obj7 = {	
            data: {	
              spname: "usp_unfyd_webchat_config",	
              parameters: {	
                flag: "DELETE",	
                CHANNELID: this.channel.Id,	
                CHANNELSRCID: data.ChannelSrcID,	
              }	
            }	
          }	
          this.api.post('index', obj7).subscribe((res: any) => {	
            if (res.code == 200) {	
              this.common.snackbar("Delete Record");	
              this.webchatData1.splice(i, 1);	
              this.loader = false	
            } else {	
              this.loader = false	
              this.common.snackbar("General Error");	
            }	
          })	
        }	
      } else {	
        	
      }	
      this.subscriptionBulkdelete.forEach((e) => {	
        e.unsubscribe();	
      });	
    });	
  }

  deleteChannel(data){   
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkdelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if(status.status){
        this.loader = true
        this.requestObj = {
          data: {
            spname: "usp_unfyd_channel_config",
            parameters: {
              flag: "DELETE_CHANNELSOURCE_MST",
              CHANNELSRCID: data.ChannelSrcID,
            }
          }
        }
        this.common.hubControlEvent('ChannelConfiguration','click','DELETE','',JSON.stringify(this.requestObj),'deleteChannel');
  
        this.api.post('index', this.requestObj).subscribe((res: any) => {
          if (res.code == 200) {
            this.common.snackbar("Delete Record");
            this.loader = false
            this.getWhatsapplist()
          } else{
            this.loader = false
            this.common.snackbar("General Error");
          }
        },(error)=>{
          this.loader = false
          this.common.snackbar("General Error");
        });
  
      }
    
    
      this.subscriptionBulkdelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
