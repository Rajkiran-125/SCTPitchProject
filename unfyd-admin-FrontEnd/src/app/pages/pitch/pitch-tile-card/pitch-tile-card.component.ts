import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonService } from 'src/app/global/common.service';

@Component({
  selector: 'app-pitch-tile-card',
  templateUrl: './pitch-tile-card.component.html',
  styleUrls: ['./pitch-tile-card.component.scss']
})
export class PitchTileCardComponent implements OnInit,OnChanges {
 
  @Input() bgColor:any;
  @Input() tabValue=[];
  @Input() heading:any;
  @Input() tileCardLeftData:any;
  @Input() tileCardRightData:any;
  @Input() tileCardMainCount:any;


 
  constructor(public common:CommonService) { }

  ngOnChanges(){
    //console.log(this.tabValue);
  }
  ngOnInit(): void {
    
    
  }


}
