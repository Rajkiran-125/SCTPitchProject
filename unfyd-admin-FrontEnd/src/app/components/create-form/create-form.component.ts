import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex } from 'src/app/global/json-data';
import { environment } from 'src/environments/environment';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit{
  fileFormatsDynamicForm = []
  @Input() systemDefinedFields: boolean = false;
  @Input() userDefinedFields: boolean = false;
  @Input() selectedIndex: number = 0;
  @Output() exportAllFormControls = new EventEmitter<any>();
  @Output() resetTask: any = new EventEmitter<any>();
  @Input() allFormControl: any = [];
  @Input() structure = false
  disableFormName = false
  showAPIModule = true
  icons = ['happy_smile', 'unhapy_smile', 'smile', 'upload', 'queue_manager', 'parking_manager', 'offline_routing']
  dataTypeArray = ['text', 'number']
  selectedIcon = 'happy_smile'
  path: any;
  type: any;
  aaaa: any;
  userDetails: any;
  labelName: any;
  submittedForm: boolean = false;
  form: FormGroup;
  formName: FormGroup;
  regex: any;
  parentDropDown = []
  Object = Object;
  dateFormats = []
  showToaster = 0;
  subscription: Subscription[] = [];
  structureTemplate = []
  formControlTypes: Array<string> = ['input', 'list', 'checkbox', 'datetime', 'button','upload']
  fieldType: Array<Object> = [{Key:'userDefinedField',Value:'User Defined Field'},{Key:'systemDefinedField',Value:'System Defined Field'}]
  apiMethod: Array<Object> = [
    { Key: 'GET', Value: "get" },
    { Key: 'POST', Value: "post" },
    { Key: 'DELETE', Value: "delete" },
    { Key: 'PUT', Value: "put" },
  ]
  // dummyAllFormControl = this.allFormControl;
  dummyAllFormControl = [];
  loader: boolean;
  productId: any
  userConfig: any;
  processShortCode: any;
  deleteMethod: boolean = false;
  newControl: boolean = true;
  mappedAttributes: any = [];
  disabled: boolean = false;
  touchUi: boolean = false;
  colour: any;
  systemDefinedFieldVar:string | undefined
  userDefinedFieldVar:string | undefined
  systemDefinedFieldArray = []
  @Input() resetform : boolean
  // :Array<Object> = [{Key:'firstName',Value:'First Name'},
  // {Key:'lastName',Value:'Last Name'},
  // {Key:'email',Value:'Email'}]
  userDefinedFieldArray = []
  structureTemplateSelected = ''
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private common: CommonService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private api: ApiService) {
    Object.assign(this, { regex });
  }

  ngOnInit(): void {
    for (let i of Array(60).keys()) {
      this.userDefinedFieldArray.push({Key:['field'+(i+1)],Value:['Field '+(i+1)]})
    }

    this.userDetails = this.auth.getUser();
    this.callSystemDefinedFields()
    this.getStructure()
    // this.type = this.activatedRoute.snapshot.paramMap.get('type');
    // this.path = this.activatedRoute.snapshot.paramMap.get('id');
    // this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.common.setUserConfig(this.userDetails.ProfileType, 'DataCollectionForms');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data;
    }));
    this.common.setMasterConfig();
    this.subscription.push(this.common.getMasterConfig$.subscribe(data => {
      this.dateFormats = JSON.parse(data['DateFormatSettings'])
      this.fileFormatsDynamicForm = JSON.parse(data['fileFormatsDynamicForm'])
    }))
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(this.common.addFormControl$.subscribe((res) =>{
        this.userDefinedFieldVar = this.userDefinedFieldArray[0].Key
        this.addFormControl()
      }))
    this.form = this.formBuilder.group({
      api: ['', Validators.nullValidator],
      method: ['', Validators.nullValidator],
      body: this.formBuilder.array([this.createBody()]),
      Format: ['', Validators.nullValidator],
      header: this.formBuilder.array([this.createHeader()]),
      params: this.formBuilder.array([this.createHeader()]),
      auth: this.formBuilder.group({ type: ['', Validators.nullValidator] }),
      response_format: ['', Validators.nullValidator],
      response: this.formBuilder.array([this.createResponse()]),
      type: ['Dynamic', Validators.nullValidator],
      patchResponseToDropdownOption: [false, Validators.nullValidator],
      patchDropdowns: this.formBuilder.array([this.createPatchList()]),
    });
    this.formName = this.formBuilder.group({
      formName: [{ value: '', disabled: this.disableFormName }, [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      icon: ['', [Validators.nullValidator]],
      NoOfFields: ['', [Validators.nullValidator]],
      color: ['', [Validators.nullValidator]],
      description: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      createTable: [false],
      tableName: [''],
      Primary: [''],
      MappedTable: [''],
      MappedColumn: [''],
      PrimaryColumn: [''],
      tableType: [''],
      ReferenceColumn: ['']
    });
    if (this.path) {
      this.getFormData();
    }
    this.getTableData();
    this.getProcessShortCode();
    this.attributes();
  }

  reset() {
    this.allFormControl = []
    this.formName.reset()
    this.resetTask.emit(true)
    this.changesDone()
  }
  createForm(){
    this.showAPIModule = false;
    // this.form.reset()
    this.form.patchValue({
      api: '',
      method: '',
      body: [{Key:'',Value: ''}],
      Format: '',
      header: [{key:'',value:''}],
      params: [{key:'',value:''}],
      auth: { type: ''},
      response_format: '',
      response: [{field:'',response:''}],
      type: 'Dynamic',
      patchResponseToDropdownOption: false,
      patchDropdowns: [{field: '',key: '',value: ''}],
    });
    this.form.updateValueAndValidity()
    setTimeout(() => {
      this.showAPIModule = true
    },1000);
  }

  getProcessShortCode() {
    let obj = {
      "data": {
        "spname": "usp_unfyd_getdropdowndetails",
        "parameters": {
          "FLAG": "GET_PROCESS_SHORT_CODE",
          ProcessId: this.userDetails.Processid
        }
      }
    };
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.processShortCode = res.results.data[0].ShortCode;
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      });
  }

  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false;
      this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'DataCollectionForms', data);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get f1(): { [key: string]: AbstractControl } {
    return this.formName.controls;
  }

  goTo(url) {
    if (url == 'back') this.router.navigateByUrl('/masters/data-collection-forms/' + this.productId + '/' + this.type)
    else this.router.navigateByUrl('/masters/data-collection-forms/' + this.type)
  }

  addFormControl() {
    let formControlsArray = {
      Id: null,
      label: null,
      dateFormat: null,
      formControlName: null,
      formCategory: this.type,
      type: 'input',
      mandatory: null,
      regularExpression: null,
      value: null,
      parent: null,
      parentId: null,
      resetValueOnParentChange : false,
      nestedControlOfWhom: null,
      nestedControl: null,
      listOfValues: [],
      buttonHeaders: [],
      buttonBody: [],
      buttonAuth: [],
      APIURL: null,
      APIMETHOD: null,
      ATTRSEQUENCE: null,
      IsSearch: false,
      FormDisable: false,
      SearchFormControl: null,
      RequestFormat: false,
      Format: null,
      PatchControl: [],
      FormatResponse: null,
      Dynamic: false,
      dataType: null,
      patchResponseToDropdownOption:false,
      patchDropdowns:[],
      patchValueToControlsWhenChanged:false,
      patchValueToControls:[{field:'',key:''}],
      clickButtonAfter : false,
      clickButtonAfterArray : [],
      APICallAfterChange : false,
      APICallAfterChangeConfig : null,
      checkValidation:false,
      checkValidationFormControls:[],
      fieldType:null,
      fieldName:null,
      hide: false,
      nestedToControl : [],
      nestedToValue : [],
      uploadFormType : 'single',
      uploadFormFileFormat : []
    }

    if(this.systemDefinedFields && this.userDefinedFields){
      if(!this.systemDefinedFieldVar && !this.userDefinedFieldVar){
        this.common.snackbar('select field')
        return;
      }
    } else if(this.systemDefinedFields){
      if(!this.systemDefinedFieldVar){
        this.common.snackbar('select systemDefinedFields')
        return;
      }
    }else if(this.userDefinedFields){
      if(!this.userDefinedFieldVar){
        this.common.snackbar('select userDefinedFields')
        return;
      }
    }
    if(this.systemDefinedFieldVar){
      this.systemDefinedFieldArray.forEach(element => {
        if(element.formControlName == this.systemDefinedFieldVar ){
          console.log(Object.assign(formControlsArray, element))
        }
      });
      formControlsArray.fieldName = this.systemDefinedFieldVar
      formControlsArray.fieldType = 'systemDefinedField';
      this.systemDefinedFieldVar = null
      this.userDefinedFieldVar = null
    }else if(this.userDefinedFieldVar){
      formControlsArray.fieldName = this.userDefinedFieldVar
      formControlsArray.fieldType = 'userDefinedField';
      this.systemDefinedFieldVar = null
      this.userDefinedFieldVar = null
    }
    this.allFormControl.push(formControlsArray)
    this.selectedIndex = this.allFormControl.length - 1
    this.allFormControl.forEach(element => {
      if (element.type == 'list') {
        if (element.label != null && element.label != '' && element.label != undefined) {
          this.parentDropDown.push(element.label);
        }
      }
    });
  }

  deleteButtonParameter(i: any, k: any) {
    this.allFormControl[i]?.buttonHeaders.splice(k, 1)
  }

  deleteButtonBodyParameter(i: any, k: any) {
    this.allFormControl[i]?.buttonBody.splice(k, 1)
  }

  deleteFormControl(i: any, id?, name?) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'delete',
        title: 'Are you sure?',
        subTitle: 'Do you want to ' + 'delete' + ' this data',
      },
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status) {
        if (this.path) {
          let obj = {
            "data": {
              "spname": "usp_unfyd_data_collection_form",
              "parameters": {
                "FLAG": "DELETE",
                "ID": id,
                PRODUCTID: this.productId
              }
            }
          }
          this.api.post('index', obj).subscribe(res => {
            if (res.code == 200) {
              this.common.snackbar("Delete Record");
            } else {
              this.common.snackbar("General Error");
            }
          },
            (error) => {
              this.common.snackbar("General Error");
            });
        }
        for (let key in this.allFormControl) {
          if (this.allFormControl[key].type !== 'checkbox' && this.allFormControl[key].label) {
            this.allFormControl[key].formControlName = this.allFormControl[key].label.replace(/[ ]/g, '')
          }
          if (this.allFormControl[key].formControlName == this.allFormControl[i].nestedControlOfWhom) {
            this.allFormControl[key].nestedControl = null
          }
        }
        this.allFormControl.splice(i, 1);
        this.selectedIndex = 0
        this.changesDone();
      }
    });
  }

  deleteListOfValues(i: number, j: number) {
    for (let key in this.allFormControl) {
      for (let key2 in this.allFormControl[key].listOfValues) {
        if (this.allFormControl[key].listOfValues[key2].parent1Value == this.allFormControl[i].listOfValues[j].value) {
          this.allFormControl[key].listOfValues[key2].parent1Value = null;
          this.allFormControl[key].listOfValues[key2].parent1FormControl = null;
        }
        if (this.allFormControl[key].listOfValues[key2].parent2Value == this.allFormControl[i].listOfValues[j].value) {
          this.allFormControl[key].listOfValues[key2].parent2Value = null;
          this.allFormControl[key].listOfValues[key2].parent2FormControl = null;
        }
        if (this.allFormControl[key].listOfValues[key2].parent3Value == this.allFormControl[i].listOfValues[j].value) {
          this.allFormControl[key].listOfValues[key2].parent3Value = null;
          this.allFormControl[key].listOfValues[key2].parent3FormControl = null;
        }
      }
    }
    this.allFormControl[i].listOfValues.splice(j, 1);
  }

  checkRegex(regexExp, value) {
    var regex = new RegExp(regexExp);
    return regex.test(value)
  }
  showRegexMessage(value): boolean {
    let regex: boolean = false;
    if (value !== null && value !== undefined && value !== '' && value.trim() !== '') {
      regex = true;
    }
    return regex;
  }

  addNewFormField() {
    let a = false;
    if (this.allFormControl.length == 0) {
      a = false
      return a;
    }
    this.allFormControl.forEach(element => {
      if (element.label == null || element.label == '' || element.label == undefined) {
        a = true;
        return a;
      }
      if (element.type === null) {
        a = true;
        return a;
      }
    });
    return a;
  }

  disabledSubmitButton() {
    let a = true
    if (this.allFormControl.length && this.formName.invalid) {
    }
  }

  addFormControlName(i) {
    if (this.allFormControl[i]?.label !== null || this.allFormControl[i]?.label !== undefined) {
      if (this.allFormControl[i].type !== 'checkbox') {
        this.allFormControl[i].formControlName = this.allFormControl[i].label.replace(/[ ]/g, '');
      }
      // this.allFormControl[i].formControlName = this.allFormControl[i]?.label.replace(/[ ]/g, '')
    }
  }

  filterParentDropDown(currentFormControl: string): any[] {
    let parentArray = [];
    this.allFormControl.forEach(element => {
      if (element.type !== 'checkbox') {
        if (element.label != null && element.label != '' && element.label != undefined && !(element.label.trim().length === 0)){
          element.formControlName = element.label.replace(/[ ]/g, '');
        }
      }
      if (element.type == 'list') {
        if (element.formControlName != null && element.formControlName != '' && element.formControlName != undefined && !(element.formControlName.trim().length === 0)) {
          if (currentFormControl && element.formControlName != currentFormControl.replace(/[ ]/g, '')) {
            parentArray.push(element.label);
          }
        }
      }
    });
    return parentArray;
  }

  returnControlLists() {
    let parentArray = [];
    this.allFormControl.forEach(element => {
      if (element.type !== 'checkbox') {
        if (element.label != null && element.label != '' && element.label != undefined && !(element.label.trim().length === 0)) {
        element.formControlName = element.label.replace(/[ ]/g, '');
        }
      }
      if (element.type !== 'button') {
        if (element.formControlName != null && element.formControlName != '' && element.formControlName != undefined && !(element.formControlName.trim().length === 0)) {
          parentArray.push(element.label);
        }
      }
    });
    return parentArray;
  }

  returnAllFormControlLists() {
    let parentArray = [];
    this.allFormControl.forEach(element => {
      if (element.type !== 'checkbox' && element.type !== 'button'){
        if (element.formControlName != null && element.formControlName != '' && element.formControlName != undefined && !(element.formControlName.trim().length === 0)) {
          parentArray.push(element.formControlName);
        }
      }
    });
    return parentArray;
  }

  returnControlDropdown() {
    let parentArray = [];
    this.allFormControl.forEach(element => {
      if (element.type === 'list') {
        if (element.formControlName != null && element.formControlName != '' && element.formControlName != undefined && !(element.formControlName.trim().length === 0)) {
          parentArray.push(element.label);
        }
      }
    });
    return parentArray;
  }

  returnControlListForList(control,parent) {
    let parentArray = [];
    this.allFormControl.forEach(element => {
      // if (element.label !== control && element.parent !== parent) {
        if (element.label !== control) {
        if (element.type !== 'checkbox') {
          if (element.label != null && element.label != '' && element.label != undefined && !(element.label.trim().length === 0)) {
            element.formControlName = element.label.replace(/[ ]/g, '');
          }
        }
        if (element.type !== 'button') {
          if (element.formControlName != null && element.formControlName != '' && element.formControlName != undefined && !(element.formControlName.trim().length === 0)) {
            parentArray.push(element.label);
          }
        }
      }
    });
    return parentArray;
  }

  setNestedControlOfLists(formControl, optionValue, nestedToControl) {
    // this.allFormControl.forEach(element => {
    //   if (element.label !== formControl &&
    //     (element.nestedToControl === nestedToControl && element.nestedToValue === optionValue)) {
    //     element.nestedToValue = null;
    //     element.nestedToControl = null;
    //   } else {
    //     if (element.label === formControl) {
    //       element.nestedToValue = optionValue;
    //       element.nestedToControl = nestedToControl.replace(/[ ]/g,'');
    //     }
    //   }
    // });
    this.allFormControl.forEach(element => {
      if (!formControl.includes(element.label) &&
        (element.nestedToControl && element.nestedToControl.includes(nestedToControl.replace(/[ ]/g,'')) && element.nestedToValue && element.nestedToValue.includes(optionValue))) {
          if(element.nestedToValue &&  element.nestedToValue.includes(optionValue) && element.nestedToControl &&  element.nestedToControl.includes(nestedToControl.replace(/[ ]/g,''))){
            for (const index12 in element.nestedToValue) {
              if(element.nestedToValue[index12].toLowerCase() == optionValue.toLowerCase() && element.nestedToControl[index12].toLowerCase() == nestedToControl.replace(/[ ]/g,'').toLowerCase()){
                element.nestedToValue.splice(index12,1)
                element.nestedToControl.splice(index12,1)
              }
            }
          } else{
            element.nestedToValue = []
                element.nestedToControl = []
          }
      } else {
        if (formControl.includes(element.label)) {
          if(element.nestedToValue && Array.isArray(element.nestedToValue) && element.nestedToControl && Array.isArray(element.nestedToControl)){
            console.log(!element.nestedToValue.includes(optionValue) ,":",!element.nestedToControl.includes(nestedToControl.replace(/[ ]/g,'')));
            let valuePresent = false
            for (const index12 in element.nestedToValue) {
                if(element.nestedToValue && element.nestedToValue[index12].toLowerCase() == optionValue.toLowerCase() &&
                element.nestedToControl && element.nestedToControl[index12].toLowerCase() == nestedToControl.replace(/[ ]/g,'').toLowerCase()){
                valuePresent = true
                }
            }
            if(!valuePresent){
              element.nestedToValue.push(optionValue)
              element.nestedToControl.push(nestedToControl.replace(/[ ]/g,''))
            }
          }else{
            element.nestedToValue = []
            element.nestedToValue.push(optionValue)
            element.nestedToControl = []
            element.nestedToControl.push(nestedToControl.replace(/[ ]/g,''))
          }
          if(element.nestedToControl && Array.isArray(element.nestedToControl)){
            if(!element.nestedToControl.includes(nestedToControl.replace(/[ ]/g,''))){
              element.nestedToControl.push(nestedToControl.replace(/[ ]/g,''))
            }
          }else{
            element.nestedToControl = []
            element.nestedToControl.push(nestedToControl.replace(/[ ]/g,''))
          }
        }
      }
    });
    console.log("(this.allFormControl:",this.allFormControl)
  }

  returnFormControlLists(people: any, i: any, k: any): any[] {
    let result = []
    this.allFormControl.forEach(element => {
      if (element.type != 'button' && element?.Id != null && element.label && !(element.label.trim().length === 0)) {
        result.push(element.Id)
      }
    });
    let result2 = [...result];
    let selectedValue: any
    result.forEach(element => {
      for (let key in this.allFormControl[i].buttonHeaders) {
        if (key != k)
          if (element == this.allFormControl[i].buttonHeaders[key].Value && this.allFormControl[i].buttonHeaders[key].Value) {
            if (result2.includes(element)) {
              result2.splice(result2.indexOf(element), 1);
            }
          }
      }
    });
    return result2;
  }

  returnFormControlLabel(id: any) {
    let a = ''
    this.allFormControl.forEach(element => {
      if (id == element.Id) {
        a = element.label;
      }
    });
    if (a) {
      return a;
    } else {
      return 'xyz'
    }
  }

  defaultValueForDropDown(i: number) {
    let parentArray = [];
    if(this.allFormControl[i].listOfValues)
    this.allFormControl[i].listOfValues.forEach(element2 => {
      if (element2.option != null && element2.option != '' && element2.option != undefined && !(element2.option.trim().length === 0)) {
        parentArray.push(element2);
      }
    });
    return parentArray;
  }

  returnListOfFormControls(item,i: number) {
    let parentArray = [];
    let result = []
    if(item.label && this.common.checkTruthyValue(item.label) && item.formControlName &&  this.common.checkTruthyValue(item.formControlName)){
      this.allFormControl.forEach(element => {
        if (element.type != 'button' && element.type != 'checkbox' && element.label && this.common.checkTruthyValue(element.label) && element.formControlName && this.common.checkTruthyValue(element.formControlName) && item.formControlName != element.formControlName) {
          parentArray.push(element);
        }
      });
    }

    if(parentArray.length > 0){
      // result = parentArray.filter(o1 => !item.patchValueToControls.some(o2 => o1.formControlName == o2.field));
      // result = result. concat(item.patchValueToControls.filter(o1 => !parentArray.some(o2 =>  o1.field === o2.formControlName)));

      // console.log(parentArray);

      // result  = parentArray.filter(res => {console.log(item.patchValueToControls.filter(res1 => res1.field && res1.field != res.formControlName));item.patchValueToControls.filter(res1 => res1.field != res.formControlName)})

      // result = parentArray.filter((item1) => !item.patchValueToControls.filter((item2) => item2.field != item1.formControlName));

      result = parentArray.filter(res => !item.patchValueToControls.map(x => {if(item.patchValueToControls[i].field != x.field){ return x.field}}).includes(res.formControlName))
      // parentArray.forEach(element => {

      // });

      // console.log(result);

    }

    return result;
  }

  addAttribute(formControlName: string, i: number) {
    let AttributesToAdd: any = {
      key: null,
      value: null,
      parent1Value: null,
      parent1Id: null,
      parent1FormControl: null,
      parent2Value: null,
      parent2Id: null,
      parent2FormControl: null,
      parent3Value: null,
      parent3Id: null,
      parent3FormControl: null,
      nestedControl: []
    };
    if (this.allFormControl[i].parent == null && this.allFormControl[i].parentId == null) {
      AttributesToAdd = {
        key: null,
        value: null,
        parent1Value: null,
        parent1Id: null,
        parent1FormControl: null,
        parent2Value: null,
        parent2Id: null,
        parent2FormControl: null,
        parent3Value: null,
        parent3Id: null,
        parent3FormControl: null,
        nestedControl: []
      }
      this.allFormControl[i].listOfValues.push(AttributesToAdd);
    } else {
      this.allFormControl[i].formControlName = this.allFormControl[i].label.replace(/[ ]/g, '');
      if (this.allFormControl[i].type !== 'checkbox') {
        this.allFormControl[i].formControlName = this.allFormControl[i].label.replace(/[ ]/g, '');
      }
      AttributesToAdd.parent1FormControl = this.allFormControl[i].parent.replace(/[ ]/g, '');
      AttributesToAdd.parent1Id = this.allFormControl[i]?.parentId;
      this.allFormControl.forEach(element => {
        if (element.formControlName == AttributesToAdd.parent2FormControl) {
          if (element.parent != null) {
            AttributesToAdd.parent3FormControl = element.parent;
            AttributesToAdd.parent3Id = element?.parentId;
          }
        }
      });
      this.allFormControl.forEach(element => {
        if (element.formControlName == AttributesToAdd.parent1FormControl) {
          if ((element.parent != null) && (element.parent != AttributesToAdd.parent1FormControl)) {
            AttributesToAdd.parent2FormControl = element.parent;
            AttributesToAdd.parent2Id = element?.parentId;
          }
        }
      });
      this.allFormControl.forEach(element => {
        if (element.formControlName == AttributesToAdd.parent1FormControl) {
          if (element.parent == null) {
            // AttributesToAdd.parent1FormControl = element.parent;
            // AttributesToAdd.parent1Id = element?.parentId;
            element.parent = AttributesToAdd.parent1FormControl;
            element.parentId = AttributesToAdd.parent1Id;
          }
        }
      });
      this.allFormControl[i].listOfValues.push(AttributesToAdd)
    }
  }

  addHeader(formControlName: string, i) {
    this.allFormControl[i].buttonHeaders.push({ Key: '', Value: '' })
  }

  addBody(formControlName: string, i) {
    this.allFormControl[i].buttonBody.push({ Key: '', Value: '' })
  }

  changeControlType(event, i: number) {
    this.allFormControl[i].dateFormat = null;
    this.allFormControl[i].mandatory = false;
    this.allFormControl[i].regularExpression = null;
    this.allFormControl[i].value = null;
    this.allFormControl[i].parent = null;
    this.allFormControl[i].nestedControlOfWhom = null;
    this.allFormControl[i].nestedControl = null;
    this.allFormControl[i].buttonHeaders = [];
    this.allFormControl[i].APIURL = null;
    this.allFormControl[i].APIMETHOD = null
    this.allFormControl[i].IsSearch = false;
    this.allFormControl[i].FormDisable = false;
    this.allFormControl[i].SearchFormControl = null;
    this.allFormControl[i].RequestFormat = false;
    this.allFormControl[i].Format = null;
    this.allFormControl[i].PatchControl = [];
    this.allFormControl[i].FormatResponse = null;
    this.allFormControl[i].Dynamic = false;
    this.allFormControl[i].dataType = null;
    this.allFormControl[i].listOfValues = [];
  }

  filterNestedControls(i) {
    let dummyArray = []
    for (const key in this.allFormControl) {
      if (key != i) {
        dummyArray.push(this.allFormControl[key].label)
      }
    }
    return dummyArray;
  }

  setNestedParentControl(parentControlName, selfControlName, i) {
    let values = []
    this.allFormControl[i].nestedControlOfWhom.forEach(element => {
      for (let key in this.allFormControl) {
        if (this.allFormControl[key].label == element) {
          this.allFormControl[key].nestedControl = selfControlName;
        }
      }
    });

    for (let key in this.allFormControl) {
      if (this.allFormControl[key].nestedControl == selfControlName) {
        values.push({ label: this.allFormControl[key].label, i: key })
      }
    }

    values.forEach(element => {
      if (!this.allFormControl[i].nestedControlOfWhom.includes(element.label)) {
        this.allFormControl[element.i].nestedControl = null
      }
    });
  }

  submit(allFormControl: any) {
    if (this.isListContainAnyOptions()) {
      this.common.snackbar('Formfield with type list alleast contain one option', 'error')
      return false;
    }
    if (!this.path) {
      this.showToaster = this.allFormControl.length
    }
    allFormControl.forEach(element => {
      let modifiedRegex: any = []
      if (element.regularExpression) {
        modifiedRegex = element.regularExpression.split("\'");
      }
      let jsonObjectForButton: any = {}
      if (element.type == 'button' || (element.type == 'list' && element.Dynamic)) {
        element.buttonBody.forEach(obj => {
          Object.assign(jsonObjectForButton, { [obj.Key]: obj.Value });
        });
      }
      if (element.type !== 'checkbox') {
        if (element.label != null && element.label != '' && element.label != undefined && !(element.label.trim().length === 0)) {
          element.formControlName = element.label.replace(/[ ]/g, '');
        }
      }
      let obj: any = {
        data: {
          spname: "usp_unfyd_data_collection_form",
          parameters: {
            FLAG: "INSERT",
            FORMTYPE: this.formName.value.formName,
            // icon: this.formName.value.icon,
            // NoOfFields: this.formName.value.NoOfFields,
            // BackGroundColour: this.formName.value.color === undefined || this.formName.value.color === null ? this.formName.value.color : (this.formName.value.color).toString(),
            description: this.formName.value.description,
            CreateTable: this.tableName == false ? this.formName.value.createTable : this.formName.controls.createTable.value,
            TableName: this.tableName == false ? this.formName.value.tableName : this.formName.controls.tableName.value,
            NAME: element.label,
            CONTROLTYPE: element.type,
            DEFAULTVALUE: element.value,
            PLACEHOLDER: element.label,
            REGULAREXPRESSION: element.regularExpression ? JSON.stringify(element.regularExpression) : element.regularExpression,
            ERRORMESSAGE: '',
            MANDATORY: element.mandatory,
            LISTVALUE: element.listOfValues ? element.listOfValues.length == 0 ? null : JSON.stringify(element.listOfValues) : null,
            FORMREQ: JSON.stringify(element),
            CONTROLSEQUENCE: '',
            PARENTCONTROLID: element.parentId,
            VISIBLETOAGENT: '',
            LISTVALUEID: '',
            NESTEDCONTROL: element.nestedControl,
            NESTEDCONTROLOFWHOM: element.nestedControlOfWhom ? element.nestedControlOfWhom.toString() : element.nestedControlOfWhom,
            DATEFORMAT: element.dateFormat,
            formCategory: this.type,
            ATTRSEQUENCE: element.ATTRSEQUENCE,
            APIURL: element.APIURL,
            APIMETHOD: element.APIMETHOD,
            ButtonAuth: JSON.stringify(element.buttonAuth),
            REQOBJECT: JSON.stringify(jsonObjectForButton),
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productId,
            createdby: this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
            IsSearch: element.IsSearch,
            FormDisable: element.FormDisable,
            SearchFormControl: element.SearchFormControl,
            RequestFormat: element.RequestFormat,
            FormatResponse: element.FormatResponse,
            PatchControl: JSON.stringify(element.PatchControl),
            Format: JSON.stringify(element.Format),
            Dynamic: element.Dynamic,
            PrimaryColumn: this.formName.value.PrimaryColumn,
            Primary: this.formName.value.Primary,
            tableType: this.formName.value.tableType,
            patchResponseToDropdownOption : element.patchResponseToDropdownOption,
            patchDropdowns : (element.patchDropdowns && element.patchDropdowns.length == 0)? null : JSON.stringify(element.patchDropdowns),
            patchValueToControlsWhenChanged : element.patchValueToControlsWhenChanged,
            patchValueToControls : (element.patchValueToControls && element.patchValueToControls.length == 0) ? null : JSON.stringify(element.patchValueToControls),
            clickButtonAfter: element.clickButtonAfter,
            clickButtonAfterArray : (element.clickButtonAfterArray && element.clickButtonAfterArray.length == 0) ? null : JSON.stringify(element.clickButtonAfterArray),
            APICallAfterChange: element.APICallAfterChange,
            APICallAfterChangeConfig: element.APICallAfterChangeConfig ? JSON.stringify(element.APICallAfterChangeConfig) : null,
            checkValidation: element.checkValidation,
            checkValidationFormControls: element.checkValidationFormControls ? JSON.stringify(element.checkValidationFormControls) : null,
            fieldType:element.fieldType,
            fieldName:element.fieldName,
            hide: element.hide,
            nestedToControl : (element.nestedToControl && element.nestedToControl.length == 0) ? '' : JSON.stringify(element.nestedToControl),
            nestedToValue : (element.nestedToValue && element.nestedToValue.length == 0) ? '' : JSON.stringify(element.nestedToValue),
            uploadFormType : element.uploadFormType,
            uploadFormFileFormat : (element.uploadFormFileFormat && element.uploadFormFileFormat.length == 0) ? '' : JSON.stringify(element.uploadFormFileFormat)
          }
        }
      }
      this.api.post('index', obj).subscribe(res => {
        if (res.code == 200) {
          let table = this.tableName == false ? this.formName.value.tableName : this.formName.controls.tableName.value;
          this.createTable(table, element);
          if (res.results.data[0]?.result === "Data added successfully" || res.results.data[1]?.result !== undefined) {
            Object.assign(this.allFormControl[this.allFormControl.length - 1], { Id: res.results.data[1].result });
          }
          this.newControl = true;
          this.validateIdAvailable();
          this.addNewFormField();
          if (this.allFormControl[0].Id) {
            this.disableFormName = true;
          } else {
            this.disableFormName = false;
          }
          this.formName.updateValueAndValidity();
          this.showToaster--;
          if (this.showToaster == 0) {
            if (!this.path) {
              this.common.snackbar("Add Record")
            } else {
              this.saveFormJSON()
              this.common.snackbar("Update Success")
            }
          }
          if (element.listOfValues && element.type == 'list' && !element.Dynamic) {
            element.listOfValues.forEach(element1 => {
              let obj1: any = {
                data: {
                  spname: "usp_unfyd_control_value",
                  parameters: {
                    FLAG: "INSERT",
                    CONTROLID: res.results?.data[1]?.result,
                    PARENTKEY: element.label,
                    KEYNAME: element1.key,
                    KEYVALUE: element1.value,
                    ListValues: JSON.stringify(element1)
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
                });
            });
          }
        } else {
          this.common.snackbar("General Error");
        }
      },
        (error) => {
          this.common.snackbar("General Error");
        });
    });
  }

  update(allFormControl: any) {
    if (this.isListContainAnyOptions()) {
      this.common.snackbar('Formfield with type list alleast contain one option', 'error')
      return false;
    }
    this.showToaster = allFormControl.length
    allFormControl.forEach(element => {
      let modifiedRegex: any = []
      if (element.regularExpression) {
        modifiedRegex = element.regularExpression.split("\'");
      }
      let jsonObjectForButton: any = {}
      if (element.type == 'button' || (element.type == 'list' && element.Dynamic)) {
        element.buttonBody.forEach(obj => {
          Object.assign(jsonObjectForButton, { [obj.Key]: obj.Value });
        });
      }
      if (element.type !== 'checkbox') {
        if (element.label != null && element.label != '' && element.label != undefined && !(element.label.trim().length === 0)) {
          element.formControlName = element.label.replace(/[ ]/g, '');
        }
      }
      if (element.Id == undefined) {
        let a = []
        a.push(element)
        this.submit(a);
      } else {
        let obj: any = {
          data: {
            spname: "usp_unfyd_data_collection_form",
            parameters: {
              FLAG: "Update",
              id: element.Id,
              FORMTYPE: this.formName.value.formName,
              // icon: this.formName.value.icon,
              // NoOfFields: this.formName.value.NoOfFields,
              // BackGroundColour: this.formName.value.color === undefined || this.formName.value.color === null ? this.formName.value.color : (this.formName.value.color).toString(),
              description: this.formName.value.description,
              CreateTable: this.tableName == false ? this.formName.value.createTable : this.formName.controls.createTable.value,
              TableName: this.tableName == false ? this.formName.value.tableName : this.formName.controls.tableName.value,
              NAME: element.label,
              CONTROLTYPE: element.type,
              DEFAULTVALUE: element.value,
              PLACEHOLDER: element.label,
              REGULAREXPRESSION: element.regularExpression ? JSON.stringify(element.regularExpression) : element.regularExpression,
              ERRORMESSAGE: '',
              MANDATORY: element.mandatory,
              LISTVALUE: element.listOfValues ? element.listOfValues.length == 0 ? null : JSON.stringify(element.listOfValues) : null,
              FORMREQ: JSON.stringify(element),
              CONTROLSEQUENCE: '',
              PARENTCONTROLID: element.parentId,
              VISIBLETOAGENT: '',
              LISTVALUEID: '',
              NESTEDCONTROL: element.nestedControl,
              NESTEDCONTROLOFWHOM: element.nestedControlOfWhom ? element.nestedControlOfWhom.toString() : element.nestedControlOfWhom,
              DATEFORMAT: element.dateFormat,
              formcategory: element.formCategory,
              ATTRSEQUENCE: element.ATTRSEQUENCE,
              APIURL: element.APIURL,
              APIMETHOD: element.APIMETHOD,
              ButtonAuth: JSON.stringify(element.buttonAuth),
              REQOBJECT: JSON.stringify(jsonObjectForButton),
              PROCESSID: this.userDetails.Processid,
              PRODUCTID: this.productId,
              createdby: this.userDetails.Id,
              publicip: this.userDetails.ip,
              privateip: '',
              browsername: this.userDetails.browser,
              browserversion: this.userDetails.browser_version,
              IsSearch: element.IsSearch,
              PatchControl: JSON.stringify(element.PatchControl),
              FormDisable: element.FormDisable,
              SearchFormControl: element.SearchFormControl,
              RequestFormat: element.RequestFormat,
              FormatResponse: element.FormatResponse,
              Format: JSON.stringify(element.Format),
              Dynamic: element.Dynamic,
              PrimaryColumn: this.formName.value.PrimaryColumn,
              Primary: this.formName.value.Primary,
              tableType: this.formName.value.tableType,
              patchResponseToDropdownOption : element.patchResponseToDropdownOption,
              patchDropdowns : (element.patchDropdowns && element.patchDropdowns.length == 0)? null : JSON.stringify(element.patchDropdowns),
              patchValueToControlsWhenChanged : element.patchValueToControlsWhenChanged,
              patchValueToControls : (element.patchValueToControls && element.patchValueToControls.length == 0) ? null : JSON.stringify(element.patchValueToControls),
              clickButtonAfter: element.clickButtonAfter,
              clickButtonAfterArray : (element.clickButtonAfterArray && element.clickButtonAfterArray.length == 0) ? null : JSON.stringify(element.clickButtonAfterArray),
              APICallAfterChange: element.APICallAfterChange,
              APICallAfterChangeConfig: element.APICallAfterChangeConfig ? JSON.stringify(element.APICallAfterChangeConfig) : null,
              checkValidation: element.checkValidation,
              checkValidationFormControls: element.checkValidationFormControls ? JSON.stringify(element.checkValidationFormControls) : null,
              fieldType:element.fieldType,
              fieldName:element.fieldName,
              hide: element.hide,
              nestedToControl : (element.nestedToControl && element.nestedToControl.length == 0) ? '' : JSON.stringify(element.nestedToControl),
              nestedToValue : (element.nestedToValue && element.nestedToValue.length == 0) ? '' : JSON.stringify(element.nestedToValue),
              uploadFormType : element.uploadFormType,
              uploadFormFileFormat : (element.uploadFormFileFormat && element.uploadFormFileFormat.length == 0) ? '' : JSON.stringify(element.uploadFormFileFormat)
            }
          }
        }
        this.api.post('index', obj).subscribe(res => {
          if (res.code == 200) {
            let table = this.tableName == false ? this.formName.value.tableName : this.formName.controls.tableName.value;
            this.createTable(table, element);
            if (this.allFormControl[0].Id) {
              this.disableFormName = true;
            } else {
              this.disableFormName = false;
            }
            this.formName.updateValueAndValidity()
            this.showToaster--;
            if (this.showToaster == 0) {
              this.saveFormJSON()
              this.common.snackbar("Update Success")
            }
            if (element.listOfValues && element.type == 'list' && !element.Dynamic) {
              element.listOfValues.forEach(element1 => {
                let obj1: any = {
                  data: {
                    spname: "usp_unfyd_control_value",
                    parameters: {
                      FLAG: "update",
                      CONTROLID: element.Id,
                      PARENTKEY: element.label,
                      KEYNAME: element1.key,
                      KEYVALUE: element1.value,
                      ListValues: JSON.stringify(element1)
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
                  });
              });
            }
          } else {
            this.common.snackbar("General Error");
          }
        },
          (error) => {
            this.common.snackbar("General Error");
          });
      }
    });
  }


  getFormData() {
    let obj = {
      "data": {
        "spname": "usp_unfyd_data_collection_form",
        "parameters": {
          "FLAG": "EDIT",
          "FORMTYPE": this.path,
          PRODUCTID: this.productId
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.allFormControl = [];
        this.formName.controls.formName.patchValue(res.results.data[0]?.FormType);
        this.formName.controls.icon.patchValue(res.results.data[0]?.Icon);
        this.formName.controls.NoOfFields.patchValue(res.results.data[0]?.NoOfFields);
        this.formName.controls.color.patchValue(res.results.data[0]?.BackGroundColour);
        this.formName.controls.description.patchValue(res.results.data[0]?.Description);
        this.formName.controls.createTable.patchValue(res.results.data[0]?.CreateTable);
        this.formName.controls.tableName.patchValue(res.results.data[0]?.TableName);
        this.formName.controls.MappedTable.patchValue(res.results.data[0]?.MappedTable);
        this.formName.controls.PrimaryColumn.patchValue(res.results.data[0]?.PrimaryColumn);
        this.formName.controls.tableType.patchValue(res.results.data[0]?.tableType);
        this.getColumnData(res.results.data[0]?.MappedTable);
        this.formName.controls.MappedColumn.patchValue(res.results.data[0]?.MappedColumn);
        this.formName.controls.ReferenceColumn.patchValue(res.results.data[0]?.ReferenceColumn);
        this.formName.controls.Primary.patchValue(res.results.data[0]?.IsPrimary);
        this.tableName = res.results.data[0]?.CreateTable;
        this.prioritySet(res.results.data[0]?.IsPrimary === 'Primary' || res.results.data[0]?.IsPrimary === 'Unique' ? true : false);
        if (this.tableName === true) {
          this.formName.get('createTable').disable();
          this.formName.get('tableName').disable();
        }
        this.formName.controls.formName.updateValueAndValidity();
        for (const key in res.results.data) {
          if (res.results.data[key].FormReq) {
            let FormReq = JSON.parse(res.results.data[key].FormReq);
            this.allFormControl.push(FormReq);
            if (res.results.data[key].Id)
              Object.assign(this.allFormControl[this.allFormControl.length - 1], { Id: res.results.data[key].Id });
          }
          if (this.allFormControl[key].type == 'button') {
            let jsonObjectForButton: any = {}
            this.allFormControl[key].buttonBody.forEach(obj => {
              Object.assign(jsonObjectForButton, { [obj.Key]: obj.Value });
            });
            this.allFormControl[key].REQOBJECT = jsonObjectForButton;
            if(res.results.data[key].ButtonAuth)this.allFormControl[key].buttonAuth = JSON.parse(res.results.data[key].ButtonAuth)
            // this.allFormControl[key].patchDropdowns = JSON.parse(res.results.data[key].patchDropdowns)
            // this.allFormControl[key].clickButtonAfterArray = JSON.parse(res.results.data[key].clickButtonAfterArray)
            if(res.results.data[key].checkValidationFormControls) this.allFormControl[key].checkValidationFormControls = JSON.parse(res.results.data[key].checkValidationFormControls)
          }
          // if(res.results.data[key].APICallAfterChangeConfig != null){
          //   console.log(this.allFormControl[key].APICallAfterChangeConfig)
          //   this.allFormControl[key].APICallAfterChangeConfig = JSON.parse(res.results.data[key].APICallAfterChangeConfig);
          //   console.log(this.allFormControl[key].APICallAfterChangeConfig)
          // }
          if(res.results.data[key].nestedToControl) this.allFormControl[key].nestedToControl = JSON.parse(res.results.data[key].nestedToControl) == '' ? [] : JSON.parse(res.results.data[key].nestedToControl);
          if(res.results.data[key].nestedToValue) this.allFormControl[key].nestedToValue = JSON.parse(res.results.data[key].nestedToValue) == '' ? [] : JSON.parse(res.results.data[key].nestedToValue);
          if(res.results.data[key].uploadFormFileFormat) this.allFormControl[key].uploadFormFileFormat = JSON.parse(res.results.data[key].uploadFormFileFormat) == '' ? [] : JSON.parse(res.results.data[key].uploadFormFileFormat);
          if (this.allFormControl[key].type == 'list' && this.allFormControl[key].Dynamic == false && res.results.data[key].ListValue) {
            if(res.results.data[key].ListValue) this.allFormControl[key].listOfValues = JSON.parse(res.results.data[key].ListValue);
          }
          if (this.allFormControl[key].type == 'list' && res.results.data[key].patchValueToControls) {
            this.allFormControl[key].patchValueToControls = JSON.parse(res.results.data[key].patchValueToControls);
          }
          if (this.allFormControl[key].type == 'list' && this.allFormControl[key].APICallAfterChange && res.results.data[key].APICallAfterChangeConfig) {
              this.allFormControl[key].APICallAfterChangeConfig = JSON.parse(res.results.data[key].APICallAfterChangeConfig);
              console.log("aaaaaa:",this.allFormControl[key].APICallAfterChangeConfig);

          }
        }
        if (this.path) {
          this.disableFormName = true;
        } else {
          this.disableFormName = false;
        }
        this.changesDone();
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      });
  }

  selectedParentData: any
  selectedParent(data) {
    this.selectedParentData = null;
    this.selectedParentData = data;
  }

  hexToRgbA(hex) {
    var c;
    let obj: any = {};
    obj.hex = hex.replace('#', '');
    obj.roundA = 1;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      obj.rgba = 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
      obj.r = (c >> 16) & 255
      obj.g = (c >> 8) & 255
      obj.b = c & 255
      obj.a = 1
      return obj;
    }
  }

  changeParentId(item, i) {
    this.allFormControl[i].formControlName = this.allFormControl[i].label.replace(/[ ]/g, '');
    if (this.allFormControl[i].type !== 'checkbox') {
      this.allFormControl[i].formControlName = this.allFormControl[i].label.replace(/[ ]/g, '');
    }
    this.allFormControl.forEach(element => {
      if (element.formControlName == item.parent.replace(/[ ]/g, '')) {
        this.allFormControl[i].parentId = element.Id;
      }
    });
  }

  returnParentDropdown(parentItem): any[] {
    let array = [];
    this.allFormControl.forEach(element => {
      if (element.formControlName == parentItem.parent2FormControl) {
        element.listOfValues.map(obj => {
          array.push(obj);
        });
      }
    });
    return array;
  }

  returnChildDropdown(parentItem): any[] {
    let array = [];
    this.allFormControl.forEach(element => {
      if (element.formControlName == parentItem.parent1FormControl) {
        element.listOfValues.map(obj => {
          if (obj.parent1Value == parentItem.parent2Value) {
            array.push(obj);
          }
        });
      }
    });
    return array;
  }

  validateIdAvailable() {
    if (this.allFormControl.length == 0) {
      return false;
    }
    else if (this.allFormControl.length >= 1 && this.allFormControl[this.allFormControl.length - 1]?.Id == null) {
      return true
    }
    else if (this.allFormControl.length >= 1 && this.allFormControl[this.allFormControl.length - 1]?.Id != null) {
      return false
    }
  }

  changesDone() {
    for (let key in this.allFormControl) {
      if (this.allFormControl[key].ATTRSEQUENCE == undefined || this.allFormControl[key].ATTRSEQUENCE == null) {
        Object.assign(this.allFormControl[key], { ATTRSEQUENCE: key });
      } else {
        this.allFormControl[key].ATTRSEQUENCE = key
      }
    }
    this.allFormControl.forEach(element => {
      // if (element.formControlName == null) {
        if (element.label != null && element.label.trim() != '' && element.label != '') {
          // if (element.type !== 'checkbox') {
            if (element.label != null && element.label != '' && element.label != undefined && !(element.label.trim().length === 0)) {
              element.formControlName = element.label.replace(/[ ]/g, '');
            }
          // }
        }else{
          element.formControlName = null
        }
      // }
    });
    if (this.dummyAllFormControl.length == 0) {
      this.allFormControl.forEach(element => this.dummyAllFormControl.push(Object.assign({}, element)));
      this.exportAllFormControls.next(JSON.parse(JSON.stringify(this.allFormControl)))
    } else {
      this.dummyAllFormControl = JSON.parse(JSON.stringify(this.allFormControl));
      this.exportAllFormControls.next(JSON.parse(JSON.stringify(this.allFormControl)))
    }
    // this.dummyAllFormControl = JSON.parse(JSON.stringify(this.allFormControl));
    // console.log(this.allFormControl[2].APICallAfterChangeConfig)
  }

  toggleChange(event, item) {
    if (event == false) {
      item.listOfValues = [];
    }
  }

  addItem(newItem: any) {
    this.allFormControl = newItem
  }

  selectedIndexValue(value: any) {
    this.createForm()
    this.selectedIndex = value
  }

  selectedShowAPIModule() {
    this.createForm()
  }

  isListContainAnyOptions() {
    let a = false
    this.allFormControl.forEach(element => {
      if (element.type == 'list' && !element.Dynamic) {
        if(element.listOfValues){
          if (element.listOfValues.length == 0) {
            a = true
          } else {
            element.listOfValues.forEach(element1 => {
              if (element1.option == null && element1.option == '' && element1.option == undefined && !(element1.option.trim().length === 0)) {
                a = true
              }
            });
          }
        } else{
          a = true
        }
      } else if (element.type == 'list' && element.Dynamic) {
        a = false
      }
    });
    return a;
  }

  saveFormJSON() {
    let product = JSON.parse(localStorage.getItem('products'));
    product = product.filter(obj => obj.Id === Number(this.productId));
    let jsonObjectForButton: any = {};
    this.allFormControl.forEach(element => {
      if (element.type == 'button' || (element.type == 'list' && element.Dynamic)) {
        element.buttonBody.forEach(obj => {
          Object.assign(jsonObjectForButton, { [obj.Key]: obj.Value });
        });
      }
      element.REQOBJECT = JSON.stringify(jsonObjectForButton);
      element.FormatResponse = element.FormatResponse;
    });
    let obj = {
      "data": {
        "flag": "insert",
        "filename": this.formName.value.formName + "_" + this.type,
        "processId": this.userDetails.Processid,
        "product": product[0].ProductName,
        "brandingjson": this.allFormControl
      }
    }
    this.api.post('branding', obj).subscribe(res => {
      if (res.code == 200) {
      }
    });
  }

  getFormJSON() {
    let product = JSON.parse(localStorage.getItem('products'));
    product = product.filter(obj => obj.Id === Number(this.productId));
    let obj = {
      "data": {
        "flag": "get",
        "filename": this.formName.value.formName + "_" + this.type,
        "processId": this.userDetails.Processid,
        "product": product[0].ProductName
      }
    }
    this.api.post('branding', obj).subscribe(res => {
      if (res.code == 200) {
      }
    });
  }

  selectIcon(item) {
    this.formName.controls.icon.patchValue(item)
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

  getMethod(event) {
    if (event == 'delete') {
      this.deleteMethod = true;
    } else this.deleteMethod = false;
  }

  tableName: boolean = false;

  createTableToggle(event) {
    if (event === true) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'create',
          title: 'Are you sure?',
          subTitle: 'Do you want to ' + 'create' + ' the table',
        },
        width: '300px',
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status === true) {
          this.tableName = status;
          this.formName.get('createTable').setValue(status);
          this.formName.get('tableName').disable();
          let tempName = this.processShortCode + '_' + this.formName.value.formName.replace(/[ ]/g, '_');
          this.formName.get('tableName').setValue(tempName);
        } else {
          this.tableName = status;
          this.formName.get('tableName').setValidators(Validators.nullValidator);
          this.formName.get('createTable').setValue(status);
          this.formName.updateValueAndValidity();
        }
      });
    } else {
      this.tableName = event;
      this.formName.get('tableName').reset();
      this.formName.get('tableName').setValidators(Validators.nullValidator);
      this.formName.get('createTable').setValue(event);
      this.formName.updateValueAndValidity();
    }
  }

  TableToggle(event) {
    if (event === false) {
      this.formName.get('tableName').disable();
      let tempName = this.processShortCode + '_' + this.formName.value.formName.replace(/[ ]/g, '_');
      this.formName.get('tableName').setValue(tempName);
    } else {
      this.formName.get('tableName').enable();
      this.formName.get('tableName').setValidators(Validators.required);
      this.formName.get('tableName').setValue('');
    }
    this.formName.updateValueAndValidity();
  }

  createTable(tableName, element) {
    if (this.formName.get('createTable').value === true && element.type != 'button') {
      let query = {
        data: {
          spname: "USP_Create_Update_Table",
          parameters: {
            Tablename: tableName,
            Columnname: element.label,
            Datatype: element.dataType
          }
        }
      }
      this.api.post('index', query).subscribe(res => {
        if (res.code == 200) {
          this.mapTable(element);
        }
      });
    }
  }

  tableArray: any[] = [];
  columnArray: any[] = [];
  getTableData() {
    let query = {
      data: {
        spname: "Table_Mapping",
        parameters: {
          Flag: 'Tables'
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      if (res.code == 200) {
        this.tableArray = res.results.data
      }
    });
  }

  getColumnData(event) {
    this.columnArray = [];
    let query = {
      data: {
        spname: "Table_Mapping",
        parameters: {
          Flag: 'Columns',
          ObjectId: event
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      if (res.code == 200) {
        this.columnArray = res.results.data;
      }
    });
  }

  mapTable(element) {
    if (this.formName.value.Primary !== '') {
      var userDetails = this.auth.getUser();
      let query = {
        data: {
          spname: "USP_TABLE_MAPPING",
          parameters: {
            FormName: this.formName.value.formName,
            Tablename: this.tableName == false ? this.formName.value.tableName : this.formName.controls.tableName.value,
            Columnname: element.label,
            Primary: this.formName.value.Primary,
            PrimaryColumn: this.formName.value.PrimaryColumn,
            UserId: userDetails['Id'],
            MappedTable: this.formName.value.MappedTable,
            MappedColumn: this.formName.value.MappedColumn,
            ReferenceColumn: this.formName.value.ReferenceColumn,
          }
        }
      }
      this.api.post('index', query).subscribe(res => {
        if (res.code == 200) {
          if (res.results.data[0].result.includes('is not the same data type as referencing column')) {
            this.dialog.open(DialogComponent, {
              data: {
                type: 'dataType',
                title: 'Are you sure?',
                subTitle: 'Data type of mapped and reference column is different, Kindly correct the data type and try again.',
              },
              width: '350px',
            });
          } else if (res.results.data[0].result.includes('no primary or candidate keys')) {
            this.common.snackbar(res.results.data[0].result, 'error');
          }
          else if (res.results.data[0].result.includes('Could not create constraint or index. See previous errors.')) {
            this.common.snackbar(res.results.data[0].result, 'error');
          }
          else if (res.results.data[0].result.includes('Tables mapped successfully') || res.results.data[0].result.includes('Key added')) {
            this.common.snackbar(res.results.data[0].result, 'success');
          } else {
            this.common.snackbar("General Error");
          }
        }
      });
    }
  }

  attributes() {
    for (let i = 1; i <= 60; i++) {
      this.mappedAttributes.push({ key: 'CUSTOMERATTRIBUTE' + i, value: 'CUSTOMERATTRIBUTE' + i });
    }
  }

  mappedData: boolean = false;
  control: any;
  prioritySet(event) {
    this.mappedData = (event !== '' && event !== undefined) ? true : false;
  }

  reference() {
    let temp = [];
    this.allFormControl.forEach(element => {
      if (element.type != 'button') {
        temp.push(element);
      }
    });
    return temp;
  }

  createBody(): FormGroup {
    return this.formBuilder.group({
      Key: ['', Validators.nullValidator],
      Value: ''
    });
  }

  createHeader(): FormGroup {
    return this.formBuilder.group({
      key: ['', Validators.nullValidator],
      value: ''
    });
  }

  createResponse(): FormGroup {
    return this.formBuilder.group({
      field: '',
      response: ''
    });
  }

  createPatchList(): FormGroup {
    return this.formBuilder.group({
      field: '',
      key: '',
      value: ''
    });
  }

  formvalue(e) {
    console.log("formvalue:",e);

    this.allFormControl.forEach(element => {
      if (e.item.Id === element.Id || e.item.label === element.label) {
        element.FormatResponse = e.response_format;
        element.APIURL = e.api;
        element.APIMETHOD = e.method;
        element.buttonHeaders = e.header;
        element.buttonAuth = e.auth;
        if (element.type === 'button') {
          element.PatchControl = e.response;
        } else if (element.type === 'list') {
          element.PatchControl = e.response;
          element.Value = e.response[0].field;
          element.Key = e.response[0].response;
        }
        element.Format = e.Format;
        element.buttonBody = e.body;
        element.patchResponseToDropdownOption= e.patchResponseToDropdownOption;
        element.patchDropdowns = e.patchDropdowns;
      }
    });
  }

  formvalueForAPIChange(e) {
    console.log("formvalueForAPIChange:",e);
    this.allFormControl.forEach(element => {
      if (e.item.Id === element.Id || e.item.label === element.label) {
        // element.APICallAfterChangeConfig = JSON.parse(JSON.stringify(e))
        let a = {
          FormatResponse : null,
          APIURL : null,
          APIMETHOD : null,
          buttonHeaders: null,
          buttonAuth: null,
          PatchControl: null,
          Value: null,
          Key: null,
          Format: null,
          buttonBody: null,
          patchResponseToDropdownOption: null,
          patchDropdowns : null,
        }
        element.APICallAfterChangeConfig = a

        try{
          // Object.assign(element.APICallAfterChangeConfig,a)
          // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:e?.response_format ? e?.response_format : null})
          element.APICallAfterChangeConfig['FormatResponse'] = e?.response_format ? e?.response_format : null;
          // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
          element.APICallAfterChangeConfig['APIURL'] = e.api;
          // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
          element.APICallAfterChangeConfig.APIMETHOD = e.method;
          // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
          element.APICallAfterChangeConfig.buttonHeaders = e.header;
          // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
          element.APICallAfterChangeConfig.buttonAuth = e.auth;
          if (element.type === 'button') {
            // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
            element.APICallAfterChangeConfig.PatchControl = e.response;
          } else if (element.type === 'list') {
            // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
            element.APICallAfterChangeConfig.PatchControl = e.response;
            // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
            element.APICallAfterChangeConfig.Value = e.response[0].field;
            // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
            element.APICallAfterChangeConfig.Key = e.response[0].response;
          }
          // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
          element.APICallAfterChangeConfig.Format = e.Format;
          // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
          element.APICallAfterChangeConfig.buttonBody = e.body;
          // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
          element.APICallAfterChangeConfig.patchResponseToDropdownOption= e.patchResponseToDropdownOption;
          // Object.assign(element.APICallAfterChangeConfig,{FormatResponse:1})
          element.APICallAfterChangeConfig.patchDropdowns = e.patchDropdowns
        }catch(error){
          console.log(error);
        }
        if(element.APICallAfterChangeConfig && element.APICallAfterChangeConfig.hasOwnProperty('item')) delete element.APICallAfterChangeConfig.item
        console.log("element.APICallAfterChangeConfig:",element.APICallAfterChangeConfig);

      }
    })
    // this.allFormControl.forEach(element => {
    //   if (e.item.Id === element.Id || e.item.label === element.label) {
    //     element.FormatResponse = e.response_format;
    //     element.APIURL = e.api;
    //     element.APIMETHOD = e.method;
    //     element.buttonHeaders = e.header;
    //     element.buttonAuth = e.auth;
    //     if (element.type === 'button') {
    //       element.PatchControl = e.response;
    //     } else if (element.type === 'list') {
    //       element.Value = e.response[0].field;
    //       element.Key = e.response[0].response;
    //     }
    //     element.Format = e.Format;
    //     element.buttonBody = e.body;
    //     element.patchResponseToDropdownOption= e.patchResponseToDropdownOption;
    //     element.patchDropdowns = e.patchDropdowns;
    //   }
    // });
  }

  openDialog(type) {
    let product = JSON.parse(localStorage.getItem('products'));
    product = product.filter(obj => obj.Id === Number(this.productId));
    let data: any = {};
    data.FormName = this.formName.value.formName;
    data.Method = 'POST';
    data.URL = environment.base_url + 'branding';
    data.RequestObj = {
      "data": {
        "flag": "get",
        "filename": this.formName.value.formName + "_" + this.type,
        "processId": this.userDetails.Processid,
        "product": product[0].ProductName
      }
    };
    data.ResponseObj = {
      "message": "Success",
      "error": false,
      "code": 200,
      "results": {
        "data": "[{\"Id\":\"159\",\"label\":\"Enter Name\",\"dateFormat\":null,\"formControlName\":\"EnterName\",\"formCategory\":\"wrap-up\",\"type\":\"input\",\"mandatory\":true,\"regularExpression\":\"[a-zA-Z]*$\",\"value\":null,\"parent\":null,\"parentId\":null,\"nestedControlOfWhom\":null,\"nestedControl\":null,\"listOfValues\":[],\"buttonHeaders\":[],\"buttonBody\":[],\"APIURL\":null,\"APIMETHOD\":null,\"ATTRSEQUENCE\":\"0\",\"IsSearch\":false,\"FormDisable\":false,\"SearchFormControl\":null,\"RequestFormat\":false,\"Format\":null,\"PatchControl\":[],\"FormatResponse\":null,\"Dynamic\":false,\"dataType\":\"text\",\"REQOBJECT\":\"{}\"}]"
      }
    };
    this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
      },
      width: 'auto'
    });
  }

  addPatchValueToControls(i,h){
    this.allFormControl[i].patchValueToControls.push({field:'',key:''})
  }
  removePatchValueToControls(i,h){
    this.allFormControl[i].patchValueToControls.splice(h,1)
  }

  disabledAddPatchValueToControls(item){
    let a = false
    item.patchValueToControls.forEach(element => {
      if(!element.field || !this.common.checkTruthyValue(element.field) || !element.key ||  !this.common.checkTruthyValue(element.key)){
        a = true
      }
    });
    let b = this.allFormControl.filter(element => element.type != 'button' && element.type != 'checkbox' && element.label && this.common.checkTruthyValue(element.label) && element.formControlName && this.common.checkTruthyValue(element.formControlName) && item.formControlName != element.formControlName)
    if(b.length >= item.patchValueToControls.length) a = true
    return a;
  }

  buttonsAvailable(i){
    let a = []
    if(this.allFormControl[i].label && this.common.checkTruthyValue(this.allFormControl[i].label)){
      this.allFormControl.forEach(element => {
        if(element.type == 'button' && element.label && this.common.checkTruthyValue(element.label) && (element.label != this.allFormControl[i].label)){
          a.push(element.label)
        }
      });
    }
    return a;
  }

  buttonsArrayToClick(i,mm){
    let a = []
    // if(this.allFormControl[i].label && this.common.checkTruthyValue(this.allFormControl[i].label)){
    //   this.allFormControl.forEach(element => {
    //     if(element.type == 'button' && element.label && this.common.checkTruthyValue(element.label) && (element.label != this.allFormControl[i].label)){
    //       a.push(element.label)
    //     }
    //   });
    // }
    a = this.buttonsAvailable(i).filter(res => !this.allFormControl[i].clickButtonAfterArray.map(x =>{
      if(this.allFormControl[i].clickButtonAfterArray[mm].value != x.value){ return x.value}
    }).includes(res))
    return a;
  }

  addClickButtonAfter(i){
    this.allFormControl[i].clickButtonAfterArray.push({value:''})
  }
  removeClickButtonAfter(i,j){
    this.allFormControl[i].clickButtonAfterArray.splice(j,1)
  }

  returnFieldName(type){
    return this.allFormControl.filter(res => res.fieldType == type && res.fieldName).map(res1 => res1.fieldName)
  }

  callSystemDefinedFields(){
    let obj = {
      "data": {
        "spname": "usp_unfyd_data_collection_form",
        "parameters": {
          "FLAG": "EDIT",
          "FORMTYPE": 'System Defined Fields',
          PRODUCTID: 11
        }
      }
    };
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        if(res.results.data.length > 0){
          this.systemDefinedFieldArray = res.results.data.map(r => JSON.parse(r.FormReq))
        }else{
          this.systemDefinedFieldArray = []
        }
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      });
  }

  editSystemDefinedFormField(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'editSystemDefinedFields',
        id: 'System Defined Fields',
        formType : 'customize-forms',
        productId : 11
      },
      width: '100%',
      height: '90vh'
    });
    dialogRef.afterClosed().subscribe(status => {
      // if (status) {
        this.callSystemDefinedFields()
      // }
    })
  }

  getStructure(){
    this.loader = true
    let obj = {
      data: {
        spname: "usp_unfyd_form_structure",
        parameters: {
          FLAG :'GET',
          PROCESSID: this.userDetails?.Processid
        }
      }
    }
    this.api.post('index',obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if(res.results.data.length > 0){
            this.structureTemplate = res.results.data
          }else{
            this.structureTemplate = []
          }
        }
    })
  }

  returnTemplates():Array<any>{
    let a = []
    a = this.structureTemplate.filter(rr => {
      let formcontrols = []
      if(rr.JsonData && JSON.parse(rr.JsonData).length > 0){
        formcontrols = JSON.parse(rr.JsonData).filter(name => {
          if(this.common.checkTruthyValue(name.formControlName) && this.common.checkTruthyValue(name.label)){
            return name.formControlName
          } 
        })
        console.log(formcontrols);
      }
    })
    return a;
  }

  structureTemplateChanged(val){
    let data = this.structureTemplate.filter(rr => rr.StructureName.toLowerCase() == val.toLowerCase())
    if(data.length > 0){
      JSON.parse(data[0].JsonData).forEach(element => {
      if(this.allFormControl.filter(rrr => this.common.checkTruthyValue(rrr.formControlName) && this.common.checkTruthyValue(rrr.label) && rrr.formControlName.toLowerCase() == element.formControlName.toLowerCase()).length == 0){
        this.allFormControl.push({...element}) 
      }});
    }
    setTimeout(() => {
      this.structureTemplateSelected = ''
    });
    this.changesDone()
  }
}
