import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { OrderModule } from 'ngx-order-pipe';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OthersModule } from './others/others.module';
import { RolesPermissionModule } from './roles-permission/roles-permission.module';
import { ChannelMappingModule } from './channel-mapping/channel-mapping.module';

@NgModule({
  declarations: [
    UsersComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    MaterialModule,
    LoaderModule,
    StepsModule,
    OrderModule,
    OthersModule,
    RolesPermissionModule,
    ChannelMappingModule,
    MatDialogModule
  ],providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[
  UsersComponent]
})
export class UsersModule { }
