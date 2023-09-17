import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {  ElementRef,  ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex, masters } from 'src/app/global/json-data';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from "rxjs";
import * as XLSX from 'xlsx';
import { event } from 'jquery';
import moment from 'moment';





@Component({
  selector: 'app-api-console-external',
  templateUrl: './api-console-external.component.html',
  styleUrls: ['./api-console-external.component.scss']
})
export class ApiConsoleExternalComponent implements OnInit {

  
    loader: boolean = false;
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
    selectedTab: String = "External";
    constructor(
     
      private formBuilder: FormBuilder,
      private auth: AuthService,
      private common: CommonService,
      private api: ApiService,
      public dialog: MatDialog,
    ) {
    }
  
    ngOnInit(): void {
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
  
      let fromDate = this.DateForm.get('fromDate').setValue(moment().subtract(6, 'days'));
      let toDate = this.DateForm.get('toDate').setValue(moment());
  
      var Obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            flag: "GETAPI",
            productId: 11,
            processId: 1,
            fromDate: moment().subtract(15, 'days').toISOString().slice(0, 10),
            toDate: moment().toISOString().slice(0, 10)
          }
        }
      }
  
      this.ApiCall(Obj);
      this.getProducts();
      this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      });
      this.setLabelByLanguage(localStorage.getItem("lang"))
    }
    setLabelByLanguage(data) {
      this.loader = true
      this.subscription.push(
        this.common.getLabelConfig$.subscribe(data1 => {
          this.loader = false
          this.labelName = data1
        }));
      this.common.setLabelConfig(this.userDetails.Processid, 'api-console', data)
      
  }
    submitForm() {
  
      let fromDate = (this.DateForm.get('fromDate').value).toISOString().slice(0, 10);
      let toDate = (this.DateForm.get('toDate').value).toISOString().slice(0, 10);
  
      if (fromDate > toDate)
      {
        this.common.snackbar('TodateShouldBeGreater');
        return;
      }
      
      var Obj = {
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            flag: "GETAPI",
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
  
  
      var Obj = { 
        data: {
          spname: "USP_UNFYD_API_CONSOLE",
          parameters: {
            flag: "ExportExcel",
            ACTION: exportJson.Action,
            MODULE: exportJson.Module
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
  
      let arr = res.results.data
  
  
      const onlyNameAndSymbolArr = arr.map(x => ({
        "Application": this.productName,
        "Internal / External": this.selectedTab,
        "API": x.URL,
        "Type": x.Type,
        "Header": x.Header,
        "Response Time": x.ResponseTime ? Math.round(x.ResponseTime) + " ms" : "No data",
        "Sample Request": x.SampleRequest,
        "Sample Response": x.SampleResponse,
      }));
  
      const fileName = 'API console details for PRODUCT ' + this.productName + 'MODULE_' + exportJson.Module + "_ACTION_" + exportJson.Action + '.xlsx';
  
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(onlyNameAndSymbolArr);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'API Details');
  
      XLSX.writeFile(wb, fileName);
  
      $event.stopPropagation();
  
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
            URL: datatoSend.URL
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
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
      this.selectedTab = e.tab.textLabel;      
    }
  
    ApiCall(obj) {
      this.api.post('index', obj).subscribe(res => {
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
  
          let matchArr = ["Master","Reports","Setting","Feature Controls","Workspace","Dashboard"]
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
                  this.wiseObj[typ][cat].push(element);
                }
              });
            });
          });
       
         
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
      this.productId = this.productType[9].Id;
      this.productName = this.productType[9].ProductName;
    }
  
    ngOnDestroy() {
    }
  
  
}
