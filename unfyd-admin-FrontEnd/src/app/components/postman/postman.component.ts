import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ApiService } from 'src/app/global/api.service';

@Component({
  selector: 'app-postman',
  templateUrl: './postman.component.html',
  styleUrls: ['./postman.component.scss']
})
export class PostmanComponent implements OnInit, OnChanges {
  @Output() returnFormValue = new EventEmitter<string>();
  @Input() postmanData;
  @Input() applyBorder
  form: FormGroup;
  customer_profile: boolean = false;
  token_generation: boolean = false;
  blacklist: boolean = false;
  holiday_business_hour: boolean = false;
  selectedAuthType: any = '';
  request: any;
  requestTab: boolean;
  response: any;
  responseTab: boolean;
  selectedTab: number = 0;
  offline_action = [];
  method: any[] = ['GET', 'POST', 'PUT', 'DELETE'];
  action: any[] = ['Route To', 'End Session', 'Create Task', 'Create Missed Interaction'];
  condition: any[] = ['And', 'Or'];
  add_to: any[] = ['Header', 'Query Params'];
  authType: any[] = ['No Auth', 'API Key', 'Bearer Token'];
  offline_list: any[] = ['End Session', 'Create Task', 'Create Missed Interaction']
  whom_list: any[] = ['Agent Group', 'Supervisor']
  group_list: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private api: ApiService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.postmanData){
      // console.log("this.postmanData :",this.postmanData);
      this.createForm();
      this.postmanData.customer_profile.header.forEach((element,index) => {
        if(index != 0) this.add('customer_profile_header')
      });
      this.postmanData.customer_profile.params.forEach((element,index) => {
        if(index != 0) this.add('customer_profile_params')
      });
      this.postmanData.customer_profile.token_generation.header.forEach((element,index) => {
        if(index != 0) this.add('token_generation')
      });
      // this.postmanData.customer_profile.header.forEach((element,index) => {
      //   if(index != 0) this.add('customer_profile_header')
      // });
      if(this.postmanData?.customer_profile?.auth?.type){
        this.authTypeChange(this.postmanData?.customer_profile?.auth?.type)
      }
      this.request =
        this.form.patchValue(this.postmanData)
    }else{
      this.createForm()
      this.formChange()      
      this.authTypeChange('No Auth')
    }
  }

  ngOnInit(): void {
    this.formChange()
    // console.log(this.form);
    // console.log(this.form.get('customer_profile'));
    let a = JSON.parse(JSON.stringify(this.form.value.customer_profile.api))
    this.form.get('customer_profile')['controls']['api'].patchValue('')
    this.form.get('customer_profile')['controls']['api'].patchValue(a)
  };

  createForm() {
    this.form = this.fb.group({
      customer_profile: this.fb.group({
        api: ['', Validators.nullValidator],
        method: ['', Validators.nullValidator],
        body: ['', Validators.nullValidator],
        header: this.fb.array([this.createHeader()]),
        params: this.fb.array([this.createHeader()]),
        auth: this.fb.group({
          type: ['', Validators.nullValidator]
        }),
        token_generation: this.fb.group({
          isTrue: [false],
          api: ['', Validators.nullValidator],
          method: ['', Validators.nullValidator],
          body: ['', Validators.nullValidator],
          header: this.fb.array([this.createHeader()])
        })
      }),
    })

  }

  get cph() { return this.form.get('customer_profile').get('header') as FormArray; }
  get cpp() { return this.form.get('customer_profile').get('params') as FormArray; }
  get cptgh() { return this.form.get('customer_profile')['controls']['token_generation'].get('header') as FormArray; }

  createHeader(): FormGroup {
    return this.fb.group({
      key: ['', Validators.nullValidator],
      value: ''
    });
  }

  get cpr() { return this.form.get('customer_profile').get('response') as FormArray; }

  createResponse(): FormGroup {
    return this.fb.group({
      field: '',
      response: ''
    });
  }

  get chbh() { return this.form.get('holiday_business_hour').get('action') as FormArray; }

  createAction(): FormGroup {
    return this.fb.group({
      offline_action: '',
      action: '',
      whom: '',
      group: '',
    });
  }

  get crc() { return this.form.get('routing_condition') as FormArray; }

  createRoutingCondition(): FormGroup {
    return this.fb.group({
      name: '',
      condition: this.fb.array([this.createCondition()]),
      action: '',
      whom: '',
      group: '',
      flushing: this.fb.group({
        isTrue: false,
      }),
    });
  }

  conditionObj(i): FormArray {
    return this.form.get('routing_condition')['at'](i).get('condition') as FormArray
  }

  createCondition(): FormGroup {
    return this.fb.group({
      field: '',
      condition: '',
      value: '',
      additional_condition: ''
    })
  }

  add(type) {
    if (type == 'customer_profile_header') {
      this.cph.push(this.createHeader());
    } else if (type == 'customer_profile_params') {
      this.cpp.push(this.createHeader());
    } else if (type == 'customer_profile_response') {
      this.cpr.push(this.createResponse());
    } else if (type == 'token_generation') {
      this.cptgh.push(this.createHeader());
    } else if (type == 'holiday_business_hour_action') {
      this.chbh.push(this.createAction());
    } else if (type == 'routing_condition') {
      this.crc.push(this.createRoutingCondition());
    }
  }

  remove(i, type) {
    if (type == 'customer_profile_header') {
      this.cph.removeAt(i);
    } else if (type == 'customer_profile_params') {
      this.cpp.removeAt(i);
    } else if (type == 'customer_profile_response') {
      this.cpr.removeAt(i);
    } else if (type == 'token_generation') {
      this.cptgh.removeAt(i);
    } else if (type == 'holiday_business_hour_action') {
      this.chbh.removeAt(i);
    } else if (type == 'routing_condition') {
      this.crc.removeAt(i);
    }
  }

  addCondition(i) {
    this.conditionObj(i).push(this.createCondition());
  }

  removeCondition(i, j) {
    this.conditionObj(i).removeAt(j);
  }

  toggle(event, type) {
    if (type == 'customer_profile') {
      this.customer_profile = event;
    } else if (type == 'token_generation') {
      this.token_generation = event;
    } else if (type == 'blacklist') {
      this.blacklist = event;
    } else if (type == 'holiday_business_hour') {
      this.holiday_business_hour = event;
    }
  }

  offlineActionChange(index) {
    this.offline_action[index] = true
  }

  authTypeChange(event) {
    this.selectedAuthType = event;
    var authGroup = (this.form.get("customer_profile") as FormGroup).get("auth") as FormGroup;
    if (this.selectedAuthType == this.authType[0]) {
      authGroup.removeControl("key");
      authGroup.removeControl("value");
      authGroup.removeControl("add_to");
      authGroup.removeControl("token");
    } else if (this.selectedAuthType == this.authType[1]) {
      authGroup.addControl("key", new FormControl(''));
      authGroup.addControl("value", new FormControl(''));
      authGroup.addControl("add_to", new FormControl(''));
      authGroup.removeControl("token");
    } else if (this.selectedAuthType == this.authType[2]) {
      authGroup.removeControl("key");
      authGroup.removeControl("value");
      authGroup.removeControl("add_to");
      authGroup.addControl("token", new FormControl(''));
    }
  }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      // console.log(this.form.value);
    }
  }

  formChange() {
    this.form.valueChanges.subscribe(res => {
      // console.log("changes:",res);

      var customerProfileValue = this.form.controls['customer_profile'].value;

      var paramsArray = [];
      customerProfileValue.params.forEach(element => {
        if (element.key !== '' && element.value !== '') {
          paramsArray.push(element.key + '=' + element.value);
        }
      });
      if (this.selectedAuthType == this.authType[1] && (customerProfileValue.auth.add_to !== undefined && customerProfileValue.auth.add_to !== '')) {
        if (customerProfileValue.auth.key !== '' && customerProfileValue.auth.value !== '') {
          if (customerProfileValue.auth.add_to == this.add_to[1]) {
            paramsArray.push(customerProfileValue.auth.key + '=' + customerProfileValue.auth.value);
          }
        }
      }
      var paramsArrayString = paramsArray.join().split(',').join('&');

      var headerArray = [];

      customerProfileValue.header.forEach(element => {
        if (element.key !== '' && element.value !== '') {
          headerArray.push({ [element.key]: element.value });
        }
      });

      if (this.selectedAuthType == this.authType[1] && (customerProfileValue.auth.add_to !== undefined && customerProfileValue.auth.add_to !== '')) {
        if (customerProfileValue.auth.key !== '' && customerProfileValue.auth.value !== '') {
          if (customerProfileValue.auth.add_to == this.add_to[0]) {
            headerArray.push({ [customerProfileValue.auth.key]: customerProfileValue.auth.value })
          }
        }
      }
      if (this.selectedAuthType == this.authType[2] && (customerProfileValue.auth.token !== undefined && customerProfileValue.auth.token !== '')) {
        headerArray.push({ Authorization: 'Bearer ' + customerProfileValue.auth.token })
      }
      let finalheaderObject: any = {};
      for (let i = 0; i < headerArray.length; i++) {
        Object.assign(finalheaderObject, headerArray[i]);
      }

      var header = headerArray.length > 0 ? { header: finalheaderObject } : {};

      var url = customerProfileValue.api !== '' ? { url: paramsArray.length > 0 ? customerProfileValue.api + '?' + paramsArrayString : customerProfileValue.api } : {};

      var method = customerProfileValue.method !== '' ? { method: customerProfileValue.method } : {};

      var body = customerProfileValue.body !== '' ? { body: customerProfileValue.body } : {};

      this.request = {
        ...method,
        ...url,
        ...header,
        ...body
      }
      this.requestTab = Object.keys(this.request).length === 0 ? true : false;
      this.addNewItem()
    })
  }

  checkApi() {
    let httpOptions = {
      headers: new HttpHeaders(this.request.header !== undefined ? { ...this.request.header } : {})
    };
    let bodyObject = (this.request.body !== '' && this.request.body !== undefined) ? this.request.body.split('\n').join('') : this.request.body;

    if (this.request.method == this.method[0]) {
      this.api.getPostmanMethod(this.request.url, bodyObject).subscribe(res => {
        this.response = res;
      })
    } else if (this.request.method == this.method[1]) {
      this.api.postPostmanMethod(this.request.url, bodyObject, httpOptions).subscribe(res => {
        this.response = res;
      })
    } else if (this.request.method == this.method[2]) {
      this.api.putPostmanMethod(this.request.url, 2, bodyObject, httpOptions).subscribe(res => {
        this.response = res;
      })
    } else if (this.request.method == this.method[3]) {
      this.api.deletePostmanMethod(this.request.url, 2).subscribe(res => {
        this.response = res;
      })
    }
    this.responseTab = true;
    this.selectedTab = 5;
  }

  onTabChanged(event: MatTabChangeEvent) {
    var index = event.index
    this.selectedTab = index;
    if (index !== 5) {
      this.responseTab = false;
    }
  }

  // getMethod(url, body): Observable<any> {
  //   return this.http.get(url, body);
  // }

  // postMethod(url, body, header): Observable<Object> {
  //   return this.http.post(url, body, header);
  // }

  // putMethod(url, id, body, header): Observable<Object> {
  //   return this.http.put(url + '/' + id, body, header);
  // }

  // deleteMethod(url, id): Observable<any> {
  //   return this.http.delete(url + '/' + id);
  // }

  addNewItem() {
    this.returnFormValue.emit(this.form.value);
  }

}
