import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from "src/app/global/common.service";

@Component({
  selector: 'app-api-performance',
  templateUrl: './api-performance.component.html',
  styleUrls: ['./api-performance.component.scss']
})
export class ApiPerformanceComponent implements OnInit {
  loader: boolean = false;
  spname = "usp_unfyd_bot_dashboard";
  innerSpName = "GET_API_PERFORMANCE";
  userDetails:any;
  selectedGrievance: any = "Day";
  endPoint = "index";
  data = [
    {
      label:'Total API Calls',
      value:'1000'
    },
    {
      label:'Total API Calls',
      value:'1000'
    },
    {
      label:'Total API Calls',
      value:'1000'
    },
    {
      label:'Failed',
      value:'1000'
    },
    {
      label:'Total API Calls',
      value:'1000'
    }
  ]
  objectOfKeys:any = []
  constructor(private api: ApiService,
              public auth: AuthService,
              public common: CommonService) { }

  ngOnInit(): void {
    this.common.hubControlEvent('Dashboard','click','pageload','pageload','','ngOnInit');

    this.userDetails = this.auth.getUser();
    this.getInformation(this.spname,this.innerSpName,this.selectedGrievance)
    this.common.hubControlEvent('Dashboard','click','pageloadend','pageloadend','','ngOnInit');

  }

  getInformation(spname,innerSpName, flag) {
    this.data = []
    this.loader = true;
    let obj = {
      data: {
        spname: spname,
        parameters: {
          flag: innerSpName,
          processid: this.userDetails.Processid,
          "DATE":"2022-08-17"
        },
      },
    };

  
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(this.endPoint),'getInformation');

    this.api
      .post(this.endPoint, obj)
      .subscribe((res) => {
        this.loader = false;
        if (res.code == 200) {
          this.data = res.results.data[0];
          this.objectOfKeys = Object.keys(this.data)
 
        }
      },
      (error)=>{

        if (error.code == 401) {
        this.common.snackbar("Token Expired Please Logout",'error');
        }else
        {
          this.common.snackbar("General Error");
        }
      }


      )
      .add(() => {
      });
  }

  keepOrder = (a) => {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(a),'keepOrder');

    return a;
  }

  numSequence(n: number): Array<number> {
    this.common.hubControlEvent('Dashboard','click','','',JSON.stringify(n),'numSequence');

    return Array(n);
  }
}
