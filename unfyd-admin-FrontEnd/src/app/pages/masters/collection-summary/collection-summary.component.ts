import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex, paymentCollection } from 'src/app/global/json-data';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-collection-summary',
  templateUrl: './collection-summary.component.html',
  styleUrls: ['./collection-summary.component.scss']
})
export class CollectionSummaryComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  tempData:any
  submittedForm: boolean = false;
  paymentSearch : boolean = true;
  paymentCollection:any;
  path:any;
  tab= '';
  config:any;

  constructor(
    
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute,
  ) {
    Object.assign(this, { regex,paymentCollection });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('PaymentCollection','click','pageload','pageload','','ngOnInit');

    this.form = this.formBuilder.group({
      hawkerid: [null, Validators.nullValidator],
      registrationno: [null, Validators.nullValidator],
      firstname: [null, Validators.nullValidator],
      middlename: [null, Validators.nullValidator],
      lastname: [null, Validators.nullValidator],
      mobilenumber: [null, Validators.nullValidator]
    });
    this.getSnapShot();
    this.getFilter();
    this.searchHawker()
    this.common.hubControlEvent('PaymentCollection','click','pageloadend','pageloadend','','ngOnInit');

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getSnapShot() {
    this.common.hubControlEvent('PaymentCollection','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'PaymentCollection');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    })
    this.common.closeComponent()
    this.common.openComponent$.subscribe(openComponent => {
        this.paymentSearch = openComponent;
        this.reset()
    })
  }

changeVerificationStatus(data,event,j){
  this.common.hubControlEvent('PaymentCollection','click','','',JSON.stringify(data),'changeVerificationStatus');

  let remarkData=''
  this.requestObj = {
    data: {
      spname: 'usp_unfyd_payment_collection_adm_status',
      "parameters": {
        "flag": "UPDATE",
        DEPOSITVERIFYSTATUS:event,
        VERIFIEDBY:this.userDetails.Id,
        MODIFIEDBY:this.userDetails.Id,
        FEUSERID: data.FEID,
        PAYMENTCOLLECTIONDATE:data.CollectionDate,
        REJECTREMARKS:remarkData
    }
    }
  }
  if(event == 'Approved'){
    remarkData = ''
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        this.common.snackbar("Success");
        this.searchHawker()
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  } else if(event == 'Rejected'){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'depositeRemark'
      },
      width: '380px'

    });
    dialogRef.afterClosed().subscribe(status => {
      this.requestObj.data.parameters.REJECTREMARKS = status
      if(status != null && status != undefined && status != '' && status != false){
        remarkData = status
        this.api.post('index', this.requestObj).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.loader = false;
            this.common.snackbar("Success");
            this.searchHawker()
          } else {
            this.loader = false;
          }
        },
          (error) => {
            this.loader = false;
            this.common.snackbar("General Error");
          })
      } else{
        return
      }
    });
  } else{
    return
  }
}

  searchHawker() {
    this.loader = true;
    this.tabKey = [];
    this.tabValue = [];
    this.submittedForm = true;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_payment_collection_summary',
        "parameters": {
          "flag": this.userDetails.RoleType == 'Field Executive' ? "FE" : "ACCOUNT_ADMIN",
          "FEID": this.userDetails.RoleType == 'Field Executive' ? this.userDetails.Id : null
      }
      }
    }
    this.common.hubControlEvent('PaymentCollection','click','','',JSON.stringify(this.requestObj),'searchHawker');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.tempData = res.results.data
        this.loader = false;
        var tempRes = res.results.data
        for (let data of tempRes) {
          var newObj = {
            "Sr No": '',
            "Field Executive Name": data['Field Executive Name'],
            "CollectionDate": data['CollectionDate'],
            "Online": data['Online'],
            "Cash": data['Cash'],
            "Total Amount": data['Total Amount'],
            "Deposit Date": data['Deposit Date'],
            "Transaction ID": data['Transaction ID'],
            "Deposit Amount": data['Deposit Amount'],
            "Deposit Status": data['Deposit Status'],
            "Verification Status": data['Verification Status'],       
          }         
          if(this.userDetails.RoleType == 'Field Executive'){
            newObj['Reject Remarks'] = data['RejectRemarks']
          } else{
            newObj['Resubmitted Remarks'] = data['ResubmittedRemarks']
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
    this.common.hubControlEvent('PaymentCollection','click','','','','reset');

    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
  }

  openComponent(data) {
    this.common.hubControlEvent('PaymentCollection','click','','',JSON.stringify(data),'openComponent');

    this.paymentSearch = false;
    this.data = {
      display: true,
      contactid: data['Applicant No.'],
      registation: data['Registration No.'],
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
    this.common.getItemsPerPage$.subscribe(getItemsPerPage => {
      this.itemsPerPage = getItemsPerPage
    });
    this.common.getSearch$.subscribe(getSearch => {
      this.search = getSearch
    });
  }

  deposit(depositStatus,val) {
    this.common.hubControlEvent('PaymentCollection','click','','',JSON.stringify(depositStatus, val),'deposit');

    
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'deposite',
        collectionDate:new Date(),
        userDetails:this.userDetails,
        data:val,
        depositStatus:depositStatus,
      },
      width: '380px'

    });
    dialogRef.afterClosed().subscribe(status => {
      this.searchHawker()
    });
  }

  dummy(val,col){
    
  }

}
