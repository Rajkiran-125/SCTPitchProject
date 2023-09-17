import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { regex } from 'src/app/global/json-data';
import { DatePipe, Location } from '@angular/common';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent implements OnInit {
  loader: boolean = false;
  submittedForm = false;
  form: FormGroup;
  requestObj: {};
  brandId: any;
  userDetails: any;
  labelName: any;
  editobj: any;
  reset: boolean;
  config: any
  loginImg: any;
  Img: any = [];
  headerImg: any;
  productType: any = [];
  productName: any = '';
  loginLoader: boolean = false;
  headerLoader: boolean = false;
  imgLoader: boolean[] = [];
  changeModuleDisplayName: string;
  subscription: Subscription[] = [];
  userConfig: any;
  brandingData: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private location: Location,
    public datepipe: DatePipe,
    private el: ElementRef,
  ) {
  }

  ngOnInit(): void {
    this.common.hubControlEvent('branding', 'click', 'pageload', 'pageload', '', 'ngOnInit');

    this.form = this.formBuilder.group({
      loginheaderimg: ['', [Validators.required]],
      loginImgStatus: [true, [Validators.required]],
      loginheadertext: ['', [Validators.required, Validators.pattern(regex.alphabet)]],
      loginheadertextStatus: [true, [Validators.required]],
      bannerimg: new FormArray([
        new FormGroup({
          image: new FormControl(''),
          title: new FormControl(''),
          description: new FormControl(''),
          link: new FormControl(''),
          status: new FormControl(true),
        })
      ]),
      copyrighttext: ['', [Validators.required]],
      copyrighttextStatus: [true, [Validators.required]],
      copyrighturl: ['', [Validators.required,Validators.pattern(regex.brandingurl)]],
      copyrighturlStatus: [true, [Validators.required]],
      headerimg: ['', [Validators.required]],
      headerImgStatus: [true, [Validators.required]],
      headertext: ['', [Validators.required]],
      headertextStatus: [true, [Validators.required]],
      footertext: ['', [Validators.required]],
      footertextStatus: [true, [Validators.required]],
      footerurl: ['', [Validators.required,Validators.pattern(regex.brandingurl)]],
      footerurlStatus: [true, [Validators.required]]
    });
    this.copyRightTextChange();
    this.footertextStatusChange();
    this.userDetails = this.auth.getUser();

    this.activatedRoute.url.subscribe(url => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'branding');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
        this.userConfig = data

      }))
    });
    this.getProducts();
    this.brandId = this.activatedRoute.snapshot.paramMap.get('id');

    this.changeModuleDisplayName = this.common.changeModuleLabelName()
    this.subscription.push(

      this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"));
    this.subscription.push(

      this.common.getLanguageConfig$.subscribe((data) => {
        this.setLabelByLanguage(data);
      })
    )
    this.common.hubControlEvent('branding', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('branding', 'click', '', '', JSON.stringify(data), 'setLabelByLanguage');
    this.subscription.push(this.common.getLabelConfig$.subscribe((data1) => {
      this.labelName = data1;
    },
      error => console.log('error:', error))
    )
    this.common.setLabelConfig2(this.userDetails.Processid, "Branding", data);
  }
  getSnapShot() {
    this.loader = true;

    var Obj = {
      data: {
        flag: "get",
        filename: "branding",
        processId: this.userDetails.Processid,
        product: this.productName
      }
    }
    this.common.hubControlEvent('branding', 'click', '', '', JSON.stringify(Obj), 'getSnapShot');

    this.api.post('branding', Obj).subscribe(res => {
      this.loader = false;
      this.reset = true;
      console.log(this.productName, "product")
      if (res.code == 200) {
        this.brandingData = true
        this.editobj = JSON.parse(res.results.data);
        this.form.patchValue(this.editobj);
        (this.form.controls['bannerimg'] as FormArray).clear();
        for (let i = 0; i < this.editobj.bannerimg.length; i++) {
          this.addBrand();
        }

        this.loginImg = this.editobj.loginheaderimg;
        this.headerImg = this.editobj.headerimg;
        var arrayControl = this.form.get('bannerimg') as FormArray;
        arrayControl.controls.forEach((element, index) => {
          (arrayControl.at(index) as FormGroup).get('image').patchValue(this.editobj.bannerimg[index].image);
          (arrayControl.at(index) as FormGroup).get('title').patchValue(this.editobj.bannerimg[index].title);
          (arrayControl.at(index) as FormGroup).get('description').patchValue(this.editobj.bannerimg[index].description);
          (arrayControl.at(index) as FormGroup).get('link').patchValue(this.editobj.bannerimg[index].link);
          (arrayControl.at(index) as FormGroup).get('status').patchValue(this.editobj.bannerimg[index].status);
          this.Img[index] = this.editobj.bannerimg[index].image;
        });
        this.copyRightTextChange();
        this.footertextStatusChange();
      } else if (res.code == 201) {
        this.form.reset()
        this.loginImg = '';
        this.headerImg = '';

        var arrayControl = this.form.get('bannerimg') as FormArray;
        arrayControl.controls.forEach((element, index) => {
          this.Img[index] = '';
        });
        (this.form.controls['bannerimg'] as FormArray).clear();
        this.addBrand()
        this.copyRightTextChange();
        this.footertextStatusChange();
      }
    });

    this.changeModuleDisplayName = this.common.changeModuleLabelName()


  }
  get bannerimg(): FormArray {
    return this.form?.get('bannerimg') as FormArray;
  }
  scroll(el: HTMLElement) {
    this.common.hubControlEvent('branding', 'click', '', '', JSON.stringify(el), 'scroll');

    el.scrollIntoView({ behavior: 'smooth' });
  }
  addBrand() {
    this.common.hubControlEvent('branding', 'click', '', '', '', 'addBrand');

    this.bannerimg.push(
      new FormGroup({
        image: new FormControl(''),
        title: new FormControl(''),
        description: new FormControl(''),
        link: new FormControl(''),
        status: new FormControl(true),
      })
    )
  }
  removeBrand(i: number) {
    this.bannerimg.removeAt(i);
  }
  get f() {
    return this.form.controls;
  }
  back(): void {
    this.common.hubControlEvent('branding', 'click', '', '', '', 'back');

    this.location.back()
  }
  // submit() {

  //   if (this.form.invalid) {
  //     this.loader = false;
  //     for (const key of Object.keys(this.form.controls)) {
  //       if (this.form.controls[key].invalid) {
  //         const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
  //         invalidControl.focus();
  //         break;
  //       }
  //     }
  //     this.common.snackbar("General Error");
  //     return;
  //   }

  //   var arrayControl = this.form.get('bannerimg') as FormArray;
  //   arrayControl.controls.forEach((element, index) => {
  //     (arrayControl.at(index) as FormGroup).get('image').patchValue(this.Img[index]);
  //   });


  //     let storeJs = JSON.stringify(this.form.value.bannerimg)
  //     console.log(storeJs,"storeJs")
  //     console.log(JSON.stringify(this.form.value.bannerimg),"this.form.value.bannerimg")


  //   if (this.brandId == null) {
  //     this.requestObj = {
  //       data: {
  //         spname: 'usp_unfyd_branding',
  //         parameters: {
  //           flag: 'INSERT',
  //           // filename: "branding",
  //           processId: this.userDetails.Processid,
  //           product: this.productName,
  //           // brandingjson: this.form.value
  //           loginheaderimg: this.loginImg,
  //           loginImgStatus: this.form.value.loginImgStatus,
  //           loginheadertext: this.form.value.loginheadertext,
  //           loginheadertextStatus: this.form.value.loginheadertextStatus,
  //           bannerimg: storeJs,
  //           copyrighttext: this.form.value.copyrighttext,
  //           copyrighttextStatus: this.form.value.copyrighttextStatus,
  //           copyrighturl: this.form.value.copyrighturl,
  //           copyrighturlStatus: this.form.value.copyrighturlStatus,
  //           headerimg: this.headerImg,
  //           headerImgStatus: this.form.value.headerImgStatus,
  //           headertext: this.form.value.headertext,
  //           headertextStatus: this.form.value.headertextStatus,
  //           footertext: this.form.value.footertext,
  //           footertextStatus: this.form.value.footertextStatus,
  //           footerurl: this.form.value.footerurl,
  //           footerurlStatus: this.form.value.footerurlStatus,
  //           createdby: this.userDetails.Id,
  //           PUBLICIP: this.userDetails.ip,
  //           PrivateIp: this.userDetails.ip,
  //           BROWSERNAME: this.userDetails.browser,
  //           BROWSERVERSION: this.userDetails.browser_version,


  //         }



  //       }
  //     }
  //   }

  //   this.common.hubControlEvent('branding', 'click', '', '', JSON.stringify(this.requestObj), 'submit');

  //   this.api.post('index', this.requestObj).subscribe((res: any) => {
  //     if (res.code == 200) {
  //       this.loader = false;
  //       this.common.snackbar("Saved Success");
  //     } else {
  //       this.loader = false;
  //     }
  //   },
  //     (error) => {
  //       this.loader = false;
  //       this.common.snackbar("General Error");
  //     }
  //   );

  //   this.requestObj = {
  //     data: {
  //       flag: "insert",
  //       filename: "branding",
  //       processId: this.userDetails.Processid,
  //       product: this.productName,
  //       brandingjson: this.form.value
  //     }
  //   }
  //   this.api.post('branding', this.requestObj).subscribe(
  //     (res: any) => {
  //       if (res.code == 200) {
  //         this.loader = false;
  //         this.common.snackbar("Saved Success");
  //       } else {
  //         this.loader = false;
  //       }
  //     },
  //     (error) => {
  //       this.loader = false;
  //       this.common.snackbar("General Error");
  //     }
  //   );




  // }

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

    var arrayControl = this.form.get('bannerimg') as FormArray;
    arrayControl.controls.forEach((element, index) => {
      (arrayControl.at(index) as FormGroup).get('image').patchValue(this.Img[index]);
    });


    let storeJs = JSON.stringify(this.form.value.bannerimg)
    console.log(storeJs, "storeJs")
    console.log(JSON.stringify(this.form.value.bannerimg), "this.form.value.bannerimg")


    if (this.brandId == null) {
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_branding',
          parameters: {
            flag: 'INSERT',
            // filename: "branding",
            processId: this.userDetails.Processid,
            product: this.productName,
            // brandingjson: this.form.value
            loginheaderimg: this.loginImg,
            loginImgStatus: this.form.value.loginImgStatus,
            loginheadertext: this.form.value.loginheadertext,
            loginheadertextStatus: this.form.value.loginheadertextStatus,
            bannerimg: storeJs,
            copyrighttext: this.form.value.copyrighttext,
            copyrighttextStatus: this.form.value.copyrighttextStatus,
            copyrighturl: this.form.value.copyrighturl,
            copyrighturlStatus: this.form.value.copyrighturlStatus,
            headerimg: this.headerImg,
            headerImgStatus: this.form.value.headerImgStatus,
            headertext: this.form.value.headertext,
            headertextStatus: this.form.value.headertextStatus,
            footertext: this.form.value.footertext,
            footertextStatus: this.form.value.footertextStatus,
            footerurl: this.form.value.footerurl,
            footerurlStatus: this.form.value.footerurlStatus,
            createdby: this.userDetails.Id,
            modifiedby: this.userDetails.Id,

            PUBLICIP: this.userDetails.ip,
            PrivateIp: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version,


          }



        }
      }
    }

    this.common.hubControlEvent('branding', 'click', '', '', JSON.stringify(this.requestObj), 'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        // this.common.snackbar("Saved Success");
      } else {
        this.loader = false;
      }
     },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    );

    this.requestObj = {
      data: {
        flag: "insert",
        filename: "branding",
        processId: this.userDetails.Processid,
        product: this.productName,
        brandingjson: this.form.value
      }
    }
    this.api.post('branding', this.requestObj).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.loader = false;
          this.common.snackbar("Saved Success");
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

  directUpload(event, type, i, max_width, max_height) {
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
    }
    else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          if (img_height > max_height && img_width > max_width) {

            // this.common.snackbar("FileReso");
            if (max_width == 120 && max_height == 40) {
              this.common.snackbar("ImageResolutionOnetwentyfourty");
            }
            else if (max_width == 120 && max_height == 120) {
              this.common.snackbar("ImageResolutionOnetwenty");
            }
            else {
              this.common.snackbar("FileReso");
            }

          } else {
            if (type == 'Login_Image') {
              this.loginLoader = true;
            }
            else if (type == 'Image') {
              this.imgLoader[i] = true;
            }
            else if (type == 'Header_Image') {
              this.headerLoader = true;
            }
            this.common.hubControlEvent('branding', 'click', '', '', JSON.stringify(formData), 'submit');

            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                if (type == 'Login_Image') {
                  this.loginImg = res.results.URL;
                  this.form.get('loginheaderimg').patchValue(this.loginImg);
                  this.loginLoader = false;
                } else if (type == 'Image') {
                  this.Img[i] = res.results.URL;
                  this.imgLoader[i] = false;
                } else if (type == 'Header_Image') {
                  this.headerImg = res.results.URL;
                  this.form.get('headerimg').patchValue(this.headerImg);
                  this.headerLoader = false;
                }
                this.common.snackbar('Image Upload Success')
              }

            })
          }
        };
      };

      reader.readAsDataURL(file);

    }
  }

  getProducts() {
    this.common.hubControlEvent('branding', 'click', '', '', '', 'getProducts');

    this.productType = JSON.parse(localStorage.getItem('products'))
    // this.productName = this.productType[0].ProductName
    // this.getSnapShot();
  }

  selectedProduct(e) {
    this.productName = e
    this.getSnapShot();
  }


  drop(event: CdkDragDrop<string[]>) {
    // this.common.hubControlEvent('branding','click','','',event,'drop');

    moveItemInArray(this.bannerimg.controls, event.previousIndex, event.currentIndex);
    this.bannerimg.controls.forEach((element, index) => {
      this.Img[index] = this.bannerimg.controls[index].value.image;
    });
  }
  copyRightTextChange() {
    this.common.hubControlEvent('branding', 'click', '', '', '', 'copyRightTextChange');

    setTimeout(() => {
      if (!this.form.value.copyrighttextStatus) {
        this.form.get('copyrighturlStatus').patchValue(false);
        this.form.get('copyrighturlStatus').updateValueAndValidity();
        this.form.updateValueAndValidity()
      }
    });
  }
  footertextStatusChange() {
    this.common.hubControlEvent('branding', 'click', '', '', '', 'footertextStatusChange');

    setTimeout(() => {
      if (!this.form.value.footertextStatus) {
        this.form.get('footerurlStatus').patchValue(false);
        this.form.get('footerurlStatus').updateValueAndValidity();
        this.form.updateValueAndValidity()
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
