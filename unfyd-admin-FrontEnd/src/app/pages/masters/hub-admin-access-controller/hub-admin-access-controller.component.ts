import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { orderBy } from 'lodash';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull, checknull1, masters, regex } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { A, I } from '@angular/cdk/keycodes';
import { a } from '../form-creation/form-preview/form-preview.component';
import { MatMenuTrigger } from '@angular/material/menu';
import moment from 'moment';
import { MatCheckboxChange } from '@angular/material/checkbox';

import {encode,decode} from 'html-entities';


@Component({
  selector: 'app-hub-admin-access-controller',
  templateUrl: './hub-admin-access-controller.component.html',
  styleUrls: ['./hub-admin-access-controller.component.scss']
})
export class HubAdminAccessControllerComponent implements OnInit {
  // @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('mySelect') mySelect;
  loader: boolean = false;
  filter: any;
  form: FormGroup;
  submittedForm: boolean = false;
  requestObj: any;
  userDetails: any;
  modules: any = [];
  categories: any = [];
  subcategory: any = [];
  HubId: string;
  copyId: string;
  categoryname: any;
  action: any;
  actionname: any;
  editObj: any;
  ID: any;
  ModuleValue: any;
  filteredList: any;
  Pri: any;
  AccessActionableValue: any = [];
  selectedValue: any;
  AccessActionableValueOne: any = [];
  ActionValueOne: any = [];
  AccessCategoryValueOne: any = [];
  AccessCategoryValue: any = [];
  actionableloop: any;
  tabvalue: any = [];
  addValue: any;
  tableloop: any = [];
  item: any;
  ModuleLabel: any;
  ModuleLoop: any = [];
  ModulenameDisplay: any;
  ActionList: any;
  ModuleId: any;
  SubModuleGroupping: any;
  ModuleGroupping: any;
  edititem: any = [];
  isDropDown: boolean;
  type: any;
  config: any;
  subscription: Subscription[] = [];
  labelName: any;
  userConfig: any;
  controlnameStore: any;
  tabKey: any = [];
  tabValue: any = [];
  page: number = 1;
  currentpage: number = 1;
  itemsPerPage: number = 10;
  paginationArray: any = [];
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  search: any;
  reset: boolean;
  hsmtoggleval: string;
  hasChecked: any = []
  allSelected: boolean = false
  maxNo = false;
  EditActionTable: any;
  ShowAddModule: boolean = false;
  EditAddModule: boolean = false;
  formNameValue: any;
  isModuleSame: boolean = false;
  isFilterOnCreate: boolean = false;
  subscriptionAcitivateData: Subscription[] = [];
  @Input() data: any;
  @Input() PriId: any;
  @Output() close: any = new EventEmitter<any>();
  @Input() isDialog: boolean = false;
  dateformat: any;
  format: any;
  copyWithId: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    public common: CommonService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private location: Location,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogComponent>,

  ) {
    Object.assign(this, { regex, masters });

  }
  ngOnInit(): void {
    this.common.hubControlEvent('Privilege', 'click', 'pageload', 'pageload', '', 'ngOnInit');
    this.type = "PrivilegeViewTable";
    this.userDetails = this.auth.getUser();
    this.getSnapShot();
    // this.copyWithAdd()

    this.dateformat = JSON.parse(localStorage.getItem("localizationData"));
    this.format = this.dateformat.selectedDateFormats.toUpperCase().concat(" ",this.dateformat.selectedTimeFormats)



    this.subscription.push(this.common.reloadData$.subscribe(res => {
      if (res) {
        this.GetViewTablePrivlege(res)
      }
    }));
    if(this.PriId == null)
    {
    this.PriId = this.activatedRoute.snapshot.paramMap.get('id');
    } 
    this.HubId = this.isDialog === true ? this.PriId : this.activatedRoute.snapshot.paramMap.get('id');
    this.copyWithId = this.isDialog === true ? this.PriId : this.activatedRoute.snapshot.paramMap.get('copyWithId');
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.getCategory();
    this.form = this.formBuilder.group({
      ModuleName: ['', Validators.nullValidator],
      ModuleId: ['', Validators.nullValidator],
      Name: ['', [Validators.required,Validators.pattern(regex.alphanumericwithSpace)]],
      Category: ['', Validators.nullValidator],
      Subcategory: ['', Validators.nullValidator],
      Action: ['', Validators.nullValidator],
      EditActionTableValue: ['', Validators.nullValidator],
      Description: ['', [Validators.nullValidator,  Validators.maxLength(500)]],
      Listoption: this.formBuilder.array([
        this.newListoption(),]),
      ModuleValue: this.formBuilder.array([
      ]),
    },
      { validator: [checknull1('Name'),checknull1('Description')] },

    )
    
    if (this.HubId != null) {
      this.isFilterOnCreate = true;


      this.form.controls['Name'].disable()

      this.loader = true
      var obj = {
        data: {
          spname: "usp_unfyd_module_map",
          parameters: {
            flag: "EDIT",
            AccessControlID: this.HubId
          }
        }
      }
      this.api.post('index', obj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.ActionValueOne = res.results.data[0]
          this.controlnameStore = res.results.data[0].ControlName

          this.ActionValueOne.ActionList ? this.form.controls['Action'].patchValue(this.ActionValueOne.ActionList.split(',')) : this.form.controls['Action'].patchValue(this.ActionValueOne.ActionList)

          this.getCategory();
          if (this.copyId == null) {
            this.form.controls.Name.patchValue(this.ActionValueOne.ControlName)
            this.form.controls.Description.patchValue(decode(this.ActionValueOne.Description))

            this.formNameValue = this.ActionValueOne.ControlName;
          }
          res.results.data.forEach(res1 => {
            this.tableloop.push({
              ModuleName: res1.ModuleName,
              Category: res1.ModuleGroupping,
              Subcategory: res1.SubModuleGroupping,
              Action: res1.ActionList ? res1.ActionList.split(",") : res1.ActionList,
              ModuleId: res1.ModuleId,
            })
          })




          res.results.data.forEach(res1 => {
            this.tabValue.push({


              "Sr No": "",
              "ControlName": res1.ControlName,
              "Description": decode(res1.Description),
              "ModuleGroupping": res1.ModuleGroupping,
              "SubModuleGroupping": res1.SubModuleGroupping,
              "ModuleName": res1.ModuleName,
              "ActionList": res1.ActionList ? res1.ActionList.split(",") : res1.ActionList,
              "Actionable": res1.Actionable,
              "ModuleId": res1.ModuleId


            })
          })


          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              if (key !== 'ModuleId') {
                this.tabKey.push(key);
              }
            }
          }
          this.common.reportTabKeyData(this.tabKey);


          this.form.controls.Category.patchValue('')
          this.form.controls.Subcategory.patchValue('')
          this.form.controls.ModuleName.patchValue('')
          this.form.controls.Action.patchValue('')

          this.getFilter();
        }
      })
    }    else if (this.copyWithId != null) {
      this.isFilterOnCreate = true;
  
  
      // this.form.controls['Name'].disable()
  
      this.loader = true
      var obj = {
        data: {
          spname: "usp_unfyd_module_map",
          parameters: {
            flag: "EDIT",
            AccessControlID: this.copyWithId
          }
        }
      }
      this.api.post('index', obj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.ActionValueOne = res.results.data[0]
          // this.controlnameStore = res.results.data[0].ControlName
  
          this.ActionValueOne.ActionList ? this.form.controls['Action'].patchValue(this.ActionValueOne.ActionList.split(',')) : this.form.controls['Action'].patchValue(this.ActionValueOne.ActionList)
  
          this.getCategory();
          // if (this.copyId == null) {
          //   this.form.controls.Name.patchValue(this.ActionValueOne.ControlName)
          //   this.form.controls.Description.patchValue(this.ActionValueOne.Description)
  
          //   this.formNameValue = this.ActionValueOne.ControlName;
          // }
          res.results.data.forEach(res1 => {
            this.tableloop.push({
              ModuleName: res1.ModuleName,
              Category: res1.ModuleGroupping,
              Subcategory: res1.SubModuleGroupping,
              Action: res1.ActionList ? res1.ActionList.split(",") : res1.ActionList,
              ModuleId: res1.ModuleId,
            })
          })
  
  
  
  
          res.results.data.forEach(res1 => {
            this.tabValue.push({
  
  
              "Sr No": "",
              "ControlName": res1.ControlName,
              "Description": decode(res1.Description),
              "ModuleGroupping": res1.ModuleGroupping,
              "SubModuleGroupping": res1.SubModuleGroupping,
              "ModuleName": res1.ModuleName,
              "ActionList": res1.ActionList ? res1.ActionList.split(",") : res1.ActionList,
              "Actionable": res1.Actionable,
              "ModuleId": res1.ModuleId
  
  
            })
          })
  
  
          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              if (key !== 'ModuleId') {
                this.tabKey.push(key);
              }
            }
          }
          this.common.reportTabKeyData(this.tabKey);
  
  
          this.form.controls.Category.patchValue('')
          this.form.controls.Subcategory.patchValue('')
          this.form.controls.ModuleName.patchValue('')
          this.form.controls.Action.patchValue('')
  
          this.getFilter();
        }
      })
    }
    // copyWithAdd(){
     else if (this.copyWithId != null) {
        this.isFilterOnCreate = true;
    
    
        // this.form.controls['Name'].disable()
    
        this.loader = true
        var obj = {
          data: {
            spname: "usp_unfyd_module_map",
            parameters: {
              flag: "EDIT",
              AccessControlID: this.copyWithId
            }
          }
        }
        this.api.post('index', obj).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.ActionValueOne = res.results.data[0]
            // this.controlnameStore = res.results.data[0].ControlName
    
            this.ActionValueOne.ActionList ? this.form.controls['Action'].patchValue(this.ActionValueOne.ActionList.split(',')) : this.form.controls['Action'].patchValue(this.ActionValueOne.ActionList)
    
            this.getCategory();
            // if (this.copyId == null) {
            //   this.form.controls.Name.patchValue(this.ActionValueOne.ControlName)
            //   this.form.controls.Description.patchValue(this.ActionValueOne.Description)
    
            //   this.formNameValue = this.ActionValueOne.ControlName;
            // }
            res.results.data.forEach(res1 => {
              this.tableloop.push({
                ModuleName: res1.ModuleName,
                Category: res1.ModuleGroupping,
                Subcategory: res1.SubModuleGroupping,
                Action: res1.ActionList ? res1.ActionList.split(",") : res1.ActionList,
                ModuleId: res1.ModuleId,
              })
            })
    
    
    
    
            res.results.data.forEach(res1 => {
              this.tabValue.push({
    
    
                "Sr No": "",
                "ControlName": res1.ControlName,
                "Description": decode(res1.Description),
                "ModuleGroupping": res1.ModuleGroupping,
                "SubModuleGroupping": res1.SubModuleGroupping,
                "ModuleName": res1.ModuleName,
                "ActionList": res1.ActionList ? res1.ActionList.split(",") : res1.ActionList,
                "Actionable": res1.Actionable,
                "ModuleId": res1.ModuleId
    
    
              })
            })
    
    
            for (var key in this.tabValue[0]) {
              if (this.tabValue[0].hasOwnProperty(key)) {
                if (key !== 'ModuleId') {
                  this.tabKey.push(key);
                }
              }
            }
            this.common.reportTabKeyData(this.tabKey);
    
    
            this.form.controls.Category.patchValue('')
            this.form.controls.Subcategory.patchValue('')
            this.form.controls.ModuleName.patchValue('')
            this.form.controls.Action.patchValue('')
    
            this.getFilter();
          }
        })
      }
      // else {
      //   this.loader = false;
      //   this.isFilterOnCreate = false;
      // }
    // }

    else {
      this.loader = false;
      this.isFilterOnCreate = false;
    }
    this.common.hubControlEvent('Privilege', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }
  getSnapShot() {
    this.common.hubControlEvent('Privilege', 'click', '', '', '', 'getSnapShot');

    this.userDetails = this.auth.getUser();
    this.HubId = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.url.subscribe(url => {
      let HubId = 'Privilege'
      this.common.setUserConfig(this.userDetails.ProfileType, HubId);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
      }));
    });
  }

  getFilter() {
    this.loader = true;
    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });


    this.common.hsmtabletoggle$.subscribe(data => {
      this.hsmtoggleval = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
      }
    });
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
    });
    this.loader = false;
  }

  feildChooser() {
    this.loader = true;

    var obj = {
      data: {
        spname: "usp_unfyd_user_field_chooser",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Pri,
          modulename: 'PrivilegeViewTable',
          language: localStorage.getItem('lang')
        }
      }
    }


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
      }
      this.loader = false;
    },
      (error) => {
      })
  }



  GetViewTablePrivlege(ids) {


    let idarr = [];
    idarr.push(ids);

    for (let i = 0; i < ids.length; i++) {

      let id = ids[i]

      let indx = this.tabValue.findIndex(v => parseInt(v.Actionable) === parseInt(id));
      this.tabValue.splice(indx, indx >= 0 ? 1 : 0);
    }
    this.hasChecked = [];



  }




  bulkCheckboxCheck(event, element) {

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

    if (event) {
      element.CHECKBOX = true
    } else if (!event) {
      element.CHECKBOX = false
    }
    this.checkChecks()
  }




  checkChecks() {

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
        this.hasChecked.push(this.tabValue[i].Actionable)
      }
    }
    if (this.hasChecked.length == (endingOfArray - startingOfArray)) {
      this.allSelected = true
    } else {
      this.allSelected = false
    }

  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Privilege', 'click', '', '', data, 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Privilege', data)

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form?.controls;
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
        this.categories = res.results.data;
      }
    });

  }

  back(): void {
    this.common.hubControlEvent('Privilege', 'click', 'back', 'back', '', 'back');
    if(this.isDialog == true){
      this.dialogRef.close(true);
    }
    else{
    this.location.back()}
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


  getActionList(module) {
    this.ModuleLabel = module;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_module_action_list',
        parameters: {
          flag: 'GET',
          moduleid: module,
          productid: this.userDetails.ProductId,
          processid: this.userDetails.Processid
        },
      },
    };
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(this.requestObj), 'getActionList');

    this.api.post('index', this.requestObj).subscribe(res => {

      let a = []
      a = res.results.data

      if (res.code == 200) {
        this.loader = false;
        this.action = res.results.data;
      }
    });
  }
  save(type) {
    this.loader = true;
    let count = this.tabValue.length;

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

    if (this.tableloop.length == 0) {
      this.common.snackbar("PrivieleAddModuleReqiured");
      this.loader = false;
      return;
    }

    if (this.HubId == null) {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_access_controls',
          parameters: {
            FLAG: 'INSERT_HUB_ACCESS',
            CONTROLNAME: this.form.value.Name.trim(),
            Description: encode(this.form.value.Description == null ? null : this.form.value.Description.trim()),
            ROLEID: 1,
            productid: this.userDetails.ProductId,
            processid: this.userDetails.Processid,
            createdby: this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version
          }
        }
      }
    }
    else {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_access_controls',
          parameters: {
            FLAG: 'UPDATE',
            CONTROLNAME: this.controlnameStore.trim(),
            Description: encode(this.form.value.Description == null ? null : this.form.value.Description.trim()),
            modifiedby: this.userDetails.Id,
            id: this.HubId

          }
        }
      }
    }
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(this.requestObj), 'save');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.refreshMenu(true);
        this.ID = res.results.data[0].AccessControlID
        this.loader = false;
        this.ID = res.results.data[0].ID
        if ((res.results.data[0].result.includes("already exists")) && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }
        else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {

                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_access_controls",
                    parameters: {
                      flag: 'ACTIVATE',
                      CONTROLNAME: this.form.value.Name,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                    }
                  }
                };
                this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(this.requestObj), 'save');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (type == '') {
                      count--;
                      if(count==0){
                        if(this.isDialog == true){
                          this.dialogRef.close(true);
                        }
                        else{
                      this.router.navigate(['masters/Privilege']);}
                      this.common.snackbar('Record add');
                    }
                    } 
                    if (type == 'addNew') {
                      count--;
                      if (count == 0) {
                        if(this.isDialog == true){
                          this.tableloop = []
                          this.tabValue = []
                          this.hasChecked = []         
                          this.form.reset()
                                       
                        }
                        else{
                        this.tableloop = []
                        this.tabValue = []
                        this.hasChecked = []
                        this.router.navigate(['masters/Privilege/add']);}
                        this.common.snackbar('Record add');
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
        else {
          this.submit(type)
          if (type == '') {
            if(this.isDialog == true){
              this.dialogRef.close(true);
            }
            else{
            this.router.navigate(['masters/Privilege']); }
            this.common.snackbar('Update Success');
            this.loader = false;
          // }
        }
          if (type == 'addNew') {
            this.common.snackbar('Record add');
            if(this.isDialog == true){
              this.tabValue = []
              this.hasChecked = []
              this.tableloop = []
              this.form.reset()
              
            }
            else{
              this.tableloop = []
              this.tabValue = []
              this.hasChecked = []
            this.router.navigate(['masters/Privilege/add']);}         
            this.loader = false;
            this.form.reset()
            
         
          }
        }
      }
      else {
        this.loader = false;
      }

    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })


  }
  Listoption(): FormArray {
    this.common.hubControlEvent('Privilege', 'click', '', '', '', 'Listoption');

    return this.form.get("Listoption") as FormArray
  }
  addListoption() {
    this.common.hubControlEvent('Privilege', 'click', '', '', '', 'addListoption');

    this.Listoption().push(this.newListoption());
  }
  newListoption(): FormGroup {
    this.common.hubControlEvent('Privilege', 'click', '', '', '', 'newListoption');

    return this.formBuilder.group({

      ModuleName: ['', Validators.nullValidator],
      Action: ['', Validators.nullValidator],
      Category: ['', Validators.nullValidator],
      Subcategory: ['', Validators.nullValidator],

    })
  }
  submit(type) {
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
      // this.common.snackbar("General Error");
      return;
    }

    this.tableloop.forEach(element => {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_module_map',
          parameters: {
            FLAG: 'INSERT_MAPPING_DATA',
            ActionList: element.Action.length > 0 ? element.Action.join(',') : '',
            ModuleName: element.ModuleName,
            ModuleId: element.ModuleId,
            ROLEID: 1,
            Status: 1,
            AccessControlID: this.ID,
            productid: this.userDetails.ProductId,
            createdby: this.userDetails.Id,

            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
          }
        }
      }

    });


    let count = 0;
// console.log(count,"countvalue")
    this.tabValue.forEach(element => {

      this.requestObj = {
        data: {
          spname: 'usp_unfyd_module_map',
          parameters: {
            FLAG: 'INSERT_MAPPING_DATA',
            ActionList: element.ActionList.length > 0 ? element.ActionList.join(',') : '',
            ModuleName: element.ModuleName,
            ModuleId: element.ModuleId,
            ROLEID: 1,
            Status: 1,
            AccessControlID: this.ID,
            productid: this.userDetails.ProductId,
            createdby: this.userDetails.Id,

            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
          }
        }
      }


      this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(this.requestObj), 'submit');

      this.api.post('index', this.requestObj).subscribe((res: any) => {
        if (res.code == 200) {
          this.common.refreshMenu(true);
          if (type == '') {
            count--;
            if(count==0){
              if(this.isDialog == true){
                this.dialogRef.close(true);
              }
              else{
            this.router.navigate(['masters/Privilege']);}
            this.common.snackbar('Record add');
          }
          }
       if (type == 'addNew') {
            count--;
            if (count == 0) {
              if(this.isDialog == true){
                this.tableloop = []
                this.tabValue = []
                this.hasChecked = []
                this.form.reset()
               
              }
              else{
                this.tableloop = []
                this.tabValue = []
                this.hasChecked = []
              this.router.navigate(['masters/Privilege/add']);}
              this.common.snackbar('Record add');
              this.form.reset()
             
            }
          }   
        } else {
          this.loader = false;
        }
      },
        (error) => {
          this.loader = false;
          this.common.snackbar("General Error");

        })
    })
  }



  
  update(type) {
    this.loader = true;
    let count =0;
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
      // this.common.snackbar("General Error");
      return;
    }

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_module_map',
        parameters: {
          flag: 'DELETE_MAPPING_DATA',
          AccessControlID: this.HubId,
        },
      },
    }
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(this.requestObj), 'update');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {

        this.loader = false;
        this.ID = this.HubId
        this.save(type)
        this.submit(type)

        if (type == '') {
          count--;
          if(count==0){
            if(this.isDialog == true){
              this.dialogRef.close(true);
            }
            else{
          this.router.navigate(['masters/Privilege']);}
          this.common.snackbar('Update Success');
        }
        }

        if (type == 'addNew') {
          count--;
          if (count == 0) {
            if(this.isDialog == true){
              this.tableloop = []
              this.tabValue = []
              this.hasChecked = []
              this.form.reset()
           
            }
            else{
              this.tableloop = []
              this.tabValue = []
              this.hasChecked = []
            this.router.navigate(['masters/Privilege/add']);}
            this.common.snackbar('Update Success');
            this.form.reset()
           
          }
        }


      } else {
        this.loader = false;
      }
    })

  }
  ModuleActionable(): FormArray {
    this.common.hubControlEvent('Privilege', 'click', '', '', '', 'ModuleActionable');

    return this.form.get("ModuleValue") as FormArray
  }

  addItem(): void {
    this.common.hubControlEvent('Privilege', 'click', '', '', '', 'addItem');

    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          break;
        }
      }

    }
    this.ModuleValue.push(
      new FormGroup({
        ModuleName: new FormControl('', Validators.nullValidator),
        Action: new FormControl('', Validators.nullValidator),
        Category: new FormControl('', Validators.nullValidator),
        Subcategory: new FormControl('', Validators.nullValidator),

      })
    )

  }
  moduleList(people: any[], i: any): any[] {
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(people, i), 'moduleList');

    let result = this.form.value.Listoption.map(a => a.ModuleName);
    let selectedValue: any
    people.forEach(element => {
      if (element.Pri == this.form.value.Listoption[i].ModuleName && this.form.value.Listoption[i].ModuleName != undefined) {
        selectedValue = element
      }
    });
    let filteredArray = people.filter(p => !result.includes(p.Pri));

    if (selectedValue)
      filteredArray.unshift(selectedValue)

    return filteredArray
  }
  categoryList(people: any[], i: any): any[] {
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(people, i), 'categoryList');

    let result = this.form.value.Listoption.map(a => a.Category);
    let selectedValue: any
    people.forEach(element => {
      if (element.ModuleGroupping == this.form.value.Listoption[i].Category && this.form.value.Listoption[i].Category != undefined) {
        selectedValue = element
      }
    });
    let filteredArray = people.filter(p => !result.includes(p.ModuleGroupping));

    if (selectedValue)
      filteredArray.unshift(selectedValue)

    return filteredArray
  }
  setFilterForCategory(index) {
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(index), 'setFilterForCategory');

    this.AccessCategoryValueOne[this.form.value.Listoption[index].Category] = this.AccessCategoryValue[this.form.value.Listoption[index].Category].slice()

  }

  setFilterForActionable(index) {
    this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(index), 'setFilterForActionable');

    this.AccessActionableValueOne[this.form.value.Listoption[index].ModuleName] = this.AccessActionableValue[this.form.value.Listoption[index].ModuleName].slice()

  }

  addValueItem() {
    this.common.hubControlEvent('Privilege', 'click', '', '', '', 'addValueItem');

    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          this.form.markAllAsTouched();
          break;
        }
      }
      return;
    }




    let indx = this.tabValue.findIndex(v => {
      return parseInt(v.ModuleId) === parseInt(this.form.value.ModuleName)
    });

    if (indx !== -1) {
      this.common.snackbar('PrivilegeModuleAlreadyExists')
      return;
    }


    // console.log(this.modules);
    
    this.modules.forEach(element => {
      // console.log(element.Id);
      
      if (element.Id == this.form.value.ModuleName) {
        this.ModulenameDisplay = element.Module;
      }
    })

    this.addValue = true;
    let a = { ModuleName: this.ModulenameDisplay,
       ModuleId: this.form.value.ModuleName,
        Category: this.form.value.Category,
         Subcategory: this.form.value.Subcategory,
          Action: this.form.value.Action ? this.form.value.Action : [] }

    let formRawVal = this.form.getRawValue();

    let b = {
      "Sr No": "",
      "ControlName": formRawVal.Name,
      "Description": this.form.value.Description,
      "ModuleGroupping": this.form.value.Category,
      "SubModuleGroupping": this.form.value.Subcategory,
      "ModuleName": this.ModulenameDisplay,
      "ActionList": this.form.value.Action ? this.form.value.Action : [],
      "Actionable": this.form.value.ModuleName,
      "ModuleId": this.form.value.ModuleName
    }

    if (this.HubId == null && this.tabValue.length == 0) {
      let arrval = []
      this.tabKey = []
      arrval.push(b);
      this.tabValue = arrval;


      for (var key in this.tabValue[0]) {
        if (this.tabValue[0].hasOwnProperty(key)) {
          if (key !== 'ModuleId') {
            this.tabKey.push(key);
          }
        }
      }
      this.common.reportTabKeyData(this.tabKey);




      var unselectedfield = ['ControlName', 'Description']


      this.selctedField = this.tabKey.filter(
        (field) => !unselectedfield.includes(field)
      );

      this.unSelctedField = this.tabKey.filter(
        (field) => unselectedfield.includes(field)
      );



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

    }
    else {
      this.tabValue.push(b)
    }


    this.tableloop.push(a)
    this.form.get('Category').reset()
    this.form.get('Subcategory').reset()
    this.form.get('ModuleName').reset()
    this.form.get('Action').reset()
  }



  removeItem(i: number) {
    this.common.hubControlEvent('Privilege', 'click', '', '', i, 'removeItem');

    this.tableloop.splice(i, 1);


  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
  dropValue() {
    this.common.hubControlEvent('Privilege', 'click', '', '', '', 'dropValue');

    if (this.categories.length > 0) {
      this.isDropDown = true;
    } else {
      this.isDropDown = false;
    }
  }

  resetfunc() {
    this.tableloop = []
    this.tabValue = []
    this.hasChecked = []
    this.form.reset();
  }

  // EditActionListTable(value) {
  //   this.loader = true;

  //   this.requestObj = {
  //     data: {
  //       spname: 'usp_unfyd_module_action_list',
  //       parameters: {
  //         flag: 'GET',
  //         moduleid: value.ModuleId,
  //         productid: this.userDetails.ProductId,
  //         processid: this.userDetails.Processid
  //       },
  //     },
  //   };

  //   this.api.post('index', this.requestObj).subscribe(res => {
  //     if (res.code == 200) {
  //       this.loader = false;
  //       this.EditActionTable = res.results.data;

  //       this.form.controls.EditActionTableValue.patchValue(value.ActionList)

  //       this.form.updateValueAndValidity();
  //       this.click();
  //       // this.mySelect.trigger.nativeElement.click();
  //     }
  //   })
  // }



  EditActionListTable(value) {
    this.loader = true;

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_module_action_list',
        parameters: {
          flag: 'GET',
          moduleid: value.ModuleId,
          productid: this.userDetails.ProductId,
          processid: this.userDetails.Processid
        },
      },
    };

    this.api.post('index', this.requestObj).subscribe(res => {


      if (res.code == 200) {
        this.loader = false;
        this.EditActionTable = res.results.data;

        this.form.controls.EditActionTableValue.patchValue(value.ActionList)

        this.form.updateValueAndValidity();
        // this.click();
        // this.mySelect.trigger.nativeElement.click();
      }
           
    })
  }



  SAVEEditActionListTable(data) {
    this.tabValue.forEach(element => {
      if (element.ModuleId == data.ModuleId) {
        element.ActionList = []
        element.ActionList = this.form.value.EditActionTableValue
      }

    });
  }

  DeleteAction(data) {


    let id = data.ModuleId

    let indx = this.tabValue.findIndex(v => v.Actionable === id);
    this.tabValue.splice(indx, indx >= 0 ? 1 : 0);


  }

  // openMenu() {
  //   this.trigger.openMenu();
  // }

  // closeMenu() {
  //   this.trigger.closeMenu();
  // }

  ShowAddMoreModuleForm() {
    this.ShowAddModule = true;
  }

  CancelAddMoreModuleForm() {
    this.ShowAddModule = false;
  }


  EditAddMoreModuleForm() {
    this.EditAddModule = !this.EditAddModule;
  }


  click() {
    this.mySelect.open();
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

      if (by == 'Created On' || by == 'Modified On') {
        let x=this.tabValue.filter(n => n[by])
        let k=this.tabValue.filter(n => n[by]==null)
        let s=this.tabValue.filter(n => n[by]=='')
        let y = x.sort((a, b) => {
            const dateA = moment(a[by], this.format);
            const dateB = moment(b[by], this.format);
            return dateA.valueOf() - dateB.valueOf();
        });
          this.tabValue=[...y, ...k, ...s]
          this.count = !this.count
          this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
          return
      }

      if (by == 'ActionList') {
        this.tabValue.sort(function (a, b) {
          if (a[by] > b[by]) {
              return -1;
          }
          if (b[by] > a[by]) {
              return 1;
          }
          return 0;
      });
        this.count = !this.count
        this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
        return
    }
      let x=this.tabValue.filter(n => n[by])
        let k=this.tabValue.filter(n => n[by]==null)
        let s=this.tabValue.filter(n => n[by]=='')
        let y=x.sort((a, b) =>a[by].localeCompare(b[by]))
        this.tabValue=[...y, ...k, ...s]
        this.count = !this.count
        this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
   
  }

  toggleSelection(change: MatCheckboxChange): void {
    
    if (change.checked) {
      this.form.controls['Action'].patchValue(this.action.map(data => data.ActionList));
      this.form.updateValueAndValidity()
      
    } else {
      this.form.controls['Action'].patchValue('');
      this.form.updateValueAndValidity()
    }
  }


}


