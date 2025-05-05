import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { TestCreationComponent } from './pages/test-creation/test-creation.component';
import { LoginModalComponent } from './components/modals/login-modal/login-modal.component';
import { StatsPageComponent } from './pages/stats-page/stats-page.component';
import { TestDoneComponent } from './pages/test-done/test-done.component';
import { MaterialsPageComponent } from './pages/materials-page/materials-page.component';
import { TestWritingComponent } from './pages/test-writing/test-writing.component';
import { AuthGuard } from './auth.guard';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminStatisticsComponent } from './pages/admin-page/admin-statistics/admin-statistics.component';
import { ExportPageComponent } from './pages/export-page/export-page.component';

const routes: Routes = [
  { path: '', component: LoginModalComponent },
  { path: 'menu', component: MenuPageComponent, canActivate: [AuthGuard] },
  { path: 'test', component: TestCreationComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatsPageComponent, canActivate: [AuthGuard] },
  { path: 'done', component: TestDoneComponent, canActivate: [AuthGuard] },
  { path: 'mats', component: MaterialsPageComponent, canActivate: [AuthGuard] },
  { path: 'test-writing', component: TestWritingComponent, canActivate: [AuthGuard] },
  { path: 'export', component: ExportPageComponent, canActivate: [AuthGuard] },
  // Admin routes: only accessible if employeeType is 'admin'
  { path: 'admin', component: AdminPageComponent },
  { path: 'admin/statistics', component: AdminStatisticsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
