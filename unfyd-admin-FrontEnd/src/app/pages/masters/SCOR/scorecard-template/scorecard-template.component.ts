import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { orderBy } from 'lodash';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { checknull, checknull1, notificationsStep, regex } from 'src/app/global/json-data';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/global/api.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { MatAccordion } from '@angular/material/expansion';
import { Subscription } from 'rxjs';
import { I } from '@angular/cdk/keycodes';
import {encode,decode} from 'html-entities';

@Component({
  selector: 'app-scorecard-template',
  templateUrl: './scorecard-template.component.html',
  styleUrls: ['./scorecard-template.component.scss']
})
export class ScorecardTemplateComponent implements OnInit {
  form: FormGroup;
  AddingField: FormArray;
  accord: FormArray;
  labelName: any;
  loader: boolean = true;
  subscription: Subscription[] = [];
  changeModuleLabelDisplayName: string;
  userDetails: any;
  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;
  showRadioButtons: any = [];
  @Output() changed = new EventEmitter<boolean>();
  @ViewChild(MatAccordion) accordion: MatAccordion;
  radiovalue: any;
  checkbox: boolean = false;
  requestObj: any;
  requestObj2: any;
  Channel: any;
  ChannelSourceArr: any;
  ID: any;
  channelSourceValidateError: boolean = false;
  insertCommonObj: any;
  AddingData: any = [];
  channelInfo: any[];
  accordvalue: any;
  reset: boolean;
  percentage: number = 0;
  subscriptionBulkDelete: Subscription[] = [];
  weightageIsValid: boolean = true;
  userChannelName: any;
  ChannelName: any;
  Totalweightage: any;
  CategoryWeightage: any;
  ActionRequired: boolean =false;
  FatalRequired: boolean =false;
  display: any;
  totalWt: any = [];
  countWt: any = [];
  UPdate: boolean = false;
  subscriptionAcitivateData: Subscription[] = [];
  panelOpenState : Boolean[]= [false];
  count4: number = 0;
  userConfig: any;







  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private common: CommonService,
    public dialog: MatDialog,
    private el: ElementRef,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.changeModuleLabelDisplayName = this.common.changeModuleLabelName();
    this.userDetails = this.auth.getUser();
    this.getChannel();
    this.getChannelStorage();

    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }) )
    this.setLabelByLanguage(localStorage.getItem("lang"))
    this.common.setUserConfig(this.userDetails.ProfileType, 'scorecardtemplate');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
      this.userConfig = data

    }))
    this.form = this.formBuilder.group({
      Name: ['', [Validators.pattern(regex.alphabet), Validators.required]],
      description: ['', [Validators.nullValidator, Validators.maxLength(500)]],
      Channel: ['', [Validators.required]],
      channelsource: ['', [Validators.required]],
      starRating: ['',[Validators.required]],
      NotApplicableBox: [''],
      AddingField: this.formBuilder.array([this.createItem()])
    },
      { validator: [checknull('Name'),checknull1('Name'), checknull1('description')] });

    this.ID = this.activatedRoute.snapshot.paramMap.get('id');

    if ((this.ID !== null)) {
      const form = this.form.get('AddingField') as FormArray;
      form.removeAt(0);
      this.form.updateValueAndValidity()
      const Obj = {
        data: {
          spname: "usp_unfyd_scor_template",
          parameters: {
            flag: "EDIT",
            ID: this.ID
          }
        }
      }
      // console.log(this.isDialog);

      this.api.post('index', Obj).subscribe(res => {
        this.loader = false;
        this.reset = true;
        this.UPdate = true;
        if (res.code == 200) {
          this.form.controls.Name.patchValue(res.results.data[0].TemplateName)
          this.form.controls.description.patchValue( decode(res.results.data[0].TemplateDesc))
          this.form.controls.Channel.patchValue(res.results.data[0].ChannelId)
          this.form.controls.channelsource.patchValue(res.results.data[0].ChannelSource)
          this.form.controls.starRating.patchValue(res.results.data[0].RatingType)
          this.form.controls.NotApplicableBox.patchValue(res.results.data[0].NotApplicable)
          this.getChannelSource(res.results.data[0].ChannelId)
          this.ChannelName = res.results.data[0].ChannelId
          this.form.updateValueAndValidity();
        }
      })
      const Obj2 = {
        data: {
          spname: "usp_unfyd_scor_category",
          parameters: {
            flag: "EDIT",
            TemplateId: this.ID
          }
        }
      }
      this.api.post('index', Obj2).subscribe(res => {
        this.loader = false;
        if (res.code == 200) {
          this.loader = false;
          this.AddingData = []

          this.AddingData = res.results.data

          if (this.AddingData.length > 0) {
            this.loader = true;
            this.channelInfo = []

            // this.form.value.AddingField.forEach(element => {

            //   const control = <FormArray>this.form.controls['AddingField'];
            //   control.removeAt(0);
            // });

            for (let i = 0; i < this.AddingData.length; i++) {
              this.channelInfo.push({
                Category: this.AddingData[i].CategoryName,
                Weightage: this.AddingData[i].Weightage,
                Description2: decode(this.AddingData[i].Guidelines),
                Exception: decode(this.AddingData[i].Exception),
                IsFatal: this.AddingData[i].IsFatal,
                radioval: this.AddingData[i].FatalType
              })
            }
            // console.log(this.channelInfo);

            let channellen = this.channelInfo.length;

            for (let i = 0; i < this.channelInfo.length; i++) {
              const firstGroupArray = <FormArray>this.form.controls.AddingField;
              firstGroupArray.push(this.formBuilder.group({
                Category: [this.channelInfo[i].Category, [Validators.pattern(regex.alphabet),Validators.required]],
                Weightage: [this.channelInfo[i].Weightage, Validators.required],
                Description2: [decode(this.channelInfo[i].Description2),  [Validators.nullValidator]],
                Exception: [decode(this.channelInfo[i].Exception),  [Validators.nullValidator]],
                IsFatal: [this.channelInfo[i].IsFatal],
                radioval: [this.channelInfo[i].radioval],
                accord: this.formBuilder.array([])
              },
              { validator: [checknull('Category'),checknull1('Category'), checknull1('Description2'), checknull1('Exception')] }
              ));




              channellen--;
              if (channellen == 0) {


                let obj = {
                  data: {
                    spname: "usp_unfyd_scor_question",
                    parameters: {
                      flag: "Edit",
                      processid: this.userDetails.Processid,
                      TemplateId: this.ID
                    }
                  }
                }


                this.api.post('index', obj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.loader = false;
                    // this.userChannelNameChSource = res.results.data
                    // this.accordvalue[ChildFormArr[q].ChannelId] = res.results.data

                    let ChildFormArr = res.results.data;

                    let temp = this.form.value.AddingField


                    for (let p = 0; p < temp.length; p++) {


                      for (let q = 0; q < ChildFormArr.length; q++) {
                        if (temp[p].Category == ChildFormArr[q].CategoryName) {


                          const ChildGroupArray = this.AddingField.at(p).get('accord') as FormArray;
                          ChildGroupArray.push(this.formBuilder.group({
                            TypingArea: [ChildFormArr[q].Question, Validators.required],
                            Weightage2: [ChildFormArr[q].Weightage, [Validators.required,Validators.max(100)]]
                          }));

                          this.form.updateValueAndValidity();

                        }
                      }

                    this.DisplayWeightage(p);


                    }
                    console.log('formmmmm', this.form);



                  } else {
                    this.loader = false;
                  }
                },
                  (error) => {
                    this.loader = false;
                    this.common.snackbar(error.message, "error");
                  })




              }
            }




          } else {
            // this.addItem()
          }
        }
      })
    } else {
      this.loader = false;

    }



    this.AddingField = this.form.get('AddingField') as FormArray;

    this.insertCommonObj = {
      createdby: this.userDetails.Id,
      publicip: this.userDetails.ip,
      privateip: '',
      processid: this.userDetails.Processid,
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version
    }




  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  setLabelByLanguage(data) {
    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'ScorecardTemplate', data);
  }

  createItemAccord() {
    return this.formBuilder.group({
      TypingArea: ['',  Validators.required],
      Weightage2: ["",[Validators.required,Validators.max(100)]]
    },
    { validator: [checknull('TypingArea'),checknull1('TypingArea')] }

    )
  }

  createItem() {
    // console.log('this.createItem()', this.form);
    return this.formBuilder.group({
      Category: ['', [Validators.pattern(regex.alphabet), Validators.required]],
      IsFatal: ['', Validators.nullValidator],
      radioval: ['', Validators.nullValidator],
      Weightage: ['', [Validators.required,Validators.max(100)]],
      Description2: ['', [Validators.nullValidator]],
      Exception: ['', [Validators.nullValidator]],
      accord: this.formBuilder.array([this.createItemAccord()])
    },
      { validator: [checknull('Category'),checknull1('Category'), checknull1('Description2'), checknull1('Exception')] });

  }


  addItem(): void {
    this.AddingField = this.Field() as FormArray;
    this.Field().push(this.createItem());
    this.panelOpenState.push(false);
  }

  Accordfunc(empIndex: number): FormArray {
    return this.AddingField
      .at(empIndex)
      .get('accord') as FormArray;
  }

  Field(): FormArray {
    return this.form.get("AddingField") as FormArray
  }

  addItem2(empIndex: number) {
    let result=this.CheckWeightage(empIndex)
    if(result){
      return
    }else{
      this.Accordfunc(empIndex).push(this.createItemAccord());
    }

  }

  removeGroup(index) {
    // if (index == 0) return
    const form = this.form.get('AddingField') as FormArray;
    form.removeAt(index);
    this.countWt.splice(index, 1);
    this.totalWt.splice(index, 1);
  }

  removeGroup2(empIndex: number, skillIndex: number) {
    this.Accordfunc(empIndex).removeAt(skillIndex);
  }



  resetfunc() {

    // this.form.reset({

    //     AddingField: []
    // });
    // this.form.markAsUntouched();
    // this.form.updateValueAndValidity();

    this.form.patchValue({
      Name: '',
      description: '',
      Channel: '',
      channelsource: '',
      starRating: '',
      AddingField: [{
        Category: '',
        radioval: '',
        Weightage: '',
        IsFatal: '',
        description: '',
        Exception: '',
      accord: [
        { TypingArea: '', Weightage2: '' },
      ]}
    ]
    });
    // this.form.reset({});
    this.Field().clear();
    this.Field().push(this.createItem());
    this.ActionRequired = false;
    this.FatalRequired  = false;

    this.countWt = [];
    this.totalWt = [];

    this.form.markAsPristine();
    this.form.updateValueAndValidity();

  }

  back(): void {
    this.router.navigate(['masters/ScorecardTemplate']);
  }



  getChannel() {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid,
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      // if (res.code == 200) {
      //   this.Channel = res.results.data;

      //   this.loader = false;
      // }
      if(res.code == 200){

        // localStorage.setItem("userChannelName",res.results.data[0][0].UserLanguage);
        this.getChannelStorage()
      }
    });
  }

  getChannelStorage(){
    this.loader = true;
    this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))
    // console.log('this.userChannelName all', this.userChannelName)
    if(this.userChannelName == null || this.userChannelName == undefined)
    {
      this.getChannel();
    }else{
      let chlen = this.userChannelName.length
      this.userChannelName.forEach(element => {
        // if(element.ChannelName == 'Voice')
        // {
        //   this.userChannelName = true;
        // }

        chlen--;
        if(chlen == 0)
        {
          this.loader =false
        }

      })
    }

  }

  getChannelSource(ChannelId) {
    this.loader = true;
    this.requestObj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          channelid : this.form.value.Channel,
          processid: this.userDetails.Processid
        }
      }
    };
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        // this.form.controls.channelsource.patchValue('');
        this.ChannelSourceArr = res.results.data;
        this.loader = false;
      } else this.loader = false;
    });
  }

  submit(event): void {
    if (this.form.invalid) {

      for (let i = 0; i < this.form.value.AddingField.length; i++) {
        this.panelOpenState[i] = true;
    }

      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          this.checkStarRating();
          invalidControl?.focus();
          this.form.markAllAsTouched();
          break;
        }
      }

      return;
    }

    this.CheckCategoryWeightage();
    if (!this.weightageIsValid) {
      return;
    }

    for (let i = 0; i < this.form.value.AddingField.length; i++) {
      const hasInvalidWeightage = this.CheckWeightage(i);
      if (hasInvalidWeightage) {
        return;
      }
    }

    for (let i = 0; i < this.form.value.AddingField.length; i++) {
      const hasInvalidWeightage = this.CheckWeightage2(i);
      if (hasInvalidWeightage) {
        return;
      }
    }



    this.loader = true;
    // this.submittedForm = true;


    if (this.ID == null) {


      this.requestObj = {
        data: {
          spname: "usp_unfyd_scor_template",
          parameters: {
            FLAG: 'INSERT',
            ChannelId: this.form.value.Channel,
            TemplateName: this.form.value.Name == null ? null : this.form.value.Name.trim(),
            TemplateDesc: encode(this.form.value.description == null ? null : this.form.value.description.trim()),
            ChannelSource: this.form.value.channelsource,
            RatingType: this.form.value.starRating,
            NotApplicable: this.form.value.NotApplicableBox,
            PROCESSID: this.userDetails.Processid,
            CREATEDBY: this.userDetails.Id,
            PRIVATEIP: "",
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    } else {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_scor_template",
          parameters: {
            FLAG: 'UPDATE',
            id: this.ID,
            MODIFIEDBY: this.userDetails.Id,
            ChannelId: this.form.value.Channel,
            TemplateName: this.form.value.Name == null ? null : this.form.value.Name.trim(),
            TemplateDesc: encode(this.form.value.description == null ? null : this.form.value.description.trim()),
            ChannelSource: this.form.value.channelsource,
            RatingType: this.form.value.starRating,
            NotApplicable: this.form.value.NotApplicableBox,
            PROCESSID: this.userDetails.Processid,
            CREATEDBY: this.userDetails.Id,
            PRIVATEIP: "",
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version
          }
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        // this.loader = false;
        if (res.results.data.length > 0) {
          if (res.results.data[0].hasOwnProperty('result')) {
            if (this.ID && event == "add") {
              if (res.results.data[0].result.includes("success")) {
                this.deleteCategoryAPI(event)
              } else {
                this.loader = false;
                // this.common.snackbar("General Error");
              }
            }else if(event == "saveAndAddNew") {
              if (res.results.data[0].result.includes("success")) {
                this.ID = res.results.data[0].Id;
                this.deleteCategoryAPI(event);
                this.ActionRequired=false


              } else {
                this.loader = false;
                // this.common.snackbar("General Error");
              }
            }
             else {
              if (res.results.data[0].result.includes("success")) {
                this.ID = res.results.data[0].Id;
                this.deleteCategoryAPI(event);

              } else {
                this.loader = false;
                // this.common.snackbar("General Error");
              }
            }if (res.results.data[0].Status == true) {

              this.common.confirmationToMakeDefault('AcitvateDeletedData');
              this.subscriptionAcitivateData.push(
                  this.common.getIndividualUpload$.subscribe(status => {
                if(status.status){
                  // this.loader = true;
                  this.requestObj = {
                    data: {
                      spname: "usp_unfyd_scor_template",
                      parameters: {
                        flag: 'ACTIVATE',
                        TemplateName: this.form.value.Name,
                        ChannelSource: this.form.value.channelsource,
                        ChannelId: this.form.value.Channel,
                        processid: this.userDetails.Processid
                      }
                    }
                  };

                  this.api.post('index', this.requestObj).subscribe((res: any) => {
                    if (res.code == 200) {
                      if(event == 'add'){
                        this.common.snackbar('Record add');
                        this.router.navigate(['masters/ScorecardTemplate']);
                      } if (event == 'saveAndAddNew') {
                        this.common.snackbar('Record add');
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
            if((res.results.data[0].result == "Data already exists" && (res.results.data[0].Status == false)) ){
              this.common.snackbar('Data Already Exist');
              // this.loader = false;
            }
          } else {
            this.loader = false;
            this.common.snackbar("General Error");
          }
        } else {
          this.loader = false;
          this.common.snackbar("General Error");
        }
      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    },
      (error) => {

        this.loader = false;

      });
  }


  submitCategory(TemplateId , event) {

    // if (this.form.invalid) {
    //   this.loader = true;
    //   for (const key of Object.keys(this.form.controls)) {
    //     if (this.form.controls[key].invalid) {
    //       const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
    //       invalidControl?.focus();
    //       this.common.snackbar("General Error");
    //       this.form.markAllAsTouched();
    //       break;
    //     }
    //   }
    //   return;
    // }
    this.loader = true;



    // let tempValidate = this.form.value.AddingField;

    // for (let i = 0; i < tempValidate.length; i++) {
    //   if (tempValidate[i].accord.length == 0) {
    //     this.channelSourceValidateError = true;
    //     this.loader = false;
    //     return;
    //   }
    // }

    if (this.form.value.AddingField.length > 0) {
      var temp = this.form.value.AddingField;
      // if(temp.length>0){
      let count = 0;
      let temparr = [];
      let arrlen = temp.length;
      this.count4 = 0;

      for (let i = 0; i < temp.length; i++) {

        this.requestObj = {
          CategoryName: temp[i].Category == null ? null : temp[i].Category.trim(),
          Weightage: temp[i].Weightage,
          Guidelines: encode(temp[i].Description2 == null ? null : temp[i].Description2.trim()),
          Exception: encode(temp[i].Exception == null ? null : temp[i].Exception.trim()),
          IsFatal: temp[i].IsFatal,
          FatalType: temp[i].radioval,
          IsDeleted: 0,
          TemplateId: this.ID,
          PROCESSID: this.userDetails.Processid,
          CreatedBy: this.insertCommonObj.createdby,
          PublicIP: this.insertCommonObj.publicip,
          PrivateIP: this.insertCommonObj.privateip,
          BrowserName: this.insertCommonObj.browsername,
          BrowserVersion: this.insertCommonObj.browser_version
        }



        let obj: any;

        obj = {
          data: {
            spname: "usp_unfyd_scor_category",
            parameters: {
              flag: "INSERT",
              ...this.requestObj
            }
          }
        }



        // obj.data.parameters.TemplateId = templateid
        // delete obj.data.parameters.Id;
        // this.common.hubControlEvent('Users', 'click', '', '', JSON.stringify(obj), 'submit');

        this.api.post('index', obj).subscribe((res: any) => {


          if (res.code == 200) {
            // count++;
            // if (count == temp.length && event == 'add') {
            //   // this.common.snackbar('Record add');
            //   // this.router.navigate(['masters/ScorecardTemplate']);
            //   // this.submitQuestions(this.ID);
            //   this.deleteQuestionAPI(event);
            // }
            // if (count == temp.length && event == 'saveAndAddNew') {
            //   this.deleteQuestionAPI(event);
            // }

            // count++;
            // if (count == temp.length && event == 'add') {
            //   this.common.snackbar('Record add');
            //   this.router.navigate(['masters/ScorecardTemplate']);
            // }
            // if (count == temp.length && event == 'add' && this.UPdate == true) {
            //   this.common.snackbar('Update Success');
            //   this.router.navigate(['masters/ScorecardTemplate']);
            // }
            // if (count == temp.length && event == 'saveAndAddNew') {
            //   this.ID = null;
            //   this.form.reset({});
            //   this.Field().clear();
            //   this.Field().push(this.createItem());
            //   this.common.snackbar('Record add');
            //   this.router.navigate(['masters/ScorecardTemplate/add']);
            // }


            if (temp[i].accord.length > 0) {

              let tempCount = temp.length
              this.count4++;

              let accordval = temp[i].accord

              for (let j = 0; j < accordval.length; j++) {
                this.requestObj = {
                  CategoryName: temp[i].Category == null ? null : temp[i].Category.trim() ,
                  TemplateId: this.ID,
                  Question: accordval[j].TypingArea == null ? null : accordval[j].TypingArea.trim(),
                  Weightage: accordval[j].Weightage2,
                  IsDeleted: 0,
                  PROCESSID: this.userDetails.Processid,
                  CreatedBy: this.insertCommonObj.createdby,
                  PublicIP: this.insertCommonObj.publicip,
                  PrivateIP: this.insertCommonObj.privateip,
                  BrowserName: this.insertCommonObj.browsername,
                  BrowserVersion: this.insertCommonObj.browser_version,
                  CATEGORYID : res.results?.data[0]?.Id
                }

                // temparr2.push(this.requestObj) ;


                let obj = {
                  data: {
                    spname: "usp_unfyd_scor_question",
                    parameters: {
                      flag: "INSERT",
                      // json: JSON.stringify( temparr2)
                      ...this.requestObj
                    }
                  }
                }
                this.api.post('index', obj).subscribe((res: any) => {
                  if (res.code == 200) {
                    this.loader = false;
                    // if (count == temp.length && event == 'add') {
                    //   this.common.snackbar('Record add');
                    //   this.router.navigate(['masters/ScorecardTemplate']);
                    // }
                    // if (count == temp.length && event == 'add' && this.UPdate == true) {
                    //   this.common.snackbar('Update Success');
                    //   this.router.navigate(['masters/ScorecardTemplate']);
                    // }
                    // if (count == temp.length && event == 'saveAndAddNew') {
                    //   this.ID = null;
                    //   this.form.reset({});
                    //   this.Field().clear();
                    //   this.Field().push(this.createItem());
                    //   this.common.snackbar('Record add');
                    //   this.router.navigate(['masters/ScorecardTemplate/add']);
                    // }


                    if (tempCount == this.count4){
                      console.log('tempCount')
                    }
                    if (tempCount == this.count4 && event == 'add') {
                      this.common.snackbar('Record add');
                      this.router.navigate(['masters/ScorecardTemplate']);
                    }
                    if (tempCount == this.count4 && event == 'add' && this.UPdate == true) {
                      this.common.snackbar('Update Success');
                      this.router.navigate(['masters/ScorecardTemplate']);
                    }
                    if (tempCount == this.count4 && event == 'saveAndAddNew') {
                      this.ID = null;
                      this.form.reset({});
                      this.Field().clear();
                      this.Field().push(this.createItem());
                      this.common.snackbar('Record add');
                      this.router.navigate(['masters/ScorecardTemplate/add']);
                    }

                  } else {
                    this.loader = false;
                  }
                },
                  (error) => {
                    this.loader = false;
                    this.common.snackbar(error.message, "error");
                  })
              }
            }




          } else {
            this.loader = false;
          }
        },
          (error) => {
            this.loader = false;
            this.common.snackbar(error.message, "error");
          })



        }
    }
  }


  submitQuestions(TemplateId , event) {
    this.loader = true;
    var temp = this.form.value.AddingField;
    // if(temp.length>0){
    let count = 0;
    let temparr2 = [];
    let arrlen3 = temp.length;
    for (let i = 0; i < temp.length; i++) {

      if (temp[i].accord.length > 0) {

        let accordval = temp[i].accord

        for (let j = 0; j < accordval.length; j++) {
          this.requestObj = {
            CategoryName: temp[i].Category == null ? null : temp[i].Category.trim() ,
            TemplateId: this.ID,
            Question: accordval[j].TypingArea == null ? null : accordval[i].TypingArea.trim(),
            Weightage: accordval[j].Weightage2,
            IsDeleted: 0,
            PROCESSID: this.userDetails.Processid,
            CreatedBy: this.insertCommonObj.createdby,
            PublicIP: this.insertCommonObj.publicip,
            PrivateIP: this.insertCommonObj.privateip,
            BrowserName: this.insertCommonObj.browsername,
            BrowserVersion: this.insertCommonObj.browser_version
          }

          // temparr2.push(this.requestObj) ;


          let obj = {
            data: {
              spname: "usp_unfyd_scor_question",
              parameters: {
                flag: "INSERT",
                // json: JSON.stringify( temparr2)
                ...this.requestObj
              }
            }
          }
          this.api.post('index', obj).subscribe((res: any) => {
            if (res.code == 200) {
              this.loader = false;
              count++;
              if (count == temp.length && event == 'add') {
                this.common.snackbar('Record add');
                this.router.navigate(['masters/ScorecardTemplate']);
              }
              if (count == temp.length && event == 'add' && this.UPdate == true) {
                this.common.snackbar('Update Success');
                this.router.navigate(['masters/ScorecardTemplate']);
              }
              if (count == temp.length && event == 'saveAndAddNew') {
                this.ID = null;
                this.form.reset({});
                this.Field().clear();
                this.Field().push(this.createItem());
                this.common.snackbar('Record add');
                this.router.navigate(['masters/ScorecardTemplate/add']);
                this.ActionRequired=false

              }

            } else {
              this.loader = false;
            }
          },
            (error) => {
              this.loader = false;
              this.common.snackbar(error.message, "error");
            })
        }
      }





    }
  }



  deleteCategoryAPI(event) {
    let obj = {
      data: {
        spname: "usp_unfyd_scor_category",
        parameters: {
          flag: 'DELETE',
          TemplateId: this.ID
        }
      }
    };
    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          if (res.results.data[0].result == 'Data deleted successfully') {
            // this.submitCategory(this.ID, event)
            this.deleteQuestionAPI(event);

          } else {
            this.loader = false;
            this.common.snackbar("General Error");
          }
        } else {
          this.loader = false;
          this.common.snackbar("General Error");
        }
      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    }, error => {
      this.loader = false
      this.common.snackbar("General Error");
    })
  }



  deleteQuestionAPI(event) {
    let obj = {
      data: {
        spname: "usp_unfyd_scor_question",
        parameters: {
          flag: 'DELETE',
          TemplateId: this.ID
        }
      }
    };
    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        if (res.results.data.length > 0) {
          if (res.results.data[0].result == 'Data deleted successfully') {
            // this.submitQuestions(this.ID , event)
            this.submitCategory(this.ID, event)

          } else {
            this.loader = false;
            this.common.snackbar("General Error");
          }
        } else {
          this.loader = false;
          this.common.snackbar("General Error");
        }
      } else {
        this.loader = false;
        this.common.snackbar("General Error");
      }
    }, error => {
      this.loader = false
      this.common.snackbar("General Error");
    })
  }




  toggleRadioSelection(value: string) {
    const currentSelection = this.form.get('starRating').value;
    if (currentSelection === value) {
      this.form.get('starRating').setValue('');
    } else {
      this.form.get('starRating').setValue(value);
    }
  }

  toggleCheckboxSelection(index, value: string) {
    const radiovalControl = this.form.get('radioval');
    if (radiovalControl && radiovalControl.value) {
      const currentSelection = radiovalControl.value;
      if (currentSelection === value) {
        radiovalControl.setValue('');
      } else {
        radiovalControl.setValue(value);
      }
    }
  }
  onRadioChange(event, index) {
    const formArray = this.form.get('AddingField') as FormArray;
    const form = formArray.at(index) as FormGroup;
    form.get('radioval').setValue(event.value);
  }


  CheckWeightage(index){
    let total = this.form.value.AddingField[index].Weightage;
    let sum=this.form.value.AddingField[index].accord
    this.Totalweightage = 0;

    sum.forEach(e => {
      if(e.Weightage2){
        this.Totalweightage =this.Totalweightage+e.Weightage2
      }
    });

    if (total === "" || total === null ) {
      this.form.get(`AddingField.${index}.Weightage`).markAsTouched();
      return true;
    }
    if(this.Totalweightage > total) {
      this.common.snackbar('Weightage');
      return true
    }
    return false;



  }

  CheckWeightage2(index){
    let total = this.form.value.AddingField[index].Weightage;
    let sum=this.form.value.AddingField[index].accord
    this.Totalweightage=0

    sum.forEach(e => {
      if(e.Weightage2){
        this.Totalweightage =this.Totalweightage+e.Weightage2
      }
    });

    if (total === "" || total === null ) {
      this.form.get(`AddingField.${index}.Weightage`).markAsTouched();
      return true;
    }

    if(this.Totalweightage < total) {
      this.common.snackbar('LessWeightage');
      return true
    }
    return false;



  }

  CheckCategoryWeightage(){
    this.CategoryWeightage = 0;
    this.form.value.AddingField.forEach((field) => {
      if (field.Weightage) {
        this.CategoryWeightage += Number(field.Weightage);
      }
    });

    if (this.CategoryWeightage > 100) {
      this.common.snackbar('CategoryWeightage');
      this.weightageIsValid = false;
    } else {
      this.weightageIsValid = true;
    }
  }

  checkStarRating() {
    if (this.form.value.starRating === '' || this.form.value.starRating === null) {
      this.ActionRequired = true;

    }else if(this.form.value.starRating){
      this.ActionRequired = false;
    }

    // this.form.value.AddingField.forEach((field) => {
    //   if(field.IsFatal !== ""){
    //       if (field.radioval  === '' || field.radioval  === null) {
    //         // this.common.snackbar('RatingType');
    //         this.FatalRequired = true;
    //       }else {
    //         this.FatalRequired = false;
    //       }}
    //     });
  }


  DisplayWeightage(index){
    this.totalWt[index] = this.form.value.AddingField[index].Weightage
    this.countWt[index] = 0
    this.form.value.AddingField[index].accord.forEach(el => {
      this.countWt[index] +=  Number(el.Weightage2)
    });


  }




  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }



}
