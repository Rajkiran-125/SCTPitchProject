import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex, masters } from 'src/app/global/json-data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hub-mod-summary',
  templateUrl: './hub-mod-summary.component.html',
  styleUrls: ['./hub-mod-summary.component.scss']
})
export class HubModSummaryComponent implements OnInit {
  userDetails: any;
  path: string;
  loader: boolean;
  ActionValueOne: any;
  form: any;
  iconimg: any;
  actionvalue: any;
  subcategoryvalue: any;
  categorymodule: any;
  config: any;  
  defaultcheckbox:boolean = true;
  actionList : any[] = [];
  subscription: Subscription[] = [];
  labelName: any;

  constructor( private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    private el: ElementRef,) {  Object.assign(this, { masters });}

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    
    this.setLabelByLanguage(localStorage.getItem("lang"))
   
    // this.categoryname()
    if (this.path != null) {
      var obj = {
        data: {
          spname: "usp_unfyd_form_module",
          parameters: {
            flag: "EDIT",
            id: this.path,

          }
        }
      }
      this.api.post('index', obj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.ActionValueOne = res.results.data[0]
          this.actionList = this.ActionValueOne.ActionList.length > 1 ? (this.ActionValueOne.ActionList).split(',') : this.ActionValueOne.ActionList         

        }
      })
    }
    else {
      this.loader = false;
    }
  }

  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'HubModules', data)
    
  }

  edit(){
    this.router.navigate(['masters/hubModules/update',this.path])
  }

}
