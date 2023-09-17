import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertSettingComponent } from './alert-setting/alert-setting.component';
import { BrandingComponent } from './branding.component';
import { LocalizationComponent } from './localization/localization.component';

import { SecurityComplianceComponent } from './security-compliance/security-compliance.component';

import { AddProductComponent } from './add-product/add-product.component';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { ExceldownloadComponent } from './exceldownload/exceldownload.component';
import { AddComponent } from './alert-setting/add/add.component';

const routes: Routes = [
  {
    path: "view",
    component: BrandingComponent,
  },
  {
    path: "localization",
    component: LocalizationComponent,
  },
  
  {
    path: "exceldownload",
    component: ExceldownloadComponent,
  },
  {
    path: "add-product",
    component: AddProductComponent,
  },
  
  {
    path: "app-settings",
    component: AppSettingsComponent,
    data:{title:'App Settings'},loadChildren:()=>import('./app-settings/app-settings.module').then(mod=>mod.AppSettingsModule),
  },
  
  {
    path: "theme",
    data: { title: 'Theme' }, loadChildren: () => import('./theme/theme.module').then(mod => mod.ThemeModule),
  },
  
  {
    path: "security-and-compliance",
    component: SecurityComplianceComponent,
  },
  {
    path: "alert-setting",
    component: AlertSettingComponent,
  },
  {
    path: "alert-setting/add",
    component: AddComponent,
  },
  {
    path: "alert-setting/edit",
    component: AddComponent,
  },
  
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandingRoutingModule { }
