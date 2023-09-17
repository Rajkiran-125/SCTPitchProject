import { Component, OnInit, Output, EventEmitter, Input, ElementRef } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  ValidationErrors
} from "@angular/forms";
import { AuthService } from "src/app/global/auth.service";
import { CommonService } from "src/app/global/common.service";
import { ApiService } from "src/app/global/api.service";
import { checknull, checknull1, unfydMaster, } from "src/app/global/json-data";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";


// export class noSpaceValidator {
//     static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
//         if((control.value as string).indexOf(' ') === 0){
//             return {cannotContainSpace: true}
//         }

//         return null;
//     }
// }

export class noSpaceValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value && (control.value as string).indexOf(' ') === 0) {
      return { cannotContainSpace: true }
    }

    return null;
  }
}

// export class nullSpaceValidator{
//   static nullSpaceContain(control:AbstractControl): spacValidationErrors |null {
// if((control.value as string).indexOf('')<=3){}
//   }
// }

// export function checknull1(controlName) {
//   return (formGroup: FormGroup) => {
//     const checkspace1 = formGroup.controls[controlName]

//     if (checkspace1.errors) {
//       return;
//     }

//     if (checkspace1.value.length > 0) {
//       // return null;

//       if (checkspace1.value.trim('').length < 3) {
//         checkspace1.setErrors({ checknull1: true });
//       }
//       else {
//         checkspace1.setErrors(null);
//       }
//       if(checkspace1.value.length < 0){
//         return null;
//       }
//     }

//     //  if (checkspace1.value.trim('').length < 3) {
//     //     checkspace1.setErrors({ checknull: true });}
//     //  else {
//     //    checkspace1.setErrors(null);
//     //   }

//     // if(checkspace1.value.length>=0){
//     //   return null;
//     // }

//   }
//   return null;
// }


// export function noSpaceValidator(controlName,controlName){
//   return(formGroup:FormGroup) => {
//     const checkspace = formGroup.controls[controlName]

//     if (checkspace.errors) {
//        return;
//       }

//  if (checkspace.value.trim('').length === 0) {
//     checkspace.setErrors({ checknull: true });}
//  else {
//    checkspace.setErrors(null);
//   }
//   }
//     return null;
//  }




@Component({
  selector: "app-unfyd-master-form",
  templateUrl: "./unfyd-master-form.component.html",
  styleUrls: ["./unfyd-master-form.component.scss"],
})
export class UnfydMasterFormComponent implements OnInit {
  @Output() close: any = new EventEmitter<any>();
  @Input() Id: any;
  @Input() formName: any;
  @Input() selectedTab: any = '';
  @Input() masterName: any;
  form: FormGroup;
  formSubSubDisposition: FormGroup;
  formSubDisposition: FormGroup;
  formOnlineHrs: FormGroup;
  formOfflineDays: FormGroup;
  onlineFields: FormGroup;
  submittedForm: boolean = false;
  loader: boolean = false;
  formData: any = null;
  unfydMaster: any;
  userDetails: any;
  dispositionData: any;
  subDispositionData: any;
  subDispositionValues: any = [];
  addNewFields = false;
  addImage = false;
  profileImg: any = null;
  profileDocument: any = '';
  category: any;
  editObj: any;
  masterSelected: boolean = false;
  item: any;
  icons: any = [];
  ImgLoader: boolean = false;
  contactCenterLocation: any = [];
  public filteredList3 = this.contactCenterLocation.slice();

  requestObj: any;
  holidayImg: any;
  isDisabled = false;
  channelType: any;
  subscription: Subscription[] = [];
  labelName: any;
  iconimg: any;
  type: any;
  uploadimage: any;
  userConfig: any;
  channel: any;
  language: any;
  subscriptionAcitivateData: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>, private common: CommonService, private formBuilder: FormBuilder,
    private api: ApiService, private auth: AuthService, public dialog: MatDialog, private activatedRoute: ActivatedRoute, private el: ElementRef,

    private router: Router, public datepipe: DatePipe,) {
    Object.assign(this, { unfydMaster });

    // constructor(private common: CommonService, private formBuilder: FormBuilder,
    //   private api: ApiService, private auth: AuthService, public dialog: MatDialog,private activatedRoute: ActivatedRoute,
    //   private router: Router) {
    //   Object.assign(this, { unfydMaster });
  }
  ngOnInit(): void {
    this.subscription.push(this.common.configView$.subscribe(res => {
      if (res != false) {
        this.channel = res.channel
        this.language = res.language
      }
    }))
    console.log("id:", this.Id, "\n selctedtab:", this.selectedTab, "\nform:", this.formName, "\nmastername:", this.masterName);

    // console.log('unfydMaster',unfydMaster)
    // this.getDispositionData();
    // this.getSubDispositionData();
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.common.setUserConfig(this.userDetails.ProfileType, 'BusinessHours');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
      // console.log(data);

    }))
    this.common.getIndividualUpload$.subscribe(res => {
      this.profileImg = res.status.attachmenturl;
    });
    if (this.masterName == 'BusinessHours') {
      this.getChannel();
      this.getContactCenter();
      if (this.selectedTab == 'Online Hours') {
        this.formOnlineHrs = this.formBuilder.group({
          sendText: [false, Validators.nullValidator],
          photographstatus: [false, Validators.nullValidator],
          businessUnit: [1, Validators.nullValidator],
          onHrs: this.formBuilder.array([
            this.newOnHrs(),
          ]),
        });
      }
      else if (this.selectedTab == 'Offline Days') {
        this.formOfflineDays = this.formBuilder.group({
          sendText: [0, Validators.nullValidator],
          photographstatus: [false, Validators.nullValidator],
          businessUnit: [1, Validators.nullValidator],
          enable: [false, Validators.nullValidator],
          odDays: this.formBuilder.array([
            this.newOdDays()
          ]),
        },
          // {validator:[checknull('Groupname'),checknull('Categoryname'),checknull('subcategoryname')]},

        );
      }
    }
    this.getInfoById(this.Id);
  }

  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false
      // console.log(data1);
      this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ConfigManager', data)
  }
  config: any;
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let skillId = 'ConfigManager'
      this.common.setUserConfig(this.userDetails.ProfileType, skillId);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
      }))
    });
  }
  checkUncheckAll(event, index: any) {
    let arrayControl = this.odDays().at(index).get('checkBox') as FormArray;
    arrayControl.controls.forEach(element => {
      element.patchValue(event.checked)
    });
    this.odDays().at(index).get('masterSelected').patchValue(event.checked);
  }

  // Check All Checkbox Checked
  isAllSelected(event, index, checkIndex) {
    let arrayControl = this.odDays().at(index).get('checkBox') as FormArray;
    arrayControl.controls.forEach((element, i) => {
      if (i == checkIndex) {
        element.patchValue(event.checked)
      }
    });
    this.masterSelected = arrayControl.controls.every(function (item: any) {
      if (item.value == true) {
        return true;
      } else {
        return false
      }
    });
    if (this.masterSelected == true) {
      this.odDays().at(index).get('masterSelected').patchValue(true);
    } else {
      this.odDays().at(index).get('masterSelected').patchValue(false);
    }
  }

  onHrs(): FormArray {
    return this.formOnlineHrs.get("onHrs") as FormArray
  }

  newOnHrs(): FormGroup {
    return this.formBuilder.group({
      day: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    },
      // {validator:[checknull('message'),checknull('day')]},
      { validator: [checknull1('message')] }
    );
  }
  addOnHrs() {
    this.onHrs().push(this.newOnHrs());
  }

  removeOnHrs(i: number) {
    this.onHrs().removeAt(i);
  }

  odDays(): FormArray {
    return this.formOfflineDays.get("odDays") as FormArray
  }
  newOdDays(): FormGroup {
    return this.formBuilder.group({
      day: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      masterSelected: new FormControl(false, [Validators.nullValidator]),
      checkBox: this.formBuilder.array([
        new FormControl(false, [Validators.nullValidator]),
        new FormControl(false, [Validators.nullValidator]),
        new FormControl(false, [Validators.nullValidator]),
        new FormControl(false, [Validators.nullValidator]),
        new FormControl(false, [Validators.nullValidator]),
      ], this.requireCheckboxesToBeCheckedValidator())
    },

      { validator: [checknull1('message')] },
    );
  }
  requireCheckboxesToBeCheckedValidator(minRequired = 1): ValidatorFn {
    return function validate(formGroup: FormGroup) {
      let checked = 0;

      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.controls[key];

        if (control.value === true) {
          checked++;
        }
      });

      if (checked < minRequired) {
        return {
          requireCheckboxesToBeChecked: true,
        };
      }

      return null;
    };
  }
  newOdDaysCheckBox(index): FormArray {
    return this.odDays().at(index).get('checkBox') as FormArray;
  }

  addOdDays() {
    this.odDays().push(this.newOdDays())
  }
  removeOdDays(i: number) {
    this.odDays().removeAt(i);
  }
  uploadDocument(event, category) {
    this.category = category;
    var data = {
      category: category,
      flag: "INSERT",
      createdby: this.userDetails.Id,
      ...this.userDetails
    }
    if (event == true) {
      this.common.individualUpload(data)
      // console.log('data',data)
      // console.log('data',data)
    }
  }



  flip() {
    // console.log('this.form.value.enable',this.form.value.enable);
    this.isDisabled = !this.isDisabled;
  }





  directUpload(event) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_holiday_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {
      this.common.snackbar("File Size");
    } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    }
    else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          // const img_height = rs.currentTarget['height'];
          // const img_width = rs.currentTarget['width'];

          // if  {
          this.ImgLoader = true;
          this.api.post('upload', formData).subscribe(res => {
            if (res.code == 200) {
              this.holidayImg = res.results.URL;
              if (this.selectedTab == 'Offline Days' && this.masterName == 'BusinessHours') {
                this.formOfflineDays.get('photographstatus').patchValue(res.results.URL)
              }
              this.ImgLoader = false;
              // console.log('this.holidayImg',this.holidayImg)
            }
          });
          // }
        };
      };
      reader.readAsDataURL(file);
    }
  }



  showImage(event) {

    // console.log('showImage',event)
    // if (event != 0) {
    //   this.addImage = true;
    // } else if (event == 0) {
    //   this.addImage = false;
    // }

    // console.log('formvalue',this.formOnlineHrs.value.sendText)
    if (this.formOnlineHrs.value.sendText != true) {
      this.addImage = true;
    } else if (this.formOnlineHrs.value.sendText == true) {
      this.addImage = false;
    }
  }

  getDispositionData() {
    let obj = {
      data: {
        spname: "usp_unfyd_adm_dispositions",
        parameters: {
          FLAG: "GETALLDISPOSITION",
          PROCESSID: this.unfydMaster?.disposition?.businessUnit[0].processid,
          LANGUAGECODE: unfydMaster?.disposition.language[0].languageID,
        },
      },
    };
    this.api.post("index", obj).subscribe(
      (res) => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          this.dispositionData = res.results.data;
        } else {
          this.loader = false;
        }
      },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      });
  }

  getSubDispositionData() {
    let obj = {
      data: {
        spname: "usp_unfyd_adm_dispositions",
        parameters: {
          FLAG: "GET_SUBDISPOSITION",
          PROCESSID: this.unfydMaster?.disposition?.businessUnit[0].processid,
          LANGUAGECODE: unfydMaster?.disposition.language[0].languageID,
        },
      },
    };
    this.api.post("index", obj).subscribe(
      (res) => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          this.subDispositionData = res.results.data;
        } else {
          this.loader = false;
        }
      },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      });
  }


  getChannel() {
    let obj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', obj).subscribe((res: any) => {
      this.channelType = res.results['data']
      // console.log('this.channelType ',this.channelType )
    });
  }


  getContactCenter() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_cc_location',
        parameters: {
          flag: 'GET',
          processid: this.userDetails.Processid,
          productid: 1
        },
      },
    };

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.contactCenterLocation = res.results['data'];
      this.filteredList3 = this.contactCenterLocation.slice();
      // this.form.controls['cclocationid'].patchValue(this.contactCenterLocation[0].Actionable);
    })
  }

  getInfoById(id: any) {
    let obj: any
    if (id != null) {
      if (this.masterName == 'dispositions') {
        obj = {
          data: {
            spname: "usp_unfyd_adm_dispositions",
            parameters: {
              FLAG: this.selectedTab == 'Dispositions' ? "GETDISPOSITIONBYID" :
                this.selectedTab == 'Sub Dispositions' ? "GETSUBDISPOSITIONBYID" :
                  this.selectedTab == 'Sub Sub Dispositions' ? "GET_SUBSUBDISPOSITIONBYID" : 'GETDISPOSITIONBYID',
              ID: id,
            },
          }
        }
      } else if (this.masterName == 'BusinessHours') {
        obj = {
          data: {
            spname: "usp_unfyd_adm_offline",
            parameters: {
              FLAG: this.selectedTab == 'Online Hours' ? "OFFLINEHRSBYID" :
                this.selectedTab == 'Offline Days' ? "OFFLINEDAYSBYID" : "OFFLINEDAYSBYID",
              ID: id,
            },
          }
        }
      }
      this.api.post("index", obj).subscribe(
        (res) => {
          this.loader = false;
          if (res.code == 200) {
            this.formData = res.results.data[0];
            this.loader = false;
            if (this.formName == 'edit' && this.masterName == 'dispositions') {
              this.form = this.formBuilder.group({
                businessUnit: [1, Validators.required],
                language: ['en', Validators.required],
                dispositionName: [this.formData?.DispostionName, Validators.required],
                description: [this.formData?.DispositionDesc, Validators.required]
              });
              this.formSubDisposition = this.formBuilder.group({
                businessUnit: [this.formData?.ProcessId, Validators.required],
                language: [this.formData?.LanguageCode, Validators.required],
                dispositionName: [this.formData?.DispositionId, Validators.required],
                subDispositionName: [this.formData?.SubDispositionName, Validators.required],
                description: [this.formData?.SubDispositionDesc, Validators.required]
              });
              this.formSubSubDisposition = this.formBuilder.group({
                businessUnit: [this.formData?.ProcessId, Validators.required],
                language: [this.formData?.LanguageCode, Validators.required],
                dispositionName: [this.formData?.DispositionId, Validators.required],
                subDispositionName: [this.formData?.subdispositionId, Validators.required],
                subSubDispositionName: [this.formData?.subsubdispositionName, Validators.required],
                description: [this.formData?.SubsubdispositionDesc, Validators.required]
              });
              let refreshIntervalId = setInterval(() => {
                if (this.dispositionData) {
                  clearInterval(refreshIntervalId);
                  this.dispositionData.forEach(element => {
                    if (element.Id == this.formSubSubDisposition.value.dispositionName) {
                      this.subDispositionValues = [];
                      this.subDispositionData.forEach(element1 => {
                        if (element1.Disposition == element.Disposition) {
                          this.subDispositionValues.push(element1)
                        }
                      });
                    }
                  });
                }
              }, 1000);
            } else if (this.formName == 'edit' && this.masterName == 'BusinessHours') {
              if (this.selectedTab == 'Online Hours') {
                // this.formOnlineHrs.get('channel').patchValue(this.formData?.ChannelId);
                // this.formOnlineHrs.get('location').patchValue(this.formData?.LocationId);
                var startime = (this.formData?.OfflineStartTime).split(':');
                let start = ({ 'hr': startime[0], 'min': startime[1] });
                var StartTime = new Date();
                StartTime.setHours(start.hr, start.min);
                var endtime = (this.formData?.OfflineEndTime).split(':');
                let end = ({ 'hr': endtime[0], 'min': endtime[1] });
                var EndTime = new Date();
                EndTime.setHours(end.hr, end.min);
                var arrayControl = this.formOnlineHrs.get('onHrs') as FormArray;
                arrayControl.controls.forEach((element, index) => {
                  (arrayControl.at(index) as FormGroup).get('day').patchValue(this.formData?.OfflineHrsDay);
                  (arrayControl.at(index) as FormGroup).get('startTime').patchValue(StartTime);
                  (arrayControl.at(index) as FormGroup).get('endTime').patchValue(EndTime);
                  (arrayControl.at(index) as FormGroup).get('message').patchValue(this.formData?.OfflineMessage);
                });


                this.formOnlineHrs.get('sendText').patchValue(this.formData?.ImageEnable);
                this.holidayImg = this.formData?.ImageHostPath;
                this.isDisabled = this.formData?.ImageEnable;
                this.formOnlineHrs.updateValueAndValidity();
              } else if (this.selectedTab == 'Offline Days') {
                // this.formOfflineDays.get('channel').patchValue(this.formData?.ChannelId);
                // this.formOfflineDays.get('location').patchValue(this.formData?.LocationId);
                var arrayControl = this.formOfflineDays.get('odDays') as FormArray;
                arrayControl.controls.forEach((element, index) => {
                  (arrayControl.at(index) as FormGroup).get('day').patchValue(this.formData?.OfflineDay);
                  (arrayControl.at(index) as FormGroup).get('message').patchValue(this.formData?.OfflineMessage);
                  (arrayControl.at(index) as FormGroup).get('masterSelected').patchValue(this.formData?.AllDay)
                  let checkArrayControl = arrayControl.at(index).get('checkBox') as FormArray;
                  checkArrayControl.controls.forEach((element, i) => {
                    let key = i == 0 ? 'FirstDay' : i == 1 ? 'SecondDay' : i == 2 ? 'ThirdDay'
                      : i == 3 ? 'FourthDay' : i == 4 ? 'FifthDay' : '';
                    element.patchValue(this.formData?.[key]);
                  });
                });
                this.formOfflineDays.get('sendText').patchValue(this.formData?.ImageEnable);
                this.formOfflineDays.get('enable').patchValue(this.formData?.ImageEnable);
                this.holidayImg = this.formData?.ImageHostPath;
                // this.isDisabled = this.holidayImg == undefined ||this.holidayImg == '' || this.holidayImg == null ? false : true;
                this.isDisabled = this.formData?.ImageEnable;
                this.formOfflineDays.updateValueAndValidity();
              }
            }
          } else {
            this.loader = false;
          }
        }, (error) => {
          this.loader = false;
          this.common.snackbar(error.message, "error");
        });
    } else {
      this.formData = ' '
      if (this.formName == 'add' && this.masterName == 'dispositions') {
        this.form = this.formBuilder.group({
          businessUnit: [unfydMaster?.disposition?.businessUnit[0].processid, Validators.required],
          language: [unfydMaster?.disposition.language[0].languageID, Validators.required],
          dispositionName: ['', Validators.required],
          description: ['', Validators.required]
        });
        this.formSubDisposition = this.formBuilder.group({
          businessUnit: [unfydMaster?.subDisposition?.businessUnit[0].processid, Validators.required],
          language: [unfydMaster?.subDisposition?.language[0].languageID, Validators.required],
          dispositionName: ['', Validators.required],
          subDispositionName: ['', Validators.required],
          description: ['', Validators.required]
        });
        this.formSubSubDisposition = this.formBuilder.group({
          businessUnit: [unfydMaster?.subSubDisposition?.businessUnit[0].processid, Validators.required],
          language: [unfydMaster?.subSubDisposition?.language[0].languageID, Validators.required],
          dispositionName: ['', Validators.required],
          subDispositionName: ['', Validators.required],
          subSubDispositionName: ['', Validators.required],
          description: ['', Validators.required]
        });
      }
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // get fo() {
  //   return this.form.controls.onHrs.controls;
  // }
  get fo(): FormArray {
    return this.formOnlineHrs.get('onHrs') as FormArray;
  }

  get foo(): FormArray {
    return this.formOnlineHrs.get('odDays') as FormArray;
  }

  get fcb(): FormArray {
    return this.formOfflineDays.get('checkBox') as FormArray;
  }

  get fs(): { [key: string]: AbstractControl } {
    return this.formSubDisposition.controls;
  }

  get fss(): { [key: string]: AbstractControl } {
    return this.formSubSubDisposition.controls;
  }

  get foh(): { [key: string]: AbstractControl } {
    return this.formOnlineHrs.controls;
  }
  get fod(): { [key: string]: AbstractControl } {
    return this.formOfflineDays.controls
  }

  // get foo() :FormArray{
  //    return this.formOnlineHrs.get('odDays') as FormArray; }

  submit(val: any) {
    this.submittedForm = true;
    if (val == 'form') {
      if (this.form.invalid) {
        this.submittedForm = true;
        this.common.snackbar("TenantFillAllField");
        return;
      }
    } else if (val == 'formSubDisposition') {
      if (this.formSubDisposition.invalid) {
        this.submittedForm = true;
        this.common.snackbar("TenantFillAllField");
        return;
      }
    } else if (val == 'formSubSubDisposition') {
      if (this.formSubSubDisposition.invalid) {
        this.submittedForm = true;
        this.common.snackbar("TenantFillAllField");
        return;
      }
    } else if (val == 'formOnlineHrs' || val == 'formOnlineHrsSaveAndAddNew') {
      if (this.formOnlineHrs.invalid) {
        // this.common.snackbar("TenantFillAllField");
        return;
      }
    } else if (val == 'formOfflineDays' || val == 'formOfflineDaysSaveAddnew') {
      if (this.formOfflineDays.invalid) {
        // this.common.snackbar("TenantFillAllField");
        return;
      }
    }
    var obj: object;
    if (this.masterName == 'dispositions') {
      if (this.formName == 'add') {
        if (val == 'form') {
          obj = {
            data: {
              spname: "usp_unfyd_adm_dispositions",
              parameters: {
                FLAG: "INSERT_DISPOSITION",
                DISPOSTIONNAME: this.form.value.dispositionName,
                DISPOSITIONDESC: this.form.value.description,
                CREATEDBY: this.userDetails.Id,
                SYSTEMIP: this.userDetails.ip,
                DPROCESSID: this.form.value.businessUnit,
                DLANGUAGECODE: this.form.value.language,
                CLIENTID: ""
              }
            }
          }
        } else if (val == 'formSubDisposition') {
          obj = {
            data: {
              spname: "usp_unfyd_adm_dispositions",
              parameters: {
                FLAG: "INSERT_SUBDISPOSITION",
                DispositionId: this.formSubDisposition.value.dispositionName,
                SubdispositionName: this.formSubDisposition.value.subDispositionName,
                SubdispositionDesc: this.formSubDisposition.value.description,
                CREATEDBY: this.userDetails.Id,
                SYSTEMIP: this.userDetails.ip,
                PROCESSID: this.formSubDisposition.value.businessUnit,
                LANGUAGECODE: this.formSubDisposition.value.language
              }
            }
          }
        } else if (val == 'formSubSubDisposition') {
          obj = {
            data: {
              spname: "usp_unfyd_adm_dispositions",
              parameters: {
                FLAG: "INSERT_SUBSUBDISPOSITION",
                SUBDISPOSITIONID: this.formSubSubDisposition.value.subDispositionName,
                SUBSUBDISPOSITIONNAME: this.formSubSubDisposition.value.subSubDispositionName,
                SUBSUBDISPOSITIONDESC: this.formSubSubDisposition.value.description,
                CREATEDBY: this.userDetails.Id,
                SYSTEMIP: this.userDetails.ip,
                PROCESSID: this.formSubSubDisposition.value.businessUnit,
                LANGUAGECODE: this.formSubSubDisposition.value.language,
                CLIENTID: ''
              }
            }
          }
        }
      } else if (this.formName == 'edit') {
        if (this.selectedTab == 'Dispositions') {
          obj = {
            data: {
              spname: "usp_unfyd_adm_dispositions",
              parameters: {
                FLAG: "UPDATE_DISPOSITIONBYID",
                DISPOSTIONNAME: this.form.value.dispositionName,
                DISPOSITIONDESC: this.form.value.description,
                MODIFIEDBY: this.userDetails.Id,
                SYSTEMIP: this.userDetails.ip,
                PROCESSID: this.form.value.businessUnit,
                LANGUAGECODE: this.form.value.language,
                CLIENTID: "",
                ID: this.formData.Id
              }
            }
          }
        } else if (this.selectedTab == 'Sub Dispositions') {
          obj = {
            data: {
              spname: "usp_unfyd_adm_dispositions",
              parameters: {
                FLAG: "UPDATE_SUBDISPOSITION",
                DispositionId: this.formSubDisposition.value.dispositionName,
                SubdispositionName: this.formSubDisposition.value.subDispositionName,
                SubdispositionDesc: this.formSubDisposition.value.description,
                ModifiedBy: this.userDetails.Id,
                PROCESSID: this.formSubDisposition.value.businessUnit,
                LANGUAGECODE: this.formSubDisposition.value.language,
                Id: this.formData.Id
              }
            }
          }
        } else if (this.selectedTab == 'Sub Sub Dispositions') {
          obj = {
            data: {
              spname: "usp_unfyd_adm_dispositions",
              parameters: {
                FLAG: "UPDATE_SUBSUBDISPOSITION",
                SUBDISPOSITIONID: this.formSubSubDisposition.value.subDispositionName,
                SUBSUBDISPOSITIONNAME: this.formSubSubDisposition.value.subSubDispositionName,
                SUBSUBDISPOSITIONDESC: this.formSubSubDisposition.value.description,
                MODIFIEDBY: this.userDetails.Id,
                PROCESSID: this.formSubDisposition.value.businessUnit,
                LANGUAGECODE: this.formSubSubDisposition.value.language,
                ID: this.formData.Id
              }
            }
          }
        }
      }
    }
    else (this.masterName == 'BusinessHours'); {
      if (this.selectedTab == 'Online Hours') {
        var temp = [];
        var arrayControl = this.formOnlineHrs.get('onHrs') as FormArray;
        arrayControl.controls.forEach((element, index) => {
          var day = (arrayControl.at(index) as FormGroup).get('day').value;
          var startTime = (arrayControl.at(index) as FormGroup).get('startTime').value;
          var endTime = (arrayControl.at(index) as FormGroup).get('endTime').value;
          var message = (arrayControl.at(index) as FormGroup).get('message').value;
          temp.push({ "Day": day, "StartTime": startTime, "EndTime": endTime, "Message": message });
        });
        for (let i = 0; i < temp.length; i++) {
          let startonlinehrs = new Date(temp[i].StartTime)
          let finalstartonlinehrs = ('0' + startonlinehrs.getHours()).slice(-2);
          let Startonlinemin = new Date(temp[i].StartTime)
          let finalStartonlinemin = ('0' + Startonlinemin.getMinutes()).slice(-2);
          let Endonlinehrs = new Date(temp[i].EndTime)
          let finalEndonlinehrs = ('0' + Endonlinehrs.getHours()).slice(-2);
          let Endonlinemin = new Date(temp[i].EndTime)
          let finalEndonlinemin = ('0' + Endonlinemin.getMinutes()).slice(-2);
          obj = {
            data: {
              spname: "usp_unfyd_adm_offline",
              parameters: {
                FLAG: this.formName == 'add' ? "INSERT_OFFLINE_HRS" : "UPDATE_OFFLINE_HRS",
                ID: this.formName == 'add' ? undefined : this.Id,
                processid: this.userDetails.Processid,
                CREATEDBY: this.formName == 'edit' ? undefined : this.userDetails.Id,
                MODIFIEDBY: this.formName == 'add' ? undefined : this.userDetails.Id,
                CHANNELID: this.channel,
                CHANNELSOURCEID: "",
                LANGUAGECODE: this.language,
                LOCATIONID: "",
                OFFLINEHRSDAY: temp[i].Day,
                OFFLINESTARTTIME: finalstartonlinehrs + ':' + finalStartonlinemin,
                OFFLINEENDTIME: finalEndonlinehrs + ':' + finalEndonlinemin,
                // OFFLINEMESSAGE: temp[i].Message,
                OFFLINEMESSAGE: temp[i].Message == null ? null : temp[i].Message.trim(),
                ImageEnable: this.formOnlineHrs.get('sendText').value,
                ImageHostPath: this.holidayImg
              }
            }
          };
          this.api.post('index', obj).subscribe(res => {
            this.submittedForm = false
            if (res.code == 200) {
              this.loader == false
              this.common.sendCERequest('UpdateOfflineHoursMaster', this.userDetails.Processid)
              if (res.results.data[0]['result'].includes("added successfully")) {
                this.common.snackbar('RecordsAdded');
                if (val == 'formOnlineHrs') {
                  this.close.emit(true);
                }
                if (val == 'formOnlineHrsSaveAndAddNew' && i == 0) {
                  this.close.emit(true);
                  const dialogRef = this.dialog.open(DialogComponent, {
                    data: {
                      type: 'hour',
                      tabName: 'Online Hours',
                      formName: 'add',
                      Id: undefined,
                      master: "BusinessHours"
                    },
                    width: "900px",
                    height: "88vh",
                    disableClose: true,
                  });
                  dialogRef.afterClosed().subscribe(status => {
                    if (status) {
                      this.common.refreshMenu(status);
                    }
                  });
                }

              }
              else if ((res.results.data[0]['result'].includes("already exists")) && (res.results.data[0].Status == false)) {
                this.common.snackbar('Exists');
              }
              else if (res.results.data[0]['result'].includes("updated successfully.")) {
                if (val == 'formOnlineHrs') {
                  this.common.snackbar('Update Success');
                  this.close.emit(true);
                }
              }
              else if (res.results.data[0].Status == true) {
                if(i == 0){
                  this.common.confirmationToMakeDefault('AcitvateDeletedData');
                }                this.subscriptionAcitivateData.push(
                  this.common.getIndividualUpload$.subscribe(status => {
                    if (status.status) {
                      this.requestObj = {
                        data: {
                          spname: "usp_unfyd_adm_offline",
                          parameters: {
                            flag: 'ACTIVATE_OFFLINEHRS',
                            CHANNELID: this.channel,
                            CHANNELSOURCEID: "",
                            LANGUAGECODE: this.language,
                            OFFLINEHRSDAY: temp[i].Day,
                            OFFLINESTARTTIME: finalstartonlinehrs + ':' + finalStartonlinemin,
                            OFFLINEENDTIME: finalEndonlinehrs + ':' + finalEndonlinemin,
                            OFFLINEMESSAGE: temp[i].Message,
                            processid: this.userDetails.Processid,
                            modifiedby: this.userDetails.Id,
                          }
                        }
                      };
                      this.api.post('index', this.requestObj).subscribe((res: any) => {
                        if (res.code == 200) {                          
                          this.common.snackbar('RecordsAdded');
                          this.common.sendCERequest('UpdateOfflineHoursMaster', this.userDetails.Processid)
                          if (val == 'formOnlineHrs') {
                            this.close.emit(true);
                          }
                          if (val == 'formOnlineHrsSaveAndAddNew') {
                            this.close.emit(true);
                            const dialogRef = this.dialog.open(DialogComponent, {
                              data: {
                                type: 'hour',
                                tabName: 'Online Hours',
                                formName: 'add',
                                Id: undefined,
                                master: "BusinessHours"
                              },
                              width: "900px",
                              height: "88vh",
                              disableClose: true,
                            });
                            dialogRef.afterClosed().subscribe(status => {
                              if (status) {
                                this.common.refreshMenu(status);
                              }
                            });
                          }
                        }
                      });
                    }

                    this.subscriptionAcitivateData.forEach((e) => {
                      e.unsubscribe();
                    });
                  }))
              }
            }
          },
            (error) => {
              this.common.snackbar(error.message, "error");
            });
        }
      }

      ///////////////////////////////////////////

      if (this.selectedTab == 'Offline Days') {
        var temp1 = [];
        var arrayControl = this.formOfflineDays.get('odDays') as FormArray;
        arrayControl.controls.forEach((element, index) => {
          var day = (arrayControl.at(index) as FormGroup).get('day').value;
          var message = (arrayControl.at(index) as FormGroup).get('message').value;
          var allDay = (arrayControl.at(index) as FormGroup).get('masterSelected').value;
          let obj = {};
          let checkArrayControl = this.odDays().at(index).get('checkBox') as FormArray;
          checkArrayControl.controls.forEach((element, index) => {
            let key = (index + 1) + 'Day';
            obj[key] = element.value;
          });
          temp1.push({ "Day": day, "Message": message, "AllDay": allDay, ...obj });
        });
        for (let i = 0; i < temp1.length; i++) {
          obj = {
            data: {
              spname: "usp_unfyd_adm_offline",
              parameters: {
                FLAG: this.formName == 'add' ? "INSERTOFFLINEDAYS" : "UPDATE_OFFLINE_DAYS",
                ID: this.formName == 'add' ? undefined : this.Id,
                processid: this.userDetails.Processid,
                CREATEDBY: this.formName == 'edit' ? undefined : this.userDetails.Id,
                MODIFIEDBY: this.formName == 'add' ? undefined : this.userDetails.Id,
                CHANNELSOURCEID: "",
                CHANNELID: this.channel,
                LANGUAGECODE: this.language,
                LOCATIONID: "",
                OFFLINEHRSDAY: temp1[i].Day,
                OFFLINEMESSAGE: temp1[i].Message == null ?null:temp1[i].Message.trim(),
                ALLDAY: temp1[i].AllDay,
                FIRSTDAY: temp1[i]['1Day'],
                SECONDDAY: temp1[i]['2Day'],
                THIRDDAY: temp1[i]['3Day'],
                FOURTHDAY: temp1[i]['4Day'],
                FIFTHDAY: temp1[i]['5Day'],
                ImageEnable: this.formOfflineDays.get('sendText').value,
                ImageHostPath: this.holidayImg
              }
            }
          }
          this.api.post('index', obj).subscribe(res => {
            this.submittedForm = false
            if (res.code == 200) {
              this.loader == false
              this.common.sendCERequest('UpdateOfflinedaysMaster', this.userDetails.Processid)
              if (res.results.data[0]['result'].includes("added successfully")) {
                this.common.snackbar('RecordsAdded');
                if (val == 'formOfflineDays') {
                  this.close.emit(true);
                }
                if (val == 'formOfflineDaysSaveAddnew') {
                  this.close.emit(true);
                  const dialogRef = this.dialog.open(DialogComponent, {
                    data: {
                      type: 'day',
                      tabName: 'Offline Days',
                      formName: 'add',
                      Id: undefined,
                      master: "BusinessHours"
                    },
                    width: "900px",
                    height: "88vh",
                    disableClose: true,
                  });
                  dialogRef.afterClosed().subscribe(status => {
                    if (status) {
                      this.common.refreshMenu(status);
                    }
                  });
                }

              }
              else if (res.results.data[0]['result'].includes("updated successfully.")) {
                this.common.snackbar('Update Success');
                if (val == 'formOfflineDays') {
                  this.close.emit(true);
                }
              }
              else if ((res.results.data[0]['result'].includes("already exists")) && (res.results.data[0].Status == false)) {
                this.common.snackbar('Exists');
              }
              else if (res.results.data[0].Status == true) {
                this.common.confirmationToMakeDefault('AcitvateDeletedData');
                this.subscriptionAcitivateData.push(
                  this.common.getIndividualUpload$.subscribe(status => {
                    if (status.status) {
                      this.requestObj = {
                        data: {
                          spname: "usp_unfyd_adm_offline",
                          parameters: {
                            flag: 'ACTIVATE_OFFLINEDAYS',
                            PROCESSID: this.userDetails.Processid,
                            CHANNELSOURCEID: "",
                            CREATEDBY: this.userDetails.Id,
                            CHANNELID: this.channel,
                            LANGUAGECODE: this.language,
                            OFFLINEHRSDAY: temp1[i].Day,
                            OFFLINEMESSAGE: temp1[i].Message,
                            modifiedby: this.userDetails.Id,
                          }
                        }
                      };
                      this.api.post('index', this.requestObj).subscribe((res: any) => {
                        if (res.code == 200) {
                          this.common.snackbar('RecordsAdded');
                          this.common.sendCERequest('UpdateOfflinedaysMaster', this.userDetails.Processid)
                          if (val == 'formOfflineDays') {
                            this.close.emit(true);
                          }
                          if (val == 'formOfflineDaysSaveAddnew') {
                            this.close.emit(true);
                            const dialogRef = this.dialog.open(DialogComponent, {
                              data: {
                                type: 'day',
                                tabName: 'Offline Days',
                                formName: 'add',
                                Id: undefined,
                                master: "BusinessHours"
                              },
                              width: "900px",
                              height: "88vh",
                              disableClose: true,
                            });
                            dialogRef.afterClosed().subscribe(status => {
                              if (status) {
                                this.common.refreshMenu(status);
                              }
                            });
                          }
                        }
                      });
                    }
                    this.subscriptionAcitivateData.forEach((e) => {
                      e.unsubscribe();
                    });
                  }))
              }
            }
          },
            (error) => {
              this.common.snackbar(error.message, "error");
            });
        }
      }



    }
  }

  back() {
    if (this.masterName == 'dispositions') {
      this.router.navigateByUrl('unfyd-masters/dispositions')
    }
    else if (this.masterName == 'BusinessHours') {
      this.close.emit(true)
    }
  }

  mobileDeviceChange(event) {
    if (this.formSubSubDisposition?.value?.dispositionName) {
      this.dispositionData.forEach(element => {
        if (element.Id == event) {
          this.subDispositionValues = []
          this.subDispositionData.forEach(element1 => {
            if (element1.Disposition == element.Disposition) {
              this.subDispositionValues.push(element1)
            }
          });
        }
      });
    }
  }


  selectChannel(e) {
    this.icons = e;
  }




  reset(val: any) {
    if (val == 'form') {
      if (this.formName == 'edit') {
        this.back()
      }
      let element: HTMLElement = document.getElementById('resetform') as HTMLElement;
      element.click();
      this.submittedForm = false;
    } else if (val == 'formSubDisposition') {
      if (this.formName == 'edit') {
        this.back()
      }
      let element: HTMLElement = document.getElementById('resetformSubDisposition') as HTMLElement;
      element.click();
      this.submittedForm = false;
    } else if (val == 'formSubSubDisposition') {
      if (this.formName == 'edit') {
        this.back()
      }
      let element: HTMLElement = document.getElementById('resetformSubSubDisposition') as HTMLElement;
      element.click();
      this.submittedForm = false;
    } else if (val == 'formOnlineHrs') {
      // console.log(this.formOnlineHrs);
      this.formOnlineHrs.reset();
      this.onHrs().clear();
      this.onHrs().push(this.newOnHrs());

      // this.onHrs().push(this.createItem());


      setTimeout(() => {
        this.formOnlineHrs.get('sendText').patchValue(false)
        this.formOnlineHrs.get('sendText').updateValueAndValidity()
        this.formOnlineHrs.updateValueAndValidity()
        this.holidayImg = undefined;
        this.isDisabled = false
        // console.log(this.formOnlineHrs);
      });
    } else if (val == 'formOfflineDays') {
      // console.log(this.formOfflineDays);
      this.formOfflineDays.reset();
      this.odDays().clear()
      this.odDays().push(this.newOdDays())
      this.submittedForm = false


      // console.log(this.formOfflineDays.value);

      setTimeout(() => {
        this.formOfflineDays.get('enable').patchValue(false)
        this.formOfflineDays.get('enable').updateValueAndValidity()
        this.formOfflineDays.updateValueAndValidity()
        this.holidayImg = undefined;
        this.isDisabled = false
        // console.log(this.formOfflineDays);
      });

    }
  }

  returnDays(Day, i, formName) {
    let form = formName;
    let formArray = formName == 'onHrs' ? 'formOnlineHrs' : 'formOfflineDays';
    let result = this[formArray].value[form].map(a => a.day);
    let selectedValue: any;
    Day.forEach(element => {
      if (element.label == this[formArray].value[form][i].day && this[formArray].value[form][i].day != undefined) {
        selectedValue = element
      }
    });
    let filteredArray = Day.filter(d => !result.includes(d.label));

    if (selectedValue)
      filteredArray.unshift(selectedValue)
    return filteredArray
  }


  offlineDaysChangeImageToggle() {
    // setTimeout(() => {
    //   if(this.formOfflineDays.value.enable){
    //     // this.formOfflineDays.controls['photographstatus'].clearValidators();
    //     // this.formOfflineDays.controls['photographstatus'].updateValueAndValidity()
    //     // this.formOfflineDays.controls['photographstatus'].setValidators([Validators.required]);
    //     // this.formOfflineDays.controls['photographstatus'].updateValueAndValidity()
    //     // this.formOfflineDays.updateValueAndValidity({onlySelf: true})

    //     let control1 = null;
    //     control1 = this.formOfflineDays.get('photographstatus');
    //       control1.setValidators([Validators.required]);
    //   control1.updateValueAndValidity();
    //   } else{
    //     this.formOfflineDays.controls['photographstatus'].clearValidators();
    //     this.formOfflineDays.controls['photographstatus'].updateValueAndValidity()
    //     this.formOfflineDays.controls['photographstatus'].setValidators([Validators.nullValidator]);
    //     this.formOfflineDays.controls['photographstatus'].updateValueAndValidity()
    //     this.formOfflineDays.updateValueAndValidity()
    //   }
    // });
  }

  checboxSelectedOrNOt(i): boolean {

    let a = false;
    // if(!this.formOfflineDays.value?.odDays[i]?.masterSelected) a = true
    // else if(!this.formOfflineDays.value?.odDays[i]?.checkBox[0]) a = true
    // else if(!this.formOfflineDays.value?.odDays[i]?.checkBox[1]) a = true
    // else if(!this.formOfflineDays.value?.odDays[i]?.checkBox[2]) a = true
    // else if(!this.formOfflineDays.value?.odDays[i]?.checkBox[3]) a = true
    // else if(!this.formOfflineDays.value?.odDays[i]?.checkBox[4]) a = true
    if (!this.formOfflineDays.value?.odDays[i]?.masterSelected &&
      !this.formOfflineDays.value?.odDays[i]?.checkBox[0] &&
      !this.formOfflineDays.value?.odDays[i]?.checkBox[1] &&
      !this.formOfflineDays.value?.odDays[i]?.checkBox[2] &&
      !this.formOfflineDays.value?.odDays[i]?.checkBox[3] &&
      !this.formOfflineDays.value?.odDays[i]?.checkBox[4])
      a = true

    return a;
  }

  closeDialog(status: any): void {
    this.dialogRef.close(status);
  }



}
