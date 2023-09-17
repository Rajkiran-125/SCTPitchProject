import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { DatePipe, Location } from '@angular/common'
import { regex, masters, apiConsole } from 'src/app/global/json-data';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from "rxjs";
import * as XLSX from 'xlsx';
import { event } from 'jquery';
import moment from 'moment';


@Component({
  selector: 'app-api-console',
  templateUrl: './api-demo.component.html',
  styleUrls: ['./api-demo.component.scss']
})
export class ApiConsoleComponent implements OnInit {
  apiConsole
  loader: boolean = false;
  loader1: boolean = false;
  skillId: any;
  userDetails: any;
  regex: any;
  masters: any;
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  minMessage: any;
  labelName: any;
  reset: boolean;
  subscription: Subscription[] = [];
  panelOpenState = false;
  reportsClosed = Array(5).fill(true)
  masterClosed = {};
  LinkClosed = Array(5).fill(true)
  CRMClosed = Array(5).fill(true)
  masterArr = [];

  productType: any = [];
  productName: string;
  categories = [];
  Type = [];
  wiseObj = {};
  DateForm: FormGroup;
  DateForm2: FormGroup;
  dateFormat: any;
  minDate = new Date();
  maxDate = new Date();

  agents = [];
  items = Array(5).fill({
    id: 1
  })
  public filteredList2 = this.agents.slice();
  userConfig: any;
  productId: number;
  TotalExcelArr: any ;
  selectedTab: String = "Internal";
  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    public dialog: MatDialog,
     private datePipe: DatePipe,

  ) {
    Object.assign(this, { apiConsole });
  }

  ngOnInit(): void {
    // this.BulkInsertApiConsoleJson()
    this.loader = true;
    this.DateForm = this.formBuilder.group({
      toDate: [moment(), Validators.required],
      fromDate: [moment(), Validators.required],
    });

    this.DateForm2 = this.formBuilder.group({
      toDate: [moment(), Validators.required],
      fromDate: [moment(), Validators.required],
    });





    this.common.getMasterConfig$.subscribe((data) => {
      this.dateFormat = data.DatePickerFormat;
    });
    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear() +1);
    this.userDetails = this.auth.getUser();

    this.getProducts();
    this.loader = false;

    // let fromDate = this.DateForm.get('fromDate').setValue(moment().subtract(6, 'days'));
    // let toDate = this.DateForm.get('toDate').setValue(moment());

    // var Obj = {
    //   data: {
    //     spname: "USP_UNFYD_API_CONSOLE",
    //     parameters: {
    //       flag: "GETAPI",
    //       productId: 11,
    //       processId: 1,
    //       // fromDate: moment().subtract(15, 'days').toISOString().slice(0, 10),
    //       fromDate: moment().toISOString().slice(0, 10),
    //       toDate: moment().toISOString().slice(0, 10)
    //     }
    //   }
    // }

    // this.ApiCall(Obj);

    this.submitForm() 
  }

  // BulkInsertApiConsoleJson()
  // {
  //   var Obj = {
  //     data: {
  //         data: "APICONSOLE",
  //       }
  //     }
	// this.api.post('ApiConsoleInsertApi', Obj).subscribe(res => {
  //     if (res.code == 200) {

  //     }
  //  })
  // }

  submitForm() {

    // let fromDate = (this.DateForm.get('fromDate').value).toISOString().slice(0, 10);
    // let toDate = (this.DateForm.get('toDate').value).toISOString().slice(0, 10);

    let fromDate = this.datePipe.transform(this.DateForm.value.fromDate, 'yyyy-MM-dd HH:mm:ss');
    let toDate = this.datePipe.transform(this.DateForm.value.toDate, 'yyyy-MM-dd HH:mm:ss');


    if (fromDate > toDate)
    {
      this.common.snackbar('TodateShouldBeGreater');
      return;
    }

    var Obj = {
      data: {
        spname: "USP_UNFYD_API_CONSOLE",
        parameters: {
          flag: this.selectedTab.toLowerCase() == 'internal' ?  "GETAPI" : 'GET_EXTERNAL_API',
          productId: this.productId,
          processid: this.userDetails.Processid,
          fromDate: fromDate,
          toDate: toDate
        }
      }
    }
    this.loader = true;
    this.ApiCall(Obj);
  }

  exportToExcel($event: Event, exportJson: any) {
    this.loader=false

    // console.log('exportJson',exportJson);
    // this.userDetails.Processid

    // let fromDate = this.datePipe.transform(this.DateForm.value.fromDate, 'yyyy-MM-dd HH:mm:ss');
    // let toDate = this.datePipe.transform(this.DateForm.value.toDate, 'yyyy-MM-dd HH:mm:ss');



    var Obj = {
      data: {
        spname: "USP_UNFYD_API_CONSOLE",
        parameters: {
          flag: "ExportExcel",
          Tab: this.selectedTab.toLowerCase() == 'internal' ?  "internal" : 'external',

          ACTION: exportJson.Action,
          Category: exportJson.Category,
          KeyName: exportJson.KeyName,
          RequestType: exportJson.RequestType,
          // MODULE: exportJson.Module,
          // URL : exportJson.URL,

          ProductId:this.productId,
          Processid:this.userDetails.Processid,
          fromDate: this.datePipe.transform(this.DateForm.value.fromDate, 'yyyy-MM-dd HH:mm:ss'),
          toDate: this.datePipe.transform(this.DateForm.value.toDate, 'yyyy-MM-dd HH:mm:ss')
        }
      }
    }
    this.api.post('ApiConsoleRedis', Obj).subscribe(res => {

    let arr = res.results.data

    arr  = arr.sort(function(a, b){return b.responsetime - a.responsetime});

    const onlyNameAndSymbolArr = arr.map(x => ({
      "Application": this.productName,
      "Internal / External": this.selectedTab,
      "API": x.url,
      "Type": x.type,
      "Header": x.header,
      "Response Time": x.responsetime ? Math.round(x.responsetime) + " ms" : "No data",
      "Sample Request": x.samplerequest,
      "Sample Response": x.sampleresponse,
    }));


    // const fileName = 'API console details for PRODUCT ' + this.productName + 'MODULE_' + exportJson.Module + "_ACTION_" + exportJson.Action + '.xlsx';
    let fileName = 'API_CONSOLE_' + exportJson.Module + "_ACTION_" + exportJson.Action + '.xlsx';
    if(fileName.length > 31){
      if(('API_CONSOLE_' + exportJson.Module + "_" + exportJson.Action + '.xlsx').length > 31){
        fileName = 'API_' + exportJson.Module + "_" + exportJson.Action + '.xlsx';
      } else fileName = 'API_CONSOLE_' + exportJson.Module + "_" + exportJson.Action + '.xlsx';
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(onlyNameAndSymbolArr);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'API Details');

    XLSX.writeFile(wb, fileName);

    $event.stopPropagation();
    this.loader=false

    }, (error) => {
      this.loader = false;
      this.common.snackbar("General Error");
    })


  }

  openDialog(index) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "apiConsole",
        data: this.masterArr[index],
      },
      width: "30%",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((status) => {

    });
  }
  openDialogdemo(index, category, typ) {



    let datatoSend = this.wiseObj[typ][category][index];

    var Obj = {
      data: {
        spname: "USP_UNFYD_API_CONSOLE",
        parameters: {
          flag: "GET",
          ACTION: datatoSend.Action,
          CATEGORY: datatoSend.Category,
          KEYNAME: datatoSend.KeyName,
          MODULE: datatoSend.Module,
          REQUESTTYPE: datatoSend.RequestType,
          TYPE: datatoSend.Type,
          URL: datatoSend.URL,
          ProductId:this.productId,
          Processid:this.userDetails.Processid,
          fromDate: this.datePipe.transform(this.DateForm.value.fromDate, 'yyyy-MM-dd HH:mm:ss'),
          toDate: this.datePipe.transform(this.DateForm.value.toDate, 'yyyy-MM-dd HH:mm:ss')
        }
      }
    }
    this.api.post('ApiConsoleRedis', Obj).subscribe(res => {
      this.loader = false;
      datatoSend = res.results.data[0];

      let sampleReqObj = JSON.parse(datatoSend.SampleRequest);
      let sampleResObj = JSON.parse(datatoSend.SampleResponse);
      let ResponseTime = JSON.parse(datatoSend.ResponseTime);


      datatoSend.SampleRequest = JSON.stringify(sampleReqObj, null, "\t");
      datatoSend.SampleResponse = JSON.stringify(sampleResObj, null, "\t");
      datatoSend.ResponseTime = Math.round(ResponseTime);


      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: "apiConsole",
          data: datatoSend,
        },
        width: "60%",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((status) => {

      });



    }, (error) => {
      this.loader = false;
      this.common.snackbar("General Error");
    })


  }

  getSelectedProductDetails(event) {

    var Obj = {
      data: {
        spname: "USP_UNFYD_API_CONSOLE",
        parameters: {
          flag: "GETAPI",
          productId: event.value,
          processid: this.userDetails.Processid,
          fromDate: moment().subtract(3, 'months').toISOString().slice(0, 10),
          toDate: moment().toISOString().slice(0, 10)
        }
      }
    }
    this.loader = true;
    this.ApiCall(Obj);
  }

  test(d) {
    this.productId = d.Id;
  }

  WholeExcel(){

    const onlyNameAndSymbolArr = this.TotalExcelArr.map(x => ({
      "Application": this.productName,
      "API": x.URL,
      "Request Type": x.RequestType,
      "Header": x.Header,
      "Response Time": x.ResponseTime ? Math.round(x.ResponseTime) + " ms" : "No data",
      "Sample Request": x.SampleRequest,
      "Sample Response": x.SampleResponse,
      "Action": x.Action
    }));

    const fileName = 'API console details.xlsx';




    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(onlyNameAndSymbolArr);




    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'API Details');
    XLSX.writeFile(wb, fileName);

  }

  tabClick(e){
    this.selectedTab = e;
    // this.selectedTab = e.tab.textLabel;
    this.Type = []
  }

  ApiCall(obj) {
    this.api.post('ApiConsoleRedis', obj).subscribe(res => {
      if (res.code == 200) {



        this.masterArr = res.results.data;
        let temp = [];
        let tempType = [];
        this.TotalExcelArr = [];


        this.masterArr.forEach(element => {
          tempType.push(element.Type)
        });



        this.Type = tempType.filter((item,
          index) => tempType.indexOf(item) === index);

        let matchArr = ["Master","Workspace","Setting","Feature Controls","Reports","Dashboard"]
        this.Type .sort(function(a, b) {
           return matchArr.indexOf(a) - matchArr.indexOf(b);
         });



        this.masterArr.forEach(element => {
          temp.push(element.KeyName)
        });
        this.categories = temp.filter((item,
          index) => temp.indexOf(item) === index);

        this.Type.forEach(typ => {
          this.wiseObj[typ] = [];
          this.masterClosed[typ] = []

          this.categories.forEach(cat => {
            this.wiseObj[typ][cat] = [];
            this.masterArr.forEach(element => {
              if (typ == element.Type && cat == element.KeyName) {
                // this.wiseObj[typ][cat].push('element');
                this.wiseObj[typ][cat].push('loading');
              }
            });
          });
        });


      }
      else if (res.code == 400) {
        this.common.snackbar("General Error");
        this.loader = false;
      }
      else
      {
        this.common.snackbar("General Error");
      this.loader = false;

      }
      this.loader = false;
    }, (error) => {
      this.loader = false;
      this.common.snackbar("General Error");
    })
  }

  GetModuleData(e,type,cat){
    console.log('e',e,type,cat);


    var Obj = {
      data: {
        spname: "USP_UNFYD_API_CONSOLE",
        parameters: {
          flag: "GetModuleData",
          productId: this.productId,
          processid: this.userDetails.Processid,
          fromDate:  this.datePipe.transform(this.DateForm.value.fromDate, 'yyyy-MM-dd HH:mm:ss'),
          toDate: this.datePipe.transform(this.DateForm.value.toDate, 'yyyy-MM-dd HH:mm:ss'),
          Type:type,
          KeyName:cat
        }
      }
    }

    this.loader1 = true;


	this.api.post('ApiConsoleRedis', Obj).subscribe(res => {
      if (res.code == 200) {

        this.loader1 = false;

          let count = 0

        let arrval = res.results.data;
        this.Type.forEach(typ => {
          this.categories.forEach(cat => {
            arrval.forEach(element => {
              if (typ == element.Type && cat == element.KeyName) {
                if(count== 0)this.wiseObj[typ][cat]=[]
                count++;

                this.wiseObj[typ][cat].push(element);
              }
            });
          });
        });




      }
      else if (res.code == 400) {
        this.common.snackbar("General Error");
        this.loader = false;
      }
      else
      {
        this.common.snackbar("General Error");
      this.loader = false;

      }
      this.loader = false;
    }, (error) => {
      this.loader = false;
      this.common.snackbar("General Error");
    })

  }


  getExcelApi()
  {



    var Obj = {
      data: {
        spname: "USP_UNFYD_API_CONSOLE",
        parameters: {
         flag: "GetExcelData",
          productId: this.productId,
          processid: this.userDetails.Processid,
          fromDate: moment().subtract(3, 'months').toISOString().slice(0, 10),
          toDate: moment().toISOString().slice(0, 10)
        }
      }
    }
    this.api.post('index', Obj).subscribe(res => {

      if(res.code == 200) {
            this.TotalExcelArr.push(res.results.data[0])
          }
    }, (error) => {
      this.loader = false;
      this.common.snackbar("General Error");
    })
  }


  getProducts() {
    this.productType = JSON.parse(localStorage.getItem('products'))
    this.productId = this.productType[0].Id;
    this.productName = this.productType[0].ProductName;
  }

  ngOnDestroy() {
  }

}

