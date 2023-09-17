import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelegramRoutingModule } from './telegram-routing.module';
import { TelegramDetailsComponent } from './telegram-details/telegram-details.component';
import { TelegramAuthComponent } from './telegram-auth/telegram-auth.component';
import { TelegramApiComponent } from './telegram-api/telegram-api.component';
import { TelegramDatabaseComponent } from './telegram-database/telegram-database.component';
import { TelegramMediaComponent } from './telegram-media/telegram-media.component';
import { TelegramAttributeComponent } from './telegram-attribute/telegram-attribute.component';
import { TelegramComponent } from './telegram.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    TelegramComponent,
    TelegramDetailsComponent,
    TelegramAuthComponent,
    TelegramApiComponent,
    TelegramDatabaseComponent,
    TelegramMediaComponent,
    TelegramAttributeComponent
  ],
  imports: [
    CommonModule,
    TelegramRoutingModule,
    FormsModule,
    FilterModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    NgxSummernoteModule,
    MatInputModule,
    MatFormFieldModule,
    StepsModule,
    OrderModule
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[
  TelegramComponent
  ]
})
export class TelegramModule { }
