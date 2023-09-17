import { Clipboard } from '@angular/cdk/clipboard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex} from 'src/app/global/json-data';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  loader = false;
  subscription: Subscription[] = [];
  userDetails;
  labelName:any
  taskGroupInfo:any
  environment
  apiData = {
    url : environment.base_url + 'index',
    method: 'post',
    body : `{
      data:{
        spname: "usp_unfyd_tasks",
        parameters: {
          flag: "insert",
          CAMPAIGNID: '',
          TASKGROUPID: '',
          VALUE: '',
          STATUS:'Pending',
          PRODUCTID: '',
          PROCESSID: '',
          CREATEDBY: '',
          PRIVATEIP: '',
          PUBLICIP: '',
          BROWSERNAME: '',
          BROWSERVERSION: '',
        }
      }
  }`,
  sampleRequest: `{
    "data": {
        "spname": "usp_unfyd_tasks",
        "parameters": {
            "flag": "insert",
            "CAMPAIGNID": "1",
            "TASKGROUPID": "18",
            "VALUE": "{\"TaskName\":\"Loan Application\",\"Campaign\":\"\",\"Title\":\"Mrs\"}",
            "STATUS": "Pending",
            "PRODUCTID": "11",
            "PROCESSID": 1,
            "CREATEDBY": "1",
            "PRIVATEIP": ""
        }
    }
}`,
  sampleResponse : `{
    "message": "Success",
    "error": false,
    "code": 200,
    "results": {
        "data": [
            {
                "result": "Data added successfully"
            }
        ],
        "TokenIndex": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVuZnlkLWFkbWluIiwicGFzc3dvcmQiOiJDY25xNE0yaUdFUFBvcVc1akN2cklnPT0iLCJpYXQiOjE2ODY2Njc0NjIsImV4cCI6MTY4NjY3MTA2Mn0.r9u0wMWJyJniM57X1zhhm5_npEnPGvGmkWG3j_yFaDs"
    }
}`,
  taskGroupFields : ``
  }
  config = { fields: {} }
  operators = ['==', '<=', '>=','<','>','!=']

  constructor(private formBuilder: FormBuilder,  public common: CommonService,private el: ElementRef,
    private api: ApiService, private auth: AuthService,public dialog: MatDialog, private http: HttpClient,
    public clipboard: Clipboard
    ) {
    Object.assign(this, { regex,environment});
   }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    console.log("userDetails:",this.userDetails);

    // this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'Localization',localStorage.getItem("lang"))
      this.getData()
  }

  getData(){
    this.loader = true
    let obj = {
      data: {
        spname: "usp_unfyd_task_group",
        parameters: {
          FLAG :'EDIT',
          ID : 18
        }
      }
    }
    this.api.post('index',obj).subscribe((res: any) => {
      this.loader = false;
        if (res.code == 200) {
          if(res.results.data.length > 0){
            this.loader = false
            res.results.data[0].SortCondition = res.results.data[0].SortCondition ? res.results.data[0].SortCondition.split(',') : []
            res.results.data[0].UserGroup = res.results.data[0].UserGroup ? res.results.data[0].UserGroup.split(',') : []
            res.results.data[0].TaskGroupFields = res.results.data[0].TaskGroupFields ? JSON.parse(res.results.data[0].TaskGroupFields) : []
            res.results.data[0].ApplyFilter = res.results.data[0].ApplyFilter ? JSON.parse(res.results.data[0].ApplyFilter) : { "condition": "and", "rules": [] }
            res.results.data[0].RechurnRule = res.results.data[0].RechurnRule ? JSON.parse(res.results.data[0].RechurnRule) : []
            res.results.data[0].fieldMapping = res.results.data[0].fieldMapping ? JSON.parse(res.results.data[0].fieldMapping) : []
            res.results.data[0].apiConfig = res.results.data[0].apiConfig ? JSON.parse(res.results.data[0].apiConfig) : ''
            this.apiData['taskGroupFields'] = JSON.stringify(res.results.data[0].TaskGroupFields)
            this.taskGroupInfo = res.results.data[0]
            this.taskGroupInfo.RechurnRule.forEach(element => {
              element.action.forEach(element1 => {
                if(element1.status){
                  if(element.hasOwnProperty('actionVal')){
                    if(element.actionVal){
                      element.actionVal = `${element.actionVal}, ${element1.taskfield}=${element1.value}`
                    }else{
                      element.actionVal = `${element1.taskfield}=${element1.value}`
                    }
                  }else{
                    Object.assign(element,{actionVal : `${element1.taskfield}=${element1.value}` })
                  }
                }
              });
            });
            console.log(this.taskGroupInfo);
            this.queryBuilderOpened()
            console.log("abcdefg:",this.createLogicalQuery(this.taskGroupInfo?.ApplyFilter))
          }
        }
      })
  }

  queryBuilderOpened(){
    if(!this.taskGroupInfo.TaskGroupFields || this.taskGroupInfo.TaskGroupFields.length == 0){
      this.common.snackbar('Add task fields')
    }else{
      let fields = {}
      this.taskGroupInfo.TaskGroupFields.forEach(element => {
        if(element.label && this.common.checkTruthyValue(element.label) && element.formControlName && this.common.checkTruthyValue(element.formControlName)){
          let a = {[element.formControlName] : {name: '', type: 'input', operators: this.operators, options: []}}
          a[element.formControlName]['name'] = element.label
          a[element.formControlName]['type'] = element.type
          if(element.type == 'checkbox') a[element.formControlName]['operators'] = ['=']
          if(element.type == 'list' && element.listOfValues.length > 0){
            element.listOfValues.forEach(element1 => {
              if(element1.value && this.common.checkTruthyValue(element1.value && element1.key && this.common.checkTruthyValue(element1.key))){
                a[element.formControlName]['options'].push({name:element1.key,value:element1.value})
              }
            });
          }
          Object.assign(fields,{...a})
        }
      });
      // console.log("fields:",fields);
      if(Object.keys(fields).length > 0){
        this.config = {fields : fields}
        console.log("this.config:",this.config);
        // this.errorInQueryBuilder()
      }
    }
  }

  createLogicalQuery(rule: any): string {
    let query = "";

    if (rule.hasOwnProperty("condition") && rule.hasOwnProperty("rules")) {
      const condition = rule.condition.toLowerCase() == 'and' ? '&&' : '||';;
      const rules = rule.rules;

      query += "(";

      if (Array.isArray(rules) && rules.length > 0) {
        query += rules
          .map((r: any) => this.createLogicalQuery(r))
          .join(` ${condition} `);
      }

      query += ")";
    } else if (rule.hasOwnProperty("field") && rule.hasOwnProperty("operator") && rule.hasOwnProperty("value")) {
      const field = rule.field;
      const operator = rule.operator;
      const value = rule.value;

      // query += `(${field} ${operator} ${value})`;
      query += `${field} ${operator} ${value}`;
    }

    return query;
  }

  editTaskGroup(val){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'taskGroupMaster',
        data: this.taskGroupInfo,
        parameter : val
      },
      width: "100%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      console.log(status);
      if(status){
        this.getData()
      }
    })
  }

  returnTaskFields():Array<Object|undefined>{
    let a = [];
    this.taskGroupInfo?.TaskGroupFields.forEach(element => {
      if(element.label && this.common.checkTruthyValue(element.label) && element.formControlName && this.common.checkTruthyValue(element.formControlName) && element.type != 'button'){
        a.push(element)
      }
    });
    return a
  }


  copyData(){
    this.clipboard.copy(JSON.stringify(this.apiData))
  }
}
