import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PitchTileCardRoutingModule } from './pitch-tile-card-routing.module';
import { PitchTileCardComponent } from './pitch-tile-card.component';
import { NgxEchartsModule } from 'ngx-echarts';



@NgModule({
  declarations: [
    PitchTileCardComponent
  ],
  imports: [
    CommonModule,
   
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    PitchTileCardRoutingModule
  ],
  exports: [PitchTileCardComponent]
})
export class PitchTileCardModule { }
