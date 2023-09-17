import { Component, ElementRef, OnInit, Input } from "@angular/core";
import { orderBy } from 'lodash';
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";
import { ApiService } from "src/app/global/api.service";
import { regex, businessHrsTabs, unfydMaster, } from "src/app/global/json-data";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import moment from "moment";
@Component({
  selector: 'app-business-hours',
  templateUrl: './business-hours.component.html',
  styleUrls: ['./business-hours.component.scss']
})
export class BusinessHoursComponent implements OnInit {
  @Input() showHeader = true
  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  submittedForm: boolean = false;
  businessHrsTabs: any;
  path: any;
  @Input() tabSelected: any;
  tab: any;
  configData: any;
  unfydMaster: any;
  @Input() type: any;
  @Input() tabType: any;
  tabs: any = []
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  userConfig: any;
  @Input() channel: any;
  @Input() language: any;
  @Input() viewOnly: any = false;
  dateformat: any;
  format: any;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    Object.assign(this, { regex, businessHrsTabs, unfydMaster });
  }

  ngOnInit(): void {
    this.subscription.push(this.common.configView$.subscribe(res => {
      if (res != false){
         this.channel = res.channel
       this.language = res.language
      }
      // console.log("resHoliday:",res);

    }))
    this.common.hubControlEvent('BusinessHours','click','pageload','pageload','','ngOnInit');

    this.dateformat = JSON.parse(localStorage.getItem("localizationData"));
    this.format = this.dateformat.selectedDateFormats.toUpperCase().concat(" ",this.dateformat.selectedTimeFormats)

    this.userDetails = this.auth.getUser();
    this.common.refresh.subscribe((data) => {
      if (data == true) {
        this.searchHawker('all');
      }
    });



    this.common.setUserConfig(this.userDetails.ProfileType, 'BusinessHours');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          // console.log(data);

    }))
    this.activatedRoute.url.subscribe(url => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'BusinessHours');
      this.common.getUserConfig$.subscribe(data => {
        this.configData = data;
        this.tabs = []
        this.businessHrsTabs.forEach(element => {
          if (this.configData && Object.keys(this.configData).length > 0 && this.configData[element.tab]) {
            this[element.tab] = true
            this.tabs.push(element)
          }
        });
      });

    })
    this.form = this.formBuilder.group({});
    this.getFilter();
    this.searchHawker('all');
    this.common.hubControlEvent('BusinessHours','click','pageloadend','pageloadend','','ngOnInit');

    this.subscription.push(this.common.reloadData$.subscribe((data) => {
      if(data == true){
        this.searchHawker('all');
        this.hasChecked= [];
      }
    }))


  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  searchHawker(val: any) {
    this.loader = true;
    this.tabKey = [];
    this.tabValue = [];
    if (val == 'all') {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_adm_offline",
          parameters: {
            FLAG: this.tabSelected == 'Online Hours' ? "GETALLOFFLINEHRS" :
              this.tabSelected == 'Offline Days' ? "GETALLOFFLINEDAYS" : 'GETALLOFFLINEHRS',
            PROCESSID: this.userDetails.Processid,
            LanguageCode: this.language,
            ChannelId: this.channel,
          },
        },
      };
    }
    this.common.hubControlEvent('BusinessHours','click','','','','searchHawker');

    this.api.post("index", this.requestObj).subscribe(
      (res) => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          var tempRes = res.results.data;
          this.tabValue= [];
          for (let data of tempRes) {
            var newObj = {
              ...data,
            };
            this.tabValue.push(newObj);
          }
          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
            // console.log(key);

          }
          if (tempRes.length == 0) {
            this.noData = true;
          } else {
            this.noData = false;
          }
        } else {
          this.loader = false;
        }
      },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      }
    );
  }

  reset() {
    this.common.hubControlEvent('BusinessHours','click','','','','reset');

    this.tabKey = [];
    this.tabValue = [];
  }

  page: number = 1;
  itemsPerPage: number = 10;
  search: any;

  gotoFormPage(val, data) {


    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: this.tabType,
        tabName: this.tabSelected,
        formName: val,
        Id: data.Actionable,
        master: "BusinessHours"
      },
      width: "900px",
      height: "88vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status) {
        this.searchHawker('all');
      }
    })
    this.common.hubControlEvent('BusinessHours','click','','',JSON.stringify(val, data),'gotoFormPage');
  }
  isNumber(val): boolean { return typeof val === 'number'; }

  getFilter() {
    this.common.hubControlEvent('BusinessHours','click','','','','getFilter');

    this.subscription.push(this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    }));
    this.subscription.push(this.common.getSearch$.subscribe(data => {
      this.search = data
    }));
    this.subscription.push(this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.searchHawker('all')
      }
    }));
    this.subscription.push(this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      if(this.viewOnly){
        data.forEach(element => {
          if(element.value && (element.value.toLowerCase().replaceAll(' ','')  == 'srno' || element.value.toLowerCase().replaceAll(' ','')  == 'actionable')) element.checked = false
        });
      }
      this.finalField = data;
      // console.log("this.finalField:",this.finalField);

    }));
  }



  delete(val) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
   this.subscriptionBulkDelete.push(
      this.common.getIndividualUpload$.subscribe(status => {
    if(status.status){
      var obj = {
        data: {
          spname: "usp_unfyd_adm_offline",
          parameters: {
            FLAG: this.tabSelected == 'Online Hours' ? "DELETE_OFFLINE_HRS" :
              this.tabSelected == 'Offline Days' ? "DELETE_OFFLINE_DAYS" : 'DELETE_OFFLINE_HRS',
            ID: val.Actionable,
          },
        },
      };
      this.common.hubControlEvent('BusinessHours','click','','',JSON.stringify(obj),'delete');

      this.api.post("index", obj).subscribe(
        (res) => {
          if (res.code == 200) {
            this.hasChecked=[]
            this.loader = false;
            this.common.snackbar('Delete Record')
            this.searchHawker('all');
            this.hasChecked=[]

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
    )
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
          modulename: 'BusinessHours',
          language: localStorage.getItem("lang"),
        },
      },
    };

    this.common.hubControlEvent(this.type,'click','','','','feildChooser');

    this.api.post("index", obj).subscribe(
      (res) => {
        if (res.code == 200) {
          if (res.results.data.length == 0) {
            // this.selctedField = []
            // this.tabKey = []
            this.selctedField = this.tabKey;
          } else {
            this.selctedField = res.results.data[0].FieldChooser.split(",");
          }
          this.unSelctedField = this.tabKey.filter(
            (field) => !this.selctedField.includes(field)
          );



          if (res.results.data.length == 0) {

            var unselectedfield = ['Created By', 'Created On', 'Modified By', 'Modified On', 'Deleted On', 'Deleted By', 'Status', 'CreatedBy', 'CreatedOn', 'ModifiedBy', 'ModifiedOn']
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
          // console.log(this.finalField);



        } else {
        }
      },
      (error) => {
      }
    );
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


      let x=this.tabValue.filter(n => n[by])
      let k=this.tabValue.filter(n => n[by]==null)
      let s=this.tabValue.filter(n => n[by]=='')
      let y=x.sort((a, b) =>a[by].localeCompare(b[by]))
      this.tabValue=[...y, ...k, ...s]
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

  }





  maxNo = false;
  hasChecked: any = []
  allSelected: boolean = false

  // bulkCheckboxCheck(event, element) {

  //   let startingOfArray = this.page * this.itemsPerPage - this.itemsPerPage
  //   let endingOfArray: any;
  //   if (this.itemsPerPage * this.page > this.tabValue.length) {
  //     endingOfArray = this.tabValue.length
  //   } else {
  //     endingOfArray = this.page * this.itemsPerPage
  //   }
  //   for (let i = startingOfArray; i < endingOfArray; i++) {
  //     if (event) {
  //       if (this.tabValue[i] != undefined)
  //         this.tabValue[i].CHECKBOX = true
  //       this.allSelected = true;
  //     } else if (!event) {
  //       if (this.tabValue[i] != undefined)
  //         this.tabValue[i].CHECKBOX = false
  //       this.allSelected = false
  //     }
  //   }
  //   this.checkChecks();
  //   this.common.hubControlEvent('broadcast','click','Checkbox','Checkbox',event,'bulkCheckboxCheck');
  // }


  bulkCheckboxCheck(event, element) {
    // this.common.hubControlEvent('Masters','click','','',JSON.stringify(event, element),'bulkCheckboxCheck');

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
    this.common.hubControlEvent('broadcast','click','Checkbox','Checkbox',event,'singleCheckboxCheck');
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
    this.common.hubControlEvent('broadcast','click','Checkbox','Checkbox','','checkChecks');
  }


















  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
