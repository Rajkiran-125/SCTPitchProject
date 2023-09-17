import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnfydMastersRoutingModule } from './unfyd-masters-routing.module';
// import { BusinessUnitComponent } from './business-unit/business-unit.component';
import { CannedResponsesComponent } from './canned-responses/canned-responses.component';
// import { NgxTreeDndModule } from 'ngx-tree-dnd';
import { MaterialModule } from 'src/app/global/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterModule } from 'src/app/components/filter/filter.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { UnfydMasterFormComponent } from './unfyd-master-form/unfyd-master-form.component';
import { UnfydMastersComponent } from './unfyd-masters.component';
import { DispositionModule } from './disposition/disposition.module';
import { BusinessHoursComponent } from './business-hours/business-hours.component';
//import { DeleteNodeComponent } from './theme/delete-node/delete-node.component';
//import { AddNodeComponent, NewNodeDialog } from './theme/add-node/add-node.component';
//import { EditNodeComponent, EditNodeDialog } from './theme/edit-node/edit-node.component';
import { UnfydMasterFormModule } from './unfyd-master-form/unfyd-master-form.module';
import { BusinessHoursModule } from './business-hours/business-hours.module';
import { BusinessUnitModule } from './business-unit/business-unit.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AddNodeComponent, NewNodeDialog } from 'src/app/shared/treeControl/theme/add-node/add-node.component';
// import { EditNodeComponent, EditNodeDialog } from 'src/app/shared/treeControl/theme/edit-node/edit-node.component';
// import { DeleteNodeComponent } from 'src/app/shared/treeControl/theme/delete-node/delete-node.component';
// import { MaterialModule } from 'src/app/global/treeService/material-module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  // entryComponents: [
  //   NewNodeDialog,
  //   EditNodeDialog
  // ],
  declarations: [
    // CannedResponsesComponent,
    // AddNodeComponent,
    // NewNodeDialog,
    // EditNodeComponent,
    // EditNodeDialog,
    // DeleteNodeComponent,
    UnfydMastersComponent
  ],
  imports: [
    UnfydMasterFormModule,
    DispositionModule,
    BusinessHoursModule,
    BusinessUnitModule,
    CommonModule,
    UnfydMastersRoutingModule,
    MaterialModule,
    // BrowserAnimationsModule,
    FormsModule,
    // BrowserModule,
  ]
})
export class UnfydMastersModule { }
