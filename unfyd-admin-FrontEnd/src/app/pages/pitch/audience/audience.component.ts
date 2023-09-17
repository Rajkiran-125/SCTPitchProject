import { Component, OnChanges, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {audienceTabs} from 'src/app/global/json-data';

@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss']
})
export class AudienceComponent implements OnInit, OnChanges {
  [x: string]: any;
  structureList=[];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    public common: CommonService,
    private dialog: MatDialog,
    private router : Router
  ) { 
    Object.assign(this, { audienceTabs});
  }
    
    tabValue = []
    type = 'audiencelist';
    audienceTabs : any = [];
    hasChecked: any = [];
    tab = 'List'
    ngOnChanges(){
      console.log(this.audienceTabs);
      
    }
    ngOnInit(): void {
      this.getAudienceList();
      this.getStructureList();
    }

  onTabChange(event) {
      this.tab = event;
      this.tabchange = event
  }

  getAudienceList() {
    var Obj1 = {
      data: {
        spname: "usp_unfyd_getaudiencelist",
        parameters: {
        }
      }
    }

    this.api.post('pitch/index', Obj1).subscribe(res => {
      // console.log(res);  
      //this.loader = false;
      if (res.code == 200) {
        this.tabValue = res.results.data;
        // console.log("Hello",this.tabValue);
          
      }
    })
  }

  getStructureList(){
    var Obj = {
       "data": {
           "spname": "usp_unfyd_geud_structurelist",
           "parameters": {
               "flag": "GET"
           }
       }
    }
     this.api.post('pitch/index', Obj).subscribe((res: any) => {
       if (res.code == 200) {
         this.structureList = res.results.data;
         console.log(this.structureList); 
       }
     });
   }

}
