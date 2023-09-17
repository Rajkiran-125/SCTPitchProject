import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
@Component({
  selector: 'app-hawker-grievances',
  templateUrl: './hawker-grievances.component.html',
  styleUrls: ['./hawker-grievances.component.scss']
})
export class HawkerGrievancesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  loader = false;
  contactId: any = "";
  userDetails: string;
  flag = "EDIT";
  spname = "usp_unfyd_haw_personal";
  ProcessId: any;
  ProductId: any;
  myGrievances: any;
  hawkerInfo: any;

  constructor(private router: Router,
    public datepipe: DatePipe,
    private auth: AuthService,
    public dialog: MatDialog,
    private api: ApiService) { }

  ngOnInit(): void {
    this.get()
  }

  async get() {
    this.hawkerInfo = await this.auth.getUser();
    this.contactId = this.hawkerInfo.EmployeeId;

    this.getBasicInfo();
  }
  back() {
    this.router.navigateByUrl('beneficiary-home')
  }

  getBasicInfo() {
    this.loader = true;
    let endPoint = "index";

    let doc = {
      data: {
        parameters: {
          HAWKERID: this.contactId,
          flag: "GRIEVANCE"
        },
        spname: "unfyd_haw_dashboard",
      },
    };

    this.api.post(endPoint, doc).subscribe(res => {
      if (res.error == false) {
        this.myGrievances = res.results.data;
        this.loader = false
      }
    });
  }

}
