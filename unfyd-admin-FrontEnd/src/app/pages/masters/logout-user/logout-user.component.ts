import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/global/common.service';
import { AuthService } from 'src/app/global/auth.service';

@Component({
  selector: 'app-logout-user',
  templateUrl: './logout-user.component.html',
  styleUrls: ['./logout-user.component.scss']
})
export class LogoutUserComponent implements OnInit {
  requestObj: any;
  loader:boolean=false;
  tabValue:any = [];
  tabKey:any = [];
  noData:boolean=false;
  page: number = 1;
  itemsPerPage: number = 10;
  search: any;
  userDetails:any;

  constructor(private api:ApiService,private router:Router,private common:CommonService,private auth: AuthService) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
        this.getData();
  }

  getData(){
    this.requestObj = {
      "data": {
        "spname": "usp_unfyd_user_session",
        "parameters": {
          flag: 'GET',
          processid:1,
          productid:1,
          userid:this.userDetails.Id
        }
      }
    }

    this.api.post('index', this.requestObj).subscribe((res: any) => {
      if (res.code == 200) {
        this.loader = false;
        var tempRes = res.results.data
      
        for (let data of tempRes) {
          var newObj = {
            "Actionable": data['Actionable'],
            "LoginId": data['LoginId'],
            "Username": data['Username'],
            "LoginDateTime": data['LoginDateTime'],
            "AutoExpirationTime": data['AutoExpirationDateTime'],
          }
          this.tabValue.push(newObj);
        }
        for (var key in this.tabValue[0]) {
          if (this.tabValue[0].hasOwnProperty(key)) {
            this.tabKey.push(key);
          }
        }
        if (tempRes.length == 0) {
          this.noData = true
        } else {
          this.noData = false
        }
      } else {
        this.loader = false;
      }
    },
      (error) => {
        this.loader = false;
        this.common.snackbar("Logout");
      })
  }

  forcelogout(){

  }
}
