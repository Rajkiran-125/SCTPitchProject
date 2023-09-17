import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { masters, hawkerFormSteps, regex,formatDate } from 'src/app/global/json-data';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common'

@Component({
  selector: 'app-medical-details',
  templateUrl: './medical-details.component.html',
  styleUrls: ['./medical-details.component.scss']
})
export class MedicalDetailsComponent implements OnInit {
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
  isMedicalTestReportUpload: boolean;
  viewMedical : boolean = false;
  category: any;
  medicalDocument: any = '';
  labelName: any;
  reset : boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private el: ElementRef,
    private common: CommonService,
    private api: ApiService,
    public dialog: MatDialog,
    private location: Location
  ) {
    Object.assign(this, { masters, hawkerFormSteps, regex });
  }
 
  ngOnInit(): void {
    this.getSnapShot();
    this.getHospitalList();
    this.form = this.formBuilder.group({
      medicaltestinitiationdate: ['', Validators.required],
      medicalteststatus: ['', Validators.required],
      medicaltestdate: ['', Validators.required],
      medicaltestreferencenumber: ['', Validators.nullValidator],
      medicaltestresultdate: ['', Validators.required],
      medicaltestreportuploadstatus: [false,Validators.nullValidator],
      hospital : ['', Validators.nullValidator],
      doctor : ['', Validators.nullValidator],
    });
  }
  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'HawkerMedicalDetails', data)
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
      if(!this.userConfig.Medical){
      }
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
    this.masterConfig = {
      medicalTestStatus : JSON.parse(data.MedicalTestStatus),
    }
    });

    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_medical",
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
            this.minDate = new Date(this.formatDate(this.editObj.MedicalTestInitiationDate));
            this.initiationDateChange(this.formatDate(this.editObj.MedicalTestInitiationDate))
            this.fromDateChange(this.formatDate(this.editObj.MedicalTestDate))
            this.statusCheck(this.editObj.MedicalTestStatus)
            this.form.get('medicaltestinitiationdate').setValue(this.formatDate(this.editObj.MedicalTestInitiationDate))
            this.form.get('medicaltestdate').setValue(this.formatDate(this.editObj.MedicalTestDate))
            this.form.get('medicaltestresultdate').setValue(this.formatDate(this.editObj.MedicalTestResultDate))
            setTimeout(() => {
              this.getDoctorName(this.editObj.HospitalName);
            }, 5)
            
            if (this.editObj.MedicalTestReportUploadStatus) { this.isMedicalTestReportUpload = true }

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

    this.viewDocument('Medical Clearance Report', '')
    this.common.getSingleImage$.subscribe(res => {
      if (res?.Category == 'Medical Clearance Report') {
        this.medicalDocument = res;
      }
    })
    this.common.getIndividualUpload$.subscribe(res => {
      if (res.category == 'Medical Clearance Report') {
        this.form.get('medicaltestreportuploadstatus').setValue(res.status == false ? false : true);
        this.medicalDocument = res;
      }
      this.form.updateValueAndValidity();
    })
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
        usersubtype: '',
        modifiedby: this.userDetails.Id,
        hawkerid: this.editObj.HawkerID
      }
    } else {
      this.commonObj = {
        roletype: 'hawker',
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
        "spname": "usp_unfyd_haw_medical",
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
          this.router.navigate(['masters/beneficiary/training-details', this.commonObj.hawkerid]);
        } else if (btnType == 'save') {
          this.router.navigate(['masters/beneficiary/medical-details', this.commonObj.hawkerid]);
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
hospitalList:any;
hospitalNameList :any = [];
doctorList : any =[];
getHospitalList(){
  let hospitalObj = {
    data: {
        spname: 'usp_unfyd_hospital_doc',
        parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
        },
    },
}
this.api.post('index', hospitalObj).subscribe(res => {
  if (res.code == 200) {
      this.hospitalList = res.results.data
   this.hospitalList.forEach(element => {
      this.hospitalNameList.push({hospitalName : element['Hospital Name'], Id : element['Actionable'] , doctorName : element['Doctor Name']})
    });
  }
})
}

getDoctorName(event){
  this.doctorList = this.hospitalNameList.filter(item => item.hospitalName == event)
}

viewDocument(val, type) {
  var data = {
    type: type,
    processid: this.userDetails.Processid,
    category: val,
    contactid: this.path,
  }
  this.common.setSingleImage(data)
}

statusCheck(event){
  if (event !== 'Completed' && event !== 'Rejected') {
    this.form.controls['medicaltestresultdate'].setValidators(Validators.nullValidator);
    this.form.controls['medicaltestdate'].setValidators(Validators.nullValidator);
    this.fromDatePicker = true;
    this.toDatePicker = true;
  } else {
    this.form.controls['medicaltestresultdate'].setValidators(Validators.required);
    this.form.controls['medicaltestdate'].setValidators(Validators.required);
    this.fromDatePicker = false;
    this.toDatePicker = false;
  }
  this.form.controls['medicaltestresultdate'].setValue('');
  this.form.controls['medicaltestdate'].setValue('');
  this.form.updateValueAndValidity();
}
statusValueCheck(event){
  if(this.form.get('medicalteststatus').value !== 'Completed' && this.form.get('medicalteststatus').value !== 'Rejected'){
    this.form.controls['medicalteststatus'].setValue('');
  }
}
fromDatePicker: boolean = true;
toDatePicker: boolean = true;
fromDate = new Date();
toDate = new Date();

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
