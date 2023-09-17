import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessOrchestrationRoutingModule } from './business-orchestration-routing.module';
import { BusinessOrchestrationComponent } from './business-orchestration.component';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { ApiModuleModule } from './api-module/api-module.module';
import { ConditionModule } from './condition/condition.module';
import { ActionModule } from './action/action.module';
import { FlushingComponent } from './flushing/flushing.component';

@NgModule({
  declarations: [
    BusinessOrchestrationComponent,
    FlushingComponent
  ],
  imports: [
    CommonModule,
    BusinessOrchestrationRoutingModule,
    MaterialModule,
    LoaderModule,
    FormsModule,
    ReactiveFormsModule,
    OrderModule,
    ApiModuleModule,
    ConditionModule,
    ActionModule,
  ]
})
export class BusinessOrchestrationModule { }