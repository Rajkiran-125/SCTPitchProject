import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacebookConfigurationRoutingModule } from './facebook-configuration-routing.module';
import { FacebookDetailsComponent } from './facebook-details/facebook-details.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacebookAuthComponent } from './facebook-auth/facebook-auth.component';
import { FacebookConfigurationComponent } from './facebook-configuration.component';
import { FacebookApiComponent } from './facebook-api/facebook-api.component';
import { FacebookMediaComponent } from './facebook-media/facebook-media.component';
import { FacebookDatabaseComponent } from './facebook-database/facebook-database.component';
import { FacebookAttributeComponent } from './facebook-attribute/facebook-attribute.component';


@NgModule({
  declarations: [
    FacebookConfigurationComponent,
    FacebookDetailsComponent,
    FacebookAuthComponent,
    FacebookApiComponent,
    FacebookMediaComponent,
    FacebookDatabaseComponent,
    FacebookAttributeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FacebookConfigurationRoutingModule,
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
  FacebookConfigurationComponent
  ]
})
export class FacebookConfigurationModule { }
