import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QueryBuilderConfig, QueryBuilderClassNames } from 'angular2-query-builder';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-query-creation-builder',
  templateUrl: './query-creation-builder.component.html',
  styleUrls: ['./query-creation-builder.component.scss']
})
export class QueryCreationBuilderComponent implements OnInit {
  @Output() sendData = new EventEmitter<any>();
  @Input() isDisabled = false
  inavalidValue = false
  objectKeys = Object.keys;
  @Input() query = {
    condition: 'and',
    rules: [
      // {field: 'age', operator: '<=', value: 'Bob'},
      // {field: 'gender', operator: '>=', value: 'm'},
      // {field: 'date', operator: '>=', value: ''},
      // {field: 'checkbox', operator: '>=', value: ''}
    ]
  };

  @Input() config: QueryBuilderConfig = {
    fields: {
      // age: {name: 'Age', type: 'text', operators: ['=', '<=', '>'],options: [{name: 'Male', value: 'm'},{name: 'Female', value: 'f'}]},
      // checkbox: {name: 'status', type: 'checkbox', operators: ['='],options: []},
      // date: {name: 'Date', type: 'datetime', operators: ['=', '<=', '>'],options: []},
      // gender: {
      //   name: 'Gender',
      //   type: 'list',
      //   options: [
      //     {name: 'Male', value: 'm'},
      //     {name: 'Female', value: 'f'}
      //   ]
      // }
    }
  }

  classNames: QueryBuilderClassNames = {
    removeIcon: 'icon-flushing_manager',
    addIcon: 'icon-add',
    arrowIcon: 'icon-arrowRight d-block pr-2 gray-color',
    button: 'btn123',
    buttonGroup: 'btn-group123',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline',
    row: 'row p-2 m-1',
    rule: 'border123',
    ruleSet: 'border123',
    invalidRuleSet: 'alert alert-danger',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control',
    inputControlSize: 'col-auto'
  }

  constructor(private common:CommonService) { }

  ngOnInit(): void {
  }

  changed(){
    console.log(this.query);
    this.sendData.next(this.query)
  }

  validityCheck():boolean{
      let validation = false
        let a = (data1) =>{
          if(data1.hasOwnProperty('field')){
            if(data1.hasOwnProperty('value')){
              if(!this.common.checkTruthyValue(data1.value)){
                validation = true
              }
            } else{
              validation = true
            }
          } else if(data1.hasOwnProperty('rules') && data1.rules.length > 0){
            data1.rules.forEach(rr => {
                a(rr)
            })
          }
        }
        a(this.query)
        return validation
  }
}
