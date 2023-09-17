import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepeatRoutingModule } from './repeat-routing.module';
import { CommonImportsModule } from '../../common-imports.module';
import { RepeatComponent } from './repeat.component';


@NgModule({
  declarations: [ RepeatComponent ],
  imports: [
    CommonModule,
    CommonImportsModule,
    RepeatRoutingModule
  ]
})
export class RepeatModule { }
