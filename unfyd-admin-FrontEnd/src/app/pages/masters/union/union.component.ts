import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { masters, regex } from 'src/app/global/json-data';

@Component({
    selector: 'app-union',
    templateUrl: './union.component.html',
    styleUrls: ['./union.component.scss'],
})
export class UnionComponent implements OnInit {
    loader: boolean = false;
    submittedForm = false;

    form: FormGroup;
    requestObj: { data: { spname: string; parameters: any } };
    skillId: any;
    userDetails: any;
    masters: any = masters;
    countrylist: Object;
    states: any = [];
    district: any = [];
    zipcodes: any = [];
    filteredstates = this.states.slice();
    filtereddistrict = this.district.slice();
    filtereddzipcodes = this.zipcodes.slice();
    editObj: any;
    labelName: any;
    reset : boolean = false;
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
        this.common.hubControlEvent('Union','click','pageload','pageload','','ngOnInit');

        this.getSnapShot();
        this.userDetails = this.auth.getUser(); //get user data stored in local storage
        this.getCountries('', 'Country');       
        //  this.loader=true
        let reg = regex.email
        this.form = this.formBuilder.group({

            UnionName: ['', [Validators.required, Validators.maxLength(100)]],
            UnionEmail: ['', [Validators.required, Validators.pattern(reg)]],
            UnionContactNo: ['', [Validators.required, Validators.pattern(regex.mobile)]],
            UnionAltContactNo: ['', [Validators.required, Validators.pattern(regex.mobile)]],
            UnionRegNo: ['', Validators.required],
            AddressLine1: ['', Validators.required],
            AddressLine2: ['', Validators.required],
            District: ['', Validators.required],
            State: ['', Validators.required],
            Country: ['', Validators.required],
            PIN: ['', Validators.required],


            publicip: [this.userDetails.ip, Validators.nullValidator],
            browsername: [this.userDetails.browser, Validators.nullValidator],
            browserversion: [this.userDetails.browser_version, Validators.nullValidator],
            processid: [1, Validators.nullValidator],
            productid: [1, Validators.nullValidator],
        });

        this.skillId = this.activatedRoute.snapshot.paramMap.get('id');
       
        if (this.skillId !== null) {
            var Obj = {
                data: {
                    spname: 'usp_unfyd_union',
                    parameters: {
                        flag: 'EDIT',
                        processid: 1,
                        productid: 1,
                        Id: this.skillId
                    },
                },
            };
            this.api.post('index', Obj).subscribe((res: any) => {
                this.loader = false;
                this.reset = true;
                if (res.code == 200) {
                    this.editObj = res.results.data[0];
                    this.form.patchValue(this.editObj);
                    this.form.controls['Country'].setValue(Number(this.editObj.Country));
                    this.getStates(Number(this.editObj.Country));
                    this.form.controls['State'].setValue(Number(this.editObj.State));
                    this.getDistrict(Number(this.editObj.State));
                    this.form.controls['District'].setValue(Number(this.editObj.District));
                    this.getZipcodes(Number(this.editObj.District));
                    this.form.controls['PIN'].setValue(this.editObj.PIN);
                    this.form.updateValueAndValidity();
                }
            });
        } else {
            this.loader = false;
            this.router.navigate(['/masters/Union/add']);
        }
        this.common.hubControlEvent('Union','click','pageloadend','pageloadend','','ngOnInit');

    }
    setLabelByLanguage(data) {
        this.common.setLabelConfig(this.userDetails.Processid, 'Union', data)
        this.common.getLabelConfig$.subscribe(data => {
          this.labelName = data;
        });
      }
    config: any;
    getSnapShot() {
        this.common.hubControlEvent('Union','click','pageloadend','pageloadend','','getSnapShot');

        this.userDetails = this.auth.getUser();
        this.activatedRoute.url.subscribe((url) => {
            let path = this.activatedRoute.snapshot.data.title
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

    get f() {
        return this.form.controls;
    }

    back(): void {
        this.common.hubControlEvent('Union','click','back','back','','back');

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
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_union',
                    parameters: {
                        flag: 'INSERT',
                        ...this.form.value,
                    },
                },
            };          
        } else {
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_union',
                    parameters: {
                        flag: 'UPDATE',
                        ID: this.skillId,

                        ...this.form.value,
                    },
                },
            };
        }
        this.common.hubControlEvent('Union','click','','',JSON.stringify(this.requestObj),'submit');

        this.api.post('index', this.requestObj).subscribe(
            (res: any) => {
                if (res.code == 200) {
                    this.loader = false;
                    this.router.navigate(['masters/Union']);
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
    getCountries(event, type) {
        this.common.hubControlEvent('Union','click','','',JSON.stringify(event, type),'getCountries');

        this.countrylist = [];
        this.common.getLocation(event, type).subscribe(res => {
            this.countrylist = res;
        })
    }

    getStates(event) {
        this.common.hubControlEvent('Union','click','','',JSON.stringify(event),'getStates');

        this.common.getLocation(event, 'State').subscribe(res => {
            this.states = res;
            this.filteredstates = res;
        });
    }

    getDistrict(event) {
        this.common.hubControlEvent('Union','click','','',JSON.stringify(event),'getDistrict');

        this.common.getLocation(event, 'District').subscribe(res => {
            this.district = res;
            this.filtereddistrict = res;
        })
    }


    getZipcodes(event) {
        this.common.hubControlEvent('Union','click','','',JSON.stringify(event),'getZipcodes');

        this.common.getLocation(event, 'Pincode').subscribe(res => {
            this.zipcodes = res;
            this.filtereddzipcodes = res;
        })
    }
}
