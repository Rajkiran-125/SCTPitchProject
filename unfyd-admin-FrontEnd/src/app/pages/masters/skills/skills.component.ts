import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex, masters, checknull, checknull1 } from 'src/app/global/json-data';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from "rxjs";
import { MatCheckboxChange } from '@angular/material/checkbox';
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  @ViewChild('search') searchTextBox: ElementRef;

  loader: boolean = false;
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
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  agents = [];
  public filteredList2 = this.agents.slice();
  userConfig: any;
  @Input() data: any;
  ModuleGroupping: any = [];
  currentComp: any;
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
    this.common.hubControlEvent('Skills', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.common.setUserConfig(this.userDetails.ProfileType, 'Skills');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))




    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.minMessage = masters.MinLengthMessage;
    this.loader = true;

    var menu = JSON.parse(localStorage.getItem('menu'))
    var parent_menu = localStorage.getItem('parent_menu')
    var isChild = menu.filter(function (item) { return (item.ModuleGroupping == parent_menu) })[0].Keys;

    this.ModuleGroupping = isChild.map(function (elem) {
      return elem.Modulename
    })


    this.getAgents()
    if (this.Id == null) {
      this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.form = this.formBuilder.group({
      SkillName: ['', [Validators.required, Validators.pattern(regex.alphanumericwithspecialcharacter), Validators.maxLength(100)]],
      SkillDesc: ['', [ Validators.minLength(3), Validators.maxLength(500)]],
      AgentId: ['', [Validators.nullValidator]],
      PROCESSID: [this.userDetails.Processid, Validators.nullValidator],
      PUBLICIP: [this.userDetails.ip, Validators.nullValidator],
      IP: ["", Validators.nullValidator],
      BROWSERNAME: [this.userDetails.browser, Validators.nullValidator],
      BROWSERVERSION: [this.userDetails.browser_version, Validators.nullValidator]
    },
      { validator: [checknull('SkillName'), checknull1('SkillDesc')] },);

    this.skillId = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');
    if (this.skillId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_skillmaster",
          parameters: {
            flag: "GETSKILLBYID",
            Id: this.skillId
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          let dataObj: any = [];

          res.results.data[1].forEach(element => {
            dataObj.push(element.AgentId)
          });
          
          this.form.patchValue(res.results.data[0][0]);

          this.form.patchValue({
            AgentId: dataObj,
            SkillDesc: decode(res.results.data[0][0].SkillDesc)
          })
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      // this.router.navigate(['/masters/skills/add'])
    }
    this.common.hubControlEvent('Skills', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');





  }

  toHTML(input) : any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
}

 htmlDecode (str) {
  var div = document.createElement("div");
  div.innerHTML = str;
  return div.textContent || div.innerText;
}

  getAgents() {

    var Obj1 = {
      data: {
        spname: "USP_UNFYD_TALK_AGENTROUTING",
        parameters: {
          ACTIONFLAG: 'GET_AGENT_NAME',
          ProcessId: this.userDetails.Processid,
        }
      }
    }
    this.common.hubControlEvent('Skills', 'click', '', '', JSON.stringify(Obj1), 'getAgents');

    this.api.post('index', Obj1).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.agents = res.results.data;
        this.agents.sort((a, b) => (a.UserName.toUpperCase() > b.UserName.toUpperCase()) ? 1 : -1);

        this.filteredList2 = this.agents.slice();
        // this.filteredProviders =this.agents;

      }
    })
  }


  // onInputChange(event: any) {
  //   const searchInput = event.target.value.toLowerCase();

  //   this.filteredProviders = this.agents.filter(({agents}) => {
  //     const prov = agents.toLowerCase();
  //     return prov.includes(searchInput);
  //   });
  // }

  // onOpenChange(searchInput: any) {
  //       searchInput.value = "";
  //       this.filteredProviders = this.agents;
  //     }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Skills', 'click', '', '', data, 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Skills', data)

  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('Skills', 'click', '', '', '', 'getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(

        this.common.getUserConfig$.subscribe(data => {
          this.config = data;
        })
      )
    });

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('Skills', 'click', 'back', '', '', 'back');
    if (this.isDialog == true) {
      this.dialogRef.close(true);
    }
    else {
      this.router.navigate(['masters/skills']);
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
      // this.common.snackbar("General Error");
      return;
    }

    let a: any
    if (this.form.value.AgentId !== null && this.form.value.AgentId !== undefined && this.form.value.AgentId !== '') {
      a = this.form.value.AgentId.join(',')
      a = a.replace(/['"]+/g, '')
    }

    if (this.skillId == null) {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_skillmaster",
          parameters: {
            flag: 'INSERTSKILL',
            CREATEDBY: this.userDetails.Id,
            SkillName: this.form.value.SkillName == null ? null : this.form.value.SkillName.trim(),
            SkillDesc: encode(this.form.value.SkillDesc == null ? null : this.form.value.SkillDesc.trim()),
            AgentId: a,
            PROCESSID: this.userDetails.Processid,
            PUBLICIP: this.userDetails.ip,
            IP: "",
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
          spname: "usp_unfyd_skillmaster",
          parameters: {
            flag: "UPDATESKILL",
            ID: this.skillId,
            MODIFIEDBY: this.userDetails.Id,
            CREATEDBY: this.userDetails.Id,
            SkillName: this.form.value.SkillName == null ? null : this.form.value.SkillName.trim(),
            SkillDesc: encode(this.form.value.SkillDesc == null ? null : this.form.value.SkillDesc.trim()),
            AgentId: a,
            PROCESSID: this.userDetails.Processid,
            PUBLICIP: this.userDetails.ip,
            IP: "",
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    }
    this.common.hubControlEvent('Skills', 'click', '', '', JSON.stringify(this.requestObj), 'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        // this.common.refreshMenu(true);
        this.loader = false;
        this.common.sendCERequest('UpdateSkillDataMaster', this.userDetails.Processid)
        // if (res.results.data[0].resp == 'Data Added')
        if (event == 'saveAndAddNew') {
          if (res.results.data[0].resp == 'Data Added') {
            this.common.snackbar('Record add');
            this.form.reset()
            if (this.isDialog == true) {
              this.common.refreshMenu(true);
            }
          }
        }
        else if ((this.skillId == null || this.skillId == undefined || res.results.data[0].Status == true) && res.results.data[0].resp !== 'Data Exists') {
          this.common.snackbar('Record add');
          if (event == 'add') {
            if (this.isDialog == true) {
              this.dialogRef.close(true);
              this.common.refreshMenu(true);
            }
            else {
              this.router.navigate(['masters/skills']);
            }
          }

        }
        if(this.skillId != null || this.skillId != undefined && res.results.data[0].resp == 'Data Added'){
        // if(res.results.data[0].resp == 'Data Added'){
          this.common.snackbar('Update Success');
          // this.router.navigate(['masters/skills'])
        // }
        if (this.isDialog == true) {
          this.dialogRef.close(true);
          this.common.refreshMenu(true);
        }
        else{
          this.router.navigate(['masters/skills'])
        }
         }
        else if (res.results.data[0].resp == 'Data Exists' && res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_skillmaster",
                    parameters: {
                      flag: 'ACTIVATE_SKILL',
                      ModifiedBy: this.userDetails.Id,
                      SkillName: this.form.value.SkillName,
                      SkillDesc:  encode(this.form.value.SkillDesc == null ? null : this.form.value.SkillDesc.trim()),
                      PROCESSID: this.userDetails.Processid
                    }
                  }
                };
                this.common.hubControlEvent('Skills', 'click', 'ACTIVATE_SKILL', '', JSON.stringify(this.requestObj), 'submit');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    if (event == 'add') {
                      if (this.isDialog == true) {
                        this.dialogRef.close(true);
                        this.common.refreshMenu(true);

                      }
                      else {
                        this.router.navigate(['masters/skills']);
                      }
                    } else if (event == 'saveAndAddNew') {
                      this.form.reset()
                      if (this.isDialog == true) {
                        this.common.refreshMenu(true);
                        // this.dialogRef.close(true)
                      }
                    }
                  }
                });
              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))


        }
        else if (res.results.data[0].resp == 'Data Exists'&& res.results.data[0].Status == false) {
          this.common.snackbar('Data Already Exist');
          this.router.navigate(['masters/skills/add'])
        }
        else if (res.results.data[0].resp == 'Data updated') {
          this.common.snackbar('Update Success');
          if (event == 'add') {
            if (res.results.data[0].resp == 'Data Added') {
              this.common.snackbar('Update Success');
            }
            if (this.isDialog == true) {
              this.dialogRef.close(true);
            }
            else {
              this.router.navigate(['masters/skills']);
            }
          } else if (event == 'saveAndAddNew') {
            this.form.reset()
          }
        }
        // else {
        //   this.common.snackbar(res.results.data[0].result, "error");
        // }
      }
       else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;

      }
    );
  }
  toggleAllSelection(val) {

    if (this.form.value.AgentId.includes(0)) {
      this.form.controls.AgentId.patchValue([]);
      this.form.controls.AgentId
        .patchValue([...this.agents.map(item => item.id), 0]);
    } else {
      this.form.controls.AgentId.patchValue([]);
    }
    this.common.hubControlEvent('Skills', 'click', 'ACTIVATE_SKILL', '', JSON.stringify(val), 'toggleAllSelection');
  }


  ifselectall(e, val) {

    if (e.includes(0) && this.form.value.AgentId.length >= this.agents.length) {
      if (this.form.value.AgentId.includes(0)) {
        for (var i = 0; i < this.form.value.AgentId.length; i++) {
          if (this.form.value.AgentId[i] == 0) {
            let a = []
            a = this.form.value.AgentId
            a.splice(a.indexOf(0), 1);
            this.form.controls.AgentId.patchValue(a);
            this.form.get('AgentId').updateValueAndValidity()
            this.form.updateValueAndValidity();
            this.common.hubControlEvent('Skills', 'click', 'ACTIVATE_SKILL', '', JSON.stringify(val, e), 'ifselectall');
          }
        }
      }
    }
  }
  toggleSelection(change: MatCheckboxChange): void {

    if (change.checked) {
      this.form.controls['AgentId'].patchValue(this.agents.map(item => item.id));
      this.form.updateValueAndValidity()

    } else {
      this.form.controls['AgentId'].patchValue('');
      this.form.updateValueAndValidity()
    }
  }
  dropdown(type, module) {
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
        this.common.setUserConfig(this.userDetails.ProfileType, 'Skills');
        this.common.refreshMenu(status);
        this.getAgents()
        this.common.refreshMenu(status);
        if (status) {

        }
      })
    }
    else {
      this.common.snackbar('ModuleInDialog');
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
