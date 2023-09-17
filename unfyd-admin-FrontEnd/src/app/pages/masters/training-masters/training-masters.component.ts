import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/global/common.service';
import { SafeResourceUrl, DomSanitizer ,SafeHtml,SafeStyle,
  SafeScript,
  SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-training-masters',
  templateUrl: './training-masters.component.html',
  styleUrls: ['./training-masters.component.scss']
})


export class TrainingMastersComponent implements OnInit {
  safeSrc: any;  
  constructor(private common: CommonService,private sanitizer: DomSanitizer) {};
  ngOnInit(): void {
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.safeSrc = this.getSafeUrl(data.TrainingUrl);
    });
  }

  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

}