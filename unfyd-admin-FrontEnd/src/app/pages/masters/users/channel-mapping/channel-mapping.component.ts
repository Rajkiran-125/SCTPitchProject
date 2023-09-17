import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { masters, timeZones, userFormSteps  } from 'src/app/global/json-data';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';

@Component({
  selector: 'app-channel-mapping',
  templateUrl: './channel-mapping.component.html',
  styleUrls: ['./channel-mapping.component.scss']
})
export class ChannelMappingComponent implements OnInit {
  masters: any;
  capacity:number = 3
  form: FormGroup;
  userDetails: any;
  submittedForm = false;
  commonObj: any;
  loader: boolean = false;
  requestObj: any;
  path: any;
  editObj: any;
  skillType: any = [];
  contactCenterLocation: any = [];
  getDesignation: any = [{ Id: 1, designation: 'Designation 1' }, { Id: 2, designation: 'Designation 2' }];
  getGroupList: any = [];
  getRMList: any = [];
  reset: boolean = false;
  labelName: any;
  timeZones: any;
  userFormSteps: any;
  insertCommonObj : any;
  channelWiseData: any = [];
  channelInfo: any = [];
  disabled:boolean = false
  requiredValidator = Validators.nullValidator;
  nonAdults: any;
  dropdown: any;
  subscription: Subscription[] = [];
  userConfig: any;
  valtrue: boolean = false;
  finalregex: any;
  userChannelName:any=[]
  userChannelNameChSource:any=[]
  nonAdultsChSource: any;
  channelSourceValidateError:boolean = false;
  VoideChannelIdVal:any;
  @Input() data: any;
  @Input() Id: any;
  @Output() close: any = new EventEmitter<any>();
  @Input() isDialog: boolean = false;
  @Output() tabSelected: any = new EventEmitter<any>();
  @Output() notifyDialog: any = new EventEmitter<any>();
  validateError: boolean = false;
  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public dialogRef: MatDialogRef<DialogComponent>,
    private el: ElementRef) {
    Object.assign(this, { masters, timeZones, userFormSteps });
  }
  ngOnInit(): void {
    this.common.hubControlEvent('Users','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();
    this.isFormInvalid()
    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.common.setUserConfig(this.userDetails.ProfileType, 'Users');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.setLabelByLanguage(localStorage.getItem("lang"))



    let reg = '[1-' + this.capacity + ']'

    this.form = this.formBuilder.group({
      enableChannelwiseCapacity: [true],
      channelid: [''],
      capacity: [1,[Validators.min(1),Validators.pattern(reg)]],
      channelGroup: this.formBuilder.array([

      ]),
    })

    this.getChannel();
    this.masterConfig();
    this.getChannelStorage();
    if(this.Id == null)
    {
    this.Id = this.activatedRoute.snapshot.paramMap.get('id');
    }
    this.path = this.isDialog === true ? this.Id : this.activatedRoute.snapshot.paramMap.get('id');
    if (this.path != 'null') {
      this.getData()
    } else {
      this.loader = false;
      this.router.navigate(['/masters/users/add'])
    }

    this.insertCommonObj = {
      agentid : this.path,
      createdby: this.userDetails.Id,
      publicip: this.userDetails.ip,
      privateip: '',
      browsername: this.userDetails.browser,
      browserversion: this.userDetails.browser_version
    }
    this.common.hubControlEvent('Users','click','pageloadend','pageloadend','','ngOnInit');

  }
  addnewsteps(event) {
    this.notifyDialog.emit(event)
    }

  getData(){
    this.loader = true;
    var Obj = {
      data: {
        spname: "usp_unfyd_adm_users",
        parameters: {
          flag: "GETUSERBYID",
          agentid: this.path
        }
      }
    }
    this.common.hubControlEvent('Users','click','','',JSON.stringify(Obj),'getData');

    this.api.post('index', Obj).subscribe((res: any) => {

      this.loader = false;
      this.reset = true;
      if (res.code == 200) {
        this.loader = false;
        this.editObj = res.results.data[0];
        this.form.controls['enableChannelwiseCapacity'].patchValue(true);
        this.disabled = this.editObj.EnableChannelwiseCapacity != null
        this.enableChannelwiseCapacity(true)

        // if(this.editObj.EnableChannelwiseCapacity == false)
        // {
        //   if(this.editObj.ChannelId !== null && this.editObj.ChannelId !== ''){
        //     this.form.controls['channelid'].patchValue(this.editObj.ChannelId.split(',').map(mapData => parseInt(mapData)));
        //   }

        //   if(this.editObj.EnableChannelwiseCapacity == false && this.editObj.Capacity == ''){
        //     this.form.controls['capacity'].patchValue(1);
        //   } else {
        //     this.form.controls['capacity'].patchValue(this.editObj.Capacity);
        //   }

        // }




        this.form.updateValueAndValidity();

        // if(this.editObj.EnableChannelwiseCapacity == true)
        // {
        // var Obj2 = {
        //   data: {
        //     spname: "usp_unfyd_adm_users",
        //     parameters: {
        //       flag: "GET_CHANNELWISE_CAPACITY_SERIES",
        //       agentid: this.path
        //     }
        //   }
        // }
        // this.api.post('index', Obj2).subscribe((res: any) => {
        //   this.loader = false;
        //   this.reset = true;
        //   if (res.code == 200) {
        //     this.loader = false;
        //     this.channelWiseData = []

        //     this.channelWiseData = res.results.data[0]

        //     if(this.channelWiseData.length>0){
        //       this.loader = true;
        //       this.channelInfo = []

        //       this.form.value.channelGroup.forEach(element => {

        //         const control = <FormArray>this.form.controls['channelGroup'];
        //         control.removeAt(0);
        //       });

        //     for (let i = 0; i < this.channelWiseData.length; i++) {
        //       this.channelInfo.push({
        //         channelid: this.channelWiseData[i].channelid,
        //         channelidSource : '',
        //         inbound: this.channelWiseData[i].InboundCapacity,
        //         outbound: this.channelWiseData[i].OutboundCapacity,
        //         fullcapacity: this.channelWiseData[i].fullcapacity
        //       })
        //     }
        //     // console.log(this.channelInfo);

        //     let channellen = this.channelInfo.length;

        //       for (let i = 0; i < this.channelInfo.length; i++) {
        //         const firstGroupArray = this.form.get("channelGroup") as FormArray;
        //         firstGroupArray.push(this.formBuilder.group({
        //           channelid: this.channelInfo[i].channelid,
        //           channelidSource:'',
        //           inbound: this.channelInfo[i].inbound,
        //           outbound: this.channelInfo[i].outbound,
        //           fullcapacity: this.channelInfo[i].fullcapacity,
        //           ChannelSourceArr: this.formBuilder.array([])
        //         }));

        //         // this.form.get("channelGroup")[i].inbound.setValidators([Validators.min(0),Validators.max(this.capacity)])
        //         // this.form.get("channelGroup")[i].outbound.setValidators([Validators.min(0),Validators.max(this.capacity)])
        //         channellen -- ;
        //         if(channellen == 0)
        //         {
        //           this.loader = false;


        //           console.log('res.results.data[1]',res.results.data[1]);

        //           let ChildFormArr = res.results.data[1];

        //           let temp = this.form.value.channelGroup

        //           for (let p = 0; p < temp.length; p++) {
        //             for(let q = 0; q < ChildFormArr.length; q++)
        //             {
        //               if(temp[p].channelid == ChildFormArr[q].ChannelId)
        //               {


        //                         let obj = {
        //                           data: {
        //                             spname: "USP_RULEMASTER_PROC",
        //                             parameters: {
        //                               flag: "CHANNELSOURCE",
        //                               processid: this.userDetails.Processid,
        //                               channelid: ChildFormArr[q].ChannelId
        //                             }
        //                           }
        //                         }

        //                         this.api.post('index', obj).subscribe((res: any) => {
        //                         if (res.code == 200) {
        //                           this.loader = false;
        //                           // this.userChannelNameChSource = res.results.data
        //                           this.userChannelNameChSource[ChildFormArr[q].ChannelId] = res.results.data

        //                           const ChildGroupArray = this.channelGroup.at(p).get('ChannelSourceArr') as FormArray;
        //                           ChildGroupArray.push(this.formBuilder.group({
        //                             channelid: ChildFormArr[q].ChannelId,
        //                             channelSource: ChildFormArr[q].ChannelSourceId.toString(),
        //                             inbound: ChildFormArr[q].InboundCapacity,
        //                             outbound: ChildFormArr[q].OutboundCapacity,
        //                             fullcapacity: ChildFormArr[q].FullCapacity
        //                           }));

        //                           this.form.updateValueAndValidity();

        //                           } else {
        //                             this.loader = false;
        //                           }
        //                         },
        //                           (error) => {
        //                             this.loader = false;
        //                             this.common.snackbar(error.message, "error");
        //                           })


        //               }

        //             }

        //           }
        //           console.log('formmmmm',this.form);

        //           // this.channelGroup
        //           // .at(empIndex)
        //           // .get('ChannelSourceArr') as FormArray;

        //           // this.ChannelSourcefunc(i).push( new FormGroup({
        //           //   channelid: new FormControl(SouId, Validators.required),
        //           //   channelSource: new FormControl('', Validators.nullValidator),
        //           //   inbound: new FormControl(1,[Validators.required,Validators.min(0),Validators.max(this.capacity)]),
        //           //   outbound: new FormControl(1,[Validators.required,Validators.min(0),Validators.max(this.capacity)]),
        //           //   fullcapacity: new FormControl(false),

        //           // }));

        //         }


        //       }


        //       // console.log(this.channelInfo, 'dddddddddddddddddddddddddddddddddddd')
        //     } else{
        //       // this.addItem()
        //     }
        //   }
        // })
        // }




        // if(this.editObj.EnableChannelwiseCapacity == true)
        // {
        var Obj2 = {
          data: {
            spname: "usp_unfyd_adm_users",
            parameters: {
              flag: "GET_CHANNELWISE_CAPACITY_SERIES",
              agentid: this.path
            }
          }
        }
        this.api.post('index', Obj2).subscribe((res: any) => {
          this.loader = false;
          this.reset = true;
           if (res.code == 200) {
            this.loader = false;
            this.channelWiseData = []

            this.channelWiseData = res.results.data[1]

            if(this.channelWiseData.length>0){
              this.loader = true;
              this.channelInfo = []

              this.form.value.channelGroup.forEach(element => {

                const control = <FormArray>this.form.controls['channelGroup'];
                control.removeAt(0);
              });

            for (let i = 0; i < this.channelWiseData.length; i++) {

              let obj = {
                data: {
                  spname: "USP_RULEMASTER_PROC",
                  parameters: {
                    flag: "CHANNELSOURCE",
                    processid: this.userDetails.Processid,
                    channelid: this.channelWiseData[i].ChannelId,
                  }
                }
              }

              this.api.post('index', obj).subscribe((res: any) => {
              if (res.code == 200) {
                this.loader = false;
                this.userChannelNameChSource[this.channelWiseData[i].ChannelId] = res.results.data

                // this.channelInfo.push({
                //       channelid: this.channelWiseData[i].ChannelId,
                //       channelidSource : this.channelWiseData[i].ChannelSourceId,
                //       inbound: this.channelWiseData[i].InboundCapacity,
                //       outbound: this.channelWiseData[i].OutboundCapacity,
                //       fullcapacity: this.channelWiseData[i].FullCapacity
                //     })


                    let channellen = this.channelInfo.length;

                    // for (let i = 0; i < this.channelInfo.length; i++) {
                      const firstGroupArray = this.form.get("channelGroup") as FormArray;
                      firstGroupArray.push(this.formBuilder.group({
                        channelid: this.channelWiseData[i].ChannelId,
                        channelidSource:this.channelWiseData[i].ChannelSourceId.toString(),
                        inbound: this.channelWiseData[i].InboundCapacity,
                        outbound: this.channelWiseData[i].OutboundCapacity,
                        fullcapacity: this.channelWiseData[i].FullCapacity,
                        ChannelSourceArr: this.formBuilder.array([])
                      }));
                    // }


                } else {
                  this.loader = false;
                }
              },
                (error) => {
                  this.loader = false;
                  this.common.snackbar(error.message, "error");
                })



            }
            // console.log(this.channelInfo);

            // let channellen = this.channelInfo.length;

            //   for (let i = 0; i < this.channelInfo.length; i++) {
            //     const firstGroupArray = this.form.get("channelGroup") as FormArray;
            //     firstGroupArray.push(this.formBuilder.group({
            //       channelid: this.channelInfo[i].channelid,
            //       channelidSource:'',
            //       inbound: this.channelInfo[i].inbound,
            //       outbound: this.channelInfo[i].outbound,
            //       fullcapacity: this.channelInfo[i].fullcapacity,
            //       ChannelSourceArr: this.formBuilder.array([])
            //     }));


                //

                // this.form.get("channelGroup")[i].inbound.setValidators([Validators.min(0),Validators.max(this.capacity)])
                // this.form.get("channelGroup")[i].outbound.setValidators([Validators.min(0),Validators.max(this.capacity)])
                // channellen -- ;
                // if(channellen == 0)
                // {
                //   this.loader = false;


                //   console.log('res.results.data[1]',res.results.data[1]);

                //   let ChildFormArr = res.results.data[1];

                //   let temp = this.form.value.channelGroup

                //   for (let p = 0; p < temp.length; p++) {
                //     for(let q = 0; q < ChildFormArr.length; q++)
                //     {
                //       if(temp[p].channelid == ChildFormArr[q].ChannelId)
                //       {


                //                 let obj = {
                //                   data: {
                //                     spname: "USP_RULEMASTER_PROC",
                //                     parameters: {
                //                       flag: "CHANNELSOURCE",
                //                       processid: this.userDetails.Processid,
                //                       channelid: ChildFormArr[q].ChannelId
                //                     }
                //                   }
                //                 }

                //                 this.api.post('index', obj).subscribe((res: any) => {
                //                 if (res.code == 200) {
                //                   this.loader = false;
                //                   // this.userChannelNameChSource = res.results.data
                //                   this.userChannelNameChSource[ChildFormArr[q].ChannelId] = res.results.data

                //                   const ChildGroupArray = this.channelGroup.at(p).get('ChannelSourceArr') as FormArray;
                //                   ChildGroupArray.push(this.formBuilder.group({
                //                     channelid: ChildFormArr[q].ChannelId,
                //                     channelSource: ChildFormArr[q].ChannelSourceId.toString(),
                //                     inbound: ChildFormArr[q].InboundCapacity,
                //                     outbound: ChildFormArr[q].OutboundCapacity,
                //                     fullcapacity: ChildFormArr[q].FullCapacity
                //                   }));

                //                   this.form.updateValueAndValidity();

                //                   } else {
                //                     this.loader = false;
                //                   }
                //                 },
                //                   (error) => {
                //                     this.loader = false;
                //                     this.common.snackbar(error.message, "error");
                //                   })


                //       }

                //     }

                //   }
                //   console.log('formmmmm',this.form);

                //   // this.channelGroup
                //   // .at(empIndex)
                //   // .get('ChannelSourceArr') as FormArray;

                //   // this.ChannelSourcefunc(i).push( new FormGroup({
                //   //   channelid: new FormControl(SouId, Validators.required),
                //   //   channelSource: new FormControl('', Validators.nullValidator),
                //   //   inbound: new FormControl(1,[Validators.required,Validators.min(0),Validators.max(this.capacity)]),
                //   //   outbound: new FormControl(1,[Validators.required,Validators.min(0),Validators.max(this.capacity)]),
                //   //   fullcapacity: new FormControl(false),

                //   // }));

                // }


              // }


              // console.log(this.channelInfo, 'dddddddddddddddddddddddddddddddddddd')
            } else{
              // this.addItem()
            }
          }
        })


      // }



      }

    })



}

  // masterConfig(){
  //   this.common.setMasterConfig();
  //   this.common.getMasterConfig$.subscribe(data => {
  //         this.capacity = JSON.parse(data['Capacity'])
  //         console.log("capacity:",this.capacity);

  //         let reg
  //         let capacityminus1 = this.capacity
  //         console.log('capacityminus1',capacityminus1)
  //         if(this.capacity < 10){
  //           reg = '[1-' + this.capacity + ']'
  //         } else if(this.capacity  > 9 && this.capacity < 100){
  //           if(Math.floor(this.capacity% 10) == 0){
  //             capacityminus1 = this.capacity - 1
  //           }
  //           reg = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
  //         } else if(this.capacity  > 99 && this.capacity < 1000){
  //           if(Math.floor(this.capacity% 100) == 0){
  //             capacityminus1 = this.capacity - 1
  //           }
  //           reg = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
  //         } else if(this.capacity  > 999 && this.capacity < 10000){
  //           if(Math.floor(this.capacity% 1000) == 0){
  //             capacityminus1 = this.capacity - 1
  //           }
  //           reg = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/1000 % 10)+'][0-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
  //         }else if(this.capacity  > 9999 && this.capacity < 100000){
  //           if(Math.floor(this.capacity% 10000) == 0){
  //             capacityminus1 = this.capacity - 1
  //           }
  //           reg = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/10000 % 10)+'][1-'+ Math.floor(capacityminus1/1000 % 10)+'][0-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
  //         }

  //         // this.form.controls['capacity'].setValidators([Validators.required, Validators.minLength(this.phminlength), Validators.maxLength(this.phmaxlength)]);
  //         // let reg = '[1-' + this.capacity + ']'
  //         console.log('reg',reg)
  //         this.form.get('capacity').setValidators(Validators.pattern(reg));
  //         // this.form.get('capacity').setValidators(Validators.max(this.capacity));
  //         this.form.get('capacity').updateValueAndValidity()
  //         this.form.updateValueAndValidity()

  //   })
  // }


  // masterConfig(){
  //   this.common.setMasterConfig();
  //   this.common.getMasterConfig$.subscribe(data => {
  //         this.capacity = JSON.parse(data['Capacity'])
  //         console.log("capacity:",this.capacity);
  //         let reg
  //         let capacityminus1 = this.capacity
  //         if(this.capacity < 10){
  //           reg = '[1-' + this.capacity + ']'
  //         } else if(this.capacity  > 9 && this.capacity < 100){
  //           if(Math.floor(this.capacity% 10) == 0){
  //             capacityminus1 = this.capacity - 1
  //           }
  //           reg = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
  //         } else if(this.capacity  > 99 && this.capacity < 1000){
  //           if(Math.floor(this.capacity% 100) == 0){
  //             capacityminus1 = this.capacity - 1
  //           }
  //           reg = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
  //         } else if(this.capacity  > 999 && this.capacity < 10000){
  //           if(Math.floor(this.capacity% 1000) == 0){
  //             capacityminus1 = this.capacity - 1
  //           }
  //           reg = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/1000 % 10)+'][0-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
  //         }else if(this.capacity  > 9999 && this.capacity < 100000){
  //           if(Math.floor(this.capacity% 10000) == 0){
  //             capacityminus1 = this.capacity - 1
  //           }
  //           reg = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/10000 % 10)+'][1-'+ Math.floor(capacityminus1/1000 % 10)+'][0-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
  //         }
  //         console.log(reg);

  //         // this.form.get('capacity').setValidators(Validators.pattern(reg));
  //         // this.form.get('capacity').setValidators(Validators.max(this.capacity));



  //         this.valtrue = true;

  //         setTimeout(()=>
  //         {
  //           this.form.controls['capacity'].setValidators([Validators.required,Validators.pattern(reg)]);
  //           // this.form.get('capacity').updateValueAndValidity()
  //           this.form.updateValueAndValidity()
  //         },1000)

  //   })
  // }








		  masterConfig(){
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
          this.capacity = JSON.parse(data['Capacity'])
          // console.log("capacity:",this.capacity);

          // let reg
          let capacityminus1 = this.capacity
          if(this.capacity < 10){
            this.finalregex = '[1-' + this.capacity + ']'
          } else if(this.capacity  > 9 && this.capacity < 100){
            if(Math.floor(this.capacity% 10) == 0){
              capacityminus1 = this.capacity - 1
            }
            this.finalregex = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
          } else if(this.capacity  > 99 && this.capacity < 1000){
            if(Math.floor(this.capacity% 100) == 0){
              capacityminus1 = this.capacity - 1
            }
            this.finalregex = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
          } else if(this.capacity  > 999 && this.capacity < 10000){
            if(Math.floor(this.capacity% 1000) == 0){
              capacityminus1 = this.capacity - 1
            }
            this.finalregex = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/1000 % 10)+'][0-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
          }else if(this.capacity  > 9999 && this.capacity < 100000){
            if(Math.floor(this.capacity% 10000) == 0){
              capacityminus1 = this.capacity - 1
            }
            this.finalregex = '^(?:[1-9]|[1-'+ Math.floor(capacityminus1/10000 % 10)+'][1-'+ Math.floor(capacityminus1/1000 % 10)+'][0-'+ Math.floor(capacityminus1/100 % 10)+'][0-'+ Math.floor(capacityminus1/10 % 10)+'][0-'+ Math.floor(capacityminus1% 10)+']|'+ this.capacity +')$'
          }
          // console.log(this.finalregex);

          // this.form.get('capacity').setValidators(Validators.pattern(reg));
          // this.form.get('capacity').setValidators(Validators.max(this.capacity));



          this.valtrue = true;

          setTimeout(()=>
          {
            this.form.controls['capacity'].setValidators([Validators.required,Validators.pattern(this.finalregex)]);
            // this.form.get('capacity').updateValueAndValidity()
            this.form.updateValueAndValidity()
          },1000)

    })
  }




  setLabelByLanguage(data) {
    this.common.hubControlEvent('Users','click','','',JSON.stringify(data),'setLabelByLanguage');

    this.loader = true
    this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        // console.log(data1);
        this.labelName = data1
      }));
    this.common.setLabelConfig(this.userDetails.Processid, 'Users', data)

  }

  config: any;
  getSnapShot() {
    this.common.hubControlEvent('Users','click','','','','getSnapShot');

    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe((url) => {
      let path = this.activatedRoute.snapshot.data.title
      this.common.setUserConfig(this.userDetails.ProfileType, path);
      this.subscription.push(this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      }));
    });
    this.subscription.push(this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    }));
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  back(): void {
    this.common.hubControlEvent('Users','click','back','back','','back');
    if(this.isDialog == true){
      this.dialogRef.close(true);
    }
    else{
      this.router.navigate(['/masters/users']);}
  }
  backspace(): void {
    if(this.isDialog == true){
      this.tabSelected.emit(userFormSteps[2].label)
    }
    else{
      this.router.navigate(['/masters/users']);
    }
  }

  submit(type) {


    this.loader = true;
    this.submittedForm = true;
    for (const key of this.form.value.channelGroup) {
      // console.log(key);
      if((key.inbound + key.outbound)>this.capacity){
        this.loader = false;
        // break;
        // this.common.snackbar(masters.FormControlErrorMessage, "error");
        return;
      }
      if(key.inbound == null ||  key.outbound == null || key.inbound == undefined ||  key.outbound == undefined ){
        this.loader = false;
        key.inbound = 0
        this.form.markAllAsTouched();
        // return;
      }
      if(key.channelidSource == null  || key.channelidSource == undefined  || key.channelidSource == "" ){
        this.loader = false;
        this.form.markAllAsTouched();
        // break;
        // this.common.snackbar("eerrrrss", "error");
        return;
      }


    }





    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl?.focus();
          this.form.markAllAsTouched();
          break;
        }
      }
      // this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }

    let tempValidate = this.form.value.channelGroup;

    for (let i = 0; i < tempValidate.length; i++)
    {
      if(tempValidate[i].inbound + tempValidate[i].outbound == 0)
      {
       this.loader = false;
       return;
      }
      if(tempValidate[i].inbound  > this.capacity || tempValidate[i].outbound > this.capacity)
      {
       this.loader = false;
       return;
      }
    }




      // let tempValidate = this.form.value.channelGroup;

    // for (let i = 0; i < tempValidate.length; i++)
    // {
    //   if(tempValidate[i].ChannelSourceArr.length == 0)
    //   {
    //   //  this.common.snackbar('Please Add Channel Source','error')
    //    this.channelSourceValidateError = true;
    //    this.loader = false;
    //    return;
    //   }
    // }

    const BreakError = {};
    // this.form.value.channelGroup.forEach(element => {
    //   console.log(element.inbound);
    //   if((element.inbound + element.outbound) > 3){
    //     throw BreakError;
    //   }
    // });



    if(this.form.value.enableChannelwiseCapacity && this.form.value.channelGroup.length >0 || type == 'delete'){
      var temp = this.form.value.channelGroup;
      // if(temp.length>0){
        let count = 0;
        let temparr = [];
        let arrlen = temp.length;
        for (let i = 0; i < temp.length; i++) {
          this.requestObj = {
                channelid: temp[i].channelid,
                InboundCapacity: temp[i].inbound == null ? 0 : temp[i].inbound,
                OutboundCapacity: temp[i].outbound == null ? 0 : temp[i].outbound,
                fullcapacity: temp[i].fullcapacity,
                activestatus:1,
                userid : this.insertCommonObj.agentid,
                IsDeleted : 0,
                CreatedBy : this.insertCommonObj.createdby,
                PublicIP : this.insertCommonObj.publicip,
                PrivateIP : this.insertCommonObj.privateip,
                BrowserName : this.insertCommonObj.browsername,
                BrowserVersion : this.insertCommonObj.browser_version
          }

          temparr.push(this.requestObj) ;

          arrlen--;
          if(arrlen == 0)
          {
            let obj = {
              data: {
                spname: "usp_unfyd_ChannelWiseCapacity",
                parameters: {
                  flag: "INSERTJSON",
                  json: JSON.stringify( temparr)
                }
              }
            }
            this.common.hubControlEvent('Users','click','','',JSON.stringify(obj),'submit');

            // JSON.parse('[' + JSON.parse(JSON.stringify(res.results.data[0].Parameters)) + ']')
         this.api.post('index', obj).subscribe((res: any) => {
            if (res.code == 200) {

              this.loader = false;
              count++;
              if(count == temp.length){
                if(this.isDialog == true){
                }else{
                this.router.navigate(['/masters/users']);}
              }
              // this.router.navigate(['masters/users/channel-mapping', this.path]);
              // this.common.snackbar(res.results.data[0].result, "success");
              let data = {
                Processid : this.userDetails.Processid,
                Agentid : this.path
              }
              this.common.sendCERequest('UpdateAgentMappingMaster', data)
              this.common.sendCEBotRequest('UpdateAgentMappingMaster',this.path == null ? res.results.data[0].Id : this.path,this.userDetails.Processid)
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

 ///////////////////////////////////////////////////////////////////////
          var tempChSource = this.form.value.channelGroup;
          // if(tempChSource.length>0){
          let count2 = 0;
          let tempChSourcearr2 = [];
          let chSourcearrlen = tempChSource.length;
            for (let i = 0; i < tempChSource.length; i++) {
              this.requestObj = {
                    ChannelId: tempChSource[i].channelid,
                    ChannelSourceId: tempChSource[i].channelidSource,
                    InboundCapacity: tempChSource[i].inbound == null ? 0 : tempChSource[i].inbound,
                    OutboundCapacity: tempChSource[i].outbound == null ? 0 : tempChSource[i].outbound,
                    FullCapacity: tempChSource[i].fullcapacity,
                    UserId : this.insertCommonObj.agentid,
                    IsDeleted : 0,
                    CreatedBy : this.insertCommonObj.createdby,
                    PublicIP : this.insertCommonObj.publicip,
                    PrivateIP : this.insertCommonObj.privateip,
                    BrowserName : this.insertCommonObj.browsername,
                    BrowserVersion : this.insertCommonObj.browser_version

              }

              tempChSourcearr2.push(this.requestObj) ;

              chSourcearrlen--;
              if(chSourcearrlen == 0)
              {
                console.log('chSourcearrlen chSourcearrlen',chSourcearrlen);
                console.log('JSON.stringify( tempChSourcearr2)',JSON.stringify( tempChSourcearr2));

                let obj = {
                 data: {
                        spname: "usp_unfyd_user_channelsource_map",
                        parameters: {
                                  flag: "INSERTJSON",
                                  json: JSON.stringify( tempChSourcearr2)
                                }
                          }
                }
                // this.common.hubControlEvent('Users','click','','',JSON.stringify(obj),'submit');

                // JSON.parse('[' + JSON.parse(JSON.stringify(res.results.data[0].Parameters)) + ']')
            this.api.post('index', obj).subscribe((res: any) => {
                if (res.code == 200) {

                  this.loader = false;
                  count2++;
                  if(count2 == tempChSource.length){
                    if(this.isDialog == true){
                    }else{
                    this.router.navigate(['/masters/users']);}
                  }
                  // this.router.navigate(['masters/users/channel-mapping', this.path]);
                  // this.common.snackbar(res.results.data[0].result, "success");
                  let data = {
                    Processid : this.userDetails.Processid,
                    Agentid : this.path
                  }
                  this.common.sendCERequest('UpdateAgentMappingMaster', data)
                  this.common.sendCEBotRequest('UpdateAgentMappingMaster',this.path == null ? res.results.data[0].Id : this.path,this.userDetails.Processid)
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




            ////old channelsource
          var temp = this.form.value.channelGroup;
      }


    if(this.form.get('enableChannelwiseCapacity').value == false && this.channelWiseData.length>0){
      for (let i = 0; i < this.channelWiseData.length; i++) {
        this.removeChannelGroup(i, this.channelWiseData[i].channelid,'');
      }
    }

    var obj = {
      data: {
        spname: "usp_unfyd_adm_users",
        parameters: {
          flag: "UPDATE",
          processid: this.userDetails.Processid,
          id : this.isDialog === true ? this.Id: this.editObj.Id,
          userstatus : this.editObj.UserStatus,
          enablechannelwisecapacity: true,
          channelid: this.form.get('enableChannelwiseCapacity').value == true ? '' : this.form.get('channelid').value.toString(),
          capacity: this.form.get('enableChannelwiseCapacity').value == true ? '' : this.form.get('capacity').value,
          profilepic : this.editObj.ProfilePic,
          firstname :  this.editObj.FirstName,
          lastname : this.editObj.LastName,
          aliasname : this.editObj.AliasName,
          countrycode : this.editObj.CountryCode,
          contactnumber : this.editObj.ContactNumber,
          emailid : this.editObj.EmailId,
          languagecode : this.editObj.LanguageCode,
          username : this.editObj.UserName,
          employeeid : this.editObj.EmployeeId,

          cclocationid: this.editObj.CCLocationId,
          skillsmap: this.editObj.SkillId,
          groupid: this.editObj.GroupId,
          designation: this.editObj.Designation,
          rmid: this.editObj.RMID,
          crmid: this.editObj.crmid,
          timezone: this.editObj.timezone,
          starttime: this.editObj.starttime,
          endtime: this.editObj.endtime,
          reportingmgr: this.editObj.ReportingMgr,
          modifiedby : this.userDetails.Id,
        }
      }
    }
    this.common.hubControlEvent('Users','click','','',JSON.stringify(obj),'submit');

    this.api.post('index', obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.common.refreshMenu(true);
        this.loader = false;
        if(type == ''){
          if(this.isDialog == true){

            this.dialogRef.close(true);
          }
          else{
          this.router.navigate(['masters/users']);}
          this.common.snackbar('Update Success');

        }
        if(type == 'addNew'){
          if(this.isDialog == true){
            this.dialogRef.close(true);
            const dialogRef = this.dialog.open(DialogComponent, {
              data: {
                type: 'addUsers',
                // data: data,
                isDialog: true,
                tabSelected :'Personal Details'
              },
              width: "900px",
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(status => {
              this.common.setUserConfig(this.userDetails.ProfileType, 'Users');
              this.setLabelByLanguage(localStorage.getItem("lang"))
              this.common.refreshMenu(status);
              if (status) {
              }
            })
          }
          else{
          this.router.navigate(['masters/users/add']);}
          // this.common.snackbar(res.results.data[0].result, "success");
          this.common.snackbar('Update Success');

        }
        this.getData()
        let data = {
          Processid : this.userDetails.Processid,
          Agentid : this.path
        }
        this.common.sendCERequest('UpdateAgentMappingMaster', data)
        this.common.sendCEBotRequest('UpdateAgentMappingMaster',this.path == null ? res.results.data[0].Id : this.path,this.userDetails.Processid)
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      })

  }

  // get channelGroup(): FormArray {
  //   return this.form.get('channelGroup') as FormArray;
  // }
  get channelGroup(): FormArray {
    return this.form.get('channelGroup') as FormArray;
  }

  ChannelSourcefunc(empIndex: number): FormArray {
    return this.channelGroup
      .at(empIndex)
      .get('ChannelSourceArr') as FormArray;
  }

  newChannelSource(): FormGroup {
    return this.formBuilder.group({

    });
  }

  addChannelSource(empIndex: number) {
    this.ChannelSourcefunc(empIndex).push(this.newChannelSource());
  }

  removeChannelSourcearr(empIndex: number, skillIndex: number) {
    this.ChannelSourcefunc(empIndex).removeAt(skillIndex);
  }

  addItem(): void {
    this.form.markAllAsTouched();
    this.submittedForm = true;
    // for (const key of this.form.value.channelGroup) {
    //   // console.log(key);
    //   // console.log(this.form.value.channelGroup.length,"this.form.value.channelGroup.length");
    //   this.dropdown = this.form.value.channelGroup.length == 0 ?true:false
    //   if((key.inbound + key.outbound)>this.capacity){
    //     this.loader = false;
    //     // break;
    //     // this.common.snackbar(masters.FormControlErrorMessage, "error");
    //     return;
    //   }
    // }
    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        // console.log(key);
        // console.log(Object.keys(key));


        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl?.focus();
          break;
        }
      }
      if(this.form.value.channelGroup.length >0)
      // this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }


    for (const key of this.form.value.channelGroup) {
      // console.log(key);
      if((key.inbound + key.outbound)>this.capacity){
        this.loader = false;
        // break;
        // this.common.snackbar(masters.FormControlErrorMessage, "error");
        return;
      }
      if(key.inbound == null ||  key.outbound == null || key.inbound == undefined ||  key.outbound == undefined || key.inbound == "" ||  key.outbound == ""){
        this.loader = false;
        this.form.markAllAsTouched();
        // break;
        // this.common.snackbar("eerrrrss", "error");
        return;
      }
      if(key.channelidSource == null  || key.channelidSource == undefined  || key.channelidSource == "" ){
        this.loader = false;
        this.form.markAllAsTouched();
        // break;
        // this.common.snackbar("eerrrrss", "error");
        return;
      }
    }

    this.channelGroup.push(
      new FormGroup({
        channelid: new FormControl('', Validators.required),
        channelidSource: new FormControl('', Validators.required),
        inbound: new FormControl(1,[Validators.nullValidator]),
        outbound: new FormControl(1,[Validators.nullValidator]),
        fullcapacity: new FormControl(false),
        ChannelSourceArr: this.formBuilder.array([])
      })
    )
    // inbound: new FormControl(0,[Validators.nullValidator,Validators.min(0),Validators.max(this.capacity)]),
    // outbound: new FormControl(0,[Validators.nullValidator,Validators.min(0),Validators.max(this.capacity)]),
    console.log('this.channelGroup',this.form);


  }


  SelectChannelIdChSource(ChId)
  {

    this.form.markAllAsTouched();
    this.submittedForm = true;

    let obj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          processid: this.userDetails.Processid,
          channelid: ChId
        }
      }
    }

    this.api.post('index', obj).subscribe((res: any) => {
    if (res.code == 200) {
      this.loader = false;
      this.userChannelNameChSource[ChId] = res.results.data
      console.log('this.userChannelNameChSource[ChId] ',this.userChannelNameChSource );
      console.log('this.userChannelNameChSource[ChId] ',this.userChannelNameChSource[ChId] );
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      })
  }

  addChannelSourceItem(i,ChId): void {
    this.channelSourceValidateError = false;
    console.log('i,ChId',i,ChId);
    console.log(' this.form.value.channelGroup[i].ChannelSourceArr', this.form.value.channelGroup[i].ChannelSourceArr);



    this.submittedForm = true;
    // for (const key of this.form.value.channelGroup) {
    //   // console.log(key);
    //   // console.log(this.form.value.channelGroup.length,"this.form.value.channelGroup.length");
    //   this.dropdown = this.form.value.channelGroup.length == 0 ?true:false
    //   if((key.inbound + key.outbound)>this.capacity){
    //     this.loader = false;
    //     // break;
    //     // this.common.snackbar(masters.FormControlErrorMessage, "error");
    //     return;
    //   }
    // }
    if (this.form.invalid) {
      this.loader = false;
      for (const key of Object.keys(this.form.controls)) {
        // console.log(key);
        // console.log(Object.keys(key));


        if (this.form.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl?.focus();
          break;
        }
      }
      if(this.form.value.channelGroup.length >0)
      // this.common.snackbar(masters.FormControlErrorMessage, "error");
      return;
    }

    this.ChannelSourcefunc(i).push( new FormGroup({
      channelid: new FormControl(ChId, Validators.required),
      channelSource: new FormControl('', Validators.required),
      inbound: new FormControl(1,[Validators.required,Validators.min(0),Validators.max(this.capacity)]),
      outbound: new FormControl(1,[Validators.required,Validators.min(0),Validators.max(this.capacity)]),
      fullcapacity: new FormControl(false),

    }));
    // )
    console.log(' this.channelGroup', this.form)



    let obj = {
      data: {
        spname: "USP_RULEMASTER_PROC",
        parameters: {
          flag: "CHANNELSOURCE",
          processid: this.userDetails.Processid,
          channelid: ChId
        }
      }
    }

    this.api.post('index', obj).subscribe((res: any) => {
    if (res.code == 200) {
      this.loader = false;
      this.userChannelNameChSource[ChId] = res.results.data
      console.log('this.userChannelNameChSource[ChId] ',this.userChannelNameChSource );
      console.log('this.userChannelNameChSource[ChId] ',this.userChannelNameChSource[ChId] );
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar(error.message, "error");
      })

    return;



  }


  channelType: any ;
  arrayDiv: boolean = false;
  icons: any = [];


  enableChannelwiseCapacity(e) {
    this.common.hubControlEvent('Users','click','','',JSON.stringify(e),'enableChannelwiseCapacity');

    // alert(e)
    // this.channelGroup.clear();
    // this.form.get('channelid').setValue([]);
    // console.log(this.f);

    if(e){
      // let i = 0;
      // for(let control of this.form.get('channelGroup')['controls']){
      //   this.form.get('channelGroup')['controls'][i]['controls']['channelid'].setValidators([Validators.nullValidator]);
      //   this.form.get('channelGroup')['controls'][i]['controls']['inbound'].setValidators([Validators.nullValidator]);
      //   this.form.get('channelGroup')['controls'][i]['controls']['outbound'].setValidators([Validators.nullValidator]);
      //   this.form.get('channelGroup')['controls'][i]['controls']['fullcapacity'].setValidators([Validators.nullValidator]);
      //   // control.controls.channelid.setValidators([Validators.nullValidator]);
      //   console.log(this.f)

      // }

      let groupItems:any = (this.form.get("channelGroup") as FormArray).controls;

      this.form.get("channelid").setValidators(Validators.nullValidator);
      this.form.get("channelid").updateValueAndValidity()
      this.form.get("capacity").setValidators(Validators.nullValidator);
      this.form.get("capacity").updateValueAndValidity()
      for(let item of groupItems) {
        item.controls["channelid"].setValidators(Validators.required);
        item.controls["inbound"].setValidators([Validators.required]);
        item.controls["outbound"].setValidators([Validators.required]);
        item.controls["fullcapacity"].setValidators([Validators.nullValidator]);
        item.controls["channelid"].updateValueAndValidity()
        item.controls["inbound"].updateValueAndValidity()
        item.controls["outbound"].updateValueAndValidity()
        item.controls["fullcapacity"].updateValueAndValidity()
        // console.log(item.controls);
    }
    // this.form.updateValueAndValidity()
    } else{
      let groupItems:any = (this.form.get("channelGroup") as FormArray).controls;
      this.form.controls["channelid"].setValidators(Validators.required);
      this.form.get("channelid").updateValueAndValidity()
      // this.form.get("capacity").setValidators(Validators.required);
      // let reg = '[1-' + this.capacity + ']'
      this.form.controls['capacity'].setValidators([Validators.required,Validators.pattern(this.finalregex)]);
      this.form.get("capacity").updateValueAndValidity()
      for(let item of groupItems) {
        item.controls["channelid"].setValidators(Validators.nullValidator);
        item.controls["inbound"].setValidators([Validators.nullValidator]);
        item.controls["outbound"].setValidators([Validators.nullValidator]);
        item.controls["fullcapacity"].setValidators([Validators.nullValidator]);
        item.controls["channelid"].updateValueAndValidity()
        item.controls["inbound"].updateValueAndValidity()
        item.controls["outbound"].updateValueAndValidity()
        item.controls["fullcapacity"].updateValueAndValidity()
        // console.log(item.controls);
    }
    // this.form.updateValueAndValidity()
    }
    this.arrayDiv = e;
    if(this.arrayDiv == true && this.channelWiseData.length ==0 ){
      this.addItem()
    }
    if(this.form.get('enableChannelwiseCapacity').value == false && this.editObj?.Capacity == ''){
      this.form.controls['capacity'].patchValue(3);
    }


  }


  selectChannel(e) {
    this.common.hubControlEvent('Users','click','','',JSON.stringify(e),'selectChannel');

    this.icons = e;
  }



  getChannelStorage(){
    this.loader = true;
    this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))
    console.log('this.userChannelName all', this.userChannelName)
    this.GetVoiceChannelIdValue(this.userChannelName);
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

  GetVoiceChannelIdValue(ChArr)
  {
    if(ChArr.length > 0 ){
      ChArr.forEach(element => {
        if(element.ChannelName == 'Voice')
        {
          this.VoideChannelIdVal = element.ChannelId
        }
      });
      console.log('VoideChannelIdVal',this.VoideChannelIdVal);

    }
  }



  getChannel() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "ENABLED_CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }
    this.common.hubControlEvent('Users','click','','',JSON.stringify(this.requestObj),'getChannel');

    this.api.post('index', this.requestObj).subscribe((res: any) => {

      if(res.code == 200){
        console.log(res,"res")
        this.channelType = res.results.data
        console.log(res.results.data,"res.results.data")
      console.log( this.channelType," this.channelType");
        // localStorage.setItem("userChannelName",res.results.data[0][0].UserChannel);
        // this.getChannelStorage()
      }




    })
  }



  // getChannelStorage(){
  //   this.loader = true;
  //   this.userChannelName = JSON.parse(localStorage.getItem('userChannelName'))
  //   console.log('this.userChannelName all', this.userChannelName)
  //   if(this.userChannelName == null || this.userChannelName == undefined)
  //   {
  //     this.getChannel();
  //   }else{
  //     let chlen = this.userChannelName.length
  //     this.userChannelName.forEach(element => {
  //       // if(element.ChannelName == 'Voice')
  //       // {
  //       //   this.userChannelName = true;
  //       // }

  //       chlen--;
  //       if(chlen == 0)
  //       {
  //         this.loader =false
  //       }

  //     })
  //   }

  // }




  removeChannelGroup(i, id,channelsource) {
    const add = this.form.get('channelGroup') as FormArray;
    add.removeAt(i);
    // this.loader = true;
    if(id){

    var Obj = {
      data: {
        spname: "usp_unfyd_adm_users",
        parameters: {
          flag: "DELETE_CHANNELWISE_CAPACITY",
          channelid: id,
          agentid: this.path,
          CHANNELSOURCEID: channelsource
        }
      }
    }

    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        this.loader = false;
        // this.common.snackbar(res.results.data[0].result, "success");
        this.common.snackbar("Delete Record");
        // this.submit('delete');
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


  removeChannelSource(i,j, chId,ChSouId) {

    this.ChannelSourcefunc(i).removeAt(j);
    console.log('this.form.value.channelGroup',this.form.value.channelGroup[i]);
    // this.loader = true;
    if(ChSouId){

    var Obj = {
      data: {
        spname: "usp_unfyd_user_channelsource_map",
        parameters: {
          flag: "DELETE_CHANNELSOURCE",
          CHANNELSOURCE : ChSouId,
          CHANNELID: chId,
          AGENTID: this.path
        }
      }
    }

    this.api.post('index', Obj).subscribe(res => {
      if (res.code == 200) {
        // this.loader = false;
        this.common.snackbar("Delete Record");
        // this.submit('delete');
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

  findNonAdults(people: any[], i:any): any[] {
    let result = this.form.value.channelGroup.map(a => a.channelid);
    let selectedValue:any
      people.forEach(element => {
      if(element.ChannelId  == this.form.value.channelGroup[i].channelid && this.form.value.channelGroup[i].channelid != undefined){
        selectedValue = element
      }
    });
    let filteredArray = people.filter(p => !result.includes(p.ChannelId));

    if(selectedValue)
    filteredArray.unshift(selectedValue)
    this.nonAdults = filteredArray
    return filteredArray
  }

  findNonAdultsChannelSource(people: any[], i:any): any[] {
    // console.log('this.form',this.form);

    // let result = this.form.value.channelGroup.map(a => a.channelid);
    if(people == undefined)people = []

    let result = this.form.value.channelGroup.map(a => a.channelidSource);
    let selectedValue:any
      people.forEach(element => {
      if(element.ChannelSourceId  == this.form.value.channelGroup[i].channelidSource && this.form.value.channelGroup[i].channelidSource != undefined){
        selectedValue = element
      }
    });
    let filteredArray = people.filter(p => !result.includes(p.ChannelSourceId));

    if(selectedValue)
    filteredArray.unshift(selectedValue)
    this.nonAdultsChSource = filteredArray
    return filteredArray
  }



    findNonAdultsChannelSource2(people: any[], i:any, j:any): any[] {
    // let result = this.form.value.channelGroup.map(a => a.channelid);
    if(people == undefined)people = []

    let result = this.form.value.channelGroup[i].ChannelSourceArr.map(a => a.channelSource);
    let selectedValue:any
      people.forEach(element => {
      if(element.ChannelSourceId  == this.form.value.channelGroup[i].ChannelSourceArr[j].channelSource && this.form.value.channelGroup[i].ChannelSourceArr[j].channelSource != undefined){
        selectedValue = element
      }
    });
    let filteredArray = people.filter(p => !result.includes(p.ChannelSourceId));

    if(selectedValue)
    filteredArray.unshift(selectedValue)
    this.nonAdultsChSource = filteredArray
    return filteredArray
  }

  isFormInvalid():any{
    this.form?.value?.channelGroup.forEach(element => {
      if((element.inbound +  element.outbound) > this.capacity){
       return false;
      }
    });

    // return false
  }
  numericOnly(event: any): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43 ||
      charCode === 33 || charCode === 35 || charCode === 47 || charCode === 36 ||
      charCode === 37 || charCode === 38 || charCode === 40 || charCode === 41 || charCode === 42
      || charCode === 46 || charCode > 47 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (event.target.value.length >= 20) {
      return false;
    }
    return true;
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }

}
