import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScorecardTemplateRoutingModule } from './scorecard-template-routing.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ScorecardTemplateRoutingModule,
    LoaderModule
  ]
})
export class ScorecardTemplateModule { }
