import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';
import { checknull } from 'src/app/global/json-data';



@Component({
  selector: 'app-api-module',
  templateUrl: './api-module.component.html',
  styleUrls: ['./api-module.component.scss']
})
export class ApiModuleComponent implements OnInit {

  @Input() public apiChecker: FormGroup
  @Input() public patchValue: any
  @Output() formvalue: EventEmitter<any>=new EventEmitter()

  request: any;
  requestTab: boolean;
  response: any;
  responseTab: boolean;
  selectedTab: number = 0;
  method: any[] = ['GET', 'POST', 'PUT', 'DELETE'];
  add_to: any[] = ['Header', 'Query Params'];
  authType: any[] = ['No Auth', 'API Key', 'Bearer Token'];
  subscription: Subscription[] = [];
  userConfig: any;
  labelName: any;
  userDetails: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private http: HttpClient,
    private common: CommonService
  ) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.formChange()

    if(this.patchValue !== undefined && this.patchValue !== null){
      console.log(this.patchValue);

      this.apiChecker.patchValue(this.patchValue)
      this.authTypeChange(this.patchValue.auth.type)

      var header = this.patchValue.header;
      if(header.length>0){
        header.forEach(element => {
          this.cph.push(this.createHeader(element));
        });
      }

      var params = this.patchValue.params;
      if(params.length>0){
        params.forEach(element => {
          this.cpp.push(this.createHeader(element));
        });
      }

      var response = this.patchValue.response;
      if(response.length>0){
        // this.responseTab = true
        response.forEach(element => {
          this.cpr.push(this.createResponse(element));
        });
      }
      if(response.length == 1){
        this.responseTab = (response[0].field == '' && response[0].response == '') ? false : true
      }
    }
    // else {
    //   this.cph.push(this.createHeader());
    //   this.cpp.push(this.createHeader());
    // }
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

  get cph() { return this.apiChecker.get('header') as FormArray; }
  get cpp() { return this.apiChecker.get('params') as FormArray; }
  get cpr() { return this.apiChecker.get('response') as FormArray; }

  createHeader(element?): FormGroup {
    return this.fb.group({
      key: [element ? element.key : '', Validators.nullValidator],
      value: [element ? element.value : '', Validators.nullValidator]
    },{validator:[checknull('key'),checknull('value')]});
  }

  createResponse(element?): FormGroup {
    return this.fb.group({
      field: element ? element.field : '',
      response: element ? element.response :  ''
    });
  }

  add(i, type) {
    console.log(this.apiChecker.value.header);

    // let controlValue = this.apiChecker.get('response')['controls'][i].get('field');
    if (type == 'customer_profile_header') {
      var controlValue = this.apiChecker.value.header[i];
      if(controlValue.key !== '' && controlValue.value !== ''){
        this.cph.push(this.createHeader());
      } else {
        this.common.snackbar('KeyValue' )
      }
    } else if (type == 'customer_profile_params') {
      var controlValue = this.apiChecker.value.params[i];
      if(controlValue.key !== '' && controlValue.value !== ''){
        this.cpp.push(this.createHeader());
      } else {
        this.common.snackbar('KeyValue')
      }
    } else if (type == 'customer_profile_response') {
      var controlValue = this.apiChecker.value.response[i];
      if(controlValue.field !== '' && controlValue.response !== ''){
        this.cpr.push(this.createResponse());
      } else {
        this.common.snackbar('FieldResponse')
      }
    }
  }

  remove(i, type) {
    if (type == 'customer_profile_header') {
      this.cph.removeAt(i);
    } else if (type == 'customer_profile_params') {
      this.cpp.removeAt(i);
    } else if (type == 'customer_profile_response') {
      this.cpr.removeAt(i);
    }
  }

  authTypeChange(event) {
    var authGroup = this.apiChecker.get("auth") as FormGroup;
    if (event == this.authType[0]) {
      authGroup.removeControl("key");
      authGroup.removeControl("value");
      authGroup.removeControl("add_to");
      authGroup.removeControl("token");
    } else if (event == this.authType[1]) {
      authGroup.addControl("key", new FormControl(''));
      authGroup.addControl("value", new FormControl(''));
      authGroup.addControl("add_to", new FormControl(''));
      authGroup.removeControl("token");
    } else if (event == this.authType[2]) {
      authGroup.removeControl("key");
      authGroup.removeControl("value");
      authGroup.removeControl("add_to");
      authGroup.addControl("token", new FormControl(''));
    }
  }


  formChange() {
    this.apiChecker.valueChanges.subscribe(res => {
      var customerProfileValue = this.apiChecker.value;

      var paramsArray = [];
      customerProfileValue.params.forEach(element => {
        if (element.key !== '' && element.value !== '') {
          paramsArray.push(element.key + '=' + element.value);
        }
      });
      if (this.apiChecker.value.auth.type == this.authType[1] && (customerProfileValue.auth.add_to !== undefined && customerProfileValue.auth.add_to !== '')) {
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

      if (this.apiChecker.value.auth.type == this.authType[1] && (customerProfileValue.auth.add_to !== undefined && customerProfileValue.auth.add_to !== '')) {
        if (customerProfileValue.auth.key !== '' && customerProfileValue.auth.value !== '') {
          if (customerProfileValue.auth.add_to == this.add_to[0]) {
            headerArray.push({ [customerProfileValue.auth.key]: customerProfileValue.auth.value })
          }
        }
      }
      if (this.apiChecker.value.auth.type == this.authType[2] && (customerProfileValue.auth.token !== undefined && customerProfileValue.auth.token !== '')) {
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
      this.formvalue.emit(customerProfileValue);

    })
  }

  checkApi() {
    let httpOptions = {
      headers: new HttpHeaders(this.request.header !== undefined ? { ...this.request.header } : {})
    };
    let bodyObject = (this.request.body !== '' && this.request.body !== undefined) ? this.request.body.split('\n').join('') : this.request.body;

    if (this.request.method == this.method[0]) {
      this.getMethod(this.request.url, bodyObject).subscribe(res => {
        this.response = res;
      })
    } else if (this.request.method == this.method[1]) {
      this.postMethod(this.request.url, bodyObject, httpOptions).subscribe(res => {
        this.response = res;
      })
    } else if (this.request.method == this.method[2]) {
      this.putMethod(this.request.url, 2, bodyObject, httpOptions).subscribe(res => {
        this.response = res;
      })
    } else if (this.request.method == this.method[3]) {
      this.deleteMethod(this.request.url, 2).subscribe(res => {
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

  getMethod(url, body): Observable<any> {
    return this.http.get(url, body);
  }

  postMethod(url, body, header): Observable<Object> {
    return this.http.post(url, body, header);
  }

  putMethod(url, id, body, header): Observable<Object> {
    return this.http.put(url + '/' + id, body, header);
  }

  deleteMethod(url, id): Observable<any> {
    return this.http.delete(url + '/' + id);
  }


  reset(){
    this.apiChecker.reset()
    this.cpp.clear()
    this.cph.clear()
    this.cpp.push(this.createHeader())
    this.cph.push(this.createHeader())
    // this.params().clear()
  }

}
