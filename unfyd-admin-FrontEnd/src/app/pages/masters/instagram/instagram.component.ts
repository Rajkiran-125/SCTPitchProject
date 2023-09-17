import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss']
})
export class InstagramComponent implements OnInit {
  key: any;
  form: FormGroup;
  loader: boolean = false;
  path: any;
  local: any;
  requestObj: any;
  instagramdata: any;
  userDetails: any;
  channel: any;
  chanelid: any;
  instagramchannel: any = [];
  array: any = [];
  uniquedata: any;
  instagramuniquedata: any;
  stringJson: any;
  channelData: any = [];
  reset: boolean;
  dataTemp: any = [];
  userConfig:any;
  subscription: Subscription[] = [];
  subscriptionBulkdelete: Subscription[] = [];
  labelName: any;
  uniqueid: string;
  eventkey: string;

  constructor(public common: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private api: ApiService,
    private auth: AuthService,
    private el: ElementRef,) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.local = this.activatedRoute.snapshot.paramMap.get('id');
    this.uniqueid = this.activatedRoute.snapshot.paramMap.get('uniqueid');

    this.getChannel();
    this.form = this.formBuilder.group({

    })
    this.common.setUserConfig(this.userDetails.ProfileType, 'InstagramDm');
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
    this.common.setLabelConfig(this.userDetails.Processid, 'InstagramDm', data)

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
    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        this.channel = res.results.data[0];
        this.getInstagramist();
        this.getChanel()
      }
    });
  }
  getInstagramist() {
    this.chanelid = this.activatedRoute.snapshot.paramMap.get('id');
  this.loader = true;
  this.instagramdata = {
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
  this.api.post('index', this.instagramdata).subscribe((res) => {
    if (res.code == 200) {
      this.loader = false;
      let a: any = [];
      var temp = []

      this.instagramchannel = res.results.data;
      this.instagramchannel.forEach(element => {
        var myArray = JSON.parse(element.ChannelData)
        for (var i = 0; i < myArray.length; ++i) {
          temp.push({ [myArray[i].ConfigKey]: myArray[i].ConfigValue })
        }
        let obj = temp.reduce(function (acc, val) {
          return Object.assign(acc, val);
        }, {});
        let x = {
          ChannelSrcID: element.ChannelSrcID,
          UniqueId: element.UniqueId,
          value: obj
        }
        a.push(x)

      });
      this.stringJson = JSON.parse(JSON.stringify(this.instagramchannel));
      this.channelData = a;
    }
  });
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
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        if(res.results.data.length > 0){
          this.channelType = res.results.data.filter(item => item.ChannelId == this.channel.Id);
        }
      }

    });
  }
  back(): void {
    this.router.navigate(['masters/channel-configuration']);
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
        this.api.post('index', this.requestObj).subscribe((res: any) => {
          if (res.code == 200) {
            this.common.snackbar("Delete Record");
            this.loader = false
            this.getInstagramist()
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


    editPage(data){

      this.router.navigate(['/masters/channel-configuration/instagram/instagram-details', this.activatedRoute.snapshot.paramMap.get('id'), 'update', data.ChannelSrcID])
    }

}
