import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherInteractionRoutingModule } from './other-interaction-routing.module';
import { OtherInteractionComponent } from './other-interaction.component';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [
    OtherInteractionComponent
  ],
  imports: [
    CommonModule,
    CommonImportsModule,
    OtherInteractionRoutingModule
  ]
})
export class OtherInteractionModule { }
