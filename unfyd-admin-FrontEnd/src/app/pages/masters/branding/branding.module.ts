import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandingRoutingModule } from './branding-routing.module';
import { BrandingComponent } from './branding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertSettingComponent } from './alert-setting/alert-setting.component';
import { AddComponent} from './alert-setting/add/add.component';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { LocalizationComponent } from './localization/localization.component';
import { SecurityComplianceComponent } from './security-compliance/security-compliance.component';
import { AddProductComponent } from './add-product/add-product.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { AppSettingsModule } from './app-settings/app-settings.module';
import { ThemeModule } from './theme/theme.module';
import { ExceldownloadComponent } from './exceldownload/exceldownload.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { StepsModule } from 'src/app/shared/steps/steps.module';

import { OrderModule } from 'ngx-order-pipe';
@NgModule({
  declarations: [
    BrandingComponent,
    AlertSettingComponent,
    LocalizationComponent,
    SecurityComplianceComponent,

    AddProductComponent,
    ExceldownloadComponent,
    AddComponent,
    
  ],
  imports: [
    AppSettingsModule,
    ThemeModule,
    CommonModule,
    BrandingRoutingModule,
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
  ],
})
export class BrandingModule { }
