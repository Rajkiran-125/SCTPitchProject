import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FinanceRoutingModule } from "./finance-routing.module";
import { MaterialModule } from "src/app/global/material.module";
import { LoaderModule } from "src/app/shared/loader/loader.module";
import { FinanceComponent } from "./finance.component";

@NgModule({
  declarations: [FinanceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FinanceRoutingModule,
    MaterialModule,
    LoaderModule,
  ],
})
export class FinanceModule {}
