import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { orderBy } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { Breadcrumb } from 'src/app/global/interface';
import { ApiService } from 'src/app/global/api.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { hawkerStatusSteps, userStatusSteps, productgrouptable, approvalTabs } from 'src/app/global/json-data';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { a } from './form-creation/form-preview/form-preview.component';
import { url } from 'inspector';
import moment from 'moment';
import { encode, decode } from 'html-entities';


@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.scss'],
})
export class MastersComponent implements OnInit {
  @ViewChild('exelUpload') myInputVariable: ElementRef;
  public breadcrumbs: Breadcrumb[];
  loader: boolean = false;
  @Output() productTab = new EventEmitter<any>();
  @Input() newLabelName: string;
  @Input() taskGroupId: any
  @Input() taskGroupInfo
  userDetails: any;
  UserProfile: any;
  show: boolean = false;
  showFirst: boolean = false;
  showSecond: boolean = false;
  tabKey: any = [];
  tabValue: any = [];
  tabValueLength: any = [];
  @Input() type: any = '';
  @Input() edit: any = false;
  @Input() isDialog: boolean = false;
  tab: any = 'GETALLUSERS';
  tabs: any = 'GET_PRODUCT_GROUP';
  @Input() component: any;
  @Input() ProductGroupTab: any;


  path: any = null;
  masters: any;
  hawkerId: number;
  requestObj: any;
  Obj: any;
  search: any;
  page: number = 1;
  btnClass: any;
  iptClass: any;
  itemsPerPage: number = 10;
  hawkerStatusSteps: any;
  userStatusSteps: any;
  productgrouptable: any;
  userConfig: any;
  isNaN: Function = Number.isNaN;
  countrylist: any = [];
  statelist: any = [];
  filteredstates = this.statelist.slice();
  skillId: any;
  custresult: any;
  agents: any = [];
  filter: boolean = false;
  subscriptionPopupModal: Subscription | undefined;
  subscriptionUserModal: Subscription | undefined;
  ProductGroup: any;
  Category: any;
  hsm: any;
  resetBtnValue: any;
  userResetButton: any;
  agentId: any;
  passwordPolicyapi: any = [];
  isResetEnabled: boolean = false;
  moduleNameStore: any
  moduleNameLoop: any = [];
  keylength: any = 0;
  displayNameStore: any;
  changeModuleDisplayName: string;
  users: any;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  formBuilder: FormBuilder;
  form: FormGroup;
  productType: any;
  productName: any;
  languageName: any;
  selectedproduct: any;
  category: any;
  productID: any;
  slaproductID: any = '';
  schedulerproductID: any = '';
  BOProductID: any = ''
  approvalModules = []
  selectedApprovalModules: any;
  approvalTabs: any
  channel: any;
  language: any;
  product: any;
  languageData: any = [];
  @Input() tabSelected: any;
  @Input() ruleType: any

  selectedlanguage: any;
  dateformat: any;
  format: any;
  @Input() moduleName: string;
  securityproduct: any;
  requestObj1: any;
  requestObj2: any;
  requestObj3: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
  ) {
    Object.assign(this, { hawkerStatusSteps, userStatusSteps, productgrouptable, approvalTabs });

  }
  ngOnInit(): void {

    this.subscription.push(this.common.configView$.subscribe(res => {
      if (res != false) {
        this.channel = res.channel
        this.language = res.language
      }
    }))

    this.dateformat = JSON.parse(localStorage.getItem("localizationData"));
    this.format = this.dateformat.selectedDateFormats.toUpperCase().concat(" ", this.dateformat.selectedTimeFormats)

    this.UserProfile = JSON.parse(localStorage.getItem("UserProfile"));

    this.subscription.push(this.common.securityView$.subscribe(res => {
      if (res != false) {
        this.securityproduct = res.securityproduct
      }
    }))

    this.common.hubControlEvent('Masters', 'click', 'pageload', 'pageload', '', 'ngOnInit');
    this.subscription.push(this.common.labelView$.subscribe(res => {
      if (res != false) {
        this.product = res.product
        this.language = res.selectedlanguage

      }
    }))


    // this.common.hubControlEvent('Masters','click','pageload','pageload','','ngOnInit');
    // this.subscription.push(this.common.schedulerView$.subscribe(res => {
    //     if (res != false){
    //        this.product = res.product
    //     //    this.language = res.selectedlanguage

    //     }}))

    this.subscription.push(this.common.productTabs$.subscribe(res => {
      if (res != false) {
        this.tabs = res.tabs
        this.ProductGroup = res.ProductGroupValMaster
        this.Category = res.CategoryValMaster
        // this.getCategory()
        this.getContacts()
      }
    }))

    this.moduleNameStore = JSON.parse(localStorage.getItem('menu'))
    this.userDetails = this.auth.getUser();
    this.filter = false;
    this.getSnapShot();
    this.getLanguage()
    this.getCountries('', 'Country');
    this.common.refresh.subscribe((data) => {
      if (data == true) {
        this.getContacts();
      }
    });
    this.subscription.push(this.common.approvalSelected$.subscribe((res: any) => {
      this.selectedApprovalModules = res
      this.getContacts()
    }))
    this.subscription.push(this.common.customerproduct$.subscribe((custres: any) => {
      this.custresult = custres
    }))
    this.subscription.push(this.common.reloadData$.subscribe(res => {
      if (res) {
        this.feildChooser();
        this.getContacts()
      }
    }));

    this.subscription.push(this.common.usersActionable$.subscribe(res => {
      if (res.action) {
        this.userResetButton = res.resetBtnValue
        this.hasChecked = []
        this.search = ""
        this.allSelected = false
        this.tabValue = [];
        this.tabKey = [];
        console.log('finalField', this.finalField);
        if (this.finalField[0]?.CHECKBOX) {
          this.finalField[0].CHECKBOX = false
        }
        this.getUsers()


      }
    }))

    this.common.activateUser$.subscribe((res => {
      this.getContacts();
    }))
    this.getCategory();
    this.getUserData();




    this.displayNameStore = ''
    this.moduleNameStore.forEach(element => {
      if (element.hasOwnProperty('Keys')) {
        if (element.Keys.length > 0) {
          element.Keys.forEach(element1 => {
            if (this.router.url.toLowerCase().includes(element1.ModuleUrl.toLowerCase())) {
              this.displayNameStore = element1.DisplayName
            }
          })
        }
        else if (this.router.url.toLowerCase().includes(element.parantModuleUrl.toLowerCase())) {
          this.displayNameStore = element.DisplayName


        }
      }
    })
    this.changeModuleDisplayName = this.common.changeModuleLabelName()
    this.getProducts()
    this.common.hubControlEvent('Masters', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }


  getProducts() {
    this.common.hubControlEvent('Masters', 'click', '', '', '', 'getProducts');
    this.productType = JSON.parse(localStorage.getItem('products'))
    if (this.type == 'approvals') this.getModulesForApprovalsProductWise();
    this.selectedApprovalINfo()
  }

  selectedApprovalINfo() {
    if (this.type == 'approvals' || this.type == 'sla' || this.type == 'scheduler' || this.type == 'BusinessOrchestration') {
      this.subscription.push(this.common.selectedApprovalDetails$.subscribe(res => {
        if (res) {
          if (this.type == 'sla') {
            this.slaproductID = parseInt(res.productId)
          }
          if (this.type === 'scheduler') {
            this.schedulerproductID = parseInt(res.productId)
            this.getContacts()
          }
          if (this.type === 'BusinessOrchestration') {
            this.BOProductID = parseInt(res.productId)
            this.getContacts()
          }
          if (this.type == 'approvals') {
            this.productID = parseInt(res.productId)
            this.selectedApprovalModules = JSON.parse(JSON.stringify(res.moduleName))
            this.tab = res.tab
            this.getModulesForApprovalsProductWise(res.moduleName)
          }
          if (this.type === 'sla') {
            setTimeout(() => {
              this.getContacts();
            }, 0);
          }

        } else {
          if (this.type === 'scheduler' || this.type == 'BusinessOrchestration') this.getContacts()
          if (this.type === 'sla') {
            setTimeout(() => {
              this.getContacts();
            }, 0);
          }

        }
      }))
    }
  }
  getCategorypro(event) {
    this.selectedproduct = event;
    this.common.selectProductGreetingMethod(event);
    this.loader = true;
    var obj = {
      data: {
        spname: "usp_unfyd_greetings_category",
        parameters: {
          flag: "get",
          processid: this.userDetails.Processid,
          productid: this.selectedproduct
        }
      }
    }
    this.common.hubControlEvent('Masters', 'click', '', '', event, 'getCategorypro');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.category = res.results.data;
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = true;
      });
  }

  SummaryPreview(val, data, type) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(data), 'SummaryPreview');

    if (type == 'tenant') {
      this.router.navigate(['masters/tenant/tenantSummary', data.Actionable]);


    }
    else if (this.type == 'Privilege') {
      if (this.isDialog == true) {
        this.contactAction(data.Actionable, type)
      }
      else {

        this.router.navigate(['masters/Privilege/update', data.Actionable]);
      }

    }
    else if (this.type == 'hubModules') {
      this.router.navigate(['masters/hubModules/summary', data.Actionable]);
    }


  }
  typeTitle: any;
  getCategory() {
    this.common.hubControlEvent('Masters', 'click', '', '', '', 'getCategory');

    this.subscriptionPopupModal = this.common.categoryDataEmitter.subscribe((data: any) => {
      this.filter = true;
      this.ProductGroup = data?.ProductGroup;
      this.Category = data?.categ;
      this.getContacts();
    });
  }
  getUserData() {
    this.common.hubControlEvent('Masters', 'click', '', '', '', 'getUserData');

    this.loader = true;
    this.subscriptionUserModal = this.common.userDataEmitter.subscribe((data: any) => {
      this.userResetButton = data[0].reset;
      this.tabValue = [];
      this.tabKey = [];
      this.hasChecked = []
      this.search = ""
      this.allSelected = false
      this.getUsers();
    });
  }

  getSnapShot() {
    this.common.hubControlEvent('Masters', 'click', '', '', '', 'getSnapShot');


    this.activatedRoute.url.subscribe(url => {
      this.changeModuleDisplayName = this.common.changeModuleLabelName()
      if (!this.edit) {
        this.type = this.activatedRoute.snapshot.paramMap.get('type');
      }
      if (this.type == 'users') this.tab = 'GETALLUSERS'
      else if (this.type == 'approvals') this.tab = 'GET_PENDING'
      // alert(this.type)
      this.typeTitle = this.type.replace(/-/g, ' ');
      if (this.type == 'masking-rule') {
        this.type = 'maskingrule'
        this.typeTitle = 'Masking Rule'
      }
      if (this.type == 'customerproduct') {
        this.typeTitle = 'Products'
      }

      if (this.type == 'user-group') {
        this.typeTitle = 'User Groups'
      }

      if (this.type == 'task-group') {
        this.type = 'TaskGroup'
        this.typeTitle = 'Task Groups'
      }

      if (this.type == 'quicklinks') {
        this.typeTitle = 'Quick Links'

      }
      if (this.type == 'schedules') {
        this.type = 'schedule'
        this.typeTitle = 'schedule'

      }

      if (this.type == 'break-not-ready-reason-codes') {
        this.typeTitle = 'Not Ready Reason Codes'
      }
      if (this.type == 'business-orchestration') {
        this.type = 'BusinessOrchestration'
      }
      if (this.type == 'payment-collection'
        || this.type == 'stock-issue'
        || this.type == 'beneficiary-complaint'
        || this.type == 'reassignment'
        || this.type == 'logout-user'
        || this.type == 'feature-controls'
        || this.type == 'generalsettings') {
        this.router.navigate(['masters/' + this.type + '/list']);
      }
      if (this.type == 'data-collection-forms') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'structure') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'my-task') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'campaign-field-mapping') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'module-mapping') {
        this.router.navigate(['masters/' + this.type + '/list']);
      }
      if (this.type == 'reassignment') {
        this.router.navigate(['masters/' + this.type + '/list']);
      }
      if (this.type == 'fee-type') {
        this.router.navigate(['masters/' + this.type + '/list']);
      }
      if (this.type == 'form-event') {
        this.router.navigate(['masters/' + this.type + '/list']);
      }
      if (this.type == 'training') {
        this.router.navigate(['masters/' + this.type + '/list']);
      }
      if (this.type == 'vendor') {
        this.router.navigate(['masters/' + this.type + '/list']);
      }
      if (this.type == 'inventory') {
        this.router.navigate(['masters/' + this.type + '/list']);
      }
      if (this.type == 'branding') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'channel-configuration') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'exceldownload') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'add-product') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'canned-messages') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'feature-controls') {
        this.router.navigate(['masters/' + this.type + '/list']);
      }
      if (this.type == 'greetings') {
        this.router.navigate(['masters/' + this.type + '/view'], { queryParams: { filter: 'category' } });
        // this.router.navigate(['masters/' + this.type + '/view'], { queryParams: { filter: 'category', productid: this.productType[0].Id } });
      }
      if (this.type == 'email-notification' || this.type == 'account') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'hsm-template') {
        this.router.navigate(['masters/' + this.type + '/view'], { queryParams: { filter: 'hsm' } });
      }
      if (this.type == 'broadcast') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'event') {
        this.router.navigate(['masters/' + this.type + '/view']);
      }
      if (this.type == 'notifications') {
        this.router.navigate(['masters/' + this.type + '/view'])
      }
      this.getContacts();
      this.getFilter();
      this.feildChooser()
      this.displayNameStore = ''
      this.moduleNameStore.forEach(element => {
        if (element.hasOwnProperty('Keys')) {
          if (element.Keys.length > 0) {
            element.Keys.forEach(element1 => {
              if (this.router.url.toLowerCase().includes(element1.ModuleUrl.toLowerCase())) {
                this.displayNameStore = element1.DisplayName
              }
            })
          }
          else if (this.router.url.toLowerCase().includes(element.parantModuleUrl.toLowerCase())) {
            this.displayNameStore = element.DisplayName


          }
        }
      })
      this.common.setUserConfig(this.userDetails.ProfileType, this.type);
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {

        this.userConfig = data;


      }));

    });
  }

  getUsers() {
    var userdata =
    {
      data: {
        spname: "usp_unfyd_adm_users",
        parameters: {
          FLAG: this.userResetButton == 'resetPassword' ? 'GETRESETPASSWORDUSERS ' : this.userResetButton == 'forceLogout' ? 'GETLOGGEDINUSERS ' : this.userResetButton == 'forceUnlock' ? 'GETLOCKEDUSERS ' : 'GETALLUSERS',
          ProcessId: this.userDetails.Processid,
          AgentID: this.userDetails.Id

        }
      }
    }
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(userdata), 'getUsers');

    this.api.post('index', userdata).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;


        if (res.results.data.length > 0) {
          if (this.type == 'users') {
            if (this.userResetButton == 'forceUnlock') {

              this.tabValue = res.results.data;
              for (var key in this.tabValue[0]) {
                if (this.tabValue[0].hasOwnProperty(key)) {
                  this.tabKey.push(key);
                }
              }
            } else if (this.userResetButton == 'activeusers') {
              this.tabValue = []
              for (let data of res.results.data) {
                var newObject = {
                  "Sr No": data['Sr No'],
                  "Actionable": data['Actionable'],
                  "First Name": data['First Name'],
                  "Last Name": data['Last Name'],
                  "Alias Name": data['Alias Name'],
                  "Username": data['Username'],
                  "Email Id": data['Email Id'],
                  "Contact Number": data['Contact Number'],
                  "Employee Id": data['Employee Id'],
                  "Language Code": data['Language Code'],
                  "Role": data['Role'],
                  "Channel": this.htmlDecode(data['Channel']),
                  "Group": data['User Groups'],
                  "Skill": data['Skill'],
                  "Time Zone": data['Time Zone'],
                  // "Start Time": data['Start Time'],
                  // "End Time": data['End Time'],
                  "Login Status": data['Login Status'],
                  "Account Status": data['Account Status'],
                  "Created By": data['Created By'],
                  "Created On": data['Created On'],
                  "Modified By": data['Modified By'],
                  "Modified On": data['Modified On'],
                }
                this.tabValue.push(newObject);
              }
            } else {
              this.tabValue = res.results.data;

              for (var key in this.tabValue[0]) {
                if (this.tabValue[0].hasOwnProperty(key)) {
                  this.tabKey.push(key);
                }
              }
            }
          }
        }








      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    });
  }

  getContacts() {
    this.loader = true;
    this.tabValue = [];
    this.tabKey = [];
    this.hasChecked = []
    this.page = 1;
    this.allSelected = false




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
      this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(this.requestObj), 'getContacts');

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





    if (this.type == 'approvals' && this.selectedApprovalModules && this.tab) {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_approvals',
          parameters: {
            flag: this.tab,
            MODULENAME: this.selectedApprovalModules,
            processid: this.userDetails.Processid,
            productid: this.productID
          },
        },
      };
    }
    // if (this.type == 'sla' && this.slaproductID) {
    if (this.type == 'sla') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_sla',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.slaproductID
          },
        },
      };
    }
    if (this.type == 'ScorecardTemplate') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_scor_template',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
          },
        },
      };
    }
    if (this.type == 'users') {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_adm_users',
          parameters: {
            flag: this.tab,
            agentid: this.userDetails.Id,
            processid: this.userDetails.Processid,

          },
        },
      };
    }
    if (this.type == 'beneficiary') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_haw_personal',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            roletype: this.userDetails.RoleType,
            userid: this.userDetails.RoleType == 'Field Executive' ? this.userDetails.Id : null,
            productid: 1,
            registrationstatus: this.tab,
          },
        },
      };
    }
    if (this.type == 'TaskGroup') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_task_group',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
          },
        },
      };
    }
    if (this.type == 'task') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_tasks',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            TASKGROUPID: this.taskGroupId,

          },
        },
      };
    }
    if (this.type == 'maskingrule') {
      // alert(this.type)
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_masking_rule',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,

          },
        },
      };
    }

    if (this.type == 'blockcontent') {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_block_content',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1


          },
        },
      };
    }


    if (this.type == 'rm-mapping') {

      this.requestObj = {
        data: {
          spname: 'UNFYD_ADM_RM_BASED_ROUTING_V1',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1


          },
        },
      };
    }

    // if (this.type == 'BusinessOrchestration' && this.BOProductID) {
    if (this.type == 'BusinessOrchestration') {
      this.requestObj = {
        data: {
          spname: "USP_UNFYD_BUSINESSORCHESTRATION",
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.BOProductID,
          }
        }
      }
    }

    if (this.type == 'hubModules') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_form_module',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,

          },
        },
      };
    }


    if (this.type == 'scheduler') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_scheduler',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.schedulerproductID

          },
        },
      };
    }

    if (this.type == 'skills') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_skillmaster',
          parameters: {
            flag: 'GETALLSKILL',
            processid: this.userDetails.Processid,
          },
        },
      };
    }



    if (this.type == 'event') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_event_master',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
          },
        },
      };
    }


    if (this.type == 'quicklinks') {
      this.requestObj = {
        data: {
          spname: 'USP_UNFYD_ADM_PUSHURLMASTER',
          parameters: {
            processid: this.userDetails.Processid,
            flag: 'PUSHURLMASTEREXPORT',
          },
        },
      };
    }

    if (this.type == 'schedule') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_schedule',
          parameters: {
            processid: this.userDetails.Processid,
            flag: 'GET',
          },
        },
      };
    }
    if (this.type == 'user-group') {
      this.requestObj = {
        data: {
          spname: 'group',
          parameters: {
            flag: 'GET',
            productid: this.userDetails.ProductId,
            processid: this.userDetails.Processid,
          },
        },
      };
    }
    if (this.type == 'hierarchy') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_hierarchy',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,

          },
        },
      };
    }

    if (this.type == 'campaigns') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_campaigns',
          parameters: {
            flag: 'GET',
            processid: 1,
            productid: 1
          },
        },
      };
    }
    if (this.type == 'product-group') {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_customer_product_grp',
          parameters: {
            flag: this.tabs,
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
            PRODUCTGRPID: this.tabs == 'GET_CATEGORY' ? this.ProductGroup : this.tabs == 'GET_SUB_CATEGORY' ? this.ProductGroup : undefined,
            CATEGORYID: this.tabs == 'GET_SUB_CATEGORY' ? this.Category : undefined,
          },
        },
      };
    }

    if (this.type == 'customerproduct') {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_customer_products',
          parameters: {
            flag: 'get',
            processid: this.userDetails.Processid,
          },
        },
      };
    }

    if (this.type == 'contact-center-location') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_cc_location',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId

          },
        },
      };
    }


    if (this.type == 'contact') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_contact_personal',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
            // UserType:null,


          },
        },
      };
    }


    if (this.type == 'tenant') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_tenant',
          parameters: {
            flag: 'getall',
          },
        },
      };
    }
    if (this.type == 'branding') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_branding',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    // if (this.type == 'label') {
    //     this.requestObj = {
    //         data: {
    //             spname: 'usp_unfyd_form_validation',
    //             parameters: {
    //                 flag: 'GET',
    //                 processid: this.userDetails.Processid,
    //                 productid: this.product,
    //             },
    //         },
    //     };
    // }

    if (this.type == 'product') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_client_products',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }

    if (this.type == 'policeStation') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_police_stn',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'hospital') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_hospital_doc',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'trainingCenter') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_training_center',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'Union') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_union',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'vendor-product') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_vendor_product',
          parameters: {
            flag: 'GET',
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: 1,
          },
        },
      };
    }
    if (this.type == 'vendor-service') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_vendor_service',
          parameters: {
            flag: 'GET',
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: 1,
          },
        },
      };
    }
    if (this.type == 'inventory') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_inventory_trans',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'stock') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_stockaddition',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'finance') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_haw_finance',
          parameters: {
            flag: 'GET',
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: 1,
          },
        },
      };
    }
    if (this.type == 'damagedstock') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_damagedstock',
          parameters: {
            flag: 'GET',
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: 1,
          },
        },
      };
    }
    if (this.type == 'VendorRefund') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_vendorrefund',
          parameters: {
            flag: 'GET',
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: 1,
          },
        },
      };
    }
    if (this.type == 'employee') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_emp_personal',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
            roletype: 'employee',
          },
        },
      };
    }

    if (this.type == 'break-not-ready-reason-codes') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_notready',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,

            languagecode: 'en'
          },
        },
      };
    }
    if (this.type == 'demandstock') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_stockdemandgeneration',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'adminConfig') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_adminconfig',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
          },
        },
      };
    }
    if (this.type == 'role') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_role',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'profile-type') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_role_subtype',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'holidays') {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_adm_holidays',
          parameters: {
            flag: 'GETALLHOLIDAYS',
            processid: this.userDetails.Processid,
            LanguageCode: this.language,
            ChannelId: this.channel,
          },
        },
      };
    }
    if (this.type == 'ProductCenter') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_product_center',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'hsn') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_hsn_gst_master',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'form') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_form_module',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
          },
        },
      };
    }





    if (this.type == 'batch') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_batch',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1
          },
        },
      };
    }
    if (this.type == 'country') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_countries',
          parameters: {
            flag: 'GET',
          },
        },
      };
    }
    if (this.type == 'state') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_state',
          parameters: {
            flag: 'GET',
          },
        },
      };
    }
    if (this.type == 'district') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_district',
          parameters: {
            flag: 'GET',
          },
        },
      };
    }
    if (this.type == 'error-message') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_error_message',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'label') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_form_validation',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.product,
            // productid: 11,
            language: this.selectedlanguage
          },
        },
      };
    }

    // if (this.type == 'label') {
    //     this.requestObj = {
    //         data: {
    //             spname: 'usp_unfyd_form_validation',
    //             parameters: {
    //                 flag: 'GET',
    //                 processid: this.userDetails.Processid,
    //                 // productid: this.product,
    //                 productid:1,
    //                 // language: this.selectedlanguage
    //             },
    //         },
    //     };
    // }
    if (this.type == 'email-notification-master') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_email_notification_master',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
          },
        },
      };
    }
    if (this.type == 'Privilege') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_access_controls',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,

          }
        }
      }
    }

    if (this.type == 'accounts') {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_hub_accounts',
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
          }
        }
      }
    }
    if (this.type == 'security-modules') {
      if (this.moduleName == 'BlockLocation') {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_block_location',
            parameters: {
              flag: 'GET',
              processid: this.userDetails.Processid,
              productid: this.securityproduct
            }
          }
        }
      }
      if ((this.moduleName == 'IPAddress')) {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_spam_control',
            parameters: {
              flag: 'GET_IP',
              processid: this.userDetails.Processid,
              productid: this.securityproduct,
              ruletype: this.ruleType
            }
          }
        }
      }
      if ((this.moduleName == 'Email')) {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_spam_control',
            parameters: {
              flag: 'GET',
              processid: this.userDetails.Processid,
              productid: this.securityproduct,
              ruletype: this.ruleType
            }
          }
        }
      }
      if ((this.moduleName == 'Domain')) {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_spam_control',
            parameters: {
              flag: 'GET_DOMAIN',
              processid: this.userDetails.Processid,
              productid: this.securityproduct,
              ruletype: this.ruleType
            }
          }
        }
      }
      if ((this.moduleName == 'BlackList')) {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_blacklist',
            parameters: {
              flag: 'GET',
              processid: this.userDetails.Processid,
              productid: this.securityproduct,
            }
          }
        }
      }

      if (this.moduleName == 'BlockIPAdd') {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_block_ipAddress',
            parameters: {
              flag: 'GET',
              processid: this.userDetails.Processid,
              productid: this.securityproduct
            }
          }
        }
      }
    }

    if (this.requestObj != undefined && this.requestObj.data.parameters.productid != '') {
      if (this.type == 'user-group') {
        var Obj1 = {
          data: {
            spname: "USP_UNFYD_TALK_AGENTROUTING",
            parameters: {
              ACTIONFLAG: 'GET_AGENT_NAME',
              ProcessId: this.userDetails.Processid,
            }
          }
        }
        this.api.post('index', Obj1).subscribe(res => {
          if (res.code == 200) {
            this.agents = res.results.data
          }
          else if (res.code == 401) {
            this.common.snackbar("Token Expired Please Logout", 'error');
          }
        },
          (error) => {

            if (error.code == 401) {
              this.common.snackbar("Token Expired Please Logout", 'error');
            }
          }
        )
        let endpoint: any
        if (this.type == 'user-group') {
          endpoint = 'index'
        }

        this.api.post(endpoint, this.requestObj).subscribe(res => {
          if (res.code == 200) {
            this.loader = false;
            this.tabValue = res.results.data;
            for (var key in this.tabValue[0]) {
              if (this.tabValue[0].hasOwnProperty(key)) {
                this.tabKey.push(key);
              }
            }
          }
          else if (res.code == 401) {
            this.common.snackbar("Token Expired Please Logout", 'error');
          }

        },
          (error) => {

            if (error.code == 401) {
              this.common.snackbar("Token Expired Please Logout", 'error');
            }
          }
        );

      }
      else {
        // let obj = this.type == 'scheduler'  ? this.requestObj1 : this.requestObj
        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            this.tabValue = []
            this.tabKey = []
            this.loader = false;
            if (this.type == 'users') {
              if (this.tab == 'GETALLUSERS' && this.resetBtnValue == ('resetPassword' || 'forceLogout' || 'forceUnlock' || 'activeusers')) {
                for (let data of res.results.data) {
                  var newObject = {
                    "Sr No": data['SrNo'],
                    "Actionable": data['Actionable'],
                    "Login Id": data['UserName'],
                    "First Name": data['FirstName'],
                    "Last Name": data['LastName'],
                    "Employee Id": data['EmployeeId'],
                    "Email Id": data['EmailId'],
                    "Skill": data['skill'],
                    "Role": data['Role'],
                    "Channel": this.htmlDecode(data['Channel']),
                    "Group": data['User Groups'],
                    "Language Code": data['Language Code'],
                    "Status": data['UserStatus'],
                    "Login Status": data['Login Status'],
                    "Account Status": data['Account Status'],
                    "Created By": data['Created By'],
                    "Created On": data['Created On'],
                    "Modified By": data['Modified By'],
                    "Modified On": data['Modified On'],
                  }
                  this.tabValue.push(newObject);
                }
              } else {
                for (let data of res.results.data) {
                  this.userResetButton = "";
                  var newObj = {
                    "Sr No": data['Sr No'],
                    "Actionable": data['Actionable'],
                    "First Name": data['First Name'],
                    "Last Name": data['Last Name'],
                    "Alias Name": data['Alias Name'],
                    "Username": data['Username'],
                    "Email Id": data['Email Id'],
                    "Contact Number": data['Contact Number'],
                    "Employee Id": data['Employee Id'],
                    "Language Code": data['Language Code'],
                    "Role": data['Role'],
                    "Channel": this.htmlDecode(data['Channel']),
                    "Group": this.tab == 'GETALLDISABLEUSERS' ? data['Group'] : data['User Groups'],
                    "Skill": data['Skill'],
                    "Time Zone": data['Time Zone'],
                    // "Start Time": data['Start Time'],
                    // "End Time": data['End Time'],
                    "Login Status": data['Login Status'],
                    "Account Status": data['Account Status'],
                    "Created By": data['Created By'],
                    "Created On": data['Created On'],
                    "Modified By": data['Modified By'],
                    "Modified On": data['Modified On'],
                  }
                  this.tabValue.push(newObj);
                }
              }
            } else {
              if (this.type == 'TaskGroup') {
                this.loader = true;
                if(res.results.data.length > 0){
                  res.results.data[0]['Sort Condition'] = res.results.data[0]['Sort Condition'] ? res.results.data[0]['Sort Condition'].split(',') : []
                  res.results.data[0]['User Group'] = res.results.data[0]['User Group'] ? res.results.data[0]['User Group'].split(',') : []
                  res.results.data[0]['Task Group Fields'] = res.results.data[0]['Task Group Fields'] ? JSON.parse(res.results.data[0]['Task Group Fields']) : []
                  res.results.data[0]['Filter Condition'] = res.results.data[0]['Filter Condition'] ? JSON.parse(res.results.data[0]['Filter Condition']) : { "condition": "and", "rules": [] }
                  res.results.data[0]['Rechurn Rule'] = res.results.data[0]['Rechurn Rule'] ? JSON.parse(res.results.data[0]['Rechurn Rule']) : []
                  // res.results.data[0].fieldMapping = res.results.data[0].fieldMapping ? JSON.parse(res.results.data[0].fieldMapping) : []
                  // res.results.data[0].apiConfig = res.results.data[0].apiConfig ? JSON.parse(res.results.data[0].apiConfig) : ''
                }
                this.tabValue = res.results.data;
                this.loader = false;
              } else {
                this.tabValue = res.results.data;
              }
              if (res.results.data.length > 0 && this.type == 'label' && (this.productName.toString() == '11' || this.productName.toString() == '6')) {
                this.common.setAllLabelToJsonInNode(res.results.data, this.product.toString(), this.selectedlanguage)
              }
            }

            for (var key in this.tabValue[0]) {
              if (this.tabValue[0].hasOwnProperty(key)) {
                this.tabKey.push(key);
              }
            }
          }
          else if (res.code == 401) {
            this.common.snackbar("Token Expired Please Logout", 'error');
          }
          else{
            this.tabValue = []
            this.tabKey = []
          }
        },
          (error) => {
            if (error.code == 401) {
              this.common.snackbar("Token Expired Please Logout", 'error');
            }
          }
        );
      }
    } else {
      this.loader = false;
      this.tabValue = [];
      this.tabKey = [];
    }
  }

  contactAction(id, type) {
    if (this.type == 'beneficiary') {
      if (type == 'View') {
        this.router.navigate(['/masters/' + this.type + '/details/personal/', id]);
      }
      if (type == 'EDIT') {
        this.router.navigate(['/masters/' + this.type + '/personal-details/', id]);
      }
      if (type == 'Payment') {
        this.router.navigate(['/masters/' + this.type + '/details/payment/', id]);
      }
    }
    if (this.type == 'TaskGroup') {
      if (type == 'Edit') {

        this.router.navigate(['/masters/task-group/update/', id]);
      }
    }
    if (this.type == 'finance') {
      this.router.navigate(['/masters/' + this.type + '/update/', id]);
    }
    if (this.type == 'damagedstock') {
      this.router.navigate(['/masters/' + this.type + '/update/', id]);
    }

    if (this.type == 'employee') {
      if (type == 'View') {
        this.router.navigate(['/masters/' + this.type + '/details/personal/', id]);
      }
      if (type == 'Edit') {
        this.router.navigate(['/masters/' + this.type + '/personal-details/', id]);
      }
      if (type == 'Payment') {
        this.router.navigate(['/masters/' + this.type + '/details/payment/', id]);
      }
    }
    if (this.type == 'product-group' && this.isDialog !== true) {
      if (type == 'Edit') {
        this.router.navigate(['/masters/' + this.type + '/update/' + this.tabs + "/", id]);
      }
    }
    if (this.type == 'holidays') {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'HolidaysAdd',
          Id: id
        },
        width: "900px",
        height: "88vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status == true) {
          this.getContacts();
        }
      });
    } if (this.type == 'security-modules' && this.moduleName == 'BlockLocation') {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'BlockLocation',
          moduleName: this.moduleName,
          Id: id
        },
        width: "600px",
        height: "60vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status == true) {
          this.getContacts();
        }
      });
    }

    if (this.type == 'security-modules' && this.moduleName == 'BlockIPAdd') {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'BlockIPAdd',
          moduleName: this.moduleName,
          Id: id
        },
        width: "600px",
        height: "60vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status == true) {
          this.getContacts();
        }
      });
    } if (this.type == 'security-modules' && (this.moduleName == 'Email' || this.moduleName == 'Domain' || this.moduleName == 'IPAddress')) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'SpamControl',
          moduleName: 'SpamControl',
          Id: id,
          ruleType: this.ruleType
        },
        width: "600px",
        height: "60vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status == true) {
          this.getContacts();
        }
      });
    } if (this.type == 'security-modules' && ((this.moduleName == 'BlackList'))) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'BlackList',
          moduleName: this.moduleName,
          Id: id,
        },
        width: "600px",
        height: "60vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status == true) {
          this.getContacts();
        }
      });
    } if ((this.type == 'product-group') && (this.isDialog == true)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'addPGcat',
          Id: id,
          isDialog: true,
          tabs: this.tabs
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status == true) {
          this.getContacts();
        }
      });
    }
    if ((this.type == 'contact-center-location') && (this.isDialog == true)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'CCLAdd',
          Id: id,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.feildChooser();
        this.getContacts();

        if (status == true) {
          this.getContacts();
          this.feildChooser();

        }
      });
    }
    if ((this.type == 'Privilege') && (this.isDialog == true)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'addPriv',
          PriId: id,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.feildChooser();
        this.getContacts()
        if (status == true) {
          this.getContacts();
        }
      });
    }
    if ((this.type == 'skills') && (this.isDialog == true)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'addSkill',
          Id: id,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.getContacts();
        this.feildChooser();
        if (status == true) {
          this.getContacts();
          this.feildChooser();

        }
      });
    }
    if ((this.type == 'user-group') && (this.isDialog == true)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'addUG',
          Id: id,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.getContacts();
        this.feildChooser();
        if (status == true) {
          this.getContacts();
        }
      });
    }
    if ((this.type == 'hierarchy') && (this.isDialog == true)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'addHY',
          Id: id,
          isDialog: true
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.getContacts();
        this.feildChooser();

        if (status == true) {
          this.getContacts();
        }
      });
    }
    if ((this.type == 'users') && (this.isDialog == true)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'addUsers',
          Id: id,
          isDialog: true,
          tabSelected: 'Personal Details'
        },
        width: "90%",
        height: "68vh",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        // this.getContacts();
        this.feildChooser()
        if (status == true) {
          this.getContacts();
        }
      });
    }
    if (this.type == 'label') {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'label',
          Id: id,
          product: this.product,
          selectedlanguage: this.selectedlanguage
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status == true) {
          this.getContacts();
        }
      });
    }
    if (
      (this.type == 'skills' && this.isDialog !== true) ||
      this.type == 'event' ||
      this.type == 'broadcast' ||
      (this.type == 'contact-center-location' && this.isDialog !== true) ||
      this.type == 'break-not-ready-reason-codes' ||
      (this.type == 'hierarchy' && this.isDialog !== true) ||
      this.type == 'tenant' ||
      this.type == 'customerproduct' ||
      this.type == 'course' ||
      this.type == 'product' ||
      this.type == 'training' ||
      this.type == 'fee' ||
      this.type == 'policeStation' ||
      this.type == 'hospital' ||
      this.type == 'trainingCenter' ||
      this.type == 'Union' ||
      this.type == 'vendor-product' ||
      this.type == 'vendor-service' ||
      this.type == 'inventory' ||
      this.type == 'stock' ||
      this.type == 'vendor' ||
      this.type == 'finance' ||
      this.type == 'damagedstock' ||
      this.type == 'VendorRefund' ||
      this.type == 'demandstock' ||
      this.type == 'role' ||
      this.type == 'profile-type' ||
      this.type == 'adminConfig' ||
      this.type == 'ProductCenter' ||
      this.type == 'hsn' ||
      this.type == 'form' ||
      this.type == 'country' ||
      this.type == 'district' ||
      this.type == 'state' ||
      this.type == 'batch' ||
      this.type == 'branding' ||
      this.type == 'error-message' ||
      // this.type == 'label' ||
      (this.type == 'user-group' && this.isDialog !== true) ||
      this.type == 'quicklinks' ||
      this.type == 'campaigns' ||
      this.type == 'hubModules' ||
      this.type == 'exceldownload' ||
      this.type == 'schedule' ||
      (this.type == 'Privilege' && this.isDialog !== true) ||
      this.type == 'accounts' ||
      this.type == 'ScorecardTemplate' ||
      this.type == 'contact' ||
      this.type == 'blockcontent' ||
      this.type == 'rm-mapping'
    ) {
      if (type == 'Edit') {
        this.router.navigate(['/masters/' + this.type + '/update/', id]);
      }
    }
    if (this.type == 'maskingrule') {
      if (type == 'Edit') {

        this.router.navigate(['/masters/' + 'masking-rule' + '/update/', id]);
      }
    }if (this.type == 'BusinessOrchestration') {
      if (type == 'Edit') {

        this.router.navigate(['/masters/' + 'business-orchestration' + '/update/',this.BOProductID, id]);
      }
    }
    if (this.type == 'users' && this.isDialog !== true) {
      if (type == 'Edit') {
        this.router.navigate(['/masters/' + this.type + '/personal-details/update/', id]);
      }
    }

    if (this.type == 'Privilege' && this.isDialog !== true) {
      if (type == 'Edit') {
        this.router.navigate(['/masters/Privilege/update/', id])
      }
    }
    if (this.type == 'sla') {
      if (type == 'Edit') {
        this.router.navigate(['/masters/sla/', this.slaproductID, id])
      }
    }
    if (this.type == 'scheduler') {
      if (type == 'Edit') {
        this.router.navigate(['/masters/scheduler/', this.schedulerproductID, id])
      }
    }
    if (this.type == 'schedule') {
      this.router.navigate(['/masters/schedules/update/', id])
    }

    // if(this.type == 'contact') {
    //     this.router.navigate(['/masters/contact/update/', id])
    // }

  }

  openDialogBulkDelete(type, id?) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(type), 'openDialogBulkDelete');

    let deleteCount = 0
    let endpoint: any
    if (this.type == 'user-group') {
      endpoint = 'index'
    }

    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status == true) {

        this.hasChecked.forEach(e => {
          if (this.type == 'user-group') {
            this.requestObj = {
              data: {
                spname: "group",
                parameters: {
                  flag: 'DELETE',
                  DELETEDBY: this.userDetails?.Id,
                  GROUPID: e
                }
              }
            }
          }
          else if (this.type == 'skills') {
            this.requestObj = {
              data: {
                spname: 'usp_unfyd_skillmaster',
                parameters: {
                  flag: 'DELETESKILL',
                  id: e,
                  deletedby: this.userDetails?.Id,
                },
              },
            };
          }


          if (this.type == 'user-group') {
            this.api.post(endpoint, this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  this.common.snackbar("Delete Record");
                  this.getContacts();
                  this.common.sendCERequest('UPDATEUSERGRP', this.userDetails.Processid)

                }
              }
            });
          }

          if (this.type == 'TaskGroup') {
            this.requestObj = {
              data: {
                spname: "usp_unfyd_task_group",
                parameters: {
                  flag: 'DELETE',
                  DELETEDBY: this.userDetails.EmployeeId,
                  id: e,

                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                if (res.results.data[0].result.includes("Data deleted successfully")) {
                  this.common.snackbar("Delete Record");
                }
                else if (res.results.data[0].result.includes("Task is mapped")) {
                  this.common.snackbar("TaskMapped")
                }
                this.getContacts();
              }
            });
          }
          if (this.type == 'product-group' && this.tabs == 'GET_PRODUCT_GROUP') {
            this.requestObj = {
              data: {
                spname: 'usp_unfyd_customer_product_grp',
                parameters: {
                  flag: 'DELETE_PRODUCT_GROUP',
                  DELETEDBY: this.userDetails.EmployeeId,
                  PRODUCTGRPID: id,

                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }

          if (this.type == 'product-group' && this.tabs == 'GET_CATEGORY') {

            this.requestObj = {
              data: {
                spname: 'usp_unfyd_customer_product_grp',
                parameters: {
                  flag: 'DELETE_CATEGORY',
                  DELETEDBY: this.userDetails.EmployeeId,
                  CATEGORYID: id

                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }

          if (this.type == 'product-group' && this.tabs == 'GET_SUB_CATEGORY') {
            this.requestObj = {
              data: {
                spname: 'usp_unfyd_customer_product_grp',
                parameters: {
                  flag: 'DELETE_SUB_CATEGORY',
                  DELETEDBY: this.userDetails.EmployeeId,
                  SUBCATEGORYID: id

                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }

          if (this.type == 'hubModules') {
            this.requestObj = {
              data: {
                spname: 'usp_unfyd_form_module',
                parameters: {
                  flag: 'DELETE',
                  Id: id,
                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
          if (this.type == 'BusinessOrchestration') {
            this.requestObj = {
              data: {
                spname: 'USP_UNFYD_BUSINESSORCHESTRATION',
                parameters: {
                  flag: 'DELETE',
                  Id: id,
                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
          if (this.type == 'holidays') {

            this.requestObj = {
              data: {
                spname: 'usp_unfyd_adm_holidays',
                parameters: {
                  flag: 'DELETEHOLIDAY',
                  Id: id,
                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
          if (this.moduleName == "BlockLocation") {

            this.requestObj = {
              data: {
                spname: 'usp_unfyd_block_location',
                parameters: {
                  flag: 'DELETE',
                  Id: id,
                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
          if (this.moduleName == "BlockIPAdd") {

            this.requestObj = {
              data: {
                spname: 'usp_unfyd_block_ipAddress',
                parameters: {
                  flag: 'DELETE',
                  Id: id,
                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          } if ((this.moduleName == 'Email' || this.moduleName == 'Domain' || this.moduleName == 'IPAddress')) {

            this.requestObj = {
              data: {
                spname: 'usp_unfyd_spam_control',
                parameters: {
                  flag: 'DELETE',
                  Id: id,
                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
          if ((this.moduleName == 'BlackList')) {
            this.requestObj = {
              data: {
                spname: 'usp_unfyd_blacklist',
                parameters: {
                  flag: 'DELETE',
                  Id: id,
                },
              },
            };
            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }

          else {

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                deleteCount++;
                if (deleteCount == this.hasChecked.length) {
                  if (res.results.data[0].result.includes("UserMapped")) {
                    this.common.snackbar("UserMapped")
                  } else {
                    this.common.snackbar("Delete Record");
                    this.getContacts();
                  }

                }
              }
            });
          }
        })




        if (status.status == true && type == 'delete') {
          if (this.type == 'quicklinks') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "USP_UNFYD_ADM_PUSHURLMASTER",
                parameters: {
                  flag: 'DELETEBULKURL',
                  DELETEDBY: this.userDetails?.Id,
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
                this.common.sendCERequest('UPDATEQUICKLINKS', this.userDetails.Processid)
              }
            });
          }
          else if (this.type == "schedule") {
            {
              var commaSeperatedString = this.hasChecked.toString();
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
        }
        else if (this.type == "task") {
          {
            var commaSeperatedString = this.hasChecked.toString();
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
          }

          this.api.post("index", this.requestObj).subscribe((res) => {
            if (res.code == 200) {
              this.common.snackbar("Delete Record");
              this.common.reloadDataMethod(true);
            }
          });
        }
        if (status.status == true && type == 'delete') {
          if (this.type == 'hierarchy') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_hierarchy",
                parameters: {
                  flag: 'BULK_DELETE',
                  DELETEDBY: this.userDetails?.Id,
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
        }
        if (status.status == true && type == 'delete') {
          if (this.type == 'break-not-ready-reason-codes') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_notready",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
                this.common.sendCERequest('UPDATENOTREADYREASONS', this.userDetails.Processid)
              }
            });
          }
        }


        if (status.status == true && type == 'delete') {
          if (this.type == 'scheduler') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_scheduler",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
                this.common.sendCERequest('UPDATENOTREADYREASONS', this.userDetails.Processid)
              }
            });
          }
        }



        if (status.status == true && type == 'delete') {
          if (this.type == 'rm-mapping') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "UNFYD_ADM_RM_BASED_ROUTING_V1",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
                this.common.sendCERequest('UPDATENOTREADYREASONS', this.userDetails.Processid)
              }
            });
          }
        }

        if (status.status == true && type == 'delete') {
          if (this.type == 'contact') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_contact_personal",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
                this.common.sendCERequest('UPDATENOTREADYREASONS', this.userDetails.Processid)
              }
            });
          }
        }

        // if (status.status == true && type == 'delete') {
        //     if (this.type == 'contact') {
        //         var commaSeperatedString = this.hasChecked.toString();
        //         this.requestObj = {
        //             data: {
        //                 spname: "usp_unfyd_contact_personal",
        //                 parameters: {
        //                     flag: 'BULK_DELETE',
        //                     multiid: commaSeperatedString
        //                 }
        //             }
        //         }

        //         this.api.post('index', this.requestObj).subscribe((res) => {
        //             if (res.code == 200) {
        //                 this.common.snackbar("Delete Record");
        //                 this.getContacts();
        //                 this.common.sendCERequest('UPDATENOTREADYREASONS', this.userDetails.Processid)
        //             }
        //         });
        //     }
        // }


        if (status.status == true && type == 'delete') {
          if (this.type == 'scheduler') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_scheduler",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
                this.common.sendCERequest('UPDATENOTREADYREASONS', this.userDetails.Processid)
              }
            });
          }
        }

        if (status.status == true && type == 'delete') {
          if (this.type == 'contact-center-location') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_cc_location",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
        }


        if (status.status == true && type == 'delete') {
          if (this.type == 'blockcontent') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_block_content",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
        }

        if (status.status == true && type == 'delete') {
          if (this.type == 'customerproduct') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_customer_products",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
        }

        if (status.status == true && type == 'delete') {
          if (this.type == 'Privilege') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_access_controls",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
        }

        if (status.status == true && type == 'delete') {
          if (this.type == 'tenant') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_tenant",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString
                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
        }

        if (status.status == true && type == 'delete') {
          if (this.type == 'sla') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_sla",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString,
                  DELETEDBY: this.userDetails?.Id
                }
              }
            }
          }
        }

        if (status.status == true && type == 'delete' && (this.type == 'sla')) {
          this.api.post('index', this.requestObj).subscribe((res) => {
            if (res.code == 200) {
              this.common.snackbar("Delete Record");
              this.getContacts();
            }
          });
        }

        if (status.status == true && type == 'delete') {
          if (this.type == 'ScorecardTemplate') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_scor_template",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString,
                  DELETEDBY: this.userDetails?.Id
                }
              }
            }
          }
        }

        if (status.status == true && type == 'delete' && (this.type == 'ScorecardTemplate')) {
          this.api.post('index', this.requestObj).subscribe((res) => {
            if (res.code == 200) {
              this.common.snackbar("Delete Record");
              this.getContacts();
            }
          });
        }


        if (status.status == true && type == 'delete') {
          if (this.type == 'maskingrule') {
            var commaSeperatedString = this.hasChecked.toString();
            this.requestObj = {
              data: {
                spname: "usp_unfyd_masking_rule",
                parameters: {
                  flag: 'BULK_DELETE',
                  multiid: commaSeperatedString,
                  // modifiedby: this.userDetails.Id,
                  DELETEDBY: this.userDetails?.Id

                }
              }
            }

            this.api.post('index', this.requestObj).subscribe((res) => {
              if (res.code == 200) {
                this.common.snackbar("Delete Record");
                this.getContacts();
              }
            });
          }
        }



      }
      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))


  }


  openDialog(type, id) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(type), 'openDialog');


    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {

      if (status.status == true && type == 'delete') {
        if (this.type == 'beneficiary') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_haw_personal',
              parameters: {
                flag: 'Delete',
                hawkerid: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }

        if (this.type == 'event') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_event_master',
              parameters: {
                flag: 'Delete',
                id: id,
                deletedby: this.userDetails?.Id,
              },
            },
          };
        }

        if (this.type == 'maskingrule') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_masking_rule',
              parameters: {
                flag: 'Delete',
                id: id,
                deletedby: this.userDetails?.Id,
              },
            },
          };
        }

        if (this.type == 'blockcontent') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_block_content',
              parameters: {
                flag: 'Delete',
                id: id,
                deletedby: this.userDetails?.Id,
              },
            },
          };
        }

        if (this.type == 'task') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_tasks',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails?.Id,
              },
            },
          };
        }


        if (this.type == 'rm-mapping') {
          this.requestObj = {
            data: {
              spname: 'UNFYD_ADM_RM_BASED_ROUTING_V1',
              parameters: {
                flag: 'DELETE_RM',
                id: id,
                deletedby: this.userDetails?.Id,
              },
            },
          };
        }

        if (this.type == 'BusinessOrchestration') {
          this.requestObj = {
            data: {
              spname: 'USP_UNFYD_BUSINESSORCHESTRATION',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails?.Id,


              }
            }
          }
        }

        if (this.type == 'hubModules') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_form_module',
              parameters: {
                flag: 'DELETE',
                Id: id,
              },
            },
          };
        }
        if (this.type == 'Privilege') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_access_controls',
              parameters: {
                flag: 'DELETE',
                Id: id,
                DELETEDBY: this.userDetails.Id,
              },
            },
          };
        }



        if (this.type == 'break-not-ready-reason-codes') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_notready',
              parameters: {
                flag: 'DELETE',
                id: id,

              },
            },
          };
        }

        if (this.type == 'tenant') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_tenant',
              parameters: {
                flag: 'DELETE',
                PROCESSID: id,

              },
            },
          };
        }
        if (this.type == 'skills') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_skillmaster',
              parameters: {
                flag: 'DELETESKILL',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'scheduler') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_scheduler',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }


        if (this.type == 'contact') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_contact_personal',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }


        if (this.type == 'event') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_event_master',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.Id,
              },
            },
          };
        }
        if (this.type == 'accounts') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_hub_accounts',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.Id,
              },
            },
          };
        }
        if (this.type == 'quicklinks') {
          this.requestObj = {
            data: {
              spname: 'USP_UNFYD_ADM_PUSHURLMASTER',
              parameters: {
                flag: 'DELETEPUSHURL',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'schedule') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_schedule',
              parameters: {
                processid: this.userDetails.Processid,
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'contact-center-location') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_cc_location',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }

        if (this.type == 'customerproduct') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_customer_products',
              parameters: {
                flag: 'delete',
                DELETEDBY: this.userDetails.EmployeeId,
                id: id,

              },
            },
          };
        }

        if (this.type == 'hierarchy') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_hierarchy',
              parameters: {
                flag: 'delete',
                id: id,

              },
            },
          };
        }

        if (this.type == 'campaigns') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_campaigns',
              parameters: {
                flag: 'delete',
                id: id,

              },
            },
          };
        }
        if (this.type == 'course') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_haw_course',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'product') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_client_products',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'training') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_haw_training',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'fee') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_haw_fee',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'policeStation') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_police_stn',
              parameters: {
                flag: 'DELETE',
                Id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'trainingCenter') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_training_center',
              parameters: {
                flag: 'DELETE',
                Id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'Union') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_union',
              parameters: {
                flag: 'DELETE',
                Id: id,
                deletedby: this.userDetails.EmployeeId,
              },
            },
          };
        }

        if (this.type == 'branding') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_branding',
              parameters: {
                flag: 'DELETE',
                Id: id,
                DELETEDBY: this.userDetails.Id,
              },
            },
          };
        }


        if (this.type == 'users') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_adm_users',
              parameters: {
                flag: 'DELETEUSER',
                deletedby: this.userDetails.EmployeeId,
                modifiedby: this.userDetails.EmployeeId,
                agentid: id,
              },
            },
          };
        }

        if (this.type == 'role') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_role',
              parameters: {
                flag: 'DELETE',
                Id: id,
                DELETEDBY: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'profile-type') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_role_subtype',
              parameters: {
                flag: 'DELETE',
                Id: id,
                DELETEDBY: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'adminConfig') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_adminconfig',
              parameters: {
                flag: 'DELETE',
                modifiedby: this.userDetails.EmployeeId,
                Id: id,
                DELETEDBY: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'ProductCenter') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_product_center',
              parameters: {
                flag: 'DELETE',
                modifiedby: this.userDetails.EmployeeId,
                Id: id,
                DELETEDBY: this.userDetails.EmployeeId,
              },
            },
          };
        }
        if (this.type == 'hsn') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_hsn_gst_master',
              parameters: {
                flag: 'DELETE',
                modifiedby: this.userDetails.EmployeeId,
                Id: id,
                DELETEDBY: this.userDetails.EmployeeId,
              },
            },
          };
        }

        if (this.type == 'form') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_form_module',
              parameters: {
                flag: 'DELETE',
                Id: id,
                DELETEDBY: this.userDetails.EmployeeId,
              },
            },
          };
        }



        if (this.type == 'country') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_countries',
              parameters: {
                flag: 'DELETE',
                COUNTRYID: id
              },
            },
          };
        }
        if (this.type == 'state') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_countries',
              parameters: {
                flag: 'DELETE',
                stateid: id
              },
            },
          };
        }
        if (this.type == 'district') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_district',
              parameters: {
                flag: 'DELETE',
                districtid: id
              },
            },
          };
        }
        if (this.type == 'batch') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_batch',
              parameters: {
                flag: 'DELETE',
                Id: id,
                DELETEDBY: this.userDetails.Id,
              },
            },
          };
        }
        if (this.type == 'holidays') {

          this.requestObj = {
            data: {
              spname: 'usp_unfyd_adm_holidays',
              parameters: {
                flag: 'DELETEHOLIDAY',
                Id: id,
              },
            },
          };
        }
        if (this.moduleName == "BlockLocation") {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_block_location',
              parameters: {
                flag: 'DELETE',
                Id: id,
              },
            },
          };
        }
        if (this.moduleName == "BlockIPAdd") {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_block_ipAddress',
              parameters: {
                flag: 'DELETE',
                Id: id,
              },
            },
          };
        } if ((this.moduleName == 'Email' || this.moduleName == 'Domain' || this.moduleName == 'IPAddress')) {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_spam_control',
              parameters: {
                flag: 'DELETE',
                Id: id,
              },
            },
          };
        } if ((this.moduleName == 'BlackList')) {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_blacklist',
              parameters: {
                flag: 'DELETE',
                Id: id,
              },
            },
          };
        }
        if (this.type == 'label') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_form_validation',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.Id,
              },
            },
          };
        }
        if (this.type == 'error-message') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_error_message',
              parameters: {
                flag: 'GET',
                Id: id,
                DELETEDBY: this.userDetails.Id,
              },
            },
          };
        }
        if (this.type == 'business-units') {
          this.requestObj = {
            data: {
              spname: "UNFYD_ADM_BUSINESS_UNIT",
              parameters: {
                flag: "BIND_ACTIVEBU_DETAILS"
              }
            }
          }
        }
        if (this.type == 'user-group') {
          this.requestObj = {
            data: {
              spname: "group",
              parameters: {
                flag: 'DELETE',
                DELETEDBY: this.userDetails.Id,
                GROUPID: id
              }
            }
          }
        }
        if (this.type == 'email-notification-master') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_email_notification_master',
              parameters: {
                flag: 'DELETE',
                id: id,
                deletedby: this.userDetails.Id,
              },
            },
          };
        }
        if (this.type == 'product-group' && this.tabs == 'GET_PRODUCT_GROUP') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_customer_product_grp',
              parameters: {
                flag: 'DELETE_PRODUCT_GROUP',
                DELETEDBY: this.userDetails.EmployeeId,
                PRODUCTGRPID: id,

              },
            },
          };
        }
        if (this.type == 'product-group' && this.tabs == 'GET_CATEGORY') {

          this.requestObj = {
            data: {
              spname: 'usp_unfyd_customer_product_grp',
              parameters: {
                flag: 'DELETE_CATEGORY',
                DELETEDBY: this.userDetails.EmployeeId,
                CATEGORYID: id

              },
            },
          };
        }
        if (this.type == 'product-group' && this.tabs == 'GET_SUB_CATEGORY') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_customer_product_grp',
              parameters: {
                flag: 'DELETE_SUB_CATEGORY',
                DELETEDBY: this.userDetails.EmployeeId,
                SUBCATEGORYID: id

              },
            },
          };
        }
        if (this.type == 'ScorecardTemplate') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_scor_template',
              parameters: {
                flag: 'Delete',
                id: id,
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
                id: id,
                deletedby: this.userDetails?.Id,
              },
            },
          };
        }
        if (this.type == 'sla') {
          this.requestObj = {
            data: {
              spname: 'usp_unfyd_sla',
              parameters: {
                flag: 'DELETE',
                DELETEDBY: this.userDetails.Id,
                Id: id
              },
            },
          };
        }
        let endpoint: any
        if (this.type == 'user-group') {
          endpoint = 'index'
        }
        if (this.type == 'user-group') {
          this.api.post(endpoint, this.requestObj).subscribe((res) => {
            if (res.code == 200) {
              if (res.results.data[0].result.includes("Data deleted successfully")) {
                this.common.snackbar("Delete Record");
              }
              else if (res.results.data[0].result.includes("UserMapped")) {
                this.common.snackbar("UserMapped")
              }
              this.getContacts();
            }

          });
        } if (this.type == 'TaskGroup') {
          this.api.post('index', this.requestObj).subscribe((res) => {
            if (res.code == 200) {
              if (res.results.data[0].result.includes("Data deleted successfully")) {
                this.common.snackbar("Delete Record");
              }
              else if (res.results.data[0].result.includes("Task is mapped")) {
                this.common.snackbar("TaskMapped")
              }
              this.getContacts();
            }

          });
        } else {
          if(this.type == "users" && this.UserProfile.Id == id){
            this.common.snackbar("CannotDeleteOwnUser")
                return
          }
          else{
          this.api.post('index', this.requestObj).subscribe((res) => {
            if (res.code == 200) {
              if (this.type == 'product-group' && this.tabs == 'GET_PRODUCT_GROUP') {
                if (res.results.data[0].result.includes("mapped to category")) {
                  this.common.snackbar("Category")
                }
                else {
                  this.common.snackbar("Delete Record");
                }
              }
              else if (this.type == 'product-group' && this.tabs == 'GET_CATEGORY') {
                if (res.results.data[0].result.includes("mapped to SubCategory")) {
                  this.common.snackbar("SubCategory")
                }
                else {
                  this.common.snackbar("Delete Record");
                }
              }

              else if (res.results.data[0].result.includes("UserMapped")) {
                this.common.snackbar("UserMapped")
              }
              else {
                this.common.snackbar("Delete Record");
              }
              this.getContacts();
              if (this.type == 'tenant') {
                this.common.sendCERequest('UPDATETENANT', this.userDetails.Processid)
              }
              if (this.type == 'user-group') {
                this.common.sendCERequest('UPDATEUSERGRP', this.userDetails.Processid)
              }
              if (this.type == 'quicklinks') {
                this.common.sendCERequest('UPDATEQUICKLINKS', this.userDetails.Processid)
              }
              if (this.type == 'users') {
                this.common.sendCERequest('UpdateAgentMappingMaster', this.userDetails.Processid)
              }
              if (this.type == 'BusinessOrchestration') {
                this.common.sendCERequest('UPDATERULES', this.userDetails.Processid)
              }
              if (this.type == 'break-not-ready-reason-code') (
                this.common.sendCERequest('UPDATENOTREADYREASONS', this.userDetails.Processid)
              )
            }
          });
        }

      }
    }

      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });

    }
    ))
  }


  tabchange = 'GETALLUSERS'
  onTabChange(event) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event), 'onTabChange');

    this.tab = event;
    this.getContacts()
    this.tabchange = event
  }

  tabchange1 = 'GET_PRODUCT_GROUP'
  onTabChange1(event) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event), 'onTabChange1');

    this.tabs = event;
    this.getContacts();
    this.tabchange1 = event
  }

  getFilter() {
    this.common.hubControlEvent('Masters', 'click', '', '', '', 'getFilter');

    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data;
    });

    this.common.getSearch$.subscribe(data => {
      this.search = data;
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.getContacts();
      }
    });
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
    });
  }


  bulkId: string[] = [];

  maxNo = false;
  amt = 0;

  onCheckboxChecked(event: boolean, element) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event, element), 'onCheckboxChecked');

    if (event) {
      this.amt++
      this.bulkId.push(element);
    } else {
      let index = this.bulkId.indexOf(element);
      if (index > -1) {
        this.bulkId.splice(index, 1);
      }
      this.amt--
    }
    this.bulkId.length === 10 ? this.maxNo = true : this.maxNo = false

  }

  hasChecked: any = []
  allSelected: boolean = false
  bulkCheckboxCheck(event, element) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event, element), 'bulkCheckboxCheck');

    let startingOfArray = this.page * this.itemsPerPage - this.itemsPerPage
    let endingOfArray: any;
    if (this.itemsPerPage * this.page > this.tabValue.length) {
      endingOfArray = this.tabValue.length
    } else {
      endingOfArray = this.page * this.itemsPerPage
    }
    for (let i = startingOfArray; i < endingOfArray; i++) {
      if (event) {
        if (this.tabValue[i] != undefined)
          this.tabValue[i].CHECKBOX = true
        this.allSelected = true;
      } else if (!event) {
        if (this.tabValue[i] != undefined)
          this.tabValue[i].CHECKBOX = false
        this.allSelected = false
      }
    }
    this.checkChecks();
  }


  singleCheckboxCheck(event, element) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event, element), 'singleCheckboxCheck');

    if (event) {
      element.CHECKBOX = true
    } else if (!event) {
      element.CHECKBOX = false
    }
    this.checkChecks()
  }

  checkChecks() {
    this.common.hubControlEvent('Masters', 'click', '', '', '', 'checkChecks');

    this.hasChecked = []
    let startingOfArray = this.page * this.itemsPerPage - this.itemsPerPage
    let endingOfArray: any;
    if (this.itemsPerPage * this.page > this.tabValue.length) {
      endingOfArray = this.tabValue.length
    } else {
      endingOfArray = this.page * this.itemsPerPage
    }
    for (let i = startingOfArray; i < endingOfArray; i++) {
      if (this.tabValue[i]?.CHECKBOX) {
        if (this.type == 'hub-admin-access-controller' || this.type == 'TaskGroup' || this.type == 'event' || this.type == 'Privilege' || this.type == 'accounts' || this.type == 'user-group' || this.type == 'broadcast' || this.type == 'quicklinks' || this.type == 'hierarchy' || this.type == 'break-not-ready-reason-codes'
          || this.type == 'contact-center-location' || this.type == 'tenant' || this.type == '  Orchestration' || this.type == 'hubModules' || this.type == 'customerproduct' || this.type == 'maskingrule') {
          this.hasChecked.push(this.tabValue[i].Actionable)
        } else if (this.tab == 'GETALLUSERS') {
          this.hasChecked.push(this.tabValue[i].Actionable)
        } else if (this.tab == 'GETALLDISABLEUSERS') {
          this.hasChecked.push(this.tabValue[i].Actionable)
        } else {
          this.hasChecked.push(this.tabValue[i].Id)
        }
      }
    }
    if (this.hasChecked.length == (endingOfArray - startingOfArray)) {
      this.allSelected = true
    } else {
      this.allSelected = false
    }

  }
  getCountries(event, type) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event, type), 'getCountries');

    this.countrylist = [];
    this.common.getLocation(event, type).subscribe(res => {
      this.countrylist = res;
    })
  }

  getStates(event) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event), 'getStates');

    this.common.getLocation(event, 'State').subscribe(res => {
      this.statelist = res;
      this.filteredstates = res;
    });
  }


  getCountry(event) {
    if (this.type != 'district') {
      this.loader = true;
      this.tabValue = [];
      this.tabKey = [];
      let obj = {
        data: {
          spname: 'usp_unfyd_state',
          parameters: {
            flag: 'GET',
            countryid: event
          },
        },
      };
      this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event), 'getCountry');

      this.api.post('index', obj).subscribe(res => {
        if (res.code == 200) {

          this.loader = false;

          this.tabValue = res.results.data;

          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
          }
        }
      });
    } else if (this.type == 'district') {
      this.common.getLocation(event, 'State').subscribe(res => {
        this.statelist = res;
        this.filteredstates = res;
      });
    }



  }

  getDistrict(event) {

    this.loader = true;
    this.tabValue = [];
    this.tabKey = [];
    let obj = {
      data: {
        spname: 'usp_unfyd_district',
        parameters: {
          flag: 'GET',
          stateid: event
        },
      },
    };
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event), 'getDistrict');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {

        this.loader = false;

        this.tabValue = res.results.data;

        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
      }
    });



  }


  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];

  feildChooser() {
    this.selctedField = [];
    this.unSelctedField = [];
    this.finalField = [];
    let data = JSON.parse(JSON.stringify(this.tabValue))
    this.tabValue = []
    setTimeout(() => {
      this.tabValue = JSON.parse(JSON.stringify(data))
    });
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
    this.common.hubControlEvent('Masters', 'click', '', '', '', 'feildChooser');

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

        if (this.isDialog == true && this.type == 'users')
          this.common.userMasterData.next(this.finalField)





      }
    },
      (error) => {
      })
  }

  //filter TS file Feildchooser

  // feildChooser() {
  //     this.selctedField = [];
  //         this.unSelctedField= [];
  //         this.finalField= [];
  //         let data = JSON.parse(JSON.stringify(this.tabValue))
  //         this.tabValue = []
  //         setTimeout(() => {
  //             this.tabValue = JSON.parse(JSON.stringify(data))
  //         });
  //     var obj = {
  //       data: {
  //         spname: "usp_unfyd_user_field_chooser",
  //         parameters: {
  //           flag: "GET",
  //           processid: this.userDetails.Processid,
  //           productid: 1,
  //           userid: this.userDetails.Id,
  //           modulename: (this.component == "" || !this.component) ? this.type == 'contact-center-location' ? 'ContactCenterLocation'
  //                         : this.type == 'break-not-ready-reason-codes' ? 'BreakNotReadyReasonCodes'
  //                         : (this.type == 'product-group' && this.ProductGroupTab == 'GET_PRODUCT_GROUP') ? 'ProductGroup'
  //                         : (this.type == 'product-group' && this.ProductGroupTab == 'GET_CATEGORY') ? 'ProductCategory'
  //                         : (this.type == 'product-group' && this.ProductGroupTab == 'GET_SUB_CATEGORY') ? 'ProductSubCategory'
  //                         : this.type == 'break-not-ready-reason-codes' ? 'BreakNotReadyReasonCodes'
  //                         : this.type : this.component,
  //           language: localStorage.getItem("lang"),
  //         },
  //       },
  //     };

  //     this.common.hubControlEvent(this.type, 'click', '', '', '', 'feildChooser');

  //     this.api.post("index", obj).subscribe(
  //       (res) => {
  //         if (res.code == 200) {
  //           if (res.results.data.length == 0) {
  //             this.selctedField = this.tabKey;
  //           } else {
  //             this.selctedField = res.results.data[0].FieldChooser.split(",");
  //           }
  //           this.unSelctedField = this.tabKey.filter(
  //             (field) => !this.selctedField.includes(field)
  //           );



  //           if (res.results.data.length == 0) {



  //             var unselectedfield

  //             if (this.type == "PrivilegeViewTable") {
  //               unselectedfield = ['ControlName', 'Description', 'Created By', 'Created On', 'Modified By', 'Modified On', 'Deleted On', 'Deleted By', 'Status', 'CreatedBy', 'CreatedOn', 'ModifiedBy', 'ModifiedOn', 'Icon']
  //             }
  //             else {
  //               unselectedfield = ['Created By', 'Created On', 'Modified By', 'Modified On', 'Deleted On', 'Deleted By', 'Status', 'CreatedBy', 'CreatedOn', 'ModifiedBy', 'ModifiedOn', 'Icon']
  //             }


  //             this.selctedField = this.tabKey.filter(
  //               (field) => !unselectedfield.includes(field)
  //             );

  //             this.unSelctedField = this.tabKey.filter(
  //               (field) => unselectedfield.includes(field)
  //             );
  //           }

  //           var selctedField = [];
  //           for (let i = 0; i < this.selctedField.length; i++) {
  //             selctedField.push({ value: this.selctedField[i], checked: true });
  //           }
  //           var unSelctedField = [];
  //           for (let i = 0; i < this.unSelctedField.length; i++) {
  //             unSelctedField.push({
  //               value: this.unSelctedField[i],
  //               checked: false,
  //             });
  //           }
  //           this.finalField = [...selctedField, ...unSelctedField];
  //           this.finalField = this.finalField.filter(
  //             (data) => data.value != "" && data.value != "CHECKBOX"
  //           );
  //           this.common.setTableKey(this.finalField);
  //         } else {
  //         }
  //       },
  //       (error) => {
  //       }
  //     );
  //   }

  generateIdCard(hawkerId, registrationNo) {
    let obj = {
      data: {
        spname: "usp_unfyd_haw_personal",
        parameters: {
          flag: "UPDATE_REGISTRATION_NO",
          hawkerid: hawkerId,
          RegistrationNo: registrationNo
        }
      }
    }
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(hawkerId, registrationNo), 'generateIdCard');

    this.api.post('index', obj).subscribe(res => {

      if (res.code == 200) {
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            type: 'QRcode',
            data: res.results.data[0],
          },
          width: 'auto'
        });
        dialogRef.afterClosed().subscribe(status => {
        });
      }
    })

  }

  htmlDecode(data) {

    data = data.replace(/\&amp;/g, '&');
    data = data.replace(/\&gt;/g, '>');
    data = data.replace(/\&lt;/g, '<');
    data = data.replace(/\&quot;/g, '');
    data = data.replace(/\&apos;/g, '');
    return data;
  }

  view(type, data) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(data), 'view');

    if (this.type == 'maskingrule') {
      let formVal = {
        ruleName: data['Rule Name'],
        description: data.Description,
        regex: data.Regex,
        maskChar: data['Mask Char'],
        status: data.Status,
        startIndex: data['Start Index'],
        endIndex: data['End Index']
      }
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'previewMasking',
          value: formVal
        },
        width: '500px',
      });
      dialogRef.afterClosed().subscribe(status => { })
    }
  }

  userActionable(id, action) {
    if (!this.hasChecked) {
      this.common.snackbar("General Error");
      return;
    }
    var userdata;
    if (this.type == 'users' && this.tab == "GETALLUSERS" && action == 'resetPassword') {
      userdata = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            FLAG: 'RESETPASSWORD_BULK_USER',
            ProcessId: this.userDetails.Processid,
            multiid: id,
          }
        }
      }
    }

    if (this.type == 'users' && this.tab == "GETALLUSERS" && action == 'forceLogout') {
      userdata = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            FLAG: 'RESETLOGIN_BULK_USER',
            ProcessId: this.userDetails.Processid,
            multiid: id,
          }
        }
      }
    }

    if (this.type == 'users' && this.tab == "GETALLUSERS" && action == 'forceUnlock') {
      userdata = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            FLAG: 'RESETLOCKUSER_BULK_USER',
            ProcessId: this.userDetails.Processid,
            multiid: id,
          }
        }
      }
    }


    if (this.type == 'users' && this.tab == "GETALLUSERS" && action == 'activeusers') {
      userdata = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            FLAG: 'GETALLUSERS',
            ProcessId: this.userDetails.Processid,
            multiid: id,
          }
        }
      }
    }

    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(id, action), 'userActionable');

    this.api.post('index', userdata).subscribe(res => {
      if (res.code == 200) {
        this.common.snackbar(res.results.data[0].result, 'success');
        this.tab = 'GETALLUSERS';
        this.getContacts();
        if (this.type == 'users' && this.tab == "GETALLUSERS" && action == 'resetPassword') {
          this.common.sendCERequest('UpdateAgentMappingMaster', this.userDetails.Processid)
        }
        if (this.type == 'users' && this.tab == "GETALLUSERS" && action == 'forceLogout') {
          var obj = {
            EVENT: "EventAgentForceLoggedOut",
            AGENTID: id,
            ADMINID: this.userDetails.Id,
            REASON: "Force Logout By Admin",
            TENANTID: this.userDetails.Processid,
            SOURCE: "ADMIN"
          }
          this.common.sendCERequestObj('UpdateAgentMappingMaster', this.userDetails.Processid, obj)

        }
        if (this.type == 'users' && this.tab == "GETALLUSERS" && action == 'forceUnlock') {
          this.common.sendCERequest('UpdateAgentMappingMaster', this.userDetails.Processid)
        }
      } else {
        this.common.snackbar("Select a function First");
      }
    },
      (error) => {
        this.common.snackbar("Select a function First");
      }
    )
  }

  activateUser(id) {
    if (!this.hasChecked) {
      this.common.snackbar("General Error");
      return;
    }
    var userdata;
    userdata = {
      data: {
        spname: "usp_unfyd_adm_users",
        parameters: {
          FLAG: 'ACTIVATEDELETEUSER',
          id: id,
        }
      }
    }
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(id), 'activateUser');

    this.api.post('index', userdata).subscribe(res => {
      if (res.code == 200) {
        this.common.snackbar(res.results.data[0].result, 'success');
        this.getContacts();
      } else {
        this.common.snackbar("Select a function First");
      }
    },
      (error) => {
        this.common.snackbar("Select a function First");
      }
    )
  }

  flip(id, event) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(id, event), 'flip');

    if (event.checked == false) {
      this.userActionable(id, 'forceLogout');
    }
  }
  flip1(id, event) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(id, event), 'flip1');

    if (event == true) {
      this.userActionable(id, 'forceUnlock')
    }
  }

  selectedProduct(event) {
    this.common.labelView.next({ product: this.productName, language: this.selectedlanguage })
    this.productName = event;

    if (this.type == 'approvals') {
      this.getModulesForApprovalsProductWise()
    } else if (this.type == 'label') {
      if (this.selectedlanguage !== undefined && this.selectedlanguage !== null) {
        this.getContacts();
      }
    } else {
      this.getContacts();
    }
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data
    });
  }

  productChanged() {
    if (this.type == 'approvals') {
      this.getModulesForApprovalsProductWise()
    } else if (this.type == 'sla') {
      this.getContacts()
    }
    else if (this.type == 'scheduler') {
      this.getContacts()
    } else if (this.type == 'BusinessOrchestration') {
      this.getContacts()
    }
  }

  getModulesForApprovalsProductWise(moduleName?) {
    this.approvalModules = []
    this.selectedApprovalModules = ''
    this.finalField = []
    this.tabKey = []
    this.tabValue = []
    let obj = {
      data: {
        spname: "usp_unfyd_approvals",
        parameters: {
          flag: 'GET_MODULE',
          processid: this.userDetails.Processid,
          productid: this.productID
        }
      }
    }

    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        this.loader = false
        if (res.results.data.length > 0) {
          this.approvalModules = res.results.data;
          if (moduleName) {
            this.selectedApprovalModules = moduleName
            this.getContacts()
          }
        }
        //  else {
        //   this.common.snackbar('General Error')
        // }
      } else {
        this.loader = false
        this.common.snackbar('General Error')
      }
    }, error => {
      this.loader = false
      this.common.snackbar('General Error')
    })
  }

  goToApprovalWithId(val) {
    if (this.type == 'approvals' && val?.Status == 'Pending') {
      this.router.navigate(['masters/approvals/' + this.productID + '/' + this.selectedApprovalModules, val?.Id]);
    } else if (this.type == 'TaskGroup') {
      this.router.navigate(['masters/task-group/view/' + val.Actionable]);
    } else if (this.type == 'task') {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'createTaskManually',
          taskGroupInfo: this.taskGroupInfo,
          taskGroupId: this.taskGroupId,
          purpose: 'view',
          value: val
        },
        width: "100%",
        maxHeight: '85vh',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.feildChooser()
        console.log(status);
        if (status) {
          this.getContacts()
        }
      })
    }
  }

  setLanguage(event) {
    this.selectedlanguage = event;
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data
    });
  }

  getLanguage() {
    this.Obj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }

    this.api.post('index', this.Obj).subscribe((res: any) => {
      this.languageData = res.results['data'];
    });
  }





  count = true
  sortUsers(by: string, order: string): void {
    if (by == 'Actionable') return
    if (by == 'Sr No') return
    if (by == 'Sr No.') return
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
    if (by == 'Level' || by == "Start Index" || by == "End Index" || by == "No of Channels" || by == "No of Products" || by == "User License count") {
      let x = this.tabValue.filter(n => n[by])
      let k = this.tabValue.filter(n => n[by] == null)
      let s = this.tabValue.filter(n => n[by] == '')
      let y = x.sort((a, b) => parseInt(a[by]) - parseInt(b[by]));
      this.tabValue = [...y, ...k, ...s]
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
      return
    }
    if (by == 'Holiday') {
      this.tabValue.sort((a, b) => {
        const dateA = new Date(a[by]);
        const dateB = new Date(b[by]);
        return dateA.getTime() - dateB.getTime();
      });
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
      return
    }

    if (by == 'Created On' || by == 'Modified On' || by == 'Launch Date' || by == 'Expiry Date' || by == 'Start Date' || by == 'Renewal Date') {
      let x = this.tabValue.filter(n => n[by])
      let k = this.tabValue.filter(n => n[by] == null)
      let s = this.tabValue.filter(n => n[by] == '')
      let y = x.sort((a, b) => {
        const dateA = moment(a[by], this.format);
        const dateB = moment(b[by], this.format);
        return dateA.valueOf() - dateB.valueOf();
      });
      this.tabValue = [...y, ...k, ...s]
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
      return
    }
    if (by == 'Message') {
      let x = this.tabValue.filter(n => n[by])
      let k = this.tabValue.filter(n => n[by] == null)
      let s = this.tabValue.filter(n => n[by] == '')
      let y = x.sort((a, b) => this.convertToPlain(a[by]).localeCompare(this.convertToPlain(b[by])))
      this.tabValue = [...y, ...k, ...s]

      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
      return
    }
    if (by == 'Start Time' || by == 'End Time') {
      let x = this.tabValue.filter(n => n[by])
      let k = this.tabValue.filter(n => n[by] == null)
      let s = this.tabValue.filter(n => n[by] == '')

      function sortValues(a: string, b: string) {
        const aParts = a[by].split(':').map(Number);
        const bParts = b[by].split(':').map(Number);

        if (aParts[0] < bParts[0]) return -1;
        if (aParts[0] > bParts[0]) return 1;

        if (aParts[1] < bParts[1]) return -1;
        if (aParts[1] > bParts[1]) return 1;

        if (aParts[2] < bParts[2]) return -1;
        if (aParts[2] > bParts[2]) return 1;

        return 0;
      }

      let y = x.sort(sortValues);
      this.tabValue = [...y, ...k, ...s]
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

      return
    }
    let x = this.tabValue.filter(n => n[by])
    let k = this.tabValue.filter(n => n[by] == null)
    let s = this.tabValue.filter(n => n[by] == '')
    let y = x.sort((a, b) => a[by].toString().localeCompare(b[by]))
    this.tabValue = [...y, ...k, ...s]
    this.count = !this.count
    this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

  }

  convertToPlain(html) {
    // return html.replace(/<[^>]*>/g, '');
    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || "";
  }
  htmlDecodeTable(val) {
    return decode(val)
  }


  viewTaskGroupInfo(flag, data) {
    Object.assign(data, { RechurnRule: data['Rechurn Rule'] })
    Object.assign(data, { ApplyFilter: data['Filter Condition'] })
    Object.assign(data, { SortCondition: data['Sort Condition'] })
    Object.assign(data, { TaskGroupFields: data['Task Group Fields'] })
    Object.assign(data, { SortConditionOrder: data['Sort Condition Order'] })
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: flag == 'Rechurn Rule' ? 'rechurnrule' : flag == 'Sort Condition' ? 'sortcondition' : flag == 'Filter Condition' ? 'filtercondition' : 'filtercondition',
        taskGroupInfo: data,
        restrictEdit: true
      },
      width: flag == 'Sort Condition' ? "40%" : flag == 'Rechurn Rule' ? "60%" : "100%",
      maxHeight: '85vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status) {
        console.log(status);
        // this.getData()
      }
    })
  }

  changeStatus(val, data) {
    setTimeout(() => {
      let obj = {
        data: {
          spname: "usp_unfyd_task_group",
          parameters: {
            FLAG: 'TASK_GROUP_STATUS',
            STATUS: data.Status,
            MODIFIEDBY: this.userDetails.Id,
            ID: data.Actionable
          }
        }
      }
      this.loader = true
      this.api.post('index', obj).subscribe((res: any) => {
        this.loader = false;
        if (res.code == 200) {
          if (res.results.data.length > 0) {
            this.common.snackbar('Update Success');
            this.loader = false
            this.getContacts()
          }
        }
      })
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':
        return '#db4453';
      case 'WIP':
        return '#fbad17';
      case 'Completed':
        return '#36bc9b';
      case 'Rescheduled':
        return '#4b89dc';
      default:
        return '';
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

