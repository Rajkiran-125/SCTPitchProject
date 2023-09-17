import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex } from 'src/app/global/json-data';

export interface allControls {
  Id: any,
  label: any,
  dateFormat: any,
  formControlName: any,
  type: any,
  mandatory: boolean,
  regularExpression: any,
  value: any,
  parent: any,
  parentId: any,
  nestedControlOfWhom: any,
  nestedControl: any,
  listOfValues: Array<any>,
  buttonHeaders: Array<any>,
  APIURL: any,
  APIMETHOD: any,
  ATTRSEQUENCE: any,
}

@Component({
  selector: 'app-dynamic-feilds',
  templateUrl: './dynamic-feilds.component.html',
  styleUrls: ['./dynamic-feilds.component.scss']
})
export class DynamicFeildsComponent implements OnInit {

  @Input() labelName: any;
  @Input() userConfig: any;
  userDetails: any;
  submittedForm: boolean = false;
  form: FormGroup;
  formName: FormGroup;
  @Input() allFormControl: any = [];
  regex: any;
  parentDropDown = []
  dataTypeArray = ['text', 'tel', 'number', 'email', 'hidden', 'search'];
  formControlTypes: Array<string> = ['input', 'list', 'checkbox', 'datetime', 'button'];
  apiMethod: Array<Object> = [
    { Key: 'GET', Value: "get" },
    { Key: 'POST', Value: "post" },
    { Key: 'DELETE', Value: "delete" },
    { Key: 'PUT', Value: "put" },
  ]
  dummyAllFormControl: allControls[] = this.allFormControl
  loader: boolean;
  subscription: Subscription[] = [];
  deleteMethod: boolean = false;
  @Input() path: any;
  @Input() type: any;
  @Input() productId: any;
  @Output() changes = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    public dialog: MatDialog,
    private auth: AuthService,
    private api: ApiService
  ) {
    Object.assign(this, { regex });
  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
  }

  deleteFormControl(i: any, id?, name?) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: 'delete',
        title: 'Are you sure?',
        subTitle: 'Do you want to ' + 'delete' + ' this data',
      },
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status) {
        if (this.path) {
          let obj = {
            "data": {
              "spname": "usp_unfyd_data_collection_form",
              "parameters": {
                "FLAG": "DELETE",
                "ID": id,
                PRODUCTID: this.productId
              }
            }
          }
          this.api.post('index', obj).subscribe(res => {
            if (res.code == 200) {
              this.common.snackbar("Delete Record");
            } else {
              this.common.snackbar("General Error");
            }
          },
            (error) => {
              this.common.snackbar("General Error");
            });
        }
        for (let key in this.allFormControl) {
          if (this.allFormControl[key].formControlName == this.allFormControl[i].nestedControlOfWhom) {
            this.allFormControl[key].nestedControl = null
          }
        }
        this.allFormControl.splice(i, 1);
        this.changesDone();
      }
    });
  }

  changesDone() {
    this.changes.emit(true);
  }

  toggleChange(event, item) {
    if (event == false) {
      item.listOfValues = [];
    }
  }

  returnFormControlLabel(id: any) {
    let a = ''
    this.allFormControl.forEach(element => {
      if (id == element.Id) {
        a = element.label;
      }
    });
    if (a) {
      return a;
    } else {
      return 'xyz'
    }
  }

  returnFormControlLists(people: any, i: any, k: any): any[] {
    let result = []
    this.allFormControl.forEach(element => {
      if (element.type != 'button' && element?.Id != null && element.label && !(element.label.trim().length === 0)) {
        result.push(element.Id)
      }
    });
    let result2 = [...result];
    let selectedValue: any
    result.forEach(element => {
      for (let key in this.allFormControl[i].buttonHeaders) {
        if (key != k)
          if (element == this.allFormControl[i].buttonHeaders[key].Value && this.allFormControl[i].buttonHeaders[key].Value) {
            if (result2.includes(element)) {

              result2.splice(result2.indexOf(element), 1)
            }
          }
      }
    });
    return result2
  }

  addAttribute(formControlName: string, i: number) {
    let AttributesToAdd: any = {
      option: null,
      // key: null,
      // value: null,
      parent1Value: null,
      parent1Id: null,
      parent1FormControl: null,
      parent2Value: null,
      parent2Id: null,
      parent2FormControl: null,
      parent3Value: null,
      parent3Id: null,
      parent3FormControl: null,
    }
    if (this.allFormControl[i].parent == null && this.allFormControl[i].parentId == null) {
      AttributesToAdd = {
        option: null,
        // key: null,
        // value: null,
        parent1Value: null,
        parent1Id: null,
        parent1FormControl: null,
        parent2Value: null,
        parent2Id: null,
        parent2FormControl: null,
        parent3Value: null,
        parent3Id: null,
        parent3FormControl: null,
      }
      this.allFormControl[i].listOfValues.push(AttributesToAdd)
    } else {
      AttributesToAdd.parent1FormControl = this.allFormControl[i].parent;
      AttributesToAdd.parent1Id = this.allFormControl[i]?.parentId;
      this.allFormControl.forEach(element => {
        if (element.formControlName == AttributesToAdd.parent2FormControl) {
          if (element.parent != null) {
            AttributesToAdd.parent3FormControl = element.parent;
            AttributesToAdd.parent3Id = element?.parentId;
          }
        }
      });
      this.allFormControl.forEach(element => {
        if (element.formControlName == AttributesToAdd.parent1FormControl) {
          if (element.parent != null) {
            AttributesToAdd.parent2FormControl = element.parent;
            AttributesToAdd.parent2Id = element?.parentId;
          }
        }
      });
      this.allFormControl.forEach(element => {
        if (element.formControlName == AttributesToAdd.parent1FormControl) {
          if (element.parent == null) {
            AttributesToAdd.parent1FormControl = element.parent;
            AttributesToAdd.parent1Id = element?.parentId;
          }
        }
      });
      this.allFormControl[i].listOfValues.push(AttributesToAdd)
    }
  }

  addHeader(formControlName: string, i) {
    this.allFormControl[i].buttonHeaders.push({ Key: '', Value: '' })
  }

  addBody(formControlName: string, i) {
    this.allFormControl[i].buttonBody.push({ Key: '', Value: '' })
  }

  deleteButtonParameter(i: any, k: any) {
    this.allFormControl[i]?.buttonHeaders.splice(k, 1)
  }

  deleteButtonBodyParameter(i: any, k: any) {
    this.allFormControl[i]?.buttonBody.splice(k, 1)
  }

  getMethod(event) {
    if (event == 'delete') {
      this.deleteMethod = true;
    } else this.deleteMethod = false;
  }

  deleteListOfValues(i: number, j: number) {
    for (let key in this.allFormControl) {
      for (let key2 in this.allFormControl[key].listOfValues) {
        if (this.allFormControl[key].listOfValues[key2].parent1Value == this.allFormControl[i].listOfValues[j].option) {
          this.allFormControl[key].listOfValues[key2].parent1Value = null;
          this.allFormControl[key].listOfValues[key2].parent1FormControl = null;
        }
        if (this.allFormControl[key].listOfValues[key2].parent2Value == this.allFormControl[i].listOfValues[j].option) {
          this.allFormControl[key].listOfValues[key2].parent2Value = null;
          this.allFormControl[key].listOfValues[key2].parent2FormControl = null;
        }
        if (this.allFormControl[key].listOfValues[key2].parent3Value == this.allFormControl[i].listOfValues[j].option) {
          this.allFormControl[key].listOfValues[key2].parent3Value = null;
          this.allFormControl[key].listOfValues[key2].parent3FormControl = null;
        }
      }
    }
    if (this.allFormControl[i].value == this.allFormControl[i].listOfValues[j].option) {
      this.allFormControl[i].value = null
    }
    this.allFormControl[i].listOfValues.splice(j, 1)
  }

  returnParentDropDown(currentIndex: any, currentFormControl: string, parentNo: number, currentOptionIndex: any): any[] {
    let parentArray = []
    this.allFormControl.forEach(element => {
      if (element.type == 'list') {

        if (parentNo == 3) {
          if (element.Id == currentFormControl) {
            element.listOfValues.forEach(element1 => {
              if (element1.option != null && element1.option != '' && element1.option != undefined && !(element1.option.trim().length === 0)) {
                parentArray.push(element1.option)
              }
            });
          }
        } else if (parentNo == 2) {
          if (this.allFormControl[currentIndex].listOfValues[0].parent3Id == null) {
            if (element.Id == currentFormControl) {
              element.listOfValues.forEach(element1 => {
                if (element1.option != null && element1.option != '' && element1.option != undefined && !(element1.option.trim().length === 0)) {
                  parentArray.push(element1.option)
                }
              });
            }
          } else {
            if (element.Id == currentFormControl) {
              element.listOfValues.forEach(element1 => {
                if (element1.parent1Value == this.allFormControl[currentIndex].listOfValues[currentOptionIndex].parent3Value) {
                  parentArray.push(element1.option)
                }
              });
            }
          }
        } else if (parentNo == 1) {
          if (this.allFormControl[currentIndex].listOfValues[0].parent3Id == null) {
            if (this.allFormControl[currentIndex].listOfValues[0].parent2Id == null) {
              if (element.Id == currentFormControl) {
                element.listOfValues.forEach(element1 => {
                  if (element1.option != null && element1.option != '' && element1.option != undefined && !(element1.option.trim().length === 0)) {
                    parentArray.push(element1.option)
                  }
                });
              }
            } else {
              if (element.Id == currentFormControl) {
                element.listOfValues.forEach(element1 => {
                  if (element1.parent1Value == this.allFormControl[currentIndex].listOfValues[currentOptionIndex].parent2Value) {
                    parentArray.push(element1.option)
                  }
                });
              }
            }
          } else {
            if (element.Id == currentFormControl) {
              element.listOfValues.forEach(element1 => {
                if (element1.parent2Value == this.allFormControl[currentIndex].listOfValues[currentOptionIndex].parent3Value) {
                  if (element1.parent1Value == this.allFormControl[currentIndex].listOfValues[currentOptionIndex].parent2Value) {
                    parentArray.push(element1.option)
                  }
                }
              });
            }

          }
        }
      }
    });
    return parentArray;
  }

}
