import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, hawkerFormSteps } from 'src/app/global/json-data';
import { Location } from '@angular/common'

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss']
})
export class KycComponent implements OnInit {

  loader: boolean = false;
  path: any;
  userDetails: any;
  regex: any;
  search: any;
  page: number = 1;
  itemsPerPage: number = 10;
  hawkerFormSteps: string[] = [];
  requestObj: {};
  tabValue: any = [];
  personalValue: any;
  userConfig:any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private api: ApiService,
    private common: CommonService,
    public dialog: MatDialog,
    public router: Router,
    private location: Location
  ) {
    Object.assign(this, { regex, hawkerFormSteps });
  }

  ngOnInit(): void {
    this.getSnapShot();
  }

  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');

    this.common.setUserConfig(this.userDetails.ProfileType, 'beneficiary');
    this.common.getUserConfig$.subscribe(data => {
      this.userConfig = data
      if(!this.userConfig.Documents){
      }
    });
    if (this.path !== null) {
      this.loader = true;
      var kycObj = {
        data: {
          spname: "usp_unfyd_contact_kyc_fileurl",
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
            contactid: this.path,
          }
        }
      }

      this.apiCall(kycObj, 'kyc');

        var personalObj = {
          data: {
            spname: "usp_unfyd_contact_personal",
            parameters: {
              flag: 'EDIT',
              productid: 1,
              processid: this.userDetails.Processid,
              contactid: this.path
            }
          }
        }
        this.apiCall(personalObj, 'personal');
    }
  }

  apiCall(object, type){
    this.api.post('index', object).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        if(type == 'kyc'){
          this.tabValue = res.results.data
        }else if(type == 'personal'){
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

  openDialog(type, data) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
        master : this.path
      },
      width: '30%'
    });
    dialogRef.afterClosed().subscribe(status => {
      if(status !== undefined){
        this.getSnapShot();
      }
    });
  }

  view(title, document) {
    var obj = {
      title: title,
      document: document
    }
    this.openDialog('fileView', obj)
  }

  uploadDocument(type, data) {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_contact_kyc_fileurl",
        category: data.Category ? data.Category : '',
        parameters: {
          flag: type == 'update-document' ? 'UPDATE' : 'INSERT',
          id: data.Id ? data.Id : '',
          userid: this.userDetails.Id,
          processid: this.userDetails.Processid,
          productid: 1,
          contactid: this.path,
          createdby: data.CreatedBy ? data.CreatedBy : this.userDetails.Id,
          modifiedby: type == 'update-document' ? this.userDetails.Id : null,
          isdeleted: 0,
          deletedby: null,
          publicip: this.userDetails.ip,
          privateip: '',
          browsername: this.userDetails.browser,
          browserversion: this.userDetails.browser_version
        }
      }
    }
    this.openDialog(type, this.requestObj)
  }

  setItemsPerPage(e) {
    this.itemsPerPage = e
  }

  submit(){
    this.router.navigate(['masters/beneficiary/other-details', this.path]);
  }

  back(): void {
    this.location.back()
  }

  viewDocument(val, type) {
    var data = {
      type: type,
      processid: this.userDetails.Processid,
      category: val,
      contactid: this.path,
    }
    this.common.setSingleImage(data)
  }
  
}
