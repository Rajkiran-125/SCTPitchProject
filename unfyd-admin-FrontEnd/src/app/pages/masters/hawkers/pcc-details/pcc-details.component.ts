import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, hawkerFormSteps, regex,checkDates1 } from 'src/app/global/json-data';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, Location } from '@angular/common'

@Component({
  selector: 'app-pcc-details',
  templateUrl: './pcc-details.component.html',
  styleUrls: ['./pcc-details.component.scss']
})
export class PccDetailsComponent implements OnInit {

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
  policeStationlist: any = [];
  maxDate = new Date(); 
  userConfig: any;
  category: any;
  masterConfig: any;
  ispoliceclearcert: boolean;
  viewPcc : boolean = false;
  pccDocument: any = '';
  labelName:any;
  reset: boolean = false
  minDate = new Date();
  fromDate = new Date();
  toDate = new Date();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private el: ElementRef,
    private api: ApiService,
    public dialog: MatDialog,
    private location: Location,
    public datepipe: DatePipe
  ) {
    Object.assign(this, { masters, hawkerFormSteps, regex });
  }

  ngOnInit(): void {
    this.getSnapShot();
    this.getPoliceStation();
    this.form = this.formBuilder.group({
      pccinitiaitondate: ['', Validators.required],
      pccapprefno: ['', Validators.required],
      policestationname: ['', Validators.nullValidator],
      policeverificationstatus: ['', Validators.required],
      policeclearcertstatus: [false, Validators.nullValidator],
      pccvalidfromdate: ['', Validators.required],
      pccvalidtodate: ['', Validators.nullValidator],
    },
    );
  }
  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'HawkerPCCDetails', data)
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
      if (!this.userConfig.PCC) {
        // this.router.navigate(['masters/beneficiary/medical-details', this.path]);
      }
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.masterConfig = {
        policeClearanceStatus: JSON.parse(data.PoliceClearanceStatus),
      }
    });

    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_pcc",
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
            this.minDate = new Date(this.formatDate(this.editObj.PCCInitiaitonDate));
            this.initiationDateChange(this.formatDate(this.editObj.PCCInitiaitonDate))
            this.fromDateChange(this.formatDate(this.editObj.PCCValidFromDate))
            this.statusCheck(this.editObj.PoliceVerificationStatus)
            this.form.get('pccinitiaitondate').setValue(this.formatDate(this.editObj.PCCInitiaitonDate))
            this.form.get('pccvalidfromdate').setValue(this.formatDate(this.editObj.PCCValidFromDate))
            this.form.get('pccvalidtodate').setValue(this.formatDate(this.editObj.PCCValidToDate))
            if (this.editObj.PoliceClearCertStatus) { this.ispoliceclearcert = true }
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

    this.viewDocument('Clearance Certificate', '')
    this.common.getSingleImage$.subscribe(res => {
      if (res?.Category == 'Clearance Certificate') {
        this.pccDocument = res;
      }
    })
    this.common.getIndividualUpload$.subscribe(res => {
      if (res.category == 'Clearance Certificate') {
        this.form.get('policeclearcertstatus').setValue(res.status == false ? false : true);
        this.pccDocument = res;
      }
      this.form.updateValueAndValidity();
    })

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
        usersubtype: '',
        modifiedby: this.userDetails.Id,
        hawkerid: this.editObj.HawkerID
      }
    } else {
      this.commonObj = {
        flag: 'INSERT',
        hawkerid: this.path,
        processid: this.userDetails.Processid,
        productid: 1,
        userid: this.userDetails.Id,
        usersubtype: '',
        createdby: this.userDetails.Id,
        publicip: this.userDetails.ip,
        privateip: '',
        browsername: this.userDetails.browser,
        browserversion: this.userDetails.browser_version,
      }
    }
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_haw_pcc",
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
          this.router.navigate(['masters/beneficiary/medical-details', this.commonObj.hawkerid]);
        } else if (btnType == 'save') {
          this.router.navigate(['masters/beneficiary/pcc-details', this.commonObj.hawkerid]);
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
  uploadDocument(event, imgData, category) {
    var data = {
      flag: imgData !== '' ? 'UPDATE' : 'INSERT',
      documentId : imgData !== '' ? imgData.Actionable : '',
      category: category,
      createdby: imgData !== '' ? imgData['Created By'] : this.userDetails.Id,
      modifiedby: imgData !== '' ? this.userDetails.Id : null,
      hawkerid: this.path,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUpload(data)
    }
  }
  getPoliceStation() {
    let reqObj = {
      data: {
        spname: "usp_unfyd_haw_contact",
        parameters: {
          flag: 'EDIT',
          hawkerid: this.path
        }
      }
    }

    this.api.post('index', reqObj).subscribe(res => {
      let requestObj = {
        data: {
          spname: 'usp_unfyd_police_stn',
          parameters: {
            flag: 'GET_POLICESTN_BY_DISTRICT',
            processid: this.userDetails.Processid,
            productid: 1,
            district: res?.results?.data[0]?.PresentAddressDistrict
          }
        }
      };

      this.api.post('index', requestObj).subscribe(res => {
        if (res.code == 200) {
          this.loader = false;
          let Policelist = res.results.data;
          Policelist.forEach(element => {
            this.policeStationlist.push({ policeStationName: element['Police Station Name'], id: element['Actionable'] })
          });
        }
      });
    })
  }

  viewDocument(val, type) {
    var data = {
      type: type,
      processid: this.userDetails.Processid,
      category: val,
      contactid: this.path,
    }
    this.common.setSingleImage(data);
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

  statusCheck(event) {
    if (event !== 'Completed' ) {
      this.form.controls['pccvalidfromdate'].setValidators(Validators.nullValidator);
      this.form.controls['pccvalidtodate'].setValidators(Validators.nullValidator);
      this.fromDatePicker = true;
      this.toDatePicker = true;
    } 
    else {
      this.form.controls['pccvalidfromdate'].setValidators(Validators.required);
      this.form.controls['pccvalidtodate'].setValidators(Validators.required);
      this.fromDatePicker = false;
      this.toDatePicker = false;
    }
    this.form.controls['pccvalidfromdate'].setValue('');
    this.form.controls['pccvalidtodate'].setValue('');
    this.form.updateValueAndValidity();
  }
  statusValueCheck(event) {
    if (this.form.get('policeverificationstatus').value !== 'Completed' ) {
      this.form.controls['policeverificationstatus'].setValue('');
    }
  }
  
  fromDatePicker: boolean = true;
  toDatePicker: boolean = true;

  initiationDateChange(event){
    this.fromDate = event;
    this.fromDatePicker = false;
  }
  fromDateChange(event) {
    this.toDate = event;
    this.toDatePicker = false;
  }
  back(): void {
    this.location.back()
  }
}





