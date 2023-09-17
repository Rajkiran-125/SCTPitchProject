import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl,FormArray, FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, regex } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-copy-hub-admin',
  templateUrl: './copy-hub-admin.component.html',
  styleUrls: ['./copy-hub-admin.component.scss']
})
export class CopyHubAdminComponent implements OnInit {

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
  ID: any;
  copyId: string;
  ModuleValue: any;
  AccessCategoryValueOne: any = [];
  AccessCategoryValue: any = [];
  actionableloop: any;
  tabvalue: any = [];
  addValue: any;
  AccessActionableValueOne: any;
  AccessActionableValue: any;  
  action: any;
  subscription: Subscription[] = [];
  config: any;
  labelName: any;
  controlnameStore: any;
  submittedForm: boolean;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,    
    private el: ElementRef,
    private location: Location,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,) {
      Object.assign(this, { regex, masters });
   }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.HubId = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.getCategory();
    this.form = this.formBuilder.group({
      ModuleName: ['', Validators.nullValidator],
      ModuleId: ['', Validators.nullValidator],
      Name: ['', Validators.required],
      Category: ['', Validators.nullValidator],
      Subcategory: ['', Validators.nullValidator],
      Action: ['', Validators.nullValidator],
      Description: ['', Validators.nullValidator],
      Listoption: this.formBuilder.array([
        this.newListoption(),]),
      ModuleValue: this.formBuilder.array([
      ]),
    })
    if (this.HubId != null) {    

      this.loader = true
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
          this.ActionValueOne = res.results.data[0]

          this.getCategory();
          res.results.data.forEach(res1 => {
            this.tableloop.push({
              ModuleName: res1.ModuleName,
              Category: res1.ModuleGroupping,
              Subcategory: res1.SubModuleGroupping,
              Action: res1.ActionList ? res1.ActionList.split(",") : res1.ActionList,
              ModuleId: res1.ModuleId,
            })
          })
        }
      })
    }
    else {
      this.loader = false;
    }
}

getSnapShot() {
  this.userDetails = this.auth.getUser();
  this.HubId = this.activatedRoute.snapshot.paramMap.get('id');
  this.activatedRoute.url.subscribe(url => {
    let HubId = 'Privilege'
    this.common.setUserConfig(this.userDetails.ProfileType, HubId);
    this.subscription.push(this.common.getUserConfig$.subscribe(data => {
      this.config = data;
    }));
  });    
}

setLabelByLanguage(data) {
  this.loader = true
  this.subscription.push(
    this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false
      this.labelName = data1
    }));
  this.common.setLabelConfig(this.userDetails.Processid, 'Privilege', data)
}

back(): void {
  this.location.back()
}



get f(): { [Key: string]: AbstractControl } {
  return this.form.controls;
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
  debugger

  this.requestObj = {
    data: {
      spname: 'usp_unfyd_form_module',
      parameters: {
        flag: 'GET_MODULE_LIST',
        processid: this.userDetails.Processid,
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
  this.ModuleLabel = module;
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


save(type) {
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
    // this.common.snackbar("General Error");
    return;
  }

  if (this.tableloop.length == 0) {
    this.common.snackbar("PrivieleAddModuleReqiured");
    this.loader = false;
    return;
  }
  this.requestObj = {
      data: {
        spname: 'usp_unfyd_access_controls',
        parameters: {
          FLAG: 'INSERT_HUB_ACCESS',
          CONTROLNAME: this.form.value.Name,
          Description: this.form.value.Description,
          ROLEID: 1,
          productid: this.userDetails.ProductId,
          processid: this.userDetails.Processid,
          createdby: this.userDetails.Id,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }
  }
  this.api.post('index', this.requestObj).subscribe((res: any) => {
    if (res.code == 200) {
      this.ID = res.results.data[0].AccessControlID
      this.loader = false;
      this.ID = res.results.data[0].ID
      if ((res.results.data[0].result.includes("already exists")) && (res.results.data[0].Status == false)) {
        this.common.snackbar('Data Already Exist');
      }
      else if (res.results.data[0].Status == true) {
        const dialogRef = this.dialog.open(DialogComponent, {
          data: {
            type: 'softdeleted',
            subTitle: 'Record already exist and it is Inactive,Do you want to activate?',
          },
          width: '300px',
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(status => {
          if (status == true) {
            this.loader = true;
            this.requestObj = {
              data: {
                spname: "usp_unfyd_access_controls",
                parameters: {
                  flag: 'ACTIVATE',
                  CONTROLNAME: this.form.value.Name,
                  processid: this.userDetails.Processid,
                  modifiedby: this.userDetails.Id,
                }
              }
            };
            this.api.post('index', this.requestObj).subscribe((res: any) => {
              if (res.code == 200) {
                if (type == '') {
                  this.router.navigate(['masters/Privilege']);
                  this.common.snackbar('Record add');
                } if (type == 'addNew') {
                  this.common.snackbar('Record add');
                  this.router.navigate(['masters/Privilege/add']);
                  this.form.reset()
                  this.tableloop = []
                }
              }
            });
          }
        });
      }
      else {
        this.submit(type)
        if (type == '') {
          this.router.navigate(['masters/Privilege']);
          this.common.snackbar('Record add');
          this.loader = false;
        }
        if (type == 'addNew') {
          this.common.snackbar('Record add');
          this.router.navigate(['masters/Privilege/add']);
          this.tableloop = []
          this.form.reset()
          this.loader = false;
        }
      }
    }
    else {
      this.loader = false;
    }

  },
    (error) => {
      this.loader = false;
      this.common.snackbar("General Error");
    })


}



Listoption(): FormArray {
  return this.form.get("Listoption") as FormArray
}

addListoption() {
  this.Listoption().push(this.newListoption());
}
newListoption(): FormGroup {
  return this.formBuilder.group({

    ModuleName: ['', Validators.nullValidator],
    Action: ['', Validators.nullValidator],
    Category: ['', Validators.nullValidator],
    Subcategory: ['', Validators.nullValidator],

  })
}


submit(type) {
  // this.loader = true;
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
  let count = this.tableloop.length;
  this.tableloop.forEach(element => {

    this.requestObj = {
      data: {
        spname: 'usp_unfyd_module_map',
        parameters: {
          FLAG: 'INSERT_MAPPING_DATA',
          ActionList: element.Action.length > 0 ? element.Action.join(',') : '',
          ModuleName: element.ModuleName,
          ModuleId: element.ModuleId,
          ROLEID: 1,
          Status: 1,
          AccessControlID: this.ID,
          productid: this.userDetails.ProductId,
          createdby: this.userDetails.Id,
          // modifiedby: this.userDetails.Id,

          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version,
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      // this.loader = true
      if (res.code == 200) {
        if (type == '') {
          count--;
          if (count == 0) {
            this.router.navigate(['masters/Privilege']);
            this.common.snackbar('Record add');
          }
        }
        if (type == 'addNew') {
          count--;
          if (count == 0) {
            this.router.navigate(['masters/Privilege/add']);
            this.common.snackbar('Record add');
            this.form.reset()
          }
        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");

      })
  })
}
ModuleActionable(): FormArray {
  return this.form.get("ModuleValue") as FormArray
}

addItem(): void {
  if (this.form.invalid) {
    this.loader = false;
    for (const key of Object.keys(this.form.controls)) {
      if (this.form.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        break;
      }
    }

  }
  this.ModuleValue.push(
    new FormGroup({
      // ModuleId:new FormControl('',Validators.nullValidator),
      ModuleName: new FormControl('', Validators.nullValidator),
      Action: new FormControl('', Validators.nullValidator),
      Category: new FormControl('', Validators.nullValidator),
      Subcategory: new FormControl('', Validators.nullValidator),

    })
  )

}


moduleList(people: any[], i: any): any[] {
  // debugger
  let result = this.form.value.Listoption.map(a => a.ModuleName);
  let selectedValue: any
  people.forEach(element => {
    if (element.Id == this.form.value.Listoption[i].ModuleName && this.form.value.Listoption[i].ModuleName != undefined) {
      selectedValue = element
    }
  });
  let filteredArray = people.filter(p => !result.includes(p.Id));

  if (selectedValue)
    filteredArray.unshift(selectedValue)

  return filteredArray
}

categoryList(people: any[], i: any): any[] {
  // debugger
  let result = this.form.value.Listoption.map(a => a.Category);
  let selectedValue: any
  people.forEach(element => {
    if (element.ModuleGroupping == this.form.value.Listoption[i].Category && this.form.value.Listoption[i].Category != undefined) {
      selectedValue = element
    }
  });
  let filteredArray = people.filter(p => !result.includes(p.ModuleGroupping));

  if (selectedValue)
    filteredArray.unshift(selectedValue)

  return filteredArray
}



setFilterForCategory(index) {
  this.AccessCategoryValueOne[this.form.value.Listoption[index].Category] = this.AccessCategoryValue[this.form.value.Listoption[index].Category].slice()

}

setFilterForActionable(index) {
  this.AccessActionableValueOne[this.form.value.Listoption[index].ModuleName] = this.AccessActionableValue[this.form.value.Listoption[index].ModuleName].slice()

}

addValueItem() {
  this.modules.forEach(element => {
    if (element.Id == this.form.value.ModuleName) {
      this.ModulenameDisplay = element.Module;
    }
  })
  this.addValue = true;
  let a = { ModuleName: this.ModulenameDisplay, ModuleId: this.form.value.ModuleName, Category: this.form.value.Category, Subcategory: this.form.value.Subcategory, Action: this.form.value.Action ? this.form.value.Action : [] }
  this.tableloop.push(a)

  this.form.get('Category').reset()
  this.form.get('Subcategory').reset()
  this.form.get('ModuleName').reset()
  this.form.get('Action').reset()

}
}
