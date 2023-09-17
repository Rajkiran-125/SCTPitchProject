import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Directive({
  selector: '[appSafeHtml]'
})
export class SafeHtmlDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) {}

  @Input() set appSafeHtml(value: string) {
    const safeHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(value);
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', safeHtml.toString());
  }
}
