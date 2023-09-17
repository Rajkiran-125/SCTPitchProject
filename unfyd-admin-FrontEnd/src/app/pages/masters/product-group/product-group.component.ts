import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex, masters, checknull, checknull1 } from 'src/app/global/json-data';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TitleCasePipe } from '@angular/common'
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html',
  styleUrls: ['./product-group.component.scss']
})
export class ProductGroupComponent implements OnInit {
  form: FormGroup;
  userDetails: any;
  loader: boolean = false;
  productId: any;
  reset: boolean;
  labelName: any;
  requestObj: any;
  product: any = [];
  category: any = [];
  public filteredList1 = this.product.slice();
  public filteredList2 = this.category.slice();
  groupname: any;
  productGROUP: any;
  @Input() tabs: any;
  @Input() ProductGroupValMaster: any;
  @Input() CategoryValMaster: any;
  search: string;
  currentpage: number = 1;
  itemsPerPage: number = 10;
  filter: boolean = false;
  Export: boolean = false;
  submittedForm: boolean = false;
  productTab: any;
  productCategory: string;
  subscription: Subscription[] = [];
  subscriptionPopupModal: Subscription | undefined;
  subscriptionAcitivateData: Subscription[] = [];
  userConfig: any;
  @Input() data: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  @Input() isDialog: boolean = false
  @Input() Category: any;
  @Input() ProductGroup: any;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    public dialog: MatDialog,
    private el: ElementRef,
    private titlecasePipe:TitleCasePipe,
    public dialogRef: MatDialogRef<DialogComponent>,) {
    Object.assign(this, { masters });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('ProductGroup','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.getproduct()
    this.loader = true;
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )

    this.common.setUserConfig(this.userDetails.ProfileType, 'ProductGroup');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          console.log(this.userConfig,"this.userConfig")
          console.log(data,"data");
          

          
    }))
    

    if(this.Id == null && this.tabs == undefined)
    {
    this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    this.tabs = this.activatedRoute.snapshot.paramMap.get('category');
    }
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.form = this.formBuilder.group({
      Groupname: ['', [Validators.required,Validators.pattern(regex.alphabet)]],
      description: ['', [Validators.nullValidator,Validators.minLength(3),Validators.maxLength(300)]],
      ProductGroup: ['', [Validators.required]],
      ProductGroup3: ['', [Validators.required]],
      Categoryname: ['', [Validators.required,Validators.pattern(regex.alphabetwithspaceandhypen)]],
      decrip: ['', [Validators.nullValidator, Validators.minLength(3),Validators.maxLength(300)]],
      categ: ['', [Validators.required]],
      subcategoryname: ['', [Validators.required,Validators.pattern(regex.alphabetwithspaceandhypen)]],
      des: ['', [Validators.nullValidator,Validators.minLength(3),Validators.maxLength(300)]],
      PROCESSID: [this.userDetails.Processid, Validators.nullValidator],
      PUBLICIP: [this.userDetails.ip, Validators.nullValidator],
      IP: ["", Validators.nullValidator],
      BROWSERNAME: [this.userDetails.browser, Validators.nullValidator],
      BROWSERVERSION: [this.userDetails.browser_version, Validators.nullValidator]
    },
    {validator:[checknull1('Groupname'),checknull1('Categoryname'),checknull1('subcategoryname'),checknull1('description'),checknull1('decrip'),checknull1('des'),]},
    // {validator:[regexwithalphabetandspaceandhypen('Categoryname'),regexwithalphabetandspaceandhypen('subcategoryname')]}

    ); 

    this.productId = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');
    this.productCategory = this.isDialog === true ? this.tabs : this.activatedRoute.snapshot.paramMap.get('category');      
   
    if(this.productCategory == 'GET_CATEGORY'){ this.editcateogry()} 
    else if (this.productCategory == 'GET_SUB_CATEGORY'){ this.editsubcategory()}
    else { this.editproduct()}

    this.common.hubControlEvent('ProductGroup','click','pageloadend','pageloadend','','ngOnInit');
this.getSnapShot()
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  editproduct(){
    this.loader = true
    if (this.productId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            flag: "EDIT_PRODUCT_GROUP",
            PRODUCTGRPID: this.productId,
          }
        }
      }
      this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(Obj),'editproduct');

      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.form.controls.Groupname.patchValue(res.results.data[0].CustProduct)
          this.form.controls.description.patchValue(decode(res.results.data[0].Description))
          this.form.controls.ProductGroup.patchValue('')
          this.form.controls.Categoryname.patchValue('')
          this.form.controls.decrip.patchValue('')
          this.form.controls.ProductGroup3.patchValue('')
          this.form.controls.categ.patchValue('')
          this.form.controls.subcategoryname.patchValue('')
          this.form.controls.des.patchValue('')
        }
      })
    } else {
      this.loader = false;
      // this.router.navigate(['/masters/product-group/add'])
    }
  }

  editcateogry(){
    this.loader = true
    if (this.productId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            flag: "EDIT_CATEGORY",
            CATEGORYID: this.productId,
          }
        }
      }
      this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(Obj),'editcateogry');

      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.getproduct()
          this.form.controls.ProductGroup.patchValue( res.results.data[0].CustProductId.toString())
          this.form.controls.Categoryname.patchValue(res.results.data[0].Category)
          this.form.controls.decrip.patchValue(decode(res.results.data[0].Description))
          this.form.controls.description.patchValue('')
          this.form.controls.Groupname.patchValue('')
          this.form.controls.ProductGroup3.patchValue('')
          this.form.controls.categ.patchValue('')
          this.form.controls.subcategoryname.patchValue('')
          this.form.controls.des.patchValue('')
          this.form.updateValueAndValidity();

    } })
    } else {
      this.loader = false;
      // this.router.navigate(['/masters/product-group/add'])
    }
  }
  editsubcategory(){
    this.loader = true
    if (this.productId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            flag: "EDIT_SUB_CATEGORY",
            SUBCATEGORYID: this.productId,
          }
        }
      }
      this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(Obj),'editsubcategory');

      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {                   
          this.getproduct()
          this.getcategorydropdwon(res.results.data[0].CustProductId);
          this.form.controls.ProductGroup3.patchValue(res.results.data[0].CustProductId ? res.results.data[0].CustProductId.toString():res.results.data[0].CustProductId)
          this.form.controls.categ.patchValue(res.results.data[0].CategoryId ? res.results.data[0].CategoryId.toString():res.results.data[0].CategoryId)
          this.form.controls.subcategoryname.patchValue(res.results.data[0].SubCategory)
          this.form.controls.des.patchValue(decode(res.results.data[0].Description))
          this.form.controls.ProductGroup.patchValue('')
          this.form.controls.Categoryname.patchValue('')
          this.form.controls.decrip.patchValue('')
          this.form.controls.description.patchValue('')
          this.form.controls.Groupname.patchValue('')
          this.form.updateValueAndValidity();          
    }
    }) } 
     else {
      this.loader = false;
      // this.router.navigate(['/masters/product-group/add'])
    }
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ProductGroup', data)
   
  }

  config: any;
  getSnapShot() {
    this.common.hubControlEvent('ProductGroup','click','','','','getSnapShot');

    this.activatedRoute.url.subscribe((url) => {
      
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, 'productgroup');
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });
    
  }
  back(): void {
    this.common.hubControlEvent('ProductGroup','click','back','back','','back');
    if(this.isDialog == true){
      this.dialogRef.close(true);
    }
    else{
      // this.location.back()
      this.router.navigate(['masters/product-group'])
    }
   

  }



  resetproductgroup(){
     this.form.controls.Groupname.reset();
     this.form.controls.description.reset();
     this.form.updateValueAndValidity();
  }

  resetcategory(){
    this.form.controls.ProductGroup.reset();
    this.form.controls.Categoryname.reset();
    this.form.controls.decrip.reset();
    this.form.updateValueAndValidity();
  }
  resetsubcategory(){
     this.form.controls.ProductGroup3.reset();
    this.form.controls.categ.reset();
    this.form.controls.des.reset();
     this.form.controls.subcategoryname.reset();
     this.form.updateValueAndValidity();
  }
  submitproduct(event) {
    console.log('this.form',this.form)
    
    if (this.form.controls["Groupname"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "Groupname" + '"]');
      invalidControl.focus();
      this.form.get('Groupname').markAsTouched();
      return;
    }
    if (this.form.controls["description"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "description" + '"]');
      invalidControl.focus();
      this.form.get('description').markAsTouched();
      return;
    }

    this.loader = true;
    this.submittedForm = true;
  
    if (this.productId == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            flag: 'INSERT_PRODUCT_GROUP',
            CreatedBy: this.userDetails.Id,
            CreatedOn: this.userDetails.CreatedOn,
            GROUPNAME: this.titlecasePipe.transform(this.form.get('Groupname').value == null ? null : this.form.get('Groupname').value.trim() ),
            DESCRIPTION: encode(this.form.get('description').value == null ? null : this.form.get('description').value.trim()),
            PublicIP: this.userDetails.ip,
            PrivateIP: '',
            BrowserName: this.userDetails.browser,
            BrowserVersion: this.userDetails.browser_version,
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
          }
        }

      }
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            FLAG: "UPDATE_PRODUCT_GROUP",
            GROUPNAME: this.form.value.Groupname == null ? null : this.form.value.Groupname.trim(),
            DESCRIPTION: encode(this.form.value.description == null ? null : this.form.value.description.trim()) ,
            // this.fullName = this.titlecasePipe.transform(this.fullName);
            PRODUCTGRPID: this.productId,
            MODIFIEDBY: this.userDetails.Id,
            ModifiedOn: this.userDetails.ModifiedOn
          }
        }
      }
    }
    this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(this.requestObj),'submitproduct');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.refreshMenu(true);
        this.loader = false;
        if(res.results.data[0]['result'].includes("added successfully")){
        this.common.snackbar('Record add');
        this.form.reset()
        }
        else if(res.results.data[0]['result'].includes("updated successfully")) {
          this.common.snackbar('Update Success');
          // this.router.navigate(['masters/product-group'])
          if(this.isDialog == true){
            this.dialogRef.close(true);
          
          }
          else{
            this.router.navigate(['masters/product-group'])}
            this.common.productTabs.next({tabs:this.tabs,ProductGroupValMaster:"",CategoryValMaster:""})
        }
        else if((res.results.data[0]['result'].includes("already exists"))&& (res.results.data[0].Status == false)) { 
          this.common.snackbar('Exists');
        }
        else if (res.results.data[0].Status == true) {
        
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
              this.common.getIndividualUpload$.subscribe(status => {
            if(status.status){
          

              // this.loader = true;
              this.requestObj = {
                data: {
                  spname: "usp_unfyd_customer_product_grp",
                  parameters: {
                    flag: 'ACTIVATE_GROUP',
                    GROUPNAME: this.form.get('Groupname').value,
                    processid: this.userDetails.Processid,
                    modifiedby: this.userDetails.Id,
                  }
                }
              };
              this.api.post('index', this.requestObj).subscribe((res: any) => {
                if (res.code == 200) {
                  this.common.productTabs.next({tabs:this.tabs = "GET_PRODUCT_GROUP",ProductGroupValMaster:"",CategoryValMaster:""})
                  this.router.navigate(['masters/product-group'])
                  this.common.snackbar('Record add');
                  this.form.reset()
                }
              });
          
          }
            
            this.subscriptionAcitivateData.forEach((e) => {
              e.unsubscribe();
            });
            }))

                
        
        
        }
          
          this.getproduct()

      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })

  }

  backproduct(){
    if(this.isDialog == true){
      this.dialogRef.close(true);
    }

    this.common.productTabs.next({tabs:this.tabs,ProductGroupValMaster:"",CategoryValMaster:""})
    this.router.navigate(['masters/product-group'])
  }

  getproduct() {
    this.loader = true
    this.requestObj = {
      data: {
        spname: "usp_unfyd_customer_product_grp",
        parameters: {
          flag: 'GET_PRODUCT_GROUP',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
        }
      }
    }
    this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(this.requestObj),'getproduct');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.product = res.results.data;
      this.filteredList1 = this.product.slice()
    })
    this.loader = false
  }

  submitproductcategory(event) {
    // this.loader = true;
    // this.loader = false;

          if(this.form.value.ProductGroup == '' || this.form.value.ProductGroup == undefined || this.form.value.ProductGroup == null)
          {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "ProductGroup" + '"]');
          invalidControl.focus();
          this.form.get('ProductGroup').markAsTouched();
          return;
          }

         if (this.form.controls["Categoryname"].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "Categoryname" + '"]');
          invalidControl.focus();
          this.form.get('Categoryname').markAsTouched();
          return;
        }
        if (this.form.controls["decrip"].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "decrip" + '"]');
          invalidControl.focus();
          this.form.get('decrip').markAsTouched();
          return;
        }

        this.loader = true;
        this.submittedForm = true;

    if (this.productId == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            flag: 'INSERT_CATEGORY',
            CreatedBy: this.userDetails.Id,
            PRODUCTGRPID: this.form.get('ProductGroup').value,
            CATEGORY: this.titlecasePipe.transform(this.form.get('Categoryname').value == null ? null : this.form.get('Categoryname').value.trim()),
            DESCRIPTION: encode(this.form.get('decrip').value == null ? null : this.form.get('decrip').value.trim()),
            PublicIP: this.userDetails.ip,
            PrivateIP: '',
            BrowserName: this.userDetails.browser,
            BrowserVersion: this.userDetails.browser_version,
            processid: this.userDetails.Processid,
            productId: this.userDetails.ProductId
          }
        }

      }
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            flag: "UPDATE_CATEGORY",
            CATEGORYID: this.productId,
            CATEGORY: this.titlecasePipe.transform(this.form.value.Categoryname == null ? null : this.form.value.Categoryname.trim()),
            DESCRIPTION: encode(this.form.value.decrip == null ? null : this.form.value.decrip.trim()),
            modifiedby: this.userDetails.Id,
            ModifiedOn: this.userDetails.ModifiedOn,
          }
        }
      }
    }
    this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(this.requestObj),'submitproductcategory');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {       
        if(event == 'update'){
        this.common.productTabs.next({tabs:this.tabs,ProductGroupValMaster:this.form.value.ProductGroup,CategoryValMaster:""})}
        this.loader = false;       
        this.getproduct()
        this.common.refreshMenu(true);
        if(res.results.data[0]['result'].includes("added successfully")){
          this.common.snackbar('Record add');
          this.form.reset()
        }
        else if(res.results.data[0]['result'].includes("updated successfully")) {
          this.common.snackbar('Update Success');
          if(this.isDialog == true){
            this.dialogRef.close(true);
          }
          else{
            this.router.navigate(['masters/product-group'])}
        }
        
        else if((res.results.data[0]['result'].includes("already exists"))&& (res.results.data[0].Status == false)) { 
          this.common.snackbar('Exists');
        }
        else if (res.results.data[0].Status == true) {

            this.common.confirmationToMakeDefault('AcitvateDeletedData');
            this.subscriptionAcitivateData.push(
                this.common.getIndividualUpload$.subscribe(status => {
              if(status.status){
            
              this.requestObj = {
                data: {
                  spname: "usp_unfyd_customer_product_grp",
                  parameters: {
                    flag: 'ACTIVATE_CATEGORY',
                    PRODUCTGRPID: this.form.get('ProductGroup').value,
                    CATEGORY: this.form.get('Categoryname').value,
                    processid: this.userDetails.Processid,
                    modifiedby: this.userDetails.Id,
                  }
                }
              };
              this.api.post('index', this.requestObj).subscribe((res: any) => {
                if (res.code == 200) {
                  this.common.productTabs.next({tabs:this.tabs = "GET_CATEGORY",ProductGroupValMaster:this.form.value.ProductGroup,CategoryValMaster:""})
                  this.router.navigate(['masters/product-group'])
                  this.common.snackbar('Record add');
                  this.form.reset()
                }
              });            
            }              
              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
              }))

        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })

  }

  backCate(){
    if(this.isDialog == true){
      this.dialogRef.close(true);
    }
    this.common.productTabs.next({tabs:this.tabs,ProductGroupValMaster:this.form.value.ProductGroup,CategoryValMaster:""})
    this.router.navigate(['masters/product-group'])
  }




  getcategorydropdwon(groupId: any) {
    this.loader = true
    this.requestObj = {
      data: {
        spname: "usp_unfyd_customer_product_grp",
        parameters: {
          flag: 'GET_CATEGORY',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
           PRODUCTGRPID: groupId,
        }
      }
    }
    this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(this.requestObj),'getcategorydropdwon');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.loader = false
      this.category = res.results.data;
      this.filteredList2 = this.category.slice()
    })
    
  }

  submitsubcategory(event) {  

    if(this.form.value.ProductGroup3 == '' || this.form.value.ProductGroup3 == undefined || this.form.value.ProductGroup3 == null)
    {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "ProductGroup3" + '"]');
      invalidControl.focus();
      this.form.get('ProductGroup3').markAsTouched();
      return;
    }
    if(this.form.value.categ == '' || this.form.value.categ == undefined || this.form.value.categ == null)
    {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "categ" + '"]');
      invalidControl.focus();
      this.form.get('categ').markAsTouched();
      return;
    }
    if (this.form.controls["subcategoryname"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "subcategoryname" + '"]');
      invalidControl.focus();
      this.form.get('subcategoryname').markAsTouched();
      return;
    }
    if (this.form.controls["des"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "des" + '"]');
      invalidControl.focus();
      this.form.get('des').markAsTouched();
      return;
    }
    // this.loader = true;
    // this.submittedForm = true;

    if (this.productId == null) {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            flag: 'INSERT_SUB_CATEGORY',
            CreatedBy: this.userDetails.Id,
            PRODUCTGRPID: this.form.get('ProductGroup3').value,
            CATEGORYID: this.form.get('categ').value,
            SUBCATEGORY: this.titlecasePipe.transform(this.form.get('subcategoryname').value == null ? null : this.form.get('subcategoryname').value.trim()),
            DESCRIPTION: encode(this.form.get('des').value == null ? null : this.form.get('des').value.trim())  ,
            PublicIP: this.userDetails.ip,
            PrivateIP: '',
            BrowserName: this.userDetails.browser,
            BrowserVersion: this.userDetails.browser_version,
            processid: this.userDetails.Processid,
            productId: this.userDetails.ProductId
          }
        }
      }
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_customer_product_grp",
          parameters: {
            flag: "UPDATE_SUB_CATEGORY",
            SUBCATEGORY: this.titlecasePipe.transform(this.form.value.subcategoryname == null ? null : this.form.value.subcategoryname.trim()),
            DESCRIPTION: encode(this.form.value.des == null ? null : this.form.value.des.trim()) ,
            SUBCATEGORYID: this.productId,
            modifiedby: this.userDetails.Id,

          }
        }
      }
    }
    this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(this.requestObj),'submitsubcategory');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.refreshMenu(true);
        if(event == 'update'){
        this.common.productTabs.next({tabs:this.tabs,CategoryValMaster:this.form.value.categ,ProductGroupValMaster:this.form.value.ProductGroup3})}
        if(res.results.data[0]['result'].includes("added successfully")){
          this.common.snackbar('Record add');
          this.form.reset()
        }
        else if(res.results.data[0]['result'].includes("updated successfully")) {
          this.common.snackbar('Update Success');
          if(this.isDialog == true){
            this.dialogRef.close(true);
          }
          else{
            this.router.navigate(['masters/product-group'])}
        }
        else if((res.results.data[0]['result'].includes("already exists"))&& (res.results.data[0].Status == false)) { 
          this.common.snackbar('Exists');
        }
        else if (res.results.data[0].Status == true) {

          
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
              this.common.getIndividualUpload$.subscribe(status => {
            if(status.status){
              this.requestObj = {
                data: {
                  spname: "usp_unfyd_customer_product_grp",
                  parameters: {
                    flag: 'ACTIVATE_SUBCATEGORY',
                    PRODUCTGRPID: this.form.get('ProductGroup3').value,
                    CATEGORYID: this.form.get('categ').value,
                    SUBCATEGORY: this.form.get('subcategoryname').value,
                    processid: this.userDetails.Processid,
                    modifiedby: this.userDetails.Id,
                  }
                }
              };
              this.common.hubControlEvent('ProductGroup','click','','',JSON.stringify(this.requestObj),'submitsubcategory');

              this.api.post('index', this.requestObj).subscribe((res: any) => {
                if (res.code == 200) {
                  this.common.productTabs.next({tabs:this.tabs = "GET_SUB_CATEGORY",CategoryValMaster:this.form.value.categ,ProductGroupValMaster:this.form.value.ProductGroup3})
                  this.router.navigate(['masters/product-group'])
                  this.common.snackbar('Record add');
                  this.form.reset()
                }
              });          
          }
            
            this.subscriptionAcitivateData.forEach((e) => {
              e.unsubscribe();
            });
            }))
        
        }
       
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })

  }



  update(e) {
    this.common.hubControlEvent('ProductGroup','click','','',e,'update');

    this.productTab = e;
  } 
  
  
  backSubcate(){

    if(this.isDialog == true){
      this.dialogRef.close(true);
    }
    // else{
    //   // this.location.back()
    //   this.router.navigate(['masters/product-group'])
    // }

    this.common.productTabs.next({tabs:this.tabs,CategoryValMaster:this.form.value.categ,ProductGroupValMaster:this.form.value.ProductGroup3})
    this.router.navigate(['masters/product-group'])
  }
  
  

  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

 




}
