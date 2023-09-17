import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { element } from 'protractor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report-master',
  templateUrl: './report-master.component.html',
  styleUrls: ['./report-master.component.scss']
})
export class ReportMasterComponent implements OnInit {
  form: FormGroup;
  filterdata: any = [];
  storeFilterdata: any = []
  tableLoop: any = [];
  controlReport: any;
  columnReport: any;
  userDetails: any;
  categoryname: any;
  subcategories: any;
  modules: any;
  loader: boolean;
  subscription: Subscription[] = [];
  userConfig: any;
  items: FormArray;
  obj2: any;
  path: string;
  obj1: any;
  orderForm: FormGroup;
  moduleName: any;
  storeId: any;
  ResultData: any = [];



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
    this.userDetails = this.auth.getUser();
    this.getSnapShot()
    this.getFilter('ModuleName')
    this.getModule()
    // this.saveUpdate()

    this.form = this.formBuilder.group({
      ControlType: ['', [Validators.nullValidator]],
      modulename: ['', [Validators.nullValidator]],
    });
    this.orderForm = new FormGroup({
      dropValues: new FormArray([])
    });


  }


  createItem(): FormGroup {
    return this.formBuilder.group({
      ControlType: '',
      ControlValue: ''
    });
  }

  addItem(): void {
    this.items = this.orderForm.get('dropValues') as FormArray;

  }
  saveControlType(i, val) {
    if (val == 'dropdown' || val == 'MultiSelect') {
      //   var arrayControl = this.orderForm.get('dropValues') as FormArray;
      // (arrayControl.at(i) as FormGroup).get('ControlType').patchValue(val);
    }
    // else{
    // this.ResultData.forEach(element => {
    //   element.FieldReq.label = element.FieldReq.columnType

    // })}

  }
  saveType(i, val) {

  }

  getSnapShot() {
    this.common.hubControlEvent('Privilege', 'click', '', '', '', 'getSnapShot');
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.url.subscribe(url => {
      let HubId = 'Privilege'
      this.common.setUserConfig(this.userDetails.ProfileType, HubId);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
      }));
    });
  }

  getFilter(event) {
    this.moduleName = event
    var obj = {
      data: {
        spname: "usp_unfyd_dynamic_filter",
        parameters: {
          flag: 'GET_MODULE_DATA',
          ModuleName: event
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.ResultData = res.results.data;
        this.storeFilterdata = []
        this.ResultData.forEach(element => {
          element.FieldReq = JSON.parse(element.FieldReq);
        })
      }
    })

  }


  getModule() {
    this.obj1 = {
      data: {
        spname: 'usp_unfyd_dynamic_filter',
        parameters: {
          flag: 'GET_MODULE',

        },
      },
    };
    // this.common.hubControlEvent('Privilege', 'click', '', '', JSON.stringify(this.requestObj), 'getModule');

    this.api.post('index', this.obj1).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.modules = res.results.data;
      }
    });
  }


  saveUpdate() {

    for( const key of this.ResultData ){
      console.log(key);
      if(key.FieldReq.controlType == 'dropdown' || key.FieldReq.controlType == 'MultiSelect') {
        if (key.FieldReq.columnType !== 'Channel' && key.FieldReq.columnType !== 'AgentName' && key.FieldReq.columnType !== 'SkillName' && key.FieldReq.columnType !== 'UserName'
          && key.FieldReq.columnType !== 'UserId' && key.FieldReq.columnType !== 'LoginId' && key.FieldReq.columnType !== 'PRODUCT' && key.FieldReq.columnType !== 'Disposition'
          && key.FieldReq.columnType !== 'ChannelSource' && key.FieldReq.columnType !== 'TemplateName' && key.FieldReq.columnType !== 'SubDisposition' && key.FieldReq.columnType !== 'SubSubDisposition'
          ) {
           this.common.snackbar ('Please Map API')
          return
        }
      }
    }
    this.ResultData.forEach(element => {
      this.obj2 = {
        data: {
          spname: 'usp_unfyd_dynamic_filter',
          parameters: {
            flag: 'UPDATE',
            FieldReq: JSON.stringify(element.FieldReq),
            ModuleName: this.moduleName,
            Id: element.Id
          }
        }
      }
      this.api.post('index', this.obj2).subscribe(res => {
        if (res.code == 200) {
        }
        if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success')
        }
      });
    });
  }
}


