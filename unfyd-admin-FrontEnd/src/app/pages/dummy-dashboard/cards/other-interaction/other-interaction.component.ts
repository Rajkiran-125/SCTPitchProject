import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/global/api.service';
import { AuthService } from 'src/app/global/auth.service';

@Component({
  selector: 'app-other-interaction',
  templateUrl: './other-interaction.component.html',
  styleUrls: ['./other-interaction.component.scss']
})
export class OtherInteractionComponent implements OnInit {
  loader: boolean = false;
  endPoint = "dashboard/workspace";
  userDetails: any;
  data = [
    {
      icon:'icon-cam',
      label:'Video',
      value:'400'
    },
    {
      icon:'icon-call',
      label:'Voice',
      value:'400'
    },
    {
      icon:'icon-screenShare',
      label:'Screen Share',
      value:'400'
    },
    {
      icon:'icon-ticket',
      label:'Tickets',
      value:'400'
    },
    {
      icon:'icon-calender',
      label:'Appointment',
      value:'400'
    }
  ]
  constructor(private api: ApiService, public auth: AuthService) { }

  ngOnInit(): void {
    this.userDetails = this.auth.getUser();
    this.getInformation('usp_unfyd_hub_dashboard_graphs','GET_OTHER_INTERACTIONS')
  }

  getInformation(spname,flag){
    let obj = {
      data: {
        spname: spname,
        parameters: {
          flag: flag,
          processid: this.userDetails.Processid,
        },
      },
    };

    this.api.post(this.endPoint, obj).subscribe((res) => {
        this.loader = false;
        if (res.code == 200) {
          this.data = res.results.data
        }
      })
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
