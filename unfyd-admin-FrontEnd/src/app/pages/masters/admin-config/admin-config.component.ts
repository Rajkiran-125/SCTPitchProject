import { Component, ElementRef, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";
import { ApiService } from "src/app/global/api.service";
import { Location } from "@angular/common";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { masters, regex } from "src/app/global/json-data";
import { Subscription } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-admin-config",
  templateUrl: "./admin-config.component.html",
  styleUrls: ["./admin-config.component.scss"],
})
export class AdminConfigComponent implements OnInit {
  loader: boolean = false;
  submittedForm = false;

  form: FormGroup;
  requestObj: { data: { spname: string; parameters: any } };
  skillId: any;
  userDetails: any;
  masters: any = masters;
  displayedColumns: string[] = ["Key", "Value"];
  displayedFields: string[] = this.displayedColumns.slice();
  myformArray: any = new FormArray([
    new FormGroup({
      Key: new FormControl(""),
      Value: new FormControl(""),
    }),
  ]);
  JSONField: boolean;
  TextField: boolean;
  selectedValue: any;
  path: string;
  disabledValue: boolean;
  minMessage: any;
  maxMessage: any;
  maxMessage1: any;
  role: any;
  userConfig: any;
  configName: any;
  isEdit: any;
  field: any;
  subscription: Subscription[] = [];
  labelName: any;
  reset: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    public dialog: MatDialog,
    private el: ElementRef,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.common.hubControlEvent('AdminConfig','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser(); 
    this.role = this.userDetails["Role"];
    this.minMessage = masters.MinLengthMessage;
    this.isEdit = true;
    const reg = "(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?";
    this.form = this.formBuilder.group({
      ConfigName: ["", [Validators.required, Validators.maxLength(100)]],
      ConfigValue: ["", Validators.required],
      ConfigStatus: [1, Validators.required],

      EDITABLE: 0,
      Category: ["", Validators.required],
      ControlType: ["", Validators.required],
      Description: [""],
      APPNAME: [""],
      KEYDISPLAYSTATUS: 0,

      CREATEDBY: 5,
      MODIFIEDBY: 5,
      DELETEDBY: 5,

      publicip: [this.userDetails.ip, Validators.nullValidator],
      browsername: [this.userDetails.browser, Validators.nullValidator],
      browserversion: [
        this.userDetails.browser_version,
        Validators.nullValidator,
      ],
      processid: [1, Validators.nullValidator],
      productid: [this.userDetails.ProductId, Validators.nullValidator],
    });
    this.common.setUserConfig(this.userDetails.ProfileType, 'AdminConfig')
    this.subscription.push( this.common.getUserConfig$.subscribe(data => {
      this.userConfig = data;
    }));
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }));
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.skillId = this.activatedRoute.snapshot.paramMap.get("id");

    if (this.skillId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_adminconfig",
          parameters: {
            flag: "EDIT",
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
            Id: this.skillId,
          },
        },
      };
      this.api.post("index", Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          if (res.results.data[0].ControlType == "JSON") {
            this.JSONField = true;
            let GetConfigValue = JSON.parse(res.results.data[0].ConfigValue);
            this.selectedValue = "JSON";
            for (let i = 0; i < GetConfigValue.length - 1; i++) {
              const newGroup = new FormGroup({});
              this.displayedFields.forEach(x => {
                newGroup.addControl(x, new FormControl());
              });
              this.myformArray.push(newGroup);
            }
            this.myformArray.setValue(GetConfigValue);
          }
          this.form.get("ConfigName").disable();
          this.isEdit = !this.isEdit;
          this.form.patchValue(res.results.data[0]);
          this.form.updateValueAndValidity();
          this.configName = res.results.data[0].ConfigName;
        }
      });
    } else {
      this.loader = false;
      this.router.navigate(["/masters/adminConfig/add"]);
    }
    this.common.hubControlEvent('AdminConfig','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('AdminConfig','click','pageloadend','pageloadend',JSON.stringify(data),'setLabelByLanguage');

    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'AdminConfig', data)
  }
  delete(index: number) {
    this.myformArray.removeAt(index);
  }

  add() {
    const newGroup = new FormGroup({});
    this.displayedFields.forEach(x => {
      newGroup.addControl(x, new FormControl());
    });
    this.myformArray.push(newGroup);
  }

  get f() {
    return this.form.controls;
  }
  onOptionsSelected(e) {
    this.common.hubControlEvent('AdminConfig','click','','',e,'onOptionsSelected');

    this.configName = this.form.get('ConfigName').value;
    this.selectedValue = e.value;
    if (this.selectedValue == "JSON") {
      this.disabledValue = true;
      this.openDialog("JSONTable", this.myformArray, this.displayedFields, this.configName);
    } else if (this.selectedValue == "Text") {
      this.form.get("ConfigValue").reset();
    }
  }
  InputClick() {
    this.common.hubControlEvent('AdminConfig','click','','','','InputClick');

    if (this.selectedValue == "JSON") {
      this.JSONField = true;
      this.openDialog("JSONTable", this.myformArray, this.displayedFields, this.configName);
    }
  }
  openDialog(type, data, displayCol, configname) {
    // this.common.hubControlEvent('AdminConfig','click','','',JSON.stringify(data),'openDialog');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
        displayedFields: displayCol,
        config: configname
      },
      width: "60%",
    });
    dialogRef.afterClosed().subscribe(status => {
      if(status === true){
      this.myformArray.value.forEach(element => {
        if ((element.Key !== '' || element.Value !== '') && (element.Key !== "" || element.Value !== "")
          && (element.Key !== null || element.Value !== null) && (element.Key !== undefined || element.Value !== undefined)) {
          this.form
            .get("ConfigValue")
            .patchValue(JSON.stringify(this.myformArray.value));
        }
        else {
          this.form.get('ConfigValue').reset();
        }
      });
    }
    if(status === false){
      let data = this.form.get("ConfigValue").value;
      this.form.get("ConfigValue").patchValue(data);
      this.form.updateValueAndValidity();
      let arraydata = JSON.parse(data)
      arraydata.forEach( (element,i) => {
          this.myformArray.controls[i].controls['Key'].patchValue(arraydata[i].Key)
          this.myformArray.controls[i].controls['Value'].patchValue(arraydata[i].Value)
          // if(this.myformArray.length > arraydata.length){
          //   for(i == arraydata.length; i > arraydata.length; i++ ){
          //   this.myformArray.removeAt(i);}
          //   console.log(this.myformArray.length)
          //   console.log(arraydata.length);
            
          // }
     })
    }
      if (status !== undefined) {
      }
    });
  }
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get("id");

    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_contact_kyc_fileurl",
          parameters: {
            flag: "GET",
            processid: this.userDetails.Processid,
            productid: 1,
            contactid: this.path,
          },
        },
      };
      this.common.hubControlEvent('AdminConfig','click','','',JSON.stringify(this.requestObj),'getSnapShot');

      this.api.post("index", this.requestObj).subscribe(
        (res) => {
          this.loader = false;
          if (res.code == 200) {
            this.loader = false;
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
  ResetForm() {
    this.common.hubControlEvent('AdminConfig','click','','','','ResetForm');

    this.myformArray.reset();
    this.form.reset();
  }

  back(): void {
    this.common.hubControlEvent('AdminConfig','click','back','back','','back');

    this.location.back();
  }
  submit(): void {
    if (this.selectedValue == "JSON") {
      this.form.value.ConfigValue = JSON.stringify(this.myformArray.value);
    }

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

    if (this.skillId == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_adminconfig",
          parameters: {
            flag: "INSERT",
            ...this.form.value,
          },
        },
      };
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_adminconfig",
          parameters: {
            flag: "UPDATE",
            ID: this.skillId,
            MODIFIEDBY: this.userDetails.EmployeeId,
            ...this.form.value,
          },
        },
      };
    }
    this.common.hubControlEvent('AdminConfig','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post("index", this.requestObj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.router.navigate(["masters/adminConfig"]);
          this.common.snackbar("Saved Success");
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
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
