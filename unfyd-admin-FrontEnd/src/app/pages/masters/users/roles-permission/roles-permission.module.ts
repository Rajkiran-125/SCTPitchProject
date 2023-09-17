import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { OrderModule } from 'ngx-order-pipe';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RolesPermissionComponent } from './roles-permission.component';
import { UsersModule } from '../users.module';
import { OthersModule } from '../others/others.module';
import { ChannelMappingModule } from '../channel-mapping/channel-mapping.module';


@NgModule({
  declarations: [
RolesPermissionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LoaderModule,
    StepsModule,
    OrderModule,
    MatDialogModule,
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[
RolesPermissionComponent]
})
export class RolesPermissionModule { }
