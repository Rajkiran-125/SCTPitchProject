import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkillsRoutingModule } from './skills-routing.module';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { SkillsComponent } from './skills.component';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';


@NgModule({
  declarations: [ 
    SkillsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkillsRoutingModule,
    MaterialModule,
    LoaderModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
 ], exports:[
    SkillsComponent
  ]
})
export class SkillsModule { }
