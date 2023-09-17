import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull, checknull1, masters, regex } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';




@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, deps: [CommonService], useFactory: (common: CommonService) => {
        let a: any = {
          parse: {
            dateInput: 'DD/MM/YYYY',
          },
          display: {
            dateInput: 'dddd/MMM/YYYY',
            monthYearLabel: 'MMMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY'
          }
        };

        common.localizationInfo$.subscribe((res1) => {
          a.display.dateInput = res1.selectedDateFormats.toUpperCase()
        })
        common.localizationDataAvailable$.subscribe((res) => {
          if (res) {
            common.localizationInfo$.subscribe((res1) => {
              a.display.dateInput = res1.selectedDateFormats.toUpperCase()
            })
          }
        })
        return a
      }
    }
  ]
})
export class SchedulerComponent implements OnInit {
  form: FormGroup;
  scheduletype: any;
  buttonname: any;
  buttonvalue: any;
  loader: boolean = false;
  submittedForm = false;
  userDetails: any;
  path: string;
  subscription: Subscription[] = [];
  todayDate: Date = new Date();
  product: any;
  productid: any;
  obj: {};
  labelName: any;
  userConfig: any;
  config: any;
  IsDateGreater: boolean = false;
  IsTimeGreater: boolean = false;
  start: boolean = false;
  subscriptionAcitivateData: Subscription[] = [];
  configdataStart = { hour: 0, minute: 0, second: 0 };
  configdataStartSecond = { hour: 0, minute: 0, second: 0 };
  configdataEnd = { hour: 0, minute: 0, second: 0 };
  productType: any = [];
  @Input() productName: any;
  startimeofonetime: any;

  timevalereq: boolean = false;
  timevaluereq: boolean = false;
  ReportOption: any;
  TemplateOption: any;
  ScheduleOption: any;
  EmailAccountOption: any;




  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog,
    private datePipe: DatePipe,
  ) {
    Object.assign(this, { masters })
  }

  ngOnInit(): void {


    this.form = this.formBuilder.group({
      scheduletype: ['onetime', Validators.nullValidator],
      name: ["", [Validators.required, Validators.pattern(regex.alphabet)]],
      description: ["", [Validators.nullValidator,Validators.maxLength(500)]],
      selectreport: ["", Validators.required],
      template: ["", Validators.required],
      recurring: ["", Validators.nullValidator],
      emailacc: ["", Validators.required],
      sendto: ["", Validators.required],
      starttype: ["startnow", Validators.nullValidator],
      startdate: ["", Validators.required],
      starttime: [{ hour: 0, minute: 0, second: 0 }, Validators.nullValidator],
      startdaterecu: ["", Validators.nullValidator],
      starttimerec: [{ hour: 0, minute: 0, second: 0 }, Validators.nullValidator],
      enddaterecu: ["", Validators.nullValidator],
      endtimerec: [{ hour: 0, minute: 0, second: 0 }, Validators.nullValidator],
      SelectSchedule: ["", Validators.required],
    },
      { validator: [checknull('name'), checknull1('name'), checknull1('description')] },

    )
    this.getSnapShot()
    this.userDetails = this.auth.getUser();
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.productid = this.activatedRoute.snapshot.paramMap.get('productid')
    this.GetDropDownOption()

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'scheduler');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
      // console.log(this.userConfig, " this.userConfig")
      // console.log(data, " this.userConfig data")

    }))

    // this.subscription.push(this.common.schedulerView$.subscribe(res => {
    //   if (res != false){
    //      this.product = res.product

    //   }}))

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.Edit();
  }

  GetDropDownOption() {
    // var Obj1 = {
    //   data: {
    //     spname: "usp_unfyd_scheduler",
    //     parameters: {
    //       flag: "GET_REPORT_DROPDOWN",
    //       PROCESSID: this.userDetails.Processid,
    //       PRODUCTID: this.productid,
    //     }
    //   }
    // }
    // this.api.post('index', Obj1).subscribe(res => {
    //   console.log('res.results.data',res.results.data);
    //   this.ReportOption = res.results.data
    // })


    var Obj1 = {
      data: {
        spname: "usp_unfyd_rpt_export_details",
        parameters: {
          flag: 'GETREPORT',

        }
      }
    }
    this.api.post('index', Obj1).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.ReportOption = res.results.data
      }
    })

    var Obj2 = {
      data: {
        spname: "usp_unfyd_scheduler",
        parameters: {
          flag: "GET_EMAIL_TEMPLATE_DROPDOWN",
          PROCESSID: this.userDetails.Processid,
          PRODUCTID: this.productid,
        }
      }
    }
    this.api.post('index', Obj2).subscribe(res => {
      console.log('res.results.data', res.results.data);

      this.TemplateOption = res.results.data
    })

    var Obj3 = {
      data: {
        spname: "usp_unfyd_scheduler",
        parameters: {
          flag: "GET_SCHEDULE_DROPDOWN",
          PROCESSID: this.userDetails.Processid,
        }
      }
    }
    this.api.post('index', Obj3).subscribe(res => {
      console.log('res.results.data', res.results.data);
      this.ScheduleOption = res.results.data
    })

    var Obj4 = {
      data: {
        spname: "usp_unfyd_scheduler",
        parameters: {
          flag: "GET_EMAIL_ACCOUNT_DROPDOWN",
          PROCESSID: this.userDetails.Processid,
        }
      }
    }
    this.api.post('index', Obj4).subscribe(res => {
      console.log('res.results.data', res.results.data);
      this.EmailAccountOption = res.results.data
    })


  }

  Edit() {
    if (this.path != null) {
      var Obj = {
        data: {
          spname: "usp_unfyd_scheduler",
          parameters: {
            flag: "EDIT",
            id: this.path,

          }
        }
      }
      this.api.post('index', Obj).subscribe(res => {
        if (res.code == 200) {
          console.log(res, "edit res")

          this.form.controls.scheduletype.patchValue(res.results.data[0].ScheduleType)
          this.form.controls.name.patchValue(res.results.data[0].SchedulerName)
          this.form.controls.description.patchValue(res.results.data[0].SchedulerDesc)
          this.form.controls.selectreport.patchValue(res.results.data[0].ReportName)
          // this.form.controls.emailacc.patchValue(res.results.data[0].EmailAccountId)
          this.form.controls.sendto.patchValue(res.results.data[0].SendId.split(','))
          // this.form.controls.template.patchValue(res.results.data[0].TemplateId)
          this.form.controls.starttype.patchValue(res.results.data[0].StartType)
          this.form.controls.SelectSchedule.patchValue(res.results.data[0].SelectSchedule.toString())

          if (this.form.value.scheduletype == "onetime") {

            this.form.controls.startdate.patchValue(moment(res.results.data[0].StartDateTime))
          }
          if (this.form.value.scheduletype == "recurring") {

            // this.todayDate = new Date(res.results.data[0].StartDateTime);
            this.form.controls.startdaterecu.patchValue(moment(res.results.data[0].StartDateTime))
            this.form.controls['starttimerec'].patchValue(moment(res.results.data[0].StartDateTime, ["HH:mm:ss"]).toDate());
            this.form.controls.enddaterecu.patchValue(moment(res.results.data[0].EndDateTime))
            this.todayDate = new Date(res.results.data[0].EndDateTime);


            this.form.controls['endtimerec'].patchValue(moment(res.results.data[0].EndDateTime, ["HH:mm:ss"]).toDate());
          }

          // this.todayDate = new Date(res.results.data[0].StartDateTime);


          if (res.results.data[0].StartDateTime) { this.todayDate = new Date(res.results.data[0].StartDateTime); }



          let d = new Date(this.form.value.startdate)
          this.form.get('starttime').patchValue({
            hour: d.getUTCHours(),
            minute: d.getUTCMinutes(),
            second: d.getUTCSeconds()
          });

          let e = new Date(this.form.value.startdaterecu)
          this.form.get('starttimerec').patchValue({
            hour: e.getUTCHours(),
            minute: e.getUTCMinutes(),
            second: e.getUTCSeconds()
          });

          let f = new Date(this.form.value.enddaterecu)
          this.form.get('endtimerec').patchValue({
            hour: f.getUTCHours(),
            minute: f.getUTCMinutes(),
            second: f.getUTCSeconds()
          });


          let Emailaccid = res.results.data[0].EmailAccountId
          this.form.controls.emailacc.patchValue(Emailaccid)

          let TempId = res.results.data[0].TemplateId
          this.form.controls.template.patchValue(TempId.toString())
          this.form.updateValueAndValidity();
          setTimeout(() => {
            this.scheduleButton(this.form.value.scheduletype)
          });

        }
      })
    }
  }


  scheduleButton(e) {

    this.buttonname = e.value == 'onetime' || e.value == 'recurring' ? e.value : ''
    if (e.value == undefined) {
      this.buttonname = e == 'onetime' || e == 'recurring' ? e : ''
    }

    if (this.buttonname == 'onetime') {

      // this.start = true
      this.form.get('startdaterecu').setValidators(Validators.nullValidator)
      this.form.get('enddaterecu').setValidators(Validators.nullValidator)
      this.form.get('startdate').setValidators(Validators.required)
      this.form.controls.endtimerec.patchValue({ hour: 0, minute: 0, second: 0 });
      this.form.controls.starttimerec.patchValue({ hour: 0, minute: 0, second: 0 });
      this.form.updateValueAndValidity()

    }
    else {
      // this.start = false
      this.form.get('startdaterecu').setValidators(Validators.required)
      this.form.get('enddaterecu').setValidators(Validators.required)
      this.form.get('startdate').setValidators(Validators.nullValidator)
      this.form.controls.starttime.patchValue({ hour: 0, minute: 0, second: 0 });
      this.form.updateValueAndValidity()
    }

  }


  // recurringButton(){



  // }

  startButton(e1) {
    this.buttonvalue = e1.value == 'startnow' || e1.value == 'startlater' ? e1.value : ''
    if (e1.value == undefined) {
      this.buttonvalue = e1 == 'startnow' || e1 == 'startlater' ? e1 : ''
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  cancleButton(): void {

    this.router.navigate(['masters/scheduler']);
  }

  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });
  }

  removeKeyword(keyword: string) {
    let val = this.form.value.sendto
    const index = val.indexOf(keyword);
    if (index >= 0) {
      val.splice(index, 1);
    }
    this.form.controls['sendto'].patchValue(val)
  }

  addKeywordFromInput(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
        var regex1 = new RegExp(regex.email1);
    if (!regex1.test(value)) {
      this.common.snackbar('Email Invalid')
      return;
    }
    else if (this.form.value.sendto.length > 0) {
      const totalSelected = this.form.controls['sendto'].value
      const hasDuplicate = totalSelected.some((e, index) => {
        if (e === value) {
          this.form.controls['sendto'].setErrors({ sameEmail: true });
          this.form.markAllAsTouched()
          return hasDuplicate ? { duplicate: true } : null;
        }
      });
    }
    let val = this.form.value.sendto ? this.form.value.sendto : []
    if (value) {
      val.push(value);
      // delete this.form.get('sendto').errors['sameEmail'];
      this.form.controls['sendto'].setErrors(null)
      this.form.controls['sendto'].clearValidators();
    }
    this.form.controls['sendto'].patchValue(val)
    event.chipInput!.clear();

  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
        console.log("===", this.labelName);

      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'scheduler', data)

  }

  back(): void {

    let a = {}
    Object.assign(a, { productId: this.productid })
    // Object.assign(a,{tab : 'GET_PENDING'})
    this.common.selectedApprovalDetails.next(a)
    this.router.navigate(['masters/scheduler']);
    // this.location.back()
  }


  resetfunc() {
    // this.form.reset()
    this.submittedForm = false
    // this.form.controls['scheduletype'].patchValue('onetime');
    this.IsDateGreater = false;
    setTimeout(() => {

      this.form.controls.starttime.patchValue({ hour: 0, minute: 0, second: 0 });
      this.form.controls.endtimerec.patchValue({ hour: 0, minute: 0, second: 0 });
      this.form.controls.starttimerec.patchValue({ hour: 0, minute: 0, second: 0 });
    })
    // this.configdataStartSecond = { hour: 0, minute: 0, second: 0 };
    // this.configdataEnd = { hour: 0, minute: 0, second: 0 };

  }



  scheduleType(): boolean {
    // let a = false;
    // if (!this.form.value.scheduletype) a = true
    // return a;
    return !this.form.value.scheduletype;
  }

  startType(): boolean {
    // let b = false;
    // if (!this.form.value.starttype) b = true
    // return b;
    return !this.form.value.starttype;

  }

  startSubmit(event) {
    this.submittedForm = true;
    if (this.buttonname == 'onetime') {
      this.form.get('startdaterecu').setValue(null);
      this.form.get('enddaterecu').setValue(null);
    }
    if (this.buttonname == 'recurring') {
      this.form.get('startdate').setValue(null);
    }


    // if()
    if (this.form.invalid || this.scheduleType() && this.startType()) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }

    if (this.form.get('sendto').hasError('sameEmail')) {

      return;

    }


    if (this.scheduleType()) {
      return;
    }
    if (this.startType()) {
      return;
    }


    if (this.form.controls["startdaterecu"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "Groupname" + '"]');
      invalidControl.focus();
      this.form.get('startdaterecu').markAsTouched();
      return;
    }


    if (this.form.controls["enddaterecu"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "Groupname" + '"]');
      invalidControl.focus();
      this.form.get('enddaterecu').markAsTouched();
      return;
    }

    if (this.form.controls["startdate"].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + "Groupname" + '"]');
      invalidControl.focus();
      this.form.get('startdate').markAsTouched();
      return;
    }


    // let timeval = { hour:0,minute:0,second:0}
    // if(this.form.value.starttimerec.hour == 0 && this.form.value.starttimerec.hour == 0 && this.form.value.starttimerec.hour == 0){
    //   this.timevalereq = true;
    //   return
    // }

    // if(this.form.value.endtimerec.hour == 0 && this.form.value.endtimerec.hour == 0 && this.form.value.endtimerec.hour == 0){
    //   this.timevaluereq = true;
    //   return
    // }

    if (this.form.value.scheduletype == 'recurring') {


      if (this.form.value.startdaterecu >= this.form.value.enddaterecu) {
        this.IsDateGreater = true;
        this.loader = false;
        return
      }
      else {
        this.IsDateGreater = false;
      }

      if (this.StartTimeEndTimeGreater()) {
        this.form.get('starttimerec').markAsTouched();
        this.form.get('endtimerec').markAsTouched();

        return
      }
    }

    if (this.form.value.scheduletype == 'onetime') {
      this.IsDateGreater = false;
    }



    //   if (this.form.value.scheduletype == 'recurring') {

    //   if(this.form.value.starttimerec >= this.form.value.endtimerec)
    //   {
    //   this.IsTimeGreater = true;
    //   this.loader = false;
    //   return
    //   }
    //   else{
    //     this.IsTimeGreater = false;
    //   }
    // }

    // if (this.form.value.scheduletype == 'onetime') {
    //      this.IsTimeGreater = false;
    // }



    if (this.path == null) {
      let a = new Date()
      console.log(a, "a")


      let d
        = new Date(this.form.value.startdate)
      d.setTime(d.getTime() + (this.form.value.starttime.hour * 60 * 60 * 1000) + (this.form.value.starttime.minute * 60 * 1000) + (this.form.value.starttime.second * 1000))
      console.log(d, "d")

      let e = new Date(this.form.value.startdaterecu)
      e.setTime(e.getTime() + (this.form.value.starttimerec.hour * 60 * 60 * 1000) + (this.form.value.starttimerec.minute * 60 * 1000) + (this.form.value.starttimerec.second * 1000))
      console.log(e, "e")

      let f = new Date(this.form.value.enddaterecu)
      f.setTime(f.getTime() + (this.form.value.endtimerec.hour * 60 * 60 * 1000) + (this.form.value.endtimerec.minute * 60 * 1000) + (this.form.value.endtimerec.second * 1000))
      console.log(f, "f")



      this.obj = {
        data: {
          spname: 'usp_unfyd_scheduler',
          parameters: {
            flag: 'INSERT',
            ScheduleType: this.form.value.scheduletype,
            SchedulerName: this.form.value.name == null ? null : this.form.value.name.trim(),
            SchedulerDesc: this.form.value.description == null ? null : this.form.value.description.trim(),
            ReportName: this.form.value.selectreport,
            EmailAccountId: this.form.value.emailacc,
            SendId: this.form.value.sendto.length > 0 ? this.form.value.sendto.join(',') : "",
            TemplateId: this.form.value.template,
            StartType: this.form.value.starttype,
            SelectSchedule: this.form.value.SelectSchedule,
            // StartDateTime: this.form.value.startdate,
            // StartDateTime: this.form.value.scheduletype == 'recurring' ? e : d,
            // // this.form.value.scheduletype == 'onetime' ? this.form.value.startdate : this.form.value.startdaterecu,
            // EndDateTime: this.form.value.scheduletype == 'recurring' ? f : null,
            StartDateTime: this.form.value.scheduletype == 'recurring' ? this.datePipe.transform(e, 'yyyy-MM-dd HH:mm:ss') : this.datePipe.transform(d, 'yyyy-MM-dd HH:mm:ss'),
            // this.form.value.scheduletype == 'onetime' ? this.form.value.startdate : this.form.value.startdaterecu,
            EndDateTime: this.form.value.scheduletype == 'recurring' ? this.datePipe.transform(f, 'yyyy-MM-dd HH:mm:ss') : null,
            processid: this.userDetails.Processid,
            productid: this.productid,
            createdby: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            PrivateIp: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version,
          }

        }
      }
    }
    else {
      let d = this.removeTime(new Date(this.form.value.startdate))
      d.setHours(d.getHours() + this.form.value.starttime.hour);
      d.setMinutes(d.getMinutes() + this.form.value.starttime.minute);
      d.setSeconds(d.getSeconds() + this.form.value.starttime.second);
      console.log(d, "d")

      // let e = new Date(this.form.value.startdaterecu)
      // e.setTime(e.getTime() + (this.form.value.starttimerec.hour * 60 * 60 * 1000) + (this.form.value.starttimerec.minute * 60 * 1000) + (this.form.value.starttimerec.second * 1000))
      // console.log(e, "e")
      let e = this.removeTime(new Date(this.form.value.startdaterecu))
      e.setHours(e.getHours() + this.form.value.starttimerec.hour);
      e.setMinutes(e.getMinutes() + this.form.value.starttimerec.minute);
      e.setSeconds(e.getSeconds() + this.form.value.starttimerec.second);
      console.log(e, "e")

      // let f = new Date(this.form.value.enddaterecu)
      // f.setTime(f.getTime() + (this.form.value.endtimerec.hour * 60 * 60 * 1000) + (this.form.value.endtimerec.minute * 60 * 1000) + (this.form.value.endtimerec.second * 1000))
      // console.log(f, "f")
      let f = this.removeTime(new Date(this.form.value.enddaterecu))
      f.setHours(f.getHours() + this.form.value.endtimerec.hour);
      f.setMinutes(f.getMinutes() + this.form.value.endtimerec.minute);
      f.setSeconds(f.getSeconds() + this.form.value.endtimerec.second);
      console.log(f, "f")

      this.obj = {
        data: {
          spname: 'usp_unfyd_scheduler',
          parameters: {
            flag: 'UPDATE',
            Id: this.path,
            ScheduleType: this.form.value.scheduletype,
            SchedulerName: this.form.value.name == null ? null : this.form.value.name.trim(),
            SchedulerDesc: this.form.value.description == null ? null : this.form.value.description.trim(),
            ReportName: this.form.value.selectreport,
            EmailAccountId: this.form.value.emailacc,
            SendId: this.form.value.sendto.length > 0 ? this.form.value.sendto.join(',') : "",
            TemplateId: this.form.value.template,
            StartType: this.form.value.starttype,
            SelectSchedule: this.form.value.SelectSchedule,

            // StartDateTime: this.form.value.scheduletype == 'recurring' ? e : d,
            // EndDateTime: this.form.value.scheduletype == 'recurring' ? f : null,
            StartDateTime: this.form.value.scheduletype == 'recurring' ? this.datePipe.transform(e, 'yyyy-MM-dd HH:mm:ss') : this.datePipe.transform(d, 'yyyy-MM-dd HH:mm:ss'),
            EndDateTime: this.form.value.scheduletype == 'recurring' ? this.datePipe.transform(f, 'yyyy-MM-dd HH:mm:ss') : null,

            MODIFIEDBY: this.userDetails.Id,

          }
        }
      }
    }
    this.api.post('index', this.obj).subscribe((res: any) => {
      if (res.code == 200) {
        if (res.results.data[0].result == "Data added successfully") {
          this.obj = {
            "data": {
              "FLAG": "INSERT",
              "SCHEDULERNAME": this.form.value.name == null ? null : this.form.value.name.trim()
            }
          }
          this.api.post('ScheduleInsertRedis', this.obj).subscribe((res: any) => {
          })
          this.common.snackbar('Record add')
          this.back()

        }
        if (res.results.data[0].result == "Data updated successfully") {

          this.obj = {
            "data": {
              "FLAG": "UPDATE",
              "SCHEDULERNAME": this.form.value.name == null ? null : this.form.value.name.trim()
            }
          }
          this.api.post('ScheduleInsertRedis', this.obj).subscribe((res: any) => {
          })
          this.common.snackbar('Update Success');
          this.back()

        }

        if (event == 'start') {
          if (res.results.data[0].result == "Data added successfully") {
            this.common.snackbar('Record add')
            this.router.navigate(['masters/scheduler']);
          }
          if (res.results.data[0].result == "Data updated successfully") {
            this.common.snackbar('Update Success');
          }
          if ((res.results.data[0].result == "Data already exists") && res.results.data[0].Status == false) {
            this.common.snackbar('Data Already Exist');

          }
        }

        if (event == 'submit') {
          if (res.results.data[0].result == "Data added successfully") {
            this.common.snackbar('Record add')
            this.router.navigate(['masters/scheduler']);
          }
          if (res.results.data[0].result == "Data updated successfully") {
            this.common.snackbar('Update Success');
          }
          if ((res.results.data[0].result == "Data already exists") && res.results.data[0].Status == false) {
            this.common.snackbar('Data Already Exist');

          }
        }

        if ((res.results.data[0].result == "Data already exists") && res.results.data[0].Status == false) {
          this.common.snackbar('Data Already Exist');
          // if (event == 'start') {
          //   this.common.snackbar('Data Already Exist');
          // }

          // if (event == 'submit') {
          //   this.common.snackbar('Data Already Exist');
          // }
        }
        else if (res.results.data[0].Status == true) {
          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              this.loader = false;
              if (status.status) {
                this.loader = true;
                this.obj = {
                  data: {
                    spname: "usp_unfyd_scheduler",
                    parameters: {
                      flag: 'ACTIVATE',
                      SchedulerName: this.form.value.name,
                      processid: this.userDetails.Processid,
                      productid: this.productid,

                    }
                  }
                };
                this.api.post('index', this.obj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.refreshMenu(true);

                    this.common.snackbar('Record add');
                    this.back();
                    // this.router.navigate(['masters/scheduler']);

                    if (event == 'start') {
                      if (res.results.data[0].result == "Data added successfully") {
                        this.common.snackbar('Record add')
                        this.back();
                        // this.router.navigate(['masters/scheduler']);
                      };

                    }

                    if (event == 'submit') {
                      if (res.results.data[0].result == "Data added successfully") {
                        this.common.snackbar('Record add')
                        this.back();
                        // this.router.navigate(['masters/scheduler'])
                      }

                    }


                  }
                });

              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))
        }




      }
    });

    // (error) => {
    //   this.loader = false;

    // }



  }


  removeTime(date = new Date()) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
  }


  StartTimeEndTimeGreater() {
    let a: any = this.form.value.starttimerec
    if (a) {
      a = (a.hour * 60 * 60) + (a.minute * 60) + a.second
    }
    let b: any = this.form.value.endtimerec
    if (b) {
      b = (b.hour * 60 * 60) + (b.minute * 60) + b.second
    }

    return a > b ? true : false
  }

}
