import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, regex, countryCode, facebookMessengerConfigurationsteps } from 'src/app/global/json-data';

@Component({
  selector: 'app-facebook-messenger-attribute',
  templateUrl: './facebook-messenger-attribute.component.html',
  styleUrls: ['./facebook-messenger-attribute.component.scss']
})
export class FacebookMessengerAttributeComponent implements OnInit {

    productType=[{Id:'ProfileName',ProductName:'Profile Name'},{Id:'Time',ProductName:'Time'},{Id:'MobileNo',ProductName:'Mobile No'}]
    attributeMapping=[{Id:'CustomerAttribute1',ProductName:'Customer Attribute 1'},{Id:'CustomerAttribute2',ProductName:'Customer Attribute 2'},{Id:'CustomerAttribute3',ProductName:'Customer Attribute 3'}]
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
    SSL_Protocol:any = [];
    public filteredList1 = this.SSL_Protocol.slice()
    userConfig: any;
    labelName: any;
    facebookdata: any;
    facebookchannel: any;
    stringJson: any;
    channelData: any =[];
    chanelid: string;
    buttonval: boolean = false;

    constructor(public common: CommonService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      private api: ApiService,
      private auth: AuthService,
      private el: ElementRef,) {   Object.assign(this, { masters, regex, countryCode, facebookMessengerConfigurationsteps }); }

    ngOnInit(): void {
      this.userDetails = this.auth.getUser();
      this.path = this.activatedRoute.snapshot.paramMap.get('id');
      this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
      this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');
      this.form = this.formBuilder.group({
        product: this.formBuilder.array([

        ]),
      })
      if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {

        this.loader = false;
        this.router.navigate(['/masters/channel-configuration/facebook-messenger/facebook-messenger-database', this.path, 'add'])
      }
      else {
        if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
          this.isUpdate = 'true';
          this.editFacebook('edit', this.uniqueId)
        }
      }
      this.getChannel();
      this.getfacebooklist()

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
    get product(): FormArray {
      return this.form.get('product') as FormArray;
    }

    getfacebooklist() {
      this.chanelid = this.activatedRoute.snapshot.paramMap.get('id');
      this.loader = true;
      this.facebookdata = {
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
      this.api.post('index', this.facebookdata).subscribe((res) => {
        if (res.code == 200) {
          this.loader = false;
          let a: any = [];
          var temp = []

          this.facebookchannel = res.results.data;
          this.facebookchannel.forEach(element => {
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
          this.stringJson = JSON.parse(JSON.stringify(this.facebookchannel));
          this.channelData = a;
        }
      });
      }

    addItem(): void {

      if (this.form.invalid) {
        this.loader = false;

        for (const key of Object.keys(this.form.controls)) {
          if (this.form.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            break;
          }
        }
        this.common.snackbar(masters.FormControlErrorMessage, "error");
        return;
      }

      this.product.push(
        new FormGroup({
          productid: new FormControl('',Validators.required),
          roleid: new FormControl('',Validators.required)
        })
      )

    }
    findNonAdults(people: any[], i:any): any[] {
      let result = this.form.value.product.map(a => a.productid);
      let selectedValue:any
        people.forEach(element => {
        if(element.Id  == this.form.value.product[i].productid && this.form.value.product[i].productid != undefined){
          selectedValue = element
        }
      });
      let filteredArray = people.filter(p => !result.includes(p.Id));

      if(selectedValue)
      filteredArray.unshift(selectedValue)

      return filteredArray
    }
    findNonAdults2(people: any[], i:any): any[] {
      let result = this.form.value.product.map(a => a.roleid);
      let selectedValue:any
        people.forEach(element => {
        if(element.Id  == this.form.value.product[i].roleid && this.form.value.product[i].roleid != undefined){
          selectedValue = element
        }
      });
      let filteredArray = people.filter(p => !result.includes(p.Id));

      if(selectedValue)
      filteredArray.unshift(selectedValue)

      return filteredArray
    }


    removeProductGroup(i) {

      const add = this.form.get('product') as FormArray;
          add.removeAt(i);
    }

    back(): void{
      this.router.navigate(['masters/channel-configuration/facebook-messenger/view/'+this.path]);
    }
    backspace(): void {

      this.router.navigate(['masters/channel-configuration/facebook-messenger/view/'+this.path]);
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

            let dummy = this.productType.map(item => item.Id )
            var tmpt = res.results.data;
            this.dataTemp = [];
            for (var i = 0; i < tmpt.length; ++i) {
              const firstGroupArray = this.form.get("product") as FormArray;
              if(dummy.includes(tmpt[i].ConfigKey) && tmpt[i].ConfigValue){

                if(tmpt[i].ConfigValue == "NULL" || tmpt[i].ConfigValue == null)
                {
                }
                else{
                  firstGroupArray.push(this.formBuilder.group({
                    productid: tmpt[i].ConfigKey,
                    roleid: tmpt[i].ConfigValue,
                  }));
                }

              }
              this.dataTemp.push({ 'Key': tmpt[i].ConfigKey, 'Value': tmpt[i].ConfigValue, 'Id': tmpt[i].Id });
            }

             if (this.form.value.product.length == 0) this.addItem()
            this.form.updateValueAndValidity();
            this.loader = false;
          } else {
            this.loader = false;
          }
        });
      }

    }
    savefacebook(event): void{
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

      this.loader = true
      this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
      let formproductvalue = []
      formproductvalue = this.form.value.product;

      let comparearr = [{productid: 'Time', roleid: 'NULL'},
                        {productid: 'ProfileName', roleid: 'NULL'},
                        {productid: 'MobileNo', roleid: 'NULL'}]

      const finalresult = formproductvalue.concat(comparearr.filter(bo => formproductvalue.every(ao => ao.productid != bo.productid)));

      var keys = finalresult.map(item => item.productid )
      var values = finalresult.map(item => item.roleid )

      let cntr = 0;
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
              // this.insertConfig()
              this.loader = false
              this.common.snackbar("Update Success");
              if(event == 'next'){
                if (this.eventkey.toUpperCase() === 'ADD') {
                  this.router.navigate(['/masters/channel-configuration/facebook-messenger/facebook-messenger-details',this.path,'add']);
                } else {
                  this.router.navigate(['/masters/channel-configuration/facebook-messenger/facebook-messenger-details',this.path,'add']);
                }}
              else if(event == 'save') this.router.navigate(['masters/channel-configuration/facebook-messenger/view/', this.path]);
            }
            cntr++;
          } else {
            this.loader = false;
          }
        });
      });
    }
  }
