import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MastersRoutingModule } from './masters-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MastersComponent } from './masters.component';
import { AdminConfigComponent } from './admin-config/admin-config.component';
import { HierarchyModule } from './hierarchy/hierarchy.module';
import { ContactCenterLocationModule } from './contact-center-location/contact-center-location.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AccessControlsComponent } from './access-controls/access-controls.component';
import { TenantComponent } from './tenant/tenant.component';
import { TenantModule } from './tenant/tenant.module';
import { TaskGroupDetailComponent } from './task-group-detail/task-group-detail.component';
import { LabelModule } from './label/label.module';
import { LabelComponent } from './label/label.component';
import { AccountsComponent } from './accounts/accounts.component';
import { BlockContentComponent } from './block-content/block-content.component';
import { ScorecardTemplateComponent } from './SCOR/scorecard-template/scorecard-template.component';
import { VoiceConfigurationComponent } from './voice configuration/voice-configuration/voice-configuration.component';
import { ViberConfigurationComponent } from './viber-configuration/viber-configuration/viber-configuration.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ExternalAppViewComponent } from './external-app-view/external-app-view.component';
import { ExternalAppComponent } from './external-app-view/external-app/external-app.component';


@NgModule({
  declarations: [
    MastersComponent, AdminConfigComponent, AccessControlsComponent,AccountsComponent, BlockContentComponent,
    ScorecardTemplateComponent, VoiceConfigurationComponent, ViberConfigurationComponent, ExternalAppViewComponent
  ],
  imports: [
    // FeatureControlsModule,
    UiSwitchModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MastersRoutingModule,
    FilterModule,
    MaterialModule,
    LoaderModule,
    HierarchyModule,
    ContactCenterLocationModule,
    NgxSummernoteModule,
    TenantModule,

  ],
  exports:[MastersComponent]
})
export class MastersModule { }
