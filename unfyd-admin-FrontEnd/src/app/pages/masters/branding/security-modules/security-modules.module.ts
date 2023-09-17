import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { OrderModule } from 'ngx-order-pipe';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SecurityModulesComponent } from './security-modules.component'

@NgModule({
  declarations: [
 SecurityModulesComponent
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
 ],exports:[SecurityModulesComponent]
})
export class SecurityModulesModule { }
