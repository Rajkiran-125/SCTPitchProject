import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-hub-summary',
  templateUrl: './hub-summary.component.html',
  styleUrls: ['./hub-summary.component.scss']
})
export class HubSummaryComponent implements OnInit {
  form: FormGroup;
  loader: boolean = true;  
  modules: any = [];
  categories: any = [];
  subcategory: any = [];
  HubId: string;
  categoryname: any;
  userDetails: any;
  ActionValueOne: any = [];
  tableloop: any = [];
  requestObj: any;  
  ModuleLabel: any;  
  summary: any = [];
  ModulenameDisplay: any;
  labelName: any;
  subscription: Subscription[] = [];


  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
      this.HubId = this.activatedRoute.snapshot.paramMap.get('id');
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
  
      if (this.HubId != null) {
        this.loader=true
        var obj = {
          data: {
            spname: "usp_unfyd_module_map",
            parameters: {
              flag: "EDIT",
              AccessControlID: this.HubId
            }
          }
        }
        this.api.post('index', obj).subscribe(res => {
          this.loader = false;
          if (res.code == 200) {
            this.summary = res.results.data[0];
            res.results.data.forEach(res1 => {
              this.tableloop.push({
                ModuleName: res1.ModuleName,
                Category: res1.ModuleGroupping,
                Subcategory: res1.SubModuleGroupping,
                Action: res1.ActionList ? res1.ActionList.split(",") : res1.ActionList,
              })
            })
          }
        })
      }
      else {
        this.loader = false;
      }
  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('Privilege','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Privilege', data)

  }

  getSubCategory(category: any) {

    // this.ModuleLoop.forEach(element =>{
    this.categoryname = category
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET_SUB_MODULE_CATEGORY',
          processid: this.userDetails.Processid,
         productid:this.userDetails.ProductId,
          MODULEGROUPPING: this.categoryname
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.subcategory = res.results.data;

      }
    });
  }


  getCategory() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          FLAG: 'GET_MODULE_CATEGORY',
          processid: this.userDetails.Processid,
         productid:this.userDetails.ProductId,

        },
      },
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.categories = res.results.data;
      }
    });

  }



  getModule(subcategories: any) {

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET_MODULE_LIST',
          processid: this.userDetails.Processid,
          // productid: 1,
         productid:this.userDetails.ProductId,

          MODULEGROUPPING: this.categoryname,
          SUBMODULEGROUPPING: subcategories
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.modules = res.results.data;
        
      }
    });
  }


  getActionList(module) {
    // this.ModuleLoop.forEach(element =>{
    this.ModuleLabel = module;
    // this.loader = true;
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_module_action_list',
        parameters: {
          flag: 'GET',
          moduleid: module,
         productid:this.userDetails.ProductId,

          processid: this.userDetails.Processid
        },
      },
    };
    this.api.post('index', this.requestObj).subscribe(res => {

      let a = []
      a = res.results.data
      if (res.code == 200) {
        this.loader = false;
      }
    });
  }
  removeItem(value) {
    const index: number = this.tableloop.indexOf(value);
    this.tableloop.splice(index, 1);
  }

  edithub(){
    this.router.navigate(['masters/Privilege/update',this.HubId]);
  }

}
