import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-form-creation',
  templateUrl: './form-creation.component.html',
  styleUrls: ['./form-creation.component.scss']
})
export class FormCreationComponent implements OnInit {

  loader: boolean = false;
  userDetails:any;
  labelName:any;
  allFormsData = []
  changeModuleDisplayName: string;
  subscription: Subscription[] = [];
  userConfig: any;
  productName: any = "";
  productID: any;
  productType: any = "";
  constructor(private router:Router,private common: CommonService,private auth: AuthService,public dialog: MatDialog,
    private api: ApiService) { }

  ngOnInit(): void {
    this.common.hubControlEvent('DataCollectionForms','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.getProducts()
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }));
    // this.getAllForms()
    this.common.setUserConfig(this.userDetails.ProfileType, 'DataCollectionForms');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.changeModuleDisplayName=this.common.changeModuleLabelName()
    this.common.hubControlEvent('DataCollectionForms','click','pageloadend','pageloadend','','ngOnInit');

  }

  goTo(url){
    this.common.hubControlEvent('DataCollectionForms','click','','',url,'goTo');

    this.router.navigate(['/masters/data-collection-forms/'+this.productID+'/',url])
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('DataCollectionForms','click','','',data,'setLabelByLanguage');

    this.subscription.push(this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'DataCollectionForms', data)
  }

  selectedProduct(event) {
    this.common.hubControlEvent('DataCollectionForms','click','','',event,'selectedProduct');

    this.productID = event;

    this.productType.forEach((element) => {
      if (element.Id == this.productID) {
        this.productName = element?.ProductName;
      }
    });
    this.getAllForms()
  }

  getProducts() {
    this.common.hubControlEvent('DataCollectionForms','click','','','','getProducts');

    this.productType = JSON.parse(localStorage.getItem("products"));
    // this.productID = this.productType.Id;
    // this.productName = this.productType.ProductName;
  }

  getAllForms(){

    let obj = {
      "data": {
          "spname": "usp_unfyd_data_collection_form",
          "parameters": {
              "FLAG": "getformcategory",
          }
      }
    }
    this.common.hubControlEvent('DataCollectionForms','click','','',JSON.stringify(obj),'getAllForms');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.allFormsData = JSON.parse(res.results.data[0].result)
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
        this.common.snackbar("General Error");
      })
  }

  editForm(formname:string){
    this.common.hubControlEvent('DataCollectionForms','click','','',JSON.stringify(formname),'editForm');

    this.router.navigate(['/masters/data-collection-forms/update/', formname]);
  }

  previewForm(formname:string){
    this.common.hubControlEvent('DataCollectionForms','click','','',JSON.stringify(formname),'previewForm');


    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
          type: 'previewForm',
          formName:formname ,
          path:formname
      },
      width: '30vw',
      height: '75vh'
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
