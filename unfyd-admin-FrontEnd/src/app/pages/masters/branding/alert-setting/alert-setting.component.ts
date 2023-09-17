import { Component, ElementRef, OnInit } from '@angular/core';
import { orderBy } from 'lodash';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientRequest } from 'http';
import { element } from 'protractor';
import { Subscription } from "rxjs";
import moment from 'moment';


@Component({
  selector: 'app-alert-setting',
  templateUrl: './alert-setting.component.html',
  styleUrls: ['./alert-setting.component.scss']
})
export class AlertSettingComponent implements OnInit {
  loader: boolean = true;
  submittedForm = false;
  masters: any;
  form: FormGroup;
  requestObj: { data: { spname: string; parameters: any } };
  brandId: any;
  languageData: any = [];
  userDetails: any;
  data: any = [];
  tabValue: any = [];
  tabKey: any = [];
  type: any;
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  noData: boolean = false;
  finalField: any[] = [];
  labelName: any;
  editobj: any;
  reset: boolean;
  productType: any = [];
  productName: any = 1;
  config: any
  search: any;
  page: number = 1;
  itemsPerPage: number = 10;
  Img: any = [];
  loginImg: any;
  headerImg: any;
  footerImg: any;
  category: any;
  index: any;
  array: any = [];
  imgAndImgText: any = '';
  text: any = [];
  userConfig: any
  profileImg: any = null;
  productID: any;
  labelNameStore: any;
  LabelNameStore: any;
  changeModuleLabelDisplayName: any;
  tabValueCopy: any = [];
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  userLanguageName: any = [];
  Icon: any;
  alertPopupIcon: any;
  AlertMsgData: boolean = true;
  dateformat: any;
  format: any;
  Actionableid: any;
  alertproductid: any
  alertlangid: any;
  AID: any;
  addbutton: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private auth: AuthService,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog,
  ) {
    Object.assign(this, { masters });
  }

  ngOnInit(): void {

    this.common.hubControlEvent('AlertMessage', 'click', 'pageload', 'pageload', '', 'ngOnInit');
    this.getProducts();
    this.form = this.formBuilder.group({
      language: ['', Validators.nullValidator]
    })
    this.activatedRoute.queryParams.subscribe(params => {

      this.alertproductid = params.ProductId;
      this.alertlangid = params.LanguageID;
      if (this.alertproductid && this.alertlangid) {
        this.productName = parseInt(this.alertproductid)
        this.userDetails = this.auth.getUser();
        this.getAlertdetail();
      }
    })

    this.userDetails = this.auth.getUser();
    // this.getLanguage();
    this.labelNameStore = JSON.parse(localStorage.getItem('menu'))
    this.subscription.push(
      this.common._callGetAlert.subscribe((res) => {
        if (this.Actionableid)
          this.AID = this.Actionableid;
        this.getAlertdetail()
      })
    )
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }))

    this.dateformat = JSON.parse(localStorage.getItem("localizationData"));
    this.format = this.dateformat.selectedDateFormats.toUpperCase().concat(" ", this.dateformat.selectedTimeFormats)

    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.subscription.push(
      this.common.reloadData$.subscribe((data) => {
        if (data == true) {
          this.getAlertdetail();
        }
      })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'AlertMessage');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data
      //  console.log(data);

    }))

    this.type = "AlertMessage";
    this.userDetails = this.auth.getUser();

    this.common.setUserConfig(this.userDetails.ProfileType, this.type);
    this.subscription.push(
      this.common.getUserConfig$.subscribe(data => {
        this.userConfig = data;
      })
    )
    this.getLanguageStorage();
    this.getFilter();
    this.feildChooser();
    this.common.hubControlEvent('AlertMessage', 'click', 'pageloadend', 'pageloadend', '', 'ngOnInit');

    this.LabelNameStore = ''

    this.labelNameStore.forEach(element1 => {
      if (element1.hasOwnProperty('Keys')) {
        if (element1.Keys.length > 0) {
          element1.Keys.forEach(element2 => {
            if (this.router.url.toLowerCase().includes(element2.ModuleUrl.toLowerCase())) {
              this.LabelNameStore = element2.DisplayName

            }
          })
        }
        else if (this.router.url.toLowerCase().includes(element1.parantModuleUrl.toLowerCase())) {
          this.LabelNameStore = element1.DisplayName


        }

      }
    })

    this.changeModuleLabelDisplayName = this.common.changeModuleLabelName()


  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(this.common.getLabelConfig$.subscribe(data1 => {
      this.loader = false
      this.labelName = data1
    }));
    this.common.setLabelConfig(this.userDetails.Processid, 'AlertMessage', data)

  }
  getFilter() {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', '', 'getFilter');

    this.subscription.push(

      this.common.getItemsPerPage$.subscribe(data => {

        this.itemsPerPage = data
      })
    )
    this.subscription.push(

      this.common.getSearch$.subscribe(data => {
        this.search = data
      })
    )
    this.subscription.push(
      this.common.getLoaderStatus$.subscribe(data => {
        if (data == false) {
          this.getAlertdetail()
        }
      })
    )
    this.subscription.push(
      this.common.getTableKey$.subscribe(data => {
        this.finalField = []
        this.finalField = data
      })
    )
  }

  getProducts() {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', '', 'getProducts');

    this.productType = JSON.parse(localStorage.getItem('products'))
    this.productName = this.productType.Id
  }

  selectedProduct(e) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', e, 'selectedProduct');

    this.productName = e
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data
    });
  }
  bulkdelete() {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', '', 'bulkdelete');

    this.openDialogBulkDelete("delete");
  }


  openDialogBulkDelete(type) {
    let deleteCount = 0;
    let endpoint: any;
    if (this.type == "UserGroup") {
      endpoint = "index";
    }
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      var commaSeperatedString = this.hasChecked.toString();
      if (status.status) {
        this.hasChecked.forEach((e) => {
          this.requestObj = {
            data: {
              spname: "usp_unfyd_alert_msg_config",
              parameters: {
                flag: "BULK_DELETE",
                multiid: commaSeperatedString
              },
            },
          };
          this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(this.requestObj), 'bulkdelete');

          this.api.post("index", this.requestObj).subscribe((res) => {
            if (res.code == 200) {
              deleteCount++;
              if (deleteCount == this.hasChecked.length) {
                this.common.snackbar("Delete Record");
                this.common.reloadDataMethod(true);
              }
              this.getAlertdetail();
            }
          });
        });

      }



      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
  }



  feildChooser() {
    var obj = {
      data: {
        spname: "usp_unfyd_user_field_chooser",
        parameters: {
          flag: "GET",
          processid: this.userDetails.Processid,
          productid: 1,
          userid: this.userDetails.Id,
          modulename: this.type,
          language: localStorage.getItem('lang')
        }
      }
    }
    this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(obj), 'feildChooser');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        if (res.results.data.length == 0) {
          this.selctedField = this.tabKey;
        } else {
          this.selctedField = res.results.data[0].FieldChooser.split(',');
        }
        this.unSelctedField = this.tabKey.filter(field => !this.selctedField.includes(field));
        var selctedField = [];
        for (let i = 0; i < this.selctedField.length; i++) {
          selctedField.push({ value: this.selctedField[i], className: '' })
        }
        var unSelctedField = [];
        for (let i = 0; i < this.unSelctedField.length; i++) {
          unSelctedField.push({ value: this.unSelctedField[i], className: 'tabCol' })
        }
        this.finalField = [...selctedField, ...unSelctedField]
      } else {
        this.common.snackbar(res.results.data[0].result);
      }
    },
      (error) => {
        this.common.snackbar(error.message);
      })
  }
  maxNo = false;

  hasChecked: any = []
  allSelected: boolean = false

  getAlertdetail() {
    this.loader = true
    if (this.alertlangid) {
      this.form.value.language = this.alertlangid
      this.form.controls.language.patchValue(this.alertlangid)
      this.form.updateValueAndValidity()
    }

    if (this.productName == undefined || this.productName == '') {
      this.addbutton = false
      this.loader = false;
      this.common.snackbar('SelectApplication');
      return;
    }
    else if (this.form.value.language == undefined || this.form.value.language == '') {
      this.addbutton = false
      this.loader = false;
      this.common.snackbar('CannedPleaseSelectLanguage');
      return;
    }
    else {
      this.addbutton = true
      this.activatedRoute.queryParams.subscribe(params => {
        this.Actionableid = params.Actionable;
      })
      this.tabValue = []
      this.tabKey = []
      this.hasChecked = []
      this.finalField = []
      this.search = "";
      this.requestObj = {
        data: {
          spname: 'usp_unfyd_alert_msg_config',
          parameters: {
            flag: 'GET',
            PROCESSID: this.userDetails?.Processid,
            PRODUCTID: this.productName
          },
        },
      };
      this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(this.requestObj), 'getAlertdetail');

      this.api.post('index', this.requestObj).subscribe(res => {
        if (res.code == 200) {
          var tempRes = res.results.data

          if (tempRes?.length == 0) { this.AlertMsgData = false }
          else { this.AlertMsgData = true }

          this.tabKey = []
          this.tabValue = []
          this.tabValueCopy = []
          this.finalField = []
          for (let data of tempRes) {
            var newObj = {
              ...data
            }
            this.tabValue.push(newObj);
          }
          this.tabValueCopy = this.tabValue;
          this.changeLanguage(this.form.value.language);
          this.common.sendTabValueToFilterMethod(this.tabValue)
          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
          }
          if (tempRes.length == 0) {
            this.noData = true
          } else {
            this.noData = false
          }

          this.loader = false;
        } else {
          this.loader = false;
        }
      },
        (error) => {
          this.loader = false;
          this.common.snackbar("General Error");
        })
    }
  }

  openAlertDialog(type, data) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', type, 'openAlertDialog');

    if (this.type == "AlertMessage") {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: type,
          data: this.data,
          productID: this.productID
        },
        width: '750px',
        disableClose: true,
        hasBackdrop: true
      });
      dialogRef.afterClosed().subscribe(status => {
        if (status) {
          this.common.callGetAlertMethod(status)
        }
      });
    }
  }


  changeLanguage(value) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', value, 'changeLanguage');

    let a = [];
    this.tabValueCopy.forEach(element => {
      if (element['Language Code'] == value) {
        a.push(element);
      }
    });
    this.tabValue = a;

  }



  getLanguage() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('AlertMessage', 'click', '', '', '', 'getLanguage');

    this.api.post('index', this.requestObj).subscribe((res: any) => {


      if (res.code == 200) {
        localStorage.setItem("userLanguageName", res.results.data[1][0].UserLanguage);
        this.getLanguageStorage()
      }

      // this.languageData = res.results['data'];
    });
  }

  getLanguageStorage() {
    this.loader = true;
    this.userLanguageName = JSON.parse(localStorage.getItem('userLanguageName'))
    // console.log('this.LanguageStore all', this.userLanguageName)
    if (this.userLanguageName == null || this.userLanguageName == undefined) {
      this.getLanguage();
    } else {
      let chlen = this.userLanguageName.length
      this.userLanguageName.forEach(element => {
        // if(element.ChannelName == 'Voice')
        // {
        //   this.userLanguageName = true;
        // }

        chlen--;
        if (chlen == 0) {
          this.loader = false
        }

      })
    }

  }



  gotoFormPage(val, data) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(val, data), 'gotoFormPage');

    this.router.navigate(["masters/branding/alert-setting/"], {
      queryParams: {
        formName: val,
        id: data == null ? 'undefined' : data.Id,
        master: "disposition"
      }
    });

  }

  contactAction(data) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(data), 'contactAction');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: "alert-setting",
        data: data,
        productID: this.productID,
        formType: 'edit'
      },
      width: '60vw',
      disableClose: true


    });
    dialogRef.afterClosed().subscribe(status => {
      if (status) {
        this.getAlertdetail();
      }
    });

  }

  previewAlert(data) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(data), 'previewAlert');

    if (data["Message Type"] == 'popup') {
      let dataVal = {
        alertMsg: data['Alert Message'],
        alertMsgDur: data['Alert Message Duration'],
        alertMsgPos: data['Alert Message Position'],
        alertMsgType: data['Message Type'],
        alertMsgSubType: data['Message Sub Type'],
        description: data['Message Body'],
        language: data['Language Code'],
        msgBody: data['Message Body'],
        msgHead: data['Message Head'],
        selectBtn: data['Button Type'],
        icon: data['Pop-Up Icon URL'],
        buttontype: data['Button Category'],
      }
      let data1 = {
        data: dataVal
      }
      this.common.previewAlertPopup(data1);

      // }
    } else {
      let s;

      if (data['Message Sub Type'].toLowerCase() == 'success') {
        s = 'greenMsg'
      } else if (data['Message Sub Type'].toLowerCase() == 'error') {
        s = 'redMsg'
      } else if (data['Message Sub Type'].toLowerCase() == 'warning') {
        s = 'yellowMsg'
      }
      return this.snackBar.open(data['Message Body'], 'x', {

        horizontalPosition:
          data["Alert Message Position"] == "bottom-center" ? 'center' :
            data["Alert Message Position"] == "bottom-right" ? 'right' :
              data["Alert Message Position"] == "bottom-left" ? 'left' :
                data["Alert Message Position"] == "top-left" ? 'left' :
                  data["Alert Message Position"] == "top-center" ? 'center' :
                    data["Alert Message Position"] == "top-right" ? 'right' :
                      data["Alert Message Position"] == "center" ? 'center' : 'right',

        verticalPosition:
          data["Alert Message Position"] == "bottom-center" ? 'bottom' :
            data["Alert Message Position"] == "bottom-right" ? 'bottom' :
              data["Alert Message Position"] == "bottom-left" ? 'bottom' :
                data["Alert Message Position"] == "top-left" ? 'top' :
                  data["Alert Message Position"] == "top-center" ? 'top' :
                    data["Alert Message Position"] == "top-right" ? 'top' : 'top',

        duration: data["Alert Message Duration"] ? data["Alert Message Duration"] * 1000 : 5000,
        // horizontalPosition: 'right',
        // verticalPosition: 'top',
        // duration: snackDuration? snackDuration:5000,
        panelClass: [s],
      });
    }
  }



  openDialog(type, data) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(data), 'openDialog');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        data: this.form.value.language,

      },
      width: '748px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(status => {

      if (status !== undefined) {

      }
    });
  }

  apiCall(method: any, data: any) {
    let obj;

    if (method == 'delete') {
      obj = {
        data: {
          spname: 'usp_unfyd_alert_msg_config',
          parameters: {
            flag: 'DELETE',
            ID: data.Actionable,
            DELETEDBY: this.userDetails.Id,
          },
        },
      };
    }
    this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(obj), 'apiCall');


    this.api.post('index', obj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        this.loader = false;
        var tempRes = res.results.data[0]
        // this.common.snackbar("Delete Record");
        // this.common.snackbar(res.results.data[0].result, "Delete Record")
        if (res.results.data[0].result == "Data deleted successfully") {
          this.common.snackbar('Delete Record');
        }
        // this.common.snackbar("Data Updated Sucessfully");

        this.getAlertdetail()
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("General Error");
      })

  }


  openDialogDelete(type, data) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(data), 'openDialogDelete');
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
      if (status.status == true) {
        this.apiCall(type, data)
      }




      this.subscriptionBulkDelete.forEach((e) => {
        e.unsubscribe();
      });
    }
    ))
  }
  //alert message
  bulkCheckboxCheck(event, element) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(event), 'bulkCheckboxCheck');

    let startingOfArray = this.page * this.itemsPerPage - this.itemsPerPage
    let endingOfArray: any;
    if (this.itemsPerPage * this.page > this.tabValue.length) {
      endingOfArray = this.tabValue.length
    } else {
      endingOfArray = this.page * this.itemsPerPage
    }
    for (let i = startingOfArray; i < endingOfArray; i++) {
      if (event) {
        if (this.tabValue[i] != undefined)
          this.tabValue[i].CHECKBOX = true
        this.allSelected = true;
      } else if (!event) {
        if (this.tabValue[i] != undefined)
          this.tabValue[i].CHECKBOX = false
        this.allSelected = false
      }
    }
    this.checkChecks();
  }


  singleCheckboxCheck(event, element) {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', JSON.stringify(event), 'singleCheckboxCheck');

    if (event) {
      //   this.tabValue.forEach(element => {
      element.CHECKBOX = true
      // });
    } else if (!event) {
      // this.tabValue.forEach(element => {
      element.CHECKBOX = false
      //   this.allSelected = false

      // });
    }
    this.checkChecks()
  }
  checkChecks() {
    this.common.hubControlEvent('AlertMessage', 'click', '', '', '', 'checkChecks');

    this.hasChecked = []
    let startingOfArray = this.page * this.itemsPerPage - this.itemsPerPage
    let endingOfArray: any;
    if (this.itemsPerPage * this.page > this.tabValue.length) {
      endingOfArray = this.tabValue.length
    } else {
      endingOfArray = this.page * this.itemsPerPage
    }
    for (let i = startingOfArray; i < endingOfArray; i++) {
      if (this.tabValue[i]?.CHECKBOX) {
        // if ( this.type == 'alert-setting') {
        this.hasChecked.push(this.tabValue[i].Actionable)
      }
      // else {
      //     this.hasChecked.push(this.tabValue[i].Id)
      // }
      // }
    }
    if (this.hasChecked.length == (endingOfArray - startingOfArray)) {
      this.allSelected = true
    } else {
      this.allSelected = false
    }

  }

  count = true
  sortUsers(by: string, order: string): void {
    if (by == 'Actionable') return
    if (by == 'Sr No') return

    this.finalField.map(data => {
      if (data.value === by) {
        if (!data.order) {
          data.order = 'desc'
        } else {
          data.order = (data.order === 'desc') ? 'asc' : 'desc';
        }
      } else {
        data.order = null
      }

    })
    if (by == 'Created On' || by == 'Modified On') {
      let x = this.tabValue.filter(n => n[by])
      let k = this.tabValue.filter(n => n[by] == null)
      let s = this.tabValue.filter(n => n[by] == '')
      let y = x.sort((a, b) => {
        const dateA = moment(a[by], this.format);
        const dateB = moment(b[by], this.format);
        return dateA.valueOf() - dateB.valueOf();
      });
      this.tabValue = [...y, ...k, ...s]
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
      return
    }
    if (by == 'Alert Message Duration') {
      let x = this.tabValue.filter(n => n[by])
      let k = this.tabValue.filter(n => n[by] == null)
      let s = this.tabValue.filter(n => n[by] == '')
      let y = x.sort((a, b) => parseInt(a[by]) - parseInt(b[by]));
      this.tabValue = [...y, ...k, ...s]
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
      return
    }

    let x = this.tabValue.filter(n => n[by])
    let k = this.tabValue.filter(n => n[by] == null)
    let s = this.tabValue.filter(n => n[by] == '')
    let y = x.sort((a, b) => a[by].localeCompare(b[by]))
    this.tabValue = [...y, ...k, ...s]




    this.count = !this.count
    this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}
