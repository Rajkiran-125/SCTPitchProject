import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { orderBy } from 'lodash';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { NgxSummernoteModule } from 'ngx-summernote';
import { Location } from '@angular/common';
import { element } from 'protractor';
import { error } from 'console';
import { param } from 'jquery';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { checknull, checknull1, emailtemp, regex } from 'src/app/global/json-data';
import { DomSanitizer } from '@angular/platform-browser';
import {MatChipInputEvent} from '@angular/material/chips';
import {encode,decode} from 'html-entities';
export class noSpaceValidator {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      if ((control.value && control.value as string).indexOf(' ') === 0) {
        return { cannotContainSpace: true }
      }

    }
    return null;
  }
}

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {
  @Input() public inputfilter: any;
  @Input() public ChannelIdInput: any;
  @Input() public ChannelUniqueCodeInput: any;
  tabKey: any = [];
  tabValue: any = [];
  format: any;
  page: number = 1;
  currentpage: number = 1;
  itemsPerPage: number = 8;
  paginationArray: any = [];
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  search: any;
  loader: boolean = false;
  userDetails: any;
  form: FormGroup;
  reset: boolean;
  emailtemp: any;
  labelname: any;
  ChannelIdInputParams: any;
  ChannelUniqueCodeInputParams: any;
  subscription: Subscription[] = [];
  subscriptionBulkDelete: Subscription[] = [];
  subscriptionAcitivateData: Subscription[] = [];
  EmailTempFormat: []
  obj: {}
  tab: any = 'TextView';
  ngxconfig = {
    placeholder: '',
    tabsize: 1,
    height: '250px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['fontsize', ['fontname']],
      ['style', ['bold', 'underline', 'italic',]],
      ['para', ['ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table']],
      ['font', ['clear']],
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    link: [['link', ['linkDialogShow', 'unlink']]],
  }
  head: any;
  submittedForm: boolean;
  allSelected: boolean = false
  hasChecked: any = []
  maxNo = false;
  filter: any;
  emailid: any;
  emailtoggleval: string;
  userConfig: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private location: Location,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer) {
    Object.assign(this, { emailtemp });

  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser(); 

    this.subscription.push(
      this.common.getMasterConfig$.subscribe((data) => {
        console.log(data, "adminconfig data")
        if (Object.keys(data).length > 0) {
          this.EmailTempFormat = JSON.parse(data["EmailTemplate"]);
          console.log(this.EmailTempFormat, "this.EmailTempFormat")
          // this.fieldList = this.EmailTempFormat.slice();
        }
      })
    )    
    this.filter = this.inputfilter;
    this.emailtoggleval = 'table';
    this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.queryParams.subscribe(params => {

      this.ChannelIdInputParams = params.channelid;
      this.ChannelUniqueCodeInputParams = params.uniquecode;
      this.subscription.push(this.common.reloadData$.subscribe((data) => {
        if (data == true) {
          this.getEmail();
          this.hasChecked = [];
        }
      }))

      if (this.inputfilter == undefined) {
        this.filter = params.filter;
      }
      else {
        this.filter = this.inputfilter;
      }

      this.emailid = params.Id;
      if (this.filter == 'email') {
        this.getEmail();
      }
      if (this.filter == 'add-email' || this.filter == 'edit-email') {
        this.emailForm();
      }
      // this.getSnapShot();
      this.getFilter();
      this.feildChooser();
    })
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'EmailConfiguration');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          
    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))

    this.common.setUserConfig(this.userDetails.ProfileType, 'Email-Template');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))

     
  }
  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelname = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'EmailConfiguration', data)
   
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  htmlDecodeTable(val){
    return decode(val)
}
  emailForm() {
    this.form = this.formBuilder.group({
      Template: ['', [Validators.required, Validators.maxLength(30)]],
      Description: ['', [Validators.nullValidator,Validators.minLength(3),Validators.maxLength(500)]],
      // Head: ['', Validators.required],
      Body: ['', Validators.required],
      // Footer: ['', Validators.required],
      System: ['', Validators.nullValidator],
      place: this.formBuilder.array([
        this.newplace(),
      ]),

    },
    { validator: [checknull1('Description'), checknull1('Template')] },);      
    var arrayControl = this.form.get('place') as FormArray;
    (arrayControl.at(0) as FormGroup).get('parameters').patchValue('P1');
    if (this.filter == 'edit-email') {
      this.loader = true;
      var obj = {
        data: {
          spname: "usp_unfyd_email_template",
          parameters: {
            FlAG: "EDIT",
            Id: this.emailid
          }
        }
      }
      this.api.post('index', obj).subscribe(res => {

        if (res.code == 200) {
          // this.editObj = res.results.data[0];
          const lowerObj = this.common.ConvertKeysToLowerCase();
          this.form.patchValue(lowerObj(res.results.data[0]));
          this.form.controls.Template.patchValue(res.results.data[0].TemplateName);

          var temp1 = JSON.parse('[' + JSON.parse(JSON.stringify(res.results.data[0].Parameters)) + ']');
          for (let i = 1; i < temp1.length; i++) {
            this.addplace();
          }
          var arrayControl = this.form.get('place') as FormArray;
          arrayControl.controls.forEach((element, index) => {
            (arrayControl.at(index) as FormGroup).get('parameters').patchValue(temp1[index].Parameter);
            (arrayControl.at(index) as FormGroup).get('holders').patchValue(temp1[index].Placeholder);
          });
          this.form.controls.Body.patchValue(res.results.data[0].HtmlView),
            this.form.controls.Description.patchValue(decode(res.results.data[0].Description)),
            // this.form.controls.System.patchValue(res.results.data[0].MsgHeaderVal),
          this.form.updateValueAndValidity();
          

          this.loader = false;
        }
        else {
          this.loader = false;
        }
      });
    }
  }

  getEmail() {
    this.loader = true;
    var obj = {
      data: {
        spname: "usp_unfyd_email_template",
        parameters: {
          FLAG: "GET",
          PROCESSID: 1,
          CHANNELID: this.ChannelIdInput,
          UNIQUEID: this.ChannelUniqueCodeInput
        }
      }
    }
    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.tabKey = []
        this.tabValue = []
        this.loader = false;
        this.tabValue = res.results.data;

        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
        this.common.reportTabKeyData(this.tabKey);
      }
    },
      (error) => {
        // this.common.snackbar("General Error");
        this.loader = true;
      })

  }
  back(){
    this.router.navigate(['/masters/channel-configuration/email-configuration/email-edit', this.ChannelIdInputParams, 'update', this.ChannelUniqueCodeInputParams,], { queryParams: { filter: 'emailTemplate' } });
   }
  resetEmail(){
    this.place().clear()
    setTimeout(() => {
      this.place().push(this.newplace());
      var arrayControl = this.form.get('place') as FormArray;
      (arrayControl.at(0) as FormGroup).get('parameters').patchValue('P1');
    }, 200);
  }

  deleteEmail(id){
    this.common.confirmationToMakeDefault('ConfirmationToDelete');
      this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {

        if (status.status) {
            this.obj = {
              data: {
                spname: "usp_unfyd_email_template",
                parameters: {
                  FLAG: "DELETE",
                  id: Number(id)
                }
              }
            }

            this.api.post("index", this.obj).subscribe(
              (res) => {
                if (res.code == 200) {
                  this.loader = true;
                  this.getEmail();
                  this.common.snackbar("Delete Record");
                  this.hasChecked = []
                } else {
                  this.loader = false;
                  this.common.snackbar("Something went wrong.", "error");
                }
              },
            );
          }
          this.subscriptionBulkDelete.forEach((e) => {
            e.unsubscribe();
        });
          // this.feildChooser()

      }
    ))
  }

  addToMessage(value) {
    let msg: any;
    if(this.form.value['Body'] === null) this.form.value['Body'] = ''
    msg = this.form.value['Body'] + '{{' + value + '}}';
    this.form.get('Body').patchValue(msg);
    this.form.get('System').patchValue('');
  }
  removeKeyword(keyword: string) {
    const index = this.form.value.System.indexOf(keyword);
    if (index >= 0) {
      this.form.value.System.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      // this.System.push(value);
      this.form.get('Body').patchValue(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  place(): FormArray {
    return this.form.get("place") as FormArray
  }
  newplace(): FormGroup {
    return this.formBuilder.group({
      parameters: new FormControl('', [Validators.required]),
      holders: new FormControl('', [Validators.required, noSpaceValidator.cannotContainSpace]),
    },
      { validator: [checknull('holders')] },

    )
  }
  addplace() {
    let placearr = this.place().controls.length
    this.place().push(this.newplace());
    let finalplacearr = placearr + 1;
    var arrayControl = this.form.get('place') as FormArray;
    (arrayControl.at(placearr) as FormGroup).get('parameters').patchValue('P' + finalplacearr);

  }
  removeplace(i: number) {
    this.place().removeAt(this.place.length - 1);
    this.form.updateValueAndValidity();
  }
  tabchange = 'TextView'
  onTabChange(event) {
    this.tab = event;
    this.tabchange = event
    // this.head = this.form.controls.Body.value
  }
  textDecode(data: any) {
    data = data.replace(/&/g, '&amp')
    data = data.replace(/'/g, '&apos')
    data = data.replace(/"/g, '&quot')
    data = data.replace(/>/g, '&gt')
    data = data.replace(/</g, '&lt');
    data = data.replace(/\//g, '/');
    return data;
  }
  textEncode(data: any) {
    data = data.replace('&amp', /&/g)
    data = data.replace('&apos', /'/g)
    data = data.replace('&quot', /"/g)
    data = data.replace('&gt', />/g)
    data = data.replace('&lt', /</g);
    data = data.replace('/', /\//g);
    return data;
  }


  emailPreview(type) {
    let temp = {
      ...this.form.value
    };
    const dia = this.dialog.open(DialogComponent, {
      data: {
        type: 'Emailpreview',
        emaildata: temp
      },
      width: '30%',
      height: '80%'
    });
  }
  bulkCheckboxCheck(event, element) {
    this.common.hubControlEvent('Masters', 'click', '', '', JSON.stringify(event, element), 'bulkCheckboxCheck');

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

  checkChecks() {
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
        this.hasChecked.push(this.tabValue[i].Actionable)
      }
    }
    if (this.hasChecked.length == (endingOfArray - startingOfArray)) {
      this.allSelected = true
    } else {
      this.allSelected = false
    }

  }
  bulkId: string[] = [];
  amt = 0;

  onCheckboxChecked(event: boolean, element) {
    if (event) {
      this.amt++
      this.bulkId.push(element);
    } else {
      let index = this.bulkId.indexOf(element);
      if (index > -1) {
        this.bulkId.splice(index, 1);
      }
      this.amt--
    }
    this.bulkId.length === 10 ? this.maxNo = true : this.maxNo = false

  }

  singleCheckboxCheck(event, element) {
    if (event) {
      element.CHECKBOX = true
    } else if (!event) {
      element.CHECKBOX = false
    }
    this.checkChecks()
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

    let x = this.tabValue.filter(n => n[by])
    let k = this.tabValue.filter(n => n[by] == null)
    let s = this.tabValue.filter(n => n[by] == '')
    let y = x.sort((a, b) => a[by].toString().localeCompare(b[by]))
    this.tabValue = [...y, ...k, ...s]
    this.count = !this.count
    this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)

  }
  pageChange(currentpage) {
    this.common.hubControlEvent('hsm-template', 'click', '', '', JSON.stringify(currentpage), 'pageChange');

    this.currentpage = currentpage;
  }

  getFilter() {
    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });


    this.common.emailtabletoggle$.subscribe(data => {
      this.emailtoggleval = data
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
          modulename: 'email-template',
          language: localStorage.getItem('lang')
        }
      }
    }
    this.common.hubControlEvent('hsm-template', 'click', '', '', JSON.stringify(obj), 'feildChooser');

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
  submit(event): void {
    this.loader = true;
    var parameterArray = [];
    this.submittedForm = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }
      parameterArray = (this.form.get('place') as FormArray).value;
      var temp2 = [];
      parameterArray.forEach(element => {

        temp2.push('{"Parameter" : "' + element.parameters + '","Placeholder" : "' + element.holders.trim() + '" }');

      });
      this.obj = {
        data: {
          spname: 'usp_unfyd_email_template',
          parameters: {
            FLAG: this.emailid == null ? "INSERT" : "UPDATE",
            TemplateName: this.form.value.Template == null ? null : this.form.value.Template.trim(),
            Description: encode(this.form.value.Description == null ? null : this.form.value.Description.trim()),
            HtmlView:this.form.value.Body,
            Parameters: temp2.join(","),
            CHANNELID: this.ChannelIdInputParams,
            UNIQUEID: this.ChannelUniqueCodeInputParams,
            processid: this.userDetails.Processid,
            productid: this.userDetails.ProductId,
            publicip: this.userDetails.ip,
            CREATEDBY: this.emailid == null ? Number(this.userDetails.Id) : undefined,
            ModifiedBY: this.emailid == null ? undefined : Number(this.userDetails.Id),
            ID: this.emailid == null ? undefined : Number(this.emailid),
            privateip: '',
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version
          }

        }
      }
    this.api.post('index', this.obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        if (res.results.data[0].result == "Data added successfully") {
          this.common.snackbar('Record add');
          if (event == 'add') {
            this.back();
          } else if (event == 'saveAndAddNew') {
            window.location.reload();
            this.form.reset()
          }
        }
        else if (res.results.data[0].result.includes('updated successfully')) {
          this.common.snackbar('Update Success');
          if (event == 'add') {
            this.back();
          } else if (event == 'saveAndAddNew') {
            window.location.reload();
            this.form.reset()
          }
        }
        else if (res.results.data[0].Status == true) {

          this.common.confirmationToMakeDefault('AcitvateDeletedData');
          this.subscriptionAcitivateData.push(
            this.common.getIndividualUpload$.subscribe(status => {
              if (status.status) {
                // this.loader = true;
                this.obj = {
                  data: {
                    spname: "usp_unfyd_email_template",
                    parameters: {
                      flag: 'ACTIVATE',
                      TemplateName: this.form.value.Template == null ? null : this.form.value.Template.trim(),
                      Description: encode(this.form.value.Description == null ? null : this.form.value.Description.trim()),
                      HtmlView: this.form.value.Body,
                      Parameters: temp2.join(","),
                      CHANNELID: this.ChannelIdInputParams,
                      UNIQUEID: this.ChannelUniqueCodeInputParams,
                      processid: this.userDetails.Processid,
                      productid: this.userDetails.ProductId,
                      publicip: this.userDetails.ip,
                      CREATEDBY: this.emailid == null ? Number(this.userDetails.Id) : undefined,
                      ModifiedBY: this.emailid == null ? undefined : Number(this.userDetails.Id),
                      ID: this.emailid == null ? undefined : Number(this.emailid),
                      privateip: '',
                      browsername: this.userDetails.browser,
                      browserversion: this.userDetails.browser_version
                    }
                  }
                };


                this.api.post('index', this.obj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.common.snackbar('Record add');
                    if (event == 'add') {
                      this.back();
                    } if (event == 'saveAndAddNew') {
                      window.location.reload();
                      this.form.reset()
                    }
                  }
                });

              }

              this.subscriptionAcitivateData.forEach((e) => {
                e.unsubscribe();
              });
            }))


        }
        else if ((res.results.data[0].result == "Data already exists") && (res.results.data[0].Status == false)) {
          this.common.snackbar('Data Already Exist');
        }

      }
    });



  }



}
