import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormCreationComponent } from './form-creation.component';
import { WrapFormComponent } from './wrap-form/wrap-form.component';

const routes: Routes = [
  {
    path: "view",
    component: FormCreationComponent,
  },
  {
    path: 'add/:productId/:type',
    data: { title: 'WrapForm' },
    loadChildren: () => import('./wrap-form/wrap-form.module').then(mod => mod.WrapFormModule),
  },
  {
    path: 'update/:productId/:type/:id',
    data: { title: 'WrapForm' },
    loadChildren: () => import('./wrap-form/wrap-form.module').then(mod => mod.WrapFormModule),
  },
  {
    path: ':productId/:type',
    data: { title: 'FormSubCategory' },
    loadChildren: () => import('./form-sub-category/form-sub-category.module').then(mod => mod.FormSubCategoryModule),
  },
  { path: '',   redirectTo: '/view', pathMatch: 'full' },
  // {
  //   path: "update:/id",
  //   component: WrapFormComponent,
  // },
  // {
  //   path: "add",
  //   component: WrapFormComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormCreationRoutingModule { }
