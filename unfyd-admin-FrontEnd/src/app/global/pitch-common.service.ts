import { DatePipe } from '@angular/common';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';
import { ExcelService } from './excel.service';
import { WeekPipe } from './week.pipe';

@Injectable({
  providedIn: 'root'
})
export class PitchCommonService {
  ApiStatusLocalization = 1
  ApiStatusUserConfig = 1
  ApiStatusMasterConfig = 1
  lowercaseKeys: any;
  requestObj: any;
  uniqueID: any;
  currentDateTime: any;
  scrHeight: any;
  scrWidth: any;
  callAlertMessage: boolean = true;
  alertDataAPI: any = [];
  userDetails: any;
  count: boolean = true;
  CampaignIdAndStatus:any;
  StartTime:any;
  EndTime:any;
  ChannelSource=[];
  ChannelName:any;
  CampaignData:any;
  CampaignName:any;
  
  
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private api: ApiService,
    private excelService: ExcelService,
    public datepipe: DatePipe,
    private router: Router,
    private week : WeekPipe
  ) { 
    // console.log(this.ChannelSource);
    
  }

  private buttonToggle:Subject<boolean> = new Subject<boolean>()
buttonToggle$ = this.buttonToggle.asObservable()

setbuttonToggle(data){
  this.buttonToggle.next(data)
}

 public buttonYesNo = new BehaviorSubject('');

//  passValue(data) {
//    this.buttonYesNo.next(data);
//  }

  @Output() agentFilterDynamic: EventEmitter<Object> = new EventEmitter();
  agentFilter(value: any) {
    this.agentFilterDynamic.emit(value);
  }
  
  getSearch: Subject<string> = new Subject<string>();
  getSearch$: Observable<string> = this.getSearch.asObservable();
  setSearch(event) {
    this.getSearch.next(event);
  }

  getTableKey: Subject<any[]> = new Subject<any[]>();
  getTableKey$: Observable<any[]> = this.getTableKey.asObservable();
  setTableKey(object) {
    this.getTableKey.next(object);
  }

  getUserConfig: BehaviorSubject<any> = new BehaviorSubject<any>({});
  getUserConfig$: Observable<any> = this.getUserConfig.asObservable();

  userConfig: Subject<any> = new Subject<any>();
  userConfig$: Observable<any> = this.userConfig.asObservable();

  setUserConfigToLocalStorage(obj) {
    localStorage.setItem("userConfig", JSON.stringify(obj));
  }

  setMasterConfigToLocalStorage(obj) {
    localStorage.setItem("masterConfig", JSON.stringify(obj));
  }

  getItemsPerPage: Subject<number> = new Subject<number>();
  getItemsPerPage$: Observable<number> = this.getItemsPerPage.asObservable();
  setItemsPerPage(event) {
    this.getItemsPerPage.next(event);
  }

  
  calendarEvents = new BehaviorSubject<any>("Nitesh");
  dataObservable = this.calendarEvents.asObservable();

  sendData(data: any) {
   // console.log(data);
    this.calendarEvents.next(data);
  }


  closeMenu = new Subject;
  sendBooleanVal(data: any) {
    console.log(data);
    this.closeMenu.next(data);
  }



  

  setUserConfig(roleid, module) {
    if (localStorage.getItem("userConfig")) {
      let a = JSON.parse(localStorage.getItem("userConfig"));
      this.getUserConfig.next(a[module == 'contact-center-location' ? 'contactcenterlocation' :
                                module == 'product-group' ? 'productgroup' :
                                module == 'break-not-ready-reason-codes' ? 'breaknotreadyreasoncodes' :
                                module == 'customerproduct' ? 'products' :
                                module.toLowerCase()]);

    } else {
      this.getUserConfigFromApi()
      this.userConfig$.subscribe(res => {
        this.getUserConfig.next(res[module.toLowerCase()]);
      })
    }
  }

  snackbar(
    message: string,
    status?: string,
    horizontal?: any,
    vertical?: any,
    snackDuration?: number
  ) {
    let alertMessages = this.alertDataAPI;
    let alertMessagesNew = []
    if(this.alertDataAPI)
    alertMessagesNew = alertMessages?.filter(
      (a) => a["Alert Message"] == message
    );

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

  getUserConfigFromApi() {
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
    this.api.post("index", this.requestObj).subscribe(
      (res) => {
        if (res.code == 200) {
          localStorage.removeItem("authtoken");
          localStorage.setItem("authtoken", res.results?.TokenIndex);
          let a: any = {};
          if(res.results?.data?.length > 0){
            res.results.data.forEach((res1) => {
              if (Object.keys(a).length > 0) {
                if(res1["ModuleName"]){
                  if (!Object.keys(a).includes(res1["ModuleName"].toString())) {
                    a[res1["ModuleName"]] = {};
                  }
                }
              } else {
                if(res1["ModuleName"]) a[res1["ModuleName"]] = {};
              }

              if(res1["ModuleName"]){
                if (Object.keys(a[res1["ModuleName"]]).length > 0) {
                  if(res1["ActionList"]){
                    if (!Object.keys(a[res1["ModuleName"]]).includes(res1["ActionList"].toString())) {
                      a[res1["ModuleName"]][res1["ActionList"]] = res1["Status"];
                    }
                  }
                } else {
                  if(res1["ActionList"]) a[res1["ModuleName"]][res1["ActionList"]] = res1["Status"];
                }
              }
          })
        }
        // console.log(a);
        const lowerObj = this.ConvertKeysToLowerCase();
        a = lowerObj(a);

          this.setUserConfigToLocalStorage(a)
          this.userConfig.next(a)
        } else{
          this.ApiStatusUserConfig = 1
        }
      },
      (error) => {
        if (error.code == 401) {
          this.ApiStatusUserConfig = 1
          //this.auth.logout('');
          this.snackbar("Token Expired Please Logout", 'error');
        }
      }
    );
  }

  ConvertKeysToLowerCase() {
    this.lowercaseKeys = (obj) =>
      Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = obj[key];
        return acc;
      }, {});
    return this.lowercaseKeys;
  }

  getMasterConfig: BehaviorSubject<any> = new BehaviorSubject<any>({});
  getMasterConfig$: Observable<any> = this.getMasterConfig.asObservable();

  masterConfig: Subject<any> = new Subject<any>();
  masterConfig$: Observable<any> = this.masterConfig.asObservable();
  getMasterConfigFromApi() {
    this.ApiStatusMasterConfig = 2
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

    this.api.post("cachedata", this.requestObj).subscribe((res) => {
      var temp = [];
      if (res.code == 200) {
        var myArray = res.results.data[0];
        for (var i = 0; i < myArray.length; ++i) {
          temp.push({ [myArray[i].ConfigName]: myArray[i].ConfigValue });
        }
        let obj = temp.reduce(function (acc, val) {
          return Object.assign(acc, val);
        }, {});

        this.setMasterConfigToLocalStorage(obj)
        this.masterConfig.next(obj)
      } else{
        this.ApiStatusMasterConfig = 1
      }
    },(error) => {
      if (error.code == 401) {
        this.ApiStatusMasterConfig = 1
        this.snackbar("Token Expired Please Logout", 'error');
      }
    });
  }

  setMasterConfig() {
    if (localStorage.getItem("masterConfig")) {
      let a = JSON.parse(localStorage.getItem("masterConfig"));
      this.getMasterConfig.next(a);
    } else {
      this.getMasterConfigFromApi()
      this.masterConfig$.subscribe(res => {
        this.getMasterConfig.next(res);
      })
    }
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
            // console.log("response API OBJ: ", res);
            observer.next(res.results.data);
          }
        },
        (error) => { }
      );
    });
  }

}

