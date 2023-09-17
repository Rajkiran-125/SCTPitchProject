import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TileCardRoutingModule } from './tile-card-routing.module';
import { TileCardComponent } from './tile-card.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonImportsModule } from '../common-imports.module';


@NgModule({
  declarations: [
    TileCardComponent
  ],
  imports: [
    CommonModule,
    CommonImportsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    TileCardRoutingModule
  ],
  exports:[TileCardComponent]
})
export class TileCardModule { }
