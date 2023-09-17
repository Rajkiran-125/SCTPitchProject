import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailCardsRoutingModule } from './email-cards-routing.module';
import { EmailCardsComponent } from './email-cards.component';


@NgModule({
  declarations: [
    EmailCardsComponent
  ],
  imports: [
    CommonModule,
    EmailCardsRoutingModule
  ],
  exports: [EmailCardsComponent],
})
export class EmailCardsModule { }
