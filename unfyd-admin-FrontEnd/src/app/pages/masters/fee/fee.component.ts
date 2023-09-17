import { Component,ElementRef ,OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { regex,masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'


@Component({
    selector: 'app-fee',
    templateUrl: './fee.component.html',
    styleUrls: ['./fee.component.scss'],
})
export class FeeComponent implements OnInit {
    loader: boolean = false;
    submittedForm = false;
    masters : any;
    form: FormGroup;
    requestObj: { data: { spname: string; parameters: any } };
    skillId: any;
    userDetails: any;
    ddgst:any;
    labelName: any;
    editobj : any;
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
    ) {

        Object.assign(this, { masters });
    }

    ngOnInit(): void {
        this.common.hubControlEvent('fee','click','pageload','pageload','','ngOnInit');

        this.getSnapShot();
        this.userDetails = this.auth.getUser(); 
        this.common.getGST(this.userDetails.Processid, 1).subscribe(res => {
            this.ddgst = res
          });
        this.form = this.formBuilder.group({
            FeeType: ['', Validators.required],
            FeeAmount: ['', [Validators.required, Validators.pattern(regex.numeric)]],
            GST: ['', [Validators.required]],
            PUBLICIP: [this.userDetails.ip, Validators.nullValidator],

            BROWSERNAME: [this.userDetails.browser, Validators.nullValidator],
            BROWSERVERSION: [this.userDetails.browser_version, Validators.nullValidator],
            processid:  [1, Validators.nullValidator],
            productid:  [1, Validators.nullValidator],
        });


      
        this.skillId = this.activatedRoute.snapshot.paramMap.get('id');

        if (this.skillId !== null) {                                     //when ngoninit is loaded ,  skillid is not present then data is fetched 
            var Obj = {
                data: {
                    spname: 'usp_unfyd_haw_fee',
                    parameters: {
                        flag: 'EDIT',
                        processid: 1,
                        productid: 1,
                        Id:this.skillId 
                    },
                },
            };
            this.api.post('index', Obj).subscribe(res => {
                this.loader = false;
                this.reset = true;
                if (res.code == 200) {
                    this.editobj = res.results.data[0];
                    this.form.patchValue(res.results.data[0]);
                    this.form.get('FeeAmount').patchValue(Number(res.results.data[0].FeeAmount));
                    this.form.get('GST').patchValue(res.results.data[0].HSNCode)
                    this.form.updateValueAndValidity();
                }
            });
        } else {                                                                  //when user click add btn 
            this.loader = false;
            this.router.navigate(['/masters/fee/add']);     
        }
        this.common.hubControlEvent('fee','click','pageloadend','pageloadend','','ngOnInit');

    }

    config: any;
    setLabelByLanguage(data) {
        this.common.hubControlEvent('fee','click','','',JSON.stringify(data),'setLabelByLanguage');

        this.common.setLabelConfig(this.userDetails.Processid, 'Fee', data)
        this.common.getLabelConfig$.subscribe(data => {
          this.labelName = data;
        });
      }
    getSnapShot() {
    this.common.hubControlEvent('fee','click','','','','getSnapShot');
  
      this.userDetails = this.auth.getUser();
      this.activatedRoute.url.subscribe(url => {
          this.common.setUserConfig(this.userDetails.ProfileType, 'fee');
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
        this.common.hubControlEvent('fee','click','back','back','','back');

        this.location.back()
      }
    submit(): void {                                                              //submit form
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

        if (this.skillId == null) {                                               //on the basis of skillid from params it gets inerted or updated  
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_haw_fee',
                    parameters: {
                        flag: 'INSERT',
                        createdby : this.userDetails.Id,
                        ...this.form.value,
                    },
                },
            };
        } else {
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_haw_fee',
                    parameters: {
                        flag: 'UPDATE',
                        ID: this.skillId,
                        MODIFIEDBY: this.userDetails.Id,
                        ...this.form.value,
                    },
                },
            };
        }
        this.common.hubControlEvent('fee','click','back','back',JSON.stringify(this.requestObj),'submit');

        this.api.post('index', this.requestObj).subscribe(                         //every  api response in fee component                
            (res: any) => {
                if (res.code == 200) {
                    this.loader = false;
                    this.router.navigate(['masters/fee']);
                    this.common.snackbar("Success");
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
