import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacebookMessengerRoutingModule } from './facebook-messenger-routing.module';
import { FacebookMessengerDetailsComponent } from './facebook-messenger-details/facebook-messenger-details.component';
import { FacebookMessengerAuthComponent } from './facebook-messenger-auth/facebook-messenger-auth.component';
import { FacebookMessengerApiComponent } from './facebook-messenger-api/facebook-messenger-api.component';
import { FacebookMessengerMediaComponent } from './facebook-messenger-media/facebook-messenger-media.component';
import { FacebookMessengerDatabaseComponent } from './facebook-messenger-database/facebook-messenger-database.component';
import { FacebookMessengerAttributeComponent } from './facebook-messenger-attribute/facebook-messenger-attribute.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatDialogRef } from '@angular/material/dialog';
import { FacebookMessengerComponent } from './facebook-messenger.component';


@NgModule({
  declarations: [
    FacebookMessengerComponent,
    FacebookMessengerDetailsComponent,
    FacebookMessengerAuthComponent,
    FacebookMessengerApiComponent,
    FacebookMessengerMediaComponent,
    FacebookMessengerDatabaseComponent,
    FacebookMessengerAttributeComponent
  ],
  imports: [
    CommonModule,
    FacebookMessengerRoutingModule,
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
    // HsmPreviewModule,
    OrderModule
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[
  FacebookMessengerComponent
  ]
})
export class FacebookMessengerModule { }
