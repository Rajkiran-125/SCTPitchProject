import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  getPrint: any = {};

  constructor(
    private common: CommonService
  ) { }

  ngOnInit(): void {
    this.common.getPrint$
      .subscribe(getPrint => this.getPrint = getPrint);
  }

}
