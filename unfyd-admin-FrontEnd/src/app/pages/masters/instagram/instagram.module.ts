import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstagramRoutingModule } from './instagram-routing.module';
import { InstagramDetailsComponent } from './instagram-details/instagram-details.component';
import { InstagramApiComponent } from './instagram-api/instagram-api.component';
import { InstagramAuthComponent } from './instagram-auth/instagram-auth.component';
import { InstagramMediaComponent } from './instagram-media/instagram-media.component';
import { InstagramDatabaseComponent } from './instagram-database/instagram-database.component';
import { InstagramAttributeComponent } from './instagram-attribute/instagram-attribute.component';
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
import { InstagramComponent } from './instagram.component';


@NgModule({
  declarations: [
    InstagramComponent,
    InstagramDetailsComponent,
    InstagramApiComponent,
    InstagramAuthComponent,
    InstagramMediaComponent,
    InstagramDatabaseComponent,
    InstagramAttributeComponent
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
    InstagramRoutingModule
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[
  InstagramComponent
  ]
})
export class InstagramModule { }
