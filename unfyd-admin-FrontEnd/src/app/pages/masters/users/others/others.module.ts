import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { StepsModule } from 'src/app/shared/steps/steps.module';
import { OrderModule } from 'ngx-order-pipe';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OthersComponent } from './others.component';

@NgModule({
  declarations: [
 OthersComponent
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
 ],exports:[OthersComponent]
})
export class OthersModule { }
