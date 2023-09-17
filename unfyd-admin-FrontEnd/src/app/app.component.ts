import { Component, HostListener,VERSION, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { filter } from 'rxjs/operators';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from './global/auth.service';
import { ApiService } from './global/api.service';
// import { io } from 'socket.io-client';
import { MatDialog } from '@angular/material/dialog';
import { asideBarMenu, asideBarReportmenu } from 'src/app/global/json-data';
import { OrderByPipe } from './order-by.pipe';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDrawer } from '@angular/material/sidenav';
import { DialogComponent } from './components/dialog/dialog.component';
import { I } from '@angular/cdk/keycodes';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { PitchCommonService } from './global/pitch-common.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // animations: [
  //   trigger('slideInOut', [
  //     state('in', style({
  //       transform: 'translate3d(0, 0, 0)'
  //     })),
  //     state('out', style({
  //       transform: 'translate3d(-100%, 0, 0)'
  //     })),
  //     transition('in => out', animate('400ms ease-in-out')),
  //     transition('out => in', animate('400ms ease-in-out'))
  //   ]),
  // ],
  animations: [
    trigger("onOff", [
      transition(":enter", [
        style({
          opacity: 0,
          transform: "translatex(-100%)",
        }),
        animate(400),
      ]),
      transition(":leave", [
        style({
          opacity: 1,
          transform: "translatex(0%)",
        }),
        animate(400),
      ]),
    ]),
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {
      provide: MAT_DATE_FORMATS, deps: [CommonService], useFactory: (common: CommonService) => {
        let a: any = {
          parse: {
            dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
          },
          display: {
            dateInput: 'dddd/MMM/YYYY', // this is how your date will get displayed on the Input
            monthYearLabel: 'MMMM YYYY',
            dateA11yLabel: 'LL',
            monthYearA11yLabel: 'MMMM YYYY'
          }
        };
        common.localizationInfo$.subscribe((res1) => {
          a.display.dateInput = res1.selectedDateFormats.toUpperCase()
        })
        common.localizationDataAvailable$.subscribe((res) => {
          if (res) {
            common.localizationInfo$.subscribe((res1) => {
              a.display.dateInput = res1.selectedDateFormats.toUpperCase()
            })
          }
        })
        return a
      }
    }
  ]
})
export class AppComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin]
  };

  @ViewChild('openProfileMenuDrawer') public openProfileMenuDrawer: MatDrawer;
  openSetting = false
  title = 'Ampersand';
  isDashboard = true;
  sessionContent: boolean;
  drawerArrow: boolean = false;
  isChild: any = [];
  menuState: string = 'out';
  hawker = false;
  hawkerID: any = null
  logoutTimeout: any;
  thirtymin = 30 * 60 * 1000;
  reports: boolean = false;
  
  //  socket: any = io('https://cx1.unfyd.com:3002', { transports: ['websocket', 'polling', 'flashsocket'] });
  // socket: any = io('https://localhost:3002', {path:'/adminserver/', transports: ['websocket', 'polling', 'flashsocket'] });
  // socket: any = io('https://cx2.unfyd.com', {path:'/adminserver/', transports: ['websocket', 'polling', 'flashsocket'] });

  name = 'Angular ' + VERSION.major;
  fullScreenDashboard : boolean = false;
  path: string;
  editObj: any;
  userProfileStrore:any={};
  UserProfile:any;
  userDetails: any;
  requestObj: { data: { spname: string; parameters: { flag: string; processid: any; }; }; };
  skillType: any=[];
  getGroupList: any=[];
  contactCenterLocation: any=[];
  channelType: any=[];
displayValue: any;
drawerEnabled = false;
objectKeys = Object.keys;
  requestObj1: { data: { spname: string; parameters: { flag: string; processid: any; productid: number; }; }; };
  languageType: any=[];
  open: boolean;
  isMobileSubMenu : boolean =false;
// connections = [
  //   {
  //     group: "a",
  //     items: [
  //       {
  //         id: "1",
  //         name: "Andre"
  //       },
  //       {
  //         id: "2",
  //         name: "David"
  //       }
  //     ]
  //   },
  //   {
  //     group: "b",
  //     items: [
  //       {
  //         id: "3",
  //         name: "Brandon"
  //       }
  //     ]
  //   }
  // ];


  // getUser(id) {
  //   var activeItem = this.connections.flatMap(x => x.items).find(data => data.id === id);
  // }
 
  constructor(
    private router: Router,
    public common: CommonService,
    public auth: AuthService,
    private api: ApiService,
    public dialog: MatDialog,
    public pitchCommon:PitchCommonService
    )
  {
    
   

    // this.getUser("3")
    Object.assign(this, { asideBarMenu, asideBarReportmenu });
    this.common.hawkerID$.subscribe(res => {
      this.hawkerID = res;
    })

    this.common.setMobileMenu$.subscribe(res => {
      this.isMobileSubMenu = res;
    })

    common.setting$.subscribe((res)=>{
      this.openSetting = res
    })

    // router.events.pipe(
    //   filter(event => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    // });


    var menu = JSON.parse(localStorage.getItem('menu'))
    var parent_menu = localStorage.getItem('parent_menu')

    if (menu !== null || parent_menu !== null) {
      if (parent_menu == 'Reports') {
        this.reports = true;
      } else {
        this.reports = false;
      }
      var isChild = menu.filter(function (item) { return (item.ModuleGroupping == parent_menu) })[0].Keys;

      console.log(isChild)
      if (isChild != undefined) {
        this.isChild = isChild;
      } else {
        this.isChild = []
      }
    }

    common.getChild().subscribe(res => {
      if (res.ModuleGroupping == 'Reports') {
        this.reports = true;
      } else {
        this.reports = false;
      }
      console.log(res)
      var isChild = res.Keys;
      if (isChild != undefined) {
        this.isChild = isChild;
      } else {
        this.isChild = []
      }
    });

    router.events.pipe(
      filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
        if(event.url == '/dashboard'){
          this.isDashboard = true;
        } else{
          this.isDashboard = false;
        }

        if (event.url.split('/')[1] !== 'beneficiary-details' && event.url !== '' && event.url !== '/' && event.url != '/forgot' && event.url !== '/login' && event.url !== '/login?' + event.url.split('?')[1] && event.url !== '/beneficiary-login') {
          this.sessionContent = true;
        } else {
          this.sessionContent = false
        }
      });

      this.common.dashboardFullScreen$.subscribe(res=>{
        this.fullScreenDashboard = res
      })



      if(Object.keys(this.userProfileStrore).length==0){
        if(localStorage.getItem('UserProfile')){
          if(Object.keys(JSON.parse(localStorage.getItem('UserProfile'))).length>0){
            this.userProfileStrore=JSON.parse(localStorage.getItem('UserProfile'))

          }
        }
        this.common.getuserProfileDisplay$.subscribe(res1=>{
          if(Object.keys(res1).length>0){
            this.userProfileStrore=res1
          }

        })
      }
      if( localStorage.getItem('authuser')  != null || localStorage.getItem('authuser')  !=undefined){
        this.userDetails = this.auth.getUser();

      }





  }

  // logoutProfile()
  // {
  //   this.auth.logout('');

  //  }

  changeReport(event) {
    if (event.ModuleUrl.includes('reports/')) {
      this.router.navigateByUrl(this.jsDecode(event.ModuleUrl));
    } else {
      this.router.navigateByUrl(event.ModuleUrl);
    }
    this.common.ChangeReport({ reportname: event.Modulename, type: event.Module });
  }

  jsEncode(param: string) {
    return encodeURIComponent(param)
      .replace('%2F', '?').replace('%3D', '=').replace('%2C', '&').replace('%3D', '=');
  }

  jsDecode(param: string) {
    return decodeURIComponent(this.jsEncode(param));
  }

  @HostListener('window:keydown', ['$event'])


  logoutEvent(event: KeyboardEvent) {
    clearTimeout(
      this.logoutTimeout
    )
    this.logoutTimeout = setTimeout(() => {
      var userDetails = this.auth.getUser();
      var obj = {
        data: {
          spname: 'usp_unfyd_user_session',
          parameters: {
            flag: 'UPDATE_EXPIRY_TIME',
            userid: userDetails['Id']
          }
        }
      }
      this.api.post('index', obj).subscribe(res => {
        this.dialog.closeAll();
      })
      this.auth.logout('');
    }, this.thirtymin);

  }

  openProfileMenu(event){
    this.openProfileMenuDrawer.toggle()
  }
  
  closeProfileMenu(event){  
    if( this.openProfileMenuDrawer)  
     {  
      this.openProfileMenuDrawer.close()   } 
    }

  logoutProfile() {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          type: 'logoutdelete',

        },
        width: '260px',
        // height: '340px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(status => {
        if(status){
        this.auth.logout('')
        }
        else{

        }
      });


    }

    redirectToLink(){
        this.common.MobileMenu(false);
    }




    boolValue:boolean;
    arrow = false;
    turnArrow(){
      this.arrow = true;
    }
  
    openMenu(){
      this.arrow = false;
      this.boolValue = true;
    }
    
    closeMenu(){
      this.turnArrow()
      this.boolValue = false;
    }









  }









