import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, } from '@angular/forms';
import { FormField } from './form-field';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { CommonService } from 'src/app/global/common.service';
import { Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/global/api.service';
const moment = _rollupMoment || _moment;

let a = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/yyyy',
    monthYearLabel: 'DD/MM/yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'LL',
  },
};

function setA(value) {
  a = value;
}

function b() {
  return a;
}

export { a, setA };

export let MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'dd/MM/yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'LL',
  },
};

let initializeKeycloak = (commonService: CommonService) => {
  return a


}

/** @title Datepicker with custom formats */
@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
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
export class FormPreviewComponent implements OnChanges, OnInit {
  @Output() newItemEvent = new EventEmitter<any>();
  @Output() selectedIndex = new EventEmitter<any>();
  ObjectKeys = Object.keys
  subscription: Subscription[] = [];
  token = localStorage.getItem('authtoken') ? localStorage.getItem('authtoken') : ''
  a = [1, 2, 3, 4]
  date = new FormControl(moment());
  formFields = [{ "label": "name", "formControlName": null, "type": null, "mandatory": null, "regularExpression": null, "value": null, "parent": null, "nestedControlOfWhom": null, "nestedControl": null, "listOfValues": [], ATTRSEQUENCE: null, checkValidation:false, checkValidationFormControls:[] }];
  @Input() item = [];
  itemCopy = [];
  form = new FormGroup({});
  parentDropDown = [];
  dateFormats = [];
  senApiData: boolean = false;
  constructor(private formBuilder: FormBuilder, private changeDetector: ChangeDetectorRef, private common: CommonService, private http: HttpClient,private el: ElementRef, public datepipe: DatePipe,private api: ApiService) {
  }

  ngAfterContentChecked(): void {
  }
  ngOnChanges() {
    this.token = localStorage.getItem('authtoken') ? localStorage.getItem('authtoken') : ''
    this.createForm();
  }



  createForm() {
    this.formFields = []
    this.form = new FormGroup({})
    if (this.item.length)
      for (let formField of this.item) {
        if (formField.formControlName != null && formField.formControlName != undefined && formField.formControlName != '' && formField.type != 'button') {
          this.form.addControl(formField.formControlName, new FormControl(formField.value ? formField.value : '', [formField.mandatory ? Validators.required : Validators.nullValidator, formField.regularExpression ? Validators.pattern(formField.regularExpression) : Validators.nullValidator]));
          // this.form.get(formField.formControlName).updateValueAndValidity()
          // this.form.controls[formField.formControlName].markAsTouched()
          // this.form.controls[formField.formControlName].markAsUntouched()
          // this.form.get(formField.formControlName).updateValueAndValidity()
          if (formField.type == 'list' && formField.Dynamic == true) {
            console.log("formField:",formField);
            if (formField.parent != null) {
              formField.listOfValues = [];
            }
            if (formField.REQOBJECT === undefined &&
              (formField.buttonBody[0].Key !== '' && formField.buttonBody[0].Key !== undefined && formField.buttonBody[0].Key !== null)
              && (formField.buttonBody[0].Value !== '' && formField.buttonBody[0].Value !== undefined && formField.buttonBody[0].Value !== null)
            ) {
              let jsonObjectForButton: any = {};
              formField.buttonBody.forEach(obj => {
                Object.assign(jsonObjectForButton, { [obj.Key]: obj.Value });
              });
              formField.REQOBJECT = JSON.stringify(jsonObjectForButton);
            } else if (formField.REQOBJECT === undefined && (formField.buttonBody[0].Key === '' || formField.buttonBody[0].Key === undefined || formField.buttonBody[0].Key === null)
              && (formField.buttonBody[0].Value === '' || formField.buttonBody[0].Value === undefined || formField.buttonBody[0].Value === null)) {
              formField.REQOBJECT = formField.Format;
            }
            let obj = {
              reqObj: formField.REQOBJECT ? JSON.stringify(JSON.parse(formField.REQOBJECT)) : {},
              headers: formField.buttonHeaders,
              format: formField.Format,
              responseFormat: formField.FormatResponse,
              key: formField.Key,
              value: formField.Value,
            };
            let headerObj = {};
            if(formField.buttonAuth && formField.buttonAuth.type == 'Bearer Token'){
              headerObj['Authorization'] = formField.buttonAuth.token == "$token$" ? ('Bearer '+this.token) : ('Bearer '+formField.buttonAuth.token)
            }else if(formField.buttonAuth && formField.buttonAuth.type == 'API Key'){
              if(formField.buttonAuth && formField.buttonAuth.add_to == 'Query Params'){
                if(formField.buttonAuth && formField.buttonAuth.key !== null && formField.buttonAuth.key !== undefined && formField.buttonAuth.key !== '' && formField.buttonAuth.key.trim() !== '' &&
                formField.buttonAuth.value !== null && formField.buttonAuth.value !== undefined && formField.buttonAuth.value !== '' && formField.buttonAuth.value.trim() !== '')
                formField.APIURL = formField.APIURL+ '?'+formField.buttonAuth?.key+'='+formField.buttonAuth?.value
              }else if(formField.buttonAuth && formField.buttonAuth.add_to == 'Header'){
                if(formField.buttonAuth && formField.buttonAuth.key !== null && formField.buttonAuth.key !== undefined && formField.buttonAuth.key !== '' && formField.buttonAuth.key.trim() !== '' &&
                  formField.buttonAuth.value !== null && formField.buttonAuth.value !== undefined && formField.buttonAuth.value !== '' && formField.buttonAuth.value.trim() !== '')
                headerObj[formField.buttonAuth.key] = formField.buttonAuth.value
                // obj.headers.push({[formField.buttonAuth.key]:formField.buttonAuth.value})
              }
            }
            obj.headers.forEach(formField => {
              if(formField.key && formField.value) headerObj[formField.key] = formField.value == "$token$" ?  ('Bearer '+this.token) : formField.value
            });
            let httpOptions = {
              headers: {...headerObj}
            }
            this.apiCall(formField, obj, httpOptions,headerObj);
          }
        }
      }
    this.formChange(this.item);
    this.subscription.push(this.common.localizationDataAvailable$.subscribe((res) => {
      if (res) {
        this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {
          this.form.updateValueAndValidity();
        }))
      }
    }))
    this.formFields = this.item;


  }
  old: any;
  formChange(json) {
    this.old = { ...this.form.value };
    this.subscription.push(this.form.valueChanges.subscribe(res => {
      const key = Object.keys(res).find(k => res[k] != this.old[k]);
      if (key !== undefined) {
        json.forEach(element => {
          if (element.parent === key && element.Dynamic) {
            let requestObj = {};
            requestObj[key] = this.form.get(key).value;
            let obj = {
              reqObj: JSON.stringify(requestObj).replace(/[{}]/g, ''),
              headers: element.buttonHeaders,
              format: element.Format,
              responseFormat: element.FormatResponse,
              key: element.Key,
              value: element.Value,
            };
            let headerObj = {};
            obj.headers.forEach(formField => {
              headerObj[formField.Key] = formField.Value == "$token$" ? ('Bearer '+this.token) : formField.Value
            });
            if(element.buttonAuth.type == 'Bearer Token'){
              headerObj['element.buttonAuthorization'] = element.buttonAuth.token == "$token$" ? ('Bearer '+this.token) : ('Bearer '+element.buttonAuth.token)
            }else if(element.buttonAuth.type == 'API Key'){
              if(element.buttonAuth.add_to == 'Query Params'){
                if(element.buttonAuth.key !== null && element.buttonAuth.key !== undefined && element.buttonAuth.key !== '' && element.buttonAuth.key.trim() !== '' &&
                element.buttonAuth.value !== null && element.buttonAuth.value !== undefined && element.buttonAuth.value !== '' && element.buttonAuth.value.trim() !== '')
                element.APIURL = element.APIURL+ '?'+element.buttonAuth.key+'='+element.buttonAuth.value
              }else if(element.buttonAuth.add_to == 'Header'){
                if(element.buttonAuth.key !== null && element.buttonAuth.key !== undefined && element.buttonAuth.key !== '' && element.buttonAuth.key.trim() !== '' &&
                  element.buttonAuth.value !== null && element.buttonAuth.value !== undefined && element.buttonAuth.value !== '' && element.buttonAuth.value.trim() !== '')
                headerObj[element.buttonAuth.key] = element.buttonAuth.value
              }
            }
            let httpOptions = {
              headers: {...headerObj}
            }
            this.apiCall(element, obj, httpOptions,headerObj);
          };
        });
      }
    }));
  }
  apiCall(formField, Object, httpOptions,headerObj?) {
    if (formField.APIMETHOD !== null && formField.APIMETHOD !== undefined && formField.APIMETHOD !== '') {
      if (formField.APIMETHOD.toLowerCase() == 'post') {
        let obj = ''
        let parseObj = {}
        try{
        obj = Object.format.replace('"${body}"', formField.parent != null ? Object.reqObj.replace(/[{}]/g, '') : Object.reqObj);
        parseObj  = JSON.parse(obj)
        }catch(error){
          console.log(error)
        }
        this.post(formField.APIURL, parseObj, (Object.headers.length > 0 || (headerObj && this.ObjectKeys(headerObj).length > 0)) ? httpOptions : null).subscribe(res => {
          console.log(res);
          if (Object.key && Object.value) {
            try {
              let newKey = Object.key.substring(Object.key.lastIndexOf(".") + 1, Object.key.length);
              let newValue = Object.value.substring(Object.value.lastIndexOf(".") + 1, Object.value.length);
              let result = [];
              var mySubString = Object.key.substring(
                Object.key.indexOf(".") + 1,
                Object.key.lastIndexOf(".")
              );
              var finalevalstring:any = 'res.' + mySubString;
              // Function('return ' + finalevalstring)().forEach(element => {
              eval(finalevalstring).forEach(element => {
                let key = element[newKey];
                let value = element[newValue];
                result.push({ key: key, value: value ,
                  "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null,
                  element: element });
              });
              formField.listOfValues = result;
              this.form.get(formField.formControlName).updateValueAndValidity()
            }
            catch (e) {
              console.error(e);
            }
          }
        });
      } else if (formField.APIMETHOD.toLowerCase() == 'get') {
        this.get(formField.APIURL, Object.headers.length > 0 ? httpOptions : null).subscribe(res => {
          if (Object.key && Object.value) {
            try {
              let newKey = Object.key.substring(Object.key.lastIndexOf(".") + 1, Object.key.length);
              let newValue = Object.value.substring(Object.value.lastIndexOf(".") + 1, Object.value.length);
              let result = [];
              var mySubString = Object.key.substring(
                Object.key.indexOf(".") + 1,
                Object.key.lastIndexOf(".")
              );
              var finalevalstring = 'res.' + mySubString;
              eval(finalevalstring).forEach(element => {
                let key = element[newKey];
                let value = element[newValue];
                result.push({ key: key, value: value,
                  "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null,
                  element:element
                });
              });
              formField.listOfValues = result;
              this.form.get(formField.formControlName).updateValueAndValidity()
            }
            catch (e) {
              console.error(e);
            }
        }
        });
      }
    }
  }
  ngOnInit(): void {
    this.subscription.push(this.common.getApiData$.subscribe(data => {
      if (data.status == true) {
        this.senApiData = data.status;
        this.buttonClick(data.data);
      }
    }));
    this.common.setMasterConfig();
    this.subscription.push(this.common.getMasterConfig$.subscribe(data => {
      this.dateFormats = JSON.parse(data['DateFormatSettings'])
    }))

    setTimeout(() => {
      this.common.aMethod({
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'DD/MM/YY',
          monthYearLabel: 'DD/MM/YY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'LL',
        },
      })
      setA({
        parse: {
          dateInput: 'LL',
        },
        display: {
          dateInput: 'DD/MM/YY',
          monthYearLabel: 'DD/MM/YY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'LL',
        },
      })
    }, 5000);


    MY_FORMATS = {
      parse: {
        dateInput: 'LLL',
      },
      display: {
        dateInput: 'LLL',
        monthYearLabel: 'LLL',
        dateA11yLabel: 'LLL',
        monthYearA11yLabel: 'LLL',
      },
    }
  }

  private getValidator(formField: FormField): ValidatorFn {
    switch (formField.validator) {
      case "email":
        return Validators.email;
      case "required":
        return Validators.required;
      default:
        return Validators.nullValidator;
    }
  }


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  buttonClick(label: string) {
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
    // console.log("item:",this.item);

    this.item.forEach(element => {
      if (element.type == 'button' && element.label == label) {
        if(element.checkValidation){
          if(element.checkValidationFormControls.length > 0){
            // if (this.form.invalid) {
              let a = false
              for (const key of Object.keys(this.form.controls)) {
                if (this.form.controls[key].invalid && element.checkValidationFormControls.includes(key)) {
                const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
                invalidControl?.focus();
                this.form.markAllAsTouched();
                a = true
                break;
                }
              }
              if(a) return ;
            // }
          }
        }
        if (element.type == 'button') {
          element.buttonBody.forEach(obj => {
            Object.assign(objPattern, { [obj.Key]: obj.Value });
          });
        }
        objKey = Object.keys(objPattern);
        objValue = Object.values(objPattern);
        method = element.APIMETHOD;
        apiUrl = element.APIURL;
        auth = element.buttonAuth
        headers = element.buttonHeaders;
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
          this.item.forEach(obj => {
            if (element == obj.label || element == obj.formControlName) {
              let key = objKey[index];
              reqObj[key] = this.form.value[obj.formControlName]
            }
          });
        });
        if (method.toLowerCase() == 'post') {
          let obj = ''
          let parseObj = {}
          try{
          obj = format.replace('"${body}"', element.buttonBody.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));
          parseObj  = JSON.parse(obj)
          }catch(error){
            console.log(error)
          }
          // let obj = format.replace('"${body}"', element.buttonBody.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));
          this.post(apiUrl, parseObj, (headers.length > 0 || this.ObjectKeys(headerObj).length > 0) ? httpOptions : null).subscribe(res => {
            if (this.senApiData === true) {
              this.common.setSendApiData(true, res);
            }
            if (responseFormat && eval(responseFormat) != undefined) {
              if (patchControl != null) {
                patchControl.forEach(obj => {
                  this.item.forEach(element => {
                    if (element.label == obj.field || element.formControlName == obj.field) {
                      this.form.get(element.formControlName).patchValue(eval(obj.response));
                      if (element.LockControl) {
                        this.form.get(element.formControlName).disable();
                      }
                      this.form.updateValueAndValidity();
                      this.formChange(this.item);
                    }
                  });
                });
              }
              // patch dropdown option data
              // if(element.patchResponseToDropdownOption){
              //   element.patchDropdowns.forEach(element2 => {
              //     if (element2.field && element2.key && element2.value) {
              //       try {
              //         let newKey = element2.key.substring(element2.key.lastIndexOf(".") + 1, element2.key.length);
              //         let newValue = element2.value.substring(element2.value.lastIndexOf(".") + 1, element2.value.length);
              //         let result = [];
              //         var mySubString = element2.key.substring(
              //           element2.key.indexOf(".") + 1,
              //           element2.key.lastIndexOf(".")
              //         );
              //         var finalevalstring:any = 'res.' + mySubString;
              //         // Function('return ' + finalevalstring)().forEach(element => {
              //         eval(finalevalstring).forEach(element3 => {
              //           let key = element3[newKey];
              //           let value = element3[newValue];
              //           result.push({ key: key, value: value,
              //             "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null
              //              , element: element3
              //             });
              //         });
              //         if(result.length >0){
              //           this.formFields.forEach((element4,index) => {
              //             if(element2.field == element4.formControlName){
              //               // console.log("values:",element4.listOfValues);
              //               // setTimeout(() => {
              //               //   this.formFields[index].listOfValues = result;
              //               // });
              //               this.changeListOptions(index,result)
              //               // console.log("values:",element4.listOfValues);
              //               // this.form.get(element4.formControlName).updateValueAndValidity()
              //             }
              //           })
              //         }
              //       }
              //       catch (e) {
              //         console.error(e);
              //       }
              //     }
              //   });
              // }
            } else if(element.patchResponseToDropdownOption){
              element.patchDropdowns.forEach(element2 => {
                if (element2.field && element2.key && element2.value) {
                  try {
                    let newKey = element2.key.substring(element2.key.lastIndexOf(".") + 1, element2.key.length);
                    let newValue = element2.value.substring(element2.value.lastIndexOf(".") + 1, element2.value.length);
                    let result = [];
                    var mySubString = element2.key.substring(
                      element2.key.indexOf(".") + 1,
                      element2.key.lastIndexOf(".")
                    );
                    var finalevalstring:any = 'res.' + mySubString;
                    // Function('return ' + finalevalstring)().forEach(element => {
                    eval(finalevalstring).forEach(element3 => {
                      let key = element3[newKey];
                      let value = element3[newValue];
                      result.push({ key: key, value: value,
                        "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null
                         , element: element3
                        });
                    });
                    if(result.length >0){
                      this.formFields.forEach((element4,index) => {
                        if(element2.field == element4.formControlName || element2.field == element4.label){
                          // console.log("values:",element4.listOfValues);
                          // setTimeout(() => {
                          //   this.formFields[index].listOfValues = result;
                          // });
                          this.changeListOptions(index,result)
                          // console.log("values:",element4.listOfValues);
                          // this.form.get(element4.formControlName).updateValueAndValidity()
                        }
                      })
                    }
                  }
                  catch (e) {
                    console.error(e);
                  }
                }
              });
            } else {
              this.formChange(this.formFields);
            }
            if(element.clickButtonAfter){
              element.clickButtonAfterArray.forEach(elementtt => {
                this.buttonClick(elementtt.value)
              });
            }
            // this.formChange(this.formFields);
          }, ((error) => {
            console.log('error:',error);
            this.formChange(this.formFields);
          }));
        } else if (method.toLowerCase() == 'get') {
          this.get(apiUrl, (headers.length > 0 || this.ObjectKeys(headerObj).length > 0) ? httpOptions : null).subscribe(res => {
            if (responseFormat && eval(responseFormat) != undefined) {
              if (patchControl != null) {
                patchControl.forEach(obj => {
                  this.item.forEach(element => {
                    if (element.label == obj.field || element.formControlName == obj.field) {
                      this.form.get(element.formControlName).patchValue(eval(obj.response));
                      if (element.LockControl) {
                        this.form.get(element.formControlName).disable();
                      }
                      this.form.updateValueAndValidity();
                      this.formChange(this.item);
                    }
                  });
                });
              }
            } else {
              this.formChange(this.formFields);
            }
            if(element.clickButtonAfter){
              element.clickButtonAfterArray.forEach(elementtt => {
                this.buttonClick(elementtt)
              });
            }
          }, ((error) => {
            this.formChange(this.formFields);
          }));
        }
      }else if (element.type == 'list' && element.label == label) {
        if (element.type == 'list') {
          element.buttonBody.forEach(obj => {
            if(obj.Key && obj.Value) Object.assign(objPattern, { [obj.Key]: obj.Value });
          });
        }
        objKey = Object.keys(objPattern);
        objValue = Object.values(objPattern);
        method = element.APIMETHOD;
        apiUrl = element.APIURL;
        auth = element.buttonAuth
        headers = element.buttonHeaders;
        format = element.Format;
        disable = element.FormDisable;
        patchControl = element.PatchControl;
        responseFormat = element.FormatResponse;
        let headerObj:any = {};
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
          if(element.key && element.value) headerObj[element.key] = element.value == "$token$" ? ('Bearer '+this.token) : element.value
        });
        // console.log(headerObj);
        let httpOptions:any
        // setTimeout(() => {
          // console.log(httpOptions);
          httpOptions = {
            headers: {...headerObj}
          }
          // console.log(headerObj,{
          //   headers: {...headerObj}
          // });
        // });
        let reqObj = {};
        objValue.forEach((element, index) => {
          this.item.forEach(obj => {
            if (element == obj.label || element == obj.formControlName) {
              let key = objKey[index];
              reqObj[key] = this.form.value[obj.formControlName]
            }
          });
        });
        if (method.toLowerCase() == 'post') {
          let obj = ''
          let parseObj = {}
          try{
          obj = format.replace('"${body}"', element.buttonBody.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));
          parseObj  = JSON.parse(obj)
          }catch(error){
            console.log(error)
          }
          // let obj = format.replace('"${body}"', element.buttonBody.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));
          this.post(apiUrl, parseObj, (headers.length > 0 || Object.keys(headerObj).length > 0) ? httpOptions : null).subscribe(res => {
            if (this.senApiData === true) {
              this.common.setSendApiData(true, res);
            }
            // if (eval(responseFormat) != undefined) {
            //   if (patchControl != null) {
            //     patchControl.forEach(obj => {
            //       this.item.forEach(element => {
            //         if (element.label == obj.field || element.formControlName == obj.field) {
            //           this.form.get(element.formControlName).patchValue(eval(obj.response));
            //           if (element.LockControl) {
            //             this.form.get(element.formControlName).disable();
            //           }
            //           this.form.updateValueAndValidity();
            //           this.formChange(this.item);
            //         }
            //       });
            //     });
            //   }
            // } else {
            //   this.formChange(this.formFields);
            // }



            if (element.key && element.value) {
              try {
                let newKey = element.key.substring(element.key.lastIndexOf(".") + 1, element.key.length);
                let newValue = element.value.substring(element.value.lastIndexOf(".") + 1, element.value.length);
                let result = [];
                var mySubString = element.key.substring(
                  element.key.indexOf(".") + 1,
                  element.key.lastIndexOf(".")
                );
                var finalevalstring:any = 'res.' + mySubString;
                eval(finalevalstring).forEach(element => {
                  let key = element[newKey];
                  let value = element[newValue];
                  result.push({ key: key, value: value,
                    "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null,
                    element:element
                   });
                });
                element.listOfValues = result;
                this.form.get(element.formControlName).updateValueAndValidity()
              }
              catch (e) {
                console.error(e);
              }
            }
          }, ((error) => {
            console.log('error:',error);
            this.formChange(this.formFields);
          }));
        } else if (method == 'GET') {
          this.get(apiUrl, headers.length > 0 ? httpOptions : null).subscribe(res => {
            if (responseFormat && eval(responseFormat) != undefined) {
              if (patchControl != null) {
                patchControl.forEach(obj => {
                  this.item.forEach(element => {
                    if (element.label == obj.field || element.formControlName == obj.field) {
                      this.form.get(element.formControlName).patchValue(eval(obj.response));
                      if (element.LockControl) {
                        this.form.get(element.formControlName).disable();
                      }
                      this.form.updateValueAndValidity();
                      this.formChange(this.item);
                    }
                  });
                });
              }
            } else {
              this.formChange(this.formFields);
            }
          }, ((error) => {
            this.formChange(this.formFields);
          }));
        }
      }
    });
  }
  changeCheckboxNestedControlMandatoryStatus(item: any) {
    if (this.form.value[this.formFields[item].formControlName] && this.formFields[item].nestedControlOfWhom.length > 0) {
      this.formFields[item].nestedControlOfWhom.forEach(element => {
        this.formFields.forEach((element1) => {
          if (element == element1.label) {
            this.form.controls[element1.formControlName].addValidators(Validators.required)
          }
        })
      });
    } else if (!this.form.value[this.formFields[item].formControlName] && this.formFields[item].nestedControlOfWhom.length > 0) {
      this.formFields[item].nestedControlOfWhom.forEach(element => {
        this.formFields.forEach((element1) => {
          if (element == element1.label) {
            this.form.controls[element1.formControlName].addValidators(Validators.nullValidator)
          }
        })
      });
    }
  }

  changeListOptions(index,value){
    setTimeout(() => {
      console.log("before:",this.formFields[index].listOfValues);
      this.formFields[index].listOfValues = [...value]
      console.log("after:",this.formFields[index].listOfValues);
      // this.formChange(this.formFields);
      // this.addNewItem(this.formFields)
      console.log("::::",this.formFields);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.formFields, event.previousIndex, event.currentIndex);

    for (let key in this.formFields) {
      if (this.formFields[key]?.ATTRSEQUENCE == undefined) {
        Object.assign(this.formFields[key], { ATTRSEQUENCE: key });
      } else {
        this.formFields[key].ATTRSEQUENCE = key
      }
    }
    this.addNewItem(this.formFields)
  }

  addNewItem(value) {
    this.newItemEvent.emit(value);
  }

  getSelectedIndexValue(value) {
    this.selectedIndex.emit(value);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

  public post(url, data, httpOptions): Observable<any> {
    return this.http.post(url, data, httpOptions == null ? undefined : httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public put(url, data, httpOptions): Observable<any> {
    return this.http.put(url, data, httpOptions == null ? undefined : httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public delete(url, data, httpOptions): Observable<any> {
    return this.http.delete(url + '/' + data, httpOptions == null ? undefined : httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  public get(url, httpOptions): Observable<any> {
    return this.http.get(url, httpOptions == null ? undefined : httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error) {
    let errorMessage = {};
    if (error.error instanceof ErrorEvent) {
      errorMessage = { message: `${error.error.message}` };
    } else {
      errorMessage = { code: `${error.status}`, message: `${error.message}` };
    }
    return throwError(errorMessage);
  }

  dropdownChanged(formControlName,item){
    let a = this.item.filter(aa => aa.resetValueOnParentChange)
    let optionData = (item.listOfValues.filter(res => res.value  == this.form.value[item.formControlName]))
    let option = optionData.length > 0 ? optionData[0] : {}
    let b = []
    let c = []
    if(a.length > 0) b= this.item.filter(aa => aa?.formControlName == formControlName)
    if(b.length > 0 && a.length > 0) c = a.filter(aa => aa?.parent == b[0]?.label)
    if(c.length > 0) c.forEach(element => {
      console.log(element);
      this.form.controls[element.formControlName].patchValue('',{emitEvent: false})
    });

    if(item.patchValueToControlsWhenChanged){
      item.patchValueToControls.forEach(element => {
        if(element.field && this.common.checkTruthyValue(element.field) && element.key && this.common.checkTruthyValue(element.key)){
          let keyString = 'option.'+element.key
          try{
            if(eval(keyString)){
              this.form.controls[element.field].patchValue(eval(keyString))
              this.form.controls[element.field].updateValueAndValidity()
            }
          } catch{e => console.error(e)}
        }
      });
    }
    if(item.patchResponseToDropdownOption){
      item.patchDropdowns.forEach(element2 => {
        if (element2.field && element2.key && element2.value) {
          try {
            let newKey = element2.key.substring(element2.key.lastIndexOf(".") + 1, element2.key.length);
            let newValue = element2.value.substring(element2.value.lastIndexOf(".") + 1, element2.value.length);
            let result = [];
            var mySubString = element2.key.substring(
              element2.key.indexOf(".") + 1,
              element2.key.lastIndexOf(".")
            );
            var finalevalstring:any = 'res.' + mySubString;
            // Function('return ' + finalevalstring)().forEach(element => {
            eval(finalevalstring).forEach(element3 => {
              let key = element3[newKey];
              let value = element3[newValue];
              result.push({ key: key, value: value,
                "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null
                 , element: element3
                });
            });
            if(result.length >0){
              this.formFields.forEach((element4,index) => {
                if(element2.field == element4.formControlName || element2.field == element4.label){
                  // console.log("values:",element4.listOfValues);
                  // setTimeout(() => {
                  //   this.formFields[index].listOfValues = result;
                  // });
                  this.changeListOptions(index,result)
                  // console.log("values:",element4.listOfValues);
                  // this.form.get(element4.formControlName).updateValueAndValidity()
                }
              })
            }
          }
          catch (e) {
            console.error(e);
          }
        }
      });
    }
    if(item.APICallAfterChange){
      this.APICallAfterDropdownChange(item.APICallAfterChangeConfig)
    }
  }

  APICallAfterDropdownChange(element){
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

    element.buttonBody.forEach(obj => {
      if(obj.Key && obj.Value) Object.assign(objPattern, { [obj.Key]: obj.Value });
    });

  objKey = Object.keys(objPattern);
  objValue = Object.values(objPattern);
  method = element.APIMETHOD;
  apiUrl = element.APIURL;
  auth = element.buttonAuth
  headers = element.buttonHeaders;
  format = element.Format;
  disable = element.FormDisable;
  patchControl = element.PatchControl;
  responseFormat = element.FormatResponse;
  let headerObj:any = {};
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
  headers.forEach(element => {
    if(element.key && element.value) headerObj[element.key] = element.value == "$token$" ? ('Bearer '+this.token) : element.value
  });
  let httpOptions:any
    httpOptions = {
      headers: {...headerObj}
    }
  let reqObj = {};
  objValue.forEach((element, index) => {
    this.item.forEach(obj => {
      if (element == obj.label || element == obj.formControlName) {
        let key = objKey[index];
        reqObj[key] = this.form.value[obj.formControlName]
      }
    });
  });
  if (method.toLowerCase() == 'post') {
    let obj = ''
    let parseObj = {}
    try{
    obj = format.replace('"${body}"', element.buttonBody.length === 0 ? JSON.stringify(reqObj) : JSON.stringify(reqObj).replace(/[{}]/g, ''));
    parseObj  = JSON.parse(obj)
    }catch(error){
      console.log(error)
    }
    this.post(apiUrl, parseObj, (headers.length > 0 || Object.keys(headerObj).length > 0) ? httpOptions : null).subscribe(res => {
      if (this.senApiData === true) {
        this.common.setSendApiData(true, res);
      }

      if(element.response){
        element.response.forEach(element1 => {
          if(element1.field && this.common.checkTruthyValue(element1.field) && element1.response && this.common.checkTruthyValue(element1.response)){
            try{
            //   if(eval(keyString)){
                // this.form.controls[element1.field].patchValue(eval(keyString))
                this.form.get(element1.field).patchValue(eval(element1.response));
                this.form.controls[element1.field].updateValueAndValidity()
              // }
            } catch{e => console.error(e)}
          }
        });
      }
      if(element.patchResponseToDropdownOption){
        element.patchDropdowns.forEach(element2 => {
          if (element2.field && element2.key && element2.value) {
            try {
              let newKey = element2.key.substring(element2.key.lastIndexOf(".") + 1, element2.key.length);
              let newValue = element2.value.substring(element2.value.lastIndexOf(".") + 1, element2.value.length);
              let result = [];
              var mySubString = element2.key.substring(
                element2.key.indexOf(".") + 1,
                element2.key.lastIndexOf(".")
              );
              var finalevalstring:any = 'res.' + mySubString;
              // Function('return ' + finalevalstring)().forEach(element => {
              eval(finalevalstring).forEach(element3 => {
                let key = element3[newKey];
                let value = element3[newValue];
                result.push({ key: key, value: value,
                  "parent1Value": null, "parent1Id": null, "parent1FormControl": null, "parent2Value": null, "parent2Id": null, "parent2FormControl": null, "parent3Value": null, "parent3Id": null, "parent3FormControl": null, "nestedControl": null
                   , element: element3
                  });
              });
              if(result.length >0){
                this.formFields.forEach((element4,index) => {
                  if(element2.field == element4.formControlName || element2.field == element4.label){
                    // console.log("values:",element4.listOfValues);
                    // setTimeout(() => {
                    //   this.formFields[index].listOfValues = result;
                    // });
                    this.changeListOptions(index,result)
                    // console.log("values:",element4.listOfValues);
                    // this.form.get(element4.formControlName).updateValueAndValidity()
                  }
                })
              }
            }
            catch (e) {
              console.error(e);
            }
          }
        });
      }
    }, ((error) => {
      console.log('error:',error);
      this.formChange(this.formFields);
    }));
  } else if (method.toLowerCase() == 'get') {
      this.get(apiUrl, headers.length > 0 ? httpOptions : null).subscribe(res => {
        element.patchValueToControls.forEach(element1 => {
          if(element1.field && this.common.checkTruthyValue(element1.field) && element1.key && this.common.checkTruthyValue(element1.key)){
            let keyString = 'option.'+element1.key
            try{
              if(eval(keyString)){
                this.form.controls[element1.field].patchValue(eval(keyString))
                this.form.controls[element1.field].updateValueAndValidity()
              }
            } catch{e => console.error(e)}
          }
        });
      }), ((error) => {
        console.log('error:',error);
        this.formChange(this.formFields);
      })
    }
  }

  isDisable(i){
    let a = false
    if(this.formFields[i].checkValidation)
    this.formFields[i].checkValidationFormControls.forEach(element => {
      if(this.form.get(element)?.hasError('required')){
        a = true
      }
    });
    return a
  }


  isVisible(nestedToControl,nestedToValue){
    let a = false
    if(nestedToControl && Array.isArray(nestedToControl)){
      if(nestedToControl.length == 0){
        a = true
      } else{
        // let b = false
        for (const iterator in nestedToControl) {
          if(this.form.get(nestedToControl[iterator]).value == nestedToValue[iterator]){
            a = true
          }
        }
      }
    } else{
      a = true
    }
    return a
  }

  checkFileType(arrayData,Val){
    let a = []
    if(arrayData && Array.isArray(arrayData)) a = arrayData.filter(rrr => rrr.toLowerCase() == Val.toLowerCase())
    return a.length > 0 ? true : false
  }

  import(event,formControlName){
    console.log("event:",event.target.files.length);
    for (const element of event.target.files) {
      const formData = new FormData();
      var filename = this.datepipe.transform(new Date(), 'ddMMyyhhmmssSSS');
      formData.append(filename, element);
      console.log("there", element.type);
      if (Math.round(element.size / 1024) > 5000) {
        this.common.snackbar("File Size");
      } else if(this.checkFileType(formControlName.uploadFormFileFormat,element.type)){
        const reader = new FileReader();
        reader.onload = () => {
          this.api.post('upload', formData).subscribe(res => {
            if (res.code == 200) {
              if(res.results.URL){
                let value = this.form.value[formControlName.formControlName]
                if(!Array.isArray(this.form.value[formControlName.formControlName])){
                  value = []
                }
                value.push(res.results.URL)
                this.form.controls[formControlName.formControlName].patchValue(value)
                this.form.updateValueAndValidity()
                this.common.snackbar('Image Upload Success')
              }
            }
          }, error => {
            console.log(error);
          })
        };
        reader.readAsDataURL(element);
      }
        else {
          this.common.snackbar("File Type");
      }
    }
  }

  returnImages(formControlName){
    let a = []
    if(Array.isArray(this.form.value[formControlName])){
      this.form.value[formControlName].forEach(element => {
        let x = false
        if(element.slice(element.lastIndexOf('.') + 1,element.length).toLowerCase().includes('png') ||
        element.slice(element.lastIndexOf('.') + 1,element.length).toLowerCase().includes('jpeg') ||
        element.slice(element.lastIndexOf('.') + 1,element.length).toLowerCase().includes('jpg') ||
        element.slice(element.lastIndexOf('.') + 1,element.length).toLowerCase().includes('gif')){
          x = true
        }
        a.push({link : element, isImage : x})
      });
    }
    return a
  }

  deleteUploadedFile(formControlName,index){
    let a = this.form.value[formControlName]
    a.splice(index,1)
    this.form.controls[formControlName].patchValue(a)
    this.form.updateValueAndValidity()
  }
}
