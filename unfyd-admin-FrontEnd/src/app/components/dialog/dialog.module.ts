import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterModule } from '../filter/filter.module';
import { DialogComponent } from './dialog.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/global/material.module';
import { MastersRoutingModule } from 'src/app/pages/masters/masters-routing.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QrCodeModule } from 'ng-qrcode';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WebcamModule } from 'ngx-webcam';
import { HolidaysModule } from 'src/app/pages/masters/holidays/holidays.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { DashboardCardModule } from 'src/app/pages/dummy-dashboard/dashboard-card/dashboard-card.module';
import { OrderModule } from 'ngx-order-pipe';
import { DummyDashboardModule } from 'src/app/pages/dummy-dashboard/dummy-dashboard.module';
import { TileCardModule } from 'src/app/pages/dummy-dashboard/tile-card/tile-card.module';
import { StrengthCheckerComponent } from 'src/app/components/dialog/password-strength';
import { LabelModule } from 'src/app/pages/masters/label/label.module';
import { MastersModule } from 'src/app/pages/masters/masters.module';
import { UploadLicenseComponent } from 'src/app/pages/masters/tenant/upload-license/upload-license.component';
import { UploadLicenseModule } from 'src/app/pages/masters/tenant/upload-license/upload-license.module';
import { HsmPreviewModule } from 'src/app/pages/masters/channel-configuration/hsm-template/hsm-preview/hsm-preview.module';
import { BusinessHoursModule } from 'src/app/pages/unfyd-masters/business-hours/business-hours.module';
import { UnfydMasterFormModule } from 'src/app/pages/unfyd-masters/unfyd-master-form/unfyd-master-form.module';
import { TokenExpiredDialogComponent } from './tokenExpiredDialog';
import { PostmanModule } from '../postman/postman.module';
import { ContactCenterLocationModule } from 'src/app/pages/masters/contact-center-location/contact-center-location.module';
import { SkillsModule } from 'src/app/pages/masters/skills/skills.module';
import { UserGroupModule } from 'src/app/pages/masters/user-group/user-group.module';
import { HierarchyModule } from 'src/app/pages/masters/hierarchy/hierarchy.module';
import { UsersModule } from 'src/app/pages/masters/users/users.module';
import { ProductGroupModule } from 'src/app/pages/masters/product-group/product-group.module';
import { EventModule } from 'src/app/pages/masters/event/event.module';
import { OthersModule } from 'src/app/pages/masters/users/others/others.module';
import { RolesPermissionModule } from 'src/app/pages/masters/users/roles-permission/roles-permission.module';
import { ChannelMappingModule } from 'src/app/pages/masters/users/channel-mapping/channel-mapping.module';
import { HubAdminAccessControllerModule } from 'src/app/pages/masters/hub-admin-access-controller/hub-admin-access-controller.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { FeatureControlsModule } from 'src/app/pages/masters/feature-controls/feature-controls.module';
import { ManagementTileModule } from 'src/app/pages/dummy-dashboard/management-tile/management-tile.module';
import { SecurityModulesModule } from 'src/app/pages/masters/branding/security-modules/security-modules.module';
import { WrapFormModule } from 'src/app/pages/masters/form-creation/wrap-form/wrap-form.module';
import { ApiModuleModule } from 'src/app/shared/api-module/api-module.module';
import { TaskGroupModule } from 'src/app/pages/masters/task-group/task-group.module';
import { QueryCreationBuilderModule } from '../query-creation-builder/query-creation-builder.module';
@NgModule({
  declarations: [DialogComponent,StrengthCheckerComponent,TokenExpiredDialogComponent
  ],
  imports: [
    QueryCreationBuilderModule,
    TaskGroupModule,
    ApiModuleModule,
    WrapFormModule,
    ManagementTileModule,
    PostmanModule,
    DummyDashboardModule,
    CommonModule,
    FilterModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    MastersRoutingModule,
    MaterialModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    QrCodeModule,
    WebcamModule,
    ImageCropperModule,
    NgxDocViewerModule,
    DashboardCardModule,
    TileCardModule,
    OrderModule,
    LabelModule,
    MastersModule,
    UploadLicenseModule,
    HsmPreviewModule,
    HolidaysModule,
    ContactCenterLocationModule,
    SkillsModule,
    MastersModule,
    BusinessHoursModule,
    UnfydMasterFormModule,
    UserGroupModule,
    HierarchyModule,
    UsersModule,
    OthersModule,
    RolesPermissionModule,
    ChannelMappingModule,
    ProductGroupModule,
    EventModule,
    FeatureControlsModule,
    HubAdminAccessControllerModule,
    SecurityModulesModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
})
export class DialogModule { }
