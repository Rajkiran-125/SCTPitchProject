import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CommonService } from "src/app/global/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/global/api.service";
import { AuthService } from "src/app/global/auth.service";
import { regex, masters, checknull, checknull1, emptySpace, startTime } from 'src/app/global/json-data';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { MatCheckboxChange } from "@angular/material/checkbox";
import moment from "moment";
@Component({
  selector: "app-task-group",
  templateUrl: "./task-group.component.html",
  styleUrls: ["./task-group.component.scss"],
})
export class TaskGroupComponent implements OnInit {
  view: boolean =false;
  userChannelName:any=[];
  userLanguageName:any=[];
  constructor(
    private formBuilder: FormBuilder,
    public common: CommonService,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<DialogComponent>,
    private api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private auth: AuthService,
    private el: ElementRef
  ) {
    Object.assign(this, { masters, regex });
  }
  @Input() isDialog: any;
  @Input() parameter: any;
  @Input() path:any
  loader = false;
  form:FormGroup;
  resetform: boolean = false;
  userDetails: any;
  productType: any = [];
  productName: any = 10;
  subscription: Subscription[] = [];
  userConfig: any;
  changeModuleDisplayName: string;
  getGroupList = []
  todayDate: Date = new Date();
  labelName: any;
  routeType = []
  selectedIndex = 0
  dummyAllFormControl = []
  operators = ['==', '<=', '>=','<','>','!=']
  query = { "condition": "and", "rules": [] }
  config = { fields: {} }
  config1 = { fields: {} }
  comparisonOperator = ['==','<','>']
  variable0: any;
  variable1: any;
  variable2: any;
  variable3: any;
  variable4: any;
  variable5: any;
  invalidQueryArray = [];
  invalidQueryArray1 = [];
  subscriptionAcitivateData: Subscription[] = [];
  requestObj: any;
  selectallval: boolean = false;
  submittedForm = false;
  maxDate = new Date();
  @Input() channel: any;
  @Input() language: any;
  @ViewChild('panel0') public panel0;
  @ViewChild('panel1') public panel1;
  @ViewChild('panel2') public panel2;
  @ViewChild('panel3') public panel3;
  @ViewChild('panel4') public panel4;
  @ViewChild('panel5') public panel5;
  ngOnInit() {
    this.userDetails = this.auth.getUser();
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.productType = JSON.parse(localStorage.getItem('products'))
    this.getLanguageStorage()
    this.getChannelStorage()
    if(!this.isDialog) this.path = this.activatedRoute.snapshot.paramMap.get('id');

    let startTime = {hour: new Date().getHours() ,minute: new Date().getMinutes(),second: new Date().getSeconds()}
    let endTime = {hour: new Date().getHours() ,minute: new Date().getMinutes(),second: new Date().getSeconds() == 59  ?  0  : new Date().getSeconds() + 1}
    this.form = this.formBuilder.group({
      details: this.formBuilder.group({
        name : ['',[Validators.required,Validators.pattern(regex.alphanumericwithspecialcharacter)]],
        usergroup : ['',[Validators.required]],
        description : ['',[Validators.nullValidator,Validators.pattern(regex.alphanumericwithspecialcharacter),Validators.minLength(3),Validators.maxLength(500)]],
        previewduration : [1,[Validators.required,Validators.min(1),Validators.max(99)]],
        startdate : [moment(),[Validators.required]],
        starttime : [startTime,[Validators.required]],
        enddate : [moment(),[Validators.required]],
        endtime : [endTime,[Validators.required]],
        routetype : ['Automatic',[Validators.required]]
      },{ validator: [checknull('name'),checknull1('description')] }
      ),
      taskgroupfields:[[]],
      filtercondition : [{ "condition": "and", "rules": [] }],
      // this.formBuilder.array([this.addFilterCondition()]),
      // rechurnrule : this.formBuilder.array([this.addRechurnRule()]),
      rechurnrule : this.formBuilder.group({
        condition : [{ "condition": "and", "rules": [] }],
        action : this.formBuilder.array([])
      }),
      sortcondition: this.formBuilder.group({
        value : [[]],
        order : [false]
      })
    })

    this.openPanel('details')
    // this.getOnlineHrs()
    this.getGroupType()
    this.getSnapShot()
    this.callUserConfig()
    this.common.setUserConfig(this.userDetails.ProfileType, 'TaskGroup');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
            this.userConfig = data
      }))
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))


    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.routeType = JSON.parse(data["RouteType"]);
        }
      })
    )
    if(this.path){
      this.getData()
    }

  }

  StartTimeEndTimeGreater(){
  let a:any =  this.fDetails.starttime.value
  if(a){
    a= (a.hour * 60 *60) + (a.minute* 60) + a.second
  }
  let b:any =  this.fDetails.endtime.value
  if(b){
    b= (b.hour * 60 *60) + (b.minute* 60) + b.second
  }

  return a >= b ? true : false
  }

  getData(){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_task_group",
        parameters: {
          FLAG :'EDIT',
          ID : this.path
        }
      }
    }
    this.api.post('index',obj).subscribe((res: any) => {
        if (res.code == 200) {
          this.resetform = true
          if(res.results.data.length > 0){
            this.loader = false;
            const lowerObj = this.common.ConvertKeysToLowerCase();
            res.results.data[0] = lowerObj(res.results.data[0]);
            let time = {
              hour : 0,
              minute : 0,
              second : 0
            }
            let a = res.results.data[0].starttime.split(":");
            time.hour = parseInt(a[0]);
            time.minute = parseInt(a[1]);
            time.second = parseInt(a[2]);

            let time1 = {
              hour : 0,
              minute : 0,
              second : 0
            }
            let a1 = res.results.data[0].expirytime.split(":");
            time1.hour = parseInt(a1[0]);
            time1.minute = parseInt(a1[1]);
            time1.second = parseInt(a1[2]);

            this.form.controls['details']['controls']['name'].patchValue(res.results.data[0].name)
            this.form.controls['details']['controls']['usergroup'].patchValue(res.results.data[0].usergroup ? res.results.data[0].usergroup.split(",") : [])
            this.form.controls['details']['controls']['description'].patchValue(res.results.data[0].description)
            this.form.controls['details']['controls']['previewduration'].patchValue(res.results.data[0].previewduration)
            this.form.controls['details']['controls']['startdate'].patchValue(res.results.data[0].startdate)
            this.todayDate = new Date(res.results.data[0].startdate)
            this.form.controls['details']['controls']['enddate'].patchValue(res.results.data[0].expirydate)
            this.form.controls['details']['controls']['routetype'].patchValue(res.results.data[0].routetype)
            this.form.controls['details']['controls']['starttime'].patchValue(time)
            this.form.controls['details']['controls']['endtime'].patchValue(time1)

            this.form.controls['taskgroupfields'].patchValue(res.results.data[0].taskgroupfields ? JSON.parse(res.results.data[0].taskgroupfields) : [])
            // this.form.controls['businesshours'].patchValue(res.results.data[0].businesshrs)
            this.form.controls['filtercondition'].patchValue(res.results.data[0].applyfilter ? JSON.parse(res.results.data[0].applyfilter) : { "condition": "and", "rules": [] })
            this.form.controls['rechurnrule']['controls']['condition'].patchValue(res.results.data[0].rechurnrule ? JSON.parse(res.results.data[0].rechurnrule) : { "condition": "and", "rules": [] })
            if(res.results.data[0].rechurnaction.length && JSON.parse(res.results.data[0].rechurnaction).length > 0){
              JSON.parse(res.results.data[0].rechurnaction).forEach(element => {
                this.rechrunRuleFormArray.push(this.addRechurnActionRule())
              });
              setTimeout(() => {
                this.form.controls['rechurnrule']['controls']['action'].patchValue(JSON.parse(res.results.data[0].rechurnaction))
              });
            }
            // this.form.controls['rechurnrule']['controls']['action'].patchValue(res.results.data[0].rechurnrule ? JSON.parse(res.results.data[0].rechurnrule) : { "condition": "and", "rules": [] })
            // let dummyRechurnVal = res.results.data[0].rechurnrule ? JSON.parse(res.results.data[0].rechurnrule) : [this.addRechurnRule()]
            // if(dummyRechurnVal.length > 1){
            //   dummyRechurnVal.forEach((element,index) => {
            //     if(index != 0) this.addFilterConditionType('rechurnrule')
            //   });
            // }
            // this.form.controls['rechurnrule'].patchValue(res.results.data[0].rechurnrule ? JSON.parse(res.results.data[0].rechurnrule) : [this.addRechurnRule()])
            this.form.controls['sortcondition']['controls']['value'].patchValue(res.results.data[0].sortcondition ?  res.results.data[0].sortcondition.split(",") : [])
            this.form.controls['sortcondition']['controls']['order'].patchValue(res.results.data[0].sortconditionorder)
            setTimeout(() => {
              this.queryBuilderOpened()
              this.queryBuilderOpened1()
              this.rechurnOpened()
            });
            this.form.updateValueAndValidity()
            this.dummyAllFormControl = this.form.value.taskgroupfields
            if(this.isDialog){
              this.openPanel(this.parameter)
            }
          }
        }
    })
  }
  getOnlineHrs(){

    this.common.configView.next({ channel : this.form.value.onlinehours.channel , language :  this.form.value.onlinehours.language })

    if(this.form.value.onlinehours.channel == undefined || this.form.value.onlinehours.channel == '')
    {
      this.loader = false;
      this.common.snackbar('SelectChannel');
      return;
    }
    if(this.form.value.onlinehours.language== undefined || this.form.value.onlinehours.language == '')
    {
      this.loader = false;
      this.common.snackbar('SelectLanguage');
      return;
    }
    this.view = true
    this.common.refreshMenu(true);
    this.form.updateValueAndValidity

  }
  callUserConfig(){
    this.common.setUserConfig(this.userDetails.ProfileType, 'TaskGroup');
     this.setLabelByLanguage(localStorage.getItem("lang"))
  }
  checknull(control:AbstractControl){
    if(control.value !== "")
    {
      if (control.value.trim(' ').length === 0) {
        return { checknull: true };
      }
      else {
        control.setErrors(null);
        }
     }
  }
  addFilterCondition(){
    return this.formBuilder.group({
      taskfield : ['',[Validators.required]],
      condition : ['',[Validators.required]],
      value : ['',[Validators.required]],
      andor : ['or',[Validators.required]]
    },{ validator: [checknull('value')] },
    )
  }
  rechurnRequired(event, index) {
    if(event != null && event != undefined){
    this.form.controls['rechurnrule']['controls'][index]['controls']['condition'].setValidators([Validators.required]);
    this.form.controls['rechurnrule']['controls'][index]['controls']['condition'].updateValueAndValidity()
    this.form.controls['rechurnrule']['controls'][index]['controls']['value'].setValidators([Validators.required,this.checknull.bind(this)]);
    this.form.controls['rechurnrule']['controls'][index]['controls']['value'].updateValueAndValidity()
    }
    else{
      this.form.controls['rechurnrule']['controls'][index]['controls']['condition'].setValidators(Validators.nullValidator);
      this.form.controls['rechurnrule']['controls'][index]['controls']['condition'].updateValueAndValidity()
      this.form.controls['rechurnrule']['controls'][index]['controls']['value'].setValidators(Validators.nullValidator);
      this.form.controls['rechurnrule']['controls'][index]['controls']['value'].updateValueAndValidity()
    }
  }
  addRechurnRule(){
    return this.formBuilder.group({
      taskfield : ['',[Validators.nullValidator]],
      value : ['',[Validators.nullValidator]],
      status : [false,[Validators.nullValidator]]
    })
  }

  addRechurnActionRule(){
    return this.formBuilder.group({
      taskfield : ['',[Validators.required]],
      value : ['',[Validators.nullValidator]],
      status : false
    },{ validator: [emptySpace('value')]})
  }
  getLanguage() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('AlertMessage', 'click', '', '', '', 'getLanguage');

    this.api.post('index', this.requestObj).subscribe((res: any) => {


      if (res.code == 200) {
        localStorage.setItem("userLanguageName", res.results.data[1][0].UserLanguage);
        this.getLanguageStorage()
      }
    });
  }
  productChange(){
    this.form.controls['onlinehours']['controls']['channel'].patchValue('');
  }

  getLanguageStorage(){
    this.loader = true;
    this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName'))
    if(this.userLanguageName == null || this.userLanguageName == undefined)
    {
      this.getLanguage();
    }else{
      let chlen = this.userLanguageName.length
      this.userLanguageName.forEach(element => {
        chlen--;
        if(chlen == 0)
        {
          this.loader =false
        }

      })
    }

  }
  getChannelStorage(){
    this.loader = true;
    this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))
    if(this.userChannelName == null || this.userChannelName == undefined)
    {
      this.getChannel();
    }else{
      let chlen = this.userChannelName.length
      this.userChannelName.forEach(element => {


        chlen--;
        if(chlen == 0)
        {
          this.loader =false
        }

      })
    }

  }

  getChannel() {
    let obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('ConfigManager','click','','','','getChannel');

    this.api.post('index', obj).subscribe((res: any) => {
      if(res.code == 200){
        localStorage.setItem("userChannelName",res.results.data[0][0].UserChannel);
        this.getChannelStorage()
      }
    });
  }
  setLabelByLanguage(data) {
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        // this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'TaskGroup', data)

  }

  back(){
    if(this.isDialog) this.dialogRef.close(false)
    else this.router.navigateByUrl('/masters/task-group')
  }

  getSnapShot() {
    // this.loader = true;
    this.changeModuleDisplayName=this.common.changeModuleLabelName()
  }

  get fDetails():{[key: string]: AbstractControl}{return this.form?.controls['details']['controls']}
  get filterConditionFormArray() { return this.form?.get('filtercondition') as FormArray}
  get rechrunRuleFormArray() { return this.form?.get('rechurnrule').get('action') as FormArray}
  // get rechrunRuleActionFormArray(index) { return this.form.get('rechurnrule')['controls'][index] as FormArray}

  getGroupType() {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "GROUP",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index',obj).subscribe((res: any) => {
      this.loader = false;
      this.getGroupList = res.results['data'];
    })
  }

  ifselectall(e, val) {
    if (e.includes(0) && this.form.value.details.usergroup.length >= this.getGroupList.length) {
      if (this.form.value.details.usergroup.includes(0)) {
        for (var i = 0; i < this.form.value.details.usergroup.length; i++) {
          if (this.form.value.details.usergroup[i] == 0) {
            let a = []
            a = this.form.value.details.usergroup
            a.splice(a.indexOf(0), 1);

            this.form.controls['details']['controls']['usergroup'].patchValue(a);
            this.form.get('details')['controls']['usergroup'].updateValueAndValidity()
            this.form.updateValueAndValidity()
          }
        }
      }
    }
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.form.controls['details']['controls']['usergroup'].patchValue(this.getGroupList.map(item => item.GroupID));
      this.form.updateValueAndValidity()

    } else {
      this.form.controls['details']['controls']['usergroup'].patchValue('');
    }
  }
  changesDone(val){
    this.dummyAllFormControl = val
    // this.form.controls['taskgroupfields'].patchValue(val)
    // this.form.updateValueAndValidity()
  }
  resetTaskGroup(val){
    this.form.controls['taskgroupfields'].patchValue([])
    this.form.controls['filtercondition'].patchValue({ "condition": "and", "rules": [] })
    this.form.controls['sortcondition']['controls']['value'].patchValue([])
    this.form.controls['sortcondition']['controls']['order'].patchValue(false)
    let a = this.form.get('rechurnrule') as FormArray;
    let length = a.length - 1;
    for (let i = length; i >= 0; i--) {
      a.removeAt(i)
    }
    this.rechrunRuleFormArray.push(this.addRechurnRule())
    this.dummyAllFormControl = []
    this.form.updateValueAndValidity()
  }
  changesDone1(val){
    this.dummyAllFormControl = val
    this.form.controls['taskgroupfields'].patchValue(val)
    this.form.updateValueAndValidity()
  }
  route(): boolean {
    return !this.form.value.details.routetype;
  }
  selectedIndexValue(value: any) {
    this.selectedIndex = value

    // let a = JSON.parse(JSON.stringify(this.form.value.taskgroupfields))
    // this.form.controls['taskgroupfields'].patchValue([])
    // this.form.updateValueAndValidity()
    // this.form.controls['taskgroupfields'].patchValue(a)
    // this.form.updateValueAndValidity()
  }

  returnTaskFields():Array<Object|undefined>{
    let a = [];
    if(this.form){
      if(this.form.value){
        if(this.form.value.hasOwnProperty('taskgroupfields')){
          if(this.form.value.taskgroupfields){
            if(this.form.value.taskgroupfields.length > 0){
              this.form?.value?.taskgroupfields.forEach(element => {
                if(element.label && this.common.checkTruthyValue(element.label) && element.formControlName && this.common.checkTruthyValue(element.formControlName) && element.type != 'button'){
                  a.push(element)
                }
              });}
            }
        }
      }
    }
    return a
  }

  delete(type,index){
    if(type == 'filtercondition'){
      let a = this.form.controls[type] as FormArray
      a.removeAt(index)
    }
    if(type == 'rechurnrule'){
      let a = this.form.controls[type] as FormArray
      a.removeAt(index)
    }
  }

  addFilterConditionType(type){

    if(type == 'filtercondition'){
      this.filterConditionFormArray.push(this.addFilterCondition())
    }
    if(type == 'rechurnrule'){
      this.rechrunRuleFormArray.push(this.addRechurnRule())
      this.rechurnOpened()
    }
  }

  validateToAdd(type){
    let a = false;

    if(type == 'filtercondition'){
    }

  }
  sortOpened(){
    if(!this.form.value.taskgroupfields || this.form.value.taskgroupfields.length == 0){
      this.common.snackbar('Add task fields')
      this.variable3 = false
      this.variable4 = false
      this.variable5 = false
      this.panel3?.close()
      this.panel4?.close()
      this.panel5?.close()
    }
  }
  rechurnOpened(){
    if(!this.form.value.taskgroupfields || this.form.value.taskgroupfields.length == 0){
      this.common.snackbar('Add task fields')
      this.variable3 = false
      this.variable4 = false
      this.variable5 = false
      this.panel3?.close()
      this.panel4?.close()
      this.panel5?.close()
    }else{

      // if(this.form.value.rechurnrule.action.length > 0){

      // } else{

      // }
      // let a = []
      // let b = []
      // this.form.value.rechurnrule.action.forEach((element,index) => {
      //   a = JSON.parse(JSON.stringify(element))
      //   b = a.map(res => res.taskfield)
      //   let formData = this.form.controls['rechurnrule']['controls']['action'] as FormArray
      //   this.form.value['rechurnrule']['action'].forEach((element1,index1) => {
      //     formData.removeAt(0)
      //   });
      // })

      // this.form.value.rechurnrule.action.forEach((element,index) => {
      //   this.form.value['taskgroupfields'].forEach((element1,index1) => {
      //     if(this.common.checkTruthyValue(element1?.formControlName) && this.common.checkTruthyValue(element1?.label)){
      //       this.rechrunRuleFormArray.push(this.addRechurnActionRule())
      //       let c = {taskfield : element1.formControlName , value : '', status : false}
      //       if(b.includes(element1.formControlName)){
      //         a.forEach(element2 => {
      //           if(element2.taskfield == element1.formControlName){
      //             this.rechrunRuleFormArray.at(index).patchValue(element2)
      //           }
      //         });
      //       }else{
      //         this.rechrunRuleFormArray.at(index).patchValue(c)
      //       }
      //     }
      //   });
      // });



      let a = JSON.parse(JSON.stringify(this.form.value.rechurnrule.action))
      let b = a.map(rr => rr.taskfield)

      this.form.value.rechurnrule.action.forEach((element,index) => {
        this.form.controls['rechurnrule']['controls']['action'].removeAt(0)
        // let formData = this.form.controls['rechurnrule']['controls']['action'] as FormArray
        // this.form.value['rechurnrule']['action'].forEach((element1,index1) => {
        //   formData.removeAt(0)
        // });
      })


      this.form.value['taskgroupfields'].forEach((element1,index1) => {
        if(this.common.checkTruthyValue(element1?.formControlName) && this.common.checkTruthyValue(element1?.label)){
          this.rechrunRuleFormArray.push(this.addRechurnActionRule())
          let c = {taskfield : element1.formControlName , value : '', status : false}
          if(b.includes(element1.formControlName)){
            a.forEach(element2 => {
              if(element2.taskfield == element1.formControlName){
                this.rechrunRuleFormArray.at(this.rechrunRuleFormArray.value.length -1).patchValue(element2)
                setTimeout(() => {
                  this.taskGroupRechurnActionSetValidation(this.rechrunRuleFormArray.value.length -1)
                });
              }
            });
          }else{
            this.rechrunRuleFormArray.at(this.rechrunRuleFormArray.value.length -1).patchValue(c)
            setTimeout(() => {
              this.taskGroupRechurnActionSetValidation(this.rechrunRuleFormArray.value.length -1)
            });
          }
        }
      });
    }
  }

  taskFieldsForRechurn(index){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'taskGroupRechurnAction',
        data: this.form.controls['rechurnrule']['controls'][index]['controls']['action'].value,
        taskField : this.form.controls['rechurnrule']['controls'][index]['controls'].value
      },
      width: "100%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      if(status && status.length > 0){
        let formData = this.form.controls['rechurnrule']['controls'][index]['controls']['action'] as FormArray
        this.form.value['rechurnrule'][index]['action'].forEach((element1,index1) => {
          formData.at(index1).patchValue(status[index1])
        });
      }

    })
  }

  returnTaskGroupFields(){

  }

  queryBuilderOpened(){
    if(!this.form.value.taskgroupfields || this.form.value.taskgroupfields.length == 0){
      this.common.snackbar('Add task fields')
      this.variable3 = false
      this.variable4 = false
      this.variable5 = false
      this.panel3?.close()
      this.panel4?.close()
      this.panel5?.close()
    }else{
      let fields = {}
      this.form.value.taskgroupfields.forEach(element => {
        if(element.label && this.common.checkTruthyValue(element.label) && element.formControlName && this.common.checkTruthyValue(element.formControlName)){
          let a = {[element.formControlName] : {name: '', type: 'input', operators: this.operators, options: []}}
          a[element.formControlName]['name'] = element.formControlName
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
      if(Object.keys(fields).length > 0){
        this.config = {fields : {}}
        setTimeout(() => {
          this.config = {fields : fields}
          this.errorInQueryBuilder('filter')
        });
      }
    }
  }


  dataFromQueryBuilder(val){
    // this.query = val
    this.form.controls['filtercondition'].patchValue(val)
    this.errorInQueryBuilder('filter')
  }

  remove(i){
    let index = this.form.value.sortcondition.value.indexOf(i)
    let val = this.form.value.sortcondition.value
    let a = val.splice(index,1)
    // this.form.controls['sortcondition']['controls']['value'].patchValue(a)
  }

  returnSortConditionRemains(){
    return
  }

  sortSelection(val){
    let a = this.form.value.sortcondition.value.push(val)
    // this.form.controls['sortcondition']['controls']['value'].patchValue(a)
    // this.form.get('sortcondition').get('value').patchValue(a)
  }

  reset(){
    this.form.reset()
    this.submittedForm = false
    setTimeout(() => {
      let startTime = {hour: new Date().getHours() ,minute: new Date().getMinutes(),second: new Date().getSeconds()}
      let endTime = {hour: new Date().getHours() ,minute: new Date().getMinutes(),second: new Date().getSeconds() == 59  ?  0  : new Date().getSeconds() + 1}
    this.form.controls['details']['controls']['starttime'].patchValue(startTime)
    this.form.controls['details']['controls']['endtime'].patchValue(endTime)
    this.form.controls['details']['controls']['previewduration'].patchValue(1)
    this.form.controls['details']['controls']['startdate'].patchValue(moment())
    this.form.controls['details']['controls']['enddate'].patchValue(moment())
    this.form.controls['details']['controls']['routetype'].patchValue('Automatic')
    this.form.controls['rechurnrule']['controls']['condition'].patchValue({ "condition": "and", "rules": [] })
    this.form.controls['taskgroupfields'].patchValue([])
    this.form.controls['filtercondition'].patchValue({ "condition": "and", "rules": [] })
    this.form.controls['sortcondition']['controls']['value'].patchValue([])
    this.form.controls['sortcondition']['controls']['order'].patchValue(false)
    this.dummyAllFormControl = []
    this.form.updateValueAndValidity()
  })
  }

  openPanel(key){
    if(key == 'details'){
      // this.panel0.open()
      this.variable0 = "true"
      this.variable1 = false
      this.variable2 = false
      this.variable3 = false
      this.variable4 = false
      this.variable5 = false
      this.panel0?.open()

    }else if(key == 'taskgroupfields'){
      this.variable1 = "true"
      this.variable0 = false
      this.variable2 = false
      this.variable3 = false
      this.variable4 = false
      this.variable5 = false
      this.panel1?.open()

    }
    else if(key == 'filtercondition'){
      this.variable3 = "true"
      this.variable0 = false
      this.variable1 = false
      this.variable2 = false
      this.variable4 = false
      this.variable5 = false
      this.panel3?.open()
    }else if(key == 'rechurnrule'){
      this.variable4 = "true"
      this.variable0 = false
      this.variable1 = false
      this.variable2 = false
      this.variable3 = false
      this.variable5 = false
      this.panel4?.open()

    }else if(key == 'sortcondition'){
      this.variable5 = "true"
      this.variable0 = false
      this.variable1 = false
      this.variable2 = false
      this.variable3 = false
      this.variable4 = false
      this.panel5?.open()

    }
  }

  submit(event){
    this.submittedForm = true;
    this.form.controls['details']['controls']['starttime'].updateValueAndValidity()
    if (this.form.invalid || this.route() || this.StartTimeEndTimeGreater()) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if(this.form.controls[key].hasOwnProperty('controls')){
          for (const key1 of Object.keys(this.form.controls[key]['controls'])) {
            // const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key1 + '"]');
            // invalidControl.focus();
            // break;

            if(this.form.controls[key]['controls'][key1].hasOwnProperty('controls')){
              for (const key2 of Object.keys(this.form.controls[key]['controls'][key1]['controls'])) {

                if(this.form.controls[key]['controls'][key1]['controls'][key2].hasOwnProperty('controls')){
                  for (const key3 of Object.keys(this.form.controls[key]['controls'][key1]['controls'][key2]['controls'])) {
                    if(this.form.controls[key]['controls'][key1]['controls'][key2]['controls'][key3].invalid){
                      this.openPanel(key)
                      setTimeout(() => {
                        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key3 + '"]');
                        invalidControl.focus();
                        this.form.controls[key]['controls'][key1]['controls'][key2]['controls'][key3].markAsTouched()
                        return
                      });
                    }
                  }
                }else if (this.form.controls[key]['controls'][key1]['controls'][key2].invalid) {
                  const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key2 + '"]');
                  this.openPanel(key)
                  invalidControl.focus();
                  return
                  break;
                }
                // const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key2 + '"]');
                // invalidControl.focus();
                // this.openPanel(key)
                // return
                // break
              }
            }else if (this.form.controls[key]['controls'][key1].invalid) {
              const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key1 + '"]');
              this.openPanel(key)
              invalidControl.focus();
              return
              break;
            }
          }
        }else if (this.form.controls[key].invalid ) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          this.openPanel(key)
          return
          break;
        }
      }
      return;

    }
    if(this.invalidQueryArray.includes(true)){
      this.common.snackbar("Check your formfields");
      this.openPanel('filtercondition')
      return
    }
    if(this.invalidQueryArray1.includes(true)){
      this.common.snackbar("Check your formfields");
      this.openPanel('rechurnrule')
      return
    }
    if(this.validityCheck(this.form.value.filtercondition)){
      this.common.snackbar("Check your formfields");
      this.openPanel('filtercondition')
      return
    }
    if(this.validityCheck(this.form.value.rechurnrule.condition)){
      this.common.snackbar("Check your formfields");
      this.openPanel('rechurnrule')
      return
    }

    let startTime = JSON.parse(JSON.stringify(this.form.value.details.starttime))
    let hour = startTime.hour.toString()
    let minute = startTime.minute.toString()
    let second = startTime.second.toString()
    startTime = hour.padStart(2,"0") + ":" + (minute).padStart(2,"0") + ":" + (second).padStart(2,"0")

    let endTime = JSON.parse(JSON.stringify(this.form.value.details.endtime))
    let hour1 = endTime.hour.toString()
    let minute1 = endTime.minute.toString()
    let second1 = endTime.second.toString()
    endTime = hour1.padStart(2,"0") + ":" + (minute1).padStart(2,"0") + ":" + (second1).padStart(2,"0")

    let obj = {}
    if(!this.path){
      let a = this.form.value.taskgroupfields.filter(rrr => rrr.formControlName && rrr.label)
      obj = {
        data: {
          spname: "usp_unfyd_task_group",
          parameters: {
            FLAG :'INSERT',
            NAME: this.form.value.details.name,
            DESCRIPTION: this.form.value.details.description,
            STARTDATE: this.form.value.details.startdate,
            STARTTIME: startTime,
            EXPIRYTIME: endTime,
            EXPIRYDATE: this.form.value.details.enddate,
            USERGROUP: this.form.value.details.usergroup.length > 0 ? this.form.value.details.usergroup.join(',') : '',
            APPLYFILTER: this.form.value.filtercondition ? JSON.stringify(this.form.value.filtercondition) : '',
            PREVIEWDURATION: this.form.value.details.previewduration,
            ROUTETYPE: this.form.value.details.routetype,
            TASKGROUPFIELDS: a.length > 0 ? JSON.stringify(a) : '',
            RECHURNRULE: this.form.value?.rechurnrule?.condition ? JSON.stringify(this.form.value?.rechurnrule?.condition) : '',
            RECHURNACTION: this.form.value?.rechurnrule?.action ? JSON.stringify(this.form.value?.rechurnrule?.action) : '',
            SORTCONDITION:this.form.value.sortcondition.value.length > 0 ? this.form.value.sortcondition.value.join(',') : '',
            SORTCONDITIONORDER: this.form.value.sortcondition.order,
            CREATEDBY: this.userDetails.Id,
            PRIVATEIP:'',
            PROCESSID: this.userDetails.Processid,
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    } else{
      let a = this.form.value.taskgroupfields.filter(rrr => rrr.formControlName && rrr.label)
      obj = {
        data: {
          spname: "usp_unfyd_task_group",
          parameters: {
            FLAG :'UPDATE',
            NAME: this.form.value.details.name,
            DESCRIPTION: this.form.value.details.description,
            STARTDATE: this.form.value.details.startdate,
            STARTTIME: startTime,
            EXPIRYTIME: endTime,
            EXPIRYDATE: this.form.value.details.enddate,
            USERGROUP: this.form.value.details.usergroup.length > 0 ? this.form.value.details.usergroup.join(',') : '',
            APPLYFILTER: this.form.value.filtercondition ? JSON.stringify(this.form.value.filtercondition) : '',
            PREVIEWDURATION: this.form.value.details.previewduration,
            ROUTETYPE: this.form.value.details.routetype,
            TASKGROUPFIELDS: a.length > 0 ? JSON.stringify(a) : '',
            RECHURNRULE: this.form.value?.rechurnrule?.condition ? JSON.stringify(this.form.value?.rechurnrule?.condition) : '',
            RECHURNACTION: this.form.value?.rechurnrule?.action ? JSON.stringify(this.form.value?.rechurnrule?.action) : '',
            SORTCONDITION:this.form.value.sortcondition.value.length > 0 ? this.form.value.sortcondition.value.join(',') : '',
            SORTCONDITIONORDER: this.form.value.sortcondition.order,
            MODIFIEDBY: this.userDetails.Id,
            ID : this.path
          }
        }
      }
    }

    this.api.post('index',obj).subscribe((res: any) => {
      this.loader = false;
        if (res.code == 200) {
          if(res.results.data.length > 0){
            this.common.refreshMenu(true);
            if(res.results.data[0].result == "Data added successfully"){
              this.common.snackbar('Record add');
              if(event == 'add'){
                if(this.isDialog == true){
                  this.dialogRef.close(true);
                }
                else {
                this.router.navigate(['masters/task-group']);}
              } else if(event == 'saveAndAddNew'){
                this.reset()
              }
            }
            else if(res.results.data[0].result == "Data updated successfully") {
              this.common.snackbar('Update Success');
              if(event == 'add'){
                if(this.isDialog == true){
                  this.dialogRef.close(true);
                }
                else {
                this.router.navigate(['masters/task-group']);}
              } else if(event == 'saveAndAddNew'){
                this.reset()
              }
            }
            else if (res.results.data[0].Status == true) {

            this.common.confirmationToMakeDefault('AcitvateDeletedData');
            this.subscriptionAcitivateData.push(
                this.common.getIndividualUpload$.subscribe(status => {
              if(status.status){
                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_task_group",
                    parameters: {
                      flag: 'ACTIVATE',
                      NAME: this.form.value.details.name,
                      modifiedby: this.userDetails.Id,
                      processid: this.userDetails.Processid,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if(event == 'add'){
                      if(this.isDialog == true){
                        this.dialogRef.close(true);
                        this.common.refreshMenu(true);

                      }
                      else {
                      this.router.navigate(['masters/task-group']);}
                      this.common.snackbar('Record add');

                    } if (event == 'saveAndAddNew') {
                      this.common.snackbar('Record add');
                      this.reset()
                      if(this.isDialog == true){
                        this.common.refreshMenu(true);
                        this.form.reset()

                      }
                    }
                  }
                });
            }
              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
              }))


            }
            else if((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)){
              this.common.snackbar('Data Already Exist');
            }
          }
        }
    })

  }

  checkTaskFroupField(){
    return this.form.value.taskgroupfields.length > 0 ? true : false
  }

  queryBuilderOpened1(){
    if(!this.form.value.taskgroupfields || this.form.value.taskgroupfields.length == 0){
      this.common.snackbar('Add task fields')
      this.variable3 = false
      this.variable4 = false
      this.variable5 = false
      this.panel3?.close()
      this.panel4?.close()
      this.panel5?.close()
    }else{
      let fields = {}
      this.form.value.taskgroupfields.forEach(element => {
        if(element.label && this.common.checkTruthyValue(element.label) && element.formControlName && this.common.checkTruthyValue(element.formControlName)){
          let a = {[element.formControlName] : {name: '', type: 'input', operators: this.operators, options: []}}
          a[element.formControlName]['name'] = element.formControlName
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
      if(Object.keys(fields).length > 0){
        this.config1 = {fields : {}}
        setTimeout(() => {
          this.config1 = {fields : fields}
          this.errorInQueryBuilder('rechurn')
        });
      }
    }
  }

  errorInQueryBuilder(flag){
    if(flag == 'rechurn'){
      if(Object.keys(this.config1.fields).length > 0){
        let a = Object.keys(this.config1.fields)
        this.invalidQueryArray1 = []
        this.checkErrorInQueryBuilder(this.form.value.rechurnrule.condition,a,flag)
      }
    } else {
      if(Object.keys(this.config.fields).length > 0){
        let a = Object.keys(this.config.fields)
        this.invalidQueryArray = []
        this.checkErrorInQueryBuilder(this.form.value.filtercondition,a,flag)
      }
    }
  }

  checkErrorInQueryBuilder(obj,formFields,flag){
    if(obj.hasOwnProperty('rules')){
      if(obj.rules.length > 0){
        obj.rules.forEach(element => {
          this.checkErrorInQueryBuilder(element,formFields,flag)
        });
      }
    }else{
      if(obj.field && !formFields.includes(obj.field)){
        if(flag == 'rechurn') this.invalidQueryArray1.push(true)
        else this.invalidQueryArray.push(true)
      } else if(obj.hasOwnProperty('value')){
        if(!this.common.checkTruthyValue(obj.value)){
          if(flag == 'rechurn') this.invalidQueryArray1.push(true)
          else this.invalidQueryArray.push(true)
        }
      } else if(!obj.hasOwnProperty('value')){
        if(flag == 'rechurn') this.invalidQueryArray1.push(true)
        else this.invalidQueryArray.push(true)
      } else{
        if(flag == 'rechurn') this.invalidQueryArray1.push(false)
        else this.invalidQueryArray.push(false)
      }
    }

  }

  dataFromQueryBuilder1(val){
    this.form.controls['rechurnrule']['controls']['condition'].patchValue(val)
    this.errorInQueryBuilder('rechurn')
  }

  taskGroupRechurnActionSetValidation(i){
    if(this.form.value.rechurnrule.action[i].status){
      setTimeout(() => {
        this.form.controls['rechurnrule']['controls']['action']['controls'][i]['controls']['value'].clearValidators()
        this.form.controls['rechurnrule']['controls']['action']['controls'][i]['controls']['value'].updateValueAndValidity()
        this.form.updateValueAndValidity()
        setTimeout(() => {
          this.form.controls['rechurnrule']['controls']['action']['controls'][i]['controls']['value'].setValidators([Validators.pattern(regex.alphanumeric),Validators.required]);
          this.form.controls['rechurnrule']['controls']['action']['controls'][i]['controls']['value'].updateValueAndValidity()
          this.form.updateValueAndValidity()
        });
      });
    }else{
      setTimeout(() => {
        this.form.controls['rechurnrule']['controls']['action']['controls'][i]['controls']['value'].clearValidators()
        this.form.controls['rechurnrule']['controls']['action']['controls'][i]['controls']['value'].updateValueAndValidity()
        this.form.updateValueAndValidity()
        setTimeout(() => {
          this.form.controls['rechurnrule']['controls']['action']['controls'][i]['controls']['value'].setValidators([Validators.pattern(regex.alphanumeric)]);
          this.form.controls['rechurnrule']['controls']['action']['controls'][i]['controls']['value'].updateValueAndValidity()
          this.form.updateValueAndValidity()
        });
      });
    }
  }

  validityCheck(value):boolean{
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
      a(value)
      return validation
}

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
