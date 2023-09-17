import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FinanceComponent } from "./finance.component";

const routes: Routes = [
  {
    path: "add",
    component: FinanceComponent,
  },
  {
    path: "update/:id",
    component: FinanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
