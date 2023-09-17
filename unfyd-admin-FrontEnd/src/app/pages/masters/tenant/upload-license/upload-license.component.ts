
import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, masters, timeZones, countryCode, tenantFormSteps } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { AnyRecord } from 'dns';
import { ExcelService } from 'src/app/global/excel.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { C } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-license',
  templateUrl: './upload-license.component.html',
  styleUrls: ['./upload-license.component.scss']
})

export class UploadLicenseComponent implements OnInit {
  @Input() public processid: any;
  // @Output() passwordStrength = new EventEmitter<boolean>();

  @ViewChild('exelUpload') myInputVariable: ElementRef;
  form: FormGroup;
  loader: boolean = true;
  path: any;
  userDetails: any;

  a = {
    1:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
    channel:{ channelid:[],channelIdValue:{} },
    user:{ userid:[],useridValue:{} },
    workcampaign:null,
    worktransaction:null,
    lob:false }, 
2:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
    channel:{ channelid:[],channelIdValue:{} },
    user:{ userid:[],useridValue:{} },
    workcampaign:null,
    worktransaction:null,
    lob:false },       
3:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
    channel:{ channelid:[],channelIdValue:{} },
    user:{ userid:[],useridValue:{} },
    workcampaign:null,
    worktransaction:null,
    lob:false },  
    4:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
    5:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
    6:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
    7:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
    8:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
    9:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
    10:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[] },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
    11:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
        12:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
        13:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
        14:{ subscription:{ value:'basic',basic:true,standard:false,enterprise:false,custom:false},
        channel:{ channelid:[],channelIdValue:{} },
        user:{ userid:[],useridValue:{} },
        workcampaign:null,
        worktransaction:null,
        lob:false }, 
  }
  labelName: any;
  tenantFormSteps:any;
  countryCodeSelected: any = {};
  countryCode: any = [];
  public filteredList2 = this.countryCode.slice();
  loginLoader: boolean = false;
  loginImg: any;
  isDisabled = false;
  imgLoader: boolean = false;
  categoryImg: any;
  uplicense: any = [];
  editObj:any = [];
  requestObj:any;
  moreisDisabled = false;
  tabData: any;
  ReportName: any;
  productID: any;
  agents: any = [];
  get3month: any = [];
  agent: any = [];
  productval: any = [];
  productType: any= [];
  ontabcl: any;
  productName: any=[];
  editObj1: any=[];
  ChannelName: any=[];
  channelType: any=[];
  editObj2: any=[];
  username: any=[];
  profileType: any=[];
  onclicktabId :any;
  tenantup: any=[];
  upstartdate :any;
  upenddate :any;
  disabled: boolean;
  imgPreview: any;
  file: any;
  fileName: any;
  extention: any;
  loaderSmall: boolean;
  submittedForm: boolean;
  imageUrl: any;
  indexidval: any;
  islicenseuploaded: any;
  channelcount: any;
  productcount: any;
  rolecount: any;
  upfileextension: any;
  findextension: any;
  ispitchselected: boolean = false; 
  uploadlicenseurl: any;
  LangData: any=[];
  LanguageData:  any=[];
  displaycountryname: any;
  countryloopcount: number;
  subscription: Subscription[] = [];
  userConfig: any;
  constructor( private formBuilder: FormBuilder,
    private api: ApiService,
    private common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog,
    private excelService: ExcelService) {  Object.assign(this, { masters, timeZones, countryCode, tenantFormSteps });}

    ngOnInit(): void {
      this.common.hubControlEvent('Tenant','click','pageload','pageload','','ngOnInit');

     
      this.getSnapShot();
      this.userDetails = this.auth.getUser();
      this.path = this.activatedRoute.snapshot.paramMap.get('id');
      this.subscription.push(this.common.languageChanged$.subscribe((data) => {
        this.setLabelByLanguage(localStorage.getItem("lang"));
      }))
      this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
        this.setLabelByLanguage(data)
      })
      )
      this.common.setUserConfig(this.userDetails.ProfileType, 'Tenant');
      this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
            this.userConfig = data
            
      }))
      this.setLabelByLanguage(localStorage.getItem("lang"))
      this.form = this.formBuilder.group({
        loginImgStatus: ['', [Validators.nullValidator]],
      })

      
      this.path = this.activatedRoute.snapshot.paramMap.get('id');
      this.getProducts();
      this.getChanel();
      this.getProfileType();

      
  
      if(this.processid !== undefined)
      {        
        this.path = this.processid 
      }


    if (this.path != "null") {
      this.loader = true;
      var Obj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "GETBYID",
            PROCESSID: this.path
          }
        }
      }
      this.api.post('index', Obj).subscribe((res: any) => {
        if (res.code == 200) {
          
          
          this.editObj = res.results.data[0];

          this.tenantup = res.results.data[0];
          
       
        
          this.islicenseuploaded = this.tenantup.LicenseUpload;

          this.uploadlicenseurl = this.tenantup.LicenseUpload;

          this.loginImg = this.islicenseuploaded ;
         

     this.upstartdate = this.datepipe.transform(this.tenantup.StartDate, 'dd/MM/yyyy')
     this.upenddate =this.datepipe.transform(this.tenantup.EndDate, 'dd/MM/yyyy')
     
        
   
  
          this.uplicense = res.results.data[0];



          let uploadedfile = this.tenantup.LicenseUpload;
           if(uploadedfile !== null){
          this.upfileextension = uploadedfile.substr(uploadedfile.lastIndexOf('.')+1)
            }
       



        this.loader =true
        var Obj = {
          data: {
            spname: "usp_unfyd_countries",
            parameters: {
              flag: "GET"
            }
          }
        }
        this.api.post('index', Obj).subscribe((res: any) => {


          let countryarr = []
          countryarr = res.results.data

          this.countryloopcount = countryarr.length

          countryarr.forEach(element => {
            if(element.CountryCode == this.uplicense.Country)
            {
              this.displaycountryname = element.CountryName
              this.countryloopcount = 0;
              this.loaderfalsefunc()
            }
          });

        })





        }
      })
     
this.loader = true;
        var Obj = {
          data: {
            spname: "USP_UNFYD_PRODUCTS_PROCESSMAPPING",
            parameters: {
              flag: "EDIT",
              PROCESSID: this.path
            }
          }
        }
        this.api.post('index', Obj).subscribe((res: any) => {
          if (res.code == 200) {
            this.productval = res.results.data;
        
          }
        }
        )






this.loader = true;
var Obj = {
  data: {
    spname: "USP_UNFYD_PRODUCTS_PROCESSMAPPING",
    parameters: {
      flag: "EDIT",
      PROCESSID: this.path
    }
  }
}
this.api.post('index', Obj).subscribe((res: any) => {
  if (res.code == 200) {

    this.editObj = res.results.data;
    this.productName=[];
    this.productcount = this.editObj.length;
    this.editObj.forEach(element => {    
      this.loader = true; 
                      
          let inproid = element.UnfydProductId
          const index = this.productType.findIndex(object => {
            return object.Id == inproid;
          });
         
          this.productName.push(this.productType[index]);

       if(this.productName.some(dataval => dataval.ProductName === "PITCH"))
       {
      
         this.ispitchselected = true;
       } else{
         this.ispitchselected = false;
       }

          if(element.SubscriptionType == 'basic' || element.SubscriptionType == 'Basic')
          {
            this.a[element.UnfydProductId].subscription.value = 'Basic';
            this.a[element.UnfydProductId].subscription.basic = true;
            this.a[element.UnfydProductId].subscription.standard = false;
            this.a[element.UnfydProductId].subscription.enterprise = false;
            this.a[element.UnfydProductId].subscription.custom = false;
          }
          if(element.SubscriptionType == 'standard' || element.SubscriptionType == 'Standard')
          {
            this.a[element.UnfydProductId].subscription.value = element.SubscriptionType;
            this.a[element.UnfydProductId].subscription.basic =false;
            this.a[element.UnfydProductId].subscription.standard = true;
            this.a[element.UnfydProductId].subscription.enterprise = false;
            this.a[element.UnfydProductId].subscription.custom = false;
          }
          if(element.SubscriptionType == 'enterprise' || element.SubscriptionType == 'Enterprise')
          {
            this.a[element.UnfydProductId].subscription.value = element.SubscriptionType;
            this.a[element.UnfydProductId].subscription.basic =false;
            this.a[element.UnfydProductId].subscription.standard = false;
            this.a[element.UnfydProductId].subscription.enterprise = true;
            this.a[element.UnfydProductId].subscription.custom = false;
          }
          if(element.SubscriptionType == 'custom' || element.SubscriptionType == 'Custom')
          {
            this.a[element.UnfydProductId].subscription.value = element.SubscriptionType;
            this.a[element.UnfydProductId].subscription.basic =false;
            this.a[element.UnfydProductId].subscription.standard = false;
            this.a[element.UnfydProductId].subscription.enterprise = false;
            this.a[element.UnfydProductId].subscription.custom = true;
          }

           this.a[element.UnfydProductId].workcampaign = element.CampaignCount;
           this.a[element.UnfydProductId].worktransaction= element.DailyTransLimit;             
           this.a[element.UnfydProductId].lob =element.AllowLOB

        
          if(this.onclicktabId == undefined ||this.onclicktabId == 0)
          {
            this.onclicktabId = this.productName[0].Id
     
          }
       
          this.productcount--;
          this.loaderfalsefunc();
        })

    
  }
})







// this.loader = true;
// var Obj1 = {
//   data: {
//     spname: "USP_UNFYD_TALK_CHANNEL_PROCESS_MAPPING",
//     parameters: {
//       flag: "EDIT",
//       PROCESSID: this.path
//     }
//   }
// }
// this.api.post('index', Obj1).subscribe((res: any) => {
//   if (res.code == 200) {
    
//     this.editObj1 = res.results.data;
//     this.ChannelName = [];
//     this.channelcount = this.editObj1.length;
//     this.editObj1.forEach(element => {  
//       this.loader = true;

//       let chidarr = element.ChannelId;
//       let chproidarr = element.UnfydProductId;
//       let chlicensecut = element.LicenseCount;
  

//       const index = this.channelType.findIndex(object => {     
//         return object.ChannelId == chidarr;
//       });
  
      
//       this.a[chproidarr]?.channel['channelid'].push(this.channelType[index]); 
      
      

//       Object.assign( this.a[chproidarr]?.channel['channelIdValue'], {[chidarr]:chlicensecut});

//       this.channelcount--;
//       this.loaderfalsefunc();
//           })
       
//   }
// })



// this.loader = true;
// var Obj2 = {
//   data: {
//     spname: "usp_unfyd_role_process_mapping",
//     parameters: {
//       flag: "EDIT",
//       PROCESSID: this.path
//     }
//   }
// }
// this.api.post('index', Obj2).subscribe((res: any) => {


//   if (res.code == 200) {
//     this.editObj2 = res.results.data;
  

//     this.username = [];
//     this.rolecount = this.editObj2.length;
  
//     this.editObj2.forEach(element => {  
//       this.loader = true;
  
    
//     let roleproid = element.UnfydProductId;
//     let roleidarr = element.RoleId;
//     let rolelicenscut = element.LicenseCount;

   
//     const index = this.profileType.findIndex(object => {     
//       return object.Id == roleidarr;
//     });
    
    
//     this.a[roleproid]?.user['userid'].push(this.profileType[index]); 


    
//     Object.assign( this.a[roleproid]?.user['useridValue'], {[roleidarr]:rolelicenscut});

//     this.rolecount--;
//     this.loaderfalsefunc();
//     })          
    

//   }

// })




this.requestObj = {
  data: {
    spname: "usp_unfyd_tenant",
    parameters: {
      flag: "GET_LANGUAGE_DATA",
      processid: this.path
    }
  }
}
this.api.post('index', this.requestObj).subscribe((res: any) => {
  this.LanguageData = res.results['data']
})







    } else {
      this.router.navigate(['/masters/tenant/add'])
    }
  


    this.common.hubControlEvent('Tenant','click','pageloadend','pageloadend','','ngOnInit');

  
    }

    loaderfalsefunc(){
      this.common.hubControlEvent('Tenant','click','','','','loaderfalsefunc');

      if(this.productcount == 0 && this.channelcount == 0 && this.rolecount == 0 && this.countryloopcount == 0){
        this.loader=false;
      }
    }


    getProducts() {
      this.common.hubControlEvent('Tenant','click','','','','getProducts');

      // this.productType = JSON.parse(localStorage.getItem('products'))
      // this.getSnapShot();

      var requestObj = {
        data: {
          spname: "usp_unfyd_getdropdowndetails",
          parameters: {
          flag: "PRODUCTS",
          processid: this.userDetails.Processid,
         
          }
        }
      }
      this.api.post('index', requestObj).subscribe((res: any) => {
          this.productType = res.results.data
          this.productType = this.productType.filter((item) => item.Id !== 11);
          this.getSnapShot();
      })
  

  
    }
    getChanel() {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_getdropdowndetails",
          parameters: {
            flag: "CHANNEL_FILTER",
            processid: this.userDetails.Processid
          }
        }
      }
      this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'getChanel');

      this.api.post('index', this.requestObj).subscribe((res: any) => {
        this.channelType = res.results['data']
        let chlen = this.channelType.length;
        this.channelType.forEach(element => {
          if('value' in element){
    
          } else{
            Object.assign(element, {value:0});
          }
          chlen-- ;
          if(chlen == 0)
          {
            this.ChannelLoopSummaryFunc()
          }
        });

      })
    }


    ChannelLoopSummaryFunc()
    {
              
        this.loader = true;
        var Obj1 = {
          data: {
            spname: "USP_UNFYD_TALK_CHANNEL_PROCESS_MAPPING",
            parameters: {
              flag: "EDIT",
              PROCESSID: this.path
            }
          }
        }
        this.api.post('index', Obj1).subscribe((res: any) => {
          if (res.code == 200) {
            
            this.editObj1 = res.results.data;
            this.ChannelName = [];
            this.channelcount = this.editObj1.length;
            this.editObj1.forEach(element => {  
              this.loader = true;

              let chidarr = element.ChannelId;
              let chproidarr = element.UnfydProductId;
              let chlicensecut = element.LicenseCount;
          

            
              this.channelType.forEach(element => {
                if(element.ChannelId == chidarr)
                {
                  this.a[chproidarr]?.channel['channelid'].push(element); 
                }
              });
              
              // const index = this.channelType.findIndex(object => {     
              //   return object.ChannelId == chidarr;
              // });        
              // this.a[chproidarr]?.channel['channelid'].push(this.channelType[index]); 
              
              

              Object.assign( this.a[chproidarr]?.channel['channelIdValue'], {[chidarr]:chlicensecut});

              this.channelcount--;
              if(this.channelcount == 0)
              {
                console.log('a[1]?.channel?.channelid',this.a[1]?.channel?.channelid);
                
                this.loaderfalsefunc();
              }
          
                  })
          
            // this.Channelloopfunc()
              
          }
        })


    }

    getProfileType() {
      this.requestObj = {
        data: {
          spname: "usp_unfyd_getdropdowndetails",
          parameters: {
            flag: "PROFILE",
            // flag: "PROFILE_TYPE",
            processid: this.userDetails.Processid
          }
        }
      }
      this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'getProfileType');

      this.api.post('index', this.requestObj).subscribe((res: any) => {
        this.profileType = res.results['data'];
        let prlen = this.profileType.length
        this.profileType.forEach(element => {
          if('value' in element){
    
          } else{
            Object.assign(element, {value:0});
          }
          prlen-- ;
          if(prlen == 0)
          {
            this.ProfileTypeSummary()
          }
        });
           })
    }

    ProfileTypeSummary()
    {
      

      this.loader = true;
      var Obj2 = {
        data: {
          spname: "usp_unfyd_role_process_mapping",
          parameters: {
            flag: "EDIT",
            PROCESSID: this.path
          }
        }
      }
      this.api.post('index', Obj2).subscribe((res: any) => {


        if (res.code == 200) {
          this.editObj2 = res.results.data;
        

          this.username = [];
          this.rolecount = this.editObj2.length;
        
          this.editObj2.forEach(element => {  
            this.loader = true;
        
          
          let roleproid = element.UnfydProductId;
          let roleidarr = element.RoleId;
          let rolelicenscut = element.LicenseCount;

        
          const index = this.profileType.findIndex(object => {     
            return object.Id == roleidarr;
          });
          
          
          this.a[roleproid]?.user['userid'].push(this.profileType[index]); 


          
          Object.assign( this.a[roleproid]?.user['useridValue'], {[roleidarr]:rolelicenscut});

          this.rolecount--;
          this.loaderfalsefunc();
          })          
          

        }

      })


    }


    onTabClick(p,indexid){
      this.common.hubControlEvent('Tenant','click','','',JSON.stringify(p,indexid),'onTabClick');

      this.onclicktabId = p;

      this.indexidval = indexid;

    }
  
    setLabelByLanguage(data) {
      this.common.hubControlEvent('Tenant','click','','',JSON.stringify(data),'setLabelByLanguage');

      this.loader = true
      this.subscription.push(
      this.common.getLabelConfig$.subscribe(data1 => {
        this.loader = false
        this.labelName = data1
      }));
      this.common.setLabelConfig(this.userDetails.Processid, 'Tenant', data)
      
}
    config: any;
    getSnapShot() {
      this.common.hubControlEvent('Tenant','click','','','','getSnapShot');

      this.userDetails = this.auth.getUser();
      this.activatedRoute.url.subscribe(url => {
        let path = this.activatedRoute.snapshot.data.title
        this.common.setUserConfig(this.userDetails.ProfileType, path);
        this.subscription.push(this.common.getUserConfig$.subscribe(data => {
          this.config = data;
        }));
      });
      
    }
    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
  
    back(): void {
      this.common.hubControlEvent('Tenant','click','back','back','','back');

      this.location.back()
    }
  
    directUpload(event, max_width, max_height) {
      this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event, max_width, max_height),'directUpload');

      var file = event.target.files[0];
      var size = Math.round(file.size / 1024);
      var extension = file.type;
      const formData = new FormData();
      var filename = this.userDetails.Id + '_branding_' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
      formData.append(filename, file);
  
      if (size > 2000) {
  
        this.common.snackbar("File Size");
  
      } else if (extension !== 'image/jpeg' && extension !== 'image/jpg' && extension !== 'image/png' && extension !== 'image/gif') {
        this.common.snackbar("File Type");
      } else {
  
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = rs => {
            const img_height = rs.currentTarget['height'];
            const img_width = rs.currentTarget['width'];
  
            if (img_height > max_height && img_width > max_width) {
              this.common.snackbar("File Size");
            } else {
  
              this.loginLoader = true;
  
  
  
              this.api.post('upload', formData).subscribe(res => {
                if (res.code == 200) {
  
                  this.loginImg = res.results.URL;
                  this.loginLoader = false;
                }
  
              })
            }
          };
        };
  
        reader.readAsDataURL(file);
  
      }
    }
    morefunc()
    {
      this.common.hubControlEvent('Tenant','click','','','','morefunc');

      this.moreisDisabled = !this.moreisDisabled;
      
    
    }











    flip() {
      this.common.hubControlEvent('Tenant','click','','','','flip');

      this.isDisabled = !this.isDisabled;
    }



    nextfunction(){
    //  this.router.navigate(['/masters/tenant']);

      
if(this.path == null){


  this.requestObj = {
    data: {
        spname: "usp_unfyd_tenant",
        parameters: {
            flag: "UPDATE",          

            LICENSEUPLOAD: this.loginImg,
            PROCESSID : this.editObj.ProcessId,
            AllowLOB: this.tenantup.AllowLOB,
            FirstName: this.editObj.FirstName,
           LastName:this.editObj.LastName,
           designation:this.editObj.Designation,
           ProcessName:this.editObj.ProcessName,
           employeestrength: this.editObj.EmployeeStrength,
           ShortCode: this.editObj.ShortCode,
           country:this.editObj.Country,
           countrycode: this.editObj.CountryCode,
           MobileNo: this.editObj.MobileNo,
           emailid: this.editObj.EmailId,
           contracttype:this.editObj.ContractType,
           startDate:this.editObj.StartDate,
           endDate:this.editObj.EndDate,

            SameShipAddress : this.editObj.SameShipAddress,
            ShipAddress: this.editObj.ShipAddress,
            ShipCountry: this.editObj.ShipCountry,
            ShipZipcode: this.editObj.ShipZipcode,
            ShipDistrict:  this.editObj.ShipDistrict,
            ShipState:  this.editObj.ShipState,
            BillAddress:  this.editObj.BillAddress,
            BillCountry: this.editObj.BillCountry,
            BillZipcode: this.editObj.BillZipcode,
            BillDistrict: this.editObj.BillDistrict,
            BillState: this.editObj.BillState,
            RecipientEmailID : this.editObj.RecipientEmailID,
   
            Address: this.editObj.Address,
            ArchiveConnectionString: this.editObj.ArchiveConnectionString,
            BrowserName: this.editObj.BrowserName,
            BrowserVersion: this.editObj.BrowserVersion,
            CampaignCount: this.editObj.CampaignCount,
            ChannelMapped: this.editObj.ChannelMapped,
            CompanyName:  this.editObj.CompanyName,
            ConnectionString: this.editObj.ConnectionString,
            CopyDataMst: this.editObj.CopyDataMst,    
            CreateDB: this.editObj.CreateDB,
            CreatedBy: this.editObj.CreatedBy,
            CreatedOn: this.editObj.CreatedOn,
            DailyTransLimit: this.editObj.DailyTransLimit,
            DeletedBy: this.editObj.DeletedBy,
            DeletedOn: this.editObj.DeletedOn,        
            EmailIDverified: this.editObj.EmailIDverified,     
            IP: this.editObj.IP,
            IsDeleted: this.editObj.IsDeleted,
            LanguageMapped: this.editObj.LanguageMapped,
            LicenseGenerated: this.editObj.LicenseGenerated,        
            LinkUrl: this.editObj.LinkUrl, 
            Mobilenoverified: this.editObj.Mobilenoverified,
            ModifiedBy: this.editObj.ModifiedBy,
            ModifiedOn: this.editObj.ModifiedOn,
            ModuleId: this.editObj.ModuleId,
            Name:this.editObj.Name,
            ParentProcessId:this.editObj.ParentProcessId,
            PrivateIP: this.editObj.PrivateIP,         
            ProcessStatus: this.editObj.ProcessStatus,
            PublicIP: this.editObj.PublicIP,         
            TimezoneOffset: this.editObj.TimezoneOffset,
            Website: this.editObj.Website,



         
        }
    }
}
}
else {

  if(this.loginImg == null && this.islicenseuploaded == null){
    this.common.snackbar("Please Upload License")
    return
  }
else{

  let licenseuploaded :any;

  if(this.loginImg == undefined)
  {
    licenseuploaded= this.islicenseuploaded;

  }
  else{
    licenseuploaded = this.loginImg;
   
  }

  this.requestObj = {
    data: {
        spname: "usp_unfyd_tenant",
        parameters: {
            flag: "UPDATE",
            
            LICENSEUPLOAD: licenseuploaded,
            PROCESSID : this.tenantup.ProcessId,
            AllowLOB: this.tenantup.AllowLOB,
            FirstName: this.tenantup.FirstName,
           LastName:this.tenantup.LastName,
           designation:this.tenantup.Designation,
           ProcessName:this.tenantup.ProcessName,
           employeestrength: this.tenantup.EmployeeStrength,
           ShortCode: this.tenantup.ShortCode,
           country:this.tenantup.Country,
           countrycode: this.tenantup.CountryCode,
           MobileNo: this.tenantup.MobileNo,
           emailid: this.tenantup.EmailId,
           contracttype:this.tenantup.ContractType,
           startDate:this.tenantup.StartDate,
           endDate:this.tenantup.EndDate,

            SameShipAddress : this.tenantup.SameShipAddress,
            ShipAddress: this.tenantup.ShipAddress,
            ShipCountry: this.tenantup.ShipCountry,
            ShipZipcode: this.tenantup.ShipZipcode,
            ShipDistrict:  this.tenantup.ShipDistrict,
            ShipState:  this.tenantup.ShipState,
            BillAddress:  this.tenantup.BillAddress,
            BillCountry: this.tenantup.BillCountry,
            BillZipcode: this.tenantup.BillZipcode,
            BillDistrict: this.tenantup.BillDistrict,
            BillState: this.tenantup.BillState,
            RecipientEmailID : this.tenantup.RecipientEmailID,
   
            Address: this.tenantup.Address,
            ArchiveConnectionString: this.tenantup.ArchiveConnectionString,
            BrowserName: this.tenantup.BrowserName,
            BrowserVersion: this.tenantup.BrowserVersion,
            CampaignCount: this.tenantup.CampaignCount,
            ChannelMapped: this.tenantup.ChannelMapped,
            CompanyName:  this.tenantup.CompanyName,
            ConnectionString: this.tenantup.ConnectionString,
            CopyDataMst: this.tenantup.CopyDataMst,    
            CreateDB: this.tenantup.CreateDB,
            CreatedBy: this.tenantup.CreatedBy,
            CreatedOn: this.tenantup.CreatedOn,
            DailyTransLimit: this.tenantup.DailyTransLimit,
            DeletedBy: this.tenantup.DeletedBy,
            DeletedOn: this.tenantup.DeletedOn,        
            EmailIDverified: this.tenantup.EmailIDverified,     
            IP: this.tenantup.IP,
            IsDeleted: this.tenantup.IsDeleted,
            LanguageMapped: this.tenantup.LanguageMapped,
            LicenseGenerated: this.tenantup.LicenseGenerated,        
            LinkUrl: this.tenantup.LinkUrl, 
            Mobilenoverified: this.tenantup.Mobilenoverified,
            ModifiedBy: this.tenantup.ModifiedBy,
            ModifiedOn: this.tenantup.ModifiedOn,
            ModuleId: this.tenantup.ModuleId,
            Name:this.tenantup.Name,
            ParentProcessId:this.tenantup.ParentProcessId,
            PrivateIP: this.tenantup.PrivateIP,         
            ProcessStatus: this.tenantup.ProcessStatus,
            PublicIP: this.tenantup.PublicIP,         
            TimezoneOffset: this.tenantup.TimezoneOffset,
            Website: this.tenantup.Website



        }
    }
}
}

}

this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'nextfunction');

this.api.post('index', this.requestObj).subscribe((res: any) => {
 
  if (res.code == 200) {
  
    if(this.loginImg == undefined)
    {
      this.common.snackbar("Saved Success");
    }
    else{
    
    }
   
    this.router.navigate(['masters/tenant']);
    
  } else {
   
    this.common.snackbar(res.results.data[0]);
  }
},
  (error) => {
   
    this.common.snackbar("General Error");
  })

    



}







	  
	  
	  
fileSizeErr: boolean = false;
fileType: boolean = false;
  
  fileChange1(event) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'fileChange1');

   
    let filename = event[0].name
    let fileext =  filename.split('.').pop();
  

    if(fileext == 'lic')
    {

  for (var i = 0; i < event.length; i++) {
    var size = Math.round(event[i].size / 1024);
    var type = event[i].type;
  }
 this.findextension = type;
  if (size > 2000) {
    event = null;
    this.disabled = true
    this.imgPreview = null
    this.fileSizeErr = true
    this.common.snackbar("File Size is Greater than 2mb");
  } 
  
  
  else {

    const reader = new FileReader();
    if (event.length > 0) {
      this.disabled = false;
      this.fileSizeErr = false
      this.file = event[0];
      this.fileName = event[0].name;
      this.extention = this.fileName.substring(this.fileName.indexOf(".") + 1);
      reader.readAsDataURL(event[0]);
      reader.onload = () => {
        this.imgPreview = reader.result as string;
      };
     this.fileUpload1('upload')
    }
    
  }
  
    }
    else{
      this.common.snackbar("TenantFileFormatUpload");
      return;
    }



}


fileUpload1(btnType) {
  this.loaderSmall = true;
  this.submittedForm = true;
  const formData = new FormData();
  var filename = this.userDetails.Id  + '_UploadLicense__' + this.datepipe.transform(new Date(), 'ddMMyyhhmmss');
  formData.append(filename, this.file);
  this.common.hubControlEvent('Tenant','click','','',JSON.stringify(btnType),'fileUpload1');

  this.api.post('upload', formData).subscribe(res => {
    if (res.code == 200) {
      this.loginImg = res.results.URL;
      this.uploadlicenseurl = res.results.URL;
      if (btnType == 'upload') {
        this.loaderSmall = false;
        this.common.snackbar('TenantFileUploadSuccess');
      }
    } else {
      this.loaderSmall = false;
    }
  },
    (error) => {
      this.loaderSmall = false;
      this.common.snackbar('File Uploaded');
    })
}













	  
	  


	 
import(event): void {
  this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'import');

  this.excelService.importExcel(event);
  this.myInputVariable.nativeElement.value = '';
    this.import1('upload');
  }
  import1(langCode) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: langCode,
        title: 'Are you sure?',
        subTitle: 'You want to ' + langCode + ' this data',
      },
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(status => {
      if(status){
          var temp = [];
          temp = JSON.parse(JSON.stringify(this.excelService.getJson()));
          for (let i = 0; i < temp.length; i++) {
            var obj = {
              data: {
                spname: "usp_unfyd_form_validation",
                parameters: {
                  flag: "BULK_INSERT",
                  id: temp[i].Id,
                  language: temp[i].Language,
                  labelname: temp[i].LabelName,
                  key: temp[i].Key,
                  modulename: temp[i].ModuleName,
                  submodule: temp[i].SubModule,
                  processid: temp[i].ProcessId,
                  productid: temp[i].ProductId,
                  modifiedby : this.userDetails.Id
                }
              }
            };
            this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj),'import1');

            this.api.post('index', obj).subscribe(res => {
              if (res.code == 200) {
                // this.common.snackbar(res.results.data[0].result,'success');
              } else {
                // this.common.snackbar(res.results.data[0].result,'error');
              }
            },
              (error) => {
                // this.common.snackbar(error.message,'error');
              });
          }
        }
      });
  }



/////////////////////////////////////////////






////////////////////save function starts//////////////////////////////



savefunction(){




    
  if(this.path == null){
    this.requestObj = {
      data: {
          spname: "usp_unfyd_tenant",
          parameters: {
              flag: "UPDATE",          
  
              LICENSEUPLOAD: this.loginImg,
              PROCESSID : this.editObj.ProcessId,
              AllowLOB: this.tenantup.AllowLOB,
              FirstName: this.editObj.FirstName,
             LastName:this.editObj.LastName,
             designation:this.editObj.Designation,
             ProcessName:this.editObj.ProcessName,
             employeestrength: this.editObj.EmployeeStrength,
             ShortCode: this.editObj.ShortCode,
             country:this.editObj.Country,
             countrycode: this.editObj.CountryCode,
             MobileNo: this.editObj.MobileNo,
             emailid: this.editObj.EmailId,
             contracttype:this.editObj.ContractType,
             startDate:this.editObj.StartDate,
             endDate:this.editObj.EndDate,
  
              SameShipAddress : this.editObj.SameShipAddress,
              ShipAddress: this.editObj.ShipAddress,
              ShipCountry: this.editObj.ShipCountry,
              ShipZipcode: this.editObj.ShipZipcode,
              ShipDistrict:  this.editObj.ShipDistrict,
              ShipState:  this.editObj.ShipState,
              BillAddress:  this.editObj.BillAddress,
              BillCountry: this.editObj.BillCountry,
              BillZipcode: this.editObj.BillZipcode,
              BillDistrict: this.editObj.BillDistrict,
              BillState: this.editObj.BillState,
              RecipientEmailID : this.editObj.RecipientEmailID,
     
              Address: this.editObj.Address,
              ArchiveConnectionString: this.editObj.ArchiveConnectionString,
              BrowserName: this.editObj.BrowserName,
              BrowserVersion: this.editObj.BrowserVersion,
              CampaignCount: this.editObj.CampaignCount,
              ChannelMapped: this.editObj.ChannelMapped,
              CompanyName:  this.editObj.CompanyName,
              ConnectionString: this.editObj.ConnectionString,
              CopyDataMst: this.editObj.CopyDataMst,    
              CreateDB: this.editObj.CreateDB,
              CreatedBy: this.editObj.CreatedBy,
              CreatedOn: this.editObj.CreatedOn,
              DailyTransLimit: this.editObj.DailyTransLimit,
              DeletedBy: this.editObj.DeletedBy,
              DeletedOn: this.editObj.DeletedOn,        
              EmailIDverified: this.editObj.EmailIDverified,     
              IP: this.editObj.IP,
              IsDeleted: this.editObj.IsDeleted,
              LanguageMapped: this.editObj.LanguageMapped,
              LicenseGenerated: this.editObj.LicenseGenerated,        
              LinkUrl: this.editObj.LinkUrl, 
              Mobilenoverified: this.editObj.Mobilenoverified,
              ModifiedBy: this.editObj.ModifiedBy,
              ModifiedOn: this.editObj.ModifiedOn,
              ModuleId: this.editObj.ModuleId,
              Name:this.editObj.Name,
              ParentProcessId:this.editObj.ParentProcessId,
              PrivateIP: this.editObj.PrivateIP,         
              ProcessStatus: this.editObj.ProcessStatus,
              PublicIP: this.editObj.PublicIP,         
              TimezoneOffset: this.editObj.TimezoneOffset,
              Website: this.editObj.Website,
  
  
  
           
          }
      }
  }
  }
  else {
    this.requestObj = {
      data: {
          spname: "usp_unfyd_tenant",
          parameters: {
              flag: "UPDATE",
              
              LICENSEUPLOAD: this.loginImg,
              PROCESSID : this.tenantup.ProcessId,
              AllowLOB: this.tenantup.AllowLOB,
              FirstName: this.tenantup.FirstName,
             LastName:this.tenantup.LastName,
             designation:this.tenantup.Designation,
             ProcessName:this.tenantup.ProcessName,
             employeestrength: this.tenantup.EmployeeStrength,
             ShortCode: this.tenantup.ShortCode,
             country:this.tenantup.Country,
             countrycode: this.tenantup.CountryCode,
             MobileNo: this.tenantup.MobileNo,
             emailid: this.tenantup.EmailId,
             contracttype:this.tenantup.ContractType,
             startDate:this.tenantup.StartDate,
             endDate:this.tenantup.EndDate,
  
              SameShipAddress : this.tenantup.SameShipAddress,
              ShipAddress: this.tenantup.ShipAddress,
              ShipCountry: this.tenantup.ShipCountry,
              ShipZipcode: this.tenantup.ShipZipcode,
              ShipDistrict:  this.tenantup.ShipDistrict,
              ShipState:  this.tenantup.ShipState,
              BillAddress:  this.tenantup.BillAddress,
              BillCountry: this.tenantup.BillCountry,
              BillZipcode: this.tenantup.BillZipcode,
              BillDistrict: this.tenantup.BillDistrict,
              BillState: this.tenantup.BillState,
              RecipientEmailID : this.tenantup.RecipientEmailID,
     
              Address: this.tenantup.Address,
              ArchiveConnectionString: this.tenantup.ArchiveConnectionString,
              BrowserName: this.tenantup.BrowserName,
              BrowserVersion: this.tenantup.BrowserVersion,
              CampaignCount: this.tenantup.CampaignCount,
              ChannelMapped: this.tenantup.ChannelMapped,
              CompanyName:  this.tenantup.CompanyName,
              ConnectionString: this.tenantup.ConnectionString,
              CopyDataMst: this.tenantup.CopyDataMst,    
              CreateDB: this.tenantup.CreateDB,
              CreatedBy: this.tenantup.CreatedBy,
              CreatedOn: this.tenantup.CreatedOn,
              DailyTransLimit: this.tenantup.DailyTransLimit,
              DeletedBy: this.tenantup.DeletedBy,
              DeletedOn: this.tenantup.DeletedOn,        
              EmailIDverified: this.tenantup.EmailIDverified,     
              IP: this.tenantup.IP,
              IsDeleted: this.tenantup.IsDeleted,
              LanguageMapped: this.tenantup.LanguageMapped,
              LicenseGenerated: this.tenantup.LicenseGenerated,        
              LinkUrl: this.tenantup.LinkUrl, 
              Mobilenoverified: this.tenantup.Mobilenoverified,
              ModifiedBy: this.tenantup.ModifiedBy,
              ModifiedOn: this.tenantup.ModifiedOn,
              ModuleId: this.tenantup.ModuleId,
              Name:this.tenantup.Name,
              ParentProcessId:this.tenantup.ParentProcessId,
              PrivateIP: this.tenantup.PrivateIP,         
              ProcessStatus: this.tenantup.ProcessStatus,
              PublicIP: this.tenantup.PublicIP,         
              TimezoneOffset: this.tenantup.TimezoneOffset,
              Website: this.tenantup.Website
  
  
  
          }
      }
  }
  
  }
  
  this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'savefunction');

  this.api.post('index', this.requestObj).subscribe((res: any) => {
    if (res.code == 200) {
     
      this.common.snackbar("Saved Success");
    } else {
      this.common.snackbar(res.results.data[0]);
    }
    this.router.navigate(['masters/tenant']);
  },
    (error) => {
      this.common.snackbar("General Error");
    })
  
      
  
  









}





//////////////////save function ends/////////////////////////////////////


////////////////////save function starts//////////////////////////////



savefunctionAddNew(){




    
  if(this.path == null){
    this.requestObj = {
      data: {
          spname: "usp_unfyd_tenant",
          parameters: {
              flag: "UPDATE",          
  
              LICENSEUPLOAD: this.loginImg,
              PROCESSID : this.editObj.ProcessId,
              AllowLOB: this.tenantup.AllowLOB,
              FirstName: this.editObj.FirstName,
             LastName:this.editObj.LastName,
             designation:this.editObj.Designation,
             ProcessName:this.editObj.ProcessName,
             employeestrength: this.editObj.EmployeeStrength,
             ShortCode: this.editObj.ShortCode,
             country:this.editObj.Country,
             countrycode: this.editObj.CountryCode,
             MobileNo: this.editObj.MobileNo,
             emailid: this.editObj.EmailId,
             contracttype:this.editObj.ContractType,
             startDate:this.editObj.StartDate,
             endDate:this.editObj.EndDate,
  
              SameShipAddress : this.editObj.SameShipAddress,
              ShipAddress: this.editObj.ShipAddress,
              ShipCountry: this.editObj.ShipCountry,
              ShipZipcode: this.editObj.ShipZipcode,
              ShipDistrict:  this.editObj.ShipDistrict,
              ShipState:  this.editObj.ShipState,
              BillAddress:  this.editObj.BillAddress,
              BillCountry: this.editObj.BillCountry,
              BillZipcode: this.editObj.BillZipcode,
              BillDistrict: this.editObj.BillDistrict,
              BillState: this.editObj.BillState,
              RecipientEmailID : this.editObj.RecipientEmailID,
     
              Address: this.editObj.Address,
              ArchiveConnectionString: this.editObj.ArchiveConnectionString,
              BrowserName: this.editObj.BrowserName,
              BrowserVersion: this.editObj.BrowserVersion,
              CampaignCount: this.editObj.CampaignCount,
              ChannelMapped: this.editObj.ChannelMapped,
              CompanyName:  this.editObj.CompanyName,
              ConnectionString: this.editObj.ConnectionString,
              CopyDataMst: this.editObj.CopyDataMst,    
              CreateDB: this.editObj.CreateDB,
              CreatedBy: this.editObj.CreatedBy,
              CreatedOn: this.editObj.CreatedOn,
              DailyTransLimit: this.editObj.DailyTransLimit,
              DeletedBy: this.editObj.DeletedBy,
              DeletedOn: this.editObj.DeletedOn,        
              EmailIDverified: this.editObj.EmailIDverified,     
              IP: this.editObj.IP,
              IsDeleted: this.editObj.IsDeleted,
              LanguageMapped: this.editObj.LanguageMapped,
              LicenseGenerated: this.editObj.LicenseGenerated,        
              LinkUrl: this.editObj.LinkUrl, 
              Mobilenoverified: this.editObj.Mobilenoverified,
              ModifiedBy: this.editObj.ModifiedBy,
              ModifiedOn: this.editObj.ModifiedOn,
              ModuleId: this.editObj.ModuleId,
              Name:this.editObj.Name,
              ParentProcessId:this.editObj.ParentProcessId,
              PrivateIP: this.editObj.PrivateIP,         
              ProcessStatus: this.editObj.ProcessStatus,
              PublicIP: this.editObj.PublicIP,         
              TimezoneOffset: this.editObj.TimezoneOffset,
              Website: this.editObj.Website,
  
  
  
           
          }
      }
  }
  }
  else {
    this.requestObj = {
      data: {
          spname: "usp_unfyd_tenant",
          parameters: {
              flag: "UPDATE",
              
              LICENSEUPLOAD: this.loginImg,
              PROCESSID : this.tenantup.ProcessId,
              
              AllowLOB: this.tenantup.AllowLOB,
              FirstName: this.tenantup.FirstName,
             LastName:this.tenantup.LastName,
             designation:this.tenantup.Designation,
             ProcessName:this.tenantup.ProcessName,
             employeestrength: this.tenantup.EmployeeStrength,
             ShortCode: this.tenantup.ShortCode,
             country:this.tenantup.Country,
             countrycode: this.tenantup.CountryCode,
             MobileNo: this.tenantup.MobileNo,
             emailid: this.tenantup.EmailId,
             contracttype:this.tenantup.ContractType,
             startDate:this.tenantup.StartDate,
             endDate:this.tenantup.EndDate,
  
              SameShipAddress : this.tenantup.SameShipAddress,
              ShipAddress: this.tenantup.ShipAddress,
              ShipCountry: this.tenantup.ShipCountry,
              ShipZipcode: this.tenantup.ShipZipcode,
              ShipDistrict:  this.tenantup.ShipDistrict,
              ShipState:  this.tenantup.ShipState,
              BillAddress:  this.tenantup.BillAddress,
              BillCountry: this.tenantup.BillCountry,
              BillZipcode: this.tenantup.BillZipcode,
              BillDistrict: this.tenantup.BillDistrict,
              BillState: this.tenantup.BillState,
              RecipientEmailID : this.tenantup.RecipientEmailID,
     
              Address: this.tenantup.Address,
              ArchiveConnectionString: this.tenantup.ArchiveConnectionString,
              BrowserName: this.tenantup.BrowserName,
              BrowserVersion: this.tenantup.BrowserVersion,
              CampaignCount: this.tenantup.CampaignCount,
              ChannelMapped: this.tenantup.ChannelMapped,
              CompanyName:  this.tenantup.CompanyName,
              ConnectionString: this.tenantup.ConnectionString,
              CopyDataMst: this.tenantup.CopyDataMst,    
              CreateDB: this.tenantup.CreateDB,
              CreatedBy: this.tenantup.CreatedBy,
              CreatedOn: this.tenantup.CreatedOn,
              DailyTransLimit: this.tenantup.DailyTransLimit,
              DeletedBy: this.tenantup.DeletedBy,
              DeletedOn: this.tenantup.DeletedOn,        
              EmailIDverified: this.tenantup.EmailIDverified,     
              IP: this.tenantup.IP,
              IsDeleted: this.tenantup.IsDeleted,
              LanguageMapped: this.tenantup.LanguageMapped,
              LicenseGenerated: this.tenantup.LicenseGenerated,        
              LinkUrl: this.tenantup.LinkUrl, 
              Mobilenoverified: this.tenantup.Mobilenoverified,
              ModifiedBy: this.tenantup.ModifiedBy,
              ModifiedOn: this.tenantup.ModifiedOn,
              ModuleId: this.tenantup.ModuleId,
              Name:this.tenantup.Name,
              ParentProcessId:this.tenantup.ParentProcessId,
              PrivateIP: this.tenantup.PrivateIP,         
              ProcessStatus: this.tenantup.ProcessStatus,
              PublicIP: this.tenantup.PublicIP,         
              TimezoneOffset: this.tenantup.TimezoneOffset,
              Website: this.tenantup.Website
  
  
  
          }
      }
  }
  
  }
  
  this.common.hubControlEvent('Tenant','click','SaveAndADDNew','',JSON.stringify(this.requestObj),'savefunctionAddNew');

  this.api.post('index', this.requestObj).subscribe((res: any) => {
  
    if (res.code == 200) {
     
      this.router.navigate(['masters/tenant/add']);      
      this.common.snackbar("Saved Success");
    } else {
      this.common.snackbar(res.results.data[0]);
    }
  },
    (error) => {
      this.common.snackbar("General Error");
    })
  
      
  
  









}

ngOnDestroy() {
  if (this.subscription) {
    this.subscription.forEach((e) => {
      e.unsubscribe();
    });
  }
}



//////////////////save function ends/////////////////////////////////////


backClicked() {
  this.common.hubControlEvent('hsm-template','click','backClicked','backClicked','','backClicked');

  this.location.back();
}



}
