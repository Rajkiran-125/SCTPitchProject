import { DatePipe } from '@angular/common';
import { orderBy } from 'lodash';
import { ApiService } from 'src/app/global/api.service';
import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormGroupDirective } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AuthService } from 'src/app/global/auth.service';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { regex, masters, checknull, checknull1 } from 'src/app/global/json-data';
import moment from 'moment';
import { I } from '@angular/cdk/keycodes';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss'],
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
export class BroadcastComponent implements OnInit {
  submittedForm = false;
  broadcastId: any;
  form: FormGroup;
  loader: boolean = false;
  @Input() productName: any;
  path: any;
  editObj: any;
  userConfig: any;
  requestObj: any;
  todayDate: Date = new Date();
  maxDate = new Date();
  reset: boolean;
  labelName: any;
  userDetails: any;
  broadCat = [];
  productType: any = [];
  broadPriority = [];
  tabKey: any = [];
  tabValue: any = [];
  page: number = 1;
  currentpage: number = 1;
  itemsPerPage: number = 8;
  paginationArray: any = [];
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  search: any;
  filter: any;
  getGroupList: any = [];
  public filteredList3 = this.getGroupList.slice();
  category: any = [];
  labelNameStore: any;
  LabelNameStore: any;
  type:any = 'broadcast';
  IsDateGreater: boolean = false;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  public filteredList2 = this.broadPriority.slice()
  public filteredList1 = this.broadCat.slice();
  // @Input() isDialog: boolean = false;
  // subscriptionAcitivateData: Subscription[] = [];

  config = {
    placeholder: '',
    tabsize: 1,
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['fontsize', ['fontname']],
      ['style', ['bold', 'underline', 'italic',]],
      ['para', ['ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table']],
      ['font', ['clear']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  }
  categoryList: any;
  changeModuleLabelDisplayName: string;
  Product: any;
  parser = new DOMParser();
  @Input() data: any;
  ModuleGroupping: any= [];
  subscriptionAcitivateData: Subscription[] = [];
  @Input() isDialog: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    public common: CommonService,
    public dialog: MatDialog,
    private el: ElementRef,
     private datePipe: DatePipe,
    private api: ApiService,
    public dialogRef: MatDialogRef<DialogComponent>,
  ) { }

  ngOnInit(): void {
    this.tabKey=[];
    this.tabValue=[];
    this.common.hubControlEvent('broadcast','click','pageload','pageload','','ngOnInit');
    this.userDetails = this.auth.getUser();
    const currentYear = new Date().getFullYear();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))


    this.common.setUserConfig(this.userDetails.ProfileType, 'broadcast');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.labelNameStore = JSON.parse(localStorage.getItem('menu'))
    this.getGroupType();
    this.getProducts();
    this.feildChooser();
    this.getFilter();
    var menu = JSON.parse(localStorage.getItem('menu'))
    var parent_menu = localStorage.getItem('parent_menu')
    var isChild = menu.filter(function (item) { return (item.ModuleGroupping == parent_menu) })[0].Keys;

    this.ModuleGroupping = isChild.map(function(elem){
      return elem.Modulename  })

    this.broadcastId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.broadcastId) {
      this.getbroadcast('null');
    }
    this.activatedRoute.queryParams.subscribe(params => {
    this.broadcastId = params.Id;
    this.filter = params.filter;
    if(params.productID) this.productName = params.productID
      if (this.filter == 'addbroadcast' || this.filter == 'editbroadcast') {

        this.broadcastform();
      }
      this.getFilter()
    })
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.broadCat = JSON.parse(data["Broadcast Category"]);
          this.broadPriority = JSON.parse(data["Broadcast Priority"])
          this.filteredList2 = this.broadPriority.slice()
          this.filteredList1 = this.broadCat.slice();
        }
      })
    )

  //   this.subscription.push(this.common.reloadData$.subscribe(res => {
  //     if (res) {
  //       this.getbroadcast();
  //     }
  // }));

  this.subscription.push(this.common.reloadData$.subscribe((data) => {
      if(data == true){
        this.getbroadcast('null');
        this.hasChecked= [];
      }
    }))


    this.LabelNameStore = ''
    this.labelNameStore.forEach(element1 => {
      if (element1.hasOwnProperty('Keys')) {
        if (element1.Keys.length > 0) {
          element1.Keys.forEach(element2 => {
            if (this.router.url.toLowerCase().includes(element2.ModuleUrl.toLowerCase())) {
              this.LabelNameStore = element2.DisplayName

            }
          })
        }
        else if (this.router.url.toLowerCase().includes(element1.parantModuleUrl.toLowerCase())) {
          this.LabelNameStore = element1.DisplayName
        }
      }
    })

    this.changeModuleLabelDisplayName = this.common.changeModuleLabelName()
    this.common.hubControlEvent('Greetings','click','pageloadend','pageloadend','','ngOnInit');

  }
  selectedProduct(event) {
    this.common.hubControlEvent('broadcast','click','productName','productName',JSON.stringify(event),'selectedProduct');
    this.productName = event;
    this.getbroadcast('select');
    this.hasChecked=[]
  }
  broadcastform() {
    this.form = this.formBuilder.group({
      Category: ['', Validators.required],
      Header:['', [Validators.required,Validators.pattern(regex.alphabetwithspaceandhypen)]],
      Message: ['', Validators.nullValidator],
      UserGroup: ['', Validators.required],
      Priority: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required]

    }
    ,{validator:[checknull1('Header')]})

    if (this.filter == 'editbroadcast') {
      this.reset = true;
      var Obj = {
        data: {
          spname: "usp_unfyd_broadcast",
          parameters: {
            flag: "EDIT",
            Id: this.broadcastId
          }
        }
      }
      this.common.hubControlEvent('broadcast','click','EDIT','EDIT',JSON.stringify(Obj),'broadcastform');
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.editObj = res.results.data[0]

          let arrval = this.editObj.UserGroup
          let finalval  = arrval.split(',')
          this.form.controls.Category.patchValue(this.editObj.Category)
          this.form.controls.Header.patchValue(this.editObj.Header)
          this.form.controls.Message.patchValue(this.editObj.Message)
          this.form.controls.UserGroup.patchValue(arrval.split(','));
          this.form.controls.Priority.patchValue(this.editObj.Priority)
          this.form.controls.StartDate.patchValue(moment(this.editObj.StartDate));
          this.form.controls.EndDate.patchValue(moment(this.editObj.EndDate));
          this.todayDate = new Date(this.editObj.StartDate);
          this.form.updateValueAndValidity();
        }
      })
    }
  }


  deletebroadcast(id) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
   this.subscriptionBulkDelete.push(
      this.common.getIndividualUpload$.subscribe(status => {
    if(status.status){
      this.requestObj = {
        data: {
          spname: "usp_unfyd_broadcast",
          parameters: {
              FLAG: 'DELETE',
              ID: id,
              DELETEDBY: this.userDetails.id,
          },
      },
      }
      this.common.hubControlEvent('broadcast','click','Icon','DELETE',JSON.stringify(this.requestObj),'deletebroadcast');
      this.api.post("index", this.requestObj).subscribe(
        (res) => {
          if (res.code == 200) {
            this.loader = false;
            // this.common.snackbar(res.results.data[0].result, "success")
            this.common.snackbar("Delete Record");
            this.getbroadcast('null');
            this.hasChecked=[]
          } else {
            this.loader = false;
            // this.common.snackbar("Something went wrong.", "error");
          }
        },
      )
    }

    this.subscriptionBulkDelete.forEach((e) => {
      e.unsubscribe();
    });
    }
    )
  )

  }

  getbroadcast(event) {
    this.tabValue = [];
    this.tabKey = [];
    this.common.broadcastproductid$.subscribe(data => {
      this.productName = data
    });


    if(event == 'select')
    {

    }
    else{
      this.activatedRoute.queryParams.subscribe(params => {
        if(params.Product)
        {

         this.productName = parseInt(params.Product)

          // console.log('this.productName', this.productName )

        }
      })
    }



    this.loader = true;
    var obj = {
      data: {
        spname: 'usp_unfyd_broadcast',
        parameters: {
          flag: 'GET',
          PRODUCTID: this.productName,
          PROCESSID: this.userDetails.Processid,
        }
      }
    }
    this.common.hubControlEvent('broadcast','click','GET','GET',JSON.stringify(obj),'getbroadcast');
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.tabValue = res.results.data;

        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
        // this.common.reportTabKeyData(this.tabKey);
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = true;
      })

  }
  getProducts() {
    this.common.hubControlEvent('broadcast','click','products','products','','getProducts');
    this.productType = JSON.parse(localStorage.getItem("products"));
    this.productName = this.productType.Id;
  }




  getGroupType() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "GROUP",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('broadcast','click','GROUP','GROUP',JSON.stringify(this.requestObj),'getGroupType');
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.getGroupList = res.results['data'];
      this.getGroupList.sort((a, b) => (a.GroupName.toUpperCase() > b.GroupName.toUpperCase()) ? 1: -1);
      this.filteredList3 = this.getGroupList.slice();
    })
  }
  pageChange(currentpage) {
    this.common.hubControlEvent('broadcast','click','GROUP','GROUP',JSON.stringify(currentpage),'pageChange');
    this.currentpage = currentpage;
  }



  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'broadcast', data)

  }

  getFilter() {
    this.common.hubControlEvent('broadcast','click','GROUP','GROUP','','getFilter');
    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
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
          modulename: 'broadcast',
          language: localStorage.getItem('lang')
        }
      }
    }
    this.common.hubControlEvent('broadcast','click','GET','GET',JSON.stringify(obj),'feildChooser');
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
    },
      (error) => {
      })
  }
  submit(event,formDirective: FormGroupDirective): void {
    // alert(this.productName)

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
      // this.common.snackbar("General Error");
      return;
    }

    let starts = new Date(this.form.value.StartDate)
    let Ends = new Date(this.form.value.EndDate)
    if(starts >= Ends)
    {
    this.IsDateGreater = true;
    this.loader = false;
    return
    }
    else{
      this.IsDateGreater = false;
    }

    this.activatedRoute.queryParams.subscribe(params => {
      this.broadcastId = params.Id})
      let UserGroupval = this.form.value.UserGroup
    if (this.broadcastId == null) {


      this.requestObj = {
        data: {
          spname: "usp_unfyd_broadcast",
          parameters: {
            FLAG: 'INSERT',
            CATEGORY: this.form.value.Category,
            HEADER: this.form.value.Header.trim(),
            MESSAGE: this.form.value.Message,
            USERGROUP: UserGroupval.join(),
            PRIORITY: this.form.value.Priority,
            STARTDATE: this.datePipe.transform(this.form.value.StartDate, 'yyyy-MM-dd HH:mm:ss'),
            ENDDATE: this.datePipe.transform(this.form.value.EndDate, 'yyyy-MM-dd HH:mm:ss'),
            PRODUCTID: this.productName,
            PROCESSID: this.userDetails.Processid,
            CREATEDBY: this.userDetails.Id,
            PRIVATEIP: "",
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_broadcast",
          parameters: {
            FLAG: 'UPDATE',
            ID: this.broadcastId,
            MODIFIEDBY: this.userDetails.Id,
            CATEGORY: this.form.value.Category,
            HEADER: this.form.value.Header.trim(),
            MESSAGE: this.form.value.Message,
            USERGROUP:  UserGroupval.join(),
            PRIORITY: this.form.value.Priority,
            STARTDATE: this.datePipe.transform(this.form.value.StartDate, 'yyyy-MM-dd HH:mm:ss'),
            ENDDATE: this.datePipe.transform(this.form.value.EndDate, 'yyyy-MM-dd HH:mm:ss'),
            PRODUCTID: this.productName,
            PROCESSID: this.userDetails.Processid,
            CREATEDBY: this.userDetails.EmployeeId,
            PUBLICIP: this.userDetails.ip,
            PRIVATEIP: "",
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    }
    this.common.hubControlEvent('broadcast','click','button','button',JSON.stringify(this.requestObj),'submit');
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == 'Data added successfully') {
          this.common.snackbar('Record add');
          if (event == 'add') {
            // this.router.navigate(['masters/broadcast']);
             this.router.navigate(['masters/broadcast/view',], { queryParams: { Product : this.productName } })
          } else if (event == 'saveAndAddNew') {
            this.form.reset()
            formDirective.resetForm()

          }
        } else if (res.results.data[0].result == 'Data Exists') {
          this.common.snackbar('Data Already Exist');
        } else if (res.results.data[0].result == 'Data updated successfully') {
          this.common.snackbar('Update Success');
          if (event == 'add') {
            // this.router.navigate(['masters/broadcast']);
            this.router.navigate(['masters/broadcast/view',], { queryParams: { Product : this.productName } })
          } else if (event == 'saveAndAddNew') {
            this.form.reset()
          }
        }  else if (res.results.data[0].Status == true)  {
          // this.common.snackbar(res.results.data[0].result, "error");

            // this.common.snackbar(res.results.data[0].result, "error");
            this.common.confirmationToMakeDefault('AcitvateDeletedData');
            this.subscriptionAcitivateData.push(
                this.common.getIndividualUpload$.subscribe(status => {
              if(status.status){

                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_broadcast",
                    parameters: {
                      flag: 'ACTIVATE_BROADCAST',
                      MODIFIEDBY : this.userDetails.Id,
                      CATEGORY: this.form.value.Category,
                      HEADER: this.form.value.Header,
                      PROCESSID: this.userDetails.Processid,
                      PRODUCTID: this.productName,

                    }
                  }
                };
                this.common.hubControlEvent('Skills','click','ACTIVATE_BROADCAST','',JSON.stringify(this.requestObj),'submit');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    if (event == 'add') {
                      if(this.isDialog == true){
                        this.dialogRef.close(true);
                      }
                      else{
                        this.router.navigate(['masters/broadcast/view',], { queryParams: { Product : this.productName } })                     }
                    } else if (event == 'saveAndAddNew') {
                      this.form.reset()
                      formDirective.resetForm()

                    }
                  }
                });

            }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
              }))

        }else if((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)){
          this.common.snackbar('Data Already Exist');
        }

        this.common.broadcastproductid.next(this.productName);
      } else {
        this.loader = false;
      }
    },
      (error) => {

        this.loader = false;

      });
  }
  maxNo = false;
  hasChecked: any = []
  allSelected: boolean = false

  bulkCheckboxCheck(event, element) {
    // this.common.hubControlEvent('broadcast','click','Checkbox','Checkbox',event,'bulkCheckboxCheck');
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
    // this.common.hubControlEvent('broadcast','click','Checkbox','Checkbox',event,'singleCheckboxCheck');
    if (event) {
      element.CHECKBOX = true
    } else if (!event) {
      element.CHECKBOX = false
    }
    this.checkChecks()
  }
  checkChecks() {
    // this.common.hubControlEvent('broadcast','click','Checkbox','Checkbox','','checkChecks');
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








  ifselectall(e,val){


     if(e.includes(0) && this.form.value.UserGroup.length >= this.getGroupList.length)
     {

    if(this.form.value.UserGroup.includes(0)  ){


    for( var i = 0; i < this.form.value.UserGroup.length; i++){
      if(this.form.value.UserGroup[i] == 0)
      {

        let a  = []
        a = this.form.value.UserGroup
        a.splice(a.indexOf(0), 1);
             this.form.controls.UserGroup.patchValue(a);
             this.form.get('UserGroup').updateValueAndValidity()
             this.form.updateValueAndValidity()

          }
    }
  }
  }

}

toggleSelection(change: MatCheckboxChange): void {

  if (change.checked) {
    this.form.controls['UserGroup'].patchValue(this.getGroupList.map(item => item.GroupID));
    this.form.updateValueAndValidity()

  } else {
    this.form.controls['UserGroup'].patchValue('');
  }
}
dropdown(type, module){
  if (this.ModuleGroupping.includes(module)) {
  const dialogRef = this.dialog.open(DialogComponent, {
    data: {
      type: type,
      data: this.data,
      isDialog: true
    },
    width: "100%",
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(status => {
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.getGroupType();
    this.feildChooser();
    if (status) {
      this.common.refreshMenu(status);

      // this.common.setUserConfig(this.userDetails.ProfileType, 'Users');
    }
  })}
  else {
    this.common.snackbar('ModuleInDialog')
  }
}


convertToPlain(html){

  // Create a new div element
  var tempDivElement = document.createElement("div");

  // Set the HTML content with the given value
  tempDivElement.innerHTML = html;

  // Retrieve the text property of the element
  return tempDivElement.textContent || tempDivElement.innerText || "";
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
    if (by == 'Created On' || by == 'Modified On' || by == 'Start Date'  || by == 'End Date') {
      this.tabValue.sort((a, b) => {
      const dateA = new Date(a[by]);
      const dateB = new Date(b[by]);
      return dateA.getTime() - dateB.getTime();
  });
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
      return
  }
  if (by == 'Message' ) {
    let x=this.tabValue.filter(n => n[by])
    let k=this.tabValue.filter(n => n[by]==null)
    let s=this.tabValue.filter(n => n[by]=='')
    let y=x.sort((a, b) =>this.convertToPlain(a[by]).localeCompare(this.convertToPlain(b[by])))
    this.tabValue=[...y, ...k, ...s]

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



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  resetFun(){
    this.form.reset()
    this.IsDateGreater = false
  }


}
