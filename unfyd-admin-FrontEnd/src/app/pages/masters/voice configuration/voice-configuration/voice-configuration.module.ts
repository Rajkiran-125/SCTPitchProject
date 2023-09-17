import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { TelepathyActionComponent } from '../telepathy-action/telepathy-action/telepathy-action.component';
import { VoiceServiceComponent } from '../voice-service/voice-service/voice-service.component';
import { VoiceDetailComponent } from '../voice-detail/voice-detail/voice-detail.component';
import { VoiceConfigurationRoutingModule } from './voice-configuration-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';



@NgModule({
  declarations: [
    TelepathyActionComponent,
    VoiceServiceComponent,
    VoiceDetailComponent
  ],
  imports: [    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VoiceConfigurationRoutingModule,
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
export class VoiceConfigurationModule { }
