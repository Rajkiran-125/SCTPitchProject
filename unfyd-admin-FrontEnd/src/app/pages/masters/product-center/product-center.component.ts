import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
// import { addSkillsObj, updateSkillsObj } from 'src/app/global/json-data';
import { masters, regex } from 'src/app/global/json-data';

@Component({
    selector: 'app-product-center',
    templateUrl: './product-center.component.html',
    styleUrls: ['./product-center.component.scss'],
})
export class ProductCenterComponent implements OnInit {
    loader: boolean = false;
    submittedForm = false;
    form: FormGroup;
    requestObj: { data: { spname: string; parameters: any } };
    skillId: any;
    userDetails: any;
    masters: any = masters;
    editObj: any = [];
    zipcodes:any=[];
    countrylist: Object;
    statess= [{ id: 0, name: 'One' }, { id: 1, name: 'Two' }];
    states : any = [];
    district: any = [];
     filteredstates = this.states.slice();
     filtereddistrict =  this.district.slice();
     filtereddzipcodes = this.zipcodes.slice(); 
    labelName: any;
    reset: boolean;
    constructor(
        private formBuilder: FormBuilder,
        private common: CommonService,
        private activatedRoute: ActivatedRoute,
        private api: ApiService,
        private router: Router,
        private auth: AuthService,
        private location: Location,
        private el: ElementRef,
    ) { }

    ngOnInit(): void {
        this.common.hubControlEvent('ProductCenter','click','pageload','pageload','','ngOnInit');

        this.getSnapShot();
        this.getCountries('', 'Country');
        this.userDetails = this.auth.getUser(); //get user data stored in local storage
       
        this.form = this.formBuilder.group({
            UserId: ['1'],
            ProductCenterCode: ['', Validators.required],
            ProductCode: ['', [Validators.required, Validators.maxLength(100)]],
            AddressLine1: ['', Validators.nullValidator],
            AddressLine2: ['', Validators.nullValidator],
            AddressLine3: ['', Validators.nullValidator],
            AddressLine4: ['', Validators.nullValidator],
            District: ['', Validators.required],
            State: ['', Validators.required],
            Country: ['', Validators.required],
            PinCode: ['', Validators.required],
            MappedProductCategory: ['', Validators.required],
            BankDetails: ['', Validators.required],
            GSTNumber: ['', [Validators.required, Validators.pattern(regex.gst)]],
            PANNumber: ['', [Validators.required, Validators.pattern(regex.pan)]],
            ContractStartDate: ['', Validators.required],
            ContractEndDate: ['', Validators.required],
            ProductSize: ['', Validators.nullValidator],
            ProductQtyAvailable: ['', [Validators.nullValidator, Validators.pattern(regex.numeric)]],
            ProductOrderedQty: ['', [Validators.nullValidator, Validators.pattern(regex.numeric)]],
            ProductMaxQtyThreshold: ['', [Validators.nullValidator, Validators.pattern(regex.numeric)]],
            ProductMinQtyThreshold: ['', [Validators.nullValidator, Validators.pattern(regex.numeric)]],
            HSNCODE: ['', [Validators.required,Validators.minLength(4),Validators.maxLength(8)]],

            publicip: [this.userDetails.ip, Validators.nullValidator],
            browsername: [this.userDetails.browser, Validators.nullValidator],
            browserversion: [this.userDetails.browser_version, Validators.nullValidator],
            processid: [this.userDetails.Processid, Validators.nullValidator],
            productid: [1, Validators.nullValidator],
        });

        this.skillId = this.activatedRoute.snapshot.paramMap.get('id');
     

        if (this.skillId !== null) {
            var Obj = {
                data: {
                    spname: 'usp_unfyd_product_center',
                    parameters: {
                        flag: 'EDIT',
                        processid: this.userDetails.Processid,
                        productid: 1,
                        Id: this.skillId,
                    },
                },
            };
            this.api.post('index', Obj).subscribe((res: any) => {
                this.loader = false;
                this.reset = true;
                if (res.code == 200) {
                    this.loader = false;
                    this.editObj = res.results.data[0];
                    this.editObj.Country =JSON.parse(this.editObj.Country);
                    this.editObj.State =JSON.parse(this.editObj.State);
                    this.editObj.District =JSON.parse(this.editObj.District);
                    this.editObj.PinCode =(this.editObj.PinCode);
                    this.getStates(JSON.parse(this.editObj.Country));
                    this.getDistrict(JSON.parse(this.editObj.State));
                    this.getZipcodes(JSON.parse(this.editObj.District));
                    this.form.patchValue(this.editObj);
                    this.form.updateValueAndValidity();
                }
            });
        } else {
            this.loader = false;
            this.router.navigate(['/masters/ProductCenter/add']);
        }
        this.common.hubControlEvent('ProductCenter','click','pageloadend','pageloadend','','ngOnInit');

    }

    setLabelByLanguage(data) {
        this.common.hubControlEvent('ProductCenter','click','pageloadend','pageloadend',JSON.stringify(data),'setLabelByLanguage');

        this.common.setLabelConfig(this.userDetails.Processid, 'ProductCenter', data)
        this.common.getLabelConfig$.subscribe(data => {
            this.labelName = data;
        });
    }
    config: any;
    getSnapShot() {
        this.common.hubControlEvent('ProductCenter','click','pageloadend','pageloadend','','getSnapShot');

        this.userDetails = this.auth.getUser();
        this.activatedRoute.url.subscribe((url) => {
            this.common.setUserConfig(this.userDetails.ProfileType, 'ProductCenter');
            this.common.getUserConfig$.subscribe(data => {
                this.config = data;
            });
        });
        this.common.getLanguageConfig$.subscribe(data => {
            this.setLabelByLanguage(data)
        });
        this.setLabelByLanguage(localStorage.getItem("lang"))
    }

    getCountries(event, type) {
        this.common.hubControlEvent('ProductCenter','click','','',event,'getCountries');

        this.countrylist = [];
        this.common.getLocation(event, type).subscribe(res => {
          this.countrylist = res;
        })
      }
      getStates(event) {
        this.common.hubControlEvent('ProductCenter','click','','',event,'getStates');

          this.common.getLocation(event, 'State').subscribe(res => {
             
              this.states = res;
              this.filteredstates = res;
          });
      }
      
      getDistrict(event) {
        this.common.hubControlEvent('ProductCenter','click','','',event,'getDistrict');

            this.common.getLocation(event, 'District').subscribe(res => {
              this.district = res;
             this.filtereddistrict = res;
            })
      }
      
      
      getZipcodes(event){
        this.common.hubControlEvent('ProductCenter','click','','',event,'getZipcodes');

          this.common.getLocation(event, 'Pincode').subscribe(res => {
            this.zipcodes = res;
            this.filtereddzipcodes = res;
          })
        }

    get f() {
        return this.form.controls;
    }

    back(): void {
        this.common.hubControlEvent('ProductCenter','click','','','','back');

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

        if (this.skillId == null) {
            if(this.form.controls.ProductMaxQtyThreshold.value < this.form.controls.ProductMinQtyThreshold.value){
                this.loader = false;
                this.common.snackbar("Max qty can't be less than min qty.", "error");
                return;
              }
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_product_center',
                    parameters: {
                        flag: 'INSERT',
                        ...this.form.value,
                    },
                },
            };         
        } else {
            if(this.form.controls.ProductMaxQtyThreshold.value < this.form.controls.ProductMinQtyThreshold.value){
                this.loader = false;
                this.common.snackbar("Max qty can't be less than min qty.", "error");
                return;
              }
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_product_center',
                    parameters: {
                        flag: 'UPDATE',
                        ID: this.skillId,
                        MODIFIEDBY: this.userDetails.EmployeeId,
                        ...this.form.value,
                    },
                },
            };
        }
        this.common.hubControlEvent('ProductCenter','click','','',JSON.stringify(this.requestObj),'submit');

        this.api.post('index', this.requestObj).subscribe(
            (res: any) => {
                if (res.code == 200) {
                    this.loader = false;
                    this.router.navigate(['masters/ProductCenter']);
                    this.common.snackbar("Saved Success");
                } else {
                    this.loader = false;
                }
            },
            (error) => {
                this.loader = false;
                this.common.snackbar("General Error");
            }
        );
    }
}
