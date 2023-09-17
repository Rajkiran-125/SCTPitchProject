import { Component, ElementRef, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, regex } from 'src/app/global/json-data';
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  loader: boolean = false;
  form: FormGroup;
  userDetails: any;
  submittedForm = false;
  courseId: any;
  requestObj: any;
  masters: any;
  trainersMappedlist = [];
  minMessage: any;
  maxMessage: any;
  maxMessage1: any;
  labelName: any;
  reset: boolean;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private location: Location,
    private el: ElementRef,
    private api: ApiService) {
    Object.assign(this, { masters, regex });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('course','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.gettrainersMapped();
    this.userDetails = this.auth.getUser();
    this.minMessage = masters.MinLengthMessage;
    this.maxMessage = masters.MaxLengthMessage1;
    this.maxMessage1 = masters.MaxLengthMessage2;
    this.loader = true;
    this.form = this.formBuilder.group({
      COURSENAME: ['', [Validators.required, Validators.pattern(regex.alphabet), Validators.maxLength(100)]],
      COURSECATEGORY: ['', Validators.required],
      TRAININGLOCATION: ['', Validators.required],
      TRAINERSMAPPED: ['', Validators.required],
      PROCESSID: [this.userDetails.Processid],
      PUBLICIP: [this.userDetails.ip],
      BROWSERNAME: [this.userDetails.browser],
      BROWSERVERSION: [this.userDetails.browser_version]
    });

    this.courseId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.courseId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_haw_course",
          parameters: {
            "flag": "EDIT",
            Id: this.courseId
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          let result = res.results.data[0];
          this.form.patchValue({
            COURSENAME: result.CourseName,
            COURSECATEGORY: result.CourseCategory,
            TRAININGLOCATION: result.TrainingLocation,
            TRAINERSMAPPED: result.TrainersMapped,
          })
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/course/add'])
    }

    this.common.hubControlEvent('course','click','pageloadend','pageloadend','','ngOnInit');

  }

  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'Course', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  config: any;
  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
      this.common.setUserConfig(this.userDetails.ProfileType, 'course');
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  back(): void {
    this.common.hubControlEvent('course','click','back','back','','back');

    this.location.back()
  }

  submit(): void {

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
      this.common.snackbar("General Error");
      return;
    }

    if (this.courseId == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_course",
          parameters: {
            ...this.form.value,
            CREATEDBY: this.userDetails.EmployeeId,
            FLAG: 'INSERT',
            PRODUCTID: 1,
          }
        }
      }

    } else {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_course",
          parameters: {
            flag: "UPDATE",
            Id: this.courseId,
            MODIFIEDBY: this.userDetails.EmployeeId,
            ...this.form.value,
          }
        }
      }

    }
    this.common.hubControlEvent('course','click','back','back','','back');

    this.api.post('index', this.requestObj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/course']);
        this.common.snackbar("Success");
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }


  gettrainersMapped() {
    this.userDetails = this.auth.getUser();
    let Obj = {
      data: {
        spname: "usp_unfyd_client_products",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1
        }
      }
    }
    this.common.hubControlEvent('course','click','','',JSON.stringify(Obj),'gettrainersMapped');

    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        let productslist = res.results.data;

        productslist.forEach(element => {
          this.trainersMappedlist.push({ productName: element['Product Name'] })
        });
      }
    })

  }

}
