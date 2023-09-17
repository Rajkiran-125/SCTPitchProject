import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, timeZones, userFormSteps } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { error } from 'console';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.scss'],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class OthersComponent implements OnInit {
  masters: any;
  form: FormGroup;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  requestObj: any;
  path: any;
  editObj: any;
  skillType: any = [];
  contactCenterLocation: any = [];
  getDesignation: any = [];
  getGroupList: any = [];
  getRMList: any = [];
  reset: boolean = false;
  @Input() data: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  @Input() isDialog: boolean = false;
  @Output() tabSelected: any = new EventEmitter<any>();
  @Output() notifyDialog: any = new EventEmitter<any>();
  @Output() addId: any = new EventEmitter<any>();
  labelName: any;
  timeZones: any = [];
  userFormSteps: any;
  subscription: Subscription[] = [];
  public filteredList2 = this.timeZones.slice();
  public filteredList3 = this.contactCenterLocation.slice();
  public filteredList4 = this.getDesignation.slice();
  public filteredList5 = this.getRMList.slice();
  timeZoneSeleted: any = {};
  localizationData: any;
  localizationDataAvailble: boolean = false;
  selectedTimeZoneFormat: any = [];
  temp: any;
  userConfig: any;
  TenantChannel: any = [];
  IsVoiceChannel: boolean = false;
  channeltrue: boolean = false;
  isChild: any = [];
  parent_menu: any = [];
  ModuleGroupping: any = [];
 
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef,
    public dialogRef: MatDialogRef<DialogComponent>,
    public dialog: MatDialog) {

    Object.assign(this, { masters, timeZones, userFormSteps });
    this.filteredList2 = this.timeZones.slice();
  }
  ngOnInit(): void {

    this.common.hubControlEvent('Users', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    var menu = JSON.parse(localStorage.getItem('menu'))
    var parent_menu = localStorage.getItem('parent_menu')
    var isChild = menu.filter(function (item) { return (item.ModuleGroupping == parent_menu) })[0].Keys;

    this.ModuleGroupping = isChild.map(function (elem) {
      return elem.Modulename
    })
    console.log(this.ModuleGroupping);

    this.ModuleGroupping.forEach(element => {
      if (element !== 'event') {
        console.log(element);
        return true

      }
    })


    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(this.common.localizationDataAvailable$.subscribe((res) => {
      this.localizationDataAvailble = res;
    }))
    this.common.setUserConfig(this.userDetails.ProfileType, 'Users');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.common.refresh.subscribe((data) => {
      if (data == true) {
        this.getContactCenter();
      }
    });
    this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {
      this.localizationData = res1;
      if (this.localizationDataAvailble) {
        if ((this.localizationData.selectedTimeZoneFormat).length > 0) {
          this.selectedTimeZoneFormat = this.localizationData.selectedTimeZoneFormat.split(",")
        }
      }

    }))
    this.form = this.formBuilder.group({
      cclocationid: ['', Validators.nullValidator],
      skillsmap: ['', Validators.nullValidator],
      groupid: ['', Validators.nullValidator],
      designation: ['', Validators.nullValidator],
      rmid: ['', Validators.nullValidator],
      crmid: ['', Validators.nullValidator],
      timezone: [this.timeZones[95].text, Validators.nullValidator],
      starttime: ['', Validators.nullValidator],
      endtime: ['', Validators.nullValidator]
    })

    var time = this.timeZones[95];
    this.subscription.push(this.common.localizationInfo$.subscribe(data => {
      this.form.controls['timezone'].patchValue(data.selectedTimeZoneFormat);
    }))
    this.getContactCenter();
    this.getSkill();
    this.getGroupType();
    this.designation();
    this.getTenantChannelStorage();
    if (this.Id == null) {
      this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.path = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path != 'null') {
      var Obj = {
        data: {
          spname: "usp_unfyd_adm_users",
          parameters: {
            flag: "GETUSERBYID",
            agentid: this.path
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
          this.form.controls['cclocationid'].patchValue(this.editObj.CCLocationId);
          if (this.editObj.SkillId == null) { this.form.controls['skillsmap'].patchValue(this.editObj.SkillId); }
          else {
            this.form.controls['skillsmap'].patchValue(this.editObj.SkillId.split(','));
          }
          if (this.editObj.GroupId == null) {
            this.form.controls['groupid'].patchValue(this.editObj.GroupId);
          }
          else {
            this.form.controls['groupid'].patchValue(this.editObj.GroupId.split(','))
          }
          this.form.controls['designation'].patchValue(this.editObj.Designation);
          this.getRM(this.editObj.Designation);
          this.form.controls['rmid'].patchValue(this.editObj.RMUserID);
          this.form.controls['crmid'].patchValue(this.editObj.crmid);
          this.form.controls['timezone'].patchValue(this.editObj.Timezone);
          if (!this.form.value.timezone) {
            this.form.controls['timezone'].patchValue(this.localizationData.selectedTimeZoneFormat);
            this.form.get("timezone").updateValueAndValidity()
            this.form.updateValueAndValidity();
          }
          if (this.editObj.starttime) {
            this.form.controls['starttime'].patchValue(moment(this.editObj.starttime, ["HH:mm"]).toDate());
          }
          if (this.editObj.endtime) {
            this.form.controls['endtime'].patchValue(moment(this.editObj.endtime, ["HH:mm"]).toDate());
          }
          this.form.updateValueAndValidity();
          this.getSnapShot()
        }
      })
    } else {
      this.loader = false;
      // this.router.navigate(['/masters/users/add'])
    }

    this.common.hubControlEvent('Users', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }

  setLabelByLanguage(data) {

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Users', data)

  }
  config: any;
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    if (this.isDialog == true) {
      this.dialogRef.close(true);
    }
    else {
      this.router.navigate(['/masters/users']);
    }
  }
  backspace(): void {
    if (this.isDialog == true) {
      // this.dialogRef.close(true);
      this.tabSelected.emit(userFormSteps[0].label)
    }
    else {
      this.router.navigate(['/masters/users']);
    }
  }

  getTenantChannelStorage() {
    this.loader = true;
    this.getTenantChannelStorage = JSON.parse(localStorage.getItem('TenantChannel'))
    console.log('this.TenantChannel all', this.TenantChannel)
    if (this.TenantChannel == null || this.TenantChannel == undefined) {
      this.setTenantChannel();
    } else {
      let chlen = this.TenantChannel.length
      this.TenantChannel.forEach(element => {
        if (element.ChannelName == 'Voice') {
          this.IsVoiceChannel = true;
        }

        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }

  setTenantChannel() {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        localStorage.setItem('TenantChannel', JSON.stringify(res.results['data']))
        this.getTenantChannelStorage();
      }
    })
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
  getSkill() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "SKILL",
          processid: this.userDetails.Processid
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.skillType = res.results['data'];
    })
  }
  getGroupType() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "GROUP",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.getGroupList = res.results['data'];
    })
  }
  submit() {
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
      this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }
    let hour1: any = new Date(this.form.get('starttime').value).getHours()
    let minute1 = new Date(this.form.get('starttime').value).getMinutes()
    let second1 = new Date(this.form.get('starttime').value).getSeconds()

    let hour2 = new Date(this.form.get('endtime').value).getHours()
    let minute2 = new Date(this.form.get('endtime').value).getMinutes()
    let second2 = new Date(this.form.get('endtime').value).getSeconds()

    let time1: any = (hour1) + ':' + (minute1) + ':' + second1
    let time2: any = (hour2) + ':' + (minute2) + ':' + second2
    var seconds1 = (hour1) * 60 * 60 + (minute1) * 60 + (second1) * 1;
    var seconds2 = (hour2) * 60 * 60 + (minute2) * 60 + (second2) * 1;


    let crmid = this.form.get('crmid').value
    if(crmid == null)
    {}
    else{
       crmid = crmid.trim()
    }

    this.requestObj = {
      data: {
        spname: "usp_unfyd_adm_users",
        parameters: {
          flag: "UPDATE_USER_CCDETAIL",
          id: this.isDialog === true ? this.Id : this.editObj.Id,
          userstatus: this.editObj.UserStatus,
          cclocationid: this.form.get('cclocationid').value ? this.form.get('cclocationid').value.toString() : null,
          skillsmap: this.form.get('skillsmap').value ? this.form.get('skillsmap').value.toString() : null,
          groupid: this.form.get('groupid').value ? this.form.get('groupid').value.toString() : null,
          designation: this.form.get('designation').value ? this.form.get('designation').value.toString() : null,
          // rmid: this.form.get('rmid').value ? this.form.get('rmid').value.toString() : null,
          RMUSERID: this.form.get('rmid').value ? this.form.get('rmid').value.toString() : null,
          crmid: this.form.get('crmid').value ? crmid.toString() : null,
          timezone: this.form.get('timezone').value ? this.form.get('timezone').value.toString() : null,
          // starttime: this.form.get('starttime').value !== '' ? time1 : '',
          // endtime: this.form.get('endtime').value !== '' ? time2 : '',
          modifiedby: this.userDetails.Id,
        }
      }
    }



    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.refreshMenu(true);
        if (seconds1 > seconds2) {
          this.loader = false;
          this.common.snackbar("EndTime has to be greater than StartTime", "error")
        } else {
          this.loader = false;
          if (this.isDialog == true) {}else{
          this.router.navigate(['masters/users/contact-center-details', this.path == null ? res.results.data[0].Id : this.path]);}
          this.common.snackbar("Update Success");
        }
        this.getSnapShot()
        let data = {
          Processid : this.userDetails.Processid,
          Agentid : this.path
        }
        this.common.sendCERequest('UpdateAgentMappingMaster', data)
        this.common.sendCEBotRequest('UpdateAgentMappingMaster',this.path == null ? res.results.data[0].Id : this.path,this.userDetails.Processid)
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }

  designation() {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: "usp_unfyd_hierarchy",
        parameters: {
          flag: "DESIGNATION",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.getDesignation = res.results.data;
        this.filteredList4 = this.getDesignation.slice();
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }

  getRM(DesignationID) {
    if (DesignationID) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_hierarchy",
          parameters: {
            flag: "RM",
            processid: this.userDetails.Processid,
            desigid: DesignationID
          }
        }
      }
      this.api.post('index', this.requestObj).subscribe((res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.getRMList = []
          this.filteredList5 = []

          if ((res.results.data).length > 0) {
            this.getRMList = res.results.data;
            this.filteredList5 = this.getRMList.slice();
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
  addnewsteps(event) {
    this.notifyDialog.emit(event)
  }
  addtabSelected(value: string) {
    this.tabSelected.emit(value);
  }
  addPathId(value: string) {
    this.addId.emit(value)
  }
  Next() {
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
      // this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }
    let hour1: any = new Date(this.form.get('starttime').value).getHours()
    let minute1 = new Date(this.form.get('starttime').value).getMinutes()
    let second1 = new Date(this.form.get('starttime').value).getSeconds()

    let hour2 = new Date(this.form.get('endtime').value).getHours()
    let minute2 = new Date(this.form.get('endtime').value).getMinutes()
    let second2 = new Date(this.form.get('endtime').value).getSeconds()

    let time1: any = (hour1) + ':' + (minute1) + ':' + second1
    let time2: any = (hour2) + ':' + (minute2) + ':' + second2
    var seconds1 = (hour1) * 60 * 60 + (minute1) * 60 + (second1) * 1;
    var seconds2 = (hour2) * 60 * 60 + (minute2) * 60 + (second2) * 1;

    let crmid = this.form.get('crmid').value
    if(crmid == null)
    {}
    else{
       crmid = crmid.trim()
    }

    this.requestObj = {
      data: {
        spname: "usp_unfyd_adm_users",
        parameters: {
          flag: "UPDATE_USER_CCDETAIL",
          id: this.isDialog === true ? this.Id : this.editObj.Id,
          userstatus: this.editObj.UserStatus,
          cclocationid: this.form.get('cclocationid').value ? this.form.get('cclocationid').value.toString() : null,
          skillsmap: this.form.get('skillsmap').value ? this.form.get('skillsmap').value.toString() : null,
          groupid: this.form.get('groupid').value ? this.form.get('groupid').value.toString() : null,
          designation: this.form.get('designation').value ? this.form.get('designation').value.toString() : null,
          // rmid: this.form.get('rmid').value ? this.form.get('rmid').value.toString() : null,
          RMUSERID: this.form.get('rmid').value ? this.form.get('rmid').value.toString() : null,
          crmid: this.form.get('crmid').value ? crmid.toString() : null,
          timezone: this.form.get('timezone').value ? this.form.get('timezone').value.toString() : null,
          // starttime: this.form.get('starttime').value !== '' ? time1 : '',
          // endtime: this.form.get('endtime').value !== '' ? time2 : '',

          modifiedby: this.userDetails.Id,
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {

        if (seconds1 > seconds2) {
          this.loader = false;
          this.common.snackbar("EndTime has to be greater than StartTime", "error")
        } else {
          this.loader = false;
          if (this.isDialog == true) {
            this.common.refreshMenu(true);
            // this.tabSelected.emit('Roles & Permissions')
            this.tabSelected.emit(userFormSteps[2].label)
            this.addId.emit(this.Id)
          }
          else {
            this.router.navigate(['masters/users/roles-permission', this.path == null ? res.results.data[0].Id : this.path]);
          }

          this.common.snackbar("Update Success");
        }
        this.getSnapShot()
        let data = {
          Processid : this.userDetails.Processid,
          Agentid : this.path
        }
        this.common.sendCERequest('UpdateAgentMappingMaster', data)
        this.common.sendCEBotRequest('UpdateAgentMappingMaster',this.path == null ? res.results.data[0].Id : this.path,this.userDetails.Processid)
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }
  dropdown(type,module) {
    // if (this.dialog.openDialogs.length <= 2) return;
    if (this.ModuleGroupping.includes(module)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: this.data,
          isDialog: true,
        },
        width: "100%",
        height: "75%",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.common.setUserConfig(this.userDetails.ProfileType, 'Users');
        this.setLabelByLanguage(localStorage.getItem("lang"))
        this.common.refreshMenu(status);
        this.getContactCenter();
        this.getGroupType();
        this.designation();
        this.getSkill();
        if (status === true) {
        }
      })
    } else {
      this.common.snackbar('ModuleInDialog')
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
