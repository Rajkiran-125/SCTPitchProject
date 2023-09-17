import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { ExcelService } from 'src/app/global/excel.service';
import { PitchCommonService } from 'src/app/global/pitch-common.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import { FormGroup } from '@angular/forms';
import moment from "moment";

@Component({
  selector: 'app-pitch-filter',
  templateUrl: './pitch-filter.component.html',
  styleUrls: ['./pitch-filter.component.scss']
})
export class PitchFilterComponent implements OnInit {
  @Input() type: any;
  @Input() isDialog: boolean = false;
  @Input() tabValue: any;
  @Input() addBtn: boolean;
  page: number = 1;
  formName: any;
  tabKey: any = [];
  product: any = [];
  itemsPerPage: number = 10;
  tabValueData: Subscription | undefined;
  tabValueLength: any = 0;
  copyWith: any = [];
  subscription: Subscription[] = [];
  userDetails :any
  userConfig:any
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  reportData: any = [];
  form!: FormGroup;
  obj: any;
  ProductGroup: any;
  DateForm: FormGroup;
  url: any;
  language: any;
  dateFormat: any;
  dynamicActiveNumber: any;
  loader: boolean;
  requestObj: { data: { spname: string; parameters: { FLAG: string; PROCESSID: any; CHANNELID: any; UNIQUEID: any; }; }; };
  TemplateData: any;
  channelSourceAvailable: any;
  templateID: any;
  template: any;
  cardTemplate: any;
  templateVisible: boolean;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private auth: AuthService,
    private excelService: ExcelService,
    public common: PitchCommonService,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();

    for (var key in this.tabValue[0]) {
      if (this.tabValue[0].hasOwnProperty(key)) {
        this.tabKey.push(key);
      }
    }
    this.feildChooser();
    this.common.setUserConfig(this.userDetails.ProfileType, this.type);
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data;
    }))
    this.common.setSearch('')
  }

  getTableKey: Subject<any[]> = new Subject<any[]>();
  getTableKey$: Observable<any[]> = this.getTableKey.asObservable();
  setTableKey(object) {
    this.getTableKey.next(object);
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
          modulename:  this.type,
          language: localStorage.getItem("lang"),
        },
      },
    };

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
      if(el.value == value){
        el.checked = event
      }
    })
      this.common.setTableKey(this.finalField);

  }

  getTemplate(event) {
    this.loader = true;
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_hsm_template",
        "parameters": {
          "FLAG": "GET_NOTIFICATION",
          "PROCESSID": this.userDetails.Processid,
          "CHANNELID": this.form.value.Channel,
          "UNIQUEID": event
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.TemplateData = res.results.data;
        this.loader = false;
        if (this.channelSourceAvailable) {
          this.TemplateData.forEach(element => {
            if (element.Actionable === this.templateID) {
              this.template.push({ Key: element['Actionable'], Value: element['Template Name'] })
              this.cardTemplate = element;
              this.templateVisible = true;
            }
          });
        }
      } else this.loader = false;
    });
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
   // this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(this.obj), 'reports');

    if (this.obj != null || this.obj != undefined) {
      this.api.post("reports", this.obj).subscribe((res) => {
        if (res.code == 200) {
          this.common.snackbar("Add Record");
        }
      });
    }
  }

  setItemsPerPage(event) {
    //this.common.hubControlEvent(this.type, 'click', '', '', JSON.stringify(event), 'setItemsPerPage');
    this.common.setItemsPerPage(event);
  }

  filterApply() {
    //this.common.hubControlEvent(this.type, 'click', '', '', '', 'filterApply');

    if (
      this.form.invalid ||
      this.form.value.Date.startDate > this.form.value.Date.endDate
    ) {
      this.common.snackbar("Select dates properly.", "error");
      return;
    } else {
      let obj = this.form.value;
      obj.FROMDATE = (obj?.Date.startDate)?.toISOString().slice(0, 10);
      obj.TODATE = (obj?.Date.endDate)?.toISOString().slice(0, 10);
      obj.Date = undefined;
      obj.ChannelId = obj?.Channel == null ? undefined : obj?.Channel.length == 0 ? undefined : obj?.Channel.length == 1 ? obj?.Channel : obj?.Channel.join(",");
      obj.Channel = undefined;
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
  filed_chooser: boolean = false;
  filterShow: boolean = false;
  toggleFilter() {
   // this.common.hubControlEvent(this.type, 'click', '', '', '', 'toggleFilter');

    this.filterShow = !this.filterShow;
    this.filed_chooser = false;
  }

  reset() {
    //this.common.hubControlEvent(this.type, 'click', '', '', '', 'reset');

    this.form.reset();
  }

  saveColumnSorting() {
    // console.log(this.type);

    var obj = {
      data: {
        spname: "usp_unfyd_user_field_chooser",
        parameters: {
          flag: "DELETE_ADD_MAP",
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
         

         modulename: this.type,

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

}
