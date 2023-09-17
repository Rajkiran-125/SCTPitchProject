import { Component, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { DatePipe } from '@angular/common';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { checknull, checknull1 } from 'src/app/global/json-data';
@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],


})
export class HolidaysComponent implements OnInit {
  masters: any;
  form: FormGroup;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  requestObj: any;
  editObj: any;
  languageType: any = [];
  channelType: any = [];
  states: any = [];
  filteredstates = this.states.slice();
  labelName: any;
  category: any;
  reset: boolean = false;
  minDate = new Date();
  maxDate = new Date();
  lastYear = new Date();
  regex: any;
  selectedDateFormats: any;
  storeDate: any;
  masterConfig: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  modules: any;
  configData: any;
  userConfig: any;
  isDisabled = false;
  holidayImg: any;
  ImgLoader: boolean = false;
  subscription: Subscription[] = [];
  contactCenterLocation: any = [];
  changeModuleLabelDisplayName: any;
  allowedISD: any = [];
  localizationData: any;
  localizationDataAvailble: boolean = false;
  public filteredList3 = this.contactCenterLocation.slice();
  channel: any;
  language: any;
  isfixedholiday: boolean = false;
  subscriptionAcitivateData: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    public dialogRef: MatDialogRef<DialogComponent>,
    private el: ElementRef,
    public datepipe: DatePipe,
  ) { }

  ngOnInit(): void {

    this.subscription.push(this.common.configView$.subscribe(res => {
      if (res != false) {
        this.channel = res.channel
        this.language = res.language
      }
    }))
    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.getChannel();
    this.getContactCenter();
    this.getLanguage();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'Holidays');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    if (this.Id == null) {
      this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.form = this.formBuilder.group({
      languagecode: ['', Validators.nullValidator],
      channelid: ['', Validators.nullValidator],
      holiday: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      isfixedholiday: ['', Validators.required],
      autoresponse: ['', [Validators.required, Validators.maxLength(300)]],
      businessunit: ['NULL', Validators.nullValidator],
      publicip: [this.userDetails.ip, Validators.nullValidator],
      processid: [1, Validators.nullValidator],
      enable: ['', Validators.nullValidator],
    },
      { validator: [checknull1('description'), checknull1('autoresponse')] },

    )
    if (this.Id !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_adm_holidays",
          parameters: {
            flag: "EDIT",
            Id: this.Id,
          }
        }
      };
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.loader = false;
          this.editObj = res.results.data[0];
          const lowerObj = this.common.ConvertKeysToLowerCase();
          this.form.patchValue(lowerObj(this.editObj));
          this.form.patchValue(this.editObj);
          this.form.get('enable').patchValue(this.editObj.ImageEnable);
          this.holidayImg = this.editObj.ImageHostPath;
          this.isDisabled = this.editObj.ImageEnable;
          this.form.get('holiday').patchValue(this.formatDate(this.editObj.holiday))
          this.form.updateValueAndValidity();
          this.isfixedholiday = this.editObj.IsFixedHoliday;
        }
      });
    } else {
      this.loader = false;
    }

    this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {
      this.localizationData = res1;
      if (Object.keys(this.localizationData).length > 0) {
        this.chnageDate(res1)

      }
    }))
  }


  chnageDate(val) {
    this.selectedDateFormats = val.selectedDateFormats;
    this.selectedDateFormats = this.selectedDateFormats.replaceAll('y', '')
    this.selectedDateFormats = this.selectedDateFormats.trim('')

    if (this.selectedDateFormats.includes('/', this.selectedDateFormats.length - 1)) {
      this.selectedDateFormats = this.selectedDateFormats.substring(0, this.selectedDateFormats.length - 1)

    }
    else if (this.selectedDateFormats.includes('/', 0)) {
      this.selectedDateFormats = this.selectedDateFormats.substring(1, this.selectedDateFormats.length)

    }

    if (this.selectedDateFormats.includes('-', this.selectedDateFormats.length - 1)) {
      this.selectedDateFormats = this.selectedDateFormats.substring(0, this.selectedDateFormats.length - 1)

    }
    else if (this.selectedDateFormats.includes('-', 0)) {
      this.selectedDateFormats = this.selectedDateFormats.substring(1, this.selectedDateFormats.length)

    }

  }
  config: any;
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    if (this.Id == null) {
      this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.activatedRoute.url.subscribe((url) => {
      let Id = 'Holidays'
      this.common.setUserConfig(this.userDetails.ProfileType, Id);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }))
    })
    // this.common.setMasterConfig();
    // this.common.getMasterConfig$.subscribe(data => {
    //   this.masterConfig = {
    //     languages: JSON.parse(data.KnownLanguages),
    //   }
    // });
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
    })
  }

  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ConfigManager', data)

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.holidayImg = undefined;
    this.close.emit(true);
  }

  resetfunc() {
    this.submittedForm = false
    this.holidayImg = undefined;
    this.isDisabled = false
  }

  showDate(e) {
    this.isfixedholiday = e;
  }

  submit(event) {
    this.loader = true;
    this.submittedForm = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }
    if (this.Id == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_adm_holidays",
          parameters: {
            flag: 'INSERTHOLIDAY',
            CreatedBy: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            ProcessId: this.userDetails.Processid,
            LanguageCode: this.language,
            ChannelId: this.channel,
            Holiday: this.formatDate(this.form.get('holiday').value),
            IsFixedHoliday: this.form.get('isfixedholiday').value,
            Description: this.form.get('description').value == null ? null : this.form.get('description').value.trim(),
            AutoResponse: this.form.get('autoresponse').value == null ? null : this.form.get('autoresponse').value.trim(),
            ImageEnable: this.form.get('enable').value,
            ImageHostPath: this.holidayImg,
          }
        }
      }
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_adm_holidays",
          parameters: {
            flag: "UPDATEHOLIDAY",
            ID: Number(this.Id),
            MODIFIEDBY: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            LanguageCode: this.language,
            ChannelId: this.channel,
            Holiday: this.formatDate(this.form.get('holiday').value),
            IsFixedHoliday: this.form.get('isfixedholiday').value,
            Description: this.form.get('description').value == null ? null : this.form.get('description').value.trim(),
            AutoResponse: this.form.get('autoresponse').value == null ? null : this.form.get('autoresponse').value.trim(),
            ImageEnable: this.form.get('enable').value,
            ImageHostPath: this.holidayImg,
            ProcessId: this.userDetails.Processid,
          }
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;

        this.common.sendCERequest('UpdateHolidayMaster', this.userDetails.Processid)
        if (res.results.data[0]['result'].includes(" added successfully")) {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.close.emit(true);
          } else if (event == 'saveAndAddNew') {
            this.holidayImg = ''
            this.form.reset()
            this.holidayImg = undefined;
            this.isDisabled = false
            this.close.emit(true);
            const dialogRef = this.dialog.open(DialogComponent, {
              data: {
                type: 'HolidaysAdd',
                Id: undefined
              },
              width: "900px",
              height: "88vh",
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(status => {
              if (status) {
                this.common.refreshMenu(true);
              }
            });

          }
        }
        else if (res.results.data[0]['result'].includes("updated successfully")) {
          this.common.snackbar('Update Success');
          if (event == 'add') {
            this.close.emit(true);
          } else if (event == 'saveAndAddNew') {
            this.form.reset()
            this.holidayImg = undefined;
            this.isDisabled = false

          }
        }
        else if ((res.results.data[0]['result'].includes("already exists")) && (res.results.data[0].Status == false)) {
          this.common.snackbar('Exists');
        }
        else if (res.results.data[0]['result'].includes("defined as fixed holiday")) {
          this.common.snackbar(res.results.data[0].result, "error");
        }
        else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                // this.loader = false;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_adm_holidays",
                    parameters: {
                      flag: 'ACTIVATE',
                      LanguageCode: this.language,
                      ChannelId: this.channel,
                      Holiday: this.formatDate(this.form.get('holiday').value),
                      IsFixedHoliday: this.form.get('isfixedholiday').value,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                      PUBLICIP: this.userDetails.ip,
                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.sendCERequest('UpdateHolidayMaster', this.userDetails.Processid)
                    this.common.snackbar('Record add');
                    this.common.refreshMenu(true);
                    if (event == 'add') {
                      this.close.emit(true);
                    } else if (event == 'saveAndAddNew') {
                      this.holidayImg = ''
                      this.form.reset()
                      this.holidayImg = undefined;
                      this.isDisabled = false
                      this.close.emit(true);
                      const dialogRef = this.dialog.open(DialogComponent, {
                        data: {
                          type: 'HolidaysAdd',
                          Id: undefined
                        },
                        width: "900px",
                        height: "88vh",
                        disableClose: true,
                      });
                      dialogRef.afterClosed().subscribe(status => {
                        this.common.refreshMenu(true);
                        if (status) {
                          this.common.refreshMenu(true);
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
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
      });
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
  getChanel() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL_FILTER",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.channelType = res.results['data']
    })
  }

  flip() {
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
    } else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {

          this.ImgLoader = true;
          this.api.post('upload', formData).subscribe(res => {
            if (res.code == 200) {
              this.holidayImg = res.results.URL;
              this.ImgLoader = false;
            }
          });
        };
      };
      reader.readAsDataURL(file);
    }
  }

  getLanguage() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.languageType = res.results['data']
    });
  }


  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.form.value.holiday;
    ctrlValue.day(normalizedMonthAndYear.day());
    ctrlValue.month(normalizedMonthAndYear.month());
    this.form.controls['holiday'].patchValue(ctrlValue);
    this.form.controls['holiday'].updateValueAndValidity();
    this.form.updateValueAndValidity();
    datepicker.close();
  }

  closeDialog(status: any): void {
    this.dialogRef.close(status);

  }

}












