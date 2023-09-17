import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotLicenseUsageRoutingModule } from './bot-license-usage-routing.module';
import { CommonImportsModule } from '../../common-imports.module';
import { BotLicenseUsageComponent } from './bot-license-usage.component';
import { DateFormatPipe } from 'src/app/global/date-format.pipe';


@NgModule({
  declarations: [ BotLicenseUsageComponent ],
  imports: [
    CommonModule,
    CommonImportsModule,
    BotLicenseUsageRoutingModule
  ],
  providers:[DateFormatPipe]
})
export class BotLicenseUsageModule { }
