import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex,masters } from 'src/app/global/json-data';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common'
@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  loader: boolean = false;
  ProductId: any;
  userDetails: any;
  regex: any;
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  masters : any;
  hawkerlist : any = [];
  trainingCenterList : any = [];
  courseList : any = [];
  uploadForm: FormGroup;
  masterConfig: any;
  labelName: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    public datepipe: DatePipe,
    private location: Location,
    private el: ElementRef,
  ) {
    this.userDetails = this.auth.getUser();
    Object.assign(this, { masters });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('Training','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.gethawker();
    this.gettrainingCenter();
    this.gettrainingcourse();
    this.gettrainer();
    this.loader = true;

    this.form = this.formBuilder.group({
      trainingbatchid: ['', Validators.required],
      trainingbeneficiaryname: ['', Validators.required],
      trainingcentername: ['', Validators.required],
      trainername: ['', Validators.required],
      traininginitiationdatetime: ['', Validators.required],
      trainingcoursename: ['', Validators.required],
      trainingcompletiondatetime: ['', Validators.required],
      trainingcertificateissued: [false],
      trainingcertificatenumber: ['', Validators.required],
      trainingattendancestatus: ['', Validators.required],
      trainingcompletionstatus: ['', Validators.required],
      istrainingcertificatephoto: ['', Validators.nullValidator],
      processid: [this.userDetails.Processid, Validators.nullValidator],
      publicip: [this.userDetails.ip, Validators.nullValidator],
      privateip: ["", Validators.nullValidator],
      browsername: [this.userDetails.browser, Validators.nullValidator],
      browserversion: [this.userDetails.browser_version, Validators.nullValidator]
    });
    this.uploadForm = this.formBuilder.group({
      uploaddocuments: ['']
    });
    this.ProductId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.ProductId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_haw_training",
          parameters: {
            flag: "EDIT",
            Id: this.ProductId
          }
        }
      }
      this.api.post('index', Obj).subscribe((res:any) => {
        this.loader = false;
        if(res.code == 200){
          const myObjLower = this.common.ConvertKeysToLowerCase();
          this.form.patchValue(myObjLower(res.results.data[0]));
          this.form.get('trainingcentername').patchValue(Number(res.results.data[0].TrainingCenterName));
          this.certificatephotoSrc = this.form.value.istrainingcertificatephoto;         
          this.form.updateValueAndValidity(); 
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/training/add'])
    }
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))    
    this.common.hubControlEvent('Training','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('Training','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.common.setLabelConfig(this.userDetails.Processid, 'Training', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('Training','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path  = this.activatedRoute.snapshot.data.title
        this.common.setUserConfig(this.userDetails.ProfileType, path);
        this.common.getUserConfig$.subscribe(data => {
            this.config = data;
          });
    });



    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {    
      this.masterConfig = {
        completionStatus : JSON.parse(data.CompletionStatus),
      }
    });

}
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('Training','click','back','back','','back');

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
      this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }
    
    if (this.ProductId == null) {
     
      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_training",
          parameters: {
            flag: 'INSERT',
            CREATEDBY: this.userDetails.EmployeeId,
            PRODUCTID: 1,
            ...this.form.value,
          }
        }
      }
    } else {

      this.requestObj = {
        data: {
          spname: "usp_unfyd_haw_training",
          parameters: {
            flag: "UPDATE",
            ID: this.ProductId,
            MODIFIEDBY: this.userDetails.EmployeeId,
            ...this.form.value,
          }
        }
      }
      
    }
    this.common.hubControlEvent('Training','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        this.router.navigate(['masters/training']);
        this.common.snackbar(res.results.data[0].result, "success");
      } else {
        this.loader = false;
      }
    },
    (error) => {
      this.loader = false;
      this.common.snackbar(error.message, "error");
    })
  }

  gethawker(){
    this.loader = true;
 let obj = {
    data: {
      spname: "usp_unfyd_contact_personal",
      parameters: {
        flag: 'GET',
        processid: this.userDetails.Processid,
        productid: 1,
        roletype: 'hawker'
      }
    }
  }
  this.common.hubControlEvent('Training','click','','',JSON.stringify(obj),'gethawker');

  this.api.post('index', obj).subscribe(res => {
    if (res.code == 200) {
      this.loader = false;     
     let hawkerData =  res.results.data;
     hawkerData.forEach(element => {
        this.hawkerlist.push({firstName : element['First Name'] + ' ' +element['Last Name'],Id:element['Id']})
      });    
    }
  })
  }


  gettrainingCenter(){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_training_center",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid:1
        }
      }
     }
     this.common.hubControlEvent('Training','click','','',JSON.stringify(obj),'gettrainingCenter');

     this.api.post('index', obj).subscribe(res => {
       if (res.code == 200) {
         this.loader = false;      
         let trainingCenterData = res.results.data
         trainingCenterData.forEach(element => {
          this.trainingCenterList.push({Id : element['Id'] ,trainingCenter:element['Training Center']})
        });
       }
      })
  }
  gettrainingcourse(){
    this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_haw_course",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1
        }
      }
    }
    this.common.hubControlEvent('Training','click','','',JSON.stringify(obj),'gettrainingcourse');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        let courseData = res.results.data       
        courseData.forEach(element => {
         this.courseList.push({Id : element['Id'] ,courseName:element['Course Name']})
       });
      }
     })

  }
  trainerList : any = [];

  gettrainer(){
this.loader = true;
    let obj = {
      data: {
        spname: "usp_unfyd_trainer_personal",
        parameters: {
          "roletype":"Trainer",
          "flag": "GET",
          "processid": this.userDetails.Processid,
          "productid": 1
        }
      }
    }
    this.common.hubControlEvent('Training','click','','',JSON.stringify(obj),'gettrainer');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        let trainerData = res.results.data;
        trainerData.forEach(element => {
         this.trainerList.push({firstName : element['First Name'] + ' ' +element['Last Name'],Id:element['Id']})
       });
      }
     })  
  }



certificatephotoSrc: any;
onFileSelect(event) {
  this.common.hubControlEvent('Training','click','','',JSON.stringify(event),'onFileSelect');

  const reader = new FileReader();
  if (event.target.files.length > 0) {
    const file = event.target.files[0];

    this.uploadForm.get('uploaddocuments').patchValue(file);
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.certificatephotoSrc = reader.result as string;

    };
  }
}
submitDocuments() {
  this.common.hubControlEvent('Training','click','','','','submitDocuments');

  this.submittedForm = true;
  if (this.form.invalid) {
    this.common.snackbar("Please fill form carefully", "error");
    return;
  }
  let time = this.datepipe.transform(new Date(), 'yyyyMMddHHmmss');
  let filename = 'trainingcertificateDocument_'+ this.form.value.trainingbeneficiaryname+'_' + time; 
  const formData = new FormData();
  formData.append(filename, this.uploadForm.get('uploaddocuments').value);
  this.api.post('upload', formData).subscribe((res: any) => {
    if(res.results != undefined || res.result != null ){
      this.form.patchValue({
        istrainingcertificatephoto : res.results['URL']
      })
      this.common.snackbar(res.results['data'], "success");
    }
  })
}
}
