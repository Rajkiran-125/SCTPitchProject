import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelConfigurationRoutingModule } from './channel-configuration-routing.module';
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
import { BrandingRoutingModule } from '../branding/branding-routing.module';
import { ChannelConfigurationComponent } from './channel-configuration.component';
import { ChannelConfigurationEditComponent } from './channel-configuration-edit/channel-configuration-edit.component';
import { ConfigurationAddChannelComponent } from './configuration-add-channel/configuration-add-channel.component';
import { HsmTemplateComponent } from './hsm-template/hsm-template.component';
import { CommonImportsModule } from '../../dummy-dashboard/common-imports.module';
import { ChannelApiProviderComponent } from './channel-api-provider/channel-api-provider.component';
import { ChannelAttributeMappingComponent } from './channel-attribute-mapping/channel-attribute-mapping.component';
import { ChannelDataManagementComponent } from './channel-data-management/channel-data-management.component';
import { ChannelDatabaseComponent } from './channel-database/channel-database.component';
import { ChannelDetailsComponent } from './channel-details/channel-details.component';
import { ChannelMediaDetailsComponent } from './channel-media-details/channel-media-details.component';
import { HsmApiComponent } from './hsm-api/hsm-api.component';
import { ConfigurationWebchatModule } from './configuration-webchat/configuration-webchat.module';
import { ConfigurationWebchatComponent } from './configuration-webchat/configuration-webchat.component';
import { IframeWebchatComponent } from './iframe-webchat/iframe-webchat.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { UiSwitchModule } from 'ngx-ui-switch';

@NgModule({
  declarations: [
    ChannelConfigurationComponent,
    ChannelDatabaseComponent,
    ChannelApiProviderComponent,
    ChannelDataManagementComponent,
    ChannelMediaDetailsComponent,
    ChannelAttributeMappingComponent,
    ChannelDetailsComponent,
    HsmApiComponent,
    ChannelConfigurationEditComponent,
    HsmTemplateComponent,
    ConfigurationAddChannelComponent,
    ConfigurationWebchatComponent,
    IframeWebchatComponent
  ],
  imports: [
    ClipboardModule,
    CommonModule,
    ChannelConfigurationRoutingModule,
    // ConfigurationWebchatModule,
    CommonImportsModule,
    BrandingRoutingModule,
    FormsModule,
    FilterModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MaterialModule,
    LoaderModule,
    MatChipsModule,
    NgxSummernoteModule,
    MatInputModule,
    MatFormFieldModule,
    StepsModule,
    // HsmPreviewModule,
    OrderModule,
     UiSwitchModule
  ],schemas:[NO_ERRORS_SCHEMA]
})
export class ChannelConfigurationModule { }
