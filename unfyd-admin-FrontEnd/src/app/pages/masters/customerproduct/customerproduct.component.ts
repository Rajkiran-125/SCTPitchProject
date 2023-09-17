import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { CommonService } from 'src/app/global/common.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/global/auth.service';
import { DatePipe } from '@angular/common';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ActivatedRoute, Router } from '@angular/router';
import { regex, masters, checknull, checknull1 } from 'src/app/global/json-data';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customerproduct',
  templateUrl: './customerproduct.component.html',
  styleUrls: ['./customerproduct.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, deps: [CommonService], useFactory: (common: CommonService) => {
        let a: any = {
          parse: {
            dateInput: 'DD/MM/YYYY',
          },
          display: {
            dateInput: 'dddd/MMM/YYYY',
            monthYearLabel: 'MMMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY'
          }
        };

        common.localizationInfo$.subscribe((res1) => {
          a.display.dateInput = res1.selectedDateFormats.toUpperCase()
        })
        common.localizationDataAvailable$.subscribe((res) => {
          if (res) {
            common.localizationInfo$.subscribe((res1) => {
              a.display.dateInput = res1.selectedDateFormats.toUpperCase()
            })
          }
        })
        return a
      }
    }
  ]
})
export class CustomerproductComponent implements OnInit {
  config = {
    placeholder: '',
    tabsize: 1,
    height: '200px',
    uploadImagePath: '/api/upload',

    toolbar: [
      ['fontsize', ['fontname']],

      ['style', ['bold', 'underline', 'italic',]],

      ['para', ['ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table']],
      ['font', ['clear']],



    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  }

  userDetails: any;
  loginLoader: boolean = false;
  imgLoader: boolean[] = [];
  headerLoader: boolean = false;
  loginImg: any;
  form: FormGroup;
  Img: any;
  headerImg: any;
  loader: boolean = false;
  description: any;
  ProductName: any;
  productdata: any = [];
  productcatdata: any = [];
  isDisabled = false;
  productsubcatdata: any = [];
  skillId: any;
  requestObj: any;
  reset: boolean;
  groupname: any;
  productGROUP: any;
  editObj: any;
  dateFormat: any;
  image: any;
  submittedForm = false;
  @Input() data: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  @Input() isDialog: boolean = false;
  localizationDataAvailble: boolean = false;
  public filteredList1 = this.productdata.slice();
  public filteredList2 = this.productcatdata.slice();
  public filteredList3 = this.productsubcatdata.slice();
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  todayDate: Date = new Date();
  maxDate = new Date();
  ModuleGroupping: any = [];

  localizationData: any;
  labelName: any;
  userConfig: any;
  IsDateGreater: boolean = false;


  constructor(private common: CommonService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public datepipe: DatePipe,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogComponent>,) { Object.assign(this, { masters }); }

  ngOnInit(): void {
    this.common.hubControlEvent('Products', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.userDetails = this.auth.getUser();
    this.loader = true;
    this.common.setMasterConfig();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))

    var menu = JSON.parse(localStorage.getItem('menu'))
    var parent_menu = localStorage.getItem('parent_menu')
    var isChild = menu.filter(function (item) { return (item.ModuleGroupping == parent_menu) })[0].Keys;

    this.ModuleGroupping = isChild.map(function (elem) {
      return elem.Modulename
    })


    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.common.localizationDataAvailable$.subscribe((res) => {
      this.localizationDataAvailble = res;

    })
    this.common.setUserConfig(this.userDetails.ProfileType, 'Products');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
    }))
    this.common.refresh.subscribe((data) => {
      if (data == true) {
        this.getproductgroup();
      }
    });
    this.getproductgroup();

    const trimValidator: ValidatorFn = (buylink: FormControl) => {
      if (buylink.value && buylink.value.startsWith(' ')) {
        return {
          'trimError': { value: 'Whitespace not allowed.' }
        };
      }
      if (buylink.value && buylink.value.endsWith(' ')) {
        return {
          'trimError': { value: 'Whitespace not allowed.' }
        };
      }

      return null;
    };

    this.form = this.formBuilder.group({
      productgroup: ['', [Validators.required]],
      category: ['', [Validators.required]],
      subcategory: ['', [Validators.nullValidator]],
      ProductName: ['', [Validators.pattern(regex.alphnumericWithSpaceHyphen), Validators.required]],
      loginImgStatus: ['', [Validators.nullValidator]],
      description: ['', [Validators.nullValidator]],
      buybutton: [false, [Validators.nullValidator]],
      buynowlink: ['', [Validators.nullValidator]],
      buylink: ['', [Validators.nullValidator]],
      // buylink: ['', [Validators.nullValidator,trimValidator]],
      // ,trimValidatorValidators.pattern("[a-zA-Z0-9_]+.*$")
      fromDate: ['', [Validators.nullValidator]],
      toDate: ['', [Validators.nullValidator]],

    },
      { validator: [checknull1('ProductName'), checknull1('buynowlink'), checknull1('buylink')] },
    )



    this.skillId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.skillId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_customer_products",
          parameters: {
            flag: "edit",
            Id: this.skillId
          }
        }
      }

      this.api.post('index', Obj).subscribe(res => {

        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.loginImg = res.results.data[0].CustProductImg;
          this.getcategorydropdwon(res.results.data[0].ProductGroupId)
          this.editObj = res.results.data[0];
          const lowerObj = this.common.ConvertKeysToLowerCase();
          this.getproductgroup();
          this.getsubcategorydropdwon(this.editObj.CategoryId);
          this.form.controls.productgroup.patchValue(res.results.data[0].ProductGroupId)
          this.form.controls.category.patchValue(res.results.data[0].CategoryId ? res.results.data[0].CategoryId.toString() : res.results.data[0].CategoryId)
          this.form.controls.subcategory.patchValue(res.results.data[0].SubCategoryId ? res.results.data[0].SubCategoryId.toString() : res.results.data[0].SubCategoryId)
          this.form.controls.ProductName.patchValue(res.results.data[0].Name)
          this.form.controls.buybutton.patchValue(res.results.data[0].IsBuyNowButton)
          this.form.controls.buynowlink.patchValue(res.results.data[0].BuyNowButtonText)
          this.form.controls.buylink.patchValue(res.results.data[0].BuyNowURL)
          this.form.controls.fromDate.patchValue(res.results.data[0].LaunchDate)
          this.form.controls.toDate.patchValue(res.results.data[0].ExpiryDate)
          this.form.controls.description.patchValue(res.results.data[0].Description)
          if (res.results.data[0].LaunchDate) { this.todayDate = new Date(res.results.data[0].LaunchDate); }

          this.form.updateValueAndValidity();
          this.common.localizationDataAvailable$.subscribe((res) => {
            if (res) {
              this.common.localizationInfo$.subscribe((res1) => {
                this.form.updateValueAndValidity();
              })
            }
          })
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/customerproduct/add'])
    }
    this.common.hubControlEvent('Products', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }


  // ngAfterContentInit ():void{
  //   this.common.setUserConfig(this.userDetails.ProfileType, 'Products');
  //   this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
  //         this.userConfig = data
  //         console.log(this.userConfig,"this.userconfigngAfterContentInit")
  //         console.log(data,"this.data")
  //   }))
  // }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Products', 'click', '', '', data, 'setLabelByLanguage');

    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false

      this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Products', data)
  }

  getSnapShot() {
    this.common.hubControlEvent('Products', 'click', '', '', '', 'getSnapShot');

    this.userDetails = this.auth.getUser();
    this.skillId = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.url.subscribe((url) => {
      let skillId = 'Products'
      this.common.setUserConfig(this.userDetails.ProfileType, skillId);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }))
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  directUpload(event, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + '_branding_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
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
            this.loginLoader = true;


            this.common.hubControlEvent('Products', 'click', '', '', JSON.stringify(formData), 'directUpload');

            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {

                this.loginImg = res.results.URL;
                this.loginLoader = false;
              }

            })
          }
        };
      };

      reader.readAsDataURL(file);

    }
  }

  back(): void {
    this.common.hubControlEvent('Products', 'click', 'back', 'back', '', 'back');

    this.router.navigate(['masters/customerproduct']);
  }

  productGroup(e: any) {
    this.common.hubControlEvent('Products', 'click', '', '', e, 'productGroup');

    this.productGROUP = e
  }


  getproductgroup() {

    let Obj = {
      data: {
        spname: 'usp_unfyd_customer_product_grp',
        parameters: {
          flag: 'GET_PRODUCT_GROUP',
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId
        }
      }
    }
    this.common.hubControlEvent('Products', 'click', '', '', JSON.stringify(Obj), 'getproductgroup');

    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        let productdata = res.results.data;
        let data = [];
        for (let i = 0; i < productdata?.length; i++) {
          data.push({ 'Id': Number(res.results.data[i]['Actionable']), 'GroupName': res.results.data[i]['Group Name'] })
        }
        this.productdata = data
        this.filteredList1 = this.productdata.slice()

      }
    })
  }


  getcategorydropdwon(groupId: any) {
    this.groupname = groupId;
    let Obj = {
      data: {
        spname: 'usp_unfyd_customer_product_grp',
        parameters: {
          flag: 'GET_CATEGORY',
          PRODUCTGRPID: this.groupname,
          processid: this.userDetails.Processid,
          PRODUCTID: this.userDetails.ProductId
        }
      }
    }
    this.common.hubControlEvent('Products', 'click', '', '', JSON.stringify(Obj), 'getcategorydropdwon');

    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        this.productcatdata = res.results.data;
        this.filteredList2 = this.productcatdata.slice()
        let data = []

      }
    })
  }


  resetfunc() {
    this.common.hubControlEvent('Products', 'click', '', '', '', 'resetfunc');

    this.loginImg = undefined;
    this.form.controls.toDate.reset();
    this.form.controls.fromDate.reset();
    this.form.get('buynowlink').setValidators([Validators.nullValidator]);
    this.form.get('buylink').setValidators([Validators.nullValidator]);
    this.form.get('buynowlink').updateValueAndValidity();
    this.form.get('buylink').updateValueAndValidity();
    this.IsDateGreater = false;

    // setTimeout(() => {
    //   this.form.get('buynowlink').patchValue('buynowlink');
    //   this.form.get('buylink').patchValue('buylink');
    // }, 500);

  }

  getsubcategorydropdwon(catId: any) {
    let Obj = {
      data: {
        spname: 'usp_unfyd_customer_product_grp',
        parameters: {
          flag: 'GET_SUB_CATEGORY',
          PRODUCTGRPID: this.groupname,
          CATEGORYID: catId,
          processid: this.userDetails.Processid,
          PRODUCTID: this.userDetails.ProductId
        }
      }
    }
    this.common.hubControlEvent('Products', 'click', '', '', JSON.stringify(Obj), 'getsubcategorydropdwon');

    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        this.productsubcatdata = res.results.data;
        this.filteredList3 = this.productsubcatdata.slice()
        let data = []

      }
    })
  }


  checknull1(control: AbstractControl) {
    if (!this.form.value.buybutton) {
      if (control.value && control.value.length > 0) {
        if (control.value && control.value.trim().length < 3) {
          return { checknull1: true };
        } else {
          control.setErrors(null);
          // return { checknull1: false };
        }
      }
    } else {
      control.setErrors(null);
    }
  }

  flip() {
    this.common.hubControlEvent('Products', 'click', '', '', '', 'flip');

    // this.isDisabled = !this.isDisabled;checknull
    setTimeout(() => {
      if (!this.form.value.buybutton) {
        this.form.get('buynowlink').setValidators([Validators.required, this.checknull1.bind(this)]);
        this.form.get('buynowlink').updateValueAndValidity();

        this.form.get('buylink').setValidators([Validators.required, this.checknull1.bind(this)]);
        this.form.get('buylink').updateValueAndValidity();

        // this.form.get('buylink').setValidators([Validators.checknull]);
      }
      else {
        this.form.get('buynowlink').setValidators([Validators.nullValidator]);
        this.form.get('buynowlink').updateValueAndValidity();
        // this.form.get('buynowlink').reset()
        this.form.get('buylink').setValidators([Validators.nullValidator]);
        this.form.get('buylink').updateValueAndValidity();
        // this.form.get('buylink').reset()
      }

    });

  }


  submit(event) {

    this.loader = true;
    this.submittedForm = true;
    let buybutton = false;
    if (!this.form.value.buybutton) {
      if (this.form.controls['buynowlink'].invalid || this.form.controls['buylink'].invalid) {
        buybutton = true;

      }
    }
    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          if (buybutton) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
          }

        }
      }
      if (!buybutton) {
        return;

      }
    }


    let startds = new Date(this.form.value.fromDate)
    let endds = new Date(this.form.value.toDate)
    // if (startdsdate >= enddsdate) {
    //   this.loader = false;
    //   this.common.snackbar("LaunchDateShouldbeGreater");
    //   return;
    // }

    if (startds > endds) {
      this.IsDateGreater = true;
      this.loader = false;
      return
    }
    else {
      this.IsDateGreater = false;
    }
    if (this.skillId == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_customer_products",
          parameters: {
            flag: 'INSERT',
            PRODUCTGROUPID: this.form.value.productgroup,
            CATEGORYID: this.form.value.category,
            SUBCATEGORYID: this.form.value.subcategory,
            NAME: this.form.value.ProductName == null ? null : this.form.value.ProductName.trim(),
            DESCRIPTION: this.form.value.description,
            ISBUYNOWBUTTON: this.form.value.buybutton,
            BUYNOWBUTTONTEXT: this.form.value.buynowlink == null ? null : this.form.value.buynowlink.trim(),
            BUYNOWURL: this.form.value.buylink == null ? null : this.form.value.buylink.trim(),
            // LAUNCHDATE: this.form.value.fromDate,
            // EXPIRYDATE: this.form.value.toDate,
            LAUNCHDATE: this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd HH:mm:ss'),
            EXPIRYDATE: this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd HH:mm:ss'),
            CUSTPRODUCTIMG: this.loginImg,
            CREATEDBY: this.userDetails.Id,
            processid: this.userDetails.Processid,

          }
        }

      }
      this.common.customerproductMethod(this.form.value.productgroup)

    } else {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_customer_products",
          parameters: {
            flag: "UPDATE",
            PRODUCTGROUPID: this.form.value.productgroup,
            CATEGORYID: this.form.value.category,
            SUBCATEGORYID: this.form.value.subcategory,
            NAME: this.form.value.ProductName == null ? null : this.form.value.ProductName.trim(),
            DESCRIPTION: this.form.value.description,
            ISBUYNOWBUTTON: this.form.value.buybutton,
            BUYNOWBUTTONTEXT: this.form.value.buynowlink == null ? null : this.form.value.buynowlink.trim(),
            BUYNOWURL: this.form.value.buylink == null ? null : this.form.value.buylink.trim(),
            // LAUNCHDATE: this.form.value.fromDate,
            // EXPIRYDATE: this.form.value.toDate,
            LAUNCHDATE: this.datepipe.transform(this.form.value.fromDate, 'yyyy-MM-dd HH:mm:ss'),
            EXPIRYDATE: this.datepipe.transform(this.form.value.toDate, 'yyyy-MM-dd HH:mm:ss'),
            CUSTPRODUCTIMG: this.loginImg,
            modifiedby: this.userDetails.Id,
            id: this.skillId,
          }
        }
      }
    }
    this.common.hubControlEvent('Products', 'click', '', '', JSON.stringify(this.requestObj), 'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == "Data added successfully") {
          if (event == 'add') {
            this.router.navigate(['masters/customerproduct']);
            this.common.snackbar('Record add');
          } if (event == 'saveAndAddNew') {
            this.common.snackbar('Record add');
            this.form.reset()
            this.loginImg = undefined;
          }
        }
        else if (res.results.data[0].result == "Data updated successfully") {
          if (event == 'add')
            this.router.navigate(['masters/customerproduct']);
          this.common.snackbar('Update Success');
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_customer_products",
                    parameters: {
                      flag: 'ACTIVATE',
                      NAME: this.form.value.ProductName,
                      modifiedby: this.userDetails.Id,
                    }
                  }
                };
                this.common.hubControlEvent('Products', 'click', 'ACTIVATE', '', JSON.stringify(this.requestObj), 'submit');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (event == 'add') {
                      this.router.navigate(['masters/customerproduct']);
                      this.common.snackbar('Record add');
                      this.form.controls.productgroup.setErrors(null);
                      this.form.controls.category.setErrors(null);

                    } if (event == 'saveAndAddNew') {
                      this.common.snackbar('Record add');
                      this.form.reset()
                      this.loginImg = undefined;
                    }
                  }
                });
              }
              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))




        }
        else if ((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
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

  openpreview(type) {
    this.common.hubControlEvent('Products', 'click', 'ACTIVATE', '', JSON.stringify(type), 'openpreview');

    let temp = {
      Img: this.loginImg,
      ...this.form.value
    };
    const dia = this.dialog.open(DialogComponent, {
      data: {
        type: 'custpreview',
        data: temp
      },
      width: '30%',
      height: '80%'
    });
  }
  dropdown(type, module) {
    if (this.ModuleGroupping.includes(module)) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: this.data,
          isDialog: true
        },
        width: "90%",
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(status => {
        this.setLabelByLanguage(localStorage.getItem("lang"))
        this.common.setUserConfig(this.userDetails.ProfileType, 'Products');
        this.getproductgroup()
        if (status) {
          this.common.refreshMenu(status);
        }
      })
    }
    else {
      this.common.snackbar('ModuleInDialog')
    }
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
