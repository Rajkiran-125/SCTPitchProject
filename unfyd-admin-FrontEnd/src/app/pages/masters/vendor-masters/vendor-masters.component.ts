import { Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { urls } from 'src/app/global/json-data';

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
@Component({
  selector: 'app-vendor-masters',
  templateUrl: './vendor-masters.component.html',
  styleUrls: ['./vendor-masters.component.scss']
})
export class VendorMastersComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { Object.assign(this, { urls }) };
  url: SafeResourceUrl;
  ngOnInit(): void {
    let websiteurl = urls.trainingUrl;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(websiteurl);
  }
}
