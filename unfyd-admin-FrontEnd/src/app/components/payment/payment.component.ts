import { TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';
import { ApiService } from 'src/app/global/api.service';
import { masters } from 'src/app/global/json-data';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() hawkerDetails: any;
  filteredFeeType: Observable<string[]>;
  fees: string[] = [];
  @ViewChild('feeInput') feeInput: ElementRef<HTMLInputElement>;

  requestObj: any;
  loader: boolean = false;
  form: FormGroup;
  submittedForm: boolean = false;
  masters: any;
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  userDetails: any;
  fee: any = [];
  feeDropdown: any = [];
  paymentDropdown: any = [];
  paymentPanel: boolean = false;
  tempFeeStructure: any = [];
  feeStructure: any = [];
  totalAmt: number;
  amtPayable: number;
  gstAmount: number = 0;
  gstPercent: number = 0;
  month: any = [];
  selectedMonth: any = '';
  feeTypePanel: boolean = true;
  dueForPanel: boolean = false;
  referencePanel: boolean = false;
  oneTime: any = 'One time fee';
  advanceFee: number = 0;
  tempTotalAmt: any;
  tempGstPercent: number;
  tempGstAmount: number;
  chipDisable: boolean = false;
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  masterConfig: any;
  registrationTotal: number = 0;
  registrationAdvance: number = 0;
  discount: number = 0;
  penalty: number = 0;
  reactivation: number = 0;
  transactionDetails: any = {
    lastfeeamt: 0,
    registrationamt: 0,
  };
  userConfig: any;
  constructor(
    private router: Router,
    private titlecasePipe: TitleCasePipe,
    private formBuilder: FormBuilder,
    private common: CommonService,
    private auth: AuthService,
    private api: ApiService, public dialog: MatDialog,
  ) {
    Object.assign(this, { masters });
  }

  ngOnInit() {
    this.userDetails = this.auth.getUser();
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.masterConfig = {
        paymentMode: JSON.parse(data.PaymentMode),
      }
    });

    this.common.setUserConfig(this.userDetails.ProfileType, 'beneficiary');
    this.common.getUserConfig$.subscribe(data => {
      this.userConfig = data;
    });

    this.form = this.formBuilder.group({
      feeType: ['', Validators.required],
      paymentType: ['', Validators.required],
      dueFor: ['', Validators.required],
      paymentMode: [this.masters.paymentmode[0], Validators.nullValidator],
      referenceNo: ['', Validators.nullValidator],
      receivedBy: [this.titlecasePipe.transform(this.userDetails.FirstName + ' ' + this.userDetails.LastName), Validators.nullValidator],
    });

    setTimeout(() => {
      if (this.hawkerDetails.contactid !== undefined) {
        this.getPaymentList();
        this.getFilter();
      }
    }, 400);
    this.getDiscount()
    this.getReactivation()
    this.getAttachment()
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getPaymentList() {

    this.tabKey = [];
    this.tabValue = [];
    this.requestObj = {
      data: {
        spname: "usp_unfyd_haw_finance",
        parameters: {
          flag: "GET_FOR_PAYMENT",
          contactid: this.hawkerDetails.contactid,
          processid: this.userDetails.Processid,
          productid: 1
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        for (let data of res.results.data) {
          var paymentObj = {
            "Actionable": data.Actionable,
            "Date": data.TransactionDateTime,
            "Fee Type": data.FeeType,
            "Due For": data.DueFor,
            "Amount": data.AmountToBePaid,
            "Received By": data.PaymentReceivedBy,
            "Status": 'Paid',
            "Print": '',
          }
          this.tabValue.push(paymentObj);
        }

        if (this.tabValue.length == 0) {
          this.noData = true;
          this.chipDisable = true;
        } else {
          this.noData = false;
          this.chipDisable = false;
        }

        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }

      } else {
        this.loader = false
      }
      this.feeMaster();
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("Add Error", "error");
      })
  }

  feeMaster() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_haw_fee",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.fee = res.results.data;
        if (this.tabValue.length == 0) {
          for (var data in this.fee) {
            this.feeDropdown.push(this.fee[data]['Fee Type']);
          }
        } else if (this.tabValue.length > 0) {
          var feeDropdown = []
          for (var data in this.fee) {
            feeDropdown.push(this.fee[data]['Fee Type']);
          }
          this.feeDropdown = feeDropdown.filter(item => item !== 'Registration' && item !== 'Advance');
          if (this.tabValue.length == 1) {
            this.advanceFee = this.fee.filter(item => item['Fee Type'] == 'Advance')[0]['Fee Amount'];
          }
        }
        this.filteredFeeType = this.form.get('paymentType').valueChanges.pipe(
          startWith(''),
          map((data: string | null) => (data ? this.feeTypeFilter(data) : this.feeDropdown.slice())),
        );
        if (this.tabValue.length == 0) {
          this.registrationPayment()
        }
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("Add Error", "error");
      })

  }

  registrationPayment() {
    this.form.get('feeType').setValue('null');
    this.form.get('paymentType').setValue('Registration');
    this.form.get('dueFor').setValue(this.oneTime);
    var registration = this.fee.filter(key => key['Fee Type'] === this.form.get('paymentType').value)[0]
    var advance = this.fee.filter(key => key['Fee Type'] === 'Advance')[0];
    this.advanceFee = advance['Fee Amount'];
    this.gstPercent = registration['GST'] / 2;
    this.gstAmount = this.gstPercent * (registration['Fee Amount'] / 100);
    this.totalAmt = registration['Fee Amount'] + (this.gstAmount * 2);
    this.amtPayable = this.totalAmt + this.advanceFee;
    this.fees = [registration['Fee Type'], advance['Fee Type']];
    this.registrationTotal = registration['Fee Amount'];
    this.registrationAdvance = this.advanceFee;
    this.transactionDetails = {
      lastfeeamt: registration['Fee Amount'],
      registrationamt: registration['Fee Amount'],
    }
    if (this.discount == 0) {
      this.feeStructure = [
        {
          'Registration Fee': '₹' + registration['Fee Amount'],
          'CGST@': '₹' + this.gstAmount,
          'SGST@': '₹' + this.gstAmount,
        },
        {
          'Total Amount': '₹' + this.totalAmt,
          'Advance Fee': '+ ₹' + this.advanceFee,
        },
        {
          'Amount Payable': '₹' + (this.amtPayable - this.discount),
        }
      ]
    } else {
      this.feeStructure = [
        {
          'Registration Fee': '₹' + registration['Fee Amount'],
          'CGST@': '₹' + this.gstAmount,
          'SGST@': '₹' + this.gstAmount,
        },
        {
          'Total Amount': '₹' + this.totalAmt,
          'Advance Fee': '+ ₹' + this.advanceFee,
          'Discount': '- ₹' + this.discount,
        },
        {
          'Amount Payable': '₹' + (this.amtPayable - this.discount),
        }
      ]
    }
  }

  selectedFeeType(event: MatAutocompleteSelectedEvent): void {
    this.fees.push(event.option.viewValue);
    this.feeInput.nativeElement.value = '';
    this.form.get('feeType').setValue('null');
    if (event.option.viewValue !== 'Service') {
      var tempFeeStructure = this.fee.filter(key => key['Fee Type'] === event.option.viewValue)[0];
      var tempGstAmount = tempFeeStructure['GST'] * (tempFeeStructure['Fee Amount'] / 100)
      this.tempFeeStructure.push({ 'Fee Type': tempFeeStructure['Fee Type'], 'Fee Amount': tempFeeStructure['Fee Amount'], 'GST': tempFeeStructure['GST'], 'GST Amount': tempGstAmount });
      this.feeStructure = [
        ...this.tempFeeStructure
      ]

      this.tempGstPercent = tempFeeStructure['GST'] / 2;

      if (this.tabValue.length == 1) {
        var tempTotalAmt = this.tempFeeStructure.reduce((a, b) => +a + +b['Fee Amount'], 0);
        this.tempGstAmount = this.tempGstPercent * (tempTotalAmt / 100);
        this.tempTotalAmt = tempTotalAmt + (this.tempGstAmount * 2);
        this.amtPayable = (this.tempTotalAmt - this.advanceFee) - this.discount + this.reactivation + this.penalty;
        this.transactionDetails = {
          lastfeeamt: tempTotalAmt,
          registrationamt: 0,
        }
      } else if (this.tabValue.length > 1) {
        this.tempTotalAmt = this.tempFeeStructure.reduce((a, b) => +a + +b['Fee Amount'], 0);
        this.tempGstAmount = this.tempGstPercent * (this.tempTotalAmt / 100);
        this.amtPayable = (this.tempTotalAmt + (this.tempGstAmount * 2)) - this.discount + this.reactivation + this.penalty;
        this.transactionDetails = {
          lastfeeamt: this.tempTotalAmt,
          registrationamt: 0,
        }
      }
      this.totalAmt = this.tempTotalAmt;
      this.gstPercent = this.tempGstPercent;
      this.gstAmount = this.tempGstAmount;
    }
    if (event.option.viewValue == 'Service') {
      this.chipDisable = true;
      this.paymentMaster();
    }
  }


  changePaymentType(event) {
    this.chipDisable = false;
    this.month = event == 'Monthly' ? this.masters.month : [this.oneTime];
    this.selectedMonth = event == 'Monthly' ? this.masters.month[new Date().getMonth()] : this.oneTime;
    this.dueForPanel = event == 'Monthly' ? true : false;
    this.form.get('dueFor').setValue(event == 'Monthly' ? this.masters.month[new Date().getMonth()] : this.oneTime);
    var feeStructure = this.paymentDropdown.filter(key => key['PaymentType'] === event)[0];
    var tempGstAmount = feeStructure['GST'] * (feeStructure['Amount'] / 100)
    this.feeStructure = [
      ...this.tempFeeStructure,
      { 'Fee Type': feeStructure['PaymentType'], 'Fee Amount': feeStructure['Amount'], 'GST': feeStructure['GST'], 'GST Amount': tempGstAmount }
    ];

    this.gstPercent = feeStructure['GST'] / 2;

    if (this.tabValue.length == 1) {
      var totalAmt = this.tempTotalAmt ? this.tempTotalAmt + feeStructure['Amount'] : feeStructure['Amount'];
      this.gstAmount = this.tempGstAmount ? this.tempGstAmount + (tempGstAmount / 2) : (tempGstAmount / 2);
      this.totalAmt = totalAmt + tempGstAmount;
      this.amtPayable = (this.totalAmt - this.advanceFee) - this.discount + this.reactivation + this.penalty;
      this.transactionDetails = {
        lastfeeamt: totalAmt,
        registrationamt: 0,
      }
    } else if (this.tabValue.length > 1) {
      this.totalAmt = this.tempTotalAmt ? this.tempTotalAmt + feeStructure['Amount'] : feeStructure['Amount'];
      this.gstAmount = this.gstPercent * (this.totalAmt / 100);
      this.amtPayable = (this.totalAmt + (this.gstAmount * 2)) - this.discount + this.reactivation + this.penalty;
      this.transactionDetails = {
        lastfeeamt: this.totalAmt,
        registrationamt: 0,
      }
    }
  }

  paymentMaster() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_fee_payment",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.paymentDropdown = res.results.data;
        this.paymentPanel = true;
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("Add Error", "error");
      })
  }
  removeFeeType(data): void {
    const index = this.fees.indexOf(data);

    if (data == 'Service') {
      this.paymentPanel = false;
      this.dueForPanel = false;
    }

    if (index >= 0) {
      this.fees.splice(index, 1);
      this.tempFeeStructure.splice(index, 1);
      this.feeStructure.splice(index, 1);

      if (this.tabValue.length == 1) {

        this.tempGstAmount = this.tempFeeStructure.reduce((a, b) => +a + +b['GST Amount'], 0) / 2;
        this.tempTotalAmt = this.tempFeeStructure.reduce((a, b) => +a + +b['Fee Amount'], 0);

        this.gstAmount = this.feeStructure.reduce((a, b) => +a + +b['GST Amount'], 0) / 2;
        this.totalAmt = this.feeStructure.reduce((a, b) => +a + +b['Fee Amount'], 0) + (this.gstAmount * 2);
        this.amtPayable = (this.totalAmt - this.advanceFee) - this.discount + this.reactivation + this.penalty;


      } else if (this.tabValue.length > 1) {

        this.tempGstAmount = this.tempFeeStructure.reduce((a, b) => +a + +b['GST Amount'], 0) / 2;
        this.tempTotalAmt = this.tempFeeStructure.reduce((a, b) => +a + +b['Fee Amount'], 0);

        this.gstAmount = this.feeStructure.reduce((a, b) => +a + +b['GST Amount'], 0) / 2;
        this.totalAmt = this.feeStructure.reduce((a, b) => +a + +b['Fee Amount'], 0);

      }

      this.transactionDetails = {
        lastfeeamt: this.tempTotalAmt,
        registrationamt: 0,
      }
    }

    this.filteredFeeType = this.form.get('paymentType').valueChanges.pipe(
      startWith(''),
      map((data: string | null) => (data ? this.feeTypeFilter(data) : this.feeDropdown.slice())),
    )
    this.form.get('paymentType').setValue('');

  }

  feeTypeFilter(value): string[] {
    const filterValue = value.toLowerCase();
    return this.feeDropdown.filter(data => data.toLowerCase().includes(filterValue));
  }

  changePaymentMode(event) {
    if (event == 'Online') {
      this.referencePanel = true;
      this.form.get('referenceNo').setValidators(Validators.required);
    } else {
      this.referencePanel = false;
      this.form.get('referenceNo').setValidators(Validators.nullValidator);
    }
    this.form.get('referenceNo').setValue('');
    this.form.updateValueAndValidity();
  }

  submit() {
    if (this.userDetails?.DayEndStatus == false) {



      this.loader = true;
      this.submittedForm = true;
      if (this.form.invalid) {
        this.loader = false;
        this.common.snackbar("Add Error", "error");
        return;
      }

      if (this.tabValue.length == 1 && this.hawkerDetails.RegistrationStatus !== 'Active') {
        this.common.snackbar('Beneficiary Approve', "success");
      } else {

        if (this.tabValue.length == 0) {
          this.updateStatusRegistration();
        }

        this.requestObj = {
          data: {
            spname: "usp_unfyd_haw_finance",
            parameters: {
              flag: "INSERT",
              id: '',
              productid: 1,
              processid: this.userDetails.Processid,
              contactid: this.hawkerDetails.contactid,
              applicantid: '',
              hawkerfirstname: this.hawkerDetails.hawkerfirstname,
              hawkermiddlename: this.hawkerDetails.hawkermiddlename,
              hawkerlastname: this.hawkerDetails.hawkerlastname,
              currentoutstanding: null,
              feetype: this.form.get('paymentType').value,
              duefor: this.form.get('dueFor').value,
              paymentmode: this.form.get('paymentMode').value,
              latefeecharges: null,
              amounttobepaid: this.amtPayable,
              transactiondatetime: new Date(),
              transactionrefno: this.form.get('referenceNo').value,
              paymentreceivedby: this.form.get('receivedBy').value,
              paymentstatus: '',
              createdby: this.userDetails.Id,
              modifiedby: null,
              isdeleted: 0,
              deletedby: null,
              publicip: this.userDetails.ip,
              privateip: '',
              browsername: this.userDetails.browser,
              browserversion: this.userDetails.browser_version
            }
          }
        }

        this.manageLastTransaction(this.form.get('paymentMode').value, this.form.get('paymentType').value)

        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            if (this.hawkerDetails.display == true) {
              this.close()
            }
            else {
              this.router.navigate(['masters/beneficiary']);
            }
            if (this.tabValue.length == 0) {
              this.statusUpdate()
            }
            this.loader = false;
            this.common.snackbar("Add Record", "success");
            if (res.results.data[0].result[0] !== 'Data already exists') {
              this.getPaymentList()
              var tempData = {
                'Actionable': res.results.data[0].result[1],
                'Registration No': this.hawkerDetails.contactid,
                'First Name': this.hawkerDetails.hawkerfirstname,
                'Fee Type': this.form.get('paymentType').value,
                'Date': new Date(),
                'Amount': this.amtPayable,
              }
              this.common.setPrint('receipt', tempData);
              setTimeout(() => {
                window.print()
                this.clearPanel()
              }, 100);
            }

          } else {
            this.loader = false;
          }
        },
          (error) => {
            this.loader = false;
            this.common.snackbar("Add Error", "error");
          })

      }


    } else {
      this.common.snackbar('Payment after day', "error");
    }
  }

  statusUpdate() {

    let obj = {
      data: {
        spname: 'usp_unfyd_haw_personal',
        parameters: {
          flag: 'update_registration_status',
          hawkerid: this.hawkerDetails.contactid,
          registrationstatus: 'Pending-Supervisor',
          hawkerstatusid: 15,
        }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.common.snackbar("Saved Success", "success");


      } else {
        this.common.snackbar("General Error", "error");

      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("Add Error", "error");
      })

  }

  updateStatusRegistration() {
    let obj = {
      data: {
        spname: 'usp_unfyd_haw_approval_process',
        parameters: {
          flag: 'INSERT',
          status: 15,
          hawkerid: this.hawkerDetails.contactid,
          processid: this.userDetails.processid,
          productid: this.userDetails.productid,
          approvedby: this.userDetails.UserName,
          role: this.userDetails.role,
          createdby: this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) { }
    })
  }


  keepOrder = (a) => {
    return a;
  }

  print(data) {
    var tempData = {
      'Registration No': this.hawkerDetails.contactid,
      'First Name': this.hawkerDetails.hawkerfirstname,
      ...data
    }

    this.common.setPrint('receipt', tempData);
    setTimeout(() => {
      window.print()
    }, 100);
  }

  clearPanel() {
    this.fees = [];
    this.chipDisable = false;
    this.paymentDropdown = [];
    this.paymentPanel = false;
    this.month = [];
    this.dueForPanel = false;
    this.referencePanel = false;
    this.feeStructure = [];
    this.tempGstAmount = 0;
    this.gstAmount = 0;
    this.tempGstPercent = 0;
    this.gstPercent = 0;
    this.tempTotalAmt = 0;
    this.totalAmt = 0;
    this.advanceFee = 0;
    this.amtPayable = 0;
    this.form.get('feeType').setValue('');
    this.form.get('paymentType').setValue('');
    this.form.get('dueFor').setValue('');
    this.form.get('paymentMode').setValue(this.masterConfig?.paymentMode[0].Key);
    this.form.get('referenceNo').setValue('');
  }

  close() {
    this.common.closeComponent();
  }

  getFilter() {
    this.common.getItemsPerPage$.subscribe(getItemsPerPage => {
      this.itemsPerPage = getItemsPerPage
    })
    this.common.getSearch$.subscribe(getSearch => {
      this.search = getSearch
    });
  }

  openDialog(type, data) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data
      },
      width: '748px'
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status !== undefined) {
        // this.common.snackbar(status);
      }
    });
  }

  manageLastTransaction(paymentmode, lastfeetype) {
    // var lastfeeamt = this.registrationTotal !== 0 ? this.registrationTotal : this.totalAmt;
    var obj = {
      data: {
        spname: "usp_unfyd_haw_payment_details",
        parameters: {
          flag: 'INSERT',
          hawkerid: this.hawkerDetails.contactid,
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
          roletype: this.userDetails.RoleType,
          usersubtype: '',
          paymentmode: paymentmode,
          lastfeetype: lastfeetype,
          ...this.transactionDetails,
          gstamt: this.gstAmount * 2,
          gstper: this.gstPercent * 2,
          advancedamt: this.registrationAdvance,
          discountamt: this.discount,
          discountper: null,
          penalityamt: this.penalty,
          createdby: this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
      } else {

      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error", "error");
      })
  }


  getDiscount() {
    let obj = {
      data: {
        spname: 'usp_unfyd_haw_discount',
        parameters: {
          flag: 'EDIT',
          hawkerid: this.hawkerDetails.contactid,
        }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        // this.discount = res.results.data[0].DiscountAmt
        this.discount = Object.keys(res.results.data).length == 0 ? 0 : res.results.data[0]?.DiscountAmt;
        this.penalty = Object.keys(res.results.data).length == 0 ? 0 : res.results.data[0]?.PenaltyAmount;
        // this.common.snackbar(res.results.data[0].result);
      } else {
        // this.common.snackbar(res.results.data[0].result);
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error", "error");
      })
  }

  getReactivation() {

    let obj = {
      data: {
        spname: 'usp_unfyd_haw_payment_details',
        parameters: {
          flag: 'GET_HAW_REACTIVATION_FEE',
          hawkerid: this.hawkerDetails.contactid,
        }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.reactivation = Object.keys(res.results.data).length == 0 ? 0 : res.results.data[0]?.ReactivationFee;
        // this.common.snackbar(res.results.data[0].result);
      } else {
        // this.common.snackbar(res.results.data[0].result);
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error", "error");
      })

  }

  paymentDocument: any = '';
  getAttachment() {
    this.viewDocument('Payment Reference', '')
    this.common.getSingleImage$.subscribe(res => {
      if (res?.Category == 'Payment Reference') {
        this.paymentDocument = res;
      }
    })
    this.common.getIndividualUpload$.subscribe(res => {
      if (res.Category == 'Payment Reference') {
        // this.form.get('policeclearcertstatus').setValue(res.status == false ? false : true);
        this.paymentDocument = res;
      }
      // this.form.updateValueAndValidity();
    })
  }

  viewDocument(val, type) {
    var data = {
      type: type,
      processid: this.userDetails.Processid,
      category: val,
      contactid: this.hawkerDetails.contactid,
    }
    this.common.setSingleImage(data)
  }

  uploadDocument(event, imgData, category) {
    var data = {
      flag: imgData !== '' ? 'UPDATE' : 'INSERT',
      documentId: imgData !== '' ? imgData.Actionable : '',
      category: category,
      createdby: imgData !== '' ? imgData['Created By'] : this.userDetails.Id,
      modifiedby: imgData !== '' ? this.userDetails.Id : null,
      hawkerid: this.hawkerDetails.contactid,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUpload(data)
    }
  }
}
