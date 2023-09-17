import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
// import { io } from 'socket.io-client';
import { I } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { log } from 'console';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tempUser: any;
  hawker: boolean = false;
  firstLogin: boolean = false;
  userDetails: any;
  // socket: any = io('https://cx1.unfyd.com:3002', { transports: ['websocket', 'polling', 'flashsocket'] });
  // socket: any = io('https://localhost:3002', {path:'/adminserver/', transports: ['websocket', 'polling', 'flashsocket'] });

  //  socket: any = io('https://cx2.unfyd.com', {path:'/adminserver/', transports: ['websocket', 'polling', 'flashsocket'] });

  requestObj: any;
  maxloginatvalue: any;
  maxloginstatus: any;
  maxloginattempt: any;

  SubscriptionGetIp: Subscription[] = [];


  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService,
    private api: ApiService,
    private common: CommonService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
  )
   {
    // this.socket.on("connect_error", (err) => {
    // });
    // this.socket.on('connect', reason => {
    // });
  }




  private getBranding: Subject<any> = new Subject<any>();
  getBranding$: Observable<any> = this.getBranding.asObservable();
  setBranding() {
    var obj = {
      data: {
        flag: "get",
        filename: "branding",
        processId: 1,
        product: "HUB ADMIN"
      }
    }
    this.api.post('branding', obj).subscribe(res => {
      this.getBranding.next(res);
    })
  }


  setToken(token): void {
    localStorage.setItem('authtoken', token)
    localStorage.setItem("lang", 'en');
  }


  getToken(): string | null {
    return localStorage.getItem('authtoken')
  }

  setHawker(): void {
    localStorage.setItem('hawker', 'true')
  }

  getHawker(): string | false {
    let a = JSON.parse(localStorage.getItem('hawker'))
    return a;
  }



  setUser(user): void {
    localStorage.setItem('authuser', this.common.setEncrypted('123456$#@$^@1ERF', JSON.stringify(user)))
    this.common.getInitialData()
  }
  getUser(): string | null {
    return JSON.parse(this.common.getDecrypted('123456$#@$^@1ERF', localStorage.getItem('authuser')));
  }

  isLoggedIn() {
    return this.getToken() !== null
  }

  logout(activity) {
    this.userDetails = this.getUser();
    let a = this.getHawker()


    var obj1 = {
      data: {
        spname: "usp_unfyd_user_session",
        parameters: {
          flag: 'LOGOUT',
          userid: this.userDetails.Id,
        }
      }
    }
    this.api.post('index', obj1).subscribe(res => {
      if (res.code == 200) {

      }
    }, (error) => {
      this.common.snackbar("Logout");
    })
    var obj2 = {
      data: {
        spname: "unfyd_logout_inactive_user",
        parameters: {
          flag: 'LOGOUT',
          AGENTID: this.userDetails.Id,
        }
      }
    }
    this.api.post('index', obj2).subscribe(res => {
      if (res.code == 200) {
      }
    }, (error) => {
      this.common.snackbar("Logout");
    })




    if (activity !== '') {

      var obj = {
        data: {
          spname: "usp_unfyd_login_logout",
          parameters: {
            flag: activity == 'Day End' ? 'DAY_END_DATA' : 'LOGOUT',
            userid: this.userDetails.Id,
            logindatetime: '',
            logoutdatetime: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            daystartactivity: '',
            dayendactivity: activity,
            privateip: '',
            publicip: this.userDetails.ip,
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version
          }
        }
      }
      this.api.post('index', obj).subscribe(res => {
        if (res.code == 200) {
          const dialogRef = this.dialog.open(DialogComponent, {
            data: {
              type: 'dayEndPopup',
              data: res.results.data,
            },
            width: '300px'
          });
          dialogRef.afterClosed().subscribe(status => {
            if (status == true) {
              var obj = {
                data: {
                  spname: "usp_unfyd_login_logout",
                  parameters: {
                    flag: 'UPDATE_DAY_END_STATUS',
                    userid: this.userDetails.Id,
                    logindatetime: '',
                    logoutdatetime: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    daystartactivity: '',
                    dayendactivity: activity,
                    privateip: '',
                    publicip: this.userDetails.ip,
                    browsername: this.userDetails.browser,
                    browserversion: this.userDetails.browser_version
                  }
                }
              }
              this.api.post('index', obj).subscribe(res => {
                if (res.code == 200) {

                  localStorage.removeItem('menu');
                  localStorage.removeItem('refreshDashboard');
                  localStorage.removeItem('TenantChannel');
                  localStorage.removeItem('authtoken');
                  localStorage.removeItem('masterConfig');
                  localStorage.removeItem('userConfig');
                  localStorage.removeItem('labels');
                  localStorage.removeItem('userChannelName');
                  localStorage.removeItem('UserProfile');
                  localStorage.removeItem('userLanguageName');
                  localStorage.removeItem('parent_menu');
                  localStorage.removeItem('products');
                  localStorage.removeItem('authuser');
                  localStorage.removeItem('localizationData');
                  localStorage.removeItem('lang');
                  localStorage.removeItem('authtoken');
                  this.common.snackbar("Logout");
                  if (a) {
                    this.router.navigate(['beneficiary-login'])
                  } else {
                    this.router.navigate(['']);
                  }
                }
              }, (error) => {
                this.common.snackbar("General Error");
              })
            }
          });
        }
      }, (error) => {
        this.common.snackbar("General Error");
      })

    } else {
      localStorage.removeItem('menu');
      localStorage.removeItem('refreshDashboard');
      localStorage.removeItem('TenantChannel');
      localStorage.removeItem('authtoken');
      localStorage.removeItem('masterConfig');
      localStorage.removeItem('userConfig');
      localStorage.removeItem('labels');
      localStorage.removeItem('userChannelName');
      localStorage.removeItem('UserProfile');
      localStorage.removeItem('userLanguageName');
      localStorage.removeItem('parent_menu');
      localStorage.removeItem('products');
      localStorage.removeItem('authuser');
      localStorage.removeItem('localizationData');
      localStorage.removeItem('lang');
      localStorage.removeItem('authtoken');
      this.dialog.closeAll();
      this.common.snackbar("Logout");
      if (a) {
        this.router.navigate(['beneficiary-login'])
      } else {
        this.router.navigate(['']);
      }
    }

  }

  public user = new Subject<any>()
  user$ = this.user.asObservable()



  login(obj, url) {

    this.api.post(url, obj).subscribe(res => {



      if (res.code == 200 && res.results.data[0].result !== 'User is already loggedIn' && res.results.data[0].result == 'true') {
        if (url == 'hawkerlogin') {
          if (res.results.data[0].result == 'IncorrectDetails') {
            this.user.next(res.results.data[0].result)
            return;
          }
          this.hawker = true;
          if (res.results.data[0].Status == 'ChangePassword') {
            this.common.changePassword(obj)
            return;
          }
          this.firstLogin = true;
        } else {
          this.hawker = false
        }
        if (res.code == 200 && res.results.data[0].result2 == 'PasswordReset') {
          this.user.next('Password is Reset')
          const dialogRef = this.dialog.open(DialogComponent, {
            data: {
              type: 'ChangePassword',
              Id: res.results.data[0].Id,
              Password: res.results.data[0].Password,
              UserName: res.results.data[0].UserName,
              UserStatus: res.results.data[0].UserStatus,
              Processid: res.results.data[0].Processid,
            },
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(status => {
            if (res.code == 200) {

              if (status.event == true) {
                var obj = {
                  data: {
                    username: status.data.username,
                    password: this.common.setEncrypted('123456$#@$^@1ERF', status.data.password)

                    //workspaceserver
                    // UserName: this.form.value.username,
                    // Password: Md5.hashStr(this.form.value.password)

                  }
                }
                this.login(obj, "userlogin")
                this.user.next('PasswordResetSuccess');
                // this.common.snackbar("Login")
              }
              else {
                // this.common.snackbar('General Error','error');
                return;
              }
            }
          });
          return;
        }

        this.setToken(res.results.authtoken);
        this.setUser(res.results.data[0]);

        this.getIpLocation(res.results.data[0], res.results.authtoken);
        // this.socket.emit('create', { roomname: res.results.data[0]['Id'] + '|' + res.results.data[0]['UserName'] });
        // this.socket.on('data1',(res)=>{
        //   console.log('');
        // })

      } else if (res.code == 200 && res.results.data[0].result == 'User is already loggedIn') {
        this.user.next(res.results.data[0].result)
      } else if (res.code == 201) {

        this.maxloginattempt--;
        this.user.next(res.message);
      } else if (res.code == 500) {
        this.user.next(res.message);
      } else {
        this.user.next(res.message);

      }

    }, (error) => {

      let errorMessage: any = {};
      if (error.code == '500') {
        this.user.next('Username is not Valid');
      } else {
        this.user.next('General Error');
      }

    })

  }

  private setModuleData: Subject<any> = new Subject<any>();
  setModuleData$: Observable<any> = this.setModuleData.asObservable();

  ipLocation;


  GetIpUnsubscribe() {

    try {
      if (this.SubscriptionGetIp) {
        this.SubscriptionGetIp.forEach((e) => {
          if (e) {
            e.unsubscribe();
          }
        });
      }
    } catch (err) {
    }
  }

  GetIp2Function(user, token) {
    this.api.getIpAddress2().subscribe(publicIp => {
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(res => {
          this.ipLocation = { ip: publicIp['ip'], latitude: res.coords.latitude, longitude: res.coords.longitude };
          resolve('Success');
        },
          err => {
            this.ipLocation = { ip: publicIp['ip'], latitude: '', longitude: '' };
            resolve('Success');
          });
      })
      console.log('user', user);

      Object.assign(user, { ip: publicIp['ip'] }, { ...this.deviceService.getDeviceInfo() })
      this.setUser(user);
      // this.setToken(token);

      this.userDetails = this.getUser();
      var obj = {
        data: {
          spname: "usp_unfyd_login_logout",
          parameters: {
            flag: 'LOGIN',
            userid: this.userDetails.Id,
            logindatetime: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            logoutdatetime: '',
            daystartactivity: '',
            dayendactivity: '',
            privateip: '',
            publicip: this.userDetails.ip,
            browsername: this.userDetails.browser,
            browserversion: this.userDetails.browser_version
          }
        }
      }

      // this.api.post('index', obj).subscribe(res => {
      this.api.LoginLogout('index', obj, token).subscribe(res => {
        if (res.code == 200) {
          if (res.results.data[0].result == "LoggedIn updated successfully") {
            this.common.snackbar("Login")
            this.common.userProfileDetail(user)
            this.common.userChannel()
            // this.common.userLanguage(user)
            // console.log("login userprofiledeatil response",res.results.data[0].result)

          }

          var menuObj = {
            data: {
              spname: "usp_unfyd_module_map",

              parameters: {
                flag: 'GET_ROLE_MAPPING_USER',
                processid: this.userDetails.Processid,
                productid: this.userDetails.ProductId,
                roleid: this.userDetails.ProfileType,
                ID: this.userDetails.Id
              }
            }
          }
          this.setModuleData$.subscribe(menuData => {
            var subTemp: any = [];
            var reportMenu: any = [];
            for (let data of menuData) {
              var tempJson = data['jsondata'].replace(/\"{/g, '{').replace(/}\"/g, '}');
              var newJson = JSON.parse(JSON.parse(JSON.stringify(tempJson.replace(/\\"/g, '"'))))[0];
              if (newJson.count == 1) {
                subTemp.push({ ModuleGroupping: newJson.ModuleGroupping, Icon: newJson.Keys[0].Icon, parantModuleUrl: newJson.parantModuleUrl, Keys: [] })
              }
              else {
                subTemp.push({ ModuleGroupping: newJson?.ModuleGroupping, Icon: 'icon-' + newJson?.ModuleGroupping?.replaceAll(' ', '_').toLowerCase(), parantModuleUrl: newJson.Keys[0].ModuleUrl, Keys: newJson.Keys })
              }
            }
            localStorage.setItem('parent_menu', subTemp[0]['ModuleGroupping']);
            localStorage.setItem('menu', JSON.stringify(subTemp));
            this.common.setUserDetails()
            this.common.getLabelsFromLocalStorage()
            this.common.setChild(subTemp[0])
            this.common.alertMessageApi();

            if (this.hawker) {
              this.setHawker()
              this.router.navigate(['/beneficiary-home']);
            } else if (!this.hawker) {

              this.router.navigate(['/dashboard']);
            };
          })

          this.api.post('index', menuObj).subscribe((res): any => {
            if (res.code == 200) {
              if (res.results.data.length == 0) {
                this.getStaticMenuJson()
              }
              else {
                this.setModuleData.next(res.results.data)
              }


            }
          },
            (error) => {

              if (error.code == 401) {
                this.common.snackbar("Token Expired Please Logout", 'error');
              }
            }


          )
          this.setProducts()
          this.setTenantChannel()
        }
      },
        (error) => {
          this.common.snackbar("General Error");
        })


    })
  }

  getIpLocation(user, token) {
    this.ipLocation = undefined;
    let ipVal: boolean = false;
    setTimeout(() => {
      if (this.ipLocation == null || this.ipLocation == undefined) {
        ipVal = true;
        try {
          this.GetIpUnsubscribe()
          this.GetIp2Function(user, token)
        } catch (err) {
        }
      }
    }, 1500);

    this.SubscriptionGetIp.push(
      this.api.getIpAddress().subscribe(publicIp => {

        if (this.ipLocation == null || this.ipLocation == undefined) {

          new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(res => {
              this.ipLocation = { ip: publicIp['ip'], latitude: res.coords.latitude, longitude: res.coords.longitude };
              resolve('Success');
            },
              err => {
                this.ipLocation = { ip: publicIp['ip'], latitude: '', longitude: '' };
                resolve('Success');
              });
          })
          Object.assign(user, { ip: publicIp['ip'] }, { ...this.deviceService.getDeviceInfo() })
          this.setUser(user);
          // this.setToken(token);

          this.userDetails = this.getUser();
          var obj = {
            data: {
              spname: "usp_unfyd_login_logout",
              parameters: {
                flag: 'LOGIN',
                userid: this.userDetails.Id,
                logindatetime: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                logoutdatetime: '',
                daystartactivity: '',
                dayendactivity: '',
                privateip: '',
                publicip: this.userDetails.ip,
                browsername: this.userDetails.browser,
                browserversion: this.userDetails.browser_version
              }
            }
          }

          // this.api.post('index', obj).subscribe(res => {
          this.api.LoginLogout('index', obj, token).subscribe(res => {
            if (res.code == 200) {
              if (res.results.data[0].result == "LoggedIn updated successfully") {
                this.common.snackbar("Login")
                this.common.userProfileDetail(user)
                this.common.userChannel()
                // this.common.userLanguage(user)
                // console.log("login userprofiledeatil response",res.results.data[0].result)

              }

              var menuObj = {
                data: {
                  spname: "usp_unfyd_module_map",

                  parameters: {
                    flag: 'GET_ROLE_MAPPING_USER',
                    processid: this.userDetails.Processid,
                    productid: this.userDetails.ProductId,
                    roleid: this.userDetails.ProfileType,
                    ID: this.userDetails.Id
                  }
                }
              }
              this.setModuleData$.subscribe(menuData => {
                var subTemp: any = [];
                var reportMenu: any = [];
                for (let data of menuData) {
                  var tempJson = data['jsondata'].replace(/\"{/g, '{').replace(/}\"/g, '}');
                  var newJson = JSON.parse(JSON.parse(JSON.stringify(tempJson.replace(/\\"/g, '"'))))[0];
                  if (newJson.count == 1) {
                    subTemp.push({ ModuleGroupping: newJson.ModuleGroupping, Icon: newJson.Keys[0].Icon, parantModuleUrl: newJson.parantModuleUrl, Keys: [] })
                  }
                  else {
                    subTemp.push({ ModuleGroupping: newJson?.ModuleGroupping, Icon: 'icon-' + newJson?.ModuleGroupping?.replaceAll(' ', '_').toLowerCase(), parantModuleUrl: newJson.Keys[0].ModuleUrl, Keys: newJson.Keys })
                  }
                }
                localStorage.setItem('parent_menu', subTemp[0]['ModuleGroupping']);
                localStorage.setItem('menu', JSON.stringify(subTemp));
                this.common.setUserDetails()
                this.common.getLabelsFromLocalStorage()
                this.common.setChild(subTemp[0])
                this.common.alertMessageApi();

                if (this.hawker) {
                  this.setHawker()
                  this.router.navigate(['/beneficiary-home']);
                } else if (!this.hawker) {

                  this.router.navigate(['/dashboard']);
                };
              })

              this.api.post('index', menuObj).subscribe((res): any => {
                if (res.code == 200) {
                  if (res.results.data.length == 0) {
                    this.getStaticMenuJson()
                  }
                  else {
                    this.setModuleData.next(res.results.data)
                  }


                }
              },
                (error) => {

                  if (error.code == 401) {
                    this.common.snackbar("Token Expired Please Logout", 'error');
                  }
                }


              )
              this.setProducts()
              this.setTenantChannel()
            }
          },
            (error) => {
              this.common.snackbar("General Error");
            })



        }

      })
    )




    /////original Method
    //     this.api.getIpAddress().subscribe(publicIp => {
    //       new Promise((resolve, reject) => {
    //         navigator.geolocation.getCurrentPosition(res => {
    //           this.ipLocation = { ip: publicIp['ip'], latitude: res.coords.latitude, longitude: res.coords.longitude };
    //           resolve('Success');
    //         },
    //           err => {
    //             this.ipLocation = { ip: publicIp['ip'], latitude: '', longitude: '' };
    //             resolve('Success');
    //           });
    //       })
    //       Object.assign(user, { ip: publicIp['ip'] }, { ...this.deviceService.getDeviceInfo() })
    //       // this.setUser(user);
    //       // this.setToken(token);

    //       this.userDetails = this.getUser();
    //       var obj = {
    //         data: {
    //           spname: "usp_unfyd_login_logout",
    //           parameters: {
    //             flag: 'LOGIN',
    //             userid: this.userDetails.Id,
    //             logindatetime: this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    //             logoutdatetime: '',
    //             daystartactivity: '',
    //             dayendactivity: '',
    //             privateip: '',
    //             publicip: this.userDetails.ip,
    //             browsername: this.userDetails.browser,
    //             browserversion: this.userDetails.browser_version
    //           }
    //         }
    //       }

    //       // this.api.post('index', obj).subscribe(res => {
    //         this.api.LoginLogout('index', obj,token).subscribe(res => {
    //         if (res.code == 200) {
    //           if(res.results.data[0].result == "LoggedIn updated successfully"){
    //             this.common.snackbar("Login")
    //             this.common.userProfileDetail(user)
    //             this.common.userChannel()
    //             // this.common.userLanguage(user)
    //             // console.log("login userprofiledeatil response",res.results.data[0].result)

    //           }

    // var menuObj = {
    //   data: {
    //     spname: "usp_unfyd_module_map",

    //     parameters: {
    //       flag: 'GET_ROLE_MAPPING_USER',
    //       processid: this.userDetails.Processid,
    //       productid: this.userDetails.ProductId,
    //       roleid: this.userDetails.ProfileType,
    //       ID: this.userDetails.Id
    //     }
    //   }
    // }
    // this.setModuleData$.subscribe(menuData =>{
    //   var subTemp: any = [];
    //   var reportMenu: any = [];
    //   for (let data of menuData) {
    //     var tempJson = data['jsondata'].replace(/\"{/g, '{').replace(/}\"/g, '}');
    //     var newJson = JSON.parse(JSON.parse(JSON.stringify(tempJson.replace(/\\"/g, '"'))))[0];
    //     if (newJson.count == 1) {
    //       subTemp.push({ ModuleGroupping: newJson.ModuleGroupping, Icon: newJson.Keys[0].Icon, parantModuleUrl: newJson.parantModuleUrl, Keys: [] })
    //     }
    //     else {
    //       subTemp.push({ ModuleGroupping: newJson?.ModuleGroupping, Icon: 'icon-' + newJson?.ModuleGroupping?.replaceAll(' ', '_').toLowerCase(), parantModuleUrl: newJson.Keys[0].ModuleUrl, Keys: newJson.Keys })
    //     }
    //   }
    //   localStorage.setItem('parent_menu', subTemp[0]['ModuleGroupping']);
    //   localStorage.setItem('menu', JSON.stringify(subTemp));
    //   this.common.setUserDetails()
    //   this.common.getLabelsFromLocalStorage()
    //   this.common.setChild(subTemp[0])
    //   this.common.alertMessageApi();

    //   if (this.hawker) {
    //     this.setHawker()
    //     this.router.navigate(['/beneficiary-home']);
    //   } else if (!this.hawker) {

    //     this.router.navigate(['/dashboard']);
    //   };
    // })

    // this.api.post('index', menuObj).subscribe( (res):any => {
    //   if (res.code == 200) {
    //     if (res.results.data.length == 0) {
    //       this.getStaticMenuJson()
    //     }
    //     else {
    //       this.setModuleData.next(res.results.data)
    //     }


    //   }
    // },
    //   (error) => {

    //     if (error.code == 401) {
    //       this.common.snackbar("Token Expired Please Logout", 'error');
    //     }
    //   }


    // )
    //           this.setProducts()
    //           this.setTenantChannel()
    //         }
    //       },
    //         (error) => {
    //           this.common.snackbar("General Error");
    //         })


    //     });

  }

  setProducts() {
    var requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "USER_MAPPED_PRODUCTS",
          processid: this.userDetails.Processid,
          userid: this.userDetails.Id,
          roletypeid: this.userDetails.ProfileType,
        }
      }
    }

    this.api.post('index', requestObj).subscribe((res: any) => {
      localStorage.setItem('products', JSON.stringify(res.results['data']))

    })
  }

  setTenantChannel() {
    this.requestObj = {
      data: {
        spname: "usp_unfyd_getdropdowndetails",
        parameters: {
          flag: "CHANNEL",
          processid: this.userDetails.Processid
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      localStorage.setItem('TenantChannel', JSON.stringify(res.results['data']))
    })
  }

  getStaticMenuJson() {
    var Obj = {
      data: {
        flag: "get",
        filename: "MenuJson",
        processId: 1,
        product: "HubAdmin"

      }
    }
    this.api.post('branding', Obj).subscribe((res: any) => {
      if (res.code == 200) {
        this.setModuleData.next(JSON.parse(res.results.data))
      }
    })
  }

  forcelogout(res) {
    // this.socket.emit('forcelogout', { roomname: res.results.data[0]['Id'] + '|' + res.results.data[0]['UserName'] });
  }
}
