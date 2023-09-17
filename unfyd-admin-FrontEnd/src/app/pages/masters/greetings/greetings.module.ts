import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/global/material.module';
import { GreetingsRoutingModule } from './greetings-routing.module';
import { LoaderModule } from 'src/app/shared/loader/loader.module';
import { GreetingsComponent } from './greetings.component';

@NgModule({
  declarations: [GreetingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GreetingsRoutingModule,
     LoaderModule,
    MaterialModule
  ]
})
export class GreetingsModule { }
