import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  loader: boolean = false;
  ProductId: any;
  userDetails: any;
  masters: any;
  regex: any;
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  ddcenterdata: any;
  ddgst: any;
  minMessage:any;
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
    public dialog: MatDialog,
    private el: ElementRef,
  ) {
    Object.assign(this, { masters, regex });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('Product','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.getCenterMaster();

    this.common.getGST(this.userDetails.Processid, 1).subscribe(res => {
      this.ddgst = res
    })
    this.minMessage = masters.MinLengthMessage;
    this.loader = true;

    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', [Validators.required,Validators.maxLength(100)]],
      descp: ['', Validators.nullValidator],
      size: ['', Validators.nullValidator],
      qty: [''],
      orderedqty: [''],
      maxqty: ['', [Validators.required, Validators.pattern(regex.numeric)]],
      minqty: ['', [Validators.required, Validators.pattern(regex.numeric)]],
      category: ['', Validators.nullValidator],
      rate: ['', [Validators.required, Validators.pattern(regex.numeric)]],
      gst: ['', [Validators.required, Validators.pattern(regex.numeric)]],
      center: ['', Validators.nullValidator],
      status: [true, Validators.nullValidator],
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
          spname: "usp_unfyd_client_products",
          parameters: {
            flag: "GETBYID",
            Id: this.ProductId
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if(res.code == 200){
          const myObjLower = this.common.ConvertKeysToLowerCase();
          this.form.get('code').disable();
          this.form.patchValue(myObjLower(res.results.data[0]));
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/product/add'])
    }
    this.common.hubControlEvent('Product','click','pageloadend','pageloadend','','ngOnInit');


  }


  setLabelByLanguage(data) {
    this.common.hubControlEvent('product','click','label','label','','setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'Product', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('product','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
        this.common.setUserConfig(this.userDetails.ProfileType, 'product');
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
    this.common.hubControlEvent('product','click','back','back','','back');

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
      this.common.snackbar("General Error");
      return;
    }
    
    if (this.ProductId == null) {
     
      if(this.form.controls.maxqty.value < this.form.controls.minqty.value){
        this.loader = false;
        this.common.snackbar("Max qty can't be less than min qty.", "error");
        return;
      }

      this.requestObj = {
        data: {
          spname: "usp_unfyd_client_products",
          parameters: {
            flag: 'INSERT',
            CREATEDBY: this.userDetails.EmployeeId,
            USERID: this.userDetails.EmployeeId,
            PRODUCTID: 1,          
            ...this.form.value,
          }
        }
      }
    } else {

      if(this.form.controls.maxqty.value < this.form.controls.minqty.value){
        this.loader = false;
        this.common.snackbar("Max qty can't be less than min qty.", "error");
        return;
      }

      this.requestObj = {
        data: {
          spname: "usp_unfyd_client_products",
          parameters: {
            flag: "UPDATE",
            ID: this.ProductId,
            MODIFIEDBY: this.userDetails.EmployeeId,
            ...this.form.value,
          }
        }
      }
      
    }
    this.common.hubControlEvent('product','click','submit','submit',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        const myObjLower = this.common.ConvertKeysToLowerCase();
        res = myObjLower(res.results.data[0]);
        if(res.dbcode == 409){
          this.alreadyExistDialog('alreadyexist',res.id);
        }
        else{
          this.router.navigate(['masters/product']);
          this.common.snackbar(res.result, "success");
        }
      } else {
        this.loader = false;
      }
    },
    (error) => {
      this.loader = false;
      this.common.snackbar(error.message, "error");
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
    this.common.hubControlEvent('product','click','GET','GET',JSON.stringify(Obj),'getCenterMaster');

    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        this.ddcenterdata = res.results.data;
      
      }
    })
  }

  

  alreadyExistDialog(type :any,id :any){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
          type: type,
          title: 'Already Exist',
          subTitle: 'Do you want to activate this data?',
      },
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(status => {
      if (status == true && type == 'alreadyexist') {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_client_products",
            parameters: {
              flag: "ENABLE",
              Id: id
            }
          }
        }
        this.common.hubControlEvent('product','click','','',JSON.stringify(this.requestObj),'alreadyExistDialog');

        this.api.post('index', this.requestObj).subscribe((res) => {
          if (res.code == 200) {
              this.common.snackbar(res.results.data[0].result, "success");
              this.router.navigate(['masters/product']);
          }
        });

      }
    });
  }

}

