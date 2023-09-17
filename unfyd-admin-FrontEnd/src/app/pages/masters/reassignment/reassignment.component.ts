import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { Breadcrumb } from 'src/app/global/interface';

@Component({
  selector: 'app-reassignment',
  templateUrl: './reassignment.component.html',
  styleUrls: ['./reassignment.component.scss']
})
export class ReassignmentComponent implements OnInit {

  @ViewChild('exelUpload') myInputVariable: ElementRef;
  public breadcrumbs: Breadcrumb[];
  loader: boolean = false;
  userDetails: any;
  tabKey: any = [];
  tabValue: any = [];
  type: any = '';
  tab: any;
  noData = false;
  hawkerId: number;
  requestObj: any;
  search: any;
  page: number = 1;
  itemsPerPage: number = 10;
  userConfig: any;
  FElist: any = [];
  FElistExceptSelectedOne: any = [];
  selectedHawkers: any = [];
  assignedTo = null
  displayFElistExceptSelectedOne =this.selectedHawkers.length > 0 ? true:false;
  @ViewChild("select") action1: MatSelect;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.common.hubControlEvent('Reassignment','click','pageload','pageload','','ngOnInit');
    this.common.hubControlEvent('Reassignment','click','pageloadend','pageloadend','','ngOnInit');

    this.getFeList()
  }

  getFeList() {
    
    this.FElistExceptSelectedOne = [];
    this.selectedHawkers = [];
    this.assignedTo = null
    this.displayFElistExceptSelectedOne =this.selectedHawkers.length > 0 ? true:false
    this.FElist = [];
    this.tabValue = []
    this.tabKey = []
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_haw_reassignment',
        parameters: {
          flag: 'GET_FE',
        },
      },
    };
    this.common.hubControlEvent('Reassignment','click','','',JSON.stringify(this.requestObj),'getFeList');

    this.api.post('index', this.requestObj).subscribe((res) => {
      if (res.code == 200) {        
        this.FElist = res.results.data
        // this.common.snackbar(res.results.data[0].result);
        // this.getContacts();
      }
    });
  }

  getMappedHawker(FEID) {
    this.loader = true
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_haw_reassignment',
        parameters: {
          flag: 'GET_MAPPED_HAWKER',
          FEID: FEID
        },
      },
    };
    this.common.hubControlEvent('Reassignment','click','','',JSON.stringify(this.requestObj),'getMappedHawker');

    this.api.post('index', this.requestObj).subscribe(res => {
      // this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        // this.tabValue = res.results.data
        this.tabValue = []
        this.tabKey = []
        var tempRes = res.results.data
        for (let data of tempRes) {
          var newObj = {
            "Sr No": '',
            "Hawker ID": data['HawkerID'],
            "First Name": data['First Name'],
            "Middle Name": data['Middle Name'],
            "Last Name": data['Last Name'],
            "PCC Verification": data['PCC Verification'],
            "Registration Status": data['Registration Status'],
            "Training Status": data['Training Status'],
            // "Add Complaint": data['Status'],
          }
          this.tabValue.push(newObj);
        }
        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
        if (tempRes.length == 0) {
          this.noData = true
        } else {
          this.noData = false
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
  getFESelected(event) {   
    this.common.hubControlEvent('Reassignment','click','','',JSON.stringify(event),'getFESelected');

    this.FElistExceptSelectedOne = [];
    this.selectedHawkers = [];
    this.assignedTo = null;
    this.displayFElistExceptSelectedOne =this.selectedHawkers.length > 0 ? true:false
    this.FElist.forEach(element => {
      if (element.FEID !== event) {
        this.FElistExceptSelectedOne.push(element)
      }
    });
    this.getMappedHawker(event)
  }

  assignedHawker(data){
    this.common.hubControlEvent('Reassignment','click','','',JSON.stringify(data),'assignedHawker');

  this.assignedTo = data
  }

  onCheckboxChecked(event, hawkerDetail) {   
    this.common.hubControlEvent('Reassignment','click','','',JSON.stringify(event),'onCheckboxChecked');

    if (event) {
      if (!this.selectedHawkers.includes(hawkerDetail['Hawker ID']))
        this.selectedHawkers.push(hawkerDetail['Hawker ID'])     
    } else if (!event) {
      this.selectedHawkers = this.selectedHawkers.filter(id => id != hawkerDetail['Hawker ID'])
    }

    this.displayFElistExceptSelectedOne =this.selectedHawkers.length > 0 ? true:false
  }

  submit(){
    let dummySelected = []
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_haw_reassignment',
        parameters: {
          flag: 'UPDATE_MAPPED_FE',
          ASSIGNEDTO:this.assignedTo,
          HAWKERID:JSON.stringify(this.selectedHawkers)
        },
      },
    };
    this.common.hubControlEvent('Reassignment','click','','',JSON.stringify(this.requestObj),'submit');

    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        this.getFeList();
        this.action1.value = null;
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })
  }
}
