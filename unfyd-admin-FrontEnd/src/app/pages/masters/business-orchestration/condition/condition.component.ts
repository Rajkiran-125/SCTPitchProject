import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit {
  @Input() public apiChecker: FormGroup;
  @Input() public otherObj: any;
  @Input() public patchValue: any;
  @Input() public channelvalue: any
  @Output() conditionvalue: EventEmitter<any> = new EventEmitter();
  @Output() addCondition1: EventEmitter<any> = new EventEmitter();
  @Output() removeCondition1: EventEmitter<any> = new EventEmitter();
  userDetails: any;
  requestObj: any;
  condition: any[] = ['And', 'Or'];
  subscription: Subscription[] = [];
  comparison_conditions: any[] = ['<', '<=', '>', '>=', '==', '===', '!=', '!=='];
  // staticField: any[] = ['Priority', 'Skills', 'Custom', 'Disposition'];
  responseArray: any[] = [];
  dropdown: boolean;
  actionGroup: any[] = [];
  Condition_field:any = [];
  public staticField = this.Condition_field.slice()
  loader: boolean;
  labelName: any;


  constructor(private auth: AuthService, private api: ApiService,
    public common: CommonService) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.formChange()
    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        if (Object.keys(data).length > 0) {
          this.Condition_field = JSON.parse(data.Condition_Field),
          this.staticField = this.Condition_field.slice();
        }
      })
    )
    this.apiChecker.patchValue(this.patchValue);
    this.fieldChange(this.patchValue?.field)

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))

  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'BusinessOrchestration', data)

  }

  fieldChange(event) {
    console.log(this.staticField[0].Key);

    var dropdownCondition = event === this.staticField[0].Key ||event === this.staticField[1].Key || event === this.staticField[2].Key || event === this.staticField[3].Key
    this.dropdown = dropdownCondition ? true : false;
    if (event == this.staticField[0].Key) {
      this.getCacheData();
    } else if (event == this.staticField[1].Key) {
      this.getSkills();
    } else if (event == this.staticField[2].Key) {
      this.getCustom();
    }else if (event == this.staticField[3].Key) {
      this.getDisposition();
    }
  }

  getCacheData() {
    let query = {
      data: {
        spname: "usp_unfyd_adminconfig",
        cachename: "cacheconfig",
        cache: true,
        parameters: {
          flag: "GET_API",
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId,
        },
      },
    };
    this.api.post('cachedata', query).subscribe(res => {
      var cacheArray = res.results.data[0];
      cacheArray.forEach(element => {
        if (element.ConfigName == "NotificationPriority") {
          var data = JSON.parse(element.ConfigValue)
          var tempActionGroup: any[] = [];
          if (data.length > 0) {
            data.forEach(obj => {
              tempActionGroup.push({ label: obj.Key, value: obj.Value })
            });
            this.actionGroup = tempActionGroup
          }
        }
      });
    });
  }

  getSkills() {
    var query = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
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
  getCustom(){
    var query = {
      data: {
        spname: "UNFYD_CONFIG_MANAGER",
        parameters: {
          flag: "GET_CUSTOMERATTRIBUTE_MAPPING",
          processid: this.userDetails.Processid,
          LANGUAGECODE: 'en',
          CHANNELID: this.channelvalue
        }
      }
    }
    this.api.post('index', query).subscribe(res => {
      var data: any[] = res.results['data'];
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.ConfigValue, value: element.ConfigName })
        });
        this.actionGroup = tempActionGroup
      }
    })
  }
  getDisposition() {
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_data_collection_form',
        parameters: {
          flag: 'GET_DISPOSITION',
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      // this.Disposition = res.results['data'];
      var data = res.results['data']
      var tempActionGroup: any[] = [];
      if (data.length > 0) {
        data.forEach(element => {
          tempActionGroup.push({ label: element.Disposition, value: element.Disposition })
        });
        this.actionGroup = tempActionGroup
      }
    })
  }

  addCondition(i, type){
    this.addCondition1.emit({index: i, type: type});
  }

  removeCondition(i, j, type) {
    this.removeCondition1.emit({parent: i, child: j, type: type});
  }


  formChange() {
    this.apiChecker.valueChanges.subscribe(res => {
      this.conditionvalue.emit({group: res, parent: this.otherObj.parent, child: this.otherObj.child});
    })
  }


}
