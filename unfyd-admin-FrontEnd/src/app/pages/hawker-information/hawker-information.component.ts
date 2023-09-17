import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';

@Component({
  selector: 'app-hawker-information',
  templateUrl: './hawker-information.component.html',
  styleUrls: ['./hawker-information.component.scss']
})
export class HawkerInformationComponent implements OnInit {
  @ViewChild('exelUpload') myInputVariable: ElementRef;
  loader: boolean = false;
  userDetails: any;
  tabKey: any = [];
  tabValue: any = [];
  type: any = '';
  masters: any;
  hawkerId: number;
  requestObj: any = {};
  search: any;
  page: number = 1;
  itemsPerPage: number = 10;
  statusTab = ['PendingApproval', 'Approved', 'Rejected', 'Inactive'];
  // status: any = 'PendingApproval';
  activeLink = this.statusTab[0];
  role:any;
  hawkerStatus  = 'PendingApproval';
  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      public dialog: MatDialog,
      private auth: AuthService
  ) {
   
  }

  ngOnInit(): void {
      this.getSnapShot();
  }

  getSnapShot() {
      this.userDetails = this.auth.getUser();
      this.role = this.userDetails['Role'];
      this.activatedRoute.url.subscribe(url => {
          this.type = this.activatedRoute.snapshot.paramMap.get('type');
          
          if (this.type == 'payment-collection') {
              this.router.navigate(['masters/payment-collection/list']);
          }
          this.getContacts();
      });
  }
  getContacts() {
    this.loader = true;
    this.tabValue = [];
    this.tabKey = [];
    if (this.type == 'hawker') {
        this.requestObj = {
            data: {
                spname: 'usp_unfyd_haw_personal',
                parameters: {
                    flag: 'GET',
                    processid: this.userDetails.Processid,
                    productid: 1,
                    roletype: 'hawker',
                    registrationstatus: this.hawkerStatus
                },
            },
        };
    }
  }

}
