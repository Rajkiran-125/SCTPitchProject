import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HsnModule } from '../../hsn/hsn.module';
import { HsmTemplateModule } from '../hsm-template/hsm-template.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HsnModule,
    HsmTemplateModule
  ]
})
export class ChannelConfigurationEditModule { }

