import { Component, OnInit, HostListener, EventEmitter, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthService } from "src/app/global/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "src/app/components/dialog/dialog.component";
import { CommonService } from "src/app/global/common.service";
import { NotifierOptions } from "angular-notifier";
import { ApiService } from "src/app/global/api.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Output() openProfileMenuDrawer = new EventEmitter<any>()
  openSetting = false;
  userDetails: any;
  hawker: any = false;
  UserProfile: any;
  userActivity;
  userInactive: Subject<any> = new Subject();
  branding: any;
  val: any;
  localizationData: any;
  localizationDataAvailble: boolean = false;
  languagesByTenant = [];
  drawerEnabled = false;
  open: boolean;

  langSelected:any
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public auth: AuthService,
    public common: CommonService,
    public dialog: MatDialog,
    private api: ApiService
  ) {

  }

  ngOnInit(): void {
    this.common.hubControlEvent('header','click','pageload','pageload','','ngOnInit');

    this.auth.setBranding();
    this.auth.getBranding$.subscribe((data) => {
      if (data.code == 200) {
        this.branding = JSON.parse(data.results.data);
      }
    });
    this.hawker = this.auth.getHawker();
    this.userDetails = this.auth.getUser();
    this.getLangSelected()
    if(this.languagesByTenant.length <= 0) this.languageDataFromTenant()
    this.common.localizationDataAvailable$.subscribe((res)=>{
      this.localizationDataAvailble = res;
    })
    this.common.localizationInfo$.subscribe((res1)=>{
      this.localizationData = []
      this.localizationData = res1;
    });
    if (
      this.userDetails.FirstName == "Unfyd" ||
      this.userDetails.FirstName == "unfyd"
    ) {
      this.userDetails.FirstName = this.userDetails.FirstName.toUpperCase();
    }
    this.UserProfile =
      this.userDetails.ProfilePic == ""
        ? "assets/images/avatar.png"
        : this.userDetails.ProfilePic == null
        ? "assets/images/avatar.png"
        : this.userDetails.ProfilePic;


    this.common.hubControlEvent('header','click','pageloadend','pageloadend','','ngOnInit');

    this.common.setMobileMenu$.subscribe(res => {
      this.toggle = res;
    })

  }

  getLangSelected(){
    this.common.hubControlEvent('header','click','','','','getLangSelected');

    this.langSelected = localStorage.getItem('lang')
  }
  logout(activity): void {
    this.common.hubControlEvent('header','click','','',JSON.stringify(activity),'logout');

    this.auth.logout(activity);

    const notifierDefaultOptions: NotifierOptions = {
      position: {
        horizontal: {
          position: "left",
          distance: 12,
        },
        vertical: {
          position: "bottom",
          distance: 12,
          gap: 10,
        },
      },
      theme: "material",
      behaviour: {
        autoHide: 5000,
        onClick: false,
        onMouseover: "pauseAutoHide",
        showDismissButton: true,
        stacking: 4,
      },
      animations: {
        enabled: true,
        show: {
          preset: "slide",
          speed: 300,
          easing: "ease",
        },
        hide: {
          preset: "fade",
          speed: 300,
          easing: "ease",
          offset: 50,
        },
        shift: {
          speed: 300,
          easing: "ease",
        },
        overlap: 150,
      },
    };
  }

  setlanguage(code) {
    this.common.hubControlEvent('header','click','','',JSON.stringify(code),'setlanguage');

    localStorage.setItem("lang", code)
    this.common.setLanguageConfig(code);
    this.common.setLanguageChanged(code)
    this.getLangSelected()
  }
  setPassword(type) {
    this.common.hubControlEvent('header','click','','',JSON.stringify(type),'setPassword');
    

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        Id: this.userDetails.Id,
        Password: this.userDetails.Password,
        UserName: this.userDetails.UserName,
        UserStatus: this.userDetails.UserStatus,
        Processid: this.userDetails.Processid,
      },
      width: "450px",
    });
    dialogRef.afterClosed().subscribe((status) => {
      if (status.event == true) {

        if(status.data.msg == 'PasswordChanged')
        {
          this.auth.logout('');
        }

      }
    });
   
  }

  openDialog(type) {
    this.common.hubControlEvent('header','click','','',JSON.stringify(type),'openDialog');

    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        type: type,
        title: "Are you sure?",
        subTitle: "You want to end the day",
      },
      width: "300px",
    });
    dialogRef.afterClosed().subscribe((status) => {
      if (status == true) {
      }
    });
  }


  languageDataFromTenant() {
    let obj = {
      data: {
        spname: "usp_unfyd_tenant",
        parameters: {
          FLAG: "GET_LANGUAGE_DATA",
          PROCESSID: this.userDetails.Processid,
        },
      },
    };
    this.common.hubControlEvent('header','click','','',JSON.stringify(obj),'languageDataFromTenant');

    this.api.post("index", obj).subscribe((res) => {
      if (res.code == 200) {
        if (Object.keys(res.results).length > 0) {
          res.results.data.forEach((element) => {
            this.languagesByTenant.push(element.LanguageCode);
          });
        }
      }
    });
  }
  toggle: boolean;
  goToSubmenu(){
    this.toggle = !this.toggle
    this.common.MobileMenu(this.toggle);
  }
}
