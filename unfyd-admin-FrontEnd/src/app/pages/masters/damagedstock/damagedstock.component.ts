import { Component, ElementRef, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { AbstractControl,FormBuilder,FormGroup,Validators} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";
import { ApiService } from "src/app/global/api.service";
import { regex,masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'

@Component({
  selector: "app-damagedstock",
  templateUrl: "./damagedstock.component.html",
  styleUrls: ["./damagedstock.component.scss"],
})
export class DamagedstockComponent implements OnInit {
  loader: boolean = false;
  damagedstockId: any;
  userDetails: any;
  regex: any;
  hawkerSteps: string[] = [];
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  newDate = new Date();
  masters:any;
  ddgst: any;
  minMessage:any;
  maxMessage:any;
  maxMessage1:any;
  ddcenterdata: any;
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
    Object.assign(this, { masters});
  }
  
  ngOnInit(): void {
    this.common.hubControlEvent('damagedstock','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.loader = true;
    this.getSnapShot();
    this.getCenterMaster();
    this.minMessage = masters.MinLengthMessage;
    this.maxMessage = masters.MaxLengthMessage1;	
	this.maxMessage1 = masters.MaxLengthMessage2;
    this.form = this.formBuilder.group({
      clientproductid: ["", Validators.nullValidator],
      productuserid: ["", Validators.nullValidator],
      producttype: ["", Validators.required],
      productcode: ["", Validators.required],
      productname: ["", [Validators.pattern(regex.char),Validators.maxLength(100)]],
      productdesc: ["", Validators.required],
      productsize: ["", Validators.nullValidator],
      productdamagedqty: ["", Validators.pattern(regex.numeric)],
      productdamagedcategory: ["", Validators.required],
      remarks: ["", Validators.nullValidator],
      productrate: ["", Validators.pattern(regex.numeric)],
      productgst: ["", Validators.required],
      productcenter: ["", Validators.nullValidator],
      productstatus: ["", Validators.nullValidator],

    });

    this.common.getGST(this.userDetails.Processid, 1).subscribe(res => {
      this.ddgst = res
    });
    this.damagedstockId = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.damagedstockId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_damagedstock",
          parameters: {
            flag: "EDIT",
            processid: this.userDetails.Processid,
            productid: 1,
            Id: this.damagedstockId,
          },
        },
      };
      this.api.post("index", Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          const myObjLower = this.common.ConvertKeysToLowerCase();
          this.form.patchValue(myObjLower(res.results.data[0]));
          this.form.get('productgst').patchValue(myObjLower(res.results.data[0].HSNCode))
          this.form.updateValueAndValidity();
        }
      });
    } else {
      this.loader = false;
      this.router.navigate(["/masters/damagedstock/add"]);
    }
    this.common.hubControlEvent('damagedstock','click','pageloadend','pageloadend','','ngOnInit');

  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('damagedstock','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'DamagedStock', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('damagedstock','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
        this.common.setUserConfig(this.userDetails.ProfileType, 'damagedstock');
        this.common.getUserConfig$.subscribe(data => {
            this.config = data;
          });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"));
}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('damagedstock','click','back','back','','back');

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

    if (this.damagedstockId == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_damagedstock",
          parameters: {
            flag: "INSERT",
            CREATEDBY: this.userDetails.EmployeeId,
            ProcessId: this.userDetails.Processid,
            ProductId: 1,
            publicip: this.userDetails.ip,
            privateip: this.userDetails.ip,
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
            ...this.form.value,
          },
        },
      };
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_damagedstock",
          parameters: {
            flag: "UPDATE",
            ID: this.damagedstockId,
            MODIFIEDBY: this.userDetails.EmployeeId,
            ...this.form.value,
          },
        },
      };
    }
    this.common.hubControlEvent('damagedstock','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post("index", this.requestObj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.router.navigate(["masters/damagedstock"]);
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
  getCenterMaster() {
    let Obj = {
        data: {
          spname: "usp_unfyd_product_center",
          parameters: {
              flag: "GET",
              processid: 1,
              productid: 1
          }
      }
    }
    this.common.hubControlEvent('damagedstock','click','','',JSON.stringify(Obj),'getCenterMaster');

    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        this.ddcenterdata = res.results.data;
      }
    })
  }
}
