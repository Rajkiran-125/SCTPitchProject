import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TwitterConfigurationRoutingModule } from './twitter-configuration-routing.module';
import { TwitterDetailsComponent } from './twitter-details/twitter-details.component';
import { TwitterAuthComponent } from './twitter-auth/twitter-auth.component';
import { TwitterApiComponent } from './twitter-api/twitter-api.component';
import { TwitterMediaComponent } from './twitter-media/twitter-media.component';
import { TwitterDatabaseComponent } from './twitter-database/twitter-database.component';
import { TwitterAttributeComponent } from './twitter-attribute/twitter-attribute.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { TwitterConfigurationComponent } from './twitter-configuration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TwitterConfigurationComponent,
    TwitterDetailsComponent,
    TwitterAuthComponent,
    TwitterApiComponent,
    TwitterMediaComponent,
    TwitterDatabaseComponent,
    TwitterAttributeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TwitterConfigurationRoutingModule,
    MaterialModule,
    LoaderModule,
    StepsModule,
    OrderModule,
    MatDialogModule,
    NgxSummernoteModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FilterModule
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[
  TwitterConfigurationComponent
  ]
})
export class TwitterConfigurationModule { }
