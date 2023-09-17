import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ViewChild } from '@angular/core';
import { checknull, checknull1, regex } from 'src/app/global/json-data';
import { Subscription } from "rxjs";


@Component({
  selector: 'app-greetings',
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.scss']
})
export class GreetingsComponent implements OnInit {
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  userDetails: any;
  loader: boolean = false;
  filter: any;
  id: any;
  greetingid: any;
  catName: any;
  category: any = [];
  greeting: any = [];
  imgLoader: boolean = false;
  categoryImg: any;
  greetingImg: any;
  form: FormGroup;
  submittedForm: boolean = false;
  requestObj: any;
  labelName: any;
  productType: any = [];
  productData: any = '';
  productid: any = '';
  responseval: boolean = false
  isDisabled = false;
  productName: any;
  selectedproduct: any;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];

  userConfig: any;

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private common: CommonService,
    private formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private el: ElementRef,
    private location: Location

  ) {
    this.subscription.push(

      this.common.selectProductGreeting$.subscribe((res) => {
        // console.log('selectProductGreeting', res)
        this.selectedproduct = res;
        // localStorage.setItem('productid', res)

      }))

  }


  ngOnInit(): void {
    this.common.hubControlEvent('Greetings', 'click', 'pageload', 'pageload', '', 'ngOnInit');
    this.userDetails = this.auth.getUser();
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.activatedRoute.queryParams.subscribe(params => {
      this.filter = params.filter;
      this.selectedproduct = Number(params.productid);
      this.greetingid = params.greetingid;
      if (this.filter == 'category') {
        if (this.selectedproduct) this.getCategorypro(this.selectedproduct);
        // console.log(this.selectedproduct);

      }
      if (this.filter == 'add-category' || this.filter == 'edit-category') {
        this.categoryForm();

      }
      if (this.filter == 'greeting') {
        this.catName = params.name;
        this.getProduct();
      }
      if (this.filter == 'add-greeting' || this.filter == 'edit-greeting') {
        this.greetingForm();
      }
    });
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"));
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'Greetings');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
      // console.log(data);
    }))
    this.getProducts()
    this.common.hubControlEvent('Greetings', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('Greetings', 'click', 'pageloadend', 'pageloadend', data, 'setLabelByLanguage');
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Greetings', data)

  }
  getProducts() {
    this.common.hubControlEvent('Greetings', 'click', 'products', 'products', '', 'getProducts');
    this.productType = JSON.parse(localStorage.getItem('products'))
    // this.productName = this.productType.Id;
    // this.selectedproduct = this.productType[0].Id;
    // this.getCategorypro(this.selectedproduct)
  }


  getCategorypro(event) {
    // this.selectedproduct = event;
    this.common.selectProductGreetingMethod(event);
    // this.productid = this.selectedproduct
    this.loader = true;
    var obj = {
      data: {
        spname: "usp_unfyd_greetings_category",
        parameters: {
          flag: "get",
          processid: this.userDetails.Processid,
          productid: this.selectedproduct
        }
      }
    }

    this.common.hubControlEvent('Greetings', 'click', 'products', 'products', JSON.stringify(obj), 'getCategorypro');
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.category = res.results.data;
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = true;
      });
  }

  getCategory() {
    this.loader = true;
    var obj = {
      data: {
        spname: "usp_unfyd_greetings_category",
        parameters: {
          flag: "get",
          processid: this.userDetails.Processid,
          // productid: this.userDetails.ProductId
          productid: this.selectedproduct
        }
      }
    }
    this.common.hubControlEvent('Greetings', 'click', 'products', 'products', JSON.stringify(obj), 'getCategory');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/greetings/view',], { queryParams: { filter: 'category', productid: this.selectedproduct } });
        this.category = res.results.data;
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = true;
      });
  }
  categoryForm() {
    this.categoryImg = '';

    this.form = this.formBuilder.group({
      category: ['',[Validators.required,Validators.pattern(regex.alphabetWithUnderScore)]],
      uploadurl: ['', Validators.nullValidator],
    } ,{validator:[checknull('category'),checknull1('category')]})
    if (this.filter == 'edit-category') {
      var obj = {
        data: {
          spname: "usp_unfyd_greetings_category",
          parameters: {
            flag: "edit",
            id: this.id
          }
        }

      }
      this.common.hubControlEvent('Greetings', 'click', 'edit', 'edit', JSON.stringify(obj), 'categoryForm');

      this.categoryImg = '';
      this.api.post('index', obj).subscribe(res => {

        if (res.code == 200) {
          this.loader = false;
          // console.log(res)
          var tempRes = res.results.data[0]
          this.form.patchValue({
            category: tempRes.Category,
            uploadurl: tempRes.UploadURL
          })
          this.categoryImg = tempRes.UploadURL;

          // this.router.navigate(['masters/greetings/view',], { queryParams: { filter: 'category' } });
        }
      },
        (error) => {
          this.common.snackbar("General Error");
          this.loader = true;
        })
    }
  }

  greetingForm() {
    this.greetingImg = ''
    this.form = this.formBuilder.group({
      imagename: ['',[Validators.required, Validators.maxLength(50),Validators.pattern(regex.alphabetWithUnderScore)]],

      imageurl: ['', Validators.nullValidator],
      // imageno: ['', Validators.nullValidator],
      caption: ['', [Validators.nullValidator, Validators.maxLength(300)]],
    } , {validator:[checknull('imagename'),checknull1('imagename')]})
    if (this.filter == 'edit-greeting') {
      var obj = {
        data: {
          spname: "usp_unfyd_greetings",
          parameters: {
            flag: "edit",
            id: this.greetingid,
            productid: this.selectedproduct
          }
        }
      }
      this.common.hubControlEvent('Greetings', 'click', 'edit', 'edit', JSON.stringify(obj), 'greetingForm');
      this.greetingImg = ''
      this.api.post('index', obj).subscribe(res => {
        if (res.code == 200) {
          this.loader = false;
          // console.log(res)
          var tempRes = res.results.data[0]
          this.form.patchValue({
            imagename: tempRes.ImageName,
            imageurl: tempRes.ImageURL,
            // imageno: tempRes.ImageNo,
            caption: tempRes.Caption,
          })
          this.greetingImg = tempRes.ImageURL;

          // this.router.navigate(['masters/greetings/view',], { queryParams: { filter: 'category' } });
        }
      },
        (error) => {
          this.common.snackbar("General Error");
          this.loader = true;
        })
    }
  }
  insertCategory() {
    if (this.form.invalid) {
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          if (invalidControl) {
            invalidControl.focus();
          }
          break;
        }
      }
      this.form.markAllAsTouched()
      // this.common.snackbar("General Error");
      return;

    } else if (this.categoryImg == null || this.categoryImg == 'undefined' || this.categoryImg == '') {
      this.common.snackbar("UploadYourFile");
      return;
    }
    // if((this.form.value.imagename.trim()).length <= 0){
    //   this.loader = false;
    //   return;
    // }

    if (this.filter == 'add-category') {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_greetings_category",
          parameters: {
            flag: "insert",
            // ...this.form.value,
            category : this.form.value.category.trim(),
            uploadurl : this.form.value.uploadurl,
            processid: this.userDetails.Processid,
            // productid: 1,
            productid: this.selectedproduct,
            createdby: this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version
          }
        }
      }
      this.common.hubControlEvent('Greetings', 'click', 'insert', 'insert', JSON.stringify(this.requestObj), 'insertCategory');

    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_greetings_category",
          parameters: {
            flag: "update",
            // ...this.form.value,
            category : this.form.value.category.trim(),
            uploadurl : this.form.value.uploadurl,
            id: this.id,
            modifiedby: this.userDetails.Id,
          }
        }
      }
    }
    // console.log(this.requestObj, "usp_unfyd_greetings_category update");
    this.api.post('index', this.requestObj).subscribe(res => {

      if (res.code == 200) {
        this.loader = false;

        // this.back();
        // this.common.snackbar(res.results.data[0].result, "success")
        if (res.results.data[0].result == "Data added successfully") {


          this.common.snackbar('Record add');
          this.router.navigate(['masters/greetings/view',], { queryParams: { filter: 'category', productid: this.selectedproduct } });
          this.getCategorypro(this.selectedproduct)
        } else if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');
          // this.common.selectProductGreetingMethod(this.selectedproduct);
          this.router.navigate(['masters/greetings/view',], { queryParams: { filter: 'category', productid: this.selectedproduct } });
        }
        // else if (res.results.data[0].result == "Data already exists") {
        //   this.common.snackbar('Data Already Exist');
        // }

        else if ((res.results.data[0].result.includes('already exists')) && (res.results.data[0].Status == false)) {
          this.common.snackbar('Exists');
          this.loader = false;
        }
        // res.results.data[0].Status == true
        else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
             this.common.getIndividualUpload$.subscribe(status => {
           if(status.status){

            this.requestObj = {
              data: {
                spname: "usp_unfyd_greetings_category",
                parameters: {
                  flag: 'ACTIVATE',
                  category: this.form.value.category,
                  PRODUCTID: this.selectedproduct,
                  processid: this.userDetails.Processid,
                  modifiedby: this.userDetails.Id,
                }
              }
            };


            this.api.post('index', this.requestObj).subscribe((res: any) => {
              if (res.code == 200) {
                if (this.filter == 'add-category') {
                  this.common.snackbar('Record add');
                  this.router.navigate(['masters/greetings/view',], { queryParams: { filter: 'category', productid: this.selectedproduct } });
                  this.getCategorypro(this.selectedproduct)
                }
                else{
                  this.common.snackbar('Update Success');
                  // this.common.selectProductGreetingMethod(this.selectedproduct);
                  this.router.navigate(['masters/greetings/view',], { queryParams: { filter: 'category', productid: this.selectedproduct } });
                }
              }
            });

          }

           this.subscriptionAcitivateData.forEach((e) => {
             e.unsubscribe();
           });
           }))


        }
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = true;
      })
    this.getCategorypro(this.selectedproduct)
    this.form.markAsUntouched();
    this.form.markAsPristine()
  }


  deleteItem(i, type, id) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if(status.status){
        this.requestObj = {
          data: {
            spname: type == 'category' ? "usp_unfyd_greetings_category" : "usp_unfyd_greetings",
            parameters: {
              flag: "delete",
              id: id
            }
          }
        }
        this.common.hubControlEvent('Greetings','click','delete','delete',JSON.stringify(this.requestObj),'deleteItem');

        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            this.loader = false;
            var tempObj = type == 'category' ? this.category : this.greeting
            tempObj.splice(i, 1);
            // this.common.snackbar(res.results.data[0].result, "success")
            if( res.results.data[0].result == 'Data deleted successfully'){
              this.common.snackbar('Delete Record')
            }

          }
        },
          (error) => {
            this.common.snackbar("General Error");
            this.loader = true;
          })



        }
        this.subscriptionBulkDelete.forEach((e) => {
          e.unsubscribe();
        });
      }))


  }




  deletecategory(id){
    let idvalue = id;
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if(status.status){
        this.loader = true;
        this.requestObj = {
          data: {
            spname:"usp_unfyd_greetings_category",
            parameters: {
              flag: "delete",
              id: id
            }
          }
        }
        this.common.hubControlEvent('Greetings','click','delete','delete',JSON.stringify(this.requestObj),'deletecategory');

        this.api.post('index', this.requestObj).subscribe(res => {
          if (res.code == 200) {
            this.loader = false;
            for(let i=0;i<= this.category.length;i++)
            {
              if(this.category[i].Actionable == idvalue)
              {
                this.category.splice(i, 1);
              }
            }
            // this.common.snackbar(res.results.data[0].result, "success")

            if( res.results.data[0].result == 'Data deleted successfully'){
              this.common.snackbar('Delete Record')
            }

          }
        },
          (error) => {
            this.common.snackbar("General Error");
            this.loader = true;
          })


                }

                this.subscriptionBulkDelete.forEach((e) => {
                  e.unsubscribe();
                });
              }
            ))



  }

  enabledisbaletoggle() {
    this.common.hubControlEvent('Greetings', 'click', 'toggle', 'toggle', '', 'enabledisbaletoggle');

  }


  onChange(event, data, i) {
    this.isDisabled = !this.isDisabled;
    // console.log(event.checked,"toggle onChange");
    // console.log(data,"toggle data");

    this.requestObj = {
      data: {
        spname: "usp_unfyd_greetings",
        parameters: {
          flag: "ENABLE_DISABLE_GREETINGS",
          status: event.checked,
          id: data,
          modifiedby: this.userDetails.Id,
        }
      }
    }
    this.common.hubControlEvent('Greetings', 'click', 'ENABLE_DISABLE_GREETINGS', 'ENABLE_DISABLE_GREETINGS', JSON.stringify(this.requestObj), 'onChange');

    // console.log(this.requestObj, "request OBJ");

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        // var tempObj = type == 'category' ? this.category : this.greeting
        // tempObj.splice(i, 1);
        this.greeting[i]['Status'] = !this.greeting[i]['Status']
        this.common.snackbar("Saved Success");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = true;
      })
    this.getProduct();
  }
  insertProduct() {


    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {


          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          if (invalidControl) {
            invalidControl.focus();
          }
          break;
        }
      }
      this.form.markAllAsTouched()
      // this.common.snackbar("General Error");
      return;

    } else if (this.greetingImg == null || this.greetingImg == 'undefined' || this.greetingImg == '') {
      this.common.snackbar("UploadYourFile");
      return;
    }

    //  this.productid = JSON.parse(localStorage.getItem('productid'));

    if (this.filter == 'add-greeting') {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_greetings",
          parameters: {
            flag: "insert",
            // ...this.form.value,
            imagename: this.form.value.imagename.trim(),
            imageurl: this.form.value.imageurl,
            caption: this.form.value.caption == null ? null : this.form.value.caption.trim(),
            categoryid: this.id,
            processid: this.userDetails.Processid,
            // productid: 1,
            productid: this.selectedproduct,
            createdby: this.userDetails.Id,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version
          }
        }
      }
      this.common.hubControlEvent('Greetings', 'click', 'insert', 'insert', JSON.stringify(this.requestObj), 'insertProduct');

    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_greetings",
          parameters: {
            flag: "update",
            // ...this.form.value,
            imagename: this.form.value.imagename.trim(),
            imageurl: this.form.value.imageurl,
            caption: this.form.value.caption == null ? null : this.form.value.caption.trim(),
            id: this.greetingid,
            modifiedby: this.userDetails.Id,
          }
        }
      }

    }
    // console.log(this.requestObj, "usp_unfyd_greetings requestObj");
    this.api.post('index', this.requestObj).subscribe(res => {
      console.log(this.requestObj,"this.requestObj greetings");

      if (res.code == 200) {
        this.loader = false;


        if (res.results.data[0].result == "Data added successfully") {
          console.log(res.results.data[0].result,"res.results.data[0].result inside greeting");

          this.common.snackbar('Record add');
          this.router.navigate(['masters/greetings/view', this.id], { queryParams: { filter: 'greeting', productid: this.selectedproduct } });
          // this.back();
        } else if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');
          this.router.navigate(['masters/greetings/view', this.id], { queryParams: { filter: 'greeting', productid: this.selectedproduct } });
          // this.back();
        }
        // else if (res.results.data[0].result == "Data already exists") {
        //   this.common.snackbar('Data Already Exist');
        // }

        else if ((res.results.data[0].result.includes('already exists')) && (res.results.data[0].Status == false)) {
          this.common.snackbar('Exists');
          this.loader = false;
        }
         else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
             this.common.getIndividualUpload$.subscribe(status => {
           if(status.status){


            // this.loader = true;
            this.requestObj = {
              data: {
                spname: "usp_unfyd_greetings",
                parameters: {
                  flag: 'ACTIVATE',
                  IMAGENAME: this.form.value.imagename,
                  CAPTION: this.form.value.caption,
                  productid: this.selectedproduct,
                  processid: this.userDetails.Processid,
                  modifiedby: this.userDetails.Id,
                }
              }
            };


            this.api.post('index', this.requestObj).subscribe((res: any) => {
              if (res.code == 200) {
                if (this.filter == 'add-greeting') {
                  this.common.snackbar('Record add');
                  this.router.navigate(['masters/greetings/view', this.id], { queryParams: { filter: 'greeting', productid: this.selectedproduct } });
                }else {
                  this.common.snackbar('Update Success');
                  this.router.navigate(['masters/greetings/view', this.id], { queryParams: { filter: 'greeting', productid: this.selectedproduct } });
                }
              }
            });

          }

           this.subscriptionAcitivateData.forEach((e) => {
             e.unsubscribe();
           });
           }))


        }

        // this.router.navigate(['masters/greetings/view', this.id], { queryParams: { filter: 'greeting' } });
        // this.back();
        // this.common.snackbar(res.results.data[0].result, "success")
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = true;
      })
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getProduct() {
    // console.log('in')
    this.loader = true;
    var obj = {
      data: {
        spname: "usp_unfyd_greetings",
        parameters: {
          flag: "get",
          processid: this.userDetails.Processid,
          // productid: 1,
          productid: this.selectedproduct,
          categoryid: this.id
        }
      }
    }
    this.common.hubControlEvent('Greetings', 'click', 'get', 'get', JSON.stringify(obj), 'getProduct');


    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.greeting = res.results.data;
        // console.log(this.greeting, "get greetings")
      }
    },
      (error) => {
        this.common.snackbar("General Error");
        this.loader = true;
      })

  }


  directUpload(event, type, max_width, max_height) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + type == 'category' ? '_greeting_category_' : '_greeting_greeting_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
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
            this.imgLoader = true;

            this.common.hubControlEvent('Greetings', 'click', 'category', 'category', JSON.stringify(formData), 'directUpload');
            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                if (type == 'category') {
                  this.categoryImg = res.results.URL;
                  this.form.get('uploadurl').patchValue(this.categoryImg);
                  // console.log('  this.form.get(uploadurl).patchValue(this.categoryImg);', this.categoryImg)
                } else if (type == 'greeting') {
                  this.greetingImg = res.results.URL;
                  this.form.get('imageurl').patchValue(this.greetingImg);
                  // console.log('  this.form.get(imageurl).patchValue(this.greetingImg);', this.greetingImg)

                }
                this.imgLoader = false;
              }

            })


          }
        };
      };

      reader.readAsDataURL(file);

    }
  }



  back(val): void {
    this.common.hubControlEvent('Greetings', 'click', 'category', 'category', '', 'back');
    // this.location.back();
    if (val == 'landingPage') {
      this.router.navigate(['masters/greetings/view'], { queryParams: { filter: 'category', productid: this.selectedproduct } });
    } else if (val == 'greetingPage') {
      this.router.navigate(['masters/greetings/view', this.id], { queryParams: { filter: 'greeting', productid: this.selectedproduct } });
      // this.location.back();
    }
    // this.myInputVariable.nativeElement.value = "";
    this.categoryImg = '';
    this.greetingImg = '';
    // this.common.selectProductGreetingMethod(this.selectedproduct);
    // this.getCategorypro(this.selectedproduct)
  }


  Resetfunc() {
    this.common.hubControlEvent('Greetings', 'click', 'category', 'category', '', 'Resetfunc');
    this.greetingImg = undefined;
    // this.form.controls.imagename.patchValue('')
    this.form.controls.caption.patchValue('')
    // this.form.value.imagename.reset()
    this.form.reset();
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key).setErrors(null) ;
    });

  }

  resetcategory(){
    this.categoryImg = undefined;
    this.form.controls.category.patchValue('')

    this.form.reset()

  }

  noWhitespaceValidator1(control: FormControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { required: true } : null;
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}
