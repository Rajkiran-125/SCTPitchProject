import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex, masters, checknull, checknull1 } from 'src/app/global/json-data';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import {encode,decode} from 'html-entities';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-quicklinks',
  templateUrl: './quicklinks.component.html',
  styleUrls: ['./quicklinks.component.scss']
})
export class QuicklinksComponent implements OnInit {
  socket: any = io('https://localhost:3002', {path:'/adminserver/', transports: ['websocket', 'polling', 'flashsocket'] });

  loader: boolean = false;
  skillId: any;
  userDetails: any;
  regex: any;
  masters: any;
  form: FormGroup;
  submittedForm = false;
  requestObj: any;
  minMessage: any;
  labelName: any;
  reset: boolean;
  agents = []
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
    public dialog: MatDialog,
    private el: ElementRef,
  ) {
    Object.assign(this, { masters });
    this.socket.on("connect_error", (err) => {
    });
    this.socket.on('connect', reason => {
    });
  }

  ngOnInit(): void {

    this.socket.on('data1',(res)=>{
      console.log('data1 res',res);
    })

    this.common.hubControlEvent('Quicklinks','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'Quicklinks');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          
    }))
    this.form = this.formBuilder.group({
      LinkName: ['', [Validators.required, Validators.pattern(regex.alphabet),Validators.maxLength(100)]],
      //LinkName: ['', [Validators.required]],
      Desc: ['',  [Validators.maxLength(500),Validators.nullValidator]],
      URL: ['', [Validators.required]],
      PROCESSID: [this.userDetails.Processid, Validators.nullValidator],
      PUBLICIP: [this.userDetails.ip, Validators.nullValidator],
      IP: ["", Validators.nullValidator],
      BROWSERNAME: [this.userDetails.browser, Validators.nullValidator],
      BROWSERVERSION: [this.userDetails.browser_version, Validators.nullValidator]
    },
    {validator:[checknull('LinkName'),checknull1('LinkName'),checknull('URL'),checknull1('Desc')]},

    
    );

    this.skillId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.skillId !== null) {
      var Obj = {
        data: {
          spname: "USP_UNFYD_ADM_PUSHURLMASTER",
          parameters: {
            flag: "GETPUSHURLBYID",
            Id: this.skillId
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        if (res.code == 200) {
          this.form.controls.LinkName.patchValue(res.results.data[0].UrlName)
          this.form.controls.Desc.patchValue(decode(res.results.data[0].Description))
          this.form.controls.URL.patchValue(res.results.data[0].UrlDesc)

          this.form.updateValueAndValidity();
        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/quicklinks/add'])
    }
    this.changeModuleDisplayName = this.common.changeModuleLabelName()
    this.common.hubControlEvent('Quicklinks','click','pageloadend','pageloadend','','ngOnInit');

    console.log('user',this.userDetails);
    
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Quicklinks','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false       
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Quicklinks', data)   
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('Quicklinks','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.skillId = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.url.subscribe((url) => {
      let skillId = 'quicklinks'
      this.common.setUserConfig(this.userDetails.ProfileType, skillId);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }))
    });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('Quicklinks','click','back','back','','back');

    this.router.navigate(['masters/quicklinks']);
  }

  submit(event) {

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
      // this.common.snackbar("General Error");
      return;
    }
    this.requestObj = {
      data: {
        spname: "USP_UNFYD_ADM_PUSHURLMASTER",
        parameters: {
          flag: this.skillId == null ? 'INSERTPUSHURL' : 'UPDATEPUSHURL',
          ID: this.skillId == null ? undefined : this.skillId,
          CREATEDBY: this.skillId == null ? this.userDetails.Id : undefined,
          URLNAME: this.form.value.LinkName == null ? null : this.form.value.LinkName.trim(),
          DESCRIPTION: encode(this.form.value.Desc == null ? null : this.form.value.Desc.trim()),
          URLDESC: this.form.value.URL == null ? null : this.form.value.URL.trim(),
          LANGUAGECODE: 'en',
          PROCESSID: this.userDetails.Processid,
          PUBLICIP: this.userDetails.ip,
          BROWSERNAME: this.userDetails.browser,
          BROWSERVERSION: this.userDetails.browser_version,
          MODIFIEDBY: this.skillId == null ? undefined : this.userDetails.Id,
        }
      }
    }
    this.common.hubControlEvent('Quicklinks','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if ((res.results.data[0].result.includes('already exists')) && (res.results.data[0].Status == false)) {
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
                spname: "USP_UNFYD_ADM_PUSHURLMASTER",
                parameters: {
                  flag: 'ACTIVATE',
                  URLNAME: this.form.value.LinkName,
                  URLDESC: this.form.value.URL,
                  processid: this.userDetails.Processid,
                  modifiedby: this.userDetails.Id,
                }
              }
            };
            this.common.hubControlEvent('Quicklinks','click','','',JSON.stringify(this.requestObj),'submit');

            this.api.post('index', this.requestObj).subscribe((res: any) => {
              if (res.code == 200) {
                if (event == 'add') {
                  this.router.navigate(['masters/quicklinks']);
                  this.common.snackbar('Record add');
                } if (event == 'saveAndAddNew') {
                  this.common.snackbar('Record add');
                  this.form.reset()
                }
              }
            });
         
          }
           
           this.subscriptionAcitivateData.forEach((e) => {
             e.unsubscribe();
           });
           }))
       

        }
        if (res.results.data[0].result.includes('added successfully')) {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.router.navigate(['masters/quicklinks']);
          } else if (event == 'saveAndAddNew') {
            this.form.reset()
          }
        } else if (res.results.data[0].result.includes('updated successfully')) {
          this.common.snackbar('Update Success');
          this.router.navigate(['masters/quicklinks']);
        }
        this.common.sendCERequest('UPDATEQUICKLINKS', this.userDetails.Processid)
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
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
