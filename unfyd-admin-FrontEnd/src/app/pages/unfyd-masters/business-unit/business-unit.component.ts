import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { MatDialog } from '@angular/material/dialog';
import { businessUnitTabs, regex } from 'src/app/global/json-data';

@Component({
  selector: 'app-business-unit',
  templateUrl: './business-unit.component.html',
  styleUrls: ['./business-unit.component.scss']
})
export class BusinessUnitComponent implements OnInit {
  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  form: FormGroup;
  labelName: any;
  tabs: any = [];
  tabSelected: any;
  configData: any;
  heading: any;
  type: any;
  businessUnitTabs: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  paymentSearch: boolean = true;
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    Object.assign(this, { regex, businessUnitTabs });
  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    let dummyType = this.router.url.substring(15, this.router.url.length - 5);
    if (dummyType.toLocaleLowerCase() == "business-unit") {
      this.type = 'BusinessUnit'
    }
    this.activatedRoute.url.subscribe(url => {
      this.common.setUserConfig(this.userDetails.ProfileType, this.type);
      this.common.getUserConfig$.subscribe(data => {
        this.configData = data;
        // console.log(this.configData);
        this.tabs = []
        this.businessUnitTabs.forEach(element => {
          if (this.configData[element.tab]) {
            this[element.tab] = true
            this.tabs.push(element)
          }
        });
        this.tabSelected = this.tabs[0]?.label;
        this.heading = this.tabSelected == this.tabs[0]?.label ? 'Active Business Units' : 'Inactive Business Units';
      });
    });
    this.getSnapShot();
    this.getFilter();
    this.searchHawker('all');
  }
  getFilter() {
    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.searchHawker('all');
      }
    });
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
    });
  }
  getSnapShot() {
    this.common.closeComponent();

    this.common.openComponent$.subscribe((openComponent) => {
      this.paymentSearch = openComponent;
      this.reset();
    });
  }
  reset() {
    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
  }
  searchHawker(val: any) { }
  gotoFormPage(val, data) {
    this.router.navigate(["unfyd-masters/form/list"], {
      queryParams: {
        tabName: this.tabSelected,
        formName: val,
        id: data == null ? 'undefined' : data.Id,
        master: "BusinessHours"
      }
    });
  }
  changeTab(val) {
    this.tabSelected = val;
    this.heading = this.tabSelected == this.tabs[0].label ? 'Business Hrs' : 'Business Days'
    this.searchHawker('all');
  }

  getParentBusiness() {
    this.requestObj = {
      data: {
        spname: "UNFYD_ADM_USERMAPPING",
        parameters: {
          flag: "PROCESS",
          processid: this.userDetails.Processid,
          agentid: this.userDetails.Id
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      // console.log('Process', res)
    })
  }

}
