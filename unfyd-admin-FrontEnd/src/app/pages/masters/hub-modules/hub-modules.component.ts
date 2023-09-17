import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { DatePipe, Location, NgIf } from '@angular/common'
import { regex, masters, checknull, checknull1, hubmoduleicon } from 'src/app/global/json-data';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-hub-modules',
  templateUrl: './hub-modules.component.html',
  styleUrls: ['./hub-modules.component.scss']
})
export class HubModulesComponent implements OnInit {
  hubmoduleicon:any = [];
  form: FormGroup;
  path: string;
  loginImg = false
  loader: boolean = false;
  obj: {};
  userDetails: any;
  config: any;
  categorymodule: any;
  subcategoryvalue: any;
  add: any;
  edit: any;
  delete: any;
  import: any;
  export: any;
  addactionbutton: boolean;
  ActionArray = [];
  reset: boolean;

  actionvalue: any = [
    { Key: 'Add', Value: 'Add' },
    { Key: 'Update', Value: 'Update' },
    { Key: 'Edit', Value: 'Edit' },
    { Key: 'Delete', Value: 'Delete' },
    { Key: 'Import', Value: 'Import' },
    { Key: 'Export', Value: 'Export' },
  ]
  labelName: any;
  type: any;
  iconimg: any;
  addactionable: any;
  cleartext: boolean;
  ActionValueOne: any;
  submittedForm = false;
  unmatchobject: any;
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  userConfig: any;
  mastericon:any = hubmoduleicon;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private el: ElementRef,) {
    Object.assign(this, { masters });
  }


  ngOnInit(): void {
    this.common.hubControlEvent('HubModules','click','pageload','pageload','','ngOnInit');

    this.getSnapShot()
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'HubModules');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.common.setMasterConfig();
    this.subscription.push(
       this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.mastericon = JSON.parse(data["HubModuleIcons"]);
        }
        else{
          this.mastericon = this.common.hubmoduleicon
        }

      })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.form = this.formBuilder.group({
      modulename: ['', [Validators.pattern(regex.alphabet),Validators.required]],
      formname: ['', [Validators.pattern(regex.alphabet),Validators.required]],
      uploadicon: ['', Validators.nullValidator],
      iconstore: ['', Validators.nullValidator],
      category: ['', Validators.required],
      subcategory: ['', Validators.nullValidator],
      resource: ['', [Validators.required,Validators.pattern(regex.urlregex)]],
      description: ['', [Validators.minLength(3),Validators.maxLength(500)]],
      actionable: ['', Validators.nullValidator],
      addactionable: ['', Validators.nullValidator],


    },
    {validator:[checknull('modulename'),checknull1('modulename'),checknull('formname'),checknull1('formname'),checknull('resource'),checknull1('description'),checknull('addactionable')]},

    );

    this.categoryname()

    if (this.path != null) {

      this.form.controls['modulename'].disable()

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
          this.form.controls.modulename.patchValue(res.results.data[0].Module)
          // this.iconimg = res.results.data[0].Icon
          this.form.controls.iconstore.patchValue(res.results.data[0].Icon)
          this.form.controls.formname.patchValue(res.results.data[0].DisplayName)
          this.form.controls.description.patchValue(decode(res.results.data[0].Description))
          this.form.controls.resource.patchValue(res.results.data[0].ModuleURL)
          this.form.controls.category.patchValue(res.results.data[0].ModuleGroupping)
          this.form.controls.subcategory.patchValue(res.results.data[0].SubModuleGroupping)
          this.getSubCategory(this.form.value.category)
          this.ActionValueOne.ActionList ? this.form.controls.actionable.patchValue((res.results.data[0].ActionList).split(',')) : this.form.controls.actionable.patchValue(res.results.data[0].ActionList);

          let actionList = this.ActionValueOne.ActionList.length > 1 ? (this.ActionValueOne.ActionList).split(',') : this.ActionValueOne.ActionList


          let availableActionValues = this.actionvalue.map(val => val.Key)
          console.log(availableActionValues,"availableActionValues")
          this.form.value.actionable.forEach(element => {
              if(!availableActionValues.includes(element)){
                console.log(availableActionValues,"availableActionValues1")
                this.actionvalue.push({ Key: element, Value: element })
              }
          });

        }
      })
    }
    else {
      this.loader = false;
    }
    // this.common.hubmoduleicon.forEach(element => {
    //   this.hubmoduleicon.push(element?.name)
    //   });
    this.common.hubControlEvent('HubModules','click','pageloadend','pageloadend','','ngOnInit');

  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getSnapShot() {
    this.common.hubControlEvent('HubModules','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.uploadicon, path);
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
    this.common.getIndividualUpload$.subscribe(res => {
      this.form.controls.uploadicon.setValue(res.status.attachmenturl);
    })

  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('HubModules','click','label','label',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'HubModules', data)

  }

  back(): void {
    this.common.hubControlEvent('HubModules','click','back','back','','back');

    this.location.back()
  }

  hubSubmit(type, formDirective: FormGroupDirective): void {

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
      return;
    }
    if (this.path == null) {
      this.obj = {
        data: {
          spname: "usp_unfyd_form_module",
          parameters: {
            flag: 'INSERT',
            Module: this.form.value.modulename.trim(),
            DisplayName: this.form.value.formname.trim(),
            Description: encode(this.form.value.description == null ? null : this.form.value.description.trim()),
            ModuleGroupping: this.form.value.category,
            SubModuleGroupping: this.form.value.subcategory,
            ModuleURL: this.form.value.resource.trim(),
            Icon: this.form.value.iconstore,
            publicip: this.userDetails.ip,
            privateip: this.userDetails.privateip,
            CREATEDBY: this.userDetails.Id,
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,



          }
        }
      }
    }

    else {
      this.obj = {
        data: {
          spname: "usp_unfyd_form_module",
          parameters: {
            flag: "UPDATE",
            ID: this.path,
            modifiedby: this.userDetails.Id,
            productid: this.userDetails.ProductId,
            Module: this.form.value.modulename,
            DisplayName: this.form.value.formname.trim(),
            Description: encode(this.form.value.description == null ? null : this.form.value.description.trim()),
            ModuleGroupping: this.form.value.category,
            SubModuleGroupping: this.form.value.subcategory,
            ModuleURL: this.form.value.resource.trim(),
            Icon: this.form.value.iconstore
          }
        }
      }
    }
    this.common.hubControlEvent('HubModules','click','','',JSON.stringify(this.obj),'hubSubmit');

    this.api.post('index', this.obj).subscribe(res => {
      if (res.code == 200) {
        if ((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Exists');
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
              this.common.getIndividualUpload$.subscribe(status => {
            if(status.status){
              // this.loader = true;
              this.obj = {
                data: {
                  spname: "usp_unfyd_form_module",
                  parameters: {
                    flag: 'ACTIVATE',
                    Module: this.form.value.modulename,
                    processid: this.userDetails.Processid,
                    modifiedby: this.userDetails.Id,
                  }
                }
              };
              this.common.hubControlEvent('HubModules','click','ACTIVATE','ACTIVATE',JSON.stringify(this.obj),'hubSubmit');

              this.api.post('index', this.obj).subscribe((res: any) => {
                if (res.code == 200) {
                  if (type == '') {
                    this.router.navigate(['masters/hubModules']);
                    this.common.snackbar('Record add')
                  }
                  if (type == 'addNew') {
                    this.router.navigate(['masters/hubModules/add']);
                    this.common.snackbar('Record add');
                    // this.iconimg = '';
                    // console.log(this.iconimg,"imageicon")

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
        else {
          var resModuleID = res.results.data[0].ID
          if(resModuleID !== null && resModuleID !== undefined)
          {
          this.addActionable(resModuleID)
          }
          this.loader = false;

          if (res.results.data[0].result == "Data added successfully") {
            if (type == '') {
              this.router.navigate(['masters/hubModules']);
              this.common.snackbar('Record add')
            }
            if (type == 'addNew') {
              this.router.navigate(['masters/hubModules/add']);
              this.common.snackbar('Record add');
              this.iconimg = '';

              this.form.reset()
              formDirective.resetForm()
            }
          }
          else if (res.results.data[0].result == "Data updated successfully") {
            this.common.snackbar('Update Success');
            this.router.navigate(['masters/hubModules']);

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





  addClearModule() {
  }


  directUpload(event, type, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + 'icon'+ this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);

    if (size > 2000) {

      this.common.snackbar("File Size");

    } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    } else {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("FileReso");
          } else {

            this.common.hubControlEvent('HubModules','click','ACTIVATE','ACTIVATE',JSON.stringify(formData),'directUpload');

            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                this.iconimg = res.results.data[0].Icon
                this.iconimg = res.results.URL;
                this.form.get('uploadicon').patchValue(this.iconimg);

              }

            })
          }
        };
      };

      reader.readAsDataURL(file);

    }
  }


  categoryname() {
    var Obj1 = {
      data: {
        spname: "usp_unfyd_form_module",
        parameters: {
          flag: 'GET_MODULE_CATEGORY',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
        }
      }
    }
    this.common.hubControlEvent('HubModules','click','GET_MODULE_CATEGORY','GET_MODULE_CATEGORY',JSON.stringify(Obj1),'categoryname');

    this.api.post('index', Obj1).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.categorymodule = res.results.data
      }
    })

  }


  getSubCategory(categoryname: any) {
    this.categoryname = categoryname
    var Obj1 = {
      data: {
        spname: 'usp_unfyd_form_module',
        parameters: {
          flag: 'GET_SUB_MODULE_CATEGORY',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,

          MODULEGROUPPING: this.categoryname,
        },
      },
    };
    this.common.hubControlEvent('HubModules','click','GET_SUB_MODULE_CATEGORY','GET_SUB_MODULE_CATEGORY',JSON.stringify(Obj1),'getSubCategory');

    this.api.post('index', Obj1).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.subcategoryvalue = res.results.data;
      }
    });
  }

  addActionable(ModuleId) {
    if (this.path == null) {
      this.obj = {
        data: {
          spname: "usp_unfyd_module_action_list",
          parameters: {
            flag: 'INSERT',
            ModuleId: ModuleId,
            ActionList: this.form.value.actionable == "" ? "" : this.form.value.actionable.join(','),
            CREATEDBY: this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: this.userDetails.privateip,
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,

          }
        }
      }
    }
    else {
      this.obj = {
        data: {
          spname: "usp_unfyd_module_action_list",
          parameters: {
            flag: 'UPDATE',
            ModuleId: this.path,
            ActionList: this.form.value.actionable == "" ? "" : this.form.value.actionable.join(','),
            publicip: this.userDetails.ip,
            privateip: this.userDetails.privateip,
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
            processid: this.userDetails.Processid,
            MODIFIEDBY: this.userDetails.Id,
            productid: this.userDetails.ProductId,
          }
        }
      }

    }

    this.common.hubControlEvent('HubModules','click','UPDATE','UPDATE',JSON.stringify(this.obj),'addActionable');

    this.api.post('index', this.obj).subscribe((res: any) => {
      // ("update response", res)
      if (res.code == 200) {
        this.loader = false;
        if (this.type == 'addNew') {
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



  addAction = false
  addActionActionable() {
    this.common.hubControlEvent('HubModules','click','','','','addActionActionable');

    this.addAction = false

  }

  insertAction(action) {
    this.common.hubControlEvent('HubModules','click','','',action,'insertAction');
    if (!action.trim()) {
      return
    } else {
      console.log(action);
      this.actionvalue.push({ Key: action, Value: action })
      this.form.get('addactionable').reset();
    }
  }

  clearAction() {
    this.common.hubControlEvent('HubModules','click','','','','clearAction');
    this.addAction = false
    this.form.get('addactionable').reset()
  }



  // Resetfunc(){
  //   this.common.hubControlEvent('HubModules','click','','','','Resetfunc');

  //   this.iconimg = undefined;
  // }


  Resetfunc(){

      this.common.hubControlEvent('HubModules','click','','','','Resetfunc');

      this.iconimg = undefined;

      this.actionvalue = [
       { Key: 'Add', Value: 'Add' },
       { Key: 'Update', Value: 'Update' },
       { Key: 'Edit', Value: 'Edit' },
       { Key: 'Delete', Value: 'Delete' },
       { Key: 'Import', Value: 'Import' },
       { Key: 'Export', Value: 'Export' },
      ]
      this.addAction = false
     }




  iconselect(data){

    this.form.get('iconstore').patchValue(data);
    this.form.get('iconstore').updateValueAndValidity();

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
