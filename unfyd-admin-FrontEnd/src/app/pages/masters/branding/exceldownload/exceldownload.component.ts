import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex, masters } from 'src/app/global/json-data';
import {MatIconModule} from '@angular/material/icon';
@Component({
  selector: 'app-exceldownload',
  templateUrl: './exceldownload.component.html',
  styleUrls: ['./exceldownload.component.scss']
})
export class ExceldownloadComponent implements OnInit {
  loader: boolean = false;
  form: FormGroup;
  tabData: number;
  tabValueselected=1
  agents = [];
  agent = [];
  get3month: [];
  productID: any;
  productType: any = '';
  productName: any = '';
  userDetails: any;
  labelName: any;
  report: any;
  tabKey: any[];
  tabValue: any[];
  submittedForm: boolean;
  ReportName: any = '';
  isShown: boolean = false ;
  sevenDays=this.agents=[];
  fiveWeeks=[];
  threeMonths=[];
  constructor(private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private el: ElementRef,)

     { Object.assign(this, {
      masters }); }

  ngOnInit(): void {
    this.common.hubControlEvent('exceldownload','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();

    this.form = this.formBuilder.group({

      productName : ["", [Validators.nullValidator]],
      reportname: ["", [Validators.nullValidator]],
      PROCESSID: [this.userDetails.Processid, [Validators.nullValidator]],
      PUBLICIP: [this.userDetails.ip, [Validators.nullValidator]],
      IP: ["", [Validators.nullValidator]],
      BROWSERNAME: [this.userDetails.browser, [Validators.nullValidator]],
      BROWSERVERSION: [this.userDetails.browser_version, [Validators.nullValidator]]
    });
    
    this.getProducts();
    this.getreport();
    this.common.hubControlEvent('exceldownload','click','pageloadend','pageloadend','','ngOnInit');

  }



  tabValue1(data: any) {
    
    if (data == 'Inbound') {
      this.tabData = 1
      this.get7days()
      this.common.hubControlEvent('exceldownload','click','','',JSON.stringify(data),'get7days');
      
    }
    if (data == 'Outbound') {
      this.tabData = 2
      this.get5weeks()
      this.common.hubControlEvent('exceldownload','click','','',JSON.stringify(data),'get5weeks');
    }
    if (data == '3months') {
      this.tabData = 3
      this.get3months();
      this.common.hubControlEvent('exceldownload','click','','',JSON.stringify(data),'get3months');
    }
    
  }

  get7days() {

    var Obj1 = {

      data: {
        spname: "usp_unfyd_rpt_export_details",
        parameters: {
          flag: 'GETFILEDATA',
          Filetype : '7Days',
          reportname: this.ReportName,
          productid: this.productID
        }
      }

    }
    this.common.hubControlEvent('exceldownload','click','','',JSON.stringify(Obj1),'get7days');

    this.api.post('index', Obj1).subscribe(res => {

      this.loader = false;
      if (res.code == 200) {
        this.agents = res.results.data;
      }
    })
  }


  get5weeks() {
    var Obj1 = {
      data: {
        spname: "usp_unfyd_rpt_export_details",
        parameters: {
          flag: 'GETFILEDATA',
          Filetype : '5weeks',
          reportname: this.ReportName,
          productid: this.productID
        }
      }
    }
    this.common.hubControlEvent('exceldownload','click','','',JSON.stringify(Obj1),'get5weeks');

    this.api.post('index', Obj1).subscribe(res => {

      this.loader = false;

      if (res.code == 200) {
         this.agent = res.results.data;
      }
    })
  }


  get3months() {

    var Obj1 = {
      data: {
        spname: "usp_unfyd_rpt_export_details",
        parameters: {
          flag: 'GETFILEDATA',
          Filetype : '3months',
          reportname: this.ReportName,
          productid: this.productID

        }
      }
    }
    this.common.hubControlEvent('exceldownload','click','','',JSON.stringify(Obj1),'get3months');

    this.api.post('index', Obj1).subscribe(res => {
      
      this.loader = false;
   if (res.code == 200) {
        this.get3month = res.results.data;
      }
    })
  }
  getreport(){

    var Obj1 = {
      data: {
        spname: "usp_unfyd_rpt_export_details",
        parameters: {
          flag: 'GETREPORT',

        }
      }
    }
    this.common.hubControlEvent('exceldownload','click','','',JSON.stringify(Obj1),'getreport');

    this.api.post('index', Obj1).subscribe(res => {

      this.loader = false;
      if (res.code == 200) {
        this.report = res.results.data;
      }
    })


  }

  getProducts() {
    this.common.hubControlEvent('exceldownload','click','','','','getProducts');

    this.productType = JSON.parse(localStorage.getItem('products'))
    this.productName = this.productType[0].ProductName
    this.getSnapShot();
  }

  selectedProduct(e) {
    this.productName = e
    this.common.hubControlEvent('exceldownload','click','','',e,'selectedProduct');

  }

  selectedReport(e) {
    
    this.ReportName = e
    this.common.hubControlEvent('exceldownload','click','','',e,'selectedReport');
    
  }
  hubDownloadExcel(fileName,FilePath) {
    this.common.hubControlEvent('exceldownload','click','','',JSON.stringify(fileName,FilePath),'hubDownloadExcel');


    var link = document.createElement('a');
    link.href = FilePath;
    link.target = "_blank";
    link.download = fileName;
    link.click();
  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('exceldownload','click','','',data,'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'exceldownload', data)
    this.common.getLabelConfig$.subscribe(data => {

    });
  }

  config: any;
  getSnapShot() {
    this.common.hubControlEvent('exceldownload','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();

    this.activatedRoute.url.subscribe((url) => {

      let path = this.activatedRoute.snapshot.data.title

      this.common.setUserConfig(this.userDetails.ProfileType, 'exceldownload');

      this.common.getUserConfig$.subscribe(data => {

        this.config = data;

      });

    });

    this.common.getLanguageConfig$.subscribe(data => {

      this.setLabelByLanguage(data)

    });

    this.setLabelByLanguage(localStorage.getItem("lang"))

  }

toggleShow(){
  this.isShown = ! this.isShown;
   this.get7days();
   this.get5weeks();
   this.get3months();
   this.common.hubControlEvent('exceldownload','click','','','','toggleShow');


}}
