import { EventEmitter, HostListener, Injectable, Output } from "@angular/core";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import * as CryptoJS from "crypto-js";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ApiService } from "src/app/global/api.service";
import { DatePipe } from "@angular/common";
import { FormControl, Validators, FormGroup, FormArray } from "@angular/forms";
import moment from "moment";
import { Router } from "@angular/router";
import {
  countryCode,
  AllIcons,
  hubmoduleicon,
  flagAndSPName,
} from "src/app/global/json-data";
import { AuthService } from "src/app/global/auth.service";
import { Md5 } from "ts-md5";
import { MatDrawer } from "@angular/material/sidenav";
import { I } from "@angular/cdk/keycodes";
import { ExcelService } from "./excel.service";
import { WeekPipe } from "./week.pipe";
@Injectable({
  providedIn: "root",
})
export class CommonService {
  subscriptionForImport: Subscription[] = [];
  @HostListener("window:resize", ["$event"])
  // Menu Show Hide
  hubmoduleicon: any = [];
  AllIcons: any = [];
  flagAndSPName: any;
  private isChild = new Subject<[]>();
  aaaaa = {
    parse: {
      dateInput: "LL",
    },
    display: {
      dateInput: "dd/MM/yyyy",
      monthYearLabel: "dd/MM/yyyy",
      dateA11yLabel: "LL",
      monthYearA11yLabel: "LL",
    },
  };
  lowercaseKeys: any;
  requestObj: any;
  states: any;
  cities: any;
  uploadCategory: any;
  hawkerloginSmallLoader = false;
  uniqueID: any;
  currentDateTime: any;
  scrHeight: any;
  scrWidth: any;
  callAlertMessage: boolean = true;
  alertDataAPI: any = [];
  userDetails: any;
  count: boolean = true;
  countryCode: any;
  localizationAPIHit: any = null;
  languageAPIHit: any = null;
  userConfigAPIHit: any = null;
  // localizationData: any = {
  //   currencyFormat: "",
  //   currencySymbol: "",
  //   languages: [],
  //   greetings: [],
  //   numberFormat: "",
  //   allowedISD: [],
  //   selectedDateFormats: "",
  //   selectedDayLightSavingTime: "",
  //   selectedTimeFormats: "",
  //   selectedTimeZoneFormat: "",
  //   textOrientation: "",
  // };
  localizationData: any = {
    currencyFormat: "00,00,000",
    currencySymbol: "&#8377;",
    languages: [
      {
        Id: "245",
        ModuleName: "English",
        ParentControlId: "71",
        ParentModuleName: "Language",
        AssignedValue: "",
        AssignedProperty: "",
        AdditionalProperty: "",
        DefaultValue: "",
        Status: true,
        ProductName: "HUB ADMIN",
        LanguageCode: "en",
        ConfigKey: "",
        ConfigValue: "",
      },
    ],
    greetings: [],
    numberFormat: "+91",
    allowedISD: ["91"],
    selectedDateFormats: "dd/MM/yy",
    selectedDayLightSavingTime: "false",
    selectedTimeFormats: "h:mm a",
    selectedTimeZoneFormat: "",
    textOrientation: "",
  };
  auth: AuthService;
  loader: boolean;
  displayNameStore: any;
  newExcelfileName: any;
  moduleLabelNameStore: any;
  headerImg: any;
  subPlaceHolder3Values = [
    { Key: "lineChart", Value: "Line Chart" },
    { Key: "gaugeChart", Value: "Gauge Chart" },
    { Key: "time", Value: "Time" },
  ];
  refreshIntervalIdForLocalizationData: any;
  refreshIntervalIdForUserConfigData: any;
  refreshIntervalIdForMasterConfigData: any;
  ApiStatusLocalization = 1;
  ApiStatusUserConfig = 1;
  ApiStatusMasterConfig = 1;
  path: any;
  editObj: any;
  UserProfile: any = {};
  userChannelName: any = {};
  userLanguageName: any = {};
  // storeURL={'Products':"masters/customerproduct",
  // 'User Groups':"masters/user-group",'Broadcast':"masters/broadcast"}
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private api: ApiService,
    private excelService: ExcelService,
    public datepipe: DatePipe,
    private router: Router,
    private week: WeekPipe
  ) {
    if (this.callAlertMessage) {
      this.alertMessageApi();
    }
    Object.assign(this, {
      countryCode,
      AllIcons,
      hubmoduleicon,
      flagAndSPName,
    });
    this.getScreenSize();
    // if (this.count) {
    //   this.getLocalizationData();
    // }
    // alert(JSON.stringify(this.getUser()))
    if (
      localStorage.getItem("authuser") != null &&
      localStorage.getItem("authuser") != undefined
    ) {
      this.userDetails = this.getUser();
      // this.testFunction()
      this.getInitialData();
      // this.getLabelsFromLocalStorage();
      // this.getAllLabelsByProcessId();
    }
  }
  getInitialData() {
    this.userDetails = this.getUser();
    if (!localStorage.getItem("labels")) this.getLabelsFromBrandingJson();
    // console.log("from localstorage:",localStorage.getItem("localizationData")  == (null || undefined))
    if (
      localStorage.getItem("localizationData") == (null || undefined) ||
      Object.keys(JSON.parse(localStorage.getItem("localizationData")))
        .length <= 0
    ) {
      this.refreshIntervalIdForLocalizationData = setInterval(() => {
        // if (this.router.url == "/dashboard") {
        // console.log(localStorage.getItem("localizationData")  == (null || undefined) ,":", Object.keys(JSON.parse(localStorage.getItem("localizationData"))).length <= 0);
        this.getMasterConfig$.subscribe((data) => {
          if (Object.keys(data).length > 0) {
            if (this.ApiStatusLocalization != 2) {
              this.setLocalizationData();
            }
          }
        });
        // }
      }, 1000);
    } else {
      clearInterval(this.refreshIntervalIdForLocalizationData);
      this.setLocalizationData();
    }
    if (
      localStorage.getItem("masterConfig") == (null || undefined) ||
      Object.keys(JSON.parse(localStorage.getItem("masterConfig"))).length <= 0
    ) {
      this.refreshIntervalIdForMasterConfigData = setInterval(() => {
        if (this.ApiStatusMasterConfig != 2) {
          this.setMasterConfig();
        }
      }, 1000);
    } else {
      clearInterval(this.refreshIntervalIdForMasterConfigData);
      this.setMasterConfig();
    }
    if (
      localStorage.getItem("userConfig") == (null || undefined) ||
      Object.keys(JSON.parse(localStorage.getItem("userConfig"))).length <= 0
    ) {
      this.refreshIntervalIdForUserConfigData = setInterval(() => {
        if (this.ApiStatusUserConfig != 2) {
          this.getUserConfigFromApi();
        }
      }, 1000);
    } else {
      clearInterval(this.refreshIntervalIdForUserConfigData);
    }
  }
  isAuthUserAvailable() {
    return localStorage.getItem("authuser") ? true : false;
  }
  setUserDetails() {
    this.userDetails = this.getUser();
  }
  getScreenSize(event?) {
    this.scrHeight = window.innerHeight;
    this.scrWidth = window.innerWidth;
  }
  alertMessageApi() {
    if (this.alertDataAPI.length == 0) {
      this.callAlertMessage = false;
      let obj = {
        data: {
          spname: "usp_unfyd_alert_msg_config",
          parameters: {
            flag: "GET_ALERT_SNACKBAR",
            PROCESSID: 1,
            PRODUCTID: 11,
            LANGUAGECODE: "en",
          },
        },
      };
      this.api.post("index", obj).subscribe(
        (res) => {
          if (res.code == 200) {
            this.alertDataAPI = res.results.data;
          } else {
          }
        },
        (error) => {
          console.log(error);
          // this.snackbar("General Error",'error');
        }
      );
    }
  }
  setEncrypted(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }
  setEncrypted2(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(value.toString()),
      key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return encrypted.toString();
  }
  //The get method is use for decrypt the value.
  getDecrypted(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    if (!value) return null;
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  getHashMd5(value) {
    var md5 = new Md5();
    let valuetohash = Md5.hashStr(value);
    // console.log("valuetohash", valuetohash);
    return valuetohash;
  }
  getChild(): Observable<any> {
    return this.isChild.asObservable();
  }
  setChild(oCase) {
    localStorage.setItem("parent_menu", oCase.ModuleGroupping);
    this.isChild.next(oCase);
  }
  snackbar(
    message: string,
    status?: string,
    horizontal?: any,
    vertical?: any,
    snackDuration?: number
  ) {
    let alertMessages = this.alertDataAPI;
    let alertMessagesNew = [];
    if (this.alertDataAPI)
      alertMessagesNew = alertMessages?.filter(
        (a) => a["Alert Message"] == message
      );
    let s;
    if (alertMessagesNew.length != 0) {
      if (alertMessagesNew[0]["Message Sub Type"]?.toLowerCase() == "success"
      ) {
        s = "greenMsg";
      } else if (
        alertMessagesNew[0]["Message Sub Type"]?.toLowerCase() == "error"
      ) {
        s = "redMsg";
      } else if (
        alertMessagesNew[0]["Message Sub Type"]?.toLowerCase() == "warning"
      ) {
        s = "yellowMsg";
      }
      return this.snackBar.open(alertMessagesNew[0].Remarks, "x", {
        horizontalPosition:
          alertMessagesNew[0]["Alert Message Position"] == "bottom-center"
            ? "center"
            : alertMessagesNew[0]["Alert Message Position"] == "bottom-right"
            ? "right"
            : alertMessagesNew[0]["Alert Message Position"] == "bottom-left"
            ? "left"
            : alertMessagesNew[0]["Alert Message Position"] == "top-left"
            ? "left"
            : alertMessagesNew[0]["Alert Message Position"] == "top-center"
            ? "center"
            : alertMessagesNew[0]["Alert Message Position"] == "top-right"
            ? "right"
            : alertMessagesNew[0]["Alert Message Position"] == "center"
            ? "center"
            : "right",
        //horizontalPosition :horizontal? horizontal: 'right',
        verticalPosition: vertical ? vertical : "top",
        duration: +alertMessagesNew[0]["Alert Message Duration"]
          ? +alertMessagesNew[0]["Alert Message Duration"] * 1000
          : 5000,
        panelClass: [s],
      });
    } else {
      let s;
      if (status == "success") {
        s = "greenMsg";
      } else if (status == "error") {
        s = "redMsg";
      } else if (status == "warning") {
        s = "yellowMsg";
      }
      return this.snackBar.open(message, "x", {
        horizontalPosition: "right",
        verticalPosition: "top",
        duration: 5000,
        panelClass: [s],
      });
    }
  }
  snackbar2Paramerter(
    message: string,
    Parameter?: any,
    status?: string,
    horizontal?: any,
    vertical?: any,
    snackDuration?: number
  ) {
    let alertMessages = this.alertDataAPI;
    let alertMessagesNew = [];
    if (this.alertDataAPI)
      alertMessagesNew = alertMessages?.filter(
        (a) => a["Alert Message"] == message
      );
    let alertmsg = alertMessagesNew[0].Remarks;
    let Para = Parameter;
    let finalmsg = alertmsg + " " + Para;
    let s;
    if (alertMessagesNew.length != 0) {
      if (alertMessagesNew[0]["Message Sub Type"]?.toLowerCase() == "success") {
        s = "greenMsg";
      } else if (
        alertMessagesNew[0]["Message Sub Type"]?.toLowerCase() == "error"
      ) {
        s = "redMsg";
      } else if (
        alertMessagesNew[0]["Message Sub Type"]?.toLowerCase() == "warning"
      ) {
        s = "yellowMsg";
      }
      return this.snackBar.open(finalmsg, "x", {
        horizontalPosition:
          alertMessagesNew[0]["Alert Message Position"] == "bottom-center"
            ? "center"
            : alertMessagesNew[0]["Alert Message Position"] == "bottom-right"
            ? "right"
            : alertMessagesNew[0]["Alert Message Position"] == "bottom-left"
            ? "left"
            : alertMessagesNew[0]["Alert Message Position"] == "top-left"
            ? "left"
            : alertMessagesNew[0]["Alert Message Position"] == "top-center"
            ? "center"
            : alertMessagesNew[0]["Alert Message Position"] == "top-right"
            ? "right"
            : alertMessagesNew[0]["Alert Message Position"] == "center"
            ? "center"
            : "right",
        //horizontalPosition :horizontal? horizontal: 'right',
        verticalPosition: vertical ? vertical : "top",
        duration: +alertMessagesNew[0]["Alert Message Duration"]
          ? +alertMessagesNew[0]["Alert Message Duration"] * 1000
          : 5000,
        panelClass: [s],
      });
    } else {
      let s;
      if (status == "success") {
        s = "greenMsg";
      } else if (status == "error") {
        s = "redMsg";
      } else if (status == "warning") {
        s = "yellowMsg";
      }
      return this.snackBar.open(message, "x", {
        horizontalPosition: "right",
        verticalPosition: "top",
        duration: 5000,
        panelClass: [s],
      });
    }
  }
  ConvertKeysToLowerCase() {
    this.lowercaseKeys = (obj) =>
      Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = obj[key];
        return acc;
      }, {});
    return this.lowercaseKeys;
  }
  getLocation(event, type) {
    return new Observable((observer) => {
      if (type == "Country") {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_locations",
            parameters: {
              flag: "COUNTRIES",
            },
          },
        };
      } else if (type == "State") {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_locations",
            parameters: {
              flag: "STATES",
              countryid: event,
            },
          },
        };
      } else if (type == "District") {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_locations",
            parameters: {
              flag: "DISTRICT",
              stateid: event,
            },
          },
        };
      } else if (type == "Pincode") {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_locations",
            parameters: {
              flag: "ZIPCODES",
              districtid: event,
            },
          },
        };
      } else if (type == "DistrictForEmp") {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_locations",
            parameters: {
              flag: "DISTRICT_EMP_PRO",
              districtid: event,
            },
          },
        };
      }
      this.api.post("index", this.requestObj).subscribe(
        (res) => {
          // console.log("LOCATION API OBJ: ", this.requestObj);
          if (res.code == 200) {
            console.log("response API OBJ: ", res);
            observer.next(res.results.data);
          }
        },
        (error) => {}
      );
    });
  }
  getGST(_processid: any, _productid: any) {
    return new Observable((observer) => {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_hsn_gst_master",
          parameters: {
            flag: "DROPDOWN",
            processid: _processid,
            productid: _productid,
          },
        },
      };
      this.api.post("index", this.requestObj).subscribe(
        (res) => {
          if (res.code == 200) {
            observer.next(res.results.data);
          }
        },
        (error) => {}
      );
    });
  }
  private getPrint: Subject<any> = new Subject<any>();
  getPrint$: Observable<any> = this.getPrint.asObservable();
  setPrint(type, data) {
    var obj = {
      type: type,
      data: data,
    };
    this.getPrint.next(obj);
  }
  changePassword(obj: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "ChangePassword",
        data: obj,
        // master: data.hawkerid
      },
      width: "548px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((status) => {
      if (status !== undefined) {
        this.hawkerloginSmallLoader = false;
      }
    });
    this.hawkerloginSmallLoader = false;
  }
  private getReportChange: Subject<any> = new Subject<any>();
  getReportChange$: Observable<any> = this.getReportChange.asObservable();
  setReportChange(data) {
    this.getReportChange.next({ status: true, type: data });
  }
  private ReportChange: Subject<any> = new Subject<any>();
  ReportChange$: Observable<any> = this.ReportChange.asObservable();
  ChangeReport(data) {
    this.ReportChange.next({ status: true, data: data });
  }
  getreportItemsPerPage: Subject<number> = new Subject<number>();
  getreportItemsPerPage$: Observable<number> =
    this.getreportItemsPerPage.asObservable();
  setItemsReportPerPage(event) {
    this.getreportItemsPerPage.next(event);
  }
  private getIndividualUpload: Subject<any> = new Subject<any>();
  getIndividualUpload$: Observable<any> =
    this.getIndividualUpload.asObservable();
  individualUpload(data) {
    this.uploadCategory = data.category;
    this.currentDateTime = this.datepipe.transform(
      new Date(),
      "ddMMyyyyhhmmss"
    );
    this.uniqueID = "UQ" + this.currentDateTime;
    this.requestObj = {
      data: {
        spname: "usp_unfyd_contact_kyc_fileurl",
        category: data.category,
        parameters: {
          flag: data.flag,
          id: data.documentId,
          userid: data.Id,
          processid: data.Processid,
          productid: 1,
          contactid: data.hawkerid == undefined ? this.uniqueID : data.hawkerid,
          createdby: data.createdby,
          modifiedby: data.modifiedby,
          isdeleted: 0,
          deletedby: null,
          publicip: data.ip,
          privateip: "",
          browsername: data.browser,
          browserversion: data.browser_version,
        },
      },
    };
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "add-document",
        data: this.requestObj,
        master: data.hawkerid == undefined ? this.uniqueID : data.hawkerid,
      },
      width: "30%",
      disableClose: true,
      // width: '748px'
    });
    dialogRef.afterClosed().subscribe((status) => {
      if (status !== false) {
        this.getIndividualUpload.next({
          category: this.uploadCategory,
          status: status,
        });
      }
    });
  }
  individualUploadEmp(data) {
    this.uploadCategory = data.category;
    this.currentDateTime = this.datepipe.transform(
      new Date(),
      "ddMMyyyyhhmmss"
    );
    this.uniqueID = "UQ" + this.currentDateTime;
    this.requestObj = {
      data: {
        spname: "usp_unfyd_emp_kyc_fileurl",
        category: data.category,
        parameters: {
          flag: data.flag,
          id: data.documentId,
          userid: data.Id,
          processid: data.Processid,
          productid: 1,
          contactid:
            data.contactid == undefined ? this.uniqueID : data.contactid,
          createdby: data.createdby,
          modifiedby: data.modifiedby,
          isdeleted: 0,
          deletedby: null,
          publicip: data.ip,
          privateip: "",
          browsername: data.browser,
          browserversion: data.browser_version,
        },
      },
    };
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "add-document",
        data: this.requestObj,
        master: data.contactid == undefined ? this.uniqueID : data.contactid,
      },
      width: "30%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((status) => {
      this.getIndividualUpload.next({
        category: this.uploadCategory,
        status: status,
      });
    });
  }
  setSingleImageEmp(data) {
    var obj = {
      data: {
        spname: "usp_unfyd_emp_kyc_fileurl",
        parameters: {
          flag: "GETSINGLEVALUE",
          processid: data.processid,
          productid: 1,
          contactid: data.contactid,
          category: data.category,
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      var obj = res.results.data[0];
      this.getSingleImage.next(obj);
      if (data?.type == "document") {
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            type: "fileView",
            data: obj,
            master: data.contactid,
          },
        });
      }
    });
  }
  private closePopup: Subject<any> = new Subject<any>();
  // private closePopup = new BehaviorSubject<any>;
  _closePopup = this.closePopup.asObservable();
  closePopupvalues(status, data, url) {
    let obj = {
      status: status,
      data: data,
      imageUrl: url,
    };
    this.closePopup.next(obj);
  }
  private deleteImg: Subject<any> = new Subject<any>();
  // private closePopup = new BehaviorSubject<any>;
  _deleteImg = this.deleteImg.asObservable();
  closePopupDeleteImg(url) {
    let obj = {
      icon: url,
    };
    this.deleteImg.next(obj);
  }
  private callGetAlert: Subject<any> = new Subject<any>();
  _callGetAlert = this.callGetAlert.asObservable();
  callGetAlertMethod(url) {
    let obj = {
      icon: url,
    };
    this.callGetAlert.next(obj);
  }
  private openComponent: Subject<boolean> = new Subject<boolean>();
  openComponent$: Observable<boolean> = this.openComponent.asObservable();
  closeComponent() {
    this.openComponent.next(true);
  }
  private hawkerID: Subject<any> = new Subject<any>();
  hawkerID$: Observable<any> = this.hawkerID.asObservable();
  hawkerIDChanged(id) {
    this.hawkerID.next(id);
  }
  configView: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  configView$: Observable<any> = this.configView.asObservable();
  contactId: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  contactId$: Observable<any> = this.contactId.asObservable();
  labelView: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  labelView$: Observable<any> = this.labelView.asObservable();
  resetSearch: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  resetSearch$: Observable<any> = this.resetSearch.asObservable();
  securityView: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  securityView$: Observable<any> = this.securityView.asObservable();
  categoryValue: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  categoryValue$: Observable<any> = this.categoryValue.asObservable();
  refreshTable: Subject<boolean> = new Subject<boolean>();
  refreshTable$: Observable<boolean> = this.refreshTable.asObservable();
  productTabs: Subject<any> = new BehaviorSubject<any>(false);
  productTabs$: Observable<any> = this.productTabs.asObservable();
  getItemsPerPage: Subject<number> = new Subject<number>();
  getItemsPerPage$: Observable<number> = this.getItemsPerPage.asObservable();
  setItemsPerPage(event) {
    this.getItemsPerPage.next(event);
  }
  // getreportItemsPerPage: Subject<number> = new Subject<number>();
  // getreportItemsPerPage$: Observable<number> = this.getreportItemsPerPage.asObservable();
  // setItemsReportPerPage(event) {
  //   this.getreportItemsPerPage.next(event);
  // }
  private channelroutepopup: BehaviorSubject<any> = new BehaviorSubject<any>(
    "1"
  );
  channelroutepopup$: Observable<string> =
    this.channelroutepopup.asObservable();
  setchannelroutepopup(event) {
    this.channelroutepopup.next(event);
  }
  // private channelroutepopup: Subject<any> = new Subject<any>();
  // channelroutepopup$: Observable<any> = this.channelroutepopup.asObservable();
  // setchannelroutepopup(id) {
  //   alert(id + " from common")
  //   this.channelroutepopup.next(id);
  // }
  getSearch: Subject<string> = new Subject<string>();
  getSearch$: Observable<string> = this.getSearch.asObservable();
  setSearch(event) {
    this.getSearch.next(event);
  }
  private hsmtabletoggle: Subject<string> = new Subject<string>();
  hsmtabletoggle$: Observable<string> = this.hsmtabletoggle.asObservable();
  hsmtabletogglefunc(event) {
    this.hsmtabletoggle.next(event);
  }
  private emailtabletoggle: Subject<string> = new Subject<string>();
  emailtabletoggle$: Observable<string> = this.emailtabletoggle.asObservable();
  emailtabletogglefunc(event) {
    this.emailtabletoggle.next(event);
  }
  broadcastproductid: Subject<string> = new Subject<string>();
  broadcastproductid$: Observable<string> =
    this.broadcastproductid.asObservable();
  // broadcastproductidfunc(event) {
  //   this.broadcastproductid.next(event);
  // }
  getLanguageConfig: Subject<any> = new Subject<any>();
  getLanguageConfig$: Observable<any> = this.getLanguageConfig.asObservable();
  setLanguageConfig(code) {
    this.getLanguageConfig.next(code);
  }
  languageChanged: Subject<any> = new Subject<any>();
  languageChanged$: Observable<any> = this.languageChanged.asObservable();
  setLanguageChanged(code) {
    this.languageChanged.next(code);
  }
  getLabelConfig: Subject<any> = new Subject<any>();
  getLabelConfig$: Observable<any> = this.getLabelConfig.asObservable();
  setLabelConfig(processId, moduleName, language) {
    if (localStorage.getItem("labels")) {
      let a = JSON.parse(localStorage.getItem("labels"));
      // console.log(
      //   processId,
      //   parseInt(this.userDetails.ProductId),
      //   localStorage.getItem("lang"),
      //   moduleName
      // );
      // parseInt(this.userDetails.ProductId)
      let b;
      if (
        Object.keys(
          a[processId][parseInt(this.userDetails.ProductId)]
        ).includes(localStorage.getItem("lang"))
      ) {
        b =
          a[processId][parseInt(this.userDetails.ProductId)][
            localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
          ][moduleName];
      } else {
        b =
          a[processId][parseInt(this.userDetails.ProductId)]["en"][moduleName];
        this.getChangedLabelsFromBrandingJson(processId, moduleName, language);
      }
      // console.log(b);
      let c =
        a[processId][parseInt(this.userDetails.ProductId)]["en"][moduleName];
      let d: any;
      if (!b) {
        d = c;
      } else if (Object.keys(b).length <= 0) {
        d = c;
      } else if (Object.keys(b).length != Object.keys(c).length) {
        Object.keys(c).forEach((element) => {
          if (!Object.keys(b).includes(element)) {
            Object.assign(b, { [element]: c[element] });
          }
        });
        d = b;
      } else {
        d = b;
      }
      this.getLabelConfig.next({ ...d });
    } else {
      this.getLabelsFromLocalStorage();
      this.returnLabels$.subscribe((res) => {
        let a = res;
        // console.log(
        //   processId,
        //   parseInt(this.userDetails.ProductId),
        //   localStorage.getItem("lang"),
        //   moduleName
        // );
        // parseInt(this.userDetails.ProductId)
        let b;
        if (
          Object.keys(
            a[processId][parseInt(this.userDetails.ProductId)]
          ).includes(localStorage.getItem("lang"))
        ) {
          b =
            a[processId][parseInt(this.userDetails.ProductId)][
              localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
            ][moduleName];
        } else {
          b =
            a[processId][parseInt(this.userDetails.ProductId)]["en"][
              moduleName
            ];
        }
        let c =
          a[processId][parseInt(this.userDetails.ProductId)]["en"][moduleName];
        let d: any;
        if (!b) {
          d = c;
        } else if (Object.keys(b).length <= 0) {
          d = c;
        } else if (Object.keys(b).length != Object.keys(c).length) {
          Object.keys(c).forEach((element) => {
            if (!Object.keys(b).includes(element)) {
              Object.assign(b, { [element]: c[element] });
            }
          });
          d = b;
        } else {
          d = b;
        }
        this.getLabelConfig.next({ ...d });
      });
    }
  }
  //       this.getLabelConfig.next({ ...d });
  //     })
  //   }
  // }
  // async setLabelConfig2(processId, moduleName, language) {
  //   if (localStorage.getItem("labels")) {
  //     let a = JSON.parse(localStorage.getItem("labels"));
  //     let b;
  //     if (Object.keys(a[processId][1]).includes(localStorage.getItem("lang"))) {
  //       b =
  //         a[processId][1][
  //         localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
  //         ][moduleName];
  //     } else {
  //       b = a[processId][1]["en"][moduleName];
  //     }
  //     let c = a[processId][1]["en"][moduleName];
  //     let d: any;
  //     if (!b) {
  //       d = c;
  //     } else if (Object.keys(b).length <= 0) {
  //       d = c;
  //     } else if (Object.keys(b).length != Object.keys(c).length) {
  //       Object.keys(c).forEach((element) => {
  //         if (!Object.keys(b).includes(element)) {
  //           Object.assign(b, { [element]: c[element] });
  //         }
  //       });
  //       d = b;
  //     } else {
  //       d = b;
  //     }
  //     this.getLabelConfig.next({ ...d });
  //   } else {
  //     this.getLabelsFromLocalStorage()
  //     this.returnLabels$.subscribe(res => {
  //       let a = res;
  //       let b;
  //       if (Object.keys(a[processId][1]).includes(localStorage.getItem("lang"))) {
  //         b =
  //           a[processId][1][
  //           localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
  //           ][moduleName];
  //       } else {
  //         b = a[processId][1]["en"][moduleName];
  //       }
  //       let c = a[processId][1]["en"][moduleName];
  //       let d: any;
  //       if (!b) {
  //         d = c;
  //       } else if (Object.keys(b).length <= 0) {
  //         d = c;
  //       } else if (Object.keys(b).length != Object.keys(c).length) {
  //         Object.keys(c).forEach((element) => {
  //           if (!Object.keys(b).includes(element)) {
  //             Object.assign(b, { [element]: c[element] });
  //           }
  //         });
  //         d = b;
  //       } else {
  //         d = b;
  //       }
  //       this.getLabelConfig.next({ ...d });
  //     })
  //   }
  // }
  async setLabelConfig2(processId, moduleName, language) {
    if (localStorage.getItem("labels")) {
      let a = JSON.parse(localStorage.getItem("labels"));
      // console.log(
      //   processId,
      //   parseInt(this.userDetails.ProductId),
      //   localStorage.getItem("lang"),
      //   moduleName
      // );
      // parseInt(this.userDetails.ProductId)
      let b;
      if (
        Object.keys(
          a[processId][parseInt(this.userDetails.ProductId)]
        ).includes(localStorage.getItem("lang"))
      ) {
        b =
          a[processId][parseInt(this.userDetails.ProductId)][
            localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
          ][moduleName];
      } else {
        b =
          a[processId][parseInt(this.userDetails.ProductId)]["en"][moduleName];
      }
      // console.log(b);
      let c =
        a[processId][parseInt(this.userDetails.ProductId)]["en"][moduleName];
      let d: any;
      if (!b) {
        d = c;
      } else if (Object.keys(b).length <= 0) {
        d = c;
      } else if (Object.keys(b).length != Object.keys(c).length) {
        Object.keys(c).forEach((element) => {
          if (!Object.keys(b).includes(element)) {
            Object.assign(b, { [element]: c[element] });
          }
        });
        d = b;
      } else {
        d = b;
      }
      this.getLabelConfig.next({ ...d });
    } else {
      this.getLabelsFromLocalStorage();
      this.returnLabels$.subscribe((res) => {
        let a = res;
        // console.log(
        //   processId,
        //   parseInt(this.userDetails.ProductId),
        //   localStorage.getItem("lang"),
        //   moduleName
        // );
        // parseInt(this.userDetails.ProductId)
        let b;
        if (
          Object.keys(
            a[processId][parseInt(this.userDetails.ProductId)]
          ).includes(localStorage.getItem("lang"))
        ) {
          b =
            a[processId][parseInt(this.userDetails.ProductId)][
              localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
            ][moduleName];
        } else {
          b =
            a[processId][parseInt(this.userDetails.ProductId)]["en"][
              moduleName
            ];
        }
        // console.log(b);
        let c =
          a[processId][parseInt(this.userDetails.ProductId)]["en"][moduleName];
        let d: any;
        if (!b) {
          d = c;
        } else if (Object.keys(b).length <= 0) {
          d = c;
        } else if (Object.keys(b).length != Object.keys(c).length) {
          Object.keys(c).forEach((element) => {
            if (!Object.keys(b).includes(element)) {
              Object.assign(b, { [element]: c[element] });
            }
          });
          d = b;
        } else {
          d = b;
        }
        this.getLabelConfig.next({ ...d });
      });
    }
  }
  getLoaderStatus: Subject<boolean> = new Subject<boolean>();
  getLoaderStatus$: Observable<boolean> = this.getLoaderStatus.asObservable();
  setLoaderStatus(status) {
    this.getLoaderStatus.next(status);
  }
  private getHawkerId: Subject<string> = new Subject<string>();
  getHawkerId$: Observable<string> = this.getHawkerId.asObservable();
  setHawkerId(id) {
    this.getHawkerId.next(id);
  }
  getTableKey: Subject<any[]> = new Subject<any[]>();
  getTableKey$: Observable<any[]> = this.getTableKey.asObservable();
  // setTableKey(object) {
  // }
  setTableKey(object) {
    this.getTableKey.next(object);
  }
  private editDashboard: Subject<any[]> = new Subject<any[]>();
  editDashboard$: Observable<any[]> = this.editDashboard.asObservable();
  editDashboardMethod(object) {
    this.editDashboard.next(object);
  }
  private unfydMasterForm: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  unfydMasterForm$: Observable<any> = this.unfydMasterForm.asObservable();
  unfydMasterFormMethod(obj) {
    this.unfydMasterForm.next(obj);
  }
  private getSingleImage: Subject<any> = new Subject<any>();
  getSingleImage$: Observable<any> = this.getSingleImage.asObservable();
  setSingleImage(data) {
    var obj = {
      data: {
        spname: "usp_unfyd_contact_kyc_fileurl",
        parameters: {
          flag: "GETSINGLEVALUE",
          processid: data.processid,
          productid: 1,
          contactid: data.contactid,
          category: data.category,
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      var obj = res.results.data[0];
      this.getSingleImage.next(obj);
      if (data?.type == "document") {
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            type: "fileView",
            data: obj,
            master: data.contactid,
          },
          //width: '30%'
        });
      }
    });
  }
  @Output() filterDynamic: EventEmitter<Object> = new EventEmitter();
  filter(value: any) {
    this.filterDynamic.emit(value);
  }
  toFormGroup(questions: any = []) {
    const group: any = {};
    questions.forEach((question) => {
      if (question.key == "ContractStartDate" || question.key == "Date") {
        group[question.key] = new FormGroup({});
        group[question.key].addControl("startDate", new FormControl(moment()));
        group[question.key].addControl("endDate", new FormControl(moment()));
      } else {
        group[question.key] = question.required
          ? new FormControl(question.value || undefined, Validators.required)
          : new FormControl(question.value || undefined);
      }
    });
    return new FormGroup(group);
  }
  @Output() agentFilterDynamic: EventEmitter<Object> = new EventEmitter();
  agentFilter(value: any) {
    this.agentFilterDynamic.emit(value);
  }
  @Output() reportsDataEmitter: EventEmitter<Object> = new EventEmitter();
  reportData(value: any) {
    this.reportsDataEmitter.emit(value);
  }
  @Output() categoryDataEmitter: EventEmitter<Object> = new EventEmitter();
  categoryData(value: any) {
    this.categoryDataEmitter.emit(value);
  }
  @Output() eventDataEmitter: EventEmitter<Object> = new EventEmitter();
  eventData(value: any) {
    this.eventDataEmitter.emit(value);
  }
  @Output() userDataEmitter: EventEmitter<Object> = new EventEmitter();
  userData(value: any) {
    this.userDataEmitter.emit(value);
  }
  @Output() reportsTabKeyData: EventEmitter<Object> = new EventEmitter();
  reportTabKeyData(value: any) {
    this.reportsTabKeyData.emit(value);
  }
  @Output() tabValueLength: EventEmitter<Object> = new EventEmitter();
  tabValueLengthData(value: any) {
    this.tabValueLength.emit(value);
  }
  @Output() exportReportEmitter: EventEmitter<Object> = new EventEmitter();
  exportReport(value: any) {
    this.exportReportEmitter.emit(value);
  }
  @Output() exportEmitter: EventEmitter<Object> = new EventEmitter();
  export(value: any) {
    this.exportEmitter.emit(value);
  }
  @Output() tabChange: EventEmitter<any> = new EventEmitter();
  setTabChange(value: any, productId) {
    this.tabChange.emit({ tabe: value, productId: productId });
  }
  private reloadTime: Subject<any> = new Subject<any>();
  reloadTime$: Observable<any> = this.reloadTime.asObservable();
  reloadTimeMethod(obj) {
    this.reloadTime.next(obj);
  }
  autoRefreshDashboard: Subject<any> = new Subject<any>();
  autoRefreshDashboard$: Observable<any> =
    this.autoRefreshDashboard.asObservable();
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  previewAlertPopup(data) {
    let width = "30%";
    let calWidth = parseInt(width.substring(0, 2));
    let left, right, top, bottom;
    if (data.data.alertMsgPos == "center") {
      // x = 'calc(100vw - 20px)',
      // y = 'calc(100vh - 20px)'
    } else if (data.data.alertMsgPos == "top-right") {
      // x = 100 - calWidth +'vw';
      // y = '5vh';
      (top = "10px"), (right = "5px");
    } else if (data.data.alertMsgPos == "bottom-right") {
      // x = 100 - calWidth +'vw';
      // y = '50vh';
      (bottom = "30px"), (right = "5px");
    } else if (data.data.alertMsgPos == "top-center") {
      // x = '20px';
      top = "10px";
    } else if (data.data.alertMsgPos == "bottom-center") {
      // x = '20px';
      bottom = "30px";
    } else if (data.data.alertMsgPos == "top-left") {
      top = "10px";
      left = "20px";
    } else if (data.data.alertMsgPos == "bottom-left") {
      bottom = "30px";
      left = "20px";
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "alertView",
        data: data,
      },
      width: "30%",
      disableClose: true,
      position: {
        left: left,
        top: top,
        bottom: bottom,
        right: right,
      },
    });
    dialogRef.afterClosed().subscribe((status) => {
      this.getIndividualUpload.next({
        category: this.uploadCategory,
        status: status,
      });
    });
  }
  getUser(): string | null {
    return JSON.parse(
      this.getDecrypted("123456$#@$^@1ERF", localStorage.getItem("authuser"))
    );
  }
  private customerproduct: Subject<any> = new Subject<any>();
  customerproduct$: Observable<any> = this.customerproduct.asObservable();
  customerproductMethod(obj) {
    this.customerproduct.next(obj);
  }
  private workspaceSession: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  workspaceSession$: Observable<any> = this.workspaceSession.asObservable();
  workspaceSessionMethod(obj) {
    this.workspaceSession.next(obj);
  }
  localizationDataAvailable: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  localizationDataAvailable$: Observable<any> =
    this.localizationDataAvailable.asObservable();
  localizationDataAvailableMethod(obj) {
    this.localizationDataAvailable.next(obj);
  }
  private workspaceAgent: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  workspaceAgent$: Observable<any> = this.workspaceAgent.asObservable();
  workspaceAgentMethod(obj) {
    this.workspaceAgent.next(obj);
  }
  reloadData: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  reloadData$: Observable<any> = this.reloadData.asObservable();
  reloadDataMethod(obj) {
    this.reloadData.next(obj);
  }
  userMasterData: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  userMasterData$: Observable<any> = this.userMasterData.asObservable();
  userDataMethod(obj) {
    this.reloadData.next(obj);
  }
  private dashboardCards: Subject<any> = new Subject<any>();
  dashboardCards$: Observable<any> = this.dashboardCards.asObservable();
  dashboardCardsMethod(obj) {
    this.dashboardCards.next(obj);
  }
  dummyDateData = {
    currencyFormat: "00,00,000",
    currencySymbol: "&#8377;",
    greetings: [],
    numberFormat: "+91",
    allowedISD: ["91"],
    selectedDateFormats: "dd MMMM yyyy",
    selectedDayLightSavingTime: false,
    selectedTimeFormats: "hh:mm:ss",
    selectedTimeZoneFormat: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    textOrientation: "left",
  };
  localizationInfo: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.dummyDateData
  );
  localizationInfo$: Observable<any> = this.localizationInfo.asObservable();
  localizationInfoMethod(obj) {
    // alert('inside')
    // console.log("localizationData:",obj)
    this.localizationInfo.next(obj);
  }
  private a: BehaviorSubject<any> = new BehaviorSubject<any>({
    parse: {
      dateInput: "LL",
    },
    display: {
      dateInput: "dd/MM/yyyy",
      monthYearLabel: "dd/MM/yyyy",
      dateA11yLabel: "LL",
      monthYearA11yLabel: "LL",
    },
  });
  a$: Observable<any> = this.a.asObservable();
  aMethod(obj) {
    this.a.next(obj);
  }
  aa() {
    // return (this.a.asObservable()).subscribe
    this.a$.subscribe((res) => {
      // console.log(res);
      return res;
    });
  }
  private usersActionable: Subject<any> = new Subject<any>();
  usersActionable$: Observable<any> = this.usersActionable.asObservable();
  usersActionableMethod(obj) {
    // console.log(obj);
    this.usersActionable.next(obj);
  }
  color = {
    blue: getComputedStyle(document.body).getPropertyValue("--universalBlue"),
    green: getComputedStyle(document.body).getPropertyValue("--universalGreen"),
    red: getComputedStyle(document.body).getPropertyValue("--universalRed"),
    yellow: getComputedStyle(document.body).getPropertyValue(
      "--universalYellow"
    ),
    orange: getComputedStyle(document.body).getPropertyValue(
      "--universalOrange"
    ),
    purple: getComputedStyle(document.body).getPropertyValue(
      "--universalPurple"
    ),
    gray: getComputedStyle(document.body).getPropertyValue("--universalGray"),
    Skyblue: getComputedStyle(document.body).getPropertyValue("--skyblueColor"),
    lightOrange: getComputedStyle(document.body).getPropertyValue(
      "--lightOrangeColor"
    ),
    lightPurple: getComputedStyle(document.body).getPropertyValue(
      "--lightPurpleColor"
    ),
    ParrotGreen: getComputedStyle(document.body).getPropertyValue(
      "--ParrotGreenColor"
    ),
  };
  color2 = {
    darkblue: getComputedStyle(document.body).getPropertyValue(
      "--primary_color"
    ),
    blue: getComputedStyle(document.body).getPropertyValue("--universalBlue"),
    green: getComputedStyle(document.body).getPropertyValue("--universalGreen"),
    orange: getComputedStyle(document.body).getPropertyValue(
      "--universalOrange"
    ),
    gray: getComputedStyle(document.body).getPropertyValue("--universalGray"),
    yellow: getComputedStyle(document.body).getPropertyValue(
      "--universalYellow"
    ),
    purple: getComputedStyle(document.body).getPropertyValue(
      "--universalPurple"
    ),
    red: getComputedStyle(document.body).getPropertyValue("--universalRed"),
  };
  themeColor = {
    blueTone: getComputedStyle(document.body).getPropertyValue("--blueTone"),
    greenTone: getComputedStyle(document.body).getPropertyValue("--greenTone"),
    redTone: getComputedStyle(document.body).getPropertyValue("--redTone"),
    yellowTone: getComputedStyle(document.body).getPropertyValue(
      "--yellowTone"
    ),
    orangeTone: getComputedStyle(document.body).getPropertyValue(
      "--orangeTone"
    ),
    purpleTone: getComputedStyle(document.body).getPropertyValue(
      "--purpleTone"
    ),
    grayTone: getComputedStyle(document.body).getPropertyValue("--grayTone"),
  };
  themeColorSecondaryHexCode = {
    blueTone: getComputedStyle(document.body).getPropertyValue("--blueToneHex"),
    greenTone: getComputedStyle(document.body).getPropertyValue(
      "--greenToneHex"
    ),
    redTone: getComputedStyle(document.body).getPropertyValue("--redToneHex"),
    yellowTone: getComputedStyle(document.body).getPropertyValue(
      "--yellowToneHex"
    ),
    orangeTone: getComputedStyle(document.body).getPropertyValue(
      "--orangeToneHex"
    ),
    purpleTone: getComputedStyle(document.body).getPropertyValue(
      "--purpleToneHex"
    ),
    grayTone: getComputedStyle(document.body).getPropertyValue("--grayToneHex"),
  };
  themeSolidColor = {
    blueTone: getComputedStyle(document.body).getPropertyValue("--blueSolid"),
    greenTone: getComputedStyle(document.body).getPropertyValue("--greenSolid"),
    redTone: getComputedStyle(document.body).getPropertyValue("--redSolid"),
    yellowTone: getComputedStyle(document.body).getPropertyValue(
      "--yellowSolid"
    ),
    orangeTone: getComputedStyle(document.body).getPropertyValue(
      "--orangeSolid"
    ),
    purpleTone: getComputedStyle(document.body).getPropertyValue(
      "--purpleSolid"
    ),
    grayTone: getComputedStyle(document.body).getPropertyValue("--graySolid"),
  };
  secondayColor = {
    blue: getComputedStyle(document.body).getPropertyValue("--faintBlue"),
    green: getComputedStyle(document.body).getPropertyValue("--faintGreen"),
    red: getComputedStyle(document.body).getPropertyValue("--faintRed"),
    yellow: getComputedStyle(document.body).getPropertyValue("--faintYellow"),
    orange: getComputedStyle(document.body).getPropertyValue("--faintOrange"),
    purple: getComputedStyle(document.body).getPropertyValue("--faintPurple"),
    gray: getComputedStyle(document.body).getPropertyValue("--faintGray"),
  };
  IconData = {
    blueTone: getComputedStyle(document.body).getPropertyValue("--blueSolid"),
    greenTone: getComputedStyle(document.body).getPropertyValue("--greenSolid"),
    redTone: getComputedStyle(document.body).getPropertyValue("--redSolid"),
    yellowTone: getComputedStyle(document.body).getPropertyValue(
      "--yellowSolid"
    ),
    orangeTone: getComputedStyle(document.body).getPropertyValue(
      "--orangeSolid"
    ),
    purpleTone: getComputedStyle(document.body).getPropertyValue(
      "--purpleSolid"
    ),
    grayTone: getComputedStyle(document.body).getPropertyValue("--graySolid"),
  };
  colorArray = Object.keys(this.color);
  colorArray2 = Object.keys(this.color2);
  WebchatIconData = Object.keys(this.IconData);
  themeColorArray = Object.keys(this.themeColor);
  themeColorHexArray = Object.keys(this.themeColorSecondaryHexCode);
  themeSolidColorArray = Object.keys(this.themeSolidColor);
  iconArray = this.AllIcons;
  iconArray2 = this.hubmoduleicon;
  openDrillDown(title, req, url?) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "openDrillDown",
        title: title,
        req: req,
        url: url,
      },
      width: "80vw",
      // width:'100vw',
      height: "87vh",
      // maxWidth:'100vw',
      // maxHeight:'100vh'
    });
    dialogRef.afterClosed().subscribe((status) => {
      this.setUserConfig(this.userDetails.ProfileType, "Dashboard");
    });
  }
  private activateUser: Subject<any> = new Subject<any>();
  activateUser$: Observable<any> = this.activateUser.asObservable();
  activateUserMethod(obj) {
    // console.log(obj);
    this.activateUser.next(obj);
  }
  private addLabelInDialog: Subject<any> = new Subject<any>();
  addLabelInDialog$: Observable<any> = this.addLabelInDialog.asObservable();
  addLabelInDialogMethod(obj) {
    // console.log(obj);
    this.addLabelInDialog.next(obj);
  }
  selectProductGreeting: Subject<any> = new Subject<any>();
  selectProductGreeting$: Observable<any> =
    this.selectProductGreeting.asObservable();
  selectProductGreetingMethod(obj) {
    // console.log(obj);
    this.selectProductGreeting.next(obj);
  }
  private sendTabValueToFilter: Subject<any> = new Subject<any>();
  sendTabValueToFilter$: Observable<any> =
    this.sendTabValueToFilter.asObservable();
  sendTabValueToFilterMethod(obj) {
    this.sendTabValueToFilter.next(obj);
  }
  setting: Subject<any> = new Subject<any>();
  setting$: Observable<any> = this.setting.asObservable();
  settingChange(obj) {
    this.setting.next(obj);
  }
  dashboardFullScreen: Subject<any> = new Subject<any>();
  dashboardFullScreen$: Observable<any> =
    this.dashboardFullScreen.asObservable();
  dashboardFullScreenMethod(obj) {
    this.dashboardFullScreen.next(obj);
  }
  // displayNameStore=''
  // this.moduleNameStore.forEach(element =>{
  //     // debugger
  //     if(element.hasOwnProperty('Keys')){
  //         if(element.Keys.length>0){
  //             element.Keys.forEach(element1 =>{
  //                 if(this.router.url.toLowerCase().includes(element1.ModuleUrl.toLowerCase())){
  //                     // console.log("moduleurl",this.router.url.toLowerCase().includes(element1.ModuleUrl))
  //                     // console.log("element1",element1)
  //                     // console.log("element displayname",element1.DisplayName)
  //                     this. displayNameStore = element1.DisplayName
  //                     console.log("displayname", this.displayNameStore)
  //                 }
  //             })
  //         }
  //         else if(this.router.url.toLowerCase().includes(element.parantModuleUrl.toLowerCase())){
  //             console.log("Parenturl",this.router.url.toLowerCase().includes(element.parantModuleUrl))
  //             console.log("element",element)
  //             this.displayNameStore = element.DisplayName
  //         }
  //     }
  // })
  sendCERequest(eventName, processId) {
    var Obj;
    if (eventName == "UpdateAgentMappingMaster") {
      Obj = {
        EVENT: eventName,
        AGENTID: processId.Agentid,
        PROCESSID: processId.Processid,
      };
    } else {
      Obj = {
        EVENT: eventName,
        PROCESSID: processId,
      };
    }
    this.api.post("otherservice", Obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        // console.log(res.results.data[0]);
      }
    });
  }
  sendCEBotRequest(eventName, agentid, processId) {
    var Obj = {
      FLAG: "CEBOT",
      EVENT: "USERMASTER",
      AGENTID: agentid,
      PROCESSID: processId,
    };
    // console.log("Obj", Obj);
    this.api.post("otherservice", Obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        // console.log(res.results.data[0]);
      }
    });
  }
  sendCERequestObj(eventName, processId, Obj) {
    // console.log("Obj", Obj);
    this.api.post("otherservice", Obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        if (eventName == "EVENTSESSIONEND") this.snackbar("RemovedFromQueue");
        if (eventName == "EVENTQUEUEPRIORITY")
          this.snackbar("QueuePriorityHasBeenSet");
        this.refreshTable.next(true);
        // console.log(res.results.data[0]);
      }
    });
  }
  setAllLabelToJsonInNode(val, productId, languageCode) {
    if (val) {
      this.setLabelsToJsonFormat(val, productId, languageCode);
      // this.setLabelsToJsonFormatForWorkspaces(val)
    }
  }
  getAllLabelsByProcessId() {
    let obj = {
      data: {
        spname: "usp_unfyd_form_validation",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
        },
      },
    };
    this.api.post("index", obj).subscribe(
      (res) => {
        if (res.code == 200) {
          // this.setLabelsToJsonFormat(res.results.data);
          // this.setLabelsToJsonFormatForWorkspaces(res.results.data)
        } else if (res.code == 401) {
          this.snackbar("Token Expired Please Logout", "error");
        } else {
          this.snackbar("Something Went Wrong", "error");
        }
      },
      (error) => {
        if (error.code == 401) {
          this.snackbar("Token Expired Please Logout", "error");
        } else {
          this.snackbar("Something Went Wrong", "error");
        }
      }
    );
  }
  setLabelsToJsonFormatForWorkspaces(localizationData) {
    let a: any = {};
    // Sub Module
    localizationData.forEach((res) => {
      if (Object.keys(a).length > 0) {
        if (!Object.keys(a).includes(res["Process Id"].toString())) {
          a[res["Process Id"]] = {};
        }
      } else {
        a[res["Process Id"]] = {};
      }
      if (Object.keys(a[res["Process Id"]]).length > 0) {
        if (
          !Object.keys(a[res["Process Id"]]).includes(
            res["Product Id"].toString()
          )
        ) {
          a[res["Process Id"]][res["Product Id"]] = {};
        }
      } else {
        a[res["Process Id"]][res["Product Id"]] = {};
      }
      // console.log(a);
      if (Object.keys(a[res["Process Id"]][res["Product Id"]]).length > 0) {
        if (
          !Object.keys(a[res["Process Id"]][res["Product Id"]]).includes(
            res["Language"]
          )
        ) {
          a[res["Process Id"]][res["Product Id"]][res["Language"]] = {};
        }
      } else {
        a[res["Process Id"]][res["Product Id"]][res["Language"]] = {};
      }
      if (
        Object.keys(a[res["Process Id"]][res["Product Id"]][res["Language"]])
          .length > 0
      ) {
        if (
          !Object.keys(
            a[res["Process Id"]][res["Product Id"]][res["Language"]]
          ).includes(res["Module Name"])
        ) {
          a[res["Process Id"]][res["Product Id"]][res["Language"]][
            res["Module Name"]
          ] = {};
        }
      } else {
        a[res["Process Id"]][res["Product Id"]][res["Language"]][
          res["Module Name"]
        ] = {};
      }
      if (
        Object.keys(
          a[res["Process Id"]][res["Product Id"]][res["Language"]][
            res["Module Name"]
          ]
        ).length > 0
      ) {
        if (
          !Object.keys(
            a[res["Process Id"]][res["Product Id"]][res["Language"]][
              res["Module Name"]
            ]
          ).includes(res["Sub Module"])
        ) {
          a[res["Process Id"]][res["Product Id"]][res["Language"]][
            res["Module Name"]
          ][res["Sub Module"]] = {};
        }
      } else {
        a[res["Process Id"]][res["Product Id"]][res["Language"]][
          res["Module Name"]
        ][res["Sub Module"]] = {};
      }
      if (
        Object.keys(
          a[res["Process Id"]][res["Product Id"]][res["Language"]][
            res["Module Name"]
          ][res["Sub Module"]]
        ).length > 0
      ) {
        if (
          !Object.keys(
            a[res["Process Id"]][res["Product Id"]][res["Language"]][
              res["Module Name"]
            ][res["Sub Module"]]
          ).includes(res["Key"])
        ) {
          a[res["Process Id"]][res["Product Id"]][res["Language"]][
            res["Module Name"]
          ][res["Sub Module"]][res["Key"]] = res["Label Name"];
        }
      } else {
        a[res["Process Id"]][res["Product Id"]][res["Language"]][
          res["Module Name"]
        ][res["Sub Module"]][res["Key"]] = res["Label Name"];
      }
    });
    // console.log(a);
    let b: any = {};
    Object.keys(
      a[this.userDetails.Processid][parseInt(this.userDetails.ProductId)]
    ).forEach((element) => {
      if (Object.keys(b).includes(element)) {
        b[element] =
          a[this.userDetails.Processid][parseInt(this.userDetails.ProductId)][
            element
          ];
      } else {
        b[element] = {};
        b[element] =
          a[this.userDetails.Processid][parseInt(this.userDetails.ProductId)][
            element
          ]["Agent"];
      }
    });
    // console.log('workspace:', b)
    this.setLabelsForWorkspace(b);
  }
  setLabelsForWorkspace(labels) {
    let a = "WorkspaceLabels";
    let obj = {
      data: {
        flag: "insert",
        filename: a,
        processId: this.userDetails.Processid,
        product: "WORKSPACE",
        brandingjson: labels,
      },
    };
    this.api.post("branding", obj).subscribe((res) => {
      this.loader = false;
      // this.reset = true;
      if (res.code == 200) {
      }
    });
  }
  setLabelsToJsonFormat(localizationData, productId, languageCode) {
    let a: any = {};
    localizationData.forEach((res) => {
      if (Object.keys(a).length > 0) {
        if (!Object.keys(a).includes(res["Process Id"].toString())) {
          a[res["Process Id"]] = {};
        }
      } else {
        a[res["Process Id"]] = {};
      }
      if (Object.keys(a[res["Process Id"]]).length > 0) {
        if (
          !Object.keys(a[res["Process Id"]]).includes(
            res["Product Id"].toString()
          )
        ) {
          a[res["Process Id"]][res["Product Id"]] = {};
        }
      } else {
        a[res["Process Id"]][res["Product Id"]] = {};
      }
      // console.log(a);
      if (Object.keys(a[res["Process Id"]][res["Product Id"]]).length > 0) {
        if (
          !Object.keys(a[res["Process Id"]][res["Product Id"]]).includes(
            res["Language"]
          )
        ) {
          a[res["Process Id"]][res["Product Id"]][res["Language"]] = {};
        }
      } else {
        a[res["Process Id"]][res["Product Id"]][res["Language"]] = {};
      }
      // console.log(a);
      if (
        Object.keys(a[res["Process Id"]][res["Product Id"]][res["Language"]])
          .length > 0
      ) {
        if (
          !Object.keys(
            a[res["Process Id"]][res["Product Id"]][res["Language"]]
          ).includes(res["Module Name"])
        ) {
          a[res["Process Id"]][res["Product Id"]][res["Language"]][
            res["Module Name"]
          ] = {};
        }
      } else {
        a[res["Process Id"]][res["Product Id"]][res["Language"]][
          res["Module Name"]
        ] = {};
      }
      if (
        Object.keys(
          a[res["Process Id"]][res["Product Id"]][res["Language"]][
            res["Module Name"]
          ]
        ).length > 0
      ) {
        if (
          !Object.keys(
            a[res["Process Id"]][res["Product Id"]][res["Language"]][
              res["Module Name"]
            ]
          ).includes(res["Key"])
        ) {
          a[res["Process Id"]][res["Product Id"]][res["Language"]][
            res["Module Name"]
          ][res["Key"]] = res["Label Name"];
        }
      } else {
        a[res["Process Id"]][res["Product Id"]][res["Language"]][
          res["Module Name"]
        ][res["Key"]] = res["Label Name"];
      }
    });
    console.log(a);
    this.setLabelsToBrandingJson(a, productId, languageCode);
  }
  setLabelsToLocalStorage(labels) {
    localStorage.setItem("labels", JSON.stringify(labels));
  }
  getLabelsFromLocalStorage() {
    if (localStorage.getItem("labels")) {
      return new Promise((resolve) => {
        resolve(localStorage.getItem("labels"));
      });
    } else {
      // this.getAllLabelsByProcessId();
      this.getLabelsFromBrandingJson();
      this.allLabels$.subscribe((res) => {
        this.returnLabels.next(res);
        // return new Promise(resolve => {resolve(res)});
        // return res;
      });
    }
  }
  // setLabelsToBrandingJson(labels){
  //   localStorage.setItem('labels',labels);
  // }
  private returnLabels: Subject<any> = new Subject<any>();
  returnLabels$: Observable<any> = this.returnLabels.asObservable();
  applyFilterForDashboard: Subject<any> = new Subject<any>();
  applyFilterForDashboard$: Observable<any> =
    this.applyFilterForDashboard.asObservable();
  selectedParentMenuOption: Subject<any> = new Subject<any>();
  selectedParentMenuOption$: Observable<any> =
    this.selectedParentMenuOption.asObservable();
  selectedChildMenuOption: Subject<any> = new Subject<any>();
  selectedChildMenuOption$: Observable<any> =
    this.selectedChildMenuOption.asObservable();
  private allLabels: Subject<any> = new Subject<any>();
  allLabels$: Observable<any> = this.allLabels.asObservable();
  // getLabelsFromBrandingJson() {
  //   let a = 'LabelJSON_' + this.userDetails.Processid
  //   let obj = {
  //     "data": {
  //       "flag": "get",
  //       "filename": a,
  //       product: "WORKSPACE",
  //       "processId": this.userDetails.Processid,
  //     }
  //   }
  //   this.api.post('branding', obj).subscribe(res => {
  //     this.loader = false;
  //     if (res.code == 200) {
  //       this.setLabelsToLocalStorage(JSON.parse(res.results.data));
  //       this.allLabels.next(JSON.parse(res.results.data))
  //     }
  //   })
  // }
  getLabelsFromBrandingJson() {
    if (this.languageAPIHit) {
      this.languageAPIHit.unsubscribe();
    }
    let a =
      "LabelJSON_" +
      (localStorage.getItem("lang") ? localStorage.getItem("lang") : "en");
    let obj = {
      data: {
        flag: "get",
        filename: a,
        product: this.userDetails.ProductId,
        processId: this.userDetails.Processid,
      },
    };
    this.languageAPIHit = this.api.post("branding", obj).subscribe(
      (res) => {
        this.loader = false;
        if (res.code == 200) {
          this.setLabelsToLocalStorage(JSON.parse(res.results.data));
          this.allLabels.next(JSON.parse(res.results.data));
        }
      },
      (error) => {
        this.languageAPIHit = null;
      }
    );
  }
  getChangedLabelsFromBrandingJson(processId, moduleName, language) {
    if (this.languageAPIHit) {
      this.languageAPIHit.unsubscribe();
    }
    let a =
      "LabelJSON_" +
      (localStorage.getItem("lang") ? localStorage.getItem("lang") : "en");
    let obj = {
      data: {
        flag: "get",
        filename: a,
        product: this.userDetails.ProductId,
        processId: this.userDetails.Processid,
      },
    };
    this.languageAPIHit = this.api.post("branding", obj).subscribe(
      (res) => {
        this.loader = false;
        if (res.code == 200) {
          if (localStorage.getItem("labels")) {
            let a = JSON.parse(localStorage.getItem("labels"));
            let b = JSON.parse(res.results.data);
            // if(a[this.userDetails.Processid] == b[this.userDetails.Processid]){
            //   if(a[this.userDetails.Processid][this.userDetails.ProductId] == b[this.userDetails.Processid][this.userDetails.ProductId]){
            if (
              a.hasOwnProperty(this.userDetails.Processid) &&
              b.hasOwnProperty(this.userDetails.Processid)
            ) {
              if (
                a[this.userDetails.Processid].hasOwnProperty(
                  this.userDetails.ProductId
                ) &&
                b[this.userDetails.Processid].hasOwnProperty(
                  this.userDetails.ProductId
                )
              ) {
                Object.assign(
                  a[this.userDetails.Processid][this.userDetails.ProductId],
                  b[this.userDetails.Processid][this.userDetails.ProductId]
                );
                console.log();
                this.setLabelsToLocalStorage(a);
                setTimeout(() => {
                  this.setLabelConfig(processId, moduleName, language);
                });
              }
            }
          }
          // this.setLabelsToLocalStorage(JSON.parse(res.results.data));
          // this.allLabels.next(JSON.parse(res.results.data))
        }
      },
      (error) => {
        this.languageAPIHit = null;
      }
    );
  }
  setLabelsToBrandingJson(labels, productId, languageCode) {
    // let a = "LabelJSON_" + this.userDetails.Processid;
    let a = "LabelJSON_" + languageCode;
    let obj = {
      data: {
        flag: "insert",
        filename: a,
        processId: this.userDetails.Processid,
        product: productId ? productId : this.userDetails.ProductId,
        brandingjson: labels,
      },
    };
    this.api.post("branding", obj).subscribe((res) => {
      this.loader = false;
      // this.reset = true;
      if (res.code == 200) {
        // this.common.snackbar("Success",'success');
        // console.log(res.results.data)
      }
    });
  }
  @Output() refresh = new EventEmitter<any>();
  refreshMenu(data) {
    this.refresh.emit(data);
  }
  changeModuleLabelName(): string {
    this.moduleLabelNameStore = JSON.parse(localStorage.getItem("menu"));
    // console.log("this.router.url:",this.router.url);
    this.displayNameStore = "";
    this.moduleLabelNameStore.forEach((element) => {
      if (element.hasOwnProperty("Keys")) {
        if (element.Keys.length > 0) {
          element.Keys.forEach((element1) => {
            if (
              this.router.url
                .toLowerCase()
                .includes(element1.ModuleUrl.toLowerCase())
            ) {
              this.displayNameStore = element1.DisplayName;
              // console.log(this.displayNameStore);
              return this.displayNameStore;
            }
          });
        }
        // else if (this.router.url.toLowerCase().includes(element.parantModuleUrl.toLowerCase())) {
        //   this.displayNameStore = element.DisplayName
        //   return this.displayNameStore;
        // }
      }
    });
    return this.displayNameStore;
  }
  //   exportFileName(url):string{
  //     this.moduleLabelNameStore = JSON.parse(localStorage.getItem('menu'));
  //     this.newExcelfileName = ''
  //     console.log(this.newExcelfileName,"this.newExcelfileName")
  //     this.moduleLabelNameStore.forEach(element => {
  //       if (element.hasOwnProperty('Keys')) {
  //         if (element.Keys.length > 0) {
  //           element.Keys.forEach(element1 => {
  //            console.log(element1,"element1")
  //             if (url.toLowerCase().includes(element1.ModuleUrl.toLowerCase())) {
  //              console.log(element1.ModuleUrl.toLowerCase(),"element1.ModuleUrl.toLowerCase()")
  //               this.newExcelfileName = element1.DisplayName
  //             }
  //           })
  //          }
  //       }
  //     })
  //    return this.newExcelfileName
  //  }
  exportFileName(url): string {
    this.moduleLabelNameStore = JSON.parse(localStorage.getItem("menu"));
    this.newExcelfileName = "";
    console.log(this.newExcelfileName, "this.newExcelfileName");
    this.moduleLabelNameStore.forEach((element) => {
      if (element.hasOwnProperty("Keys")) {
        if (element.Keys.length > 0) {
          element.Keys.forEach((element1) => {
            console.log(element1, "element1");
            if (url.toLowerCase().includes(element1.ModuleUrl.toLowerCase())) {
              console.log(
                element1.ModuleUrl.toLowerCase(),
                "element1.ModuleUrl.toLowerCase()"
              );
              this.newExcelfileName = element1.DisplayName;
            }
          });
        }
      }
    });
    return this.newExcelfileName;
  }
  private setModuleData: Subject<any> = new Subject<any>();
  setModuleData$: Observable<any> = this.setModuleData.asObservable();
  testFunction() {
    // let menuData
    var menuObj = {
      data: {
        spname: "usp_unfyd_module_map",
        parameters: {
          flag: "GET_ROLE_MAPPING_USER",
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
          roleid: this.userDetails.ProfileType,
          //  ID: this.userDetails.Id
        },
      },
    };
    this.api.post("index", menuObj).subscribe(
      (res): any => {
        // console.log('menu', res)
        if (res.code == 200) {
          if (res.results.data.length == 0) {
            this.getStaticMenuJson();
          } else {
            this.setModuleData.next(res.results.data);
            // menuData = ;
          }
          // localStorage.setItem('parent_mgit statusenu', JSON.parse(res.results.data[0].MenuMapping)[0].ModuleGroupping);
          // localStorage.setItem('menu', JSON.parse(res.results.data));
          // this.common.setChild(JSON.parse(res.results.data[0].MenuMapping)[0])
          this.setModuleData$.subscribe((menuData) => {
            var subTemp: any = [];
            var reportMenu: any = [];
            for (let data of menuData) {
              var tempJson = data["jsondata"]
                .replace(/\"{/g, "{")
                .replace(/}\"/g, "}");
              var newJson = JSON.parse(
                JSON.parse(JSON.stringify(tempJson.replace(/\\"/g, '"')))
              )[0];
              if (newJson.count == 1) {
                subTemp.push({
                  ModuleGroupping: newJson.ModuleGroupping,
                  Icon: newJson.Keys[0].Icon,
                  parantModuleUrl: newJson.parantModuleUrl,
                  Keys: [],
                });
              }
              // else if(newJson.ModuleGroupping == 'Reports') {
              //   reportMenu.push({ModuleGroupping: newJson.ModuleGroupping, SubModuleGroupping: newJson.SubModuleGroupping,Icon: 'icon-'+newJson.ModuleGroupping.replaceAll(' ', '_').toLowerCase(), parantModuleUrl : newJson.parantModuleUrl, Keys: newJson.Keys})
              // }
              else {
                subTemp.push({
                  ModuleGroupping: newJson?.ModuleGroupping,
                  Icon:
                    "icon-" +
                    newJson?.ModuleGroupping?.replaceAll(
                      " ",
                      "_"
                    ).toLowerCase(),
                  parantModuleUrl: newJson.Keys[0].ModuleUrl,
                  Keys: newJson.Keys,
                });
              }
            }
            // subTemp.push(reportMenu);
            localStorage.setItem("parent_menu", subTemp[0]["ModuleGroupping"]);
            localStorage.setItem("menu", JSON.stringify(subTemp));
            this.setUserDetails();
            this.getLabelsFromLocalStorage();
            this.setChild(subTemp[0]);
            // console.log(subTemp)
            if (this.auth?.hawker) {
              this.auth.setHawker();
              this.router.navigate(["/beneficiary-home"]);
            } else if (!this.auth?.hawker) {
              // this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
              this.router.navigate(["/dashboard"]);
              // });
            }
          });
        }
      },
      (error) => {
        if (error.code == 401) {
          // this.common.snackbar("TOKEN EXPIRED");
          // this.logout('');
          this.snackbar("Token Expired Please Logout", "error");
        }
      }
    );
  }
  getStaticMenuJson() {
    var Obj = {
      data: {
        flag: "get",
        filename: "MenuJson",
        processId: 1,
        product: "HubAdmin",
      },
    };
    this.api.post("branding", Obj).subscribe((res: any) => {
      if (res.code == 200) {
        // console.log("result", res)
        this.setModuleData.next(JSON.parse(res.results.data));
      }
    });
  }
  setUserConfigToLocalStorage(obj) {
    localStorage.setItem("userConfig", JSON.stringify(obj));
  }
  userConfig: Subject<any> = new Subject<any>();
  userConfig$: Observable<any> = this.userConfig.asObservable();
  getUserConfigFromApi() {
    if (this.userConfigAPIHit) {
      this.userConfigAPIHit.unsubscribe();
    }
    this.ApiStatusUserConfig = 2;
    this.requestObj = {
      data: {
        spname: "usp_unfyd_module_map",
        parameters: {
          flag: "GETALL",
          roleid: this.userDetails.ProfileType,
          processid: this.userDetails.Processid,
          AccessControlId: this.userDetails.AccessControlId,
        },
      },
    };
    var temp = [];
    this.userConfigAPIHit = this.api.post("index", this.requestObj).subscribe(
      (res) => {
        if (res.code == 200) {
          let a: any = {};
          if (res.results?.data?.length > 0) {
            res.results.data.forEach((res1) => {
              if (Object.keys(a).length > 0) {
                if (res1["ModuleName"]) {
                  if (!Object.keys(a).includes(res1["ModuleName"].toString())) {
                    a[res1["ModuleName"]] = {};
                  }
                }
              } else {
                if (res1["ModuleName"]) a[res1["ModuleName"]] = {};
              }
              if (res1["ModuleName"]) {
                if (Object.keys(a[res1["ModuleName"]]).length > 0) {
                  if (res1["ActionList"]) {
                    if (
                      !Object.keys(a[res1["ModuleName"]]).includes(
                        res1["ActionList"].toString()
                      )
                    ) {
                      a[res1["ModuleName"]][res1["ActionList"]] =
                        res1["Status"];
                    }
                  }
                } else {
                  if (res1["ActionList"])
                    a[res1["ModuleName"]][res1["ActionList"]] = res1["Status"];
                }
              }
            });
          }
          // console.log(a);
          const lowerObj = this.ConvertKeysToLowerCase();
          a = lowerObj(a);
          this.setUserConfigToLocalStorage(a);
          this.userConfig.next(a);
        } else {
          this.ApiStatusUserConfig = 1;
        }
      },
      (error) => {
        if (error.code == 401) {
          this.ApiStatusUserConfig = 1;
          this.userConfigAPIHit = null;
          //this.auth.logout('');
          this.snackbar("Token Expired Please Logout", "error");
        }
      }
    );
  }
  getUserConfig: BehaviorSubject<any> = new BehaviorSubject<any>({});
  getUserConfig$: Observable<any> = this.getUserConfig.asObservable();
  setUserConfig(roleid, module) {
    if (localStorage.getItem("userConfig")) {
      let a = JSON.parse(localStorage.getItem("userConfig"));
      this.getUserConfig.next(
        a[
          module == "contact-center-location"
            ? "contactcenterlocation"
            : module == "product-group"
            ? "productgroup"
            : module == "break-not-ready-reason-codes"
            ? "breaknotreadyreasoncodes"
            : module == "customerproduct"
            ? "products"
            : module.toLowerCase()
        ]
      );
    } else {
      this.getUserConfigFromApi();
      this.userConfig$.subscribe((res) => {
        this.getUserConfig.next(res[module.toLowerCase()]);
      });
    }
  }
  getTokenApi() {
    // var Obj = {
    //   data: {
    //     spname: "usp_unfyd_module_map",
    //     parameters: {
    //       flag: "GETALL",
    //       roleid: 1
    //     },
    //   },
    // }
    //   this.api.post('index', Obj).subscribe((res: any) => {
    //     if (res.code == 200) {
    //       localStorage.removeItem("authtoken");
    //       localStorage.setItem("authtoken", res.results?.TokenIndex);
    //     }
    //   })
  }
  GetSetTokenStorage(TokenIndex) {
    // localStorage.removeItem("authtoken");
    // localStorage.setItem("authtoken", TokenIndex);
  }
  setMasterConfigToLocalStorage(obj) {
    localStorage.setItem("masterConfig", JSON.stringify(obj));
  }
  masterConfig: Subject<any> = new Subject<any>();
  masterConfig$: Observable<any> = this.masterConfig.asObservable();
  getMasterConfigFromApi() {
    this.ApiStatusMasterConfig = 2;
    this.requestObj = {
      data: {
        spname: "usp_unfyd_adminconfig",
        cachename: "cacheconfig",
        cache: true,
        parameters: {
          flag: "GET_API",
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
        },
      },
    };
    this.api.post("cachedata", this.requestObj).subscribe(
      (res) => {
        var temp = [];
        if (res.code == 200) {
          var myArray = res.results.data[0];
          for (var i = 0; i < myArray.length; ++i) {
            temp.push({ [myArray[i].ConfigName]: myArray[i].ConfigValue });
          }
          let obj = temp.reduce(function (acc, val) {
            return Object.assign(acc, val);
          }, {});
          this.setMasterConfigToLocalStorage(obj);
          this.masterConfig.next(obj);
        } else {
          this.ApiStatusMasterConfig = 1;
        }
      },
      (error) => {
        if (error.code == 401) {
          this.ApiStatusMasterConfig = 1;
          this.snackbar("Token Expired Please Logout", "error");
        }
      }
    );
  }
  getMasterConfig: BehaviorSubject<any> = new BehaviorSubject<any>({});
  getMasterConfig$: Observable<any> = this.getMasterConfig.asObservable();
  TaskField: BehaviorSubject<any> = new BehaviorSubject<any>({});
  TaskField$: Observable<any> = this.TaskField.asObservable();
  private resetTrigger = new Subject<void>();
  reset$ = this.resetTrigger.asObservable();
  triggerReset() {
    this.resetTrigger.next();
  }
  setMasterConfig() {
    if (localStorage.getItem("masterConfig")) {
      let a = JSON.parse(localStorage.getItem("masterConfig"));
      this.getMasterConfig.next(a);
    } else {
      this.getMasterConfigFromApi();
      this.masterConfig$.subscribe((res) => {
        this.getMasterConfig.next(res);
      });
    }
  }
  setLocalizationDataToLocalStorage(obj) {
    localStorage.setItem("localizationData", JSON.stringify(obj));
    if (Object.keys(obj).length > 0) {
      if (obj.hasOwnProperty("languages")) {
        let a = obj.languages.filter(
          (res) =>
            res.AdditionalProperty == "Default" &&
            (res.AdditionalPropertyValue == "true" ||
              res.AdditionalPropertyValue == true)
        );
        if (a.length > 0) {
          localStorage.setItem("lang", a[0].LanguageCode);
        }
      }
    }
  }
  setUserProfileDetails(res) {
    localStorage.setItem("UserProfile", JSON.stringify(res));
  }
  setUserChannel(res) {
    localStorage.setItem("userChannelName", JSON.stringify(res));
  }
  setUserLanguage(res) {
    localStorage.setItem("userLanguageName", JSON.stringify(res));
  }
  getUserChannel: Subject<any> = new Subject<any>();
  getUserChannel$: Observable<any> = this.getUserChannel.asObservable();
  getUserLanguage: Subject<any> = new Subject<any>();
  getUserLanguage$: Observable<any> = this.getUserLanguage.asObservable();
  getlocalizationData: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.localizationData
  );
  getlocalizationData$: Observable<any> =
    this.getlocalizationData.asObservable();
  getLocalizationDataFromApi() {
    this.ApiStatusLocalization = 2;
    this.localizationData = {
      currencyFormat: "00,00,000",
      currencySymbol: "&#8377;",
      languages: [
        {
          Id: "245",
          ModuleName: "English",
          ParentControlId: "71",
          ParentModuleName: "Language",
          AssignedValue: "",
          AssignedProperty: "",
          AdditionalProperty: "",
          DefaultValue: "",
          Status: true,
          ProductName: "HUB ADMIN",
          LanguageCode: "en",
          ConfigKey: "",
          ConfigValue: "",
        },
      ],
      greetings: [],
      numberFormat: "+91",
      allowedISD: ["91"],
      selectedDateFormats: "dd/MM/yy",
      selectedDayLightSavingTime: "false",
      selectedTimeFormats: "h:mm a",
      selectedTimeZoneFormat: "",
      textOrientation: "",
    };
    this.count = false;
    let allData;
    this.getMasterConfig$.subscribe((data) => {
      if (Object.keys(data).length > 0) {
        let dateFormats = JSON.parse(data["DateFormatSettings"]);
        let timeFormats = JSON.parse(data["TimeFormatSettings"]);
        let textOrientationOptions = JSON.parse(data["Textorientationsetting"]);
        let currency_format = JSON.parse(data["CurrencyDisplayformatsetting"]);
        if (!localStorage.getItem("localizationData")) {
          if (this.localizationAPIHit) {
            this.localizationAPIHit.unsubscribe();
          }
          let obj = {
            data: {
              spname: "usp_unfyd_localization",
              parameters: {
                FLAG: "GET_MODULE",
                PRODUCTID: this.userDetails.ProductId,
              },
            },
          };
          this.localizationAPIHit = this.api.post("index", obj).subscribe(
            (res) => {
              if (res.code == 200) {
                allData = res.results.data;
                this.localizationData.languages = [];
                allData.forEach((element) => {
                  if (element.ParentModuleName == "Language") {
                    this.localizationData?.languages?.push(element);
                  }
                  if (element.ParentModuleName == "TimeZone") {
                    if (element.ModuleName == "TimeZoneFormat") {
                      this.localizationData.selectedTimeZoneFormat =
                        element.AssignedValue;
                    }
                    if (element.ModuleName == "DayLightSavingTime") {
                      this.localizationData.selectedDayLightSavingTime =
                        element.Status == null ? false : true;
                    }
                  }
                  if (element.ParentModuleName == "DateTimeFormat") {
                    if (element.ModuleName == "DateFormat") {
                      dateFormats.forEach((element1) => {
                        if (element1.Key == element.AssignedValue) {
                          this.localizationData.selectedDateFormats =
                            element1.Value;
                        }
                      });
                    }
                    if (element.ModuleName == "TimeFormat") {
                      timeFormats.forEach((element1) => {
                        if (element1.Key == element.AssignedValue) {
                          this.localizationData.selectedTimeFormats =
                            element1.Value;
                        }
                      });
                      // this.localizationData.selectedTimeFormats = element.AssignedValue
                    }
                    // if(element.ModuleName == 'SetDefaultDateTime'){
                    //     allData.forEach(element => {
                    //       if(element.ParentControlId == 3){
                    //         if(element.ModuleName == 'DateFormat'){
                    //           this.localizationData.selectedDateFormats = element.DefaultValue
                    //         }
                    //         if(element.ModuleName == 'TimeFormat'){
                    //           this.localizationData.selectedTimeFormats = element.DefaultValue
                    //         }
                    //       }
                    //     })
                    // }
                  }
                  if (element.ParentModuleName == "TextOrientation") {
                    if (element.ModuleName == "TextOrientationData") {
                      textOrientationOptions.forEach((element1) => {
                        if (element1.Key == element.AssignedValue) {
                          this.localizationData.textOrientation =
                            element1.Value;
                        }
                      });
                    }
                  }
                  if (element.ParentModuleName == "NumberFormat") {
                    if (element.ModuleName == "PhoneNumberFormat") {
                      this.localizationData.numberFormat =
                        element.AssignedValue;
                    }
                  }
                  if (element.ParentModuleName == "CurrencySymbolFormat") {
                    if (element.ModuleName == "CurrencyList") {
                      this.localizationData.currencySymbol =
                        element.AssignedValue;
                    }
                    if (element.ModuleName == "CurrencyFormat") {
                      currency_format.forEach((element1) => {
                        if (element1.Key == element.AssignedValue) {
                          this.localizationData.currencyFormat = element1.Value;
                        }
                      });
                    }
                  }
                  if (element.ModuleName == "AllowedISD") {
                    this.localizationData.allowedISD = element.AssignedValue;
                  }
                  this.setLocalizationDataToLocalStorage(this.localizationData);
                  this.getlocalizationData.next(this.localizationData);
                });
              } else {
                this.ApiStatusLocalization = 1;
              }
            },
            (error) => {
              if (error.code == 401) {
                this.ApiStatusLocalization = 1;
                this.localizationAPIHit = null;
                //this.snackbar("TOKEN EXPIRED");
                // this.auth.logout('');
                this.snackbar("Token Expired Please Logout", "error");
              }
            }
          );
        }
      }
    });
    this.setMasterConfig();
  }
  setLocalizationData() {
    if (localStorage.getItem("localizationData")) {
      let a = JSON.parse(localStorage.getItem("localizationData"));
      this.localizationDataAvailableMethod(true);
      // this.localizationInfoMethod(a);
      this.localizationInfo.next(a);
    } else {
      this.getLocalizationDataFromApi();
      this.getlocalizationData$.subscribe((res) => {
        this.localizationDataAvailableMethod(true);
        // this.localizationInfoMethod(res);
        this.localizationInfo.next(res);
      });
    }
  }
  isChecked(array, formValue): boolean {
    if (array !== undefined && formValue !== undefined) {
      if (!formValue) return false;
      else if (array.length == 0 || formValue.length == 0) return false;
      else
        return (
          array.length && formValue.length && formValue.length == array.length
        );
    }
  }
  getuserProfileDisplay: Subject<any> = new Subject<any>();
  getuserProfileDisplay$: Observable<any> =
    this.getuserProfileDisplay.asObservable();
  // res.results.data[0].result
  userProfileDetail(user) {
    //  console.log("userprofile",user)
    // if (this.path != "null") {
    this.ApiStatusLocalization = 1;
    this.ApiStatusUserConfig = 1;
    this.ApiStatusMasterConfig = 1;
    var Obj = {
      data: {
        spname: "usp_unfyd_adm_users",
        parameters: {
          flag: "GET_USER_PROFILE_DATA",
          agentid: user.Id,
        },
      },
    };
    this.api.post("index", Obj).subscribe((res) => {
      if (res.code == 200) {
        // this.editObj = res.results.data[0];
        // console.log("app edit response",this.editObj)
        localStorage.setItem(
          "UserProfile",
          JSON.stringify(res.results.data[0])
        );
        this.getuserProfileDisplay.next(res.results.data[0]);
      }
    });
    // }
  }
  returnObjectWithKeys(inputObj: any, selectedProductID?) {
    const lowerObj = this.ConvertKeysToLowerCase();
    let obj = lowerObj(inputObj);
    // obj = lowerObj(obj);
    if (obj?.processid) {
      obj.processid = this.userDetails?.Processid;
    } else {
      Object.assign(obj, { processid: this.userDetails?.Processid });
    }
    // if(obj.productid){
    //   obj.productid = selectedProductID ? selectedProductID :this.userDetails?.ProductId
    // } else{
    //   Object.assign(obj,{productid: selectedProductID ? selectedProductID : this.userDetails?.ProductId})
    // }
    // if(obj.adminid){
    //   obj.adminid = this.userDetails?.Id
    // } else{
    //   Object.assign(obj,{adminid:this.userDetails.Id})
    // }
    if (obj?.createdby) {
      obj.createdby = this.userDetails?.Id;
    } else {
      Object.assign(obj, { createdby: this.userDetails.Id });
    }
    if (obj?.publicip) {
      obj.publicip = this.userDetails?.ip;
    } else {
      Object.assign(obj, { publicip: this.userDetails?.ip });
    }
    if (obj?.browsername) {
      obj.browsername = this.userDetails.browser;
    } else {
      Object.assign(obj, { browsername: this.userDetails.browser });
    }
    if (obj?.browserversion) {
      obj.browserversion = this.userDetails.browser_version;
    } else {
      Object.assign(obj, { browserversion: this.userDetails.browser_version });
    }
    return obj;
  }
  downloadImportErrorReport: Subject<any> = new Subject<any>();
  downloadImportErrorReport$: Observable<any> =
    this.downloadImportErrorReport.asObservable();
  importTable(moduleName, json, tab, productID?, taskGroupInfo?) {
    if (this.flagAndSPName.hasOwnProperty(moduleName.toLowerCase())) {
      let tabValuePresent =
        moduleName == "beneficiary"
          ? true
          : moduleName == "users"
          ? true
          : moduleName == "product-group"
          ? true
          : false;
      var temp = [];
      temp = JSON.parse(JSON.stringify(json));
      // let count = 0;
      let objToPass = {
        count: 0,
        errorOccured: [],
      };
      // let errorOccured = []
      this.downloadImportErrorReport.next(objToPass);
      this.downloadFile(temp, moduleName);
      temp.forEach((element, index) => {
        const lowerObj = this.ConvertKeysToLowerCase();
        element = lowerObj(element);
        if (element.hasOwnProperty("sr no")) {
          delete element["sr no"];
        }
        if (element.hasOwnProperty("srno")) {
          delete element["srno"];
        }
        if (element.hasOwnProperty("modified by")) {
          delete element["modified by"];
        }
        if (element.hasOwnProperty("modified on")) {
          delete element["modified on"];
        }
        if (element.hasOwnProperty("modifiedby")) {
          delete element["modifiedby"];
        }
        if (element.hasOwnProperty("modifiedon")) {
          delete element["modifiedon"];
        }
        if (element.hasOwnProperty("created by")) {
          delete element["created by"];
        }
        if (element.hasOwnProperty("created on")) {
          delete element["created on"];
        }
        if (element.hasOwnProperty("createdby")) {
          delete element["createdby"];
        }
        if (element.hasOwnProperty("createdon")) {
          delete element["createdon"];
        }
        if (element.hasOwnProperty("id")) {
          delete element["id"];
        }
        let keysFromElement = [];
        if (Object.keys(element).length > 0)
          // keysFromElement = Object.keys(element)
          keysFromElement = Object.keys(element).map((item) =>
            item.toLowerCase()
          );
        // console.log(keysFromElement);
        let keysFromJson = [];
        if (
          tabValuePresent
            ? Object.keys(
                this.flagAndSPName[moduleName.toLowerCase()][tab.toLowerCase()]
                  .columnMapping
              ).length > 0
            : Object.keys(
                this.flagAndSPName[moduleName.toLowerCase()].columnMapping
              ).length > 0
        )
          keysFromJson = tabValuePresent
            ? Object.keys(
                this.flagAndSPName[moduleName.toLowerCase()][tab.toLowerCase()]
                  .columnMapping
              ).map((item) => item.toLowerCase())
            : Object.keys(
                this.flagAndSPName[moduleName.toLowerCase()].columnMapping
              ).map((item) => item.toLowerCase());
        // console.log(keysFromJson);
        let columnsNeeded = [];
        const checkValues = (currentValue) => {
          if (keysFromElement.includes(currentValue)) return true;
          else {
            // console.log('key unavailable:',currentValue);
            columnsNeeded.push(currentValue);
            return false;
          }
        };
        if (!keysFromJson.every(checkValues)) {
          objToPass.errorOccured.push({
            Row: index + 1,
            Issue: columnsNeeded.join() + " values are required",
          });
          this.downloadImportErrorReport.next(objToPass);
          // console.log(columnsNeeded.join(),' values are required');
          return true;
        }
        let dummyObj = {};
        for (const property in element) {
          // console.log((element[property]).trim().length === 0);
          // console.log((element[property]).trim());
          // console.log((element[property]));
          if (
            (tabValuePresent
              ? this.flagAndSPName[moduleName.toLowerCase()][
                  tab.toLowerCase()
                ].requiredField.includes(property)
              : this.flagAndSPName[
                  moduleName.toLowerCase()
                ].requiredField.includes(property)) &&
            (!element[property] ||
              element[property].toString().trim().length === 0)
          ) {
            // console.log(property,' is required field');
            objToPass.errorOccured.push({
              Row: index + 1,
              Issue: property + " is required field",
            });
            this.downloadImportErrorReport.next(objToPass);
            return true;
          } else {
            let a = lowerObj(
              tabValuePresent
                ? this.flagAndSPName[moduleName.toLowerCase()][
                    tab.toLowerCase()
                  ]["columnMapping"]
                : this.flagAndSPName[moduleName.toLowerCase()]["columnMapping"]
            );
            if (moduleName == "task") {
              let abcd = taskGroupInfo.TaskGroupFields.map((rrr) =>
                rrr.label.toLowerCase()
              );
              if (abcd.includes(property.toLowerCase())) {
                if (!dummyObj.hasOwnProperty("value")) {
                  Object.assign(dummyObj, { value: {} });
                }
                taskGroupInfo.TaskGroupFields.forEach((element12) => {
                  if (property.toLowerCase() == element12.label.toLowerCase()) {
                    Object.assign(dummyObj["value"], {
                      [element12.formControlName.toLowerCase()]:
                        element[property],
                    });
                  }
                });
              } else {
                Object.assign(dummyObj, {
                  [a[property.toLowerCase()]
                    ? a[property.toLowerCase()]
                    : property.toLowerCase()]: element[property],
                });
              }
            } else {
              // Object.assign(dummyObj, { [a[property.toLowerCase()]] : element[property] })
              Object.assign(dummyObj, {
                [a[property.toLowerCase()]
                  ? a[property.toLowerCase()]
                  : property.toLowerCase()]: element[property],
              });
            }
          }
        }
        if (moduleName == "task")
          dummyObj["value"] = JSON.stringify(dummyObj["value"]);
        dummyObj = this.returnObjectWithKeys(dummyObj);
        if (moduleName == "users") {
          delete dummyObj["channel"];
          delete dummyObj["channel source"];
          delete dummyObj["inbound capacity"];
          delete dummyObj["outbound capacity"];
          delete dummyObj["full capacity"];
          delete dummyObj["role"];
          delete dummyObj["contact center location"];
          delete dummyObj["skill"];
          delete dummyObj["agent group"];
          delete dummyObj["country code"];
          delete dummyObj["time zone"];
          Object.assign(dummyObj, {
            CCLOCATIONID: element["contact center location"],
          });
          Object.assign(dummyObj, { SKILLSMAP: element["skill"] });
          Object.assign(dummyObj, { GROUPID: element["agent group"] });
          Object.assign(dummyObj, { COUNTRYCODE: element["country code"] });
          Object.assign(dummyObj, { TIMEZONE: element["time zone"] });
          let channelData = [];
          let channelSourceData = [];
          if (element["channel"]) channelData = element["channel"].split("^");
          if (element["channel source"])
            channelSourceData = element["channel source"].split("^");
          if (
            !channelData ||
            !Array.isArray(channelData) ||
            channelData.length == 0
          ) {
            objToPass.errorOccured.push({
              Row: index + 1,
              Issue: "Channel is invalid",
            });
            this.downloadImportErrorReport.next(objToPass);
            return;
          } else if (
            !channelSourceData ||
            !Array.isArray(channelSourceData) ||
            channelSourceData.length == 0
          ) {
            objToPass.errorOccured.push({
              Row: index + 1,
              Issue: "Channel source is invalid",
            });
            this.downloadImportErrorReport.next(objToPass);
            return;
          } else if (
            element["inbound capacity"] == undefined ||
            element["inbound capacity"] == null ||
            element["inbound capacity"] == "" ||
            element["inbound capacity"].toString().trim("").length == 0 ||
            !Number.isInteger(parseInt(element["inbound capacity"]))
          ) {
            objToPass.errorOccured.push({
              Row: index + 1,
              Issue: "Inbound capacity is invalid",
            });
            this.downloadImportErrorReport.next(objToPass);
            return;
          }
          let outbound = 0;
          let fullCapacity = 0;
          if (element.hasOwnProperty("outbound capacity")) {
            if (
              element["outbound capacity"] == undefined ||
              element["outbound capacity"] == null ||
              element["outbound capacity"] == "" ||
              element["outbound capacity"].toString().trim("").length == 0 ||
              !Number.isInteger(parseInt(element["outbound capacity"]))
            ) {
              outbound = 0;
            } else {
              outbound = element["outbound capacity"];
            }
          } else {
            outbound = 0;
          }
          if (element.hasOwnProperty("full capacity")) {
            if (
              element["full capacity"] == undefined ||
              element["full capacity"] == null ||
              element["full capacity"] == "" ||
              element["full capacity"].toString().trim("").length == 0 ||
              !Number.isInteger(parseInt(element["full capacity"]))
            ) {
              fullCapacity = 0;
            } else {
              fullCapacity = element["full capacity"];
            }
          } else {
            fullCapacity = 0;
          }
          let channelMappingObj = [];
          let channelSourceObj = [];
          for (const keyyy in channelData) {
            if (
              channelSourceData[keyyy] == undefined ||
              channelSourceData[keyyy] == null ||
              channelSourceData[keyyy] == ""
            ) {
              objToPass.errorOccured.push({
                Row: index + 1,
                Issue: "Channel source not available",
              });
              this.downloadImportErrorReport.next(objToPass);
              return;
            }
            let a = {
              channelid: channelData[keyyy],
              InboundCapacity: element["inbound capacity"],
              OutboundCapacity: outbound,
              fullcapacity: fullCapacity,
              activestatus: 1,
              IsDeleted: 0,
            };
            a = this.returnObjectWithKeys(a);
            channelMappingObj.push(a);
            let b = {
              ChannelId: channelData[keyyy],
              ChannelSourceId: channelSourceData[keyyy],
              InboundCapacity: element["inbound capacity"],
              OutboundCapacity: outbound,
              FullCapacity: fullCapacity,
              IsDeleted: 0,
            };
            b = this.returnObjectWithKeys(b);
            channelSourceObj.push(b);
          }
          if (channelMappingObj.length == 0) {
            return;
          } else if (channelSourceObj.length == 0) {
            return;
          }
          Object.assign(dummyObj, {
            CHANNELJSON: JSON.stringify(channelMappingObj),
          });
          Object.assign(dummyObj, {
            CHANNELSRCJSON: JSON.stringify(channelSourceObj),
          });
          console.log(channelMappingObj, channelSourceObj);
        }
        let objRequest = {
          data: {
            spname: tabValuePresent
              ? this.flagAndSPName[moduleName.toLowerCase()][tab.toLowerCase()]
                  .spname
              : this.flagAndSPName[moduleName.toLowerCase()].spname,
            parameters: {
              flag: tabValuePresent
                ? this.flagAndSPName[moduleName.toLowerCase()][
                    tab.toLowerCase()
                  ].flag
                : this.flagAndSPName[moduleName.toLowerCase()].flag,
              ...dummyObj,
            },
          },
        };
        if (productID) {
          Object.assign(objRequest.data.parameters, { productid: productID });
        }
        // Object.assign(objRequest,temp)
        this.api.post("index", objRequest).subscribe(
          (res) => {
            if (res.code == 200) {
              // count++;
              // if(objToPass.count == temp.length){
              //   this.snackbar('imported successfully');
              // }
              if (moduleName == "users" && res.results.data.length > 0) {
                if (res?.results?.data[0]?.Id) {
                  objToPass.count++;
                  this.downloadImportErrorReport.next(objToPass);
                } else {
                  if (Object.keys(res.results.data[0]).includes("result")) {
                    if (!res.results.data[0].result.includes("success")) {
                      objToPass.errorOccured.push({
                        Row: index + 1,
                        Issue: res.results.data[0].result,
                      });
                      this.downloadImportErrorReport.next(objToPass);
                      // this.form.reset(false)
                    } else {
                      objToPass.count++;
                      this.downloadImportErrorReport.next(objToPass);
                    }
                  } else {
                    objToPass.errorOccured.push({
                      Row: index + 1,
                      Issue: "something went wrong",
                    });
                    this.downloadImportErrorReport.next(objToPass);
                  }
                }
              } else if (
                moduleName == "blockcontent" &&
                res.results.data.length > 0
              ) {
                if (Object.keys(res.results.data[0]).includes("Result")) {
                  if (
                    !res.results.data[0].Result.toLowerCase().includes("added")
                  ) {
                    objToPass.errorOccured.push({
                      Row: index + 1,
                      Issue: res.results.data[0].Result,
                    });
                    this.downloadImportErrorReport.next(objToPass);
                    // this.form.reset(false)
                  } else {
                    objToPass.count++;
                    this.downloadImportErrorReport.next(objToPass);
                  }
                } else {
                  objToPass.errorOccured.push({
                    Row: index + 1,
                    Issue: "something went wrong",
                  });
                  this.downloadImportErrorReport.next(objToPass);
                }
              } else {
                // if(res.results.data.length !=0){
                if (Object.keys(res.results.data[0]).includes("result")) {
                  if (!res.results.data[0].result.includes("success")) {
                    objToPass.errorOccured.push({
                      Row: index + 1,
                      Issue: res.results.data[0].result,
                    });
                    this.downloadImportErrorReport.next(objToPass);
                    // this.form.reset(false)
                  } else {
                    objToPass.count++;
                    this.downloadImportErrorReport.next(objToPass);
                  }
                  // }
                } else {
                  objToPass.errorOccured.push({
                    Row: index + 1,
                    Issue: "something went wrong",
                  });
                  this.downloadImportErrorReport.next(objToPass);
                }
              }
            } else {
              // check proper response when res.code != 200; here I've pasted ablove code, without any changes.
              if (Object.keys(res.results.data[0]).includes("result")) {
                if (!res.results.data[0].result.includes("success")) {
                  objToPass.errorOccured.push({
                    Row: index + 1,
                    Issue: res.results.data[0].result,
                  });
                  this.downloadImportErrorReport.next(objToPass);
                }
              }
              // this.common.snackbar(res.results.data[0].result);
            }
            if (objToPass.count + objToPass.errorOccured.length == temp.length)
              this.unsubscribeImport();
          },
          (error) => {
            // console.log(error);
            objToPass.errorOccured.push({
              Row: index + 1,
              Issue: error?.error?.message,
            });
            this.downloadImportErrorReport.next(objToPass);
            // this.common.snackbar(error.message);
            // errorOccured.push({row:index,issue: res.results.data[0].result})
            if (objToPass.count + objToPass.errorOccured.length == temp.length)
              this.unsubscribeImport();
          }
        );
        if (objToPass.count + objToPass.errorOccured.length == temp.length)
          this.unsubscribeImport();
      });
      if (objToPass.count + objToPass.errorOccured.length == temp.length)
        this.unsubscribeImport();
      // console.log("errorOccured:",objToPass.errorOccured);
      // if(errorOccured.length > 0) this.downloadFile(errorOccured,moduleName)
    } else {
      this.snackbar("Module name unavailable to import");
      // this.unsubscribeImport()
    }
  }
  unsubscribeImport() {
    if (this.subscriptionForImport) {
      this.subscriptionForImport.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
  downloadFile(importJson, moduleName) {
    this.subscriptionForImport.push(
      this.downloadImportErrorReport$.subscribe((res) => {
        if (res.count + res.errorOccured.length == importJson.length) {
          if (res.count) {
            this.reloadData.next(true);
          }
          if (res.errorOccured.length > 0) {
            let a = moduleName;
            if (moduleName == "break-not-ready-reason-codes") {
              a = "notreadyreasoncodes";
            } else if (moduleName == "contact-center-location") {
              a = "cc_location";
            }
            this.excelService.exportExcel(
              res.errorOccured,
              (a + "_Report").toUpperCase()
            );
          }
          let firstPart, secondPart;
          if (res.count == 0) {
            firstPart = " record uploaded, ";
          } else if (res.count == 1) {
            firstPart = " record uploaded successfully, ";
          } else if (res.count > 1) {
            firstPart = " records uploaded successfully, ";
          }
          if (res.errorOccured.length == 0) {
            secondPart = " record failed";
          } else if (res.errorOccured.length == 1) {
            secondPart = " record failed";
          } else if (res.errorOccured.length > 1) {
            secondPart = " records failed";
          }
          this.snackbar(
            res.count + firstPart + res.errorOccured.length + secondPart,
            "success"
          );
          if (moduleName == "users") {
            this.sendCERequest(
              "UpdateAgentMappingMaster",
              this.userDetails.Processid
            );
          }
        }
      })
    );
  }
  hubControlEvent(
    moduleName,
    eventName,
    controlName,
    controlValue,
    requestParam?,
    actionName?
  ) {
    return;
    let obj = {
      data: {
        spname: "usp_unfyd_hub_event",
        parameters: {
          flag: "insert",
          EVENTNAME: eventName,
          MODULENAME: moduleName,
          CONTROLNAME: controlName,
          CONTROLVALUE: controlValue,
          REQUESTPARAM: requestParam,
          ACTIONNAME: actionName,
          CREATEDBY: this.userDetails.Id,
          PRODUCTID: this.userDetails.ProductId,
          processid: this.userDetails.Processid,
          publicip: this.userDetails.ip,
          privateip: this.userDetails.privateip,
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
        },
      },
    };
    // this.api.post("index", obj).subscribe(
    //   (res) => {
    //     console.log(res);
    //   })
  }
  approvalSelected: Subject<any> = new Subject<any>();
  approvalSelected$: Observable<any> = this.approvalSelected.asObservable();
  createRequest(data, langCode) {
    let authType: any[] = ["No Auth", "API Key", "Bearer Token"];
    let add_to: any[] = ["Header", "Query Params"];
    let customerProfileValue = data;
    var headerArray = [];
    let finalheaderObject: any = {};
    var paramsArray = [];
    customerProfileValue.params.forEach((element) => {
      if (element.key !== "" && element.value !== "") {
        // if(element.key  == 'to') element.value = langCode
        paramsArray.push(element.key + "=" + element.value);
      }
    });
    // for (const key in paramsArray) {
    //   if (key.hasOwnProperty('to')) {
    //     key['to'] = langCode
    //   }
    // }
    if (
      customerProfileValue.Auth == authType[1] &&
      customerProfileValue.auth.add_to !== undefined &&
      customerProfileValue.auth.add_to !== ""
    ) {
      if (
        customerProfileValue.auth.key !== "" &&
        customerProfileValue.auth.value !== ""
      ) {
        if (customerProfileValue.auth.add_to == add_to[1]) {
          paramsArray.push(
            customerProfileValue.auth.key +
              "=" +
              customerProfileValue.auth.value
          );
        }
      }
    }
    var paramsArrayString = paramsArray.join().split(",").join("&");
    customerProfileValue.header.forEach((element) => {
      if (element.key !== "" && element.value !== "") {
        headerArray.push({ [element.key]: element.value });
      }
    });
    if (
      customerProfileValue.Auth == authType[1] &&
      customerProfileValue.auth.add_to !== undefined &&
      customerProfileValue.auth.add_to !== ""
    ) {
      if (
        customerProfileValue.auth.key !== "" &&
        customerProfileValue.auth.value !== ""
      ) {
        if (customerProfileValue.auth.add_to == add_to[0]) {
          headerArray.push({
            [customerProfileValue.auth.key]: customerProfileValue.auth.value,
          });
        }
      }
    }
    for (let i = 0; i < headerArray.length; i++) {
      Object.assign(finalheaderObject, headerArray[i]);
    }
    var header = headerArray.length > 0 ? { header: finalheaderObject } : {};
    var url =
      customerProfileValue.api !== ""
        ? {
            url:
              paramsArray.length > 0
                ? customerProfileValue.api + "?" + paramsArrayString
                : customerProfileValue.api,
          }
        : {};
    var method =
      customerProfileValue.method !== ""
        ? { method: customerProfileValue.method }
        : {};
    var body =
      customerProfileValue.body !== ""
        ? { body: customerProfileValue.body }
        : {};
    let request = {
      ...method,
      ...url,
      ...header,
      ...body,
    };
    // console.log(request)
    let a = JSON.stringify(request);
    // console.log(a)
    a = a.replace("$languageCode$", langCode);
    request = JSON.parse(a);
    return Object.keys(request).length > 0 ? request : false;
  }
  selectedApprovalDetails: BehaviorSubject<any> = new BehaviorSubject<any>(
    false
  );
  selectedApprovalDetails$: Observable<any> =
    this.selectedApprovalDetails.asObservable();
  // selectProductGrouptab:BehaviorSubject<any>=new BehaviorSubject<any>(false);
  // selectProductGrouptab$:Observable<any>=this.selectProductGrouptab.asObservable();
  private getApiData: Subject<any> = new Subject<any>();
  getApiData$: Observable<any> = this.getApiData.asObservable();
  setApiData(status, data) {
    this.getApiData.next({ status: status, data: data });
  }
  private sendApiData: Subject<any> = new Subject<any>();
  sendApiData$: Observable<any> = this.sendApiData.asObservable();
  setSendApiData(status, data) {
    this.sendApiData.next({ status: status, data: data });
  }
  private setMobileMenu: Subject<boolean> = new Subject<boolean>();
  setMobileMenu$: Observable<boolean> = this.setMobileMenu.asObservable();
  MobileMenu(status) {
    this.setMobileMenu.next(status);
  }
  confirmationToMakeDefault(res) {
    let data2 = this.alertDataAPI.filter((a) => a["Alert Message"] == res);
    let data = data2[0];
    let dataVal = {
      alertMsg: data["Alert Message"],
      alertMsgDur: data["Alert Message Duration"],
      alertMsgPos: data["Alert Message Position"],
      alertMsgType: data["Message Type"],
      alertMsgSubType: data["Message Sub Type"],
      description: data["Message Body"],
      language: data["Language Code"],
      msgBody: data["Message Body"],
      msgHead: data["Message Head"],
      selectBtn: data["Button Type"],
      buttontype: data["Button Category"],
      icon: data["Pop-Up Icon URL"],
    };
    let data1 = { data: dataVal };
    this.previewAlertPopup(data1);
  }
  // private eventCategory: Subject<any> = new Subject<any>();
  // eventCategory$: Observable<any> = this.eventCategory.asObservable();
  userChannel() {
    // alert(user.Id)
    var obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "GET_USER_MAPPING_DATA",
          USERID: this.userDetails.Id,
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      // console.log(res,"userlangchannel")
      if (res.code == 200) {
        localStorage.setItem(
          "userChannelName",
          res.results.data[0][0].UserChannel
        );
        // console.log(res.results.data[0],"userChannelName")
        localStorage.setItem(
          "userLanguageName",
          res.results.data[1][0].UserLanguage
        );
        // console.log(res.results.data[1],"userLanguageName");
        this.getUserChannel.next(res.results.data[0][0].UserChannel);
        // console.log(res.results.data[0],"getUserChannel")
        this.getUserLanguage.next(res.results.data[1][0].UserLanguage);
        // console.log(res.results.data[1],"getUserLanguage");
      }
    });
  }
  roundNumberTilltwoPosition(num, tile?) {
    // console.log(num,":",num != '',':',!isNaN(num));
    if (num.toString().length > 0 && !isNaN(num)) {
      if (tile == "tile") {
        let a: any = parseFloat(num);
        if (a > 99999 && a < 1000000) {
          a = (a / 100000).toFixed(2) + "L";
        } else if (a > 1000000 && a < 10000000) {
          a = (a / 100000).toFixed(2) + "L";
        }
        return a;
      } else if (tile == "managementTile") {
        let a: any = parseFloat(num);
        if (a > 9999 && a < 100000) {
          a = (a % 1000 == 0 ? a / 1000 : (a / 1000).toFixed(1)) + "K";
        } else if (a > 99999 && a < 1000000) {
          a = (a % 100000 == 0 ? a / 100000 : (a / 100000).toFixed(2)) + "L";
        } else if (a > 1000000 && a < 10000000) {
          a = (a % 100000 == 0 ? a / 100000 : (a / 100000).toFixed(1)) + "L";
        }
        return a;
      } else {
        let a: any = parseFloat(num);
        if (a > 999 && a < 10000) {
          a = (a % 1000 == 0 ? a / 1000 : (a / 1000).toFixed(2)) + "K";
        } else if (a > 9999 && a < 100000) {
          a = (a % 1000 == 0 ? a / 1000 : (a / 1000).toFixed(1)) + "K";
        } else if (a > 99999 && a < 1000000) {
          a = (a % 100000 == 0 ? a / 100000 : (a / 100000).toFixed(2)) + "L";
        } else if (a > 1000000 && a < 10000000) {
          a = (a % 100000 == 0 ? a / 100000 : (a / 100000).toFixed(1)) + "L";
        }
        return a;
      }
    }
  }
  nthNumber(number): string {
    switch (
      number == 11
        ? number
        : number == 12
        ? number
        : number == 13
        ? number
        : number % 10
    ) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  returnWeek(date) {
    let week_Count = this.week.transform(date);
    return week_Count;
    // + this.nthNumber(week_Count)
  }
  dateFromDay(day) {
    var date = new Date(new Date().getFullYear(), 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
  }
  pageReloadforWebchat: Subject<any> = new Subject<any>();
  pageReloadforWebchat$: Observable<any> =
    this.pageReloadforWebchat.asObservable();
  getLabelsFromDB(product, languageName) {
    let obj = {
      data: {
        spname: "usp_unfyd_form_validation",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: product,
          language: languageName,
        },
      },
    };
    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        if (res.results.data.length > 0)
          this.setAllLabelToJsonInNode(
            res.results.data,
            product.toString(),
            languageName
          );
      }
    });
  }
  checkTruthyValue(value) {
    let a = true;
    if (
      value == null ||
      value == undefined ||
      value == "" ||
      value.trim() == ""
    ) {
      a = false;
    }
    return a;
  }
  numericOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode === 101 ||
      charCode === 69 ||
      charCode === 45 ||
      charCode === 43 ||
      charCode === 33 ||
      charCode === 35 ||
      charCode === 47 ||
      charCode === 36 ||
      charCode === 37 ||
      charCode === 38 ||
      charCode === 40 ||
      charCode === 41 ||
      charCode === 42 ||
      charCode === 46 ||
      (charCode > 47 && (charCode < 48 || charCode > 57))
    ) {
      return false;
    } else if (event.target.value.length >= 20) {
      return false;
    }
    return true;
  }
  isObject(value): boolean {
    let a = false;
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof RegExp)
    ) {
      a = true;
    } else {
      a = false;
    }
    return a;
  }
  refreshTaskTable: Subject<any> = new Subject<any>();
  refreshTaskTable$: Observable<any> = this.refreshTaskTable.asObservable();
  dashboardTabChanged: Subject<any> = new Subject<any>();
  dashboardTabChanged$: Observable<any> =
    this.dashboardTabChanged.asObservable();
  addFormControl: Subject<any> = new Subject<any>();
  addFormControl$: Observable<any> = this.addFormControl.asObservable();
}
