// import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {

  loader: boolean = true;
  submittedForm = false;
  form: FormGroup;
  changeModuleDisplayName: string;
  subscription: Subscription[] = [];
  userConfig: any;
  userDetails: any;
  labelName :any;
  panelOpenState = true;
  panelOpenStateKeyConfiguration = false
  edit = false
  logType = []
  logFileSize = []
  notReadyReasonCode = []
  DurationRepeatCustomer = []
  list = ['gggh','ghjh']
  configdata:any = {}
  allConfigData = []
  addKeyConfiguration = []
  keyConfigurationData= []

  constructor(private api: ApiService,
    public common: CommonService,
    private auth: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    console.log(this.userDetails);
    this.changeModuleDisplayName = this.common.changeModuleLabelName()
    this.common.setMasterConfig();
    this.getNotReadyResonCode()
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.logType = JSON.parse(data["GeneralSettingLogType"])
          this.logFileSize = JSON.parse(data["GeneralSettingLogFileSize"])
        }}))
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }) )
    this.common.setUserConfig(this.userDetails.ProfileType, 'GeneralSettings'.toLowerCase());
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.getAdminConfig()
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('GeneralSettings','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'GeneralSettings'.toLowerCase(), data)

  }

  getNotReadyResonCode(){
    let obj = {
      data: {
          spname: 'usp_unfyd_notready',
          parameters: {
              flag: 'GET',
              processid: this.userDetails.Processid,
              languagecode: 'en'
          },
      },
    };

    this.api.post('index', obj).subscribe((res: any) => {
      if(res.code == 200){
        this.loader  = false;
        this.notReadyReasonCode = res.results['data']
      }
    });
  }

  submit(){
    this.edit = !this.edit
  }

  remove(item,index,type,subType){
    if(type == 'keyConfiguration'){
      if(subType == 'newKey'){
        this.addKeyConfiguration[index].ConfigValue.splice(this.addKeyConfiguration[index].ConfigValue.indexOf(item),1)
      }else if(subType == 'oldKey'){
        this.allConfigData[index].ConfigValue.splice(this.allConfigData[index].ConfigValue.indexOf(item),1)
      }
    }
  }

  addKeywordFromInput(event,index,type,subType,input:HTMLInputElement){
    if(event.value && (event.value).trim().length > 0){
      if(type == 'keyConfiguration'){
        if(subType == 'newKey'){
          this.addKeyConfiguration[index].ConfigValue.push(event.value)
          input.value = ''
        }else if(subType == 'oldKey'){
          this.allConfigData[index].ConfigValue.push(event.value)
          input.value = ''
        }
      }
    }
  }

  returnStatus(type){
    let a = false
    if(type == 'keyConfiguration'){
      this.addKeyConfiguration.forEach(element => {
        if(!this.common.checkTruthyValue(element.ConfigLabel) || !this.common.checkTruthyValue(element.ConfigKey)){
          a = true
        }
      });
    }
    return a;
  }

  returnValidation(type,i,key,errorType):boolean{
    let a = false
    if(type == 'keyConfiguration'){
      if(errorType == 'required'){
        if(!this.common.checkTruthyValue(this.addKeyConfiguration[i][key])){
          a = true
        }
      }
    }
    return a;
  }


  getAdminConfig() {
    this.loader = true
    this.configdata = {}
    this.allConfigData = []
        let obj= {
          data: {
            spname: "usp_unfyd_general_settings",
            parameters: {
              flag: "GET",
              processid: this.userDetails.Processid
            }
          }
        }

      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
            this.loader = false
            if(res.results.data.length > 0){
            this.configdata = {}
            this.allConfigData = res.results.data
            res.results.data.forEach(element => {
              if(element.Category == 'keyConfiguration'){
                element.ConfigValue = element.ConfigValue.split(",")
                this.keyConfigurationData.push(element)
              }
              Object.assign(this.configdata,{[element.ConfigName] : element})
            })
            console.log(this.configdata);

          }
        }
      });
  }

  updateAdminConfig() {
    this.loader = true;

    if(this.configdata['RepeatCustomerDays']['ConfigValue'] > 365 ){
      this.loader = false;
      return false;
    }
    if(this.configdata['RepeatCustomerDays']['ConfigValue'] == 0 ){
      this.loader = false;
      return false;
    }
    if(this.configdata['LogFileSizeValue']['ConfigValue'] > 5 ){
      this.loader = false;
      return false;
    }
    if(this.configdata['LogFileSizeValue']['ConfigValue'] == 0 ){
      this.loader = false;
      return false;
    }
    if(this.configdata['LogFileRolloverNo']['ConfigValue'] > 999 ){
      this.loader = false;
      return false;
    }
    if(this.configdata['LogFileRolloverNo']['ConfigValue'] == 0 ){
      this.loader = false;
      return false;
    }
    if(this.configdata['LogRetainPeriod']['ConfigValue'] > 999 ){
      this.loader = false;
      return false;
    }
    if(this.configdata['LogRetainPeriod']['ConfigValue'] == 0 ){
      this.loader = false;
      return false;
    }
    let count = 0
    this.allConfigData.forEach(element => {
      let obj= {
        data: {
          spname: "usp_unfyd_general_settings",
          parameters: {
            flag: "UPDATE",
            CONFIGNAME:element.ConfigName,
            CONFIGVALUE: element.Category == 'keyConfiguration' ? this.configdata[element.ConfigName]['ConfigValue'] && this.configdata[element.ConfigName]['ConfigValue'].length > 0 ? this.configdata[element.ConfigName]['ConfigValue'].join(',') : ''  : element.ConfigValue,
            CONFIGSTATUS:element.ConfigStatus,
            CONTROLTYPE:element.ControlType,
            CATEGORY:element.Category,
            DESCRIPTION:element.Description,
            DISPLAYNAME:element.DisplayName,
            IMAGEENABLE:element.ImageEnable,
            IMAGEACTION:element.ImageAction,
            IMAGESAVEPATH:element.ImageSavePath,
            IMAGEHOSTPATH:element.ImageHostPath,
            MODIFIEDBY: this.userDetails.Id,
            ID : element.Id
          }
        }
      }

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        count++;
        if(count == this.allConfigData.length){
            this.loader = false
            this.edit = false
            this.common.snackbar('Update Success');
          }
      }
    });
    });
  }

  addNewKeyConfiguration(group){
    if(group == 'keyConfiguration'){
      if(this.returnStatus('keyConfiguration')){
        this.common.snackbar('InvalidKeyConfigurationData')
        return false;
      }
      this.addKeyConfiguration.push(
        {
          ConfigLabel:'',
          ConfigKey:'',
          ConfigValue:[],
          ConfigType:'',
          AlreadyExists:false
        }
      )
    }
  }

  insertKeyConfiguration(group){
    this.loader = true
    let success = 0;
    if(this.returnStatus(group)){
      this.common.snackbar('InvalidKeyConfigurationData')
      this.loader = false
      return false;
    }
    let a = group == 'keyConfiguration' ? this.addKeyConfiguration.length : this.addKeyConfiguration.length
    let dummyObj = group == 'keyConfiguration' ? JSON.parse(JSON.stringify(this.addKeyConfiguration)) : JSON.parse(JSON.stringify(this.addKeyConfiguration))
    dummyObj.forEach((element,i) => {
      if(element.ConfigType == 'time'){
        if(element.ConfigValue){
          let a = JSON.parse(JSON.stringify(element.ConfigValue));
          element.ConfigValue= (a.hour * 60 *60) + (a.minute* 60) + a.second
        }
      }
      let obj= {
        "data": {
            "spname": "usp_unfyd_general_settings",
            "parameters": {
                "FLAG": "INSERT",
                "CONFIGNAME": element.ConfigKey,
                "CONFIGVALUE": element.ConfigValue && element.ConfigValue.length > 0 ? element.ConfigValue.join(",") : '',
                "CONFIGSTATUS": 1,
                "CONTROLTYPE": "",
                "CATEGORY": group ? group : 'keyConfiguration',
                "DESCRIPTION": "",
                "DISPLAYNAME": element.ConfigLabel,
                "PROCESSID": this.userDetails.Processid,
                "PRODUCTID": "",
                "IMAGEENABLE": "",
                "IMAGEACTION": "",
                "IMAGESAVEPATH": "",
                "IMAGEHOSTPATH": "",
                "CREATEDBY": this.userDetails.Id,
                "PUBLICIP": this.userDetails.ip,
                "PRIVATEIP": "",
                "BROWSERNAME": "",
                "BROWSERVERSION":""
            }
        }
    }
    // let obj = {
    //   data: {
    //     spname: "UNFYD_CONFIG_MANAGER",
    //     parameters: {
    //       FLAG : 'INSERT' ,
    //       CONFIGNAME: element.ConfigKey,
    //       CONFIGVALUE:element.ConfigValue,
    //       CONTROLTYPE:element.ConfigType,
    //       DISPLAYNAME:element.ConfigLabel,
    //       SUBCATEGORY: group ? group : 'keyConfiguration',
    //       CONFIGDESC:'',
    //       APPNAME:'',
    //       CHANNELID:this.form.value.channel,
    //       LANGUAGECODE:this.form.value.language,
    //       CREATEDBY:this.userDetails.Id,
    //       PUBLICIP:this.userDetails.ip,
    //       PROCESSID:this.userDetails.Processid
    //     }
    //   }
    // }
    this.api.post('index', obj).subscribe((res: any) => {
      if(res.code == 200){
        if(res.results.data[0].result == 'Data already exists'){
            element.AlreadyExists = true;
            Object.assign(dummyObj[i],{success:false})
        } else{
          Object.assign(dummyObj[i],{success:true})
          success++;
        }
        a--;
        if(a == 0){
          this.loader = false;
          if(success) this.common.snackbar("Saved Success");
          else this.common.snackbar('Exists');
          if(group == 'keyConfiguration') this.addKeyConfiguration = dummyObj.filter(xyz => !xyz.success)
          this.getAdminConfig()
        }
      }
    })
  });

  }


  CancelEdit() {
    this.edit = !this.edit;
  }

  deleteAddedKey(i,type){
    if(type == 'keyConfiguration'){
      this.addKeyConfiguration.splice(i,1)
    }
  }

}
