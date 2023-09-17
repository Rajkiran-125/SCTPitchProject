import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex,masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'
@Component({
  selector: 'app-stockdemandgeneration',
  templateUrl: './stockdemandgeneration.component.html',
  styleUrls: ['./stockdemandgeneration.component.scss']
})
export class StockdemandgenerationComponent implements OnInit {
  inventoryMasters: any;
  form: FormGroup;
  producttypelist: any;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  requestObj: any;
  path: any;
  editObj: any;
  masters:any;
  ddgst: any;
  ddcenterdata: any;	
  labelName: any;
  reset: boolean;
  constructor(private formBuilder: FormBuilder, private api: ApiService, private common: CommonService, private router: Router,
    private auth: AuthService, public datepipe: DatePipe, private activatedRoute: ActivatedRoute,private location: Location,private el: ElementRef,) {
    Object.assign(this, { masters });
  }
  ngOnInit(): void {
    this.common.hubControlEvent('demandstock','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.getProducts();
    this.userDetails = this.auth.getUser();
    this.getCenterMaster();
    this.form = this.formBuilder.group({
      producttype: ['', Validators.required],
      productcode: ['', Validators.required],
      productname: ['',  [Validators.required,Validators.maxLength(100)]],
      productdesc: ['', [Validators.nullValidator,Validators.maxLength(250)]],
      productponumber	:['', [Validators.nullValidator, Validators.pattern(regex.numeric)]],
      productstocknumberofdays	: ['', [Validators.nullValidator, Validators.pattern(regex.numeric)]],
      productqty: ['', [Validators.nullValidator, Validators.pattern(regex.numeric)]],
      productrate: ['', [Validators.nullValidator , Validators.pattern(regex.numeric)]],
      productgst: ['',  Validators.required],
      productcenter: ['', Validators.nullValidator]
    })
    this.common.getGST(this.userDetails.Processid, 1).subscribe(res => {
      this.ddgst = res
    });
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_stockdemandgeneration",
          parameters: {
            "flag": "Edit",
            Id: this.path,
            "ProcessId": this.userDetails.Processid,
            "ProductId": 1
          }
        }
      }
      this.api.post('index', Obj).subscribe((res: any) => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {       
          this.loader = false;
          this.editObj = res.results.data[0];
          const lowerObj = this.common.ConvertKeysToLowerCase();
          this.form.patchValue(lowerObj(this.editObj));
          this.form.get('GST').patchValue(lowerObj(res.results.data[0].HSNCode))
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/demandstock/add'])
    }
    this.common.hubControlEvent('demandstock','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('demandstock','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'StockDemand', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('demandstock','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
        this.common.setUserConfig(this.userDetails.ProfileType, 'demandstock');
        this.common.getUserConfig$.subscribe(data => {
            this.config = data;
          });
       
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
}
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('demandstock','click','back','back','','back');

    this.location.back()
  }
  submit() {
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("General Error");
      return;
    }

    this.commonObj = {
      userid: '',
      vendorid: '',
      processid: this.userDetails.Processid,
      productid: 1,
      publicip: this.userDetails.ip,
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version,
      id: this.path !== null ? this.path : '',
    }
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_stockdemandgeneration",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.EmployeeId,
          ...this.form.value,
          ...this.commonObj,
        }
      }
    }
    this.common.hubControlEvent('demandstock','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/demandstock']);
        this.common.snackbar(res.results.data[0].result, "success");
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      })
  }
  productslist : any = [];
  tabkey : any = [];
getProducts(){
  this.loader = true;
  this.userDetails = this.auth.getUser();
 let  Obj = {
    data: {
      spname: "usp_unfyd_client_products",
      parameters: {
        flag: "GET",
        processid: this.userDetails.Processid,
        productid: 1
      }
    }
  }
  this.common.hubControlEvent('demandstock','click','','',JSON.stringify(Obj),'getProducts');

  this.api.post('index', Obj).subscribe(res => {
    if (res.code == 200) {
      this.loader = false;
      this.productslist = res.results;
      this.productslist.data.forEach(element => {
        this.tabkey.push({productCode : element['Product Code'] , productName : element['Product Name'], productdescription: element['Product Description'] })
      });    
    }
  })
}
getCenterMaster() {
  let Obj = {
      data: {
        spname: "usp_unfyd_product_center",
        parameters: {
            flag: "GET",
            processid: this.userDetails.Processid,
            productid: 1
        }
    }
  }
  this.common.hubControlEvent('demandstock','click','','',JSON.stringify(Obj),'getCenterMaster');

  this.api.post('index', Obj).subscribe((res) => {
    if (res.code == 200) {
      this.ddcenterdata = res.results.data;   
    }
  })
}
selectProductCode(data){
  this.common.hubControlEvent('demandstock','click','','',JSON.stringify(data),'selectProductCode');

  let product = this.tabkey.find(item => item.productCode === data)
this.form.patchValue({
  productcode : product.productCode,
  productname:product.productName,
  productdesc: product.productdescription
})
}
}
