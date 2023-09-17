import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, RouteConfigLoadStart, Router } from '@angular/router';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, regex, channelConfigurationSteps } from 'src/app/global/json-data';


export class noSpaceValidator {
  static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
      if((control.value as string).indexOf(' ') === 0){
          return {cannotContainSpace: true}
      }

      return null;
  }
}

@Component({
  selector: 'app-channel-attribute-mapping',
  templateUrl: './channel-attribute-mapping.component.html',
  styleUrls: ['./channel-attribute-mapping.component.scss']
})
export class ChannelAttributeMappingComponent implements OnInit {
  productType=[{Id:'Profile_Name',ProductName:'Profile Name'},{Id:'Time',ProductName:'Time'},{Id:'Mobile_No',ProductName:'Mobile No'}]
  attributeMapping=[{Id:'CustomerAttribute1',ProductName:'Customer Attribute 1'},{Id:'CustomerAttribute2',ProductName:'Customer Attribute 2'},{Id:'CustomerAttribute3',ProductName:'Customer Attribute 3'}]
  key: any;
  form: FormGroup;
  loader: boolean = false;
  path: any;
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
  customerAttributes: any = '';
  hide = true;
  hide1 = true;
  hide2 = true;
  isDropDown: boolean;
  editwts: boolean = false;
  uniqueId: any;
  eventkey: any;
  isUpdate: any = 'false';
  deletearr : any = [];
  finalarr: any= [];
  subscription: Subscription[] = [];
  labelName: any;
  userConfig: any;
  actionname: any;
  i: any;
  dataConfig: any;

  ChannelIDResVal: any;
  ProcessIdResVal: any;
  UniqueIdResVal: any;
  ProductIdResVal: any;
  ChannelSrcIDResVal: any;
  ChannelNameResVal: any;
  AdditionalPropValueArray: any = [];
  constructor(private common: CommonService, private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private api: ApiService, private auth: AuthService, private el: ElementRef,) { Object.assign(this, { masters, regex, channelConfigurationSteps }); }


  ngOnInit(): void {
    this.common.hubControlEvent('ChannelConfiguration','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.eventkey = this.activatedRoute.snapshot.paramMap.get('action');
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.form = this.formBuilder.group({
      product: this.formBuilder.array([]),
      Listoption: this.formBuilder.array([]),
    })

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'ChannelConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          // (data);

    }))

    this.uniqueId = this.activatedRoute.snapshot.paramMap.get('uniqueid');
    if ((this.uniqueId === 'null') || (this.uniqueId === undefined) || (this.uniqueId === null)) {
      this.loader = false;
      this.router.navigate(['masters/channel-configuration/channel-details', this.path, 'add'])
    }
    else {
      if ((this.uniqueId !== 'null') || (this.uniqueId !== undefined) || (this.uniqueId !== null)) {
        this.isUpdate = 'true';
        this.editwhatsapp('edit', this.uniqueId)
      }
    }

    this.getChannel();
    this.getWhatsapplist();
    this.getAdditionalField()



    if(!this.activatedRoute.snapshot.paramMap.get('uniqueid')) this.addItem()
    this.common.hubControlEvent('ChannelConfiguration','click','pageload','pageload','','ngOnInit');

  }

  Changeatrributes(event) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',event,'Changeatrributes');
    this.customerAttributes = event
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',data,'setLabelByLanguage');
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        // (data1);
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ChannelConfiguration', data)
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
      this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj),'editwhatsapp');

      this.api.post('index', obj).subscribe(res => {
        this.reset = true;
        if (res.code == 200) {

          let resvalue = res.results.data[0]
          this.ChannelIDResVal = resvalue.ChannelID
          this.ProcessIdResVal = resvalue.ProcessId
          this.ProductIdResVal = resvalue.ProductId
          this.UniqueIdResVal = resvalue.UniqueId
          this.ChannelSrcIDResVal = resvalue.ChannelSrcID
          this.ChannelNameResVal = resvalue.ChannelName



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
          this.form.updateValueAndValidity();
          this.loader = false;
        } else {
          this.loader = false;
        }
      });
    }

  }


  savewhatsapp(event) {
    this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(event),'savewhatsapp');



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
    let formproductvalue = []
    formproductvalue = this.form.value.product;

    let comparearr = [{productid: 'Time', roleid: 'NULL'},
                      {productid: 'Profile_Name', roleid: 'NULL'},
                      {productid: 'Mobile_No', roleid: 'NULL'}]

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
      this.common.hubControlEvent('ChannelConfiguration','click','','',JSON.stringify(obj),'savewhatsapp');

      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
          this.loader = false;
          if (updateData.length - 1 == cntr) {
            this.insertConfig()
            this.loader = false
            this.common.snackbar("Update Success");
            if(event == 'save') {this.router.navigate(['/masters/channel-configuration/channel-attribute-mapping', this.path, 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);}
            else if(event == 'next') this.router.navigate(['masters/channel-configuration/hsm-api', this.path, 'update', this.activatedRoute.snapshot.paramMap.get('uniqueid')]);

          }
          cntr++;
        } else {
          this.loader = false;
        }
      });
    });

  }


  insertConfig(){

    let formRawVal = this.form.getRawValue();
    let formRawValListOP = formRawVal.Listoption


    formRawValListOP.forEach((element,i)=>{

    let obj1 ={
    data:{
      spname:"usp_unfyd_channel_config",
      parameters:{
        flag:'INSERT',
        ConfigKey:element.channelkey,
        ConfigValue:element.channelvalue,
        CONFIGTYPE:"User defined",
        Id:this.path,
        ChannelID: this.ChannelIDResVal,
        ProcessId:this.ProcessIdResVal ,
        ProductId:this.ProductIdResVal,
        Status:1,
        UniqueId:this.UniqueIdResVal,
        ChannelSrcID:this.ChannelSrcIDResVal,
        ChannelName:this.ChannelNameResVal
      }
    }

  }
  this.api.post('index', obj1).subscribe((res1: any) => {
    if(res1.code == 200){
    }

  })
})
}



  get w(): { [key: string]: AbstractControl } {
    return this.whatsappchanelform.controls;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
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
    this.common.hubControlEvent('ChannelConfiguration','click','','','','getWhatsapplist');

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


  getAdditionalField()
  {
    let addfiedlobj = {
      data: {
        spname: 'usp_unfyd_channel_config ',
        parameters: {
          flag: "GET_USERDEFINED_KEYS",
          processid: this.userDetails.Processid,
          CHANNELSRCID: this.activatedRoute.snapshot.paramMap.get('uniqueid'),
        }
      }
    };

    this.api.post('index',addfiedlobj).subscribe((res) => {

      if(res.code == 200)
      {
          var temp = res.results.data

        if(temp.length > 0 )
        {
             for (let i = 1; i <= temp.length; i++) {
              this.Listoption.push(
                new FormGroup({
                  channelkey: new FormControl({ value: '', disabled: true },Validators.required),
                  channelvalue: new FormControl('',Validators.required)
                })
              )
             }
             var arrayControl = this.form.get('Listoption') as FormArray;
             arrayControl.controls.forEach((element, index) => {
               (arrayControl.at(index) as FormGroup).get('channelkey').patchValue(temp[index].ConfigKey);
               (arrayControl.at(index) as FormGroup).get('channelvalue').patchValue(temp[index].ConfigValue);
             });
           }

           this.AdditionalPropValueArray = temp;
        }
        else{

        }
      }


    )


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
          id: this.path
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
  get product(): FormArray {
    return this.form.get('product') as FormArray;
  }

  get Listoption(): FormArray {
    return this.form.get("Listoption") as FormArray
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



  newListoption(): FormGroup {
    return this.formBuilder.group({
      keyname: new FormControl('', [Validators.nullValidator]),
      listHeader: new FormControl('', [Validators.nullValidator]),
      listDescription: new FormControl('', [Validators.nullValidator])
    })
  }


  addlistoption():void{


    if (this.form.invalid) {
      this.loader = false;

      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          break;
        }
      }

      // this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }

    this.Listoption.push(
      new FormGroup({
        channelkey: new FormControl('',[Validators.required,noSpaceValidator.cannotContainSpace]),
        channelvalue: new FormControl('',[Validators.required,noSpaceValidator.cannotContainSpace])
      }
      )
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

  removeListOption(i,item){
    const add = this.form.get('Listoption') as FormArray;
    add.removeAt(i)



    this.AdditionalPropValueArray.forEach(element => {
     if(element.ConfigKey == item.value.channelkey && element.ConfigValue == item.value.channelvalue)
     {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_channel_config ',
          parameters: {
            flag: "DELETE_USERDEFINED_KEYS",
            id: element.Id
          }
        }
      };
      this.api.post('index', this.requestObj).subscribe((res) => {
        if (res.code == 200) {
          this.common.snackbar("Delete Record");
        }
      });

     }

    });

  }







  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
