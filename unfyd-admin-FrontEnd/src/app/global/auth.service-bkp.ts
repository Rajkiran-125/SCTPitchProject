import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ApiService } from './api.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tempUser: any;
  hawker:boolean = false;
  constructor(private router: Router, private deviceService: DeviceDetectorService, private api: ApiService, private common: CommonService) { }

  setToken(token): void {
    localStorage.setItem('authtoken', token)
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
  }
  getUser(): string | null {
    return JSON.parse(this.common.getDecrypted('123456$#@$^@1ERF', localStorage.getItem('authuser')));  
  }

  isLoggedIn() {
    return this.getToken() !== null
  }

  logout() {
    localStorage.clear();
    this.router.navigate([''])
  }

  private user = new Subject<any>()
  user$ = this.user.asObservable()

  login(obj, url) {


      this.hawker = false

    this.api.post(url, obj).subscribe(res => {
      if (res.code == 200) {
        this.getIpLocation(res.results.data[0], res.results.authtoken);
      } else if (res.code == 400) {
        this.user.next(res.message);
      } else {
        this.user.next(res.message);
      }
    }, (error) => {

      let errorMessage: any = {};
      if (error.error instanceof ErrorEvent) {
        errorMessage = { message: `${error.error.message}` };
      } else {
        errorMessage = { code: `${error.status}`, message: `${error.message}` };
      }
      this.user.next(errorMessage.message)
    })
  }

    getIpLocation(user, token) {
    this.api.getIpAddress().subscribe(publicIp => {
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(res => {
            let ipLocation = {ip: publicIp['ip'], latitude: res.coords.latitude,longitude: res.coords.longitude};
            Object.assign(user, { ...ipLocation }, {...this.deviceService.getDeviceInfo()})
            this.setUser(user);
            this.setToken(token);
            if(this.hawker){
              this.setHawker()
              this.router.navigate(['/beneficiary-home']);
            }else if(!this.hawker){
            this.router.navigate(['/dashboard']);
            }
            resolve('Success');
          },
          err => {
            reject(err);
          });

    });
  });
}


}
