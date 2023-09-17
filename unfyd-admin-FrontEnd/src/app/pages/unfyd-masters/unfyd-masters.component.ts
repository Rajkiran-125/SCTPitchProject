import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/global/auth.service';
import { CommonService } from 'src/app/global/common.service';
import { Breadcrumb } from 'src/app/global/interface';
import { ApiService } from 'src/app/global/api.service';
import { DialogComponent } from 'src/app/components/dialog/dialog.component';
import { hawkerStatusSteps } from 'src/app/global/json-data';

@Component({
  selector: 'app-unfyd-masters',
  templateUrl: './unfyd-masters.component.html',
  styleUrls: ['./unfyd-masters.component.scss']
})
export class UnfydMastersComponent implements OnInit {
  userConfig: any;
  type: any = '';
  userDetails: any;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private common: CommonService) { }

  ngOnInit(): void {
    this.getSnapShot()
  }

  getSnapShot() {
    this.userDetails = this.auth.getUser();
    this.activatedRoute.url.subscribe(url => {
        this.type = this.activatedRoute.snapshot.paramMap.get('type');
        // alert(this.type)
        // this.tab = this.hawkerStatusSteps[0].tab;
        this.common.setUserConfig(this.userDetails.ProfileType,this.type);
        this.common.getUserConfig$.subscribe(data => {
            this.userConfig = data;
        });
        if (this.type == 'dispositions' || this.type == 'business-unit' || this.type == 'business-hours') {
            this.router.navigate(['unfyd-masters/' + this.type + '/list']);
        } else if (this.type == 'form'){
          this.router.navigate(['unfyd-masters/' + this.type ]);
        }
    })
  }
}
