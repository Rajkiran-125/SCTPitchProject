import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatMenuTrigger } from '@angular/material/menu';
import { TreeData } from 'src/app/global/treeService/tree-data.model';
import { TreeDataService } from 'src/app/global/treeService/tree-data.service';
import { TreeFunctionService } from 'src/app/global/treeService/tree-function.service';
import { of as observableOf } from 'rxjs';
import moment from "moment";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Subscription } from "rxjs";
import { I } from '@angular/cdk/keycodes';
import { checknull, checknull1, regex } from 'src/app/global/json-data';


@Component({
  selector: 'app-feature-controls',
  templateUrl: './feature-controls.component.html',
  styleUrls: ['./feature-controls.component.scss'],
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
export class FeatureControlsComponent implements OnInit {
  @ViewChild('tree') tree;

  requestObj: any;
  dummyValues: any = {};
  moduleObj: any;
  childmoduleObj: any;
  addModule: boolean = true;
  hideModule: boolean = true;
  productModule: boolean = true;
  subscriptionAcitivateData: Subscription[] = [];
  errorval: boolean = false;
  errorvalue: boolean = false;
  userDetails: any;
  loader: boolean = false;
  form1: FormGroup
  form: FormGroup;
  addchildModule: boolean = false;
  commonObj: any;
  parentcontrolid: bigint;
  productName: any;
  accessControl: any;
  role: any;
  productType: any = '';
  profileType: any = [];
  accessControls: any = [];
  submittedForm: boolean = false;
  nestedTreeControl: NestedTreeControl<TreeData>;
  nestedDataSource: MatTreeNestedDataSource<TreeData>;
  @Input() data: any;
  @Output() close: any = new EventEmitter<any>();
  @Input() isDialog: boolean = false;
  a: any
  b: any
  gettreeList: any = [];
  IsChildAvail: boolean = true;
  accesscontrolid: any;
  roleid: any;
  // productid: any ;
  dateFormat: any;
  minDate = new Date();
  maxDate = new Date();
  childData = [];
  DateForm: FormGroup;
  parentModule: any = [];
  childModule: boolean = false;
  lblParentModule: string = '';
  disabled: false;
  showSpinners: true;
  showSeconds: boolean = true;
  disableMinute: false;
  touchUi: false;
  hideTime: false;
  enableMeridian: false;
  color: "primary";
  stepHour: 1;
  stepMinute: 0;
  stepSecond: 0;
  date = new Date()
  addForm: boolean = false;
  acesscontrolError: boolean = false;
  saveAccessControl: any;
  childobj: any;
  treeView: any;
  node: TreeData;
  treeControl: any;
  roletypeCheck: boolean = false;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  userConfig: any;
  isDisabled: boolean = false
  resresult: any;
  Id: any;
  id: any
  selectedMenuOption: any;
  editModuleIndex
  editModuleNameVar
  addModuleButton
  labelName: any;
  feature: any;
  nodeIdexpandbutton: any;
  addApp: boolean;

  constructor(
    private common: CommonService,
    private api: ApiService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private el: ElementRef,
    private dataService: TreeDataService,
    private service: TreeFunctionService,
    public dialogRef: MatDialogRef<DialogComponent>
  ) { }

  ngOnInit(): void {
    this.common.hubControlEvent('FeatureControls', 'click', 'pageload', 'pageload', '', 'ngOnInit');
    this.loader = false;
    this.userDetails = this.auth.getUser();
    this.common.setUserConfig(this.userDetails.ProfileType, 'FeatureControls');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
      this.common.hubControlEvent('FeatureControls', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

    }))
    this.form = this.formBuilder.group({
      childmodulename: ['', Validators.required],
      parentcontrolid: ['', Validators.required],
      accesscontrolname: ['', Validators.required]
    })
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.dataService._dataChange.subscribe(
      data => (this.nestedDataSource.data = data)
    );
    this.getProducts();
    this.getProfileType();
    this.subscription.push(this.common.reloadData$.subscribe(res => {
      if (res) {
        // this.getModule(this.accesscontrolid);
        this.getChildModule({ "ModuleName": this.lblParentModule, "Id": this.parentcontrolid })
      }
    }));
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        this.dateFormat = data.DatePickerFormat;
      })
    )
    this.DateForm = this.formBuilder.group({
      Date: [moment(), Validators.required],
      date: new FormControl(null, [Validators.required])
    });
    this.minDate.setFullYear(this.minDate.getFullYear());
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    this.a = typeof (this.nestedTreeControl)
    this.a = typeof (this.nestedDataSource)
  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false
      this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'FeatureControls', data)

  }

  getModule(accesscontrolid) {
    this.loader = true
    this.childModule = false;
    this.IsChildAvail = false;
    this.hideModule = true;
    if (this.childModule = true) {
      this.lblParentModule = ''
    }
    this.accesscontrolid = accesscontrolid;
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_feature_control",
        "parameters": {
          flag: "GET_MODULE",
          processid: this.userDetails.Processid,
          accesscontrolid: accesscontrolid,
        }
      }
    }
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(this.requestObj), 'getModule');

    this.api.post('index', this.requestObj).subscribe((res: any) => {

      if (res.code == 200) {
        this.loader = false;
        this.moduleObj = res.results.data;
        this.loader = false;
        if (this.lblParentModule) this.childModule = true;
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = false;
      })
  }

  addNewModule() {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', '', 'addNewModule');

    this.addModule = !this.addModule;
  }

  hideaddmodule() {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', '', 'hideaddmodule');

    this.hideModule = !this.hideModule
  }

  ProductHide() {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', '', 'ProductHide');
    this.productModule = !this.productModule
  }
  saveParentModule() {
    if (!this.accesscontrolid) {  //Poobnamchand Features Activated Code

      this.acesscontrolError = true;
    }
    else {
      this.acesscontrolError = false;
      this.submittedForm = true;
      this.loader = true;
      for (const key of Object.keys(this.form.controls)) {
        if (key == "modulename") {
          if (this.form.value.modulename == "" || this.form.value.modulename == null || this.form.value.modulename == undefined) {
            this.loader = false;
            // this.common.snackbar('HsmMesgHeaderRequired');\
            this.errorval = true;
            return;
          }

        }
        if (key == "moduleKey") {
          if (this.form.value.moduleKey == "" || this.form.value.moduleKey == null || this.form.value.moduleKey == undefined) {
            this.loader = false;
            // this.common.snackbar('HsmMesgHeaderRequired');\
            this.errorvalue = true;
            return;
          }

        }
      }
      if (this.form.controls["modulename"].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "modulename" + '"]');
        invalidControl.focus();
        this.form.get('modulename').markAsTouched();
        this.loader = false
        return;
      }

      if (this.form.controls["moduleKey"].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "moduleKey" + '"]');
        invalidControl.focus();
        this.form.get('moduleKey').markAsTouched();
        this.loader = false
        return;
      }
      else {
        var product: any;
        this.productType.forEach(element => {
          if (element.Id == this.productName) {
            product = element.ProductName;
          }
        });
        this.feature = this.form.get('modulename').value
        this.requestObj = {
          "data": {
            "spname": "usp_unfyd_feature_control",
            "parameters": {
              flag: "INSERT_PARENT_MODULE",
              processid: this.userDetails.Processid,
              modulename: this.feature == null ? null : this.feature == undefined ? null : this.feature.trim(),
              productname: product,
              languagecode: "en",
              createdby: this.userDetails.Id,
              configkey: this.form.value.moduleKey,
              accesscontrolid: this.accesscontrolid,
              assignedpropertylabel: this.feature,
              browsername: this.userDetails.browser,
              browserversion: this.userDetails.browser_version,
              publicip: this.userDetails.ip,
              privateip: ''
            }
          }
        }
        this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(this.requestObj), 'saveParentModule');

        this.api.post('index', this.requestObj).subscribe((res: any) => {
          if (res.code == 200) {

            if (res.results.data[0].result == "Data saved successfully") {
              // this.common.snackbar(res.results.data[0].result, "Record add");
              this.common.snackbar("Record add");
              this.addModuleButton = false
              this.getModule(this.accesscontrolid);
              this.submittedForm = false;
              this.loader = false;
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
                          flag: 'ACTIVATE_PARENT_MODULE',
                          processid: this.userDetails.Processid,
                          modulename: this.feature,
                          productname: product,
                          languagecode: "en",
                          createdby: this.userDetails.Id,
                          configkey: this.form.value.moduleKey,
                          accesscontrolid: this.accesscontrolid,
                          assignedpropertylabel: this.form.get('modulename').value,
                          browsername: this.userDetails.browser,
                          browserversion: this.userDetails.browser_version,
                          publicip: this.userDetails.ip,
                          privateip: ''
                        }
                      }
                    };

                    this.api.post('index', this.requestObj).subscribe((res: any) => {
                      if (res.code == 200) {
                        this.common.snackbar("Saved Success");
                        this.addModuleButton = false
                        this.submittedForm = false;
                        this.loader = false;
                        this.getModule(this.accesscontrolid);
                        var ParentMod = { "ModuleName": this.lblParentModule, "Id": this.parentcontrolid };
                        this.getModule(this.accesscontrolid);
                      }
                    });

                  }
                  if (status.status == false) {
                    this.loader = false;
                  }

                  this.subscriptionAcitivateData.forEach((e) => {
                    e.unsubscribe();
                  });
                }))

            }

            else if ((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)) {
              this.common.snackbar('Data Already Exist');
              this.loader = false;
            }
            this.form.reset();
          }
          else {
            this.loader = false;
          }
        },
          (error) => {
            this.common.snackbar("General Error");
            this.loader = false;
          });
      }
    }
  }

  getChildModule(parentmod) {
    this.loader = true;
    this.childModule = true;
    this.selectedMenuOption = parentmod.ModuleName;
    this.lblParentModule = parentmod.ModuleName;
    this.parentcontrolid = parentmod.Id;
    this.parentModule.ModuleName = parentmod.ModuleName;
    this.parentModule.Id = parentmod.Id;

    this.requestObj = {

      "data": {
        "spname": "usp_unfyd_feature_control",
        "parameters": {
          flag: "GET_CHILD_MODULE",
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          parentcontrolid: this.parentcontrolid
        }
      }
    }
    // this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(this.requestObj), 'getChildModule');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.IsChildAvail = true;
        this.loader = true;
        if (res.results.data.length > 0) { this.gettreeListData(res); }
        else { this.loader = false; this.IsChildAvail = false }
        this.lblParentModule = parentmod.ModuleName;

        if (parentmod.Status == false) {
          this.isDisabled = true
        }
        if (parentmod.Status == true) {
          this.isDisabled = false
        }

      }
      else {
        this.loader = false;
        this.IsChildAvail = false;
      }
    },
      (error) => {
        // this.common.snackbar("General Error");
        this.loader = false;
      })
  }

  addChildModule(parentid, parentname) {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(parentid, parentname), 'addChildModule');

    var product: any;
    this.productType.forEach(element => {
      if (element.Id == this.productName) {
        product = element.ProductName;
      }
    });
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'addFeatureControl',
        parentnode: parentname,
        parentcontrolid: parentid,
        accessControlId: this.accessControl,
        moduleName: this.parentModule.ModuleName,
        productName: product
      },
      width: '552px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.loader = true;
        var ParentMod = { "ModuleName": this.lblParentModule, "Id": this.parentcontrolid };
        this.getChildModule(ParentMod);
        //this.getModule(this.accesscontrolid);

        this.common.sendCERequest('UPDATEFEATURECONTROL', this.userDetails.Processid)
      }

    });
  }

  saveChildModule() {
    var ParentMod = { "ModuleName": "", "Id": this.parentcontrolid };
    let child = this.childData.length

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_feature_control",
        "parameters": {
          flag: "INSERT_CHILD_MODULE",
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          modulename: this.form.get('childmodulename').value,
          productname: "Agent",
          languagecode: "en",
          createdby: this.userDetails.Id,
          parentcontrolid: this.parentcontrolid
        }
      }
    }
    this.common.hubControlEvent('FeatureControls', 'click', '', '', '', 'saveChildModule');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        child--;
        if (child == 0) {
          // this.common.snackbar(res.results.data[0].result, "Record add");
          this.common.snackbar("Record add");
          this.form.get('childmodulename').setValue('');
          this.loader = true;
          this.getChildModule(ParentMod);
          this.getModule(this.accesscontrolid);


        }


      }
    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }

  saveSubChildModule(data, parentnode) {
    var ParentMod = { "ModuleName": "", "Id": this.parentcontrolid };
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_feature_control",
        "parameters": {
          flag: "INSERT_CHILD_MODULE",
          processid: this.userDetails.Processid,
          productid: 1,
          modulename: data.key,
          productname: "Agent",
          languagecode: "en",
          createdby: this.userDetails.Id,
          parentcontrolid: parentnode.Id,
          AssignedValue: '',
          AssignedProperty: data.AssignedProperty,
          AdditionalProperty: '',
          AssignedPropertyLabel: data.AssignedPropertyLabel,
          AdditionalPropertyLabel: ''
        }
      }
    }
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(this.requestObj), 'saveSubChildModule');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.snackbar("Record add");
        this.getChildModule(ParentMod);
        this.getModule(this.accesscontrolid);

      }

    },
      (error) => {
        this.common.snackbar("General Error");
      });
  }

  UpdateStatus(Id, event, parentid) {
    // this.common.hubControlEvent('FeatureControls','click','','',JSON.stringify(event),'UpdateStatus');

    // this.nestedDataSource.data.forEach(element => {
    //   if (element.Id == Id) {
    //     if (element.Children) {
    //       element.Children.forEach((childobj: any) => {
    //         if (event.checked == false) {
    //           if (childobj.Children.length > 0) {
    //             childobj.Children.forEach((childobj2: any) => {
    //               this.dummyValues[childobj2.Id].AssignedValue = '';
    //             })
    //             this.dummyValues[childobj.Id].AssignedValue = '';
    //           }
    //           else {
    //             this.dummyValues[childobj.Id].AssignedValue = '';
    //           }
    //         }
    //       })
    //     }
    //   }
    // })

    // this.common.hubControlEvent('FeatureControls','click','','',JSON.stringify(event),'UpdateStatus');

  }


  updateParentStatus(Id, event) {
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_feature_control",
        "parameters": {
          flag: "UPDATE_MODULE_STATUS",
          id: Id,
          status: event.checked
        }
      }
    }
    // this.common.hubControlEvent('FeatureControls','click','','',JSON.stringify(event),'updateParentStatus');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.resresult = res.results.data[0].result
        if (res.results.data[0].result == 'Status updated successfully') {
          this.common.snackbar('Update Success');
        }
        // this.isDisabled = event.checked
        if (this.parentcontrolid == Id) {
          if (event.checked == false) {
            this.isDisabled = true
          }
          if (event.checked == true) {
            this.isDisabled = false
          }
        }
        this.getChildModule({ "ModuleName": this.lblParentModule, "Id": this.parentcontrolid });
        this.getModule(this.accesscontrolid);
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }

  private _getChildren = (node: TreeData) => observableOf(node.Children);
  hasNestedChild = (_: number, nodeData: TreeData) => nodeData.Children.length > 0;

  refreshTreeData() {
    // const data = this.nestedDataSource.data;
    // this.nestedDataSource.data = null;
    // this.nestedDataSource.data = data;
  }

  addChildNode(node) {
    var product: any;
    this.productType.forEach(element => {
      if (element.Id == this.productName) {
        product = element.ProductName;
      }
    });
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'addFeatureControl',
        parentnode: node.Name,
        parentcontrolid: node.Id,
        accessControlId: this.accessControl,
        moduleName: this.parentModule.ModuleName,
        productName: product
      },
      width: '552px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.loader = true;
        var ParentMod = { "ModuleName": this.lblParentModule, "Id": this.parentcontrolid };
        this.getChildModule(ParentMod);
        this.getModule(this.accesscontrolid);
      }
    });
  }

  editNode(nodeToBeEdited) {
    const fatherElement: TreeData = this.service.findFatherNode(nodeToBeEdited.currentNode.Id, this.nestedDataSource.data);
    let elementPosition: number;
    nodeToBeEdited.node.Id = this.service.findNodeMaxId(this.nestedDataSource.data) + 1;
    if (fatherElement[0]) {
      fatherElement[0].Children[fatherElement[1]] = nodeToBeEdited.node;
    } else {
      elementPosition = this.service.findPosition(nodeToBeEdited.currentNode.Id, this.nestedDataSource.data);
      this.nestedDataSource.data[elementPosition] = nodeToBeEdited.node;
    }

    let obj = {
      data: {
        spname: "usp_unfyd_canned_responses",
        parameters: {
          flag: 'UPDATE',
          MODIFIEDBY: this.userDetails.Id,
          ID: nodeToBeEdited.currentNode.Id,
          MESSAGE: nodeToBeEdited.node.Name,
        }
      }
    }
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(nodeToBeEdited), 'editNode');

    this.api.post('index', obj).subscribe((res: any) => {
    });
  }


  deleteNode(nodeToBeDeleted: TreeData) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status == true) {
        const deletedElement: TreeData = this.service.findFatherNode(nodeToBeDeleted.Id, this.nestedDataSource.data);
        let elementPosition: number;
        var product: any;
        this.productType.forEach(element => {
          if (element.Id == this.productName) {
            product = element.ProductName;
          }
        });
        if (deletedElement[0]) {
          deletedElement[0].Children.splice(deletedElement[1], 1);
        } else {
          elementPosition = this.service.findPosition(nodeToBeDeleted.Id, this.nestedDataSource.data);
          this.nestedDataSource.data.splice(elementPosition, 1);
        }
        let obj = {
          data: {
            spname: "usp_unfyd_feature_control",
            parameters: {
              flag: 'DELETE',
              ID: nodeToBeDeleted.Id,
            }
          }
        }
        this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(nodeToBeDeleted), 'deleteNode');

        this.api.post('index', obj).subscribe((res: any) => {
          if (res.code == 200) {
            this.loader = false;
            // this.common.snackbar(res.results.data[0].result, "success");
            if (res.results.data[0].result == 'Data deleted successfully') {
              this.common.snackbar('Delete Record')
            }
            var ParentMod = { "ModuleName": this.lblParentModule, "Id": this.parentcontrolid };
            this.getChildModule(ParentMod);
            this.getModule(this.accesscontrolid);
          }
        });
      }


      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
  }

  gettreeListData(res) {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', res, 'gettreeListData');

    this.gettreeList = res.results.data;
    var treeList = JSON.parse(JSON.stringify(this.gettreeList))
    let result1 = treeList.map(item => {
      if (item.ParentId != null) {
        var ConfigValue, assignedValue;
        if (item.ControlType == 'Dropdown') {
          if (item.ConfigValue != undefined) {
            ConfigValue = JSON.parse(JSON.parse(JSON.stringify(item?.ConfigValue)));
          }
        } else {
          ConfigValue = item.ConfigValue;
        } if (item.ControlType == 'MultiSelect') {
          ConfigValue = JSON.parse(JSON.parse(JSON.stringify(item?.ConfigValue)));
          assignedValue = (item.AssignedValue).split(',');
        }
        else if (item.ControlType == 'TimeControl') {
          let time = {
            hour: 0,
            minute: 0,
            second: 0
          }
          if (item?.AssignedValue) {
            let x = item.AssignedValue

            // let a = '1995-12-17T';
            //     time.hour = parseInt(item?.AssignedValue[0]);
            //     time.minute = parseInt(item?.AssignedValue[1]);
            //     time.second = parseInt(item?.AssignedValue[2]);
            let a = x.split(":");
            time.hour = parseInt(a[0]);
            time.minute = parseInt(a[1]);
            time.second = parseInt(a[2]);
            assignedValue = time
          } else {
            assignedValue = time;
          }
        } else {
          assignedValue = item.AssignedValue == 'false' ? false : item.AssignedValue;
        }
        return { Id: item.Id, Name: item.AssignedPropertyLabel, ParentId: item.ParentId, Children: [], AssignedProperty: item.AssignedPropertyText, AssignedPropertyLabel: item.AssignedPropertyLabel, Status: item.Status, ControlType: item.ControlType, AssignedValue: assignedValue, ConfigKey: item.ConfigKey, ConfigValue: ConfigValue }
      } else {
        var ConfigValue, assignedValue;
        if (item.ControlType == 'Dropdown') {
          if (item.ConfigValue != undefined) {
            ConfigValue = JSON.parse(JSON.parse(JSON.stringify(item?.ConfigValue)));
          }
        } else {
          ConfigValue = item.ConfigValue;
        } if (item.ControlType == 'MultiSelect') {
          if (item?.ConfigValue) {
            ConfigValue = JSON.parse(JSON.parse(JSON.stringify(item?.ConfigValue)));
          }
          assignedValue = (item.AssignedValue).split(',');
        } else if (item.ControlType == 'TimeControl') {
          let time = {
            hour: 0,
            minute: 0,
            second: 0
          }
          if (item?.AssignedValue) {
            let x = item.AssignedValue
            let a = x.split(":");
            time.hour = parseInt(a[0]);
            time.minute = parseInt(a[1]);
            time.second = parseInt(a[2]);
            assignedValue = time
          } else {
            assignedValue = time;
          }
        } else {
          assignedValue = item.AssignedValue == 'false' ? false : item.AssignedValue;
        }
        return { Id: item.Id, Name: item.AssignedPropertyLabel, Children: [], AssignedProperty: item.AssignedPropertyText, AssignedPropertyLabel: item.AssignedPropertyLabel, Status: item.Status, ControlType: item.ControlType, AssignedValue: assignedValue, ConfigKey: item.ConfigKey, ConfigValue: ConfigValue }
      }
    });
    var data: any = result1;

    let tree = function (data, dummyValues, root) {
      var t = {};
      data.forEach(o => {
        Object.assign(t[o.Id] = t[o.Id] || {}, o);
        t[o.ParentId] = t[o.ParentId] || {};
        t[o.ParentId].Children = t[o.ParentId].Children || [];
        t[o.ParentId].Children.push(t[o.Id]);
        if (o.ControlType) { dummyValues[o.Id] = o }
      });
      return t[root].Children;
    }(data, this.dummyValues, undefined);
    this.nestedDataSource.data = tree;
    this.loader = false;
  }
  expandNode() {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', '', 'expandNode');

    this.nestedTreeControl.dataNodes = this.nestedDataSource.data;
    this.nestedTreeControl.expandAll()
  }
  collapseNode() {
    //this.gettreeListData()
  }
  panelOpenState = false;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  openContextMenu(
    event: MouseEvent,
    trigger: MatMenuTrigger,
    triggerElement: HTMLElement
  ) {
    triggerElement.style.left = event.clientX + 5 + "px";
    triggerElement.style.top = event.clientY + 5 + "px";
    if (trigger.menuOpen) {
      trigger.closeMenu();
      trigger.openMenu();
    } else {
      trigger.openMenu();
    }
    event.preventDefault();
  }


  selectedProduct(event) {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', event, 'selectedProduct');

    this.productName = event;
    this.hideModule = false;
    this.childModule = false;
    this.IsChildAvail = false;
    this.accessControl = '';
    this.accessControls = []
    this.addApp = false
    if (this.role && this.productName) {
      this.getAccessControl();
    }
  }

  getProducts() {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', '', 'getProducts');
    this.productType = JSON.parse(localStorage.getItem('products'))
    this.productType = this.productType.filter((item) => item.Id !== 11);
    this.productName = this.productType.Id;
  }

  getProfileType() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "PROFILE",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(this.requestObj), 'getProfileType');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.profileType = res.results['data'];
    });
  }

  getAccessControl() {
    this.loader = true
    this.requestObj = {
      data: {
        spname: "usp_unfyd_access_controls",
        parameters: {
          flag: "GET_ROLE_ACCESS",
          processid: this.userDetails.Processid,
          productid: this.productName ? this.productName : 1,
          roleid: this.roleid
        }
      }
    }
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(this.requestObj), 'getAccessControl');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.accessControls = res.results['data'];
      this.loader = false
    });
  }

  UpdateMapping() {
    this.loader = true;
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_access_controls",
        "parameters": {
          flag: "UPDATE_MAPPING",
          processid: this.userDetails.Processid,
          productid: this.productName,
          roleid: this.role,
          AccessControlId: this.accessControl,
          createdby: this.userDetails.Id,
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
          publicip: this.userDetails.ip,
          privateip: ''
        }
      }
    }
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(this.requestObj), 'UpdateMapping');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        // this.common.snackbar(res.results.data[0].result, "success");
        this.common.snackbar("Update Success");
        this.form.get('accesscontrolname').setValue('');
        this.updateChildModule();
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = false;
      });
  }


  selectedRole(value) {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(value), 'selectedRole');

    this.hideModule = false
    this.childModule = false;
    this.addModule = !this.addModule;
    this.accessControl = '';
    this.accessControls = []
    this.IsChildAvail = false;
    if (!value) {
      this.addForm = true;
      this.addApp = true
    } else {
      this.addForm = false;
      this.addApp = false
      this.roleid = value;
      if (this.role && this.productName) {
        this.getAccessControl();
      }
    }
  }

  updateChildModule() {
    this.loader = true;
    this.childData = Object.keys(this.dummyValues)
    let child = this.childData.length;
    for (let i in this.childData) {
      var AssignedValue = this.dummyValues[this.childData[i]].ControlType == 'MultiSelect' ? this.dummyValues[this.childData[i]].AssignedValue.join(',') : this.dummyValues[this.childData[i]].AssignedValue;
      if (this.dummyValues[this.childData[i]].ControlType == 'TimeControl') {
        let a;
        a = JSON.parse(JSON.stringify(this.dummyValues[this.childData[i]].AssignedValue));
        let hour1 = a.hour.toString()
        let minute1 = a.minute.toString()
        let second1 = a.second.toString()
        a = hour1.padStart(2, "0") + ":" + (minute1).padStart(2, "0") + ":" + (second1).padStart(2, "0")
        // let time2 = (hour1) + ':' + (minute1) + ':' + second1
        var AssignedValue: any = a;
      }
      let obj = {
        data: {
          spname: "usp_unfyd_feature_control",
          parameters: {
            flag: 'UPDATE_MODULE_DATA',
            assignedvalue: AssignedValue,
            id: this.dummyValues[this.childData[i]].Id,
            // id: this.parentcontrolid
          }
        }
      }
      this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(obj), 'updateChildModule');

      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200 && res.results.data.length > 0) {
          child--;
          if (child == 0) {
            // this.common.snackbar(res.results.data[0].result, "success");
            if (res.results.data[0].result == 'Data updated successfully') {
              this.common.snackbar("Update Success");
            }
            var ParentMod = { "ModuleName": this.lblParentModule, "Id": this.parentcontrolid };
            this.loader = true;
            this.getChildModule(ParentMod);
            this.common.sendCERequest('UPDATEFEATURECONTROL', this.userDetails.Processid)
          }
        }
      });
    }
  }

  editChildNode(node) {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', node, 'editChildNode');

    var product: any;
    this.productType.forEach(element => {
      if (element.Id == this.productName) {
        product = element.ProductName;
      }
    });
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'editFeatureControl',
        parentnode: node.Name,
        parentcontrolid: node.ParentId == undefined ? this.parentModule.Id : node.ParentId,
        productName: product,
        accessControlId: this.accessControl,
        assignedPropertyLabel: node.AssignedPropertyLabel,
        controlType: node.ControlType,
        configKey: node.ConfigKey,
        nodeId: node.Id,
        configValue: node.ConfigValue,
        moduleName: this.parentModule.ModuleName,
      },
      width: '552px',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== false) {
        var ParentMod = { "ModuleName": this.lblParentModule, "Id": this.parentcontrolid };
        this.loader = true;
        this.getChildModule(ParentMod);
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  addAccessControl() {
    this.common.hubControlEvent('FeatureControls', 'click', '', '', '', 'addAccessControl');

    if (!this.productName) { this.addApp = true }
    else if (!this.roleid) { this.addForm = true; }
    else {
      this.addApp = false
      this.addForm = false;
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'addAccessControl',
          // accessControls: this.accessControls ? this.accessControls : undefined || null,
          processid: this.userDetails.Processid,
          productid: this.productName,
          roleid: this.roleid
        },
        width: '360px',
        position: { top: '55px', left: '7px' },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        this.getAccessControl()
        if (res !== false) {
          this.getAccessControl()
        }
      });
    }

  }

  deleteModule(ModuleId) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status == true) {
        let obj = {
          data: {
            spname: "usp_unfyd_feature_control",
            parameters: {
              flag: 'DELETE',
              ID: ModuleId
            }
          }
        }
        this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(obj), 'deleteModule');

        this.api.post('index', obj).subscribe((res: any) => {
          if (res.code == 200) {
            this.loader = false;
            // this.common.snackbar(res.results.data[0].result, "success");
            if (res.results.data[0].result == 'Data deleted successfully') {
              this.common.snackbar('Delete Record')
            }
            this.getModule(this.accesscontrolid);
          }
        });
      }
      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
  }


  editModuleName(data) {
    this.loader = true
    if (!this.editModuleNameVar || this.editModuleNameVar.trim() === '') {
      this.common.snackbar('Whitespace');
      this.loader = false;
      return;
    }
    let req = {
      data: {
        spname: "usp_unfyd_feature_control",
        parameters: {
          flag: 'UPDATE_PARENT_MODULE_DATA',
          MODULENAME: this.editModuleNameVar.trim(),
          id: data.Id,
        }
      }
    }
    this.common.hubControlEvent('FeatureControls', 'click', '', '', JSON.stringify(data), 'editModuleName');

    this.api.post('index', req).subscribe((res: any) => {

      if (res.code == 200) {
        this.loader = false
        this.common.snackbar('Update Success')
        this.editModuleIndex = undefined
        this.getModule(this.accessControl);

      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = false;
      })
  }
  moduleform() {
    this.form = this.formBuilder.group({
      modulename: ['', [Validators.pattern(regex.alphabetWithUnderScore)]],
      moduleKey: ['', [Validators.pattern(regex.alphabetWithoutSpace)]],
    },
      { validator: [checknull('modulename'), checknull1('modulename')] },)
  }
  modulename() {
    this.errorval = false
  }
  modulekey() {
    this.errorvalue = false
  }
  clearvalidator() {
    this.form.get('modulename').setValidators(Validators.nullValidator);
    this.form.get('moduleKey').setValidators(Validators.nullValidator);
    this.errorval = false
    this.errorvalue = false
    this.form.reset();
    this.submittedForm = false;
    this.form.updateValueAndValidity();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}




