import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex , masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'
@Component({
  selector: 'app-vendor-product',
  templateUrl: './vendor-product.component.html',
  styleUrls: ['./vendor-product.component.scss']
})

export class VendorProductComponent implements OnInit {
  loader: boolean = false;
  ProductId: any;
  userDetails: any;
  regex: any;
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  masters:any;
  labelName: any;
  reset: boolean;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    private el: ElementRef,
  ) { Object.assign( this, {masters , regex});
}

  ngOnInit(): void {
    this.common.hubControlEvent('vendorproduct','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.loader = true;
    this.getSnapShot();
    this.form = this.formBuilder.group({
      vendorcode: ['', Validators.nullValidator],
      vendorname: ['', [Validators.nullValidator,Validators.maxLength(100)]],
      productcode: ['', Validators.nullValidator],
      processid: [this.userDetails.Processid, Validators.nullValidator],
      publicip: [this.userDetails.ip, Validators.nullValidator],
      privateip: ["", Validators.nullValidator],
      browsername: [this.userDetails.browser, Validators.nullValidator],
      browserversion: [this.userDetails.browser_version, Validators.nullValidator]
    });

    this.ProductId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.ProductId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_vendor_product",
          parameters: {
            flag: "EDIT",
            Id: this.ProductId
          }
        }
      }
      this.api.post('index', Obj).subscribe((res:any) => {
        this.loader = false;
        this.reset = true;
        if(res.code == 200){
          const myObjLower = this.common.ConvertKeysToLowerCase();
          this.form.patchValue(myObjLower(res.results.data[0]));
          this.form.updateValueAndValidity(); 
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/vendor-product/add'])
    }
    this.common.hubControlEvent('vendorproduct','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('vendorproduct','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'VendorProducts', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }

  config: any;
  getSnapShot() {
    this.common.hubControlEvent('vendorproduct','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path  = this.activatedRoute.snapshot.data.title
        this.common.setUserConfig(this.userDetails.ProfileType, 'vendorproduct');
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
    this.common.hubControlEvent('vendorproduct','click','back','back','','back');

    this.location.back()
  }
  submit(): void {

    this.loader = true;
    this.submittedForm = true;

    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }
    
    if (this.ProductId == null) {
     
      this.requestObj = {
        data: {
          spname: "usp_unfyd_vendor_product",
          parameters: {
            flag: 'INSERT',
            CREATEDBY: this.userDetails.EmployeeId,
            PRODUCTID: 1,
            ...this.form.value,
          }
        }
      }
    } else {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_vendor_product",
          parameters: {
            flag: "UPDATE",
            ID: this.ProductId,
            MODIFIEDBY: this.userDetails.EmployeeId,
            ...this.form.value,
          }
        }
      }
      
    }
    this.common.hubControlEvent('vendorproduct','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/vendor-product']);
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

}
