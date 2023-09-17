import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HierarchyRoutingModule } from './hierarchy-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { HierarchyComponent } from './hierarchy.component';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';


@NgModule({
  declarations: [ 
    HierarchyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HierarchyRoutingModule,
    MaterialModule,
    LoaderModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ],exports:[
  HierarchyComponent
]
})
export class HierarchyModule { }
