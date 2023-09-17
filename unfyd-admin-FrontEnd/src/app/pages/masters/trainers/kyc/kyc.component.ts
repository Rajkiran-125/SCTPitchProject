import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, trainerFormSteps } from 'src/app/global/json-data';

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
  trainerFormSteps: string[] = [];
  requestObj: {};
  tabValue: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private api: ApiService,
    private common: CommonService,
    public dialog: MatDialog
  ) { 
    Object.assign(this, { regex, trainerFormSteps });
  }

  ngOnInit(): void {
    this.getSnapShot();
  }

  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.path !== null) {
      this.loader = true;
      this.requestObj = {
        data: {
          spname: "usp_unfyd_trainer_kyc_fileurl",
          parameters: {
            flag: 'GET',
            processid: this.userDetails.Processid,
            productid: 1,
            contactid: this.path,
          }
        }
      }

      this.api.post('index', this.requestObj).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          this.tabValue = res.results.data;
        } else {
          this.loader = false;
        }
      },
        (error) => {
          this.loader = false;
          this.common.snackbar(error.message, "error");
        })
    }
  }

  openDialog(type, data) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: data,
        master : this.path
      },
      width: '748px'
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
        spname: "usp_unfyd_trainer_kyc_fileurl",
        category: data.Category ? data.Category : '',
        parameters: {
          flag: type == 'update-document' ? 'UPDATE' : 'INSERT',
          id: data.Id ? data.Id : '',
          userid: this.userDetails.EmployeeId,
          processid: this.userDetails.Processid,
          productid: 1,
          contactid: this.path,
          createdby: data.CreatedBy ? data.CreatedBy : this.userDetails.EmployeeId,
          modifiedby: type == 'update-document' ? this.userDetails.EmployeeId : null,
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

}
