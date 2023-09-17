import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { orderBy } from 'lodash';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
import { regex, masters, checknull, checknull1 } from 'src/app/global/json-data';
import { NgxSummernoteModule } from 'ngx-summernote';
import { Location } from '@angular/common';
import { element } from 'protractor';
import { error } from 'console';
import { param } from 'jquery';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import moment from 'moment';

    
export class noSpaceValidator {  
  static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {  
    if(control.value){
      if((control.value && control.value as string).indexOf(' ') === 0){  
          return {cannotContainSpace: true}  
      }  
                  
    }
      return null;  
  }  
} 

@Component({
  selector: 'app-hsm-template',
  templateUrl: './hsm-template.component.html',
  styleUrls: ['./hsm-template.component.scss']
})
export class HsmTemplateComponent implements OnInit {
  @Input() public inputfilter: any;
  @Input() public ChannelIdInput: any;
  @Input() public ChannelUniqueCodeInput: any;




  ngxconfig={
    placeholder: '',
    tabsize: 1,
    height: '200px',
    uploadImagePath: '/api/upload',

    toolbar: [
      ['fontsize', ['fontname']],

      ['style', ['bold', 'underline', 'italic',]],

      ['para', ['ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table']],
      ['font', ['clear']],


    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  }



  loader: boolean = false;
  filter: any;
  form: FormGroup;
  submittedForm: boolean = false;
  labelname: any;
  actionname: any;
  reset: boolean;
  userDetails: any;
  data: any;
  skillId: any;
  masters: any;
  desc: any;
  value = "Dear friend,";
  maxlength: any;
  charachtersCount: number;
  counter: string;
  message: string;
  MAXCHARACTER = 1024;
  MAXCHAR = 60;
  hsminfo: any = [];
  requestObj: any;
  hsmid: any;
  editObj: any;
  id: any;
  tabKey: any = [];
  tabValue: any = [];
  page: number = 1;
  currentpage: number = 1;
  itemsPerPage: number = 8;
  paginationArray: any = [];
  selctedField: any[] = [];
  unSelctedField: any[] = [];
  finalField: any[] = [];
  search: any;
  labelName: any;
  config: any;
  preview: boolean;
  hsmbody: any = {
    name: 'abc',
    name1: 12
  };
  isShow: boolean;
  name = ""
  msgImg = ""
  hsmtoggleval: any;
  allSelected: boolean = false
  hasChecked: any = []
  maxNo = false;

  subscription: Subscription[] = [];

  errorval: boolean= false;

  @ViewChild('video')

public video: ElementRef;
  docfileext: any;
  disableplaceadd: boolean = false;
  ChannelIdInputParams: any;
  ChannelUniqueCodeInputParams: any;
  userConfig: any;
  subscriptionBulkDelete: Subscription[] = [];
  // type: string;
type: any='';
subscriptionAcitivateData: Subscription[] = [];
  templatename: any;
  footerRequired: boolean =false;
  ActionRequired: boolean =false;
  MessageHeaderRequired: boolean  =false;
  dateformat: any;
  format: any;
// @Input() type: any = '';
  

playVideo(url: string) {
  this.common.hubControlEvent('ChannelConfiguration','click','','',url,'playVideo');

    this.video.nativeElement.src = url;
    this.video.nativeElement.load();
    this.video.nativeElement.play();
  }

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private common: CommonService,
    private api: ApiService,
    private el: ElementRef,
    private location: Location,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    
    this.common.hubControlEvent('hsm-template','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'HSM-Template');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data
          
    }))
    this.subscription.push(this.common.reloadData$.subscribe((data) => {
      if(data == true){
        this.getHsm();
        this.hasChecked= [];
      }
    })) 
    this.dateformat = JSON.parse(localStorage.getItem("localizationData"));
    this.format = this.dateformat.selectedDateFormats.toUpperCase().concat(" ",this.dateformat.selectedTimeFormats)

    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.filter = this.inputfilter;
    this.hsmtoggleval = 'table';
    this.charachtersCount = this.value ? this.value.length : 0;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
    this.userDetails = this.auth.getUser();
    this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.queryParams.subscribe(params => {

      this.ChannelIdInputParams=params.channelid;
      this.ChannelUniqueCodeInputParams= params.uniquecode;
      this.subscription.push(this.common.reloadData$.subscribe((data) => {
        if(data == true){
          this.getHsm();
          this.hasChecked= [];
        }
      })) 

      if(this.inputfilter == undefined)
      {
        this.filter = params.filter;
      }
      else{
        this.filter = this.inputfilter;
      }

      this.hsmid = params.Id;
      if (this.filter == 'hsm') {
        this.getHsm();
      }
      if (this.filter == 'add-hsm' || this.filter == 'edit-hsm') {
        this.hsmForm();
      }
      this.getSnapShot();
      this.getFilter();
      this.feildChooser();
    })
    this.common.hubControlEvent('hsm-template','click','pageloadend','pageloadend','','ngOnInit');
  }

  


  setLabelByLanguage(data) {
    this.common.hubControlEvent('hsm-template','click','','',data,'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ChannelConfiguration', data)
   
  }
  getSnapShot() {
    this.common.hubControlEvent('hsm-template','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
    this.common.setUserConfig(this.userDetails.ProfileType, 'hsm-template');
    this.subscription.push(this.common.getUserConfig$.subscribe(data => {
      this.config = data;
    }));
  });
    
  }
  viewPreview(id, val, event) {
    this.common.hubControlEvent('hsm-template','click','','',val,'viewPreview');

  

    const dialogRef = this.dialog.open(DialogComponent,{
      data: {
        type: 'HSM_Preview',
        hsmbodyval : val,
      },
      height: "600px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(status => {

    });




  }



  HsmApiOption(id, val, event) {
    this.common.hubControlEvent('hsm-template','click','','',JSON.stringify(id, val, event),'HsmApiOption');


    const dialogRef = this.dialog.open(DialogComponent,{
      data: {
        type: 'HsmApiOption',
        hsmbodyval : val,
      },
      height: "600px",
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(status => {
     
    });




  }


  update(e) {
    this.common.hubControlEvent('hsm-template','click','','',JSON.stringify(e),'update');

    this.preview = e;
  }
  getHsm() {
    this.loader = true;
    var obj = {
      data: {
        spname: "usp_unfyd_hsm_template",
        parameters: {
          FLAG: "GET_HSM",
          PROCESSID: this.userDetails.Processid,
          CHANNELID:this.ChannelIdInput,
          UNIQUEID: this.ChannelUniqueCodeInput
        }
      }
    }
    this.common.hubControlEvent('hsm-template','click','','',JSON.stringify(obj),'getHsm');

    this.api.post('index', obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        this.tabKey = [];
        this.tabValue = [];
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

  hsmForm() {
    this.common.hubControlEvent('hsm-template','click','','','','hsmForm');

    this.form = this.formBuilder.group({
      template: ['', [Validators.required, Validators.pattern(regex.templatename), Validators.maxLength(30)]],
      space: ['', Validators.required],
      body: ['', Validators.required],
      messageheader: ['', Validators.required],
      messageheaderval: ['', Validators.required],
      footer: ['', Validators.required],
      action: ['', Validators.required],
      hsmcheckbox:['',Validators.nullValidator],

      place: this.formBuilder.array([
        this.newplace(),
      ]),
      QuckReply: this.formBuilder.array([
        this.newQuckReply(),
      ]),
      Listoption: this.formBuilder.array([
        this.newListoption(),
      ]),
      Calltoaction: this.formBuilder.array([
        this.newCalltoaction(),
      ])
    },
    {validator:[checknull1('space'),checknull1('template')]},

    );


    var arrayControl = this.form.get('place') as FormArray;
    (arrayControl.at(0) as FormGroup).get('parameters').patchValue('P1');


    if (this.filter == 'edit-hsm') {
      this.loader=true;
      var obj = {
        data: {
          spname: "usp_unfyd_hsm_template",
          parameters: {
            FlAG: "EDIT",
            Id: this.hsmid
          }
        }
      }
      this.common.hubControlEvent('hsm-template','click','','',JSON.stringify(obj),'hsmForm');

      this.api.post('index', obj).subscribe(res => {

        if (res.code == 200) {
          this.editObj = res.results.data[0];
          const lowerObj = this.common.ConvertKeysToLowerCase();
          this.form.patchValue(lowerObj(this.editObj));
          this.form.controls.template.patchValue(res.results.data[0].TemplateName),
            this.form.controls.action.patchValue(res.results.data[0].Action == 'QuickReply' ? 'QuckReply' : res.results.data[0].Action),
            this.actionTab = res.results.data[0].Action == 'QuickReply' ? 'QuckReply' : res.results.data[0].Action;
          this.actionname = res.results.data[0].Action == 'QuickReply' ? 'QuckReply' : res.results.data[0].Action;
          this.labelname = res.results.data[0].MsgHeader;
          if(res.results.data[0].Action == 'QuickReply')
          {
            this.Listoption().clear()
            this.Calltoaction().clear()
          }
          if(res.results.data[0].Action == 'Listoption')
          {
            this.QuckReply().clear()
            this.Calltoaction().clear()
          }
          if(res.results.data[0].Action == 'Calltoaction')
          {
            this.QuckReply().clear()
            this.Listoption().clear()
          }

          this.msgImg = res.results.data[0].MsgHeaderVal;
          if(  this.labelname == 'Document' ){
            this.docfileext =  this.msgImg.split('.').pop();
          }
    

          var temp1 = JSON.parse('[' + JSON.parse(JSON.stringify(res.results.data[0].Parameters)) + ']');
            for (let i = 1; i < temp1.length; i++) {
              this.addplace();
            }
            var arrayControl = this.form.get('place') as FormArray;
            arrayControl.controls.forEach((element, index) => {
              (arrayControl.at(index) as FormGroup).get('parameters').patchValue(temp1[index].Parameter);
              (arrayControl.at(index) as FormGroup).get('holders').patchValue(temp1[index].Placeholder);
            });




          var temp = JSON.parse('[' + JSON.parse(JSON.stringify(res.results.data[0].ActionVal)) + ']');
          if (this.actionTab == 'QuckReply') {
            for (let i = 1; i < temp.length; i++) {
              this.addQuckReply();
            }
            var arrayControl = this.form.get('QuckReply') as FormArray;
            arrayControl.controls.forEach((element, index) => {
              (arrayControl.at(index) as FormGroup).get('keyname').patchValue(temp[index].Key);
              (arrayControl.at(index) as FormGroup).get('buttoncaption').patchValue(temp[index].Value);
            });
          }
          if (this.actionTab == 'Listoption') {
            for (let i = 1; i < temp.length; i++) {
              this.addListoption();
            }
            var arrayControl = this.form.get('Listoption') as FormArray;
            arrayControl.controls.forEach((element, index) => {
              (arrayControl.at(index) as FormGroup).get('keyname').patchValue(temp[index].Key);
              (arrayControl.at(index) as FormGroup).get('listHeader').patchValue(temp[index].Header);
              (arrayControl.at(index) as FormGroup).get('listDescription').patchValue(temp[index].Description);
            });
          }
          if (this.actionTab == 'Calltoaction') {
            for (let i = 1; i < temp.length; i++) {
              this.addCalltoaction();
            }
            var arrayControl = this.form.get('Calltoaction') as FormArray;
            arrayControl.controls.forEach((element, index) => {
              (arrayControl.at(index) as FormGroup).get('keyname').patchValue(temp[index].Key);
              (arrayControl.at(index) as FormGroup).get('url').patchValue(temp[index].Url);
            });
          }
          this.form.controls.body.patchValue(res.results.data[0].Body),
            this.form.controls.footer.patchValue(res.results.data[0].Footer),
            this.form.controls.messageheaderval.patchValue(res.results.data[0].MsgHeaderVal),
            this.form.controls.messageheader.patchValue(res.results.data[0].MsgHeader),
            this.form.controls.space.patchValue(res.results.data[0].NameSpace),
            this.form.controls.hsmcheckbox.patchValue(res.results.data[0].IsSystemHSM)
            this.form.updateValueAndValidity();
          var hsmCard = res.results.data[0];
          this.form.patchValue({
            template: hsmCard.TemplateName,
            body: hsmCard.Body
          })
          this.name = hsmCard.Body;

          this.loader = false;
        }
        else
        {
          this.loader = false;
        }
      });
    }

  }
 

  deletehsm(id) {

    this.common.confirmationToMakeDefault('ConfirmationToDelete');
    this.subscriptionBulkDelete.push(this.common.getIndividualUpload$.subscribe(status => {
  
      if (status.status) {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_hsm_template",
        parameters: {
          FLAG: "DELETE",
          id: Number(id)
        }
      }
    }
    this.common.hubControlEvent('hsm-template','click','','',JSON.stringify( this.requestObj),'deletehsm');

    this.api.post("index", this.requestObj).subscribe(
      (res) => {
        if (res.code == 200) {
          this.loader = true;
          this.getHsm();
          this.common.snackbar("Delete Record");
          this.hasChecked=[]

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
  onValueChange(ev: string): void {
    this.common.hubControlEvent('hsm-template','onchange','','','','onValueChange');
    console.log('abc');
    
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }

  videoformat(e)
  {
    this.common.hubControlEvent('hsm-template','click','','',e,'videoformat');

    this.video.nativeElement.load();
    this.video.nativeElement.play();
  }

  documentformat(e)
  {
    this.common.hubControlEvent('hsm-template','click','','',e,'documentformat');

    this.docfileext =  e.split('.').pop();
  }

  onChange(e, type) {
    this.common.hubControlEvent('hsm-template','onChange','','',e,'onChange');

    this.labelname = type == 'Image' ? 'Image' : type == 'Video' ? 'Video' : type == 'Document' ? 'Document' : type == 'Location' ? 'Location' : type == 'Text' ? 'Text ' : '';
    this.msgImg = e;
  }
  place(): FormArray {
    return this.form.get("place") as FormArray
  }
  newplace(): FormGroup {
    return this.formBuilder.group({
      parameters: new FormControl('', [Validators.required]),
      holders: new FormControl('', [Validators.required,noSpaceValidator.cannotContainSpace]),
    },
    {validator:[checknull('holders')]},

    )
  }
  addplace() {
    let placearr = this.place().controls.length

    this.place().push(this.newplace());


    let finalplacearr = placearr + 1;

    var arrayControl = this.form.get('place') as FormArray;
    (arrayControl.at(placearr) as FormGroup).get('parameters').patchValue('P'+finalplacearr);

  }
  removeplace(i: number) {
    this.place().removeAt(this.place.length-1);
    this.form.updateValueAndValidity();
  }
  gallery(e) {
    this.MessageHeaderRequired = false;

    this.labelname = e.value == 'Image' || e.value == 'Document' || e.value == 'Video' || e.value == 'Location' || e.value == 'Text' ? e.value : ''
  }
  actionTab: any;
  actions(e) {
    this.ActionRequired = false;
    this.actionTab = e.value;
    this.actionname = e.value == 'QuckReply' || e.value == 'Listoption' || e.value == 'Calltoaction' ? e.value : '';

    if(this.actionTab == 'QuckReply')
    {
      if(this.QuckReply().controls.length == 0)
      {
        this.QuckReply().push(this.newQuckReply());
      }    
      var arrayControl = this.form.get('QuckReply') as FormArray;
      (arrayControl.at(0) as FormGroup).get('keyname').patchValue('Yes');
      this.Listoption().clear()
      this.Calltoaction().clear()
      
      
    }
    if(this.actionTab == 'Listoption')
    {
      if(this.Listoption().controls.length == 0)
      {
        this.Listoption().push(this.newListoption());
      }
     
      var arrayControl = this.form.get('Listoption') as FormArray;
      (arrayControl.at(0) as FormGroup).get('keyname').patchValue('Key1');
  
      this.QuckReply().clear()
      this.Calltoaction().clear()
    }
    if(this.actionTab == 'Calltoaction')
    {
      if(this.Calltoaction().controls.length == 0)
      {
        this.Calltoaction().push(this.newCalltoaction());
      }
    
      var arrayControl = this.form.get('Calltoaction') as FormArray;
      (arrayControl.at(0) as FormGroup).get('keyname').patchValue('Buy Now');
      this.QuckReply().clear()
      this.Listoption().clear()
    }

    this.common.hubControlEvent('hsm-template','click','','',e,'actions');
  }



// resetForm(){
//   this.form.reset();
// }



  QuckReply(): FormArray {    
    return this.form.get("QuckReply") as FormArray
  }
  newQuckReply(): FormGroup {    
    return this.formBuilder.group({
      keyname: new FormControl('', [Validators.required]),
      buttoncaption: new FormControl('', [Validators.required,noSpaceValidator.cannotContainSpace])
    },
    {validator:[checknull('buttoncaption')]},

    )
  }
  addQuckReply() {
    this.QuckReply().push(this.newQuckReply());


    if(this.QuckReply().controls.length == 2)
    {
      let quckarr = this.QuckReply().controls.length - 1

      var arrayControl = this.form.get('QuckReply') as FormArray;
      (arrayControl.at(quckarr) as FormGroup).get('keyname').patchValue('No');
    }
    if(this.QuckReply().controls.length == 3)
    {
      let quckarr = this.QuckReply().controls.length - 1

      var arrayControl = this.form.get('QuckReply') as FormArray;
      (arrayControl.at(quckarr) as FormGroup).get('keyname').patchValue('Agent');
    }
  }
  removeQuckReply(i: number) {

    this.QuckReply().removeAt(this.QuckReply.length-1);
  }



  Listoption(): FormArray {    
    return this.form.get("Listoption") as FormArray
  }
  newListoption(): FormGroup {  
    return this.formBuilder.group({
      keyname: new FormControl('', [Validators.required]),
      listHeader: new FormControl('', [Validators.required,noSpaceValidator.cannotContainSpace]),
      listDescription: new FormControl('', [Validators.nullValidator,Validators.minLength(3),Validators.maxLength(300)])
    },
    {validator:[checknull('listHeader'),checknull1('listDescription')]},
    )
  }
  addListoption() {


    let ListoptioneArr = this.Listoption().controls.length

    this.Listoption().push(this.newListoption());

    let finalListoptioneArr = ListoptioneArr + 1;

    var arrayControl = this.form.get('Listoption') as FormArray;
    (arrayControl.at(ListoptioneArr) as FormGroup).get('keyname').patchValue('Key'+finalListoptioneArr);
  }
  removeListoption(i: number) {

    this.Listoption().removeAt(this.Listoption.length-1);
  }



  Calltoaction(): FormArray {
    return this.form.get("Calltoaction") as FormArray
  }
  newCalltoaction(): FormGroup {    
    return this.formBuilder.group({
      keyname: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required,noSpaceValidator.cannotContainSpace]),

    })
  }
  addCalltoaction() {
    let CalltoactionArr = this.Calltoaction().controls.length
    this.Calltoaction().push(this.newCalltoaction());
    let finalCalltoactionArr = CalltoactionArr + 1;

    var arrayControl = this.form.get('Calltoaction') as FormArray;
    (arrayControl.at(CalltoactionArr) as FormGroup).get('keyname').patchValue('Buy Now');





  }
  removeCalltoaction(i: number) {


    this.Calltoaction().removeAt(this.Calltoaction.length-1);
  }

  TypeFooter(){
 this.footerRequired = false
  }


  submit(event): void { 

    this.loader = true;
    this.submittedForm = true;
    var actionArrayControl = [];
    var paraArrayControl = [];
    var PLACEparaArrayControl = [];

    

    if (this.form.invalid) {
      this.form.markAllAsTouched()
   
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if(key == "messageheader")
        {
          if(!this.form.value.messageheader)
          {
          this.loader = false;
          // this.common.snackbar('HsmMesgHeaderRequired');\
          this.errorval = true;
          this.MessageHeaderRequired = true;
          return;
          }
          
        }


        if(key == "place")
        {
          this.form.value.place.forEach(element => {
              if(element.parameters == '')
              {
                this.loader = false;
                // this.common.snackbar('HsmParameterRequired');
                this.errorval = true;
                return;
              }
              else if(element.holders == '')
              {
                this.loader = false;
                // this.common.snackbar("HsmPlaceholderRequired");
                this.errorval = true;
                return;
              }
          });
        }


        if(key == "action")
        {
          if(this.form.value.action == "" || this.form.value.action == null)
          {
          this.loader = false;
          // this.common.snackbar('HsmActionRequired');
          this.ActionRequired = true;
          this.errorval = true;
          return;
          }
        }
        if(key == "footer")
        {
          if(this.form.get('footer').value == '' || this.form.get('footer').value == null)        {
          this.loader = false;
          // this.common.snackbar('FooterIsRequired');
          this.footerRequired = true;
          this.errorval = true;
          return;
        }
        }
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
        }
      }
      return;
    }

    

 
   
    // if(this.form.get('footer').value == '')
    // {
    //   this.loader = false;
    //   // this.common.snackbar('FooterIsRequired');
    //   this.footerRequired = true;
    //   this.errorval = true;
    //   return;
    // }

    if (this.actionTab == 'QuckReply') {
      this.errorval = false;
      this.form.value.QuckReply.forEach(element => {
        if(element.keyname == '')
        {
          this.loader = false;
          this.common.snackbar('HsmKeynameRequired');
          this.errorval = true;
          return;
        }
        else if(element.buttoncaption == '')
        {
          this.loader = false;
          this.common.snackbar('HsmButtonCaptionRequired');
          this.errorval = true;
          return;
        }
        
    });


    } else if (this.actionTab == 'Listoption') {
      this.errorval = false;
      this.form.value.Listoption.forEach(element => {
        if(element.keyname == '')
        {
          this.loader = false;
          this.common.snackbar('HsmKeynameRequired');
          this.errorval = true;
          return;
        }
        else if(element.listHeader == '')
        {
          this.loader = false;
          this.common.snackbar('HsmHeaderRequired');
          this.errorval = true;
          return;
        }
       
    });
    } else if (this.actionTab == 'Calltoaction') {
      this.errorval = false;
      this.form.value.Calltoaction.forEach(element => {
        if(element.keyname == '')
        {
          this.loader = false;
          this.common.snackbar('HsmKeynameRequired');
          this.errorval = true;
          return;
        }
        else if(element.url == '')
        {
          this.loader = false;
          this.common.snackbar('HsmUrlRequired');
          this.errorval = true;
          return;
        }
    });


    }

    
    if(this.errorval ==  true)
    {
      return;
    }
    var obj: object;
  
    if (this.skillId == null ) {

      

      PLACEparaArrayControl = (this.form.get('place') as FormArray).value;
      var temp2place = [];
      PLACEparaArrayControl.forEach(element => {
        temp2place.push(element.holders);
      });

      paraArrayControl = (this.form.get('place') as FormArray).value;
      var temp2 = [];
      paraArrayControl.forEach(element => {

        temp2.push('{"Parameter" : "' + element.parameters + '","Placeholder" : "' + element.holders.trim() + '","Placeholder2" : " ${{' + element.holders.trim() + '}} "}');

      });
      if (this.actionTab != null || this.actionTab != undefined) {
        if (this.actionTab == 'QuckReply') {
          actionArrayControl = (this.form.get('QuckReply') as FormArray).value;
        } else if (this.actionTab == 'Listoption') {
          actionArrayControl = (this.form.get('Listoption') as FormArray).value;
        } else if (this.actionTab == 'Calltoaction') {
          actionArrayControl = (this.form.get('Calltoaction') as FormArray).value;
        }
      }
      var temp = [];
      actionArrayControl.forEach(element => {
        if (this.actionTab == 'QuckReply') {
          temp.push('{"Key" : "' + element.keyname + '","Value" : "' + element.buttoncaption.trim() + '"}');
        }
        else if (this.actionTab == 'Listoption') {
          temp.push('{"Key": "' + element.keyname + '","Header" : "' + element.listHeader.trim() + '","Description" :"' + element.listDescription.trim() + '"}');
        }
        else if (this.actionTab == 'Calltoaction') {
          temp.push('{"Key": "' + element.keyname + '","Url" : "' + element.url.trim() + '"}');
        }
      });
      this.loader = false;
      obj = {
        data: {
          spname: "usp_unfyd_hsm_template",
          parameters: {
            FLAG: this.hsmid == null ? "INSERT" : "UPDATE",
            TEMPLATENAME: this.form.get('template').value.trim(),
            NAMESPACE: this.form.get('space').value.trim(),
            MSGHEADER: this.form.get('messageheader').value,  
            MSGHEADERVAL: this.form.get('messageheaderval').value.trim(),
            BODY: this.form.get('body').value,
            PARAMETERS: temp2.join(","),
            FOOTER: this.form.get('footer').value.trim(),
            ACTION: this.form.get('action').value == "QuckReply" ? 'QuickReply' : this.form.get('action').value,
            ACTIONVAL: temp.join(","),
            PROCESSID: this.userDetails.Processid,
            CREATEDBY: this.hsmid == null ? Number(this.userDetails.Id) : undefined,
            ModifiedBY: this.hsmid == null ? undefined : Number(this.userDetails.Id),
            ID: this.hsmid == null ? undefined : Number(this.hsmid),
            PARAMETERVALUE: temp2place.join("^"),
            CHANNELID:this.ChannelIdInputParams,
            UNIQUEID:this.ChannelUniqueCodeInputParams,
            ISSYSTEMHSM:this.form.value.hsmcheckbox
          }
        }
      }
      this.common.hubControlEvent('hsm-template','click','','',JSON.stringify(obj),'submit');

      this.api.post('index', obj).subscribe(res => {
        console.log(obj,"HSM obj")
        console.log(res,"HSM response")
        this.submittedForm = false
        if (res.code == 200) {
          this.loader = false;
          if (res.results.data[0].result == "Data added successfully") {
            this.common.snackbar('Record add');
            if (event == 'add') {
              this.backClicked();
            } else if (event == 'saveAndAddNew') {
              window.location.reload();
              this.form.reset()
            }
          }
          else if (res.results.data[0].result.includes('updated successfully')) {
            this.common.snackbar('Update Success');
            if (event == 'add') {
              this.backClicked();
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
                  this.requestObj = {
                    data: {
                      spname: "usp_unfyd_hsm_template",
                      parameters: {
                        flag: 'ACTIVATE',
                        TEMPLATENAME: this.form.get('template').value,
                        NAMESPACE: this.form.get('space').value,
                        MSGHEADER: this.form.get('messageheader').value,
                        MSGHEADERVAL: this.form.get('messageheaderval').value,
                        BODY: this.form.get('body').value,
                        PARAMETERS: temp2.join(","),
                        FOOTER: this.form.get('footer').value,
                        ACTION: this.form.get('action').value == "QuckReply" ? 'QuickReply' : this.form.get('action').value,
                        ACTIONVAL: temp.join(","),
                        PROCESSID: this.userDetails.Processid,
                        CREATEDBY: this.hsmid == null ? Number(this.userDetails.Id) : undefined,
                        ModifiedBY: this.hsmid == null ? undefined : Number(this.userDetails.Id),
                        ID: this.hsmid == null ? undefined : Number(this.hsmid),
                        PARAMETERVALUE: temp2place.join("^"),
                        CHANNELID: this.ChannelIdInputParams,
                        UNIQUEID: this.ChannelUniqueCodeInputParams
                      }
                    }
                  };


                  this.api.post('index', this.requestObj).subscribe((res: any) => {
                    if (res.code == 200) {
                      this.common.snackbar('Record add');
                      if (event == 'add') {
                        this.backClicked();
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
        } else {
          this.loader = false;
          this.backClicked()
        }
      },
        (error) => {
          this.loader = false;
          this.common.snackbar("General Error");
        })
    }
  }


  

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  pageChange(currentpage) {
    this.common.hubControlEvent('hsm-template','click','','',JSON.stringify(currentpage),'pageChange');

    this.currentpage = currentpage;
  }
  
  getFilter() {
    this.common.hubControlEvent('hsm-template','click','','','','getFilter');

    this.common.getItemsPerPage$.subscribe(data => {
      this.itemsPerPage = data
    });


    this.common.hsmtabletoggle$.subscribe(data => {
      this.hsmtoggleval = data
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
          modulename: 'hsm-template',
          language: localStorage.getItem('lang')
        }
      }
    }
    this.common.hubControlEvent('hsm-template','click','','',JSON.stringify(obj),'feildChooser');

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
  featureHide() {
  };


  backClicked() {
    this.common.hubControlEvent('hsm-template','click','backClicked','backClicked','','backClicked');

    // this.location.back();
    this.router.navigate(['/masters/channel-configuration/channel-configuration-edit',this.ChannelIdInputParams,'update',this.ChannelUniqueCodeInputParams,], { queryParams: { filter: 'HsmTemplate' } });
  }

  convertToPlain(html){

    // Create a new div element
    var tempDivElement = document.createElement("div");
  
    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;
  
    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
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
        let x=this.tabValue.filter(n => n[by])
        let k=this.tabValue.filter(n => n[by]==null)
        let s=this.tabValue.filter(n => n[by]=='')
        let y = x.sort((a, b) => {
            const dateA = moment(a[by], this.format);
            const dateB = moment(b[by], this.format);
            return dateA.valueOf() - dateB.valueOf();
        });
          this.tabValue=[...y, ...k, ...s]
          this.count = !this.count
          this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
          return
      }

      let x=this.tabValue.filter(n => n[by])
      let k=this.tabValue.filter(n => n[by]==null)
      let s=this.tabValue.filter(n => n[by]=='')
      let y=x.sort((a, b) =>a[by].toString().localeCompare(b[by]))
      this.tabValue=[...y, ...k, ...s]
      this.count = !this.count
      this.tabValue = this.count == true ? this.tabValue = orderBy(this.tabValue.reverse(), order) : this.tabValue = orderBy(this.tabValue.sort(), order)
   
  }

  bulkCheckboxCheck(event, element) {
    this.common.hubControlEvent('Masters','click','','',JSON.stringify(event, element),'bulkCheckboxCheck');

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
  this.common.hubControlEvent('Masters','click','','','','checkChecks');

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
  this.common.hubControlEvent('Masters','click','','',JSON.stringify(event, element),'onCheckboxChecked');

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
  this.common.hubControlEvent('Masters','click','','',JSON.stringify(event, element),'singleCheckboxCheck');

  if (event) {
      element.CHECKBOX = true
  } else if (!event) {
      element.CHECKBOX = false
  }
  this.checkChecks()
}




ResetFunc()
{
this.actionTab = null;
this.actionname = null;
this.ActionRequired = false;
this.footerRequired = false;
this.labelname = '';
this.place().clear()
this.QuckReply().clear()
this.Calltoaction().clear()
this.Listoption().clear()
this.msgImg = null;
setTimeout(() => {
this.place().push(this.newplace());
var arrayControl = this.form.get('place') as FormArray;
(arrayControl.at(0) as FormGroup).get('parameters').patchValue('P1');
}, 400);
}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }
}
