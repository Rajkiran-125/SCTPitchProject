import { Component, ElementRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex , masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'
@Component({
    selector: 'app-vendorrefund',
    templateUrl: './vendorrefund.component.html',
    styleUrls: ['./vendorrefund.component.scss'],
})
export class VendorrefundComponent implements OnInit {
    loader: boolean = false;
    VendorrefundId: any;
    userDetails: any;
    regex: any;
    hawkerSteps: string[] = [];
    form: FormGroup;
    submittedForm = false;
    requestObj: any;
    newDate = new Date();
    masters:any;
    labelName: any;
    reset: boolean = false;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private auth: AuthService,
        public datepipe: DatePipe,
        private common: CommonService,
        private api: ApiService,
        private location: Location,
        private el: ElementRef,
    ) {
        Object.assign(this, { regex,masters});
    }

    ngOnInit(): void {
        this.common.hubControlEvent('VendorRefund','click','pageload','pageload','','ngOnInit');

   this.getSnapShot();
        this.userDetails = this.auth.getUser();
        this.loader = true;       
        this.form = this.formBuilder.group({
          VendorCode: ['', Validators.required],
          VendorName: ['', [Validators.required , Validators.pattern(regex.char),Validators.maxLength(100)]],
          ProductType: ['', Validators.required],
          ProductCode: ['', Validators.required],
          ProductName: ['', [Validators.pattern(regex.char),,Validators.maxLength(100)]],
          VendorOrderNumber: ['', Validators.nullValidator],
            VendorReturnQty: ['', [Validators.nullValidator,Validators.pattern(regex.numeric)]],
            VendorRefundAmount: ['',[ Validators.nullValidator,Validators.pattern(regex.numeric)]],
            VendorRefundStatus: [''],
            VendorRefundDateTime: [''],
        });

        this.VendorrefundId = this.activatedRoute.snapshot.paramMap.get('id');
        if (this.VendorrefundId !== null) {
            var Obj = {
                data: {
                    spname: 'usp_unfyd_vendorrefund',
                    parameters: {
                        flag: 'EDIT',
                        processid: this.userDetails.Processid,
                        productid: 1,
                        Id: this.VendorrefundId,
                    },
                },
            };
            this.api.post('index', Obj).subscribe((res: any) => {
                this.loader = false;
                this.reset = true;
                if (res.code == 200) {    
                  res.results.data[0].VendorRefundAmount=parseInt(res.results.data[0].VendorRefundAmount)                                      
                    this.form.patchValue(res.results.data[0]);                  
                    this.form.updateValueAndValidity();
                }
            });
        } else {
            this.loader = false;
            this.router.navigate(['/masters/VendorRefund/add']);
        }
        this.common.hubControlEvent('VendorRefund','click','pageloadend','pageloadend','','ngOnInit');

    }
    setLabelByLanguage(data) {
        this.common.hubControlEvent('VendorRefund','click','','',JSON.stringify(data),'setLabelByLanguage');

        this.common.setLabelConfig(this.userDetails.Processid, 'vendorrefund', data)
        this.common.getLabelConfig$.subscribe(data => {
          this.labelName = data;
        });
      }

    config: any;
    getSnapShot() {
        this.common.hubControlEvent('VendorRefund','click','','','','getSnapShot');

      this.userDetails = this.auth.getUser();
      this.activatedRoute.url.subscribe((url) => {
        let path  = this.activatedRoute.snapshot.data.title
          this.common.setUserConfig(this.userDetails.ProfileType, path);
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
        this.common.hubControlEvent('VendorRefund','click','back','back','','back');

        this.location.back()
      }
    submit(): void {
        this.loader = true;
        this.submittedForm = true;
        this.form.value.VendorRefundDateTime=this.datepipe.transform(this.form.value.VendorRefundDateTime, regex.dateFormat)
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

        if (this.VendorrefundId == null) {
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_vendorrefund',
                    parameters: {
                        flag: 'INSERT',
                        CREATEDBY: this.userDetails.EmployeeId,
                        ProcessId: this.userDetails.Processid,
                        ProductId: 1,
                        publicip: this.userDetails.ip,
                        privateip: '',
                        browsername: this.userDetails.browser,
                        browserversion: this.userDetails.browser_version,
                        ...this.form.value,
                    },
                },
            };
        } else {
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_vendorrefund',
                    parameters: {
                        flag: 'UPDATE',
                        ID: this.VendorrefundId,
                        MODIFIEDBY: this.userDetails.EmployeeId,
                        ...this.form.value,
                    },
                },
            };
        }

        this.common.hubControlEvent('VendorRefund','click','','',JSON.stringify(this.requestObj),'submit');

        this.api.post('index', this.requestObj).subscribe(
            (res: any) => {
                if (res.code == 200) {
                    this.loader = false;
                    this.router.navigate(['masters/VendorRefund']);
                    this.common.snackbar(res.results.data[0].result, "success");
                } else {
                    this.loader = false;
                }
            },
            (error) => {
                this.loader = false;
                this.common.snackbar(error.message, "error");
            }
        );
    }
}
