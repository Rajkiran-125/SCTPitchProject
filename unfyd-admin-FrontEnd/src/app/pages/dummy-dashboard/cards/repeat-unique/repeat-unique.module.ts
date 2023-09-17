import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepeatUniqueRoutingModule } from './repeat-unique-routing.module';
import { RepeatUniqueComponent } from './repeat-unique.component';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [ RepeatUniqueComponent],
  imports: [
    CommonModule,
    CommonImportsModule,
    RepeatUniqueRoutingModule
  ]
})
export class RepeatUniqueModule { }
