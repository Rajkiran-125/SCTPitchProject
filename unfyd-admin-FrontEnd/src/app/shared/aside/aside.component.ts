import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { ApiService } from 'src/app/global/api.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit {
  asideBarMenu: any;
  userDetails: any;
  requestObj: any;
  configMenu: any = [];
  selectedMenuOption:any;
  routeTo:any;
  isMobileSubMenu : boolean =false;
  checkAsideMenu: boolean;

  constructor(private router: Router, public auth: AuthService, public common: CommonService, private api : ApiService) {
  }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    // this.getModuleMenuReports();
    this.configMenu = JSON.parse(localStorage.getItem('menu'));

    // if(this.configMenu.length > 0){
    //   this.selectedMenuOption = this.configMenu[0]['ModuleGroupping']
    //   this.common.selectedParentMenuOption.next(this.selectedMenuOption)
    // }
    this.setBreadCrumValues(this.router)
   }

   setBreadCrumValues(event1){
    this.selectedMenuOption = '';
    this.configMenu.forEach(element => {
      if(element.hasOwnProperty('Keys')){
        if(element.Keys.length > 0){
          element.Keys.forEach(element1 => {
            if(event1.url.toLowerCase().includes(element1.ModuleUrl.toLowerCase())){
              this.selectedMenuOption = element.ModuleGroupping
            }
          })
        } else if(event1.url.toLowerCase().includes(element.parantModuleUrl.toLowerCase())){
          this.selectedMenuOption = element.ModuleGroupping
        }
      } else if(event1.url.toLowerCase().includes(element.parantModuleUrl.toLowerCase())){
        this.selectedMenuOption = element.ModuleGroupping
      }
    });
  }

  

  goTo(data){
    this.selectedMenuOption = data.ModuleGroupping;
    this.common.MobileMenu((this.selectedMenuOption === 'Dashboard' || this.selectedMenuOption === 'Feature Controls') ? false : true);

    if (!(this.selectedMenuOption==='Dashboard' || this.selectedMenuOption === 'Feature Controls')){
      this.checkAsideMenu = true;
    }
    else{
      this.checkAsideMenu =false;
    }
    // this.isMobileSubMenu= true;

    // if(this.selectedMenuOption == 'Dashboard'){
    //   alert('dashboard')
    //   // this.isMobileSubMenu= false;
    //   this.common.MobileMenu(false);
    // }
    // else{
    //   alert('other')
      
    //   // this.isMobileSubMenu= true;
    //   this.common.MobileMenu(true);
    // }


//  if(this.selectedMenuOption == ModuleGroupping){
  
//   console.log('inside');
  
//   this.common.MobileMenu(false);

//   console.log('datacheck', ModuleGroupping);
//  }

    // this.routeTo = data.parantModuleUrl
    // this.common.selectedParentMenuOption.next(this.selectedMenuOption)
    // this.configMenu.forEach(element => {
    //   if(element.ModuleGroupping == this.selectedMenuOption){
    //     if(element.hasOwnProperty('Keys')){
    //       if(element.Keys.length > 0){
    //         element.Keys.forEach(element1 => {
    //           if(element1.ModuleUrl == this.routeTo){
    //             this.common.selectedChildMenuOption.next(element1.DisplayName)
    //           } else{
    //             this.common.selectedChildMenuOption.next('')
    //           }
    //         });
    //       } else{
    //         this.common.selectedChildMenuOption.next('')
    //       }
    //     } else{
    //       this.common.selectedChildMenuOption.next('')
    //     }
    //   }
    // });

    this.common.setChild(data);
    if (data.ModuleGroupping == 'Reports') {
      if (data.Keys[0].ModuleUrl.includes('reports/')) {
        this.router.navigateByUrl(this.jsDecode(data.Keys[0].ModuleUrl));
      } else {
        this.router.navigateByUrl(data.Keys[0].ModuleUrl);
      }
    } else {
      this.router.navigate([data.parantModuleUrl]);
    }
  }

  jsEncode(param: string) {
    return encodeURIComponent(param)
      .replace('%2F', '?').replace('%3D', '=').replace('%2C', '&').replace('%3D', '=');
  }

  jsDecode(param: string) {
    return decodeURIComponent(this.jsEncode(param));
  }


  logout(activity) : void {
    this.auth.logout(activity);
    this.common.snackbar("Logout");
  }

}
