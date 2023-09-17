import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/global/common.service';
import { Subscription } from 'rxjs';
import { stringify } from 'querystring';

@Component({
  selector: 'app-channel-configuration',
  templateUrl: './channel-configuration.component.html',
  styleUrls: ['./channel-configuration.component.scss']
})
export class ChannelConfigurationComponent implements OnInit {

  userDetails: any;
  channelType: any = [];
  form: FormGroup;
  channelId: any;
  ChannelName: any;
  data: any;
  local: any;
  productType: any = [];
  productName: any = 1;
  finalField: any[];
  productID: any = 10;
  channelType1:any = [];
  changesMade : boolean = true;
  changesArray = [];
  subscription: Subscription[] = [];
  labelName: any;
  loader: boolean;
  userConfig: any;
  constructor(private api: ApiService, private common: CommonService,
    private router: Router, private auth: AuthService, private formBuilder: FormBuilder, public dialog: MatDialog, private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.common.hubControlEvent('ChannelConfiguration','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
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
    this.form = this.formBuilder.group({
      ChannelName: ['', Validators.required],
    })
    this.getChanel(this.data);
    this.common.hubControlEvent('ChannelConfiguration','click','pageloadend','pageloadend','','ngOnInit');

  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('ChannelConfiguration','click','label','label',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ChannelConfiguration', data)

  }
  getChanel(data1) {
    // let obj = {
    //   data: {
    //     spname: "usp_unfyd_getdropdowndetails",
    //     parameters: {
    //       flag: "CHANNEL",
    //       processid: this.userDetails.Processid,
    //     }
    //   }
    // }
    // this.common.hubControlEvent('ChannelConfiguration','click','CHANNEL','CHANNEL',JSON.stringify(obj),'getChanel');

    // this.api.post('index', obj).subscribe((res: any) => {
    //   if (res.code == 200) {
    //     this.channelType = res.results.data;
    //     this.channelType1 = JSON.parse(JSON.stringify(this.channelType))
    //   }

    // });

    this.channelType = JSON.parse(localStorage.getItem('TenantChannel'))
    this.channelType1 = JSON.parse(localStorage.getItem('TenantChannel'))
  }


  getProducts() {
    this.common.hubControlEvent('ChannelConfiguration','click','products','products','','getProducts');

    this.productType = JSON.parse(localStorage.getItem('products'))
    this.productName = this.productType[0].Id
    this.productID = this.productType[0].ProductName

  }

  selectedProduct(e) {
    this.common.hubControlEvent('ChannelConfiguration','click','products','products',e,'selectedProduct');

    this.productName = e
  }

  goToPage(val) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',val,'goToPage');


    this.channelId = val.ChannelId;
    this.ChannelName = val.ChannelName;
    this.common.setchannelroutepopup(val);
    if(this.ChannelName == "WhatsApp")  this.router.navigate(['masters/channel-configuration/configuration-add-channel/', this.channelId]);
    else if(this.ChannelName == "Email") this.router.navigate(['masters/channel-configuration/email-configuration/view/', this.channelId]);
    else if(this.ChannelName == "Voice") this.router.navigate(['masters/channel-configuration/voice-configuration/view/', this.channelId]);
    else if(this.ChannelName == "Facebook") {this.router.navigate(['masters/channel-configuration/facebook-configuration/view/', this.channelId])}
    else if(this.ChannelName == "FacebookChat") {this.router.navigate(['masters/channel-configuration/facebook-messenger/view/', this.channelId])}
    else if(this.ChannelName == "Twitter") {this.router.navigate(['masters/channel-configuration/twitter-configuration/view/', this.channelId])}
    else if(this.ChannelName == "TwitterDm") {this.router.navigate(['masters/channel-configuration/twitter-dm/view/', this.channelId])}
    else if(this.ChannelName == "InstagramDm") {this.router.navigate(['masters/channel-configuration/instagram/view/', this.channelId])}
    else if(this.ChannelName == "InstagramPost") {this.router.navigate(['masters/channel-configuration/instagram-post/view/', this.channelId])}
    else if(this.ChannelName == "Webchat") {this.router.navigate(['masters/channel-configuration/configuration-add-channel/', this.channelId])}
    else if(this.ChannelName == "Viber") this.router.navigate(['masters/channel-configuration/viber-configuration/view/', this.channelId]);
    else if(this.ChannelName == "Telegram") {this.router.navigate(['masters/channel-configuration/telegram/view/', this.channelId])}

    const id = +this.activatedRoute.snapshot.paramMap.get('id');
  }

  add(){
    this.common.hubControlEvent('ChannelConfiguration','click','products','products','','add');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
          type: 'addChannelForChannelConfiguration',
          product: this.productName
      },
      width: '30vw',
      disableClose: true
  });
  dialogRef.afterClosed().subscribe(status => {
    if(status){
      }
    })
  }

  changeStatusOfChannel(data,i){
    this.channelType[i].EnableChannelConfig = !this.channelType[i].EnableChannelConfig
    let obj = {
      data: {
        spname: "usp_unfyd_channel_config",
        parameters: {
          flag: "UPDATE_CHANNEL_CONFIG_STATUS",
          ENABLECHANNELCONFIG : this.channelType[i].EnableChannelConfig,
          CHANNELID:data.ChannelId,
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ChannelConfiguration','click','ChannelId','ChannelId',JSON.stringify(obj),'changeStatusOfChannel');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.snackbar("Saved Success");
      } else{
        this.common.snackbar('General Error')
      }
    },(error)=>{
      this.common.snackbar('General Error')
    });
  }

  checkChangeDetection(action,i){
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(action,i),'checkChangeDetection');

    if(action == 'minus'){
      if(this.channelType[i].ChannelPriority){
        this.channelType[i].ChannelPriority = this.channelType[i].ChannelPriority -1
      }
    } else if(action == 'plus'){
        this.channelType[i].ChannelPriority =this.channelType[i].ChannelPriority + 1
    }

    this.changesArray = this.channelType.filter((element,index)=> {
      if(element.ChannelPriority !=  this.channelType1[index].ChannelPriority){
        return element
      }
    })

    if(this.changesArray.length >0){
    } else{
    }
  }

  updateChanges(){
    let count = this.changesArray.length
    this.changesArray.forEach(res =>{
      let obj = {
        data: {
          spname: "usp_unfyd_channel_config",
          parameters: {
            flag: "SET_CHANNEL_PRIORITY",
            CHANNELPRIORITY : res.ChannelPriority,
            CHANNELID:res.ChannelId,
            processid: this.userDetails.Processid
          }
        }
      }
      this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj),'updateChanges');

      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
          count--;


          if(count ==0){
            this.common.snackbar("Saved Success");
            this.changesArray = []          }
        } else{
          this.common.snackbar('General Error')
        }
      },(error)=>{
        this.common.snackbar('General Error')
      });
    })
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
