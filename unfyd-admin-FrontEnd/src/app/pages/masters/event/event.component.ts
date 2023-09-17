import { DatePipe } from '@angular/common';
import { orderBy } from 'lodash';
import { ApiService } from 'src/app/global/api.service';
import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { regex, eventStep, checknull, checknull1 } from 'src/app/global/json-data';
import { AuthService } from 'src/app/global/auth.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import moment from 'moment';
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  regex: any;
  masters: any;
  Categoryval: any;
  form: FormGroup;
  @Input() category: any;
  submittedForm = false;
  requestObj: any;
  minMessage: any;
  labelName: any;
  reset: boolean;
  userConfig: any;
  productType: any = [];
  @Input() productName: any;
  tabKey: any = [];
  tabValue: any = [];
  page: number = 1;
  eventStep: any;
  currentpage: number = 1;
  itemsPerPage: number = 10;
  paginationArray: any = [];
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  search: any;
  filter: any = 'addevent';
  labelNameStore: any;
  LabelNameStore: any;
  type: any = 'event';
  tabe: any = 'Category';
  eventcatValue: any;
  changeModuleLabelDisplayName: string;
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  subscriptionEventModal: Subscription | undefined;
  SelectedCategory: any
  @Input() data: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  @Input() isDialog: boolean = false
  @Input() edit: any = false;
  @Input() newLabelName: string;
  @Input() eventfilter: any;
  @Input() eventtab: any

  eventvalue: any = [
    { Key: 'Category1', Value: 'Category1' },
    { Key: 'Category2', Value: 'Category2' },
    { Key: 'Category3', Value: 'Category3' },
    { Key: 'Category4', Value: 'Category4' },
    { Key: 'Category5', Value: 'Category5' },
  ]
  eventId: string;
  EventValue: any;
  selectedEventProduct: number;
  dateformat: any;
  format: any;
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    public common: CommonService,
    public dialog: MatDialog,
    private el: ElementRef,
    private api: ApiService,
    public dialogRef: MatDialogRef<DialogComponent>
  ) { Object.assign(this, { eventStep }) }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.getProducts();
    this.getFilter();
    this.setLabelByLanguage(localStorage.getItem("lang"));
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.dateformat = JSON.parse(localStorage.getItem("localizationData"));
    this.format = this.dateformat.selectedDateFormats.toUpperCase().concat(" ",this.dateformat.selectedTimeFormats)
    this.common.refresh.subscribe((data) => {
      if (data == true) {
        this.geteventtable('null');
      }
    });
    if (this.Id == null) {
      this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.labelNameStore = JSON.parse(localStorage.getItem('menu'))
    this.eventId = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.eventId) {
      this.eventform()
    }
    this.activatedRoute.queryParams.subscribe(params => {
      this.eventId = this.isDialog === true ? this.Id : params.Id;
      this.filter = this.isDialog === true ? this.eventfilter : params.filter;
      if(this.isDialog == false)this.tabe =  params.tabe === undefined ? 'Category' : params.tabe;
      if(this.isDialog == true)this.tabe = this.eventtab === undefined ? 'Category': this.eventtab

      // this.tabe = this.isDialog === true ? this.eventtab === undefined ? 'Category': params.tabe === undefined ? 'Category' : params.tabe : this.tabe;


      if (params.productID && !this.isDialog) {
        this.productName = parseInt(params.productID);
      }
      if ((this.filter !== 'editevent' ) && this.tabe !== 'Category' ) {
        this.getevent();
      }
      if ((this.filter == 'addevent' ) ) {
        this.eventform();
        this.getevent();
      }
      if((this.tabe == 'Category') && (this.filter !== 'addevent' && this.filter !== 'editevent') ) this.geteventtable('select');

    })
    // this.subscription.push(this.common.reloadData$.subscribe((data) => {
    //   if (data == true) {
    //     this.geteventtable('null');
    //     this.hasChecked = [];
    //   }
    // }))

    let count = 0
    this.subscription.push(this.common.categoryValue$.subscribe(res => {
      if (res != false) {
        this.SelectedCategory = res
        this.eventcatValue = res
        if (this.filter !== 'editevent' && this.tabe !== 'Category') {
          // count --;
          // if (count == 1)
          this.geteventtable('null');}
      }
    }))

    if (this.filter == 'editevent') { this.eventform();
      if (this.tabe == 'Category') { this.editCategory() }
      else if (this.tabe == 'Features') { this.editEvent() }
      else if (this.tabe == 'System') { this.editSystem() }
    }
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
  }

  setLabelByLanguage(data) {

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'event', data)

  }
  tabechange = 'Category'
  onTabChange(event) {
    this.paginationArray = [];
    this.hasChecked = [];
    this.SelectedCategory = ''
    this.eventcatValue = ''
    this.tabKey = [],
    this.tabValue = []
    this.tabe = event;
    this.tabechange = event
    this.common.setTabChange(event, this.productName);
    if (this.tabe == 'Category') {
      this.geteventtable('null')
      this.hasChecked = [];
    }
    // this.tabchange = event
  }
  eventform() {
    this.form = this.formBuilder.group({
      Categoryevent: ['', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
      description: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      Cate: ['', [Validators.required]],
      EventName: ['', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
      decrip: ['', [ Validators.minLength(3), Validators.maxLength(500)]],
      ProductGroup3: ['', [Validators.required]],
      des: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      System: ['', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter)]],
    }, { validator: [checknull('Categoryevent'), checknull('EventName'), checknull('System'), checknull1('Categoryevent'), checknull1('EventName'), checknull1('System'), checknull1('description'), checknull1('decrip'), checknull1('des')] });


  }
  editCategory() {
    var Obj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION_CATEGORY",
        parameters: {
          flag: "GETBYID",
          Id: this.eventId
        }
      }
    }
    this.api.post('index', Obj).subscribe(res => {
      this.loader = false
      if (res.code == 200) {
        this.form.controls.Categoryevent.patchValue(res.results.data[0].Category)
        this.form.controls.description.patchValue(decode(res.results.data[0].Description))
        this.form.controls.Cate.patchValue('')
        this.form.controls.EventName.patchValue('')
        this.form.controls.decrip.patchValue('')
        this.form.controls.ProductGroup3.patchValue('')
        this.form.controls.des.patchValue('')
        this.form.controls.System.patchValue('')

      }
    })

  }
  editEvent() {
    var Obj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION_EVENTS",
        parameters: {
          flag: "GETBYID",
          Id: this.eventId
        }
      }
    }
    this.api.post('index', Obj).subscribe(res => {
      this.loader = false
      if (res.code == 200) {
        this.getevent()
        this.form.controls.Cate.patchValue(res.results.data[0].CategoryId)
        this.form.controls.EventName.patchValue(res.results.data[0].EventName)
        this.form.controls.decrip.patchValue(decode(res.results.data[0].Description)
        )
        this.form.controls.ProductGroup3.patchValue('')
        this.form.controls.des.patchValue('')
        this.form.controls.System.patchValue('')
        this.form.controls.Categoryevent.patchValue('')
        this.form.controls.description.patchValue('')
      }
    })
  }
  editSystem() {
    var Obj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION_FIELDS",
        parameters: {
          flag: "GETBYID",
          Id: this.eventId
        }
      }
    }
    this.api.post('index', Obj).subscribe(res => {
      this.loader = false
      if (res.code == 200) {
        this.getevent()
        this.form.controls.ProductGroup3.patchValue(res.results.data[0].CategoryId)
        this.form.controls.System.patchValue(res.results.data[0].SystemField)
        this.form.controls.des.patchValue(decode(res.results.data[0].Description)
        )
        this.form.controls.Cate.patchValue('')
        this.form.controls.EventName.patchValue('')
        this.form.controls.decrip.patchValue('')
        this.form.controls.Categoryevent.patchValue('')
        this.form.controls.description.patchValue('')

      }
    })
  }
  htmlDecodeTable(val){
    return decode(val)
}
  selectedProduct(event) {
    this.tabechange = 'Category'
    this.tabKey = [],
    this.tabValue = []
    this.productName = event;
    if (this.tabe == 'Features' || this.tabe == 'System') this.getevent()
    // this.common.setTabChange(this.tabe, this.productName);
    if(this.tabe == 'Category') this.geteventtable('select');

    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data
    });

  }

  geteventtable(event) {
    if (event == 'select') { }
    else {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params.Product) {
          this.productName = parseInt(params.productID)

        }
      })
    }
    this.loader = true;
    var obj = {
      data: {
        spname: this.tabe == 'Category' ? 'USP_UNFYD_NOTIFICATION_CATEGORY' : this.tabe == 'Features' ? 'USP_UNFYD_NOTIFICATION_EVENTS' : 'USP_UNFYD_NOTIFICATION_FIELDS',
        parameters: {
          flag: 'GET',
          PRODUCTID: this.productName !== undefined || this.productName !== null ? this.productName : 1,
          PROCESSID: this.userDetails.Processid,
          PageNo: this.currentpage,
          PageSize: this.itemsPerPage,
          CATEGORYID: this.tabe == 'Features' ? this.eventcatValue : this.tabe == 'System' ? this.eventcatValue : undefined,
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;

        this.tabValue = [];
        this.tabKey = [];
        this.paginationArray = [];
        this.tabValue = res.results.data[0];
        for (var i = 1; i <= res.results.data[1][0]['Total']; i++) {
          this.paginationArray.push(i);
        }
        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
        this.common.tabValueLengthData(res.results.data[1][0]['Total']);
        this.common.reportTabKeyData(this.tabKey);
        if (this.tabe !== 'Category') {
          this.getevent();
        }
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = true;
      })
  }
  getevent() {

    var obj = {
      data: {
        spname: 'USP_UNFYD_NOTIFICATION_CATEGORY',
        parameters: {
          flag: 'GET_DRP',
          PRODUCTID: this.productName,
          PROCESSID: this.userDetails.Processid,
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.category = res.results.data;
        // this.filteredList1 = this.category.slice()
      }
    })
  }
  deleteevent(id) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');

    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {

      if (status.status) {
        this.requestObj = {
          data: {
            spname: this.tabe == 'Category' ? 'USP_UNFYD_NOTIFICATION_CATEGORY' : this.tabe == 'Features' ? 'USP_UNFYD_NOTIFICATION_EVENTS' : 'USP_UNFYD_NOTIFICATION_FIELDS',
            parameters: {
              flag: 'DELETE',
              id: id,
              deletedby: this.userDetails.Id,
            },
          },
        };
        this.api.post("index", this.requestObj).subscribe(
          (res) => {
            if (res.code == 200) {
              this.loader = false;
              if (res.results.data[0].message == "Data deleted successfully") {
                this.common.snackbar("Delete Record");
              }
              else if (res.results.data[0].message == "Category is mapped to fields") {
                this.common.snackbar("FieldMapped");
              }
              else if (res.results.data[0].message == "Category is mapped to events") {
                this.common.snackbar("EventMapped");
              }
              // if (this.isDialog == true) {
              //   this.dialogRef.close(true);
              // }
              else {
                this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName, tabe: this.tabe } });
              }
              let data = this.paginationArray;
              this.currentpage = 1;
              // this.currentpage = Math.floor(this.paginationArray.length / 10) === 0 ? 1 : Math.floor(this.paginationArray.length / 10);
              this.geteventtable('null');
              this.hasChecked = [];
            } else {
              this.loader = false;
              this.common.snackbar("Something went wrong.", "error");
            }
          },
        )
      }

      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
      // this.feildChooser()

    }))
  }
  pageChange(currentpage) {
    this.currentpage = currentpage;
    this.geteventtable('null')
    this.hasChecked = [];
  }
  getFilter() {
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data;
    }));
    this.subscription.push(this.common.reloadData$.subscribe((data) => {
      if (data == true) {
        this.currentpage = Math.floor(this.paginationArray.length / 10) === 0 ? 1 : Math.floor(this.paginationArray.length / 10);
        this.geteventtable('null')
        this.hasChecked= [];
      }
    }));
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }));
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }));
    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.geteventtable('null')
        // this.hasChecked= [];
      }
    });
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
    });
  }
  maxNo = false;
  hasChecked: any = []
  allSelected: boolean = false
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
        this.hasChecked.push(this.tabValue[i].Id)
      }

    }
    if (this.hasChecked.length == (endingOfArray - startingOfArray)) {
      this.allSelected = true
    } else {
      this.allSelected = false
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
          modulename: 'event',
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
    },
      (error) => {
      })
  }
  back(): void {
    if (this.isDialog == true) {
      this.dialogRef.close(true);
    }
    else {
      this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName, tabe: this.tabe } });
    }
  }
  backEvent() {
    if (this.isDialog == true) {
      this.dialogRef.close(true);
    }
    else {
      this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName, tabe: this.tabe } })
      // this.geteventtable('null')
      // this.getevent()
    }
  }
  backSystem() {
    if (this.isDialog == true) {
      this.dialogRef.close(true);
    }
    else {
      this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName, tabe: this.tabe } })
      // this.getevent()
      // this.geteventtable('null')
    }
  }
  getProducts() {
    this.productType = JSON.parse(localStorage.getItem('products'))
    if (this.isDialog == false) this.productName = this.productType.Id
  }
  submit() {
    if (this.form.controls["Categoryevent"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "Categoryevent" + '"]');
      invalidControl.focus();
      this.form.get('Categoryevent').markAsTouched();
      return;
    }
    if (this.form.controls["description"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "description" + '"]');
      invalidControl.focus();
      this.form.get('description').markAsTouched();
      return;
    }
    // this.loader = true;
    this.submittedForm = true;

    this.requestObj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION_CATEGORY",
        parameters: {
          flag: this.eventId == null ? 'INSERT' : 'UPDATE',
          ID: this.eventId == null ? undefined : this.eventId,
          CreatedBy: this.eventId == null ? this.userDetails.Id : undefined,
          ProductId: this.productName,
          Category: this.form.value.Categoryevent == null ? null : this.form.value.Categoryevent.trim(),
          Description: encode(this.form.value.description == null ? null : this.form.value.description.trim()),
          PUBLICIP: this.userDetails.ip,
          privateip: this.userDetails.privateip,
          processid: this.userDetails.Processid,
          BROWSERNAME: this.userDetails.browser,
          BROWSERVERSION: this.userDetails.browser_version,
          MODIFIEDBY: this.eventId == null ? undefined : this.userDetails.Id,
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {

        if (res.results.data[0].message == "Notification category added successfully") {
          if (this.isDialog == true) {
            this.common.refreshMenu(true);
          }
          this.getevent()
          this.resetCategory()
          this.common.snackbar('Record add');
        }
        else if (res.results.data[0].message == "Notification category updated successfully") {
          if (this.isDialog == true) {
            this.dialogRef.close(true);
            this.common.refreshMenu(true);
          }
          else {
            this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName } })
          };
          this.common.snackbar('Update Success');

        }
        else if ((res.results.data[0].message == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {


                this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "USP_UNFYD_NOTIFICATION_CATEGORY",
                    parameters: {
                      flag: 'ACTIVATE',
                      ProductId: this.productName,
                      Category: this.form.value.Categoryevent,
                      processid: this.userDetails.Processid,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (this.isDialog == true) {
                      this.dialogRef.close(true);
                    }
                    else {
                      this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName, tabe: this.tabe } })
                    };
                    this.common.snackbar('Record add');
                  }
                });

              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))
          // this.geteventtable('null')

        }
      } else {
        this.loader = false;
      }
    }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  saveEvents() {
    this.submittedForm = true;
    if (this.form.controls["Cate"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "Cate" + '"]');
      invalidControl.focus();
      this.form.get('Cate').markAsTouched();
      return;
    }
    if (this.form.controls["EventName"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "EventName" + '"]');
      invalidControl.focus();
      this.form.get('EventName').markAsTouched();
      return;
    }
    if (this.form.controls["decrip"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "decrip" + '"]');
      invalidControl.focus();
      this.form.get('decrip').markAsTouched();
      return;
    }

    this.requestObj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION_EVENTS",
        parameters: {
          flag: this.eventId == null ? 'INSERT' : 'UPDATE',
          ID: this.eventId == null ? undefined : this.eventId,
          CreatedBy: this.eventId == null ? this.userDetails.Id : undefined,
          ProductId: this.productName,
          CategoryId: this.form.get('Cate').value,
          EventName: this.form.value.EventName == null ? null : this.form.value.EventName.trim(),
          Description: encode(this.form.value.decrip == null ? null : this.form.value.decrip.trim()),
          PUBLICIP: this.userDetails.ip,
          privateip: this.userDetails.privateip,
          processid: this.userDetails.Processid,
          BROWSERNAME: this.userDetails.browser,
          BROWSERVERSION: this.userDetails.browser_version,
          MODIFIEDBY: this.eventId == null ? undefined : this.userDetails.Id,
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {

        // this.loader = false;
        // this.getevent()
        if (res.results.data[0].message == "Notification event added successfully") {
          if (this.isDialog == true) {
            this.common.refreshMenu(true);
          }
          this.resetFeature()
          this.common.snackbar('Record add');
        }
        else if (res.results.data[0].message == "Notification event updated successfully") {
          if (this.isDialog == true) {
            this.dialogRef.close(true);
            this.common.refreshMenu(true);
          }
          else {
            this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName, tabe: this.tabe } })
          };
          this.common.snackbar('Update Success');
        }
        else if ((res.results.data[0].message == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "USP_UNFYD_NOTIFICATION_EVENTS",
                    parameters: {
                      flag: 'ACTIVATE',
                      CategoryId: this.form.get('Cate').value,
                      ProductId: this.productName,
                      EventName: this.form.value.EventName,
                      processid: this.userDetails.Processid,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (this.isDialog == true) {
                      this.dialogRef.close(true);
                    }
                    else {
                      this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName, tabe: this.tabe = 'Features' } });
                    }
                    this.common.snackbar('Record add');
                  }
                });
              }
              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))
          // this.geteventtable('null')

        }
      } else {
        this.loader = false;
      }
    }
    );

  }
  SaveSystem() {
    this.submittedForm = true;
    if (this.form.controls["ProductGroup3"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "ProductGroup3" + '"]');
      invalidControl.focus();
      this.form.get('ProductGroup3').markAsTouched();
      return;
    }
    if (this.form.controls["System"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "System" + '"]');
      invalidControl.focus();
      this.form.get('System').markAsTouched();
      return;
    }
    if (this.form.controls["des"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "des" + '"]');
      invalidControl.focus();
      this.form.get('des').markAsTouched();
      return;
    }


    this.requestObj = {
      data: {
        spname: "USP_UNFYD_NOTIFICATION_FIELDS",
        parameters: {
          flag: this.eventId == null ? 'INSERT' : 'UPDATE',
          ID: this.eventId == null ? undefined : this.eventId,
          CreatedBy: this.eventId == null ? this.userDetails.Id : undefined,
          ProductId: this.productName,
          CategoryId: this.form.get('ProductGroup3').value,
          SystemField: this.form.value.System == null ? null : this.form.value.System.trim(),
          Description: encode(this.form.value.des == null ? null : this.form.value.des.trim()),
          PUBLICIP: this.userDetails.ip,
          privateip: this.userDetails.privateip,
          processid: this.userDetails.Processid,
          BROWSERNAME: this.userDetails.browser,
          BROWSERVERSION: this.userDetails.browser_version,
          MODIFIEDBY: this.eventId == null ? undefined : this.userDetails.Id,
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {

        // this.loader = false;
        // this.getevent()
        if (res.results.data[0].message == "Notification Fields added successfully") {
          if (this.isDialog == true) {
            this.common.refreshMenu(true);
          }
          this.resetSystem()
          this.common.snackbar('Record add');
        }
        else if (res.results.data[0].message == "Notification Fields updated successfully") {
          if (this.isDialog == true) {
            this.common.refreshMenu(true);
            this.dialogRef.close(true);

          }
          else {
            this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName, tabe: this.tabe } });
          }
          this.common.snackbar('Update Success');
        }
        else if ((res.results.data[0].message == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {

                this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "USP_UNFYD_NOTIFICATION_FIELDS",
                    parameters: {
                      flag: 'ACTIVATE',
                      ProductId: this.productName,
                      CategoryId: this.form.get('ProductGroup3').value,
                      SystemField: this.form.value.System,
                      processid: this.userDetails.Processid,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (this.isDialog == true) {
                      this.dialogRef.close(true);
                    }
                    else {
                      this.router.navigate(['masters/event/view',], { queryParams: { productID: this.productName, tabe: this.tabe = 'System' } });
                    }
                    this.common.snackbar('Record add');
                  }
                });
              }
              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))
          // this.geteventtable('null')

        }
      } else {
        this.loader = false;
      }
    }
    );

  }
  contactAction(data, val) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'eventADD',
          Id: data.Id,
          eventfilter: val,
          isDialog: true,
          eventtab: this.tabe,
          productID: this.productName,
        },
        width: "900px",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.setLabelByLanguage(localStorage.getItem("lang"))
        this.geteventtable('null')
        if (status == true) {


        }
      });
  }
  resetCategory() {
    this.form.controls.Categoryevent.reset();
    this.form.controls.description.reset();
    this.form.updateValueAndValidity();

  }
  resetFeature() {
    this.form.controls.Cate.reset();
    this.form.controls.EventName.reset();
    this.form.controls.decrip.reset();
    this.form.updateValueAndValidity();
  }
  resetSystem() {
    this.form.controls.ProductGroup3.reset();
    this.form.controls.System.reset();
    this.form.controls.des.reset();
    this.form.updateValueAndValidity();
  }

  ontouch = true
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
    if (by == 'Id') {
      let x = this.tabValue.filter(n => n[by])
      let k = this.tabValue.filter(n => n[by] == null)
      let s = this.tabValue.filter(n => n[by] == '')
      let y = x.sort((a, b) => parseInt(a[by]) - parseInt(b[by]));
      this.tabValue = [...y, ...k, ...s]
      this.ontouch = !this.ontouch
      this.tabValue = this.ontouch == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
      return
    }
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
        this.ontouch = !this.ontouch
        this.tabValue = this.ontouch == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
        return
    }
    let x = this.tabValue.filter(n => n[by])
    let k = this.tabValue.filter(n => n[by] == null)
    let s = this.tabValue.filter(n => n[by] == '')
    let y = x.sort((a, b) => a[by].localeCompare(b[by]))
    this.tabValue = [...y, ...k, ...s]
    this.ontouch = !this.ontouch
    this.tabValue = this.ontouch == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

  }


}

