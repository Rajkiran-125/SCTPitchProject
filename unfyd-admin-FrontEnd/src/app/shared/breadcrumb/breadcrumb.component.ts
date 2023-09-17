
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';

export interface Breadcrumb{
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  userDetails: any;
  selectedTime:any = 'Select Reload Time';
  @Input() quaarterMinute= false
  @Input() halfMinute= false
  @Input() minute= false
  public breadcrumbs: Breadcrumb[];
  configMenu = []
  parentMenu = ''
  parentUrl = ''
  childMenu = ''
  childUrl = ''
  constructor(public router: Router, private route: ActivatedRoute, public auth: AuthService, public common: CommonService) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.configMenu = JSON.parse(localStorage.getItem('menu'));
    let reloadTime = JSON.parse(localStorage.getItem('reload'));
    if(reloadTime == null || reloadTime == undefined){
      reloadTime = 15
    }

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event1:any) => {
      this.setBreadCrumValues(event1)
      this.breadcrumbs = this.getBreadcrumbs(this.route.root);
    });
    this.setBreadCrumValues(this.router)
      this.breadcrumbs = this.getBreadcrumbs(this.route.root);
      // this.common.selectedParentMenuOption$.subscribe(res=>{
      //   this.parentMenu = res
      // })
      // this.common.selectedChildMenuOption$.subscribe(res=>{
      //   this.childMenu = res
      // })
  }

  setBreadCrumValues(event1){
    this.parentMenu = '';
    this.childMenu = '';
    this.configMenu.forEach(element => {
      if(element.hasOwnProperty('Keys')){
        if(element.Keys.length > 0){
          element.Keys.forEach(element1 => {
            if(event1.url.toLowerCase().includes(element1.ModuleUrl.toLowerCase())){
              this.parentMenu = element.ModuleGroupping
              this.childMenu = element1.DisplayName
              this.parentUrl = element1.ModuleUrl
              this.childUrl = element1.ModuleUrl
            }
          })
        } 
        else if(event1.url.toLowerCase().includes(element.parantModuleUrl.toLowerCase())){
          this.parentMenu = element.ModuleGroupping
          this.parentUrl = element.parantModuleUrl
          this.childMenu = ''
        }
      } else if(event1.url.toLowerCase().includes(element.parantModuleUrl.toLowerCase())){
        this.parentMenu = element.ModuleGroupping
        this.parentUrl = element.parantModuleUrl
        this.childMenu = ''
      }
    });
  }
  setTimeForReload(val:any){
    if(val == 15){
      if(this.quaarterMinute){
        this.quaarterMinute = false
      } else{
        this.quaarterMinute = true
      }
      this.halfMinute = false;
      this.minute = false;
    }else if(val == 30){
      this.quaarterMinute = false;
      if(this.halfMinute){
        this.halfMinute = false
      }else{
        this.halfMinute = true
      }
      this.minute = false;
    } else if(val == 60){
      this.quaarterMinute = false;
      this.halfMinute = false;
      if(this.minute){
        this.minute = false
      } else{
        this.minute = true
      }
    }
    let t = 0
    if(this.quaarterMinute){
      t= 15
      this.selectedTime = 'Reload Time: 15 sec'
    } else if(this.halfMinute){
      t= 30
      this.selectedTime = 'Reload Time: 30 sec'
    } else if(this.minute){
      t= 60
      this.selectedTime = 'Reload Time: 60 sec'
    } else{
      t= 0
      this.selectedTime = 'Select Reload Time'
    }
    localStorage.setItem('reload',JSON.stringify(t))
    this.common.reloadTimeMethod(t)

  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = "", breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'title';
    //get the child routes
    let children: ActivatedRoute[] = route.children;

    //return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    //iterate over each children
    for (let child of children) {
      //verify primary route
      if (child.outlet !== PRIMARY_OUTLET || child.snapshot.url.length==0) {
        continue;
      }

      //verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      //get the route's URL segment
      let routeURL: string = child.snapshot.url.map(segment => segment.path).join("/");

      //append route URL to URL
      url += `/${routeURL}`;

      //add breadcrumb
      let breadcrumb: Breadcrumb = {
        label: routeURL,
        url: url
      };
      breadcrumbs.push(breadcrumb);

      //recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }

}

