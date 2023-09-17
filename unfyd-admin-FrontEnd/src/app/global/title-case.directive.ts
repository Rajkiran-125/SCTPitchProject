import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTitleCase]'
})
export class TitleCaseDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('blur') onBlur() {
    if (this.el.nativeElement.value) {
      const arr: string[] = this.el.nativeElement.value.split('');

    

      arr[0] = arr[0].toUpperCase();
      arr[1] = arr.slice(1).join('');
      this.el.nativeElement.value = arr[0]+arr[1].toLowerCase();

     

    }
  }
}
