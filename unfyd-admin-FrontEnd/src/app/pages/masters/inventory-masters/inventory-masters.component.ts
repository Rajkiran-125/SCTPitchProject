import { Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrl, DomSanitizer ,SafeHtml,SafeStyle,
  SafeScript,
  SafeUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/global/common.service';

// @Pipe({ name: 'safe' })
// export class SafePipe implements PipeTransform {

//   constructor(private sanitizer: DomSanitizer) {
//   }
//   transform(url) {
//     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }
// }
@Pipe({
  name: 'sanitizeHtml'
})
export class SanitizeHtmlPipe implements PipeTransform {

  constructor(private _sanitizer: DomSanitizer) {
  }
  public transform(
    value: any,
    type: string
  ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case "html":
        return this._sanitizer.bypassSecurityTrustHtml(value);
      case "style":
        return this._sanitizer.bypassSecurityTrustStyle(value);
      case "script":
        return this._sanitizer.bypassSecurityTrustScript(value);
      case "url":
        return this._sanitizer.bypassSecurityTrustUrl(value);
      case "resourceUrl":
        return this._sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
@Component({
  selector: 'app-inventory-masters',
  templateUrl: './inventory-masters.component.html',
  styleUrls: ['./inventory-masters.component.scss']
})
export class InventoryMastersComponent implements OnInit {
  safeSrc: any;  
  constructor(private common: CommonService, private sanitizer: DomSanitizer) {};
  ngOnInit(): void {
    this.common.setMasterConfig();
    this.common.getMasterConfig$.subscribe(data => {
      this.safeSrc = this.getSafeUrl(data.InventoryUrl);
      // this.safeSrc = this.getSafeUrl('https://nipunstaging1.unfyd.com/UNFYD-TRNG/db?Action=GetMyDashboard');
      // this.safeSrc = this.getSafeUrl('http://10.10.1.148:8080/tfs/SOA-Mumbai/_git/Ampersand_Master?path=%2Fsrc%2Fapp%2Fpages%2Fmasters%2Ftraining-masters%2Ftraining-masters.component.ts&version=GBdevelopment&_a=contents');
    });
  }

  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

}
