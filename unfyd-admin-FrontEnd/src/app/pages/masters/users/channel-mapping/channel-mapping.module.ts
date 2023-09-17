import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { OrderModule } from 'ngx-order-pipe';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChannelMappingComponent } from './channel-mapping.component';
import { UsersModule } from '../users.module';
import { RolesPermissionModule } from '../roles-permission/roles-permission.module';
import { OthersModule } from '../others/others.module';


@NgModule({
  declarations: [
ChannelMappingComponent
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
ChannelMappingComponent]
})
export class ChannelMappingModule { }
