import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-webchat',
  templateUrl: './iframe-webchat.component.html',
  styleUrls: ['./iframe-webchat.component.scss']
})
export class IframeWebchatComponent implements OnInit, OnChanges {
  @Input() reload 
  @ViewChild('iframeid') iframe: ElementRef
  url:any = 'https://cx2.unfyd.com/webchat/#/chat/1/Ins-Insurance'

  
  constructor(private sanitizer: DomSanitizer) { }

  iframeURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
  
  ngOnInit(): void {
  }
  // hello(){
  //   this.iframe.nativeElement.contentWindow.postMessage(JSON.stringify({name:"hello"}),'*' )

  // }
  ngOnChanges(){
    //console.log(this.reload);
    this.url = ''
    setTimeout(() => {
      this.url = 'https://cx1.unfyd.com/webchat/#/chat/1/Ins-Insurance'
      // this.url = 'http://localhost:62013/'
    }, 4000);
  }
}
