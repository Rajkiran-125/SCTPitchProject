import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { HubAdminAccessControllerComponent } from './hub-admin-access-controller.component';
import {HubAdminAccessControllerRoutingModule} from './hub-admin-access-controller-routing.module';
import { HubSummaryComponent } from './hub-summary/hub-summary.component';
import { CopyHubAdminComponent } from './copy-hub-admin/copy-hub-admin.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@NgModule({
  declarations: [
    HubAdminAccessControllerComponent,
    HubSummaryComponent,
    CopyHubAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HubAdminAccessControllerRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FilterModule,
    MatDialogModule,
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[HubAdminAccessControllerComponent]
})
export class HubAdminAccessControllerModule { }
