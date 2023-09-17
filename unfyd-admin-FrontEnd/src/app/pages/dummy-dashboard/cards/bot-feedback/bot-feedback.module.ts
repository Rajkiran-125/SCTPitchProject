import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotFeedbackRoutingModule } from './bot-feedback-routing.module';
import { BotFeedbackComponent } from './bot-feedback.component';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [
    BotFeedbackComponent
  ],
  imports: [
    CommonModule,
    CommonImportsModule,
    BotFeedbackRoutingModule
  ]
})
export class BotFeedbackModule { }
