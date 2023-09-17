import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex , masters} from 'src/app/global/json-data';

@Component({
  selector: 'app-business-units',
  templateUrl: './business-units.component.html',
  styleUrls: ['./business-units.component.scss']
})
export class BusinessUnitsComponent implements OnInit {
  loader: boolean = false;
  skillId: any;
  userDetails: any;
  regex: any;
  masters:any;
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  minMessage:any;
  labelName: any;
  reset: boolean;
  agents=[]
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    private el: ElementRef,
  ) {Object.assign(this, { masters });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('BusinessUnits','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.minMessage = masters.MinLengthMessage;
    this.loader = true;
    this.common.hubControlEvent('BusinessUnits','click','pageloadend','pageloadend','','ngOnInit');


this.getAgents()

    this.form = this.formBuilder.group({
      SkillName: ['', [Validators.required, Validators.pattern(regex.alphabet),Validators.maxLength(100)]],
      SkillDesc: ['', [Validators.required, Validators.pattern(regex.alphabet),Validators.maxLength(250)]],
      AgentId: ['', [Validators.required]],
      PROCESSID: [this.userDetails.Processid, Validators.nullValidator],
      PUBLICIP: [this.userDetails.ip, Validators.nullValidator],
      IP: ["", Validators.nullValidator],
      BROWSERNAME: [this.userDetails.browser, Validators.nullValidator],
      BROWSERVERSION: [this.userDetails.browser_version, Validators.nullValidator]
    });

    this.skillId = this.activatedRoute.snapshot.paramMap.get('id');
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
      this.common.hubControlEvent('BusinessUnits','click','','',JSON.stringify(Obj),'getAgents');

      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if(res.code == 200){
          let dataObj:any = [];

          res.results.data[1].forEach(element => {
            dataObj.push(element.AgentId)
          });
          this.form.patchValue(res.results.data[0][0]);

          this.form.patchValue({
            AgentId: dataObj,
          })
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/skills/add'])
    }
  }

  getAgents(){
    var Obj1 = {
      data: {
        spname: "USP_UNFYD_TALK_AGENTROUTING",
        parameters: {
          ACTIONFLAG :'GET_AGENT_NAME',
          ProcessId:1
        }
      }
    }
    this.common.hubControlEvent('BusinessUnits','click','','',JSON.stringify(Obj1),'getAgents');

    this.api.post('index', Obj1).subscribe(res => {
      this.loader = false;
      if(res.code == 200){
        this.agents = res.results.data
      }
    })
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('BusinessUnits','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'Skills', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;

    });
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('BusinessUnits','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path  = this.activatedRoute.snapshot.data.title
        this.common.setUserConfig(this.userDetails.ProfileType, path);
        this.common.getUserConfig$.subscribe(data => {
            this.config = data;
          });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
}
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('BusinessUnits','click','back','back','','back');

    this.location.back()
  }

  submit(event): void {
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

    let a:any;
   
      a = this.form.value.AgentId.join(',')
      a= a.replace(/['"]+/g, '')


    if (this.skillId == null) {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_skillmaster",
          parameters: {
            flag: 'INSERTSKILL',
            CREATEDBY: this.userDetails.EmployeeId,
            SkillName: this.form.value.SkillName,
            SkillDesc: this.form.value.SkillDesc,
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
      this.requestObj = {
        data: {
          spname: "usp_unfyd_skillmaster",
          parameters: {
            flag: "UPDATESKILL",
            ID: this.skillId,
            MODIFIEDBY: this.userDetails.EmployeeId,
            CREATEDBY: this.userDetails.EmployeeId,
            SkillName: this.form.value.SkillName,
            SkillDesc: this.form.value.SkillDesc,
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
    this.common.hubControlEvent('BusinessUnits','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        let elementtt:HTMLElement = document.getElementById('reset') as HTMLElement;
        elementtt.click();
        if(event == 'add')
        this.router.navigate(['masters/skills']);
        this.common.snackbar("Add Record");
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
