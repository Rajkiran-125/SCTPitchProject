import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/global/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { regex, masters } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  loader: boolean = false;
  submittedForm = false;
  masters: any;
  form: FormGroup;
  requestObj: { data: { spname: string; parameters: any } };
  userDetails: any;
  labelName: any;
  editobj: any;
  reset: boolean;
  config: any;
  typeTitle: any;
  type: any;
  tabKey: any = [];
  tabValue: any = [];
  noData: boolean = false;
  currentpage: number = 1;
  itemsPerPage: number = 10;
  paginationArray: any = [];
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  search: any;
  cityData: any;
  constructor(
    private formBuilder: FormBuilder,
    private common: CommonService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private location: Location,
    private el: ElementRef,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loader = true;
    this.userDetails = this.auth.getUser();
    this.getSnapShot();
    this.getFilter();
    this.feildChooser();
    this.getAccounts();
  }
  getAccounts(){
    this.requestObj = {
      data: {
        spname: 'usp_unfyd_accounts',
        parameters: {
          Flag: 'GET',
          ProcessId: this.userDetails.Processid,
          ProductId: 1
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe(res => {
      this.loader = false;
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          this.tabValue = [];
          this.tabKey = [];
          this.tabValue = res.results.data;
          for (var key in this.tabValue[0]) {
            if (this.tabValue[0].hasOwnProperty(key)) {
              this.tabKey.push(key);
            }
          }
          this.common.reportTabKeyData(this.tabKey);
          if (this.tabValue.length == 0) {
            this.noData = true
          } else {
            this.noData = false
          }
        }
      }
    });
  }
  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'account', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }
  contactAction(id, type) {
    if(type == 'addAccount'){
      const dialogRef = this.dialog.open(DialogComponent,{
        data : {
          type : type,
          id : id
        },
        width : '60%',
        height : '65%'
      });
      dialogRef.afterClosed().subscribe((status) => {
        if(status == true){
          this.getAccounts();      
        }
      });
    }
   }
  openDialog(type, id) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        title: 'Are you sure?',
        subTitle: 'Do you want to ' + type + ' this data',
      },
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(status => {
      if (status == true && type == 'delete') {
        this.requestObj = {
          data: {
            spname: 'usp_unfyd_accounts',
            parameters: {
              Flag: 'DELETE',
              Id : id,
              DeletedBy : this.userDetails.Id
            }
          }
        };
        this.api.post('index', this.requestObj).subscribe(res => {
          this.loader = true;
          if (res.code == 200) {
            if (res.results.data.length > 0) {
              this.common.snackbar(res.results.data[0].result,"Success");
              this.getAccounts();
            }
          }
        });
      }
    });
  }
  getSnapShot() {
    this.common.setUserConfig(this.userDetails.ProfileType, 'account');
    this.common.getUserConfig$.subscribe(data => {
      this.config = data;
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"));
  }
  get f() {
    return this.form.controls;
  }
  pageChange(currentpage) {
    this.currentpage = currentpage;
  }
  getFilter() {
    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });
    this.common.getSearch$.subscribe(data => {
      this.search = data
    });
    this.common.getLoaderStatus$.subscribe(data => {
      if (data == false) {
      }
    });
    this.common.getTableKey$.subscribe(data => {
      this.finalField = []
      this.finalField = data;
    });
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
          modulename: 'account',
          language: localStorage.getItem('lang')
        }
      }
    }
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
        this.finalField = [
          ...selctedField,
          ...unSelctedField
        ]
      }
    },
      (error) => {
      })
  }
}
