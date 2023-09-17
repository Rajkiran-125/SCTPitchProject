import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViberConfigurationRoutingModule } from './viber-configuration-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { OrderModule } from 'ngx-order-pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { ViberDetailsComponent } from '../viber-details/viber-details/viber-details.component';
import { ViberAuthTypeComponent } from '../viber-authType/viber-auth-type/viber-auth-type.component';
import { ViberDataManagementAPIComponent } from '../viber-DataManagementAPI/viber-data-management-api/viber-data-management-api.component';
import { ViberMediaDetailsComponent } from '../viber-mediadetails/viber-media-details/viber-media-details.component';
import { ViberDatabaseComponent } from '../viber-database/viber-database/viber-database.component';
import { ViberAttributeMappingComponent } from '../viber-attributeMapping/viber-attribute-mapping/viber-attribute-mapping.component';


@NgModule({
  declarations: [
    ViberDetailsComponent,
    ViberAuthTypeComponent,
    ViberDataManagementAPIComponent,
    ViberMediaDetailsComponent,
    ViberDatabaseComponent,
    ViberAttributeMappingComponent
  ],
  imports: [
    CommonModule,
    ViberConfigurationRoutingModule,
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
    FilterModule
  ]
})
export class ViberConfigurationModule { }
