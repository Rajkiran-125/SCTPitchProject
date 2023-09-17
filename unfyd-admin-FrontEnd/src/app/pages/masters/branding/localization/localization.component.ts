import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { ApiService } from "src/app/global/api.service";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";
import { ExcelService } from "src/app/global/excel.service";
import {
  countryCode,
  textOrientationOptions,
  currency_format,
  currency_list,
  dateFormats,
  timeFormats,
  timeZones,
} from "src/app/global/json-data";
import * as $ from "jquery";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-localization",
  templateUrl: "./localization.component.html",
  styleUrls: ["./localization.component.scss"],
})
export class LocalizationComponent implements OnInit {
  @ViewChild("exelUpload") myInputVariable: ElementRef;
  @ViewChildren("slides") public slides: QueryList<ElementRef>;
  edit: boolean = false;
  totalEnabled: number = 0;
  countForAlertMessage: number = 0;
  type = "branding";
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  productName: any = "";
  productID: any;
  productType: any = "";
  chnageLanguageStatus = false;
  chnageGreetingsStatus = false;
  countryCode: any = [];
  languages: any = [];
  languagesCopy: any = [];
  greetings: any = [];
  greetingsCopy: any = [];
  userDetails: any;
  dateTimeFormatDate = new Date();
  timeFormats = [];
  dateFormats = [];
  selectedTimeFormats;
  selectedDateFormats;
  numberFormat: any = "IN";
  textOrientation: any;
  textOrientationOptions: any;
  currency_format: any = [];
  currency_list: any = [];
  currencySymbol: any;
  currencyFormat: any;
  loader: boolean = false;
  allData: any;
  selectedTimeZoneFormat: any;
  selectedDayLightSavingTime: any;
  timeZones: any = [];
  setDateTimeAutomatically: any;
  viewData: any;
  ddd: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  allowedISD = [];
  AllDataInfo: any = {
    currencyFormat: "",
    currencyFormatID: "",
    currencyFormatParentID: "",

    currencySymbol: "",
    currencySymbolID: "",
    currencySymbolParentID: "",

    languages: [],
    greetings: [],

    numberFormat: "",
    numberFormatID: "",
    numberFormatParentID: "",

    allowedISD: [],
    allowedISDID: "",
    allowedISDParentID: "",

    selectedDateFormats: "",
    selectedDateFormatsID: "",
    selectedDateFormatsParentID: "",

    selectedDayLightSavingTime: "",
    selectedDayLightSavingTimeID: "",
    selectedDayLightSavingTimeParentID: "",

    selectedTimeFormats: "",
    selectedTimeFormatsID: "",
    selectedTimeFormatsParentID: "",

    selectedTimeZoneFormat: "",
    selectedTimeZoneFormatID: "",
    selectedTimeZoneFormatParentID: "",

    textOrientation: "",
    textOrientationID: "",
    textOrientationParentID: "",
  };

  AllDataInfoCopy: any = {
    currencyFormat: "",
    currencyFormatID: "",
    currencyFormatParentID: "",

    currencySymbol: "",
    currencySymbolID: "",
    currencySymbolParentID: "",

    languages: [],
    greetings: [],

    numberFormat: "",
    numberFormatID: "",
    numberFormatParentID: "",

    allowedISD: [],
    allowedISDID: "",
    allowedISDParentID: "",

    selectedDateFormats: "",
    selectedDateFormatsID: "",
    selectedDateFormatsParentID: "",

    selectedDayLightSavingTime: "",
    selectedDayLightSavingTimeID: "",
    selectedDayLightSavingTimeParentID: "",

    selectedTimeFormats: "",
    selectedTimeFormatsID: "",
    selectedTimeFormatsParentID: "",

    selectedTimeZoneFormat: "",
    selectedTimeZoneFormatID: "",
    selectedTimeZoneFormatParentID: "",

    textOrientation: "",
    textOrientationID: "",
    textOrientationParentID: "",
  };
  public filteredList2 = this.timeZones.slice();
  public filteredList3 = this.dateFormats.slice();
  public filteredList4 = this.timeFormats.slice();

  public filteredList5 = this.countryCode.slice();
  public filteredList6 = this.currency_list.slice();
  public filteredList7 = this.currency_format.slice();
  mixedDateTimeFormat: any = "";
  labelName: any;
  languagesByTenant = []
  changeModuleDisplayName: string;
  subscription: Subscription[] = [];
  userConfig: any;
  defaultLanguage = {
    defaultLanguage:'English',
    defaultLanguageCode:'en'
  };


  panelOpenState = false
  panelOpenState1 = false
  defaultLabels = [];
  defaultLabels2 = []
  objectKeys = Object.keys;
  objectValues = Object.values;
  data: boolean = false;
  constructor(
    private api: ApiService,
    private common: CommonService,
    private auth: AuthService,
    public dialog: MatDialog,
    private excelService: ExcelService,
    private router: Router
  ) {
    Object.assign(this, { countryCode, currency_list, timeZones });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('Localization','click','pageload','pageload','','ngOnInit');
    this.userDetails = this.auth.getUser();
    this.filteredList2 = this.timeZones.slice();
    this.filteredList3 = this.dateFormats.slice();
    this.filteredList4 = this.timeFormats.slice();
    this.filteredList5 = this.countryCode.slice();
    this.filteredList6 = this.currency_list.slice();
    this.languageDataFromTenant()

    this.getProducts();
    setInterval(() => {
      if (this.router.url == "/masters/branding/localization") {
        this.dateTimeFormatDate = new Date();
        if (this.dateFormats != undefined && this.timeFormats != undefined)
          this.mixedDateTimeFormatMethod();
      }
    }, 1000);
    // this.getAllData();
    this.common.setMasterConfig();
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.dateFormats = JSON.parse(data["DateFormatSettings"]);
          this.timeFormats = JSON.parse(data["TimeFormatSettings"]);
          this.textOrientationOptions = JSON.parse(data["Textorientationsetting"]);
          this.currency_format = JSON.parse(data["CurrencyDisplayformatsetting"]);
          this.textOrientation = this.textOrientationOptions[0].Key;
          this.filteredList3 = this.dateFormats.slice();
          this.filteredList4 = this.timeFormats.slice();
          this.filteredList7 = this.currency_format.slice();
        }
      })
    )
    this.getFilter();
    this.feildChooser();
    this.subscription.push(
      this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"));
    this.subscription.push(
      this.common.getLanguageConfig$.subscribe((data) => {
        this.setLabelByLanguage(data);
      })
    )
    this.changeModuleDisplayName = this.common.changeModuleLabelName()
    this.common.setUserConfig(this.userDetails.ProfileType, 'Localization');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.common.hubControlEvent('Localization','click','pageloadend','pageloadend','','ngOnInit');

  }
  getLabels(){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_form_validation",
        parameters: {
          FLAG: "GET_LABEL_DATA",
          "DEFAULTLANGCODE":"en",
            "NEWLANGCODE":"hi"
        },
      },
    };
    this.common.hubControlEvent('Dialog','click','','',JSON.stringify(obj),'getlabels');

    this.api.post("index", obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0 && res.results.data.length > 0) {
          res.results.data[0].forEach(element => {
            this.defaultLabels.push(JSON.parse(element.DefaultJson))
          });
          res.results.data[1].forEach(element => {
            this.defaultLabels2.push(JSON.parse(element.DefaultJson))
          });
          // console.log("defaultLabels:",this.defaultLabels);
          // console.log("defaultLabels2:",this.defaultLabels2);
        }
      }
    });
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Localization','click','label','label',JSON.stringify(data),'setLabelByLanguage');

    this.subscription.push(
      this.common.getLabelConfig$.subscribe((data1) => {
        this.labelName = data1;
      }));
    this.common.setLabelConfig2(this.userDetails.Processid, "Localization", data);
  }

  changeEdit() {
    this.common.hubControlEvent('Localization','click','','','','changeEdit');

    this.edit = !this.edit;
  }
  CancelEdit() {
    this.edit = !this.edit;
  }
  setEditFalse() {
    this.common.hubControlEvent('Localization','click','','','','setEditFalse');

    this.edit = false;
  }
  selectedProduct(event) {
    this.common.hubControlEvent('Localization','click','','',event,'selectedProduct');

    this.productID = event;

    this.productType.forEach((element) => {
      if (element.Id == this.productID) {
        this.productName = element?.ProductName;
      }
    });
    this.getAllData();
  }

  getProducts() {
    this.common.hubControlEvent('Localization','click','','','','getProducts');

    this.productType = JSON.parse(localStorage.getItem("products"));
    // this.productID = this.productType[0].Id;
    // this.productName = this.productType[0].ProductName;
    // this.productID = 11;
    // this.productName = 'HUB ADMIN';
    // this.languagesCommonApi()
  }

  getAllData() {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_localization",
        parameters: {
          FLAG: "GET_MODULE",
          PRODUCTID: this.productID,
        },
      },
    };
    this.common.hubControlEvent('Localization','click','','',JSON.stringify(obj),'getAllData');

    this.api.post("index", obj).subscribe(
      (res) => {
        this.loader = false;
        if (res.code == 200) {
          this.data = true
          this.allData = res.results.data;
          this.languages = [];
          this.greetings = [];
          let enabledLanguages = [];
          let disbledLanguages = [];
          this.allData.forEach((element) => {
            if (element.ParentModuleName == "Language") {
              if (element?.ModuleName.toLowerCase() == "arabic") {
                this.textOrientation = element?.AssignedProperty;
              }
              if (this.languagesByTenant.includes(element.LanguageCode) && element.Status) {
                enabledLanguages.push(element);
              } else {
                disbledLanguages.push(element);
              }
              if(element.AdditionalPropertyValue == true){
                this.defaultLanguage.defaultLanguage = element.ModuleName
                this.defaultLanguage.defaultLanguageCode = element.LanguageCode
              }
              this.languages.push(element);
              this.AllDataInfo["languages"].push(element);
              this.AllDataInfoCopy["languages"].push(element);
            }
            if (element.ParentModuleName == "TimeZone") {
              if (element.ModuleName == "TimeZoneFormat") {
                this.selectedTimeZoneFormat = element.AssignedValue;
                this.AllDataInfo.selectedTimeZoneFormat = element.AssignedValue;
                this.AllDataInfoCopy.selectedTimeZoneFormat =
                  element.AssignedValue;
                this.AllDataInfoCopy.selectedTimeZoneFormatID = element.Id;
                this.AllDataInfoCopy.selectedTimeZoneFormatParentID =
                  element.ParentControlId;
              }
              if (element.ModuleName == "DayLightSavingTime") {
                this.selectedDayLightSavingTime = element.Status;
                this.AllDataInfo.selectedDayLightSavingTime = element.Status;
                this.AllDataInfoCopy.selectedDayLightSavingTime =
                  element.Status;

                this.AllDataInfoCopy.selectedDayLightSavingTimeID = element.Id;
                this.AllDataInfoCopy.selectedDayLightSavingTimeParentID =
                  element.ParentControlId;
              }
            }
            if (element.ParentModuleName == "DateTimeFormat") {
              if (element.ModuleName == "DateFormat") {
                this.selectedDateFormats = element.AssignedValue;
                this.AllDataInfo.selectedDateFormats = element.AssignedValue;
                this.AllDataInfoCopy.selectedDateFormats =
                  element.AssignedValue;

                this.AllDataInfoCopy.selectedDateFormatsID = element.Id;
                this.AllDataInfoCopy.selectedDateFormatsParentID =
                  element.ParentControlId;
              }
              if (element.ModuleName == "TimeFormat") {
                this.selectedTimeFormats = element.AssignedValue;
                this.AllDataInfo.selectedTimeFormats = element.AssignedValue;
                this.AllDataInfoCopy.selectedTimeFormats =
                  element.AssignedValue;

                this.AllDataInfoCopy.selectedTimeFormatsID = element.Id;
                this.AllDataInfoCopy.selectedTimeFormatsParentID =
                  element.ParentControlId;
              }
              if (element.ModuleName == "SetDefaultDateTime") {
                this.setDateTimeAutomatically = element.Status;
                if (this.setDateTimeAutomatically) {
                  this.allData.forEach((element) => {
                    if (element.ParentModuleName == "DateTimeFormat") {
                      if (element.ModuleName == "DateFormat") {
                        this.selectedDateFormats = element.DefaultValue;
                        this.AllDataInfo.selectedDateFormats =
                          element.DefaultValue;
                        this.AllDataInfoCopy.selectedDateFormats =
                          element.DefaultValue;

                        this.AllDataInfoCopy.selectedDateFormatsID = element.Id;
                        this.AllDataInfoCopy.selectedDateFormatsParentID =
                          element.ParentControlId;
                      }
                      if (element.ModuleName == "TimeFormat") {
                        this.selectedTimeFormats = element.DefaultValue;
                        this.AllDataInfo.selectedTimeFormats =
                          element.DefaultValue;
                        this.AllDataInfoCopy.selectedTimeFormats =
                          element.DefaultValue;

                        this.AllDataInfoCopy.selectedTimeFormatsID = element.Id;
                        this.AllDataInfoCopy.selectedTimeFormatsParentID =
                          element.ParentControlId;
                      }
                    }
                  });
                }
              }
            }
            if (element.ParentModuleName == "TextOrientation") {
              if (element.ModuleName == "TextOrientationData") {
                this.textOrientation = element.AssignedValue;
                this.AllDataInfo.textOrientation = element.AssignedValue;
                this.AllDataInfoCopy.textOrientation = element.AssignedValue;

                this.AllDataInfoCopy.textOrientationID = element.Id;
                this.AllDataInfoCopy.textOrientationParentID =
                  element.ParentControlId;
              }
            }
            if (element.ParentModuleName == "NumberFormat") {
              if (element.ModuleName == "PhoneNumberFormat") {
                let countryCodeSub = element.AssignedValue.substring(
                  1,
                  element.AssignedValue.length
                );
                let countryObj = this.countryCode.find(
                  (o) => o.dial_code == countryCodeSub
                );
                this.numberFormat = countryObj.country_code;
                this.AllDataInfo.numberFormat = countryObj.country_code;
                this.AllDataInfoCopy.numberFormat = countryObj.country_code;

                this.AllDataInfoCopy.numberFormatID = element.Id;
                this.AllDataInfoCopy.numberFormatParentID =
                  element.ParentControlId;
              }
              if (element.ModuleName == "AllowedISD") {

                if (element.AssignedValue) {
                  this.allowedISD = element.AssignedValue.split(",");
                } else {
                  this.allowedISD = [];
                }

                this.allowedISD = this.returnAllowedISDInfo("name");

                this.setAllowedISD();

                this.AllDataInfoCopy.allowedISDID = element.Id;
                this.AllDataInfoCopy.allowedISDParentID =
                  element.ParentControlId;
              }
            }
            if (element.ParentModuleName == "CurrencySymbolFormat") {
              if (element.ModuleName == "CurrencyList") {
                this.currencySymbol = element.AssignedValue;
                this.AllDataInfo.currencySymbol = element.AssignedValue;
                this.AllDataInfoCopy.currencySymbol = element.AssignedValue;

                this.AllDataInfoCopy.currencySymbolID = element.Id;
                this.AllDataInfoCopy.currencySymbolParentID =
                  element.ParentControlId;
              }
              if (element.ModuleName == "CurrencyFormat") {
                this.currencyFormat = element.AssignedValue;
                this.AllDataInfo.currencyFormat = element.AssignedValue;
                this.AllDataInfoCopy.currencyFormat = element.AssignedValue;

                this.AllDataInfoCopy.currencyFormatID = element.Id;
                this.AllDataInfoCopy.currencyFormatParentID =
                  element.ParentControlId;
              }
            }
            if (element.ParentModuleName == "Greetings") {
              this.greetings.push(element);
              this.AllDataInfo["greetings"].push(element);
              this.AllDataInfoCopy["greetings"].push(element);

            }
          });
          this.totalEnabled = enabledLanguages?.length;
          let a = enabledLanguages.concat(disbledLanguages);
          this.languages = a;
          this.AllDataInfo["languages"] = a;
          this.AllDataInfoCopy["languages"] = a;
          this.ddd = this.AllDataInfo;
        } else {
          this.common.snackbar("General Error");
        }
      },
      (error) => {
        if (error.code == 401) {
          this.common.snackbar("Token Expired Please Logout", 'error');
        } else {
          this.common.snackbar("General Error");
        }
      }
    );
  }

  changeDayLightSavingTime() {
    this.common.hubControlEvent('Localization','click','','','','changeDayLightSavingTime');

    this.selectedDayLightSavingTime = !this.selectedDayLightSavingTime;
  }

  save() {
    this.common.hubControlEvent('Localization','click','','','','save');

    let a = this.AllDataInfo;
    let obj = Object.keys(this.AllDataInfoCopy);

    this.AllDataInfoCopy.currencyFormat = this.currencyFormat;
    this.AllDataInfoCopy.currencySymbol = this.currencySymbol;
    this.AllDataInfoCopy.languages = this.languages;
    this.AllDataInfoCopy.numberFormat = this.numberFormat;
    this.AllDataInfoCopy.selectedDateFormats = this.selectedDateFormats;
    this.AllDataInfoCopy.selectedDayLightSavingTime =
    this.selectedDayLightSavingTime;
    this.AllDataInfoCopy.selectedTimeFormats = this.selectedTimeFormats;
    this.AllDataInfoCopy.selectedTimeZoneFormat = this.selectedTimeZoneFormat;
    this.AllDataInfoCopy.textOrientation = this.textOrientation;

    obj.forEach((keys) => {
      if (keys == "languages") {
        for (let i in this.AllDataInfoCopy[keys]) {
          this.countForAlertMessage++;
          this.changeData(
            "changeLanguage",
            this.AllDataInfoCopy[keys][i]?.ModuleName
          );
        }
      } else {
        if (keys == "currencyFormat") {
          this.countForAlertMessage++;
          this.changeData("currencyFormat");
        } else if (keys == "currencySymbol") {
          this.countForAlertMessage++;
          this.changeData("currencySymbol");
        } else if (keys == "selectedTimeZoneFormat") {
          this.countForAlertMessage++;
          this.changeData("timeZone");
        } else if (keys == "selectedDayLightSavingTime") {
          this.countForAlertMessage++;
          this.changeData("dayLightSavingTime");
        } else if (keys == "selectedDateFormats") {
          this.countForAlertMessage++;
          this.changeData("changeDateFormat");
        } else if (keys == "selectedTimeFormats") {
          this.countForAlertMessage++;
          this.changeData("changeTimeFormat");
        } else if (keys == "textOrientation") {
          this.countForAlertMessage++;
          this.changeData("textOrientation");
        } else if (keys == "numberFormat") {
          this.countForAlertMessage++;
          this.changeData("numberFormat");
        } else if (keys == "allowedISD") {
          this.countForAlertMessage++;
          this.changeData("allowedISD");
        }
        this.edit = false;
        this.chnageLanguageStatus = false;
      }
    });
  }

  greetingsAddMore() {
    this.common.hubControlEvent('Localization','click','','','','greetingsAddMore');

    this.chnageGreetingsStatus = !this.chnageGreetingsStatus;
  }

  enableLanguage(id, i) {
    this.common.hubControlEvent('Localization','click','','',id,'enableLanguage');

    this.totalEnabled = 0;
    let status = this.languages.find((o) => o.AssignedValue == id);
    this.languages[i].Status = !this.languages[i].Status;
    this.languages.forEach((element) => {

      if (this.languagesByTenant.includes(element.LanguageCode) && element.Status == true) {
        this.totalEnabled++;
      }
    });

  }

  isNumber(val): boolean {
    return typeof val === "number";
  }
  countryValues(val: any, key: any) {

    let obj = this.countryCode.find((o) => o.country_code == val);
    return obj[JSON.parse(key)];
  }

  valData(val: any) {

    let obj = this.countryCode.find(
      (o) => o.country_code.toLowerCase() == this.numberFormat.toLowerCase()
    );
    if (val == "name") return obj.name;
    if (val == "dial_code") return obj.dial_code;
  }

  returnAllowedISDInfo(val: any) {
    this.common.hubControlEvent('Localization','click','','',JSON.stringify(val),'returnAllowedISDInfo');


    let a = [];
    if (val == "name") {
      this.allowedISD.forEach((element) => {
        let obj = this.countryCode.find((o) => o.dial_code == element);
        a.push(obj?.country_code);
      });
    } else if (val == "dial_code") {
      this.allowedISD.forEach((element) => {
        let obj = this.countryCode.find(
          (o) => o.country_code.toLowerCase() == element.toLowerCase()
        );
        a.push(obj.dial_code);
      });
    }

    return a;
  }

  currencyValues(val: any) {

    let obj = this.currency_list.find(
      (o) => o.symbol.toLowerCase() == this.currencySymbol.toLowerCase()
    );
    if (val == "symbol") return obj?.symbol;
    if (val == "currency") return obj?.currency;
  }

  changeData(key: String, val?: any) {
    let obj: any;
    if (key == "changeLanguage") {
      // this.languagesAddMore();
      let status = this.AllDataInfoCopy.languages.find(
        (o) => o.ModuleName == val
      );
      let arabicTextOrientation: any;

      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: "",
            ASSIGNEDPROPERTY: status?.AssignedProperty,
            ADDITIONALPROPERTY: "",
            STATUS: status.Status,
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: status.ModuleName,
            PARENTCONTROLID: status.ParentControlId,
            Id: status.Id,
          },
        },
      };
    } else if (key == "dayLightSavingTime") {


      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: "",
            ASSIGNEDPROPERTY: "",
            ADDITIONALPROPERTY: "",
            STATUS: this.AllDataInfoCopy.selectedDayLightSavingTime,
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: "DayLightSavingTime",
            PARENTCONTROLID:
              this.AllDataInfoCopy.selectedDayLightSavingTimeParentID,
            id: this.AllDataInfoCopy.selectedDayLightSavingTimeID,
          },
        },
      };
    } else if (key == "timeZone") {
      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: this.AllDataInfoCopy.selectedTimeZoneFormat,
            ASSIGNEDPROPERTY: "",
            ADDITIONALPROPERTY: "",
            STATUS: "True",
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: "TimeZoneFormat",
            PARENTCONTROLID:
              this.AllDataInfoCopy.selectedTimeZoneFormatParentID,
            id: this.AllDataInfoCopy.selectedTimeZoneFormatID,
          },
        },
      };
    } else if (key == "changeDateFormat") {
      let dateValue = this.selectedDateFormats ? this.dateFormats.filter(abc => abc.Key == this.selectedDateFormats) : []
      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: this.AllDataInfoCopy.selectedDateFormats,
            ASSIGNEDPROPERTY: "",
            ADDITIONALPROPERTY: "",
            ADDITIONALPROPERTYVALUE:dateValue.length > 0 ? dateValue[0].Value : '',
            STATUS: "",
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: "DateFormat",
            PARENTCONTROLID: this.AllDataInfoCopy.selectedDateFormatsParentID,
            id: this.AllDataInfoCopy.selectedDateFormatsID,
          },
        },
      };
    } else if (key == "changeTimeFormat") {
      let dateValue = this.selectedTimeFormats ? this.timeFormats.filter(abc => abc.Key == this.selectedTimeFormats) : []
      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: this.AllDataInfoCopy.selectedTimeFormats,
            ASSIGNEDPROPERTY: "",
            ADDITIONALPROPERTY: "",
            ADDITIONALPROPERTYVALUE:dateValue.length > 0 ? dateValue[0].Value : '',
            STATUS: "",
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: "TimeFormat",
            PARENTCONTROLID: this.AllDataInfoCopy.selectedTimeFormatsParentID,
            id: this.AllDataInfoCopy.selectedTimeFormatsID,
          },
        },
      };
    }

    else if (key == "textOrientation") {
      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: this.AllDataInfoCopy.textOrientation,
            ASSIGNEDPROPERTY: "",
            ADDITIONALPROPERTY: "",
            STATUS: "",
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: "TextOrientationData",
            PARENTCONTROLID: this.AllDataInfoCopy.textOrientationParentID,
            id: this.AllDataInfoCopy.textOrientationID,
          },
        },
      };
    } else if (key == "numberFormat") {
      let countryObj = this.countryCode?.find(
        (o) =>
          (o?.country_code).toLowerCase() == this.numberFormat?.toLowerCase()
      );

      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: "+" + countryObj.dial_code,
            ASSIGNEDPROPERTY: "",
            ADDITIONALPROPERTY: "",
            STATUS: "",
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: "PhoneNumberFormat",
            PARENTCONTROLID: this.AllDataInfoCopy?.numberFormatParentID,
            id: this.AllDataInfoCopy?.numberFormatID,
          },
        },
      };
    } else if (key == "allowedISD") {
      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: this.AllDataInfoCopy.allowedISD,
            ASSIGNEDPROPERTY: "",
            ADDITIONALPROPERTY: "",
            STATUS: "",
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: "AllowedISD",
            PARENTCONTROLID: this.AllDataInfoCopy?.allowedISDParentID,
            id: this.AllDataInfoCopy?.allowedISDID,
          },
        },
      };
    } else if (key == "currencySymbol") {
      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: this.AllDataInfoCopy.currencySymbol,
            ASSIGNEDPROPERTY: "",
            ADDITIONALPROPERTY: "",
            STATUS: "",
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: "CurrencyList",
            PARENTCONTROLID: this.AllDataInfoCopy.currencySymbolParentID,
            id: this.AllDataInfoCopy.currencySymbolID,
          },
        },
      };
    } else if (key == "currencyFormat") {
      obj = {
        data: {
          spname: "usp_unfyd_localization",
          parameters: {
            FLAG: "UPDATE_MODULE",
            ASSIGNEDVALUE: this.AllDataInfoCopy.currencyFormat,
            ASSIGNEDPROPERTY: "",
            ADDITIONALPROPERTY: "",
            STATUS: "",
            PROCESSID: this.userDetails.Processid,
            PRODUCTID: this.productID,
            PRODUCTNAME: this.productName,
            LANGUAGECODE: "",
            MODULENAME: "CurrencyFormat",
            PARENTCONTROLID: this.AllDataInfoCopy.currencyFormatParentID,
            id: this.AllDataInfoCopy.currencyFormatID,
          },
        },
      };
    }
    this.common.hubControlEvent('Localization','click','','',JSON.stringify(obj),'changeData');

    this.api.post("index", obj).subscribe(
      (res) => {
        if (res.code == 200) {
          this.loader = false;
          this.countForAlertMessage--;
          if (this.countForAlertMessage == 0) {
            this.common.snackbar("Saved Success");
          }
          this.getAllData();
        } else {
          this.common.snackbar("General Error");
        }
      },
      (error) => {
        this.common.snackbar("General Error");
      }
    );
  }

  openDialog(type) {
    this.common.hubControlEvent('Localization','click','','',JSON.stringify(type),'openDialog');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
      },
      width: "30%",
    });
    dialogRef.afterClosed().subscribe((status) => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'Localization');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
    }))
      if (status == true) {
        this.getAllData();
      }
    });
  }

  async export(langCode: any, purpose: string) {
    this.loader = true;
    var TempAraay = [];
    var temp = [];
    var obj = {
      data: {
        spname: "usp_unfyd_form_validation",
        parameters: {
          flag: "BULK",
          language: langCode,
        },
      },
    };
    this.common.hubControlEvent('Localization','click','','',JSON.stringify(obj),'export');

    this.api.post("index", obj).subscribe(async (res) => {
      if (res.code == 200) {
        this.loader = false;
        TempAraay = res.results.data;
        TempAraay.forEach((element) => {
          if (purpose == "view") {
            if (element.Language[1] == langCode) {
              temp.push({
                Id: element.Id[1],
                ModuleName: element.ModuleName[1],
                SubModule: element.SubModule[1],
                LabelName: element.LabelName[1],
                Key: element.Key[1],
                Language: langCode,
                ProcessId: element.ProcessId[1],
                ProductId: element.ProductId[1],
              });
            }
          } else {
            temp.push({
              Id: element.Id[0],
              ModuleName: element.ModuleName[0],
              SubModule: element.SubModule[0],
              LabelName: element.LabelName[1] ? element.LabelName[1] : element.LabelName[0],
              Key: element.Key[0],
              Language: langCode,
              ProcessId: element.ProcessId[0],
              ProductId: element.ProductId[0],
            });
          }
        });
      }
      if (purpose == "export") {
        let exportFileName: string = "";
        this.languages.forEach((element) => {
          if (element.LanguageCode == langCode) {
            exportFileName =
              exportFileName + this.productName + "_" + element.ModuleName;
            this.excelService.exportExcel(temp, exportFileName);
          }
        });
      } else if (purpose == "view") {
        this.viewData = await temp;
      } else if (purpose == "edit") {
      }
    });
  }

  import(event): void {
    this.common.hubControlEvent('Localization','click','','',JSON.stringify(event),'import');

    this.excelService.importExcel(event);
    this.myInputVariable.nativeElement.value = "";
    this.import1("upload");
  }
  import1(langCode) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: langCode,
        title: "Are you sure?",
        subTitle: "You want to " + langCode + " this data",
      },
      width: "300px",
    });
    dialogRef.afterClosed().subscribe((status) => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'Localization');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
    }))
      if (status) {
        var temp = [];
        temp = JSON.parse(JSON.stringify(this.excelService.getJson()));
        for (let i = 0; i < temp.length; i++) {
          var obj = {
            data: {
              spname: "usp_unfyd_form_validation",
              parameters: {
                flag: "BULK_INSERT",
                id: temp[i].Id,
                language: temp[i].Language,
                labelname: temp[i].LabelName,
                key: temp[i].Key,
                modulename: temp[i].ModuleName,
                submodule: temp[i].SubModule,
                processid: temp[i].ProcessId,
                productid: temp[i].ProductId,
                modifiedby: this.userDetails.Id,
              },
            },
          };
          this.common.hubControlEvent('Localization','click','','',JSON.stringify(obj),'import1');

          this.api.post("index", obj).subscribe(
            (res) => {
              if (res.code == 200) {
              } else {
              }
            },
            (error) => {
            }
          );
        }
      }
    });
  }
  passId(i) { }

  ngAfterViewInit(): void {
    this.slides.changes.subscribe(() => console.log(this.slides));
  }

  async view(langData) {
    await this.export(langData?.LanguageCode, "view");
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "localizationViewTable",
        langData: langData,
        data: this.viewData,
      },
      width: "900px",
    });
    dialogRef.afterClosed().subscribe((status) => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'Localization');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
    }))
     });
  }

  editview(langData) {
    this.common.hubControlEvent('Localization','click','','',JSON.stringify(langData),'editview');


    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "editlocalizationViewTable",
        langData: langData,
        data: this.viewData,
      },
      width: "900px",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((status) => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'Localization');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
      // console.log(this.userConfig,"label userconfig value")
    }))
     });
  }


  getFilter() {
    this.common.hubControlEvent('Localization','click','','','','getFilter');

    this.subscription.push(

      this.common.getItemsPerPage$.subscribe((data) => {
        this.itemsPerPage = data;
      })
    )
    this.subscription.push(

      this.common.getSearch$.subscribe((data) => {
        this.search = data;
      })
    )
    this.subscription.push(

      this.common.getLoaderStatus$.subscribe((data) => {
        if (data == false) {
          this.getAllData();
        }
      })
    )
    this.subscription.push(

      this.common.getTableKey$.subscribe((data) => {
        this.finalField = [];
        this.finalField = data;
      })
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
          modulename: this.type,
          language: localStorage.getItem("lang"),
        },
      },
    };
    this.common.hubControlEvent('Localization','click','','',JSON.stringify(obj),'feildChooser');

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
          var selctedField = [];
          for (let i = 0; i < this.selctedField.length; i++) {
            selctedField.push({ value: this.selctedField[i], className: "" });
          }
          var unSelctedField = [];
          for (let i = 0; i < this.unSelctedField.length; i++) {
            unSelctedField.push({
              value: this.unSelctedField[i],
              className: "tabCol",
            });
          }
          this.finalField = [...selctedField, ...unSelctedField];
        } else {
        }
      },
      (error) => {
      }
    );
  }

  mixedDateTimeFormatMethod() {

    let format;
    this.dateFormats.forEach((element) => {
      if (element.Key == this.selectedDateFormats) {
        format = element.Value;
      }
    });

    this.timeFormats.forEach((element) => {
      if (element.Key == this.selectedTimeFormats) {
        format = format + " " + element.Value;
      }
    });
    this.mixedDateTimeFormat = new DatePipe("en-US").transform(
      this.dateTimeFormatDate,
      format
    );
  }

  addGreetings() {
    this.common.hubControlEvent('Localization','click','','','','addGreetings');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "localizationAddGreetings",
        title: "Add Greetings",
      },
      width: "300px",
      height: "50vh",
    });
    dialogRef.afterClosed().subscribe((status) => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'Localization');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
    }))
     });
  }

  changeCurrencyByPhoneNumber() {
    this.common.hubControlEvent('Localization','click','','','','changeCurrencyByPhoneNumber');

    let currencyCode;
    this.countryCode.forEach((element) => {
      if (element.country_code == this.numberFormat) {
        currencyCode = element.currency;
      }
    });

    this.currency_list.forEach((element) => {
      if (element.abbreviation == currencyCode) {
        this.currencySymbol = element.symbol;
      }
    });
  }

  changeToOrientation(orientaion: any, index: any) {
    this.common.hubControlEvent('Localization','click','','','','changeToOrientation');

    this.languages[index].AssignedProperty = orientaion;

  }

  setAllowedISD() {
    this.common.hubControlEvent('Localization','click','','','','setAllowedISD');

    this.AllDataInfo.allowedISD = this.returnAllowedISDInfo("dial_code").join();
    this.AllDataInfoCopy.allowedISD =
      this.returnAllowedISDInfo("dial_code").join();
  }

  languageDataFromTenant() {
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          FLAG: "GET_LANGUAGE_DATA",
          PROCESSID: this.userDetails.Processid,
        },
      },
    };
    this.common.hubControlEvent('Localization','click','','',JSON.stringify(obj),'languageDataFromTenant');

    this.api.post("index", obj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0) {
          res.results.data.forEach(element => {
            this.languagesByTenant.push(element.LanguageCode)
          });
        }
      }
    });
  }

  languagesAddMore() {
    this.common.hubControlEvent('AppSettings','click','','','','languagesAddMore');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'localizationAddMoreButton',
        productId : this.productID,
        productName : this.productName
      },
      width: "60%",


    });
    dialogRef.afterClosed().subscribe((status) => {
      this.getAllData()

    })
  }

  individualLanguageInfo(language,langCode){
    this.common.hubControlEvent('AppSettings','click','','','','individualLanguageInfo');
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'individualLanguageInfo',
        productId : this.productID,
        productName : this.productName,
        language,
        langCode,
        defaultLanguageCode: this.defaultLanguage.defaultLanguageCode
      },
      width: "70%",
      maxHeight:"90vh"
    });
    dialogRef.afterClosed().subscribe((status) => {

    })
  }

  languagesCommonApi() {
    this.common.hubControlEvent('AppSettings','click','','','','languagesAddMore');
    // this.chnageLanguageStatus = !this.chnageLanguageStatus;
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'localizationCommonAPI',
        productId : this.productID,
        productName : this.productName
      },
      width: "60%",
      maxHeight:"90vh"
    });
    dialogRef.afterClosed().subscribe((status) => {

    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }


}
