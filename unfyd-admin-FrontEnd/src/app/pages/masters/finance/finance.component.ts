import { Component, ElementRef, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";
import { ApiService } from "src/app/global/api.service";
import { regex, masters } from "src/app/global/json-data";
import { Location } from '@angular/common'

@Component({
  selector: "app-finance",
  templateUrl: "./finance.component.html",
  styleUrls: ["./finance.component.scss"],
})
export class FinanceComponent implements OnInit {
  loader: boolean = false;
  financeId: any;
  userDetails: any;
  regex: any;
  hawkerSteps: string[] = [];
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  newDate = new Date();
  masters: any;
  minMessage: any;
  maxMessage: any;
  maxMessage1: any;
  labelName: any;
  reset: boolean;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public datepipe: DatePipe,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    private el: ElementRef,
  ) {
    Object.assign(this, { regex, masters });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('finance','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.loader = true;
    this.minMessage = masters.MinLengthMessage;
    this.maxMessage = masters.MaxLengthMessage1;
    this.form = this.formBuilder.group({
      HawkerID: ["", Validators.nullValidator],
      ApplicantID: ["", Validators.required],
      // RegistrationNo: ["", Validators.nullValidator],
      HawkerFirstName: ["", [Validators.pattern(regex.char), Validators.maxLength(100)]],
      HawkerMiddleName: ["", [Validators.pattern(regex.char), Validators.maxLength(100)]],
      HawkerLastName: ["", [Validators.pattern(regex.char), Validators.maxLength(100)]],
      CurrentOutstanding: [0, Validators.nullValidator],
      FeeType: ["", Validators.required],
      DueFor: ["", Validators.nullValidator],
      LateFeeCharges: [0, Validators.pattern(regex.numeric)],
      AmountToBePaid: ["", Validators.nullValidator],
      TransactionDateTime: ["", Validators.nullValidator],
      TransactionRefNo: ["", Validators.nullValidator],
      PaymentReceivedBy: ["", Validators.nullValidator],
      PaymentStatus: ["", Validators.nullValidator],
      PaymentMode: ["", Validators.nullValidator],
      ContactID: ["", Validators.nullValidator],
    });

    this.financeId = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.financeId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_haw_finance",
          parameters: {
            flag: "EDIT",
            processid: this.userDetails.Processid,
            productid: 1,
            Id: this.financeId,
          },
        },
      };
      this.api.post("index", Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          // const myObjLower = this.common.ConvertKeysToLowerCase();
          this.form.patchValue(res.results.data[0]);
          this.form.get('TransactionRefNo').patchValue(res.results.data[0].TransactionReferenceNumber)
          this.form.updateValueAndValidity();
        }
      });
    } else {
      this.loader = false;
      this.router.navigate(["/masters/finance/add"]);
    }
    this.common.hubControlEvent('finance','click','pageloadend','pageloadend','','ngOnInit');

  }

  config: any;
  getSnapShot() {
    this.common.hubControlEvent('finance','click','pageloadend','pageloadend','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'finance');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('finance','click','pageloadend','pageloadend',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'Finance', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('finance','click','back','back','','back');

    this.location.back()
  }
  submit(): void {
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

    if (this.financeId == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_finance",
          parameters: {
            flag: "INSERT",
            ...this.form.value,
            CREATEDBY: this.userDetails.Id,
            ProcessId: this.userDetails.Processid,
            ProductId: 1,
            publicip: this.userDetails.ip,
            privateip: "",
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
          },
        },
      };
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_finance",
          parameters: {
            flag: "UPDATE",
            ...this.form.value,
            ID: this.financeId,
            MODIFIEDBY: this.userDetails.Id,
          },
        },
      };
    }
    this.common.hubControlEvent('finance','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post("index", this.requestObj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.router.navigate(["masters/finance"]);
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
