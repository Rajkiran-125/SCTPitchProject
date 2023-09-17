import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CommonService } from 'src/app/global/common.service';
import { letterSpacing } from 'html2canvas/dist/types/css/property-descriptors/letter-spacing';



@Component({
  selector: 'app-api-module',
  templateUrl: './api-module.component.html',
  styleUrls: ['./api-module.component.scss']
})
export class ApiModuleComponent implements OnInit, OnChanges {

  apiChecker: FormGroup
  @Output() formvalue: EventEmitter<any> = new EventEmitter()
  @Output() formval2: EventEmitter<any> = new EventEmitter()
  @Output() formval3: EventEmitter<any> = new EventEmitter()
  @Output() resetformvalue = new EventEmitter<any>();
  @Input() control: any;
  @Input() formControls: any[];
  @Input() formControlsList: any[];
  @Input() APICallAfterChange = false;
  @Input() module = ''
  @Input() apiConfig :any
  @Input() disabled: boolean = false;
  selectedAuthType: any = '';
  request: any;
  requestTab: boolean;
  response: any;
  externalresponse: any;
  responseTab: boolean;
  responseOnAdd: boolean = true;
  response1: any;
  responseTab1: boolean;
  selectedTab: number = 0;
  method: any[] = ['GET', 'POST', 'PUT', 'DELETE'];
  add_to: any[] = ['Header', 'Query Params'];
  authType: any[] = ['No Auth', 'API Key', 'Bearer Token'];
  subscription: Subscription[] = [];
  showRequestBodyValidation: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private common: CommonService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnChanges() {
    console.log("form:apiChecker:",this.apiChecker),
    console.log("item:control:",this.control)
    console.log("returnControlLists():formControls:",this.formControls);

    // this.patchFormValue(JSON.parse(JSON.stringify(this.control)));
  }

  ngOnInit(): void {
    this.apiChecker = this.formBuilder.group({
      api: ['', Validators.nullValidator],
      method: ['', Validators.nullValidator],
      body: this.formBuilder.array([this.createBody()]),
      Format: ['', Validators.nullValidator],
      header: this.formBuilder.array([this.createHeader()]),
      params: this.formBuilder.array([this.createHeader()]),
      auth: this.formBuilder.group({ type: ['', Validators.nullValidator] }),
      response_format: ['', Validators.nullValidator],
      response: this.formBuilder.array([this.createResponse()]),
      type: ['Dynamic', Validators.nullValidator],
      patchResponseToDropdownOption: [false, Validators.nullValidator],
      patchDropdowns: this.formBuilder.array([this.createPatchList()]),
    });

    if (this.module === 'externalApp') {
      this.apiChecker.addControl('responseValue', this.formBuilder.control('', Validators.nullValidator));
      this.apiChecker.controls['responseValue'].disable()
    }
    
    this.common.reset$.subscribe(() => {
      this.resetForm();
    });

    
    this.formChange();
    if (this.control) {
      if(this.module == 'taskGroup'){
        if(this.apiConfig){
          this.apiConfig?.header.forEach((element11,index) => {
            if(index != 0) this.add('customer_profile_header')
          });
          this.apiConfig?.params.forEach((element11,index) => {
            if(index != 0) this.add('customer_profile_params')
          });
          this.apiChecker.patchValue(this.apiConfig)
          this.apiChecker.updateValueAndValidity()
        }
        // this.patchFormValue(JSON.parse(JSON.stringify(this.apiConfig ? this.apiConfig : this.control)),this.control.type);
      }else if(this.module == 'externalApp'){
        if(this.control){
          this.control?.header.forEach((element11,index) => {
            if(index != 0) this.add('customer_profile_header')
          });
          this.control?.params.forEach((element11,index) => {
            if(index != 0) this.add('customer_profile_params')
          });
          this.control?.response.forEach((element11,index) => {
            if(index != 0) this.add('customer_profile_response')
          });
          if(this.control?.auth.type) this.authTypeChange(this.control?.auth.type)
          setTimeout(() => {
            this.apiChecker.get('auth').patchValue(this.control?.auth);
          });

          this.responseOnAdd = false
          // this.apiChecker.controls['responseValue'].patchValue(JSON.stringify(this.control?.responseValue))
          if(this.control?.responseValue){
            this.response = JSON.parse(this.control?.responseValue)
          }

          // this.externalresponse = this.control?.responseValue
          this.apiChecker.patchValue(this.control)
          this.apiChecker.updateValueAndValidity()
          
        }
       
        // this.patchFormValue(JSON.parse(JSON.stringify(this.apiConfig ? this.apiConfig : this.control)),this.control.type);
      }else if(this.APICallAfterChange){
        this.patchFormValue(JSON.parse(JSON.stringify(this.control.APICallAfterChangeConfig)),this.control.type);
      }else{
        this.patchFormValue(JSON.parse(JSON.stringify(this.control)),this.control.type);
      }
    }
    this.subscription.push(this.common.sendApiData$.subscribe(data => {
      if (data.status == true) {
        if(this.APICallAfterChange){
          this.response1 = data.data;
          this.responseTab1 = true;
        }else{
          this.response = data.data;
          this.responseTab = true;
        }
        this.selectedTab = 5;
      }
    }));
  };

  resetForm() {
    this.apiChecker.reset(); // Reset the form
    this.cpp.clear();
    this.cpp.push(this.createHeader());
    this.cph.clear();
    this.cph.push(this.createHeader());
    this.cpr.clear();
    this.cpr.push(this.createResponse());
  }
  

  patchFormValue(patchValue,type) {
    console.log("patchValue:",patchValue,":",type);

    this.apiChecker.get('Format').patchValue(patchValue?.Format);
    this.apiChecker.get('method').patchValue(patchValue?.APIMETHOD);
    this.apiChecker.get('api').patchValue(patchValue?.APIURL);
    this.apiChecker.get('patchResponseToDropdownOption').patchValue(patchValue?.patchResponseToDropdownOption);
    if(patchValue?.buttonAuth?.type) this.authTypeChange(patchValue?.buttonAuth?.type)
    setTimeout(() => {
      this.apiChecker.get('auth').patchValue(patchValue?.buttonAuth);
    });

    this.apiChecker.get('response_format').patchValue(patchValue?.FormatResponse);
    for (let i = 0; i < patchValue?.buttonHeaders?.length; i++) {
      this.remove(i, 'customer_profile_header')
    }
    for (let i = 0; i < patchValue?.buttonHeaders?.length; i++) {
      if(patchValue?.buttonHeaders[i]?.key && patchValue?.buttonHeaders[i]?.value) this.add('customer_profile_header');
    }
    if(patchValue?.buttonHeaders?.length > 0){
      patchValue?.buttonHeaders.forEach((element, index) => {
        if(element?.key && element?.value){
          (this.cph.at(index) as FormGroup).get('key').patchValue(element?.key);
          (this.cph.at(index) as FormGroup).get('value').patchValue(element?.value);
        }
      });
    }

    for (let i = 1; i < patchValue?.buttonBody?.length; i++) {
      this.add('body');
    }
    if(patchValue?.buttonBody?.length > 0){
      patchValue?.buttonBody.forEach((element, index) => {
        (this.cpb.at(index) as FormGroup).get('Key').patchValue(element?.Key);
        (this.cpb.at(index) as FormGroup).get('Value').patchValue(element?.Value);
      });
    }
    // if (type === 'list') {
    //   (this.cpr.at(0) as FormGroup).get('field').patchValue(patchValue?.Key);
    //   (this.cpr.at(0) as FormGroup).get('response').patchValue(patchValue?.Value);
    // } else
    // if (type === 'button' || type === 'list') {
      if(patchValue?.PatchControl){
        for (let i = 1; i < patchValue?.PatchControl.length; i++) {
          this.add('customer_profile_response');
        }
        patchValue?.PatchControl.forEach((element, index) => {
          (this.cpr.at(index) as FormGroup).get('field').patchValue(element?.field);
          (this.cpr.at(index) as FormGroup).get('response').patchValue(element?.response);
        });
      }
    // }
    for (let i = 1; i < patchValue?.patchDropdowns?.length; i++) {
      if(patchValue?.patchDropdowns[i]?.field && patchValue?.patchDropdowns[i]?.key && patchValue?.patchDropdowns[i]?.value) this.add('customer_profile_patchDropdowns');
    }
    if(patchValue?.patchDropdowns?.length > 0){
      patchValue?.patchDropdowns.forEach((element, index) => {
        if(element.field && element?.key && element?.value){
          (this.cpdo.at(index) as FormGroup).get('key').patchValue(element?.key);
          (this.cpdo.at(index) as FormGroup).get('value').patchValue(element?.value);
          (this.cpdo.at(index) as FormGroup).get('field').patchValue(element?.field);
        }
      });
    }
    this.apiChecker.updateValueAndValidity();
  }

  get cph() { return this.apiChecker.get('header') as FormArray; }
  get cpp() { return this.apiChecker.get('params') as FormArray; }
  get cpr() { return this.apiChecker.get('response') as FormArray; }
  get cpb() { return this.apiChecker.get('body') as FormArray; }
  get cpdo() { return this.apiChecker.get('patchDropdowns') as FormArray; }

  createBody(): FormGroup {
    return this.fb.group({
      Key: ['', Validators.nullValidator],
      Value: ''
    });
  }

  createHeader(): FormGroup {
    return this.fb.group({
      key: ['', Validators.nullValidator],
      value: ''
    });
  }

  createResponse(): FormGroup {
    return this.fb.group({
      field: '',
      response: ''
    });
  }

  createPatchList(): FormGroup {
    return this.fb.group({
      field: '',
      key: '',
      value: ''
    });
  }

  add(type) {
    if (this.disabled) {
      return; // Exit the function if disabled is true
    }
    if (type == 'customer_profile_header') {
      this.cph.push(this.createHeader());
    } else if (type == 'customer_profile_params') {
      this.cpp.push(this.createHeader());
    } else if (type == 'customer_profile_response') {
      this.cpr.push(this.createResponse());
    } else if (type == 'body') {
      this.cpb.push(this.createBody());
    } else if (type == 'customer_profile_patchDropdowns') {
      this.cpdo.push(this.createPatchList());
    }
  }

  remove(i, type) {
    if (this.disabled) {
      return; // Exit the function if disabled is true
    }
    if (type == 'customer_profile_header') {
      this.cph.removeAt(i);
    } else if (type == 'customer_profile_params') {
      this.cpp.removeAt(i);
    } else if (type == 'customer_profile_response') {
      this.cpr.removeAt(i);
    } else if (type == 'body') {
      this.cpb.removeAt(i);
    }  else if (type == 'customer_profile_patchDropdowns') {
      this.cpdo.removeAt(i);
    }
  }

  authTypeChange(event) {
    this.selectedAuthType = event;
    var authGroup = this.apiChecker.get("auth") as FormGroup;
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


  formChange() {
    this.apiChecker.valueChanges.subscribe(res => {
      var customerProfileValue = this.apiChecker.value;
      // console.log("customerProfileValue:",customerProfileValue);

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

      customerProfileValue.item = this.apiChecker.value.type == 'Dynamic' ? this.control : undefined;

      this.request = {
        ...method,
        ...url,
        ...header,
        ...body
      }
      this.requestTab = Object.keys(this.request).length === 0 ? true : false;

      this.formvalue.emit(customerProfileValue);
      this.formval2.emit(customerProfileValue);
      this.formval3.emit(customerProfileValue);

      // console.log(this.cpr.value);


    })
  }

  token = localStorage.getItem('authtoken') ? localStorage.getItem('authtoken') : ''
  ObjectKeys = Object.keys
  checkApi() {
    if (this.disabled) {
      return; // Exit the function if disabled is true
    }
    if(this.module == 'taskGroup' || this.module == 'externalApp'){
      let element = {...this.apiChecker.value}
      let objPattern: any = {};
      let auth :any= {}
      let method: any;
      let apiUrl: any;
      let headers = [];
      let objKey, objValue = [];
      let format: any;
      let patchControl: any;
      let disable: boolean;
      let responseFormat: any;
      objKey = Object.keys(objPattern);
      objValue = Object.values(objPattern);
      method = element.method;
      apiUrl = element.api;
      auth = element.auth
      headers = element.header;
      format = element.Format;
      disable = element.FormDisable;
      patchControl = element.PatchControl;
      responseFormat = element.FormatResponse;
      let headerObj = {};
      // auth.forEach(element => {
        if(auth.type == 'Bearer Token'){
          headerObj['Authorization'] = auth.token == "$token$" ? ('Bearer '+this.token) : ('Bearer '+auth.token)
        }else if(auth.type == 'API Key'){
          if(auth.add_to == 'Query Params'){
            if(auth.key !== null && auth.key !== undefined && auth.key !== '' && auth.key.trim() !== '' &&
            auth.value !== null && auth.value !== undefined && auth.value !== '' && auth.value.trim() !== '')
            apiUrl = apiUrl+ '?'+auth.key+'='+auth.value
          }else if(auth.add_to == 'Header'){
            if(auth.key !== null && auth.key !== undefined && auth.key !== '' && auth.key.trim() !== '' &&
              auth.value !== null && auth.value !== undefined && auth.value !== '' && auth.value.trim() !== '')
            headerObj[auth.key] = auth.value
          }
        }
      // });
      headers.forEach(element => {
        if(element.key && this.common.checkTruthyValue(element.key) && element.value && this.common.checkTruthyValue(element.value))
        headerObj[element.key] = element.value == "$token$" ? ('Bearer '+this.token) : element.value
      });
      let httpOptions = {
        headers: {...headerObj}
      }
      let reqObj = {};
      objValue.forEach((element, index) => {
        // this.item.forEach(obj => {
        //   if (element == obj.label || element == obj.formControlName) {
        //     let key = objKey[index];
        //     reqObj[key] = this.form.value[obj.formControlName]
        //   }
        // });
      });
      if (method.toLowerCase() == 'post') {
        let obj = ''
        let parseObj = {}
        try{
        obj = format.replace('"${body}"', element.body.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));
        parseObj  = JSON.parse(obj)
        }catch(error){
          console.log(error)
        }
        this.postMethod(apiUrl, parseObj, (headers.length > 0 || this.ObjectKeys(headerObj).length > 0) ? httpOptions : null).subscribe(res123 => {console.log("res123:",res123); this.response = res123; this.apiChecker.controls.responseValue.patchValue(JSON.stringify(res123))}, error => this.response = undefined)
      } else if (method.toLowerCase() == 'get'){
        this.getMethod(apiUrl, (headers.length > 0 || this.ObjectKeys(headerObj).length > 0) ? httpOptions : null).subscribe(res123 => {console.log("res123:",res123); this.response = res123; this.apiChecker.controls.responseValue.patchValue(JSON.stringify(res123))}, error => this.response = undefined)
      }
    } else if (this.apiChecker.value.type !== 'Dynamic') {
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
    } else if (this.apiChecker.value.type === 'Dynamic') {
      this.common.setApiData(true, this.control.label);
    }
    this.responseTab = true;
    this.selectedTab = 5;

  }

  showValidation(): boolean {
    let status = false;
    if (!this.apiChecker.value.Format) {
      this.showRequestBodyValidation = false;
      status = false;
    } else if (JSON.stringify(this.apiChecker.value?.Format).includes('${body}')) {
      status = false;
    } else {
      this.showRequestBodyValidation = true;
      status = true;
    }
    return status;
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}
