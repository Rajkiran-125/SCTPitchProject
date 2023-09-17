import { Component, ElementRef,EventEmitter,Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { Location } from '@angular/common'
import { regex, masters, checknull, checknull1 } from 'src/app/global/json-data';
import { Subscription } from "rxjs";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';


@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit {
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
  finalField:any;
  subscription: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  submittedForm = false;
  i:any;
  hierarchy = [{Key:'1'},{Key:'2'},{Key:'3'},{Key:'4'},{Key:'5'},{Key:'6'},{Key:'7'},{Key:'8'},{Key:'9'},{Key:'10'},{Key:'11'},{Key:'12'},{Key:'13'},{Key:'14'},{Key:'15'}]
  public filteredList2 = this.hierarchy.slice();
  userConfig: any;
  type: any;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private location: Location,
    public dialog: MatDialog,
    private el: ElementRef,
    public dialogRef: MatDialogRef<DialogComponent>,) {
      Object.assign(this, { masters });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('Hierarchy','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    console.log(this.userDetails,"this.userdetails")



    this.loader = true;
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.getSnapShot();
    this.common.setUserConfig(this.userDetails.ProfileType, 'Hierarchy');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          
    }))
    if(this.Id == null)
    {    this.Id = this.activatedRoute.snapshot.paramMap.get('id'); }
    
    this.form = this.formBuilder.group({
      Title: ['', [Validators.pattern(regex.alphabet),Validators.maxLength(50),Validators.required]],
      Level: ['', [Validators.required]],
      PROCESSID: [this.userDetails.Processid, Validators.nullValidator],
      PUBLICIP: [this.userDetails.ip, Validators.nullValidator],
      IP: ["", Validators.nullValidator],
      BROWSERNAME: [this.userDetails.browser, Validators.nullValidator],
      BROWSERVERSION: [this.userDetails.browser_version, Validators.nullValidator]
    }, {validator:[checknull('Title'),checknull1('Title')]});

    this.skillId = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');

    if (this.skillId !== null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_hierarchy",
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
          this.form.controls.Title.patchValue(res.results.data[0].Title)
  
          let levelval = res.results.data[0].Level
          this.form.controls.Level.patchValue(levelval.toString())
      

          this.form.updateValueAndValidity();
        }
      })
    }
     else {
      this.loader = false;
    }   
    this.common.hubControlEvent('Hierarchy','click','pageloadend','pageloadend','','ngOnInit');
 

  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Hierarchy','click','label','label',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Hierarchy', data)
    
  }
  config: any;
  getSnapShot() {
    this.common.hubControlEvent('Hierarchy','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, 'Hierarchy');
      this.subscription.push(

      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      })
      )
    });
    this.subscription.push(

    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('Hierarchy','click','back','back','','back');
    if(this.isDialog == true){
      this.dialogRef.close(true);
    }
    else{
    this.location.back()}
  }


  level1 = ['1', '2', '3', '4','5','6','7','8','9','10','11','12','13','14','15'];
  counter(i) {
    this.common.hubControlEvent('Hierarchy','click','counter','counter',i,'counter');

    return new Array(i);
}

  submit(event): void {
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
      return;
    }
    if (this.skillId == null) 
    {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_hierarchy",
          parameters: {
            flag: 'INSERT',
            createdby: this.userDetails.Id,
            title: this.form.value.Title.trim(),
            level: this.form.value.Level,
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
            publicip: this.userDetails.ip,
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version
          }
        }
      }
    } 
    else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_hierarchy",
          parameters: {
            flag: "UPDATE",
            title: this.form.value.Title.trim(),
            level: this.form.value.Level,
            modifiedby: this.userDetails.Id,
            id: this.skillId,
          }
        }
      }
    }
    this.common.hubControlEvent('Hierarchy','click','submit','submit',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.refreshMenu(true);
        this.loader = false;
       
        if(res.results.data[0].result == "Data added successfully"){
          this.common.snackbar('Record add');
          if (event == 'add')
          {
            if(this.isDialog == true){
            this.dialogRef.close(true);
          }
          else{
          this.router.navigate(['masters/hierarchy']);}
          } else if (event == 'saveAndAddNew') {
            this.form.reset()
          }
        }
        else if(res.results.data[0].result == "Data updated successfully"){
          this.common.snackbar('Update Success');
          if(this.isDialog == true){
            this.dialogRef.close(true);
          }
          else{
          this.router.navigate(['masters/hierarchy']);}
        }
        else if((res.results.data[0].result.includes('Title'))&& (res.results.data[0].Status == false)){
          this.common.snackbar('hierarchyexits');
          }
        else if((res.results.data[0].result.includes('Level'))  ){
            this.common.snackbar('hierarchy');
            }
            else if ((res.results.data[0].Status == true)  && (res.results.data[0].result.includes('Title'))){
                    
            this.common.confirmationToMakeDefault('AcitvateDeletedData');
            this.subscriptionAcitivateData.push(
                this.common.getIndividualUpload$.subscribe(status => {
              if(status.status){
            

                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_hierarchy",
                    parameters: {
                      flag: 'ACTIVATE',
                      title: this.form.value.Title,
                      processid: this.userDetails.Processid,
                      modifiedby: this.userDetails.Id,
                    }
                  }
                };
                this.common.hubControlEvent('Hierarchy','click','ACTIVATE','ACTIVATE',JSON.stringify(this.requestObj),'submit');

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    if (event == 'add') {
                      if(this.isDialog == true){
                        this.dialogRef.close(true);
                        this.common.refreshMenu(true);
                      }
                      else{
                      this.router.navigate(['masters/hierarchy']);}
                      this.common.snackbar('Record add');
                    } if (event == 'saveAndAddNew') {
                      this.common.snackbar('Record add');
                      this.form.reset()
                      if (this.isDialog == true) {
                        this.common.refreshMenu(true);
                        // this.dialogRef.close(true)
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
