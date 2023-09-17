import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';
@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {
  form: FormGroup;
  loader:boolean = false;
  colorValue: any = '';
  userDetails: any;
  config: any;
  labelName: any;
  path: any;
  theme: any;
  prodid: any;
  requestObj: { data: { spname: string; parameters: { flag: string; CONFIGKEY: any; status: Event; PRODUCTID: any; }; }; };
  reqObj: any;
  editobj: any;
  color2:any ='';
  iscustomizetheme :boolean=false;
  constructor( private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    public common: CommonService,
    private api: ApiService) { }

  


  ngOnInit(): void {
    this.getSnapShot();

    this.form = this.formBuilder.group({
      Color: ['', [Validators.nullValidator]],
      Font:['', [Validators.nullValidator]]
    })


    this.path = this.activatedRoute.snapshot.paramMap.get('theme');
    this.theme = this.activatedRoute.snapshot.paramMap.get('theme');
    this.prodid = this.activatedRoute.snapshot.paramMap.get('proid');


    if(this.theme == 'customizetheme')
    {
      this.iscustomizetheme= true;
    }else{
      this.iscustomizetheme= false;
    }


this.loader= true


    this.editobj = {
      data: {
        spname: 'usp_unfyd_app_settings',
        parameters: {
          flag: 'GET_TREE_MODULE',
          processid: this.userDetails.Processid,
          productid: this.prodid
        },
      },
    };
    this.api.post('index', this.editobj).subscribe(res => {     
      if (res.code == 200) {
       
        
        let resloop = res.results.data
        resloop.forEach(element => {
        if(element.ConfigKey == this.theme){
         
            if(element.AssignedValue == ''|| element.AssignedValue == null)
            {
              if(element.ConfigKey == 'darkbluetheme')
              {
                this.color2 = 'darkblue';
              }
              if(element.ConfigKey == 'greentheme')
              {
                this.color2 = 'green';
              }
              if(element.ConfigKey == 'bluetheme')
              {
                this.color2 = 'blue';
              }
              if(element.ConfigKey == 'orangetheme')
              {
                this.color2 = 'orange';
              }
              if(element.ConfigKey == 'darktheme')
              {
                this.color2 = 'gray';
              }   
              if(element.ConfigKey == 'customizetheme')
              {
                this.color2 = 'blue';
              }                
            }else{
              this.color2 =  element.AssignedValue;
            }


            if(element.AdditionalProperty == ''|| element.AdditionalProperty == null)
            {
              if(element.ConfigKey == 'darkbluetheme')
              {
                this.form.patchValue({
                  Font:"10"
              });   
              }
              if(element.ConfigKey == 'greentheme')
              {
                this.form.patchValue({
                  Font:"10"
              });   
              }
              if(element.ConfigKey == 'bluetheme')
              {
                this.form.patchValue({
                  Font:"10"
              });   
              }
              if(element.ConfigKey == 'orangetheme')
              {
                this.form.patchValue({
                  Font:"10"
              });   
              }
              if(element.ConfigKey == 'darktheme')
              {
                this.form.patchValue({
                  Font:"10"
              });   
              }   
              if(element.ConfigKey == 'customizetheme')
              {
                this.form.patchValue({
                  Font:"10"
              });   
              }                
            }else{
              this.form.patchValue({
                Font:element.AdditionalProperty
            });   
            }

                     
           
           }
         
        });
        this.loader = false;
      }
    });




    

  }
  
  setLabelByLanguage(data) {
    this.common.setLabelConfig(this.userDetails.Processid, 'users', data)
    this.common.getLabelConfig$.subscribe(data => {
      this.labelName = data;
    });
  }

  getSnapShot() {
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

  

  back(): void {
    this.router.navigate(['masters/branding/app-settings'], { queryParams: { productid: this.prodid } });
  }
  add(){
   
    let colorcodevar = this.common.color2[this.color2]
    let colorcodedata =  colorcodevar.replace(/\s+/g, '');

    this.reqObj={
      "data":{
        "spname":"usp_unfyd_app_settings",
        "parameters":{
          flag:"UPDATE_THEME_PROPERTY",
          AdditionalProperty:this.form.value.Font,
          ASSIGNEDPROPERTY:colorcodedata,
          ASSIGNEDVALUE:this.color2,
          CONFIGKEY:this.theme,          
          PRODUCTID:this.prodid,
          modifiedby: this.userDetails.Id,
        }
      }
    }
    this.api.post('index',this.reqObj).subscribe((res:any) => {
      if(res.code == 200){
        this.common.snackbar(res.results.data[0].result, "success");
      }
    },
    (error)=>{
      this.common.snackbar("General Error");
    })

  }
}
