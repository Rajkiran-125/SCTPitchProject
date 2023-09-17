import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstagramMessengerRoutingModule } from './instagram-messenger-routing.module';
import { InstagramMessengerDetailsComponent } from './instagram-messenger-details/instagram-messenger-details.component';
import { InstagramMessengerAuthComponent } from './instagram-messenger-auth/instagram-messenger-auth.component';
import { InstagramMessengerApiComponent } from './instagram-messenger-api/instagram-messenger-api.component';
import { InstagramMessengerMediaComponent } from './instagram-messenger-media/instagram-messenger-media.component';
import { InstagramMessengerDatabaseComponent } from './instagram-messenger-database/instagram-messenger-database.component';
import { InstagramMessengerAttributeComponent } from './instagram-messenger-attribute/instagram-messenger-attribute.component';
import { InstagramMessengerComponent } from './instagram-messenger.component';
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


@NgModule({
  declarations: [
    InstagramMessengerComponent,
    InstagramMessengerDetailsComponent,
    InstagramMessengerAuthComponent,
    InstagramMessengerApiComponent,
    InstagramMessengerMediaComponent,
    InstagramMessengerDatabaseComponent,
    InstagramMessengerAttributeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    StepsModule,
    OrderModule,
    MatDialogModule,
    NgxSummernoteModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FilterModule,
    InstagramMessengerRoutingModule
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[
  InstagramMessengerComponent
  ]
})
export class InstagramMessengerModule { }
