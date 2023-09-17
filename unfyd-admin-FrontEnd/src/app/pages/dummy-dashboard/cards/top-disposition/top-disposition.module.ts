import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopDispositionRoutingModule } from './top-disposition-routing.module';
import { TopDispositionComponent } from './top-disposition.component';
import { CommonImportsModule } from '../../common-imports.module';


@NgModule({
  declarations: [
    TopDispositionComponent
  ],
  imports: [
    CommonModule,
    CommonImportsModule,
    TopDispositionRoutingModule
  ]
})
export class TopDispositionModule { }
