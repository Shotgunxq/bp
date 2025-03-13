import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { TestCreationComponent } from './pages/test-creation/test-creation.component';
import { LoginModalComponent } from './components/Modals/login-modal/login-modal.component';
import { StatsPageComponent } from './pages/stats-page/stats-page.component';
import { TestDoneComponent } from './pages/test-done/test-done.component';
import { MaterialsPageComponent } from './pages/materials-page/materials-page.component';
import { TestWritingComponent } from './pages/test-writing/test-writing.component';
import { AuthGuard } from './auth.guard';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminStatisticsComponent } from './pages/admin-page/admin-statistics/admin-statistics.component';
import { ExportPageComponent } from './pages/export-page/export-page.component';

const routes: Routes = [
  { component: LoginModalComponent, path: '' },
  { component: MenuPageComponent, path: 'menu' },
  { component: TestCreationComponent, path: 'test' },
  { component: StatsPageComponent, path: 'stats' },
  { component: TestDoneComponent, path: 'done' },
  { component: MaterialsPageComponent, path: 'mats' },
  { component: TestWritingComponent, path: 'test-writing' },
  { component: ExportPageComponent, path: 'export' },
  { component: AdminPageComponent, path: 'admin' },
  { component: AdminStatisticsComponent, path: 'admin/statistics' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
