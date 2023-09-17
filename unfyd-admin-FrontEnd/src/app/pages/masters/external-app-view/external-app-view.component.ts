import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-external-app-view',
  templateUrl: './external-app-view.component.html',
  styleUrls: ['./external-app-view.component.scss']
})
export class ExternalAppViewComponent implements OnInit {
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
  subscriptionBulkDelete: Subscription[] = [];
  requestObj: any;


  constructor(
    private router:Router,private common: CommonService,private auth: AuthService,public dialog: MatDialog,
    private api: ApiService
  ) { }

  ngOnInit(): void {

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
    this.changeModuleDisplayName=this.common.changeModuleLabelName()
  }

  goTo(){
    this.router.navigate(['masters/externalApp/add']);
  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('DataCollectionForms','click','','',data,'setLabelByLanguage');

    this.subscription.push(this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'DataCollectionForms', data)
  }

  editForm(id){
    this.router.navigate([`masters/externalApp/update/${id}`]);
  }

  deleteApp(id) {
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
   this.subscriptionBulkDelete.push(
      this.common.getIndividualUpload$.subscribe(status => {
    if(status.status){
      this.loader = true
      this.requestObj = {
        data: {
          spname: "USP_EXTERNAL_APP",
          parameters: {
              FLAG: 'DELETE',
              ID: id,
              DELETEDBY: this.userDetails.id,
          },
      },
      }
      this.api.post("index", this.requestObj).subscribe(
        (res) => {
          if (res.code == 200) {
            this.loader = false;
            this.common.snackbar("Delete Record");
            this.getAllForms()
          } else {
            this.loader = false;
          }
        },
      )
    }

    this.subscriptionBulkDelete.forEach((e) => {
      e.unsubscribe();
    });
    }
    )
  )

  }



  getAllForms(){

    let obj = {
      "data": {
          "spname": "USP_EXTERNAL_APP",
          "parameters": {
              "FLAG": "GETFORMCARD",
          }
      }
    }
   
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.allFormsData = res.results.data
        console.log(' this.allFormsData', this.allFormsData)

        for (let i = 0; i < this.allFormsData.length; i++) {
          const obj = this.allFormsData[i];
        
          // Extract the original date string
          const originalDate = obj.CreatedOn;
        
          // Convert the original date string to a Date object
          const dateObj = new Date(originalDate);
        
          // Extract the individual date components
          const day = dateObj.getUTCDate();
          const month = dateObj.getUTCMonth() + 1; // Months are zero-based
          const year = dateObj.getUTCFullYear();
        
          // Format the date as 'dd/mm/yyyy'
          const formattedDay = day.toString().padStart(2, '0');
          const formattedMonth = month.toString().padStart(2, '0');
          const formattedYear = year.toString();
        
          const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
        
          // Update the value of CreatedOn in the current object
          obj.CreatedOn = formattedDate;
        }
        
        console.log('DATE CHANGE',this.allFormsData);
      } else {
        this.common.snackbar("General Error");
      }
    },
      (error) => {
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
