import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [ FeedbackComponent ],
  imports: [
    CommonModule,
    CommonImportsModule,
    FeedbackRoutingModule
  ]
})
export class FeedbackModule { }
