import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/global/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  branding: any;
  authentication: any;

  constructor(
    private auth: AuthService,
  ) {
  }
  ngOnInit(): void {
    setInterval(() => {
      this.authentication = this.auth.isLoggedIn()
    }, 100);


    this.auth.setBranding()
    this.auth.getBranding$.subscribe(data => {
      if (data.code == 200) {
        this.branding = JSON.parse(data.results.data);
      }
    });
  }


}
