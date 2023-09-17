
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { FormArray,  FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxSummernoteModule } from 'ngx-summernote';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-task-group-detail',
  templateUrl: './task-group-detail.component.html',
  styleUrls: ['./task-group-detail.component.scss']
})
export class TaskGroupDetailComponent implements OnInit {
  form:FormGroup
  userDetails: any;
  requestObj: any;
  getGroupList:any= [];
  labelName: any;
  loader: boolean;
  skillId: any;
  reset: boolean;
  constructor(private formBuilder: FormBuilder,
    private common: CommonService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private auth: AuthService,
    private location: Location,
    private el: ElementRef,) {Object.assign(this, { masters }); }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.getSnapShot();

    this.form = this.formBuilder.group({
      name: ['', [Validators.nullValidator]],
      description:['', [Validators.nullValidator]],
      startDate:['', [Validators.nullValidator]],
      endDate:['', [Validators.nullValidator]],
      usergroup:['', [Validators.nullValidator]],
      Applyfilter:['', [Validators.nullValidator]],
      Reset:['', [Validators.nullValidator]],
      Addcampaign:['', [Validators.nullValidator]],
      masking:['', [Validators.nullValidator]],
    });


    this.skillId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.skillId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_campaigns",
          parameters: {
            flag: "edit",
            Id: this.skillId
          }
        }
      }

      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {

          this.form.controls.name.patchValue(res.results.data[0].CampaignName)
          this.form.controls.description.patchValue(res.results.data[0].Description)
          // this.form.controls.description.patchValue(res.results.data[0].description)
          this.form.controls.startDate.patchValue(res.results.data[0].StartDate)
          this.form.controls.endDate.patchValue(res.results.data[0].EndDate)
          this.form.controls.usergroup.patchValue(res.results.data[0].UserGroups)
          this.form.controls.Applyfilter.patchValue(res.results.data[0].ApplyFilter)
          // this.form.controls.Reset.patchValue(res.results.data[0].Reset)
          // this.form.controls.Addcampaign.patchValue(res.results.data[0].Addcampaign)
          this.form.controls.masking.patchValue(res.results.data[0].Masking)

          this.form.updateValueAndValidity();
        }
      })
    }
    else {
      this.loader = false;
      this.router.navigate(['/masters/task-group-detail/edit'])
    }
    this.usergroup();
  }

  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'users', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }

  config: any;
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
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

  usergroup() {
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
  // this.form.value.Title

  addcampaign(event) {


    this.loader = true;

    if (this.form.invalid){
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
    if (this.skillId == null){
    this.requestObj = {

      data:{
        spname:"usp_unfyd_campaigns",
        parameters:{
            flag : "INSERT",
          campaignname:this.form.value.name,
          description:this.form.value.description,
          startdate:this.form.value.startDate,
          enddate:this.form.value.endDate,
          fromtime:"",
          totime:"",
          usergroups:this.form.value.usergroup,
          applyfilter:this.form.value.Applyfilter,
          masking:0,
          action:this.form.value.Action,
          processid:this.userDetails.Processid,
          productid:1,
          createdby:this.userDetails.Id,
          publicip:this.userDetails.ip,
          privateip:'',
          browsername:this.userDetails.browser,
          browserversion:this.userDetails.browser_version
         }
        }
    }}
    else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_campaigns",
          parameters: {
            flag: "UPDATE",
            campaignname: this.form.value.name,
            description: this.form.value.description,
            startdate:this.form.value.startDate,
            enddate:this.form.value.endDate,
            fromtime:"",
            totime:"",
            usergroups:this.form.value.usergroup,
            applyfilter:this.form.value.Applyfilter,
            masking:0,
            modifiedby: this.userDetails.Id,
            id: this.skillId,
          }
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        // let elementtt: HTMLElement = document.getElementById('reset') as HTMLElement;
        // elementtt.click();
        if (event == 'add')
        this.router.navigate(['masters/task-group-detail']);
        this.common.snackbar(res.results.data[0].result, "success");
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





