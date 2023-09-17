import { Component, ElementRef, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";
import { ApiService } from "src/app/global/api.service";
import {
  regex,
  dispositionTabs,
  checkDates,
  unfydMaster,
} from "src/app/global/json-data";
import { ActivatedRoute, Router } from "@angular/router";
import * as _moment from "moment";
import { default as _rollupMoment, Moment } from "moment";
const moment = _rollupMoment || _moment;

@Component({
  selector: "app-disposition",
  templateUrl: "./disposition.component.html",
  styleUrls: ["./disposition.component.scss"],
})
export class DispositionComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  submittedForm: boolean = false;
  paymentSearch: boolean = true;
  dispositionTabs: any;
  path: any;
  tabSelected: any;
  tab: any;
  configData: any;
  minDate = new Date();
  maxDate = new Date();
  unfydMaster: any;
  type:any
  tabs:any = []
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];

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
    Object.assign(this, { regex, dispositionTabs, unfydMaster });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('Dispositions','click','pageload','pageload','','ngOnInit');

    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());
    this.tabSelected = dispositionTabs[0].label;
    this.userDetails = this.auth.getUser();
    let dummyType = this.router.url.substring(15,this.router.url.length);
    dummyType = dummyType.substring(0,dummyType.length-5);
    if(dummyType.toLocaleLowerCase() == "dispositions"){
      this.type = 'Dispositions'
    }
    this.activatedRoute.url.subscribe(url => {
      // this.type = this.activatedRoute.snapshot.paramMap.get('list');
      // this.tab = this.hawkerStatusSteps[0].tab;
      this.common.setUserConfig(this.userDetails.ProfileType,'Dispositions');
      this.common.getUserConfig$.subscribe(data => {
        this.configData = data;
        if ("SubDispositionsTab" in this.configData) {
          this.tabs= []
          this.dispositionTabs.forEach(element => {
            if(this.configData[element.tab]){
              this[element.tab] = true;
              this.tabs.push(element)
            }
          });
        }
      });
    })
    this.form = this.formBuilder.group(
      {
        businessUnit: [1, Validators.nullValidator],
        language: ["en", Validators.nullValidator],
      }
    );
    this.getSnapShot();
    this.getFilter();
    this.searchHawker('all');
    this.common.hubControlEvent('Dispositions','click','pageloadend','pageloadend','','ngOnInit');

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getSnapShot() {
    this.common.hubControlEvent('Dispositions','click','','','','getSnapShot');

    this.common.closeComponent();

    this.common.openComponent$.subscribe((openComponent) => {
      this.paymentSearch = openComponent;
      this.reset();
    });
  }

  searchHawker(val:any) {
    this.loader = true;
    this.tabKey = [];
    this.tabValue = [];
    this.submittedForm = true;

    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector(
            '[formcontrolname="' + key + '"]'
          );
          invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("Please fix the following errors", "error");
      return;
    }

    if(val == 'all'){
      this.requestObj = {
        data: {
          spname: "usp_unfyd_adm_dispositions",
          parameters: {
            FLAG: this.tabSelected == 'Dispositions' ? "GETALLDISPOSITION" :
                  this.tabSelected == 'Sub Dispositions' ? "GET_SUBDISPOSITION":
                  this.tabSelected == 'Sub Sub Dispositions' ? "GET_SUBSUBDISPOSITION":'"GETALLDISPOSITION"',
            PROCESSID: this.form?.value?.businessUnit,
            LANGUAGECODE: this.form?.value?.language,
          },
        },
      };
    }
    this.common.hubControlEvent('Dispositions','click','','',JSON.stringify(this.requestObj),'searchHawker');

    this.api.post("index", this.requestObj).subscribe(
      (res) => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          var tempRes = res.results.data;
          for (let data of tempRes) {
            var newObj = {
              Actionable: "",
              ...data,
            };
            this.tabValue.push(newObj);
          }
          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
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
    this.common.hubControlEvent('Dispositions','click','','','','reset');

    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
  }

  openComponent(data) {
    this.common.hubControlEvent('Dispositions','click','','',JSON.stringify(data),'openComponent');

    this.paymentSearch = false;
    this.data = {
      display: true,
      contactid: data["Applicant No."],
      registation: data["Registration No."],
      RegistrationStatus: data["Registration Status"],
      hawkerfirstname: data["First Name"],
      hawkermiddlename: data["Middle Name"],
      hawkerlastname: data["Last Name"],
      mobileNo: data["Mobile No."],
      uniformsize: data["UniformSize"],
    };
  }

  page: number = 1;
  itemsPerPage: number = 10;
  search: any;


  changeTab(val) {
    this.common.hubControlEvent('Dispositions','click','','',JSON.stringify(val),'changeTab');

    this.tabSelected = val;
    this.searchHawker('all');
  }

  add() {}

  mobileDeviceChange(event) {

    // this.form.get('handsetmodel').setValue(event);
    // this.form.updateValueAndValidity();
  }

  gotoFormPage(val, data) {
    this.common.hubControlEvent('Dispositions','click','','',JSON.stringify(val),'gotoFormPage');

    // let obj = {
    //   tabName: this.tabSelected,
    //   formName: val,
    //   data: data,
    //   master: "disposition",
    // };
    // this.common.unfydMasterFormMethod(obj);
    this.router.navigate(["unfyd-masters/form/list"], {queryParams: {    tabName: this.tabSelected,
      formName: val,
      id: data == null ? 'undefined' :data.Id,
      master: "dispositions" }});

    // setTimeout(() => {
    //   this.router.navigate(["unfyd-masters/form/list"], {queryParams: {part: 'navbar',search: 'contact', year: 2021 }});
    // }, 0);
  }
  isNumber(val): boolean { return typeof val === 'number'; }

  getFilter() {
    this.common.hubControlEvent('Dispositions','click','','','','getFilter');

    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
  });
  this.common.getSearch$.subscribe(data => {
      this.search = data
  });
  this.common.getLoaderStatus$.subscribe(data => {
      // this.loader = data;
      if (data == false) {
          // this.getContacts()
          this.searchHawker('all')
      }
  });
  this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
  });
  }
  delete(val) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "delete",
        title:"Are you sure?",
        subTitle:"Do you want to delete this data"
        // data: this.tabSelected == 'Dispositions' ? val.DispostionName :
        //           this.tabSelected == 'Sub Dispositions' ? val.SubdispositionName:
        //           this.tabSelected == 'Sub Sub Dispositions' ? val.subsubdispositionName:val.DispostionName
      },
      width: "300px",
    });
    dialogRef.afterClosed().subscribe((status) => {
      if (status) {
        var obj = {
          data: {
            spname: "usp_unfyd_adm_dispositions",
            parameters: {
              FLAG: this.tabSelected == 'Dispositions' ? "DELETE_DISPOSITION" :
                  this.tabSelected == 'Sub Dispositions' ? "DELETE_SUBDISPOSITION":
                  this.tabSelected == 'Sub Sub Dispositions' ? "DELETE_SUBSUBDISPOSITION":'"DELETE_DISPOSITION"',
              ID: val.Id,
            },
          },
        };
        this.common.hubControlEvent('Dispositions','click','','',JSON.stringify(val),'delete');

        this.api.post("index", obj).subscribe(
          (res) => {
            if (res.code == 200) {
              if(res.results.data[0].result == 'Data is mapped to SubDisposition'){
                this.common.snackbar(res.results.data[0].result, "error");
              } else if(res.results.data[0].result == 'Data is mapped to SubSubDisposition'){
                this.common.snackbar(res.results.data[0].result, "error");
              }else{
                this.common.snackbar(res.results.data[0].result, "success");
              }
              this.searchHawker('all');
              // this.router.navigateByUrl('unfyd-masters/disposition')
            } else {
              this.common.snackbar("Something went wrong.", "error");
            }
          },
          (error) => {
            this.common.snackbar(error.message, "error");
          }
        );
      }
    });
  }
}
