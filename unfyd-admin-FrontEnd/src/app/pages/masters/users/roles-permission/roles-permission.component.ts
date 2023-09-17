import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, userFormSteps } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-roles-permission',
  templateUrl: './roles-permission.component.html',
  styleUrls: ['./roles-permission.component.scss']
})
export class RolesPermissionComponent implements OnInit {
  productTypeAccessControl: any = {};
  productTypeAccessControlCopy: any = {};
  masters: any;
  form: FormGroup;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  requestObj: any;
  path: any;
  editObj: any;
  reset: boolean = false;
  labelName: any;
  timeZones: any;
  userFormSteps: any;
  productType: any = [];
  profileType: any = [];
  profileTypeCopy: any = [];

  accessControl: any = [];
  productId: any;
  public filteredList2 = this.profileType.slice();
  public filteredList3 = this.accessControl.slice();
  temp1: any;
  selectedValue: any;
  selectValue: any;
  subscription: Subscription[] = [];
  userConfig: any;
  @Input() data: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  @Input() isDialog: boolean = false;
  @Output() tabSelected: any = new EventEmitter<any>();
  @Output() addId: any = new EventEmitter<any>();
  @Output() notifyDialog: any = new EventEmitter<any>();
  ModuleGroupping: any = [];
  menu: any = [];
  parent_menu: any;
  isChild: any = [];
  isfeature: boolean = false;
  products: any = [];
  dataObj: any = [];
  adminStore:any=[];
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public dialogRef: MatDialogRef<DialogComponent>,
    private el: ElementRef,
    public dialog: MatDialog) {
    Object.assign(this, { masters, userFormSteps });
  }
  ngOnInit(): void {
    this.common.hubControlEvent('Users', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.getSnapShot();

    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )

    this.menu = JSON.parse(localStorage.getItem('menu'))
    this.menu.forEach(element => {
      if (element.ModuleGroupping.includes('Feature Controls'))
        this.isfeature = true;
    });

    var parent_menu = localStorage.getItem('parent_menu');
    this.isChild = this.menu.filter(function (item) { return (item.ModuleGroupping == parent_menu) })[0].Keys;

    this.ModuleGroupping = this.isChild.map(function (elem) {
      return elem.Modulename
    })

    this.common.setUserConfig(this.userDetails.ProfileType, 'Users');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.form = this.formBuilder.group({
      product: this.formBuilder.array([]),
    })
    if (this.Id == null) {
      this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.path = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path != 'null') {
      this.loader = true;
      var Obj = {
        data: {
          spname: "usp_unfyd_user_product_mapping",
          parameters: {
            flag: "GET_USER_PRODUCT",
            userid: this.path,
          }
        }
      }
      this.api.post('index', Obj).subscribe((res: any) => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {



          this.loader = false;
          this.editObj = res.results.data;
          for (let i = 0; i < this.editObj.length; i++) {
            // if(res.results.data[i].AdminAccess == null){
            this.productId = this.editObj[i].ProductId;
            const firstGroupArray = this.form.get("product") as FormArray;
            firstGroupArray.push(this.formBuilder.group({
              productid: Number(this.editObj[i].ProductId),
              roleid: parseInt(this.editObj[i].RoleId),
              accesscontrolid: this.editObj[i].AccessControlId,
              // products:[this.editObj[i].AdminAccess.split(',').map(x=>parseInt(x))]
              products: [this.editObj[i].AdminAccess ? this.editObj[i].AdminAccess.split(',').map(x=>parseInt(x)) : []],
              // products:this.editObj[i].AdminAccess.split(',').map(x=>parseInt(x))

            }));
            this.getaccess(Number(this.editObj[i].RoleId), Number(this.editObj[i].ProductId) );
            //  }
            // else if(res.results.data[i].AdminAccess == true){
              res.results.data.forEach(element => {
                this.dataObj.push(element.ProductId)
              });
            // }
           }
          this.form.updateValueAndValidity();
          this.common.reloadDataMethod(true);
          if (this.editObj.length == 0) {
            this.addItem()
          }
        }
      })
    } else {
      this.loader = false;
    }


    this.getProducts();
    this.getProfileType();
    this.multipleproduct()
    this.common.hubControlEvent('Users', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('Users', 'click', '', '', data, 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Users', data)
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('Users', 'click', '', '', '', 'getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  back(): void {
    this.common.hubControlEvent('Users', 'click', 'back', 'back', '', 'back');
    if (this.isDialog == true) {
      this.dialogRef.close(true);
    }
    else {
      this.router.navigate(['/masters/users']);
    }
  }
  backspace(): void {
    this.common.hubControlEvent('Users', 'click', 'back', 'back', '', 'back');
    if (this.isDialog == true) {
      this.tabSelected.emit(userFormSteps[1].label)
    }
    else {
      this.router.navigate(['/masters/users']);
    }
  }
  get product(): FormArray {
    return this.form.get('product') as FormArray;
  }

  addItem(): void {
    // this.common.hubControlEvent('Users', 'click', '', '', '', 'addItem');

    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          break;
        }
      }
      this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }
    this.product.push(
      new FormGroup({
        productid: new FormControl('', Validators.required),
        roleid: new FormControl('', Validators.required),
        accesscontrolid: new FormControl('', Validators.required),
        products: new FormControl('', null)
      })
    )

  }


  removeProductGroup(i) {
    this.product.removeAt(i)
    if (this.editObj[i]?.Id) {
      let requestObj = {
        data: {
          spname: "usp_unfyd_user_product_mapping",
          parameters: {
            flag: "delete",
            id: this.editObj[i]?.Id
          }
        }
      }
      this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(requestObj), 'removeProductGroup');

      this.api.post('index', requestObj).subscribe((res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.common.snackbar("Delete Record");
          const add = this.form.get('product') as FormArray;
          add.removeAt(i);
          this.editObj.splice(i, 1)

        } else {
          this.loader = false;
          this.common.snackbar(res.results.data[0].result, "error");
        }
      },
        (error) => {
          this.loader = false;
          this.common.snackbar(error.message, "error");
        })
    }
    else {
      this.editObj.splice(i, 1)
    }
    this.profileType = JSON.parse(JSON.stringify(this.profileTypeCopy))

    // this.filteredList2 = JSON.parse(JSON.stringify(this.profileType))
    this.filteredList2 =this.profileType.slice()

    setTimeout(() => {
      this.filteredList2 = this.profileType.slice()
      });

  }

  getProducts() {
    this.common.hubControlEvent('Users', 'click', '', '', '', 'getProducts');

    this.productType = JSON.parse(localStorage.getItem('products'));
    this.productType.forEach(v => v.Id += '');


    this.productType.forEach(element => {
      Object.assign(this.productTypeAccessControl, { [element.Id]: [] })
    });
    this.productTypeAccessControlCopy = this.productTypeAccessControl
  }

  getProfileType() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "PROFILE",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(this.requestObj), 'getProfileType');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.profileType = res.results['data'];
      this.profileTypeCopy = JSON.parse(JSON.stringify(this.profileType));

      this.filteredList2 = JSON.parse(JSON.stringify(this.profileType));

      if ((this.profileType).length = 1) {

      }
    })
  }

  submit() {
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
      this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }

    var temp = this.form.value.product;
    for (let i = 0; i < temp.length; i++) {
      let array = (temp[i].products === null || temp[i].products === '') ? "" : temp[i].products.join(',');
      if (this.editObj[i]?.Id) {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_user_product_mapping",
            parameters: {
              flag: "update",
              id: this.isDialog === true ? this.Id : this.editObj[i]?.Id,
              productid: temp[i].productid,
              roleid: temp[i].roleid,
              AdminAccess:array ,
              accesscontrolid: temp[i].accesscontrolid,
              userid: this.path,
              modifiedby: this.userDetails.Id,
              publicip: this.userDetails.ip,
              privateip: '',
              browsername: this.userDetails.browser,
              browserversion: this.userDetails.browser_version
            }
          }
        }
      } else {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_user_product_mapping",
            parameters: {
              flag: "INSERT",
              productid: temp[i].productid,
              roleid: temp[i].roleid,
              // AdminAccess: temp[i].products.join(',') ,
              AdminAccess: array ,
              accesscontrolid: temp[i].accesscontrolid,
              userid: this.path,
              createdby: this.userDetails.Id,
              publicip: this.userDetails.ip,
              privateip: '',
              browsername: this.userDetails.browser,
              browserversion: this.userDetails.browser_version
            }
          }
        }
      }
      this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(this.requestObj), 'submit');

      this.api.post('index', this.requestObj).subscribe((res: any) => {
        if (res.code == 200) {
          this.common.refreshMenu(true);
          this.temp1 = res.results.data[0].Id

          this.loader = false;
          if (res.results.data[0].result.includes("added")) {
            this.common.snackbar('Update Success');
          } else if (res.results.data[0].result.includes("updated")) {
            this.common.snackbar('Update Success');
          }
          this.common.reloadDataMethod(true);
          let data = {
            Processid : this.userDetails.Processid,
            Agentid : this.path
          }
          this.common.sendCERequest('UpdateAgentMappingMaster', data)
          this.common.sendCEBotRequest('UpdateAgentMappingMaster',this.path == null ? res.results.data[0].Id : this.path,this.userDetails.Processid)
        } else {
          this.loader = false;
        }
      },
        (error) => {
          this.loader = false;
          this.common.snackbar(error.message, "error");
        })
    }

    if (temp.length == 0) {
      this.loader = false;
      this.router.navigate(['masters/users/channel-mapping', this.path]);
    }

  }

  productDetails(event, index) {
    this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(event, index), 'productDetails');

    this.productId = event;
console.log('this.form.controls.product.value[index].products',this.form.controls.product.value[index].products);

    if(this.productId == 11 && this.form.controls.product.value[index].products == ''){
      const productGroup = this.product.at(index) as FormGroup;
      const productsControl = productGroup.get('products') as FormControl;
      productsControl.setValidators([Validators.required]);
      productsControl.updateValueAndValidity();
    }
    if (this.productId == 11) {
      var arrayControl = this.form.get('product') as FormArray;
      (arrayControl.at(index) as FormGroup).get('roleid').patchValue(this.filteredList2[0].Id);
      this.getaccess(this.filteredList2[0].Id, this.productId)
    } else {
      var arrayControl = this.form.get('product') as FormArray;
      (arrayControl.at(index) as FormGroup).get('roleid').patchValue('');
      (arrayControl.at(index) as FormGroup).get('accesscontrolid').patchValue('');
    }
  }
  productAccess(event, index) {

    this.productId = event;
    if(this.productId == '' && this.form.controls.product.value[index].products == ''){
      const productGroup = this.product.at(index) as FormGroup;
      const productsControl = productGroup.get('products') as FormControl;
      productsControl.setValidators([Validators.required]);
      productsControl.updateValueAndValidity();
    }
  }


  findNonAdults(people: any[], i: any): any[] {
    let result = this.form.value.product.map(a => a.productid);
    let selectedValue: any
    people.forEach(element => {
      if (element.Id == this.form.value.product[i].productid && this.form.value.product[i].productid != undefined) {
        selectedValue = element
      }
    });
    let filteredArray = people.filter(p => !result.includes(p.Id));

    if (selectedValue)
      filteredArray.unshift(selectedValue)
    return filteredArray
  }

  getaccess(RoleId, index) {


    this.requestObj = {
      data: {
        spname: "usp_unfyd_access_controls",
        parameters: {
          flag: "GET_ROLE_ACCESS",
          processid: this.userDetails.Processid,
          roleid: RoleId,
          productid: index,
        }
      }
    }
    this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(this.requestObj), 'getaccess');
    this.api.post('index', this.requestObj).subscribe(res => {
      this.productTypeAccessControl[index] = res.results['data']
      this.productTypeAccessControlCopy = this.productTypeAccessControl
      this.productTypeAccessControlCopy[index] = this.productTypeAccessControl[index].slice()
    })
  }

  setFilterForaceesControl(index) {
    this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(index), 'setFilterForaceesControl');

    this.productTypeAccessControlCopy[this.form.value.product[index].productid] = this.productTypeAccessControl[this.form.value.product[index].productid].slice()
  }

  setAccess(event) {
    this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(event), 'setAccess');

    let arrayControl = this.form.get('product') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      (arrayControl.at(index) as FormGroup).get('accesscontrolid').patchValue(event);
    });
    this.form.updateValueAndValidity();
  }
  addnewsteps(event) {
    this.notifyDialog.emit(event)
  }

  addtabSelected(value: string) {
    this.tabSelected.emit(value);
  }
  addPathId(value: string) {
    this.addId.emit(value)
  }
  Next() {
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
      this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }
    var temp = this.form.value.product;
    for (let i = 0; i < temp.length; i++) {
      let array = (temp[i].products === null || temp[i].products === '') ? "" : temp[i].products.join(',');
      if (this.editObj[i]?.Id) {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_user_product_mapping",
            parameters: {
              flag: "update",
              id: this.isDialog === true ? this.Id : this.editObj[i]?.Id,
              productid: temp[i].productid,
              roleid: temp[i].roleid,
              // AdminAccess: temp[i].products.join(',') ,
              AdminAccess: array ,
              accesscontrolid: temp[i].accesscontrolid,
              userid: this.path,
              modifiedby: this.userDetails.Id,
              publicip: this.userDetails.ip,
              privateip: '',
              browsername: this.userDetails.browser,
              browserversion: this.userDetails.browser_version
            }
          }
        }
      } else {
        this.requestObj = {
          data: {
            spname: "usp_unfyd_user_product_mapping",
            parameters: {
              flag: "INSERT",
              productid: temp[i].productid,
              roleid: temp[i].roleid,
              // AdminAccess: temp[i].products.join(',') ,
              AdminAccess: array ,
              accesscontrolid: temp[i].accesscontrolid,
              userid: this.path,
              createdby: this.userDetails.Id,
              publicip: this.userDetails.ip,
              privateip: '',
              browsername: this.userDetails.browser,
              browserversion: this.userDetails.browser_version
            }
          }
        }
      }
      this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(this.requestObj), 'Next');

      this.api.post('index', this.requestObj).subscribe((res: any) => {
        if (res.code == 200) {

          this.loader = false;
          if (this.isDialog == true) {
            this.common.refreshMenu(true);
            this.tabSelected.emit(userFormSteps[3].label)
            this.addId.emit(this.Id)
          }
          else {
            this.router.navigate(['masters/users/channel-mapping', this.path]);
          }
          if (res.results.data[0].result == "Data added successfully") {
            this.common.snackbar('Update Success');
          }
          this.common.reloadDataMethod(true);
          let data = {
            Processid : this.userDetails.Processid,
            Agentid : this.path
          }
          this.common.sendCERequest('UpdateAgentMappingMaster', data)
          this.common.sendCEBotRequest('UpdateAgentMappingMaster',this.path == null ? res.results.data[0].Id : this.path,this.userDetails.Processid)
        } else {
          this.loader = false;
        }
      },
        (error) => {
          this.loader = false;
          this.common.snackbar(error.message, "error");
        })
    }

    if (temp.length == 0) {
      this.loader = false;
      this.router.navigate(['masters/users/channel-mapping', this.path]);
    }


  }
  dropdown(type, module) {
    if (this.productId != 11) {
      if (this.isfeature) {
        this.menu.forEach(element => {
          if (element.ModuleGroupping.includes('Feature Controls'))
            this.openDialog(type);
        });
      } else {
        this.common.snackbar('ModuleInDialog');
      }
    }
     else {
      if (this.ModuleGroupping.includes(module)) {
        this.openDialog(type);
      } else {
        this.common.snackbar('ModuleInDialog');
      }
    }
  }
  multipleproduct(){

    this.productType = JSON.parse(localStorage.getItem('products'))
    this.products = this.productType.filter((item) => item.Id !== 11);
  }
  openDialog(type) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: this.data,
        isDialog: true
      },
      width: "110%",
      height: '75%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(status => {
      this.setLabelByLanguage(localStorage.getItem("lang"))
      this.common.setUserConfig(this.userDetails.ProfileType, 'Users');
      this.getaccess(this.filteredList2[0].Id, this.productId)
      this.common.refreshMenu(status);
      if (status == true) {
        // this.common.refreshMenu(status);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
