import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DamagedstockRoutingModule } from "./damagedstock-routing.module";
import { MaterialModule } from "src/app/global/material.module";
import { LoaderModule } from "src/app/shared/loader/loader.module";
import { DamagedstockComponent } from "./damagedstock.component";

@NgModule({
  declarations: [DamagedstockComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DamagedstockRoutingModule,
    MaterialModule,
    LoaderModule,
  ],
})
export class DamagedstockModule {}
