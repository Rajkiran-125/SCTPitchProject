import { Clipboard } from '@angular/cdk/clipboard';
import { AuthService } from './../../global/auth.service';
import { orderBy } from 'lodash';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, EventEmitter, OnInit, OnChanges, SimpleChange, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable, Subject, Subscription } from "rxjs";
import { WebcamImage } from "ngx-webcam";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, addAlert, userFormSteps, regex, apiInvalid, paymentCollection, ConfirmedValidator, checknull, validateregex, channelConfigurationIcons, checknull1,emptySpace, max5Character } from 'src/app/global/json-data';
import html2canvas from "html2canvas"
import jsPDF from 'jspdf';
import { CurrencyPipe } from '@angular/common';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
import { ActivatedRoute, Router } from '@angular/router';
import { FilterModule } from '../filter/filter.module';
import { ExcelService } from 'src/app/global/excel.service';
import { checkDates, unfydMaster, } from "src/app/global/json-data";
import { EChartsOption } from 'echarts';
import { a } from 'src/app/pages/masters/form-creation/form-preview/form-preview.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { ThisReceiver } from '@angular/compiler';
import { throws } from 'assert';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export class noSpaceValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string)?.indexOf(' ') === 0) {
      return { cannotContainSpace: true }
    }

    return null;
  }
}

export interface addDashboardTile {
  api: any,
  apiRequest: any,

  visible: any,

  reloadTimeEnable: any,
  reloadTime: any,
  reloadTimeType: any,

  countApi: any,
  countRequest: any,

  mainPlaceHolder: boolean,
  mainPlaceHolderApi: any,
  mainPlaceHolderRequest: any,
  mainPlaceHolderHeader: any,
  mainPlaceHolderKey: any,

  backgroundColor: any,

  subPlaceHolder1: boolean,
  subPlaceHolder1Api: any,
  subPlaceHolder1Request: any,
  subPlaceHolder1Header: any,
  subPlaceHolder1Key: any,

  subPlaceHolder2: boolean,
  subPlaceHolder2Api: any,
  subPlaceHolder2Request: any,
  subPlaceHolder2Header: any,
  subPlaceHolder2Key: any,

  subPlaceHolder3: boolean,
  subPlaceHolder3Api: any,
  subPlaceHolder3Request: any,
  subPlaceHolder3SelectedValue: any,
  subPlaceHolder3Header: any,
  subPlaceHolder3Key: any
}
export interface addDashboardCardGraphAndChart {
  dashboardControlTypeSelected: any,
  visible: boolean,

  api: any,
  apiRequest: any,

  dataApi: any,
  dataRequest: any,

  showDateChangePart: any,

  reloadTimeEnable: any,
  reloadTime: any,
  reloadTimeType:any

  chartAndGraph: any,
  header: any,
  dateFilter: Array<any>,
  displayDateFilter: any,
  displayInnerTextDoughnut: any,

  gaugePercentCount: any,
  gaugePercentCountDataKey: any,
  gaugePercentCountAPI: any,
  gaugePercentCountAPIRequest: any,
  gaugePercentCountText: any,
  gaugePercentColor: any,
  textBelowGaugeCount: any,
  textBelowGaugeCountText: any,
  textBelowGaugeCountTextAPI: any,
  textBelowGaugeCountTextAPIRequest: any,
  textBelowGaugeColor: any,

  sectionBelowBarChartIconOnTop: any,
  sectionBelowBarChartIconOnTopLeftText: any,
  sectionBelowBarChartIconOnTopLeftApi: any,
  sectionBelowBarChartIconOnTopLeftApiRequest: any,
  sectionBelowBarChartIconOnTopRightText: any,
  sectionBelowBarChartIconOnTopRightApi: any,
  sectionBelowBarChartIconOnTopRightApiRequest: any,

  displayListHeader: any,
  customFilter: any,
  customFilterValues: Array<any>,


  maxLicenseAllowed: any,
  maxLicenseAllowedLineColor: any,
  maxlicensedUsed: any,
  maxlicensedUsedRequest: any,
  maxlicensedUsedTime: any,
  maxlicensedUsedTimeRequest: any,



  innerTextDoughnut: any,
  showSum: any,
  hideLegend: any,
  blocks: Array<any>
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, deps: [CommonService], useFactory: (common: CommonService) => {
        let a: any = {
          parse: {
            dateInput: 'DD/MM/YYYY',
          },
          display: {
            dateInput: 'dddd/MMM/YYYY',
            monthYearLabel: 'MMMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY'
          }
        };


        common.localizationInfo$.subscribe((res1) => {
          a.display.dateInput = res1.selectedDateFormats.toUpperCase()
        })
        common.localizationDataAvailable$.subscribe((res) => {
          if (res) {
            common.localizationInfo$.subscribe((res1) => {
              a.display.dateInput = res1.selectedDateFormats.toUpperCase()
            })
          }
        })
        return a
      }
    }
  ]
})
export class DialogComponent implements OnInit, OnChanges {
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
  taskGroupInfo:any
  dummyTaskGroupFields = []
  languageSelected = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en'
  channelSelected = localStorage.getItem('userChannelName') ? (JSON.parse((localStorage.getItem('userChannelName'))) ? JSON.parse((localStorage.getItem('userChannelName')))[0].ChannelId : 1) : 1
  config = { fields: {} }
  operators = ['==', '<=', '>=','<','>','!=']
  token = localStorage.getItem('authtoken') ? localStorage.getItem('authtoken') : ''
  reloadDurationDropdown = [{Key:'sec',Value:'Sec'},{Key:'min',Value:'Min'}]
  SLAType = []
  SlaRequestType = []
  passwordPolicyapi: any;
  confirmPasswordError: any;
  channelConfigurationIcons: any = []
  test: boolean = true
  AllIcons: any = [];
  date = new FormControl(moment());
  allFormControl: any = [];
  formFields = [{ "label": "name", "formControlName": null, "type": null, "mandatory": null, "regularExpression": null, "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], checkValidation: false, checkValidationFormControls:[] }];
  @Input() item1 = [];
  itemCopy = [];
  parentDropDown = [];
  dateFormats = []
  editwts: boolean = false;
  JSONField: boolean;
  TextField: boolean;
  selectedValue: any;
  configName: any;
  WebchatName: any;
  displayedColumns: string[] = ["Key", "Value"];
  displayedFields: string[] = this.displayedColumns.slice();
  Localizationdateformat:any;
  localizationformat:any;
  myformArray: any = new FormArray([
    new FormGroup({
      Key: new FormControl('',[noSpaceValidator.cannotContainSpace,Validators.pattern(regex.jsonarray),Validators.required]),
      Value: new FormControl('',[noSpaceValidator.cannotContainSpace,Validators.pattern(regex.jsonarray),Validators.required]),
    }),
  ]);
  // jsonarray == accepts dot,underscore,colom,hyphen
  control: any;
  disabledValue: boolean;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  dashboardControlType = []
  colorPalette = this.common.colorArray.concat(this.common.colorArray)

  dashboardControlTypeSelected: any = 'Tile';
  subPlaceHolder3Values = [
    { Key: 'lineChart', Value: 'Line Chart' },
    { Key: 'gaugeChart', Value: 'Gauge Chart' },
    { Key: 'time', Value: 'Time' }
  ]

  routeto: any = [
    { Key: 'agent', Value: 'Agent' },
    { Key: 'skill', Value: 'Skill' },
    { Key: 'group', Value: 'Group' },
    { Key: 'custom', Value: 'Custom' },
    { Key: 'primaryskill', Value: 'PrimarySkill' },
    { Key: 'secondaryskill', Value: 'SecondarySkill' },
    { Key: 'groupskill', Value: 'GroupSkill' },
    { Key: 'productskill', Value: 'ProductSkill' },
    { Key: 'rmbased', Value: 'Rm Based' }
  ]
  options1: EChartsOption = {};
  tile: addDashboardTile = {
    api: null,
    apiRequest: null,
    visible: true,
    reloadTimeEnable: false,
    reloadTime: 10,
    reloadTimeType:'sec',
    countApi: null,
    countRequest: null,
    mainPlaceHolder: true,
    mainPlaceHolderApi: null,
    mainPlaceHolderRequest: null,
    mainPlaceHolderHeader: null,
    mainPlaceHolderKey: null,

    backgroundColor: 'blue',

    subPlaceHolder1: true,
    subPlaceHolder1Api: null,
    subPlaceHolder1Request: null,
    subPlaceHolder1Header: null,
    subPlaceHolder1Key: null,

    subPlaceHolder2: true,
    subPlaceHolder2Api: null,
    subPlaceHolder2Request: null,
    subPlaceHolder2Header: null,
    subPlaceHolder2Key: null,

    subPlaceHolder3: true,
    subPlaceHolder3Api: null,
    subPlaceHolder3Request: null,
    subPlaceHolder3SelectedValue: null,
    subPlaceHolder3Header: null,
    subPlaceHolder3Key: null
  }
  dummyTile: addDashboardTile = {
    api: this.tile.api,
    apiRequest: this.tile.apiRequest,
    visible: this.tile.visible,
    reloadTimeEnable: this.tile.reloadTimeEnable,
    reloadTime: this.tile.reloadTime,
    reloadTimeType:this.tile.reloadTimeType,
    countApi: this.tile.countApi,
    countRequest: this.tile.countRequest,
    mainPlaceHolder: this.tile.mainPlaceHolder,
    mainPlaceHolderApi: this.tile.mainPlaceHolderApi,
    mainPlaceHolderRequest: this.tile.mainPlaceHolderRequest,
    mainPlaceHolderHeader: this.tile.mainPlaceHolderHeader,
    mainPlaceHolderKey: this.tile.mainPlaceHolderKey,

    backgroundColor: this.tile.backgroundColor,

    subPlaceHolder1: this.tile.subPlaceHolder1,
    subPlaceHolder1Api: this.tile.subPlaceHolder1Api,
    subPlaceHolder1Request: this.tile.subPlaceHolder1Request,
    subPlaceHolder1Header: this.tile.subPlaceHolder1Header,
    subPlaceHolder1Key: this.tile.subPlaceHolder1Key,

    subPlaceHolder2: this.tile.subPlaceHolder2,
    subPlaceHolder2Api: this.tile.subPlaceHolder2Api,
    subPlaceHolder2Request: this.tile.subPlaceHolder2Request,
    subPlaceHolder2Header: this.tile.subPlaceHolder2Header,
    subPlaceHolder2Key: this.tile.subPlaceHolder2Key,

    subPlaceHolder3: this.tile.subPlaceHolder3,
    subPlaceHolder3Api: this.tile.subPlaceHolder3Api,
    subPlaceHolder3Request: this.tile.subPlaceHolder3Request,
    subPlaceHolder3SelectedValue: this.tile.subPlaceHolder3SelectedValue,
    subPlaceHolder3Header: this.tile.subPlaceHolder3Header,
    subPlaceHolder3Key: this.tile.subPlaceHolder3Key
  }
  chartandGraphDropdown: any = []
  dateFilterDropdown: any = []
  chartandGraph: addDashboardCardGraphAndChart = {
    dashboardControlTypeSelected: 'List',
    visible: true,

    api: null,
    apiRequest: null,

    dataApi: null,
    dataRequest: null,

    showDateChangePart: true,

    reloadTimeEnable: false,
        reloadTime: 10,
    reloadTimeType:'sec',

    chartAndGraph: null,
    header: null,
    dateFilter: null,
    displayDateFilter: false,

    displayListHeader: false,
    customFilter: false,
    customFilterValues: [{
      customFilterField: ''
    }],

    gaugePercentCount: false,
    gaugePercentCountDataKey: null,
    gaugePercentCountAPI: null,
    gaugePercentCountAPIRequest: null,
    gaugePercentCountText: null,
    gaugePercentColor: this.common.colorArray[0],

    textBelowGaugeCount: false,
    textBelowGaugeCountText: null,
    textBelowGaugeCountTextAPI: null,
    textBelowGaugeCountTextAPIRequest: null,
    textBelowGaugeColor: this.common.colorArray[0],

    sectionBelowBarChartIconOnTop: false,
    sectionBelowBarChartIconOnTopLeftText: null,
    sectionBelowBarChartIconOnTopLeftApi: null,
    sectionBelowBarChartIconOnTopLeftApiRequest: null,
    sectionBelowBarChartIconOnTopRightText: null,
    sectionBelowBarChartIconOnTopRightApi: null,
    sectionBelowBarChartIconOnTopRightApiRequest: null,

    maxLicenseAllowed: null,
    maxLicenseAllowedLineColor: this.common.colorArray[0],
    maxlicensedUsed: null,
    maxlicensedUsedRequest: null,
    maxlicensedUsedTime: null,
    maxlicensedUsedTimeRequest: null,

    displayInnerTextDoughnut: false,
    innerTextDoughnut: 'Total',
    showSum: false,

    hideLegend: null,
    blocks: [
      {
        header: null,
        key: null,
        visible: true,
        api: null,
        request: null,
        backgroundColor: this.colorPalette[0],
        selectedIcon: null,
        selectedIconColor: 'blue',
        columnWidth: 1,
        displayType: 'text'
      }
    ]
  };

  dummyChartandGraph: addDashboardCardGraphAndChart = {
    dashboardControlTypeSelected: this.chartandGraph.dashboardControlTypeSelected,
    visible: this.chartandGraph.visible,
    api: this.chartandGraph.api,
    apiRequest: this.chartandGraph.apiRequest,
    dataApi: this.chartandGraph.dataApi,
    dataRequest: this.chartandGraph.dataRequest,
    showDateChangePart: this.chartandGraph.showDateChangePart,
    reloadTimeEnable: this.chartandGraph.reloadTimeEnable,
    reloadTime: this.chartandGraph.reloadTime,
    reloadTimeType:this.chartandGraph.reloadTimeType,
    chartAndGraph: this.chartandGraph.chartAndGraph,
    header: this.chartandGraph.header,
    dateFilter: this.chartandGraph.dateFilter,
    displayDateFilter: this.chartandGraph.displayDateFilter,
    displayInnerTextDoughnut: this.chartandGraph.displayInnerTextDoughnut,

    displayListHeader: this.chartandGraph.displayListHeader,
    customFilter: this.chartandGraph.customFilter,
    customFilterValues: this.chartandGraph.customFilterValues,

    gaugePercentCount: this.chartandGraph.gaugePercentCount,
    gaugePercentCountDataKey: this.chartandGraph.gaugePercentCountDataKey,
    gaugePercentCountAPI: this.chartandGraph.gaugePercentCountAPI,
    gaugePercentCountAPIRequest: this.chartandGraph.gaugePercentCountAPIRequest,
    gaugePercentCountText: this.chartandGraph.gaugePercentCountText,
    gaugePercentColor: this.chartandGraph.gaugePercentColor,
    textBelowGaugeCount: this.chartandGraph.textBelowGaugeCount,
    textBelowGaugeCountText: this.chartandGraph.textBelowGaugeCountText,
    textBelowGaugeCountTextAPI: this.chartandGraph.textBelowGaugeCountTextAPI,
    textBelowGaugeCountTextAPIRequest: this.chartandGraph.textBelowGaugeCountTextAPIRequest,
    textBelowGaugeColor: this.chartandGraph.textBelowGaugeColor,

    sectionBelowBarChartIconOnTop: this.chartandGraph.sectionBelowBarChartIconOnTop,
    sectionBelowBarChartIconOnTopLeftText: this.chartandGraph.sectionBelowBarChartIconOnTopLeftText,
    sectionBelowBarChartIconOnTopLeftApi: this.chartandGraph.sectionBelowBarChartIconOnTopLeftApi,
    sectionBelowBarChartIconOnTopLeftApiRequest: this.chartandGraph.sectionBelowBarChartIconOnTopLeftApiRequest,
    sectionBelowBarChartIconOnTopRightText: this.chartandGraph.sectionBelowBarChartIconOnTopRightText,
    sectionBelowBarChartIconOnTopRightApi: this.chartandGraph.sectionBelowBarChartIconOnTopRightApi,
    sectionBelowBarChartIconOnTopRightApiRequest: this.chartandGraph.sectionBelowBarChartIconOnTopRightApiRequest,

    maxLicenseAllowed: this.chartandGraph?.maxLicenseAllowed,
    maxLicenseAllowedLineColor: this.chartandGraph?.maxLicenseAllowedLineColor,
    maxlicensedUsed: this.chartandGraph?.maxlicensedUsed,
    maxlicensedUsedRequest: this.chartandGraph?.maxlicensedUsedRequest,
    maxlicensedUsedTime: this.chartandGraph?.maxlicensedUsedTime,
    maxlicensedUsedTimeRequest: this.chartandGraph.maxlicensedUsedTimeRequest,

    innerTextDoughnut: this.chartandGraph.innerTextDoughnut,
    showSum: this.chartandGraph.showSum,
    hideLegend: this.chartandGraph.hideLegend,

    blocks: this.chartandGraph.blocks
  }
  addBlockToChartandGraph = {
    header: null,
    api: null,
    backgroundColor: null
  }
  requestObj: {};
  masters: any;
  addAlert: any;
  minDate1 = new Date();
  maxDate1 = new Date();
  dateObj: any;
  readonly imageTrigger: Subject<void> = new Subject<void>();
  croppedImage: any;
  uploadWithForm: boolean = true;
  cropPanel: boolean = false;
  minDateDeposit = new Date();
  form: FormGroup;
  formChangePassword: any;
  submittedForm: boolean = false;
  loaderSmall: boolean = false;
  disabled: boolean = true;
  labeToCompare: boolean = true;
  costToCompare: boolean = true;
  category: any = '';
  channelname: any = '';
  whatsappicon: any = '';
  // reset: boolean;
  file: any;
  fileName: any = '';
  imageUrl: any;
  extention: any;
  imgPreview: any = '';
  QRdata: any;
  saveJson: boolean = true;
  hide = true;
  hide1 = true;
  hide2 = true;
  isDropDown: boolean;
  totalCollection: number = 0;
  inbound: FormGroup;
  outbound: FormGroup;
  req: { data: { spname: string; parameters: { flag: string; processid: any; }; }; };
  Icon: string;
  deletePopup: boolean;
  profileImg: any = null;
  person: any = null;
  errorImg: any = null;
  checkImg: any = null;
  substring: string = '';
  abc: any;
  masterConfig: any
  loader: boolean;
  GST: any;
  userDetails: any;
  tabData: number;
  tabKey: any = [];
  noData: boolean = true;
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  userConfig: any
  type: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  tabValue = [];
  push: any;
  channelType: any;
  whatsappchanelform: FormGroup;
  disableInput: FormGroup;
  paginationArray: any = [];
  tempRes: any = [];
  tempKey: any = [];
  commonObj: any;
  path: any;
  editObj: any;
  languageType: any = [];
  states: any = [];
  filteredstates = this.states.slice();
  labelName: any;
  lastYear = new Date();
  regex: any;
  skillId: any;
  modules: any;
  configData: any;
  location: any;
  updateModules: any;
  addBtn: boolean;
  formOnlineHrs: FormGroup;
  unfydMaster: any;
  formData: any;
  formName: any;
  formOfflineDays: FormGroup;
  masterSelected: boolean;
  checklist: { id: number; value: string; isSelected: boolean; }[];
  checkedList: any;
  item: any;
  categoryImg: any;
  loginLoader: boolean = false;
  loginImg: any;
  isDisabled = false;
  check: boolean = false;
  serviceContract: any;
  cities: any;
  parentAccount: any;
  profilepic: any = null;
  editobj: any;
  dateFormat: any;
  products: any;
  icons: string;
  channelSource: any;
  custom: any;
  skill: any;
  UID: any;
  Rule: any;
  accessControlsLst: any;
  actionname: any;
  agents: any;
  skillType: any;
  getGroupList: any;
  rule: any;
  channelvalue: any;
  RMType: any;
  customtype: any;
  description: any;
  roleid: any;
  productid: any;
  isnot: boolean = false;
  errorvalue: any;
  securitycomplainceresponse: boolean = false;
  PasswordStrength: any;
  PasswordStrengthval: any = false;
  tenantproid: any;
  ConfigValue: any;
  passwordmatch: boolean = false;
  passwordNotMatchval: boolean = false;
  hsmbody: any;
  emailbody:any;
  totalItems = 0
  drilldownURL
  drilldownRequest
  localizationData = []
  languagesByTenant = []
  defaultLabels = []
  panelOpenState = false
  // orchestrationval: any;
  // tabkey: any[];
  // tabvalue: any[];
  // Id: any;
  product: any;
  subcategory: any;
  categoryname: any;
  Category: any = [];
  public searchCategory = this.Category.slice();
  PasswordHistoryArr: any = [];
  decrptedPassHistoryArr: any = [];
  passwordHistoryMatch: boolean = false;
  @Input() isDialog: boolean = false;
  userLanguageName: any = [];
  @Input() tab: any;
  @Input() tabs: any;
  @Input() tabe: any;
  @Input() filter: any;
  @Input() productCat: any;
  alertPopupIcon: any;
  JsonFieldError: boolean = false;
  typeofbutton: boolean = false
  existbutton: boolean = false
  buttonval: boolean = false
  pophead: boolean = false
  popbody: boolean = false
  controlT: any;
  assignlabel: any;
  configK: any;
  configV: any;
  temp1 =[]
  buttonname: any;
  Logbuttonname: any;




  // add more languages starts
  postmanData: any
  dataFromPostman = {};
  objectKeys = Object.keys
  ObjectKeys = Object.keys
  allData = [];
  selectedServiceProvider = ''
  selectedServiceProviderInfo = ''
  labelsToTranslate = [];
  labelsToTranslate2 = []
  allLabels = []
  costing = []
  reqObj = {}
  // add more languages ends
  defaultLabels2 = []
  labelsChanged = []
  ParentModule = {}
  panelOpenState1 = false
  panelOpenState2 = false
  edit = false;
  errorval: boolean = false;
  defaultLanguage = {
    defaultLanguage: 'English',
    defaultLanguageCode: 'en'
  };
  externalAPIData = {}
  @Input() moduleName : any;
  @Input() channel: any;
  @Input() language: any;
    webchatForm: FormGroup;
    apilist: any;
    serviceProvider: any;
    form2: FormGroup;

  constructor(

    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    public common: CommonService,
    private el: ElementRef,
    private currencyPipe: CurrencyPipe,
    private excelService: ExcelService,
    private router: Router,
    private http: HttpClient,
    public clipboard: Clipboard
  ) {
    Object.assign(this, { masters, userFormSteps, addAlert, unfydMaster, channelConfigurationIcons });
    this.masterSelected = false;
  }
  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToVerify.currentValue;

    throw new Error('Method not implemented.');
  }



  ngOnInit(): void {
    this.token = localStorage.getItem('authtoken') ? localStorage.getItem('authtoken') : ''
    if(this.userDetails && this.auth.getUser()){
      this.userDetails = this.auth?.getUser();
    }
    this.editwts = this.data.editwts

    if(this.data.type == 'createTaskManually'){
      this.form = this.formBuilder.group({
        selectCampaign : [''],
        taskID : ['']
      })

      try{
      // this.data.value.Value = this.common.isObject(this.data.value.Value) ? JSON.parse(this.data.value.Value) : this.data.value.Value

      // this.data.value.Value = this.data.value.Value ? JSON.parse(this.data.value.Value) : this.data.value.Value
      } catch{
        console.log('inavlid object');
      }
      this.dummyTaskGroupFields = JSON.parse(JSON.stringify(this.data.taskGroupInfo.TaskGroupFields))
      if(this.data.purpose == 'view' || this.data.purpose == 'edit'){
        this.data.taskGroupInfo.TaskGroupFields.forEach(element => {
          element.LockControl = true
        });
      }else if(this.data.purpose == 'edit'){
        this.data.taskGroupInfo.TaskGroupFields.forEach(element => {
          element.LockControl = false
        });
      }else{
        this.data.taskGroupInfo.TaskGroupFields.forEach(element => {
          element.LockControl = false
        });
      }
      this.allFormControl = this.data.taskGroupInfo.TaskGroupFields
      this.formFields = JSON.parse(JSON.stringify(this.allFormControl))
      this.createForm()
    }
    if(this.data.type == 'filtercondition' || this.data.type == 'sortcondition' || this.data.type == 'rechurnrule' || this.data.type == 'businesshours' || this.data.type == 'copyTaskGroupAPI'){
      let a = JSON.parse(JSON.stringify(this.data))
      console.log(a);
      this.taskGroupInfo = a.taskGroupInfo
      if(this.data.type == 'copyTaskGroupAPI') this.apiData['taskGroupFields'] = JSON.stringify(a.taskGroupInfo.TaskGroupFields)
      if(this.data.type == 'filtercondition' || this.data.type == 'rechurnrule')this.queryBuilderOpened()
      if(this.data.type == 'rechurnrule'){
        // this.taskGroupInfo.RechurnRule.forEach(element => {
        //   element.action.forEach(element1 => {
        //     if(element1.status){
        //       if(element.hasOwnProperty('actionVal')){
        //         if(element.actionVal){
        //           element.actionVal = `${element.actionVal}, ${element1.taskfield}=${element1.value}`
        //         }else{
        //           element.actionVal = `${element1.taskfield}=${element1.value}`
        //         }
        //       }else{
        //         Object.assign(element,{actionVal : `${element1.taskfield}=${element1.value}` })
        //       }
        //     }
        //   });
        // });
      }
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }

    if(this.data.type == 'configureApiTaskGroup'){
      console.log(this.data);
      this.form = this.formBuilder.group({
        syncDuration : [{hour:0,minute:0,second:0}],
        configuration : [{
          Id: null,
          label: null,
          dateFormat: null,
          formControlName: null,
          formCategory: 'wrap-up',
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
          RequestFormat: true,
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
          hide:false
        }],
        apiConfig : [''],
        fieldMapping : this.formBuilder.array([this.fieldMapping()])
      },{validator : [apiInvalid('apiConfig')]})

      if(this.data.taskGroupInfo?.apiConfig) this.form.controls['apiConfig'].patchValue(this.data.taskGroupInfo?.apiConfig)
      if(this.data.taskGroupInfo?.syncDuration){
        let time = {hour : 0, minute : 0, second : 0}
        let a = this.data.taskGroupInfo?.syncDuration.split(":");
        time.hour = parseInt(a[0]);
        time.minute = parseInt(a[1]);
        time.second = parseInt(a[2]);
        this.form.controls['syncDuration'].patchValue(time)
      }
      if(this.data.taskGroupInfo?.fieldMapping){
        this.data.taskGroupInfo?.fieldMapping.forEach((element,index) => {
          if(index != 0) {
            let aaaa= this.form.controls['fieldMapping']['controls'] as FormArray
            aaaa.push(this.fieldMapping())
          }
          this.form.controls['fieldMapping']['controls'][index]['controls']['taskField'].patchValue(element?.taskField)
          this.form.controls['fieldMapping']['controls'][index]['controls']['responseParameter'].patchValue(element?.responseParameter)
        });

      }
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }
  // }
  if(this.data.type == 'taskGroupRechurnAction'){
    console.log(this.data);
    this.form = this.formBuilder.group({
      action : this.formBuilder.array([])
    })

    this.data.data.forEach((element,index) => {
      let a = this.form.get('action') as FormArray
      if(this.common.checkTruthyValue(element?.taskfield)){
        a.push(this.addRechurnActionRule())
        a.controls[index].patchValue(element)
        setTimeout(() => {
          this.taskGroupRechurnActionSetValidation(index)
        });
      }
    });
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"));
  }

    if (this.data.type == 'addAction') {

      this.common.setMasterConfig();
      this.subscription.push(
        this.common.getMasterConfig$.subscribe((data) => {
          if (Object.keys(data).length > 0) {
            this.SLAType = JSON.parse(data["SLAType"]);
            this.SlaRequestType = JSON.parse(data["SlaRequestType"]);
          }
        }))
      if (this.data.action == 'SLAType' || this.data.action == 'SLARequestType') {
        this.form = this.formBuilder.group({
          action: [(this.data.slaTypeData && this.data.slaTypeData.length > 0) ? this.data.slaTypeData : [], [Validators.required]]
        })
      } else if (this.data.action == 'event') {
        this.form = this.formBuilder.group({
          action: ['', [Validators.required]],
          description: ['', [Validators.required]]
        }, { validator: [checknull('action'), checknull('description')] })
      } else {
        this.form = this.formBuilder.group({
          action: [(this.data.action == 'SLAType' || this.data.action == 'SLARequestType') ? [] : '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
        }, { validator: [checknull('action')] })
      }
    }
    if (this.data.type != 'ChangePassword') this.userDetails = this.auth.getUser();

    if (this.data.type == 'individualLanguageInfo') {
      this.getLabels1()
    }

    if (this.data.type == 'localizationCommonAPIForm') {
      this.formCreation();
      this.getlistdata();

      if (this.data?.id) {
        this.externalAPIGet(this.data?.id)
      }
    }

    if (this.data.type == 'localizationCommonAPI') {
      this.getData()
    }
    if (this.data.type == 'localizationAddMoreButton') {

      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'Localization', localStorage.getItem("lang"))
      this.languageDataFromTenant()
      this.getAllLocalizationData()
    }

    if (this.data.type == 'localizationCommonAPIForm') {

      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'Localization', localStorage.getItem("lang"))
    }

    if (this.data.type == 'viewLabels') {
      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'Localization', localStorage.getItem("lang"))
      this.getLabels()
    }
    if (this.data.type == 'rejectRemark') {
      this.form = this.formBuilder.group({
        remarks: ['', [Validators.required]]
      },
      {validator: [checknull('remarks')]}      )
    }

    if (this.data.type == 'dayEndPopup') {
      for (var i in this.data.data) {
        this.totalCollection += this.data.data[i]['Amount'];
      }
    }

    if (this.data.type == 'dashboardInFullScreen') {
      setTimeout(() => {
        this.common.dashboardFullScreenMethod(true)
      })

    }

    if (this.data.type == 'previewMasking') {
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
      this.common.setUserConfig(this.userDetails.ProfileType, 'MaskingRule');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data

      }))
      this.form = this.formBuilder.group({
        input: ['', [Validators.required]],
        maskInput: ['', [Validators.nullValidator]]

      }, {
        validator: validateregex('input', this.data.value.regex)
      })

      this.form.valueChanges.subscribe(x => {
        if (this.form.invalid) {
          this.form.markAllAsTouched();
          return;
        }
      })


    }



    if (this.data.type == 'addChannelForChannelConfiguration') {
      this.form = this.formBuilder.group({
        channelName: ['', [Validators.required]],
        description: ['', [Validators.required]],
        status: [false, [Validators.required]],
        icon: ['', [Validators.required]]
      })
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }));
      this.setLabelByLanguage(localStorage.getItem("lang"))
    }
    if(this.data.type == 'businesshours'){
      this.common.configView.next({ channel : localStorage.getItem('userChannelName') ? (JSON.parse((localStorage.getItem('userChannelName'))) ? JSON.parse((localStorage.getItem('userChannelName')))[0].ChannelId : 10) : 10
      , language :  'en' })
   }

    if (this.data.type == 'addCondition') {

      this.form = this.formBuilder.group({
        rule: ['', Validators.required],
        button: ['', Validators.nullValidator],
        channel: ['', Validators.nullValidator],
        channelid: ['', Validators.required],
        andor: ['', Validators.nullValidator],
        customvalue: ['', Validators.nullValidator],
        customblank: ['', Validators.nullValidator]
      });

      if (this.data.andortype) {
        this.form.get('button').setValidators(Validators.required);
        this.form.get('andor').setValidators(Validators.required);
      } else {
        this.form.get('button').setValidators(Validators.required);
        this.form.get('andor').setValidators(Validators.nullValidator);
      }
      this.form.get('button').updateValueAndValidity();
      this.form.get('andor').updateValueAndValidity();

      this.channel = "Channel",
        this.channelSource = "ChannelSource",
        this.custom = "Custom",
        this.skill = "Skill",
        this.UID = "UID"
      this.getChanel()
      this.getSkill()
      this.orchestrationrule()
      this.getchannelvalue()
      this.RMBased()
      this.getCustom()
      this.rconfigValue()



    }

    if (this.data.type == 'routeTo') {
      this.form = this.formBuilder.group({

        route: ['', Validators.nullValidator],
        agentname: ['', Validators.required]
      })
      this.getagent()
      this.getSkill()
      this.getGroup()
      this.RMBased()
      this.getCustom()
    }

    if (this.data.type == 'previewForm') {
      this.form = new FormGroup({});
      this.getFormData()
    }
    	
    if (this.data.type == 'openDrillDown') {	
      this.type = this.data.title.SelectedTab == undefined ? this.data.title+'_Drilldown' : this.data.title.SelectedTab+'_Drilldown'	
      	
      if(!localStorage.getItem("localizationData"))	
      {	
        this.common.setLocalizationData()	
      }	
      	
      if(localStorage.getItem("localizationData"))	
      {	
        this.Localizationdateformat = JSON.parse(localStorage.getItem("localizationData"));	
        this.localizationformat = this.Localizationdateformat.selectedDateFormats.toUpperCase().concat(" ", this.Localizationdateformat?.selectedTimeFormats)	
        if(this.localizationformat.includes('a'))this.localizationformat = this.localizationformat.replace('a','A')	
        if(this.localizationformat.includes('p'))this.localizationformat = this.localizationformat.replace('p','P')	
      }else{	
        this.localizationformat = 'DD-MMM-YY h:mm:ss A'	
      }	
      	
      this.drilldownRequest = JSON.parse(JSON.stringify(this.data.req))	
      this.drilldownURL = JSON.parse(JSON.stringify(this.data.url))	
      this.callDrillDownData()	
      this.subscription.push(this.common.refreshTable$.subscribe((res) => {	
        this.page = 1;	
        this.callDrillDownData()	
      }))	
      this.subscription.push(this.common.getItemsPerPage$.subscribe((res) => {	
        this.itemsPerPage = res;	
        this.page = 1;	
        this.callDrillDownData()	
      }))	
    }


    if (this.data.type == 'addDashboardCard') {

      this.common.AllIcons.forEach(element => {
        this.AllIcons.push(element?.name)
      });
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.common.setUserConfig(this.userDetails.ProfileType, 'Dashboard');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data

      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
      this.common.setMasterConfig();
      this.subscription.push(this.common.getMasterConfig$.subscribe(data => {

        this.dashboardControlType = JSON.parse(data['DashboardTileType'])
        this.chartandGraphDropdown = JSON.parse(data['DashboardChartAndGraph'])
        this.dateFilterDropdown = JSON.parse(data['DateFilter'])
        this.dashboardControlTypeSelected = this.dashboardControlType[0]?.Key;
      }))
    }

    if (this.data.type == 'Reject' || this.data.type == 'blockList') {
      this.form = this.formBuilder.group({
        remarks: ['', Validators.required],
      });
    }
    if (this.data.type == 'preview') {
    }
    if (this.data.type == 'alertView') {
      this.Icon = this.data.data.icon;
    }
    if (this.data.type == 'custpreview') {
      this.description = this.htmlDecode(this.data.data.description)
    }
    if (this.data.type == 'localizationAddGreetings') {
      this.form = this.formBuilder.group({
        Name: ['', [Validators.required]],
        Language: ['', [Validators.required]],
        Message: ['', [Validators.required]],
        fromTime: ['', [Validators.required]],
        toTime: ['', [Validators.required]],
        status: ['', [Validators.required]],
      });
    }

    if (this.data.type == 'Webchat-Name-popup') {
      this.form = this.formBuilder.group({
        WebchatName: ['', [Validators.required,Validators.pattern(regex.alphabet)]],
        WebchatDesc: ['', [Validators.required,Validators.pattern(regex.alphabet)]],
        webchatSelected: ['', [Validators.nullValidator]]
      },{validator:[checknull('WebchatName'),checknull('WebchatDesc')]}
      )
      this.webchatForm = this.formBuilder.group({
        WebchatName: [this.form.value.webchatName, [Validators.required, Validators.minLength(2)]],
        WebchatScript: ['', [Validators.nullValidator]],
        webchatIconColor: ['', [Validators.nullValidator]],
        themeColor: ['#053c6d', [Validators.nullValidator]],
        themeColorPalletteSelected: ['Solid', [Validators.nullValidator]],
        widgetStyle: ['Modern', [Validators.nullValidator]],
        addThemeColorCode: ['', [Validators.nullValidator]],
        themeColorCode: ['', [Validators.nullValidator]],
        themePrimaryColorCode: ['', [Validators.nullValidator,Validators.pattern(regex.hexColorCode)]],
        themeSecondaryColorCode: ['', [Validators.nullValidator,Validators.pattern(regex.hexColorCode)]],
        eyeCatcherHeading: ['Hi, There!!', [Validators.nullValidator]],
        eyeCatcherText: ['Welcome', [Validators.nullValidator]],
        eyeCatcher: ['', [Validators.nullValidator]],
        chatIconStyle: ['chat1', [Validators.nullValidator]],
        chatButtonPosition: ['bottom-right', [Validators.nullValidator]],
        chatTitleOnline: ['', [Validators.nullValidator,Validators.pattern(regex.alphabet)]],
        chatTitleOffline: ['', [Validators.nullValidator,Validators.pattern(regex.alphabet)]],
        sideSpacing: ['', [Validators.nullValidator,Validators.pattern(regex.numeric)]],
        agentAvatar: ['', [Validators.nullValidator]],
        shapeUploaded: ['', [Validators.nullValidator]],
        agentAvatarUploaded: ['', [Validators.nullValidator]],
        botAvatarUploaded: ['', [Validators.nullValidator]],
        notiSoundUploaded:['', [Validators.nullValidator]],
        bottomSpacing: ['', [Validators.nullValidator,Validators.pattern(regex.numeric)]],
        languageSelected: ['', [Validators.nullValidator]],
        toggleAttachment: ['', [Validators.nullValidator]],
        textareaCharLimit: ['', [Validators.nullValidator]],
        CharsLimit: ['300', [Validators.nullValidator]],
        maxNumberFile: ['', [Validators.nullValidator]],
        sendFileType: ['', [Validators.nullValidator]],
        FileFormatSelected: [['jpg','png','pdf'], [Validators.nullValidator]],
        singleMultiImage: ['singleFile', [Validators.nullValidator]],
        fileSize: ['1', [Validators.nullValidator]],
        fileSizeMemorySelected: ['MB', [Validators.nullValidator]],
        toggleMic: [false, [Validators.nullValidator]],
        toggleEmoji: [true, [Validators.nullValidator]],
        toggleInputForm: ['', [Validators.nullValidator]],
        toggleCarousel: ['', [Validators.nullValidator]],
        toggleBotFlow: ['', [Validators.nullValidator]],
        botAvatar: ['', [Validators.nullValidator]],
        botFlowSelected: ['', [Validators.nullValidator]],
        carousalStyle: ['', [Validators.nullValidator]],
        urlToggle: ['', [Validators.nullValidator]],
        chatButtonShape: ['chatButtonShape1', [Validators.nullValidator]],
        chatIconUploaded: ['', [Validators.nullValidator]],
        viewSingleMultiImage: ['', [Validators.nullValidator]],
        imageCaption: [true, [Validators.nullValidator]],
        videoPlayback: [true, [Validators.nullValidator]],
        audioPlayback: [true, [Validators.nullValidator]],
        pictureInPicture: [true, [Validators.nullValidator]],
        urlHighlighter: ['blue', [Validators.nullValidator]],
        emailHighlighter: ['blue', [Validators.nullValidator]],
        numberHighlighter: ['blue', [Validators.nullValidator]],
        socialMediaIcons: ['', [Validators.nullValidator]],
        toggleMsgCustomerTImezone: ['', [Validators.nullValidator]],
        QueueWaitTime: ['', [Validators.nullValidator]],
        QueuePositionMsg: ['', [Validators.nullValidator]],
        toggleSneakPeak: ['', [Validators.nullValidator]],
        toggleNotification: ['', [Validators.nullValidator]],
        toggleEmailTranscript: ['', [Validators.nullValidator]],
        toggleDownloadTranscript: [true, [Validators.nullValidator]],
        toggleEndConversation: [true, [Validators.nullValidator]],
        toggleBranding: ['', [Validators.nullValidator]],
        toggleUNFYDBranding: ['', [Validators.nullValidator]],
        BrandingURL: ['', [Validators.nullValidator]],
        CopyrightText: ['', [Validators.nullValidator]],
        toggleBottomBranding: ['', [Validators.nullValidator]],
        togglePluginBranding: ['', [Validators.nullValidator]],
        watermarkMessageWindow: ['', [Validators.nullValidator]],
        watermarkMessageWindowImg: ['', [Validators.nullValidator]],
        watermarkPrechatWindow: ['', [Validators.nullValidator]],
        watermarkPrechatWindowImg: ['', [Validators.nullValidator]],
        toggleMarquee: ['', [Validators.nullValidator]],
        marqueeText: ['', [Validators.nullValidator]],
        marqueeTextColor: ['', [Validators.nullValidator]],
        marqueeBGColor: ['', [Validators.nullValidator]],
        FACEBOOKSOCIAL: ['', [Validators.nullValidator]],
        facebookURL: ['', [Validators.nullValidator]],
        TWITTERSOCIAL: ['', [Validators.nullValidator]],
        twitterURL: ['', [Validators.nullValidator]],
        INSTAGRAMSOCIAL: ['', [Validators.nullValidator]],
        instagramURL: ['', [Validators.nullValidator]],
        toggleAutocompletion: ['', [Validators.nullValidator]],
        toggleBotAvatar: ['', [Validators.nullValidator]],
        toggleCoBrowse: ['', [Validators.nullValidator]],
        toggleVideoCall: ['', [Validators.nullValidator]],
        toggleThumbBtn: ['', [Validators.nullValidator]],
        toggleEmojiBtn: ['', [Validators.nullValidator]],
        VideoRecording: ['', [Validators.nullValidator]],
        VideoCopyURL: ['', [Validators.nullValidator]],
        VideoScreenshare: ['', [Validators.nullValidator]],
        VideoCallVideo: ['', [Validators.nullValidator]],
        VideoCallAudio: ['', [Validators.nullValidator]],
        CallControl: ['', [Validators.nullValidator]],
        toggleVoiceCall: ['', [Validators.nullValidator]],
        muteUnmute: ['', [Validators.nullValidator]],
        ToggleAgentJoinNoti: ['', [Validators.nullValidator]],
        toggleNetNotification: ['', [Validators.nullValidator]],
        toggleVolumeConrol: ['', [Validators.nullValidator]],
        toggleVideoConversation: ['', [Validators.nullValidator]],
        toggleRingCustomerInitiate: ['', [Validators.nullValidator]],
        toggleDisconnect: ['', [Validators.nullValidator]],
        togglePauseVideo: ['', [Validators.nullValidator]],
        toggleMaximizeVideo: ['', [Validators.nullValidator]],
        toggleStartStopCobrowsing: ['', [Validators.nullValidator]],
        toggleAllowDisallowControlAgent: ['', [Validators.nullValidator]],
        toggleScreenshare: ['', [Validators.nullValidator]],
        toggleAvatar: ['', [Validators.nullValidator]],
        botName: ['Live Chat', [Validators.nullValidator]],
        togglePrechat: ['', [Validators.nullValidator]],
        prechatFormHeding: ['', [Validators.nullValidator]],
        prechatFormSubHeding: ['', [Validators.nullValidator]],
        toggleEyeCatcher: ['', [Validators.nullValidator]],
        prechatformOnline: ['', [Validators.nullValidator]],
        prechatformOffline: ['', [Validators.nullValidator]],
        toggleCustFeedback: [false, [Validators.nullValidator]],
        toggleCookieRead: ['', [Validators.nullValidator]],
      })

      console.log("formvalue:",this.webchatForm.value,Object.keys(this.webchatForm.value));
    }
    if (this.data.type == 'send-script-popup') {
      this.form = this.formBuilder.group({
        sendEmail: ['', [Validators.required]]
      })
    }

    if (this.data.type == 'edit' || this.data.type == 'add') {
      this.form = this.formBuilder.group({
        PaymentType: ['', Validators.required],
        Amount: ['', Validators.required],
        Discount: ['', Validators.nullValidator],
        GST: ['', Validators.required],
        State: ['', Validators.nullValidator],
        HSNCode: ['', Validators.nullValidator],
      });
      this.form.get('GST').setValue(this.data.data.GST);
      this.form.get('HSNCode').setValue(this.data.data.HSNCode);
      this.form.get('GST').disable();
      if (this.data.type == 'edit') {
        this.form.patchValue(this.data.data);
        this.form.get('GST').disable();
        this.form.get('PaymentType').disable();
        this.form.updateValueAndValidity();
      }
    }


	   if (this.data.type == 'openchannel') {
      this.inbound = this.formBuilder.group({
        email_account_type: ['', Validators.nullValidator],
        email_host: ['', Validators.nullValidator],
        email_port: ['', Validators.nullValidator],
        email_socket_option: ['', Validators.nullValidator],
        email_user: ['', Validators.nullValidator],
        email_password: ['', Validators.nullValidator],
        email_can_delete: ['', Validators.nullValidator],
        email_ssl_protocol: ['', Validators.nullValidator],
        email_attachments_allowed: ['', Validators.nullValidator],
        email_max_size_allowed: ['', Validators.nullValidator],
        email_case_default_priority: ['', Validators.nullValidator],
        email_case_default_priority_imp: ['', Validators.nullValidator],
        email_case_default_type_id: ['', Validators.nullValidator],
        email_case_default_channel_id: ['', Validators.nullValidator],
        email_case_attachment_category_id: ['', Validators.nullValidator],
        email_attachment_contenttypes_allowed: ['', Validators.nullValidator],
        email_Cc_Bcc: ['', Validators.nullValidator],
        Outbound_Config_Key: ['', Validators.nullValidator],
        email_webhook_url: ['', Validators.nullValidator],
        email_msmq_url: ['', Validators.nullValidator],
        email_IsCaseCreationEnabled: ['', Validators.nullValidator],
        email_QueueName: ['', Validators.nullValidator],
        email_TenantId: ['', Validators.nullValidator],
        email_notification_default_outbound: ['', Validators.nullValidator],
        email_notification_default_status: ['', Validators.nullValidator],
        CS_Priority: ['', Validators.nullValidator],
        EmailDate_Flag: ['', Validators.nullValidator],
        Email_Extract_Date: ['', Validators.nullValidator]
      });
      this.outbound = this.formBuilder.group({
        smtp_server: ['', Validators.nullValidator],
        smtp_port: ['', Validators.nullValidator],
        smtp_authentication: ['', Validators.nullValidator],
        smtp_user_name: ['', Validators.nullValidator],
        smtp_password: ['', Validators.nullValidator],
        smtp_security: ['', Validators.nullValidator],
        smtp_msg_id_domain: ['', Validators.nullValidator],
        smtp_email_readreceipt: ['', Validators.nullValidator],
        smtp_email_DSN: ['', Validators.nullValidator],
        smtp_email_DSN_id: ['', Validators.nullValidator],
        email_attachment_contenttypes_allowed: ['', Validators.nullValidator],
        email_max_size_allowed: ['', Validators.nullValidator],
        CASE_OutboundCount: ['', Validators.nullValidator],
      });
    }

    if (this.data.type == 'whatsappchannel' || this.data.type == 'editWhatsappChannel') {
      this.whatsappchanelform = this.formBuilder.group({

        whatsappicon: ['', Validators.nullValidator],
        databasename: ['', Validators.nullValidator],
        servername: ['', Validators.nullValidator],
        username: ['', Validators.nullValidator],
        password: ['', Validators.nullValidator],
        hostip: ['', Validators.nullValidator],
        databaseportnumber: ['', Validators.nullValidator],
        source: ['', Validators.nullValidator],
        tenantid: ['', Validators.nullValidator],
        channelsoirce: ['', Validators.nullValidator],
        channelname: ['', Validators.nullValidator],
        sourceskillagent: ['', Validators.nullValidator],
        targetskill: ['', Validators.nullValidator],
        cleintidentifier: ['', Validators.nullValidator],
        portsaveincomingrequest: ['', Validators.nullValidator],
        insertrequestapi: ['', Validators.nullValidator],
        receivemessageapi: ['', Validators.nullValidator],
        deleterecordapi: ['', Validators.nullValidator],
        agentconnectioncheckapi: ['', Validators.nullValidator],
        savedbmessageapi: ['', Validators.nullValidator],
        mediadownload: ['', Validators.nullValidator],
        enablebutton: ['', Validators.nullValidator],
        customerattribute: ['', Validators.nullValidator],
        mobilenumberinuid: ['', Validators.nullValidator],
        mobileinuid: ['', Validators.nullValidator],
        urlvendor: ['', Validators.nullValidator],
        urlbuttonbased: ['', Validators.nullValidator],
        urldropdownbased: ['', Validators.nullValidator],
        authenticationtoken: ['', Validators.nullValidator],
        hsmurl: ['', Validators.nullValidator],
        hsmob: ['', Validators.nullValidator],
        hsmupdatenotification: ['', Validators.nullValidator],
        mediadownloadapi: ['', Validators.nullValidator],
        path: ['', Validators.nullValidator],
      });

      if (this.data.data != undefined && this.data.data != null && this.data.data != "") {
        var formData = this.data.data;
        formData.forEach(element => {
          this.whatsappchanelform.get(element.Key).patchValue(element.Value);
        });
        this.whatsappchanelform.updateValueAndValidity();
      }
    }
    if (this.data.type == 'ChangePassword' || this.data.type == 'dashboardchangepassword') {
      // this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_security_compliance",
          parameters: {
            flag: "GET_FOR_ADMIN",
            processid: 1,
            productid: 11
          }
        }
      }

      this.api.post('index', this.requestObj).subscribe((res: any) => {
        this.loader = false
        this.formChangePassword = this.formBuilder.group({
          newPassword: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
        }
        );
        this.passwordPolicyapi = res.results.data;

        let minlengthapi = res.results.data[0].value;
        let maxLengthapi = res.results.data[1].value;
        this.securitycomplainceresponse = true;



      })


      let objpasslist = {
        data: {
          parameters: {
            agentid: this.data.Id,
            processid: this.data.Processid
          }
        }
      }

      this.api.post('PasswordHistory', objpasslist).subscribe((res: any) => {
        this.PasswordHistoryArr = []
        this.PasswordHistoryArr = res.results.data;

        this.decrptedPassHistoryArr = []

        this.PasswordHistoryArr.forEach(element => {
          let decrptedpass = this.common.getDecrypted('123456$#@$^@1ERF', element)
          this.decrptedPassHistoryArr.push(decrptedpass);
        });

      })


    }
    if (this.data.type == 'tenantsummary') {
      this.tenantproid = this.data.processid
    }

    if (this.data.type == 'HSM_Preview') {
      this.hsmbody = this.data.hsmbodyval
    }

    if (this.data.type == 'HsmApiOption') {
      this.hsmbody = this.data.hsmbodyval
    }

    // if (this.data.type == 'Emailpreview') {
    //   this.emailbody = this.data.emaildata
    // }


    if (this.data.type == 'Emailpreview') {
      this.emailbody = this.data.emaildata
    }








    this.subscription.push(this.common.getIndividualUpload$.subscribe(res => {
      if (res.status.attachmenturl) {
        this.profileImg = res.status.attachmenturl;
        this.Icon = this.profileImg;
      }
    }))
    if (this.data.type == 'localizationViewTable') {
      this.getTableDataLocalizationlanguages(this.data.langData.LanguageCode)
      this.common.setUserConfig(this.userDetails.ProfileType, 'Branding');
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
      }));
      this.getFilter();
      this.feildChooser()
    }

    if (this.data.type == 'editlocalizationViewTable') {
      this.type = 'label'
      this.subscription.push(this.common.addLabelInDialog$.subscribe((res) => {
        this.getTableDataLocalizationlanguages(this.data.langData.LanguageCode)
      }))
      this.getTableDataLocalizationlanguages(this.data.langData.LanguageCode)
      this.common.setUserConfig(this.userDetails.ProfileType, 'localization');
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
      }));
      this.getFilter();
      this.feildChooser()
    }
    if (this.data.type == 'add-document' || this.data.type == 'update-document') {
      this.form = this.formBuilder.group({
        category: ['', Validators.required],
        attachmentfile: ['', Validators.required],
      });
      this.category = this.data.data.data.category;

      if (this.category == '') {
        this.isDropDown = true;
      } else {
        this.isDropDown = false;
        this.form.controls['category'].setValue(this.category);
        this.form.updateValueAndValidity();
      }
    }
    if (this.data.type == 'discount') {
      this.form = this.formBuilder.group({
        discountamt: ['', Validators.required],
        applicable: ['', Validators.required],
        validatefrom: ['', Validators.nullValidator],
        validateto: ['', Validators.nullValidator],
        remarks: ['', Validators.nullValidator],
      });
    }
    if (this.data.type == 'alert-setting') {
      // this.getLanguage()
      this.getLanguageStorage()
      this.common._deleteImg.subscribe(res => {
        this.copyImgPath(res.icon)
      })
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.common.setUserConfig(this.userDetails.ProfileType, 'AlertMessage');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data

      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
      if (this.data.formType == 'edit') {

        // console.log(JSON.parse(JSON.stringify(this.data.data['Button Type'])));

        this.form = this.formBuilder.group({
          alertMsg: [this.data.data['Alert Message'], [Validators.required, Validators.pattern(regex.alphabetWithUnderScore)]],
          alertMsgType: [this.data.data['Message Type'], Validators.required],
          alertMsgSubType: [this.data.data['Message Sub Type'], Validators.required],
          language: [this.data.data['Language Code'], Validators.required],
          alertMsgPos: [this.data.data['Alert Message Position'], Validators.required],
          alertMsgDur: [this.data.data['Alert Message Duration'], [Validators.nullValidator,Validators.minLength(0)]],
          description: [this.data.data['Message Body'], [Validators.required,Validators.pattern(regex.alertmessage),Validators.minLength(3),Validators.maxLength(300)]],
          msgHead: [this.data.data['Message Head'], Validators.required],
          msgBody: [this.data.data['Message Body'], Validators.required],
          selectBtn: [this.data.data['Button Type'], Validators.nullValidator],
          buttontype: [this.data.data['Button Category'], Validators.nullValidator],
          alertPopupIcon: [this.data.data['Pop-Up Icon URL'], Validators.required],
          place: this.formBuilder.array([
            this.newplace(),
          ]),
        });
        if(this.data.data['Button Category'] == 'Custom'){
         this.temp1 = JSON.parse('[' + JSON.parse(JSON.stringify(this.data.data['Button Type'])) + ']');
        for (let i = 1; i < this.temp1.length; i++) {
          this.addplace();
        }
        var arrayControl = this.form.get('place') as FormArray;
        arrayControl.controls.forEach((element, index) => {
          (arrayControl.at(index) as FormGroup).get('parameters').patchValue(this.temp1[index].Button);
          (arrayControl.at(index) as FormGroup).get('holders').patchValue(this.temp1[index].Value);
        });
      }
        this.form.get('alertMsg').disable();
        this.form.get('alertMsg').clearValidators();
        if(this.form.value.alertMsgType == 'popup') this.button(this.form.value.buttontype)

      } else {
        this.form = this.formBuilder.group({
          alertMsg: ['', [Validators.required, Validators.pattern(regex.alphabetWithUnderScore)]],
          alertMsgType: ['toaster', Validators.required],
          alertMsgSubType: ['success', Validators.required],
          language: ['', Validators.required],
          alertMsgPos: ['', Validators.required],
          alertMsgDur: ['', [Validators.nullValidator,Validators.minLength(0)]],
          description: ['', [Validators.required,Validators.pattern(regex.alertmessage),Validators.minLength(3),Validators.maxLength(300)]],
          alertPopupIcon: [addAlert?.imgDropdown[0].Value, Validators.required],
          msgHead: ['', Validators.required],
          msgBody: ['', Validators.required],
          buttontype: ['', Validators.nullValidator],
          selectBtn: ['', Validators.nullValidator],
          place: this.formBuilder.array([
            this.newplace(),
          ]),
        },
          { validator: [checknull1('alertMsg'), checknull1('description')] },

        );

      }
      var arrayControl = this.form.get('place') as FormArray;
      (arrayControl.at(0) as FormGroup).get('parameters').patchValue('Button1');
      this.applyMsgType();
      this.selectPos(this.form.value.alertMsgType)

    }
    if (this.data.type == 'alertView') {
      this.form = this.formBuilder.group({
        place: this.formBuilder.array([
          this.newplace(),
        ]),
      });
      console.log(this.data.data.data.selectBtn);

      this.Icon = this.data.data.icon;
      if(this.data.data.data.buttontype == 'Custom'){
         this.temp1 = JSON.parse('[' + JSON.parse(JSON.stringify(this.data.data.data.selectBtn)) + ']');
        for (let i = 1; i < this.temp1.length; i++) {
          this.addplace();
        }
        var arrayControl = this.form.get('place') as FormArray;
        arrayControl.controls.forEach((element, index) => {
          (arrayControl.at(index) as FormGroup).get('parameters').patchValue(this.temp1[index].Button);
          (arrayControl.at(index) as FormGroup).get('holders').patchValue(this.temp1[index].Value);
        });
      }

    }



    if (this.data.type == 'complaint') {
      this.form = this.formBuilder.group({
        discountamt: ['', Validators.required],
        remarks: ['', [Validators.required, Validators.minLength(3)]],
      });
    }
    if (this.data.type == 'addLanguage') {
      this.form = this.formBuilder.group({
        languageName: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
        languageId: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
      });
    }
    if (this.data.type == 'depositeRemark') {
      this.form = this.formBuilder.group({
        remarks: ['', [Validators.required, Validators.minLength(3)]],
      });
    }

    if (this.data.type == 'deposite') {
      this.category = "Deposite"
      this.minDate1.setFullYear(this.minDate1.getFullYear() - 60);
      this.minDateDeposit.setDate(this.minDateDeposit.getDate() - 5)
      if (this.data.depositStatus == 'Submit') {
        this.form = this.formBuilder.group({
          depositedAmount: [this.currencyPipe.transform(JSON.stringify(this.data.data.Cash).replace(/\D/g, '').replace(/^0/, ''), 'INR', 'symbol', '1.0'), [Validators.required]],
          depositedDate: [moment(), Validators.required],
          transactionID: ['', [Validators.required, Validators.pattern(regex.alphnumericWithSpaceHyphen)]],
          attachmentfile: ['', Validators.required]
        });
      } else if (this.data.depositStatus == 'Resubmit') {
        this.form = this.formBuilder.group({
          depositedAmount: [this.currencyPipe.transform(JSON.stringify(this.data.data.Cash).replace(/\D/g, '').replace(/^0/, ''), 'INR', 'symbol', '1.0'), [Validators.required]],
          depositedDate: [moment(), Validators.required],
          transactionID: ['', [Validators.required, Validators.pattern(regex.alphnumericWithSpaceHyphen)]],
          remark: ['', Validators.nullValidator],
          attachmentfile: ['', Validators.required]
        });
      }
    }
    if (this.data.type == 'fileView') {
      this.extention = this.data.data.AttachmentUrl.split('.').pop().toLowerCase();
    }
    let position = window.location.href.search('#')
    this.substring = window.location.href.substring(0, position + 2)
    if (this.data.type == 'QRcode') {
      this.substring = this.substring + 'beneficiary-details/' + this.data?.data?.HawkerID
      let date = this.data.data.ApprovedDateTime == null || this.data.data.ApprovedDateTime == '' ? new Date() : new Date(this.data.data.ApprovedDateTime);
      let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
      let day = ("0" + date.getDate()).slice(-2);
      let IssuingDate = [day, mnth, date.getFullYear()].join("-");
      this.abc = `${this.data.data.Salutation} ${this.data.data.FirstName} ${this.data.data.MiddleName} ${this.data.data.LastName}`
      this.QRdata = {
        title: this.data.data.Salutation,
        firstName: this.data.data.FirstName,
        middleName: this.data.MiddleName,
        lastName: this.data.data.LastName,
        gender: this.data.data.Gender,
        dob: this.data.data.DOB,
        religion: this.data.data.Religion,
        nationality: this.data.data.Nationality,
        speciallyAbled: 'No',
        services: 'Paratha stall',
        profile: 'Hawker',
        mobileNo: this.data.data.MobileNo,
        alternateNo: this.data.data.AlternateNumber,
        registrationNo: this.data.data.RegistrationNo,
        issuingDate: this.data.data.ApprovedDateTime == null || this.data.data.ApprovedDateTime == '' ? this.datepipe.transform(new Date(), 'dd MMMM, yyyy') : this.datepipe.transform(this.data.data.ApprovedDateTime, 'dd MMMM, yyyy'),
        issuingOfficer: '',
        autorisedSignature: '',
        flatNo: '',
        streetname: this.data.data.PresentAddressArea,
        ward: this.data.data.PresentAddress,
        area: this.data.data.BlockPresentAddress,
        district: this.data.data.PresentAddressDistrict,
        state: this.data.data.PresentAddressState,
        country: this.data.data.PresentAddressCountry,
        pincode: this.data.data.PresentAddressPincode,
        photo: this.data.data.AttachmentUrl
      }

      setTimeout(() => {
        this.pdfDownload();
      }, 100)
    }

    if (this.data.type == 'addSecurityKey') {
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.common.setUserConfig(this.userDetails.ProfileType, 'SecurityAndCompliance');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data

      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
      this.form = this.formBuilder.group({
        id: [this.data.parentid],
        title: ['', [Validators.required]],
        icon: [''],
        status: [true],
        formControls: this.formBuilder.array([]),
      }, { validator: [checknull('title')] });
      if (this.data.status == 'update') {
        var formObj = this.data.obj
        for (let i = 0; i < formObj.formControls.length; i++) {
          const groupArray = this.form.get("formControls") as FormArray;
          groupArray.push(this.controlsArray);
        }
        this.form.setValue(formObj);
      }

    }
    if (this.data.type == 'addNotification') {
      this.form = this.formBuilder.group({
        id: [this.data.parentid],
        title: ['', Validators.required],
        icon: [''],
        status: [true],
        notificationControls: this.formBuilder.array([]),
      });
      if (this.data.status == 'update') {
        var formObj = this.data.obj
        for (let i = 0; i < formObj.notificationControls.length; i++) {
          const groupArray = this.form.get("notificationControls") as FormArray;
          groupArray.push(this.controlsArray);
        }
        this.form.setValue(formObj);
      }
    }
    if (this.data.type == 'addFeatureControl' || this.data.type == 'editFeatureControl') {
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.common.setUserConfig(this.userDetails.ProfileType, 'FeatureControls');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data

      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
      this.form = this.formBuilder.group({
        parentcontrolid: [this.data.parentcontrolid],
        ControlType: ['', Validators.required],
        Label: ['', [Validators.required, Validators.pattern(regex.alphabetWithUnderScore)]],
        ConfigKey: ['', [Validators.required, Validators.pattern(regex.alphabetWithSpaceUnderscore)]],
        Type: ['', Validators.nullValidator],
        ConfigValue: ['', Validators.nullValidator],
        accesscontrolname: ['', Validators.nullValidator],
        accessControlId: [this.data.accessControlId],

      },
        { validator: [checknull('Label'), checknull('ConfigKey')] },



      );
      if (this.data.type == 'editFeatureControl') {

        this.form.get('ConfigKey').patchValue(this.data.configKey);
        this.form.get('ControlType').patchValue(this.data.controlType);
        this.form.get('Label').patchValue(this.data.assignedPropertyLabel);
        var tempConfig = JSON.stringify(this.data.configValue);
        this.form.get('ConfigValue').patchValue(tempConfig);
        this.form.get('Type').patchValue(this.data.controlType == 'Dropdown' || this.data.controlType == 'MultiSelect' ? 'JSON' : 'Text');
        this.form.updateValueAndValidity();
        this.form.get('ConfigKey').disable();
        this.form.get('ControlType').disable();
        this.form.get('Type').disable();
        this.control = this.data.controlType;
        if (this.control == 'Dropdown' || this.control == 'MultiSelect') {
          var getConfigValue = JSON.parse(JSON.stringify(this.data.configValue));
          for (let i = 0; i < getConfigValue.length - 1; i++) {
            const newGroup = new FormGroup({});
            this.displayedFields.forEach(x => {
              newGroup.addControl(x, new FormControl());
            });
            this.myformArray.push(newGroup);
          }
          this.myformArray.setValue(getConfigValue);
        }
      }
    }
    if (this.data.type == 'addAccessControl') {
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.common.setUserConfig(this.userDetails.ProfileType, 'FeatureControls');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data

      }))
      this.getAccessControl()
      this.setLabelByLanguage(localStorage.getItem("lang"))
      this.form = this.formBuilder.group({
        accesscontrolname: ['', [Validators.required, Validators.pattern(regex.alphabet),Validators.maxLength(50)]],
        oldaccesscontrolid: [],
      }, { validators: [checknull('accesscontrolname'),max5Character('accesscontrolname')] });
    }
    if (this.data.type == 'accesscontrol') {
      this.form = this.formBuilder.group({
        accesscontrolname: ['', Validators.required],
        oldaccesscontrolid: [],
      });
    }
    if (this.data.type == 'addChannel') {

      this.form = this.formBuilder.group({
        channel: ['', Validators.required],
        inbound: [],
        outbound: [],
        fullcapacity: [false],
      });


    }
    if (this.data.type == 'Transcript') {
      this.getTranscript(this.page, this.itemsPerPage);
    }
    if (this.data.type == 'addAccount') {
      this.loader = true;
      this.form = this.formBuilder.group({
        profilepic: [false, [Validators.nullValidator]],
        accountname: ['', [Validators.required]],
        servicecontract: ['', [Validators.nullValidator]],
        parentaccount: ['', [Validators.nullValidator]],
        domainname: ['', [Validators.nullValidator]],
        accountrep: ['', [Validators.nullValidator]],
        city: ['', [Validators.nullValidator]],
        address: ['', [Validators.nullValidator]],
        notes: ['', [Validators.nullValidator]],
        isactive: ['', [Validators.nullValidator]],
        processid: [this.userDetails.Processid, Validators.nullValidator],
        productid: [1, Validators.nullValidator],
        publicip: [this.userDetails.ip, Validators.nullValidator],
        privateip: ['', Validators.nullValidator],
        browsername: [this.userDetails.browser, Validators.nullValidator],
        browserversion: [this.userDetails.browser_version, Validators.nullValidator]
      });
      if (this.data.id !== null) {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_accounts',
            parameters: {
              Flag: 'EDIT',
              Id: this.data.id
            }
          }
        };
        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            if (res.results.data.length > 0) {
              const lowerObj = this.common.ConvertKeysToLowerCase();
              this.editobj = res.results.data[0];
              this.form.patchValue(lowerObj(res.results.data[0]));
              this.form.get('servicecontract').patchValue(res.results.data[0].ServiceContractID);
              this.form.get('parentaccount').patchValue(res.results.data[0].ParentAccountID);
              this.form.get('domainname').patchValue(res.results.data[0].AccountDomain);
              this.form.get('accountrep').patchValue(res.results.data[0].AccountRepContactID);
              this.profilepic = res.results.data[0].LogoUrl;
              this.form.updateValueAndValidity();
            }
          }
        });
      }
      this.getServiceContract();
      this.getCity();
      this.getParentAccount();
      this.subscription.push(this.common.getIndividualUpload$.subscribe(res => {
        if (res?.category == 'UserProfile' && this.data.type == 'addAccount') {
          this.form.get('profilepic').setValue(res.status == false ? false : true);
          this.profilepic = res.status.attachmenturl;
        }
        this.form.updateValueAndValidity();
      }));
    }
    if (this.data.type == 'productView') {
      this.loader = true;
      this.minDate.setFullYear(this.minDate.getFullYear() - 60);
      this.maxDate.setFullYear(this.maxDate.getFullYear());
      this.form = this.formBuilder.group({
        product: ['', [Validators.required]],
        contractstartdate: [moment, [Validators.nullValidator]],
        contractenddate: [moment, [Validators.nullValidator]],
        isactive: [false, [Validators.nullValidator]],
        processid: [this.userDetails.Processid, Validators.nullValidator],
        productid: [this.userDetails.ProductId, Validators.nullValidator],
        publicip: [this.userDetails.ip, Validators.nullValidator],
        privateip: ['', Validators.nullValidator],
        browsername: [this.userDetails.browser, Validators.nullValidator],
        browserversion: [this.userDetails.browser_version, Validators.nullValidator]
      });
      this.common.setMasterConfig();
      this.subscription.push(this.common.getMasterConfig$.subscribe(data => {
        this.dateFormat = (data.DatePickerFormat);
      }));
      this.getProducts();
      if (this.data.id != null) {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_account_product_mapping',
            parameters: {
              Flag: 'EDIT',
              Id: this.data.id
            }
          }
        };
        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            if (res.results.data.length > 0) {
              const lowerObj = this.common.ConvertKeysToLowerCase();
              this.editobj = res.results.data[0];
              this.form.patchValue(lowerObj(res.results.data[0]));
              var temp = '' + Number(this.editobj.ProductId);
              var intArr = [...temp].reduce((acc, n) => acc.concat(+n), []);
              this.form.get('product').patchValue(intArr);
              this.form.updateValueAndValidity();
            }
          }
        });
      }
    }
    if (this.data.type == 'appSetting') {
      this.userDetails = this.auth.getUser();
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.common.setUserConfig(this.userDetails.ProfileType, 'AppSettings');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data

      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
      this.form = this.formBuilder.group({
        icon: ['', Validators.required],
        title: ['', [Validators.pattern(regex.alphabetWithUnderScore), Validators.required]],
        config: ['', [Validators.pattern(regex.alphabetWithoutSpace), Validators.required]],
        ControlType: ['', Validators.nullValidator],
        Type: ['', Validators.nullValidator],
        ConfigValue: ['', Validators.nullValidator],
        AdditionalProperty: ['', [Validators.nullValidator, Validators.maxLength(3), Validators.minLength(1)]],
      },
        { validator: [checknull('title'), checknull('config')] },


      )
    }

    if (this.data.type == 'addAppSetting' || this.data.type == 'editTreeNode') {
      this.userDetails = this.auth.getUser();
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.common.setUserConfig(this.userDetails.ProfileType, 'AppSettings');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data

      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
      this.form = this.formBuilder.group({
        parentcontrolid: [this.data.parentcontrolid],
        ControlType: ['', Validators.nullValidator],
        icon: ['', Validators.required],
        title: ['', [Validators.pattern(regex.alphabetWithUnderScore), Validators.required]],
        config: ['', [Validators.pattern(regex.alphabetWithoutSpace), Validators.required]],
        Type: ['', Validators.nullValidator],
        ConfigValue: ['', Validators.nullValidator],
        AdditionalProperty: ['', [Validators.nullValidator,Validators.maxLength(3),Validators.minLength(1)]],
      }, {validator:[checknull('title'),checknull('config')]},);
      if (this.data.type == 'editTreeNode') {
        this.form.get('config').disable();
        this.form.get('config').patchValue(this.data.configKey);
        this.form.get('title').patchValue(this.data.Name);
        this.form.get('icon').patchValue((this.data.Icon).trim());
        this.form.get('ControlType').patchValue(this.data.controlType); this.form.updateValueAndValidity();
        this.control = this.data.controlType;
        this.onControlSelected(this.control)
        this.form.get('AdditionalProperty').patchValue(this.data.AdditionalProperty);
        this.form.get('ConfigValue').patchValue(this.control == 'Dropdown' || this.control == 'MultiSelect' ?
          JSON.stringify(this.data.configValue) : this.data.configValue);
        if (this.control == 'Dropdown' || this.control == 'MultiSelect') {
          var getConfigValue = JSON.parse(JSON.stringify(this.data.configValue));

          for (let i = 0; i < getConfigValue.length - 1; i++) {
            const newGroup = new FormGroup({});
            this.displayedFields.forEach(x => {
              newGroup.addControl(x, new FormControl());
            });
            this.myformArray.push(newGroup);
          }
          this.myformArray.setValue(getConfigValue);
        }
      }
    }

    if (this.data.type == 'label') {
      this.subscription.push(this.common.labelView$.subscribe(res => {
        if (res != false) {
          this.product = res.product

        }
      }))
      // this.getLanguage()
      this.getCategory();
      this.form = this.formBuilder.group({
        ProcessId: ['', Validators.nullValidator],
        ProductId: ['', Validators.nullValidator],
        Category: ['', Validators.nullValidator],
        Subcategory: ['', Validators.nullValidator],
        ModuleName: ['', Validators.required],
        SubModule: ['NULL', Validators.nullValidator],
        ColumnName: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
        LabelName: ['', [Validators.required, Validators.maxLength(500)]],
        // Title: ['', [Validators.pattern(regex.alphabetWithUnderScore), Validators.maxLength(100)]],
        // ValidationMessage: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
        // Insert: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
        // Select: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
        // Update: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
        // Delete: ['', [Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
        // Language: ['', Validators.required],
        Key: ['', [Validators.required, Validators.pattern(regex.alphabetWithUnderScore), Validators.maxLength(100)]],
        // IsVisible: [false, Validators.nullValidator],
      })
      this.common.setMasterConfig();
      this.subscription.push(this.common.getMasterConfig$.subscribe(data => {
        this.masterConfig = {
          languages: JSON.parse(data.KnownLanguages),
        }
      }));
      if (this.data.Id != null) {
        var Object1 = {
          data: {
            spname: "usp_unfyd_form_validation",
            parameters: {
              flag: "EDIT",
              Id: this.data.Id,
              ProcessId: this.userDetails.Processid,

            }
          }
        }
        this.api.post('index', Object1).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.loader = false;
            this.editObj = res.results.data[0];
            this.getCategory()
            this.form.patchValue(this.editObj);
            this.form.get('Category').patchValue(this.editObj.ParentModule)
            // this.form.controls.PARENTMODULE.patchValue(this.editObj.Category)
            this.form.controls.Subcategory.patchValue(res.results.data[0].SubModule)
            this.getSubCategory(this.form.value.Category)
            this.getModule(this.form.value.ParentModule)
            this.form.get('ModuleName').patchValue(this.editObj.ModuleName);
            this.form.updateValueAndValidity();
          }
        })
      } else {
        this.loader = false;
      }
    }
    this.subscription.push(this.common.localizationDataAvailable$.subscribe((res) => {
      if (res) {
        this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {
        }))
      }
    }))
    if (this.userDetails) {
      this.common.hubControlEvent(this.data.type, 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');
    }
  }
  getSubCategory(category: any) {

    this.categoryname = category
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET_SUB_MODULE_CATEGORY',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          MODULEGROUPPING: this.categoryname
        },
      },
    };
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(this.requestObj), 'getSubCategory');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.subcategory = res.results.data;

      }
    });
  }

  getCategory() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          FLAG: 'GET_MODULE_CATEGORY',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,

        },
      },
    };
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(this.requestObj), 'getCategory');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.Category = res.results.data;
        this.searchCategory = this.Category.slice();
      }
    });

  }
  getModule(subcategories: any) {

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET_MODULE_LIST',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          MODULEGROUPPING: this.categoryname,
          SUBMODULEGROUPPING: subcategories
        },
      },
    };
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(this.requestObj), 'getModule');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.modules = res.results.data;

      }
    });
  }
  submitlabel() {
    this.loader = true;
    this.submittedForm = true;

    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("General Error");
      return;
    }
    if (this.data.Id == null) {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_form_validation',
          parameters: {
            flag: 'INSERT',
            CREATEDBY: this.userDetails.Id,
            ProcessId: this.userDetails.Processid,
            ProductId: this.product,
            modulename: this.form.get('ModuleName').value,
            PARENTMODULE: this.form.get('Category').value,
            SUBMODULE: this.form.get('Subcategory').value,
            columnname: this.form.get('ColumnName').value,
            labelname: this.form.get('LabelName').value,
            language: this.data.selectedlanguage,
            key: this.form.get('Key').value,
          },
        },
      };
    } else {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_form_validation',
          parameters: {
            flag: 'UPDATE',
            ID: this.data.Id,
            MODIFIEDBY: this.userDetails.Id,
            PARENTMODULE: this.form.get('Category').value,
            SUBMODULE: this.form.get('Subcategory').value,
            modulename: this.form.get('ModuleName').value,
            columnname: this.form.get('ColumnName').value,
            labelname: this.form.get('LabelName').value,
            // title: this.form.get('Title').value,
            language: this.data.selectedlanguage,
            key: this.form.get('Key').value,
            // validationmessage: this.form.get('ValidationMessage').value,
            // isvisible: this.form.get('IsVisible').value
          },
        },
      };
    }

    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'submitlabel');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if ((res.results.data[0].result.includes('already exists')) && (res.results.data[0].Status == false)) {
          this.common.snackbar('Exists');
          this.loader = false;
        }
         else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
             this.common.getIndividualUpload$.subscribe(status => {
           if(status.status){
            this.requestObj = {
              data: {
                spname: 'usp_unfyd_form_validation',
                parameters: {
                  flag: 'ACTIVATE',
                  CREATEDBY: this.userDetails.Id,
                  ProcessId: this.userDetails.Processid,
                  ProductId: this.product,
                  modulename: this.form.get('ModuleName').value,
                  PARENTMODULE: this.form.get('Category').value,
                  SUBMODULE: this.form.get('Subcategory').value,
                  columnname: this.form.get('ColumnName').value,
                  labelname: this.form.get('LabelName').value,
                  language: this.data.selectedlanguage,
                  key: this.form.get('Key').value,
                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res: any) => {
              if (res.code == 200) {
                this.loader = false;
                this.closeDialog(true)
                this.common.snackbar('Record add');

              }
            });
          }
           this.subscriptionAcitivateData.forEach((e) => {
             e.unsubscribe();
           });
           }))


        }
        if (res.results.data[0].result.includes('added successfully')) {
          this.loader = false;
          this.closeDialog(true)
          this.common.snackbar('Record add');
        } else if (res.results.data[0].result.includes('updated successfully')) {
          this.closeDialog(true)
        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })

  }


  orchestrationval() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'orchestrationvaldialog');

    if (this.form.value.rule != 10) {
      this.form.get('button').setValidators(Validators.required);
      this.form.get('andor').setValidators(Validators.required);
    } else {
      this.form.get('button').setValidators(Validators.nullValidator);
    }
    this.form.get('button').updateValueAndValidity();
    this.form.get('andor').updateValueAndValidity();
    this.form.updateValueAndValidity()
  }

  andorval() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'andorval');

    if (this.data.andortype) {
      this.form.get('andor').setValidators(Validators.required);
    } else {

      this.form.get('andor').setValidators(Validators.nullValidator);
    }
    this.form.get('button').updateValueAndValidity();
    this.form.get('andor').updateValueAndValidity();
    this.form.updateValueAndValidity()
  }



  actionTab: any;
  actions(e) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', e, 'actions');

    this.actionTab = e.value;
    this.actionname = e.value == 'Multiple' ? e.value : '';
  }

  Multi(): FormArray {
    return this.form.get("Multi") as FormArray
  }
  newMulti(): FormGroup {
    return this.formBuilder.group({
      Textbox: new FormControl('', [Validators.required]),
    })
  }
  addMulti() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'addMulti');

    this.Multi().push(this.newMulti());
  }
  removeMulti(i: number) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', i, 'removeMulti');

    this.Multi().removeAt(i);
  }

  addAppControl() {
    this.loader = true;
    this.submittedForm = true;
    for (const key of Object.keys(this.form.controls)) {
      if (this.form.value?.ControlType == 'Dropdown'
        || this.form.value?.ControlType == 'MultiSelect') {
        if (key == "ConfigValue") {
          try {
            const result = Array.isArray(JSON.parse(this.form.value.ConfigValue));
            this.errorval = false;
          }
          catch (e) {
            this.errorval = true;
            return
          }
        }
      }
      if (this.form.invalid) {
        this.form.markAllAsTouched()
        this.loader = false;
        for (const key of Object.keys(this.form.controls)) {
          if (this.form.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
          }
        }
        this.form.markAllAsTouched();
        return;
      }
    }
    this.requestObj = {
      data: {
        spname: "usp_unfyd_app_settings",
        parameters: {
          flag: this.data.type == 'editTreeNode' ? 'UPDATE' : 'INSERT',
          LabelName: this.form.get('title').value.trim(),
          ConfigKey: this.form.get('config').value.trim(),
          Icon: this.form.get('icon').value,
          ControlType: this.form.get('ControlType').value == "" ? "DateTime" : this.form.get('ControlType').value,
          Type: this.form.get('Type').value,
          AdditionalProperty: this.form.get('AdditionalProperty').value,
          processid: this.userDetails.Processid,
          CreatedBy: this.data.type == 'editTreeNode' ? undefined : this.userDetails.Id,
          ModifiedBy: this.data.type == 'editTreeNode' ? this.userDetails.Id : undefined,
          ID: this.data.type == 'editTreeNode' ? this.data.Id : undefined,
          productid: this.data.productId,
          parentcontrolid: this.form.value.parentcontrolid,
          ConfigValue: this.form.value.ConfigValue
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'addAppControl');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {

        if ((res.results.data[0].result.includes('already exists')) && (res.results.data[0].Status == false)) {
          this.common.snackbar('Exists');
          this.loader = false;
        }
        else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_app_settings",
                    parameters: {
                      flag: 'ACTIVATE',
                      ConfigKey: this.form.get('config').value,
                      processid: this.userDetails.Processid,
                      productid: this.data.productId,
                      modifiedby: this.userDetails.Id,
                      PUBLICIP: this.userDetails.ip,
                      BROWSERNAME: this.userDetails.browser,
                      BROWSERVERSION: this.userDetails.browser_version,
                    }
                  }
                };

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (res.results.data[0].result == 'Data enabled successfully') {
                      this.closeDialog(true);
                      this.form.reset();
                      this.common.snackbar('Record add');
                    }
                  }
                });

              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))
        }

        if (res.results.data[0].result == 'Data updated successfully') {
          this.loader = false;
          this.closeDialog(true)
          this.common.snackbar('Update Success')

        }
        if (res.results.data[0].result == 'Data saved successfully') {
          this.loader = false;
          this.closeDialog(true)
          this.common.snackbar('Record add')
        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      });

  }
  submitapp() {
    this.submittedForm = true;
    for (const key of Object.keys(this.form.controls)) {
      if (this.form.value?.ControlType == 'Dropdown'
        || this.form.value?.ControlType == 'MultiSelect') {
        if (key == "ConfigValue") {
          try {
            const result = Array.isArray(JSON.parse(this.form.value.ConfigValue));
            this.errorval = false;
          }
          catch (e) {
            this.errorval = true;
            return
          }
        }
      }
    }

     if (this.form.invalid) {
      this.loader = false;
      this.form.markAllAsTouched();
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.form.markAllAsTouched();
      return;
    }
    this.requestObj = {
      data: {
        spname: "usp_unfyd_app_settings",
        parameters: {
          flag: 'INSERT',
          LabelName: this.form.get('title').value.trim(),
          ConfigKey: this.form.get('config').value.trim(),
          Icon: this.form.get('icon').value,
          ControlType: this.form.get('ControlType').value == "" ? "DateTime" : this.form.get('ControlType').value,
          Type: this.form.get('Type').value,
          AdditionalProperty: this.form.get('AdditionalProperty').value,
          ConfigValue: this.form.value.ConfigValue,
          parentcontrolid: this.form.value.parentcontrolid,
          processid: this.userDetails.Processid,
          CreatedBy: this.userDetails.Id,
          productid: this.data.productId,

        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'submitapp');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {

        if ((res.results.data[0].result.includes('already exists')) && (res.results.data[0].Status == false)) {
          this.common.snackbar('Exists');
          this.loader = false;
        }
        else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_app_settings",
                    parameters: {
                      flag: 'ACTIVATE',
                      ConfigKey: this.form.get('config').value,
                      processid: this.userDetails.Processid,
                      productid: this.data.productId,
                      modifiedby: this.userDetails.Id,
                      PUBLICIP: this.userDetails.ip,
                      BROWSERNAME: this.userDetails.browser,
                      BROWSERVERSION: this.userDetails.browser_version,
                    }
                  }
                };

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (res.results.data[0].result == 'Data enabled successfully') {
                      this.closeDialog(true);
                      this.form.reset();
                      this.common.snackbar('Record add');
                    }
                  }
                });

              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))
        }

        if (res.results.data[0].result == 'Data saved successfully') {
          this.closeDialog(true);
          this.form.reset();
          this.common.snackbar('Record add');
        }
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      });

  }

  addfeaturecontrol() {

    this.submittedForm = true;
    for (const key of Object.keys(this.form.controls)) {
      if (this.form.value?.ControlType == 'Dropdown'
        || this.form.value?.ControlType == 'MultiSelect') {
        if (key == "ConfigValue") {
          try {
            const result = Array.isArray(JSON.parse(this.form.value.ConfigValue));
            this.errorval = false;
          }
          catch (e) {
            this.errorval = true;
            return
          }
        }
      }

      if (this.form.invalid) {
        this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.form.markAllAsTouched()

      return;
    }}
    //Cretes Variable for storing the value of key because in activated data getting value null
    this.configV = this.form.value.ConfigValue;
    this.configK = this.form.value.ConfigKey;
    this.assignlabel = this.form.value.Label;
    this.controlT = this.form.value.ControlType;
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_feature_control",
        "parameters": {
          flag: this.data.type == 'editFeatureControl' ? 'UPDATE' : "INSERT_CHILD_MODULE",
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          modulename: this.data.moduleName,
          productname: this.data.productName,
          roleid: this.roleid,
          languagecode: "en",
          createdby: this.data.type == 'editFeatureControl' ? undefined : this.userDetails.Id,
          modifiedby: this.data.type == 'editFeatureControl' ? this.userDetails.Id : undefined,
          parentcontrolid: this.data.parentcontrolid,
          controltype: this.form.value.ControlType,
          ConfigKey: this.form.value.ConfigKey,
          AssignedPropertyLabel: this.form.value.Label == null ? null : this.form.value.Label.trim(),
          ACCESSCONTROLID: this.data.accessControlId,
          Id: this.data.type == 'editFeatureControl' ? this.data.nodeId : undefined,
          ConfigValue: this.form.value.ConfigValue
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'addfeaturecontrol');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.reloadDataMethod(true);
        if (res.results.data[0].result == "Data saved successfully") {
          this.common.snackbar("Record add");
        }
        // if(res.results.data[0].result == "Data updated successfully"){
        //   this.common.snackbar("Update Success");
        //   this.closeDialog(true);
        // }

        else if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar("Update Success");
          this.closeDialog(true);

          if (res.results.data[0].hasOwnProperty('result')) {
            if (res.results.data[0].result.includes("already exists"))
              this.common.snackbar('Exists');
            else {
              // this.common.snackbar("Success");
              this.form.reset()
              this.form.controls.ControlType.setErrors(null);
              this.form.controls.Label.setErrors(null);
              this.form.controls.ConfigKey.setErrors(null);

              this.submittedForm = false;
            }
          }
        }

        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status == true) {

                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_feature_control",
                    parameters: {
                      flag: 'ACTIVATE_CHILD_MODULE',
                      processid: this.userDetails.Processid,
                      productid: this.userDetails.ProductId,
                      modulename: this.data.moduleName,
                      productname: this.data.productName,
                      roleid: this.roleid,
                      languagecode: "en",
                      createdby: this.data.type == 'editFeatureControl' ? undefined : this.userDetails.Id,
                      modifiedby: this.data.type == 'editFeatureControl' ? this.userDetails.Id : undefined,
                      parentcontrolid: this.data.parentcontrolid,
                      controltype: this.controlT,
                      ConfigKey: this.configK,
                      AssignedPropertyLabel: this.assignlabel,
                      ACCESSCONTROLID: this.data.accessControlId,
                      Id: this.data.type == 'editFeatureControl' ? this.data.nodeId : undefined,
                      ConfigValue: this.configV
                    }
                  }
                };

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    // this.common.snackbar(res.results.data[0].result, "Record add");
                    this.common.reloadDataMethod(true);
                    this.common.snackbar("Saved Success");
                    this.closeDialog(true);
                    this.submittedForm = false;
                    this.loader = false;
                  }
                });

              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))

        }
        else if ((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }



        this.loader = false;

        this.form.reset();
        this.myformArray.reset();
        // if (this.myformArray.length > 0) {
        //   this.myformArray.removeAt(0)
        // }
        // this.myformArray.value.forEach(element => {
        //   element.get('Key').reset();
        //   element.get('Value').reset()
        //   element.Key.setValue(null)
        //   element.Value.setValue(null)
        // });
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      });


  }

  changeTileDropdown() {

    if (this.tile.subPlaceHolder3SelectedValue == 'lineChart') {
      this.options1 = {
        xAxis: {
          type: "category",

          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ffffff",
              width: 2,
            },
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: "{c}",
          borderWidth: 0,
          padding: 10,
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#ffffff",
              width: 2,
            },
          },
          splitLine: {
            show: false,
          },
        },
        grid: {
          top: "5%",
          left: "0%",
          right: "0%",
          bottom: "5%",
        },

        series: [
          {
            data: [20, 20, 10, 8, 1, 5, 15],
            type: "line",
            symbolSize: 5,
            color: "#ffffff",
            lineStyle: {
              color: "#ffffff",
              width: 2,
              type: "solid",
            },
            itemStyle: {
            },
          },
        ],
      };
    } else if (this.tile.subPlaceHolder3SelectedValue == 'gaugeChart') {
      this.options1 = {
        series: [
          {
            type: "gauge",
            startAngle: 90,
            endAngle: -270,
            detail: {
              formatter: "{value}%",
              offsetCenter: ["0%", "8%"],
              color: "#ffffff",
              align: "center",
              fontSize: "12px",
            },
            color: "#ffffff",
            radius: "100%",

            pointer: {
              show: false,
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 0.5,
                borderColor: "#FFFFFF",
              },
            },
            axisLine: {
              lineStyle: {
                width: 5,
                shadowColor: "#FBAD17",
                opacity: 0.5,
              },
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 1,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              distance: 5,
            },
            data: [
              {
                value: 0,
              },
            ],
          },
        ],
      };
    }
  }

  getProducts() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_account_product_mapping',
        parameters: {
          Flag: 'GET_PRODUCT',
          ProcessId: this.userDetails.Processid,
          AccountID: this.data.actionId
        }
      }
    };
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getProducts');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          this.products = res.results.data;
        }
      }
    });
  }
  flip() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'flip');

    this.isDisabled = !this.isDisabled;

  }
  directUpload(event, max_width, max_height) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'directUpload');

    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_holiday_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
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
            this.common.snackbar("File Size");
          } else {
            this.loginLoader = true;
            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                this.loginImg = res.results.URL;
                this.loginLoader = false;
              }

            })
          }
        };
      };

      reader.readAsDataURL(file);

    }
  }


  getServiceContract() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          FLAG: "ServiceContract"
        },
      },
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getServiceContract');

    this.api.post("index", this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data.length > 0) {
          this.serviceContract = res.results.data;
        }
      }
    });
  }
  getCity() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          FLAG: "city_account"
        },
      },
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getCity');

    this.api.post("index", this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data.length > 0) {
          this.cities = res.results.data;
        }
      }
    });
  }
  getParentAccount() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          FLAG: "ParentAccount"
        },
      },
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getParentAccount');

    this.api.post("index", this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data.length > 0) {
          this.parentAccount = res.results.data;
        }
      }
    });
  }
  contactAction(id, type) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(id, type), 'contactAction');

    if (this.data.type == 'editlocalizationViewTable') {
      if (type == 'Edit') {
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            type: 'label',
            id: id,
            data: this.data,
          },
          width: '900px',

        });

        dialogRef.afterClosed().subscribe(status => {
          if (status) {
            this.getTableDataLocalizationlanguages(this.data.langData.LanguageCode)
          }
        });
      }
    }
  }

  getSnapShot() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'getSnapShot');

    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.common.setUserConfig(this.userDetails.ProfileType, 'holidays');
    this.subscription.push(this.common.getUserConfig$.subscribe(data => {
      this.userConfig = data;
    }));
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.common.setMasterConfig();
    this.subscription.push(this.common.getMasterConfig$.subscribe(data => {
      this.masterConfig = {
        languages: JSON.parse(data.KnownLanguages),
      }
    }));
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(data), 'setLabelByLanguage');

    this.loader = true;
    if (this.data.type == 'addDashboardCard') {
      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'Dashboard', data)

    } else if (this.data.type == 'previewMasking') {
      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'MaskingRule', data)

    }
    else if (this.data.type == 'alert-setting') {
      this.dialogRef.disableClose = true;
      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'AlertMessage', data)

    } else if (this.data.type == 'Webchat-Name-popup') {
      this.dialogRef.disableClose = true;
      this.loader = true
    } else if (this.data.type == 'appSetting') {
      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'AppSettings', data)

    } else if (this.data.type == 'addAppSetting' || this.data.type == 'editTreeNode') {
      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'AppSettings', data)

    } else if (this.data.type == 'addSecurityKey') {
      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'SecurityAndCompliance', data)

    } else if (this.data.type == 'addFeatureControl' || this.data.type == 'editFeatureControl' || this.data.type == 'addAccessControl') {
      this.loader = true
      this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'FeatureControls', data)

    } else if (this.data.type == 'HolidaysAdd') {
      this.common.setLabelConfig(this.userDetails.Processid, 'Holidays ', data)
      this.common.getLabelConfig$.subscribe(data => {

        this.labelName = data;
      });
    } else if (this.data.type == 'hour' || this.data.type == 'day') {
      this.common.setLabelConfig(this.userDetails.Processid, 'BusinessHours', data)
      this.common.getLabelConfig$.subscribe(data => {

        this.labelName = data;
      });
    } else if (this.data.type == 'businesshours' || this.data.type == 'rechurnrule' || this.data.type == 'sortcondition' || this.data.type == 'filtercondition' || this.data.type == 'taskGroupMaster' || this.data.type == 'configureApiTaskGroup' || this.data.type == 'editSystemDefinedFields' || this.data.type == 'taskGroupRechurnAction') {
      this.common.setLabelConfig(this.userDetails?.Processid, 'TaskGroup', data)
      this.common.getLabelConfig$.subscribe(data => {
        this.labelName = data;
      });
    } else {
      this.common.setLabelConfig(this.userDetails.Processid, 'holidays', data)
      this.common.getLabelConfig$.subscribe(data => {
        this.labelName = data;
      });
    }
  }

  formatDate(date) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(date), 'formatDate');

    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }


  openDialog(type, id) {

    if (this.data.type == 'editlocalizationViewTable') {
      this.common.confirmationToMakeDefault('ConfirmationToDelete');
      this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
        if (status.status) {
          var requestObj = {
            data: {
              spname: 'usp_unfyd_form_validation',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.Id,
              },
            },
          };
          this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(type, id), 'openDialog');

          this.api.post('index', requestObj).subscribe((res) => {
            if (res.code == 200) {
              this.common.snackbar("Deleted Successfully", 'success');
              this.getTableDataLocalizationlanguages(this.data.langData.LanguageCode)

            }
          });
        }


        this.subscriptionBulkDelete.forEach((e) => {
          e.unsubscribe();
        });
      }
      ))
    } else if (this.data.type == 'addCondition') {
      this.common.confirmationToMakeDefault('ConfirmationToDelete');
      this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
        if (status.status = true && type == 'delete') {
          var obj = {
            data: {
              spname: "USP_RULEMASTER_PROC",
              parameters: {
                FLAG: "DELETE_RULE_CONDITION",
                ID: id,
              },
            },
          };
          this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(type, id), 'openDialog');

          this.api.post("index", obj).subscribe(
            (res) => {
              if (res.code == 200) {
                this.loader = false;
                this.common.snackbar(res.results.data[0].result, "sucess")
                this.closeDialog(false);
              } else {
                this.loader = false;
                this.common.snackbar("Something went wrong.", "error");
              }
            },
          );
        }


        this.subscriptionBulkDelete.forEach((e) => {
          e.unsubscribe();
        });
      }
      ))
    }

  }

  changeStatus(refData: any, index: any) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(refData), 'changeStatus');

    let i = 0;
    this.tabValue.forEach(element => {
      if (element.Id == refData.Id) {
        this.tabValue[i].Status = !refData.Status;
        if (this.updateModules.length > 0) {
          let j = 0;
          let add = false;
          this.updateModules.forEach(element => {
            if (element.Id == refData.Id) {
              this.updateModules[j].Status = this.tabValue[i].Status
              add = true;
            }
            j++;
          });

          if (!add) {
            let obj = {
              Id: this.tabValue[i].Id,
              Status: this.tabValue[i].Status
            }
            this.updateModules.push(obj)
          }
        } else {
          let obj = {
            Id: this.tabValue[i].Id,
            Status: this.tabValue[i].Status
          }
          this.updateModules.push(obj)
        }

      }
      i++;
    });
  }

fileDuplicate(data){
    var today = new Date();
    var dd = new Date().getDate();
    var mm = new Date().getMonth() + 1;
    var yyyy = new Date().getFullYear();
    var time = today.getHours().toString() + today.getMinutes().toString();
    var uniqueIdWebchat = 'WEBCHAT' + dd + mm + yyyy + time;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_webchat_config',
        parameters: {
          flag: "REPLICATE_WEBCHAT",
          CHANNELID: this.data.productID,
          CHANNELNAME: "WEBCHAT",
          CHANNELSRCID: data,
          BROWSERNAME: "",
          BROWSERVALUE: "",
          CREATEDBY: "",
          PROCESSID: this.userDetails.Processid,
          PRODUCTID: this.userDetails.ProductId,
          PUBLICIP: "",
          PRIVATEIP: "",
          UNIQUEID: uniqueIdWebchat
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false;
        this.common.snackbar('Duplicated Created Succuessfully', 'success');
        //this.getWebchatlist();
        this.dialogRef.close(true)
      } else{
        this.common.snackbar('Something went wrong', 'error');
      }
    });
  }

    saveWebchat() {
    this.submittedForm = true;
    this.loader = true;
    if (this.form.invalid) {
      this.loader = false;
      return;
    }
    if(this.form.value.webchatSelected){
      this.fileDuplicate(this.form.value.webchatSelected)
    } else {
    let obj11 = {
      data: {
        spname: "usp_unfyd_channel_config",
        parameters: {
          flag: 'INSERT_CHANNELSOURCE_MST',
          processid: this.userDetails.Processid,
          CHANNELID: this.data.id,
          CREATEDBY: this.userDetails.Id,
          CHANNELSRCNAME: this.form.value.WebchatName
        }
      }
    }
    this.api.post('index', obj11).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader= false;
        if (res.results.data[0].result == 'success') {
          let ChSrcId = res.results.data[0].Id;
          let count = 0;
          var today = new Date();
          var dd = new Date().getDate();
          var mm = new Date().getMonth() + 1;
          var yyyy = new Date().getFullYear();
          var time = today.getHours().toString() + today.getMinutes().toString();
          var uniqueIdWebchat = 'WEBCHAT' + dd + mm + yyyy + time;
          console.log("WebChatData", this.webchatForm.value);
          
          for (var i in this.webchatForm.value) {
            let val = this.webchatForm.value[i];

            if (i == 'languageSelected' || i == 'FileFormatSelected' || i == 'botFlowSelected') {
              val = this.webchatForm.value[i] ? this.webchatForm.value[i].join(",") : '';
            } else if (i == 'themeColor') {
              val = this.common.color[this.webchatForm.value[i]];
            }  else if (i == 'WebchatName') {
              val = this.form.value.WebchatName;
            }
            let obj1 = {
              data: {
                spname: "usp_unfyd_webchat_config",
                parameters: {
                  flag: "INSERT",
                  CHANNELID: this.data.id,
                  CHANNELNAME: "WEBCHAT",
                  PARENTCONTROLID: "1",
                  ASSIGNEDVALUE: "",
                  ASSIGNEDPROPERTY: "",
                  ADDITIONALPROPERTY: "",
                  DEFAULTVALUE: "",
                  STATUS: "",
                  PROCESSID: this.userDetails.Processid,
                  PRODUCTID: this.userDetails.ProductId,
                  LANGUAGECODE: "",
                  CREATEDBY: this.userDetails.Id,
                  BROWSERNAME: "",
                  BROWSERVALUE: "",
                  PUBLICIP: "",
                  PRIVATEIP: "",
                  CONFIGKEY: i,
                  CONFIGVALUE: val,
                  UNIQUEID: uniqueIdWebchat,
                  CHANNELSRCID: ChSrcId,
                  CONFIGTYPE: ""
                }
              }
            }
            //console.log("Data Inserted", obj1)
            this.api.post('index', obj1).subscribe(res => {
              // this.loader = true;
              if (res.code == 200) {
                this.loader= false;
                //console.log("hello", res)
                count++;
                if (count == Object.keys(this.webchatForm.value).length) {
                  // this.loader = true;
                  this.dialog.closeAll();
                  // this.router.navigate(['/masters/channel-configuration/configuration-webchat/2'],
                  //   { queryParams: { webchatName: this.webchatForm.value.WebchatName } }
                  // );
                  this.router.navigate(['/masters/channel-configuration/configuration-webchat/',this.data.id,'UPDATE',ChSrcId])
                  this.common.snackbar("Data Submitted Succesfully", "success");
                }
                // this.loader = false;
              }
            }, (error) => {
             // console.log("Vishal",obj1)
              this.common.snackbar("Something Went Wrong", "error");
            })
          }
        } else if ((res.results.data[0].result.includes('exists')) && (res.results.data[0].ChannelSourceStatus == true) ) {
         
          this.common.snackbar('Data Already Exist');
        }
        else if(res.results.data[0].ChannelSourceStatus == false) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status ) {
                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_webchat_config",
                    parameters: {
                      FLAG : 'ACTIVATE',
                      CHANNELID : this.data.id,
                      // CHANNELSRCNAME : this.WebchatName,
                      CHANNELSRCNAME:this.form.value.WebchatName,
                      MODIFIEDBY : this.userDetails.Id
                    }
                  }

                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    // this.loader = false;
                    this.dialog.closeAll();
                    this.common.pageReloadforWebchat.next(true);
                    this.common.snackbar("Data Retrieved Success");
                  }
                });
                // this.loader = false;
              }
              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))

      }
    }})
  }
  }
  resetfunc() {
    this.form.reset();
  }
  sendChatScript() {
    // this.sendEmail;
    let obj = {
      SENDERNAME: this.form.value.sendEmail,
      SUBJECT: "Webchat Script",
      TEXT: this.data.script
    }
    this.api.rawApi('https://cx1.unfyd.com:4001/SendTranscript', obj).subscribe(res => {
      console.log("Email response", res)
      if (res) {
        this.common.snackbar("success");
        this.closeDialog(false);
      } else {
        //console.log(res);
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        console.log(error);
        this.common.snackbar("General Error");
      })
  }

  getTranscript(page, itemsPerPage) {
    this.requestObj = {
      data: {
        spname: "UNFYD_ADM_RPT_V1_INTERACTIONDETAILS",
        parameters: {
          flag: 'TRANSCRIPT_DATA',
          Id: this.data.Id,
          PAGESIZE: itemsPerPage,
          PAGENO: page
        }
      }
    };
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(page, itemsPerPage), 'getTranscript');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        var temp = [];
        temp = res.results.data[1];
        this.tempRes = res.results.data[0];
        this.tempKey = [];
        this.paginationArray = [];
        for (var key in this.tempRes[0]) {
          if (this.tempRes[0].hasOwnProperty(key)) {
            this.tempKey.push(key);
          }
        }
        for (let i = 1; i <= temp[0]['Total']; i++) {
          this.paginationArray.push(i);
        }
      }
    });
  }

  copyImgPath(res) {

    this.Icon = res
    this.profileImg = res

  }
  get controlsArray(): FormGroup {

    return this.formBuilder.group({
      id: '',
      key: '',
      value: '',
      label: '',
    });
  }


  isNumber(evt) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', evt, 'isNumber');

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  convert(str) {

    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
  }

  uploadDocument(event, category) {

    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event, category), 'uploadDocument');

    this.category = category;
    var data = {
      category: category,
      flag: "INSERT",
      createdby: this.userDetails.Id,
      ...this.userDetails
    }

    if (event == true) {
      this.common.individualUpload(data)
    }
  }

  reset() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'reset');
    this.submittedForm=false
    this.form.reset();
    if(this.data.type == 'alert-setting'){
      setTimeout(() => {
        this.form.controls.alertMsgType.patchValue(addAlert.alertMsgType[0].key)
        this.applyMsgType(this.form.value.alertMsgType);
      this.form.controls.alertMsgSubType.patchValue(addAlert.alertMsgSubType[0].key)
      this.form.controls.alertPopupIcon.patchValue(addAlert.imgDropdown[0].Value)
      this.form.updateValueAndValidity()
      });

    }
  }
  button(e) {
    this.pophead = false
   this.typeofbutton = false
    // e.value === undefined ? e : e.value
    this.buttonname = e.value == 'Existing' || e.value == 'Custom'   ? e.value : ''
    if ( e.value == undefined ) {
      this.buttonname = e == 'Existing' || e == 'Custom'   ? e : ''
    }
  }
  EnableLogRadio(e) {
    this.Logbuttonname = e.value == 'Days' || e.value == 'NumberOfFiles'   ? e.value : ''
    if ( e.value == undefined ) {
      this.Logbuttonname = e == 'Days' || e == 'NumberOfFiles'   ? e : ''
    }
  }
  place(): FormArray {
    return this.form.get("place") as FormArray
  }
  newplace(): FormGroup {
    return this.formBuilder.group({
      parameters: new FormControl('', [Validators.required]),
      holders: new FormControl('', [Validators.required,Validators.pattern(regex.alphabet),noSpaceValidator.cannotContainSpace]),
    },
    {validator:[checknull1('holders')]},
    )
  }
  addplace() {
    let placearr = this.place().controls.length
    this.place().push(this.newplace());
    let finalplacearr = placearr + 1;
     this.popbody = false
    var arrayControl = this.form.get('place') as FormArray;
    (arrayControl.at(placearr) as FormGroup).get('parameters').patchValue('Button'+finalplacearr);

  }
  removeplace(i: number) {
    this.place().removeAt(this.place.length-1);
    this.form.updateValueAndValidity();
  }



  alertMsgData(flag: any) {
    this.submittedForm = true
    var actionArrayControl = [];



    if (this.form.controls['alertMsg'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsg' + '"]');
      invalidControl.focus();
      return;
    }
    if (this.form.controls['alertMsgType'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgType' + '"]');
      invalidControl.focus();
      return;
    }
    if (this.form.controls['alertMsgSubType'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgSubType' + '"]');
      invalidControl.focus();
      return;
    }
    if (this.form.controls['language'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'language' + '"]');
      invalidControl.focus();
      return;
    }
    if (this.form.controls['alertMsgPos'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgPos' + '"]');
      invalidControl.focus();
      return;
    }

    if (this.form.controls['description'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'description' + '"]');
      invalidControl.focus();
      // this.popbody = true;
      return;
    }

    if (this.form.value.alertMsgType == 'toaster') {
      if (this.form.controls['alertMsgDur'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'alertMsgDur' + '"]');
        invalidControl.focus();
        return;
      }
    }
    if (this.form.value.buttontype == 'Existing') {
      for (const key of Object.keys(this.form.controls)) {
        if (key == "selectBtn") {
          if (this.form.value.selectBtn == '' || this.form.value.selectBtn == undefined || this.form.value.selectBtn == null) {
            this.existbutton = true;
            return;
          }
          else this.existbutton = false;
        }
      }
    }
    if (this.form.value.alertMsgType == 'popup') {
      for (const key of Object.keys(this.form.controls)) {
        if (key == "buttontype") {
          if (!this.form.value.buttontype) {
            this.buttonval = true;
            this.typeofbutton = true;
            return;
          }
        }
      }
    }
    if (this.form.value.buttontype == "Custom") {
      for (const key of Object.keys(this.form.controls)) {
        if (key == "place") {
          for (const element of this.form.value.place) {
            if (element.parameters == '') {
              this.buttonval = true;
              return;
            }
            else if (element.holders == '') {
              this.buttonval = true;
              return;
            }
          }
        }
      }

    }
    if (this.form.value.buttontype == "Custom") {
      actionArrayControl = (this.form.get('place') as FormArray).value;
    }
    var temp = [];
    actionArrayControl.forEach((element, index) => {
      if (this.form.value.buttontype == "Custom") {
        temp.push('{"Button" : "' + element.parameters + '","Value" : "' + element.holders + '"}');
        // temp.push({ [element.parameters]: element.holders });
        // temp[index] = '"' + element.parameters + '":' + '"' + element.holders + '"';
      }
    });
    if (flag == 'DELETE') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_alert_msg_config',
          parameters: {
            flag: 'DELETE',
            ID: this.userDetails.ID,
            DELETEDBY: this.userDetails.EmployeeId,
          },
        },
      };
    }
    else if (flag == 'INSERT' && this.data.formType == "edit") {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_alert_msg_config',
          parameters: {
            flag: 'UPDATE',
            ID: this.data.data.Actionable,
            ALERTMSG: this.form.value.alertMsg ,
            ALERTMSGTYPE: this.form.value.alertMsgType,
            ALERTMSGSUBTYPE: this.form.value.alertMsgSubType,
            LANGUAGECODE: this.form.value.language,
            ALERTMSGPOSITION: this.form.value.alertMsgPos,
            ALERTMSGDURATION: this.form.value.alertMsgDur,
            REMARKS: this.form.value.description == null ? null : this.form.value.description.trim(),
            ButtonCategory: this.form.value.buttontype,
            POPUPICON: this.form.value.alertMsgType == 'popup' ? true : false,
            POPUPICONURL: this.form.value.alertPopupIcon,
            MSGHEAD: this.form.value.msgHead == null ? null : this.form.value.msgHead.trim(),
            MSGBODY: this.form.value.msgBody == null ? null : this.form.value.msgBody.trim(),
            BUTTONTYPE: this.form.value.buttontype == "Existing" ? this.form.value.selectBtn : temp.join(","),
            MODIFIEDBY: this.userDetails.Id,
          },
        },
      };
    }
    else if (flag == 'UPDATE') {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_alert_msg_config',
          parameters: {
            flag: 'INSERT',
            "ALERTMSG": this.form.value.alertMsg == null ? null : this.form.value.alertMsg.trim(),
            "ALERTMSGTYPE": this.form.value.alertMsgType,
            "ALERTMSGSUBTYPE": this.form.value.alertMsgSubType,
            "LANGUAGECODE": this.form.value.language,
            "ALERTMSGPOSITION": this.form.value.alertMsgPos,
            "ALERTMSGDURATION": this.form.value.alertMsgDur,
            "REMARKS": this.form.value.description == null ? null : this.form.value.description.trim(),
            "POPUPICON": this.form.value.alertMsgType == 'popup' ? true : false,
            // this.Icon ? true : false,
            "POPUPICONURL": this.form.value.alertPopupIcon,
            "MSGHEAD": this.form.value.msgHead == null ? null : this.form.value.msgHead.trim(),
            "MSGBODY": this.form.value.description == null ? null : this.form.value.description.trim(),
            "BUTTONTYPE": this.form.value.buttontype == "Existing" ? this.form.value.selectBtn : temp.join(","),
            "PRODUCTID": this.data.productID,
            "PROCESSID": this.userDetails.Processid,
            "CREATEDBY": this.userDetails.Id,
            "ButtonCategory": this.form.value.buttontype,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
          },
        },
      };
    }
    else if (flag == 'INSERT' && this.data.formType != "edit") {


      this.requestObj = {

        data: {
          spname: 'usp_unfyd_alert_msg_config',
          parameters: {
            flag: 'INSERT',
            "ALERTMSG": this.form.value.alertMsg == null ? null : this.form.value.alertMsg.trim(),
            "ALERTMSGTYPE": this.form.value.alertMsgType,
            "ALERTMSGSUBTYPE": this.form.value.alertMsgSubType,
            "LANGUAGECODE": this.form.value.language,
            "ALERTMSGPOSITION": this.form.value.alertMsgPos,
            "ALERTMSGDURATION": this.form.value.alertMsgDur,
            "REMARKS": this.form.value.description == null ? null : this.form.value.description.trim(),
            "POPUPICON": this.form.value.alertMsgType == 'popup' ? true : false,
            // this.Icon ? true : false,
            "POPUPICONURL": this.form.value.alertPopupIcon,
            "MSGHEAD": this.form.value.msgHead == null ? null : this.form.value.msgHead.trim(),
            "MSGBODY": this.form.value.description == null ? null : this.form.value.description.trim(),
            "ButtonCategory": this.form.value.buttontype,
            "BUTTONTYPE": this.form.value.buttontype == "Existing" ? this.form.value.selectBtn : temp.join(","),
            "PRODUCTID": this.data.productID,
            "PROCESSID": this.userDetails.Processid,
            "CREATEDBY": this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
          },
        },
      };
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'alertMsgData');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = true;
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == "Data added successfully") {
          this.common.snackbar('Record add');
          this.closeDialog(true);
        }
        else if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');
          this.closeDialog(true);
        }
        else if ((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Exists');
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_alert_msg_config",
                    parameters: {
                      flag: 'ACTIVATE',
                      "ALERTMSG": this.form.value.alertMsg,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                    }
                  }
                };
                this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'alertMsgData');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    this.closeDialog(true);
                  }
                });
              }
              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))



        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("Add Error");
      })

  }

  save() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'savedialog');

    this.loader = true;
    this.dialogRef.close(
      {
        data: this.form.getRawValue(),
        status: true,
        type: this.data.type == 'add' ? 'add' : 'edit'
      })
  }


  savewhatsapp(event) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'savewhatsapp');

    if (event == 'add') {
      this.loader = true;
      this.dialogRef.close({ data: this.whatsappchanelform.value, type: 'whatsapp' });
    }
    else if (event == 'edit') {
      this.loader = true;
      this.dialogRef.close({ data: this.whatsappchanelform.value, type: 'whatsapp' });
    }

  }
  changeEdit() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'changeEdit');

    this.editwts = true;
  }
  deletewhatsappp() {

    let obj = {
      data: {
        spname: "usp_unfyd_channel_config",
        parameters: {
          flag: 'DELETE',
          CHANNELID: parseInt(this.data.channelId),
          uniqueid: this.data.UniqueID,
        }
      }
    };
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'deletewhatsappp');

    this.api.post('index', obj).subscribe(
      (res: any) => {

        if (res.code == 200) {
          this.loader = false;
          this.common.snackbar("Add Success");
        } else {
          this.loader = false;
        }
      });
  }


  errorMsg() {
    this.passwordHistoryMatch = false;
    if (this.fcp.confirmPassword.value == this.fcp.newPassword.value && this.fcp.confirmPassword.value.length > 0) {
      this.passwordmatch = true;
      this.passwordNotMatchval = false;
    }
    if (this.fcp.confirmPassword.value != this.fcp.newPassword.value) {
      this.passwordmatch = false;
      if (this.fcp.confirmPassword.value.length > 3) {
        this.passwordNotMatchval = true;
      }
    }
    if((this.fcp.confirmPassword.value.length == 0 && this.fcp.newPassword.value.length == 0)  
        || this.fcp.confirmPassword.value == '' || this.fcp.newPassword.value == ''){
      this.passwordNotMatchval = false;
    }
  }
  notSame = true

  submitDashboardChangePassword() {
    this.errorMsg();
    let passhistorylen = this.PasswordHistoryArr.length;
    if (passhistorylen == 0) {
      if (this.PasswordStrengthval == true) {
        var obj = {
          data: {
            spname: "USP_SWA_USER_CHANGEPASSWORD",
            parameters: {
              agentid: this.data.Id,
              password: this.common.setEncrypted('123456$#@$^@1ERF', this.formChangePassword?.get('confirmPassword').value)
            }
          }
        }
        // this.common.hubControlEvent(this.data.type,'click','','',JSON.stringify(obj),'submitChangePassword');

        this.api.post('usercreate', obj).subscribe(res => {
          if (res.code == 200) {
            this.dialogRef.close({
              event: true, data: {
                username: this.data.UserName,
                password: this.formChangePassword?.get('confirmPassword').value,
                id: this.data.Id
              }
            });
            this.common.snackbar('Password Changed Successfully', 'success');

          } else if (res.code == 400) {
            this.common.snackbar("General Error");
          } else {
            this.common.snackbar("General Error");
          }
        }, (error) => {
          this.common.snackbar("General Error");
        })

      }
      else {

        this.common.snackbar('Password Policy Not Satisfied', 'error');
        return;
      }
    }
    else {

      this.decrptedPassHistoryArr.forEach(element => {

        if (element == this.formChangePassword?.get('confirmPassword').value) {
          this.passwordHistoryMatch = true;
          return;
        }
        passhistorylen--
        if (passhistorylen == 0) {
          if (this.PasswordStrengthval == true) {
            var obj = {
              data: {
                spname: "USP_SWA_USER_CHANGEPASSWORD",
                parameters: {
                  agentid: this.data.Id,
                  password: this.common.setEncrypted('123456$#@$^@1ERF', this.formChangePassword?.get('confirmPassword').value)
                }
              }
            }
            // this.common.hubControlEvent(this.data.type,'click','','',JSON.stringify(obj),'submitChangePassword');

            this.api.post('usercreate', obj).subscribe(res => {
              if (res.code == 200) {
                this.dialogRef.close({
                  event: true, data: {
                    username: this.data.UserName,
                    password: this.formChangePassword?.get('confirmPassword').value,
                    id: this.data.Id
                  }
                });
                this.common.snackbar('Password Changed Successfully', 'success');

              } else if (res.code == 400) {
                this.common.snackbar("General Error");
              } else {
                this.common.snackbar("General Error");
              }
            }, (error) => {
              this.common.snackbar("General Error");
            })

          }
          else {

            this.common.snackbar('Password Policy Not Satisfied', 'error');
            return;
          }
        }

      });

    }
  }

  submitChangePassword() {
    this.errorMsg();
    let passhistorylen = this.PasswordHistoryArr.length;
    if (passhistorylen == 0) {
      if (this.PasswordStrengthval == true) {
        var obj = {
          data: {
            spname: "USP_SWA_USER_CHANGEPASSWORD",
            parameters: {
              agentid: this.data.Id,
              password: this.common.setEncrypted('123456$#@$^@1ERF', this.formChangePassword?.get('confirmPassword').value)
            }
          }
        }
        // this.common.hubControlEvent(this.data.type,'click','','',JSON.stringify(obj),'submitChangePassword');

        this.api.post('usercreate', obj).subscribe(res => {
          if (res.code == 200) {
            this.dialogRef.close({
              event: true, data: {
                username: this.data.UserName,
                password: this.formChangePassword?.get('confirmPassword').value,
                id: this.data.Id
              }
            });
            this.common.snackbar('Password Changed Successfully', 'success');

          } else if (res.code == 400) {
            this.common.snackbar("General Error");
          } else {
            this.common.snackbar("General Error");
          }
        }, (error) => {
          this.common.snackbar("General Error");
        })

      }
      else {

        this.common.snackbar('Password Policy Not Satisfied', 'error');
        return;
      }
    }
    else {

      this.decrptedPassHistoryArr.forEach(element => {

        if (element == this.formChangePassword?.get('confirmPassword').value) {
          this.passwordHistoryMatch = true;
          return;
        }
        passhistorylen--
        if (passhistorylen == 0) {
          if (this.PasswordStrengthval == true) {
            var obj = {
              data: {
                spname: "USP_SWA_USER_CHANGEPASSWORD",
                parameters: {
                  agentid: this.data.Id,
                  password: this.common.setEncrypted('123456$#@$^@1ERF', this.formChangePassword?.get('confirmPassword').value)
                }
              }
            }
            // this.common.hubControlEvent(this.data.type,'click','','',JSON.stringify(obj),'submitChangePassword');

            this.api.post('usercreate', obj).subscribe(res => {
              if (res.code == 200) {
                this.dialogRef.close({
                  event: true, data: {
                    username: this.data.UserName,
                    password: this.formChangePassword?.get('confirmPassword').value,
                    id: this.data.Id
                  }
                });
                this.common.snackbar('Password Changed Successfully', 'success');

              } else if (res.code == 400) {
                this.common.snackbar("General Error");
              } else {
                this.common.snackbar("General Error");
              }
            }, (error) => {
              this.common.snackbar("General Error");
            })

          }
          else {

            this.common.snackbar('Password Policy Not Satisfied', 'error');
            return;
          }
        }
      });
    }
  }



  tabValue1(data) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(data), 'tabValue1');

    if (data == 'Inbound') {
      this.tabData = 1
    } else {
      this.tabData = 2
    }
  }
  getErrorMessage() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'getErrorMessage');

    if (this.formChangePassword?.get('newPassword').value != this.formChangePassword?.get('confirmPassword').value) {
      return 'You must enter a value';
    }

    return this.formChangePassword?.hasError('confirmPassword') ? 'Not a valid email' : 'aaaaaaa';
  }
  closeDialogChangePassword(status): void {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(status), 'closeDialogChangePassword');

    this.dialogRef.close(status);
  }

  closeDialog(status: any): void {

    this.dialogRef.close(status);
    if (this.data.type == "addPriv") {
      this.common.reloadDataMethod(true);
    }
    this.common.closePopupvalues(status, this.category, this.imageUrl);
    if (this.data?.data?.data?.icon != undefined && this.data?.data?.data?.icon != null) {
      this.common.closePopupDeleteImg(this.data.data.data.icon)
    }
  }

  closeDialogDepositeRemark(status: any): void {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(status), 'closeDialogDepositeRemark');

    if (status) {
      if (this.form.invalid) {
        this.common.snackbar("Add Error");
        return;
      } else {
        this.dialogRef.close(this.form.value.remarks);
      }
    } else {
      this.dialogRef.close(false);
    }
  }




  validateRegexs(regex: string, key: string): ValidatorFn {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(regex), 'validateRegexs');

    const regexExp = new RegExp(regex)
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isInvalid = regexExp.test(control.value);
      const res = {} as any;
      if (isInvalid) {
        res[key] = { value: control.value }
        return res;
      }
      return null;
    };
  }


  get fcp(): { [key: string]: AbstractControl } {
    return this.formChangePassword.controls;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form?.controls;
  }

  get i(): { [key: string]: AbstractControl } {
    return this.inbound.controls;
  }

  get o(): { [key: string]: AbstractControl } {
    return this.outbound.controls;
  }

  get w(): { [key: string]: AbstractControl } {
    return this.whatsappchanelform.controls;
  }

  getAccessControl() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_access_controls",
        parameters: {
          flag: "GET_ROLE_ACCESS",
          processid: this.userDetails.Processid,
          productid: this.data.productid ? this.data.productid : 1,
          roleid: this.data.roleid,
        }
      }
    }
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(this.requestObj), 'getAccessControl');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.accessControlsLst = res.results['data'];
    });
  }


  saveAccessControl(formDirective: FormGroupDirective): void {
    this.submittedForm = true;
    this.loader = true;
    if (this.form.invalid) {
      this.loader = false;
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="accesscontrolname"]');
      invalidControl.focus();
      // this.common.snackbar("General Error");
      return;
    } else {
      this.requestObj = {
        "data": {
          "spname": "usp_unfyd_access_controls",
          "parameters": {
            flag: "INSERT",
            processid: this.userDetails.Processid,
            productid: this.data.productid,
            roleid: this.data.roleid,
            controlname: this.form.get('accesscontrolname').value,
            createdby: this.userDetails.Id,
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
            publicip: this.userDetails.ip,
            privateip: '',
            oldaccesscontrolid: this.form.controls['oldaccesscontrolid'].value
          }
        }
      }

      this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'saveAccessControl');

      this.api.post('index', this.requestObj).subscribe((res: any) => {
        if (res.code == 200) {
          this.getAccessControl()
          if (res.results.data[0].hasOwnProperty('result')) {
            if (res.results.data[0].result.includes("already exists")) this.common.snackbar('Exists');
            else {
              this.common.snackbar("Saved Success");
              this.form.reset()
              //this.closeDialog(true)
              // this.form.controls.accesscontrolname.setErrors(null);
              this.submittedForm = false;
              formDirective.resetForm()
            }
          }
          this.loader = false;
        }
      },
        (error) => {
          this.common.snackbar("General Error");
          this.loader = false;
        });


    }
  }

  changeCategory(event) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'changeCategory');

    this.category = event
  }

  Changechannel(event) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'Changechannel');

    this.channelname = event
  }

  Changelogo(event) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'Changelogo');

    this.whatsappicon = event
  }

  fileChange1(event) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'fileChange1');

    for (var i = 0; i < event.length; i++) {
      var size = Math.round(event[i].size / 1024);
      var type = event[i].type;
    }

    if (size > 2000) {
      event = null;
      this.disabled = true
      this.imgPreview = null
      this.fileSizeErr = true
    } else if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png' && type !== 'image/gif' && type !== 'application/pdf') {
      event = null;
      this.disabled = true
      this.imgPreview = null
      this.fileType = true
    } else {
      const reader = new FileReader();
      if (event.length > 0) {
        this.disabled = false;
        this.fileSizeErr = false
        this.file = event[0];
        this.fileName = event[0].name;
        this.extention = this.fileName.substring(this.fileName.indexOf(".") + 1);
        reader.readAsDataURL(event[0]);
        reader.onload = () => {
          this.imgPreview = reader.result as string;
        };
        this.fileUpload1('upload')
      }
    }
  }

  fileUpload1(btnType) {
    this.loaderSmall = true;
    this.submittedForm = true;
    const formData = new FormData();
    var filename = this.data.userDetails.EmployeeId + '_' + this.category + '_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, this.file);
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(btnType), 'fileUpload1');

    this.api.post('upload', formData).subscribe(res => {
      if (res.code == 200) {
        this.imageUrl = res.results.URL;

        if (btnType == 'upload') {
          this.loaderSmall = false;
          this.common.snackbar("Saved Success");
        }
      } else {
        this.loaderSmall = false;
      }
    },
      (error) => {
        this.loaderSmall = false;
        this.common.snackbar("General Error");
      })
  }

  fileSizeErr: boolean = false;
  fileType: boolean = false;


  fileChange(event, max_height, max_width) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'fileChange');

    for (var i = 0; i < event.length; i++) {
      var file = event[0];
      var size = Math.round(event[i].size / 1024);
      var type = file.type;
      var type = event[i].type;

    }

    if (size > 2000) {
      event = null;
      this.disabled = true
      this.imgPreview = null
      this.fileSizeErr = true
      this.common.snackbar("File Size");



    } else if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png' && type !== 'image/gif' && type !== 'application/pdf') {
      event = null;
      this.disabled = true
      this.imgPreview = null
      this.fileType = true
      this.common.snackbar("File Type");

    } else {
      const reader = new FileReader();

      if (event.length > 0) {
        this.disabled = false;
        this.fileSizeErr = false
        this.file = event[0];
        this.fileName = event[0].name;
        this.extention = this.fileName.substring(this.fileName.indexOf(".") + 1);
        reader.readAsDataURL(event[0]);
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result
          image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];

            if (img_height > max_height && img_width > max_width) {
              this.common.snackbar("FileReso");
              event = null;
              this.disabled = true
              this.imgPreview = null
              this.fileType = true
              return;
            }
            this.imgPreview = reader.result as string;

          }



        };
      }
      if (file && reader.readyState !== FileReader.LOADING) {
        reader.readAsDataURL(file);
      }
    }
  }

  fileUpload(btnType) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(btnType), 'fileUpload');

    this.loaderSmall = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      this.common.snackbar("Add Error");
      return;
    }
    const formData = new FormData();
    var filename = this.data.master + '_' + this.category + '_' + this.datepipe.transform(new Date(), 'ddMMddmmss')
    formData.append(filename, this.file);

    this.api.post('upload', formData).subscribe(res => {
      if (res.code == 200) {
        this.imageUrl = res.results.URL;
        if (btnType == 'upload') {
          this.loaderSmall = false;
          this.common.snackbar("Image Upload Success");
          this.submitDocument();
        } else if (btnType == 'crop') {
          this.uploadWithForm = !this.uploadWithForm;
          this.cropPanel = true;
        }
      } else {
        this.loaderSmall = false;
      }
    },
      (error) => {
        this.loaderSmall = false;
        this.common.snackbar("Add Error");
      })
  }

  base64Upload(data, type) {

    var filename = this.data.master + '_' + this.category + '_' + this.datepipe.transform(new Date(), 'ddMMddmmss')
    this.requestObj = {
      data: {
        name: type == 'FinalCroppedImage' ? filename : "temp-photo",
        base64: data
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(data), 'base64Upload');

    this.api.post('uploadbase64', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.imageUrl = res.results.URL;
        if (type == 'FinalCroppedImage') {
          this.submitDocument()
        }
      } else { }
    },
      (error) => {
        this.common.snackbar("Add Error");
      })
  }

  submitDocument(): void {
    if (this.uploadWithForm) {
      this.submittedForm = true;
      if (this.form.invalid) {
        this.common.snackbar("Add Error");
        return;
      }
    }

    this.requestObj = {
      data: {
        spname: this.data.data.data.spname,
        parameters: {
          ...this.data.data.data.parameters,
          attachmenturl: this.imageUrl,
          category: this.category !== '' ? this.category : this.form.get('category').value
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'submitDocument');

    if (this.imageUrl !== undefined) {
      this.api.post('index', this.requestObj).subscribe(res => {
        if (res.code == 200) {
          this.closeDialog(res.results.data[0]);
          this.resetDocument();
        } else {
        }
      },
        (error) => {
          this.common.snackbar("Add Error");
        })
    } else {
      this.common.snackbar("Add Error");
    }
  }

  toggleCam() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'toggleCam');

    this.uploadWithForm = !this.uploadWithForm;
    this.cropPanel = false;
  }

  triggerSnapshot(): void {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'triggerSnapshot');

    this.imageTrigger.next();
    this.cropPanel = true;
  }

  captureImage(webcamImage: WebcamImage): void {
    this.common.hubControlEvent(this.data.type, 'click', '', '', webcamImage, 'captureImage');

    this.base64Upload(webcamImage.imageAsDataUrl, 'uploadforcrop');
  }

  captureAgain() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'captureAgain');

    this.cropPanel = false;
    this.imageUrl = undefined;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }


  getChanel() {
    this.req = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.req), 'getChanel');

    this.api.post('index', this.req).subscribe((res: any) => {
      if (res.code == 200) {
        this.channelType = res.results.data;
      }

    });
  }

  resetDocument() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'resetDocument');

    this.form.reset();
    this.category = ''
    this.fileName = '';
    this.disabled = true;
    this.imgPreview = ''
  }
  delete(index: number) {
    // this.common.hubControlEvent(this.data.type,'click','','','','delete');
    this.JsonFieldError = false;
    if (index == 0) {
      this.data.data.removeAt(index);
      this.saveJson = true;
    }
    else {
      this.saveJson = false;
      this.data.data.removeAt(index);
    }
  }

  add() {
    if (this.data.data.invalid) {
      this.JsonFieldError = true;
      return;
    }

    let formlen = this.data.data.value.length
      this.data.data.value.forEach(element => {
          if((element.Key.trim()).length <= 0){
            this.JsonFieldError = true;
            return
          }
          element.Key = element.Key.trim()
          if((element.Value.trim()).length <= 0){
            this.JsonFieldError = true;
            return
          }
          element.Value = element.Value.trim()
          formlen--;

      });

      if(formlen !== 0)
      {
        return;
      }


    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'add');
    this.saveJson = true;
     const newGroup = new FormGroup({});
     this.data.displayedFields.forEach(x => {
     newGroup.addControl(x, new FormControl('',[noSpaceValidator.cannotContainSpace,Validators.pattern(regex.jsonarray),Validators.required]));
     });
     this.data.data.push(newGroup);
     }



    add1()
    {
      if (this.data.data.invalid)
      {
        this.JsonFieldError = true;
        return;

      }

      let formlen = this.data.data.value.length
      this.data.data.value.forEach(element => {
         if((element.Key.trim()).length <= 0){
            this.JsonFieldError = true;
            return
          }
          element.Key = element.Key.trim()
          if((element.Value.trim()).length <= 0){
            this.JsonFieldError = true;
            return
          }
          element.Value = element.Value.trim()
          formlen--;
      });

      if(formlen !== 0)
      {
        return;
      }


      this.closeDialog(true)

      this.common.hubControlEvent(this.data.type,'click','','','','add');
      this.saveJson = true;
      const newGroup = new FormGroup({});
      this.data.displayedFields.forEach(x => {
        newGroup.addControl(x, new FormControl('',[noSpaceValidator.cannotContainSpace,Validators.pattern(regex.alphanumeric),Validators.required]));
      });
      // this.data.data.push(newGroup);
    }


  // add() {
  //   this.common.hubControlEvent(this.data.type,'click','','','','add');
  //    this.saveJson = true;
  //   const newGroup = new FormGroup({});
  // this.data.displayedFields.forEach(x => {
  //   newGroup.addControl(x, new FormControl());
  //   });
  //  this.data.data.push(newGroup);
  //   }

  checkDisabled() {
    // this.common.hubControlEvent(this.data.type,'click','','','','checkDisabled');
    this.JsonFieldError = false;
    this.saveJson = false;
    this.data?.data?.value?.forEach(element => {
      if ((element.Key == '' || element.Value == '') || (element.Key == "" || element.Value == "")
        || (element.Key == null || element.Value == null) || (element.Key == undefined || element.Value == undefined)) {
        this.saveJson = true;
      }
    });
  }
  pdfDownload() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'pdfDownload');

    var doc = new jsPDF()
    var element = document.getElementById('pdfTable') as any;
    html2canvas(element, {
      logging: true,
      foreignObjectRendering: false,
      useCORS: true,

    }).then(canvas => {
      let a = canvas.toBlob(function (blob: any) {
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const scaleFactor = 3
        doc.internal.scaleFactor = scaleFactor;
        var img = new Image()
        img.src = link.href
        const contentDataURL = canvas.toDataURL('image/png')
        doc.addImage(contentDataURL, 'PNG', 35, 15, 60, 100, "alias1", 'SLOW')
        var element = document.getElementById('pdfTable2') as any;
        html2canvas(element).then(canvas => {
          let a = canvas.toBlob(function (blob: any) {
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            const scaleFactor = 3
            doc.internal.scaleFactor = scaleFactor;
            var img = new Image()
            img.src = link.href
            doc.addImage(URL.createObjectURL(blob), 'png', 35, 130, 60, 100, "alias2", 'SLOW');
            doc.save('img.pdf')
          })
        })
      })
    })
  }
  maxDate = new Date();
  minDate = new Date();
  fromtodatePanel: boolean = false

  selectPos(event) {



  }
  applicableChange(event) {
    this.existbutton = false
  }

  applyMsgType(event?) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', event, 'applyMsgType');

    if (this.form.value.alertMsgType == 'toaster') {
      this.addAlert.alertMsgSubType = [{ key: 'success', value: 'Success' }, { key: 'error', value: 'Error' }, { key: 'warning', value: 'Warning' }]
    this.form.controls.alertMsgSubType.patchValue(addAlert.alertMsgSubType[0].key)
    } else if (this.form.value.alertMsgType == 'popup') {
      this.addAlert.alertMsgSubType = [{ key: 'information', value: 'Information' }, { key: 'confirmation', value: 'Confirmation' }]
      this.form.controls.alertMsgSubType.patchValue(addAlert.alertMsgSubType[0].key)
    }
    if (this.form.value.alertMsgType == 'popup') {
      this.deletePopup = true;
      this.form.controls['alertMsgDur'].setValidators(Validators.nullValidator);
      this.addAlert.alertMsgPos = ['top-right', 'bottom-right', 'top-center', 'bottom-center', 'center', 'top-left', 'bottom-left']
    }

    else if (this.form.value.alertMsgType == 'toaster') {
      this.deletePopup = false;
      this.form.controls['alertMsgDur'].setValidators(Validators.required);
      this.form.controls['buttontype'].setValidators(Validators.nullValidator);
    } else {
      this.deletePopup = false;
      this.addAlert.alertMsgPos = ['top-right', 'bottom-right', 'top-center', 'bottom-center']
    }
    if (event == 'Valid Duration') {

    } else {

    }

  }

  applyMsgSubType(event) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', event, 'applyMsgSubType');

    if (this.form.value.alertMsgType == 'popup') {
      this.deletePopup = true;
      this.form.controls['alertMsgDur'].setValidators(Validators.nullValidator);
      this.addAlert.alertMsgPos = ['top-right', 'bottom-right', 'top-center', 'bottom-center', 'center', 'top-left', 'bottom-left']
    }else if(this.form.value.alertMsgType == 'toaster'){
      this.deletePopup = false;
      this.form.controls['alertMsgDur'].setValidators(Validators.required);
      this.form.controls['buttontype'].setValidators(Validators.nullValidator);
    } else {
      this.deletePopup = false;
      this.addAlert.alertMsgPos = ['top-right', 'bottom-right', 'top-center', 'bottom-center']
    }
    if (event == 'Valid Duration') {
    } else {

    }
  }


  min = new Date()
  setMin;
  validToDate: boolean = true
  setMinDate(event) {
    this.setMin = event;
    this.validToDate = false
  }

  submitRemark() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'submitRemark');

    this.submittedForm = true;
    if (this.form.invalid) {
      this.common.snackbar("Add Error");
      return;
    }
    this.closeDialog(this.form.get('remarks').value);
  }
  submitDiscount() {
    this.submittedForm = true;
    if (this.form.invalid) {
      this.common.snackbar("Add Error");
      return;
    }
    var obj = {
      data: {
        spname: "usp_unfyd_haw_discount",
        parameters: {
          flag: 'INSERT',
          processid: this.data.userDetails.Processid,
          productid: 1,
          hawkerid: this.data.application,
          ...this.form.value,
          createdby: this.data.userDetails.Id,
          publicip: this.data.userDetails.ip,
          privateip: '',
          browsername: this.data.userDetails.browser,
          browserversion: this.data.userDetails.browser_version
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'submitDiscount');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.closeDialog(res.results.data[0].result);
      } else {

      }
    },
      (error) => {
        this.common.snackbar("Add Error");
      })
  }

  submitComplaint() {
    this.submittedForm = true;
    if (this.form.invalid) {
      this.common.snackbar("Add Error");
      return;
    }
    var obj = {
      data: {
        spname: "usp_unfyd_haw_grievance",
        parameters: {
          flag: 'INSERT',
          complaint_category: "",
          hawkerid: this.data.application,
          complaint_subject: this.form.value.discountamt,
          complaint_description: this.form.value.remarks,
          processid: this.data.userDetails.Processid,
          productid: 1,
          createdby: this.data.userDetails.Id,
          status: 1,
          modifiedby: "",
          deletedby: "",
          publicip: this.data.userDetails.ip,
          privateip: "",
          browsername: this.data.userDetails.browser,
          browserversion: this.data.userDetails.browser_version
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'submitComplaint');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.closeDialog(res.results.data[0].result);
      } else {

      }
    },
      (error) => {
        this.common.snackbar("Add Error");
      })
  }

  checkout(age) {
  }

  depositeInToBank() {
    this.submittedForm = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.common.snackbar("Add Error");
      return;
    }
    const shedString = (string, separator) => {
      const separatedArray = string.split(separator);
      const separatedString = separatedArray.join("");
      return separatedString;
    }
    let rupee = shedString(this.form.value.depositedAmount, "₹");
    rupee = shedString(rupee, ",")
    var obj = {
      data: {
        spname: "usp_unfyd_payment_collection_adm_status",
        parameters: {
          FLAG: 'INSERT',
          PROCESSID: this.data.userDetails.Processid,
          PRODUCTID: 1,
          FE: this.data.data['Field Executive Name'],
          FEUSERID: this.data.data.FEID,
          PAYMENTCOLLECTIONDATE: this.data.data.CollectionDate,
          CASH: this.data.data.Cash,
          ONLINEPAYMENT: this.data.data.Online,
          TOTALAMT: this.data.data['Total Amount'],
          PAYMENTFOR: 'CASH',
          DEPOSITDATE: new Date(this.form.value.depositedDate),
          TRANSACTIONID: this.form.value.transactionID.trim(),
          DEPOSITAMT: rupee,
          DEPOSITSTATUS: this.data.data['Deposit Status'],
          DEPOSITVERIFYSTATUS: 'Pending',
          REMARKS: this.data.depositStatus == 'Submit' ? '' : this.form.value.remark,
          UNIQUEPAYMENTID: this.data.depositStatus == 'Submit' ? this.data.data.FEID + this.datepipe.transform(new Date(), 'ddMMyyHHmmss') : this.data.data['UniquePaymentID'],
          CREATEDBY: this.data.userDetails.Id,
          PUBLICIP: this.data.userDetails.ip,
          PRIVATEIP: '',
          BROWSERNAME: this.data.userDetails.browser,
          BROWSERVERSION: this.data.userDetails.browser_version
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'depositeInToBank');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.closeDialog(res.results.data[0].result);
      } else {

      }
    },
      (error) => {
        this.common.snackbar("Add Error");
      })
  }

  numericOnly(event: any): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43 ||
      charCode === 33 || charCode === 35 || charCode === 47 || charCode === 36 ||
      charCode === 37 || charCode === 38 || charCode === 40 || charCode === 41 || charCode === 42
      || charCode === 46 || charCode > 47 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (event.target.value.length >= 20) {
      return false;
    }
    return true;
  }
  submitBlockRemark() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'submitBlockRemark');

    this.submittedForm = true;
    if (this.form.invalid) {
      this.common.snackbar("Add Error");
      return;
    }
    this.closeDialog(this.form.get('remarks').value);
  }

  submitCollection() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'submitCollection');

    this.dialogRef.close(true)
  }

  uploadDocument1(event, category) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'uploadDocument1');

    this.category = category;
    var data = {
      category: category,
      flag: "INSERT",
      createdby: this.userDetails.Id,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUpload(data)
    }
  }


  previewAlert(event, profileImg, val) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'previewAlert');

    val.icon = profileImg
    var data = {
      img: profileImg,
      data: val,
    }

    if (val.alertMsgType == 'popup') {
      this.common.previewAlertPopup(data);

    } else {
      let vertical: any;
      let horizontal: any;
      if (val.alertMsgPos == 'top-right') {
        vertical = "top";
        horizontal = "right";
      } else if (val.alertMsgPos == 'bottom-right') {
        vertical = "bottom";
        horizontal = "right";
      } else if (val.alertMsgPos == 'top-center') {
        vertical = "top";
        horizontal = "center";
      } else if (val.alertMsgPos == 'bottom-center') {
        vertical = "bottom";
        horizontal = "center";
      }
      this.common.snackbar(val.description, val.alertMsgType, horizontal, vertical, val.alertMsgDur * 1000);
    }
  }

  addImage: any
  showImage(event) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(event), 'showImage');


    if (event != 0) {
      this.addImage = true;
    } else if (event == 0) {
      this.addImage = false;
    }
  }
  addLanguage() {
    let obj = {
      data: {
        spname: "usp_unfyd_localization",
        parameters: {
          FLAG: "INSERT_MODULE",
          MODULENAME: this.form.value.languageName,
          PARENTCONTROLID: 1,
          ASSIGNEDVALUE: "",
          DEFAULTVALUE: "",
          ASSIGNEDPROPERTY: "",
          ADDITIONALPROPERTY: "",
          PRODUCTID: this.userDetails.ProductId,
          PRODUCTNAME: 'WORKSPACE',
          PROCESSID: this.userDetails.Processid,
          LANGUAGECODE: this.form.value.languageId,
          CREATEDBY: this.userDetails.Id,
          STATUS: false
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'addLanguage');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.updateLanguage(res.results.data[0].result)
        this.closeDialog(true)
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }
  updateLanguage(msg: string) {
    let obj = {
      data: {
        spname: "usp_unfyd_localization",
        parameters: {
          FLAG: "UPDATE_MODULE",
          ASSIGNEDVALUE: '',
          ASSIGNEDPROPERTY: '',
          ADDITIONALPROPERTY: '',
          STATUS: false,
          PROCESSID: this.userDetails.Processid,
          PRODUCTID: this.userDetails.ProductId,
          PRODUCTNAME: 'WORKSPACE',
          LANGUAGECODE: this.form.value.languageId,
          MODULENAME: this.form.value.languageName,
          PARENTCONTROLID: 1
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(msg), 'updateLanguage');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.common.snackbar("Add Record");
        this.closeDialog(true)
      } else {
      }
    },
      (error) => {
      })
  }
  showCategoryDiv: any;
  showRelatedComponent(value) {
    this.showCategoryDiv = value;
  }

  submitConditionObj: any;
  submitConditionForm: any;
  submitCondition() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'submitCondition');

    this.submittedForm = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      // this.common.snackbar("Add Error");
      return;
    }


    this.submitConditionForm = {
      id: this.form.get('id').value,
      title: this.form.get('title').value,
      icon: this.form.get('icon').value,
      status: this.form.get('status').value,
      formControls: this.form.get('formControls').value.length > 0 ? this.form.get('formControls').value : [{}],
      processid: this.data.processid,
      languagecode: this.data.languagecode,
      productid: this.data.productid,
      productname: this.data.productname,
    }

    this.submitConditionObj = {
      id: this.data.parentid,
      ...this.form.value,
      processid: this.data.processid,
      languagecode: this.data.languagecode,
      productid: this.data.productid,
      productname: this.data.productname,
    }


    this.api.post(this.data.status !== 'update' ? 'securitycompliance' : 'securitycompliance/update', this.data.status !== 'update' ? this.submitConditionObj : this.submitConditionForm).subscribe(res => {

      if (res.code == 200) {
        this.closeDialog(this.data.status !== 'update' ? JSON.parse(res.results.data[1].result) : this.form.value);
        this.common.snackbar(res.results.data[0].result == "Data saved successfully" ? 'Record add': 'Update Success');

      } else {
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("Add Error");
      }
    );

  }

  get formControls(): FormArray {
    return this.form.get('formControls') as FormArray;
  }

  addActions() {
    this.formControls.push(
      new FormGroup({
        id: new FormControl(''),
        key: new FormControl('', [Validators.required]),
        value:new FormControl('', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter),noSpaceValidator.cannotContainSpace]),
        label:new FormControl('', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter), noSpaceValidator.cannotContainSpace])
      })
    )
  }
  removeActions(i) {

    this.formControls.removeAt(i);
  }

  appSettingObj: any;
  appSettingForm: any;

  get notificationControls(): FormArray {
    return this.form.get('notificationControls') as FormArray;
  }

  addnotificationActions() {

    this.notificationControls.push(
      new FormGroup({
        id: new FormControl(''),
        key: new FormControl(''),
        value: new FormControl(''),
        label: new FormControl(''),
      })
    )
  }
  removenotificationActions(i) {
    this.notificationControls.removeAt(i);
  }

  private getSearch: Subject<string> = new Subject<string>();
  getSearch$: Observable<string> = this.getSearch.asObservable();
  setSearch(event) {
    this.getSearch.next(event);
    this.search = event;
  }
  pageChange(currentpage) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(currentpage), 'pageChange');

    this.page = currentpage;
    if (this.data.type == 'Transcript') {
      this.getTranscript(this.page, this.itemsPerPage);
    }
  }

  feildChooser() {

    var obj = {
      data: {
        spname: "usp_unfyd_user_field_chooser",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
          modulename: this.type,
          language: localStorage.getItem('lang')
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'feildChooser');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        if (res.results.data.length == 0) {
          this.selctedField = this.tabKey;
        } else {
          this.selctedField = res.results.data[0].FieldChooser.split(',');
        }
        this.unSelctedField = this.tabKey.filter(field => !this.selctedField.includes(field));
        var selctedField = [];
        for (let i = 0; i < this.selctedField.length; i++) {
          selctedField.push({ value: this.selctedField[i], className: '' })
        }
        var unSelctedField = [];
        for (let i = 0; i < this.unSelctedField.length; i++) {
          unSelctedField.push({ value: this.unSelctedField[i], className: 'tabCol' })
        }
        this.finalField = [
          ...selctedField,
          ...unSelctedField
        ]

      } else {
      }
    },
      (error) => {
      })
  }

  feildChooser2() {	
    this.selctedField = [];	
    this.unSelctedField = [];	
    this.finalField = [];	
    let data = JSON.parse(JSON.stringify(this.tabValue))	
    this.tabValue = []	
    setTimeout(() => {	
      this.tabValue = JSON.parse(JSON.stringify(data))	
    });	
      this.selctedField = this.tabKey;	
    this.unSelctedField = this.tabKey.filter(field => !this.selctedField.includes(field));	
    var selctedField = [];	
    for (let i = 0; i < this.selctedField.length; i++) {	
      selctedField.push({ value: this.selctedField[i], className: '' , checked: true })	
    }	
    var unSelctedField = [];	
    for (let i = 0; i < this.unSelctedField.length; i++) {	
      unSelctedField.push({ value: this.unSelctedField[i], className: 'tabCol' , checked: false})	
    }	
    this.finalField = [	
      ...selctedField,	
      ...unSelctedField	
    ]	
   	
  }

  getFilter() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'getFilter');

    this.subscription.push(this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    }));
    this.subscription.push(this.common.getSearch$.subscribe(data => {
      this.search = data
    }));
    this.subscription.push(this.common.getLoaderStatus$.subscribe(data => {
      this.loader = data;
      if (data == false) {
        this.getTableDataLocalizationlanguages(this.data.langData.LanguageCode)
      }
    }));
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
    })
  }

  getTableDataLocalizationlanguages(langCode: any) {
    this.tabKey = [];
    this.tabValue = [];
    this.finalField = [];
    this.loader = true
    var TempAraay = [];
    var temp = [];
    var obj = {
      data: {
        spname: "usp_unfyd_form_validation",
        parameters: {
          flag: "BULK_EDIT",
          language: langCode
        }
      }
    };
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(langCode), 'getTableDataLocalizationlanguages');

    this.api.post('index', obj).subscribe(async res => {
      if (res.code == 200) {
        this.loader = false
        TempAraay = res.results.data;

        TempAraay.forEach(element => {


          if (element.Language == langCode) {

            temp.push(element)
          }


        });

        var tempRes = temp;

        for (let data of tempRes) {
          var newObj = {
            "Sr No": '',
            ...data
          }

          this.tabValue.push(newObj);
        }

        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
        if (tempRes.length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
      }
    });
  }

  export(): void {
    if (this.data.type == 'Transcript') {
      this.tempRes.forEach(object => {
        delete object['Sr No'];
      });
      var temp = [];
      for (let i = 0; i < this.tempRes.length; i++) {
        temp.push({ 'Sr No': i + 1, ...this.tempRes[i] });
      }
      this.excelService.exportExcel(temp, 'Interaction Transcript');
    }
    else {
      this.data.tabValue.forEach(object => {
        delete object['Sr No'];
      });
      var temp = [];
      for (let i = 0; i < this.data.tabValue.length; i++) {
        temp.push({ 'Sr No': i + 1, ...this.data.tabValue[i] });
      }
      this.excelService.exportExcel(temp, 'Interaction Transcript');
    }
  }
  SaveAccount() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_accounts',
        parameters: {
          Flag: this.data.id == null ? 'INSERT' : 'UPDATE',
          Id: this.data.id == null ? undefined : this.data.id,
          CreatedBY: this.data.id == null ? this.userDetails.Id : undefined,
          ModifiedBY: this.data.id == null ? undefined : this.userDetails.Id,
          AccountName: this.form.value.accountname,
          Address: this.form.value.address,
          City: this.form.value.city,
          ServiceContractID: this.form.value.servicecontract,
          Notes: this.form.value.notes,
          AccountDomain: this.form.value.domainname,
          ParentAccountID: this.form.value.parentaccount,
          IsActive: this.form.value.isactive,
          AccountRepContactID: this.form.value.accountrep,
          LogoUrl: this.profilepic,
          ProcessId: this.form.value.processid,
          ProductId: this.form.value.productid,
          PublicIp: this.form.value.publicip,
          PrivateIp: this.form.value.privateip,
          BrowserName: this.form.value.browsername,
          Browserversion: this.form.value.browserversion,
        }
      }
    };
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'SaveAccount');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.common.snackbar(res.results.data[0].result, "Success");
        this.router.navigate(['masters/account']);
      }
    });
  }

  SaveProduct() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_account_product_mapping',
        parameters: {
          Flag: this.data.id == null ? 'INSERT' : 'UPDATE',
          ProductId: this.form.value.product.toString(),
          AccountId: this.data.actionId,
          ContractStartDate: this.form.value.contractstartdate?.toISOString().slice(0, 10),
          ContractEndDate: this.form.value.contractenddate?.toISOString().slice(0, 10),
          IsActive: this.form.value.isactive,
          ProcessId: this.form.value.processid,
          PublicIp: this.form.value.publicip,
          PrivateIp: this.form.value.privateip,
          BrowserName: this.form.value.browsername,
          Browserversion: this.form.value.browserversion,
          CreatedBY: this.data.id == null ? this.userDetails.Id : undefined,
          ModifiedBY: this.data.id == null ? undefined : this.userDetails.Id,
        }
      }
    };
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'SaveProduct');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.common.snackbar(res.results.data[0].result, "success");
        this.router.navigate(['masters/account/productView/', this.data.actionId]);
      }
    });
  }

  changeControlType() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'changeControlType');

    this.chartandGraph = {
      dashboardControlTypeSelected: this.dashboardControlTypeSelected,
      visible: true,
      api: null,
      apiRequest: null,
      showDateChangePart: false,
      dataApi: null,
      dataRequest: null,

      reloadTimeEnable: false,
      reloadTime: 10,
      reloadTimeType:'sec',

      chartAndGraph: null,
      header: null,
      dateFilter: null,
      displayDateFilter: false,

      displayListHeader: false,
      customFilter: false,
      customFilterValues: [{
        customFilterField: ''
      }],

      gaugePercentCount: false,
      gaugePercentCountDataKey: null,
      gaugePercentCountAPI: null,
      gaugePercentCountAPIRequest: null,
      gaugePercentCountText: null,
      gaugePercentColor: this.common.colorArray[0],

      textBelowGaugeCount: false,
      textBelowGaugeCountText: null,
      textBelowGaugeCountTextAPI: null,
      textBelowGaugeCountTextAPIRequest: null,
      textBelowGaugeColor: this.common.colorArray[0],

      sectionBelowBarChartIconOnTop: false,
      sectionBelowBarChartIconOnTopLeftText: null,
      sectionBelowBarChartIconOnTopLeftApi: null,
      sectionBelowBarChartIconOnTopLeftApiRequest: null,
      sectionBelowBarChartIconOnTopRightText: null,
      sectionBelowBarChartIconOnTopRightApi: null,
      sectionBelowBarChartIconOnTopRightApiRequest: null,

      maxLicenseAllowed: null,
      maxLicenseAllowedLineColor: this.common.colorArray[0],
      maxlicensedUsed: null,
      maxlicensedUsedRequest: null,
      maxlicensedUsedTime: null,
      maxlicensedUsedTimeRequest: null,

      displayInnerTextDoughnut: false,
      innerTextDoughnut: 'Total',
      showSum: false,

      hideLegend: null,
      blocks: [
        {
          header: null,
          key: null,
          visible: true,
          api: null,
          request: null,
          backgroundColor: this.colorPalette[0],
          selectedIcon: null,
          selectedIconColor: 'blue',
          columnWidth: 1,
          displayType: 'text'
        }
      ]
    };
    this.changesDone()
  }



  enable(key) {
  }



  deleteBlockAddDashboardCard(i) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', i, 'deleteBlockAddDashboardCard');
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status == true) this.chartandGraph.blocks.splice(i, 1);



      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
  }

  addBlockAddDashboardCard() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'addBlockAddDashboardCard');

    let i = this.chartandGraph?.blocks?.length == 0 ? 0 : this.chartandGraph?.blocks?.length
    this.chartandGraph.blocks.push({
      header: null,
      key: null,
      visible: true,
      api: null,
      backgroundColor: this.colorPalette[i],
      selectedIcon: null,
      selectedIconColor: 'blue',
      columnWidth: 1,
      displayType: 'text'
    })
  }

  changesDone() {

    this.dummyChartandGraph = { ...this.chartandGraph }


  }

  changesDoneForTile() {

    this.dummyTile = { ...this.tile }
  }

  createForm() {
    if(this.data.type != 'createTaskManually') this.form = new FormGroup({})
    for (const formField of this.allFormControl) {
      if (formField.formControlName != null && formField.formControlName != undefined && formField.formControlName != '' && formField.type != 'button') {
        this.form.addControl(formField.formControlName, new FormControl(formField.value ? formField.value : '', [formField.mandatory ? Validators.required : Validators.nullValidator, formField.regularExpression ? Validators.pattern(formField.regularExpression) : Validators.nullValidator]));
        // this.form.get(formField.formControlName).updateValueAndValidity()
        // this.form.controls[formField.formControlName].markAsTouched()
        // this.form.controls[formField.formControlName].markAsUntouched()
        // this.form.get(formField.formControlName).updateValueAndValidity()
        if (formField.type == 'list' && formField.Dynamic == true) {
          if (formField.parent != null) {
            formField.listOfValues = [];
          }
          if (formField.REQOBJECT === undefined &&
            (formField.buttonBody[0].Key !== '' && formField.buttonBody[0].Key !== undefined && formField.buttonBody[0].Key !== null)
            && (formField.buttonBody[0].Value !== '' && formField.buttonBody[0].Value !== undefined && formField.buttonBody[0].Value !== null)
          ) {
            let jsonObjectForButton: any = {};
            formField.buttonBody.forEach(obj => {
               Object.assign(jsonObjectForButton, { [obj.Key]: this.form.get(obj.Value).value });
            });
            formField.REQOBJECT = JSON.stringify(jsonObjectForButton);
          } else if (formField.REQOBJECT === undefined && (formField.buttonBody[0].Key === '' || formField.buttonBody[0].Key === undefined || formField.buttonBody[0].Key === null)
            && (formField.buttonBody[0].Value === '' || formField.buttonBody[0].Value === undefined || formField.buttonBody[0].Value === null)) {
            formField.REQOBJECT = formField.Format;
          }
          let obj = {
            reqObj: formField.REQOBJECT ? JSON.stringify(JSON.parse(formField.REQOBJECT)) : {},
            headers: formField.buttonHeaders,
            format: formField.Format,
            responseFormat: formField.FormatResponse,
            key: formField.Key,
            value: formField.Value,
          };
          let headerObj = {};
          if(formField.buttonAuth && formField.buttonAuth.type == 'Bearer Token'){
            headerObj['Authorization'] = formField.buttonAuth.token == "$token$" ? ('Bearer '+this.token) : ('Bearer '+formField.buttonAuth.token)
          }else if(formField.buttonAuth && formField.buttonAuth.type == 'API Key'){
            if(formField.buttonAuth && formField.buttonAuth.add_to == 'Query Params'){
              if(formField.buttonAuth && formField.buttonAuth.key !== null && formField.buttonAuth.key !== undefined && formField.buttonAuth.key !== '' && formField.buttonAuth.key.trim() !== '' &&
              formField.buttonAuth.value !== null && formField.buttonAuth.value !== undefined && formField.buttonAuth.value !== '' && formField.buttonAuth.value.trim() !== '')
              formField.APIURL = formField.APIURL+ '?'+formField.buttonAuth?.key+'='+formField.buttonAuth?.value
            }else if(formField.buttonAuth && formField.buttonAuth.add_to == 'Header'){
              if(formField.buttonAuth && formField.buttonAuth.key !== null && formField.buttonAuth.key !== undefined && formField.buttonAuth.key !== '' && formField.buttonAuth.key.trim() !== '' &&
                formField.buttonAuth.value !== null && formField.buttonAuth.value !== undefined && formField.buttonAuth.value !== '' && formField.buttonAuth.value.trim() !== '')
              headerObj[formField.buttonAuth.key] = formField.buttonAuth.value
              // obj.headers.push({[formField.buttonAuth.key]:formField.buttonAuth.value})
            }
          }
          obj.headers.forEach(formField => {
            if(formField.key && formField.value) headerObj[formField.key] = formField.value == "$token$" ?  ('Bearer '+this.token) : formField.value
          });
          let httpOptions = {
            headers: {...headerObj}
          }
          this.apiCall(formField, obj, httpOptions,headerObj);
        }
        // else if (formField.type == 'list' && formField.Dynamic == false) {
        //   let result = [];
        //   formField.listOfValues.forEach(element => {
        //     result.push(element);
        //   });
        //   formField.listOfValues = result;
        // }
      }
    }

    this.formFields = this.allFormControl;
    this.formChange(this.formFields);

    if(this.data.type == 'createTaskManually' && this.data.purpose  !== 'edit'){
      this.form.controls['selectCampaign'].patchValue(this.data.taskGroupInfo.Name)
    }
    if(this.data.type == 'createTaskManually' &&  this.data.hasOwnProperty('value') ){
      let aa = JSON.parse(JSON.stringify(JSON.parse(this.data.value.Value)))
      const lowerObj = this.common.ConvertKeysToLowerCase();
      aa = lowerObj(aa);
      this.form.controls['selectCampaign'].patchValue(this.data.value['Campaign Id'])
      this.form.controls['taskID'].patchValue(this.data.value.Actionable)

      Object.keys(this.form.value).forEach(res =>{
        if(aa.hasOwnProperty(res.toLocaleLowerCase())){
          this.form.controls[res].patchValue(aa[res.toLocaleLowerCase()])
        }
      })
      this.form.updateValueAndValidity()
    }
  }

  old: any;
  formChange(json) {
    this.old = { ...this.form.value };
    this.subscription.push(this.form.valueChanges.subscribe(res => {
      const key = Object.keys(res).find(k => res[k] != this.old[k]);
      if (key !== undefined) {
        json.forEach(element => {
          if (element.parent === key && element.Dynamic) {
            let requestObj = {};
            requestObj[key] = this.form.get(key).value;
            let obj = {
              reqObj: JSON.stringify(requestObj).replace(/[{}]/g, ''),
              headers: element.buttonHeaders,
              format: element.Format,
              responseFormat: element.FormatResponse,
              key: element.Key,
              value: element.Value,
            };
            let headerObj = {};
            obj.headers.forEach(formField => {
              headerObj[formField.Key] = formField.Value == "$token$" ? ('Bearer '+this.token) : formField.Value
            });
            if(element.buttonAuth.type == 'Bearer Token'){
              headerObj['element.buttonAuthorization'] = element.buttonAuth.token == "$token$" ? ('Bearer '+this.token) : ('Bearer '+element.buttonAuth.token)
            }else if(element.buttonAuth.type == 'API Key'){
              if(element.buttonAuth.add_to == 'Query Params'){
                if(element.buttonAuth.key !== null && element.buttonAuth.key !== undefined && element.buttonAuth.key !== '' && element.buttonAuth.key.trim() !== '' &&
                element.buttonAuth.value !== null && element.buttonAuth.value !== undefined && element.buttonAuth.value !== '' && element.buttonAuth.value.trim() !== '')
                element.APIURL = element.APIURL+ '?'+element.buttonAuth.key+'='+element.buttonAuth.value
              }else if(element.buttonAuth.add_to == 'Header'){
                if(element.buttonAuth.key !== null && element.buttonAuth.key !== undefined && element.buttonAuth.key !== '' && element.buttonAuth.key.trim() !== '' &&
                  element.buttonAuth.value !== null && element.buttonAuth.value !== undefined && element.buttonAuth.value !== '' && element.buttonAuth.value.trim() !== '')
                headerObj[element.buttonAuth.key] = element.buttonAuth.value
              }
            }
            let httpOptions = {
              headers: {...headerObj}
            }
            this.apiCall(element, obj, httpOptions,headerObj);
          };
        });
      }
    }));
  }
  apiCall(formField, Object, httpOptions,headerObj?) {
    if (formField.APIMETHOD !== null && formField.APIMETHOD !== undefined && formField.APIMETHOD !== '') {
      if (formField.APIMETHOD.toLowerCase() == 'post') {	
        let additionalData = {}	
        let obj = ''	
        let parseObj = {}	
        try{	
          for (const iterator in Object.reqObj) {	
            console.log(typeof Object.reqObj[iterator]);	
            if(typeof Object.reqObj[iterator] == 'object'){	
              Object.assign(additionalData,{['$additionalData'+ Object.keys(additionalData).length +'$']: Object.reqObj[iterator]})	
              Object.reqObj[iterator] = '$additionalData'+ (Object.keys(additionalData).length -1) +'$'	
            }	
          }	
        // obj = Object.format.replace('"${body}"', formField.parent != null ? Object.reqObj.replace(/[{}]/g, '') : Object.reqObj);	
        obj = Object.format.replace('"${body}"', Object.reqObj.replace(/[{}]/g, ''));	
        for (const iterator in additionalData){	
          obj = obj.replace('"'+iterator+'"',JSON.stringify(additionalData[iterator]));	
        }
        parseObj  = JSON.parse(obj)
      } catch(error){
          console.log(error)
        }
        this.post(formField.APIURL, parseObj, (Object.headers.length > 0 || (headerObj && this.ObjectKeys(headerObj).length > 0)) ? httpOptions : null).subscribe(res => {
          console.log(res);
          if (Object.key && Object.value) {
            try {
              let newKey = Object.key.substring(Object.key.lastIndexOf(".") + 1, Object.key.length);
              let newValue = Object.value.substring(Object.value.lastIndexOf(".") + 1, Object.value.length);
              let result = [];
              var mySubString = Object.key.substring(
                Object.key.indexOf(".") + 1,
                Object.key.lastIndexOf(".")
              );
              var finalevalstring = 'res.' + mySubString;
              eval(finalevalstring).forEach(element => {
                let key = element[newKey];
                let value = element[newValue];
                result.push({ key: key, value: value,
                  "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null,
                  element: element });
              });
              formField.listOfValues = result;
              this.form.get(formField.formControlName).updateValueAndValidity()
            }
            catch (e) {
              console.error(e);
            }
          }
        });
      } else if (formField.APIMETHOD.toLowerCase() == 'get') {
        this.get(formField.APIURL, Object.headers.length > 0 ? httpOptions : null).subscribe(res => {
          if (Object.key && Object.value) {
            try {
              let newKey = Object.key.substring(Object.key.lastIndexOf(".") + 1, Object.key.length);
              let newValue = Object.value.substring(Object.value.lastIndexOf(".") + 1, Object.value.length);
              let result = [];
              var mySubString = Object.key.substring(
                Object.key.indexOf(".") + 1,
                Object.key.lastIndexOf(".")
              );
              var finalevalstring = 'res.' + mySubString;
              eval(finalevalstring).forEach(element => {
                let key = element[newKey];
                let value = element[newValue];
                result.push({ key: key, value: value,
                  "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null,
                  element: element });
              });
              formField.listOfValues = result;
              this.form.get(formField.formControlName).updateValueAndValidity()
            }
            catch (e) {
              console.error(e);
            }
          }
        });
      }
    }
  }

  buttonClick(label: string) {
    let objPattern: any = {};
    let auth :any= {}
    let method: any;
    let apiUrl: any;
    let headers = [];
    let objKey, objValue = [];
    let format: any;
    let patchControl: any;
    let disable: boolean;
    let responseFormat: any;
    this.allFormControl.forEach(element => {
      if (element.type == 'button' && element.label == label) {
        if(element.checkValidation){
          if(element.checkValidationFormControls.length > 0){
            // if (this.form.invalid) {
              let a = false
              for (const key of Object.keys(this.form.controls)) {
                if (this.form.controls[key].invalid && element.checkValidationFormControls.includes(key)) {
                const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                invalidControl?.focus();
                this.form.markAllAsTouched();
                a = true
                break;
                }
              }
              if(a) return ;
            // }
          }
        }
        if (element.type == 'button') {
          element.buttonBody.forEach(obj => {
            Object.assign(objPattern, { [obj.Key]: obj.Value });
          });
        }
        objKey = Object.keys(objPattern);
        objValue = Object.values(objPattern);
        method = element.APIMETHOD;
        apiUrl = element.APIURL;
        auth = element.buttonAuth
        headers = element.buttonHeaders;
        format = element.Format;
        disable = element.FormDisable;
        patchControl = element.PatchControl;
        responseFormat = element.FormatResponse;
        let headerObj = {};
        if(auth.type == 'Bearer Token'){
          headerObj['Authorization'] = auth.token == "$token$" ? ('Bearer '+this.token) : ('Bearer '+auth.token)
        }else if(auth.type == 'API Key'){
          if(auth.add_to == 'Query Params'){
            if(auth.key !== null && auth.key !== undefined && auth.key !== '' && auth.key.trim() !== '' &&
            auth.value !== null && auth.value !== undefined && auth.value !== '' && auth.value.trim() !== '')
            apiUrl = apiUrl+ '?'+auth?.key+'='+auth?.value
          }else if(auth.add_to == 'Header'){
            if(auth.key !== null && auth.key !== undefined && auth.key !== '' && auth.key.trim() !== '' &&
              auth.value !== null && auth.value !== undefined && auth.value !== '' && auth.value.trim() !== '')
            headerObj[auth.key] = auth.value
          }
        }
        headers.forEach(element => {
          if(element.key && this.common.checkTruthyValue(element.key) && element.value && this.common.checkTruthyValue(element.value))
          headerObj[element.key] = element.value == "$token$" ? ('Bearer '+this.token) : element.value
        });
        let httpOptions = {
          headers: {...headerObj}
        }
        let reqObj: any = {};
        objValue.forEach((element, index) => {
          this.allFormControl.forEach(obj => {
            if (element == obj?.label || element == obj?.formControlName) {
              let key = objKey[index];
              reqObj[key] = this.form.value[obj?.formControlName]
            }
          });
        });
        if (method.toLowerCase() == 'post') {
          let additionalData = {}
          let obj = ''
          let parseObj = {}
          try {
          for (const iterator in reqObj) {	
            console.log(typeof reqObj[iterator]);	
            if(typeof reqObj[iterator] == 'object'){	
              Object.assign(additionalData,{['$additionalData'+ Object.keys(additionalData).length +'$']: reqObj[iterator]})	
              reqObj[iterator] = '$additionalData'+ (Object.keys(additionalData).length -1) +'$'	
            }	
          }	
        // obj = format.replace('"${body}"', element.buttonBody.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));	
          obj = format.replace('"${body}"', JSON.stringify(reqObj).replace(/[{}]/g, ''));	
          for (const iterator in additionalData){	
            obj = obj.replace('"'+iterator+'"',JSON.stringify(additionalData[iterator]));	
          }
          parseObj  = JSON.parse(obj)
          }catch(error){
            console.log(error)
          }
          // let obj = format.replace('"${body}"', JSON.stringify(reqObj).slice(1, -1));
          this.post(apiUrl, parseObj, (headers.length > 0 || this.ObjectKeys(headerObj).length > 0)  ? httpOptions : null).subscribe(res => {
            console.log(res);
            if (responseFormat && eval(responseFormat) != undefined) {
              if (patchControl != null) {
                patchControl.forEach(obj => {
                  this.allFormControl.forEach(element => {
                    if (element.label == obj.field || element.formControlName == obj.field) {
                      this.form.get(element.formControlName).patchValue(eval(obj.response));
                      if (element.LockControl) {
                        this.form.get(element.formControlName).disable();
                      }
                      this.form.updateValueAndValidity();
                      this.formChange(this.formFields);
                    }
                  });
                });
              }
              // patch dropdown option data
            } else if(element.patchResponseToDropdownOption){
                element.patchDropdowns.forEach(element2 => {
                  if (element2.field && element2.key && element2.value) {
                    try {
                      let newKey = element2.key.substring(element2.key.lastIndexOf(".") + 1, element2.key.length);
                      let newValue = element2.value.substring(element2.value.lastIndexOf(".") + 1, element2.value.length);
                      let result = [];
                      var mySubString = element2.key.substring(
                        element2.key.indexOf(".") + 1,
                        element2.key.lastIndexOf(".")
                      );
                      var finalevalstring:any = 'res.' + mySubString;
                      // Function('return ' + finalevalstring)().forEach(element => {
                      eval(finalevalstring).forEach(element3 => {
                        let key = element3[newKey];
                        let value = element3[newValue];
                        result.push({ key: key, value: value,
                          "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null
                           , element: element3
                          });
                      });
                      if(result.length >0){
                        this.formFields.forEach((element4,index) => {
                          if(element2.field == element4.formControlName || element2.field == element4.label){
                            // console.log("values:",element4.listOfValues);
                            // setTimeout(() => {
                            //   this.formFields[index].listOfValues = result;
                            // });
                            this.changeListOptions(index,result)
                            // console.log("values:",element4.listOfValues);
                            // this.form.get(element4.formControlName).updateValueAndValidity()
                          }
                        })
                      }
                    }
                    catch (e) {
                      console.error(e);
                    }
                  }
                });
            } else {
              this.formChange(this.formFields);
            }
            if(element.clickButtonAfter){
              element.clickButtonAfterArray.forEach(elementtt => {
                this.buttonClick(elementtt.value)
              });
            }
          }, ((error) => {
            this.formChange(this.formFields);
          }));
        } else if (method.toLowerCase() == 'get') {
          this.get(apiUrl, (headers.length > 0 || this.ObjectKeys(headerObj).length > 0) ? httpOptions : null).subscribe(res => {
            if (responseFormat && eval(responseFormat) != undefined) {
              if (patchControl != null) {
                patchControl.forEach(obj => {
                  this.allFormControl.forEach(element => {
                    if (element.label == obj.field || element.formControlName == obj.field) {
                      this.form.get(element.formControlName).patchValue(eval(obj.response));
                      if (element.LockControl) {
                        this.form.get(element.formControlName).disable();
                      }
                      this.form.updateValueAndValidity();
                      this.formChange(this.item);
                    }
                  });
                });
              }
            } else {
              this.formChange(this.formFields);
            }
            if(element.clickButtonAfter){
              element.clickButtonAfterArray.forEach(elementtt => {
                this.buttonClick(elementtt)
              });
            }
          }, ((error) => {
            this.formChange(this.formFields);
          }));
        }
      }else if (element.type == 'list' && element.label == label) {
        if (element.type == 'list') {
          element.buttonBody.forEach(obj => {
            if(obj.Key && obj.Value) Object.assign(objPattern, { [obj.Key]: obj.Value });
          });
        }
        objKey = Object.keys(objPattern);
        objValue = Object.values(objPattern);
        method = element.APIMETHOD;
        apiUrl = element.APIURL;
        auth = element.buttonAuth
        headers = element.buttonHeaders;
        format = element.Format;
        disable = element.FormDisable;
        patchControl = element.PatchControl;
        responseFormat = element.FormatResponse;
        let headerObj:any = {};
        // auth.forEach(element => {
          if(auth.type == 'Bearer Token'){
            headerObj['Authorization'] = auth.token == "$token$" ? ('Bearer '+this.token) : ('Bearer '+auth.token)
          }else if(auth.type == 'API Key'){
            if(auth.add_to == 'Query Params'){
              if(auth.key !== null && auth.key !== undefined && auth.key !== '' && auth.key.trim() !== '' &&
              auth.value !== null && auth.value !== undefined && auth.value !== '' && auth.value.trim() !== '')
              apiUrl = apiUrl+ '?'+auth.key+'='+auth.value
            }else if(auth.add_to == 'Header'){
              if(auth.key !== null && auth.key !== undefined && auth.key !== '' && auth.key.trim() !== '' &&
                auth.value !== null && auth.value !== undefined && auth.value !== '' && auth.value.trim() !== '')
              headerObj[auth.key] = auth.value
            }
          }
        // });
        headers.forEach(element => {
          if(element.key && element.value) headerObj[element.key] = element.value == "$token$" ? ('Bearer '+this.token) : element.value
        });
        // console.log(headerObj);
        let httpOptions:any
        // setTimeout(() => {
          // console.log(httpOptions);
          httpOptions = {
            headers: {...headerObj}
          }
          // console.log(headerObj,{
          //   headers: {...headerObj}
          // });
        // });
        let reqObj = {};
        objValue.forEach((element, index) => {
          this.item.forEach(obj => {
            if (element == obj.label || element == obj.formControlName) {
              let key = objKey[index];
              reqObj[key] = this.form.value[obj.formControlName]
            }
          });
        });
        if (method.toLowerCase() == 'post') {	
          let additionalData = {}	
          let obj = ''	
          let parseObj = {}	
          try{	
            for (const iterator in reqObj) {	
              console.log(typeof reqObj[iterator]);	
              if(typeof reqObj[iterator] == 'object'){	
                Object.assign(additionalData,{['$additionalData'+ Object.keys(additionalData).length +'$']: reqObj[iterator]})	
                reqObj[iterator] = '$additionalData'+ (Object.keys(additionalData).length -1) +'$'	
              }	
            }	
            // obj = format.replace('"${body}"', element.buttonBody.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));	
            obj = format.replace('"${body}"',JSON.stringify(reqObj).replace(/[{}]/g, ''));	
            for (const iterator in additionalData){	
            obj = obj.replace('"'+iterator+'"',JSON.stringify(additionalData[iterator]));	
            } parseObj  = JSON.parse(obj)
          }catch(error){
            console.log(error)
          }
          // let obj = format.replace('"${body}"', element.buttonBody.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));
          this.post(apiUrl, parseObj, (headers.length > 0 || Object.keys(headerObj).length > 0) ? httpOptions : null).subscribe(res => {
            // if (this.senApiData === true) {
            //   this.common.setSendApiData(true, res);
            // }
            // if (eval(responseFormat) != undefined) {
            //   if (patchControl != null) {
            //     patchControl.forEach(obj => {
            //       this.item.forEach(element => {
            //         if (element.label == obj.field || element.formControlName == obj.field) {
            //           this.form.get(element.formControlName).patchValue(eval(obj.response));
            //           if (element.LockControl) {
            //             this.form.get(element.formControlName).disable();
            //           }
            //           this.form.updateValueAndValidity();
            //           this.formChange(this.item);
            //         }
            //       });
            //     });
            //   }
            // } else {
            //   this.formChange(this.formFields);
            // }



            if (element.key && element.value) {
              try {
                let newKey = element.key.substring(element.key.lastIndexOf(".") + 1, element.key.length);
                let newValue = element.value.substring(element.value.lastIndexOf(".") + 1, element.value.length);
                let result = [];
                var mySubString = element.key.substring(
                  element.key.indexOf(".") + 1,
                  element.key.lastIndexOf(".")
                );
                var finalevalstring:any = 'res.' + mySubString;
                eval(finalevalstring).forEach(element => {
                  let key = element[newKey];
                  let value = element[newValue];
                  result.push({ key: key, value: value,
                    "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null,
                    element:element
                   });
                });
                element.listOfValues = result;
                this.form.get(element.formControlName).updateValueAndValidity()
              }
              catch (e) {
                console.error(e);
              }
            }
          }, ((error) => {
            console.log('error:',error);
            this.formChange(this.formFields);
          }));
        } else if (method == 'GET') {
          this.get(apiUrl, headers.length > 0 ? httpOptions : null).subscribe(res => {
            if (responseFormat && eval(responseFormat) != undefined) {
              if (patchControl != null) {
                patchControl.forEach(obj => {
                  this.item.forEach(element => {
                    if (element.label == obj.field || element.formControlName == obj.field) {
                      this.form.get(element.formControlName).patchValue(eval(obj.response));
                      if (element.LockControl) {
                        this.form.get(element.formControlName).disable();
                      }
                      this.form.updateValueAndValidity();
                      this.formChange(this.item);
                    }
                  });
                });
              }
            } else {
              this.formChange(this.formFields);
            }
          }, ((error) => {
            this.formChange(this.formFields);
          }));
        }
      }
    });
  }

  public post(url, data, httpOptions): Observable<any> {
    return this.http.post(url, data, httpOptions == null ? undefined : httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public put(url, data, httpOptions): Observable<any> {
    return this.http.put(url, data, httpOptions == null ? undefined : httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public deleteAPI(url, data, httpOptions): Observable<any> {
    return this.http.delete(url + '/' + data, httpOptions == null ? undefined : httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public get(url, httpOptions): Observable<any> {
    return this.http.get(url, httpOptions == null ? undefined : httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error) {
    let errorMessage = {};
    if (error.error instanceof ErrorEvent) {
      errorMessage = { message: `${error.error.message}` };
    } else {
      errorMessage = { code: `${error.status}`, message: `${error.message}` };
    }
    return throwError(errorMessage);
  }

  getFormData() {
    let obj = {
      "data": {
        "spname": "usp_unfyd_data_collection_form",
        "parameters": {
          "FLAG": "EDIT",
          "FORMTYPE": this.data.path,
          PRODUCTID: this.data.productId
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'getFormData');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.allFormControl = []
        for (let key in res.results.data) {
          if (res.results.data[key].FormReq) {
            this.allFormControl.push(JSON.parse(res.results.data[key].FormReq))
            if (res.results.data[key].Id)
              Object.assign(this.allFormControl[this.allFormControl.length - 1], { Id: res.results.data[key].Id });
          }
        }
        this.createForm()
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }

  changeListOptions(index,value){
    setTimeout(() => {
      console.log("before:",this.formFields[index].listOfValues);
      this.formFields[index].listOfValues = [...value]
      console.log("after:",this.formFields[index].listOfValues);
      // this.formChange(this.formFields);
      // this.addNewItem(this.formFields)
      console.log("::::",this.formFields);
    });
  }

  dropdownChanged(formControlName,item){
    let a = this.allFormControl.filter(aa => aa.resetValueOnParentChange)
    let optionData = (item.listOfValues.filter(res => res.value  == this.form.value[item.formControlName]))
    let option = optionData.length > 0 ? optionData[0] : {}
    let b = []
    let c = []
    if(a.length > 0) b= this.allFormControl.filter(aa => aa?.formControlName == formControlName)
    if(b.length > 0 && a.length > 0) c = a.filter(aa => aa?.parent == b[0]?.label)
    if(c.length > 0) c.forEach(element => {
      console.log(element);
      this.form.controls[element.formControlName].patchValue('',{emitEvent: false})
    });

    if(item.patchValueToControlsWhenChanged){
      item.patchValueToControls.forEach(element => {
        if(element.field && this.common.checkTruthyValue(element.field) && element.key && this.common.checkTruthyValue(element.key)){
          let keyString = 'option.'+element.key
          try{
            if(eval(keyString)){
              this.form.controls[element.field].patchValue(eval(keyString))
              this.form.controls[element.field].updateValueAndValidity()
            }
          } catch{e => console.error(e)}
        }
      });
    }
        if(item.patchResponseToDropdownOption){
      item.patchDropdowns.forEach(element2 => {
        if (element2.field && element2.key && element2.value) {
          try {
            let newKey = element2.key.substring(element2.key.lastIndexOf(".") + 1, element2.key.length);
            let newValue = element2.value.substring(element2.value.lastIndexOf(".") + 1, element2.value.length);
            let result = [];
            var mySubString = element2.key.substring(
              element2.key.indexOf(".") + 1,
              element2.key.lastIndexOf(".")
            );
            var finalevalstring:any = 'res.' + mySubString;
            // Function('return ' + finalevalstring)().forEach(element => {
            eval(finalevalstring).forEach(element3 => {
              let key = element3[newKey];
              let value = element3[newValue];
              result.push({ key: key, value: value,
                "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null
                 , element: element3
                });
            });
            if(result.length >0){
              this.formFields.forEach((element4,index) => {
                if(element2.field == element4.formControlName || element2.field == element4.label){
                  // console.log("values:",element4.listOfValues);
                  // setTimeout(() => {
                  //   this.formFields[index].listOfValues = result;
                  // });
                  this.changeListOptions(index,result)
                  // console.log("values:",element4.listOfValues);
                  // this.form.get(element4.formControlName).updateValueAndValidity()
                }
              })
            }
          }
          catch (e) {
            console.error(e);
          }
        }
      });
    }
    if(item.APICallAfterChange){
      this.APICallAfterDropdownChange(item.APICallAfterChangeConfig)
    }
  }

  APICallAfterDropdownChange(element){
    let objPattern: any = {};
    let auth :any= {}
    let method: any;
    let apiUrl: any;
    let headers = [];
    let objKey, objValue = [];
    let format: any;
    let patchControl: any;
    let disable: boolean;
    let responseFormat: any;

    element.buttonBody.forEach(obj => {
      if(obj.Key && obj.Value) Object.assign(objPattern, { [obj.Key]: obj.Value });
    });

  objKey = Object.keys(objPattern);
  objValue = Object.values(objPattern);
  method = element.APIMETHOD;
  apiUrl = element.APIURL;
  auth = element.buttonAuth
  headers = element.buttonHeaders;
  format = element.Format;
  disable = element.FormDisable;
  patchControl = element.PatchControl;
  responseFormat = element.FormatResponse;
  let headerObj:any = {};
    if(auth.type == 'Bearer Token'){
      headerObj['Authorization'] = auth.token == "$token$" ? ('Bearer '+this.token) : ('Bearer '+auth.token)
    }else if(auth.type == 'API Key'){
      if(auth.add_to == 'Query Params'){
        if(auth.key !== null && auth.key !== undefined && auth.key !== '' && auth.key.trim() !== '' &&
        auth.value !== null && auth.value !== undefined && auth.value !== '' && auth.value.trim() !== '')
        apiUrl = apiUrl+ '?'+auth.key+'='+auth.value
      }else if(auth.add_to == 'Header'){
        if(auth.key !== null && auth.key !== undefined && auth.key !== '' && auth.key.trim() !== '' &&
          auth.value !== null && auth.value !== undefined && auth.value !== '' && auth.value.trim() !== '')
        headerObj[auth.key] = auth.value
      }
    }
  headers.forEach(element => {
    if(element.key && element.value) headerObj[element.key] = element.value == "$token$" ? ('Bearer '+this.token) : element.value
  });
  let httpOptions:any
    httpOptions = {
      headers: {...headerObj}
    }
  let reqObj = {};
  objValue.forEach((element, index) => {
    this.item.forEach(obj => {
      if (element == obj.label || element == obj.formControlName) {
        let key = objKey[index];
        reqObj[key] = this.form.value[obj.formControlName]
      }
    });
  });
  if (method.toLowerCase() == 'post') {
    let additionalData = {}	
    let obj = ''	
    let parseObj = {}	
    try{	
      for (const iterator in reqObj) {	
        console.log(typeof reqObj[iterator]);	
        if(typeof reqObj[iterator] == 'object'){	
          Object.assign(additionalData,{['$additionalData'+ Object.keys(additionalData).length +'$']: reqObj[iterator]})	
          reqObj[iterator] = '$additionalData'+ (Object.keys(additionalData).length -1) +'$'	
        }	
      }	
      // obj = format.replace('"${body}"', element.buttonBody.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));	
      obj = format.replace('"${body}"', JSON.stringify(reqObj).replace(/[{}]/g, ''));	
      for (const iterator in additionalData){	
        obj = obj.replace('"'+iterator+'"',JSON.stringify(additionalData[iterator]));	
      }   
      parseObj  = JSON.parse(obj)
    }catch(error){
      console.log(error)
    }
    this.post(apiUrl, parseObj, (headers.length > 0 || Object.keys(headerObj).length > 0) ? httpOptions : null).subscribe(res => {

      if(element.response){
        element.response.forEach(element1 => {
          if(element1.field && this.common.checkTruthyValue(element1.field) && element1.response && this.common.checkTruthyValue(element1.response)){
            try{
            //   if(eval(keyString)){
                // this.form.controls[element1.field].patchValue(eval(keyString))
                this.form.get(element1.field).patchValue(eval(element1.response));
                this.form.controls[element1.field].updateValueAndValidity()
              // }
            } catch{e => console.error(e)}
          }
        });
      }
      if(element.patchResponseToDropdownOption){
        element.patchDropdowns.forEach(element2 => {
          if (element2.field && element2.key && element2.value) {
            try {
              let newKey = element2.key.substring(element2.key.lastIndexOf(".") + 1, element2.key.length);
              let newValue = element2.value.substring(element2.value.lastIndexOf(".") + 1, element2.value.length);
              let result = [];
              var mySubString = element2.key.substring(
                element2.key.indexOf(".") + 1,
                element2.key.lastIndexOf(".")
              );
              var finalevalstring:any = 'res.' + mySubString;
              // Function('return ' + finalevalstring)().forEach(element => {
              eval(finalevalstring).forEach(element3 => {
                let key = element3[newKey];
                let value = element3[newValue];
                result.push({ key: key, value: value,
                  "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null
                   , element: element3
                  });
              });
              if(result.length >0){
                this.formFields.forEach((element4,index) => {
                  if(element2.field == element4.formControlName || element2.field == element4.label){
                    // console.log("values:",element4.listOfValues);
                    // setTimeout(() => {
                    //   this.formFields[index].listOfValues = result;
                    // });
                    this.changeListOptions(index,result)
                    // console.log("values:",element4.listOfValues);
                    // this.form.get(element4.formControlName).updateValueAndValidity()
                  }
                })
              }
            }
            catch (e) {
              console.error(e);
            }
          }
        });
      }
    }, ((error) => {
      console.log('error:',error);
      this.formChange(this.formFields);
    }));
  } else if (method.toLowerCase() == 'get') {
      this.get(apiUrl, headers.length > 0 ? httpOptions : null).subscribe(res => {
        element.patchValueToControls.forEach(element1 => {
          if(element1.field && this.common.checkTruthyValue(element1.field) && element1.key && this.common.checkTruthyValue(element1.key)){
            let keyString = 'option.'+element1.key
            try{
              if(eval(keyString)){
                this.form.controls[element1.field].patchValue(eval(keyString))
                this.form.controls[element1.field].updateValueAndValidity()
              }
            } catch{e => console.error(e)}
          }
        });
      }), ((error) => {
        console.log('error:',error);
        this.formChange(this.formFields);
      })
    }
  }

  InputClick() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'InputClick');
    if (this.selectedValue == "JSON" || this.control == 'Dropdown' || this.control == 'MultiSelect') {
      this.JSONField = true;
      this.openJSONDialog("JSONTable", this.myformArray, this.displayedFields);
    }
  }

  openJSONDialog(type, data, displayCol) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'openJSONDialog');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
        displayedFields: displayCol
      },
      width: "60%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      console.log(this.myformArray);
      if (status === true) {
        this.myformArray.value.forEach(element => {
          if ((element.Key !== '' || element.Value !== '') && (element.Key !== "" || element.Value !== "") && (element.Key !== null || element.Value !== null) && (element.Key !== undefined || element.Value !== undefined)) {
            this.form
              .get("ConfigValue")
              .patchValue(JSON.stringify(this.myformArray.value));
          }
          else {
            this.form.get('ConfigValue');
          }
        });
      }
      if (status === false) {
        let data = this.form.get("ConfigValue").value;
        this.form.get("ConfigValue").patchValue(data);
        this.form.updateValueAndValidity();
        let arraydata = JSON.parse(data)
        arraydata.forEach((element, i) => {
          if (i >= this.myformArray.length) {
            const newGroup = new FormGroup({});
            this.displayedFields.forEach(x => {
              newGroup.addControl(x, new FormControl());
            });
            this.myformArray.push(newGroup);
          }
          this.myformArray.controls[i].controls['Key'].patchValue(element.Key)
          this.myformArray.controls[i].controls['Value'].patchValue(element.Value)
        });
        let a = this.myformArray.length
        let b = arraydata.length
        if (a > b) {
          for (let i = 0; i < a; i++) {
            if (i >= b) {
              this.myformArray.removeAt(this.myformArray.length - 1);
            }
          }
        }
        // if(b > a){
        //   for(let i = 0 ; i < b; i++){
        //     const newGroup = new FormGroup({});
        //     this.displayedFields.forEach(x => {
        //       newGroup.addControl(x, new FormControl());
        //     });
        //     this.myformArray.push(newGroup);
        //     this.myformArray.setValue(arraydata);
        //   }
        // }
      }
      if (status !== undefined) {
      }
    });
  }
  onOptionsSelected(e) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', e, 'onOptionsSelected');

    this.selectedValue = e.value;
    if (this.selectedValue == "JSON") {
      this.disabledValue = true;
      this.openJSONDialog("JSONTable", this.myformArray, this.displayedFields);
    } else if (this.selectedValue == "Text") {
    }
    else if (this.selectedValue == "Multiple") {
      this.actions(e);
    }
  }
  onControlSelected(e) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', e, 'onControlSelected');

    var tempSelection = e.value === undefined ? e : e.value

    if (tempSelection == 'Dropdown') {
      this.form.get('ConfigValue').setValidators(Validators.required);
      this.form.get('Type').setValue('JSON');
      this.selectedValue = 'JSON';
      this.form.get('Type').disable();
      if (this.data.type !== 'addFeatureControl' && this.data.type !== 'editFeatureControl') {
        this.form.get('AdditionalProperty').removeValidators
        this.form.get('AdditionalProperty').setValidators(Validators.nullValidator);
        this.form.controls.AdditionalProperty.reset();
      }
    } else if (tempSelection == 'MultiSelect') {
      this.form.get('ConfigValue').setValidators(Validators.required);
      this.form.get('Type').setValue('JSON');
      this.selectedValue = 'JSON';
      this.form.get('Type').disable();
      if (this.data.type !== 'addFeatureControl' && this.data.type !== 'editFeatureControl') {
        this.form.get('AdditionalProperty').removeValidators
        this.form.get('AdditionalProperty').setValidators(Validators.nullValidator);
        this.form.controls.AdditionalProperty.reset();
      }
    }
    else if (tempSelection == 'Textbox') {
      if (this.data.type !== 'addFeatureControl' && this.data.type !== 'editFeatureControl') {
        this.form.get('AdditionalProperty').setValidators(Validators.required);
      }
      this.form.get('ConfigValue').setValidators(Validators.nullValidator);
      this.form.get('ConfigValue').removeValidators
      this.form.controls.ConfigValue.reset();
    } else {
      this.form.get('ConfigValue').clearValidators();
      this.form.get('ConfigValue').setValidators(Validators.nullValidator);
      this.form.controls.ConfigValue.reset();
      if (this.data.type !== 'addFeatureControl' && this.data.type !== 'editFeatureControl') {
        this.form.get('AdditionalProperty').clearValidators();
        this.form.get('AdditionalProperty').setValidators(Validators.nullValidator);
        this.form.controls.AdditionalProperty.reset();
      }
    }
    this.form.get('ConfigValue').updateValueAndValidity();
    if (this.data.type !== 'addFeatureControl' && this.data.type !== 'editFeatureControl') {
      this.form.get('AdditionalProperty').updateValueAndValidity();
    }
  }
  onButtonSelected(e){
    var tempSelection = e.value === undefined ? e : e.value

    if(tempSelection == 'Existing'){
      this.form.get('selectBtn').setValidators(Validators.required);
      this.form.get('holders').setValidators(Validators.nullValidator);
      this.form.get('alertMsgDur').setValidators(Validators.nullValidator)
    }
    else if(tempSelection == 'Custom'){
      this.form.get('holders').setValidators(Validators.required);
      this.form.get('selectBtn').setValidators(Validators.nullValidator);
      this.form.get('alertMsgDur').setValidators(Validators.nullValidator)
    }
  }
  addMoreCondition() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'addMoreCondition');

    let a = false
    if (this.data.andortype && this.form.invalid) {
      this.isnot = true
      a = true;
    } else if (!this.data.andortype && this.form.invalid) {
      this.isnot = true
      a = true;
    }
    return a;
  }

  submitconditions() {
    this.submittedForm = false;
    if (this.form.invalid) {
      this.submittedForm = true;

      this.common.snackbar("Add Error");
      return true;
    }

    var obj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: 'INSERT_CONDITION',
          ruleid: this.data.ruleid,
          Condition: this.form.value.rule,
          ConditionValue: this.form.value.rule != 77 ? this.form.value.channelid : null,
          operator: this.form.value.button,
          CustomAttribute: this.form.value.customvalue,
          CustomValue: this.form.value.customblank,
          AndOr: this.form.value.andor,
          processid: this.userDetails.Processid,
          publicip: this.userDetails.ip,
          privateip: this.userDetails.privateip,
          browsername: this.userDetails.browser,
          CREATEDBY: this.userDetails.Id,
          browserversion: this.userDetails.browser_version,
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'submitconditions');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.closeDialog(res.results.data[0].result);
        this.common.snackbar("Saved Success");
        this.common.sendCERequest('UPDATERULES', this.userDetails.Processid)
      } else {
        this.common.snackbar("General Error");

      }
    },
      (error) => {
        this.common.snackbar("Add Error");
      })


  }



  submitroute() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'submitroute');

    if (this.form.invalid) {
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("General Error");
      return;
    }

    this.dialogRef.close({
      event: true, data: {
        submitroute: this.form.value
      }
    });
  }



  selectChannel(e) {
  }

  selectedRule(e) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', e, 'selectedRule');

    this.Rule = e
    this.orchestrationval()
    this.andorval()

  }

  getChannel() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'getChannel');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.channelType = res.results['data']

    })
  }

  getagent() {
    var Obj1 = {
      data: {
        spname: "USP_UNFYD_TALK_AGENTROUTING",
        parameters: {
          ACTIONFLAG: 'GET_AGENT_NAME',
          ProcessId: this.userDetails.Processid,
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(Obj1), 'getagent');

    this.api.post('index', Obj1).subscribe(res => {
      if (res.code == 200) {
        this.agents = res.results.data
      }
    })
  }

  removeAllBlocks() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'removeAllBlocks');

    this.chartandGraph.blocks = []

    if (this.chartandGraph.chartAndGraph != 'Gauge') {
      this.addBlockAddDashboardCard()
      if (this.chartandGraph.chartAndGraph == 'LicenseUsageBarChart') {
        this.addBlockAddDashboardCard()
      } else if (this.chartandGraph.chartAndGraph == 'Venn') {
        this.addBlockAddDashboardCard()
        this.addBlockAddDashboardCard()
      }
    }

    this.changesDone()
  }

  addCustomFilter() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'addCustomFilter');

    this.chartandGraph.customFilterValues.push(
      {
        customFilterField: ''
      }
    )
  }

  changeCustomFilter() {

  }

  removeCustomField(i) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', i, 'removeCustomField');

    this.chartandGraph.customFilterValues.splice(i, 1)
  }

  removeAllCustomField() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'removeAllCustomField');

    this.chartandGraph.customFilterValues = []
  }

  disableAddMoreCustomFieldButton(): boolean {

    let a = false
    this.chartandGraph.customFilterValues.forEach(element => {
      if (element.customFilterField == null && element.customFilterField == '' && element.customFilterField == undefined && !(element.customFilterField.trim().length === 0)) {
        a = true
      }
    })

    return a;
  }

  columnWidthMoreThan12(): boolean {
    let a: number = 0;
    if (this.dashboardControlTypeSelected == 'List') {
      this.chartandGraph.blocks.forEach(element => {
        a += element.columnWidth
      });
    }
    return a > 12 ? true : false;
  }


  submitDashboardCardData() {
    let dashboardCardsData = []
    if (this.dashboardControlTypeSelected == "Tile") {
      let obj = {
        "data": {
          "flag": "get",
          "filename": "dashboardTilesData",
          "processId": this.userDetails.Processid,
          "product": this.data.data.tabSelected
        }
      }
      this.loader = true
      this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'submitDashboardCardData');

      this.api.post('branding', obj).subscribe(res => {
        if (res.code == 200) {
          dashboardCardsData = JSON.parse(res.results.data)
        }
        dashboardCardsData.push(this.tile)

        let obj1 = {
          "data": {
            "flag": "insert",
            "filename": "dashboardTilesData",
            "processId": this.userDetails.Processid,
            "product": this.data.data.tabSelected,
            "brandingjson": dashboardCardsData
          }
        }
        this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj1), 'submitDashboardCardData');

        this.api.post('branding', obj1).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.common.snackbar("Dashboard Tile Added Successfully", "success");
            this.dialogRef.close(true);
          }
        }, (error) => {
          this.common.snackbar("Something Went Wrong", "error");
        })
      }, (error) => {
        this.common.snackbar("Something Went Wrong", "error");
      }
      )
    } else if (this.dashboardControlTypeSelected == "ChartAndGraph") {

      dashboardCardsData = []
      let obj = {
        "data": {
          "flag": "get",
          "filename": "dashboardCardsData",
          "processId": this.userDetails.Processid,
          "product": this.data.data.tabSelected
        }
      }
      this.loader = true

      this.api.post('branding', obj).subscribe(res => {
        if (res.code == 200) {
          dashboardCardsData = JSON.parse(res.results.data)
        }
        dashboardCardsData.push(this.chartandGraph)

        let obj1 = {
          "data": {
            "flag": "insert",
            "filename": "dashboardCardsData",
            "processId": this.userDetails.Processid,
            "product": this.data.data.tabSelected,
            "brandingjson": dashboardCardsData
          }
        }
        this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj1), 'submitDashboardCardData');

        this.api.post('branding', obj1).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.common.snackbar("Dashboard Card Added Successfully", "success");
            this.dialogRef.close(true);
          }
        }, (error) => {
          this.common.snackbar("Something Went Wrong", "error");
        })
      }, (error) => {
        this.common.snackbar("Something Went Wrong", "error");
      }
      )
    } else if (this.dashboardControlTypeSelected == "List") {
      dashboardCardsData = []
      let obj = {
        "data": {
          "flag": "get",
          "filename": "dashboardCardsData",
          "processId": this.userDetails.Processid,
          "product": this.data.data.tabSelected
        }
      }
      this.loader = true
      this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'submitDashboardCardData');

      this.api.post('branding', obj).subscribe(res => {
        if (res.code == 200) {
          dashboardCardsData = JSON.parse(res.results.data)
        }
        dashboardCardsData.push(this.chartandGraph)

        let obj1 = {
          "data": {
            "flag": "insert",
            "filename": "dashboardCardsData",
            "processId": this.userDetails.Processid,
            "product": this.data.data.tabSelected,
            "brandingjson": dashboardCardsData
          }
        }
        this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj1), 'submitDashboardCardData');

        this.api.post('branding', obj1).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.common.snackbar("Dashboard Card Added Successfully", "success");
            this.dialogRef.close(true);
          }
        }, (error) => {
          this.common.snackbar("Something Went Wrong", "error");
        })
      }, (error) => {
        this.common.snackbar("Something Went Wrong", "error");
      }
      )
    } else if (this.dashboardControlTypeSelected == "ManagementTile") {
      let obj = {
        "data": {
          "flag": "get",
          "filename": "dashboardManagementTilesData",
          "processId": this.userDetails.Processid,
          "product": this.data.data.tabSelected
        }
      }
      this.loader = true
      this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj), 'submitDashboardCardData');

      this.api.post('branding', obj).subscribe(res => {
        if (res.code == 200) {
          dashboardCardsData = JSON.parse(res.results.data)
        }
        dashboardCardsData.push(this.tile)

        let obj1 = {
          "data": {
            "flag": "insert",
            "filename": "dashboardManagementTilesData",
            "processId": this.userDetails.Processid,
            "product": this.data.data.tabSelected,
            "brandingjson": dashboardCardsData
          }
        }
        this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(obj1), 'submitDashboardCardData');

        this.api.post('branding', obj1).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.common.snackbar("Dashboard Management Tile Added Successfully", "success");
            this.dialogRef.close(true);
          }
        }, (error) => {
          this.common.snackbar("Something Went Wrong", "error");
        })
      }, (error) => {
        this.common.snackbar("Something Went Wrong", "error");
      }
      )
    }
  }

  resetDashboardCardData() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'resetDashboardCardData');

    if (this.dashboardControlTypeSelected == "Tile") {
      this.tile = {
        api: null,
        apiRequest: null,

        visible: true,

        reloadTimeEnable: false,
        reloadTime: 10,
        reloadTimeType:'sec',

        countApi: null,
        countRequest: null,

        mainPlaceHolder: true,
        mainPlaceHolderApi: null,
        mainPlaceHolderRequest: null,
        mainPlaceHolderHeader: null,
        mainPlaceHolderKey: null,

        backgroundColor: 'blue',

        subPlaceHolder1: true,
        subPlaceHolder1Api: null,
        subPlaceHolder1Request: null,
        subPlaceHolder1Header: null,
        subPlaceHolder1Key: null,

        subPlaceHolder2: true,
        subPlaceHolder2Api: null,
        subPlaceHolder2Request: null,
        subPlaceHolder2Header: null,
        subPlaceHolder2Key: null,

        subPlaceHolder3: true,
        subPlaceHolder3Api: null,
        subPlaceHolder3Request: null,
        subPlaceHolder3SelectedValue: null,
        subPlaceHolder3Header: null,
        subPlaceHolder3Key: null,
      }
    } else if (this.dashboardControlTypeSelected == "ChartAndGraph") {
      this.chartandGraph = {
        dashboardControlTypeSelected: this.dashboardControlTypeSelected,
        visible: true,
        api: null,
        apiRequest: null,
        dataApi: null,
        dataRequest: null,
        showDateChangePart: false,
        reloadTimeEnable: false,
        reloadTime: 10,
        reloadTimeType:'sec',

        chartAndGraph: null,
        header: null,
        dateFilter: null,
        displayDateFilter: false,

        displayListHeader: false,
        customFilter: false,
        customFilterValues: [{
          customFilterField: ''
        }],

        gaugePercentCount: false,
        gaugePercentCountDataKey: null,
        gaugePercentCountAPI: null,
        gaugePercentCountAPIRequest: null,
        gaugePercentCountText: null,
        gaugePercentColor: this.common.colorArray[0],

        textBelowGaugeCount: false,
        textBelowGaugeCountText: null,
        textBelowGaugeCountTextAPI: null,
        textBelowGaugeCountTextAPIRequest: null,
        textBelowGaugeColor: this.common.colorArray[0],

        sectionBelowBarChartIconOnTop: false,
        sectionBelowBarChartIconOnTopLeftText: null,
        sectionBelowBarChartIconOnTopLeftApi: null,
        sectionBelowBarChartIconOnTopLeftApiRequest: null,
        sectionBelowBarChartIconOnTopRightText: null,
        sectionBelowBarChartIconOnTopRightApi: null,
        sectionBelowBarChartIconOnTopRightApiRequest: null,

        maxLicenseAllowed: null,
        maxLicenseAllowedLineColor: this.common.colorArray[0],
        maxlicensedUsed: null,
        maxlicensedUsedRequest: null,
        maxlicensedUsedTime: null,
        maxlicensedUsedTimeRequest: null,

        displayInnerTextDoughnut: false,
        innerTextDoughnut: 'Total',
        showSum: false,

        hideLegend: null,
        blocks: [
          {
            header: null,
            key: null,
            visible: true,
            api: null,
            request: null,
            backgroundColor: this.colorPalette[0],
            selectedIcon: null,
            selectedIconColor: 'blue',
            columnWidth: 1,
            displayType: 'text'
          }
        ]
      };
    } else if (this.dashboardControlTypeSelected == "List") {
      this.chartandGraph = {
        dashboardControlTypeSelected: this.dashboardControlTypeSelected,
        visible: true,
        api: null,
        apiRequest: null,
        dataApi: null,
        dataRequest: null,
        showDateChangePart: false,
        reloadTimeEnable: false,
        reloadTime: 10,
        reloadTimeType:'sec',

        chartAndGraph: null,
        header: null,
        dateFilter: null,
        displayDateFilter: false,

        displayListHeader: false,
        customFilter: false,
        customFilterValues: [{
          customFilterField: ''
        }],

        gaugePercentCount: false,
        gaugePercentCountDataKey: null,
        gaugePercentCountAPI: null,
        gaugePercentCountAPIRequest: null,
        gaugePercentCountText: null,
        gaugePercentColor: this.common.colorArray[0],

        textBelowGaugeCount: false,
        textBelowGaugeCountText: null,
        textBelowGaugeCountTextAPI: null,
        textBelowGaugeCountTextAPIRequest: null,
        textBelowGaugeColor: this.common.colorArray[0],

        sectionBelowBarChartIconOnTop: false,
        sectionBelowBarChartIconOnTopLeftText: null,
        sectionBelowBarChartIconOnTopLeftApi: null,
        sectionBelowBarChartIconOnTopLeftApiRequest: null,
        sectionBelowBarChartIconOnTopRightText: null,
        sectionBelowBarChartIconOnTopRightApi: null,
        sectionBelowBarChartIconOnTopRightApiRequest: null,

        maxLicenseAllowed: null,
        maxLicenseAllowedLineColor: this.common.colorArray[0],
        maxlicensedUsed: null,
        maxlicensedUsedRequest: null,
        maxlicensedUsedTime: null,
        maxlicensedUsedTimeRequest: null,

        displayInnerTextDoughnut: false,
        innerTextDoughnut: 'Total',
        showSum: false,

        hideLegend: null,
        blocks: [
          {
            header: null,
            key: null,
            visible: true,
            api: null,
            request: null,
            backgroundColor: this.colorPalette[0],
            selectedIcon: null,
            selectedIconColor: 'blue',
            columnWidth: 1,
            displayType: 'text'
          }
        ]
      };
    }
  }

  disabledDashboardCardAdd(): boolean {


    let a: boolean = false;
    if (this.dashboardControlTypeSelected == "Tile") {

    } else if (this.dashboardControlTypeSelected == "ChartAndGraph") {
      if (!this.chartandGraph.chartAndGraph) {
        a = true
      }
    } else if (this.dashboardControlTypeSelected == "List") {

    }

    return a;
  }
  getSkill() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "SKILL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getSkill');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.skillType = res.results['data'];
    })
  }

  rconfigValue() {
    this.requestObj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CUSTOM_OPERATOR",
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'rconfigValue');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.ConfigValue = res.results['data'];
    })
  }


  RMBased() {
    this.requestObj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "RM_BASED",
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'RMBased');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.RMType = res.results['data'];
    })
  }


  getchannelvalue() {
    this.requestObj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getchannelvalue');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.channelvalue = res.results['data'];
    })
  }

  getGroup() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "GROUP",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getGroup');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.getGroupList = res.results['data'];
    })
  }

  getCustom() {
    this.requestObj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CUSTOM_ATTR"
        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getCustom');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.customtype = res.results['data'];
    })
  }

  flipaction() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'flipaction');

    if (this.form.value.route == 'skill') {
      this.getSkill()
    }
  }


  maskCharacters() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'maskCharacters');

    let startIndex = this.data.value.startIndex
    let endIndex = this.data.value.endIndex
    if (this.data.value.endIndex >= this.form.value.input.length) {
      endIndex = this.form.value.input.length
    }

    var regexExp = new RegExp(this.data.value.regex, 'g');
    if (regexExp.test(this.form.value.input)) {

      let masked = this.form.value.input.substring(0, startIndex) + this.data.value.maskChar.repeat(this.form.value.input.substring(startIndex, endIndex).length) +
        this.form.value.input.substring(endIndex, this.form.value.input.length)
      this.form.controls.maskInput.patchValue(masked)
    }
    else {
      this.form.controls.maskInput.patchValue('')

    }
  }

  orchestrationrule() {
    var Obj1 = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: 'GET_DDL_CONDITION'

        }
      }
    }
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(Obj1), 'orchestrationrule');

    this.api.post('index', Obj1).subscribe(res => {
      if (res.code == 200) {
        this.rule = res.results.data

      }
    })
  }
  htmlDecode(data: any) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(data), 'htmlDecode');

    data = data.replace(/\&amp;/g, '&');
    data = data.replace(/\&gt;/g, '>');
    data = data.replace(/\&lt;/g, '<');
    data = data.replace(/\&quot;/g, '');
    data = data.replace(/\&apos;/g, '');
    return data;
  }

  passwordStrength(e) {
    this.PasswordStrengthval = e;
  }
  close(event) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', event, 'close');

    if (event == true) {
      this.closeDialog(true);
    }
  }


  callDrillDownData() {
    this.common.hubControlEvent(this.data.type, 'click', '', '', '', 'callDrillDownData');

    this.loader = true;
    this.tabValue = [];
    this.tabKey = []
    this.finalField = []
    this.data.req.data.parameters.pageno = this.page
    this.data.req.data.parameters.pagesize = this.itemsPerPage
    this.api.dynamicDashboard(this.data.url, this.data.req).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        var tempRes = [];
        if (Object.keys(res.results).length > 0) {
          tempRes = res?.results?.data[0]
          this.totalItems = res?.results?.data[1][0].Total


      if(this.localizationformat){
          for (let data of tempRes) {
            if(data['Start Time'])
            {
              data['Start Time'] = moment(data['Start Time']).format(this.localizationformat);
            }
            if(data['End Time'])
            {
              data['End Time'] = moment(data['End Time']).format(this.localizationformat);
            }
            if(data['Route Time'])
            {
              data['Route Time'] = moment(data['Route Time']).format(this.localizationformat);
            }
            if(data['Login Time'])	
            {	
              data['Login Time'] = moment(data['Login Time']).format(this.localizationformat);	
            }
            if(data['Agent Route Time'])
            {
              data['Agent Route Time'] = moment(data['Agent Route Time']).format(this.localizationformat);
            }
            if(data['Time'])
            {
              data['Time'] = moment(data['Time']).format(this.localizationformat);
            }
            if(data['Status Time'])
            {
              data['Status Time'] = moment(data['Status Time']).format(this.localizationformat);
            }
            if(data['Last Routed Time'])
            {
              data['Last Routed Time'] = moment(data['Last Routed Time']).format(this.localizationformat);
            }
          }
        }
          for (let data of tempRes) {

            this.tabValue.push(data);
          }

          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              // this.tabKey.push({ value: key });	
              this.tabKey.push(key);
            }
          }
        }

        if (tempRes.length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
        this.getFilter()
        this.feildChooser2()
      } else {
        this.loader = false;
      }
    }, (error) => {
      this.loader = false;
    }
    )
  }


  changeCheckboxNestedControlMandatoryStatus(item: any) {
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(item), 'changeCheckboxNestedControlMandatoryStatus');

    if (this.form.value[this.formFields[item].formControlName] && this.formFields[item].nestedControlOfWhom.length > 0) {
      this.formFields[item].nestedControlOfWhom.forEach(element => {
        this.formFields.forEach((element1: any) => {
          if (element == element1.label) {
            if (element1.ControlType == 'textbox' && element1.RegularExpression) {
              this.form.controls[element1.formControlName].addValidators([Validators.required, Validators.pattern(element1.RegularExpression)])
            } else {
              this.form.controls[element1.formControlName].addValidators(Validators.required)
            }
            this.form.controls[element1.formControlName].markAsUntouched()
            this.form.controls[element1.formControlName].updateValueAndValidity()
          }
        })
      });
    } else if (!this.form.value[this.formFields[item].formControlName] && this.formFields[item].nestedControlOfWhom.length > 0) {
      this.formFields[item].nestedControlOfWhom.forEach(element => {
        this.formFields.forEach((element1: any) => {
          if (element == element1.label) {
            this.form.controls[element1.formControlName].patchValue('')
            this.form.controls[element1.formControlName].clearValidators()
            this.form.controls[element1.formControlName].markAsUntouched()
            if (element1.ControlType == 'textbox' && element1.RegularExpression) this.form.controls[element1.formControlName].addValidators(Validators.pattern(element1.RegularExpression))
            this.form.controls[element1.formControlName].updateValueAndValidity()
          }
        })
      });
    }
    this.form.updateValueAndValidity()
  }

  // userLanguageName:any=[];


  getLanguageStorage() {
    this.loader = true;
    this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName'))
    if (this.userLanguageName == null || this.userLanguageName == undefined) {
      this.getLanguage();
    } else {
      let chlen = this.userLanguageName.length
      this.userLanguageName.forEach(element => {
        if (element.ChannelName == 'Voice') {
          this.userLanguageName = true;
        }

        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

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
    this.common.hubControlEvent(this.data.type, 'click', '', '', JSON.stringify(this.requestObj), 'getLanguage');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        localStorage.setItem("userLanguageName", res.results.data[1][0].UserLanguage);
        this.getLanguageStorage()
      }
      // this.languageType = res.results['data']
    })
  }

  // getLanguageStorage(){
  //   this.loader = true;
  //   this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName'))
  //   console.log('this.LanguageStore all', this.userLanguageName)
  //   if(this.userLanguageName == null || this.userLanguageName == undefined)
  //   {
  //     this.getLanguage();
  //   }else{
  //     let chlen = this.userLanguageName.length
  //     this.userLanguageName.forEach(element => {
  //       if(element.ChannelName == 'Voice')
  //       {
  //         this.userLanguageName = true;
  //       }

  //       chlen--;
  //       if(chlen == 0)
  //       {
  //         this.loader =false
  //       }

  //     })
  //   }

  // }


  directUploadInPreview(event, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_holiday_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
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
                this.data.data.img = res.results.URL;
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

  queueRemove(data) {
    var obj = {
      "EVENT": "EVENTSESSIONEND",
      "TENANTID": this.userDetails.Processid,
      "LANGUAGECODE": "en",
      // "SESSIONID": data['Remove'],	
      "SESSIONID": data.Action.RemoveSessionId,
      "TYPE": "ADMIN"
    }
    this.common.sendCERequestObj('EVENTSESSIONEND', this.userDetails.Processid, obj)
  }

  queuePriority(data) {
    var obj = {
      "EVENT": "EVENTQUEUEPRIORITY",
      "LANGUAGECODE": "en",
      // "SESSIONID": data['Remove'],	
      // "SESSIONID": data.Action.ChannelPriority,	
      "SESSIONID": data.Action.RemoveSessionId,
      "TYPE": "ADMIN"
    }
    this.common.sendCERequestObj('EVENTQUEUEPRIORITY', this.userDetails.Processid, obj)
  }

  notifyDialogclick(event) {
    if (this.data.Id !== '' && this.data.Id !== undefined) {
      this.data.tabSelected = event
    }
  }

  viewLabels(lang) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'viewLabels',
        flag: 'view',
        lang
      },
      width: 'auto'
    });
    dialogRef.afterClosed().subscribe(status => {
    });
  }

  getLabels() {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_form_validation",
        parameters: {
          FLAG: "GET_DEFAULT_LABEL"
        },
      },
    };
    this.common.hubControlEvent('Dialog', 'click', '', '', JSON.stringify(obj), 'getlabels');

    this.api.post("index", obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0 && res.results.data.length > 0) {
          res.results.data.forEach(element => {
            this.defaultLabels.push(JSON.parse(element.DefaultJson))
          });
          // console.log("defaultLabels:",this.defaultLabels);
        }
      }
    });
  }

  //  add more languages starts here

  getAllLocalizationData() {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_localization",
        parameters: {
          FLAG: "GET_MODULE",
          PRODUCTID: this.data.productId,
        },
      },
    };

    this.api.post("index", obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        this.localizationData = []
        if (res.results.data.length > 0) {
          res.results.data.forEach((element) => {
            if (element.ParentModuleName == "Language") {
              if (element.AssignedValue == 'false') {
                element.AssignedValue = false
              }
              if (element.AdditionalPropertyValue == 'false') {
                element.AdditionalPropertyValue = false
              }
              if (element.Status == 'false') {
                element.Status = false
              }
              if (element.AdditionalPropertyValue) {
                this.defaultLanguage.defaultLanguage = element.ModuleName
                this.defaultLanguage.defaultLanguageCode = element.LanguageCode
              }
              this.localizationData.push(element)
            }
          })
          this.Localizationdateformat = JSON.parse(localStorage.getItem("localizationData"));
        }
        // console.log("localizationData:",this.localizationData);

      } else {
        this.loader = false;
        this.common.snackbar('General Error');
      }
    }, error => {
      this.loader = false;
      this.common.snackbar('General Error');
    })
  }

  makeDefaultLanguage(moduleName) {
    this.localizationData.forEach(element => {
      if (element.ModuleName == moduleName) {
        element.AdditionalProperty = 'Default'
        element.AdditionalPropertyValue = true
      } else {
        element.AdditionalProperty = 'Default'
        element.AdditionalPropertyValue = false
      }
    });
    // console.log("localizationData:",this.localizationData);
    this.saveLanguageData()
  }

  languageDataFromTenant() {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          FLAG: "GET_LANGUAGE_DATA",
          PROCESSID: this.userDetails.Processid,
        },
      },
    };
    this.common.hubControlEvent('Dialog', 'click', '', '', JSON.stringify(obj), 'languageDataFromTenant');

    this.api.post("index", obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0) {
          res.results.data.forEach(element => {
            this.languagesByTenant.push(element.LanguageCode)
          });
        }
      }
    });
  }

  makeDefault(moduleName) {
    this.localizationData.forEach(element => {
      if (element.ModuleName == moduleName && element.AdditionalPropertyValue) return;
      if (element.ModuleName == moduleName) {
        if (element.Status) {
          this.confirmationToMakeDefault('Confirmation To Make Default Language')
          this.subscription.push(this.common.getIndividualUpload$.subscribe(res => {
            if (res.status) {
              this.makeDefaultLanguage(moduleName)
            }
            this.subscription.forEach((e) => {
              e.unsubscribe();
            });
          }))
        } else {
          this.common.snackbar('Activate lanaguage before making it default')
        }
      }
      // else{
      //   element.AssignedValue = false
      // }
    });
  }

  confirmationToMakeDefault(val) {
    let data2 = this.common.alertDataAPI.filter(
      (a) => a["Alert Message"] == val
    );
    let data = data2[0]
    let dataVal = {
      alertMsg: data['Alert Message'],
      alertMsgDur: data['Alert Message Duration'],
      alertMsgPos: data['Alert Message Position'],
      alertMsgType: data['Message Type'],
      alertMsgSubType: data['Message Sub Type'],
      description: data['Message Body'],
      language: data['Language Code'],
      msgBody: data['Message Body'],
      msgHead: data['Message Head'],
      selectBtn: data['Button Type'],
      icon: data['Pop-Up Icon URL'],
      buttontype:data['Button Category'],
    }
    let data1 = {
      data: dataVal
    }
    this.common.previewAlertPopup(data1);
  }

  saveLanguageData() {
    let a = 0
    this.localizationData.forEach(element => {
      let obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: element?.AssignedValue,
            ASSIGNEDPROPERTY: element?.AssignedProperty == 'left' ? 'left' : 'right',
            ADDITIONALPROPERTY: element?.AdditionalProperty,
            AdditionalPropertyValue: element?.AdditionalPropertyValue,
            STATUS: element.Status,
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.data.productId,
            PRODUCTNAME: this.data.productName,
            LANGUAGECODE: element?.LanguageCode,
            MODULENAME: element.ModuleName,
            PARENTCONTROLID: element.ParentControlId,
            Id: element.Id,
          },
        },
      };

      this.api.post("index", obj).subscribe((res) => {
        if (res.code == 200) {
          a++;
          if (a == this.localizationData.length) {
            this.common.snackbar('Update Success')
          }
        }
      }, error => {
        this.common.snackbar('General Error')
      })
    })
  }

  saveSingleLanguageData(element, i) {
    let obj = {
      data: {
        spname: "usp_unfyd_localization",
        parameters: {
          FLAG: "UPDATE_MODULE",
          ASSIGNEDVALUE: element?.AssignedValue,
          ASSIGNEDPROPERTY: element?.AssignedProperty == 'left' ? 'left' : 'right',
          ADDITIONALPROPERTY: element?.AdditionalProperty,
          AdditionalPropertyValue: element?.AdditionalPropertyValue,
          STATUS: element.Statusteams,
          PROCESSID: this.userDetails.Processid,
          PRODUCTID: this.data.productId,
          PRODUCTNAME: this.data.productName,
          LANGUAGECODE: element?.LanguageCode,
          MODULENAME: element.ModuleName,
          PARENTCONTROLID: element.ParentControlId,
          Id: element.Id,
        },
      },
    };

    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        // this.common.snackbar('Update Success')
        if ((Object.keys(res.results.data[0])).includes('result')) {
          if (res.results.data[0].result.includes("success")) {
            this.loader = false
            this.common.snackbar('Update Success');
            this.localizationData[i].Status = false;
          } else {
            this.loader = false
            this.common.snackbar('General Error')
          }
        } else {
          this.loader = false
          this.common.snackbar('General Error')
        }
      }
    }, error => {
      this.common.snackbar('General Error')
    })
  }

  enableLanguage(i) {
    this.labeToCompare = true
    this.costToCompare = true
    this.loader = true
    let a = this.localizationData.filter(res => res.AdditionalPropertyValue)
    // console.log("aaaa:",a);

    if (!this.localizationData[i].Status) {
      this.getLabelsToCompare(a[0]?.LanguageCode ? a[0]?.LanguageCode : 'en', this.localizationData[i].LanguageCode, i);
      this.getCostingToCompare(i);
      this.localizationData.forEach(element => {
        if (element.LanguageCode == this.localizationData[i].LanguageCode) {
          Object.assign(this.reqObj, { language: element.ModuleName })
        }
      });
      Object.assign(this.reqObj, { languageCode: this.localizationData[i].LanguageCode })
      // this.localizationData[i].Status = !this.localizationData[i].Status;
    } else {
      this.saveSingleLanguageData(this.localizationData[i], i)
      // this.localizationData[i].Status = !this.localizationData[i].Status;
    }
  }


  getLabelsToCompare(defaultLang, newLang, i) {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_form_validation",
        parameters: {
          FLAG: "GET_UNAPPROVED_DATA",
          "DEFAULTLANGCODE": defaultLang,
          "NEWLANGCODE": newLang,
          processid: this.userDetails.Processid,
          productid: this.data.productId
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      // this.loader = false;
      if (res.code == 200) {
        this.labeToCompare = false
        if (Object.keys(res.results).length > 0 && res.results.data.length > 0) {
          this.allLabels = res.results.data
          if(this.costToCompare == false && this.labeToCompare == false)this.countLabelCostToTranslate(i)
        }else this.countLabelCostToTranslate(i)
      }else this.countLabelCostToTranslate(i)
    },error => {
        this.loader = false;
        this.countLabelCostToTranslate(i)
      });
  }

  getCostingToCompare(i) {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_common_api_details",
        parameters: {
          FLAG: "GET_DEFAULT_API",
          productid: this.data.productId,
          processid: this.userDetails.Processid
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      // this.loader = false;
      if (res.code == 200) {
        this.costToCompare = false
        if (Object.keys(res.results).length > 0 && res.results.data.length > 0) {
          this.costing = res.results.data;
          // console.log("cost:",this.costing);
          if(this.costToCompare == false && this.labeToCompare == false)this.countLabelCostToTranslate(i)
        }else{
          this.loader = false;
          this.common.snackbar('Make Default Api First')
          this.localizationData[i].Status = false
        }
        // this.countLabelCostToTranslate(i)
      } else {
        this.loader = false
        this.common.snackbar('General Error')
        this.localizationData[i].Status = false
      }
      // else this.countLabelCostToTranslate(i)
    }, error => {
      this.loader = false;
      this.common.snackbar('General Error')
      // this.countLabelCostToTranslate(i)
      this.localizationData[i].Status = false
    });
  }

  countLabelCostToTranslate(i) {
    this.labelsToTranslate = []
    if (this.allLabels.length > 0 && this.costing.length > 0) {
      this.allLabels.forEach(element => {
        // if(element.TranslatedLabelName && !(element.TranslatedLabelName.trim().length === 0) && !this.labelsToTranslate.includes(element.TranslatedLabelName)){
        //   this.labelsToTranslate.push(element.TranslatedLabelName)
        // }
        // if(element.DefaultLabelName && !(element.DefaultLabelName.trim().length === 0) && !this.labelsToTranslate2.includes(element.DefaultLabelName)){
        //   this.labelsToTranslate2.push(element.DefaultLabelName)
        // }

        if ((!element.TranslatedLabelName || element.TranslatedLabelName.trim().length === 0) && !this.labelsToTranslate.includes(element.DefaultLabelName)) {
          this.labelsToTranslate.push(element.DefaultLabelName)
        }
      });

      if (this.labelsToTranslate.length > 0) {
        let charCount = 0;
        let charCountCopy = 0;
        let costForAll = 0
        this.labelsToTranslate.forEach(res => {
          charCount += res.length
        })
        charCountCopy = JSON.parse(JSON.stringify(charCount))
        let costingData = JSON.parse(this.costing[0].PricingDetails)
        costingData.forEach(element => {
          if (charCount > element.to) {
            let c = element.to - element.from;
            charCount = charCount - c;
            costForAll = costForAll + (c / 1000) * element.perThousandChar
          } else if (charCount < element.from) {
            let c = charCount;
            charCount = charCount - c;
            costForAll = costForAll + (c / 1000) * element.perThousandChar
          } else if (element.from <= charCount && charCount <= element.to) {
            let c = charCount;
            charCount = charCount - c;
            costForAll = costForAll + (c / 1000) * element.perThousandChar
          }
        });
        Object.assign(this.reqObj, { CharactersCount: charCountCopy })
        Object.assign(this.reqObj, { TotalAmount: Math.round(costForAll) })
        Object.assign(this.reqObj, { pricingDetails: this.costing[0].PricingDetails })
        Object.assign(this.reqObj, { ActivateType: 'API' })
        this.goForApproval(i)
        // let reqObj = {
        //   language : '',
        //   CharactersCount : '',
        //   TotalAmount : '',
        //   pricingDetails : ''
        // }
        // console.log("costForAll:",Math.round(costForAll));
        // console.log("joinedString:",charCount);
        // console.log("joinedString Copy:",charCountCopy);
        // console.log("this.labelsToTranslate2:",this.labelsToTranslate);
      }
    } else {
      this.localizationData[i].Status = this.localizationData[i].Status;
    }
  }

  goForApproval(i) {
    this.loader = false
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'pricingDetails',
        data: { ...this.reqObj }
      },
      width: "24vw",
      height: "40vh",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(status => {
      if (status == true) {
        this.approvalApi()
        this.localizationData[i].Status = false
      } else {
        this.localizationData[i].Status = false;
      }
    });
  }

  approvalApi() {
    this.loader = true
    // let a = 0
    // for(let item in this.reqObj){
    let obj = {
      data: {
        spname: "usp_unfyd_approvals",
        parameters: {
          FLAG: "INSERT",
          MODULENAME: 'Localization',
          CATEGORY: 'Language',
          LANGUAGE: this.reqObj['language'],
          LANGUAGECODE: this.reqObj['languageCode'],
          APPROVALSTATUS: 'Pending',
          ACTIVATETYPE: 'API',
          REQUESTEDBY: this.userDetails.Id,
          REQUESTEDNAME: this.userDetails.FirstName + ' ' + this.userDetails.LastName,
          CREATEDBY: this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
          productid: this.data.productId,
          processid: this.userDetails.Processid
        }
      }

    }
    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false
        // a++;
        // if(a == Object.keys(this.reqObj).length){
        if ((Object.keys(res.results.data[0])).includes('result')) {
          if (res.results.data[0].result.includes("success")) {
            this.common.snackbar('Sent for approval')
          }
        } else {
          this.loader = false
          this.common.snackbar('General Error')
        }
        // }
      } else {
        this.loader = false
        this.common.snackbar('General Error')
      }
    }, error => {
      this.loader = false
      this.common.snackbar('General Error')
    })

    // }
  }

  individualLanguageInfo(language, langCode) {
    this.common.hubControlEvent('AppSettings', 'click', '', '', '', 'individualLanguageInfo');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'individualLanguageInfo',
        productId: this.data.productId,
        productName: this.data.productName,
        language,
        langCode,
        defaultLanguageCode: this.defaultLanguage.defaultLanguageCode
      },
      width: "70%",
      maxHeight: "90vh"
    });
    dialogRef.afterClosed().subscribe((status) => {

    })
  }

  //  add more languages ends here

  // landing dialog of common api start from here
  getData() {
    this.loader = true;
    let requestObj = {
      data: {
        spname: "usp_unfyd_common_api_details",
        parameters: {
          flag: "GET",
          PROCESSID: this.userDetails.Processid,
          "PRODUCTID": this.data.productId
        }
      }
    }

    this.api.post('index', requestObj).subscribe((res: any) => {
      this.loader = false;
      if (res.code == 200) {
        // console.log(res);
        res.results.data.forEach(element => {
          for (let key in element) {
            if (key == 'TokenGeneration' || key == 'RequestParam' || key == 'PricingDetails' || key == 'Params' || key == 'Header' || key == 'Body' || key == 'Auth') {
              if (element[key]) element[key] = JSON.parse(element[key])
            }
          }
        });
        this.allData = res.results.data
        // console.log("additionapi:",this.allData)
        this.allData.forEach(element => {
          if (element.IsDefault)
            this.selectedServiceProvider = element.ServiceProvider
          this.selectedServiceProvider = 'Azure Translator Service'
        });
      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    }, error => {
      this.loader = false;
      this.common.snackbar("General Error");
    })
  }

  getlistdata(){
    this.loader = true;
    let requestObj = {
      data: {
        spname: "usp_unfyd_common_api_details",
        parameters: {
          flag: "GET_API_LIST",
          PROCESSID: this.userDetails.Processid,
          PRODUCTID: this.data.productId
        }
      }
    }

    this.api.post('index', requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.apilist = res.results.data;
        this.loader = false;
      }
    })
  }

  setDefault(val) {
    if (val.value != this.selectedServiceProvider) {
      this.selectedServiceProvider = val
    }
    this.loader = true;
    let requestObj = {
      data: {
        spname: "usp_unfyd_common_api_details",
        parameters: {
          flag: "SET_DEFAULT_API",
          SERVICEPROVIDER: this.selectedServiceProvider
        }
      }
    }

    this.api.post('index', requestObj).subscribe((res: any) => {
      // console.log("additionapi:",res)
      this.loader = false;
      if (res.code == 200) {
        // console.log(res);
        if ((Object.keys(res.results.data[0])).includes('result')) {
          if (res.results.data[0].result.includes("set to default")) {
            this.common.snackbar('Update Success');
            this.getData();
          }
        }
      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    }, error => {
      this.loader = false;
      this.common.snackbar("General Error");
    })
  }

  languagesCommonApi() {
    this.common.hubControlEvent('AppSettings', 'click', '', '', '', 'languagesAddMore');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'localizationCommonAPIForm',
        productId: this.data.productId,
        productName: this.data.productName
      },
      width: "70%",
      height: '90vh'
    });
    dialogRef.afterClosed().subscribe((status) => {
      if (status) this.getData()
    })
  }

  languagesCommonApiDelete(id) {
    this.confirmationToMakeDefault('ConfirmationToDelete')
    this.subscription.push(this.common.getIndividualUpload$.subscribe(res => {
      if (res.status) {
        this.deleteCommonApi(id)
      }
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }))
  }

  deleteCommonApi(id) {
    this.loader = true;
    let requestObj = {
      data: {
        spname: "usp_unfyd_common_api_details",
        parameters: {
          flag: "DELETE",
          id: id
        }
      }
    }

    this.api.post('index', requestObj).subscribe((res: any) => {
      this.loader = false;
      if (res.code == 200) {
        // console.log(res);

        if ((Object.keys(res.results.data[0])).includes('result')) {
          if (res.results.data[0].result.includes("success")) {
            this.common.snackbar('Delete Record');
            this.selectedServiceProviderInfo = ''
            this.getData()
          }
        } else {
          this.loader = false;
          this.common.snackbar('General Error')
        }
      } else {
        this.loader = false;
        this.common.snackbar('General Error')
      }
    }, error => {
      this.loader = false;
      this.common.snackbar('General Error')
    })
  }

  onServiceProviderTypeChange(selectedValue: any) {

    if (selectedValue !== 'others') {

      if (this.data.type == 'localizationCommonAPIForm') {
        this.data.id = selectedValue;
        if (this.data?.id) {
          this.externalAPIGet(this.data?.id)
        }
        }
    }else {
      this.data.id = null;
      this.form.controls.serviceProviderName.reset()
      this.postmanData = null
      this.p.clear()
      this.p.push(this.createPricing())


    }
  }

  getServiceProviderImage(serviceProvider: string): string {
    if (serviceProvider === 'Azure Translator Service') {
      return 'assets/images/Azure.png';
    } else if (serviceProvider === 'Google Translator Service') {
      return 'assets/images/Google.png';
    } else {
      return 'assets/images/defaultLocalization.png'; // Replace with a default image URL
    }
  }


  languagesCommonApiUpdate(id) {
    this.common.hubControlEvent('AppSettings', 'click', '', '', '', 'languagesAddMore');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'localizationCommonAPIForm',
        productId: this.data.productId,
        productName: this.data.productName,
        id: id
      },
      width: "70%",
      height: '90vh'
    });
    dialogRef.afterClosed().subscribe((status) => {
      if (status) this.getData()
    })
  }
  // landing dialog of common api ends from here

  // add exteranla api starts from here
  addItem(newItem: string) {
    this.dataFromPostman = newItem
    // console.log(newItem);
  }

  formCreation() {
    this.form = this.formBuilder.group({
      serviceProviderName: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
      serviceProviderType: ['', Validators.required],
      pricingDetails: this.formBuilder.array([this.createPricing()])
    },{validator:[checknull('serviceProviderName')]});
  }

  get p() { return this.form.get('pricingDetails') as FormArray; }

  addPricing() {
    this.p.push(this.createPricing())
  }

  createPricing() {
    let a = 1
    if (this.form && this.form.value && this.form?.value?.pricingDetails.length > 0) {
      a = this.form.value.pricingDetails[this.form.value.pricingDetails.length - 1].to + 1
    }
    return this.formBuilder.group({
      from: [a, Validators.required],
      to: ['', Validators.required],
      perThousandChar: ['', Validators.required],
      total: [0]
    });
  }

  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }
  resetLocalization(){
    this.form.reset();
    setTimeout(() => {
    var arrayControl = this.form.get('pricingDetails') as FormArray;
    let length = arrayControl.length - 1;
    for (let i = length; i > 0; i--) {
      this.deletePricing(i);
    }})
  }
  deletePricing(i) {
    this.p.removeAt(i);
  }

  submit() {
    this.loader = true;
    if (this.form.invalid) {
      this.loader = false;
      // this.common.snackbar("General Error");
      return;
    } else if (!this.dataFromPostman['customer_profile']['api'] ||
      this.dataFromPostman['customer_profile']['api'].trim() === 0 ||
      !this.dataFromPostman['customer_profile']['method'] ||
      this.dataFromPostman['customer_profile']['method'].trim() === 0) {
      this.common.snackbar("method and url required");
      this.loader = false
      return;
    } else {
      for (const key of this.form.value.pricingDetails) {
        this.form.markAllAsTouched()
        if(key.to <= key.from){
          this.loader = false;
          return;
        }
      }

    }

    this.loader = true;
    let requestObj
    if (this.data?.id) {
      requestObj = {
        data: {
          spname: "usp_unfyd_common_api_details",
          parameters: {
            flag: "UPDATE",
            // SERVICEPROVIDER:this.form.value.serviceProviderName,
            id: this.data.id,
            METHOD: this.dataFromPostman['customer_profile']['method'],
            REQUESTURL: this.dataFromPostman['customer_profile']['api'],
            HEADER: JSON.stringify(this.dataFromPostman['customer_profile']['header']),
            BODY: JSON.stringify(this.dataFromPostman['customer_profile']['body']),
            RESPONSEMAPPING: '',
            PRICINGDETAILS: JSON.stringify(this.form.value.pricingDetails),
            PARAMS: JSON.stringify(this.dataFromPostman['customer_profile']['params']),
            AUTH: JSON.stringify(this.dataFromPostman['customer_profile']['auth']),
            REQUESTPARAM: JSON.stringify(this.dataFromPostman),
            TOKENGENERATION: JSON.stringify(this.dataFromPostman['customer_profile']['token_generation']),
            MODIFIEDBY: this.userDetails.Id
          }
        }
      }
    } else {
      requestObj = {
        data: {
          spname: "usp_unfyd_common_api_details",
          parameters: {
            flag: "INSERT",
            SERVICEPROVIDER: this.form.value.serviceProviderName,
            METHOD: this.dataFromPostman['customer_profile']['method'],
            REQUESTURL: this.dataFromPostman['customer_profile']['api'],
            HEADER: JSON.stringify(this.dataFromPostman['customer_profile']['header']),
            BODY: JSON.stringify(this.dataFromPostman['customer_profile']['body']),
            RESPONSEMAPPING: '',
            PRICINGDETAILS: JSON.stringify(this.form.value.pricingDetails),
            PARAMS: JSON.stringify(this.dataFromPostman['customer_profile']['params']),
            AUTH: JSON.stringify(this.dataFromPostman['customer_profile']['auth']),
            // AUTH : this.dataFromPostman['customer_profile']['auth']['type'],
            REQUESTPARAM: JSON.stringify(this.dataFromPostman),
            TOKENGENERATION: JSON.stringify(this.dataFromPostman['customer_profile']['token_generation']),
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.data.productId,
            CREATEDBY: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            PRIVATEIP: '',
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    }
    // console.log("requestObj:",requestObj);

    this.api.post('index', requestObj).subscribe((res: any) => {
      // console.log("additionapi:",res)
      this.loader = false;
      if (res.code == 200) {
        if ((Object.keys(res.results.data[0])).includes('result')) {
          if (res.results.data[0].result.includes("update")) {
            this.common.snackbar('Update Success');
            this.dialogRef.close(true)
          } else if (res.results.data[0].result.includes("success")) {
            this.common.snackbar('Saved Success');
            this.dialogRef.close(true)
          } else if (res.results.data[0].result.includes("already exists")) {
            this.common.snackbar('Exists');
          }
        }
      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    }, error => {
      this.loader = false;
      this.common.snackbar("General Error");
    })

    // }

  }

  enterPricingTotal(i) {
    let a = 0
    // this.p.get('pricingDetails').patchValue(((this.form?.value?.pricingDetails[i]?.to - this.form?.value?.pricingDetails[i]?.from)/1000)*this.form?.value?.pricingDetails[i]?.perThousandChar);
    this.form.value.pricingDetails.forEach((element, index) => {
      this.p.at(index).get('total').patchValue(((element?.to - element?.from) / 1000) * element?.perThousandChar)
    });
    this.form.updateValueAndValidity()
    this.form.markAllAsTouched()
    // this.form.controls['pricingDetails'].controls[i]['total'].patchValue(((this.form?.value?.pricingDetails[i]?.to - this.form?.value?.pricingDetails[i]?.from)/1000)*this.form?.value?.pricingDetails[i]?.perThousandChar)

  }

  formChange1() {
    this.form.valueChanges.subscribe(res => {
      this.form.value.pricingDetails.forEach((element, index) => {
        this.p.at(index).get('total').patchValue(((element?.to - element?.from) / 1000) * element?.perThousandChar)
      });
    })
  }

  externalAPIGet(id) {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_common_api_details",
        parameters: {
          FLAG: "EDIT",
          id: id
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0 && res.results.data.length > 0) {
          this.externalAPIData = res.results.data[0]
          this.postmanData = JSON.parse(this.externalAPIData['RequestParam'])
          this.dataFromPostman = this.postmanData
          this.getlistdata();
          this.serviceProvider = res.results.data[0].Id
          this.form.controls.serviceProviderType.patchValue(res.results.data[0].Id)
          this.form.patchValue({ serviceProviderName: this.externalAPIData['ServiceProvider'] })
          let a = JSON.parse(this.externalAPIData['PricingDetails'])
          a.forEach((e, i) => {
            if (i != 0) this.addPricing()
            let items = this.form.get('pricingDetails') as FormArray;
            items.controls[i].patchValue(e);
          })
          // items.patchValue(a);

        }
      }
    });
  }
  // add exteranla api ends from here
  //  display labels from here
  getLabels1() {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_form_validation",
        parameters: {
          FLAG: "GET_LABEL_DATA",
          "DEFAULTLANGCODE": this.data.defaultLanguageCode,
          "NEWLANGCODE": this.data.langCode,
          processid: this.userDetails.Processid,
          productid: this.data.productId
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      var startTime = (new Date()).getTime(),
        endTime;
      this.loader = false;
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0 && res.results.data.length > 0) {
          res.results.data.forEach(element => {
            // let parentModules = Object.keys(this.ParentModule)
            if (this.ParentModule.hasOwnProperty(element.ParentModule)) {
              if (!this.ParentModule[element.ParentModule].includes(element.ModuleName)) this.ParentModule[element.ParentModule].push(element.ModuleName)
            } else {
              Object.assign(this.ParentModule, { [element.ParentModule]: [element.ModuleName] })
            }
            // this.defaultLabels.push(JSON.parse(element.DefaultJson))
          });
          // console.log(this.ParentModule);


          this.defaultLabels = res.results.data
          this.defaultLabels2 = JSON.parse(JSON.stringify(res.results.data))

          // res.results.data[1].forEach(element => {
          //   this.defaultLabels2.push(JSON.parse(element.DefaultJson))
          // });
          endTime = (new Date()).getTime();
          // alert('Took ' + (endTime - startTime) + 'ms');
          // console.log("defaultLabels:",this.defaultLabels);
          // console.log("defaultLabels2:",this.defaultLabels2);
        }
      }
    });
  }

  enableEditForLabel(index) {
    if (this.edit) {
      this.defaultLabels.forEach(element => {
        element.Edit = false
      });
      this.defaultLabels[index].Edit = true
    } else {
      this.common.snackbar('Click Edit To Change Label')
    }
  }

  cancel() {
    this.loader = true
    this.defaultLabels = JSON.parse(JSON.stringify(this.defaultLabels2))
    this.edit = false
    this.loader = false
  }

  isLabelChanged(): boolean {
    let a = [];
    a = this.defaultLabels.filter(element => element?.TranslatedLabelName != element?.TranslatedLabelCopy)
    if (a.length > 0) {
      this.labelsChanged = [...a]
    }

    return a.length == 0;
  }

  sendForApproval() {
    let a = []
    this.labelsChanged.forEach(res => {
      let b = { "Id": res.Id, "TranslatedLabel": res.TranslatedLabelName, "ApprovalStatus": "Pending" }
      a.push(b)
    })
    this.loader = true
    // let a = 0
    // for(let item in this.reqObj){
    let obj = {
      data: {
        spname: "usp_unfyd_approvals",
        parameters: {
          FLAG: "INSERT",
          MODULENAME: 'Localization',
          CATEGORY: 'Language',
          LANGUAGE: this.data['language'],
          LANGUAGECODE: this.data['langCode'],
          APPROVALSTATUS: 'Pending',
          ACTIVATETYPE: 'MANUAL',
          REQUESTEDBY: this.userDetails.Id,
          REQUESTEDNAME: this.userDetails.FirstName + ' ' + this.userDetails.LastName,
          CREATEDBY: this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
          productid: this.data.productId,
          processid: this.userDetails.Processid,
          // LABELID : a.length>0 ?  a.join() : ''
          TRANSLATEDLABELJSON: a.length > 0 ? JSON.stringify(a) : ''
        }
      }
    }

    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false
        // a++;
        // if(a == Object.keys(this.reqObj).length){
        if ((Object.keys(res.results.data[0])).includes('result')) {
          if (res.results.data[0].result.includes("success")) {
            this.common.snackbar('Sent for approval')
            this.getLabels1()
            this.edit = false;
          }
        } else {
          this.loader = false
          this.common.snackbar('General Error')
        }
        // }
      } else {
        this.loader = false
        this.common.snackbar('General Error')
      }
    }, error => {
      this.loader = false
      this.common.snackbar('General Error')
    })

    // }
  }

  sendDataToNotification(data) {
    this.dialogRef.close({ status: true, data: data });
  }

  addtabSelected(newItem: string) {
    this.data.tabSelected = newItem
  }
  addPathId(value: string) {
    // this.data.addId = value
    this.data.Id = value
  }


  count = true
  sortUsers(by: string, order: string): void {
    if (by == 'Actionable') return
    if (by == 'Sr No') return
    this.finalField.map(data => {
      if (data.value === by) {
        if (!data.order) {
          data.order = 'desc'
        } else {
          data.order = (data.order === 'desc') ? 'asc' : 'desc';
        }
      } else {
        data.order = null
      }
    })


    let x = this.tabValue.filter(n => n[by])
    let k = this.tabValue.filter(n => n[by] == null)
    let s = this.tabValue.filter(n => n[by] == '')
    let y = x.sort((a, b) => a[by].localeCompare(b[by]))
    this.tabValue = [...y, ...k, ...s]
    this.count = !this.count
    this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

  }

  sortUsers2(by: string, order: string): void {	
 	
    if(by == 'Actionable' || by == 'Action' || by == 'SrNo' || by == 'Sr No'  || by == 'Sr No.'){	
      return;	
    }	
    this.finalField.map(data => {	
        if (data.value === by) {	
          if (!data.order) {	
            data.order = 'desc';	
          } else {	
            data.order = (data.order === 'desc') ? 'asc' : 'desc';	
          }	
        } else {	
          data.order = null	
        }	
      })	
    if (by == 'Start Time' || by == 'Start Time' ||by == 'End Time' ||by == 'Route Time' ||by == 'Agent Route Time' 	
        ||by == 'Time' ||by == 'Login Time' || by == 'Status Time' ||by == 'Last Routed Time' || by == 'Created On' 	
        || by == 'Modified On' || by == 'Launch Date' || by == 'Expiry Date' || by == 'Start Date' || by == 'Renewal Date') {	
          let x = this.tabValue.filter(n => n[by])	
          let k = this.tabValue.filter(n => n[by] == null)	
          let s = this.tabValue.filter(n => n[by] == '')	
          let y = x.sort((a, b) => {	
            const dateA = moment(a[by], this.localizationformat);	
            const dateB = moment(b[by], this.localizationformat);	
            return dateA.valueOf() - dateB.valueOf();	
          });	
          this.tabValue = [...y, ...k, ...s]	
          this.count = !this.count	
          this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)	
        return	
    }

    let x = this.tabValue.filter(n => n[by])
    let k = this.tabValue.filter(n => n[by] == null)
    let s = this.tabValue.filter(n => n[by] == '')
    let y = x.sort((a, b) => a[by].localeCompare(b[by]))
    this.tabValue = [...y, ...k, ...s]
    this.count = !this.count
    this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

  }


  configManagerMatChip() {
    if (this.data.action == 'event') {
      this.saveAuditLog()
    } else {
      this.dialogRef.close(this.form.value.action)
    }
  }

  saveAuditLog() {
    let a = {
      EventName: this.form.value.action,
      EventDesc: this.form.value.description,
    }
    let obj = {
      "storedproc": "Events",
      "table": "",
      "type": "single",
      "query": {
        "EventID": "",
        "EventName": this.form.value.action,
        "EventDesc": this.form.value.description,
        "UserID": this.userDetails.Processid,
        "Flag": "Insert"
      },
      "processingType": "callSp"
    }

    this.api.postDataForLink('link', obj.storedproc, obj.query).subscribe((res: any) => {
      if (res.statusCode == 200) {
        if (res.data.length > 0) {
          if (res.data[0]?.msg.includes('exists')) {
            this.common.snackbar('Data Already Exist');
          } else if (res.data[0]?.msg.includes('updated')) {
            this.common.snackbar('Update Success');
            this.dialogRef.close(a)
          } else if (res.data[0]?.msg.includes('saved')) {
            this.common.snackbar('Record add');
            this.dialogRef.close(a)
          }
        }
      }
    }, error => {
      console.log(error);
      this.common.snackbar("General Error");
    });

  }

  isDisable(i){
    let a = false
    if(this.formFields[i].checkValidation)
    this.formFields[i].checkValidationFormControls.forEach(element => {
      if(this.form.get(element)?.hasError('required')){
        a = true
      }
    });
    return a
  }


  resetConfigureApi(){
    this.form.reset()
    setTimeout(() => {
      this.form.controls['syncDuration'].patchValue({hour:0,minute:0,second:0})
    this.form.controls['configuration'].patchValue({
      Id: null,
      label: null,
      dateFormat: null,
      formControlName: null,
      formCategory: 'wrap-up',
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
      hide:false
    })
    this.form.controls['apiConfig'].patchValue('')
    this.form.controls['fieldMapping'].patchValue([this.fieldMapping()])
    this.form.updateValueAndValidity()
    });
  }

  fieldMapping(): FormGroup {
    return this.formBuilder.group({
      taskField: ['', Validators.required],
      responseParameter: ['', Validators.required]
    },{validator : [checknull1('responseParameter')]});
  }

  addRechurnActionRule(){
    return this.formBuilder.group({
      taskfield : ['',[Validators.required]],
      value : ['',[Validators.pattern(regex.alphanumeric)]],
      status : false
    },{ validator: [emptySpace('value')]})
  }

  submitRechurnAction(){
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }

    this.closeDialog(this.form.value.action)
  }

  returnAPIConfigTaskGroup(val){
    console.log("val:",val);
    this.form.controls['apiConfig'].patchValue(val)
  }

  addMore(){
    var fieldMapping = this.form.get("fieldMapping") as FormArray;
    fieldMapping.push(this.fieldMapping())
  }

  deleteFieldMapping(i){
    var fieldMapping = this.form.get("fieldMapping") as FormArray;
    fieldMapping.removeAt(i)
  }

  submitConfigurationAPI(){
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          if(key != 'apiConfig' && key != 'fieldMapping'){
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
          }
        }
      }
      return;
    }

    let startTime = JSON.parse(JSON.stringify(this.form.value.syncDuration))
    let hour = startTime.hour.toString()
    let minute = startTime.minute.toString()
    let second = startTime.second.toString()
    startTime = hour.padStart(2,"0") + ":" + (minute).padStart(2,"0") + ":" + (second).padStart(2,"0")

    let obj = {
      data: {
        spname: "usp_unfyd_task_group",
        parameters: {
          FLAG :'UPDATE',
          NAME: this.data.taskGroupInfo.Name,
          DESCRIPTION: this.data.taskGroupInfo.Description,
          STARTDATE: this.data.taskGroupInfo.StartDate,
          STARTTIME: this.data.taskGroupInfo.StartTime,
          EXPIRYTIME: this.data.taskGroupInfo.ExpiryTime,
          EXPIRYDATE: this.data.taskGroupInfo.ExpiryDate,
          USERGROUP: this.data.taskGroupInfo.UserGroup.length > 0 ? this.data.taskGroupInfo.UserGroup.join(',') : '',
          BusinessHrs: this.data.taskGroupInfo.BusinessHrs,
          APPLYFILTER: this.data.taskGroupInfo.ApplyFilter ? JSON.stringify(this.data.taskGroupInfo.ApplyFilter) : '',
          PREVIEWDURATION: this.data.taskGroupInfo.PreviewDuration,
          ROUTETYPE: this.data.taskGroupInfo.RouteType,
          TASKGROUPFIELDS: this.data.taskGroupInfo.TaskGroupFields.length > 0 ? JSON.stringify(this.data.taskGroupInfo.TaskGroupFields) : '',
          RECHURNRULE: this.data.taskGroupInfo.RechurnRule ? JSON.stringify(this.data.taskGroupInfo.RechurnRule) : '',
          SORTCONDITION:this.data.taskGroupInfo.SortCondition.length > 0 ? this.data.taskGroupInfo.SortCondition.join(',') : '',
          SORTCONDITIONORDER: this.data.taskGroupInfo.SortConditionOrder,
          MODIFIEDBY: this.userDetails.Id,
          apiConfig : this.form.value.apiConfig ? JSON.stringify(this.form.value.apiConfig) : '',
          fieldMapping : this.form.value.fieldMapping ? JSON.stringify(this.form.value.fieldMapping) : '',
          syncDuration : startTime,
          ID : this.data.taskGroupInfo.Id
        }
      }
    }

    this.api.post('index',obj).subscribe((res: any) => {
      this.loader = false;
        if (res.code == 200) {
          if(res.results.data.length > 0){
            this.closeDialog(true)
          }
        }
    })
  }

  returnTaskFields(val){
    let a = []
    let formControlName = this.form.value.fieldMapping.map(res => {if(res.taskField) return res.taskField})
    this.data.taskGroupInfo.TaskGroupFields.forEach(element => {
      if(!formControlName.includes(element.formControlName) ){
        a.push(element)
      } else if(element.formControlName == val){
        a.push(element)
      }
    });
    return a
  }

  getDataTaskGroup(){
    this.loader = true
    let obj = {
      data: {
        spname: "usp_unfyd_task_group",
        parameters: {
          FLAG :'EDIT',
          ID : this.taskGroupInfo.Id
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
            this.taskGroupInfo = res.results.data[0]
            console.log(this.taskGroupInfo);
            this.queryBuilderOpened()
            // console.log("abcdefg:",this.createLogicalQuery(this.taskGroupInfo?.ApplyFilter))
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
    if(!this.taskGroupInfo.hasOwnProperty('Id')){
      Object.assign(this.taskGroupInfo,{Id : this.taskGroupInfo.Actionable})
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'taskGroupMaster',
        data: this.taskGroupInfo,
        parameter : val
      },
      width: "100%",
      maxHeight : '85vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => { 
    try{	
      this.setLabelByLanguage(localStorage.getItem("lang"))	
    } catch(error){	
      console.log(error);	
    }	
    console.log(this.userDetails);	
    try {	
      this.common.setUserConfig(this.userDetails.ProfileType, 'TaskGroup');	
    } catch(error){	
      console.log(error);	
    }
      if(status){
        this.getDataTaskGroup()

      }
    })
  }

  addTask(){
    this.loader = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl?.focus();
          break;
        }
      }
      return;
    }
    console.log(this.form.value);
    let a = {}
    Object.keys(this.form.value).forEach(res123 => {
      if(res123 != 'selectCampaign' && res123 != 'taskID'){
        Object.assign(a,{[res123] : this.form.value[res123]})
      }
      })

    let obj

    if(this.data.purpose == 'edit'){
      obj= {
        data:{
          spname: "usp_unfyd_tasks",
          parameters: {
            flag: "UPDATE",
            CAMPAIGNID: this.form.value.selectCampaign,
            TASKGROUPID: this.data.taskGroupId,
            VALUE: Object.keys(a).length > 0 ? JSON.stringify(a) : '',
            // VALUE: a,
            STATUS:'Pending',
            PRODUCTID: this.userDetails.ProductId,
            PROCESSID: this.userDetails.Processid,
            MODIFIEDBY: this.userDetails.Id,
            PRIVATEIP:"",
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version,
            ID : this.data.value.Actionable
          }
        }
      }
    }else{
      obj= {
        data:{
          spname: "usp_unfyd_tasks",
          parameters: {
            flag: "insert",
            CAMPAIGNID: this.form.value.selectCampaign,
            TASKGROUPID: this.data.taskGroupId,
            VALUE: Object.keys(a).length > 0 ? JSON.stringify(a) : '',
            // VALUE: a,
            STATUS:'Pending',
            PRODUCTID: this.userDetails.ProductId,
            PROCESSID: this.userDetails.Processid,
            CREATEDBY: this.userDetails.Id,
            PRIVATEIP:"",
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        if(res.results.data.length > 0 && res.results.data[0].result !== "Data already exists"){
          this.loader = false;
          console.log(res);
          this.dialogRef.close(true);
          // this.gettaskData()
          //window.location.reload()
          this.common.snackbar("Saved Success");

        }
        if (res.results.data[0].result == "Data already exists"  && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
          this.loader = false;

        }
        if (res.results.data[0].result == "Data already exists" && (res.results.data[0].Status == true)) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
        this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
          if(status.status){
            // this.loader = true;
            let obj1
            obj1 = {
              data: {
                spname: "usp_unfyd_tasks",
                parameters: {
                  flag: 'ACTIVATE',
                  TASKGROUPID: this.data.taskGroupId,
                  ID : res.results.data[0].ID,
                  PROCESSID: this.userDetails.Processid,
                  MODIFIEDBY: this.userDetails.Id
                }
              }
            };
            this.api.post('index', obj1).subscribe((res: any) => {
              if (res.code == 200) {
                this.loader = false;
                  console.log(res);
                  this.dialogRef.close(true)
                  window.location.reload()
                  this.common.snackbar("Saved Success");

                }
            });


            }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
              }))



        }


        this.loader = false


      }else {
        this.loader = false;
      }
    },
    (error) => {
      this.loader = false;

    });
  }

  editCreateTaskManually(){
    this.data.purpose = 'edit'
    this.data.taskGroupInfo.TaskGroupFields = JSON.parse(JSON.stringify(this.dummyTaskGroupFields))
    this.data.taskGroupInfo.TaskGroupFields.forEach(element => {
      element.LockControl = false
    });
  }

  copyData(){
    this.clipboard.copy(JSON.stringify(this.apiData))
  }

  isVisible(nestedToControl,nestedToValue){
    let a = false
    if(nestedToControl && Array.isArray(nestedToControl)){
      if(nestedToControl.length == 0){
        a = true
      } else{
        // let b = false
        for (const iterator in nestedToControl) {
          if(this.form.get(nestedToControl[iterator]).value == nestedToValue[iterator]){
            a = true
          }
        }
      }
    } else{
      a = true
    }
    return a
  }
  
  checkFileType(arrayData,Val){	
    let a = []	
    if(arrayData && Array.isArray(arrayData)) a = arrayData.filter(rrr => rrr.toLowerCase() == Val.toLowerCase())	
    return a.length > 0 ? true : false	
  }	
  import(event,formControlName){	
    console.log("event:",event.target.files.length);	
    for (const element of event.target.files) {	
      const formData = new FormData();	
      var filename = this.datepipe.transform(new Date(), 'ddMMyyhhmmssSSS');	
      formData.append(filename, element);	
      console.log("there", element.type);	
      if (Math.round(element.size / 1024) > 5000) {	
        this.common.snackbar("File Size");	
      } else if(this.checkFileType(formControlName.uploadFormFileFormat,element.type)){	
        const reader = new FileReader();	
        reader.onload = () => {	
          this.api.post('upload', formData).subscribe(res => {	
            if (res.code == 200) {	
              if(res.results.URL){	
                let value = this.form.value[formControlName.formControlName]	
                if(!Array.isArray(this.form.value[formControlName.formControlName])){	
                  value = []	
                }	
                value.push(res.results.URL)	
                this.form.controls[formControlName.formControlName].patchValue(value)	
                this.form.updateValueAndValidity()	
                this.common.snackbar('Image Upload Success')	
              }	
            }	
          }, error => {	
            console.log(error);	
          })	
        };	
        reader.readAsDataURL(element);	
      }	
        else {	
          this.common.snackbar("File Type");	
      }	
    }	
  }	
  returnImages(formControlName){	
    let a = []	
    if(Array.isArray(this.form.value[formControlName])){	
      this.form.value[formControlName].forEach(element => {	
        let x = false	
        if(element.slice(element.lastIndexOf('.') + 1,element.length).toLowerCase().includes('png') ||	
        element.slice(element.lastIndexOf('.') + 1,element.length).toLowerCase().includes('jpeg') ||	
        element.slice(element.lastIndexOf('.') + 1,element.length).toLowerCase().includes('jpg') ||	
        element.slice(element.lastIndexOf('.') + 1,element.length).toLowerCase().includes('gif')){	
          x = true	
        }	
        a.push({link : element, isImage : x})	
      });	
    }	
    return a	
  }	
  deleteUploadedFile(formControlName,index){	
    let a = this.form.value[formControlName]	
    a.splice(index,1)	
    this.form.controls[formControlName].patchValue(a)	
    this.form.updateValueAndValidity()	
  }


  taskGroupRechurnActionSetValidation(i){
    if(this.form.value.action[i].status){
      setTimeout(() => {
        this.form.controls['action']['controls'][i]['controls']['value'].clearValidators()
        this.form.controls['action']['controls'][i]['controls']['value'].updateValueAndValidity()
        this.form.updateValueAndValidity()
        setTimeout(() => {
          this.form.controls['action']['controls'][i]['controls']['value'].setValidators([Validators.pattern(regex.alphanumeric),Validators.required]);
          this.form.controls['action']['controls'][i]['controls']['value'].updateValueAndValidity()
          this.form.updateValueAndValidity()
        });
      });
    }else{
      setTimeout(() => {
        this.form.controls['action']['controls'][i]['controls']['value'].clearValidators()
        this.form.controls['action']['controls'][i]['controls']['value'].updateValueAndValidity()
        this.form.updateValueAndValidity()
        setTimeout(() => {
          this.form.controls['action']['controls'][i]['controls']['value'].setValidators([Validators.pattern(regex.alphanumeric)]);
          this.form.controls['action']['controls'][i]['controls']['value'].updateValueAndValidity()
          this.form.updateValueAndValidity()
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}


