
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { regex, masters, timeZones, countryCode, tenantFormSteps } from 'src/app/global/json-data';
import { Location } from '@angular/common'
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, Subscription } from 'rxjs';
import { tap, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { coerceStringArray } from '@angular/cdk/coercion';
import { element } from 'protractor';
import { Console } from 'console';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { threadId } from 'worker_threads';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  userDetails: any;
  count = 0;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};



  a = {
    1: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    2: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    3: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    4: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    5: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    6: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    7: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    8: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    9: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    10: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    11: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    12: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    13: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
    14: {
      subscription: { value: 'basic', basic: true, standard: false, enterprise: false, custom: false },
      channel: { channelid: [], channelIdValue: {} },
      user: { userid: [], useridValue: {} },
      workcampaign: null,
      worktransaction: null,
      lob: false
    },
  }
  subscription: Subscription[] = [];
  path: any;
  labelName: any;
  form: FormGroup;
  tenantFormSteps: any;
  loader: boolean = false;
  panelOpenState = false;
  isDisabled = false;
  isDisabled1 = false;
  isDisabled2 = false;
  isDisabled3 = false;
  channelType: any = [];
  requestObj: any;
  istoggle = false;
  istoggle1 = false;
  istoggle2 = false;
  istoggle3 = false;
  ChannelName: any = [];
  selectchannelval: any = [];
  productID: any;
  subtype: any;
  Subscription: any = [];
  channelLicense: any = [];
  UserLicense: any = [];
  Additionalinfo: any = [];
  allowlob: any = [];
  channelidloop: any = [];
  public isSameAddressControl: FormControl = new FormControl(false);
  username: any = [];
  selectUserval: any = [];
  profileType: any;
  istoggle31: boolean;
  istoggle32: boolean;
  istoggle33: boolean;
  istoggle34: boolean;
  AllowLOBval: boolean;
  editObj: any;
  productType: any;
  productName: any = [];
  onlyproductname: any = [];
  ngval: any;
  toggletype: string;
  editObj1: any = [];
  editObj2: any = [];
  ispitchselected: boolean = false;
  deletefuncval: boolean = false;
  localizationData: any;
  localizationDataAvailble: boolean = false;


  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  ProcessObj: any;
  deletefuncount: any;
  productdelcount: any;
  channeldelcount: any;
  roledelcount: any;
  productcountval: any;
  selectedproductdel: any = [];
  routecount: any;
  public proidorder: any = [];
  channelroutecount: any;
  roleroutecount: any;
  productid: any = [];
  channelid: any = [];
  reslangdata : any = [];
  languageval: any= [];
  selectedlang: any= [];
  languageid: any = [];
  langvalloop: any = [];
  defaultdataval: boolean = false;
  langres: boolean = false;
  langloopcount: any;
  routeusercountloop: any;
  storeuserloopval: number;
  MaxAdminLicenseCount: any;
  MaxAgentLicenseCount: any;
  MaxChannelLicenseCount: any;
  MaxSupervisorLicenseCount: any;
  adminconfigapicount: any;
  userConfig: any;
  channelStore: any;
  langaugepatchdata: boolean= false;
  langdropdowndata:  boolean= false;






  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    public common: CommonService,
    private router: Router,
    private auth: AuthService,
    public datepipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private el: ElementRef,
    public dialog: MatDialog) {
      Object.assign(this, { masters, timeZones, countryCode, tenantFormSteps });

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.fruits.push(value);
    }

    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }









  ngOnInit(): void {
    this.common.hubControlEvent('Tenant','click','pageload','pageload','','ngOnInit');

    this.getSnapShot();

    this.userDetails = this.auth.getUser();
    this.subscription.push(this.common.languageChanged$.subscribe((data) => {
      this.setLabelByLanguage(localStorage.getItem("lang"));
    }))
    this.subscription.push( this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    })
    )
    this.setLabelByLanguage(localStorage.getItem("lang"))


    this.subscription.push(this.common.localizationDataAvailable$.subscribe((res) => {
      this.localizationDataAvailble = res;
    }))
    this.subscription.push(this.common.localizationInfo$.subscribe((res1) => {
      this.localizationData = res1;
      if (this.localizationDataAvailble) {
      }

    }))
    this.common.setUserConfig(this.userDetails.ProfileType, 'Tenant');
    this.subscription.push(this.common.getUserConfig$.subscribe((data) => {
          this.userConfig = data

    }))
    this.path = this.activatedRoute.snapshot.paramMap.get('id');
    this.form = this.formBuilder.group({

      usergroup: ['', Validators.nullValidator],
      workchannelid: ['', Validators.nullValidator],
      workuserlicense: ['', Validators.nullValidator],
      workcampaign: ['', [Validators.required, Validators.pattern(regex.numeric)]],
      worktransaction: ['', [Validators.required, Validators.pattern(regex.numeric)]],
      worklobcreation: ['', Validators.nullValidator],


      linkchannelid: ['', Validators.nullValidator],
      linkuserlicense: ['', Validators.nullValidator],
      linkcampaign: ['', Validators.nullValidator],
      linktransaction: ['', Validators.nullValidator],
      linklobcreation: ['', Validators.nullValidator],
      campaignchannelid: ['', Validators.nullValidator],
      campaignuserlicense: ['', Validators.nullValidator],
      campaigncampaign: ['', Validators.nullValidator],
      campaigntransaction: ['', Validators.nullValidator],
      campaignlobcreation: ['', Validators.nullValidator],
      webchatchannelid: ['', Validators.nullValidator],
      webchatuserlicense: ['', Validators.nullValidator],
      webchatcampaign: ['', Validators.nullValidator],
      webchattransaction: ['', Validators.nullValidator],
      webchatlobcreation: ['', Validators.nullValidator],
      workbasiccard: ['', Validators.nullValidator],
      workstandardcard: ['', Validators.nullValidator],
      workenterprisecard: ['', Validators.nullValidator],
      workcustomcard: ['', Validators.nullValidator],
      linkbasiccard: ['', Validators.nullValidator],
      linkstandardcard: ['', Validators.nullValidator],
      linkenterprisecard: ['', Validators.nullValidator],
      linkcustomcard: ['', Validators.nullValidator],
      campaignbasiccard: ['', Validators.nullValidator],
      campaignstandardcard: ['', Validators.nullValidator],
      campaignenterprisecard: ['', Validators.nullValidator],
      campaigncustomcard: ['', Validators.nullValidator],
      webchatbasiccard: ['', Validators.nullValidator],
      webchatstandardcard: ['', Validators.nullValidator],
      webchatenterprisecard: ['', Validators.nullValidator],
      webchatcustomcard: ['', Validators.nullValidator],
    })
    this.getProducts();
    this.getChanel();

    this.path = this.activatedRoute.snapshot.paramMap.get('id');





    this.dropdownList = [
      { "id": 1, "itemName": "India" },
      { "id": 2, "itemName": "Singapore" },
      { "id": 3, "itemName": "Australia" },
      { "id": 4, "itemName": "Canada" },
      { "id": 5, "itemName": "South Korea" },
      { "id": 6, "itemName": "Germany" },
      { "id": 7, "itemName": "France" },
      { "id": 8, "itemName": "Russia" },
      { "id": 9, "itemName": "Italy" },
      { "id": 10, "itemName": "Sweden" }
    ];
    this.selectedItems = [
      { "id": 2, "itemName": "Singapore" },
      { "id": 3, "itemName": "Australia" },
      { "id": 4, "itemName": "Canada" },
      { "id": 5, "itemName": "South Korea" }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Countries",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "PROFILE",
          processid: this.userDetails.Processid
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.profileType = res.results['data'];
      this.profileType.forEach(element => {
        if ('value' in element) {

        } else {
          Object.assign(element, { value: 0 });
        }
      });
      this.count++;
    })

    if (this.path != "null") {
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

          let prodidval = this.proidorder
          this.editObj.sort(function (a, b) {
            return prodidval.indexOf(a.UnfydProductId) - prodidval.indexOf(b.UnfydProductId);
          })

        
          this.productName = [];
          this.editObj.forEach(element => {

          

            let inproid = element.UnfydProductId
            const index = this.productType.findIndex(object => {
              return object.Id == inproid;
            });

            this.productid.push(inproid);

            this.productName.push(this.productType[index]);

            if (this.productName.some(dataval => dataval.ProductName === "SCOR")) {

              this.ispitchselected = true;
            } else {
              this.ispitchselected = false;
            }

            this.selectedproductdel.push(this.productType[index]);


            if (element.SubscriptionType == 'Basic' || element.SubscriptionType == 'basic') {
              this.a[element.UnfydProductId].subscription.value = element.SubscriptionType;
              this.a[element.UnfydProductId].subscription.basic = true;
              this.a[element.UnfydProductId].subscription.standard = false;
              this.a[element.UnfydProductId].subscription.enterprise = false;
              this.a[element.UnfydProductId].subscription.custom = false;
            }
            if (element.SubscriptionType == 'Standard' || element.SubscriptionType == 'standard') {
              this.a[element.UnfydProductId].subscription.value = element.SubscriptionType;
              this.a[element.UnfydProductId].subscription.basic = false;
              this.a[element.UnfydProductId].subscription.standard = true;
              this.a[element.UnfydProductId].subscription.enterprise = false;
              this.a[element.UnfydProductId].subscription.custom = false;
            }
            if (element.SubscriptionType == 'Enterprise' || element.SubscriptionType == 'enterprise') {
              this.a[element.UnfydProductId].subscription.value = element.SubscriptionType;
              this.a[element.UnfydProductId].subscription.basic = false;
              this.a[element.UnfydProductId].subscription.standard = false;
              this.a[element.UnfydProductId].subscription.enterprise = true;
              this.a[element.UnfydProductId].subscription.custom = false;
            }
            if (element.SubscriptionType == 'Custom' || element.SubscriptionType == 'custom') {
              this.a[element.UnfydProductId].subscription.value = element.SubscriptionType;
              this.a[element.UnfydProductId].subscription.basic = false;
              this.a[element.UnfydProductId].subscription.standard = false;
              this.a[element.UnfydProductId].subscription.enterprise = false;
              this.a[element.UnfydProductId].subscription.custom = true;
            }

            this.a[element.UnfydProductId].workcampaign = element.CampaignCount;
            this.a[element.UnfydProductId].worktransaction = element.DailyTransLimit;
            this.a[element.UnfydProductId].lob = element.AllowLOB

      


          })
          this.loader = false;
          this.count++;

        }
      })


      ///////////////////////////////


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

          this.editObj1.forEach(element => {

            let chidarr = element.ChannelId;
            let chproidarr = element.UnfydProductId;
            let chlicensecut = element.LicenseCount;

            this.channelid.push(chidarr);

            this.a[chproidarr]?.channel['channelid'].push(chidarr);

            Object.assign(this.a[chproidarr]?.channel['channelIdValue'], { [chidarr]: chlicensecut });

          })

       





          this.loader = false;
          this.count++;
        }
      })


      ///////////////////////////////

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

          this.editObj2.forEach(element => {
   

            let roleproid = element.UnfydProductId;
            let roleidarr = element.RoleId;
            let rolelicenscut = element.LicenseCount;

  

            this.a[roleproid]?.user['userid'].push(roleidarr);
            Object.assign(this.a[roleproid].user['useridValue'], { [roleidarr]: rolelicenscut });








        

          })
          this.loader = false;
          this.count++;

        }
      })



      //////////////processmaster Onit//////////////////////

      this.loader = true;
      let proObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "GETBYID",
            PROCESSID: this.path
          }
        }
      }
      this.api.post('index', proObj).subscribe((res: any) => {
        if (res.code == 200) {

          this.ProcessObj = res.results.data[0];


          if (this.ProcessObj.DefaultData == true) {
            this.defaultdataval = true
          }
          else {
            this.defaultdataval = false
          }

          this.form.patchValue({
            workcampaign: this.ProcessObj.CampaignCount,
            worktransaction: this.ProcessObj.DailyTransLimit,
            worklobcreation: this.ProcessObj.AllowLOB
          });

        }
      })


      ////////////////////////////////////





    } else {
      this.router.navigate(['/masters/tenant/add'])
    }
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "LANGUAGE",
          processid: this.userDetails.Processid
        }
      }
    }
    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.languageval = res.results.data;
        this.langdropdowndata = true;
        if(this.langaugepatchdata == true &&  this.langdropdowndata == true)
        {
          this.LanguageDataPatch();
        }
      }

    })
    this.loader = true;
    


    let langobj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          flag: "GET_LANGUAGE_DATA",
          processid: this.path
        }
      }
    }

    this.api.post('index', langobj).subscribe((res: any) => {

      if(res.code == 200)
      {
        this.reslangdata=res.results.data;
        this.langaugepatchdata = true

        if(this.langaugepatchdata == true &&  this.langdropdowndata == true)
        {
          this.LanguageDataPatch();
        }
      }
   

    })


    /////////////////////////////////////////////


    let configobj = {
      data: {
        spname: "usp_unfyd_adminconfig",
        parameters: {
          flag: "GET_API",
          processid: this.userDetails.Processid,
          productid: this.userDetails.ProductId
        }
      }
    }

    this.api.post('index', configobj).subscribe((res: any) => {

      if (res.code == 200) {

      let adminconfigcount;

      let adminconfigarr = []
      adminconfigarr = res.results.data


      this.adminconfigapicount = adminconfigarr.length;


      adminconfigarr.forEach(element => {

      if(element.ConfigName == "MaxAdminLicenseCount")
      {
        this.MaxAdminLicenseCount = element.ConfigValue
      }

      if(element.ConfigName == "MaxAgentLicenseCount")
      {
        this.MaxAgentLicenseCount = element.ConfigValue
      }

      if(element.ConfigName == "MaxChannelLicenseCount")
      {
        this.MaxChannelLicenseCount = element.ConfigValue
      }

      if(element.ConfigName == "MaxSupervisorLicenseCount")
      {
        this.MaxSupervisorLicenseCount = element.ConfigValue
      }

      this.adminconfigapicount--;
      });


    }
    else{
      this.MaxAdminLicenseCount =999
      this.MaxAgentLicenseCount = 999
      this.MaxChannelLicenseCount =999
      this.MaxSupervisorLicenseCount = 999
      this.adminconfigapicount=0

    }

    })
    this.common.hubControlEvent('Tenant','click','pageloadend','pageloadend','','ngOnInit');


  }


  LanguageDataPatch()
  {
    this.common.hubControlEvent('Tenant','click','language','language','','LanguageDataPatch');

    this.loader = true;
    if ( this.reslangdata.length == 0) {
      this.loader = true;
  
      if (this.localizationData.numberFormat == '+91') {
        this.langvalloop = ['en', 'gu', 'hi', 'kn', 'ml', 'mr', 'ta', 'te'];

        this.langloopcount = this.langvalloop.length


        this.langvalloop.forEach(element => {
          this.languageval.forEach(object => {
            if (object.langcode == element) {
              this.selectedlang.push(object);
              this.languageid.push(object.langcode);
            }
          });

          this.langloopcount--;
        });


      }
      else {



        this.langloopcount = 1;
        this.languageval.forEach(object => {
          if (object.langcode == 'en') {

            this.selectedlang.push(object);
            this.languageid.push(object.langcode);
            this.langloopcount--;
          }
        });




      }




      this.loader = false;
      this.langres = true;
      this.count++;
      return
    
    
    } else {
      this.loader = true;

     
      this.langvalloop =  this.reslangdata;

      this.langloopcount = this.langvalloop.length

      this.langvalloop.forEach(element => {
        this.languageval.forEach(object => {
          if (object.langcode == element.LanguageCode) {
            this.selectedlang.push(object);
            this.languageid.push(object.langcode);

          }
        });

        this.langloopcount--;
        if(this.langloopcount == 0)
        {
            this.loader = false;
            this.langres = true;
            this.count++;
     
        }
      });


    }
  }

  onItemSelect(item: any) {
    this.common.hubControlEvent('Tenant','click','','',item,'onItemSelect');

  }
  OnItemDeSelect(item: any) {
    
  }
  onSelectAll(items: any) {
  }
  onDeSelectAll(items: any) {
  }
  getProducts() {
    this.common.hubControlEvent('Tenant','click','','','','getProducts');

    // this.productType = JSON.parse(localStorage.getItem('products'))

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
    
        this.productType.forEach(element => {
          this.proidorder.push(element.Id)
    
        });
    })

   
    
  }


  productData = []
  selectedProduct(e) {
    this.common.hubControlEvent('Tenant','click','','',e,'selectedProduct');

    this.productName = e
    this.productid = [];
    this.productName.forEach(proelement => {
      this.productid.push(proelement.Id);
    });
    if (this.productName.some(dataval => dataval.ProductName === "SCOR")) {
      this.ispitchselected = true;
    } else {
      this.ispitchselected = false;
    }

    this.productName.forEach(element => {
      if (this.a[element.Id].user.userid.length == 0) {

        let pushuserval = [];
        pushuserval = [{ RoleId: 1, LicenseCount: 1 }, { RoleId: 2, LicenseCount: 1 }, { RoleId: 3, LicenseCount: 1 }];
        pushuserval.forEach(element2 => {


          let roleidarr = element2.RoleId;
          let rolelicenscut = element2.LicenseCount;


          this.a[element.Id]?.user['userid'].push(roleidarr);
          Object.assign(this.a[element.Id].user['useridValue'], { [roleidarr]: rolelicenscut });




        });



      }



    })


  }

  setLabelByLanguage(data) {
    this.common.hubControlEvent('Tenant','click','','',data,'setLabelByLanguage');

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
      this.common.getUserConfig$.subscribe(data => {
        this.config = data;
      });
    });
    this.common.getLanguageConfig$.subscribe(data => {
      this.setLabelByLanguage(data)
    });
    this.setLabelByLanguage(localStorage.getItem("lang"))
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }




  back(): void {
    this.common.hubControlEvent('Tenant','click','back','back','','back');

    this.location.back()
  }


  flip() {
    this.common.hubControlEvent('Tenant','click','flip','flip','','flip');

    this.isDisabled = !this.isDisabled;
  }
  flip1() {
    this.common.hubControlEvent('Tenant','click','flip1','flip1','','flip1');

    this.isDisabled1 = !this.isDisabled1;
  }
  flip2() {
    this.common.hubControlEvent('Tenant','click','flip2','flip2','','flip2');

    this.isDisabled2 = !this.isDisabled2;
  }
  flip3() {
    this.common.hubControlEvent('Tenant','click','flip3','flip3','','flip3');

    this.isDisabled3 = !this.isDisabled3;
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
    this.common.hubControlEvent('Tenant','click','flip3','flip3',JSON.stringify(this.requestObj),'getChanel');

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      this.channelType = res.results['data']
    })
  }


  onChange(event) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'onChange');


    this.istoggle = !this.istoggle;
  }
  onChange1(event) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'onChange1');

    this.istoggle1 = !this.istoggle1;
  }
  onChange2(event) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'onChange2');

    this.istoggle2 = !this.istoggle2;
  }


  onChange31(event) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'onChange31');

    this.istoggle31 = !this.istoggle31;
    this.subtype = 'Basic'
  }
  onChange32(event) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'onChange32');

    this.istoggle32 = !this.istoggle32;
    this.subtype = 'Standard'
  }

  onChange33(event) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'onChange33');

    this.istoggle33 = !this.istoggle33;
    this.subtype = 'Enterprise'
  }

  onChange34(event) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'onChange34');

    this.istoggle34 = !this.istoggle34;
    this.subtype = 'Custom'

  }

  AllowLOB(event) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(event),'AllowLOB');

    this.AllowLOBval = !this.AllowLOBval;
  }







  selectedlangfunc(langval) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(langval),'selectedlangfunc');

    this.selectedlang = langval;



    this.languageid = [];
    this.selectedlang.forEach(proelement => {
      this.languageid.push(proelement.langcode);
    });


  }

  removelanguage(data) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(data),'removelanguage');

    let removelangdata = []
    removelangdata.push(data);

    this.selectedlang = this.selectedlang.filter(
      (field) => !removelangdata.includes(field)
    );




    this.languageid = [];
    this.selectedlang.forEach(proelement => {
      this.languageid.push(proelement.langcode);
    });
  }

  toggleAllSelection(val) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(val),'toggleAllSelection');

    let chidlen = this.a[1]?.channel['channelid'].length
    let chtylen = this.channelType.length

    if (chidlen >= chtylen) {
      this.channelid = [];
      this.a[1].channel['channelid'] = []
      this.a[1].channel.channelIdValue = {}
    } else {

      this.a[1].channel['channelid'] = []
      this.channelid = []
      if (this.a[1].channel['channelid'].includes(0)) {
        this.channelid = [];
        this.a[1].channel['channelid'] = []
        this.a[1].channel.channelIdValue = {}
      } else {

        this.a[1]?.channel['channelid'].push(0)
        Object.assign(this.a[1]?.channel['channelIdValue'], { 0: 0 });
        this.channelType.forEach(element => {
          let chidarr = element.ChannelId;
          let chproidarr = 1;
          let chlicensecut = 0;
          this.channelid.push(chidarr);
          this.a[chproidarr]?.channel['channelid'].push(chidarr);

          let keys = Object.keys(this.a[1].channel.channelIdValue)
          if (keys.includes(chidarr.toString())) {

          } else {
            Object.assign(this.a[1]?.channel['channelIdValue'], { [chidarr]: 0 });
          }

        })
      }

    }

  }


  selectedReport(e, dataid) {

    let chidlen = this.a[1].channel['channelid'].length
    let chtylen = this.channelType.length

    if (e.includes(0) && chidlen !== chtylen) {
    }
    else {
      let arrchid = this.a[dataid].channel.channelid
      if (arrchid.includes(0)) {
        for (var i = 0; i < this.a[dataid].channel.channelid.length; i++) {

          if (this.a[dataid].channel.channelid[i] === 0) {
            this.a[dataid].channel.channelid.splice(i, 1);
            i--;
          }
        }
      }
      let keys2 = Object.keys(this.a[dataid].channel.channelIdValue)
      let varA = 0;
      if (keys2.includes(varA.toString())) {
        delete this.a[dataid].channel.channelIdValue[varA]
      }




      this.channelid = e;
      let keys = Object.keys(this.a[dataid].channel.channelIdValue)
      let array1
      if (keys.length > 0) {
        array1 = keys.filter(val => !e.includes(Number(val)));
        while (keys.length >= e.length && keys.length != e.length) {
    
          array1.forEach(element => {

            delete this.a[dataid].channel.channelIdValue[element]
            keys = Object.keys(this.a[dataid].channel.channelIdValue)
          });
        }

        e.forEach(element => {
          if (keys.includes(element.toString())) {

          } else {
            Object.assign(this.a[dataid]?.channel['channelIdValue'], { [element]: 0 });
          }
        });
      } else {
        e.forEach(element => {
          Object.assign(this.a[dataid]?.channel['channelIdValue'], { [element]: 0 });
        });

      }

    }


    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(e, dataid),'selectedReport');

  }




  numericOnly(e): boolean {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(e),'numericOnly');

    const charCode = (e.which) ? e.which : e.keyCode;
    if (charCode === 101 || charCode === 69 || charCode === 45 || charCode === 43 ||
      charCode === 33 || charCode === 35 || charCode === 47 || charCode === 36 ||
      charCode === 37 || charCode === 38 || charCode === 46|| charCode === 40 || charCode === 41 || charCode === 42
      || charCode > 47 && (charCode < 48 || charCode > 57)) {
      return false;
    } else if (e.target.value.length >= 20) {
      return false;
    }
    return true;
  }




  selectedUser(e, dataid) {
 




    let keys = Object.keys(this.a[dataid].user.useridValue)
    let array1
    if (keys.length > 0) {
      // array1 = keys.filter(val => !e.includes((val.toString())));
      array1 = keys.filter(val => !e.includes((Number(val))));
      while (keys.length >= e.length && keys.length != e.length) {
    
        array1.forEach(element => {
          delete this.a[dataid].user.useridValue[element]
          keys = Object.keys(this.a[dataid].user.useridValue)
        });
      }

      e.forEach(element => {
        if (keys.includes(element.toString())) {

        } else {
          Object.assign(this.a[dataid]?.user['useridValue'], { [element]: 1 });
        }
      });
    } else {
      e.forEach(element => {

        Object.assign(this.a[dataid]?.user['useridValue'], { [element]: 1 });
      });


    }


    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(e, dataid),'selectedUser');
  }




  subscriptionChanges(val, id) {

    if (val == 0) {
   
      this.a[id].subscription.basic = true
      this.a[id].subscription.standard = false
      this.a[id].subscription.enterprise = false
      this.a[id].subscription.custom = false
      this.a[id].subscription.value = 'Basic'
    }

    if (val == 1) {
   
      this.a[id].subscription.standard = true
      this.a[id].subscription.basic = false
      this.a[id].subscription.enterprise = false
      this.a[id].subscription.custom = false
      this.a[id].subscription.value = 'Standard'

    }

    if (val == 2) {
     
      this.a[id].subscription.enterprise = true
      this.a[id].subscription.basic = false
      this.a[id].subscription.standard = false
      this.a[id].subscription.custom = false
      this.a[id].subscription.value = 'Enterprise'
    }

    if (val == 3) {
    
      this.a[id].subscription.custom = true
      this.a[id].subscription.basic = false
      this.a[id].subscription.standard = false
      this.a[id].subscription.enterprise = false
      this.a[id].subscription.value = 'Custom'
    }


    
  }


  deletefunction(e) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(e),'deletefunction');


    this.deletefuncount = this.selectedproductdel.length

    this.productdelcount = this.selectedproductdel.length;

    this.channeldelcount = this.selectedproductdel.length;

    this.roledelcount = this.selectedproductdel.length;


    if (this.selectedproductdel.length == 0) {
      this.insertfunction(e);
    }
    else {

      this.selectedproductdel.forEach(element => {

        if (this.path == null) {
          this.common.snackbar("General Error");
        } else {

          /////////////////PRODUCTS DELETE////////////////////////////////
          let obj = {
            data: {
              spname: "USP_UNFYD_PRODUCTS_PROCESSMAPPING",
              parameters: {
                flag: "DELETE",
                PROCESSID: this.path,
                UNFYDPRODUCTID: element.Id,
              }
            }
          }
          this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj),'deletefunction');

          this.api.post('index', obj).subscribe((res: any) => {
            this.loader = false;
            if (res.code == 200) {
              this.productdelcount--;
              this.insertfunction(e);
            } else {
              this.common.snackbar(res.results.data[0]);
            }
          },
            (error) => {
              this.common.snackbar("General Error");
            })

          /////////////////////CHANNEL DELETE ////////////////////////////

          let obj1 = {
            data: {
              spname: "USP_UNFYD_TALK_CHANNEL_PROCESS_MAPPING",
              parameters: {
                flag: "DELETE",
                PROCESSID: this.path,
                UNFYDPRODUCTID: 1,
              }
            }
          }
          this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj1),'deletefunction');

          this.api.post('index', obj1).subscribe((res: any) => {
            this.loader = false;
            if (res.code == 200) {
              this.channeldelcount--;
              this.insertfunction(e);
            } else {
              this.common.snackbar(res.results.data[0]);
            }
          },
            (error) => {
              this.common.snackbar("General Error");
            })


          /////////////////////role DELETE////////////////////////////


          let obj2 = {
            data: {
              spname: "usp_unfyd_role_process_mapping",
              parameters: {
                flag: "DELETE",
                PROCESSID: this.path,
                UNFYDPRODUCTID: element.Id,
              }
            }
          }
          this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj2),'deletefunction');

          this.api.post('index', obj2).subscribe((res: any) => {
            this.loader = false;
            if (res.code == 200) {
              this.roledelcount--;
              this.insertfunction(e);
            } else {
              this.common.snackbar(res.results.data[0]);
            }
          },
            (error) => {
              this.common.snackbar("General Error");
            })

          /////////////////////////////////////////////////

        }

        this.deletefuncount--;
      })
    }

    this.deletefuncval = true;
  }



  nextfunction(e) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(e),'nextfunction');


    this.loader = true;
   

    if (this.productName.length == 0) {
      this.common.snackbar("SelectAnyOneProduct");
      this.loader=false;
      return;
    }
    else if(this.selectedlang.length == 0)
    {
      this.common.snackbar("SelectLanguage");
      this.loader=false;
      return;
    }
    else {
      this.deletefunction(e);
    }

  }

  insertfunction(e) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(e),'insertfunction');

    this.loader = true;


    if (this.deletefuncount == 0 && this.productdelcount == 0 && this.channeldelcount == 0 && this.roledelcount == 0) {


      //////////////////PROCESSMASTER//////////////////////


      let processReqObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "UPDATE",

            AllowLOB: this.form.value.worklobcreation,
            CampaignCount: this.form.value.workcampaign,
            DailyTransLimit: this.form.value.worktransaction,

            SameShipAddress: this.ProcessObj.SameShipAddress,
            ShipAddress: this.ProcessObj.ShipAddress,
            ShipCountry: this.ProcessObj.ShipCountry,
            ShipZipcode: this.ProcessObj.ShipZipcode,
            ShipDistrict: this.ProcessObj.ShipDistrict,
            ShipState: this.ProcessObj.ShipState,
            BillAddress: this.ProcessObj.BillAddress,
            BillCountry: this.ProcessObj.BillCountry,
            BillZipcode: this.ProcessObj.BillZipcode,
            BillDistrict: this.ProcessObj.BillDistrict,
            BillState: this.ProcessObj.BillState,
            RecipientEmailID: this.ProcessObj.RecipientEmailID,
            PROCESSID: this.ProcessObj.ProcessId,

            FirstName: this.ProcessObj.FirstName,
            LastName: this.ProcessObj.LastName,
            designation: this.ProcessObj.Designation,
            ProcessName: this.ProcessObj.ProcessName,
            employeestrength: this.ProcessObj.EmployeeStrength,
            ShortCode: this.ProcessObj.ShortCode,
            country: this.ProcessObj.Country,
            countrycode: this.ProcessObj.CountryCode,
            MobileNo: this.ProcessObj.MobileNo,
            emailid: this.ProcessObj.EmailId,
            contracttype: this.ProcessObj.ContractType,
            startDate: this.ProcessObj.StartDate,
            endDate: this.ProcessObj.EndDate,

            Address: this.ProcessObj.Address,
            ArchiveConnectionString: this.ProcessObj.ArchiveConnectionString,
            BrowserName: this.ProcessObj.BrowserName,
            BrowserVersion: this.ProcessObj.BrowserVersion,

            ChannelMapped: this.ProcessObj.ChannelMapped,
            CompanyName: this.ProcessObj.CompanyName,
            ConnectionString: this.ProcessObj.ConnectionString,
            CopyDataMst: this.ProcessObj.CopyDataMst,
            CreateDB: this.ProcessObj.CreateDB,
            CreatedBy: this.ProcessObj.CreatedBy,
            CreatedOn: this.ProcessObj.CreatedOn,

            DeletedBy: this.ProcessObj.DeletedBy,
            DeletedOn: this.ProcessObj.DeletedOn,
            EmailIDverified: this.ProcessObj.EmailIDverified,
            IP: this.ProcessObj.IP,
            IsDeleted: this.ProcessObj.IsDeleted,
            LanguageMapped: this.ProcessObj.LanguageMapped,
            LicenseGenerated: this.ProcessObj.LicenseGenerated,
            LicenseUpload: this.ProcessObj.LicenseUpload,
            LinkUrl: this.ProcessObj.LinkUrl,
            Mobilenoverified: this.ProcessObj.Mobilenoverified,
            ModifiedBy: this.ProcessObj.ModifiedBy,
            ModifiedOn: this.ProcessObj.ModifiedOn,
            ModuleId: this.ProcessObj.ModuleId,
            Name: this.ProcessObj.Name,
            ParentProcessId: this.ProcessObj.ParentProcessId,
            PrivateIP: this.ProcessObj.PrivateIP,
            ProcessStatus: this.ProcessObj.ProcessStatus,
            PublicIP: this.ProcessObj.PublicIP,
            TimezoneOffset: this.ProcessObj.TimezoneOffset,
            Website: this.ProcessObj.Website,

          }
        }
      }


      this.common.hubControlEvent('Tenant','click','','',JSON.stringify(processReqObj),'insertfunction');

      this.api.post('index', processReqObj).subscribe((res: any) => {
        this.loader = false;
        if (res.code == 200) {


        } else {
          this.common.snackbar(res.results.data[0]);
        }
      },
        (error) => {
          this.common.snackbar("General Error");
        })




      ///////////////USP_UNFYD_PRODUCTS_PROCESSMAPPING

      this.productName.forEach(element => {
        if (this.path == null) {
          this.common.snackbar("General Error");
        } else {

          let obj = {
            data: {
              spname: "USP_UNFYD_PRODUCTS_PROCESSMAPPING",
              parameters: {
                flag: "INSERT",
                PROCESSID: this.path,
                UNFYDPRODUCTID: element.Id,
                SUBSCRIPTIONTYPE: this.a[element.Id].subscription.value,
                CAMPAIGNCOUNT: this.a[element.Id].workcampaign,
                DAILYTRANSLIMIT: this.a[element.Id].worktransaction,
                ALLOWLOB: this.a[element.Id].lob,
                CREATEDBY: this.userDetails.Id,
                PUBLICIP: this.userDetails.ip,
                BROWSERNAME: this.userDetails.browser,
                BROWSERVERSION: this.userDetails.browser_version

              }
            }
          }
          this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj),'insertfunction');

          this.api.post('index', obj).subscribe((res: any) => {
            this.loader = false;
            if (res.code == 200) {
            } else {
              this.common.snackbar(res.results.data[0]);
            }
          },
            (error) => {
              this.common.snackbar("General Error");
            })

        }

      })



      /////////////////////////////////////////



      ////////////////INUSP_UNFYD_TALK_CHANNEL_PROCESS_MAPPING
      let channelidNg = [{ Id: 1 }]
      channelidNg.forEach(element => {
        let productid = element.Id;
        let channelidloop = this.a[element.Id].channel.channelid;

        let storechannelid = []
        if (channelidloop == '') {
          this.common.snackbar("TenantSelectChannel");
          return;
        }

        channelidloop.forEach(element1 => {
          if (element1 == 0) {
          }
          else {



        
            let channelcount = this?.a[element.Id]?.channel['channelIdValue'][element1];

            storechannelid.push({ 'chid': element1, 'chcount': channelcount, 'chproductid': productid })
          }
        })

        this.channelroutecount = storechannelid.length;

        storechannelid.forEach(element => {
          if (this.path == null) {
            this.common.snackbar("General Error");
          }
          else {
            let maxchcount;
            if(this.MaxChannelLicenseCount== undefined ||this.MaxChannelLicenseCount== null)
            {
              maxchcount = 999
            }
            else
            {
              maxchcount=this.MaxChannelLicenseCount;
            }
            if (element.chcount == null || element.chcount == 0) {
              this.common.snackbar("TenantEnterChannelCounts");
              return;
            } else if (element.chcount >= maxchcount) {
              this.channelroutecount = 100;
              this.common.snackbar(this.labelName?.PleaseEnterChannelLicenselessthans ? this.labelName?.PleaseEnterChannelLicenselessthan : "Please Enter Channel License less than" +" "+ maxchcount,'error');
              // this.common.snackbar("TenantEnterChannelLicenseLessThan" + maxchcount);
              
              return;
            }
            else {



              let obj = {
                data: {
                  spname: "USP_UNFYD_TALK_CHANNEL_PROCESS_MAPPING",
                  parameters: {
                    flag: "INSERT",
                    PROCESSID: this.path,
                    CHANNELID: element.chid,
                    LICENSECOUNT: element.chcount,
                    UNFYDPRODUCTID: element.chproductid,
                    CREATEDBY: this.userDetails.Id,
                    PUBLICIP: this.userDetails.ip,
                    BROWSERNAME: this.userDetails.browser,
                    BROWSERVERSION: this.userDetails.browser_version

                  }
                }
              }

              this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj),'insertfunction');

              this.api.post('index', obj).subscribe((res: any) => {
                this.loader = false;
                if (res.code == 200) {
                  this.channelroutecount--;
                  this.routefunc(res,e);
                } else {
                  this.common.snackbar(res.results.data[0]);
                }
              },
                (error) => {
                  this.common.snackbar("General Error");
                })



            }
          }




        })

      })

      ////////////////////////////////////



      ////////////////usp_unfyd_role_process_mapping
      this.routeusercountloop = this.productName.length;
      this.productName.forEach(element => {

        let productid1 = element.Id;
        let useridloop = this.a[element.Id].user.userid;

        let storeuserid = []
        if (useridloop == '') {
          this.roleroutecount = 100;
          this.common.snackbar("TenantSelectUserLicense");
          return;
        }


        useridloop.forEach(element1 => {


          let userlicount = this?.a[element.Id]?.user['useridValue'][element1];
          storeuserid.push({ 'userid': element1, 'usercount': userlicount, 'userproductid': productid1 })
        })


        if (this.roleroutecount == 100) {
          this.roleroutecount = 100
        } else {
          this.roleroutecount = storeuserid.length;
        }

        let storeusercountval: any;
        storeusercountval = storeuserid.length;

        storeuserid.forEach(element => {







          if (this.path == null) {
            this.common.snackbar("General Error");
          }
          else {

                let userlicCount;

                if (element.userid == 1) {
                              if(this.MaxAdminLicenseCount== undefined ||this.MaxAdminLicenseCount== null)
                                    {userlicCount = 999}
                              else{userlicCount=this.MaxAdminLicenseCount;}
                      }
                if (element.userid == 2) {
                              if(this.MaxAgentLicenseCount== undefined ||this.MaxAgentLicenseCount== null)
                              {userlicCount = 999}
                              else{userlicCount=this.MaxAgentLicenseCount;}
                      }
                if (element.userid == 3) {
                              if(this.MaxSupervisorLicenseCount== undefined ||this.MaxSupervisorLicenseCount== null)
                              {userlicCount = 999}
                              else{userlicCount=this.MaxSupervisorLicenseCount;}
                      }


            if (element.usercount == null || element.usercount == 0) {
              this.roleroutecount = 100;
              this.common.snackbar("TenantEnterUserLicense");
              return;
            }
             else if (element.userid == 1 && element.usercount >= userlicCount) {
              this.roleroutecount = 100;
              this.common.snackbar2Paramerter("PleaseEnterAdminLicenselessthan",userlicCount);
              return;
            }
            else if (element.userid == 2 && element.usercount >= userlicCount) {
              this.roleroutecount = 100;
              this.common.snackbar2Paramerter("PleaseEnterAgentLicenselessthan",userlicCount);
              return;
            }
            else if (element.userid == 3 && element.usercount >= userlicCount) {
              this.roleroutecount = 100;
              this.common.snackbar2Paramerter("PleaseEnterSupervisorLicenselessthan",userlicCount);
              return;

            }
            else {


              let obj = {
                data: {
                  spname: "usp_unfyd_role_process_mapping",
                  parameters: {
                    flag: "INSERT",
                    RoleId: element.userid,
                    LICENSECOUNT: element.usercount,
                    UNFYDPRODUCTID: element.userproductid,
                    PROCESSID: this.path,
                    CREATEDBY: this.userDetails.Id,
                    PUBLICIP: this.userDetails.ip,
                    BROWSERNAME: this.userDetails.browser,
                    BROWSERVERSION: this.userDetails.browser_version
                  }
                }
              }


              this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj),'insertfunction');

              this.api.post('index', obj).subscribe((res: any) => {
                this.loader = false;
                if (res.code == 200) {
                  this.roleroutecount--;

                  storeusercountval--;
                  if (storeusercountval == 0) {
                    this.routeusercountloop--;
                    if (this.routeusercountloop == 0) {
                      this.routefunc(res,e);
                    }

                  }
                } else {
                  this.common.snackbar(res.results.data[0]);
                }
              },
                (error) => {
                  this.common.snackbar("General Error");
                })


            }
          }

        })

      })

      /////////////////////////////////////////////




      ////////////////////////INSERT LANGUAGE////////////////////////////////


      let langid = this.languageid.join();
      let obj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "INSERT_LANGUAGE_DATA",
            LANGUAGECODE: langid,
            PROCESSID: this.path,
            CREATEDBY: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version,
          }
        }
      }
      this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj),'insertfunction');

      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
        }
      })



      //////////////////////////////////////////////////////






      //////if ends////////////
    }

  }


  routefunc(res,e) {
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(res),'routefunc');

    if (this.channelroutecount == 0 && this.routeusercountloop == 0) {

      if (this.defaultdataval == false) {

//////////////////////////////////////////////////

        let channelidtostring = this.channelid.join();
        let productidtostring = this.productid.join();
        this.requestObj = {
          data: {
            spname: "usp_unfyd_default_data",
            parameters: {
              PROCESSID: this.path,
              CHANNELID: channelidtostring,
              PRODUCTID: productidtostring,
              CREATEDBY: this.userDetails.Id,
              PUBLICIP: this.userDetails.ip,
              BROWSERNAME: this.userDetails.browser,
              BROWSERVERSION: this.userDetails.browser_version,
              SHORTCODE: this.ProcessObj.ShortCode
            }
          }
        }
        this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'routefunc');

        this.api.post('index', this.requestObj).subscribe((res: any) => {
          if (res.code == 200) {
            this.WebchatService()
          }
        }
        )


//////////////////////////////////////////////////

        this.requestObj = {
          data: {
            spname: "usp_unfyd_dashboardprop_default",
            parameters: {
              PROCESSID: this.path
            }
          }
        }
        this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'routefunc');

        this.api.post('dashboard/workspace', this.requestObj).subscribe((res: any) => {
          if (res.code == 200) {
          }
        })


      }
      if (this.defaultdataval !== false) {
        this.WebchatService()
      }


      this.common.snackbar("Saved Success");

      if(e !== 'save')
      {
      this.router.navigate(['masters/tenant/billing-details', this.path == null ? res.results.data[0].ProcessId : this.path]);
      }
      return;
    }
  }

WebchatService()
{

  this.channelStore = [];
  let webarr = [];

  this.channelStore=this.a[1].channel.channelid

  this.channelStore.forEach(element => {
    this.channelType.forEach(element2 => {
      if(element2.ChannelId == element)
      {
        webarr.push(element2.ChannelName)
      }
    })


  });


    this.requestObj = {
      data: {
        CHANNELSOURCE: "TenantMaster",
        parameter:"GetConfigurations",
        CHANNEL: webarr.join(),
        URL:"",
        TENANTID: this.path,
        FLAG:"INSERT",
        SOURCE:""
      }
    }
    this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'WebchatService');

    this.api.post('webchatservice', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
      }
    })

}



  ////////////reset function starts////////////////////////////////

  resetfunc() {
    this.common.hubControlEvent('Tenant','click','','','','resetfunc');



    this.productcountval = this.productName.length

    this.productName.forEach(element => {



      this.a[element.Id]?.channel['channelid'].splice(0, this.a[element.Id]?.channel['channelid'])
      delete this.a[element.Id].channel['channelIdValue']





      this.a[element.Id]?.user['userid'].splice(0, this.a[element.Id]?.user['userid'])
      delete this.a[element.Id].user['useridValue']


      this.productcountval--;
      this.resetproductarr();
    })



  }

  resetproductarr() {
    this.common.hubControlEvent('Tenant','click','','','','resetproductarr');

    if (this.productcountval == 0) {
      this.productName.splice(0, this.productName.length)
    }

  }

  ////////////reset function ends///////////////////////////////////












  ///////////////save function starts///////////////////////////////


  savefunction() {
    this.common.hubControlEvent('Tenant','click','','','','savefunction');


this.loader=true;

if(this.productName.length == 0)
{
  this.common.snackbar("Select any one Product");
  this.loader=false;
  return;
}
else if(this.selectedlang.length == 0)
{
  this.common.snackbar("Please Select Language");
  this.loader=false;
  return;
}
else{
  this.savedeletefunction();

  }





    this.savedeletefunction();

  }



  savedeletefunction() {
    
    this.common.hubControlEvent('Tenant','click','','','','savedeletefunction');


    this.deletefuncount = this.productName.length

    this.productdelcount = this.productName.length;

    this.channeldelcount = this.productName.length;

    this.roledelcount = this.productName.length;

    this.productName.forEach(element => {

      if (this.path == null) {
        this.common.snackbar("General Error");
      } else {

        /////////////////PRODUCTS DELETE////////////////////////////////
        let obj = {
          data: {
            spname: "USP_UNFYD_PRODUCTS_PROCESSMAPPING",
            parameters: {
              flag: "DELETE",
              PROCESSID: this.path,
              UNFYDPRODUCTID: element.Id,
            }
          }
        }
        this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj),'savedeletefunction');

        this.api.post('index', obj).subscribe((res: any) => {
          this.loader = false;
          if (res.code == 200) {
            this.productdelcount--;
            this.saveinsertfunction();
          } else {
            this.common.snackbar(res.results.data[0]);
          }
        },
          (error) => {
            this.common.snackbar("General Error");
          })

        /////////////////////CHANNEL DELETE ////////////////////////////

        let obj1 = {
          data: {
            spname: "USP_UNFYD_TALK_CHANNEL_PROCESS_MAPPING",
            parameters: {
              flag: "DELETE",
              PROCESSID: this.path,
              UNFYDPRODUCTID: 1,
            }
          }
        }
        this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj1),'savedeletefunction');

        this.api.post('index', obj1).subscribe((res: any) => {
          this.loader = false;
          if (res.code == 200) {
            this.channeldelcount--;
            this.saveinsertfunction();
          } else {
            this.common.snackbar(res.results.data[0]);
          }
        },
          (error) => {
            this.common.snackbar("General Error");
          })


        /////////////////////role DELETE////////////////////////////


        let obj2 = {
          data: {
            spname: "usp_unfyd_role_process_mapping",
            parameters: {
              flag: "DELETE",
              PROCESSID: this.path,
              UNFYDPRODUCTID: element.Id,
            }
          }
        }
        this.common.hubControlEvent('Tenant','click','','',JSON.stringify(obj2),'savedeletefunction');

        this.api.post('index', obj2).subscribe((res: any) => {
          this.loader = false;
          if (res.code == 200) {
            this.roledelcount--;
            this.saveinsertfunction();
          } else {
            this.common.snackbar(res.results.data[0]);
          }
        },
          (error) => {
            this.common.snackbar("General Error");
          })

        /////////////////////////////////////////////////

      }

      this.deletefuncount--;
    })

    this.deletefuncval = true;
  }



  saveinsertfunction() {
    this.loader = true;

    if (this.deletefuncount == 0 && this.productdelcount == 0 && this.channeldelcount == 0 && this.roledelcount == 0) {



      //////////////////PROCESSMASTER//////////////////////


      let processReqObj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "UPDATE",

            AllowLOB: this.form.value.worklobcreation,
            CampaignCount: this.form.value.workcampaign,
            DailyTransLimit: this.form.value.worktransaction,

            SameShipAddress: this.ProcessObj.SameShipAddress,
            ShipAddress: this.ProcessObj.ShipAddress,
            ShipCountry: this.ProcessObj.ShipCountry,
            ShipZipcode: this.ProcessObj.ShipZipcode,
            ShipDistrict: this.ProcessObj.ShipDistrict,
            ShipState: this.ProcessObj.ShipState,
            BillAddress: this.ProcessObj.BillAddress,
            BillCountry: this.ProcessObj.BillCountry,
            BillZipcode: this.ProcessObj.BillZipcode,
            BillDistrict: this.ProcessObj.BillDistrict,
            BillState: this.ProcessObj.BillState,
            RecipientEmailID: this.ProcessObj.RecipientEmailID,
            PROCESSID: this.ProcessObj.ProcessId,

            FirstName: this.ProcessObj.FirstName,
            LastName: this.ProcessObj.LastName,
            designation: this.ProcessObj.Designation,
            ProcessName: this.ProcessObj.ProcessName,
            employeestrength: this.ProcessObj.EmployeeStrength,
            ShortCode: this.ProcessObj.ShortCode,
            country: this.ProcessObj.Country,
            countrycode: this.ProcessObj.CountryCode,
            MobileNo: this.ProcessObj.MobileNo,
            emailid: this.ProcessObj.EmailId,
            contracttype: this.ProcessObj.ContractType,
            startDate: this.ProcessObj.StartDate,
            endDate: this.ProcessObj.EndDate,

            Address: this.ProcessObj.Address,
            ArchiveConnectionString: this.ProcessObj.ArchiveConnectionString,
            BrowserName: this.ProcessObj.BrowserName,
            BrowserVersion: this.ProcessObj.BrowserVersion,

            ChannelMapped: this.ProcessObj.ChannelMapped,
            CompanyName: this.ProcessObj.CompanyName,
            ConnectionString: this.ProcessObj.ConnectionString,
            CopyDataMst: this.ProcessObj.CopyDataMst,
            CreateDB: this.ProcessObj.CreateDB,
            CreatedBy: this.ProcessObj.CreatedBy,
            CreatedOn: this.ProcessObj.CreatedOn,

            DeletedBy: this.ProcessObj.DeletedBy,
            DeletedOn: this.ProcessObj.DeletedOn,
            EmailIDverified: this.ProcessObj.EmailIDverified,
            IP: this.ProcessObj.IP,
            IsDeleted: this.ProcessObj.IsDeleted,
            LanguageMapped: this.ProcessObj.LanguageMapped,
            LicenseGenerated: this.ProcessObj.LicenseGenerated,
            LicenseUpload: this.ProcessObj.LicenseUpload,
            LinkUrl: this.ProcessObj.LinkUrl,
            Mobilenoverified: this.ProcessObj.Mobilenoverified,
            ModifiedBy: this.ProcessObj.ModifiedBy,
            ModifiedOn: this.ProcessObj.ModifiedOn,
            ModuleId: this.ProcessObj.ModuleId,
            Name: this.ProcessObj.Name,
            ParentProcessId: this.ProcessObj.ParentProcessId,
            PrivateIP: this.ProcessObj.PrivateIP,
            ProcessStatus: this.ProcessObj.ProcessStatus,
            PublicIP: this.ProcessObj.PublicIP,
            TimezoneOffset: this.ProcessObj.TimezoneOffset,
            Website: this.ProcessObj.Website,

          }
        }
      }


      this.common.hubControlEvent('Tenant','click','','',JSON.stringify(processReqObj),'saveinsertfunction');

      this.api.post('index', processReqObj).subscribe((res: any) => {
        this.loader = false;
        if (res.code == 200) {
          this.common.snackbar("Saved Success");
        } else {
          this.common.snackbar(res.results.data[0]);
        }
      },
        (error) => {
          this.common.snackbar("General Error");
        })


      //////////////////////////////////////


      ///////////////USP_UNFYD_PRODUCTS_PROCESSMAPPING

      this.productName.forEach(element => {
        if (this.path == null) {
          this.common.snackbar("General Error");
        } else
         {

          let obj = {
            data: {
              spname: "USP_UNFYD_PRODUCTS_PROCESSMAPPING",
              parameters: {
                flag: "INSERT",
                PROCESSID: this.path,
                UNFYDPRODUCTID: element.Id,
                SUBSCRIPTIONTYPE: this.a[element.Id].subscription.value,
                CAMPAIGNCOUNT: this.a[element.Id].workcampaign,
                DAILYTRANSLIMIT: this.a[element.Id].worktransaction,
                ALLOWLOB: this.a[element.Id].lob,
                CREATEDBY: this.userDetails.Id,
                PUBLICIP: this.userDetails.ip,
                BROWSERNAME: this.userDetails.browser,
                BROWSERVERSION: this.userDetails.browser_version

              }
            }
          }
          this.common.hubControlEvent('Tenant','click','INSERT','',JSON.stringify(obj),'saveinsertfunction');

          this.api.post('index', obj).subscribe((res: any) => {
            this.loader = false;
            if (res.code == 200) {
            } else {
              this.common.snackbar(res.results.data[0]);
            }
          },
            (error) => {
              this.common.snackbar("General Error");
            })

        }

      })



      /////////////////////////////////////////



      ////////////////INUSP_UNFYD_TALK_CHANNEL_PROCESS_MAPPING
      let channelidNg = [{ Id: 1 }]
      channelidNg.forEach(element => {
        let productid = element.Id;
        let channelidloop = this.a[element.Id].channel.channelid;

        let storechannelid = []
       

        channelidloop.forEach(element1 => {

          let channelcount = this?.a[element.Id]?.channel['channelIdValue'][element1];

          storechannelid.push({ 'chid': element1, 'chcount': channelcount, 'chproductid': productid })
        })





        storechannelid.forEach(element => {



          if (this.path == null) {
            this.common.snackbar("General Error");
          }
          else {

            let maxchcount;

            if(this.MaxChannelLicenseCount== undefined ||this.MaxChannelLicenseCount== null)
            {
              maxchcount = 999
            }
            else
            {
              maxchcount=this.MaxChannelLicenseCount;
            }



		    	 if (element.chcount == null || element.chcount == 0) {
              this.common.snackbar("TenantEnterChannelCounts");
              return;
            } else if (element.chcount >= maxchcount) {
              this.channelroutecount = 100;
              this.common.snackbar("Please Enter Channel License less than " + maxchcount,'error');
              return;
            }
            else {

              let obj = {
                data: {
                  spname: "USP_UNFYD_TALK_CHANNEL_PROCESS_MAPPING",
                  parameters: {
                    flag: "INSERT",
                    PROCESSID: this.path,
                    CHANNELID: element.chid,
                    LICENSECOUNT: element.chcount,
                    UNFYDPRODUCTID: element.chproductid,
                    CREATEDBY: this.userDetails.Id,
                    PUBLICIP: this.userDetails.ip,
                    BROWSERNAME: this.userDetails.browser,
                    BROWSERVERSION: this.userDetails.browser_version

                  }
                }
              }

              this.common.hubControlEvent('Tenant','click','INSERT','',JSON.stringify(obj),'saveinsertfunction');

              this.api.post('index', obj).subscribe((res: any) => {
                this.loader = false;
                if (res.code == 200) {
                } else {
                  this.common.snackbar(res.results.data[0]);
                }
              },
                (error) => {
                  this.common.snackbar("General Error");
                })

            }

          }





        })

      })




      ////////////////usp_unfyd_role_process_mapping

      this.productName.forEach(element => {

        let productid1 = element.Id;
        let useridloop = this.a[element.Id].user.userid;

        let storeuserid = []
       

        useridloop.forEach(element1 => {


          let userlicount = this?.a[element.Id]?.user['useridValue'][element1];

          storeuserid.push({ 'userid': element1, 'usercount': userlicount, 'userproductid': productid1 })
        })


        storeuserid.forEach(element => {



          if (this.path == null) {
            this.common.snackbar("General Error");
          }
          else {

         

                  let userlicCount;

                  if (element.userid == 1) {
                                if(this.MaxAdminLicenseCount== undefined ||this.MaxAdminLicenseCount== null)
                                      {userlicCount = 999}
                                else{userlicCount=this.MaxAdminLicenseCount;}
                        }
                  if (element.userid == 2) {
                                if(this.MaxAgentLicenseCount== undefined ||this.MaxAgentLicenseCount== null)
                                {userlicCount = 999}
                                else{userlicCount=this.MaxAgentLicenseCount;}
                        }
                  if (element.userid == 3) {
                                if(this.MaxSupervisorLicenseCount== undefined ||this.MaxSupervisorLicenseCount== null)
                                {userlicCount = 999}
                                else{userlicCount=this.MaxSupervisorLicenseCount;}
                        }


              if (element.usercount == null || element.usercount == 0) {
                this.roleroutecount = 100;
                this.common.snackbar("TenantEnterUserLicense");
                return;
              }
              else if (element.userid == 1 && element.usercount >= userlicCount) {
                this.roleroutecount = 100;
                // this.common.snackbar("Please Enter Admin License less than "+userlicCount,'error');
                this.common.snackbar2Paramerter("PleaseEnterAdminLicenselessthan",userlicCount);
                return;
              }
              else if (element.userid == 2 && element.usercount >= userlicCount) {
                this.roleroutecount = 100;
                // this.common.snackbar("Please Enter Agent License less than "+userlicCount,'error');
                this.common.snackbar2Paramerter("PleaseEnterAgentLicenselessthan",userlicCount);
                return;
              }
              else if (element.userid == 3 && element.usercount >= userlicCount) {
                this.roleroutecount = 100;
                // this.common.snackbar("Please Enter Supervisor License less than "+userlicCount,'error');
                this.common.snackbar2Paramerter("PleaseEnterSupervisorLicenselessthan",userlicCount);
                return;

              }



            else {


              let obj = {
                data: {
                  spname: "usp_unfyd_role_process_mapping",
                  parameters: {
                    flag: "INSERT",
                    RoleId: element.userid,
                    LICENSECOUNT: element.usercount,
                    UNFYDPRODUCTID: element.userproductid,
                    PROCESSID: this.path,
                    CREATEDBY: this.userDetails.Id,
                    PUBLICIP: this.userDetails.ip,
                    BROWSERNAME: this.userDetails.browser,
                    BROWSERVERSION: this.userDetails.browser_version
                  }
                }
              }


              this.common.hubControlEvent('Tenant','click','INSERT','',JSON.stringify(obj),'saveinsertfunction');

              this.api.post('index', obj).subscribe((res: any) => {
                this.loader = false;
                if (res.code == 200) {
                } else {
                  this.common.snackbar(res.results.data[0]);
                }
              },
                (error) => {
                  this.common.snackbar("General Error");
                })


            }
          }

        })

      })



      ///////////////////


      if (this.defaultdataval == false) {
        let channelidtostring = this.channelid.join();
        let productidtostring = this.productid.join();
        this.requestObj = {
          data: {
            spname: "usp_unfyd_default_data",
            parameters: {
              PROCESSID: this.path,
              CHANNELID: channelidtostring,
              PRODUCTID: productidtostring,
              CREATEDBY: this.userDetails.Id,
              PUBLICIP: this.userDetails.ip,
              BROWSERNAME: this.userDetails.browser,
              BROWSERVERSION: this.userDetails.browser_version,
              SHORTCODE: this.ProcessObj.ShortCode
            }
          }
        }
        this.common.hubControlEvent('Tenant','click','INSERT','',JSON.stringify(this.requestObj),'saveinsertfunction');

        this.api.post('index', this.requestObj).subscribe((res: any) => {
          if (res.code == 200) {
            this.WebchatService()
          }
        }

        )



        this.requestObj = {
          data: {
            spname: "usp_unfyd_dashboardprop_default",
            parameters: {
              PROCESSID: this.path
            }
          }
        }
        this.common.hubControlEvent('Tenant','click','','',JSON.stringify(this.requestObj),'saveinsertfunction');

        this.api.post('dashboard/workspace', this.requestObj).subscribe((res: any) => {
          if (res.code == 200) {
          }
        })


      }

      ////////////////////////INSERT LANGUAGE////////////////////////////////


      let langid = this.languageid.join();
      let obj = {
        data: {
          spname: "usp_unfyd_tenant",
          parameters: {
            flag: "INSERT_LANGUAGE_DATA",
            LANGUAGECODE: langid,
            PROCESSID: this.path,
            CREATEDBY: this.userDetails.Id,
            PUBLICIP: this.userDetails.ip,
            BROWSERNAME: this.userDetails.browser,
            BROWSERVERSION: this.userDetails.browser_version,
          }
        }
      }
      this.common.hubControlEvent('Tenant','click','LANGUAGE','',JSON.stringify(this.requestObj),'saveinsertfunction');

      this.api.post('index', obj).subscribe((res: any) => {
        if (res.code == 200) {
        }
      })





      if (this.defaultdataval !== false) {
        this.WebchatService()
      }



    }

  }
  toggleSelection(change: MatCheckboxChange): void {
    // this.common.hubControlEvent('Tenant','click','LANGUAGE','',JSON.stringify(change),'toggleSelection');

    if (change.checked) {
      this.a[1].channel.channelid = this.channelType.map(item => item.ChannelId);

    } else {
      this.a[1].channel.channelid = []
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.forEach((e) => {
        e.unsubscribe();
      });
    }
  }












  backClicked() {
    this.location.back();
  }

}




