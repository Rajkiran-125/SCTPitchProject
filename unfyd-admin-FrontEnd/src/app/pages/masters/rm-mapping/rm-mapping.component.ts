import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull1, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-rm-mapping',
  templateUrl: './rm-mapping.component.html',
  styleUrls: ['./rm-mapping.component.scss']
})
export class RmMappingComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  path: any;
  requestObj: any;
  labelName: any;
  form: FormGroup;
  agents = [];
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  config: any;
  getGroupList: any = [];
  submittedForm = false;
  userConfig: any;
  // arrayData:any=[]

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
    public dialog: MatDialog
  ) {
    Object.assign(this, { masters })
  }

  ngOnInit(): void {
    this.getSnapShot()
    this.form = this.formBuilder.group({
      uid: ['', Validators.required],
      rm1: ['', Validators.required],
      rm2: ['', Validators.nullValidator],
      rm3: ['', Validators.nullValidator],
      rm4: ['', Validators.nullValidator],
      rmpool1: ['', Validators.required],
      rmpool2: ['', Validators.nullValidator],
      rmpool3: ['', Validators.nullValidator],
      rmpool4: ['', Validators.nullValidator],
    },
    { validator: [checknull1('uid')]}
    )

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))


    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))

    this.common.setUserConfig(this.userDetails.ProfileType, 'rm-mapping');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.getAgents()
    this.getGroupType()

    if (this.path !== null) {
      var Obj = {
        data: {
          spname: "UNFYD_ADM_RM_BASED_ROUTING_V1",
          parameters: {
            flag: "EDIT",
            processid: this.userDetails.Processid,
            Id: this.path
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {

        if (res.code == 200) {
          console.log(res, "edit res")
          this.form.controls.uid.patchValue(res.results.data[0].CustomerUID)
          this.form.controls.rm1.patchValue(res.results.data[0].AgentID)
          this.form.controls.rm2.patchValue(res.results.data[0].PrimaryAgent)
          this.form.controls.rm3.patchValue(res.results.data[0].SecondaryAgent)
          this.form.controls.rm4.patchValue(res.results.data[0].TertiaryAgent)

          this.form.controls.rmpool1.patchValue(res.results.data[0].Skill)
          this.form.controls.rmpool2.patchValue(res.results.data[0].PrimarySkill)
          this.form.controls.rmpool3.patchValue(res.results.data[0].SecondarySkill)
          this.form.controls.rmpool4.patchValue(res.results.data[0].TertiarySkill
          )




        }
      });
    }

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('block-content','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'rm-mapping', data)

  }
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');

    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;

      }));
    });
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


      }
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


rmArray(){
  let agentArrayData = [];

  this.agents.forEach(res => {
    if (res.id !== this.form.value.rm2 && res.id !== this.form.value.rm3 && res.id !== this.form.value.rm4) {
      agentArrayData.push(res)
    }
  })
  return agentArrayData;
}

  rmArrayMethod() {
    let arrayData = [];

    this.agents.forEach(res => {
      if (res.id !== this.form.value.rm1 && res.id !== this.form.value.rm3 && res.id !== this.form.value.rm4) {
        arrayData.push(res)
      }
    })
    return arrayData;

  }

  rmArrayMethod1() {
    let arrayData1 = [];

    this.agents.forEach(res => {
      if (res.id !== this.form.value.rm1 && res.id !== this.form.value.rm2 && res.id !== this.form.value.rm4) {
        arrayData1.push(res)
      }
    })
    return arrayData1;

  }


  rmArrayMethod2() {
    let arrayData2 = [];

    this.agents.forEach(res => {
      if (res.id !== this.form.value.rm1 && res.id !== this.form.value.rm2 && res.id !== this.form.value.rm3) {
        arrayData2.push(res)
      }
    })
    return arrayData2;

  }



  rmpoolArray() {
    let rmPool = [];

    this.getGroupList.forEach(res => {
      if (res.GroupID !== this.form.value.rmpool2 && res.GroupID !== this.form.value.rmpool3 && res.GroupID !== this.form.value.rmpool4) {
        rmPool.push(res)
      }
    })
    return rmPool;

  }



  rmpoolArrayMethod() {
    let rmPoolData = [];

    this.getGroupList.forEach(res => {
      if (res.GroupID !== this.form.value.rmpool1 && res.GroupID !== this.form.value.rmpool3 && res.GroupID !== this.form.value.rmpool4) {
        rmPoolData.push(res)
      }
    })
    return rmPoolData;

  }


  rmpoolArrayMethod1() {
    let rmPoolData1 = [];

    this.getGroupList.forEach(res => {
      if (res.GroupID !== this.form.value.rmpool1 && res.GroupID !== this.form.value.rmpool2 && res.GroupID !== this.form.value.rmpool4) {
        rmPoolData1.push(res)
      }
    })
    return rmPoolData1;

  }

  rmpoolArrayMethod2() {
    let rmPoolData2 = [];

    this.getGroupList.forEach(res => {
      if (res.GroupID !== this.form.value.rmpool1 && res.GroupID !== this.form.value.rmpool2 && res.GroupID !== this.form.value.rmpool3) {
        rmPoolData2.push(res)
      }
    })
    return rmPoolData2;

  }



  submit(event,formDirective: FormGroupDirective) {
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
    if (this.path == null) {
      this.requestObj = {
        data: {
          spname: "UNFYD_ADM_RM_BASED_ROUTING_V1",
          parameters: {
            flag: 'INSERT',
            CustomerUID: this.form.value.uid == null ? null : this.form.value.uid.trim(),
            AgentID: this.form.value.rm1,
            PrimaryAgent: this.form.value.rm2,
            SecondaryAgent: this.form.value.rm3,
            TertiaryAgent: this.form.value.rm4,
            Skill: this.form.value.rmpool1,
            PrimarySkill: this.form.value.rmpool2,
            SecondarySkill: this.form.value.rmpool3,
            TertiarySkill: this.form.value.rmpool4,
            PROCESSID: this.userDetails.Processid,
            CREATEDBY: this.userDetails.Id,
            PRIVATEIP: "",
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    }
    else {
      this.requestObj = {
        data: {
          spname: "UNFYD_ADM_RM_BASED_ROUTING_V1",
          parameters: {
            FLAG: 'UPDATE',
            Id: this.path,
            CustomerUID: this.form.value.uid == null ? null : this.form.value.uid.trim(),
            AgentID: this.form.value.rm1,
            PrimaryAgent: this.form.value.rm2,
            SecondaryAgent: this.form.value.rm3,
            TertiaryAgent: this.form.value.rm4,
            Skill: this.form.value.rmpool1,
            PrimarySkill: this.form.value.rmpool2,
            SecondarySkill: this.form.value.rmpool3,
            TertiarySkill: this.form.value.rmpool4,
            MODIFIEDBY: this.userDetails.Id,
          }
        }
      }
    }


    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        if (res.results.data[0].result == 'Data added successfully') {
          this.common.snackbar('Record add');
          this.router.navigate(['masters/rm-mapping']);
        }
        if (res.results.data[0].result == 'Data updated successfully') {
          this.common.snackbar('Update Success');
          this.router.navigate(['masters/rm-mapping']);
        }
        if (event == 'save&new') {
          if (res.results.data[0].result == 'Data added successfully') {
            this.common.snackbar('Record add');
            this.form.reset()
            formDirective.resetForm()

            this.router.navigate(['masters/rm-mapping/add']);
          }
        }


        if ((res.results.data[0].result == 'Data already exists') && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              this.loader = false;
              if (status.status) {
                this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "UNFYD_ADM_RM_BASED_ROUTING_V1",
                    parameters: {
                      flag: 'ACTIVATE',
                      CustomerUID: this.form.value.uid == null ? null : this.form.value.uid.trim(),
                      processid: this.userDetails.Processid,

                    }
                  }
                };
                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.refreshMenu(true);

                    this.common.snackbar('Record add')
                    this.router.navigate(['masters/rm-mapping']);

                    if (event == 'save&new') {
                        this.router.navigate(['masters/rm-mapping/add']);
                        this.loader=false
                        this.common.snackbar('Record add');
                        this.form.reset()
                        formDirective.resetForm()
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
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back() {
    this.router.navigate(['masters/rm-mapping']);
  }

}
