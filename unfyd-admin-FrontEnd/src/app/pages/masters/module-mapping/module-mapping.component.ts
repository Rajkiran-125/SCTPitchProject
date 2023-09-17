import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
@Component({
    selector: 'app-module-mapping',
    templateUrl: './module-mapping.component.html',
    styleUrls: ['./module-mapping.component.scss']
})

export class ModuleMappingComponent implements OnInit {
    loader: boolean = false;
    form: FormGroup;
    submittedForm = false;
    form1: FormGroup;
    tabKey: any = [];
    tabValue: any = [];
    tabValueReplica: any = [];
    requestObj: any;
    userDetails: any;
    itemsPerPage: number = 10;
    search: any;
    page: number = 1;
    roles: any = [];
    modules: any = [];
    Farray: any = [];
    array: any = [];
    userConfig: any;
    StatusDetails = new FormArray([]);
    roleId: any;
    message: any;
    updateModules: any = [];
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private auth: AuthService,
        private common: CommonService,
        private api: ApiService,
        private location: Location,
        private el: ElementRef,
    ) { }

    ngOnInit(): void {
        this.common.hubControlEvent('ModuleMapping','click','pageload','pageload','','ngOnInit');

        this.loader = false;
        this.userDetails = this.auth.getUser();
        this.getRole();
        this.form = this.formBuilder.group({
            ProcessId: ['', Validators.nullValidator],
            ProductId: ['', Validators.nullValidator],
            Role: ['', Validators.nullValidator],
            Module: ['', Validators.nullValidator],
        }),
            this.common.setUserConfig(this.userDetails.ProfileType, 'ModuleMapping');
        this.common.getUserConfig$.subscribe(data => {
            this.userConfig = data;
        });
        this.common.hubControlEvent('ModuleMapping','click','pageloadend','pageloadend','','ngOnInit');

    }
    getRole() {
        this.requestObj = {
            data: {
                spname: 'usp_unfyd_role_subtype',
                parameters: {
                    flag: 'EDIT',
                    processid: this.userDetails.Processid,
                    productid: 1,
                },
            },
        };
        this.common.hubControlEvent('ModuleMapping','click','','',JSON.stringify(this.requestObj),'getRole');

        this.api.post('index', this.requestObj).subscribe(res => {
            if (res.code == 200) {
                this.loader = false;
                this.roles = res.results.data;
            }
        });
    }
    getModule(event) {
        this.updateModules = [];
        let module = this.form.get('Module').value;
        this.roleId = event;
        if (module == '' || module == undefined || module == null) {
            this.requestObj = {
                data: {
                    spname: 'usp_unfyd_module_map',
                    parameters: {
                        flag: 'Module',
                        RoleId: event
                    },
                },
            };
            this.common.hubControlEvent('ModuleMapping','click','','',JSON.stringify(this.requestObj),'getModule');

            this.api.post('index', this.requestObj).subscribe(res => {
                if (res.code == 200) {
                    this.loader = false;
                    this.modules = res.results.data;
                }
            });
        }
        else{
            this.getModuleDetails(module);
        }
    }

    getModuleDetails(event) {
        this.tabValue = [];
        this.tabValueReplica = this.tabValue
        this.tabKey = [];
        this.updateModules = [];
        this.requestObj = {
            data: {
                spname: "usp_unfyd_module_map",
                parameters: {
                    flag: "GET",
                    // RoleId: 1,
                    RoleId: this.roleId,
                    Module: event,
                },
            },
        };
        this.common.hubControlEvent('ModuleMapping','click','','',JSON.stringify(this.requestObj),'getModuleDetails');

        this.api.post('index', this.requestObj).subscribe(res => {
            if (res.code == 200) {
                this.loader = false;
                this.tabValue = res.results.data;
                this.tabValueReplica = this.tabValue;
                this.array = res.results.data;
                for (var key in this.tabValue[0]) {
                    if (this.tabValue[0].hasOwnProperty(key)) {
                        this.tabKey.push(key);
                    }
                }
            }
        },
        (error)=>{
    
          if (error.code == 401) {            
        //   this.auth.logout('');
        this.common.snackbar("Token Expired Please Logout",'error');
          }
        } 
        
        );
    }
    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }
    back(): void {
        this.common.hubControlEvent('ModuleMapping','click','back','back','','back');

        this.location.back()
    }
    submit() {
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
        this.updateModules.forEach(element => {
            this.requestObj = {
                data: {
                    spname: "usp_unfyd_module_map",
                    parameters: {
                        flag: "UPDATE",
                        Id: element.Id,
                        Status: element.Status
                    }
                }
            }
            this.common.hubControlEvent('ModuleMapping','click','','',JSON.stringify(this.requestObj),'submit');

            this.api.post('index', this.requestObj).subscribe(res => {
                this.loader = false;
                if (res.code == 200) {
                    this.message = res.results.data[0].result;
                }
            });
        });
      
        this.common.snackbar("Update Success");
    }

    changeStatus(refData: any, index: any) {
        this.common.hubControlEvent('ModuleMapping','click','','',JSON.stringify(refData),'changeStatus');

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