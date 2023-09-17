import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotCardsRoutingModule } from './bot-cards-routing.module';
import { BotCardsComponent } from './bot-cards.component';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    BotCardsComponent
  ],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    BotCardsRoutingModule
  ],
  schemas:[NO_ERRORS_SCHEMA],
  exports: [BotCardsComponent],
})
export class BotCardsModule { }
