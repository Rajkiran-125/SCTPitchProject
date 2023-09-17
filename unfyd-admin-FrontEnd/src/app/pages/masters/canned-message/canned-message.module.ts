import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { AddNodeComponent, NewNodeDialog,AddNodeDialogModule,AddNodeModule} from 'src/app/shared/treeControl/add-node/add-node.component';
import { EditNodeComponent, EditNodeDialog, EditNodeDialogModule, EditNodeModule } from 'src/app/shared/treeControl/edit-node/edit-node.component';
import { DeleteNodeComponent, DeleteNodeModule} from 'src/app/shared/treeControl/delete-node/delete-node.component';

import { CannedMessageRoutingModule } from './canned-message-routing.module';
import { CannedMessageComponent } from './canned-message.component';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  // entryComponents: [
    // NewNodeDialog,
    // EditNodeDialog
  // ],
  declarations: [
    CannedMessageComponent
    // AddNodeComponent,
    // NewNodeDialog,
    // AddNodeComponent,
    // EditNodeComponent,
    // DeleteNodeComponent
  ],
  imports: [
    EditNodeModule,
    EditNodeDialogModule,
    AddNodeDialogModule,
    AddNodeModule,
    DeleteNodeModule,
    LoaderModule,
    CommonModule,
    CannedMessageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSummernoteModule
  ]
})
export class CannedMessageModule { }
