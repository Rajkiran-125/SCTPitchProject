import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatMenuTrigger } from '@angular/material/menu';
import { TreeData } from 'src/app/global/treeService/tree-data.model';
import { TreeDataService } from 'src/app/global/treeService/tree-data.service';
import { TreeFunctionService } from 'src/app/global/treeService/tree-function.service';
import { of as observableOf } from 'rxjs';
import moment from "moment";
import { Console } from 'console';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Subscription } from "rxjs";


interface TreeNode {
  Label: string;
  MenuKey: string;
  children?: TreeNode[];
  ChildControls?: any;

}

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
  providers:[
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, deps:[CommonService], useFactory:(common:CommonService)=>{
      let a :any= {
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


      common.localizationInfo$.subscribe((res1)=>{
            a.display.dateInput = res1.selectedDateFormats.toUpperCase()
      })


      common.localizationDataAvailable$.subscribe((res)=>{
        if(res){
          common.localizationInfo$.subscribe((res1)=>{
            a.display.dateInput = res1.selectedDateFormats.toUpperCase()
          })
        }
       })

      return a

    } }
  ]
})
export class AppSettingsComponent implements OnInit {

  form: FormGroup;
  dialogConfig: any;
  productType: any = [];
  productData: any = '';
  loader = false;
  panelOpenState = false;
  playNotificationSound = false;
  hideToggle = false;
  requestobj: {};
  edit: boolean = false;
  childData = [];
  userDetails: any;
  nestedTreeControl: NestedTreeControl<TreeData>;
  nestedDataSource: MatTreeNestedDataSource<TreeData>;
  gettreeList: any = [];
  IsChildAvail: boolean = true;
  dummyValues: any = {};
  innerHTML: string;
  requestObj: {};
  productName: any;
  productid: any = '';
  parentcontrolid: bigint;
  parentModule: any = [];
  childModule: boolean = false;
  lblParentModule: string = '';
  dateFormat: any;
  DateForm: FormGroup;
  minDate = new Date();
  // maxDate = new Date();

  showSpinners: true;
  showSeconds: false;
  disableMinute: false;
  touchUi: false;
  hideTime: false;
  enableMeridian: false;
  color: "primary";
  stepHour: 1;
  stepMinute: 0;
  stepSecond: 0;
  isDisabled = true;
  show: boolean = true;
  darkblue :boolean = false;
  green:boolean = false;
  blue :boolean = false;
  orange:boolean = false;
  darktheme:boolean = false;
  customize:boolean = false;
  defaultcheckbox:boolean = false;
  themeid :any;
  customizethemecolorimage: any;
  timecontrolval: any;
  momentDate: any;
  productidvalue: any;
  nodeIdexpandbutton: any;
  changeModuleDisplayName: string;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  userConfig: any;
  labelName: any;
  todayDate: Date = new Date();
  maxDate = new Date();
  isChecked: any = [];
  themeName: any = ['darkbluetheme','greentheme','bluetheme','orangetheme','darktheme','customizetheme'];

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private auth: AuthService,
    private api: ApiService,
    public common: CommonService,
    private router: Router,
    private dataService: TreeDataService,
    private service: TreeFunctionService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.common.hubControlEvent('AppSettings','click','pageload','pageload','','ngOnInit');
    this.userDetails = this.auth.getUser();
    for (let i = 0; i < 6; i++) {
      this.isChecked.push(false)
    }
    this.form = this.fb.group({
      playNotificationSound: this.fb.control(false),
      // starttime: ['', Validators.nullValidator],
    });
    this.nestedTreeControl = new NestedTreeControl<TreeData>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.dataService._dataChange.subscribe(
      data => (this.nestedDataSource.data = data)
    );
    this.getProducts();
    this.subscription.push(
    this.common.getMasterConfig$.subscribe((data) => {
      this.dateFormat = data.DatePickerFormat;
    })
    )
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))

    this.setLabelByLanguage(localStorage.getItem("lang"))
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.common.setUserConfig(this.userDetails.ProfileType, 'AppSettings');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.subscription.push(
    this.common.localizationDataAvailable$.subscribe((res)=>{
      if(res){
        this.common.localizationInfo$.subscribe((res1)=>{
          this.form.updateValueAndValidity();
        })
      }
     })
    )
    this.DateForm = this.fb.group({
      Date: [moment()],
    });

    this.changeModuleDisplayName=this.common.changeModuleLabelName()

    this.common.hubControlEvent('AppSettings','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false
      this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'AppSettings', data)

  }

  getProducts() {
    this.common.hubControlEvent('AppSettings','click','','','','getProducts');

    this.productType = JSON.parse(localStorage.getItem('products'))

    this.activatedRoute.queryParams.subscribe(params => {
     if(params.productid)
      {
      this.productName = parseInt(params.productid);
      }
      else{
        this.productName = this.productType.Id;
      }
    })

    this.getApp(this.productName,null)
  }
  getApp(event,isSelect,mode?) {
    this.childModule = false;
    this.IsChildAvail = false;
    this.productidvalue = event;
    this.loader = true
    // this.edit=false

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_app_settings',
        parameters: {
          flag: 'GET_TREE_MODULE',
          processid: this.userDetails.Processid,
          productid: event,
        },
      },
    };
    this.common.hubControlEvent('AppSettings','click','','',JSON.stringify(this.requestObj),'getApp');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.gettreeListData(res)
      if (res.code == 200) {
        this.loader = false;
        if(mode == 'toggle'){
          this.edit = false;
        }
      //  else if(mode == 'toggle'){
      //     this.edit = true
      //   }

        let resloop = res.results.data
        resloop.forEach(element => {
          if(element.ConfigKey == 'theme' || element.LabelName == 'Themes')
          {

            let thid = element.Id
            this.themeid=thid;
          }

         if(element.ConfigKey == 'darkbluetheme'){
          this.darkblue = element.Status;
          // this.defaultcheckbox = element.DefaultValue;
          this.isChecked[0] = element.DefaultValue;

         }
         if(element.ConfigKey == 'greentheme'){
          this.green = element.Status;
          this.isChecked[1] = element.DefaultValue;

         }
         if(element.ConfigKey == 'bluetheme'){
          this.blue = element.Status;
          this.isChecked[2] = element.DefaultValue;

         }
         if(element.ConfigKey == 'orangetheme'){
          this.orange = element.Status;
          this.isChecked[3] = element.DefaultValue;

         }
         if(element.ConfigKey == 'darktheme'){
          this.darktheme = element.Status;
          this.isChecked[4] = element.DefaultValue;

         }
         if(element.ConfigKey == 'customizetheme'){
          this.customize = element.Status;
          this.isChecked[5] = element.DefaultValue;
          this.customizethemecolorimage = element.AssignedValue;
         }
        });
      }
    });
  }


  hasChild = (_: number, node: TreeNode) => !!node.ChildControls && node.ChildControls.length > 0;
  getHTMLControl(node) {
    this.common.hubControlEvent('AppSettings','click','','',JSON.stringify(node),'getHTMLControl');

    switch (node.ControlType) {
      case node.ControlType == 'Textbox': {
        this.innerHTML = '<input autocomplete="off" type="text" style="margin-right: 10px;margin-top: -3px;border: 1px solid #ccc;border-radius: 5px; max-width:50px;" matInput />';
        break;
      }
      case node.ControlType == 'Toggle': {
        this.innerHTML = '<mat-slide-toggle color="primary" class="toggleBtn" (change)="UpdateStatus(node.Id,$event)" checked={{node.Status}}>';
        break;
      }
      case node.ControlType == 'Dropdown': {

        break;
      }
      case node.ControlType == 'Number': {

        break;
      }
      case node.ControlType == 'DatePicker': {

        break;
      }
      case node.ControlType == 'TimeControl': {

        break;
      }
      case node.ControlType == 'DateTime': {

        break;
      }
      case node.ControlType == 'Multicheckbox': {

        break;
      }
      default: {
        this.innerHTML = '';
        break;
      }

        return this.innerHTML;
    }
  }

  gotoThemeComponent(themeName: any) {
    this.common.hubControlEvent('AppSettings','click','','',JSON.stringify(themeName),'gotoThemeComponent');

    this.router.navigate(['/masters/branding/theme/view/', themeName,this.productName]);
  }

  addApp() {
    this.common.hubControlEvent('AppSettings','click','','','','addApp');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'appSetting',
        productId: this.productName
      },
      width: '850px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== false) {
        var ParentMod = { "LabelName": "", "Id": this.parentcontrolid };
        this.getTreeModule(ParentMod);
      }
    });

  }
  private _getChildren = (node: TreeData) => observableOf(node.Children);
  hasNestedChild = (_: number, nodeData: TreeData) => nodeData.Children.length > 0;

  openContextMenu(


    event: MouseEvent,
    trigger: MatMenuTrigger,
    triggerElement: HTMLElement
  ) {
    this.common.hubControlEvent('AppSettings','click','','',JSON.stringify(event),'openContextMenu');

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

  gettreeListData(res) {
    this.gettreeList = res.results.data;
    if(res.results.data.length > 0){
      this.gettreeList = res.results.data;
    var treeList = JSON.parse(JSON.stringify(this.gettreeList))
    let result1 = treeList.map(item => {
      if (item.ParentId != null) {
        var ConfigValue, assignedValue, assignedValue1, assignedValue2;
        if (item.ControlType == 'Dropdown') {
          if (item.ConfigValue != undefined) {
            ConfigValue = JSON.parse(JSON.parse(JSON.stringify(item?.ConfigValue)));
          }
        } else {
          ConfigValue = item.ConfigValue;
        }
        if (item.ControlType == 'MultiSelect') {
          if (item.ConfigValue != undefined) {
            ConfigValue = JSON.parse(JSON.parse(JSON.stringify(item?.ConfigValue)));
          }
          assignedValue = (item.AssignedValue).split(',');
        } else if ((item.ControlType == 'Textbox') ) {
          if(item.AdditionalProperty == 1){
            assignedValue = item.AssignedValue;
          } else if (item.AdditionalProperty == 2){
            assignedValue = (item.AssignedValue).split('+')[0];
            assignedValue1 = (item.AssignedValue).split('+')[1];
          } else {
            assignedValue = (item.AssignedValue).split('+')[0];
            assignedValue1 = (item.AssignedValue).split('+')[1];
            assignedValue2 = (item.AssignedValue).split('+')[2];
          }
        }  else if (item.ControlType == 'TimeControl') {
          console.log(item?.AssignedValue);
          let time = {
            hour : 0,
            minute : 0,
            second : 0
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
            console.log("bbb:",assignedValue);
          } else {
            assignedValue = time;
            console.log("bbb:",assignedValue);
          }
        }else {
          assignedValue = item.AssignedValue;
        }
        return { Id: item.Id, Name: item.LabelName, ParentId: item.ParentId, Children: [], Icon: item.Icon, AssignedProperty: item.AssignedPropertyText, AssignedPropertyLabel: item.AssignedPropertyLabel, Status: item.Status, ControlType: item.ControlType, AssignedValue: assignedValue, AssignedValue1: assignedValue1,AssignedValue2: assignedValue2, ConfigKey: item.ConfigKey, ConfigValue: ConfigValue, Type: item.Type, AdditionalProperty: item.AdditionalProperty }
      } else {
        var ConfigValue, assignedValue, assignedValue1, assignedValue2;
        if (item.ControlType == 'Dropdown') {
          if (item.ConfigValue != undefined) {
            ConfigValue = JSON.parse(JSON.parse(JSON.stringify(item?.ConfigValue)));
          }
        } else {
          ConfigValue = item.ConfigValue;
        }
        if (item.ControlType == 'MultiSelect') {
          if (item?.ConfigValue) {
            ConfigValue = JSON.parse(JSON.parse(JSON.stringify(item?.ConfigValue)));
          }
          assignedValue = (item.AssignedValue).split(',');
        } else if ((item.ControlType == 'Textbox')) {
          if(item.AdditionalProperty == 1){
            assignedValue = item.AssignedValue;
          } else if (item.AdditionalProperty == 2){
            assignedValue = (item.AssignedValue).split('+')[0];
            assignedValue1 = (item.AssignedValue).split('+')[1];
          } else if (item.AdditionalProperty == 3){
            assignedValue = (item.AssignedValue).split('+')[0];
            assignedValue1 = (item.AssignedValue).split('+')[1];
            assignedValue2 = (item.AssignedValue).split('+')[2];
          }
        } else if (item.ControlType == 'TimeControl') {
          console.log(item?.AssignedValue);
          let time = {
            hour : 0,
            minute : 0,
            second : 0
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
            console.log("bbb:",assignedValue);
          } else {
            assignedValue = time;
            console.log("bbb:",assignedValue);
          }
        }else {
          assignedValue = item.AssignedValue;
        }
        return { Id: item.Id, Name: item.LabelName, Children: [], Icon: item.Icon, AssignedProperty: item.AssignedPropertyText, AssignedPropertyLabel: item.AssignedPropertyLabel, Status: item.Status, ControlType: item.ControlType, AssignedValue: assignedValue, AssignedValue1: assignedValue1, AssignedValue2: assignedValue2, ConfigKey: item.ConfigKey, ConfigValue: ConfigValue, Type: item.Type, AdditionalProperty: item.AdditionalProperty}
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
    } else{
      this.nestedDataSource.data = [];
    }


  }

  addSetting(node) {
    this.common.hubControlEvent('AppSettings','click','','',node,'addSetting');

    var product: any;
    this.productType.forEach(element => {
      if (element.Id == this.productName) {
        product = element.ProductName;
      }
    });
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'addAppSetting',
        parentnode: node.Name,
        parentcontrolid: node.Id,
        productName: product,
        productId: this.productName
      },
      width: '850px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res !== false) {
        var ParentMod = { "LabelName": "", "Id": this.parentcontrolid };
        this.getTreeModule(ParentMod);
      }
    });

  }

  editTreeNode(node) {
    this.common.hubControlEvent('AppSettings','click','','',node,'editTreeNode');

    var product: any;
    this.productType.forEach(element => {
      if (element.Id == this.productName) {
        product = element.ProductName;
      }
    });
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'editTreeNode',
        Name: node.Name,
        Id: node.Id,
        parentcontrolid: node.ParentId == undefined ? this.parentModule.Id : node.ParentId,
        Icon: node.Icon,
        configKey: node.ConfigKey,
        nodeId: node.Id,
        status: node.Status,
        controlType: node.ControlType,
        configValue: node.ConfigValue,
        AdditionalProperty : node.AdditionalProperty
      },
      width: '750px',
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res !== false) {
        var ParentMod = { "LableName": "", "Id": this.parentcontrolid };
        this.loader = false;
        this.getTreeModule(ParentMod);
      }
    })
  }
  getTreeModule(parentmod) {
    this.loader = true;
    this.childModule = true;
    this.lblParentModule = parentmod.ModuleName;
    this.parentcontrolid = parentmod.Id;
    this.parentModule.ModuleName = parentmod.ModuleName;
    this.parentModule.Id = parentmod.Id;

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_app_settings",
        "parameters": {
          flag: "GET_TREE_MODULE",
          processid: this.userDetails.Processid,
          productid: this.productName,
          parentcontrolid: this.parentcontrolid
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200 ) {
        this.loader = true;
        this.gettreeListData(res);
        if( res.results.data.length > 0){ this.IsChildAvail = true;}
        else {
          this.loader = false;
          this.IsChildAvail = false;
        }
      }

    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = false;
      })
  }


  deleteNode(nodeToBeDeleted: TreeData) {
    this.common.hubControlEvent('AppSettings','click','','',nodeToBeDeleted,'deleteNode');
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
            spname: "usp_unfyd_app_settings",
            parameters: {
              flag: 'DELETE',
              ID: nodeToBeDeleted.Id,
              DELETEDBY: this.userDetails.Id,
            }
          }
        }
        this.common.hubControlEvent('AppSettings','click','','',JSON.stringify(obj),'deleteNode');

        this.api.post('index', obj).subscribe((res: any) => {
          if (res.code == 200) {
            this.loader = false;
            if(res.results.data[0].result=='Data deleted successfully'){
            this.common.snackbar('Delete Record');
          }
          var ParentMod = { "LabelName": "", "Id": this.parentcontrolid };
          this.getTreeModule(ParentMod);

          }
        });
      }
      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });

    }
    ))
  }

  updateChildModule() {
    this.loader = true;
    this.childData = Object.keys(this.dummyValues)

    let childatalength = this.childData.length;
    for (let i in this.childData) {
      var assign = this.dummyValues[this.childData[i]].AssignedValue == undefined ? '' : this.dummyValues[this.childData[i]].AssignedValue;
      var assign1 = this.dummyValues[this.childData[i]].AssignedValue1 == undefined ? '' : this.dummyValues[this.childData[i]].AssignedValue1;
      var assign2 = this.dummyValues[this.childData[i]].AssignedValue2 == undefined ? '' : this.dummyValues[this.childData[i]].AssignedValue2;
      var tempAssign = '';
      if(assign2 == '' && assign1 == ''){
        tempAssign = assign;
      } else if (assign2 == ''){
        tempAssign = assign +'+'+ assign1;
      } else if(assign1 == ''){
        tempAssign = assign;
      }else{
        tempAssign = assign +'+'+ assign1 +'+'+ assign2;
      }
      var AssignedValue = (this.dummyValues[this.childData[i]].ControlType == 'MultiSelect' ? this.dummyValues[this.childData[i]].AssignedValue.join(',')
        : (this.dummyValues[this.childData[i]].ControlType == 'Textbox')
          ? tempAssign: this.dummyValues[this.childData[i]].AssignedValue)

      if(this.dummyValues[this.childData[i]].ControlType == 'TimeControl'){
        let a;
        a = JSON.parse(JSON.stringify(this.dummyValues[this.childData[i]].AssignedValue));
        // let hour = (this.dummyValues[this.childData[i]].AssignedValue).hour.tostring()

        // let hour1 = new Date(this.dummyValues[this.childData[i]].AssignedValue).getHours()
        // let minute1 = new Date(this.dummyValues[this.childData[i]].AssignedValue).getMinutes()
        // let second1 = new Date(this.dummyValues[this.childData[i]].AssignedValue).getSeconds()
        let hour1 = a.hour.toString()
        let minute1 = a.minute.toString()
        let second1 = a.second.toString()
        a = hour1.padStart(2,"0") + ":" + (minute1).padStart(2,"0") + ":" + (second1).padStart(2,"0")
        // let time2 = (hour1) + ':' + (minute1) + ':' + second1
        var AssignedValue :any= a;
      }

      let obj = {
        data: {
          spname: "usp_unfyd_app_settings",
          parameters: {
            flag: 'UPDATE_MODULE_DATA',
            assignedvalue: AssignedValue,
            id: this.dummyValues[this.childData[i]].Id,
            STATUS : this.dummyValues[this.childData[i]].Status
          }
        }
      }
      this.common.hubControlEvent('AppSettings','click','','',JSON.stringify(obj),'updateChildModule');


      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200 && res.results.data.length > 0) {
          childatalength--;
         if(childatalength == 0){
          if(res.results.data[0].result=='Data updated successfully')
          this.common.snackbar('Update Success');
           }
          var ParentMod = { "LabelName": "", "Id": this.parentcontrolid };
          this.loader = false;
          this.getTreeModule(ParentMod);
          this.edit = false;

        }
      });
    }
  }

  flip(Id) {
    this.common.hubControlEvent('AppSettings','click','','',Id,'flip');

    this.dummyValues[Id].Status = !this.dummyValues[Id].Status;
  }

  themetoggle(thval){
  }


  UpdateStatus(Id,event,parentid,node,mode?){
   console.log(parentid);

    // if(parentid == undefined|| parentid == null){
      if(event.checked == false){
        this.nodeIdexpandbutton = Id
        this.nestedTreeControl.collapse(node);
          }
        this.nestedDataSource.data.forEach(element => {
       if(element.Id == Id){
        if(element.Children){
          element.Children.forEach((childobj:any) => {
            if(event.checked == false)
            {
              if(childobj.Children.length > 0){

                childobj.Children.forEach((childobj2:any) => {
                  this.dummyValues[childobj2.Id].Status = false;
                  if(childobj2.Children.length > 0){
                    childobj2.Children.forEach((childobj3:any) => {
                      this.dummyValues[childobj3.Id].Status = false;
                     })
                    }
                })
                this.dummyValues[childobj.Id].Status = false;
              }
              else{

                this.dummyValues[childobj.Id].Status = false;
              }
            }
          })
        }
       }
      })
    // }
    this.requestObj={
      "data":{
      "spname":"usp_unfyd_app_settings",
        "parameters":{
          flag:"UPDATE_MODULE_STATUS",
          id:Id,
          status:event.checked,
          modifiedby: this.userDetails.Id,
        }
      }
    }
    this.common.hubControlEvent('AppSettings','click','','',JSON.stringify(this.requestObj),'UpdateStatus');

    this.api.post('index',this.requestObj).subscribe((res:any) => {
      if(res.code == 200){

        if(parentid == undefined|| parentid == null){
        this.getApp(this.productName,null)}
        if(res.results.data[0].result=='Status updated successfully')
        this.common.snackbar('Update Success');
      }
    },
    (error)=>{
      this.common.snackbar("General Error");
    })
  }


  themechange(confkey,event){
    this.requestObj={
      "data":{
        "spname":"usp_unfyd_app_settings",
        "parameters":{
          flag:"UPDATE_THEME_STATUS",
          CONFIGKEY:confkey,
          status:event,
          PRODUCTID:this.productName
        }
      }
    }
    this.common.hubControlEvent('AppSettings','click','','',JSON.stringify(this.requestObj),'themechange');

    this.api.post('index',this.requestObj).subscribe((res:any) => {
      if(res.code == 200){
        this.common.snackbar(res.results.data[0].result, "success");
      }
    },
    (error)=>{
      this.common.snackbar("General Error");
    })

  }



  defaultcheckboxdarkblue(confkey,event){
    let themeID = Object.values(this.dummyValues).find(obj => obj['ConfigKey'] === confkey);

    this.requestObj={
      "data":{
        "spname":"usp_unfyd_app_settings",
        "parameters":{
          flag:"UPDATE_DEFAULTVALUE",
          CONFIGKEY:confkey,
          DEFAULTVALUE:event,
          id: themeID['Id'],
          PRODUCTID:this.productName
        }
      }
    }
    this.common.hubControlEvent('AppSettings','click','','',JSON.stringify(this.requestObj),'defaultcheckboxdarkblue');

    this.api.post('index',this.requestObj).subscribe((res:any) => {
      if(res.code == 200 && event == true){
        this.common.snackbar("DefaultTheme");
      }
    },
    (error)=>{
      this.common.snackbar("General Error");
    })

  }
  setEditFalse() {

    this.edit = true;
  }
  changeEdit() {
    this.edit = !this.edit;
  }

  setcheckbox(index){
    for (let i = 0; i < this.isChecked.length; i++) {
      if (i == index) {
        this.isChecked[index] = true
        this.defaultcheckboxdarkblue(this.themeName[i],this.isChecked[index])
      } else {
        this.isChecked[i] = false
        this.defaultcheckboxdarkblue(this.themeName[i],this.isChecked[i])
      }
    }
  }

ngOnDestroy() {
  if(this.subscription){
    this.subscription.forEach((e) => {
      e.unsubscribe();
    });
  }
}

}

