import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.scss']
})
export class FormEventComponent implements OnInit {

  loader: boolean = false;
  userDetails: any;
  requestObj: any;
  tabKey: any = [];
  tabValue: any = [];
  updateModules: any = [];
  form: FormGroup;
  labelName: any;
  modules: any;
  itemsPerPage: number = 8;
  search: any;
  page: number = 1;
  userConfig: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    public dialog: MatDialog,
    private location: Location,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    this.common.hubControlEvent('form','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.getModule();
    this.userDetails = this.auth.getUser();
    this.loader = false;
    this.form = this.formBuilder.group({
      Module: ['', Validators.required],
      DisplayName: ['', Validators.nullValidator],
      ModuleURL: ['', Validators.required],
      ModuleGroupping: ['', Validators.required],
      processid: [this.userDetails.Processid, Validators.nullValidator],
      publicip: [this.userDetails.ip, Validators.nullValidator],
      privateip: ['', Validators.nullValidator],
      browsername: [this.userDetails.browser, Validators.nullValidator],
      browserversion: [this.userDetails.browser_version, Validators.nullValidator]
    });
    this.common.hubControlEvent('form','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('form','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'FORM', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  add(){
    this.common.hubControlEvent('form','click','','','','add');

    this.router.navigate(['masters/form-event/add']);
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('form','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'form');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }
  getActionList(event) {
    this.loader = true;
    this.tabValue = [];
    this.tabKey = [];
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_module_action_list',
        parameters: {
          flag: 'GET',
          moduleid: event,
          productid : 1,
          processid : this.userDetails.Processid
        },
      },
    };
    this.common.hubControlEvent('form','click','','',JSON.stringify(this.requestObj),'getActionList');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.tabValue = res.results.data;
        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
      }
    });
  }
  getModule() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
        },
      },
    };
    this.common.hubControlEvent('form','click','','',JSON.stringify(this.requestObj),'getModule');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.modules = res.results.data;
      }

    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  openDialog(type, id) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        title: 'Are you sure?',
        subTitle: 'Do you want to ' + type + ' this data',
      },
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status == true && type == 'delete') {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_module_action_list',
            parameters: {
              flag: 'Delete',
              id: id,
              deletedby: this.userDetails.Id,
            },
          },
        };
        this.common.hubControlEvent('form','click','','',JSON.stringify(this.requestObj),'openDialog');

        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            this.common.snackbar("Success");
            this.router.navigate(['masters/form-event']);
          }
        });
      }
    });
  }
  changeStatus(refData: any, index: any) {
    this.common.hubControlEvent('form','click','','',JSON.stringify(refData),'changeStatus');

    let i = 0;
    this.tabValue.forEach(element => {
        if (element.Id == refData.Id) {
            this.tabValue[i].Status = !refData.Status;
            if (this.updateModules.length > 0) {
                let j = 0;
                let add = false;
                this.updateModules.forEach(element => {
                    if (element.Id == refData.Id) {
                        this.updateModules[j].Status = this.tabValue[i].Status
                        add = true;
                    }
                    j++;
                });

                if (!add) {
                    let obj = {
                        Id: this.tabValue[i].Id,
                        Status: this.tabValue[i].Status
                    }
                    this.updateModules.push(obj)
                }
            } else {
                let obj = {
                    Id: this.tabValue[i].Id,
                    Status: this.tabValue[i].Status
                }
                this.updateModules.push(obj)
            }

        }
        i++;
    });
}
}
