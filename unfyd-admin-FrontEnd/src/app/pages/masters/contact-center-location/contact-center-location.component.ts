import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex , masters, checknull, checknull1} from 'src/app/global/json-data';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog,MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-contact-center-location',
  templateUrl: './contact-center-location.component.html',
  styleUrls: ['./contact-center-location.component.scss']
})
export class ContactCenterLocationComponent implements OnInit {
  form: FormGroup;
  userDetails: any;
  loader: boolean = false;
  requestObj: any;
  labelName: any;
  skillId: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  reset: boolean;
  @Input() isDialog: boolean = false;
  submittedForm = false;
  subscription: Subscription[] = [];
  userConfig: any;
  
  subscriptionAcitivateData: Subscription[] = [];
  constructor( private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogComponent>,
    private el: ElementRef,
    ){Object.assign(this, { masters });
      }

  ngOnInit(): void {
    this.common.hubControlEvent('ContactCenterLocation','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.loader = true;
    this.getSnapShot();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'ContactCenterLocation');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    if(this.Id == null)
    {
    this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.form = this.formBuilder.group({
      ContactLocation: ['', [Validators.pattern(regex.alphabet),Validators.required]],
      ContactDescription: ['', [Validators.nullValidator,Validators.minLength(3),Validators.maxLength(500)]],
      PROCESSID: [this.userDetails.Processid, Validators.nullValidator],
      PUBLICIP: [this.userDetails.ip, Validators.nullValidator],
      IP: ["", Validators.nullValidator],
      BROWSERNAME: [this.userDetails.browser, Validators.nullValidator],
      BROWSERVERSION: [this.userDetails.browser_version, Validators.nullValidator]
    }, 
    {validator:[checknull('ContactLocation'),checknull1('ContactLocation'),checknull1('ContactDescription')]});
  
     


    this.skillId = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');
    if((this.skillId !== null)){
      var Obj = {
        data: {
          spname: "usp_unfyd_cc_location",
          parameters: {
            flag: "EDIT",
            Id: this.skillId
          }
        }
      }
      // console.log(this.isDialog);
      
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if(res.code == 200){
          this.form.controls.ContactLocation.patchValue(res.results.data[0].CCLocation)
          this.form.controls.ContactDescription.patchValue(decode(res.results.data[0].Description))
          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      // this.router.navigate(['/masters/contact-center-location/add'])
    }
    this.common.hubControlEvent('ContactCenterLocation','click','pageloadend','pageloadend','','ngOnInit');

    }


  setLabelByLanguage(data) {
    this.common.hubControlEvent('ContactCenterLocation','click','label','label',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      })); 
    this.common.setLabelConfig(this.userDetails.Processid, 'ContactCenterLocation', data)
    
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('ContactCenterLocation','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path  = this.activatedRoute.snapshot.data.title
        this.common.setUserConfig(this.userDetails.ProfileType, 'ContactCenterLocation');
        this.common.getUserConfig$.subscribe(data => {
            this.config = data;
          });
    });
}
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('ContactCenterLocation','click','back','back','back','back');
    if(this.isDialog == true){
      this.dialogRef.close(true);
    }
    else{
    this.location.back()}
  }

  submit(event){
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

    if (this.skillId == null) {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_cc_location",
        parameters: {
          flag: 'INSERT',
          createdby: this.userDetails.Id,
          cclocation: this.form.value.ContactLocation == null ? null : this.form.value.ContactLocation.trim(),
          description: encode(this.form.value.ContactDescription == null ? null : this.form.value.ContactDescription.trim()),
          status: 1,
          processid: this.userDetails.Processid,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }
    }
  }else {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_cc_location",
        parameters: {
          flag: "UPDATE",
          cclocation: this.form.value.ContactLocation == null ? null : this.form.value.ContactLocation.trim(),
          description: encode(this.form.value.ContactDescription == null ? null : this.form.value.ContactDescription.trim()),
          status:1,
          processid: this.userDetails.Processid,        
          modifiedby: this.userDetails.Id,
          id: this.skillId
        }
      }
    }
  }
  this.common.hubControlEvent('ContactCenterLocation','click','Save','Save',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.refreshMenu(true);
        this.loader = false;
        if(res.results.data[0].result == "Data added successfully"){
          
          this.common.snackbar('Record add');
          if(event == 'add'){
            if(this.isDialog == true){
              this.dialogRef.close(true);
            }
            else {
            this.router.navigate(['masters/contact-center-location']);}
          } else if(event == 'saveAndAddNew'){
            this.form.reset()
          }
        }
        else if(res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');
          if(event == 'add'){
            if(this.isDialog == true){
              this.dialogRef.close(true);
            }
            else {
            this.router.navigate(['masters/contact-center-location']);}
          } else if(event == 'saveAndAddNew'){
            this.form.reset()
          }
        }
        else if (res.results.data[0].Status == true) {
                  
        this.common.confirmationToMakeDefault('AcitvateDeletedData');
        this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
          if(status.status){
            // this.loader = true;
            this.requestObj = {
              data: {
                spname: "usp_unfyd_cc_location",
                parameters: {
                  flag: 'ACTIVATE',
                  cclocation: this.form.value.ContactLocation,
                  modifiedby: this.userDetails.Id,
                  processid: this.userDetails.Processid,                    
                }
              }
            };
            this.common.hubControlEvent('ContactCenterLocation','click','Save','Save',JSON.stringify(this.requestObj),'submit');

            this.api.post('index', this.requestObj).subscribe((res: any) => {
              if (res.code == 200) {
                if(event == 'add'){
                  if(this.isDialog == true){
                    this.dialogRef.close(true);
                    this.common.refreshMenu(true);

                  }
                  else {
                  this.router.navigate(['masters/contact-center-location']);}
                  this.common.snackbar('Record add');

                } if (event == 'saveAndAddNew') {
                  this.common.snackbar('Record add');
                  this.form.reset()
                  if(this.isDialog == true){
                    // this.dialogRef.close(true);
                    this.common.refreshMenu(true);
                    this.form.reset()

                  }
                }
              }
            });
        
        }
          
          this.subscriptionAcitivateData.forEach((e) => {
            e.unsubscribe();
          });
          }))
        
        
        }
        else if((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)){ 
          this.common.snackbar('Data Already Exist');
        }
      } else {
        this.loader = false;
      }
    },
    (error) => {
      this.loader = false;
      this.common.snackbar("General error");
    })
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
