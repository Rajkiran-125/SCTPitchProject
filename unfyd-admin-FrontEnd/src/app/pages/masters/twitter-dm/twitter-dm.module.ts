import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TwitterDmRoutingModule } from './twitter-dm-routing.module';
import { TwitterDmDetailsComponent } from './twitter-dm-details/twitter-dm-details.component';
import { TwitterDmAuthComponent } from './twitter-dm-auth/twitter-dm-auth.component';
import { TwitterDmApiComponent } from './twitter-dm-api/twitter-dm-api.component';
import { TwitterDmMediaComponent } from './twitter-dm-media/twitter-dm-media.component';
import { TwitterDmDatabaseComponent } from './twitter-dm-database/twitter-dm-database.component';
import { TwitterDmAttributeComponent } from './twitter-dm-attribute/twitter-dm-attribute.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { TwitterDmComponent } from './twitter-dm.component';


@NgModule({
  declarations: [
    TwitterDmComponent,
    TwitterDmDetailsComponent,
    TwitterDmAuthComponent,
    TwitterDmApiComponent,
    TwitterDmMediaComponent,
    TwitterDmDatabaseComponent,
    TwitterDmAttributeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TwitterDmRoutingModule,
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
  TwitterDmComponent
  ]
})
export class TwitterDmModule { }
