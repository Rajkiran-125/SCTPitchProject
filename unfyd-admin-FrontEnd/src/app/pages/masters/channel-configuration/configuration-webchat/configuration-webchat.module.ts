import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationWebchatComponent } from './configuration-webchat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { ConfigurationWebchatRoutingModule } from './configuration-webchat-routing.module';

@NgModule({
  declarations: [
    // ConfigurationWebchatComponent
  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    OrderModule,
    ConfigurationWebchatRoutingModule
  ]
})
export class ConfigurationWebchatModule { }
