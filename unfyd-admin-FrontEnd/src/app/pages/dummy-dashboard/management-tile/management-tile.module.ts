import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementTileRoutingModule } from './management-tile-routing.module';
import { ManagementTileComponent } from './management-tile.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonImportsModule } from '../common-imports.module';


@NgModule({
  declarations: [
    ManagementTileComponent
  ],
  imports: [
    CommonModule,
    CommonImportsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    ManagementTileRoutingModule
  ],
  exports:[ManagementTileComponent]
})
export class ManagementTileModule { }
