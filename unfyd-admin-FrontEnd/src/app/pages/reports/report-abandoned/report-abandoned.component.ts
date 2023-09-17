import { Component, ElementRef, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex } from 'src/app/global/json-data';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { Router } from '@angular/router';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Subscription } from 'rxjs';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-report-abandoned',
  templateUrl: './report-abandoned.component.html',
  styleUrls: ['./report-abandoned.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class AbandonedReportComponent implements OnInit {

  loader: boolean = false;
  userDetails: any;
  requestObj: any = {};
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  data: any;
  form: FormGroup;
  submittedForm: boolean = false;
  paymentSearch: boolean = true
  vendorRegistration: boolean = true
  currentpage: number = 1;
  itemsPerPage: number = 10;
  search: any;
  today = new Date();
  minDate = new Date();
  maxDate = new Date();
  proccessId: any;
  paginationArray: any = [];
  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  searchText: string;
  filterRes: any = [];
  filterValue: any[];
  process: any;
  processRes: any[];
  channel: any;
  channelRes: any[];
  channelSource: any;
  channelSourceRes: any[];
  group: any;
  groupRes: any[];
  user: any;
  userRes: any[];
  ccLocation: any;
  ccLocationRes: any[];
  type: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  userConfig: any;
  dateFormat: any;
  filter: boolean = false;
  startDate = new Date();
  endDate = new Date();
  Date = new Date();
  Name: any;
  Number: any;
  Channel: any;
  Status: any;
  QueueTime: any;
  StartTime: any;
  EndTime: any;
  Export: boolean = false;
  subscriptionPopupModal: Subscription | undefined;
  reportsData: Subscription | undefined;
  exportValue: Subscription | undefined;
  changeModuleDisplayName: string;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private router: Router
  ) {
    Object.assign(this, { regex });
  }

  ngOnInit(): void {
    this.common.hubControlEvent('AbandonedReport','click','pageload','pageload','','ngOnInit');

    this.filter = false;
    this.userDetails = this.auth.getUser();
    this.type = this.router.url.substring(1, this.router.url.length);
    if (this.type == "report-abandoned") {
      this.type = "AbandonedReport"
    }
    this.proccessId = this.userDetails.Processid;

    this.minDate.setFullYear(this.minDate.getFullYear() - 60);
    this.maxDate.setFullYear(this.maxDate.getFullYear());

    this.form = this.formBuilder.group({
      fromDate: [moment(), Validators.required],
      toDate: [moment(), Validators.required],
      Process: ['', Validators.nullValidator],
      channel: ['', Validators.nullValidator],
      channelSource: ['', Validators.nullValidator],
      group: ['', Validators.nullValidator],
      user: ['', Validators.nullValidator],
      Skill: ['', Validators.nullValidator],
      cclocation: ['', Validators.nullValidator],
    });
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.dateFormat = (data.DatePickerFormat);
    });
    this.getFilter();
    this.feildChooser();
    this.loadAgentFilter();
    this.loadReportsData();

    this.changeModuleDisplayName=this.common.changeModuleLabelName()

    this.common.hubControlEvent('AbandonedReport','click','pageloadend','pageloadend','','ngOnInit');

  }


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  loadAgentFilter() {
    this.common.hubControlEvent('AbandonedReport','click','','','','loadAgentFilter');

    this.subscriptionPopupModal = this.common.agentFilterDynamic.subscribe((data: any) => {
      this.filter = true;
      this.Export = false;
      this.startDate = data?.FROMDATE;
      this.endDate = data?.TODATE;
      this.Name = data?.Name;
      this.Number = data?.Number;
      this.currentpage = 1;
      this.Channel = data?.ChannelId;
      this.Status = data?.Status;
      this.QueueTime = data?.QueueDuration;
      this.StartTime = data?.StartTime;
      this.EndTime = data?.EndTime;
      this.searchHawker(this.currentpage, this.itemsPerPage, null);
    });
    this.exportValue = this.common.exportEmitter.subscribe((data : any) =>{
      // console.log(data);
      this.Export = data?.Export;
      this.searchHawker(this.currentpage, this.itemsPerPage, this.filter == true ? null : this.Date);
    });
  }

  loadReportsData() {
    this.common.hubControlEvent('AbandonedReport','click','','','','loadReportsData');

    this.reportsData = this.common.reportsDataEmitter.subscribe((data: any) => {
      this.filter = false;
      this.Export = false;
      this.Date = data;
      this.currentpage = 1;
      this.searchHawker(this.currentpage, this.itemsPerPage, this.Date);
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscriptionPopupModal?.unsubscribe();
    this.reportsData?.unsubscribe();
    this.exportValue?.unsubscribe();
  }
  getFilter() {
    this.common.hubControlEvent('AbandonedReport','click','','','','getFilter');

    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
        this.searchHawker(this.currentpage, this.itemsPerPage, '');
      }
    });
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
    });
  }



  onOptionsSelected(value: string) {
    //
    //console.log(value, "-+-+-+-+-+")
  }


  searchHawker(currentpage, itemsPerPage, date) {
    if (date == '') {
      this.filter = false;
    }
    if (this.Export == false || this.Export == undefined) {
      this.loader = true;
    }
    this.submittedForm = true;
    if (this.form.invalid || this.form.value.fromDate > this.form.value.toDate) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      this.common.snackbar("Select dates properly.", 'error');
      return;
    }

    let requestObj = {
      data: {
        spname: "UNFYD_ADM_RPT_V1_ABANDONED",
        parameters: {
          FROMDATE: this.filter == true ? this.startDate : date,
          TODATE: this.filter == true ? this.endDate : date,
          PROCESSID: this.proccessId,
          FLAG: this.Export == true ? 'EXPORT' : "BIND_DATA",
          PAGESIZE: itemsPerPage,
          PAGENO: currentpage,
          NAME: this.filter == false ? undefined : this.Name == null ? undefined : this.Name,
          NUMBER: this.filter == false ? undefined : this.Number == null ? undefined : Number(this.Number),
          CHANNELID: this.filter == false ? undefined : this.Channel == null ? undefined : this.Channel,
          STATUS: this.filter == false ? undefined : this.Status == null ? undefined : this.Status,
          DURATION: this.filter == false ? undefined : this.QueueTime == null ? undefined : this.QueueTime,
          STARTTIME: this.filter == false ? undefined : this.StartTime == null ? undefined : this.StartTime,
          ENDTIME: this.filter == false ? undefined : this.EndTime == null ? undefined : this.EndTime
        }
      }
    }
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(requestObj),'searchHawker');

    this.api.post('index', requestObj).subscribe((res) => {
      this.loader = false;
      if (res.code == 200) {
        if (this.Export == true) {
          var tempData : any = [];
          tempData = res.results.data;
          if(tempData?.length > 0){
            this.common.exportReport(tempData);
          }
        }
        else {
          this.loader = false;
          var tempRes = res.results.data;
          this.paginationArray = [];
          this.tabValue = [];
          this.tabKey = [];
          for (let data of tempRes[0]) {
            var newObj = {
              "Sr No": '',
              "Date": data['Date'],
              "Start Time": data['Start Time'],
              "End time": data['End Time'],
              "Queue Duration": data['Queue Duration'],
              "Channel": this.htmlDecode(data['Channel']),
              "Name": data['Name'],
              "Number": data['Number'],
              "Email": data['Email'],
              "Status": data['Status'],
            }
            this.tabValue.push(newObj);

          }
          for (var i = 1; i <= tempRes[1][0]['Total']; i++) {
            this.paginationArray.push(i);
          }

          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
          }
          this.common.tabValueLengthData(tempRes[1][0]['Total']);
          this.common.reportTabKeyData(this.tabKey);
          if (tempRes[0].length == 0) {
            this.noData = true
          } else {
            this.noData = false
          }
        }
      }
      else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message);
      })
  }
  htmlDecode(data: any) {
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(data),'htmlDecode');

    data = data.replace(/\&amp;/g, '&');
    data = data.replace(/\&gt;/g, '>');
    data = data.replace(/\&lt;/g, '<');
    data = data.replace(/\&quot;/g, '');
    data = data.replace(/\&apos;/g, '');
    return data;
  }

  pageChange(currentpage) {
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(currentpage),'pageChange');

    this.currentpage = currentpage;
    this.Export = false;
    this.searchHawker(currentpage, this.itemsPerPage, this.filter == false ? this.Date : null);
  }

  feildChooser() {
    var obj = {
      data: {
        spname: "usp_unfyd_user_field_chooser",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
          modulename: this.type,
          language: localStorage.getItem('lang')
        }
      }
    }
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(obj),'feildChooser');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        if (res.results.data.length == 0) {
          this.selctedField = this.tabKey;
        } else {
          this.selctedField = res.results.data[0].FieldChooser.split(',');
        }
        this.unSelctedField = this.tabKey.filter(field => !this.selctedField.includes(field));
        var selctedField = [];
        for (let i = 0; i < this.selctedField.length; i++) {
          selctedField.push({ value: this.selctedField[i], className: '' })
        }
        var unSelctedField = [];
        for (let i = 0; i < this.unSelctedField.length; i++) {
          unSelctedField.push({ value: this.unSelctedField[i], className: 'tabCol' })
        }
        this.finalField = [
          ...selctedField,
          ...unSelctedField
        ]
      } else {
        // this.common.snackbar(res.results.data[0].result);
      }
    },
      (error) => {
        // this.common.snackbar(error.message);
      })
  }


  reset() {
    this.common.hubControlEvent('AbandonedReport','click','','','','reset');

    this.tabKey = [];
    this.tabValue = [];
    this.form.reset();
  }

  filterData() {

    let requestObj1 = {
      data: {
        spname: "UNFYD_ADM_USERMAPPING",
        parameters: {
          FLAG: "SKILL",
          AGENTID: "",
          PROCESSID: this.proccessId,
          CHANNELID: ""
        }
      }
    }
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(requestObj1),'filterData');

    this.api.post('index', requestObj1).subscribe((res) => {
      if (res.code == 200) {
        this.filterRes = res.results.data
        // //console.log(this.filterRes.length, "length++++");
        let reportfilter = []
        for (let i = 0; i < this.filterRes.length; i++) {
          // //console.log(this.filterRes[i], "data++++")
          reportfilter.push(this.filterRes[i])
        }
        this.filterValue = reportfilter
        //console.log(this.filterRes, "skill filter")

      }
    })


    let requestObj2 = {
      data: {
        spname: "UNFYD_ADM_USERMAPPING",
        parameters: {
          FLAG: "PROCESS",
          AGENTID: "",
          PROCESSID: this.proccessId,
          CHANNELID: ""
        }
      }
    }
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(requestObj2),'filterData');

    this.api.post('index', requestObj2).subscribe((res) => {
      if (res.code == 200) {
        this.process = res.results.data
        // //console.log(this.process,"process filter")
        let reportData = []
        for (let j = 0; j < this.process.length; j++) {
          // //console.log(this.process[j])
          reportData.push(this.process[j])
        }
        this.processRes = reportData
        //console.log(this.processRes, "processRes filter")
      }
    })

    let requestObj3 = {
      data: {
        spname: "UNFYD_ADM_USERMAPPING",
        parameters: {
          FLAG: "CHANNEL",
          AGENTID: "",
          PROCESSID: this.proccessId,
          CHANNELID: ""
        }
      }
    }
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(requestObj3),'filterData');

    this.api.post('index', requestObj3).subscribe((res) => {
      if (res.code == 200) {
        this.channel = res.results.data
        // //console.log(this.channel,"channel filter")
        let channelData = []
        for (let k = 0; k < this.channel.length; k++) {
          // //console.log(this.channel[k])
          channelData.push(this.channel[k])
        }
        this.channelRes = channelData
        //console.log(this.channelRes, "channelRes filter")
      }
    })

    let requestObj4 = {
      data: {
        spname: "UNFYD_ADM_USERMAPPING",
        parameters: {
          FLAG: "CHANNELSOURCE",
          AGENTID: "",
          PROCESSID: this.proccessId,
          CHANNELID: ""
        }
      }
    }
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(requestObj4),'filterData');

    this.api.post('index', requestObj4).subscribe((res) => {
      if (res.code == 200) {
        this.channelSource = res.results.data
        // //console.log(this.channelSource,"channelSource filter")
        let channelSourceData = []
        for (let l = 0; l < this.channelSource.length; l++) {
          // //console.log(this.channelSource[l])
          channelSourceData.push(this.channelSource[l])
        }
        this.channelSourceRes = channelSourceData
        //console.log(this.channelSourceRes, "channelSource filter")
      }
    })

    let requestObj5 = {
      data: {
        spname: "UNFYD_ADM_USERMAPPING",
        parameters: {
          FLAG: "GROUP",
          AGENTID: "",
          PROCESSID: this.proccessId,
          CHANNELID: ""
        }
      }
    }
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(requestObj5),'filterData');

    this.api.post('index', requestObj5).subscribe((res) => {
      if (res.code == 200) {
        this.group = res.results.data
        // //console.log(this.group,"group filter")
        let groupData = []
        for (let l = 0; l < this.group.length; l++) {
          // //console.log(this.group[l])
          groupData.push(this.group[l])
        }
        this.groupRes = groupData
        //console.log(this.groupRes, "channelSource filter")
      }
    })

    let requestObj6 = {
      data: {
        spname: "USP_UNFYD_TALK_AGENTROUTING",
        parameters: {
          ACTIONFLAG: "GET_AGENT_BY_GROUP",
          // AGENTID: "",
          PROCESSID: this.proccessId,
          // CHANNELID: ""
        }
      }
    }
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(requestObj6),'filterData');

    this.api.post('index', requestObj6).subscribe((res) => {
      if (res.code == 200) {
        this.user = res.results.data
        // //console.log(this.user,"user filter")
        let userData = []
        for (let l = 0; l < this.user?.length; l++) {
          // //console.log(this.user[l])
          userData.push(this.user[l])
        }
        this.userRes = userData
        //console.log(this.userRes, "channelSource filter")
      }
    })

    let requestObj7 = {
      data: {
        spname: "UNFYD_ADM_LOCATION_MASTER",
        parameters: {
          FLAG: "GET_LOCATION",
          // AGENTID: "",
          PROCESSID: this.proccessId,
          // CHANNELID: ""
        }
      }
    }
    this.common.hubControlEvent('AbandonedReport','click','','',JSON.stringify(requestObj7),'filterData');

    this.api.post('index', requestObj7).subscribe((res) => {
      if (res.code == 200) {
        this.ccLocation = res.results.data
        // //console.log(this.ccLocation,"ccLocation filter")
        let ccLocationData = []
        for (let l = 0; l < this.ccLocation.length; l++) {
          // //console.log(this.ccLocation[l])
          ccLocationData.push(this.ccLocation[l])
        }
        this.ccLocationRes = ccLocationData
        //console.log(this.ccLocationRes, "channelSource filter")
      }
    })
  }

  count = true
    sortUsers(by: string, order: string): void {
        if (by == 'Actionable') return
        if (by == 'Sr No') return
       
        this.finalField.map(data => {

            if (data.value === by) {
                if (!data.order) {
                    data.order = 'desc'
                } else {
                    data.order = (data.order === 'desc') ? 'asc' : 'desc';
                }
            } else {
                data.order = null
            }
        })


        let x=this.tabValue.filter(n => n[by])
        let k=this.tabValue.filter(n => n[by]==null)
        let s=this.tabValue.filter(n => n[by]=='')
        let y=x.sort((a, b) =>a[by].localeCompare(b[by]))
        this.tabValue=[...y, ...k, ...s]
        this.count = !this.count
        this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
     
    }
}
