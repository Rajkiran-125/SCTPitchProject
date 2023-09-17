import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {
  @ViewChild('select') select: any = MatSelect;
  constructor(private formBuilder: FormBuilder, private api: ApiService, private common: CommonService, private router: Router,
    private auth: AuthService, public datepipe: DatePipe, private activatedRoute: ActivatedRoute, private el: ElementRef, private location: Location,) {
    Object.assign(this, { masters });
  }
  commonObj: any;
  loader: boolean = false;
  form: FormGroup;
  uploadForm: FormGroup;
  VendorCodeList: any;
  masters: any;
  categoryList: any;
  aadharSrc: any;
  startingDate = new Date();
  userDetails: any;
  submittedForm = false;
  requestObj: any;
  vendorId: any;
  editObj: any;
  zipcodes: any = [];
  countrylist: Object;
  statess = [{ id: 0, name: 'One' }, { id: 1, name: 'Two' }];
  states: any = [];
  district: any = [];
  filteredstates = this.states.slice();
  filtereddistrict = this.district.slice();
  filtereddzipcodes = this.zipcodes.slice();
  labelName: any;
  reset: boolean;

  ngOnInit(): void {
    this.common.hubControlEvent('vendor','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.getCountries('', 'Country');
    this.form = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      mobile: ['', [Validators.required, Validators.pattern(regex.mobile)]],
      landline: ['', Validators.nullValidator],
      emailid: ['', [Validators.required, Validators.pattern(regex.email)]],
      website: ['', Validators.nullValidator],
      line1: ['', Validators.nullValidator],
      line2: ['', Validators.nullValidator],
      hours: ['', Validators.nullValidator],
      pin: ['', Validators.nullValidator],
      country: ['', Validators.nullValidator],
      state: ['', Validators.nullValidator],
      district: ['', Validators.nullValidator],
      category: ['', Validators.nullValidator],
      bankaccountdetails: ['', Validators.required],
      gstregistrationno: ['', [Validators.required, Validators.pattern(regex.gst)]],
      pan: ['', [Validators.required, Validators.pattern(regex.pan)]],
      contractstartdate: ['', Validators.nullValidator],
      contractenddate: ['', Validators.nullValidator],
      vendorempanelmentstatus: ['', Validators.nullValidator],
      uploadurl: ['', Validators.nullValidator],
    })
    this.uploadForm = this.formBuilder.group({
      uploaddocuments: ['']
    });

    this.startingDate.setFullYear(this.startingDate.getFullYear() - 18);
    this.vendorId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.vendorId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_vendor",
          parameters: {
            "flag": "EDIT",
            Id: this.vendorId
          }
        }
      }
      this.api.post('index', Obj).subscribe((res: any) => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.loader = false;
          this.editObj = res.results.data[0];
          const lowerObj = this.common.ConvertKeysToLowerCase();
          this.getStates(this.editObj.Country);
          this.getDistrict(this.editObj.State);
          this.getZipcodes(this.editObj.District);
          this.form.patchValue(lowerObj(this.editObj));
          this.form.patchValue({
            country: JSON.parse(this.editObj.Country),
            state: JSON.parse(this.editObj.State),
            district: JSON.parse(this.editObj.District)
          })
          this.addressProofSrc = this.form.value.uploadurl;
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/vendor/add'])
    }
    this.common.hubControlEvent('vendor','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('vendor','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'vendor', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('vendor','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, 'vendor');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"));
  }
  getCountries(event, type) {
    this.common.hubControlEvent('vendor','click','','',JSON.stringify(event),'getCountries');

    this.countrylist = [];
    this.common.getLocation(event, type).subscribe(res => {
      this.countrylist = res;
    })
  }
  getStates(event) {
    this.common.hubControlEvent('vendor','click','','',JSON.stringify(event),'getStates');

    this.common.getLocation(event, 'State').subscribe(res => {     
      this.states = res;
      // this.filteredstates = res;
    });
  }

  getDistrict(event) {
    this.common.hubControlEvent('vendor','click','','',JSON.stringify(event),'getDistrict');

    this.common.getLocation(event, 'District').subscribe(res => {
      this.district = res;
      //  this.filtereddistrict = res;
    })
  }


  getZipcodes(event) {
    this.common.hubControlEvent('vendor','click','','',JSON.stringify(event),'getZipcodes');

    this.common.getLocation(event, 'Pincode').subscribe(res => {
      this.zipcodes = res;
      this.filtereddzipcodes = res;
    })
  }



  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('vendor','click','back','back','','back');

    this.location.back()
  }
  submit(btnType): void {
    this.submittedForm = true;
    if (this.form.invalid) {
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

    this.commonObj = {
      contractstartdate: this.datepipe.transform(this.form.get('contractstartdate').value, regex.dateFormat),
      contractenddate: this.datepipe.transform(this.form.get('contractenddate').value, regex.dateFormat),
      processid: this.userDetails.Processid,
      productid: 1,
      publicip: this.userDetails.ip,
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version,
      id: this.vendorId !== null ? this.editObj.Id : '',
    }

    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_vendor",
        "parameters": {
          flag: this.editObj !== undefined ? 'UPDATE' : 'INSERT',
          createdby: this.editObj !== undefined ? this.editObj.CreatedBy : this.userDetails.EmployeeId,
          ...this.form.value,
          ...this.commonObj,
        }
      }
    }
    this.common.hubControlEvent('vendor','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/vendor']);
        this.common.snackbar(res.results.data[0].result, "success");
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      })
  }
  addressProofSrc: any;
  // addressProofUpload: boolean = false;
  onFileSelect(event) {
    this.common.hubControlEvent('vendor','click','','',JSON.stringify(event),'onFileSelect');

    const reader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];     
      this.uploadForm.get('uploaddocuments').patchValue(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.addressProofSrc = reader.result as string;

      };
    }
  }
  submitDocuments() {
    this.common.hubControlEvent('vendor','click','','','','submitDocuments');

    this.submittedForm = true;
    if (this.form.invalid) {
      this.common.snackbar("Please fill form carefully", "error");
      return;
    }
    let time = this.datepipe.transform(new Date(), 'yyyyMMddHHmmss');   
    let filename = 'vendorDocument_' + this.form.value.pan + '_' + time;    

    const formData = new FormData();
    formData.append(filename, this.uploadForm.get('uploaddocuments').value);
    this.api.post('upload', formData).subscribe((res: any) => {
      if (res.results != undefined || res.result != null) {      
        this.form.patchValue({
          uploadurl: res.results['URL']
        })
        this.common.snackbar(res.results['data'], "success");
      }
    })
  }
}



