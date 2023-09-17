import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { Location } from '@angular/common'
import { DatePipe } from '@angular/common';
import { masters, regex } from 'src/app/global/json-data';


@Component({
    selector: 'app-training-center',
    templateUrl: './training-center.component.html',
    styleUrls: ['./training-center.component.scss'],
})
export class TrainingCenterComponent implements OnInit {
    loader: boolean = false;
    submittedForm = false;
    masters: any = masters
    form: FormGroup;
    requestObj: { data: { spname: string; parameters: any } };
    skillId: any;
    userDetails: any;
    editObj: any;
    states: any = [];
    district: any = [];
    countrylist: Object;
    zipcodes: any = [];
    filteredstates = this.states.slice();
    filtereddistrict = this.district.slice();
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
        private datepipe: DatePipe,
        private location: Location,
        private el: ElementRef,
    ) { }

    ngOnInit(): void {
        this.common.hubControlEvent('TrainingCenter','click','pageload','pageload','','ngOnInit');

        this.getSnapShot();
        this.getCountries('', 'Country');
        this.userDetails = this.auth.getUser(); //get user data stored in local storage
        //  this.loader=true
        const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

        this.form = this.formBuilder.group({
            CenterName: ["", [Validators.nullValidator, Validators.maxLength(100)]],
            TrainerName: ['', Validators.required],
            CourseName: ['', Validators.required],
            Address: ['', Validators.required],
            StreetName: ['', Validators.required],
            Area: ['', Validators.required],
            District: ['', Validators.required],
            State: ['', Validators.required],
            Pincode: ['', Validators.required],
            Country: ['', Validators.required],
            GoogleMapLink: ['', [Validators.required, Validators.pattern(reg)]],
            AvailabilityStatus: ['true', Validators.required],
            Booking: ['', Validators.required],
            RoomName: ['', [Validators.required, Validators.maxLength(100)]],
            RoomType: ['', Validators.required],
            RoomCapacity: ['', Validators.required],
            OwnerName: ['', Validators.required],
            AgreementCopy: ['', Validators.required],
            MonthlyRent: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
            SecurityDeposit: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
            LeaseStartDate: ['', Validators.required],
            LeaseEndDate: ['', Validators.required],
            Facilities: ['', Validators.required],
            ProcessId: [this.userDetails.Processid],
            ProductId: [1],
            CreatedBy: [1],
            ModifiedBy: [1],
            IsDeleted: [1],
            DeletedBy: [1],
            PublicIp: [this.userDetails.ip],
            PrivateIp: [''],
            BrowserName: [this.userDetails.browser],
            BrowserVersion: [this.userDetails.browser_version],
            // Id: [1],
        });

        this.skillId = this.activatedRoute.snapshot.paramMap.get('id');       

        if (this.skillId !== null) {
            //when ngoninit is loaded ,  skillid is not present then data is fetched

            var Obj = {
                data: {
                    spname: 'usp_unfyd_training_center',
                    parameters: {
                        flag: 'EDIT',
                        processid: this.userDetails.Processid,
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
            //when user click add btn
            this.loader = false;
            this.router.navigate(['/masters/trainingCenter/add']);
        }
        this.common.hubControlEvent('TrainingCenter','click','pageloadend','pageloadend','','ngOnInit');

    }
    getCountries(event, type) {
        this.common.hubControlEvent('TrainingCenter','click','','',JSON.stringify(event, type),'getCountries');

        this.countrylist = [];
        this.common.getLocation(event, type).subscribe(res => {
            this.countrylist = res;
        })
    }
    getStates(event) {
        this.common.hubControlEvent('TrainingCenter','click','','',JSON.stringify(event),'getStates');

        this.common.getLocation(event, 'State').subscribe(res => {
            this.states = res;
            this.filteredstates = res;
        });
    }

    getDistrict(event) {
        this.common.hubControlEvent('TrainingCenter','click','','',JSON.stringify(event),'getDistrict');

        this.common.getLocation(event, 'District').subscribe(res => {
            this.district = res;
            this.filtereddistrict = res;
        })
    }


    getZipcodes(event) {
        this.common.hubControlEvent('TrainingCenter','click','','',JSON.stringify(event),'getZipcodes');

        this.common.getLocation(event, 'Pincode').subscribe(res => {
            this.zipcodes = res;
            this.filtereddzipcodes = res;
        })
    }
    setLabelByLanguage(data) {
        this.common.hubControlEvent('TrainingCenter','click','','',JSON.stringify(data),'setLabelByLanguage');

        this.common.setLabelConfig(this.userDetails.Processid, 'TrainingCenter', data)
        this.common.getLabelConfig$.subscribe(data => {
          this.labelName = data;
        });
    }
    config: any;
    getSnapShot() {
        this.common.hubControlEvent('TrainingCenter','click','','','','getSnapShot');

        this.userDetails = this.auth.getUser();
        this.activatedRoute.url.subscribe((url) => {
            let path = this.activatedRoute.snapshot.data.title
            this.common.setUserConfig(this.userDetails.ProfileType, 'TrainingCenter');
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
        this.common.hubControlEvent('TrainingCenter','click','back','back','','back');

        this.location.back()
    }
    submit(): void {

        this.form.value.Booking = this.datepipe.transform(this.form.value.Booking, regex.dateFormat)
        this.form.value.LeaseStartDate = this.datepipe.transform(this.form.value.LeaseStartDate, regex.dateFormat)
        this.form.value.LeaseEndDate = this.datepipe.transform(this.form.value.LeaseEndDate, regex.dateFormat)
        //submit form
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
            //on the basis of skillid from params it gets inerted or updated
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_training_center',
                    parameters: {
                        flag: 'INSERT',
                        ...this.form.value,
                    },
                },
            };          
        } else {
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_training_center',
                    parameters: {
                        flag: 'UPDATE',
                        ID: this.skillId,

                        ...this.form.value,
                    },
                },
            };
        }     
        this.common.hubControlEvent('TrainingCenter','click','','',JSON.stringify(this.requestObj),'submit');

        this.api.post('index', this.requestObj).subscribe(
            //every  api response in fee component
            (res: any) => {
                if (res.code == 200) {
                    this.loader = false;
                    this.router.navigate(['masters/trainingCenter']);
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






