import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { TestWritingComponent } from './components/test-writing/test-writing.component';
import { LoginModalComponent } from './components/Modals/login-modal/login-modal.component';

const routes: Routes = [
  {component: LoginModalComponent, path: ''},
  {component: MenuPageComponent, path: 'menu'},
  {component: TestWritingComponent, path: 'test'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
