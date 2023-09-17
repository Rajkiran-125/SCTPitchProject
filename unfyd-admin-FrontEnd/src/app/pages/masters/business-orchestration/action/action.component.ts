import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  @Input() public apiChecker: FormGroup;
  @Input() public patchValue: any;
  @Input() public otherObj: any;
  @Input() public offlineList: any[];
  userDetails: any;
  responseArray: any[] = [];
  actionGroup: any[] = [];
  subscription: Subscription[] = [];
  group_name: boolean;
  Action_field:any = [];
  offline_list = this.Action_field.slice();
  @Output() actionvalue: EventEmitter<any> = new EventEmitter();
  @Output() addCondition1: EventEmitter<any> = new EventEmitter();
  @Output() removeCondition1: EventEmitter<any> = new EventEmitter();
  userConfig: any;
  labelName: any;
  whom_field:any = [];
  public whom_list = this.whom_field.slice()

  constructor(
    public datepipe: DatePipe,
    private auth: AuthService,
    private api: ApiService,
    private common: CommonService
  ) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();

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
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.whom_field = JSON.parse(data.Whom_list),
          this.whom_list = this.whom_field.slice();
          this.Action_field = JSON.parse(data.Action_field),
          this.offline_list = this.Action_field.slice();
        }
      })
    )
    this.apiChecker.patchValue(this.patchValue);
    this.changeEvent(this.patchValue?.whom)



  };
  setLabelByLanguage(data) {
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'BusinessOrchestration', data)

  }

  formvalue(e) {
    var resArray = this.apiChecker.value.response;

    resArray.forEach(element => {
      if (element.response !== '' && element.field !== '') {
        this.responseArray = resArray
      }
    });
  }

  changeEvent(event) {
    if (event !== '') {
      this.actionGroup = [];
      this.group_name = event !== '' ? true : false;
      if (event == this.whom_list[0].Key) {
        this.getGroups();
      } else if (event == this.whom_list[1].Key) {
        this.getSupervisor();
      } else if (event == this.whom_list[2].Key) {
        this.getSkills();
      }
    }
  }

  getGroups() {
    var query = {
      data: {
        spname: "getdropdowndetails",
        parameters: {
          flag: "GROUP",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      var data = res.results['data'];
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.GroupName, value: element.GroupID })
        });
        this.actionGroup = tempActionGroup
      }
    })
  }

  getSupervisor() {
    var query = {
      data: {
        spname: "agentrouting",
        parameters: {
          ACTIONFLAG: "GET_SUPERVISOR_NAME",
          ProcessId: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      var data: any[] = res.results['data'];
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.UserName, value: element.id })
        });
        this.actionGroup = tempActionGroup
      }
    })
  }

  getSkills() {
    var query = {
      data: {
        spname: "getdropdowndetails",
        parameters: {
          flag: "SKILL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      var data: any[] = res.results['data'];
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.SkillName, value: element.Id })
        });
        this.actionGroup = tempActionGroup
      }
    })
  }

  directUpload(event, max_width, max_height, form_control) {
    var file = event.target.files[0];
    var size = Math.round(file.size / 1024);
    var extension = file.type;
    const formData = new FormData();
    var filename = this.userDetails.Id + 'media' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
    formData.append(filename, file);
    if (size > 2000) {
      this.common.snackbar("File Size");
    }
    else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
      this.common.snackbar("File Type");
    }
    else {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];
          if (img_height > max_height && img_width > max_width) {
            this.common.snackbar("FileReso");
          }
          else {
            this.api.post('upload', formData).subscribe(res => {
              if (res.code == 200) {
                form_control.patchValue(res.results.URL);
              }
            })
          }
        };
      };
      reader.readAsDataURL(file);
    }
  }

  addCondition(i, type){
    this.addCondition1.emit({index: i, type: type});
  }

  removeCondition(i, j, type) {
    this.removeCondition1.emit({parent: i, child: j, type: type});
  }


  formChange() {
    this.apiChecker.valueChanges.subscribe(res => {
      this.actionvalue.emit({group: res, parent: this.otherObj.parent, child: this.otherObj.child});
    })
  }
}

