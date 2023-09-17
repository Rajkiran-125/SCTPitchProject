import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex , masters, checknull, checknull1} from 'src/app/global/json-data';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-user-group',
  templateUrl: './user-group.component.html',
  styleUrls: ['./user-group.component.scss']
})
export class UserGroupComponent implements OnInit {
  loader: boolean = false;
  dataToUpdate: any;
  skillId: any;
  userDetails: any;
  regex: any;
  masters: any;
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  minMessage: any;
  labelName: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  reset: boolean;
  @Input() isDialog: boolean = false;
  agents = [];
  public filteredList2 = this.agents.slice();
  selectallval: boolean = false;
  formAgentarr: any = [];
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  userConfig: any;
  @Input() data: any;
  ModuleGroupping: any = [];
  userGroup: boolean = false;
  type: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public common: CommonService,
    private api: ApiService,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogComponent>,
  ) {
    Object.assign(this, { masters });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('UserGroup', 'click', 'pageload', 'pageload', '', 'ngOnInit');
    this.getSnapShot();

    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    var menu = JSON.parse(localStorage.getItem('menu'))
    var parent_menu = localStorage.getItem('parent_menu')

    var isChild = menu.filter(function (item) { return (item.ModuleGroupping == parent_menu) })[0].Keys;

    this.ModuleGroupping = isChild.map(function (elem) {
      return elem.Modulename
    });


    if (this.Id == null) {
      this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.common.setUserConfig(this.userDetails.ProfileType, 'UserGroup');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data;

    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.minMessage = masters.MinLengthMessage;
    this.loader = true;

    this.getAgents()
    this.form = this.formBuilder.group({
      SkillName: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      SkillDesc: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      AgentId: ['', [Validators.nullValidator]],
      PROCESSID: [this.userDetails.Processid, Validators.nullValidator],
      PUBLICIP: [this.userDetails.ip, Validators.nullValidator],
      IP: ["", Validators.nullValidator],
      BROWSERNAME: [this.userDetails.browser, Validators.nullValidator],
      BROWSERVERSION: [this.userDetails.browser_version, Validators.nullValidator]
    },
    {validator:[checknull1('SkillName'),checknull1('SkillDesc')]},

    );

    this.skillId = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');
    if (this.skillId !== null) {
      var Obj = {
        data: {
          spname: "group",
          parameters: {
            FLAG: 'EDIT',
            GROUPID: this.skillId
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.dataToUpdate = res.results.data
          let dataObj: any = [];

          res.results.data[1].forEach(element => {
            dataObj.push(element.userid)
          });
          this.form.patchValue({
            SkillName: res.results.data[0][0].GroupName,
            SkillDesc: decode(res.results.data[0][0].GroupDesc),
            AgentId: dataObj,
          });

          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
    }
    this.common.hubControlEvent('UserGroup', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }

  getAgents() {
    var Obj1 = {
      data: {
        spname: "USP_UNFYD_TALK_AGENTROUTING",
        parameters: {
          ACTIONFLAG: 'GET_AGENT_NAME',
          ProcessId: 1
        }
      }
    }
    this.common.hubControlEvent('UserGroup', 'click', '', '', JSON.stringify(Obj1), 'getAgents');

    this.api.post('index', Obj1).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {

        this.agents = res.results.data
        this.agents.sort((a, b) => (a.UserName.toUpperCase() > b.UserName.toUpperCase()) ? 1 : -1);
        this.filteredList2 = this.agents.slice();
      }
    })
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('UserGroup', 'click', '', '', data, 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'UserGroup', data)

  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('UserGroup', 'click', '', '', '', 'getSnapShot');

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
    this.common.hubControlEvent('UserGroup', 'click', 'back', 'back', '', 'back');
    if (this.isDialog == true) {
      this.dialogRef.close(true);
    }
    else {
      this.router.navigate(['masters/user-group']);
    }
  }

  submit(event): void {
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
      // this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }


    let a: any;

    if (this.form.value.AgentId == null || this.form.value.AgentId == undefined || this.form.value.AgentId == '') {
    }
    else {
      a = this.form.value.AgentId.join(',')
      a = a.replace(/['"]+/g, '')
    }


    let endpoint: any
    if (this.skillId == null) {
      endpoint = 'index'
    } else {
      endpoint = 'index'
    }
    if (this.skillId == null) {

      this.requestObj = {
        data: {
          spname: "group",
          parameters: {
            FLAG: 'INSERT',
            GROUPNAME: this.form.value.SkillName == null ? null : this.form.value.SkillName.trim(),
            GROUPSTATUS: 1,
            AgentId: a,
            GROUPDESC: encode(this.form.value.SkillDesc  == null ? null : this.form.value.SkillDesc.trim()),
            PRODUCTID: this.userDetails.Productid ? this.userDetails.Productid : null,
            PROCESSID: this.userDetails.Processid,
            CREATEDBY: this.userDetails.Id,
            PRIVATEIP: "",
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version

          }
        }
      }

    } else {


      if (a == "0") {
        a = "";
      }

      this.requestObj = {
        data: {
          spname: "group",
          parameters: {
            FLAG: 'UPDATE',
            GROUPNAME: this.form.value.SkillName == null ? null : this.form.value.SkillName.trim(),
            GROUPSTATUS: 1,
            AgentId: a,
            GROUPDESC: encode(this.form.value.SkillDesc  == null ? null : this.form.value.SkillDesc.trim()) ,
            MODIFIEDBY: this.userDetails.Id,
            GROUPID: this.dataToUpdate[0][0].GroupID
          }
        }
      }
    }
    this.common.hubControlEvent('UserGroup', 'click', 'submit', 'submit', JSON.stringify(this.requestObj), 'submit');

    this.api.post(endpoint, this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        // this.common.refreshMenu(true);
        this.loader = false;
        if (res.results.data[0].result == "Data added successfully") {
          if (event == 'add') {
            this.common.snackbar('Record add');
            if (this.isDialog == true) {
              this.common.refreshMenu(true);
              this.dialogRef.close(true);
            }
            else {
              this.router.navigate(['masters/user-group']);
            }

          } if (event == 'saveAndAddNew') {
            if (this.isDialog == true) {
              this.common.refreshMenu(true);
            }
            this.common.snackbar('Record add');
            this.form.reset()
          }
        }
        else if (res.results.data[0].result == "Data updated successfully") {

          if (event == 'add') {
            this.common.snackbar('Update Success');
            if (this.isDialog == true) {
              this.dialogRef.close(true);
              this.common.refreshMenu(true);
            }
            else {
              this.router.navigate(['masters/user-group']);
            }
          }

        }
        else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                this.requestObj = {
                  data: {
                    spname: "group",
                    parameters: {
                      flag: 'ACTIVATE',
                      GROUPNAME: this.form.value.SkillName,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                    }
                  }
                };
                this.common.hubControlEvent('UserGroup', 'click', 'submit', 'submit', JSON.stringify(this.requestObj), 'submit');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (event == 'add') {
                      this.common.snackbar('Record add');
                      if (this.isDialog == true) {
                        this.dialogRef.close(true);
                        this.common.refreshMenu(true);
                      }
                      else {
                        this.router.navigate(['masters/user-group']);
                      }
                    }
                    if (event == 'saveAndAddNew') {
                      if (this.isDialog == true) {
                        this.common.refreshMenu(true);
                      }
                      this.common.snackbar('Record add');
                      this.form.reset()
                    }
                  }
                });


              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))



        }
        else if ((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }

        this.common.sendCERequest('UPDATEUSERGRP', this.userDetails.Processid)
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      })
  }


  toggleAllSelection(val) {
    this.common.hubControlEvent('UserGroup', 'click', '', '', val, 'toggleAllSelection');

    if (this.form.value.AgentId.includes(0)) {
      this.selectallval = true;

      this.form.controls.AgentId.patchValue([]);
      this.form.controls.AgentId
        .patchValue([...this.agents.map(item => item.id), 0]);


      this.selectallval = false;
    } else {
      this.form.controls.AgentId.patchValue([]);

      this.selectallval = false;
    }

  }


  ifselectall(e, val) {
    this.common.hubControlEvent('UserGroup', 'click', '', '', JSON.stringify(e, val), 'ifselectall');
    if (e.includes(0) && this.form.value.AgentId.length >= this.agents.length) {
      if (this.form.value.AgentId.includes(0)) {
        for (var i = 0; i < this.form.value.AgentId.length; i++) {
          if (this.form.value.AgentId[i] == 0) {
            let a = []
            a = this.form.value.AgentId
            a.splice(a.indexOf(0), 1);
            this.form.controls.AgentId.patchValue(a);
            this.form.get('AgentId').updateValueAndValidity()
            this.form.updateValueAndValidity()
          }
        }
      }
    }
  }
  
toggleSelection(change: MatCheckboxChange): void {
  this.common.hubControlEvent('UserGroup','click','','','','toggleSelection');

  if (change.checked) {
    this.form.controls['AgentId'].patchValue(this.agents.map(item => item.id));
    this.form.updateValueAndValidity()

  } else {
    this.form.controls['AgentId'].patchValue('');
  }
}
dropdown(type,module){
  if (this.ModuleGroupping.includes(module)) {
  const dialogRef = this.dialog.open(DialogComponent, {
    data: {
      type: type,
      data: this.data,
      isDialog: true
    },
    width: "110%",
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(status => {
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'UserGroup');
    this.getAgents()
    this.common.refreshMenu(status);
    if (status) {
    }
  })}}

  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}
