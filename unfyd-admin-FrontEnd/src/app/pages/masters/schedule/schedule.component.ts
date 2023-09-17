import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { data } from 'jquery';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { checknull, checknull1, regex } from 'src/app/global/json-data';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  form: FormGroup;
  loader: boolean = false;
  actionname: any;
  actionTab: any;
  secondactionTab: any;
  userConfig: any;
  DailyCount:  number = 1;
  WeekDailyCount:  number = 1;
  MonthInterval:  number = 1;
  DailyCountSec: number = 1;
  ThirdDailyCount: number = 1;
  SecDailyCount: number = 1;
  SelectDailyCountSec: number = 24;//HOURS

  weekdays = [
    {name: 'Monday', selected: false},
    {name: 'Tuesday', selected: false},
    {name: 'Wednesday', selected: false},
    {name: 'Thursday', selected: false},
    {name: 'Friday', selected: false},
    {name: 'Saturday', selected: false},
    {name: 'Sunday', selected: false}
  ];
  DayNum = ["First", "Second", "Third", "Fourth","Fifth"];
  SelectTime = ["Hour","Minute"]
  firstactionTab: any;
  firstactionname: any;
  secondactionname: any;
  reset: boolean;
  thirdactionTab: any;
  thirdactionname: any;
  todayDate: Date = new Date();
  ActionRequired: boolean =false;
  SecActionRequired: boolean =false;
  ThirdActionRequired: boolean =false;
  Id: string;
  requestObj: any;
  userDetails: any;
  IsNoEndDate: boolean=false;
  IsDateGreater: boolean=false;
  weekdayNotSelected: boolean=false;
  SelectTime1: boolean=false;
  SelectTime2: boolean=false;
  SelectTime3: boolean=false;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  configdata = { hour:0,minute:0,second:0};
  configdataStart = { hour:0,minute:0,second:0};
  configdataEnd = { hour:0,minute:0,second:0};
  labelName: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private api: ApiService,
  private datePipe: DatePipe,
  private el: ElementRef,
  private common: CommonService,
  private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    console.log('userDetails',this.userDetails);

    this.form = this.formBuilder.group({
      Name: ['', [Validators.pattern(regex.alphabet), Validators.required]],
      StartDate: ['',  Validators.required],
      EndDate: ['',  Validators.required],
      NewDate: ['',  Validators.required],
      Description: ['', [Validators.nullValidator, Validators.maxLength(300)]],
      action: ['Daily', Validators.required],
      secondaction: ['', Validators.required],
      thirdaction: ['Start and End Date', Validators.required],
      startTime: ['',  Validators.required],
      endTime: ['',  Validators.required],
      Hours: ['',  Validators.required],
      RomanNum: ['',  Validators.required],
      Weeks: ['',  Validators.required],
      OccurAction:['Occurs once at',  Validators.required],
    },
    { validator: [checknull('Name'), checknull1('Name'), checknull('Description'), checknull1('Description')] });


    this.ActionRequired = false;
    this.actionTab = 'Daily'
    this.actionname = 'Daily'

    this.SecActionRequired = false
    this.secondactionTab = 'Occurs once at'
    this.secondactionname = 'Occurs once at'

    this.ThirdActionRequired = false
    this.thirdactionTab = 'Start and End Date'
    this.thirdactionname = 'Start and End Date'
    this.IsNoEndDate = false;

    this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('this.Id',this.Id);

    this.form.patchValue({secondaction:"Day"})
    this.firstactionTab = 'Day'
    this.firstactionname = 'Day'

    this.form.controls.Hours.patchValue(this.SelectTime[0])
    this.form.controls.RomanNum.patchValue(this.DayNum[0])
    this.form.controls.Weeks.patchValue(this.weekdays[0].name)


    if(this.Id){
      this.GetScheduleData()
    }

    this.common.setUserConfig(this.userDetails.ProfileType, 'schedule');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.SummaryDescription()
  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
        console.log(this.labelName,this.labelName)
        console.log(data1,"data1")
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'schedule', data)

  }

  back(){
    this.router.navigate(['masters/schedules']);
  }

  actions(e){
    this.ActionRequired = false;
    this.actionTab = e.value;
    this.actionname = e.value == 'Daily' || e.value == 'Weekly' || e.value == 'Monthly' ? e.value : '';

  }

  firstactions(e){
    this.firstactionTab = e.value;
    this.firstactionname = e.value == 'Day' || e.value == 'The'? e.value : '';

    // if(e.value == "Day")
    // {
    //   this.form.get('RomanNum').reset();
    //   this.form.get('Weeks').reset();
    //   this.SecDailyCount = 0
    // }
    // else{
    //   this.MonthInterval = 0;
    //   this.ThirdDailyCount = 0
    // }

  }

  secondactions(e){
    this.SecActionRequired = false
    this.secondactionTab = e.value;
    this.secondactionname = e.value == 'Occurs once at' || e.value == 'Occurs Every'? e.value : '';

    this.SelectTime1 =false;
    this.SelectTime2 =false;
    this.SelectTime3 =false;
    // if(e.value == 'Occurs once at' )
    // {
    //   this.DailyCountSec = 0
    //   this.form.get('Hours').reset();
    //   this.form.get('startTime').reset();
    //   this.form.get('endTime').reset();
    //   this.configdataStart = undefined;
    //   this.configdataEnd = undefined;
    // }else{
    //   this.configdata = undefined;
    // }

  }

 thirdactions(e){
  this.ThirdActionRequired = false
    this.thirdactionTab = e.value;
    this.thirdactionname = e.value == 'Start and End Date' || e.value == 'No End Date'? e.value : '';
    // if(e.value == 'Start and End Date')
    // {
    //   this.IsNoEndDate = false;
    //   this.form.get('StartDate').reset();
    //   this.form.get('EndDate').reset();
    // }
    // else{
    //   this.IsNoEndDate = true;
    //   this.form.get('NewDate').reset();
    // }


  }

  WeekSelectFalse(){
    this.weekdayNotSelected = false;
  }
  SelectTime1False(){
    this.SelectTime1 = false;
  }
  SelectTime2False(){
    this.SelectTime2 = false;
  }

  SelectTime3False(){
    this.SelectTime3 = false;
  }

  IsDateGreaterFalse(){
    this.IsDateGreater=false;
  }



  GetScheduleData()
  {
    this.loader = true;

  this.requestObj = {
    data: {
      spname: "usp_unfyd_schedule",
      parameters: {
        flag: "EDIT",
        Id: this.Id
      }
    }
  }
  this.api.post('index', this.requestObj).subscribe((res: any) => {
    this.loader = false;
    this.reset = true;
    if (res.code == 200) {

        this.form.controls.Name.patchValue(res.results.data[0].ScheduleName)

        this.form.controls.action.patchValue(res.results.data[0].FrequencyType)
        this.ActionRequired = false;
        this.actionTab = res.results.data[0].FrequencyType;
        this.actionname = res.results.data[0].FrequencyType;

        if(res.results.data[0].FrequencyType == 'Daily')
        {
          this.DailyCount = res.results.data[0].DayInterval
        }

        if(res.results.data[0].FrequencyType == 'Weekly')
        {
          this.WeekDailyCount = res.results.data[0].WeekInterval
          let ResWeek = []
          ResWeek = res.results.data[0].WeekDays.split('^')
          console.log('ResWeek',ResWeek);
          ResWeek.forEach( data =>{
              this.weekdays.forEach( data2 =>{
                if(data2.name == data)
                {
                  data2.selected = true;
                }
              })
            })
            console.log('this.weekdays',this.weekdays);
        }

        if(res.results.data[0].FrequencyType == 'Monthly')
        {

          if(res.results.data[0].MonthType == 'The')
          {
            this.form.controls.secondaction.patchValue('The')
            this.firstactionTab = 'The'
            this.firstactionname ='The'
            // == 'Day' || e.value == 'The'? e.value : '';
            this.form.controls.RomanNum.patchValue(res.results.data[0].WeekCycle)
            this.form.controls.Weeks.patchValue(res.results.data[0].WeekDays)
            this.SecDailyCount = res.results.data[0].Months;
          }
          else{
            this.form.controls.secondaction.patchValue('Day')
            this.firstactionTab = 'Day'
            this.firstactionname ='Day'
            this.ThirdDailyCount =  res.results.data[0].Months;
            this.MonthInterval = res.results.data[0].MonthInterval;

          }

        }


        if(res.results.data[0].OccursAt == null || res.results.data[0].OccursAt == undefined || res.results.data[0].OccursAt == '')
        {
          this.form.controls.OccurAction.patchValue('Occurs Every');
        }
        else{
          this.form.controls.OccurAction.patchValue('Occurs once at');
        }

        if(this.form.value.OccurAction == 'Occurs Every')
        {
          this.SecActionRequired = false;
          this.secondactionTab = this.form.value.OccurAction;
          this.secondactionname = this.form.value.OccurAction;
          this.DailyCountSec = res.results.data[0].OccursEvery
          this.form.controls.Hours.patchValue(res.results.data[0].TimeFrame)

          let time = {hour : 0,minute : 0,second : 0}
          let a = res.results.data[0].StartTime.split(":");
          time.hour = parseInt(a[0]);
          time.minute = parseInt(a[1]);
          time.second = parseInt(a[2]);

          this.configdataStart = time

          let time2 = {hour : 0,minute : 0,second : 0}
          let b = res.results.data[0].EndTime.split(":");
          time2.hour = parseInt(b[0]);
          time2.minute = parseInt(b[1]);
          time2.second = parseInt(b[2]);

          this.configdataEnd = time2
        }
        if(this.form.value.OccurAction == 'Occurs once at'){
          let time = {hour : 0,minute : 0,second : 0}
          let a = res.results.data[0].OccursAt.split(":");
          time.hour = parseInt(a[0]);
          time.minute = parseInt(a[1]);
          time.second = parseInt(a[2]);

          this.configdata = time

        }

        if(res.results.data[0].IsNoEndDate == true){
          this.form.controls.thirdaction.patchValue('No End Date')
          this.ThirdActionRequired = false
          this.thirdactionTab ='No End Date'
          this.thirdactionname ='No End Date'

          this.form.controls.NewDate.patchValue(moment(res.results.data[0].StartDate))
          this.todayDate = new Date(res.results.data[0].StartDate);
        }

        if(res.results.data[0].IsNoEndDate == false){
          this.form.controls.thirdaction.patchValue('Start and End Date')
          this.ThirdActionRequired = false
          this.thirdactionTab ='Start and End Date'
          this.thirdactionname ='Start and End Date'

          this.form.controls.StartDate.patchValue(moment(res.results.data[0].StartDate))
          this.form.controls.EndDate.patchValue(moment(res.results.data[0].EndDate))
          this.todayDate = new Date(res.results.data[0].StartDate);
        }

        // this.form.controls.Description.patchValue(res.results.data[0].Summary)
        this.form.updateValueAndValidity();


        this.SummaryDescription()
        }
    })
  }



  SummaryDescription()
  {
    setTimeout(() => {


      let OCCURSATVal:any = this.configdata
      if(this.configdata){
      let hour1 = OCCURSATVal.hour.toString()
      let minute1 = OCCURSATVal.minute.toString()
      let second1 = OCCURSATVal.second.toString()
      OCCURSATVal = hour1.padStart(2,"0") + ":" + (minute1).padStart(2,"0") + ":" + (second1).padStart(2,"0")
      console.log('OCCURSATVal',OCCURSATVal);
      }

      let STARTTIMEVal:any = this.configdataStart
      if(this.configdataStart){
      let hour2 = STARTTIMEVal.hour.toString()
      let minute2 = STARTTIMEVal.minute.toString()
      let second2 = STARTTIMEVal.second.toString()
      STARTTIMEVal = hour2.padStart(2,"0") + ":" + (minute2).padStart(2,"0") + ":" + (second2).padStart(2,"0")
      console.log('STARTTIMEVal',STARTTIMEVal);
      }

      let ENDTIMEVal:any = this.configdataEnd
      if(this.configdataEnd){
      let hour3 = ENDTIMEVal.hour.toString()
      let minute3 = ENDTIMEVal.minute.toString()
      let second3 = ENDTIMEVal.second.toString()
      ENDTIMEVal = hour3.padStart(2,"0") + ":" + (minute3).padStart(2,"0") + ":" + (second3).padStart(2,"0")
      console.log('ENDTIMEVal',ENDTIMEVal);
      }

      let StartDate = new Date(this.form.value.StartDate)
      let StartDateValue = StartDate.getDate().toString().padStart(2,"0") +'-'+(StartDate.getMonth()+1).toString().padStart(2,"0")+'-'+StartDate.getFullYear()
      let Enddate = new Date(this.form.value.EndDate)
      let EnddateValue = Enddate.getDate().toString().padStart(2,"0") +'-'+(Enddate.getMonth()+1).toString().padStart(2,"0") +'-'+Enddate.getFullYear()

      let NoEndDate = new Date(this.form.value.NewDate)
      let NoEndDateValue = NoEndDate.getDate().toString().padStart(2,"0") +'-'+(NoEndDate.getMonth()+1).toString().padStart(2,"0") +'-'+NoEndDate.getFullYear()

      let Counts =  this.form.value.action == 'Daily' ? ' '+this.DailyCount : this.form.value.action == 'Weekly' ? ' '+this.WeekDailyCount : this.form.value.action == 'Monthly'  ? ' '+this.ThirdDailyCount : ''

      var Action = this.form.value.action == 'Daily' ? ' day(s)' : this.form.value.action == 'Weekly' ? ' week(s)' : this.form.value.action == 'Monthly' ? ' month(s)' : ''

      var Duration = ''
      if(this.form.value.thirdaction == 'Start and End Date')
      {
        if(this.form.value.StartDate && this.form.value.EndDate)Duration = `Schedule will be used between ${StartDateValue} and ${EnddateValue}.`
      }
      if(this.form.value.thirdaction == 'No End Date')
      {
        if(this.form.value.NewDate)Duration = `Schedule will be used starting on ${NoEndDateValue}.`        
      }

      let WeeksOrMonths = ''
      if(this.form.value.action == 'Weekly')  
      {
        let arr1 = []
        let arr2 = this.weekdays.filter(weekday => {
          if(weekday.selected){
            arr1.push(weekday.name)
          }})
        if(arr1.length > 0){
          WeeksOrMonths = ' on ' + arr1.join(',')
        }else{
          WeeksOrMonths = ''
        }
      }
      if(this.form.value.action == 'Monthly')  
      {
        if(this.firstactionname == 'Day')WeeksOrMonths = ' on day ' + this.MonthInterval + ' of that month'
        if(this.firstactionname == 'The'){
          WeeksOrMonths = ` ${this.form.value.RomanNum.toLowerCase()} ${this.form.value.Weeks} of every ${this.SecDailyCount} month(s)`
          Counts = ''
          Action = ''
        }
      }

      //final value
      var Desc = ''
      if(this.form.value.OccurAction == 'Occurs once at')
      {
        Desc = `Occurs every${Counts}${Action}${WeeksOrMonths} at ${OCCURSATVal}. ${Duration}`
      } 
      if(this.form.value.OccurAction == 'Occurs Every')
      {
        Desc = `Occurs every${Counts}${Action}${WeeksOrMonths} every ${this.DailyCountSec} ${this.form.value.Hours.toLowerCase()}(s) between ${STARTTIMEVal} and ${ENDTIMEVal}. ${Duration}`
        
      } 


      this.form.controls.Description.patchValue(Desc)  


    });
    
  }

  // var Desc =  this.form.value.OccurAction + this.DailyCount+' days(s) every' +this.DailyCountSec+'hours between'
  // +STARTTIMEVal+'and '
  // +ENDTIMEVal+'. Schedule will be used starting on' + NoEndDateValue

  increment(num) {
    if(this.DailyCount == 1 && num == -1) return
    if(this.DailyCount == 31 && num == +1) return
    this.DailyCount += num;
  }

  Weekincrement(num) {
    if(this.WeekDailyCount == 1 && num == -1) return
    if(this.WeekDailyCount == 48 && num == +1) return
    this.WeekDailyCount += num;
  }

  Monthincrement(num) {
    if(this.MonthInterval == 1 && num == -1) return
    if(this.MonthInterval == 31 && num == +1) return
    this.MonthInterval += num;
  }


  SelectDailyCountSecFunc(format){
    if(format == 'Hour') 
    {
      this.SelectDailyCountSec = 24
      if(this.DailyCountSec > 24 )
      {
        this.DailyCountSec = 24
      }
    }
    if(format == 'Minute') 
    {
      this.SelectDailyCountSec = 60
    }

    
  }
  
  
  secincrement(num) {
    if(this.DailyCountSec == 1 && num == -1) return
    if(this.DailyCountSec == this.SelectDailyCountSec && num == +1) return
    this.DailyCountSec += num;
  }
  Thirdincrement(num) {
    if(this.ThirdDailyCount == 1 && num == -1) return
    if(this.ThirdDailyCount == 12 && num == +1) return
    this.ThirdDailyCount += num;
  }

  initsecincrement(num) {
    if(this.SecDailyCount == 1 && num == -1) return
    if(this.SecDailyCount == 12 && num == +1) return
    this.SecDailyCount += num;
  }

  showSelectedWeekdays() {
    const selectedWeekdays = this.weekdays.filter(weekday => weekday.selected);
    console.log(selectedWeekdays);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  resetfunc(){
    // this.actionname = '';
    // this.secondactionname = '';
    // this.thirdactionname = '';



    this.ActionRequired = false;
    this.actionTab = 'Daily'
    this.actionname = 'Daily'

    this.SecActionRequired = false
    this.secondactionTab = 'Occurs once at'
    this.secondactionname = 'Occurs once at'

    this.ThirdActionRequired = false
    this.thirdactionTab = 'Start and End Date'
    this.thirdactionname = 'Start and End Date'
    this.IsNoEndDate = false;

    setTimeout(() => {
      this.form.controls.action.patchValue('Daily')
      this.form.controls.thirdaction.patchValue('Start and End Date')
      this.form.controls.OccurAction.patchValue('Occurs once at')

      this.form.patchValue({secondaction:"Day"})
      this.firstactionTab = 'Day'
      this.firstactionname = 'Day'

      this.form.controls.Hours.patchValue(this.SelectTime[0])
      this.form.controls.RomanNum.patchValue(this.DayNum[0])
      this.form.controls.Weeks.patchValue(this.weekdays[0].name)
    })

    this.DailyCount= 1;
    this.WeekDailyCount= 1;
    this.MonthInterval= 1;
    this.SecDailyCount= 1;
    this.DailyCountSec= 1;
    this.ThirdDailyCount= 1;
    this.configdataStart = undefined;
    this.configdataEnd = undefined;
    this.configdata = undefined;
    this.SecActionRequired = false
    this.SelectTime1= false
    this.SelectTime2= false
    this.SelectTime3= false
    this.ThirdActionRequired= false
    this.IsDateGreater= false
    this.ActionRequired= false
    this.weekdayNotSelected= false
    this.SecActionRequired= false

    this.weekdays = [
      {name: 'Monday', selected: false},
      {name: 'Tuesday', selected: false},
      {name: 'Wednesday', selected: false},
      {name: 'Thursday', selected: false},
      {name: 'Friday', selected: false},
      {name: 'Saturday', selected: false},
      {name: 'Sunday', selected: false}
    ];

    this.configdata = { hour:0,minute:0,second:0};
    this.configdataStart = { hour:0,minute:0,second:0};
    this.configdataEnd = { hour:0,minute:0,second:0};

  }

  StartTimeEndTimeGreater(){
    let a:any =  this.configdataStart
    if(a){
      a= (a.hour * 60 *60) + (a.minute* 60) + a.second
    }
    let b:any =  this.configdataEnd
    if(b){
      b= (b.hour * 60 *60) + (b.minute* 60) + b.second
    }

    return a >= b ? true : false
  }

  submit(button,formDirective){

    // this.SubmitRadioButton(button);

    this.ValidateFunc(button,formDirective)

    if(this.form.value.action == ("" || null))
    {
    this.loader = false;
    this.ActionRequired = true;
    return;
    }
    if(this.form.value.secondaction == ("" || null))
    {
    this.loader = false;
    this.SecActionRequired = true;
    return;
    }
    if(this.form.value.thirdaction == ("" || null))
    {
    this.loader = false;
    this.ThirdActionRequired = true;
    return;
    }

  }

  ValidateFunc(button,formDirective)
  {

    if (this.form.controls['Name'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'Name' + '"]');
      invalidControl.focus();
      this.form.markAllAsTouched()
      return;
    }

    if (this.form.controls['Description'].invalid) {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'Description' + '"]');
      invalidControl.focus();
      this.form.markAllAsTouched()
      return;
    }

    if(this.form.value.action == 'Weekly')
    {
      let count = 0
      this.weekdays.forEach(data =>{

        if(data.selected == true){
          count++;
        }
      })
      if(count == 0)
      {
        this.weekdayNotSelected = true;
        return
      }
    }

    if(this.form.value.action == 'Monthly')
    {
      if (this.form.controls['RomanNum'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'Description' + '"]');
        invalidControl.focus();
        this.form.markAllAsTouched()
        return;
      }
      if (this.form.controls['Weeks'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'Description' + '"]');
        invalidControl.focus();
        this.form.markAllAsTouched()
        return;
      }


    }



    if(this.form.value.OccurAction == 'Occurs Every')
    {



        if(this.configdataStart == null ||this.configdataStart == undefined)
        {
          this.SelectTime2 =true;
          return
        }
        if(this.configdataEnd == null ||this.configdataEnd == undefined)
        {
          this.SelectTime3 =true;
          return
        }

        let a:any =  this.configdataStart
        if(a){
          a= (a.hour * 60 *60) + (a.minute* 60) + a.second
        }
        let b:any =  this.configdataEnd
        if(b){
          b= (b.hour * 60 *60) + (b.minute* 60) + b.second
        }
        if(a>= b )
        {
          return;
        }
    }

    if(this.form.value.OccurAction == 'Occurs once at')
    {
      if(this.configdata == null ||this.configdata == undefined)
      {
        this.SelectTime1 =true;
        return
      }
    }



    if(this.form.value.thirdaction == 'Start and End Date')
    {

      if (this.form.controls['StartDate'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'StartDate' + '"]');
        invalidControl.focus();
        this.form.markAllAsTouched()
        return;
      }
      if (this.form.controls['EndDate'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'EndDate' + '"]');
        invalidControl.focus();
        this.form.markAllAsTouched()
        return;
      }
       if(this.form.value.StartDate > this.form.value.EndDate)
      {
      this.IsDateGreater = true;
      // this.loader = false;
      return
      }
      else{
        this.IsDateGreater = false;
      }

    }

    if(this.form.value.thirdaction == 'No End Date')
    {
      if (this.form.controls['NewDate'].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'NewDate' + '"]');
        invalidControl.focus();
        this.form.markAllAsTouched()
        return;
      }
    }

    // if (this.form.controls['Description'].invalid) {
    //   const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + 'Description' + '"]');
    //   invalidControl.focus();
    //   this.form.markAllAsTouched()
    //   return;
    // }



    // this.SubmitApi(button)

    this.SubmitRadioButton(button,formDirective);
  }

  SubmitRadioButton(button,formDirective){
        if(this.form.value.action == 'Daily' )
        {
          this.WeekDailyCount = 1
          this.weekdays = [
            {name: 'Monday', selected: false},
            {name: 'Tuesday', selected: false},
            {name: 'Wednesday', selected: false},
            {name: 'Thursday', selected: false},
            {name: 'Friday', selected: false},
            {name: 'Saturday', selected: false},
            {name: 'Sunday', selected: false}
          ];

          this.MonthInterval = 1
          this.ThirdDailyCount = 1
          this.form.get('RomanNum').reset();
          this.form.get('Weeks').reset();
          this.SecDailyCount = 1

        }

        if(this.form.value.action == 'Weekly' )
        {
          this.DailyCount=1
          this.MonthInterval = 1
          this.ThirdDailyCount = 1
          this.form.get('RomanNum').reset();
          this.form.get('Weeks').reset();
          this.SecDailyCount = 1
        }

        if(this.form.value.action == 'Monthly' )
        {
          this.DailyCount=1
          this.WeekDailyCount = 1
          this.weekdays = [
            {name: 'Monday', selected: false},
            {name: 'Tuesday', selected: false},
            {name: 'Wednesday', selected: false},
            {name: 'Thursday', selected: false},
            {name: 'Friday', selected: false},
            {name: 'Saturday', selected: false},
            {name: 'Sunday', selected: false}
          ];
        }



    if(this.form.value.secondaction == "Day")
        {
          this.form.get('RomanNum').reset();
          this.form.get('Weeks').reset();
          this.SecDailyCount = 1
        }
    if(this.form.value.secondaction == "The"){
          this.MonthInterval = 1;
          this.ThirdDailyCount = 1
        }




    if(this.form.value.OccurAction == 'Occurs once at' )
        {
          this.DailyCountSec = 1
          this.form.get('Hours').reset();
          this.form.get('startTime').reset();
          this.form.get('endTime').reset();
          this.configdataStart = undefined;
          this.configdataEnd = undefined;
        }
    if(this.form.value.OccurAction == 'Occurs Every' ){
          this.configdata = undefined;
        }



    if(this.form.value.thirdaction == 'Start and End Date')
        {
          this.IsNoEndDate = false;
          this.form.get('NewDate').reset();
        }
        if(this.form.value.thirdaction == 'No End Date'){
          this.IsNoEndDate = true;
          this.form.get('StartDate').reset();
          this.form.get('EndDate').reset();
        }


    // this.ValidateFunc(button)
    this.SubmitApi(button,formDirective)
  }

  SubmitApi(button,formDirective: FormGroupDirective){

        let OCCURSATVal:any = this.configdata
        if(this.configdata){
        let hour1 = OCCURSATVal.hour.toString()
        let minute1 = OCCURSATVal.minute.toString()
        let second1 = OCCURSATVal.second.toString()
        OCCURSATVal = hour1.padStart(2,"0") + ":" + (minute1).padStart(2,"0") + ":" + (second1).padStart(2,"0")
        console.log('OCCURSATVal',OCCURSATVal);
        }

        let STARTTIMEVal:any = this.configdataStart
        if(this.configdataStart){
        let hour2 = STARTTIMEVal.hour.toString()
        let minute2 = STARTTIMEVal.minute.toString()
        let second2 = STARTTIMEVal.second.toString()
        STARTTIMEVal = hour2.padStart(2,"0") + ":" + (minute2).padStart(2,"0") + ":" + (second2).padStart(2,"0")
        console.log('STARTTIMEVal',STARTTIMEVal);
        }

        let ENDTIMEVal:any = this.configdataEnd
        if(this.configdataEnd){
        let hour3 = ENDTIMEVal.hour.toString()
        let minute3 = ENDTIMEVal.minute.toString()
        let second3 = ENDTIMEVal.second.toString()
        ENDTIMEVal = hour3.padStart(2,"0") + ":" + (minute3).padStart(2,"0") + ":" + (second3).padStart(2,"0")
        console.log('ENDTIMEVal',ENDTIMEVal);
        }


        let weekArr :any;
        let FinalWeekValue;
        if(this.form.value.action == 'Weekly')
        {
          weekArr = []
          this.weekdays.forEach( data =>{
            if(data.selected == true)
            {
              weekArr.push(data.name)
            }
          })
          if(weekArr.length > 1)
          {
          FinalWeekValue = weekArr.join('^');
          }else{
            FinalWeekValue = weekArr[0]
          }
        }
        else{
          FinalWeekValue = this.form.value.Weeks;

        }


        this.loader = true;

            this.requestObj = {
              data: {
                spname: "usp_unfyd_schedule",
                parameters: {
                  flag: this.Id == null ? 'INSERT' : 'UPDATE',
                  ID: this.Id == null ? undefined : this.Id,
                  SCHEDULENAME : this.form.value.Name == null ? null : this.form.value.Name.trim(),
                  FREQUENCYTYPE :  this.form.value.action,
                  DAYINTERVAL :  this.DailyCount,
                  WEEKINTERVAL: this.WeekDailyCount,
                  MONTHINTERVAL : this.MonthInterval,
                  WEEKCYCLE : this.form.value.RomanNum,
                  WEEKDAYS : FinalWeekValue,
                  MONTHS : this.form.value.secondaction == 'Day' ? this.ThirdDailyCount : this.SecDailyCount,
                  OCCURSAT : OCCURSATVal,
                  OCCURSEVERY : this.DailyCountSec,
                  TIMEFRAME : this.form.value.Hours,
                  STARTTIME : STARTTIMEVal,
                  ENDTIME : ENDTIMEVal,
                  ISNOENDDATE : this.IsNoEndDate,
                  ENDDATE: this.form.value.thirdaction == 'Start and End Date' ? this.datePipe.transform(this.form.value.EndDate, 'yyyy-MM-dd HH:mm:ss') : null,
                  STARTDATE:   this.form.value.thirdaction == 'Start and End Date' ? this.datePipe.transform(this.form.value.StartDate, 'yyyy-MM-dd HH:mm:ss') : this.datePipe.transform(this.form.value.NewDate, 'yyyy-MM-dd HH:mm:ss'),
                  SUMMARY : this.form.value.Description == null ? null : this.form.value.Description.trim(),
                  PROCESSID: this.userDetails.Processid,
                  PUBLICIP: this.userDetails.ip,
                  BROWSERNAME: this.userDetails.browser,
                  BROWSERVERSION: this.userDetails.browser_version,
                  CREATEDBY: this.Id == null ? this.userDetails.Id : undefined,
                  MODIFIEDBY: this.Id == null ? undefined : this.userDetails.Id,
                }
              }
            }
            console.log('this.requestObj',this.requestObj);


            this.api.post('index', this.requestObj).subscribe((res: any) => {
              if (res.code == 200) {
                this.loader = false;
                console.log('res',res);

                // if(res.results.data[0].result.includes('already exists'))
                // {
                //   this.common.snackbar('Exists');
                //   this.loader = false;
                //   return;
                // }

                // if(button == 'Save')
                // {
                //   this.router.navigate(['/masters/schedules']);
                //   this.common.snackbar('Record add');
                // }
                // if(button == 'SaveAndAddNew')
                // {
                //   this.common.snackbar('Record add');
                //   this.form.reset();
                //   setTimeout(() =>{
                //     this.resetfunc()
                //     this.form.markAllAsTouched();
                //     this.form.markAsUntouched();
                //   })
                // }




            ////////////////////////////


        this.loader = false;
        if (res.results.data[0].result == 'Data added successfully') {
                if(button == 'Save'){
                  this.common.snackbar('Record add');
                  this.router.navigate(['/masters/schedules']);
                }
                if(button == 'SaveAndAddNew'){
                  this.common.snackbar('Record add');
                  this.form.reset();
                  formDirective.resetForm()

                  setTimeout(() =>{
                    this.resetfunc()
                    this.form.markAllAsTouched();
                    this.form.markAsUntouched();
                  })
                  this.loader = false;
                }
        } else if (res.results.data[0].result.includes('already exists')&& (res.results.data[0].Status == false)) {
                this.common.snackbar('Data Already Exist');
                this.loader = false;
        } else if (res.results.data[0].result == 'Data updated successfully') {
              let obj = {
                "data":{
                        "FLAG" : "UPDATESCHEDULE",
                        "SCHEDULEID":this.Id
                      }
              }
              this.api.post('ScheduleInsertRedis', obj).subscribe((res: any) => {
              })   
                this.common.snackbar('Update Success');
                this.router.navigate(['/masters/schedules']);
        }  else if (res.results.data[0].Status == true)  {

            this.common.confirmationToMakeDefault('AcitvateDeletedData');
            this.subscriptionAcitivateData.push(
                this.common.getIndividualUpload$.subscribe(status => {
              if(status.status){

                // this.loader = true;
                this.requestObj = {
                  data: {
                    spname: "usp_unfyd_schedule",
                    parameters: {
                      flag: 'ACTIVATE',
                      MODIFIEDBY : this.userDetails.Id,
                      SCHEDULENAME: this.form.value.Name,
                      PROCESSID: this.userDetails.Processid,

                    }
                  }
                };

                this.api.post('index', this.requestObj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    if(button == 'Save'){
                      this.router.navigate(['/masters/schedules']);
                    }
                    if(button == 'SaveAndAddNew'){
                      this.form.reset();
                      formDirective.resetForm()

                      setTimeout(() =>{
                        this.resetfunc()
                        this.form.markAllAsTouched();
                        this.form.markAsUntouched();
                      })
                      this.loader = false;
                    }
                  }
                });

            }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
              }))

        }else if((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)){
          this.common.snackbar('Data Already Exist');
          this.loader = false;
        }

            ////////////////////////////
              }
              else
              {
                this.loader = false;
              }
            })

  }

}
