import { Component, ElementRef, HostListener, OnChanges, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { PitchDialogComponent } from '../../pitch-dialog/pitch-dialog.component';
import { ExcelService } from 'src/app/global/excel.service';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem, } from '@angular/cdk/drag-drop';
import { PitchCommonService } from 'src/app/global/pitch-common.service';
import { first, take } from 'rxjs/operators';
import { error, log } from 'console';
import { async } from 'rxjs/internal/scheduler/async';
import { campaignTemplateTab, regex } from 'src/app/global/json-data';
import { element } from 'protractor';
import { NotificationMessages, ValidationMessages } from '../../pitch-json-data';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.scss']
})
export class AddCampaignComponent implements OnInit, OnDestroy, OnChanges {

  formName: any;
  selectedTab: any;
  form: FormGroup;
  excelFileUpload: any = [];
  excelFileUploadName: any = [];
  InitialExcelfileName: any = [];
  conditionForm: FormGroup;
  userDetails: any;
  requestObj: any;
  language: any;
  channel: any;
  botFlowList: any;
  submittedForm: boolean = false;
  loader: boolean = false;
  formData: any = null;
  path: any;
  channelSRCID: any;
  productId: any;
  TemplateData: any = [];
  sampleExcelData: any = [{
    "Sr.No": "",
    "Campaign Name": "",
    "Campaign Type": "",
    "Channel": ""
  }];
  sendEmailDur: any = [];
  channelSourceAvailable: boolean = false;
  templateID: any;
  template: any = [];
  subscription: Subscription[] = [];
  SampleCampaignExcel: any = [];
  Conditonsdata: any = [];
  templateVisible: boolean = false;
  cardTemplate: any;
  campaginData: any;
  config: any;
  time = { hour: 0, minute: 0, second: 0 }
  ChannelSource: any = {};
  ChannelSource1: any = [];
  Channel: any;
  Sender: any;
  temp: any;
  showBtn: boolean = false;
  disabledBtn: boolean = false;
  campaignType: any;
  // campaignType: any = [
  //   {Id:1, Value:'One Time'},
  //   {Id: 2, Value: 'Recurring'},
  //   {Id: 3, Value: 'Send Now'}
  // ];
  campaignTime: any[] = [
    { hour: 0, minute: 0, second: 0 }
  ];

  audienceFieldListNameArray = [];
  configdata: any;
  showThrottling: any = false;
  templateData: any = {};
  templateData1: any = {};
  fileData: any;
  ObjectKeys = Object.keys
  conditionIndex: number
  actionIndex: number
  languageSelected: string
  excelFileName: any;
  //campaignTypeSelected: any;
  dataTypes = [{ Id: 1, type: "Int" }, { Id: 2, type: "String" }];
  // nullableValues=[{Id:1, type:"true"},{Id:3, type:"false"}];
  yesNoBtnValue: boolean = false;
  isTableExist: boolean = false;
  sub$: Subscription;
  isNullableBoolean: any = false;
  campaignId: any;
  AudienceListName: any;
  StructureList: any;
  channelId: any = [];
  channelIdArr: any = [];
  errorMsg: boolean = false;
  AudienceListNameSave: boolean = false;
  actionableId: any;
  channelSource1ChannelId: any;
  structureListArr: any = [];
  defaultDate: Date;
  selectedTypeOption: number = 1;
  structureListId: any;
  patchfieldMapping: any;
  showAfterUploadExcel: boolean = false;
  progressValue: number = 0;
  progressInterval: Subscription;
  isDivVisible = false;

  // {
  //   this.defaultDate = new Date();
  //   Object.assign(this, { campaignTemplateTab});
  // } 
  tab = ''
  tabValue = [];
  tabchange = '';
  type = 'TemplateEnglish';
  campaignTemplateTab: any = [];
  selectedStructure = [];
  ChannelName: any;
  columnValue = [];
  getTime: any;
  getMinutes: any;
  getSeconds: any;
  audienceList = [];

  // Validation Start
  minMessage: any;
  maxMessage: any;
  isRequiredMessage: any;
  charAndNumOnly: any
  // Validation End

  editCampaignData: any;
  EditCamapaignId: any;






  constructor(
    private router: Router,
    private api: ApiService,
    private formBuilder: FormBuilder,
    public pitchCommon: PitchCommonService,
    public common: CommonService,
    private excelService: ExcelService,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private elementRef: ElementRef
  ) {
    this.defaultDate = new Date();
    this.getTime = new Date().getHours()
    this.getMinutes = new Date().getMinutes()
    this.getSeconds = new Date().getSeconds();

    Object.assign(this, { campaignTemplateTab });
    //this.toggleDiv();


  }


  ngOnChanges() {
    // this.addAudienceTableList();
    // this.getChannelName();

  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.channelSRCID = this.activatedRoute.snapshot.paramMap.get('uniqueid');
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.EditCamapaignId = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log(this.EditCamapaignId);

    this.minMessage = ValidationMessages.MinLengthMessage;
    this.maxMessage = ValidationMessages.maxLengthMessage;
    this.isRequiredMessage = ValidationMessages.isRequiredMessage;
    this.charAndNumOnly = ValidationMessages.charAndNumOnly;
    // this.type = this.activatedRoute.snapshot.paramMap.get('type');

    this.getLanguage();
    this.getChannel();
    this.getCampaignType();
    this.getdurationlist();
    this.getStructureList();
    this.getAudienceList();
    if (this.EditCamapaignId != null) {
      this.editCampaignDataFunction();
    }

    // this.callDialog()
    this.form = this.formBuilder.group({
      CampaignName: ['', [Validators.required]],
      CampaignDesc: ['', [Validators.required]],
      CampaignTemplate: ['',],
      CampaignType: ['',],
      ChannelList: ['Whatsapp',],
      sendEmailDur: ['Mins',],
      campaignTypeSelected: ['',],
      ChannelSrc: ['',],
      toggleMultilingual: ['',],
      targetAudienceList: ['ImportNew',],
      // AudienceListNameArray: this.formBuilder.array([]),
      headerType: ['',],
      AudienceListName: ['', [Validators.required, Validators.pattern(regex.alphanumric1)]],
      structureList: ['', [Validators.required]],
      CampaignStartDate: ['', [Validators.required, this.startDateValidator.bind(this)]],
      CampaignEndDate: ['',],
      isThrottlingEnabled: [''],
      campaignSendLimit: ['',],
      campaignSendFrequency: ['',],
      campaignSendDuration: ['',],
      HeaderStartTime: [{ hour: this.getTime, minute: this.getMinutes, second: this.getSeconds },],
      HeaderEndTime: [{ hour: this.getTime, minute: this.getMinutes, second: this.getSeconds },],
      pollingUrl: ['',],
      pollingMethod: ['',],
      pollingTimer: [{ hour: 0, minute: 0, second: 0 },],
      pollingUrlBody: ['',],
      pollingHeaders: this.formBuilder.array([this.createPollingHeaders()]),
      condition: this.formBuilder.array([this.addCondition()]),
      rule: this.formBuilder.array([this.createRule()]),
      audienceListField: ['',],
      fieldMapping: this.formBuilder.array([this.addFMCondition()])
    });

    // setTimeout(() => {
    //   console.log(this.form)
    // }, 5000);

    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        // debugger;
        // console.log(data);

        if (Object.keys(data).length > 0) {
          this.SampleCampaignExcel = JSON.parse(data["SampleCampaignExcel"]);
          this.Conditonsdata = JSON.parse(data["Conditionscampaign"]);
          // console.log(this.Conditonsdata);

          // console.log(this.SampleCampaignExcel);
          if (this.SampleCampaignExcel.length > 0) {
            let obj = {}
            this.SampleCampaignExcel.forEach(el => {
              Object.assign(obj, { [el.Key]: '' });
            });
            this.sampleExcelData = [obj];
            //console.log("helloooooo:", this.sampleExcelData);            
          }

          if (this.Conditonsdata.length > 0) {
            let obj123 = {}
            this.Conditonsdata.forEach(el => {
              Object.assign(obj123, { [el.Key]: '' });
            });
            this.Conditonsdata = [obj123];
            // console.log(this.Conditonsdata);
          }
        }
      })
    )

  }
  @ViewChild('UploadExcel', { static: false }) UploadExcel: ElementRef;
  // @ViewChild('toggleButton') toggleButton: ElementRef;
  // @ViewChild('channelsModal') channelsModal: ElementRef;

  // get formControl(): { [key: string]: AbstractControl } {
  //   return this.form.controls;
  // }

  validateKeyPress(event: KeyboardEvent): void {
    const key = event.key;
    if (key === ' ' || key === 'Spacebar') {
      event.preventDefault();
    }
  }

  isEndBeforeStart(start: NgbTimeStruct, end: NgbTimeStruct): boolean {
    if (!start || !end) {
      return false; // Invalid times, no validation error
    }

    const startTimeInSeconds = start.hour * 3600 + start.minute * 60 + start.second;
    const endTimeInSeconds = end.hour * 3600 + end.minute * 60 + end.second;

    return endTimeInSeconds < startTimeInSeconds;
  }

  get endBeforeStartError(): boolean {
    const startDate = this.form.value.CampaignStartDate;
    const endDate = this.form.value.CampaignEndDate;

    // Add Campaign ---------------------->>
    if (!this.EditCamapaignId) {
      if (startDate && endDate) {
        // Compare dates only if both start and end dates are valid
        if (endDate > startDate) {
          return false; // End date is greater, no need to compare times
        }

        // Compare times if end date is not greater
        const startDuration = this.form.value.HeaderStartTime;
        const endDuration = this.form.value.HeaderEndTime;
        return this.isEndBeforeStart(startDuration, endDuration);
      }
    }


    // Edit Campaign  ---------------------->>
    if (this.EditCamapaignId) {
      if (this.editCampaignData.campaigndetails.enddatetime && this.editCampaignData.campaigndetails.startdatetime) {

        if (startDate && endDate) {
          // Compare dates only if both start and end dates are valid
          if (endDate > startDate) {
            return false; // End date is greater, no need to compare times
          }
          const startDuration = this.form.value.HeaderStartTime;
          const endDuration = this.form.value.HeaderEndTime;
          return this.isEndBeforeStart(startDuration, endDuration);
        }

      }

      if (startDate && endDate) {
        // Compare dates only if both start and end dates are valid
        if (endDate > startDate) {
          return false; // End date is greater, no need to compare times
        }
        const startDuration = this.form.value.HeaderStartTime;
        const endDuration = this.form.value.HeaderEndTime;
        return this.isEndBeforeStart(startDuration, endDuration);
      }

    }
    return false; // Invalid dates, no validation error
  }

  StartDateAndTime: any;
  startDateValidator(control) {




    const selectedDate = new Date(control);
    if (selectedDate < this.defaultDate) {
      return { startDateError: true };
    }
    return null;
  }



  // getIsNullable(e:any){
  //   // console.log(e.checked);
  //   if(e.checked){
  //     return this.isNullableBoolean = true;
  //   }else{
  //     return this.isNullableBoolean = false;
  //   }
  // }

  // saveAudienceTableList(){  
  //   this.loader = true;
  //     let addFormArray = (this.form.get('AudienceListNameArray') as FormArray).value;
  //     // console.log(addFormArray);
  //     this.audienceFieldListNameArray=[]
  //       addFormArray.forEach((element)=>{
  //         // console.log(element);
  //          let obj =
  //           {
  //             Columnname: element.columnName,
  //             Datatype: element.dataType,
  //              maxlength: element.maxLength,
  //              isnullable: element.isNullable == true ? 1 : 0
  //            }  
  //            this.audienceFieldListNameArray.push(obj);  
  //            //console.log(this.audienceFieldListNameArray); 
  //            var Obj1 = {
  //             data: {
  //               spname: "usp_unfyd_create_update_table",
  //               parameters: {
  //                 tablename : this.form.get('AudienceListName').value,
  //                 Columnname : obj.Columnname,
  //                 Datatype : obj.Datatype,
  //                 Maxlength:obj.maxlength,
  //                 IsNull : obj.isnullable,
  //                 "Flag":"CREATE"
  //               }
  //             }
  //           }   
  //           this.api.post('pitch/index', Obj1).subscribe((res)=>{
  //                 //  console.log(res); 
  //                  if(res.code == 200){
  //                   this.loader = false;
  //                     this.common.snackbar("Save Successfully");
  //                   this.disabledBtn = true;
  //                   this.AudienceListNameSave=true;
  //                  }  
  //                 //  console.log(this.audienceFieldListNameArray);   
  //             })
  //          });  
  //     }


  // createAudienceTable(){
  //   var Obj1 = {
  //     data: {
  //       spname: "usp_unfyd_create_update_table",
  //       parameters: {
  //         tablename : this.form.get('AudienceListName').value,
  //         Columnname : "",
  //         Datatype : "",
  //         Maxlength:"",
  //         IsNull : "",
  //         "Flag":"CREATE"
  //       }
  //     }
  //   }
  //   this.api.post('pitch/index', Obj1).subscribe((res)=>{
  //         if(res){
  //            if(res.message == "Success"){
  //                  this.saveAudienceTableList();
  //            }
  //         }
  //    })
  // }

  // checkIfTableExistOrNot(){
  //   this.loader = true;
  //   let name = this.form.get('AudienceListName').value;
  //   var obj2 = {
  //     data: {
  //       spname: "CheckIfTableExists",
  //       parameters: {
  //         TableName: name
  //       }
  //     }
  //   }  
  //   this.api.post('pitch/index', obj2).subscribe((res)=>{
  //     if(res){
  //       if(res.code == 200){
  //         this.loader = false;
  //           if(res.results.data[0].Result == "Exist"){
  //               this.isTableExist = true;                  
  //           }
  //           else{
  //              this.isTableExist = false;
  //           }
  //            if(this.isTableExist == true){
  //                this.okDialog();
  //                 return false;
  //              }else{
  //               // this.createAudienceTable();
  //                 if(this.getAudienceListNames().length == 0){
  //                 this.getAudienceListNames().push(this.createAudienceListName()); 
  //                  }   
  //               } 
  //               this.showBtn = true;      
  //          }
  //       }
  //   })  
  // }

  // getAudienceListNames():FormArray{
  //   return this.form.get('AudienceListNameArray') as FormArray;
  // }

  // addAudienceColumn(){
  //   this.disabledBtn = false;

  //   let lastItem = this.getAudienceListNames().controls.length-1;
  //   let status = this.getAudienceListNames()?.controls[lastItem]['status'];
  //   //console.log(lastItem);
  //   //console.log(status);
  //    if(status == 'VALID'){
  //     // this.errorMsg = false;
  //       this.getAudienceListNames().push(this.createAudienceListName());
  //     } else {
  //     //  this.errorMsg = true;
  //     this.common.snackbar("Fill Audience List Name columns first")
  //     }
  //   // console.log(this.form.controls['AudienceListNameArray']['controls'][i]['status']);
  // }

  // removeAudienceListName(i){
  //   this.getAudienceListNames().removeAt(i);
  //   if(this.getAudienceListNames().length == 0){
  //     this.showBtn = false;
  //   }
  // }

  // createAudienceListName():FormGroup {
  //   return this.formBuilder.group({
  //     columnName: ['', Validators.required],
  //     dataType: ['', Validators.required],
  //     maxLength: ['', Validators.required],
  //     isNullable: [''],
  //   });
  // }

  // okDialog() {
  //  const dialogRef =  this.dialog.open(PitchDialogComponent, {
  //     data:{
  //      type : "confirmation"
  //     },
  //     disableClose: true,
  //     height: '25%',
  //     width: '30%'
  //   });
  // }








  //PolingHeaders FormArray
  getPollingHeaders(): FormArray {
    return this.form.get('pollingHeaders') as FormArray;
  }

  getFieldMappingFormArray(i, j): FormArray {
    // console.log(this.form['controls']['rule']['controls'][i]['controls']['RuleChannels']['controls'][j]['controls']['hsmSelected']['controls'][this.languageSelectedForRule[i][j]]['controls']['fieldMapping']['controls']);

    return this.form['controls']['rule']['controls'][i]['controls']['RuleChannels']['controls'][j]['controls']['hsmSelected']['controls'][this.languageSelectedForRule[i][j]]['controls']['fieldMapping'] as FormArray;
  }

  createPollingHeaders(): FormGroup {
    return this.formBuilder.group({
      pollingHeaderKey: ['',],
      pollingHeaderValue: ['',],
    });
  }

  addPollingHeaders() {
    this.getPollingHeaders().push(this.createPollingHeaders());
  }

  removePollingHeaders(i) {
    this.getPollingHeaders().removeAt(i);
  }



  getAndOrCondition(value) {
    //console.log('Hello :', value);
  }

  languageSelectedForRule = {}
  selectLan(value, i, j) {

    if (value.length > 0) {
      if (Object.keys(this.form.value.rule[i].RuleChannels[j].hsmSelected).length > 0) {
        // let valuesInHSMSelected = Object.keys(this.form.value.rule[i].RuleChannels[j].hsmSelected).filter(x => !value.includes(x))
        let valuesInHSMSelected = value.filter(x => !Object.keys(this.form.value.rule[i].RuleChannels[j].hsmSelected).includes(x))
        if (valuesInHSMSelected.length > 0) {
          valuesInHSMSelected.forEach(element => {
            this.getRuleChannels(i)['controls'][j]['controls']['hsmSelected'].addControl([element], this.addHSMFieldMappinngForLanguage())
          });
        }
        console.log(valuesInHSMSelected)

        let valuesInHSMSelectedButNotInLnaguage = Object.keys(this.form.value.rule[i].RuleChannels[j].hsmSelected).filter(x => !value.includes(x))
        if (valuesInHSMSelectedButNotInLnaguage.length > 0) {
          valuesInHSMSelectedButNotInLnaguage.forEach(element => {
            // this.removeHSMFieldMappinngForLanguage(i,j,element)   
            this.getRuleChannels(i)['controls'][j]['controls']['hsmSelected'].removeControl(element)
          });
        }
      } else {
        let obj = {}
        value.forEach(element => {
          Object.assign(obj, { [element]: '' })
          //this.form.controls['fieldMapping']['controls'][i]['controls']['action']['controls'][j]['controls']['hsmSelected'].addControl(element,this.formBuilder.array([]))
          this.getRuleChannels(i)['controls'][j]['controls']['hsmSelected'].addControl(element, this.addHSMFieldMappinngForLanguage())
        });
        // this.getRuleChannels(i)['controls'][j]['controls']['hsmSelected'].addControl([value[0]],this.addHSMFieldMappinngForLanguage()) 
        //this.getRuleChannels(i)['controls'][j]['controls']['hsmSelected'].addControl([value[0]],this.addHSMFieldMappinngForLanguage()) 
      }
    }

    // if(this.languageSelectedForRule.hasOwnProperty(i)){
    //   if(this.languageSelectedForRule[i].hasOwnProperty(j)){
    //     if(value.length > 0){
    //       this.languageSelectedForRule[i][j] = value[0]
    //     }
    //   } else{
    //     Object.assign(this.languageSelectedForRule[i],{[j]:value[0]})
    //   }
    // } else{
    //   Object.assign(this.languageSelectedForRule,{[i]:{}})
    //   if(value.length > 0){
    //     Object.assign(this.languageSelectedForRule[i],{[j]:value[0]})
    //   }
    // }


    if (value.length === 0) {
      const hsmSelectedFormGroup = this.getRuleChannels(i)['controls'][j]['controls']['hsmSelected'] as FormGroup;
      Object.keys(hsmSelectedFormGroup.controls).forEach(key => {
        hsmSelectedFormGroup.removeControl(key);
      });
    }

    if (this.languageSelectedForRule.hasOwnProperty(i)) {
      if (this.languageSelectedForRule[i].hasOwnProperty(j)) {
        if (value.length > 0) {
          this.languageSelectedForRule[i][j] = value[0];
        } else {
          delete this.languageSelectedForRule[i][j];
        }
      } else {
        if (value.length > 0) {
          this.languageSelectedForRule[i][j] = value[0];
        } else {
          Object.assign(this.languageSelectedForRule[i], { [j]: value[0] });
        }
      }
    } else {
      Object.assign(this.languageSelectedForRule, { [i]: {} });
      if (value.length > 0) {
        this.languageSelectedForRule[i][j] = value[0];
      } else {
        Object.assign(this.languageSelectedForRule[i], { [j]: value[0] });
      }
    }

    // console.log(this.form.value);
  }


  addHSMFieldMappinngForLanguage(): FormGroup {
    return this.formBuilder.group({
      selectedHSM: ['', [Validators.required]],
      fieldMapping: new FormArray([])
    })
  }





  addMoreCondition() {
    this.f1.push(this.addCondition())
    this.f2.push(this.addFMCondition())
  }

  get f1() { return this.form.get('condition') as FormArray }
  get f2() { return this.form.get('fieldMapping') as FormArray }
  getCondition(): FormArray {
    return this.form.get('condition') as FormArray;
  }
  getSubCondition(index): FormArray {
    return this.getCondition().at(index).get('subcondition') as FormArray;
  }
  getAction(index): FormArray {
    return this.getCondition().at(index).get('action') as FormArray;
  }
  getFMCondition(): FormArray {
    return this.form.get('fieldMapping') as FormArray;
  }
  getFMAction(index): FormArray {
    return this.getFMCondition().at(index).get('hsmSelected') as FormArray;
  }
  getfieldMapping() {
    return this.form.get('fieldMapping') as FormArray;
  }
  getfieldMappingAction(index): FormArray {
    // console.log(this.getFMCondition().at(index));
    return this.getFMCondition().at(index).get('action') as FormArray;
  }
  getfieldMappingHsmSelected(i, j): FormGroup {
    //console.log("hsmSelected:",this.getfieldMappingAction(i).at(j).get('hsmSelected'));
    return this.getfieldMappingAction(i).at(j).get('hsmSelected') as FormGroup;
  }
  getfieldMappingLanguage(i, j, language): FormArray {
    //console.log(language,":",this.getfieldMappingAction(i).at(j).get('hsmSelected').get(language));
    return this.getfieldMappingAction(i).at(j).get('hsmSelected').get(language) as FormArray;
  }
  getFMField(): FormArray {
    // console.log(this.form.controls['fieldMapping']['controls'][this.conditionIndex]['controls']['action']['controls'][this.actionIndex]['controls']['hsmSelected']['controls'][this.languageSelected]['controls']);

    return this.form.controls['fieldMapping']['controls'][this.conditionIndex]['controls']['action']['controls'][this.actionIndex]['controls']['hsmSelected']['controls'][this.languageSelected]['controls'] as FormArray;
    // return this.getFMAction(this.conditionIndex).at(this.actionIndex).get('hsmSelected').get(this.languageSelected) as FormArray
  }

  createFMAction(index) {
    this.getFMAction(index).push(this.addFMAction())
  }
  addCondition(): FormGroup {
    return this.formBuilder.group({
      conditionName: ['',],
      // Channel: ['', Validators.required],
      // ChannelSource: ['', Validators.nullValidator],
      subcondition: this.formBuilder.array([this.addSubCondition()]),
      action: this.formBuilder.array([this.addAction()])
    })
  }
  addFMCondition(): FormGroup {
    return this.formBuilder.group({
      action: this.formBuilder.array([this.addFMAction()])
    })
  }

  addFMAction(): FormGroup {
    return this.formBuilder.group({
      hsmSelected: this.formBuilder.group({}),
    })
  }

  addFMField(): FormGroup {
    return this.formBuilder.group({
      // templateField: [''],
      // attributeMappingField: ['', Validators.required],
      key: ['',],
      value: ['', [Validators.required]]

    })
  }


  addfieldMappingAction1Obj(element) {
    this.patchfieldMapping = element ? element : null;
  }
  addFieldMappingObj(i, j, language) {
    // this.form.controls['fieldMapping']['controls'][i]['controls']['action']?.['controls']?.[j]?.['controls']?.['hsmSelected']?.['controls']?.[language]?.push(this.addFMField())
    this.form.controls['rule']['controls'][i]['controls']['RuleChannels']?.['controls']?.[j]?.['controls']?.['hsmSelected']?.['controls']?.[language]?.['controls']?.['fieldMapping'].push(this.addFMField())
  }

  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  patchFieldMappingObj(i, j, language, index, val) {
    // this.form.controls['fieldMapping']['controls'][i]['controls']['action']?.['controls']?.[j]?.['controls']?.['hsmSelected']?.['controls']?.[language]?.['controls']?.[index]?.['controls']?.['templateField']?.patchValue(templateField)
    this.form.controls['rule']['controls'][i]['controls']['RuleChannels']?.['controls']?.[j]?.['controls']?.['hsmSelected']?.['controls']?.[language]?.['controls']?.['fieldMapping']['controls'][index]['controls']['key'].patchValue(val)
  }
  patchFieldMappingObjEdit(i, j, language, index, val) {
    // this.form.controls['fieldMapping']['controls'][i]['controls']['action']?.['controls']?.[j]?.['controls']?.['hsmSelected']?.['controls']?.[language]?.['controls']?.[index]?.['controls']?.['templateField']?.patchValue(templateField)
    this.form.controls['rule']['controls'][i]['controls']['RuleChannels']?.['controls']?.[j]?.['controls']?.['hsmSelected']?.['controls']?.[language]?.['controls']?.['fieldMapping']['controls'][index]['controls']['value'].patchValue(val.value)
  }


  addAction(): FormGroup {
    return this.formBuilder.group({
      channel: ['',],
      channelSource: ['', Validators.nullValidator],
      languageSelected: [[], Validators.nullValidator],
      hsmSelected: [{}, Validators.nullValidator],
    })
  }

  addSubCondition(): FormGroup {
    return this.formBuilder.group({
      field: ['',],
      subcondition: ['', Validators.nullValidator],
      conditionvalue: ['', Validators.nullValidator],
      getAndOrCondition: ['', Validators.nullValidator],
    })
  }

  campaignConditions(): FormArray {
    return this.conditionForm.get('conditions') as FormArray;
  }

  newConditon(): FormGroup {
    return this.formBuilder.group({
      ConditonNameSelected: ['', [Validators.required]],
      SelectedField: ['', [Validators.required]],
      SelectedCondition: ['', [Validators.required]],
      SelectedConditionValue: ['', [Validators.required]],
      SelectedFieldOne: ['', [Validators.required]],
      SelectedConditionOne: ['', [Validators.required]],
      SelectedConditionValueOne: ['', [Validators.required]],
      subcondition: this.formBuilder.array([]),
      action: [''],

    });
  }


  newAction(): FormGroup {
    return this.formBuilder.group({
      SelectedChannel: ['',],
      SelectedChannelSource: ['',],
      languageSelected: ['',]
    });
  }


  createAction(index) {
    //console.log(index);

    this.getAction(index).push(this.addAction());

    this.getFMAction(index)?.push(this.addFMAction());
  }
  createSubCondition(index) {
    this.getSubCondition(index).push(this.addSubCondition());
  }

  removeCondition(conditionIndex) {
    this.getCondition().removeAt(conditionIndex);
  }
  removeAction(conditionIndex, actionIndex) {
    this.getAction(conditionIndex).removeAt(actionIndex);
  }

  removeSubCondition(conditionIndex, actionIndex) {
    this.getSubCondition(conditionIndex).removeAt(actionIndex)
  }



  // Rule FormArray Start

  getRule(): FormArray {
    return this.form.get('rule') as FormArray;
  }

  createRule(): FormGroup {

    const ruleForm = this.formBuilder.group({
      ruleName: ['', [Validators.required]],
      addChannel: ['', [Validators.required]],
      RuleChannels: this.formBuilder.array([]),
      isDataFilterEnable: [false,],
      dataFilter: this.formBuilder.array([this.createDataFilter()]),
      conditionName: ['', []]
    });

    const isDataFilterEnableControl = ruleForm.get('isDataFilterEnable');
    const dataFilterControl = ruleForm.get('dataFilter') as FormArray;
    const conditionNameControl = ruleForm.get('conditionName');

    isDataFilterEnableControl.valueChanges.subscribe((value) => {
      const required = value;
      if (value) {
        // Set Validators.required on dataFilter controls
        dataFilterControl.controls.forEach((dataFilterGroup) => {
          const fieldControl = dataFilterGroup.get('field');
          const conditionControl = dataFilterGroup.get('condition');
          const dataFiltervalueControl = dataFilterGroup.get('dataFiltervalue');
          const getAndOrDataFilterControl = dataFilterGroup.get('getAndOrDataFilter');

          // Set Validators.required on individual fields
          fieldControl.setValidators([Validators.required]);
          conditionControl.setValidators([Validators.required]);
          dataFiltervalueControl.setValidators([Validators.required]);
          getAndOrDataFilterControl.setValidators([Validators.required]);

          // Update the validity of individual fields
          fieldControl.updateValueAndValidity();
          conditionControl.updateValueAndValidity();
          dataFiltervalueControl.updateValueAndValidity();
          getAndOrDataFilterControl.updateValueAndValidity();
        });

        // Set Validators.required on conditionName
        conditionNameControl.setValidators([Validators.required]);
        conditionNameControl.updateValueAndValidity();
      } else {
        // Clear Validators.required on dataFilter controls
        dataFilterControl.controls.forEach((dataFilterGroup) => {
          const fieldControl = dataFilterGroup.get('field');
          const conditionControl = dataFilterGroup.get('condition');
          const dataFiltervalueControl = dataFilterGroup.get('dataFiltervalue');
          const getAndOrDataFilterControl = dataFilterGroup.get('getAndOrDataFilter');

          // Clear Validators.required on individual fields
          fieldControl.clearValidators();
          conditionControl.clearValidators();
          dataFiltervalueControl.clearValidators();
          getAndOrDataFilterControl.clearValidators();

          fieldControl.updateValueAndValidity();
          conditionControl.updateValueAndValidity();
          dataFiltervalueControl.updateValueAndValidity();
          getAndOrDataFilterControl.updateValueAndValidity();
        });
        conditionNameControl.clearValidators();
        conditionNameControl.updateValueAndValidity();
      }
    });

    dataFilterControl.controls.forEach((control) => {
      control.clearValidators();
      control.updateValueAndValidity();
    });
    conditionNameControl.clearValidators();
    conditionNameControl.updateValueAndValidity();

    return ruleForm;
  }




  addRule() {
    let lastItem = this.getRule().controls.length - 1;
    let status = this.getRule()?.controls[lastItem]['status'];
    if (status == 'VALID') {
      this.getRule().push(this.createRule());
      this.common.snackbar(NotificationMessages.RuleAdded, 'success');
    } else {
      this.common.snackbar(NotificationMessages.RuleInvalid, 'warning');
    }
  }
  removeRule(i) {
    this.getRule().removeAt(i);
    this.common.snackbar(NotificationMessages.RuleDeleted, 'success')
  }

  getRuleChannels(i): FormArray {
    return this.getRule().at(i)?.get('RuleChannels') as FormArray;
  }
  createRuleChannels(channelId): FormGroup {
    //channelId = this.getChannelName(channelId);
    return this.formBuilder.group({
      channel: [channelId ? channelId : ''],
      //channel: [this.ChannelName?.ChannelName ? this.ChannelName?.ChannelName : '' , Validators.required],
      channelSource: ['', [Validators.required]],
      languageSelected: ['', [Validators.required]],
      //hsmSelected: new FormGroup({})
      hsmSelected: this.formBuilder.group({})
    });
  }
  // Inside your component class
  updateRuleChannels(i) {
    this.getChannelSource(this.getRule().at(i).value.addChannel);
    const selectedChannels = this.getRule().at(i).value.addChannel;
    const currentRuleChannels = this.getRuleChannels(i);

    // Find unchecked channels and remove them from the RuleChannels FormArray
    for (let j = currentRuleChannels.length - 1; j >= 0; j--) {
      const channel = currentRuleChannels.at(j).value.channel;
      if (!selectedChannels.includes(channel)) {
        currentRuleChannels.removeAt(j);
      }
    }

    // Add new channels that are checked but not in RuleChannels FormArray
    selectedChannels.forEach((element) => {
      if (!currentRuleChannels.value.some((ruleChannel) => ruleChannel.channel === element)) {
        currentRuleChannels.push(this.createRuleChannels(element));
        // this.getChannelSource(this.getRule().at(i).value.addChannel);
        // Add default English Language
        const ruleChannelsArray = this.getRule().at(i).get('RuleChannels') as FormArray;
        const lastIndex = ruleChannelsArray.length - 1;
        let language = ['en']
        this.selectLan(language, i, lastIndex);
        this.form.controls['rule']['controls'][i]['controls']['RuleChannels']?.['controls']?.[lastIndex]?.['controls']?.['languageSelected']?.patchValue(language)
      }
    });
    console.log(this.form.value);
  }

  getFullLanguageName(code) {
    let languageName = this.language.find((element) => {
      return element.LanguageCode == code
    });
    return languageName.Language
  }


  getChannelName(element) {
    let channel = this.Channel?.find((x) => {
      return x.ChannelId == element
    })
    if (channel) {
      return channel.ChannelName;
    }
    return '';
  }
  getChannelIcon(element) {
    let channel = this.Channel?.find((x) => {
      return x.ChannelId == element
    })
    if (channel) {
      return channel.ChannelIcon;
    }
    return '';
  }


  // getChannelName(element) {
  //   let value = this.Channel?.find((x) => {
  //     return x.ChannelId == element
  //     // return x.ChannelId == element
  //   })
  //   // console.log(this.Channel)
  //   // console.log(value);
  //   return value?.ChannelIcon 
  // }



  // DataFilter Start ========================================>>
  createDataFilter(required: boolean = false): FormGroup {
    return this.formBuilder.group({
      field: ['', required ? [Validators.required] : []],
      condition: ['', required ? [Validators.required] : []],
      dataFiltervalue: ['', required ? [Validators.required] : []],
      getAndOrDataFilter: ['', required ? [Validators.required] : []],
    });
  }
  getDataFilter(index): FormArray {
    return this.getRule().at(index).get('dataFilter') as FormArray;
  }

  // addDataFilter(index) {
  //   console.log('getdatafilter function', this.getDataFilter(index))
  //   let lastItem = this.getDataFilter(index).controls.length - 1;
  //   let status = this.getDataFilter(index)?.controls[lastItem]['status'];
  //   if (status == 'VALID') {
  //     this.errorMsg = false;
  //     this.getDataFilter(index).push(this.createDataFilter());
  //   } else {
  //     this.common.snackbar(NotificationMessages.DataFilterInvalid)
  //   }
  // }

  addDataFilter(index) {
    const dataFilterFormArray = this.getDataFilter(index);
    const lastItem = dataFilterFormArray.controls.length - 1;
    if (lastItem >= 0) {
      const lastItemStatus = dataFilterFormArray.controls[lastItem].status;

      if (lastItemStatus !== 'VALID') {
        this.common.snackbar(NotificationMessages.DataFilterInvalid, 'warning');
        return;
      }
    }
    this.errorMsg = false;
    dataFilterFormArray.push(this.createDataFilter(true));
  }

  removeDataFilter(RuleIndex, DataFilterIndex) {
    this.getDataFilter(RuleIndex).removeAt(DataFilterIndex);
    this.common.snackbar(NotificationMessages.DataFilterDeleted, 'success')
  }

  getAndOrDataFilter(value) {
    console.log("get and or data filter value", value)
  }

  // DataFilter End ============================================>>
  // Rule FormArray End

  getColumnValue() {
    this.temp.forEach(element => {
      this.columnValue = element;
      console.log("columnValue", this.columnValue)
    });
  }



  onTabChange(event) {
    this.tab = event;
    this.tabchange = event
    // languageSelectedForRule[i][j]
  }

  selectedStructureField(val) {
    console.log("value")
    this.structureListArr.forEach(element => {
      if (element.Id == val) {
        this.selectedStructure = JSON.parse(element.StructureJson)
        console.log(this.selectedStructure);
      }
    });
  }

  downloadSampleExcel() {
    let val = this.form.get('structureList').value;
    // console.log(val,"val");

    this.selectedStructureField(val);
    console.log(this.structureListArr);
    let findObj = this.structureListArr.find((i) => {
      return i.Id == val;
    })
    // console.log(findObj);

    let downloadSampleExcelColumns = [];
    let x = JSON.parse(findObj.StructureJson);
    console.log(x);

    let obj = {}
    x.forEach(el => {
      Object.assign(obj, { [el.FieldName]: '' });
    });
    downloadSampleExcelColumns = [obj];
    //  console.log(downloadSampleExcelColumns);
    // // this.excelService.exportExcel(downloadSampleExcelColumns, ('Pitch_Sample_Format').toUpperCase());
    this.excelService.exportExcel(downloadSampleExcelColumns, (`UNFYD_PITCH_${findObj.StructureName}`).toUpperCase());
    //  console.log(downloadSampleExcelColumns);
  }


  resetfunc() {
    this.form.reset();
    this.common.snackbar(NotificationMessages.FormReset, 'warning')
  }

  getStructureList() {
    var Obj = {
      "data": {
        "spname": "usp_unfyd_geud_structurelist",
        "parameters": {
          "flag": "GET"
        }
      }
    }
    this.api.post('pitch/index', Obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.structureListArr = res.results.data;
        this.form.controls['structureList'].patchValue(this.structureListArr[0].Id);
        // console.log(this.structureListArr); 
      }
    });
  }

  getChannel() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid,
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.Channel = res.results.data;
        this.filterSpecificChannel();
        // console.log(this.Channel); 	
      }
    });
  }
  filterSpecificChannel() {
    let filterChannelId = [34, 28, 29, 1];
    this.Channel = this.Channel.filter((x) => filterChannelId.includes(x.ChannelId));
  }

  getSenderData(channel, sourceId) {
    this.loader = true;
    let channelData = this.Channel.filter(obj => {
      if (obj.ChannelId === channel) {
        return obj;
      }
    });
    if (channelData[0].ChannelName === 'WhatsApp') {
      this.requestObj = {
        data: {
          spname: "USP_UNFYD_NOTIFICATION",
          parameters: {
            flag: 'GET_CONTACT_NUMBER',
            CHANNELSOURCE: sourceId
          }
        }
      };
      this.api.post('index', this.requestObj).subscribe(res => {
        if (res.code == 200) {
          res.results.data.forEach(element => {
            this.Sender.push({ Key: element.WhatsAppNumber, Value: element.WhatsAppNumber })
          });
          this.loader = false;
        } else this.loader = false;
      });
    } else this.loader = false;
  }

  getFields(event) {
    this.TemplateData = [];
    this.template = [];
    this.templateVisible = false;
    this.cardTemplate = [];
    this.form.get('ChannelSource').reset();
    this.form.get('Template').reset();
    this.form.updateValueAndValidity();
    // let channel = this.Channel.filter(obj => {
    //   if (obj.ChannelId === event) {
    //     return obj;
    //   }
    // });
    // if (channel[0].ChannelName === 'Email') {
    //   this.emailChannel = true;
    //   this.whatsAppChannel = false;
    // } else if (channel[0].ChannelName === 'WhatsApp') {
    //   this.whatsAppChannel = true;
    //   this.emailChannel = false;
    // } else {
    //   this.emailChannel = false;
    //   this.whatsAppChannel = false;
    // }
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
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.language = res.results.data;
        //  console.log(this.language);
        // this.form.controls['structureList'].patchValue(this.structureListArr[0].Id);
      }
    })
  }

  getCampaignType() {
    var requestObj = {
      data: {
        spname: "USP_UNFYD_GetDropdownData",
        parameters: {
          "Flag": "CAMPAIGNSCHEDULETYPES"
        }
      }
    };

    this.api.post('pitch/index', requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.campaignType = res.results.data;
        // console.log(this.campaignType);
      }
    });
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

  UploadChatIcon(event, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_webchat_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {
      this.common.snackbar("File Size");

    } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("FileReso");
          } else {
            this.loader = true;
            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                this.form.controls['chatIconUploaded'].patchValue(res.results.URL);
                this.loader = false;
              } else {
                this.loader = false;
              }
            }, error => {
              this.loader = false;
            });
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }


  UploadCampaignExcel(event) {

    this.progressValue = 0;
    // console.log(event);
    this.InitialExcelfileName.push(event.target.files[0].name)
    // console.log(this.InitialExcelfileName);
    var file = event.target.files[0];
    // var size = Math.round(file.size / 1024);
    var extension = file.type;
    // const formData = new FormData();
    var filename = this.userDetails.Id + '_Campaign_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    // formData.append(filename, file);
    //console.log("there", extension);

    // if (size > 5000) {
    //   this.common.snackbar("File Size");


    // } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
    //   this.common.snackbar("File Type");
    // } else {
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     this.excelService.importExcel(event)        
    //   };
    //   reader.readAsDataURL(file);
    // }

    let filetype = event.target.files[0].type
    if (filetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setTimeout(() => {
        this.excelService.importExcel(event)
        setTimeout(() => {
          this.temp = JSON.parse(JSON.stringify(this.excelService.getJson()));
          this.excelFileUpload.push({ name: filename, status: false, file: file, data: this.temp })
          //this.excelFileUploadName.push({name:this.InitialExcelfileName,status:false,file:file,data:this.temp})
          //console.log('test', this.excelFileUpload);
        }, 100)
      }, 100);
    }
    else {
      // this.common.snackbar('Please Upload ".xlsx" format file', 'error');
      this.common.snackbar(NotificationMessages.FileFormat, 'success');
      return
    }

    setTimeout(() => {
      this.uploadExcelFiles();
    }, 1000);

  }

  uploadExcelFiles() {
    // var file = event.target.files;
    this.progressValue = 0;

    if (this.excelFileUpload.length > 0) {
      this.excelFileUpload.forEach(element => {
        if (!element.status && element.file.type ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          const formData = new FormData();
          this.AudienceListName = this.form.get('AudienceListName').value;
          this.StructureList = this.form.get('structureList').value;
          this.excelFileName = element.name;
          var filename = element.name;
          formData.append(filename, element.file);
          formData.append('AudienceListName', this.AudienceListName);
          // for (var key of formData1.entries()) {
          //   console.log(key[0] + ', ' + key[1]);
          //   }
          // console.log(JSON.stringify(formData));
          formData.append('StructureId', this.StructureList);
          formData.append('AudienceType', 'New');

          // element.status = 'uploading'
          // console.log(formData);
          //const formDataArray = [...formData];
          // Log the array to the console
          //console.log(formDataArray);

          // this.loader = true;
          this.progressInterval = interval(300).subscribe(() => {
            this.progressValue += 25;
            if (this.progressValue >= 100) {
              this.progressInterval.unsubscribe();
            }
          });

          if (true) {
            (this.api.post('pitch/upload', formData)).subscribe((res) => {
              if (res.code == 200) {
                this.progressValue = 100;
                element.status = true;
                // console.log("vishal:", res);
                this.showThrottling = true;
                // this.loader = false;
                this.common.snackbar(NotificationMessages.ExcelUploadSucces, 'success');
                this.progressInterval.unsubscribe();
                this.getColumnValue();
              }
            },
              (error: any) => {
                // this.loader = false;
                element.status = false;
                console.log(error);
                this.common.snackbar(error.error.message, 'error');
                this.excelFileUpload.splice(-1);
                this.resetFileInput();
                this.progressValue = 0;
                this.progressInterval.unsubscribe();
              });
          }
          //)
        }
      });

    } else if (this.excelFileUpload.length == 0) {
      this.common.snackbar(NotificationMessages.MinOneExcel, 'warning');
    }
  }


  resetFileInput(): void {
    this.renderer.setProperty(this.UploadExcel.nativeElement, 'value', null);
  }

  removeExcelFileUpload(i) {
    this.excelFileUpload.splice(i, 1);
  }

  deleteExcelRow(i) {
    // const index: number = this.excelFileUpload.indexOf(i);
    // this.excelFileUpload.splice(index, i);
    this.excelFileUpload.splice(i, 1);
  }


  getChannelSource(ChannelId) {
    if (ChannelId && Array.isArray(ChannelId) && ChannelId.length > 0) {
      ChannelId.forEach(r => {
        if (!this.ChannelSource.hasOwnProperty(r) || !Array.isArray(this.ChannelSource[r]) || (Array.isArray(this.ChannelSource[r]) && this.ChannelSource[r].length == 0)) {
          this.loader = true;
          this.requestObj = {
            data: {
              spname: "USP_RULEMASTER_PROC",
              parameters: {
                flag: "CHANNELSOURCE",
                // channelid: this.form.value.rule[i]?.RuleChannels[j]?.channel,
                channelid: r,
                processid: this.userDetails.Processid
              }
            }
          };
          this.api.post('index', this.requestObj).subscribe((res: any) => {
            if (res.code == 200) {
              // console.log("Vaishag -", res);
              if (this.ChannelSource.hasOwnProperty(r)) {
                this.ChannelSource[r] = (res.results.data && res.results.data.length > 0) ? res.results.data : []
              } else {
                Object.assign(this.ChannelSource, { [r]: (res.results.data && res.results.data.length > 0) ? res.results.data : [] })
              }
              // this.ChannelSource = res.results.data;
              this.loader = false;
              // console.log("Hello There:", this.ChannelSource);
            } else this.loader = false;
          });
        }
      })
    }
  }



  getTemplate(event, i, j, channelId) {
    let obj = {
      data: {
        spname: "usp_unfyd_hsm_template",
        parameters: {
          FLAG: "GET_HSM",
          PROCESSID: this.userDetails.Processid,
          CHANNELID: channelId,
          UNIQUEID: this.form.value.rule[i].RuleChannels[j].channelSource
        }
      }
    };
    console.log(this.form.value.rule[i].RuleChannels[j].channel);

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          console.log(res.results.data);

          // res.results.data.forEach(element => {
          //   // if(Object.keys(this.templateData[this.form.value.condition[i].action[j].channel][this.form.value.condition[i].action[j].channelSource]).includes(element.Actionable)){
          //     if(!this.templateData.hasOwnProperty((this.form.value.rule[i].RuleChannels[j].channel).toString())){
          //       Object.assign(this.templateData,{[(this.form.value.rule[i].RuleChannels[j].channel).toString()]:{}})
          //     }
          //     if(!this.templateData[(this.form.value.rule[i].RuleChannels[j].channel).toString()].hasOwnProperty((this.form.value.rule[i].RuleChannels[j].channelSource).toString())){
          //       Object.assign(this.templateData[(this.form.value.rule[i].RuleChannels[j].channel).toString()],{[(this.form.value.rule[i].RuleChannels[j].channelSource).toString()]:{}})
          //     }
          //     if(!this.templateData[(this.form.value.rule[i].RuleChannels[j].channel).toString()][(this.form.value.rule[i].RuleChannels[j].channelSource).toString()].hasOwnProperty((element.Actionable).toString())){
          //       Object.assign(this.templateData[(this.form.value.rule[i].RuleChannels[j].channel).toString()][(this.form.value.rule[i].RuleChannels[j].channelSource).toString()],{[(element.Actionable).toString()]:{}})
          //     }

          //     this.templateData[this.form.value.rule[i].RuleChannels[j].channel][this.form.value.rule[i].RuleChannels[j].channelSource][element.Actionable] = element
          //   // }
          // });
        }
        // console.log("Bugatti", this.templateData);
        this.loader = false;
      } else this.loader = false;
    });
  }


  addCampaign(flag) {
    // debugger;
    // this.loader = true;
    var today = new Date();
    var dd = new Date().getDate();
    var mm = new Date().getMonth() + 1;
    var yyyy = new Date().getFullYear();
    var time = today.getHours().toString() + today.getMinutes().toString();
    var uniqueIdCampaignId = 'CAMPAIGN' + dd + mm + yyyy + time;
    //console.log("3", this.channelId);
    let obj5;
    console.log(this.form.value.targetAudienceList);

    //let StartDate = new Date(this.form.value.CampaignStartDate);
    let StartDateAndTime
    if (this.form.value.campaignTypeSelected == '1') {
      const campaignStartDate = new Date(this.form.value.CampaignStartDate);
      const formattedDate = `${campaignStartDate.getFullYear()}-${('0' + (campaignStartDate.getMonth() + 1)).slice(-2)}-${('0' + campaignStartDate.getDate()).slice(-2)}`;
      console.log(formattedDate); // Example output: "2023-08-26 00:00:00"
      const campaignStartTime = this.form.value.HeaderStartTime;
      const formattedTime = `${('0' + campaignStartTime.hour).slice(-2)}:${('0' + campaignStartTime.minute).slice(-2)}:${('0' + campaignStartTime.second).slice(-2)}`;
      console.log(formattedTime); // Example output: "19:06:50"
      StartDateAndTime = formattedDate + ' ' + formattedTime;
      console.log(formattedDate + ' ' + formattedTime);
      console.log(this.form.value.campaignTypeSelected);
    } else {
      StartDateAndTime = '';
    }


    // let StartDate = new Date(this.form.value.CampaignStartDateForSendNow);

    if (this.form.value.campaignTypeSelected == '3') {
      const campaignStartDate = new Date(this.form.value.CampaignStartDate);
      const formattedDate = `${campaignStartDate.getFullYear()}-${('0' + (campaignStartDate.getMonth() + 1)).slice(-2)}-${('0' + campaignStartDate.getDate()).slice(-2)}`;
      console.log(formattedDate); // Example output: "2023-08-26 00:00:00"
      const campaignStartTime = this.form.value.HeaderStartTime;
      const formattedTime = `${('0' + campaignStartTime.hour).slice(-2)}:${('0' + campaignStartTime.minute).slice(-2)}:${('0' + campaignStartTime.second).slice(-2)}`;
      console.log(formattedTime); // Example output: "19:06:50"
      StartDateAndTime = formattedDate + ' ' + formattedTime;
      console.log(formattedDate + ' ' + formattedTime);
      console.log(this.form.value.campaignTypeSelected);
    } else {
      if (this.form.value.campaignTypeSelected == '1') {
        const campaignStartDate = new Date(this.form.value.CampaignStartDate);
        const formattedDate = `${campaignStartDate.getFullYear()}-${('0' + (campaignStartDate.getMonth() + 1)).slice(-2)}-${('0' + campaignStartDate.getDate()).slice(-2)}`;
        console.log(formattedDate); // Example output: "2023-08-26 00:00:00"
        const campaignStartTime = this.form.value.HeaderStartTime;
        const formattedTime = `${('0' + campaignStartTime.hour).slice(-2)}:${('0' + campaignStartTime.minute).slice(-2)}:${('0' + campaignStartTime.second).slice(-2)}`;
        console.log(formattedTime); // Example output: "19:06:50"
        StartDateAndTime = formattedDate + ' ' + formattedTime;
        console.log(formattedDate + ' ' + formattedTime);
        console.log(this.form.value.campaignTypeSelected);
      }
    }


    //let StartEndDate = new Date(this.form.value.CampaignEndDate);
    const campaignEndDate = new Date(this.form.value.CampaignEndDate);
    let EndDateAndTime
    if (this.form.value.campaignTypeSelected == '2') {
      const formattedEndDate = `${campaignEndDate.getFullYear()}-${('0' + (campaignEndDate.getMonth() + 1)).slice(-2)}-${('0' + campaignEndDate.getDate()).slice(-2)}`;
      console.log(formattedEndDate); // Example output: "2023-08-26 00:00:00"
      const campaignEndTime = this.form.value.HeaderEndTime;
      const formattedEndTime = `${('0' + campaignEndTime.hour).slice(-2)}:${('0' + campaignEndTime.minute).slice(-2)}:${('0' + campaignEndTime.second).slice(-2)}`;
      console.log(formattedEndDate); // Example output: "19:06:50"
      EndDateAndTime = formattedEndDate + ' ' + formattedEndTime;
      console.log(formattedEndDate + ' ' + formattedEndTime);

      const campaignStartDate = new Date(this.form.value.CampaignStartDate);
      const formattedDate = `${campaignStartDate.getFullYear()}-${('0' + (campaignStartDate.getMonth() + 1)).slice(-2)}-${('0' + campaignStartDate.getDate()).slice(-2)}`;
      console.log(formattedDate); // Example output: "2023-08-26 00:00:00"
      const campaignStartTime = this.form.value.HeaderStartTime;
      const formattedTime = `${('0' + campaignStartTime.hour).slice(-2)}:${('0' + campaignStartTime.minute).slice(-2)}:${('0' + campaignStartTime.second).slice(-2)}`;
      console.log(formattedTime); // Example output: "19:06:50"
      StartDateAndTime = formattedDate + ' ' + formattedTime;
      console.log(formattedDate + ' ' + formattedTime);
      console.log(this.form.value.campaignTypeSelected);
    } else {
      EndDateAndTime = '';
    }

    // console.log(new Date(this.form.value.CampaignStartDate));
    if (this.form.value.targetAudienceList == 'ImportNew') {
      obj5 = {
        data: {
          "spname": "usp_unfyd_savecampaigndetails_v1",
          "parameters": {
            "json_data": {
              "campaigndetails": {
                "campaignid": uniqueIdCampaignId,
                "campaignname": this.form.value.CampaignName,
                "CampaignType": this.form.value.campaignTypeSelected,
                "description": this.form.value.CampaignDesc,
                "audienceListName": this.form.get('AudienceListName').value,
                "structureList": this.form.get('structureList').value,
                "campaignscheduletype": this.form.value.campaignTypeSelected,
                "targetaudiencetype": this.form.value.targetAudienceList,
                "startdatetime": StartDateAndTime,
                "enddatetime": EndDateAndTime ? EndDateAndTime : '',
                "isapprovalneeded": "1",
                "statusid": "2",
                "createdby": "Agent",
                "campaigncategory": "test",
                "approvalstatus": "Send For Approval",
              },
              rule: this.form.value.rule,
            }
          }
        }
      }
    }
    else if (this.form.value.targetAudienceList == 'ExistingNew') {
      obj5 = {
        data: {
          "spname": "usp_unfyd_savecampaigndetails_v1",
          "parameters": {
            "json_data": {
              "campaigndetails": {
                "campaignid": uniqueIdCampaignId,
                "campaignname": this.form.value.CampaignName,
                "CampaignType": this.form.value.campaignTypeSelected,
                "description": this.form.value.CampaignDesc,
                "CampaignTemplate": this.form.value.CampaignTemplate,
                "campaignscheduletype": this.form.value.campaignTypeSelected,
                "targetaudiencetype": this.form.value.targetAudienceList,
                "startdatetime": this.form.value.CampaignStartDate,
                "enddatetime": this.form.value.CampaignEndDate,
                "isapprovalneeded": "1",
                "statusid": "2",
                "createdby": "Agent",
                "campaigncategory": "test",
                "approvalstatus": "Send For Approval",
              },
              rule: this.form.value.rule,
            }
          }
        }
      }
    }


    // this.form.value.condition.forEach((element,i) => {
    //   let obj:any = {}   
    // });

    obj5.data.parameters.json_data.rule.forEach((r, index) => {
      delete r['addChannel']
      Object.assign(r, { ruleNumber: index + 1 })
    })

    console.log("obj5", obj5);
    // https://cx2.unfyd.com/api/hub-admin/pitch/index
    // https://cx1.unfyd.com:9443/api/hub-admin/pitch/index
    this.api.dynamicDashboard('https://cx2.unfyd.com/api/hub-admin/pitch/index', obj5).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.campaginData = res.results.data;
        this.audienceFieldListNameArray = [];
        this.form.patchValue(obj5);
        this.common.snackbar(NotificationMessages.CampaignSaveSuccess, 'success');
        console.log('oneTwoThree', this.campaginData);
        this.router.navigate([`/pitch/campaign/list`]);
        // this.router.navigateByUrl('/pitch/campaign/list');
      }
    },
      (error) => {
        this.common.snackbar("General Error", 'error');
      })
    console.log(this.form.value);
  }


  obj(arg0: string, obj: any) {
    throw new Error('Method not implemented.');
  }

  HSMvalues = {}
  callDialog(i, j, channelId, channelSRCID, language) {
    // if (type == "EnglishTemplate") {

    if (channelSRCID) {
      const dialogRef = this.dialog.open(PitchDialogComponent, {
        data: {
          type: 'hsmTemplate',
          // langCode: ,
          channelSRCID,
          channelId,
          language
        },
        width: "900px",
        height: "88vh"
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status.status) {
          // console.log("testStatus", status);
          this.createHSMObj(status, channelId, channelSRCID, language)

          if (status?.data?.['Template Name']) this.form['controls']['rule']['controls'][i]['controls']['RuleChannels']['controls'][j]['controls']['hsmSelected']['controls'][this.languageSelectedForRule[i][j]]['controls']['selectedHSM'].patchValue(status.data['Template Name'])
          // this.addFieldMapping(i,j,language)
          if (this.form.value['rule'][i]['RuleChannels'][j]['hsmSelected'][language]['fieldMapping'].length > 0) {
            this.clearFormArray(this.form.controls['rule']['controls'][i]['controls']['RuleChannels']?.['controls']?.[j]?.['controls']?.['hsmSelected']?.['controls']?.[language]?.['controls']?.['fieldMapping'])
          }
          let b = status.data['Parameter Value'].replace('^', ',')
          b.split(",").forEach((element, index) => {
            this.addFieldMappingObj(i, j, language)
            this.patchFieldMappingObj(i, j, language, index, element)
          });
          // console.log(this.form.value);
        }
      });
    } else {
      this.common.snackbar("Please Select Channel Source.", 'warning');
      this.form.get('rule').get([i]).get('RuleChannels').get([j]).get('channelSource').markAsTouched();
    }

  }


  createHSMObj(status, channelId, channelSRCID, language) {
    // console.log(this.HSMvalues);

    if (this.HSMvalues.hasOwnProperty(channelId)) {
      if (this.HSMvalues[channelId].hasOwnProperty(channelSRCID)) {
        if (this.HSMvalues[channelId][channelSRCID].hasOwnProperty(language)) {
          // this.HSMvalues[channelId][channelSRCID][status.data['Template Name']] = status.data
          // Object.assign(this.HSMvalues[channelId][channelSRCID] ,{ [language] : {}})  
          if (this.HSMvalues[channelId][channelSRCID][language].hasOwnProperty(status.data['Template Name'])) {
            // status.data['Template Name']
            this.HSMvalues[channelId][channelSRCID][language][status.data['Template Name']] = status.data
          } else {
            Object.assign(this.HSMvalues[channelId][channelSRCID][language], { [status.data['Template Name']]: status.data })
          }
        } else {
          Object.assign(this.HSMvalues[channelId][channelSRCID], { [language]: {} })
          this.createHSMObj(status, channelId, channelSRCID, language)
        }
      } else {
        Object.assign(this.HSMvalues[channelId], { [channelSRCID]: {} })
        this.createHSMObj(status, channelId, channelSRCID, language)
      }
    } else {
      Object.assign(this.HSMvalues, { [channelId]: {} })
      this.createHSMObj(status, channelId, channelSRCID, language)
    }
    // console.log(this.HSMvalues);
  }


  closeDialog(status: any): void {

  }

  // returnSRC(channel,channelSource,id){
  //   id = this.actionableId;  
  //   if(channel && channelSource && id) 
  //   return this.templateData[channel]?.[channelSource]?.[id]?.MessageHeaderValue
  // }

  addFieldMapping(i, j, language) {

  }


  visibleFieldMapping() {
    // setTimeout(() => {
    if (this.conditionIndex == undefined || this.actionIndex == undefined) { return false }
    return this.conditionIndex.toString() && this.actionIndex.toString() && this.languageSelected
    // });
  }

  getdurationlist() {
    var Obj1 = {
      data: {
        spname: "usp_unfyd_getdurationlist",
        parameters: {

        }
      }
    }

    this.api.post('pitch/index', Obj1).subscribe(res => {
      if (res.code == 200) {
        //console.log(res);
        this.sendEmailDur = res.results.data;

      }
    })
  }

  // openAudienceListDialog() {
  //   const dialogRef = this.dialog.open(PitchDialogComponent, {
  //     data: {
  //       type: "getAudienceList"
  //     },
  //     disableClose: true,
  //     height: '85%',
  //     width: '85%'
  //   });
  // }

  pageReload() {
    document.getElementById("rotating").classList.add("rotating");
    setTimeout(() => {
      window.location.reload();
      document.getElementById("rotating").classList.remove("rotating");
    }, 1000)
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  abcd() {
    alert('opened')
  }

  getAudienceList() {
    var Obj1 = {
      data: {
        spname: "usp_unfyd_getaudiencelist",
        parameters: {
        }
      }
    }
    this.api.post('pitch/index', Obj1).subscribe(res => {
      // console.log(res);  
      //this.loader = false;
      if (res.code == 200) {
        //  console.log(res.results.data); 
        this.audienceList = res.results.data;
      }
    })
  }


  callDialogForEdit(i, j, channelId, channelSRCID, selectedHSM, language, fieldMapping) {

    if (channelSRCID) {
      let obj = {
        data: {
          spname: "usp_unfyd_hsm_template",
          parameters: {
            FLAG: "GET_HSM",
            PROCESSID: this.userDetails.Processid,
            CHANNELID: channelId,
            UNIQUEID: channelSRCID
          }
        }
      };
      // console.log(this.form.value.rule[i].RuleChannels[j].channel);

      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
          console.log(fieldMapping);

          if (res.results.data.length > 0) {
            // console.log(res.results.data);
            let resData = res.results.data;
            let findObj = resData.find((i) => {
              return i['Template Name'] == selectedHSM;
            })
            // console.log(findObj)
            if (findObj) {
              // console.log("testStatus", findObj);
              this.createHSMObjForEdit(findObj, channelId, channelSRCID, language)

              if (findObj['Template Name']) this.form['controls']['rule']['controls'][i]['controls']['RuleChannels']['controls'][j]['controls']['hsmSelected']['controls'][language]['controls']['selectedHSM'].patchValue(findObj['Template Name'])
              // this.addFieldMapping(i,j,language)
              if (this.form.value['rule'][i]['RuleChannels'][j]['hsmSelected'][language]['fieldMapping'].length > 0) {
                this.clearFormArray(this.form.controls['rule']['controls'][i]['controls']['RuleChannels']?.['controls']?.[j]?.['controls']?.['hsmSelected']?.['controls']?.[language]?.['controls']?.['fieldMapping'])
              }
              let b = findObj['Parameter Value'].replace('^', ',')
              b.split(",").forEach((element, index) => {
                this.addFieldMappingObj(i, j, language)
                this.patchFieldMappingObj(i, j, language, index, element)

              });
              fieldMapping.forEach((element, index) => {
                this.patchFieldMappingObjEdit(i, j, language, index, element)
              })
              // console.log(this.form.value);
            }
          }
        }
      });
    } else {
      this.common.snackbar("Please Select Channel Source.", 'warning');
      this.form.get('rule').get([i]).get('RuleChannels').get([j]).get('channelSource').markAsTouched();
    }


  }

  createHSMObjForEdit(status, channelId, channelSRCID, language) {
    // console.log(this.HSMvalues);

    if (this.HSMvalues.hasOwnProperty(channelId)) {
      if (this.HSMvalues[channelId].hasOwnProperty(channelSRCID)) {
        if (this.HSMvalues[channelId][channelSRCID].hasOwnProperty(language)) {
          // this.HSMvalues[channelId][channelSRCID][status.data['Template Name']] = status.data
          // Object.assign(this.HSMvalues[channelId][channelSRCID] ,{ [language] : {}})  
          if (this.HSMvalues[channelId][channelSRCID][language].hasOwnProperty(status['Template Name'])) {
            // status.data['Template Name']
            this.HSMvalues[channelId][channelSRCID][language][status['Template Name']] = status
          } else {
            Object.assign(this.HSMvalues[channelId][channelSRCID][language], { [status['Template Name']]: status })
          }
        } else {
          Object.assign(this.HSMvalues[channelId][channelSRCID], { [language]: {} })
          this.createHSMObjForEdit(status, channelId, channelSRCID, language)
        }
      } else {
        Object.assign(this.HSMvalues[channelId], { [channelSRCID]: {} })
        this.createHSMObjForEdit(status, channelId, channelSRCID, language)
      }
    } else {
      Object.assign(this.HSMvalues, { [channelId]: {} })
      this.createHSMObjForEdit(status, channelId, channelSRCID, language)
    }
    // console.log(this.HSMvalues);
  }


  UploadedAudienceList = [];
  Audiencelistname: any;
  selectedStructureName: any;

  getUploadedAudienceListByCampaignId() {
    var Obj = {
      "data": {
        "spname": "usp_unfyd_getaudiencelistbycampaignid",
        "parameters": {
          "campaignid": this.EditCamapaignId
        }
      }
    }
    this.api.post('pitch/index', Obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.UploadedAudienceList = res.results.data;
        this.Audiencelistname = res.results.data[0].Audiencelistname;
        console.log(res.results.data[0].Audiencelistname);
        this.selectedStructureName = res.results.data[0].StructureId;
        console.log(this.UploadedAudienceList);
        console.log(JSON.parse(res.results.data[0].StructureJson))
        const data = JSON.parse(res.results.data[0].StructureJson)
        const revObj = data.map(item => item.FieldName)

        //reverse array------
        function reverseArrayKeysAndValues(revObj: any[]) {
          const reversedArray = [];
          revObj.forEach((value, key) => {
            reversedArray[value] = key;
          });
          return reversedArray;
        }

        // Call the function to get the reversed array
        const reversedArray = reverseArrayKeysAndValues(revObj);

        this.columnValue = reversedArray;
        // Output the reversed array
        console.log(reversedArray);
      }
    });
  }



  editCampaignDataFunction() {
    var Obj = {
      "data": {
        "spname": "usp_unfyd_getCampaigndetailsToEdit",
        "parameters": {
          "campaignid": this.EditCamapaignId
        }
      }
    }
    this.api.post('pitch/index', Obj).subscribe(res => {
      if (res.code == 200) {
        //  console.log(res.results.data); 
        this.editCampaignData = JSON.parse(res.results.data[0].CampaignJson);
        console.log(this.editCampaignData);
        this.patchCampaignData(this.editCampaignData);
      }
    })
  }

  patchCampaignData(editCampaignData) {
    let startTime = new Date(editCampaignData.campaigndetails.startdatetime);
    let endTime = new Date(editCampaignData.campaigndetails.enddatetime);
    let editstartTime = { hour: startTime.getHours(), minute: startTime.getMinutes(), second: startTime.getSeconds() };
    let editEndTime = { hour: endTime.getHours(), minute: endTime.getMinutes(), second: endTime.getSeconds() };
    // this.getUploadedAudienceListByCampaignId();

    if (editCampaignData) {
      this.form.patchValue({
        CampaignName: editCampaignData.campaigndetails.campaignname,
        CampaignDesc: editCampaignData.campaigndetails.description,
        campaignTypeSelected: editCampaignData.campaigndetails.CampaignType,
        AudienceListName: editCampaignData.campaigndetails.audienceListName,
        structureList: editCampaignData.campaigndetails.structureList,
        CampaignStartDate: editCampaignData.campaigndetails.startdatetime,
        CampaignEndDate: editCampaignData.campaigndetails.enddatetime,
        HeaderStartTime: editstartTime,
        HeaderEndTime: editEndTime,
      });
      // if(editCampaignData.campaigndetails.enddatetime == ''){
      //   let defaultDate = new Date();
      //   console.log(editstartTime)
      //   this.form.patchValue({
      //     CampaignEndDate: editCampaignData.campaigndetails.startdatetime,
      //     HeaderEndTime: editstartTime
      //     // HeaderEndTime: editstartTime.setHours(editstartTime.getHours() + 1)
      //   })
      //   console.log(editEndTime)
      //   console.log(editCampaignData.campaigndetails.startdatetime)
      // }

      // Patch 'rule' array
      if (editCampaignData.rule && editCampaignData.rule.length > 0) {
        const ruleFormArray = this.form.get('rule') as FormArray;
        editCampaignData.rule.forEach((ruleItem, index) => {
          if (index > 0) {
            ruleFormArray.push(this.createRule());
          }
          ruleFormArray.at(index).patchValue({
            ruleName: ruleItem.ruleName,
            addChannel: ruleItem.RuleChannels.map(channelItem => channelItem.channel),
          });

          // Patch 'RuleChannels' array
          this.getChannelSource(this.getRule().at(index).value.addChannel);
          if (ruleItem.RuleChannels && ruleItem.RuleChannels.length > 0) {
            const ruleChannelsFormArray = ruleFormArray.at(index).get('RuleChannels') as FormArray;
            ruleItem.RuleChannels.forEach((ruleChannelItem, j) => {
              ruleChannelsFormArray.push(this.createRuleChannels(ruleChannelItem.channel));
              // console.log(ruleChannelItem.channelSource);
              if (ruleChannelsFormArray.length > 0) {
                const lastRuleChannel = ruleChannelsFormArray.at(ruleChannelsFormArray.length - 1);
                if (lastRuleChannel) {
                  lastRuleChannel.patchValue({
                    channelSource: ruleChannelItem.channelSource,
                    languageSelected: ruleChannelItem.languageSelected,
                    // languageSelected: ruleChannelItem.hsmSelected.language,
                  });
                  this.selectLan(ruleChannelItem.languageSelected, index, j);


                  let channelId = ruleChannelItem.channel
                  let channelSRCID = ruleChannelItem.channelSource
                  ruleChannelItem.languageSelected.forEach((language) => {
                    // Get the selectedHSM for the current language
                    const selectedHSM = ruleChannelItem.hsmSelected[language]?.selectedHSM;
                    const fieldMapping = ruleChannelItem.hsmSelected[language]?.fieldMapping;
                    if (selectedHSM) {

                      // Call the dialog for each language
                      this.callDialogForEdit(index, j, channelId, channelSRCID, selectedHSM, language, fieldMapping);
                    }
                  });
                  //     let selectedHSM = ruleChannelItem.hsmSelected[ruleChannelItem.languageSelected[index]].fieldMapping[index].key
                  // console.log(ruleChannelItem)
                  // let lang = ruleChannelItem.languageSelected[index]
                  // let channelId = ruleChannelItem.channel
                  // console.log(channelId)
                  // let channelSRCID = ruleChannelItem.channelSource
                  // // console.log(ruleChannelItem.hsmSelected.ruleChannelItem.languageSelected)
                  // this.callDialogForEdit(index, j, channelId, channelSRCID,selectedHSM,lang);



                  // Patch 'fieldMapping' array for each language
                  // for (const language of ruleChannelItem.languageSelected) {
                  //   if (
                  //     ruleChannelItem.hsmSelected[language]?.fieldMapping?.length > 0
                  //   ) {
                  //     const fieldMappingFormArray = lastRuleChannel
                  //       .get('hsmSelected')
                  //       .get(language)
                  //       .get('fieldMapping') as FormArray;
                  //     fieldMappingFormArray.clear(); // Clear existing field mappings

                  //     ruleChannelItem.hsmSelected[language].fieldMapping.forEach(
                  //       (fieldMappingItem) => {
                  //         fieldMappingFormArray.push(
                  //           this.formBuilder.group({
                  //             key: fieldMappingItem.key,
                  //             value: fieldMappingItem.value,
                  //           })
                  //         );
                  //       }
                  //     );
                  //   }
                  // }



                }
              }
            });
          }

          // Patch 'isDataFilterEnable' property          
          // ...
          ruleFormArray.at(index).patchValue({
            isDataFilterEnable: ruleItem.isDataFilterEnable,
          });
          // Patch 'dataFilter' array
          if (ruleItem.dataFilter && ruleItem.dataFilter.length > 0) {
            this.getUploadedAudienceListByCampaignId();
            const dataFilterFormArray = ruleFormArray.at(index).get('dataFilter') as FormArray;
            dataFilterFormArray.removeAt(0); // Clear existing data filters
            ruleItem.dataFilter.forEach((dataFilterItem) => {
              dataFilterFormArray.push(
                this.formBuilder.group({
                  field: dataFilterItem.field,
                  condition: dataFilterItem.condition,
                  dataFiltervalue: dataFilterItem.dataFiltervalue,
                  getAndOrDataFilter: dataFilterItem.getAndOrDataFilter,
                })
              );
            });
          }
          // Patch 'conditionName' property
          ruleFormArray.at(index).patchValue({
            conditionName: ruleItem.conditionName,
          });
        });
      }
    }
  }





  Time(): number {
    const now = new Date();
    return now.getHours();
  }
  Minutes(): number {
    const now = new Date();
    return now.getMinutes();
  }
  Seconds(): number {
    const now = new Date();
    return now.getSeconds();
  }
  onSelectedTypeOptionChange() {
    if (this.EditCamapaignId && this.selectedTypeOption === 2) {
      // Set HeaderEndTime to the current time
      this.form.get('HeaderEndTime').setValue({
        hour: this.getTime,
        minute: this.getMinutes,
        second: this.getSeconds
      });
      this.form.get('CampaignStartDate').valueChanges.subscribe((startDate) => {
        // Automatically set the end date when the start date changes
        // You can set it to the same value or perform any logic here
        this.form.get('CampaignEndDate').setValue(startDate);
      });
      const startDate = this.form.value.CampaignStartDate;
      const endDate = this.form.value.CampaignEndDate;

      if (startDate && endDate) {
        // Compare dates only if both start and end dates are valid
        if (endDate > startDate) {
          return false; // End date is greater, no need to compare times
        }

        // Compare times if end date is not greater
        const startDuration = this.form.value.HeaderStartTime;
        const endDuration = this.form.value.HeaderEndTime;
        return this.isEndBeforeStart(startDuration, endDuration);
      }

      return false; // Invalid dates, no validation error
    }

  }

  updateCampaign(flag) {
    // debugger;
    // this.loader = true;
    var today = new Date();
    var dd = new Date().getDate();
    var mm = new Date().getMonth() + 1;
    var yyyy = new Date().getFullYear();
    var time = today.getHours().toString() + today.getMinutes().toString();
    var uniqueIdCampaignId = 'CAMPAIGN' + dd + mm + yyyy + time;
    //console.log("3", this.channelId);
    let obj5;
    console.log(this.form.value.targetAudienceList);

    //let StartDate = new Date(this.form.value.CampaignStartDate);
    let StartDateAndTime
    if (this.form.value.campaignTypeSelected == '1') {
      const campaignStartDate = new Date(this.form.value.CampaignStartDate);
      const formattedDate = `${campaignStartDate.getFullYear()}-${('0' + (campaignStartDate.getMonth() + 1)).slice(-2)}-${('0' + campaignStartDate.getDate()).slice(-2)}`;
      console.log(formattedDate); // Example output: "2023-08-26 00:00:00"
      const campaignStartTime = this.form.value.HeaderStartTime;
      const formattedTime = `${('0' + campaignStartTime.hour).slice(-2)}:${('0' + campaignStartTime.minute).slice(-2)}:${('0' + campaignStartTime.second).slice(-2)}`;
      console.log(formattedTime); // Example output: "19:06:50"
      StartDateAndTime = formattedDate + ' ' + formattedTime;
      console.log(formattedDate + ' ' + formattedTime);
      console.log(this.form.value.campaignTypeSelected);
    } else {
      StartDateAndTime = ''
    }


    // let StartDate = new Date(this.form.value.CampaignStartDateForSendNow);

    if (this.form.value.campaignTypeSelected == '3') {
      const campaignStartDate = new Date(this.form.value.CampaignStartDate);
      const formattedDate = `${campaignStartDate.getFullYear()}-${('0' + (campaignStartDate.getMonth() + 1)).slice(-2)}-${('0' + campaignStartDate.getDate()).slice(-2)}`;
      console.log(formattedDate); // Example output: "2023-08-26 00:00:00"
      const campaignStartTime = this.form.value.HeaderStartTime;
      const formattedTime = `${('0' + campaignStartTime.hour).slice(-2)}:${('0' + campaignStartTime.minute).slice(-2)}:${('0' + campaignStartTime.second).slice(-2)}`;
      console.log(formattedTime); // Example output: "19:06:50"
      StartDateAndTime = formattedDate + ' ' + formattedTime;
      console.log(formattedDate + ' ' + formattedTime);
      console.log(this.form.value.campaignTypeSelected);
    } else {
      if (this.form.value.campaignTypeSelected == '1') {
        const campaignStartDate = new Date(this.form.value.CampaignStartDate);
        const formattedDate = `${campaignStartDate.getFullYear()}-${('0' + (campaignStartDate.getMonth() + 1)).slice(-2)}-${('0' + campaignStartDate.getDate()).slice(-2)}`;
        console.log(formattedDate); // Example output: "2023-08-26 00:00:00"
        const campaignStartTime = this.form.value.HeaderStartTime;
        const formattedTime = `${('0' + campaignStartTime.hour).slice(-2)}:${('0' + campaignStartTime.minute).slice(-2)}:${('0' + campaignStartTime.second).slice(-2)}`;
        console.log(formattedTime); // Example output: "19:06:50"
        StartDateAndTime = formattedDate + ' ' + formattedTime;
        console.log(formattedDate + ' ' + formattedTime);
        console.log(this.form.value.campaignTypeSelected);
      }
    }


    //let StartEndDate = new Date(this.form.value.CampaignEndDate);
    const campaignEndDate = new Date(this.form.value.CampaignEndDate);
    let EndDateAndTime
    if (this.form.value.campaignTypeSelected == '2') {
      const formattedEndDate = `${campaignEndDate.getFullYear()}-${('0' + (campaignEndDate.getMonth() + 1)).slice(-2)}-${('0' + campaignEndDate.getDate()).slice(-2)}`;
      console.log(formattedEndDate); // Example output: "2023-08-26 00:00:00"
      const campaignEndTime = this.form.value.HeaderEndTime;
      const formattedEndTime = `${('0' + campaignEndTime.hour).slice(-2)}:${('0' + campaignEndTime.minute).slice(-2)}:${('0' + campaignEndTime.second).slice(-2)}`;
      console.log(formattedEndDate); // Example output: "19:06:50"
      EndDateAndTime = formattedEndDate + ' ' + formattedEndTime;
      console.log(formattedEndDate + ' ' + formattedEndTime);

      const campaignStartDate = new Date(this.form.value.CampaignStartDate);
      const formattedDate = `${campaignStartDate.getFullYear()}-${('0' + (campaignStartDate.getMonth() + 1)).slice(-2)}-${('0' + campaignStartDate.getDate()).slice(-2)}`;
      console.log(formattedDate); // Example output: "2023-08-26 00:00:00"
      const campaignStartTime = this.form.value.HeaderStartTime;
      const formattedTime = `${('0' + campaignStartTime.hour).slice(-2)}:${('0' + campaignStartTime.minute).slice(-2)}:${('0' + campaignStartTime.second).slice(-2)}`;
      console.log(formattedTime); // Example output: "19:06:50"
      StartDateAndTime = formattedDate + ' ' + formattedTime;
      console.log(formattedDate + ' ' + formattedTime);
      console.log(this.form.value.campaignTypeSelected);
    } else {
      EndDateAndTime = '';
    }

    // console.log(new Date(this.form.value.CampaignStartDate));
    if (this.form.value.targetAudienceList == 'ImportNew') {
      obj5 = {
        data: {
          "spname": "usp_unfyd_updatecampaigndetails_v1",
          "parameters": {
            "json_data": {
              "campaigndetails": {
                "campaignid": uniqueIdCampaignId,
                "campaignname": this.form.value.CampaignName,
                "CampaignType": this.form.value.campaignTypeSelected,
                "description": this.form.value.CampaignDesc,
                "audienceListName": this.form.get('AudienceListName').value,
                "structureList": this.form.get('structureList').value,
                "campaignscheduletype": this.form.value.campaignTypeSelected,
                "targetaudiencetype": this.form.value.targetAudienceList,
                "startdatetime": StartDateAndTime,
                "enddatetime": EndDateAndTime ? EndDateAndTime : '',
                "isapprovalneeded": "1",
                "statusid": "2",
                "createdby": "Agent",
                "campaigncategory": "test",
                "approvalstatus": "Send For Approval",
              },
              rule: this.form.value.rule,
            }
          }
        }
      }
    }
    else if (this.form.value.targetAudienceList == 'ExistingNew') {
      obj5 = {
        data: {
          "spname": "usp_unfyd_updatecampaigndetails_v1",
          "parameters": {
            "json_data": {
              "campaigndetails": {
                "campaignid": uniqueIdCampaignId,
                "campaignname": this.form.value.CampaignName,
                "CampaignType": this.form.value.campaignTypeSelected,
                "description": this.form.value.CampaignDesc,
                "CampaignTemplate": this.form.value.CampaignTemplate,
                "campaignscheduletype": this.form.value.campaignTypeSelected,
                "targetaudiencetype": this.form.value.targetAudienceList,
                "startdatetime": this.form.value.CampaignStartDate,
                "enddatetime": this.form.value.CampaignEndDate,
                "isapprovalneeded": "1",
                "statusid": "2",
                "createdby": "Agent",
                "campaigncategory": "test",
                "approvalstatus": "Send For Approval",
              },
              rule: this.form.value.rule,
            }
          }
        }
      }
    }


    // this.form.value.condition.forEach((element,i) => {
    //   let obj:any = {}   
    // });

    obj5.data.parameters.json_data.rule.forEach((r, index) => {
      delete r['addChannel']
      Object.assign(r, { ruleNumber: index + 1 })
    })

    console.log("obj5", obj5);
    // https://cx2.unfyd.com/api/hub-admin/pitch/index
    // https://cx1.unfyd.com:9443/api/hub-admin/pitch/index
    this.api.dynamicDashboard('https://cx2.unfyd.com/api/hub-admin/pitch/index', obj5).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.campaginData = res.results.data;
        this.audienceFieldListNameArray = [];
        this.form.patchValue(obj5);
        this.common.snackbar(NotificationMessages.CampaignSaveSuccess, 'success');
        console.log('oneTwoThree', this.campaginData);
        this.router.navigate([`/pitch/campaign/list`]);
        // this.router.navigateByUrl('/pitch/campaign/list');
      }
    },
      (error) => {
        this.common.snackbar("General Error", 'error');
      })
    console.log(this.form.value);
  }


  isColumnValueEmpty() {
    if (!this.EditCamapaignId) {
      if (this.columnValue.length < 1) {
        this.common.snackbar('Please Upload Excel File', 'warning');
      }
    }
  }




  ngOnDestroy(): void {

  }







}
