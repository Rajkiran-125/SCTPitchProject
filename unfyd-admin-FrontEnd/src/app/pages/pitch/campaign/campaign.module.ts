import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignComponent } from './campaign.component';
import { AddCampaignComponent } from './add-campaign/add-campaign.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { PitchTableModule } from '../pitch-table/pitch-table.module';
import { CampaignViewComponent } from './campaign-view/campaign-view.component';
import { PitchTileCardModule } from '../pitch-tile-card/pitch-tile-card.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { PitchDialogModule } from '../pitch-dialog/pitch-dialog.module';
import { PitchCalendarModule } from '../pitch-calendar/pitch-calendar.module';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { CampaignViewExcelAddComponent } from './campaign-view-excel-add/campaign-view-excel-add.component';




@NgModule({
  declarations: [
    CampaignComponent,
    AddCampaignComponent,
    CampaignViewComponent,
    CampaignDetailsComponent,
    CampaignViewExcelAddComponent,
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    FilterModule,
    MaterialModule,
    LoaderModule,
    NgxSummernoteModule,
    PitchTableModule,
    PitchTileCardModule,
    PitchDialogModule,
    PitchCalendarModule,
    NgxMatDatetimePickerModule,

    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
  ]
})
export class CampaignModule { }
