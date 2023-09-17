import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-form-sub-category',
  templateUrl: './form-sub-category.component.html',
  styleUrls: ['./form-sub-category.component.scss']
})
export class FormSubCategoryComponent implements OnInit {

  loader: boolean = false;
  userDetails:any;
  labelName:any;
  allFormsData = []
  type:string = '';
  subscription: Subscription[] = [];
  productId:any
  userConfig: any
  constructor(private router:Router,
    private activatedRoute: ActivatedRoute,private common: CommonService,private auth: AuthService,public dialog: MatDialog,
    private api: ApiService) { }

  ngOnInit(): void {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.userDetails = this.auth.getUser();
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }));
    this.getAllForms()
    this.common.setUserConfig(this.userDetails.ProfileType, 'DataCollectionForms');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
  }

  goTo(url){
    if(url == 'add'){
      this.router.navigate(['/masters/data-collection-forms/add/'+this.productId+'/',this.type])
    } else if(url == 'back'){
      this.router.navigate(['/masters/data-collection-forms/view'])
    }
  }

  setLabelByLanguage(data) {
    this.subscription.push(this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'DataCollectionForms', data)

  }

  getAllForms(){
    // let obj = {
    //   "data": {
    //       "spname": "usp_unfyd_data_collection_form",
    //       "parameters": {
    //           "FLAG": "GET",
    //           "Processid":this.userDetails.Processid
    //       }
    //   }
    // }
    let obj = {
      "data": {
          "spname": "usp_unfyd_data_collection_form",
          "parameters": {
              "FLAG": "get",
              "Processid":this.userDetails.Processid,
              PRODUCTID:this.productId,
              "FORMCATEGORY":this.type
          }
      }
    }

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
         this.allFormsData = res.results.data
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }

  editForm(formname:string){
    // this.router.navigate(['masters/data-collection-forms/create-form/update',formname]);
    this.router.navigate(['/masters/data-collection-forms/update/'+this.productId+'/'+ this.type+"/"+formname]);
    // this.router.navigateByUrl('/masters/data-collection-forms/create-form/update/','1')
  }

  previewForm(formname:string){

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
          type: 'previewForm',
          formName:formname ,
          path:formname,
          productId: this.productId
      },
      width: '30vw'
  });
  dialogRef.afterClosed().subscribe(status => {
  });
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
