import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { employeeFormSteps, regex, masters } from 'src/app/global/json-data';

@Component({
  selector: 'app-professional-details',
  templateUrl: './professional-details.component.html',
  styleUrls: ['./professional-details.component.scss']
})
export class ProfessionalDetailsComponent implements OnInit {

  loader: boolean = false;
  editObj: any;
  commonObj: any;
  userDetails: any;
  path: any;
  employeeFormSteps: string[] = [];
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  masters: any;
  speciallyAbled : any = '';
  referece :  any = '';
  policeVerification : any = '';
  ongoingCases : any = '';
  resume : any = '';
  offerLetter : any = '';
  appointmentLetter : any = '';
  district: any = [];
  filtereddistrict = this.district.slice();
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private el: ElementRef,
    private api: ApiService
  ) {
    Object.assign(this, { employeeFormSteps, regex, masters });
  }

  ngOnInit(): void {

    this.getSnapShot();

    this.userDetails = this.auth.getUser();
    this.getDistrict();
    this.form = this.formBuilder.group({
      officialemail: ['', Validators.pattern(regex.email)],
      isphysicallychallenged: ['', Validators.nullValidator],
      isreferencecheckdone: [false, Validators.nullValidator],
      ispoliceverificationdone: [false, Validators.nullValidator],
      anyongoingcases: [false, Validators.nullValidator],
      accountnumber: ['', Validators.pattern(regex.numeric)],
      organizationname: ['', Validators.nullValidator],
      designationid: ['', Validators.pattern(regex.numeric)],
      employeeid: ['', Validators.pattern(regex.excepthyphen)],
      employeetype: ['', Validators.nullValidator],
      employeestatus: ['', Validators.nullValidator],
      reportingto: ['', Validators.nullValidator],
      department: ['', Validators.nullValidator],
      isresumeuploaded: [false, Validators.nullValidator],
      isofferletteruploaded: [false, Validators.nullValidator],
      isaptltrcnsltagmtuploaded: [false, Validators.nullValidator],
      rlvgltrresgacceptanceltr: ['', Validators.nullValidator],
      operationlocation: ['', Validators.pattern(regex.numeric)],
      dateofjoining: ['', Validators.nullValidator],
      dateofleaving: ['', Validators.nullValidator],
      dateofconfirmation: ['', Validators.nullValidator],
      band: ['', Validators.nullValidator],
      ctc: ['', Validators.pattern(regex.numeric)],
      salaryslips: ['', Validators.nullValidator],
      form16: ['', Validators.nullValidator],
      refcheckformfilled: ['', Validators.nullValidator],
      servicearea: ['', Validators.nullValidator],
      industrytype: ['', Validators.nullValidator],
    });
    this.common.getIndividualUpload$.subscribe(res => {
      if (res.category == 'Specially Abled') {
        this.form.get('isphysicallychallenged').setValue(res.status == false ? false : true);
        this.speciallyAbled = res;
      }
      if (res.category == 'Reference') {
        this.form.get('isreferencecheckdone').setValue(res.status == false ? false : true);
        this.referece = res;
      }
      if (res.category == 'Police Verificaton') {
        this.form.get('ispoliceverificationdone').setValue(res.status == false ? false : true);
        this.policeVerification = res;
      }
      if (res.category == 'Ongoing Cases') {
        this.form.get('anyongoingcases').setValue(res.status == false ? false : true);
        this.ongoingCases = res;
      }
      if (res.category == 'Resume') {
        this.form.get('isresumeuploaded').setValue(res.status == false ? false : true);
        this.resume = res;
      }
      if (res.category == 'Offer Letter') {
        this.form.get('isofferletteruploaded').setValue(res.status == false ? false : true);
        this.offerLetter = res;
      }
      if (res.category == 'Appointment Letter') {
        this.form.get('isaptltrcnsltagmtuploaded').setValue(res.status == false ? false : true);
        this.appointmentLetter = res;
      }
      this.form.updateValueAndValidity();
    })
  }

  getSnapShot() {
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_emp_professional",
          parameters: {
            flag: 'EDIT',
            contactid: this.path
          }
        }
      }

      this.api.post('index', this.requestObj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          // if (res.results) {
          this.editObj = res.results.data[0]
          if (this.editObj) {
            const lowerObj = this.common.ConvertKeysToLowerCase();
            this.form.patchValue(lowerObj(this.editObj));
            if (this.editObj.DateOfJoining != null && this.editObj.DateOfJoining != '') {
              this.form.get('dateofjoining').setValue(this.formatDate(this.editObj.DateOfJoining));
            }
            if (this.editObj.DateOfConfirmation != null && this.editObj.DateOfConfirmation != '') {
              this.form.get('dateofconfirmation').setValue(this.formatDate(this.editObj.DateOfConfirmation));
            }
            if (this.editObj.DateOfLeaving != null && this.editObj.DateOfLeaving != '') {
              this.form.get('dateofleaving').setValue(this.formatDate(this.editObj.DateOfLeaving));
            }
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

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getDistrict() {
    this.common.getLocation(null, 'DistrictForEmp').subscribe(res => {
      this.district = res;
      this.filtereddistrict = res;
    })
  };

  uploadDocument(event, imgData, category) {
    var data = {
      flag: imgData !== '' ? 'UPDATE' : 'INSERT',
      documentId: imgData.Actionable,
      category: category,
      createdby: imgData !== '' ? imgData['Created By'] : this.userDetails.Id,
      modifiedby: imgData !== '' ? this.userDetails.Id : null,
      contactid: this.path,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUploadEmp(data)
    }
  }

  viewDocument(val, type) {
    var data = {
      type: type,
      processid: this.userDetails.Processid,
      category: val,
      contactid:this.path,
    }
    this.common.setSingleImageEmp(data)
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
      this.common.snackbar("General Error");
      return;
    }

    this.commonObj = {
      id: this.editObj !== undefined ? this.editObj.Id : '',
      contactid: this.editObj !== undefined ? this.editObj.ContactID : this.path,
      userid: this.userDetails.Id,
      modifiedby: this.userDetails.Id,
      publicip: this.userDetails.ip,
      privateip: '',
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version
    }

    this.requestObj = {
      data: {
        spname: "usp_unfyd_emp_professional",
        parameters: {
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
          this.router.navigate(['masters/employee/academic-details', this.commonObj.contactid]);
        } else if (btnType == 'save') {
          this.router.navigate(['masters/employee/professional-details', this.commonObj.contactid]);
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

}
