import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex , masters, checknull, checknull1} from 'src/app/global/json-data';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-break-not-ready-reason-codes',
  templateUrl: './break-not-ready-reason-codes.component.html',
  styleUrls: ['./break-not-ready-reason-codes.component.scss']
})
export class BreakNotReadyReasonCodesComponent implements OnInit {
  userDetails: any;
  loader: boolean = false;
  form: FormGroup;
  breakId: any;
  reset: boolean;
  labelName: any;
  requestObj: any;
  minMessage: string;
  submittedForm = false;
  masters:any;
  changeModuleDisplayName: string;
  subscription: Subscription[] = [];    
  subscriptionAcitivateData: Subscription[] = [];
  userConfig: any;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog
  ) { Object.assign(this, { masters });}

  ngOnInit(): void {
    this.common.hubControlEvent('BreakNotReadyReasonCodes','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.minMessage = masters.MinLengthMessage;
    this.loader = true;
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'BreakNotReadyReasonCodes');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          
    }))
    this.form = this.formBuilder.group({
      key1: ['', [ Validators.required, Validators.pattern(regex.alphabet),Validators.maxLength(100)]],
      value1: ['', [ Validators.required, Validators.pattern(regex.alphabet),Validators.maxLength(100)]],
      description1: ['', [Validators.nullValidator,Validators.minLength(3),Validators.maxLength(300)]],
      PROCESSID: [this.userDetails.Processid, Validators.nullValidator],
      PUBLICIP: [this.userDetails.ip, Validators.nullValidator],
      IP: ["", Validators.nullValidator],
      BROWSERNAME: [this.userDetails.browser, Validators.nullValidator],
      BROWSERVERSION: [this.userDetails.browser_version, Validators.nullValidator]
    },
    {validator:[checknull('key1'),checknull1('key1'),checknull('value1'),checknull1('value1'),checknull1('description1')]},

    );

    this.breakId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.breakId !== null) {
     
      var Obj = {
        data: {
          spname: "usp_unfyd_notready",
          parameters: {
            flag: "EDIT",
            Id: this.breakId
          }
        }
      }

      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
       
          this.form.controls.key1.patchValue(res.results.data[0].NotReadyKey)
          this.form.controls.value1.patchValue(res.results.data[0].NotReadyValue)
          this.form.controls.description1.patchValue(decode(res.results.data[0].NotReadyDescription))
          this.form.updateValueAndValidity();
          this.common.sendCERequest('editBreaknotready', this.userDetails.Processid)
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/break-not-ready-reason-codes/add'])
    }

    this.changeModuleDisplayName=this.common.changeModuleLabelName()

    this.common.hubControlEvent('BreakNotReadyReasonCodes','click','pageloadend','pageloadend','','ngOnInit');

  }
  setLabelByLanguage(data) {
    this.common.hubControlEvent('BreakNotReadyReasonCodes','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'BreakNotReadyReasonCodes', data)
    
}
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('BreakNotReadyReasonCodes','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, 'break-not-ready-reason-codes');
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
    this.common.hubControlEvent('BreakNotReadyReasonCodes','click','back','back','','back');

    this.router.navigate(['masters/break-not-ready-reason-codes']);
  }
 
  submit(event, formDirective: FormGroupDirective): void  {
    
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
      // this.common.snackbar( "error");
      return;
    }

    if (this.breakId == null) {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_notready",
          parameters: {
            flag: 'INSERT',
            createdby: this.userDetails.Id,
            notreadykey: this.form.value.key1 == null ? null : this.form.value.key1.trim(),
            notreadyvalue: this.form.value.value1 == null ? null : this.form.value.value1.trim() ,
            notreadydescription: encode(this.form.value.description1 == null ? null : this.form.value.description1.trim())  ,
            processid: this.userDetails.Processid,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
          }
        }
      }
     
    }
  else {
    
      this.requestObj = {
        data: {
          spname: "usp_unfyd_notready",
          parameters: {
            flag: "UPDATE",
            notreadykey: this.form.value.key1 == null ? null : this.form.value.key1.trim(),
            notreadyvalue: this.form.value.value1 == null ? null : this.form.value.value1.trim() ,
            notreadydescription: encode(this.form.value.description1 == null ? null : this.form.value.description1.trim())  ,
             processid: this.userDetails.Processid,
           // productid: this.userDetails.ProductId,
           modifiedby: this.userDetails.Id,
            id: this.breakId,
            // languagecode: 'en'
          }
        }
      }
    }
    this.common.hubControlEvent('BreakNotReadyReasonCodes','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;       
        
        if(res.results.data[0].result.includes('Not Ready Reason value')){
          this.common.snackbar('ExistsVal');
          return;
        }
        if(res.results.data[0].result.includes('already exists') && (res.results.data[0].Status == false)){
          this.common.snackbar('ExistsVal');
          return;
        }
        if((res.results.data[0].result.includes('Not Ready Reason key')) && (res.results.data[0].Status == false)){ 
          this.common.snackbar('ExistsKey');
          return;
        }
        else if (res.results.data[0].Status == true) {

          // const dialogRef = this.dialog.open(DialogComponent, {
          //   data: {
          //     type: 'softdeleted',
          //     subTitle: 'Record already exist and it is Inactive,Do you want to activate?',
          //   },
          //   width: '300px',
          //   disableClose: true,
          // });
          // dialogRef.afterClosed().subscribe(status => {
          //   if (status == true) {


          //     this.loader = true;
          //     this.requestObj = {
          //       data: {
          //         spname: "usp_unfyd_notready",
          //         parameters: {
          //           flag: 'ACTIVATE',
          //           notreadykey: this.form.value.key1,
          //           processid: this.userDetails.Processid,
          //           modifiedby: this.userDetails.Id,
          //         }
          //       }
          //     };
          //     this.common.hubControlEvent('BreakNotReadyReasonCodes','click','','',JSON.stringify(this.requestObj),'submit');

          //     this.api.post('index', this.requestObj).subscribe((res: any) => {
          //       if (res.code == 200) {
          //         if (event == 'add') {
          //           this.router.navigate(['masters/break-not-ready-reason-codes']);
          //           this.common.snackbar('Record add');
          //         } if (event == 'saveAndAddNew') {
          //           this.common.snackbar('Record add');
          //           this.form.reset()
          //         }
          //       }
          //     });
            
            
            
          //   }
          // });
        


                  
          
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
              this.common.getIndividualUpload$.subscribe(status => {
            if(status.status){
              // this.loader = true;
              this.requestObj = {
                data: {
                  spname: "usp_unfyd_notready",
                  parameters: {
                    flag: 'ACTIVATE',
                    notreadykey: this.form.value.key1,
                    processid: this.userDetails.Processid,
                    modifiedby: this.userDetails.Id,
                  }
                }
              };
              this.common.hubControlEvent('BreakNotReadyReasonCodes','click','','',JSON.stringify(this.requestObj),'submit');

              this.api.post('index', this.requestObj).subscribe((res: any) => {
                if (res.code == 200) {
                  if (event == 'add') {
                    this.router.navigate(['masters/break-not-ready-reason-codes']);
                    this.common.snackbar('Record add');
                  } if (event == 'saveAndAddNew') {
                    this.common.snackbar('Record add');
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
        
        if(res.results.data[0].result.includes('added successfully')){
          if (event == 'add') {
            this.router.navigate(['masters/break-not-ready-reason-codes']);
            this.common.snackbar('Record add');
          } if (event == 'saveAndAddNew') {
            this.common.snackbar('Record add');
            formDirective.resetForm()
            this.form.reset()
            // setTimeout(() =>{
            //   for (const key of Object.keys(this.form.controls)) {
            //     this.form.controls[key].markAsUntouched()
            //   }
            //       // this.form.markAllAsTouched;
            //       this.form.updateValueAndValidity();
            //     })
          }
        }
        else if(res.results.data[0].result.includes('updated successfully')) {
          if (event == 'add') {
            this.router.navigate(['masters/break-not-ready-reason-codes']);
            this.common.snackbar('Update Success');
          } if (event == 'saveAndAddNew') {
            this.common.snackbar('Update Success');
            this.form.reset()

          }
        }        
        this.common.sendCERequest('UPDATENOTREADYREASONS', this.userDetails.Processid)
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar( "error");
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
