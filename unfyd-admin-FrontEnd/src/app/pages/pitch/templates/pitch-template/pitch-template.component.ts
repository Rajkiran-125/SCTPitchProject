import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';

@Component({
  selector: 'app-pitch-template',
  templateUrl: './pitch-template.component.html',
  styleUrls: ['./pitch-template.component.scss']
})
export class PitchTemplateComponent implements OnInit {
  type = 'addtemplates';
  tabValue = [];
 constructor( private api: ApiService) { }

 ngOnInit(): void {

  this.getPitchTemplates();

}




getPitchTemplates() {
 // this.loader = true;
  let obj = {
    "data": {
      "spname": "usp_unfyd_hsm_template",
      "parameters": {
        "FLAG": "GET",
        "PROCESSID": 1
      }
    }
  }

  this.api.post('index', obj).subscribe((res) => {
    if (res.code == 200) {
     console.log("responsettt",  res);
      //this.loader = false;
      this.tabValue = res.results.data;
    }
  });
}

}
