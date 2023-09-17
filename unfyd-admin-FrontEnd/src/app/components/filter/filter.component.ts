import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { AuthService } from "src/app/global/auth.service";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { ExcelService } from "src/app/global/excel.service";
import { CommonService } from "src/app/global/common.service";
import { hawkerStatusSteps, productgrouptable, flagAndSPName, notificationsStep, eventStep } from "src/app/global/json-data";
import { ApiService } from "src/app/global/api.service";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";
import { Subscription } from "rxjs";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { PitchDialogComponent } from "src/app/pages/pitch/pitch-dialog/pitch-dialog.component";
import { PitchCommonService } from "src/app/global/pitch-common.service";

@Component({
  selector: "app-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
})
export class FilterComponent implements OnInit, OnChanges {

  @ViewChild("exelUpload") myInputVariable: ElementRef;
  @Input() pitchTable
  @Input() taskGroupInfo
  @Input() taskGroupId
  @Input() isFilterOnCreate: boolean = false;
  @Input() role: any;
  @Input() type: any;
  @Input() isDialog: boolean = false;
  @Input() tabChange: any;
  @Input() resetBtnValue: any;
  @Input() eventcatValue: any;
  @Input() selectedlanguage: any
  @Input() tabValue: any;
  @Input() addBtn: boolean;
  @Input() AlertMsgData: boolean = true;
  @Input() totalCount: number;
  @Input() bulkId: any;
  @Input() component: any;
  @Input() data: any;
  @Input() paginationArray: any;
  @Input() hasChecked: any;
  @Input() productID: any;
  @Input() slaproductID: any;
  @Input() schedulerproductID: any;
  @Input() BOProductID: any;ng
  @Input() AlertLanguage: any;
  @Input() tab: any;
  @Input() tabs: any;
  @Input() tabn: any;
  @Input() tabe: any;
  @Input() ChannelIdInput: any;
  @Input() productName: any;
  @Input() ChannelUniqueCodeInput: any;
  @Input() tabSelected: any;
  @Input() totalItems: any;
  @Input() drilldownURL: any;
  @Input() drilldownRequest: any;
  @Input() name: any;
  @Input() pgValMaster: any;
  @Input() ProductGroupValMaster: any;
  @Input() CategoryValMaster: any;
  @Input() approvalModules: any;
  @Input() selectedApprovalModules: string = ''
  @Input() ProductGroupTab: any;
  @Input() CategoryValue: any;
  @Input() eventCategory: any = [];
  @Input() filter: any;
  @Input() moduleName: any;
  @Input() ruleType: any;
  notificationsStep: any
  flagAndSPName: any
  requestObj: any;
  userDetails: any;
  tabKey: any = [];
  search: any;
  value = '';
  hawkerStatusSteps: any;
  userConfig: any;
  form!: FormGroup;
  obj: any;
  ProductGroup: any;

  reportExcel: boolean = false;
  dynamicinputFields: any = [];
  submittedForm: boolean = false;
  minDate = new Date();
  maxDate = new Date();
  DateForm: FormGroup;
  CategoryForm: FormGroup;
  page: number = 1;
  formName: any;
  product: any = [];
  itemsPerPage: number = 10;
  actionDropdownVal: any;
  actionname: any = 'noval';
  tabValueCopy: any = []
  displayNameStore: any;
  newLabelName: string;
  @Input() masterName: any;
  @Input() selectedTab = 'Online Hours';
  productgrpid: any;
  noData: boolean = false;
  searchPanel: boolean = false;
  crossIcon: boolean = false;
  storeURL = {
    'user-group': "masters/user-group",
    'usergroup': "masters/user-group",
    'broadcast': "masters/broadcast",
    'skills': "masters/skills",
    'customerproduct': "masters/customerproduct",
    'users': "masters/users",
    'product-group': "masters/product-group",
    'hierarchy': "masters/hierarchy",
    'contact-center-location': "masters/contact-center-location ",
    'privilege': "masters/Privilege",
    'notification': "masters/notifications",
    'event': "masters/event/view"
  }


  teamsData = [
    {
      TeamID: 238,
      TeamName: "GEN",
    },
    {
      TeamID: 249,
      TeamName: "Critical Team",
    },
    {
      TeamID: 250,
      TeamName: "High Team",
    },
    {
      TeamID: 251,
      TeamName: "Medium Team",
    },
    {
      TeamID: 252,
      TeamName: "Low Team",
    },
    {
      TeamID: 253,
      TeamName: "Jio Meet",
    },
    {
      TeamID: 267,
      TeamName: "Testing",
    },
    {
      TeamID: 268,
      TeamName: "abcxxxx",
    },
    {
      TeamID: 269,
      TeamName: "sample 2",
    },
    {
      TeamID: 277,
      TeamName: "Smartteam",
    },
    {
      TeamID: 286,
      TeamName: "technical",
    },
    {
      TeamID: 287,
      TeamName: "smart ",
    },
  ];
  category: any;
  productgrouptable: any;
  userStatusSteps: any;
  userData: any;
  passwordPolicyapi: any = [];
  isResetEnabled: any;
  addbuttontenant: boolean = false;
  pgval: boolean;
  eventForm: FormGroup;
  eventStep: any;

  categoryevent: any = [];
  public filteredList1 = this.categoryevent.slice();
  changeModuleDisplayName: string;
  loader: boolean;
  changeExcelfileName: string;
  agents: any;
  securityproduct: any;
  ChannelSource: any = [];
  skillType: any = [];
  userName: any = [];
  ProductName: any = [];
  TemplateData: any = [];
  Disposition: any = [];
  SubDisposition: any = [];
  SubSubDisposition: any = [];
  configdata = { hour: 0, minute: 0, second: 0 };
  userId: any = [];
  logInID: any = [];
  searchClose: boolean = false;
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  keepOrder = (a) => {
    return a;
  };

  dateChanged(formVal: any) {
    var date = new Date();
    if (this.dateRadioButton != "select") {
      this.form
        .get(formVal)
        .get("startDate")
        .setValue(
          new Date(date.getTime() - this.dateRadioButton * 24 * 60 * 60 * 1000)
        );
      this.form.get(formVal).get("endDate").setValue(new Date(date.getTime()));
    } else {
      this.form.get(formVal).get("endDate").setValue(null);
      this.form.get(formVal).get("startDate").setValue(null);
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  checkboxData = [
    {
      moduleName: "Account",
      columnType: "IsActive",
      controlType: "checkbox",
      key: "IsActive",
      label: "Status",
      defaultSelectDropDown: null,
      options: null,
      type: null,
      checkboxStatus: true,
      dropdownKey: null,
      dropdownValue: null,
    },
    {
      moduleName: "Account",
      columnType: "IsActive",
      controlType: "checkbox",
      key: "IsActive",
      label: "Status",
      defaultSelectDropDown: null,
      options: null,
      type: null,
      checkboxStatus: true,
      dropdownKey: null,
      dropdownValue: null,
    },

  ];
  toggleStatus: boolean = false;
  selected = 50;
  dateRadioButton: any;
  serviceData = [
    {
      SNO: "1",
      ServiceContractID: 51,
      ServiceContractName: "few",
      IsActive: "InActive",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-05-25T11:26:51.730Z",
    },
    {
      SNO: "2",
      ServiceContractID: 50,
      ServiceContractName: "sdf",
      IsActive: "InActive",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-05-25T11:25:42.550Z",
    },
    {
      SNO: "3",
      ServiceContractID: 49,
      ServiceContractName: "sane",
      IsActive: "InActive",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-05-25T11:24:30.323Z",
    },
    {
      SNO: "4",
      ServiceContractID: 48,
      ServiceContractName: "sneha",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-05-25T11:12:41.590Z",
    },
    {
      SNO: "5",
      ServiceContractID: 47,
      ServiceContractName: "zcdasd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-12T14:34:31.937Z",
    },
    {
      SNO: "6",
      ServiceContractID: 46,
      ServiceContractName: "null",
      IsActive: "InActive",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T19:38:50.783Z",
    },
    {
      SNO: "7",
      ServiceContractID: 45,
      ServiceContractName: "as",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T19:09:51.153Z",
    },
    {
      SNO: "8",
      ServiceContractID: 44,
      ServiceContractName: "sa",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T19:06:35.677Z",
    },
    {
      SNO: "9",
      ServiceContractID: 43,
      ServiceContractName: "test",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T18:25:40.773Z",
    },
    {
      SNO: "10",
      ServiceContractID: 42,
      ServiceContractName: "Gunjan",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T18:22:03.893Z",
    },
    {
      SNO: "11",
      ServiceContractID: 41,
      ServiceContractName: "abhi",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T18:17:27.877Z",
    },
    {
      SNO: "12",
      ServiceContractID: 40,
      ServiceContractName: "kumar sir 2",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T18:14:40.273Z",
    },
    {
      SNO: "13",
      ServiceContractID: 39,
      ServiceContractName: "kumar sir",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T17:52:46.383Z",
    },
    {
      SNO: "14",
      ServiceContractID: 34,
      ServiceContractName: "SCT 2",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T17:36:37.270Z",
    },
    {
      SNO: "15",
      ServiceContractID: 33,
      ServiceContractName: "SCT",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T17:31:37.620Z",
    },
    {
      SNO: "16",
      ServiceContractID: 32,
      ServiceContractName: "rama",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T17:25:49.567Z",
    },
    {
      SNO: "17",
      ServiceContractID: 31,
      ServiceContractName: "abji",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-09T17:21:40.540Z",
    },
    {
      SNO: "18",
      ServiceContractID: 30,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:56:19.533Z",
    },
    {
      SNO: "19",
      ServiceContractID: 29,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:55:42.127Z",
    },
    {
      SNO: "20",
      ServiceContractID: 28,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:50:01.550Z",
    },
    {
      SNO: "21",
      ServiceContractID: 27,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:45:19.033Z",
    },
    {
      SNO: "22",
      ServiceContractID: 26,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:38:17.733Z",
    },
    {
      SNO: "23",
      ServiceContractID: 25,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:37:20.333Z",
    },
    {
      SNO: "24",
      ServiceContractID: 24,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:36:24.347Z",
    },
    {
      SNO: "25",
      ServiceContractID: 22,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:35:39.037Z",
    },
    {
      SNO: "26",
      ServiceContractID: 23,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:35:39.037Z",
    },
    {
      SNO: "27",
      ServiceContractID: 20,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:35:38.800Z",
    },
    {
      SNO: "28",
      ServiceContractID: 21,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:35:38.800Z",
    },
    {
      SNO: "29",
      ServiceContractID: 19,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:35:30.597Z",
    },
    {
      SNO: "30",
      ServiceContractID: 18,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:34:33.010Z",
    },
    {
      SNO: "31",
      ServiceContractID: 17,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:34:21.910Z",
    },
    {
      SNO: "32",
      ServiceContractID: 16,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:33:53.627Z",
    },
    {
      SNO: "33",
      ServiceContractID: 15,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:33:12.090Z",
    },
    {
      SNO: "34",
      ServiceContractID: 14,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:32:52.810Z",
    },
    {
      SNO: "35",
      ServiceContractID: 13,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:32:24.530Z",
    },
    {
      SNO: "36",
      ServiceContractID: 12,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:32:17.343Z",
    },
    {
      SNO: "37",
      ServiceContractID: 11,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:28:20.897Z",
    },
    {
      SNO: "38",
      ServiceContractID: 10,
      ServiceContractName: "asd",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-08T19:26:02.603Z",
    },
    {
      SNO: "39",
      ServiceContractID: 9,
      ServiceContractName: "Kiran",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-07T18:59:52.893Z",
    },
    {
      SNO: "40",
      ServiceContractID: 8,
      ServiceContractName: "ji",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2022-03-07T18:57:40.200Z",
    },
    {
      SNO: "41",
      ServiceContractID: 7,
      ServiceContractName: "3i SLA 2",
      IsActive: "Active",
      CreatedBy: "APRD1M",
      CreatedDate: "2021-07-14T22:01:06.000Z",
    },
    {
      SNO: "42",
      ServiceContractID: 6,
      ServiceContractName: "3i SLA",
      IsActive: "Active",
      CreatedBy: "ZQPD9N",
      CreatedDate: "2021-07-14T20:57:20.000Z",
    },
    {
      SNO: "43",
      ServiceContractID: 5,
      ServiceContractName: "SLA",
      IsActive: "Active",
      CreatedBy: "GWP6C5",
      CreatedDate: "2021-07-13T21:29:04.000Z",
    },
    {
      SNO: "44",
      ServiceContractID: 4,
      ServiceContractName: "CONTRACT ",
      IsActive: "Active",
      CreatedBy: "GWP6C5",
      CreatedDate: "2021-05-07T20:00:59.000Z",
    },
    {
      SNO: "45",
      ServiceContractID: 1,
      ServiceContractName: "Default",
      IsActive: "Active",
      CreatedBy: "ADMIN",
      CreatedDate: "2017-01-01T00:00:00.000Z",
    },
  ];
  radioOptions = [
    {
      moduleName: "Agent",
      columnType: "FullName",
      controlType: "textbox",
      key: "day",
      value: "day",
      label: "Name",
      defaultSelectDropDown: null,
      options: null,
      checked: false,
      type: "text",
      dropdownKey: null,
      dropdownValue: null,
    },
    {
      moduleName: "Agent",
      columnType: "FullName",
      controlType: "textbox",
      key: "night",
      value: "night",
      label: "Name",
      checked: true,
      defaultSelectDropDown: null,
      options: null,
      type: "text",
      dropdownKey: null,
      dropdownValue: null,
    },
  ];


  url: any;
  language: any;
  dateFormat: any;
  dynamicActiveNumber: any;
  channel: any = [];
  ChannelList: any = [];
  subscriptionPopupModal: Subscription | undefined;
  exportReportTabValue: Subscription | undefined;
  tabValueData: Subscription | undefined;
  tabValueLength: any = 0;
  copyWith: any = [];
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  subscriptionEvent: Subscription[] = [];
  start: any;
  end: any;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private excelService: ExcelService,
    public common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute,
    private pitchCommon:PitchCommonService,
  ) {
    Object.assign(this, { hawkerStatusSteps, productgrouptable, flagAndSPName, notificationsStep, eventStep });
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(url => {	
      this.ngOnDestroy()	
    })
    this.common.hubControlEvent('Filter', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.subscription.push(this.common.getReportChange$.subscribe((res => {
      if (res.status == true) {
        this.filterShow = this.filterShow == true ? !this.filterShow : false;
        this.ngOnDestroy();
        this.DateForm.get('Date').setValue(moment());
        this.tabValueLength = 0;
        this.tabValue = [];
        this.paginationArray = [];
        this.tabKey = [];
        this.form = undefined;
        this.type = res.type;
        this.getDynamicFilter();
        this.loadTabKey();
      }
    })));

    this.subscription.push(this.common.resetSearch$.subscribe(res => {	
      if (res != false) {	
        this.value = ''	
       this.common.setSearch('')	
      }	
    }))

    this.userDetails = this.auth.getUser();
    this.form = this.common.toFormGroup(this.dynamicinputFields);
    this.resetBtnValue = "activeusers";
    if (this.type == 'tenant') {
      if (this.userDetails.AllowLOB == true) {
        this.addbuttontenant = true;
      } else {
        this.addbuttontenant = false;
      }

      if (this.userDetails.UserName == 'unfyd-admin') {
        this.addbuttontenant = true;
      }
    }
    if (this.type == 'label') {
      this.subscription.push(this.common.labelView$.subscribe(res => {
        if (res != false) {
          this.product = res.product

        }
      }))
    }
    if (this.type == 'hub-admin-access-controller') {
      var requestObj = {
        data: {
          spname: 'usp_unfyd_access_controls',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,

          }
        }
      }
      this.api.post('index', requestObj).subscribe(res => {
        if (res.code == 200) {
          this.copyWith = res.results.data;
        }
      })

    }

    this.addBtn = this.addBtn == undefined ? false : !this.addBtn ? false : true;
    if(this.tabValue){	
      for (var key in this.tabValue[0]) {	
        if (this.tabValue[0].hasOwnProperty(key)) {	
          this.tabKey.push(key);	
        }	
      }	
    }

    this.subscription.push(this.common.sendTabValueToFilter$.subscribe((res) => {
      this.tabValue = []
      this.tabKey = []
      this.tabValue = res
      for (var key in this.tabValue[0]) {
        if (this.tabValue[0].hasOwnProperty(key)) {
          this.tabKey.push(key);
        }
      }
      this.feildChooser()
    }))
    this.subscription.push(this.common.securityView$.subscribe(res => {
      if (res != false) {
        this.securityproduct = res.securityproduct
      }
    }))
    this.subscription.push(this.common.userMasterData$.subscribe((res => {
      if(res) this.feildChooser()
    })))
    this.subscription.push(this.common.refreshTaskTable$.subscribe((res => {
      if(res) this.feildChooser()
    })))
    this.subscription.push(this.common.configView$.subscribe(res => {
      if (res != false) {
        this.channel = res.channel
        this.language = res.language
      }
    }))

    this.common.setMasterConfig();
    this.subscription.push(this.common.getMasterConfig$.subscribe((data) => {	
      this.dateFormat = data.DatePickerFormat;	
    }));	
    this.subscription.push(this.common.TaskField$.subscribe((data) => {	
      if(typeof data != 'object') this.feildChooser();	
    }));
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.CategoryForm = this.formBuilder.group({
      ProductGroup: ['', Validators.nullValidator],
      categ: ['', Validators.nullValidator],
    });

    if (this.ProductGroupValMaster !== undefined) {
      this.CategoryForm.controls['ProductGroup'].setValue(this.ProductGroupValMaster);
      this.form.updateValueAndValidity();
    }

    if (this.CategoryValMaster !== undefined) {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            flag: 'GET_CATEGORY',
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
            PRODUCTGRPID: this.ProductGroupValMaster,
          }
        }
      }
      this.api.post('index', this.requestObj).subscribe((res: any) => {
        this.category = res.results.data;
        this.CategoryForm.controls['categ'].setValue(this.CategoryValMaster,);
        this.form.updateValueAndValidity();
      })

    }

    this.DateForm = this.formBuilder.group({
      Date: [moment(), Validators.required],
    });

    if (this.type == 'BusinessHours') {
      this.common.setUserConfig(this.userDetails.ProfileType, 'BusinessHours');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data
      }))
    } if (this.type == 'security-modules') {
      this.common.setUserConfig(this.userDetails.ProfileType, 'SecurityAndCompliance');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data
      }))
    } else
      this.common.setUserConfig(this.userDetails.ProfileType, this.type == 'label' ? 'localization' : this.type);
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {

      if (this.type == "report") {
        this.userConfig = {
          View: true,
          Add: false,
          Edit: false,
          Update: true,
          Delete: true,
          Import: false,
          Export: true,
          Report: true,
        };
      } else if (
        this.type == "PCCReport" ||
        this.type == "VendorRegistrationReport" ||
        this.type == "MedicalClearanceReport" ||
        this.type == "OutstandingPaymentReport" ||
        this.type == "GrievanceStatusReport" ||
        this.type == "TrainingReport" ||
        this.type == "PaymentCollectionReport" ||
        this.type == "FunnelApplicationReport" ||
        this.type == "SummaryReport" ||
        this.type == "BatchWiseStatusReport" ||
        this.type == "ChannelwisePerformanceReport"
      ) {
        this.userConfig = {
          reportExcel: true,
        };
      } else if (
        this.type == "AbandonedReport" ||
        this.type == "AgentPerformanceReport" ||
        this.type == "AgentStatusReport" ||
        this.type == "AgentUtilizationReport" ||
        this.type == "BotReport" ||
        this.type == "TranscriptsReport" ||
        this.type == "HourlyWiseInteractionReport" ||
        this.type == "InteractionDetailsReport" ||
        this.type == "LoginLogoutReport" ||
        this.type == "NotReadyReport" ||
        this.type == "OfflineMessageReport" ||
        this.type == "HSMSummaryReport" ||
        this.type == "HSMReport" ||
        this.type == "InteractionDashboardReport" ||
        this.type == "InteractionType" ||
        this.type == "RepeatCustomers" ||
        this.type == "InteractionFeedbackReport" ||
        this.type == "OfflineMessagePendingReport" ||
        this.type.includes('Report') == true
      ) {
        this.userConfig = {
          "reportFilter": true,
          "Export": true
        }
        this.reportExcel = true;
        this.getDynamicFilter();
      }
      else {
        this.userConfig = data;

        this.reportExcel = false;
      }
    }));
    if (
      this.type !== "PCCReport" &&
      this.type !== "VendorRegistrationReport" &&
      this.type !== "MedicalClearanceReport" &&
      this.type !== "OutstandingPaymentReport" &&
      this.type !== "GrievanceStatusReport" &&
      this.type !== "TrainingReport" &&
      this.type !== "PaymentCollectionReport" &&
      this.type !== "FunnelApplicationReport" &&
      this.type !== "SummaryReport" &&
      this.type !== "BatchWiseStatusReport" &&
      this.type !== "ChannelwisePerformanceReport" &&
      this.type !== "AbandonedReport" &&
      this.type !== "AgentPerformanceReport" &&
      this.type !== "AgentStatusReport" &&
      this.type !== "AgentUtilizationReport" &&
      this.type !== "BotReport" &&
      this.type !== "TranscriptsReport" &&
      this.type !== "HourlyWiseInteractionReport" &&
      this.type !== "InteractionDetailsReport" &&
      this.type !== "LoginLogoutReport" &&
      this.type !== "NotReadyReport" &&
      this.type !== "OfflineMessageReport" &&
      this.type !== "HSMSummaryReport" &&
      this.type !== "HSMReport" &&
      this.type !== "InteractionDashboardReport" &&
      this.type !== "InteractionType" &&
      this.type !== "RepeatCustomers" &&
      this.type !== "InteractionFeedbackReport" &&
      this.type !== "OfflineMessagePendingReport" &&

      this.type.includes('Report') != true
    ) {
      this.feildChooser();
    }
    this.loadTabKey();
    if (this.type == 'product-group') { this.getproduct() }



    if (this.type == 'users') {
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
        this.passwordPolicyapi = res.results.data;
        this.passwordPolicyapi.forEach(element => {
          if (element.ConfigKey == 'PasswordResetAdmin') {
            this.isResetEnabled = element.Status;
          }
        })
        if (this.userDetails.RoleType == 'Super Admin') {
          this.isResetEnabled = true;
        }

      })
    }

    this.common.setSearch('')
    this.common.hubControlEvent('Filter', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');
    // this.subscriptionEvent.push(
    this.common.tabChange.subscribe(res => {
      if ((res.tabe === 'Features' || res.tabe === 'System')) {
        this.CategoryValue = res?.Cate;
        this.productName = res.productId;
        this.getevent();
      }
      // this.subscriptionEvent.forEach((e) => {

      //   e.unsubscribe();
      // });
    })
    // );

  }
  searchevent(eventcatValue) {
    this.common.categoryValue.next(eventcatValue);
  }
  getevent() {
    var obj = {
      data: {
        spname: 'USP_UNFYD_NOTIFICATION_CATEGORY',
        parameters: {
          flag: 'GET_DRP',
          PRODUCTID: this.productName !== undefined ? this.productName : 11,
          PROCESSID: this.userDetails.Processid,
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.eventCategory = res.results.data;
      }
    });
  }
  getSnapShot() {
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      this.tab = this.userStatusSteps[0].tab;
      this.tabs = this.productgrouptable[0].tabs
      this.tabn = this.notificationsStep[0].tabn
      this.tabe = this.eventStep[0].tabe

    })
  }

  onTabChange(event) {
    this.common.hubControlEvent(this.type, 'click', '', '', event, 'onTabChange');
    this.tab = event;
  }
  onTabChange1(event) {
    this.common.hubControlEvent(this.type, 'click', '', '', event, 'onTabChange1');

    this.tabs = event
  }
  onTabChange2(event) {
    this.tabn = event
  }
  onCheckboxChange(event: boolean, data) {
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(event, data), 'onCheckboxChange');

    this.ChannelList.push(data);
    this.channel.forEach((object, index) => {
      if (data == index) {
        if (event) {
          this.channel[index]["Status"] = true;
        } else {
          this.channel[index]["Status"] = false;
        }
      }
    });
  }
  userActionData(resetBtnValue) {
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(resetBtnValue), 'userActionData');

    this.actions(resetBtnValue)
    this.common.usersActionableMethod({ action: true, resetBtnValue: this.resetBtnValue })
    this.search = ""
    this.hasChecked = []
  }

  loadTabKey() {

    this.subscriptionPopupModal = this.common.reportsTabKeyData.subscribe(
      (data: any) => {
        this.tabKey = data;
        this.feildChooser();
      }
    );
    this.exportReportTabValue = this.common.exportReportEmitter.subscribe(
      (data: any) => {
        var tempTabValue: any = [];
        tempTabValue = data;
        // tempTabValue.forEach((object) => {	
        //   delete object["SrNo"],	
        //     delete object["Id"],	
        //     delete object["Actionable"],	
        //     delete object["CHECKBOX"];	
        // });	
        // var temp = [];	
        // for (let i = 0; i < tempTabValue.length; i++) {	
        //   temp.push({ "Sr No": i + 1, ...tempTabValue[i] });	
        // }	
        this.excelService.exportExcel(tempTabValue, this.type);
      }
    );
    this.tabValueData = this.common.tabValueLength.subscribe((data: any) => {
      this.tabValueLength = data;
    });
  }


  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  reportData: any = [];
  Localizationdateformat:any;
  localizationformat:any;

  getActionable(event) {
    this.common.hubControlEvent(this.type, 'click', '', '', event, 'getActionable');

    var data: any = [];
    data.push({ reset: event.value });
    this.common.userData(data);
  }

  resetRecord(val) {
    this.common.hubControlEvent(this.type, 'click', '', '', val, 'resetRecord');

    if (val == 'resetPassword') {
      this.resetBtnValue = val;
    }
    else if (val == 'forceLogout') {
      this.resetBtnValue = val;
    }

    else if (val == 'forceUnlock') {
      this.resetBtnValue = val;
    }

    else if (val == 'activeusers') {
      this.resetBtnValue = val;
    }

  }

  userActionable() {
    if (!this.hasChecked) {
      this.common.snackbar("General Error");
      return;
    }
    var userdata;


    if (this.type == 'users' && this.tab == "GETALLUSERS" && this.resetBtnValue == 'resetPassword') {
      userdata = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            FLAG: 'RESETPASSWORD_BULK_USER',
            ProcessId: this.userDetails.Processid,
            MULTIID: this.hasChecked.toString()
          }
        }
      }
    }
    if (this.type == 'users' && this.tab == "GETALLUSERS" && this.resetBtnValue == 'forceLogout') {
      userdata = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            FLAG: 'RESETLOGIN_BULK_USER',
            ProcessId: this.userDetails.Processid,
            MULTIID: this.hasChecked.toString()
          }
        }
      }
    }

    if (this.type == 'users' && this.tab == "GETALLUSERS" && this.resetBtnValue == 'forceUnlock') {
      userdata = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            FLAG: 'RESETLOCKUSER_BULK_USER',
            ProcessId: this.userDetails.Processid,
            MULTIID: this.hasChecked.toString()
          }
        }
      }
    }

    if (this.type == 'users' && this.tab == "GETALLUSERS" && this.resetBtnValue == 'activeusers') {
      userdata = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            FLAG: 'GETALLUSERS',
            ProcessId: this.userDetails.Processid,
            MULTIID: this.hasChecked.toString()
          }
        }
      }
    }

    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(userdata), 'userActionable');

    console.log('userdataObj', userdata);

    this.api.post('index', userdata).subscribe(res => {
      if (res.code == 200) {
        console.log('userdataRes', res);
        this.common.usersActionableMethod({ resetBtnValue: this.resetBtnValue, action: true })
        this.common.snackbar(res.results.data[0].result, 'success');
        if (this.type == 'users' && this.tab == "GETALLUSERS" && this.resetBtnValue == 'forceLogout') {
          this.hasChecked.forEach(element => {

            var obj = {
              EVENT: "EventAgentForceLoggedOut",
              AGENTID: element,
              ADMINID: this.userDetails.Id,
              REASON: "Force Logout By Admin",
              TENANTID: this.userDetails.Processid,
              SOURCE: "ADMIN"
            }
            this.common.sendCERequestObj('UpdateAgentMappingMaster', this.userDetails.Processid, obj)
          });

        }
        this.hasChecked = []
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.common.usersActionableMethod({ resetBtnValue: this.resetBtnValue, action: false })
      }
    )
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
          modulename: (this.component == "" || !this.component) ? this.type == 'contact-center-location' ? 'ContactCenterLocation'
            : this.type == 'break-not-ready-reason-codes' ? 'BreakNotReadyReasonCodes'
              : (this.type == 'product-group' && this.ProductGroupTab == 'GET_PRODUCT_GROUP') ? 'ProductGroup'
                : (this.type == 'product-group' && this.ProductGroupTab == 'GET_CATEGORY') ? 'ProductCategory'
                  : (this.type == 'product-group' && this.ProductGroupTab == 'GET_SUB_CATEGORY') ? 'ProductSubCategory'
                    : this.type == 'break-not-ready-reason-codes' ? 'BreakNotReadyReasonCodes'
                      : (this.type == 'security-modules' && this.moduleName == 'BlockLocation') ? 'BlockLocation'
                        : (this.type == 'security-modules' && this.moduleName == 'BlockIPAdd') ? 'BlockIPAdd'
                          : (this.type == 'security-modules' && this.moduleName == 'BlackList') ? 'BlackList'
                            : (this.type == 'security-modules' && this.moduleName == 'Email') ? 'Email'
                              : (this.type == 'security-modules' && this.moduleName == 'Domain') ? 'Domain'
                                : (this.type == 'security-modules' && this.moduleName == 'IPAddress') ? 'IPAddress'
                                  : this.type == 'task-group' ? 'TaskGroup'
                                    : this.type : this.component,
          language: localStorage.getItem("lang"),
        },
      },
    };

    this.common.hubControlEvent(this.type, 'click', '', '', '', 'feildChooser');

    this.api.post("index", obj).subscribe(
      (res) => {
        if (res.code == 200) {
          if (res.results.data.length == 0) {
            this.selctedField = this.tabKey;
          } else {
            this.selctedField = res.results.data[0].FieldChooser.split(",");
          }
          this.unSelctedField = this.tabKey.filter(
            (field) => !this.selctedField.includes(field)
          );



          if (res.results.data.length == 0) {

            var unselectedfield

            if (this.type == "PrivilegeViewTable") {
              unselectedfield = ['ControlName', 'Description', 'Created By', 'Created On', 'Modified By', 'Modified On', 'Deleted On', 'Deleted By', 'Status', 'CreatedBy', 'CreatedOn', 'ModifiedBy', 'ModifiedOn', 'Icon']
            }
            else if (this.type == "Solution-Manager" || this.type == "Drilldown") {
              unselectedfield = ['Created By', 'Created On', 'Modified By', 'Modified On', 'Deleted On', 'Deleted By', 'CreatedBy', 'CreatedOn', 'ModifiedBy', 'ModifiedOn', 'Icon']
            }
            else {
              unselectedfield = ['Created By', 'Created On', 'Modified By', 'Modified On', 'Deleted On', 'Deleted By', 'Status', 'CreatedBy', 'CreatedOn', 'ModifiedBy', 'ModifiedOn', 'Icon']
            }


            this.selctedField = this.tabKey.filter(
              (field) => !unselectedfield.includes(field)
            );

            this.unSelctedField = this.tabKey.filter(
              (field) => unselectedfield.includes(field)
            );
          }

          var selctedField = [];
          for (let i = 0; i < this.selctedField.length; i++) {
            selctedField.push({ value: this.selctedField[i], checked: true });
          }
          var unSelctedField = [];
          for (let i = 0; i < this.unSelctedField.length; i++) {
            unSelctedField.push({
              value: this.unSelctedField[i],
              checked: false,
            });
          }
          this.finalField = [...selctedField, ...unSelctedField];
          this.finalField = this.finalField.filter(
            (data) => data.value != "" && data.value != "CHECKBOX"
          );
          this.common.setTableKey(this.finalField);
        } else {
        }
      },
      (error) => {
      }
    );
  }


  searchHawker() {
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'searchHawker');

    this.common.reportData((this.DateForm.get('Date').value).toISOString().slice(0, 10));
  }

  searchcategory() {
    this.common.categoryData((this.CategoryForm.value));
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'searchcategory');
  }


  columnSorting(event, value, columnClass) {
    var column = document.getElementsByClassName(columnClass);

    for (let i = 0; i < column.length; i++) {
      if (event) {
        column[i].classList.remove("tabCol");
      } else {
        column[i].classList.add("tabCol");
      }
    }
    if (event) {
      this.selctedField.push(value);
    } else {
      let i = this.selctedField.indexOf(value);
      if (i > -1) {
        this.selctedField.splice(i, 1);
      }
    }

    this.finalField.forEach(el => {
      if (el.value == value) {
        el.checked = event
      }
    })
    this.common.setTableKey(this.finalField);

  }

  saveColumnSorting() {
    //  alert(this.tabe)
    var obj = {
      data: {
        spname: "usp_unfyd_user_field_chooser",
        parameters: {
          flag: "DELETE_ADD_MAP",
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
          // modulename: (this.component == "" || this.component == undefined) ? this.type == 'contact-center-location' ? 'ContactCenterLocation' : this.type : this.component,
          // modulename: this.component == undefined || "" ? this.type : this.component,
          //   modulename: (this.component == "" || this.component == undefined) ? this.type == 'contact-center-location' ? 'ContactCenterLocation'
          //   : this.type == 'break-not-ready-reason-codes' ? 'BreakNotReadyReasonCodes'
          //   : this.type == 'product-group' ? 'ProductGroup'
          //  : this.type : this.component,

          modulename: (this.component == "" || !this.component) ? this.type == 'contact-center-location' ? 'ContactCenterLocation'
            : this.type == 'break-not-ready-reason-codes' ? 'BreakNotReadyReasonCodes'
              : (this.type == 'product-group' && this.ProductGroupTab == 'GET_PRODUCT_GROUP') ? 'ProductGroup'
                : (this.type == 'product-group' && this.ProductGroupTab == 'GET_CATEGORY') ? 'ProductCategory'
                  : (this.type == 'product-group' && this.ProductGroupTab == 'GET_SUB_CATEGORY') ? 'ProductSubCategory'
                    : (this.type == 'security-modules' && this.moduleName == 'BlockLocation') ? 'BlockLocation'
                      : (this.type == 'security-modules' && this.moduleName == 'BlockIPAdd') ? 'BlockIPAdd'
                        : (this.type == 'security-modules' && this.moduleName == 'BlackList') ? 'BlackList'
                          : (this.type == 'security-modules' && this.moduleName == 'Email') ? 'Email'
                            : (this.type == 'security-modules' && this.moduleName == 'Domain') ? 'Domain'
                              : (this.type == 'security-modules' && this.moduleName == 'IPAddress') ? 'IPAddress'
                                : this.type : this.component,

          modulefilter: "",
          fieldchooser: this.selctedField.toString(),
          language: localStorage.getItem("lang"),
          createdby: this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: "",
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
        },
      },
    };
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'saveColumnSorting');

    this.api.post("index", obj).subscribe(
      (res) => {
        if (res.code == 200) {
          this.common.snackbar("Saved Successfully", "success");
        } else {
          this.common.snackbar("Add Error", "error");
        }
      },
      (error) => {
        this.common.snackbar("Add Error", "error");
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {


    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.selctedField = [];
    var temp = event.container.data;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]["checked"]) {
        this.selctedField.push(temp[i]["value"]);
      }
    }
    this.common.setTableKey(this.finalField);
    // this.common.hubControlEvent(this.type,'click','','','','drop');
  }

  setItemsPerPage(event) {
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(event), 'setItemsPerPage');


    this.common.setItemsPerPage(event);
  }

  hsmtabletoggle(hsmtogval) {
    this.common.hsmtabletogglefunc(hsmtogval);

    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(hsmtogval), 'hsmtabletoggle');
  }

  emailtabletoggle(emailtogval) {
    this.common.emailtabletogglefunc(emailtogval);
  }
  setSearch(event) {
    event.length === 0 ? this.crossIcon=false : this.crossIcon=true;
    this.common.setSearch(event);
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'setSearch');
  }
  clearSearch() {
    this.value = '';
    this.crossIcon=false;
  }

  convertToPlain(html) {

    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }



  export(): void {
    this.language = "hi";
    this.language = "en"
    if (this.isDialog == true) {
      console.log("hellooooo", this.storeURL[this.type.toLowerCase()]);
      this.changeExcelfileName = this.common.exportFileName(this.storeURL[this.type.toLowerCase()])


      if (this.type == 'users') {
        if (this.tab == 'GETALLUSERS') {

          if (this.resetBtnValue == 'forceLogout') {
            var obj4 = {
              data: {
                spname: "usp_unfyd_adm_users",
                parameters: {
                  flag: "GETLOGGEDINUSERS_EXPORT",
                  agentid: this.userDetails.Id,
                  processid: this.userDetails.Processid,
                },
              },
            };
            this.api.post("index", obj4).subscribe((res) => {
              if (res.code == 200) {
                // holidaysArray=res.results.data;
                console.log(res, "res holiday")
              }
              // this.changeModuleDisplayName = this.common.changeModuleLabelName()
              // this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);

              // this.changeModuleDisplayName = this.common.changeModuleLabelName()
              this.excelService.exportExcel(res.results.data, this.changeExcelfileName);
            });
          }
          else if (this.resetBtnValue == 'forceUnlock') {
            var obj4 = {
              data: {
                spname: "usp_unfyd_adm_users",
                parameters: {
                  flag: "GETLOCKEDUSERS_EXPORT",
                  agentid: this.userDetails.Id,
                  processid: this.userDetails.Processid,
                },
              },
            };
            this.api.post("index", obj4).subscribe((res) => {
              if (res.code == 200) {
                // holidaysArray=res.results.data;
                console.log(res, "res holiday")
              }
              // this.changeModuleDisplayName = this.common.changeModuleLabelName()
              this.excelService.exportExcel(res.results.data, this.changeExcelfileName);
              // this.excelService.exportExcel(temp, this.changeExcelfileName);
            });
          }
          else if (this.resetBtnValue == 'resetPassword') {
            var obj4 = {
              data: {
                spname: "usp_unfyd_adm_users",
                parameters: {
                  flag: "GETRESETPASSWORDUSERS_EXPORT",
                  agentid: this.userDetails.Id,
                  processid: this.userDetails.Processid,
                },
              },
            };
            this.api.post("index", obj4).subscribe((res) => {
              if (res.code == 200) {
                // holidaysArray=res.results.data;
                console.log(res, "res holiday")
              }
              // this.changeModuleDisplayName = this.common.changeModuleLabelName()
              this.excelService.exportExcel(res.results.data, this.changeExcelfileName);
              // this.excelService.exportExcel(temp, this.changeExcelfileName);
            });
          }
          else {
            var obj4 = {
              data: {
                spname: "usp_unfyd_adm_users",
                parameters: {
                  flag: "GETALLUSERS_EXPORT",
                  agentid: this.userDetails.Id,
                  processid: this.userDetails.Processid,
                },
              },
            };
            this.api.post("index", obj4).subscribe((res) => {
              if (res.code == 200) {
                // holidaysArray=res.results.data;
                console.log(res, "res holiday")
              }

              let tabval = res.results.data
              tabval.forEach((object) => {
                delete object["Sr.no"],
                  delete object["CHECKBOX"];
              });
              var temp = [];
              for (let i = 0; i < tabval.length; i++) {
                temp.push({ "Sr No": i + 1, ...tabval[i] });
              }

              // this.changeModuleDisplayName = this.common.changeModuleLabelName()
              // this.excelService.exportExcel(temp, this.changeModuleDisplayName);
              this.excelService.exportExcel(temp, this.changeExcelfileName);
            });
          }
        }
        else if (this.tab == 'GETALLDISABLEUSERS') {
          var obj4 = {
            data: {
              spname: "usp_unfyd_adm_users",
              parameters: {
                flag: "GETALLDISABLEUSERS_EXPORT",
                agentid: this.userDetails.Id,
                processid: this.userDetails.Processid,
              },
            },
          };
          this.api.post("index", obj4).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res holiday")
            }

            let tabval = res.results.data
            tabval.forEach((object) => {
              delete object["Sr.no"],
                delete object["Actionable"],
                delete object["Id"],
                delete object["CHECKBOX"];
            });
            var temp = [];
            for (let i = 0; i < tabval.length; i++) {
              temp.push({ "Sr No": i + 1, ...tabval[i] });
            }
            // this.changeModuleDisplayName = this.common.changeModuleLabelName()
            // this.excelService.exportExcel(temp, this.changeModuleDisplayName);

            this.excelService.exportExcel(temp, this.changeExcelfileName);
          });
        }
      }
      else if (this.type == 'product-group') {
        if (this.tabs == 'GET_PRODUCT_GROUP') {
          var obj8 = {
            data: {
              spname: "usp_unfyd_customer_product_grp",
              parameters: {
                flag: 'GET_PRODUCT_GROUP_EXPORT',
                processid: this.userDetails.Processid,
                productid: this.userDetails.ProductId,

              },
            },
          };
          this.api.post("index", obj8).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res product group")
            }
            // this.changeModuleDisplayName = this.common.changeModuleLabelName()
            // this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
            this.excelService.exportExcel(res.results.data, this.changeExcelfileName);

          });
        }

        else if (this.tabs == 'GET_CATEGORY') {
          var obj5 = {
            data: {
              spname: "usp_unfyd_customer_product_grp",
              parameters: {
                flag: 'GET_CATEGORY_EXPORT',
                processid: this.userDetails.Processid,
                productid: this.userDetails.ProductId,
                // PRODUCTGRPID: this.tabs == 'GET_CATEGORY_EXPORT' ? this.ProductGroup : undefined,
                PRODUCTGRPID: this.ProductGroupValMaster,
                // PRODUCTGRPID:this.productID     productgrpid
              },
            },
          };
          this.api.post("index", obj5).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res product group")
            }
            // this.changeModuleDisplayName = this.common.changeModuleLabelName()
            // this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
            this.excelService.exportExcel(res.results.data, this.changeExcelfileName);


          });

        }
        else if (this.tabs == 'GET_SUB_CATEGORY') {
          var obj6 = {
            data: {
              spname: "usp_unfyd_customer_product_grp",
              parameters: {
                flag: 'GET_SUB_CATEGORY_EXPORT',
                processid: this.userDetails.Processid,
                productid: this.userDetails.ProductId,
                PRODUCTGRPID: this.ProductGroupValMaster,
                CATEGORYID: this.CategoryValMaster
              },
            },
          };
          this.api.post("index", obj6).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res product group")
            }
            // this.changeModuleDisplayName = this.common.changeModuleLabelName()
            // this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
            this.excelService.exportExcel(res.results.data, this.changeExcelfileName);

          });

        }
      }
      else {
        this.tabValue.forEach((object) => {
          // delete object["Sr.no"],
          delete object["Sr No"],
            delete object["Actionable"]
          delete object["CHECKBOX"];
        });
        var temp = [];
        for (let i = 0; i < this.tabValue.length; i++) {
          temp.push({ "Sr No": i + 1, ...this.tabValue[i] });
        }
        // this.changeModuleDisplayName = this.common.changeModuleLabelName()
        this.excelService.exportExcel(temp, this.changeExcelfileName);
      }

    } else {
      if (this.type == "holidays") {
        // var holidaysArray=[];
        var obj1 = {
          data: {
            spname: "usp_unfyd_adm_holidays",
            parameters: {
              flag: "EXPORT",
              processid: this.userDetails.Processid,
              LanguageCode: this.language,
              ChannelId: this.channel,
            },
          },
        };
        this.api.post("index", obj1).subscribe((res) => {
          if (res.code == 200) {
          }
          let newexcelfilename = this.type
          if (this.type == "holidays") {
            newexcelfilename = 'Holidays'
            this.excelService.exportExcel(res.results.data, newexcelfilename);
          }
        });
      } else if (this.type == "security-modules" && this.moduleName == "BlackList") {
        // var holidaysArray=[];
        var expobj = {
          data: {
            spname: "usp_unfyd_blacklist",
            parameters: {
              flag: "EXPORT",
              processid: this.userDetails.Processid,
              productId: this.securityproduct
            },
          },
        };
        this.api.post("index", expobj).subscribe((res) => {
          if (res.code == 200) {
          }
          let newexcelfilename = this.type
          if (this.type == "security-modules" && this.moduleName == "BlackList") {
            newexcelfilename = 'BlackList'
            this.excelService.exportExcel(res.results.data, newexcelfilename);
          }
        });
      } else if (this.type == 'task') {
        var temp = [];
        for (let i = 0; i < this.tabValue.length; i++) {
          let val = JSON.parse(JSON.stringify(JSON.parse(this.tabValue[i].Value)))
          let valData = JSON.parse(JSON.stringify(this.tabValue[i]))
          delete valData['Value']
          this.taskGroupInfo.TaskGroupFields.forEach(element => {
            if (Object.keys(val).includes(element.formControlName)) {
              Object.assign(valData, { [element.label]: val[element.formControlName] })
            }
          });
          temp.push({ "Sr No": i + 1, ...valData });
        }
        console.log(temp);
        this.excelService.exportExcel(temp, this.type);
      } else if (this.type == "ScorecardTemplate") {
        // var holidaysArray=[];
        let obj1 = {
          data: {
            spname: "usp_unfyd_scor_template",
            parameters: {
              flag: "EXPORT",
              processid: this.userDetails.Processid,
              //  LanguageCode: this.language,
            },
          },
        };
        this.api.post("index", obj1).subscribe((res) => {
          if (res.code == 200) {
          }
          let newexcelfilename = this.type
          if (this.type == "ScorecardTemplate") {
            newexcelfilename = 'ScorecardTemplate'
            this.excelService.exportExcel(res.results.data, newexcelfilename);

          }
        });
      }
      else if (this.type == "sla") {	
        // var holidaysArray=[];	
        let obj1 = {	
          data: {	
            spname: "usp_unfyd_sla",	
            parameters: {	
              flag: "EXPORT",	
              processid: this.userDetails.Processid,	
              productid: this.slaproductID,	
            },	
          },	
        };	
        this.api.post("index", obj1).subscribe((res) => {	
          if (res.code == 200) {	
          }	
          let newexcelfilename = this.type	
          if (this.type == "sla") {	
            newexcelfilename = 'sla'	
            this.excelService.exportExcel(res.results.data, newexcelfilename);	
          }	
        });	
      }
      else if (this.type == "BusinessOrchestration") {
        // var holidaysArray=[];
        let obj1 = {
          data: {
            spname: "USP_UNFYD_BUSINESSORCHESTRATION",
            parameters: {
              flag: "EXPORT",
              processid: this.userDetails.Processid,
              productId: this.BOProductID,
            },
          },
        };
        this.api.post("index", obj1).subscribe((res) => {
          if (res.code == 200) {
          }
        
          this.changeModuleDisplayName = this.common.changeModuleLabelName()
          this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
        });
      }
       else if (this.type == 'BusinessHours') {
        if (this.tabSelected == 'Online Hours') {
          var obj2 = {
            data: {
              spname: "usp_unfyd_adm_offline",
              parameters: {
                flag: "GETALLOFFLINEHRS_EXPORT",
                processid: this.userDetails.Processid,
                LanguageCode: this.language,
                ChannelId: this.channel,
              },
            },
          };
          this.api.post("index", obj2).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res holiday")
            }
            let newexcelfilename = this.type

            if (this.tabSelected == 'Online Hours') {
              newexcelfilename = 'Online Hours'
              this.excelService.exportExcel(res.results.data, newexcelfilename);

            }
            // this.excelService.exportExcel(res.results.data, this.type);
          });


        }
        else if (this.tabSelected == 'Offline Days') {
          var obj2 = {
            data: {
              spname: "usp_unfyd_adm_offline",
              parameters: {
                flag: "GETALLOFFLINEDAYS_EXPORT",
                processid: this.userDetails.Processid,
                LanguageCode: this.language,
                ChannelId: this.channel,
              },
            },
          };
          this.api.post("index", obj2).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res holiday")
            }
            let newexcelfilename = this.type

            if (this.tabSelected == 'Offline Days') {
              newexcelfilename = 'Offline Days'
              this.excelService.exportExcel(res.results.data, newexcelfilename);

            }
            // this.excelService.exportExcel(res.results.data, this.type);
          });

        }


      } else if (this.type == 'users') {
        if (this.tab == 'GETALLUSERS') {

          if (this.resetBtnValue == 'forceLogout') {
            var obj4 = {
              data: {
                spname: "usp_unfyd_adm_users",
                parameters: {
                  flag: "GETLOGGEDINUSERS_EXPORT",
                  agentid: this.userDetails.Id,
                  processid: this.userDetails.Processid,
                },
              },
            };
            this.api.post("index", obj4).subscribe((res) => {
              if (res.code == 200) {
                // holidaysArray=res.results.data;
                console.log(res, "res holiday")
              }
              this.changeModuleDisplayName = this.common.changeModuleLabelName()
              this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
            });
          }
          else if (this.resetBtnValue == 'forceUnlock') {
            var obj4 = {
              data: {
                spname: "usp_unfyd_adm_users",
                parameters: {
                  flag: "GETLOCKEDUSERS_EXPORT",
                  agentid: this.userDetails.Id,
                  processid: this.userDetails.Processid,
                },
              },
            };
            this.api.post("index", obj4).subscribe((res) => {
              if (res.code == 200) {
                // holidaysArray=res.results.data;
                console.log(res, "res holiday")
              }
              this.changeModuleDisplayName = this.common.changeModuleLabelName()
              this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
            });
          }
          else if (this.resetBtnValue == 'resetPassword') {
            var obj4 = {
              data: {
                spname: "usp_unfyd_adm_users",
                parameters: {
                  flag: "GETRESETPASSWORDUSERS_EXPORT",
                  agentid: this.userDetails.Id,
                  processid: this.userDetails.Processid,
                },
              },
            };
            this.api.post("index", obj4).subscribe((res) => {
              if (res.code == 200) {
                // holidaysArray=res.results.data;
                console.log(res, "res holiday")
              }
              this.changeModuleDisplayName = this.common.changeModuleLabelName()
              this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
            });
          }
          else {
            var obj4 = {
              data: {
                spname: "usp_unfyd_adm_users",
                parameters: {
                  flag: "GETALLUSERS_EXPORT",
                  agentid: this.userDetails.Id,
                  processid: this.userDetails.Processid,
                },
              },
            };
            this.api.post("index", obj4).subscribe((res) => {
              if (res.code == 200) {
                // holidaysArray=res.results.data;
                console.log(res, "res holiday")
              }

              let tabval = res.results.data
              tabval.forEach((object) => {
                delete object["Sr.no"],
                  delete object["CHECKBOX"];
              });
              var temp = [];
              for (let i = 0; i < tabval.length; i++) {
                temp.push({ "Sr No": i + 1, ...tabval[i] });
              }

              this.changeModuleDisplayName = this.common.changeModuleLabelName()
              this.excelService.exportExcel(temp, this.changeModuleDisplayName);
            });
          }
        }
        else if (this.tab == 'GETALLDISABLEUSERS') {
          var obj4 = {
            data: {
              spname: "usp_unfyd_adm_users",
              parameters: {
                flag: "GETALLDISABLEUSERS_EXPORT",
                agentid: this.userDetails.Id,
                processid: this.userDetails.Processid,
              },
            },
          };
          this.api.post("index", obj4).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res holiday")
            }

            let tabval = res.results.data
            tabval.forEach((object) => {
              delete object["Sr.no"],
                delete object["Actionable"],
                delete object["Id"],
                delete object["CHECKBOX"];
            });
            var temp = [];
            for (let i = 0; i < tabval.length; i++) {
              temp.push({ "Sr No": i + 1, ...tabval[i] });
            }
            this.changeModuleDisplayName = this.common.changeModuleLabelName()
            this.excelService.exportExcel(temp, this.changeModuleDisplayName);
          });
        }
      } else if (this.type == 'product-group') {
        if (this.tabs == 'GET_PRODUCT_GROUP') {
          var obj8 = {
            data: {
              spname: "usp_unfyd_customer_product_grp",
              parameters: {
                flag: 'GET_PRODUCT_GROUP_EXPORT',
                processid: this.userDetails.Processid,
                productid: this.userDetails.ProductId,

              },
            },
          };
          this.api.post("index", obj8).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res product group")
            }
            this.changeModuleDisplayName = this.common.changeModuleLabelName()
            this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
          });
        }

        else if (this.tabs == 'GET_CATEGORY') {
          var obj5 = {
            data: {
              spname: "usp_unfyd_customer_product_grp",
              parameters: {
                flag: 'GET_CATEGORY_EXPORT',
                processid: this.userDetails.Processid,
                productid: this.userDetails.ProductId,
                // PRODUCTGRPID: this.tabs == 'GET_CATEGORY_EXPORT' ? this.ProductGroup : undefined,
                PRODUCTGRPID: this.ProductGroupValMaster,
                // PRODUCTGRPID:this.productID     productgrpid
              },
            },
          };
          this.api.post("index", obj5).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res product group")
            }
            this.changeModuleDisplayName = this.common.changeModuleLabelName()
            this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
          });

        }
        else if (this.tabs == 'GET_SUB_CATEGORY') {
          var obj6 = {
            data: {
              spname: "usp_unfyd_customer_product_grp",
              parameters: {
                flag: 'GET_SUB_CATEGORY_EXPORT',
                processid: this.userDetails.Processid,
                productid: this.userDetails.ProductId,
                PRODUCTGRPID: this.ProductGroupValMaster,
                CATEGORYID: this.CategoryValMaster
              },
            },
          };
          this.api.post("index", obj6).subscribe((res) => {
            if (res.code == 200) {
              // holidaysArray=res.results.data;
              console.log(res, "res product group")
            }
            this.changeModuleDisplayName = this.common.changeModuleLabelName()
            this.excelService.exportExcel(res.results.data, this.changeModuleDisplayName);
          });

        }
      } else if (this.type == "label") {
        var TempAraay = [];
        var temp = [];
        var obj = {
          data: {
            spname: "usp_unfyd_form_validation",
            parameters: {
              flag: "BULK",
              language: this.language,
            },
          },
        };
        this.common.hubControlEvent(this.type, 'click', '', '', '', 'export');

        this.api.post("index", obj).subscribe((res) => {
          if (res.code == 200) {
            TempAraay = res.results.data;
          }
          TempAraay.forEach((element) => {
            if (element.Language[1] == "hi") {
            } else {
              temp.push({
                Id: element.Id[0],
                ModuleName: element.ModuleName[0],
                SubModule: element.SubModule[0],
                LabelName: element.LabelName[1],
                Key: element.Key[0],
                Language: this.language,
                ProcessId: element.ProcessId[0],
                ProductId: element.ProductId[0],
              });
            }
          });
          this.excelService.exportExcel(temp, this.type);
        });
      } else if (
        this.type == "AbandonedReport" ||
        this.type == "AgentPerformanceReport" ||
        this.type == "AgentStatusReport" ||
        this.type == "AgentUtilizationReport" ||
        this.type == "BotReport" ||
        this.type == "TranscriptsReport" ||
        this.type == "HourlyWiseInteractionReport" ||
        this.type == "InteractionDetailsReport" ||
        this.type == "LoginLogoutReport" ||
        this.type == "NotReadyReport" ||
        this.type == "OfflineMessageReport" ||
        this.type == "HSMSummaryReport" ||
        this.type == "HSMReport" ||
        this.type == "InteractionDashboardReport" ||
        this.type == "InteractionType" ||
        this.type == "RepeatCustomers" ||
        this.type == "InteractionFeedbackReport" ||
        this.type == "OfflineMessagePendingReport" ||
        this.type.includes('Report') == true
      ) {
        this.common.export({ Export: true });
      }
      else if (this.type == "Drilldown") {
        this.Localizationdateformat = JSON.parse(localStorage.getItem("localizationData"));
        this.localizationformat = this.Localizationdateformat.selectedDateFormats.toUpperCase().concat(" ", this.Localizationdateformat.selectedTimeFormats)
        if(this.localizationformat.includes('a'))this.localizationformat = this.localizationformat.replace('a','A')
        if(this.localizationformat.includes('p'))this.localizationformat = this.localizationformat.replace('p','P')
        
        if (this.drilldownRequest.data.hasOwnProperty('spname')) {
          if ((this.drilldownRequest.data.spname).toUpperCase() !== 'UNFYD_ADM_REALTIMEDASHBOARD_DETAILS_V2_EXPORT') {
            this.drilldownRequest.data.spname = this.drilldownRequest.data.spname + '_EXPORT'
          }
          // console.log(this.drilldownRequest.data.spname,"exportfilename")
        }
        else if (!this.drilldownRequest.data.hasOwnProperty('spname')) {
          Object.assign(this.drilldownRequest.data.parameters, { action: 'export' })
        }

        this.exportDrilldownTable()
      }

      else {
        this.tabValue.forEach((object) => {
          delete object["Sr.no"],
            delete object["Sr No"],
            delete object["Actionable"],
            delete object["CHECKBOX"];
        });
        var temp = [];
        for (let i = 0; i < this.tabValue.length; i++) {
          temp.push({ "Sr No": i + 1, ...this.tabValue[i] });
        }

        let newexcelfilename = this.type
        if (this.type == 'hsm-template') {
          newexcelfilename = 'HSM Template'
          this.excelService.exportExcel(temp, newexcelfilename);
        }
        // email-template
        // let newexcelfilename = this.type
        else if (this.type == 'email-template') {
          newexcelfilename = 'Email Template'
          this.excelService.exportExcel(temp, newexcelfilename);
        }
        else if (this.type == 'security-modules' && this.moduleName == 'BlockLocation') {
          newexcelfilename = 'Block Location'
          this.excelService.exportExcel(temp, newexcelfilename);
        }
        else if (this.type == 'security-modules' && this.moduleName == 'BlockIPAdd') {
          newexcelfilename = 'Block IP Address'
          this.excelService.exportExcel(temp, newexcelfilename);
        }
        else if (this.type == 'security-modules' && this.moduleName == 'Email') {
          newexcelfilename = 'Spam Control Email'
          this.excelService.exportExcel(temp, newexcelfilename);
        }
        else if (this.type == 'security-modules' && this.moduleName == 'Domain') {
          newexcelfilename = 'Spam Control Domain'
          this.excelService.exportExcel(temp, newexcelfilename);
        }
        else if (this.type == 'security-modules' && this.moduleName == 'IPAddress') {
          newexcelfilename = 'Spam Control IPAddress'
          this.excelService.exportExcel(temp, newexcelfilename);
        }
        else if (this.type == 'security-modules' && this.moduleName == 'BlackList') {
          newexcelfilename = 'BlackList'
          this.excelService.exportExcel(temp, newexcelfilename);
        }
        else {
          this.changeModuleDisplayName = this.common.changeModuleLabelName()
          this.excelService.exportExcel(temp, this.changeModuleDisplayName);


        }

      }

    }
  }


  exportDrilldownTable() {
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'exportDrilldownTable');

    this.api.dynamicDashboard(this.drilldownURL, this.drilldownRequest).subscribe(res => {
      if (res.code == 200) {
        var tempRes = [];
        this.tabValue = []
        this.tabKey = []
        if (Object.keys(res.results).length > 0 && res?.results?.data.length > 0) {
          tempRes = res?.results?.data[0]
          
          if(this.drilldownURL.includes('botDashboard'))
          {
            tempRes = res?.results?.data
          }
   
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


          for (let data of tempRes) {
            this.tabValue.push(data);
          }
          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
          }
        }

        if (tempRes.length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }

        this.tabValue.forEach((object) => {
          delete object["SrNo"],
          delete object["Sr No"],
            delete object["Actionable"],
            delete object["CHECKBOX"];
        });
        var temp = [];
        for (let i = 0; i < this.tabValue.length; i++) {
          temp.push({ "Sr No": i + 1, ...this.tabValue[i] });
        }
        temp.forEach(element => {
          var a: any
          try {
            a = JSON.parse(JSON.stringify(element.Channel)).split(",")
          } catch {
            console.log('not array');
          }

          if (a.length > 0) {
            a.forEach((aaa, index) => {
              if (aaa.includes("WHATSAPP")) {
                a[index] = 'WHATSAPP'
              } else if (aaa.includes("WEBCHAT")) {
                a[index] = 'WEBCHAT'
              } else if (aaa.includes("VOICE-IVR")) {
                a[index] = 'VOICE-IVR'
              } else if (aaa.includes("VOICE")) {
                a[index] = 'VOICE'
              } else if (aaa.includes("VIDEO")) {
                a[index] = 'VIDEO'
              } else if (aaa.includes("VIBER")) {
                a[index] = 'VIBER'
              } else if (aaa.includes("TWITTERDM")) {
                a[index] = 'TWITTERDM'
              } else if (aaa.includes("TWITTER")) {
                a[index] = 'TWITTER'
              } else if (aaa.includes("SMS")) {
                a[index] = 'SMS'
              } else if (aaa.includes("MOBILE-APP")) {
                a[index] = 'MOBILE-APP'
              } else if (aaa.includes("LINECHAT")) {
                a[index] = 'LINECHAT'
              } else if (aaa.includes("INSTAGRAMPOST")) {
                a[index] = 'INSTAGRAMPOST'
              } else if (aaa.includes("INSTAGRAMDM")) {
                a[index] = 'INSTAGRAMDM'
              } else if (aaa.includes("FACEBOOK")) {
                a[index] = 'FACEBOOK'
              } else if (aaa.includes("FACEBOOKCHAT")) {
                a[index] = 'FACEBOOKCHAT  '
              } else if (aaa.includes("EMAIL")) {
                a[index] = 'EMAIL'
              } else if (aaa.includes("COBROWSE")) {
                a[index] = 'COBROWSE'
              } else {
                a[index] = ''
              }

            })
            a = a.join(",")
          }
          element.Channel = a
        });
        console.log(temp);

        // this.name + '_' + 	
        var expname = this.type.replace('_Drilldown','')	
        this.excelService.exportExcel(temp,expname);

      } else {
      }
    }, (error) => {
      console.log('error', error)
    }
    )
  }

  addButtonLabel() {
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'addButtonLabel');

    this.router.navigate(['masters/label/add']);

  }

  reports(event) {
    var spname =
      this.type == "BatchWiseStatusReport"
        ? "usp_unfyd_batch_wise_mis_report"
        : this.type == "FunnelApplicationReport"
          ? "usp_unfyd_funnel_application_reg_report"
          : this.type == "PCCReport"
            ? "usp_unfyd_pcc_report"
            : this.type == "VendorRegistrationReport"
              ? "usp_unfyd_vendor_registration_report"
              : this.type == "MedicalClearanceReport"
                ? "usp_unfyd_medical_clearance_report"
                : this.type == "OutstandingPaymentReport"
                  ? "usp_unfyd_outstanding_payment_report"
                  : this.type == "GrievanceStatusReport"
                    ? "usp_unfyd_grievance_status_report"
                    : this.type == "TrainingReport"
                      ? "usp_unfyd_training_report"
                      : this.type == "PaymentCollectionReport"
                        ? "usp_unfyd_payment_collection_report"
                        : this.type == "SummaryReport"
                          ? "usp_unfyd_summary_mis_report"
                          : "";
    if (event == "day") {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      let date = yesterday.toISOString().slice(0, 10);
      this.obj = {
        data: {
          spname: spname,
          filename: this.type,
          date: date,
          parameters: {
            FromDate: date,
            ToDate: date,
          },
        },
      };
    } else if (event == "week") {
      let ToDate = new Date();
      let FromDate = new Date();
      FromDate.setDate(ToDate.getDate() - 6);
      let a = FromDate.toISOString().slice(0, 10);
      let b = ToDate.toISOString().slice(0, 10);
      this.obj = {
        data: {
          spname: spname,
          filename: this.type,
          date: a,
          parameters: {
            FromDate: a,
            ToDate: b,
          },
        },
      };
    } else if (event == "month") {
      let ToDate = new Date();
      let FromDate = new Date();
      FromDate.setMonth(ToDate.getMonth() - 1);
      let a = FromDate.toISOString().slice(0, 10);
      let b = ToDate.toISOString().slice(0, 10);
      this.obj = {
        data: {
          spname: spname,
          filename: this.type,
          date: a,
          parameters: {
            FromDate: a,
            ToDate: b,
          },
        },
      };
    }
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.obj), 'reports');

    if (this.obj != null || this.obj != undefined) {
      this.api.post("reports", this.obj).subscribe((res) => {
        if (res.code == 200) {
          this.common.snackbar("Add Record");
        }
      });
    }
  }

  downloadReport(data) {
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(data), 'downloadReport');

    var temp = [];
    for (let i = 0; i < data.length; i++) {
      temp.push({ "Sr No": i + 1, ...data[i] });
    }
    this.excelService.exportExcel(data, this.type);
  }

  import(event): void {
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(event), 'import');

    let filetype = event.target.files[0].type
    if (filetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.excelService.importExcel(event);
      this.myInputVariable.nativeElement.value = "";
      this.openDialog("upload");
    }
    else {
      this.common.snackbar('Please Upload ".xlsx" format file', 'error');
      return
    }
  }

  openDialog(type) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        title: "Are you sure?",
        subTitle: "You want to " + type + " this data",
      },
      width: "300px",
    });
    dialogRef.afterClosed().subscribe((status) => {
      if (status == true && type == "upload") {
        if (this.type == "label") {
          var temp = [];
          temp = JSON.parse(JSON.stringify(this.excelService.getJson()));
          for (let i = 0; i < temp.length; i++) {
            var obj = {
              data: {
                spname: "usp_unfyd_form_validation",
                parameters: {
                  flag: "BULK_INSERT",
                  id: temp[i]?.Id,
                  language: temp[i]?.Language,
                  labelname: temp[i]?.LabelName,
                  key: temp[i]?.Key,
                  modulename: temp[i]?.ModuleName,
                  submodule: temp[i]?.SubModule,
                  processid: temp[i]?.ProcessId,
                  productid: temp[i]?.ProductId,
                  modifiedby: this.userDetails.Id,
                },
              },
            };
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(type), 'openDialog');

            this.api.post("index", obj).subscribe(
              (res) => {
                if (res.code == 200) {
                } else {
                }
              },
              (error) => {
              }
            );
          }
        } else if (this.type == 'task') {
          this.common.importTable(this.type, this.excelService.getJson(), '', this.productID, this.taskGroupInfo)
        } else {
          if (this.type == 'product-group') this.common.importTable(this.type, this.excelService.getJson(), this.tabs)
          else if (this.type == 'beneficiary' || this.type == 'users') this.common.importTable(this.type, this.excelService.getJson(), this.tab)
          else this.common.importTable(this.type, this.excelService.getJson(), '', this.productID)
        }
      }
      if (type == "Reject" && status !== false) {
        this.bulkUpdate(type, status);
      }
    });
  }

  bulkUpdate(event, remarks) {
    for (let i = 0; i < this.bulkId.length; i++) {
      let obj = {
        data: {
          spname: "usp_unfyd_haw_approval_process",
          parameters: {
            flag: "INSERT",
            status:
              this.userDetails.RoleType == "Supervisor" && event == "Approved"
                ? 21
                : this.userDetails.RoleType == "ER Officer" &&
                  event == "Approved"
                  ? 1
                  : this.userDetails.RoleType == "Supervisor" && event == "Reject"
                    ? 18
                    : this.userDetails.RoleType == "ER Officer" && event == "Reject"
                      ? 19
                      : "",
            remarks: remarks,
            hawkerid: this.bulkId[i]["Applicant Id"],
            processid: this.userDetails.Processid,
            productid: 1,
            approvedby: event == "Approved" ? this.userDetails.UserName : "",
            rejectedby: event == "Reject" ? this.userDetails.UserName : "",
            role: this.userDetails.role,
            createdby: this.userDetails.Id,
            publicip: this.userDetails.Ip,
            privateip: "",
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
          },
        },
      };
      if (this.userDetails.RoleType == "ER Officer" && event == "Approved") {
        this.insertHawker(
          this.bulkId[i]["Id"],
          this.bulkId[i]["Applicant Id"],
          this.bulkId[i]["First Name"],
          this.bulkId[i]["Last Name"],
          this.bulkId[i]["Date of Birth"]
        );
      }
      this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(event), 'bulkUpdate');

      this.registrationStatus(event, this.bulkId[i]["Applicant Id"]);
      this.api.post("index", obj).subscribe(
        (res) => {
          if (res.code == 200) {
          } else {
          }
        },
        (error) => {
        }
      );
    }
  }

  insertHawker(id, Actionable, firstName, lastName, birth) {
    var dob = new Date(birth);
    var tempDate = dob.getDate();
    var date = tempDate.toString().length == 1 ? "0" + tempDate : tempDate;
    var tempMonth = dob.getMonth() + 1;
    var month = tempMonth.toString().length == 1 ? "0" + tempMonth : tempMonth;
    var tempYear = dob.getFullYear().toString().slice(-2);
    var year = tempYear.toString().length == 1 ? "0" + tempYear : tempYear;
    var username = "HAW" + year + month + String(id).padStart(5, "0");
    var password = firstName.toLowerCase().substring(0, 4) + date + month;
    var obj = {
      data: {
        spname: "usp_unfyd_haw_Login",
        parameters: {
          flag: "INSERT",
          createdby: this.userDetails.Id,
          hawkerid: Actionable,
          username: username,
          password: this.common.setEncrypted("123456$#@$^@1ERF", password),
          firstname: firstName,
          lastname: lastName,
          employeeid: Actionable,
          emailid: null,
          firsttimelogin: true,
        },
      },
    };
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(obj), 'insertHawker');

    this.api.post("index", obj).subscribe(
      (res) => {
        if (res.code == 200) {
        } else {
        }
      },
      (error) => {
      }
    );

    this.genetateQRCode(username, Actionable);
  }

  registrationStatus(event, hawkerId) {
    this.common.setLoaderStatus(true);
    let obj = {
      data: {
        spname: "usp_unfyd_haw_personal",
        parameters: {
          flag: "update_registration_status",
          hawkerid: hawkerId,
          registrationstatus:
            this.userDetails.RoleType == "Supervisor" && event == "Approved"
              ? "Pending-CC"
              : this.userDetails.RoleType == "ER Officer" && event == "Approved"
                ? "Active"
                : this.userDetails.RoleType == "Supervisor" && event == "Reject"
                  ? "Reject-Supervisor"
                  : this.userDetails.RoleType == "ER Officer" && event == "Reject"
                    ? "Reject-ER"
                    : "",
          hawkerstatusid:
            this.userDetails.RoleType == "Supervisor" && event == "Approved"
              ? 21
              : this.userDetails.RoleType == "ER Officer" && event == "Approved"
                ? 1
                : this.userDetails.RoleType == "Supervisor" && event == "Reject"
                  ? 18
                  : this.userDetails.RoleType == "ER Officer" && event == "Reject"
                    ? 19
                    : "",
          erstatus:
            this.userDetails.RoleType == "Supervisor" ? "" : "Completed",
        },
      },
    };
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(obj), 'registrationStatus');

    this.api.post("index", obj).subscribe(
      (res) => {
        if (res.code == 200) {
          this.common.setLoaderStatus(false);
          this.common.snackbar("Add Record", "success");
        } else {
          this.common.setLoaderStatus(false);
          this.common.snackbar("Add Record", "error");
        }
      },
      (error) => {
        this.common.setLoaderStatus(false);
        this.common.snackbar("Add Error", "error");
      }
    );
  }

  genetateQRCode(RegistrationNo, hawkerId) {
    let updateRegistrationID = {
      data: {
        spname: "usp_unfyd_haw_personal",
        parameters: {
          flag: "UPDATE_REGISTRATION_NO",
          hawkerid: hawkerId,
          RegistrationNo: RegistrationNo,
        },
      },
    };
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(updateRegistrationID), 'genetateQRCode');

    this.api.post("index", updateRegistrationID).subscribe((res) => { });
  }

  isFavorite: boolean = false;
  dynamicActiveFields(val) {
    this.dynamicActiveNumber = val;
    this.isFavorite = true;
  }


  filed_chooser: boolean = false;
  filterShow: boolean = false;
  toggleFilter() {
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'toggleFilter');

    this.filterShow = !this.filterShow;
    this.filed_chooser = false;
  }

  reset() {
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'reset');

    this.form.reset();
  }
  openAlertDialog(type, data) {


    if (this.type == "AlertMessage") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: this.data,
          productID: this.productID
        },
        width: "750px",
      });
      dialogRef.afterClosed().subscribe((status) => {
        if (status) {
          this.common.callGetAlertMethod(status);
        }
      });
    }
    else if (this.type == "holidays") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
        },
        width: "900px",
        height: "88vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          this.common.refreshMenu(status);
        }
      })
    }
    else if (this.type == "security-modules") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          moduleName: type,
          ruleType: this.ruleType,
        },
        width: "600px",
        height: "60vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          this.common.refreshMenu(status);
        }
      })
    }
    else if (this.type == "contact-center-location") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.feildChooser()

        if (status == true) {
          this.common.refreshMenu(status);
          this.feildChooser()
        }
      })
    }
    else if (this.type == "Privilege") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        // this.feildChooser();
        // this.common.refreshMenu(status);
        if (status == true) {
          this.common.refreshMenu(status);
          this.feildChooser()
        }
      })
    }
    else if (this.type == "skills") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        // this.common.refreshMenu(status);
        this.feildChooser()

        // if (status) {
        //   this.feildChooser()
        //   // this.common.refreshMenu(status);
        // }
      })
    }
    else if (this.type == "UserGroup") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.feildChooser()
        // this.common.refreshMenu(status);

        // if (status) {
        //   this.common.refreshMenu(status);
        // }
      })
    }
    else if (this.type == "hierarchy") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          this.common.refreshMenu(status);
        }
      })
    }
    else if (this.type == "users") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          isDialog: true,
          tabSelected: 'Personal Details'
        },
        width: "90%",
        height: "68vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.feildChooser()
        this.common.refreshMenu(status);
        if (status) {
          // this.common.refreshMenu(status);
        }
      })
    }

    else if (this.type == "product-group") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          isDialog: true
        },
        width: "90%",

        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          this.common.refreshMenu(status);
        }
      })
    }
    else if (this.type == "event") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          isDialog: true,
          eventfilter: this.filter,
          productID: this.productID
        },

        width: "900px",
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          this.common.refreshMenu(status);
        }
      })
    }
    else if (this.type == "BusinessHours") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          tabName: this.tabSelected,
          formName: 'add',
          Id: undefined,
          master: "BusinessHours"
        },
        width: "900px",
        height: "88vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          this.common.refreshMenu(status);
        }
      });
    }
    else if (this.type == "label") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
          product: this.product,
          selectedlanguage: this.selectedlanguage
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          this.common.addLabelInDialogMethod(status)
          this.common.refreshMenu(status);
        }
      })
    }
    else if (this.type == "hub-admin-access-controller") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: data,
        },
        width: '900px',
        // disableClose: true,
        // height: '80vh',
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          this.common.addLabelInDialogMethod(status)
        }
      })
    }
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(data), 'openAlertDialog');
  }

  openAccountDialog(type) {


    if (type == 'addAccount') {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          id: null
        },
        width: '60%',
        height: '65%'
      });
      dialogRef.afterClosed().subscribe((status) => {
        if (status == true) {
        }
      });
    } else if (type == 'productView') {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          actionId: this.activatedRoute.snapshot.paramMap.get('id')
        },
        width: '40%',
        height: '49%'
      });
      dialogRef.afterClosed().subscribe((status) => {
        if (status == true) {
        }
      });
    }
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(type), 'openAccountDialog');
  }
  goToPage(val) {
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(val), 'goToPage');

    if (val == "customerProduct") {
      this.router.navigate(['/masters/customerproduct/add']);
    }
    else if (val == "UsersComponent") {
      this.router.navigate(['/masters/users/add']);
    }
  }

  setItemsReportPerPage(event) {
    this.common.setItemsReportPerPage(event);
  }
  filterApply() {
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'filterApply');

    this.dynamicinputFields.forEach((element, index) => {
      if (this.form.contains('StartTime') && element.controlType == 'timepicker') {
        this.start = this.form.value.StartTime
        this.start = (this.start.hour * 60 * 60) + (this.start.minute * 60) + this.start.second
      }
      if (this.form.contains('EndTime') && element.controlType == 'timepicker') {
        this.end = this.form.value.EndTime
        this.end = (this.end.hour * 60 * 60) + (this.end.minute * 60) + this.end.second
      }
    })
    if (this.form.invalid || this.form.value.Date.startDate > this.form.value.Date.endDate) {
      this.common.snackbar("ReportsStartEndDate", "error");
      return;
    } else if (this.start > this.end) {
      this.common.snackbar("ReportsStartEndTime", "error");
      return;
    }
    else {
      let obj = this.form.value;
      obj.FROMDATE = (obj?.Date.startDate)?.toISOString().slice(0, 10);
      obj.TODATE = (obj?.Date.endDate)?.toISOString().slice(0, 10);
      obj.Date = "";
      for (const key of this.dynamicinputFields) {
        if ((key.controlType == 'dropdown' && key.label == 'Channel') || (key.controlType == 'MultiSelect' && key.label == 'Channel')) {
          obj.ChannelId = obj?.Channel == null ? "" : obj?.Channel.toString().length == 0 ? "" : obj?.Channel.toString().length == 1 ? obj?.Channel : obj?.Channel.join(",");
          obj.Channel = "";
        }
        else if (key.controlType == 'datepicker' && key.columnType !== 'Date') {
          obj[key.key] = obj[key.key]?.toISOString().slice(0, 10)
        }
        else if ((key.controlType == 'dropdown' && key.label !== 'Channel') || (key.controlType == 'MultiSelect' && key.label !== 'Channel')) {
          obj[key.key] = obj[key.key] == null ? "" : obj[key.key].length == 0 ? "" : obj[key.key].length == 1 ? obj[key.key] : obj[key.key].join(",");
        }
        else if (key.controlType == 'timepicker') {
          let hour1 = obj[key.key].hour.toString()
          let minute1 = obj[key.key].minute.toString()
          let second1 = obj[key.key].second.toString()
          obj[key.key] = hour1.padStart(2, "0") + ":" + (minute1).padStart(2, "0") + ":" + (second1).padStart(2, "0")
        }
        else if (obj[key.key] == undefined || obj[key.key] == null) {
          obj[key.key] = ""
        }
      }
      let values = Object.values(obj)
      let keys = Object.keys(obj)
      values.forEach((res, index) => {
        if (res == '') {
          let key = keys[index];
          obj[key] = null
        }
      });
      this.common.agentFilter(obj);
      this.DateForm.get('Date').setValue(moment());
    }
  }
  getDynamicFilter() {
    const obj = {
      data: {
        spname: "usp_unfyd_dynamic_filter",
        parameters: {
          flag: "GET",
          ModuleName: this.type,
        },
      },
    };
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(obj), 'getDynamicFilter');

    this.api.post("index", obj).subscribe(
      (res) => {
        if (res.code == 200) {
          if (res.results.data.length > 0) {
            this.dynamicinputFields = JSON.parse(res.results.data[0]?.DynamicData);
            this.form = this.common.toFormGroup(this.dynamicinputFields);
            // console.log(this.form);
            // console.log('dynamicinputFields : ', this.dynamicinputFields);
            this.dynamicinputFields.forEach((element, index) => {
              if (element.columnType == "Date") {
                this.dynamicActiveNumber = index;
                this.isFavorite = true;
              }
              if (element.controlType == 'timepicker') {
                let val = { hour: 0, minute: 0, second: 0 };
                this.form.controls[element.key].patchValue(val)
              }

              if (element.columnType == 'Channel') {
                this.ChannelSource = []
                this.TemplateData = []
                let obj = {
                  data: {
                    spname: "usp_unfyd_getdropdowndetails",
                    parameters: {
                      flag: "CHANNEL_FILTER",
                      processid: this.userDetails.Processid,
                    },
                  },
                };
                this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(obj), 'getDynamicFilter');
                this.api.post("index", obj).subscribe((res: any) => {
                  for (let i = 0; i < res.results["data"].length; i++) {
                    this.channel.push({
                      Id: res.results["data"][i].ChannelId,
                      ChannelName: res.results["data"][i].ChannelName,
                      Channel: res.results["data"][i].ChannelIcon == null ? '' : this.htmlDecode(res.results["data"][i].ChannelIcon),
                    });
                  }
                });
              }
              if (element.columnType == 'AgentName') {
                let obj = {
                  data: {
                    spname: "USP_UNFYD_TALK_AGENTROUTING",
                    parameters: {
                      ACTIONFLAG: "GET_AGENT_NAME",
                      processid: this.userDetails.Processid,
                    },
                  },
                };
                this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(obj), 'getDynamicFilter');

                this.api.post("index", obj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.agents = res.results.data
                  }
                });
              }
              if (element.columnType == 'SkillName') {
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_getdropdowndetails",
                    parameters: {
                      flag: "SKILL",
                      processid: this.userDetails.Processid
                    }
                  }
                }

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  this.skillType = res.results['data'];

                })
              }

              if (element.columnType == 'UserName') {
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_adm_users",
                    parameters: {
                      flag: "GETALLUSERS",
                      ProcessId: this.userDetails.Processid,
                      AgentID: this.userDetails.Id
                    }
                  }
                }

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  this.userName = res.results['data'];
                })
              }
              if (element.columnType == 'UserId') {
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_adm_users",
                    parameters: {
                      flag: "GETALLUSERS",
                      ProcessId: this.userDetails.Processid,
                      AgentID: this.userDetails.Id
                    }
                  }
                }

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  this.userId = res.results['data'];
                })
              }
              if (element.columnType == 'LoginId') {
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_adm_users",
                    parameters: {
                      flag: "GETALLUSERS",
                      ProcessId: this.userDetails.Processid,
                      AgentID: this.userDetails.Id
                    }
                  }
                }

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  this.logInID = res.results['data'];
                })
              }

              if (element.columnType == 'PRODUCT') {
                this.requestObj = {
                  data: {
                    spname: 'usp_unfyd_customer_products',
                    parameters: {
                      flag: 'get',
                      ProcessId: this.userDetails.Processid,
                    }
                  }
                }

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  this.ProductName = res.results['data'];
                })
              }
              if (element.columnType == 'Disposition') {
                this.SubDisposition = []
                this.SubSubDisposition = []
                this.requestObj = {
                  data: {
                    spname: 'usp_unfyd_data_collection_form',
                    parameters: {
                      flag: 'GET_DISPOSITION',
                    }
                  }
                }

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  this.Disposition = res.results['data'];
                })
              }

            })
          }
          else {
            this.dynamicinputFields = [
              { "moduleName": "", "columnType": "Date", "controlType": "datepicker", "key": "Date", "label": "Date", "defaultSelectDropDown": null, "options": null, "type": "date", "dropdownKey": null, "dropdownValue": null }
            ];
            this.form = this.common.toFormGroup(this.dynamicinputFields);
          }

        } else {
          ``;
        }
      },
      (error) => {
      }
    );
  }
  togglePRODUCTSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'PRODUCT') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.ProductName.map(data => data.Actionable));
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleLoginIdSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'LoginId') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.logInID.map(data => data.Id));
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleUserIdSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'UserId') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.userId.map(data => data.Id));
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleUserNameSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'UserName') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.userName.map(data => data.Id));
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleSkillNameSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'SkillName') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.skillType.map(data => data.Id));
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleAgentNameSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'AgentName') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.agents.map(data => data.id));
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleSubSubDispositionSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'SubSubDisposition') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.SubSubDisposition.map(data => data.SubSubDisposition));
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleSubDispositionSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'SubDisposition') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.SubDisposition.map(data => data.SubDisposition));
          this.getSubSubDisposition(this.form.value.SubDisposition)
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleDispositionSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'Disposition') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.Disposition.map(data => data.Disposition));
          this.getSubDisposition(this.form.value.Disposition)
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleTemplateNameSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'TemplateName') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.TemplateData.map(data => data.Actionable));
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleChannelSourceSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'ChannelSource') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.ChannelSource.map(data => data.ChannelSourceId));
          this.getTemplate(this.form.value.ChannelSource)
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  toggleChannelSelection(change: MatCheckboxChange,): void {
    this.dynamicinputFields.forEach((e) => {
      if (e.controlType == 'MultiSelect' && e.columnType === 'Channel') {
        if (change.checked) {
          this.form.controls[e.key].patchValue(this.channel.map(data => data.Id));
          this.getChannelSource(this.form.value.Channel)
          this.form.controls[e.key].updateValueAndValidity()

        } else {
          this.form.controls[e.key].patchValue('');
          this.form.controls[e.key].updateValueAndValidity()
        }
      }
    }
    )
  }
  allChannelSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'Channel') {
        if (e.includes(0) && this.form.value.b.key.length >= this.channel.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }

  allChannelSourceSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'ChannelSource') {
        if (e.includes(0) && this.form.value.b.key.length >= this.ChannelSource.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
                this.form.updateValueAndValidity();
              }
            }
          }
        }
      }
    })
  }

  allTemplateSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'TemplateName') {
        if (e.includes(0) && this.form.value.b.key.length >= this.TemplateData.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }
  allDispositionSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'Disposition') {
        if (e.includes(0) && this.form.value.b.key.length >= this.Disposition.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }
  allSubDispositionSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'SubDisposition') {
        if (e.includes(0) && this.form.value.b.key.length >= this.SubDisposition.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }
  allSubSubDispositionSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'SubSubDisposition') {
        if (e.includes(0) && this.form.value.b.key.length >= this.SubSubDisposition.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }
  allAgentNameSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'AgentName') {
        if (e.includes(0) && this.form.value.b.key.length >= this.agents.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }
  allSkillNameSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'SkillName') {
        if (e.includes(0) && this.form.value.b.key.length >= this.skillType.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }
  allUserNameSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'UserName') {
        if (e.includes(0) && this.form.value.b.key.length >= this.userName.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }
  allPRODUCTSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'PRODUCT') {
        if (e.includes(0) && this.form.value.b.key.length >= this.ProductName.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }
  allUserIDSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'UserId') {
        if (e.includes(0) && this.form.value.b.key.length >= this.userId.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }
  allLoginIdSelect(e, val) {
    this.dynamicinputFields.forEach((b) => {
      if (b.controlType == 'MultiSelect' && b.columnType == 'LoginId') {
        if (e.includes(0) && this.form.value.b.key.length >= this.logInID.length) {
          if (this.form.value.b.key.includes(0)) {
            for (var i = 0; i < this.form.value.b.key.length; i++) {
              if (this.form.value.b.key[i] == 0) {
                let a = []
                a = this.form.value.b.key
                a.splice(a.indexOf(0), 1);
                this.form.controls[b.key].patchValue(a);
                this.form.controls[b.key].updateValueAndValidity()
              }
            }
          }
        }
      }
    })
  }

  getChannelSource(ChannelId: any) {
    this.loader = true;
    this.ChannelSource = []
    this.TemplateData = []
    let arr = [];
    if (Array.isArray(ChannelId)) { arr = ChannelId }
    else {
      arr.push(ChannelId);
    }
    arr.forEach((e) => {
      this.requestObj = {
        data: {
          spname: "USP_RULEMASTER_PROC",
          parameters: {
            flag: "CHANNELSOURCE",
            processid: this.userDetails.Processid,
            channelid: e
          }
        }
      };
      this.api.post('index', this.requestObj).subscribe((res: any) => {
        if (res.code == 200) {
          let channel = res.results.data
          channel.forEach((a) => this.ChannelSource.push(a))
          this.loader = false;
        } else this.loader = false;
      });
    })
  }
  getTemplate(ChannelSourceId: any) {
    this.loader = true;
    this.TemplateData = []
    let arr = [];
    let arr1 = [];
    if (Array.isArray(this.form.value.Channel)) { arr = this.form.value.Channel }
    else {
      arr.push(this.form.value.Channel);
    }
    if (Array.isArray(ChannelSourceId)) { arr1 = ChannelSourceId }
    else {
      arr1.push(ChannelSourceId);
    }
    arr.forEach((a => {
      arr1.forEach((e) => {
        this.requestObj = {
          "data": {
            "spname": "usp_unfyd_hsm_template",
            "parameters": {
              "FLAG": "GET_NOTIFICATION",
              "PROCESSID": this.userDetails.Processid,
              "CHANNELID": a,
              "UNIQUEID": e
            }
          }
        };
        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            let Template = res.results.data;
            Template.forEach((a) => this.TemplateData.push(a))
            this.loader = false;

          } else this.loader = false;
        });
      })
    }))

  }
  getSubDisposition(Disposition: any) {
    this.loader = true;
    this.SubDisposition = []
    this.SubSubDisposition = []
    // this.TemplateData = []
    let arr = [];
    if (Array.isArray(Disposition)) { arr = Disposition }
    else {
      arr.push(Disposition);
    }
    arr.forEach((e) => {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_data_collection_form",
          parameters: {
            flag: "GET_SUB_DISPOSITION",
            DISPOSITION: e
          }
        }
      };
      this.api.post('index', this.requestObj).subscribe((res: any) => {
        if (res.code == 200) {
          let disposition = res.results.data
          disposition.forEach((a) => this.SubDisposition.push(a))
          this.loader = false;
        } else this.loader = false;
      });
    })

  }
  getSubSubDisposition(SubDisposition: any) {
    this.loader = true;
    this.SubSubDisposition = []
    let arr = [];
    let arr1 = [];
    if (Array.isArray(this.form.value.Disposition)) { arr = this.form.value.Disposition }
    else {
      arr.push(this.form.value.Disposition);
    }
    if (Array.isArray(SubDisposition)) { arr1 = SubDisposition }
    else {
      arr1.push(SubDisposition);
    }
    arr.forEach((a => {
      arr1.forEach((e) => {
        this.requestObj = {
          "data": {
            spname: "usp_unfyd_data_collection_form",
            "parameters": {
              "FLAG": "GET_SUB_SUB_DISPOSITION",
              "DISPOSITION": a,
              "SUBDISPOSITION": e
            }
          }
        };
        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            let subdisposition = res.results.data;
            subdisposition.forEach((a) => this.SubSubDisposition.push(a))
            this.loader = false;
          } else this.loader = false;
        });
      })
    }))

  }
  htmlDecode(data: any) {

    data = data.replace(/\&amp;/g, "&");
    data = data.replace(/\&gt;/g, ">");
    data = data.replace(/\&lt;/g, "<");
    data = data.replace(/\&quot;/g, "");
    data = data.replace(/\&apos;/g, "");
    return data;
  }
  bulkdelete() {


    if (this.type == 'PrivilegeViewTable') {
      var commaSeperated = this.hasChecked;
      this.common.reloadDataMethod(commaSeperated);
      this.hasChecked = []
      return;
    }


    this.openDialogBulkDelete("delete");
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'bulkdelete');
  }
  openDialogBulkDelete(type) {
    let deleteCount = 0;
    let endpoint: any;
    if (this.type == "UserGroup") {
      endpoint = "index";
    }

    this.common.confirmationToMakeDefault('ConfirmationToDelete');

    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      var commaSeperatedString = this.hasChecked.toString();
      // console.log(this.hasChecked.toString(),"this.hasChecked.toString()")
      // console.log(commaSeperatedString,"commaSeperatedString")

      if (status.status) {
        this.hasChecked.forEach((e) => {
          if (this.type == "UserGroup") {
            this.requestObj = {
              data: {
                spname: "group",
                parameters: {
                  flag: "DELETE",
                  DELETEDBY: this.userDetails?.Id,
                  GROUPID: e,
                },
              },
            };
          } else if (this.type == 'users') {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_adm_users",
                parameters: {
                  flag: "BULK_DELETE",
                  MULTIID: this.hasChecked.toString(),
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          } else if (this.type == 'BusinessOrchestration') {
            this.requestObj = {
              data: {
                spname: "USP_UNFYD_BUSINESSORCHESTRATION",
                parameters: {
                  flag: "BULK_DELETE",
                  MULTIID: this.hasChecked.toString(),
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          } else if (this.type == "skills") {

            this.requestObj = {
              data: {
                spname: "usp_unfyd_skillmaster",
                parameters: {
                  flag: "DELETESKILL",
                  Id: e,
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          }
          if (this.type == 'TaskGroup') {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_task_group",
                parameters: {
                  flag: 'DELETE',
                  deletedby: this.userDetails?.Id,
                  Id: e,

                },
              },
            };
          } else if (this.type == "rm-mapping") {

            this.requestObj = {
              data: {
                spname: "UNFYD_ADM_RM_BASED_ROUTING_V1",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          } else if (this.type == "hsm-template") {

            this.requestObj = {
              data: {
                spname: "usp_unfyd_hsm_template",
                parameters: {
                  flag: "HSM_BULK_DELETE",
                  multiid: commaSeperatedString,
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          } else if (this.type == "scheduler") {

            this.requestObj = {
              data: {
                spname: "usp_unfyd_scheduler",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          } else if (this.type == "contact") {

            this.requestObj = {
              data: {
                spname: "usp_unfyd_contact_personal",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          } else if (this.type == "task") {	
            this.requestObj = {	
              data: {	
                spname: "usp_unfyd_tasks",	
                parameters: {	
                  flag: "BULK_DELETE",	
                  multiid: commaSeperatedString,	
                  deletedby: this.userDetails?.Id,	
                },	
              },	
            };	
          } else if (this.type == "product-group") {
            if (this.tabs == 'GET_CATEGORY') {

              this.requestObj = {
                data: {
                  spname: "usp_unfyd_customer_product_grp",
                  parameters: {
                    flag: "CATEGORY_BULK_DELETE",
                    multiid: commaSeperatedString,
                    deletedby: this.userDetails?.Id,
                  },
                },
              };
            } else if (this.tabs == 'GET_SUB_CATEGORY') {
              this.requestObj = {
                data: {
                  spname: "usp_unfyd_customer_product_grp",
                  parameters: {
                    flag: "SUBCATEGORY_BULK_DELETE",
                    multiid: commaSeperatedString,
                    deletedby: this.userDetails?.Id,
                  },
                },
              };

            }
          } else if (this.type == "contact-center-location") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_cc_location",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "accounts") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_link_account",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "Privilege") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_access_controls",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "broadcast") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_broadcast",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                },
              },
            };
          } else if (this.type == "tenant") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_tenant",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "break-not-ready-reason-codes") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_notready",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "hubModules") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_form_module",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "hub-admin-access-controller") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_access_controls",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "customerproduct") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_customer_products",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "blockcontent") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_block_content",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "maskingrule") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_masking_rule",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                },
              },
            };
          } else if (this.type == "AlertMessage") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_alert_msg_config",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString
                },
              },
            };
          } else if (this.type == "hsm-template") {

            this.requestObj = {
              data: {
                spname: "usp_unfyd_hsm_template",
                parameters: {
                  flag: "HSM_BULK_DELETE",
                  multiid: commaSeperatedString,
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          } else if (this.type == "holidays") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_adm_holidays",
                parameters: {
                  flag: "BULK_DELETE",
                  MULTIID: commaSeperatedString
                },
              },
            };
          } else if (this.type == "email-template") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_email_template",
                parameters: {
                  flag: "BULK_DELETE",
                  MULTIID: commaSeperatedString
                }
              },
            }
          } else if (this.tabe == "Features") {
            this.requestObj = {
              data: {
                spname: "USP_UNFYD_NOTIFICATION_EVENTS",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          } else if (this.tabe == "System") {
            this.requestObj = {
              data: {
                spname: " USP_UNFYD_NOTIFICATION_FIELDS",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          }
          else if (this.component == "OnlineHours") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_adm_offline",
                parameters: {
                  flag: "OFFLINE_HRS_BULK_DELETE",
                  MULTIID: commaSeperatedString
                },
              },
            };
          }
          else if (this.component == "OfflineDays") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_adm_offline",
                parameters: {
                  flag: "OFFLINE_DAYS_BULK_DELETE",
                  MULTIID: commaSeperatedString
                },
              },
            };
          } else if (this.moduleName == "BlockLocation") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_block_location",
                parameters: {
                  flag: "BULK_DELETE",
                  MULTIID: commaSeperatedString
                },
              },
            };
          }
          else if (this.moduleName == "BlockIPAdd") {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_block_ipAddress",
                parameters: {
                  flag: "BULK_DELETE",
                  MULTIID: commaSeperatedString
                },
              },
            };
          }
          else if ((this.moduleName == 'Email' || this.moduleName == 'Domain' || this.moduleName == 'IPAddress')) {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_spam_control",
                parameters: {
                  flag: "BULK_DELETE",
                  MULTIID: commaSeperatedString
                },
              },
            };
          }
          else if ((this.moduleName == 'BlackList')) {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_blacklist",
                parameters: {
                  flag: "BULK_DELETE",
                  MULTIID: commaSeperatedString
                },
              },
            };
          }

          if (this.type == "UserGroup") {
            this.api.post(endpoint, this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  // this.common.snackbar("Delete Record");
                  // this.common.reloadDataMethod(true);


                  if (res.results.data[0].result.includes("UserMapped")) {
                    this.common.snackbar("UserMapped")
                  }
                  if (deleteCount == this.hasChecked.length) {
                    if (res.results.data[0].result.includes("Data deleted successfully")) {
                      this.common.snackbar("Delete Record");
                    }
                    this.common.reloadDataMethod(true);
                  }

                }
              }
            });
          }
          else if (this.type == "skills") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (res.results.data[0].result.includes("UserMapped")) {
                  this.common.snackbar("UserMapped")
                }
                if (deleteCount == this.hasChecked.length) {
                  if (res.results.data[0].result.includes("Skill deleted successfully")) {
                    this.common.snackbar("Delete Record");
                  }
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == 'TaskGroup') {
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                if (res.results.data[0].result.includes("Data deleted successfully")) {
                  this.common.snackbar("Delete Record");
                }
                else if (res.results.data[0].result.includes("Task is mapped")) {
                  this.common.snackbar("TaskMapped")
                }
                this.common.reloadDataMethod(true);
              }
            });

          }
          else if (this.type == "contact-center-location") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }

          else if (this.type == "rm-mapping") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }

          else if (this.type == "scheduler") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                     let obj = {
                                    "data":{
                                            "FLAG" : "DELETESCHEDULER",
                                            "ID":commaSeperatedString
                                          }
                                  }
                                  this.api.post('ScheduleInsertRedis', obj).subscribe((res: any) => {
                                  })
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }

          else if (this.type == "task") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }

          else if (this.type == "contact") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }

          else if (this.type == "hsm-template") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }

          else if (this.type == "product-group") {
            if (this.tabs == 'GET_CATEGORY') {
              this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

              this.api.post("index", this.requestObj).subscribe((res) => {
                if (res.code == 200) {
                  deleteCount++;
                  if (deleteCount == this.hasChecked.length) {
                    this.common.snackbar("Delete Record");
                    this.common.reloadDataMethod(true);
                  }
                }
              });
            }
            else if (this.tabs == 'GET_SUB_CATEGORY') {
              this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

              this.api.post("index", this.requestObj).subscribe((res) => {
                if (res.code == 200) {
                  deleteCount++;
                  if (deleteCount == this.hasChecked.length) {
                    this.common.snackbar("Delete Record");
                    this.common.reloadDataMethod(true);
                  }
                }
              });
            }
          }

          else if (this.type == "accounts") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == "Privilege") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == "broadcast") {

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == "tenant") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == "blockcontent") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == "break-not-ready-reason-codes") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == "hubModules") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }

            });
          }
          else if (this.type == "hub-admin-access-controller") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == "customerproduct") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }

          else if (this.type == 'users') {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {

              if (res.code == 200) {
                deleteCount++;
                this.common.snackbar("Delete Record");
                this.common.reloadDataMethod(true);
              }
            });
          }

          else if (this.type == "maskingrule") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == 'BusinessOrchestration') {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {

              if (res.code == 200) {
                deleteCount++;
                this.common.snackbar("Delete Record");
                this.common.reloadDataMethod(true);
              }
            });
          }
          else if (this.type == "AlertMessage") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }

          else if (this.type == "hsm-template") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == "holidays") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');
            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.sendCERequest('UpdateHolidayMaster', this.userDetails.Processid)

                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.type == "email-template") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');
            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.tabe == "Features") {
            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.tabe == "System") {
            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }

          else if (this.component == "OnlineHours") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                this.common.sendCERequest('UpdateOfflineHoursMaster', this.userDetails.Processid)
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.component == "OfflineDays") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.sendCERequest('UpdateOfflinedaysMaster', this.userDetails.Processid)
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.moduleName == "BlockLocation") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if (this.moduleName == "BlockIPAdd") {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if ((this.moduleName == 'Email' || this.moduleName == 'Domain' || this.moduleName == 'IPAddress')) {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }
          else if ((this.moduleName == 'BlackList')) {
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.common.reloadDataMethod(true);
                }
              }
            });
          }




        });

        if (status.status && type == "delete") {
          if (this.type == "quicklinks") {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "USP_UNFYD_ADM_PUSHURLMASTER",
                parameters: {
                  flag: "DELETEBULKURL",
                  DELETEDBY: this.userDetails?.Id,
                  multiid: commaSeperatedString,
                },
              },
            };
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.common.reloadDataMethod(true);
              }
            });
          }


          else if (this.type == "schedule") {
            {
              this.requestObj = {
                data: {
                  spname: "usp_unfyd_schedule",
                  parameters: {
                    flag: "BULK_DELETE",
                    multiid: commaSeperatedString,
                    deletedby: this.userDetails?.Id,
                  },
                },
              };
            }

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.common.reloadDataMethod(true);
              }
            });
          }

          else if (this.type == "hierarchy") {
            {
              this.requestObj = {
                data: {
                  spname: "usp_unfyd_hierarchy",
                  parameters: {
                    flag: "BULK_DELETE",
                    multiid: commaSeperatedString,
                    deletedby: this.userDetails?.Id,
                  },
                },
              };
            }
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.common.reloadDataMethod(true);
              }
            });
          }
          else if (this.type == "sla") {

            this.requestObj = {
              data: {
                spname: "usp_unfyd_sla",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                  deletedby: this.userDetails?.Id,
                },
              },
            };

            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.common.reloadDataMethod(true);
              }
            });
          }
          else if (this.type == "ScorecardTemplate") {

            this.requestObj = {
              data: {
                spname: "usp_unfyd_scor_template",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                  deletedby: this.userDetails?.Id,
                },
              },
            };

            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.common.reloadDataMethod(true);
              }
            });
          }
          else if (this.type == "NotificationInternal" || this.type == "NotificationExternal" || this.type == "Notification") {
            this.requestObj = {
              data: {
                spname: "USP_UNFYD_NOTIFICATION",
                parameters: {
                  flag: "BULK_DELETE",
                  multiid: commaSeperatedString,
                  userid: this.userDetails?.Id,
                },
              },
            };
            this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'openDialogBulkDelete');

            this.api.post("index", this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.common.reloadDataMethod(true);
              }
            });
          }




        }

      }




      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
      // this.feildChooser()
    }
    ))

  }

  getproduct() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_customer_product_grp",
        parameters: {
          flag: 'GET_PRODUCT_GROUP',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
        }
      }
    }
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'getproduct');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.product = res.results.data;

    })
  }

  getcategorydropdwon(groupId: any) {
    this.productgrpid = groupId
    this.requestObj = {

      data: {
        spname: "usp_unfyd_customer_product_grp",
        parameters: {
          flag: 'GET_CATEGORY',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          PRODUCTGRPID: groupId,
        }
      }
    }
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.requestObj), 'getcategorydropdwon');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.category = res.results.data;
      this.loader = false
      if (this.tabs == 'GET_CATEGORY') {
        this.searchcategory()
      }
    })
  }



  activateUser() {
    if (!this.hasChecked) {
      this.common.snackbar("General Error");
      return;
    }
    var userdata;
    userdata = {
      data: {
        spname: "usp_unfyd_adm_users",
        parameters: {
          FLAG: 'ACTIVATEBULKUSER',
          multiid: this.hasChecked.toString(),
        }
      }
    }
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(userdata), 'activateUser');

    this.api.post('index', userdata).subscribe(res => {
      if (res.code == 200) {
        this.common.snackbar(res.results.data[0].result, 'success');
        this.common.activateUserMethod(1)
      } else {
        this.common.snackbar("Select a function First");
      }
    },
      (error) => {
        this.common.snackbar("Select a function First");
      }
    )
  }
  actionTab: any;
  actions(e) {
    this.common.hubControlEvent(this.type, 'click', '', '', e, 'actions');

    this.actionTab = e;

    this.actionname = e;
  }

  hubAccessRoute() {
    if (this.isDialog == true) {
      this.openAlertDialog('addPriv', null)
    }
    else {
      this.router.navigate(['masters/Privilege/add'])
    }
    this.common.hubControlEvent(this.type, 'click', '', '', '', 'hubAccessRoute');
  }

  hubAdminSummary(data) {
    this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(data), 'hubAdminSummary');
    if (this.isDialog == true) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'addPriv',
          PriId: data.Actionable,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status == true) {
        }
      });
    }
    else {
      this.router.navigate(['masters/Privilege/copy', data.Actionable]);
    }
  }
  sampleDataExport() {
    let spname = this.type == 'beneficiary' ? this.flagAndSPName[this.type.toLowerCase()][this.tab.toLowerCase()].spname : this.type == 'users' ? this.flagAndSPName[this.type.toLowerCase()][this.tab.toLowerCase()].spname : this.type == 'product-group' ? this.flagAndSPName[this.type.toLowerCase()][this.tabs.toLowerCase()].spname : this.flagAndSPName[this.type.toLowerCase()].spname
    let obj = {
      data: {
        spname: spname,
        parameters: {
          flag: 'EXPORT_SAMPLE_DATA'
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          this.excelService.exportExcel(res.results.data, (this.type + '_Sample_Format').toUpperCase())
        }
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      }
    )

  }

  selectedApprovalModulesChanged() {
    this.common.approvalSelected.next(this.selectedApprovalModules)
  }

  createTask() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'createTaskManually',
        taskGroupInfo: this.taskGroupInfo,
        taskGroupId: this.taskGroupId
      },
      width: "100%",
      maxHeight: '85vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      console.log(status);
      if(status) this.common.reloadData.next(true)
      this.feildChooser()
    })
  }

  ngOnDestroy() {
    this.subscriptionPopupModal?.unsubscribe();
    this.exportReportTabValue?.unsubscribe();
    this.tabValueData?.unsubscribe();
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

  openSearch() {
    document.getElementById("myOverlay").style.display = "block";
  }

  closeSearch() {
    document.getElementById("myOverlay").style.display = "none";
  }
  dialogView() {
    this.dialog.open(PitchDialogComponent, {
      data:{
        type : "selectAudienceList"
       },
      disableClose: true,
      height: '50%',
      width: '40%'
    })
  }
  addButtonForPitch(){
    // console.log("vishal", this.type);
    if(this.type == 'campaignlist'){
      this.router.navigate(['pitch/campaign/add']);
    } else if(this.type == 'audiencelist'){
      this.dialogView(); 
    }else if(this.type == 'campaignView'){
      this.router.navigate(['pitch/campaign/excelUpload', this.pitchCommon.CampaignIdAndStatus.isChecked, 
      this.pitchCommon.CampaignIdAndStatus.id])
      // this.pitchCommon.CampaignIdAndStatus;
    }
  }



}
