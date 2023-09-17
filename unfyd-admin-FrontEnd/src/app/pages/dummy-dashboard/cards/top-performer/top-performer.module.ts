import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopPerformerRoutingModule } from './top-performer-routing.module';
import { TopPerformerComponent } from './top-performer.component';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [
    TopPerformerComponent
  ],
  imports: [
    CommonModule,
    CommonImportsModule,
    TopPerformerRoutingModule
  ]
})
export class TopPerformerModule { }
