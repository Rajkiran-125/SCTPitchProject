import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-audience-details',
  templateUrl: './audience-details.component.html',
  styleUrls: ['./audience-details.component.scss']
})
export class AudienceDetailsComponent implements OnInit {

  tabValue = [];
  type = 'audiencelist'
  data:any;

  constructor(
    private api: ApiService,
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // this.data = data
    this.getAudienceList()
    this.activatedRoute.params.subscribe(params => {
      // console.log(params);
       this.data = params;
       console.log(params);
       console.log(this.data);
     });
  }


  getAudienceList() {
    var Obj = {
      data: {
        spname: "usp_unfyd_getaudiencelist",
        parameters: {
        }
      }
    }

    this.api.post('pitch/index', Obj).subscribe(res => {
      console.log("res",res);  
      //this.loader = false;
      if (res.code == 200) {
        this.tabValue = res.results.data;
        console.log("Hello",this.tabValue);
          
      }
    })
  }

}
