import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, hawkerFormSteps, regex, formatDate } from 'src/app/global/json-data';
import { Location } from '@angular/common'
@Component({
  selector: 'app-training-details',
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.scss']
})
export class TrainingDetailsComponent implements OnInit {
  loader: boolean = false;
  editObj: any;
  commonObj: any;
  userDetails: any;
  path: any;
  masters: any;
  hawkerFormSteps: string[] = [];
  form: FormGroup;
  submittedForm: boolean = false;
  requestObj: any;
  productslist: any = [];
  tabkey: any = [];
  minDate = new Date();
  maxDate = new Date();
  userConfig: any;
  masterConfig: any;
  labelName: any;
  reset: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private el: ElementRef,
    private api: ApiService,
    private location: Location
  ) {
    Object.assign(this, { masters, hawkerFormSteps, regex });
  }

  ngOnInit(): void {
    this.getSnapShot();
    this.getBusinessUnit();
    this.form = this.formBuilder.group({
      traininginitiationdatetime: ['', Validators.required],
      trainingcompletionstatus: ['', Validators.required],
      trainingcompletiondatetime: ['', Validators.required],
      trainingbatchid: ['', Validators.nullValidator],
      trainingbeneficiaryname: ['', Validators.nullValidator],
      trainingcentername: ['', Validators.nullValidator],
      trainername: ['', Validators.nullValidator],
      trainingcoursename: ['', Validators.nullValidator],
      trainingcertificateissued: ['', Validators.nullValidator],
      trainingcertificatenumber: ['', Validators.nullValidator],
      trainingattendancestatus: ['', Validators.nullValidator],
      istrainingcertificatephoto: ['', Validators.nullValidator],
      businessunit: ['', Validators.nullValidator],
    });
  }

  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'HawkerTranningDetails', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
    this.common.setHawkerId(this.path)
  }
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.common.setUserConfig(this.userDetails.ProfileType, 'beneficiary');
    this.common.getUserConfig$.subscribe(data => {
      this.userConfig = data
    });

    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.masterConfig = {
        completionStatus: JSON.parse(data.CompletionStatus),
      }
    });

    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))

    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_training",
          parameters: {
            flag: 'EDIT',
            hawkerid: this.path
          }
        }
      }

      this.api.post('index', this.requestObj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.loader = false;
          this.editObj = res.results.data[0];
          if (this.editObj) {
            const lowerObj = this.common.ConvertKeysToLowerCase();
            this.form.patchValue(lowerObj(this.editObj));
            this.minDate = new Date(this.formatDate(this.editObj.TrainingInitiationDateTime));
            this.initiationDateChange(this.formatDate(this.editObj.TrainingInitiationDateTime))
            this.statusCheck(this.editObj.TrainingCompletionStatus)
            this.form.get('traininginitiationdatetime').setValue(this.formatDate(this.editObj.TrainingInitiationDateTime))
            this.form.get('trainingcompletiondatetime').setValue(this.formatDate(this.editObj.TrainingCompletionDateTime))
            this.form.updateValueAndValidity();
          }
        } else {
          this.loader = false;
        }
      },
        (error) => {
          this.loader = false;
          this.common.snackbar("General Error");
        })
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  submit(btnType): void {
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
      this.form.markAllAsTouched()
      this.common.snackbar("General Error");
      return;
    }
    if (this.editObj !== undefined) {
      this.commonObj = {
        flag: 'UPDATE',
        modifiedby: this.userDetails.Id,
        hawkerid: this.editObj.HawkerID
      }
    } else {
      this.commonObj = {
        flag: 'INSERT',
        hawkerid: this.path,
        processid: this.userDetails.Processid,
        productid: 1,
        createdby: this.userDetails.Id,
        publicip: this.userDetails.ip,
        privateip: '',
        browsername: this.userDetails.browser,
        browserversion: this.userDetails.browser_version,
      }
      if(this.form.get('businessunit').value !== '' && this.form.get('trainingcompletionstatus').value == 'Initiated'){
        this.saveEmployeeData(this.form.get('businessunit').value);
      }
    }

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_haw_training",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.Id,
          ...this.form.value,
          ...this.commonObj
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        if (btnType == 'next') {
          this.router.navigate(['masters/beneficiary/documents', this.commonObj.hawkerid]);
        } else if (btnType == 'save') {
          this.router.navigate(['masters/beneficiary/training-details', this.commonObj.hawkerid]);
        }
        this.common.snackbar("Success");
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }
  maxDateOne = new Date();
  onDateChange() {
    this.maxDateOne.setFullYear(this.maxDateOne.getFullYear() - this.form.value.traininginitiationdatetime);
  }

  statusCheck(event) {
    if (event !== 'Completed' && event !== 'Not Completed') {
      this.form.controls['trainingcompletiondatetime'].setValidators(Validators.nullValidator);
      this.fromDatePicker = true;
    } else {
      this.form.controls['trainingcompletiondatetime'].setValidators(Validators.required);
      this.fromDatePicker = false;
    }
    this.form.controls['trainingcompletiondatetime'].setValue('');
    this.form.updateValueAndValidity();
  }
  statusValueCheck(event) {
    if (this.form.get('trainingcompletionstatus').value !== 'Completed' && this.form.get('trainingcompletionstatus').value !== 'Not Completed') {
      this.form.controls['trainingcompletionstatus'].setValue('');
    }
  }

  fromDatePicker: boolean = true;
  fromDate = new Date();
  initiationDateChange(event) {
    this.fromDate = event;
    this.fromDatePicker = false;
  }

  back(): void {
    this.location.back()
  }

  businessUnit: any = []
  getBusinessUnit(){
    this.api.get1('jsonSer?Action=GetBusinessUnits').subscribe(res => {
      this.businessUnit = res['Data']['BusinessUnits'];
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }

  saveEmployeeData(BusinessUnitID){
    var personalDetails = {
      data: {
        spname: "usp_unfyd_haw_personal",
        parameters: {
          flag: 'EDIT',
          hawkerid: this.path
        }
      }
    }

    this.api.post('index', personalDetails).subscribe(res => {
      if (res.code == 200) {
        var hawkerPersonal = res.results.data[0];
        var contactDetails = {
          data: {
            spname: "usp_unfyd_haw_contact",
            parameters: {
              flag: 'EDIT',
              hawkerid: this.path
            }
          }
        }
        this.api.post('index', contactDetails).subscribe(res => {
          if (res.code == 200) {
            var hawkerEmail = res.results.data[0]['EmailId'];
            var obj = {
              "FirstName": hawkerPersonal.FirstName,
              "LastName": hawkerPersonal.LastName,
              "MiddleName": hawkerPersonal.MiddleName,
              "BusinessUnitID": BusinessUnitID,
              "DesignationID": "9",
              "DateofJoining": new Date(),
              "CostPerAnnum(Rs)": "1000000",
              "HourlyCost(Rs)": "",
              "EffectiveDate": new Date(),
              "Billable%": "",
              "UserID": hawkerEmail,
              "Billable%EffectiveDate": "",
              "IsLoginRequired":"True",
              "EmpID": hawkerPersonal.HawkerID
            }
            this.api.post1('jsonSer?Action=SaveEmployeeData', obj).subscribe(res => {
            },
              (error) => {
                this.loader = false;
                this.common.snackbar("General Error");
              })
          } else {
            this.loader = false;
          }
        },
          (error) => {
            this.loader = false;
            this.common.snackbar("General Error");
          })        
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })        
  }
}
