import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, regex } from 'src/app/global/json-data';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  @Input() hawkerDetails: any;
  requestObj: any;
  loader: boolean = false;
  form: FormGroup;
  submittedForm: boolean = false;
  masters: any;
  regex: any;
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  userDetails: any;
  product: any = [];
  remarkPanel: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;

  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    private auth: AuthService,
    private api: ApiService,
  ) {
    Object.assign(this, { masters, regex });
  }

  ngOnInit() {
    this.userDetails = this.auth.getUser();

    this.form = this.formBuilder.group({
      productname: ['', Validators.required],
      productsize: ['', Validators.required],
      quantity: [1, Validators.required],
      productcenter: ['', Validators.required],
      status: [this.masters.stockStatus[0], Validators.required],
      issuedate: [new Date(), Validators.required],
      remark: ['', Validators.nullValidator],
    });
    
    if (this.hawkerDetails.contactid !== undefined) {
      // setTimeout(() => {
        this.getStockList();
        this.getFilter();
        this.getProductCenter(); 
      // }, 500);
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getStockList() {

    this.tabKey = [];
    this.tabValue = [];
    this.requestObj = {
      data: {
        spname: "usp_unfyd_haw_stock",
        parameters: {
          flag: "GET",
          hawkerid: this.hawkerDetails.contactid,
          processid: this.userDetails.Processid,
          productid: 1
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        for (let data of res.results.data) {
          var paymentObj = {
            "Sr No": '',
            "Product Name": data['Product Name'],
            "Product Size": data['Product Size'],
            "Qty": data['Quantity'],
            "Product Center": data['Product Center'],
            "Status": data['Status'],
            "Remarks": data['Remark'],
            "Date": data['Issue Date'],
          }
          this.tabValue.push(paymentObj);
        }
        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }

        this.productMaster();
        if (this.tabValue.length == 0) {
          this.noData = true
        }
      } else {
        this.loader = false
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error", "error");
      })
  }
  productMaster() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_client_products",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.product = res.results.data;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error", "error");
      })

  }
  // changeProductType(event) {
  //   var temp = this.product.filter(key => key['Product Name'] === event)[0];
  //   this.form.controls['productsize'].patchValue(event == 'Uniform' ? this.hawkerDetails.UniformSize : temp.Size);
  //   this.form.controls['productcenter'].patchValue(temp.Center);
  //   this.form.updateValueAndValidity();
  // }
  changeProductStatus(event) {
    if (event == 'Return') {
      this.remarkPanel = true;
      this.form.controls['remark'].setValidators(Validators.required);
    } else {
      this.remarkPanel = false;
      this.form.controls['remark'].setValidators(Validators.nullValidator);
    }
    this.form.controls['remark'].setValue('');
    this.form.updateValueAndValidity();
  }

  submit() {
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      this.loader = false;
      this.common.snackbar("General Error");
      return;
    }


    this.requestObj = {
      data: {
        spname: "usp_unfyd_haw_stock",
        parameters: {
          flag: "INSERT",
          roletype: 'hawker',
          hawkerid: this.hawkerDetails.contactid,
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
          usersubtype: '',
          ...this.form.value,
          createdby: this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.common.snackbar("Saved Success", "success");
        this.getStockList()
        this.form.setValue({
          productname: '',
          productsize: '',
          quantity: 1,
          productcenter: '',
          issuedate: new Date(),
          status: this.masters.stockStatus[0],
          remark: '',
        });
        this.form.controls['productsize'].setValidators(Validators.required);
        this.form.updateValueAndValidity();
        this.sizeDropdown = true;
        this.remarkPanel = false;
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }

  keepOrder = (a) => {
    return a;
  }

  close() {
    this.common.closeComponent();
  }

  getFilter() {
    this.common.getItemsPerPage$.subscribe(getItemsPerPage => {
      this.itemsPerPage = getItemsPerPage
    });
    this.common.getSearch$.subscribe(getSearch => {
      this.search = getSearch
    });
  }


  productCenter : any = []
  getProductCenter() {
    var productCenter = {
      data: {
        spname: 'usp_unfyd_product_center',
        parameters: {
          flag: 'GET',
          processid: this.userDetails.Processid,
          productid: 1,
        },
      },
    };
    this.api.post('index', productCenter).subscribe(res => {
      if (res.code == 200) {
        this.productCenter = res.results.data;
        this.loader = false;
        // this.common.snackbar(res.results.data[0].result);
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        // this.common.snackbar(error.message);
      })
  }

  sizeDropdown: boolean = true
  productCheck(event){
    if (event == 'Identity Card') {
      this.form.controls['productsize'].setValidators(Validators.nullValidator);
      this.sizeDropdown = false
    } else {
      this.form.controls['productsize'].setValidators(Validators.required);
      this.sizeDropdown = true
    }
    this.form.controls['productsize'].setValue('');
    this.form.updateValueAndValidity();
  }

  numericOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43 ||
      charCode === 33 || charCode === 35 || charCode === 47 || charCode === 36 ||
      charCode === 37 || charCode === 38 || charCode === 40 || charCode === 41 || charCode === 42
      || charCode > 47 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (event.target.value.length >= 20) {
      return false;
    }
    return true;
  }

}
