import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaskingRuleRoutingModule } from './masking-rule-routing.module';
import { MaskingRuleComponent } from '../masking-rule/masking-rule.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { SkillsRoutingModule } from '../skills/skills-routing.module';


@NgModule({
  declarations: [
    MaskingRuleComponent
  ],
  imports: [
    CommonModule,
    MaskingRuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkillsRoutingModule,
    MaterialModule,
    LoaderModule
  ]
})
export class MaskingRuleModule { }
