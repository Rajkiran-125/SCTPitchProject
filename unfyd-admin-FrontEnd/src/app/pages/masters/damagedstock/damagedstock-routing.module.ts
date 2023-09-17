import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DamagedstockComponent } from "./damagedstock.component";

const routes: Routes = [
  {
    path: "add",
    component: DamagedstockComponent,
  },
  {
    path: "update/:id",
    component: DamagedstockComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DamagedstockRoutingModule {}
