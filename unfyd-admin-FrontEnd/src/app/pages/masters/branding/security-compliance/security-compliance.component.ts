import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { Subscription } from "rxjs";
import { Router } from '@angular/router';


@Component({
  selector: 'app-security-compliance',
  templateUrl: './security-compliance.component.html',
  styleUrls: ['./security-compliance.component.scss']
})

export class SecurityComplianceComponent implements OnInit {
  @ViewChild('accordion',{static:true}) Accordion: MatAccordion

  loader: boolean = false;
  panelOpenState = false;
  userDetails: any;
  form: FormGroup;
  dialogConfig: any;
  actions: any = [];
  productType: any = [];
  productData: any = '';
  myFlagForButtonToggle:boolean = false;
  firstGroups: any;
  firstGroup: any;
  ExpandState: any;
  changeModuleDisplayName: string;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  userConfig: any;
  labelName: any;
  data: boolean = false;
  edit = false;

  constructor(private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private auth: AuthService,
    private api: ApiService,
    private common: CommonService,
  ) { }

  ngOnInit(): void {
    this.common.hubControlEvent('SecurityAndCompliance','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.form = this.fb.group({
      firstGroups: this.fb.array([])
    });
    this.common.setUserConfig(this.userDetails.ProfileType, 'SecurityAndCompliance');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
            this.userConfig = data

      }))
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
    this.getProducts()

    this.changeModuleDisplayName=this.common.changeModuleLabelName()
    this.common.hubControlEvent('SecurityAndCompliance','click','pageloadend','pageloadend','','ngOnInit');


  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false
      this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'SecurityAndCompliance', data)
  }

  getProducts() {
    this.common.hubControlEvent('SecurityAndCompliance','click','','','','getProducts');

    this.productType = JSON.parse(localStorage.getItem('products'))
    // this.productData = this.productType[0];
    // this.selectedProduct(this.productData)

  }

  loadForm(product) {
    let firstGroups = this.form.get("firstGroups") as FormArray;
    for (let i = 0; i < firstGroups.length; i++) {
      this.removeFirstLevel(i, '');
    }
    var Obj = {
      data: {
        flag: "get",
        filename: "security-and-compliance",
        processId: this.userDetails.Processid,
        product: product.ProductName
      }
    }
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(Obj),'loadForm');

    this.api.post('branding', Obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.data = true
        var data = JSON.parse(res.results.data);
        for (let iw = 0; iw < data.firstGroups.length; iw++) {
          const firstGroupArray = this.form.get("firstGroups") as FormArray;
          firstGroupArray.push(this.firstGroupArray);

          for (let ix = 0; ix < data.firstGroups[iw].formControls.length; ix++) {
            const firstControlsArray = firstGroupArray.at(iw).get("formControls") as FormArray;
            firstControlsArray.push(this.controlsArray);
          }

          for (let ix = 0; ix < data.firstGroups[iw].secondGroups.length; ix++) {
            const secondGroupsArray = firstGroupArray.at(iw).get("secondGroups") as FormArray;
            secondGroupsArray.push(this.secondGroupsArray);

            for (let iy = 0; iy < data.firstGroups[iw].secondGroups[ix].formControls.length; iy++) {
              const secondControlsArray = secondGroupsArray.at(ix).get("formControls") as FormArray;
              secondControlsArray.push(this.controlsArray);
            }

            for (let iy = 0; iy < data.firstGroups[iw].secondGroups[ix].thirdGroups.length; iy++) {
              const thirdGroupsArray = secondGroupsArray.at(ix).get("thirdGroups") as FormArray;
              thirdGroupsArray.push(this.thirdGroupsArray);

              for (let iz = 0; iz < data.firstGroups[iw].secondGroups[ix].thirdGroups[iy].formControls.length; iz++) {
                const thirdControlsArray = thirdGroupsArray.at(iy).get("formControls") as FormArray;
                thirdControlsArray.push(this.controlsArray);
              }

              for (let iz = 0; iz < data.firstGroups[iw].secondGroups[ix].thirdGroups[iy].forthGroups.length; iz++) {
                const forthGroupsArray = thirdGroupsArray.at(iy).get("forthGroups") as FormArray;
                forthGroupsArray.push(this.forthGroupsArray);

                for (let i = 0; i < data.firstGroups[iw].secondGroups[ix].thirdGroups[iy].forthGroups[iz].formControls.length; i++) {
                  const forthControlsArray = forthGroupsArray.at(iz).get("formControls") as FormArray;
                  forthControlsArray.push(this.controlsArray);
                }
              }
            }
          }
        }
        this.form.patchValue(data);
      } else if (res.code == 201) {
        // this.common.snackbar("General Error");
      } else { }
    } ,
    (error)=>{

      if (error.code == 401) {
      this.common.snackbar("Token Expired Please Logout",'error');
      }else{
        this.common.snackbar("General Error");
      }
    }

    )
  }

  get controlsArray(): FormGroup {
    return this.fb.group({
      id: '',
      key: '',
      value: '',
      label: '',
    });
  }


  controlForm(value) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(value),'controlForm');

    if (value.length > 0) {
      let arr = new FormArray([]);
      value.forEach(data => {
        arr.push(
          this.fb.group({
            id: data.Id,
            key: data.key,
            value: data.value,
            label: data.label,
          })
        );
      });
      return arr;
    } else {
      this.fb.array([])
    }

  }

  get firstGroupArray(): FormGroup {
    return this.fb.group({
      id: '',
      icon: '',
      title: '',
      status: '',
      formControls: this.fb.array([]),
      secondGroups: this.fb.array([])
    })
  }

  firstForm(data) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(data),'firstForm');


    return this.fb.group({
      id: data.id,
      icon: data.icon,
      title: data.title,
      status: data.status,
      formControls: Object.keys(data.formControls[0]).length == 0 ? this.fb.array([]) : this.controlForm(data.formControls),
      secondGroups: this.fb.array([])
    });

  }

  addFirstLevel() {
    this.common.hubControlEvent('SecurityAndCompliance','click','','','','addFirstLevel');

    this.dialogConfig = {
      data: {
        title: 'Add',
        type: 'addSecurityKey',
        parentid: '#',
        processid: this.userDetails.Processid,
        languagecode: localStorage.getItem('lang'),
        productid : this.productData.Id,
        productname: this.productData.ProductName,
        CREATEDBY: this.userDetails.Id,
        PUBLICIP: this.userDetails.ip,
      },
      width: '750px',
      disableClose: true
    };
    const dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data !== false) {
        const parent = <FormArray>this.form.controls['firstGroups'];
        parent.push(this.firstForm(data));
        setTimeout(() => {
          this.submit('addParent');
        }, 300);
      }
    });
  }

  deleteData(id){
    var Obj = {
      deletedby: this.userDetails.Id,
      PUBLICIP: this.userDetails.ip,
      id:id
    }
    this.common.hubControlEvent('SecurityAndCompliance','click','','',id,'deleteData');

    this.api.post('securitycompliance/delete', Obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.common.snackbar("Delete Record")
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    );
  }


  removeFirstLevel(ix, id) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',id,'removeFirstLevel');

    if(id !== ''){
      this.common.confirmationToMakeDefault('ConfirmationToDelete');
      this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
        if (status.status == true) {
              let firstGroups = this.form.get("firstGroups") as FormArray;
              firstGroups.removeAt(ix);
              this.deleteData(id)
              setTimeout(() => {
              }, 300);
            }


            this.subscriptionBulkDelete.forEach((e) => {
              e.unsubscribe();
            });


          }
      ))
    } else {
      let firstGroups = this.form.get("firstGroups") as FormArray;
      firstGroups.removeAt(ix);
    }
  }


  editFirstLevel(ix, id, icon, title, status, formControls) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(ix, id, icon),'editFirstLevel');
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify( title, status, formControls),'editFirstLevel');


    var controlArray = []
    for (let j = 0; j < formControls.length; j++) {
      const controlsArray = {
        id: formControls[j].value.id,
        key: formControls[j].value.key,
        label: formControls[j].value.label,
        value: formControls[j].value.value,
      };
      controlArray.push(controlsArray);
    }
    this.dialogConfig = {
      data: {
        title: 'Update',
        type: 'addSecurityKey',
        parentid: id,
        status: 'update',
        processid: this.userDetails.Processid,
        languagecode: localStorage.getItem('lang'),
        productid : this.productData.Id,
        productname: this.productData.ProductName,
        MODIFIEDBY: this.userDetails.Id,
        PUBLICIP: this.userDetails.ip,
        obj: {
          id: id,
          icon: icon,
          title: title,
          status: status,
          formControls: controlArray,
        }
      },
      width: '750px',
      disableClose: true
    };
    const dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data !== false) {
        let control = (this.form.get("firstGroups") as FormArray).at(ix) as FormGroup;
        control.get('icon').patchValue(data.icon);
        control.get('title').patchValue(data.title);
        control.get('status').patchValue(data.status);
        const controlsArray = control.get("formControls") as FormArray;
        controlsArray.clear();
        for (let i = 0; i < data.formControls.length; i++) {

          controlsArray.push(this.controlsArray);
        }

        control.get('formControls').patchValue(data.formControls);

        this.form.updateValueAndValidity();
        setTimeout(() => {
          this.submit('addParent');
        }, 300);
      }
    });
  }

  get secondGroupsArray(): FormGroup {
    this.common.hubControlEvent('SecurityAndCompliance','click','','','','secondGroupsArray');

    return this.fb.group({
      id: '',
      icon: '',
      title: '',
      status: '',
      formControls: this.fb.array([]),
      thirdGroups: this.fb.array([])
    });
  }

  secondForm(data) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',data,'secondForm');

    return this.fb.group({
      id: data.id,
      icon: data.icon,
      title: data.title,
      status: data.status,
      formControls: Object.keys(data.formControls[0]).length == 0 ? this.fb.array([]) : this.controlForm(data.formControls),
      thirdGroups: this.fb.array([])
    });
  }

  addSecondLevel(ix, id) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',id,'addSecondLevel');

    this.dialogConfig = {
      data: {
        title: 'Add',
        type: 'addSecurityKey',
        parentid: id,
        processid: this.userDetails.Processid,
        languagecode: localStorage.getItem('lang'),
        productid : this.productData.Id,
        productname: this.productData.ProductName,
        CREATEDBY: this.userDetails.Id,
        PUBLICIP: this.userDetails.ip,
      },
      width: '750px',
      disableClose: true
    };
    const dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data !== false) {
        const secondGroups = (<FormArray>this.form.controls['firstGroups']).at(ix).get('secondGroups') as FormArray;
        secondGroups.push(this.secondForm(data));
        setTimeout(() => {
          this.submit('addParent');
        }, 300);
      }
    });
  }

  removeSecondLevel(ix, iy, id) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',id,'removeSecondLevel');

      this.common.confirmationToMakeDefault('ConfirmationToDelete');
      this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
        if (status.status == true) {
          const secondGroups = (<FormArray>this.form.controls['firstGroups']).at(ix).get('secondGroups') as FormArray;
          secondGroups.removeAt(iy);
          this.deleteData(id)
          setTimeout(() => {
            this.submit('addParent');
          }, 300);
        }


        this.subscriptionBulkDelete.forEach((e) => {
          e.unsubscribe();
        });

      }
      ))


  }


  editSecondLevel(ix, iy, id, icon, title, status, formControls) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(ix, id, icon),'editSecondLevel');
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify( title, status, formControls),'editSecondLevel');


    var controlArray = []
    for (let j = 0; j < formControls.length; j++) {
      const controlsArray = {
        id: formControls[j].value.id,
        key: formControls[j].value.key,
        label: formControls[j].value.label,
        value: formControls[j].value.value,
      };
      controlArray.push(controlsArray);
    }
    this.dialogConfig = {
      data: {
        title: 'Update',
        type: 'addSecurityKey',
        parentid: id,
        status: 'update',
        processid: this.userDetails.Processid,
        languagecode: localStorage.getItem('lang'),
        productid : this.productData.Id,
        productname: this.productData.ProductName,
        MODIFIEDBY: this.userDetails.Id,
        PUBLICIP: this.userDetails.ip,
        obj: {
          id: id,
          icon: icon,
          title: title,
          status: status,
          formControls: controlArray,
        }
      },
      width: '750px',
      disableClose: true
    };
    const dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data !== false) {
        const control = (((this.form.get("firstGroups") as FormArray).at(ix) as FormGroup).get('secondGroups') as FormArray).at(iy) as FormGroup;
        control.get('icon').patchValue(data.icon);
        control.get('title').patchValue(data.title);
        control.get('status').patchValue(data.status);
        const controlsArray = control.get("formControls") as FormArray;
        controlsArray.clear();
        for (let i = 0; i < data.formControls.length; i++) {

          controlsArray.push(this.controlsArray);
        }

        control.get('formControls').patchValue(data.formControls);

        this.form.updateValueAndValidity();
        setTimeout(() => {
          this.submit('addParent');
        }, 300);
      }
    });
  }

  get thirdGroupsArray(): FormGroup {
    this.common.hubControlEvent('SecurityAndCompliance','click','','','','thirdGroupsArray');

    return this.fb.group({
      id: '',
      icon: '',
      title: '',
      status: '',
      formControls: this.fb.array([]),
      forthGroups: this.fb.array([])
    });
  }

  thirdForm(data) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(data),'thirdForm');

    return this.fb.group({
      id: data.id,
      icon: data.icon,
      title: data.title,
      status: data.status,
      formControls: Object.keys(data.formControls[0]).length == 0 ? this.fb.array([]) : this.controlForm(data.formControls),
      forthGroups: this.fb.array([])
    });
  }

  addThirdLevel(ix, iy, id) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(id),'addThirdLevel');

    this.dialogConfig = {
      data: {
        title: 'Add',
        type: 'addSecurityKey',
        parentid: id,
        processid: this.userDetails.Processid,
        languagecode: localStorage.getItem('lang'),
        productid : this.productData.Id,
        productname: this.productData.ProductName,
        CREATEDBY: this.userDetails.Id,
        PUBLICIP: this.userDetails.ip,
      },
      width: '750px',
      disableClose: true
    };

    const dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data !== false) {
        const thirdGroups = ((<FormArray>this.form.controls['firstGroups']).at(ix).get('secondGroups') as FormArray).at(iy).get('thirdGroups') as FormArray;
        thirdGroups.push(this.thirdForm(data));
        setTimeout(() => {
          this.submit('addParent');
        }, 300);
      }
    });
  }



  removeThirdLevel(ix, iy, iz, id) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(id),'removeThirdLevel');
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status == true) {
        const thirdGroups = ((<FormArray>this.form.controls['firstGroups']).at(ix).get('secondGroups') as FormArray).at(iy).get('thirdGroups') as FormArray;
        thirdGroups.removeAt(iz);
        this.deleteData(id)
        setTimeout(() => {
          this.submit('');
        }, 300);
      }


      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
  }

  editThirdLevel(ix, iy, iz, id, icon, title, status, formControls) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(ix, id, icon),'editThirdLevel');
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify( title, status, formControls),'editThirdLevel');

    var controlArray = []
    for (let j = 0; j < formControls.length; j++) {
      const controlsArray = {
        id: formControls[j].value.id,
        key: formControls[j].value.key,
        label: formControls[j].value.label,
        value: formControls[j].value.value,
      };
      controlArray.push(controlsArray);
    }
    this.dialogConfig = {
      data: {
        title: 'Update',
        type: 'addSecurityKey',
        parentid: id,
        status: 'update',
        processid: this.userDetails.Processid,
        languagecode: localStorage.getItem('lang'),
        productid : this.productData.Id,
        productname: this.productData.ProductName,
        MODIFIEDBY: this.userDetails.Id,
        PUBLICIP: this.userDetails.ip,
        obj: {
          id: id,
          icon: icon,
          title: title,
          status: status,
          formControls: controlArray,
        }
      },
      width: '750px',
      disableClose: true
    };
    const dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data !== false) {
        const control = (((((this.form.get("firstGroups") as FormArray).at(ix) as FormGroup).get('secondGroups') as FormArray).at(iy) as FormGroup).get('thirdGroups') as FormArray).at(iz) as FormGroup;
        control.get('icon').patchValue(data.icon);
        control.get('title').patchValue(data.title);
        control.get('status').patchValue(data.status);
        const controlsArray = control.get("formControls") as FormArray;
        controlsArray.clear();
        for (let i = 0; i < data.formControls.length; i++) {

          controlsArray.push(this.controlsArray);
        }

        control.get('formControls').patchValue(data.formControls);

        this.form.updateValueAndValidity();
        setTimeout(() => {
          this.submit('addParent');
        }, 300);
      }
    });
  }

  get forthGroupsArray(): FormGroup {
    this.common.hubControlEvent('SecurityAndCompliance','click','','','','forthGroupsArray');

    return this.fb.group({
      id: '',
      icon: '',
      title: '',
      status: '',
      formControls: this.fb.array([]),
    });
  }

  forthForm(data) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(data),'forthForm');

    return this.fb.group({
      id: data.id,
      icon: data.icon,
      title: data.title,
      status: data.status,
      formControls: Object.keys(data.formControls[0]).length == 0 ? this.fb.array([]) : this.controlForm(data.formControls),
    });
  }

  addForthLevel(ix, iy, iz, id) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(id),'addForthLevel');


    this.dialogConfig = {
      data: {
        title: 'Add',
        type: 'addSecurityKey',
        parentid: id,
        processid: this.userDetails.Processid,
        languagecode: localStorage.getItem('lang'),
        productid : this.productData.Id,
        productname: this.productData.ProductName,
        CREATEDBY: this.userDetails.Id,
        PUBLICIP: this.userDetails.ip,
      },
      width: '750px',
      disableClose: true
    };

    const dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data !== false) {
        const forthGroups = (((<FormArray>this.form.controls['firstGroups']).at(ix).get('secondGroups') as FormArray).at(iy).get('thirdGroups') as FormArray).at(iz).get('forthGroups') as FormArray;
        forthGroups.push(this.forthForm(data));
        setTimeout(() => {
          this.submit('addParent');
        }, 300);
      }
    });
  }


  removeForthLevel(ix, iy, iz, iw, id) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(id),'removeForthLevel');

      this.common.confirmationToMakeDefault('ConfirmationToDelete');
      this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
        if (status.status == true) {
          const forthGroups = (((<FormArray>this.form.controls['firstGroups']).at(ix).get('secondGroups') as FormArray).at(iy).get('thirdGroups') as FormArray).at(iz).get('forthGroups') as FormArray;
          forthGroups.removeAt(iw);
          this.deleteData(id)
          setTimeout(() => {
            this.submit('');
          }, 300);
        }


        this.subscriptionBulkDelete.forEach((e) => {
          e.unsubscribe();
        });
      }
      ))

  }

  editForthLevel(ix, iy, iz, iw, id, icon, title, status, formControls) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify(ix, id, icon),'editForthLevel');
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify( title, status, formControls),'editForthLevel');
    var controlArray = []
    for (let j = 0; j < formControls.length; j++) {
      const controlsArray = {
        id: formControls[j].value.id,
        key: formControls[j].value.key,
        label: formControls[j].value.label,
        value: formControls[j].value.value,
      };
      controlArray.push(controlsArray);
    }
    this.dialogConfig = {
      data: {
        title: 'Update',
        type: 'addSecurityKey',
        parentid: id,
        status: 'update',
        processid: this.userDetails.Processid,
        languagecode: localStorage.getItem('lang'),
        productid : this.productData.Id,
        productname: this.productData.ProductName,
        MODIFIEDBY: this.userDetails.Id,
        PUBLICIP: this.userDetails.ip,
        obj: {
          id: id,
          icon: icon,
          title: title,
          status: status,
          formControls: controlArray,
        }
      },
      width: '750px',
      disableClose: true
    };
    const dialogRef = this.dialog.open(DialogComponent, this.dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if (data !== false) {
        const control = (((((((this.form.get("firstGroups") as FormArray).at(ix) as FormGroup).get('secondGroups') as FormArray).at(iy) as FormGroup).get('thirdGroups') as FormArray).at(iz) as FormGroup).get('forthGroups') as FormArray).at(iw) as FormGroup;
        control.get('icon').patchValue(data.icon);
        control.get('title').patchValue(data.title);
        control.get('status').patchValue(data.status);
        const controlsArray = control.get("formControls") as FormArray;
        controlsArray.clear();
        for (let i = 0; i < data.formControls.length; i++) {

          controlsArray.push(this.controlsArray);
        }

        control.get('formControls').patchValue(data.formControls);

        this.form.updateValueAndValidity();
        setTimeout(() => {
          this.submit('addParent');
        }, 300);
      }
    });
  }

  selectedProduct(event) {
    this.common.hubControlEvent('SecurityAndCompliance','click','','',JSON.stringify( event),'selectedProduct');

    let firstGroups = this.form.get("firstGroups") as FormArray;
    for (let i = 0; i < firstGroups.length; i++) {
      this.removeFirstLevel(i, '');
    }
    this.productData = event;
    this.loadForm(this.productData)
    this.common.securityView.next({securityproduct:this.productData.Id})
  }
  submit(key)
  {

    var Obj = {
      data: {
        flag: "insert",
        filename: "security-and-compliance",
        processId: this.userDetails.Processid,
        product: this.productData.ProductName,
        brandingjson: this.form.value

      }
    }
    this.common.hubControlEvent('SecurityAndCompliance','click','','','','submit');

    this.api.post('branding', Obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        if (key == '') this.common.snackbar("Update Success");

      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    );
  }

  closepanel(){
    this.common.hubControlEvent('SecurityAndCompliance','click','','','','closepanel');

    this.ExpandState = !this.ExpandState;
    }

    closeAllPanels(){
      this.common.hubControlEvent('SecurityAndCompliance','click','','','','closeAllPanels');

      this.Accordion.closeAll();
  }
  blocklocation(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'BlockLocation',
         type:'security-modules',
         productid : this.productData.Id,
      },
      width: "700px",
      height: "60vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  Both(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'BlockContent',
         type:'security-modules',
         productid : this.productData.Id,
         typevisible : false
      },
      width: "800px",
      height: "35vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  blockcontent(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'agentBlockContent',
         type:'security-modules',
         productid : this.productData.Id,
         contentType: 'Block Content',
         typevisible : true
      },
      width: "800px",
      height: "40vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  contentAnalyser(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'ContentAnalyser',
         type:'security-modules',
         productid : this.productData.Id,
         contentType: 'Customer Content Analyzer',
         typevisible : true
      },
      width: "800px",
      height: "40vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  BlockIPAdd(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'BlockIPAdd',
         type:'security-modules',
         productid : this.productData.Id,
      },
      width: "700px",
      height: "60vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  SpamControl(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'SpamControl',
         type:'security-modules',
         productid : this.productData.Id,
         data: null,
      },
      width: "700px",
      height: "60vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  Blacklist(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'BlackList',
         type:'security-modules',
         productid : this.productData.Id,
         data: null,
      },
      width: "700px",
      height: "60vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  Email(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'Email',
         type:'security-modules',
         productid : this.productData.Id,
         data: null,
         ruleType: 'Email'
      },
      width: "700px",
      height: "60vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  Domain(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'Domain',
         type:'security-modules',
         productid : this.productData.Id,
         data: null,
         ruleType: 'Domain',
      },
      width: "700px",
      height: "60vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }
  IPAddress(){
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        moduleName:'IPAddress',
         type:'security-modules',
         productid : this.productData.Id,
         data: null,
         ruleType: 'IPAddress'
      },
      width: "700px",
      height: "60vh",
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      // this.common.setUserConfig(this.userDetails.ProfileType, 'ConfigManager');
    })
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}
