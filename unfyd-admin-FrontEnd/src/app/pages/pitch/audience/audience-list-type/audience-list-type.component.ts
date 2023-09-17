import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';
import { regex } from 'src/app/global/json-data';

@Component({
  selector: 'app-audience-list-type',
  templateUrl: './audience-list-type.component.html',
  styleUrls: ['./audience-list-type.component.scss'],
  
})

export class AudienceListTypeComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
  ) { }

  type: any;
  dummyAllFormControl = [];
  form: FormGroup;
  selectedIndex = 0;
  systemDefinedFieldsValue: any = '';
  index: any;
  systemDefinedFieldsName = [];
  userDefinedFieldsName: any = '';
  userDefinedFieldsArr = [];
  selectIndex = 0;
  datatypes = ['String','Numeric','AlphaNumeric'];

  ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    if (this.type == 'simple-mode') {
      this.form = this.formBuilder.group({
        AudListName: ['', [Validators.nullValidator]],
        AudDescription: ['', [Validators.nullValidator]],
      })
    } else if (this.type == 'expert-mode') {
      this.form = this.formBuilder.group({
        systemDefinedFields: ['Customer Name', [Validators.nullValidator]],
        systemDefinedFieldsArray: this.formBuilder.array([]),
        userDefinedFields: ['', [Validators.nullValidator]],
        StructureName: ['', [Validators.required, Validators.pattern(regex.alphnumericWithSpaceHyphen)]],
      })

    } else if (this.type == 'existing-mode') {
      this.form = this.formBuilder.group({
        taskgroupfields: [[]],
        SelectAudienceList: ['', [Validators.nullValidator]],
        SelectAudienceField: ['', [Validators.nullValidator]],
        SelectAudienceFieldCondition: ['', [Validators.nullValidator]],
        SelectAudienceFieldConditionValue: ['', [Validators.nullValidator]],
        getAndOrCondition: ['', [Validators.nullValidator]],
        condition: this.formBuilder.array([
          // this.addOnCondition()
        ]),
      });
      this.addOnCondition();
    }

    this.getSystemDefinedFieldValues();
  }

  changesDone(val) {
    this.dummyAllFormControl = val;
  }

  changesDone1(val) {
    this.dummyAllFormControl = val;
    this.form.controls['taskgroupfields'].patchValue(val);
    this.form.updateValueAndValidity();
  }

  getAndOrCondition(value) {

  }

  onCondition(): FormArray {
    if (this.form && this.form.contains('condition'))
      return this.form.get("condition") as FormArray
  }

  newOnCondition(): FormGroup {
    return this.formBuilder.group({
      SelectAudienceField: new FormControl('', [Validators.required]),
      SelectAudienceFieldCondition: new FormControl('', [Validators.required]),
      SelectAudienceFieldConditionValue: new FormControl('', [Validators.required]),
      getAndOrCondition: new FormControl('', [Validators.required, Validators.maxLength(300)]),
    });
  }

  addOnCondition() {
    this.onCondition().push(this.newOnCondition());
  }

  removeOnCondition(i: number) {
    this.onCondition().removeAt(i);
  }

  selectedIndexValue(i) {

  }

  getSystemDefinedFieldsArray(): FormArray {
    return this.form.get('systemDefinedFieldsArray') as FormArray;
  }
  selectSystemDefinedFieldValues(val){
    console.log("SystemDefinedValue:", val);

  }
getSystemDefinedFieldValues() {    
    var Obj2 = {
      "data": {
        "spname": "usp_unfyd_getsystemfields",
        "parameters": {
          "Flag": "GET"
        }
      }
    }

    this.api.post('pitch/index', Obj2).subscribe(res => {
      if (res.code == 200) {
        this.systemDefinedFieldsName = res.results.data;
        console.log("vishal", this.systemDefinedFieldsName);
      }
    })
}

blankSystemDefined() {
  this.systemDefinedFieldsValue = '';
}
blankUserDefined() {
  this.userDefinedFieldsName = '';
}
  
createSystemDefinedFieldsArray(val, flag): FormGroup {
  if(flag){
    return this.formBuilder.group({
      FieldName: [val.FieldName, [Validators.nullValidator]],
      FieldDataType: [val.FieldDataType, [Validators.nullValidator]],
      FieldDataLength: [val.FieldDataLength, [Validators.nullValidator]],
      Regex: [val.Regex, [Validators.nullValidator]],
      IsMandatory: ['false', [Validators.nullValidator]],
      IsUnique: ['false', [Validators.nullValidator]],
      //customerName: ['', [Validators.nullValidator]],
      //gender: ['', [Validators.nullValidator]],
      type : ['systemDefinedField'],
    });
  } else {
    return this.formBuilder.group({
      FieldName: [val, [Validators.nullValidator]],
      FieldDataType: ['', [Validators.nullValidator]],
      FieldDataLength: ['', [Validators.nullValidator]],
      Regex: ['', [Validators.nullValidator]],
      IsMandatory: ['false', [Validators.nullValidator]],
      IsUnique: ['false', [Validators.nullValidator]],
      // customerName: ['', [Validators.nullValidator]],
      //gender: ['', [Validators.nullValidator]],
      type : ['userDefinedField'],
    });
  }
    
  }

  addSystemDefinedFieldsArray() {
    debugger;
    if(this.systemDefinedFieldsValue) {
      this.systemDefinedFieldsName.forEach(el => {
        if(el.Id == this.systemDefinedFieldsValue) {
          this.getSystemDefinedFieldsArray().push(this.createSystemDefinedFieldsArray(el, true));
          setTimeout(() => {
            this.selectedIndex = this.form.value.systemDefinedFieldsArray.length -1;
            this.userDefinedFieldsName = ''
            this.systemDefinedFieldsValue = ''
          });
        }
      });
      
    } else if (this.userDefinedFieldsName){
          this.getSystemDefinedFieldsArray().push(this.createSystemDefinedFieldsArray(this.userDefinedFieldsName, false));
          setTimeout(() => {
            this.selectedIndex = this.form.value.systemDefinedFieldsArray.length -1;
            this.userDefinedFieldsName = ''
            this.systemDefinedFieldsValue = ''
          })
    }
  }
  changeType(val){
    console.log("datatype", val);
  }

  removeSystemDefinedFieldsArray(i) {
    this.getSystemDefinedFieldsArray().removeAt(i);
  }
  sendStructureDetail() {
      if(this.form.value.systemDefinedFieldsArray.length>0){
        let obj123 = {
          "StructureName": this.form.value.StructureName,
          "structureData": this.form.value.systemDefinedFieldsArray
        }
        var ObjData = {
          "data": {
            "spname": "usp_unfyd_saveStructure",
            "parameters": obj123,            
          }
        }
        console.log("test", ObjData);
        this.api.post('pitch/index', ObjData).subscribe(res => {
          if (res.code == 200) {
            this.common.snackbar("Data Saved Successfully", "success");
          }
        })

      }
    }

    drop(event: CdkDragDrop<string[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex,
        );
      }
    }
}