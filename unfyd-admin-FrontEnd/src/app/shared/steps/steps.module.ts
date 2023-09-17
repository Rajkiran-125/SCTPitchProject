import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepsComponent } from './steps.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatDialogModule
    ],
    declarations: [
        StepsComponent
    ],
    providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],
    exports: [
        StepsComponent
    ]
})
export class StepsModule { }
