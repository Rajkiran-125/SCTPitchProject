import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserGroupRoutingModule } from './user-group-routing.module';
import { UserGroupComponent } from './user-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@NgModule({
  declarations: [
    UserGroupComponent
  ],
  imports: [
    CommonModule,
    UserGroupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    MatDialogModule
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],
  exports:[
    UserGroupComponent
  ]
})
export class UserGroupModule { }
