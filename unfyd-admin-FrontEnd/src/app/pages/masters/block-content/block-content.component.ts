import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull, checknull1, masters, regex } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-block-content',
  templateUrl: './block-content.component.html',
  styleUrls: ['./block-content.component.scss']
})
export class BlockContentComponent implements OnInit {
form: any;
  userDetails: any;
  config: any;
  path: string;
  subscription: Subscription[] = [];
  loader: boolean;
  userConfig: any;
  obj:{};
  reset: boolean = false;
  labelName: any;
  subscriptionAcitivateData: Subscription[] = [];
  submittedForm: boolean = false;;

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
    Object.assign(this, { masters }); }

  ngOnInit(): void {
    this.common.hubControlEvent('block-content','click','pageload','pageload','','ngOnInit');

this.getSnapShot();
this.userDetails = this.auth.getUser();
this.path = this.activatedRoute.snapshot.paramMap.get('id');

this.subscription.push(this.common.languageChanged$.subscribe((data) => {
  this.setLabelByLanguage(localStorage.getItem("lang"));
}))


this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
  this.setLabelByLanguage(data)
}))

this.common.setUserConfig(this.userDetails.ProfileType, 'blockcontent');
this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

}))
this.setLabelByLanguage(localStorage.getItem("lang"))



    this.form = this.formBuilder.group({
      blockcontent:['',[Validators.required,Validators.pattern(regex.alphabet)]],
      desc:['',[Validators.nullValidator,Validators.minLength(3),Validators.maxLength(500)]],
      type : ['BlockContent',[Validators.required]]
    },  {validator:[checknull('blockcontent'),checknull1('blockcontent'),checknull1('desc')]});

    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path !== null) {
      this.loader =true
      var Obj = {
        data: {
          spname: "usp_unfyd_block_content",
          parameters: {
            flag: "EDIT",
            Id: this.path
          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {


        this.reset = true;

        if (res.code == 200) {
          this.form.controls.blockcontent.patchValue(res.results.data[0].ABUSIVEWORD)
          this.form.controls.desc.patchValue(decode(res.results.data[0].Description) )
          this.form.controls.type.patchValue(res.results.data[0].ContentType )
          this.loader = false;


        }
      })
    } else {
      this.loader = false;
      this.router.navigate(['/masters/blockcontent/add'])
    }
    this.common.hubControlEvent('block-content','click','pageloadend','pageloadend','','ngOnInit');


  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.location.back()
  }


  getSnapShot() {
    this.common.hubControlEvent('block-content','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });
    this.subscription.push(this.common.getIndividualUpload$.subscribe(res => {
      this.form.controls.profilepic.setValue(res.status.attachmenturl);
    }))
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('block-content','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'blockcontent', data)

  }
  blockcontentType(): boolean {
    let a = false;
    if (!this.form.value.type) a = true
    return a;
  }



  submit(event,formDirective: FormGroupDirective){
    this.submittedForm = true;
    if (this.form.invalid || this.blockcontentType()) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      // this.common.snackbar("General Error", "error");

      return;
      // this.form.value.SkillName == null ? null : this.form.value.SkillName.trim()
    }
    if(this.path == null){
      this.obj = {
        data: {
          spname: "usp_unfyd_block_content",
          parameters: {
            flag: 'INSERT',
            AbusiveWord: this.form.value.blockcontent == null ? null : this.form.value.blockcontent.trim(),
            Description:   encode(this.form.value.desc == null ? null : this.form.value.desc.trim()),
            CONTENTTYPE : this.form.value.type,
            publicip: this.userDetails.ip,
            privateip: this.userDetails.privateip,
            CREATEDBY: this.userDetails.Id,
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version,
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
          }
        }
      }
    }
    else{
      this.obj = {
        data: {
          spname: "usp_unfyd_block_content",
          parameters: {
            flag: 'UPDATE',
            Id:this.path,
             AbusiveWord: this.form.value.blockcontent == null ? null : this.form.value.blockcontent.trim(),
            Description:   encode(this.form.value.desc == null ? null : this.form.value.desc.trim()),
            CONTENTTYPE : this.form.value.type,
            MODIFIEDBY: this.userDetails.Id,

          }
        }
      }
    }
    this.common.hubControlEvent('block-content','click','','',JSON.stringify(this.obj),'submit');

    this.api.post('index', this.obj).subscribe((res: any) => {
      if(res.code == 200 ){
        this.loader=false;
        if (res.results.data[0].result == "Data added successfully") {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.router.navigate(['masters/blockcontent']);
          } else if (event == 'saveAndAddNew') {
            this.form.reset()
            formDirective.resetForm()

          }
        } else if (res.results.data[0].result == "Data already exists"  && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }
        else if (res.results.data[0].result == "Data updated successfully") {
          this.common.snackbar('Update Success');
          if (event == 'add') {
            this.router.navigate(['masters/blockcontent']);
          } else if (event == 'saveAndAddNew') {
            this.form.reset()
            // formDirective.resetForm()

          }
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
          //     this.obj = {
          //       data: {
          //         spname: "usp_unfyd_block_content",
          //         parameters: {
          //           flag: 'ACTIVATE',
          //           AbusiveWord:this.form.value.blockcontent,
          //           processid: this.userDetails.Processid,
          //           modifiedby: this.userDetails.Id
          //         }
          //       }
          //     };
          //     this.api.post('index', this.obj).subscribe((res: any) => {
          //       if (res.code == 200) {
          //         if (event == 'add') {
          //           this.router.navigate(['masters/blockcontent']);
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
            this.obj = {
              data: {
                spname: "usp_unfyd_block_content",
                parameters: {
                  flag: 'ACTIVATE',
                  AbusiveWord: this.form.value.blockcontent == null ? null : this.form.value.blockcontent.trim(),
                  processid: this.userDetails.Processid,
                  modifiedby: this.userDetails.Id
                }
              }
            };
            this.api.post('index', this.obj).subscribe((res: any) => {
              if (res.code == 200) {
                if (event == 'add') {
                  this.router.navigate(['masters/blockcontent']);
                  this.common.snackbar('Record add');
                } if (event == 'saveAndAddNew') {
                  this.common.snackbar('Record add');
                  this.form.reset();
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

      }

    });


  }


}
