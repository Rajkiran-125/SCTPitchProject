import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, checknull, checknull1 } from 'src/app/global/json-data';

@Component({
  selector: 'app-flushing',
  templateUrl: './flushing.component.html',
  styleUrls: ['./flushing.component.scss']
})
export class FlushingComponent implements OnInit {

  form: FormGroup;
  @Input() public apiChecker: FormGroup;
  @Input() public patchValue: any;
  @Output() resetbo: any = new EventEmitter<any>();
  time: NgbTimeStruct = { hour: 0, minute: 0, second: 0 };
  subscription: Subscription[] = [];
  userConfig: any;
  labelName: any;
  userDetails: any;



  constructor(
    public datepipe: DatePipe,
    private auth: AuthService,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private common: CommonService
  ) { }

  ngOnInit(): void {
    console.log(this.apiChecker);
    console.log(this.patchValue);
    if(this.patchValue === null){
      this.apiChecker.get('time').patchValue(this.time)
    }

    this.resetbo.emit(true)

    this.userDetails = this.auth.getUser();
    this.apiChecker.patchValue(this.patchValue);
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.common.setUserConfig(this.userDetails.ProfileType, 'BusinessOrchestration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))

  };
  setLabelByLanguage(data) {
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'BusinessOrchestration', data)

  }

  timeChanged(){
    if(this.time !== null){
      this.apiChecker.get('time').patchValue(this.time?.hour+':'+this.time?.minute+':'+this.time?.second)
    }
  }
  reset(){
    if(this.patchValue === null){
      this.apiChecker.get('time').patchValue(this.time)
    }
    this.apiChecker.controls.time.reset()
    this.resetbo.emit(true)
    setTimeout(() => {
      // this.apiChecker.patchValue({ hour: 0, minute: 0, second: 0 })
      this.apiChecker.get('time').patchValue({ hour: 0, minute: 0, second: 0 })
    
    })
  }
  formatTime(time: any): string {
    const hour = time?.hour ? (time.hour > 9 ? time.hour : '0' + time.hour) : '00';
    const minute = time?.minute ? (time.minute > 9 ? time.minute : '0' + time.minute) : '00';
    const second = time?.second ? (time.second > 9 ? time.second : '0' + time.second) : '00';

    return hour + ':' + minute + ':' + second;
  }
}
