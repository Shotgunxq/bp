import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { TestWritingComponent } from './pages/test-writing/test-writing.component';

const routes: Routes = [
  {component: MenuPageComponent, path: 'menu'},
  {component: TestWritingComponent, path: 'test'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
