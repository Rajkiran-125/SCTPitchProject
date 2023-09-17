import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex } from 'src/app/global/json-data';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hawker-complaint',
  templateUrl: './hawker-complaint.component.html',
  styleUrls: ['./hawker-complaint.component.scss']
})
export class HawkerComplaintComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  submittedForm: boolean = false;
  paymentSearch : boolean = true
  labelName: any;
  type: any = '';
  userConfig: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  constructor(    
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute
  ) {
    Object.assign(this, { regex });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      hawkerid: [null, Validators.nullValidator],
      firstname: [null, Validators.nullValidator],
      middlename: [null, Validators.nullValidator],
      lastname: [null, Validators.nullValidator],
      mobilenumber: [null, Validators.nullValidator]
    });
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      this.type = this.activatedRoute.snapshot.paramMap.get('type');
      this.common.setUserConfig(this.userDetails.ProfileType,this.type);
      this.common.getUserConfig$.subscribe(data => {
          this.userConfig = data;
      });
    })
    this.getSnapShot();
    this.getFilter();
    this.feildChooser()
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'HawkerComplaint', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  getSnapShot() {
    this.common.closeComponent()
    this.common.openComponent$.subscribe(openComponent => {
        this.paymentSearch = openComponent;
        this.reset()
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }

  searchHawker() {
    this.loader = true;
    this.tabKey = [];
    this.tabValue = [];
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

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_haw_personal',
        parameters: {
          flag: 'GET_PENALTY',
          processid: this.userDetails.Processid,
          productid: 1,
          ...this.form.value,
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        var tempRes = res.results.data
        for (let data of tempRes) {
          var newObj = {
            "Sr No": '',
            "Applicant No.": data['Applicant Id'],
            "First Name": data['First Name'],
            "Middle Name": data['Middle Name'],
            "Last Name": data['Last Name'],
            "Mobile No.": data['MobileNo'],
            "Penalty": data['Penalty'],
            "PenaltyCount": data['PenaltyCount'],
            "Add Complaint": data['Status'],
          }
          this.tabValue.push(newObj);
        }
        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
        if (tempRes.length == 0) {
          this.noData = true
        } else {
          this.noData = false
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

  reset(){
    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
  }

  openComponent(data) {
    this.paymentSearch = false;
    this.data = {
      display: true,
      contactid: data['Applicant No.'],
      hawkerfirstname: data['First Name'],
      hawkermiddlename: data['Middle Name'],
      hawkerlastname: data['Last Name'],
      mobileNo: data['Mobile No.'],
      uniformsize: data['UniformSize'],
    }
  }

  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  getFilter() {
    this.common.getItemsPerPage$.subscribe(data => {      
      this.itemsPerPage = data
  });
  this.common.getSearch$.subscribe(data => {
      this.search = data
  });
  this.common.getLoaderStatus$.subscribe(data => {
      // this.loader = data;
      if (data == false) {
          // this.getContacts()
          this.searchHawker()
      }
  });
  this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data
  });
  }

  feildChooser() {
    var obj = {
        data: {
            spname: "usp_unfyd_user_field_chooser",
            parameters: {
                flag: "GET",
                processid: this.userDetails.Processid,
                productid: 1,
                userid: this.userDetails.Id,
                modulename: 'BeneficiaryComplaint',
                language: localStorage.getItem('lang')
            }
        }
    }
    this.api.post('index', obj).subscribe(res => {
        if (res.code == 200) {
            if (res.results.data.length == 0) {
                this.selctedField = this.tabKey;
            } else {
                this.selctedField = res.results.data[0].FieldChooser.split(',');
            }
            this.unSelctedField = this.tabKey.filter(field => !this.selctedField.includes(field));
            var selctedField = [];
            for (let i = 0; i < this.selctedField.length; i++) {
                selctedField.push({ value: this.selctedField[i], className: '' })
            }
            var unSelctedField = [];
            for (let i = 0; i < this.unSelctedField.length; i++) {
                unSelctedField.push({ value: this.unSelctedField[i], className: 'tabCol' })
            }
            this.finalField = [
                ...selctedField,
                ...unSelctedField
            ]
        } else {
            // this.common.snackbar(res.results.data[0].result);
        }
    },
        (error) => {
            // this.common.snackbar(error.message);
        })
}

  applyDiscount(data) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'complaint',
        application: data['Applicant No.'],
        firstname: data['First Name'],
        middlename: data['Middle Name'],
        lastname: data['Middle Name'],
        mobileno: data['Mobile No.'],
        userDetails: this.userDetails
      },
      width: '380px'

    });
    dialogRef.afterClosed().subscribe(status => {
      this.searchHawker()
    });
  }



}
