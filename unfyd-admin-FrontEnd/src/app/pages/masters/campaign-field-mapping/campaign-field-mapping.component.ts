import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console } from 'console';
import { regex } from 'src/app/global/json-data';
@Component({
  selector: 'app-campaign-field-mapping',
  templateUrl: './campaign-field-mapping.component.html',
  styleUrls: ['./campaign-field-mapping.component.scss']
})
export class CampaignFieldMappingComponent implements OnInit {

  systemDefinedFields:any = []
  userDefinedFields:any = []
  systemDefinedFieldsJson = {
    'TaskName' : { "label": "Task Name", "dateFormat": null, "formControlName": "Task-Name", "type": "textbox", "mandatory": true, "regularExpression": "^[a-zA-Z-( )('')]+$", "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], "buttonHeaders": [], "apiUrl": null, "apiMethod": null, "attributeName": "TaskName", "defineField": "SystemDefinedField" },
    'CustomerName' : { "label": "CustomerName", "dateFormat": null, "formControlName": "CustomerName", "type": "textbox", "mandatory": true, "regularExpression": "^[a-zA-Z-( )('')]+$", "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], "buttonHeaders": [], "apiUrl": null, "apiMethod": null, "attributeName": "CustomerName", "defineField": "SystemDefinedField" },
    'Channel' : { "label": "Channel", "dateFormat": null, "formControlName": "Channel", "type": "list", "mandatory": true, "regularExpression": "^[a-zA-Z-( )('')]+$", "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], "buttonHeaders": [], "apiUrl": null, "apiMethod": null, "attributeName": "Channel", "defineField": "SystemDefinedField" },
    'Category' : { "label": "Category", "dateFormat": null, "formControlName": "Category", "type": "list", "mandatory": true, "regularExpression": "^[a-zA-Z-( )('')]+$", "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], "buttonHeaders": [], "apiUrl": null, "apiMethod": null, "attributeName": "Category", "defineField": "SystemDefinedField" },
    'SubCategory' : { "label": "SubCategory", "dateFormat": null, "formControlName": "Sub-Category", "type": "list", "mandatory": false, "regularExpression": "^[a-zA-Z-( )('')]+$", "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], "buttonHeaders": [], "apiUrl": null, "apiMethod": null, "attributeName": "SubCategory", "defineField": "SystemDefinedField" },
    'Gender' : { "label": "Gender", "dateFormat": null, "formControlName": "Gender", "type": "checkbox", "mandatory": true, "regularExpression": null, "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], "buttonHeaders": [], "apiUrl": null, "apiMethod": null, "attributeName": "Gender", "defineField": "SystemDefinedField" },
    'MobileNo' : { "label": "MobileNo", "dateFormat": null, "formControlName": "Mobile-No", "type": null, "mandatory": null, "regularExpression": "^[6-9][0-9]{9}$", "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], "buttonHeaders": [], "apiUrl": null, "apiMethod": null, "attributeName": "MobileNo", "defineField": "SystemDefinedField"},
    'WhatsAppNo' : { "label": "WhatsappNo", "dateFormat": null, "formControlName": "Whatsapp-No", "type": "textbox", "mandatory": false, "regularExpression": "^[0-9]*$", "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], "buttonHeaders": [], "apiUrl": null, "apiMethod": null, "attributeName": "WhatsAppNo", "defineField": "SystemDefinedField" } ,

 }
  selectCampaignField:any;
  loader: boolean = false;
  submittedForm = false;
  masters: any;
  campaignDetails: any;
  userDetails: any;
  campaignName : any;
  form: FormGroup;
  systemFields : any;
  requestObj: { data: { spname: string; parameters: any } };
  userFields: any;
  reset: any;
  regex:any;
  parentDropDown = []
  dateFormats = []
  labelName:any;
  allFormControl:any = [];
  formControlTypes : Array<string> = ['textbox','list','checkbox','datetime','button']
  apiMethod:Array<Object> = [
    { Key:'get',Value:"get"},
    { Key:'post',Value:"post"},
    { Key:'delete',Value:"delete"},
    { Key:'put',Value:"put"},
  ]
  regularExp:Array<Object> = [
    { Key:'alphabet',Value:"^[a-zA-Z-( )('')]+$"},
    { Key:'number',Value:"^[0-9]*$"},
    { Key:'email',Value:"([a-zA-Z0-9+_.-])+[@]+[a-zA-Z0-9]+[.]+[a-z]{2,4}$"}]


  constructor(
    private formBuilder:FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private common: CommonService,) {
      Object.assign(this, { regex });
      }

  ngOnInit() {
    this.userDetails = this.auth.getUser();
    this.selectCampaign()

    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.dateFormats = JSON.parse(data['DateFormatSettings'])
      this.systemFields = {
        Fields: JSON.parse(data.CampaignFieldMapping),
        userFields: JSON.parse(data.UserDefinedFields),
      }

    });
    this.form = this.formBuilder.group({
      enableChannelwiseCapacity: [false],
      channelid: [''],
      channelGroup: this.formBuilder.array([]),
      CampaignName: [''],
      TaskName: [''],
      Category: [''],
      SubCategory: [''],
      Source: [''],
      Priority: [''],
      Agent: [''],
      Channel: [''],
      WhatsappHSMName: [''],
      EmailTemplateName: [''],
      ScheduleName: [''],
      CustomerName: [''],
      Gender: [''],
      MobileNo: [''],
      WhatsappNo: [''],
      EmailID: [''],
      DOB: [''],
      DOA: [''],
      PreferredLanguage: [''],
      PreferredTimeConnect: [''],
      Attribute1: [''],
      Attribute2: [''],
      Attribute3: [''],
      Attribute4: [''],
      Attribute5: [''],
      Attribute6: [''],
      Attribute7: [''],
      Attribute8: [''],
      Attribute9: [''],
      Attribute10: [''],
      Attribute11: [''],
      Attribute12: [''],
      Attribute13: [''],
      Attribute14: [''],
      Attribute15: [''],
      Attribute16: [''],
      Attribute17: [''],
      Attribute18: [''],
      Attribute19: [''],
      Attribute20: ['']
    })
  }

  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'DataCollectionForms', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;

    });
  }

  submitCampaign() {
    var Obj = {
      data: {
        spname: "usp_unfyd_campaign_field_map",
        parameters: {
          flag: "INSERT",
          PROCESSID: this.userDetails.Processid,
          CAMPAIGNID: this.selectCampaignField,
          SysDefinedFields: this.systemDefinedFields.toString(),
          UserDefinedFields: this.userDefinedFields.toString(),
          createdby: this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
        }
      }
    };
    this.api.post('index', Obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.campaignDetails = res.results.data;
        this.submitFormControls(res.results.data[1].result);
      }      

    });
    

  }

  selectCampaign() {
    var Obj = {
      data: {
        spname: "usp_unfyd_campaigns",
        parameters: {
          flag: "GET",
          PROCESSID: this.userDetails.Processid,
        }
      }
    };
    this.api.post('index', Obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.campaignDetails = res.results.data;
      }      
    });

    
  }

  systemDefinedFieldsMethod(){

    let dummyArray = [...this.allFormControl]

    let c = 0
    dummyArray.forEach(element => {
        if (this.allFormControl[c].defineField == 'SystemDefinedField'){
        this.allFormControl.splice(c,1)
        c = 0;
      } else{
        c++;
      }
    });
    
    this.systemDefinedFields.forEach(element => {
      this.addFormControl(element,'SystemDefinedField')
    });
  }

  userDefinedFieldsMethod(){
    let userDefinedAvailable = []
    for (const key in this.allFormControl) {
      if (this.allFormControl[key].defineField == 'UserDefinedField'){
        userDefinedAvailable.push({...this.allFormControl[key],i:key})
      }
    }

    let dummyCopy = [...this.allFormControl]
    dummyCopy.forEach(element => {
      let lastIndex = this.allFormControl.length -1
      if(this.allFormControl[lastIndex].defineField == 'UserDefinedField'){
        this.allFormControl.pop()
      }
    });
    let oldValues = []
    userDefinedAvailable.forEach(element => {
      oldValues.push(element.attributeName)
    });
    let valueToDelete = userDefinedAvailable.filter(x => !this.userDefinedFields.includes(x.attributeName))

    valueToDelete.forEach(element => {
      const index = userDefinedAvailable.indexOf(element);
        if (index > -1) { // only splice array when item is found
          userDefinedAvailable.splice(index, 1); // 2nd parameter means remove one item only
        }
    });

    for (const key in this.userDefinedFields) {
      if(this.userDefinedFields.includes(userDefinedAvailable[key]?.attributeName)){
        this.allFormControl.push(userDefinedAvailable[key])
      } else{
        this.addFormControl(this.userDefinedFields[key],'UserDefinedField')
      }
    }

  }

  addFormControl(attr?:string,definedF?:string){
    let formControlsArray =      {
        label: null,
        dateFormat:null,
        formControlName: null,
        type: null,
        mandatory : null,
        regularExpression : null,
        value: null,
        parent:	null,
        nestedControlOfWhom:null,
        nestedControl:null,
        listOfValues:[],
        buttonHeaders:[],
        apiUrl:null,
        apiMethod:null,
        attributeName: attr ? attr : null,
        defineField: definedF ? definedF : null
      }

      if(definedF == 'SystemDefinedField'){
        this.allFormControl.unshift(this.systemDefinedFieldsJson[attr])
      } else{
        this.allFormControl.push(formControlsArray)
      }
    this.allFormControl.forEach(element => {
      if(element.type == 'list'){
        if(element.formControlName != null && element.formControlName != '' && element.formControlName != undefined){
          this.parentDropDown.push(element.formControlName)
        }
      }
    });
  }

  deleteFormControl(i:any){
    for (let key in this.allFormControl) {
        if(this.allFormControl[key].formControlName == this.allFormControl[i].nestedControlOfWhom){
          this.allFormControl[key].nestedControl = null
        }
    }
    this.allFormControl.splice(i,1)
  }

  deleteButtonHeader(i:any,k:any){
    this.allFormControl[i].buttonHeaders.splice(i,1)
  }

  deleteListOfValues(i:number,j:number){
    for (let key in this.allFormControl) {
      for(let key2 in this.allFormControl[key].listOfValues){
        if(this.allFormControl[key].listOfValues[key2].parent1Value == this.allFormControl[i].listOfValues[j].option){
          this.allFormControl[key].listOfValues[key2].parent1FormControl = null;
        }
        if(this.allFormControl[key].listOfValues[key2].parent2Value == this.allFormControl[i].listOfValues[j].option){
          this.allFormControl[key].listOfValues[key2].parent2FormControl = null;
        }
        if(this.allFormControl[key].listOfValues[key2].parent3Value == this.allFormControl[i].listOfValues[j].option){
          this.allFormControl[key].listOfValues[key2].parent3FormControl = null;
        }
      }
    }

    if(this.allFormControl[i].value == this.allFormControl[i].listOfValues[j].option){
      this.allFormControl[i].value = null
    }
    this.allFormControl[i].listOfValues.splice(j,1)
  }

  checkRegex(regexExp,value){
    var regex = new RegExp(regexExp);
    return regex.test(value)
  }

  addNewFormField(){
    let a = true;
    this.allFormControl.forEach(element => {
      if(element.label == null || element.label == '' || element.label == undefined){
        a = false;
      }
    });
    return a;
  }

  addFormControlName(i){
    this.allFormControl[i].formControlName = this.allFormControl[i].label.replace(/ /g, '-')
  }

  filterParentDropDown(currentFormControl:string): any[] {
    let parentArray = []

    this.allFormControl.forEach(element => {
      if(element.type == 'list'){
        if(element.formControlName != null && element.formControlName != '' && element.formControlName != undefined && !(element.formControlName.trim().length === 0)){
          if(element.formControlName != currentFormControl){
            parentArray.push(element.formControlName)
          }
        }
      }
    });

    return parentArray;
  }

  returnParentDropDown(currentFormControl:string): any[] {

    let parentArray = []

    this.allFormControl.forEach(element => {
      if(element.type == 'list'){
        if(element.formControlName  == currentFormControl){
          element.listOfValues.forEach(element2 => {
            if(element2.option != null && element2.option != '' && element2.option != undefined &&  !(element2.option.trim().length === 0)){
              parentArray.push(element2)
            }
          });
        }
      }
    });

    return parentArray;
  }

  defaultValueForDropDown(i:number){
    let parentArray = []

          this.allFormControl[i].listOfValues.forEach(element2 => {
            if(element2.option != null && element2.option != '' && element2.option != undefined &&  !(element2.option.trim().length === 0)){
              parentArray.push(element2)
            }
          });



    return parentArray;
  }


  addAttribute(formControlName:string,i :number){
    let AttributesToAdd:any = {
      option:null,
      parent1Value:null,
      parent1FormControl:null,
      parent2Value:null,
      parent2FormControl:null,
      parent3Value:null,
      parent3FormControl:null,
    }
          if(this.allFormControl[i].parent == null){
            AttributesToAdd = {
              option:null,
              parent1Value:null,
              parent1FormControl:null,
              parent2Value:null,
              parent2FormControl:null,
              parent3Value:null,
              parent3FormControl:null,
            }
            this.allFormControl[i].listOfValues.push(AttributesToAdd)
          }else{
            AttributesToAdd.parent1FormControl = this.allFormControl[i].parent;
            this.allFormControl.forEach(element => {
              if(element.formControlName == AttributesToAdd.parent1FormControl){
                if(element.parent){
                  AttributesToAdd.parent2FormControl = element.parent;
                }
              }
            })
            this.allFormControl.forEach(element => {
              if(element.formControlName == AttributesToAdd.parent2FormControl){
                if(element.parent){
                  AttributesToAdd.parent3FormControl = element.parent;
                }
              }
            })
            this.allFormControl[i].listOfValues.push(AttributesToAdd)
          }
  
  }

  addHeader(formControlName:string,i){
    this.allFormControl[i].buttonHeaders.push({Key:'',Value:''})
  }

  changeControlType(i:number){
   
    this.allFormControl[i].dateFormat=null,
    this.allFormControl[i].mandatory = false,
    this.allFormControl[i].regularExpression = null,
    this.allFormControl[i].value= null,
    this.allFormControl[i].parent=	null,
    this.allFormControl[i].nestedControlOfWhom=null,
    this.allFormControl[i].nestedControl=null,
    this.allFormControl[i].listOfValues=[],
    this.allFormControl[i].buttonHeaders=[],
    this.allFormControl[i].apiUrl=null,
    this.allFormControl[i].apiMethod=null

  }

  filterNestedControls(i){
    let dummyArray = []
    for (const key in this.allFormControl) {
      if(key != i){
        dummyArray.push(this.allFormControl[key].label)
      }
    }
    return dummyArray;
  }

  setNestedParentControl(parentControlName,selfControlName,i){
    let values = []
    this.allFormControl[i].nestedControlOfWhom.forEach(element => {
      for (let key in this.allFormControl) {
        if(this.allFormControl[key].label == element){
          this.allFormControl[key].nestedControl = selfControlName;
        }
      }
    })

    for (let key in this.allFormControl) {
      if(this.allFormControl[key].nestedControl == selfControlName){
        values.push({label:this.allFormControl[key].label,i:key})
      }
    }

    values.forEach(element => {
      if(!this.allFormControl[i].nestedControlOfWhom.includes(element.label)){
        this.allFormControl[element.i].nestedControl = null
      }
    });

  }

  submitFormControls(id){
    this.allFormControl.forEach(element => {

    let obj:any = {
      data: {
          spname: "usp_unfyd_campaign_attribute",
          parameters: {
              FLAG: "INSERT",
              MAPPINGID: parseInt(id), 
              NAME:element.label,
              DESCRIPTION:'',
              CONTROLTYPE:element.type,
              DEFAULTVALUE:element.value,
              PLACEHOLDER:element.label,
              REGULAREXPRESSION:element.regularExpression,
              ERRORMESSAGE:'',
              MANDATORY:element.mandatory,
              LISTVALUE:element.listOfValues.length == 0 ? null : JSON.stringify(element.listOfValues),
              FORMREQ:JSON.stringify(element),
              CONTROLSEQUENCE:'',
              PARENTCONTROLID:element.parent,
              VISIBLETOAGENT:'',
              LISTVALUEID:'', 
              NESTEDCONTROL:element.nestedControl,
              NESTEDCONTROLOFWHOM: element.nestedControlOfWhom ? element.nestedControlOfWhom.toString():element.nestedControlOfWhom,
              DATEFORMAT:element.dateFormat,
              PROCESSID:this.userDetails.Processid,
              createdby: this.userDetails.Id,
              publicip: this.userDetails.ip,
              privateip: '',
              browsername: this.userDetails.browser,
              browserversion: this.userDetails.browser_version,
          }
        }
      }

      this.api.post('index', obj).subscribe(res => {
        if (res.code == 200) {
          if(element.type == 'list'){
          element.listOfValues.forEach(element1 => {
            let obj1:any = {
              data: {
                  spname: "usp_unfyd_control_value",
                  parameters: {
                      FLAG: "INSERT",
                      CONTROLID:'',
                      PARENTKEY:res.results.data[1].result,
                      KEYNAME:element1.option,
                      KEYVALUE:element1.option
                  }
                }
              }

              this.api.post('index', obj1).subscribe(res => {
                if (res.code == 200) {
                } else {
                  this.common.snackbar("General Error");
                }
              },
                (error) => {
                  this.common.snackbar("General Error");
                })


          });
        }

        } else {
          this.common.snackbar("General Error");
        }
      },
        (error) => {
          this.common.snackbar("General Error");
        })
    });
  }
}

