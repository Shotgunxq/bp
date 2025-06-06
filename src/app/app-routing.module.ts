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
  // LOGIN
  { path: 'login', component: LoginModalComponent },
  // If someone goes to '/', send them to /login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Public routes (after login)
  { path: 'menu', component: MenuPageComponent, canActivate: [AuthGuard] },
  { path: 'test', component: TestCreationComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatsPageComponent, canActivate: [AuthGuard] },
  { path: 'done', component: TestDoneComponent, canActivate: [AuthGuard] },
  { path: 'mats', component: MaterialsPageComponent, canActivate: [AuthGuard] },
  { path: 'test-writing', component: TestWritingComponent, canActivate: [AuthGuard] },
  { path: 'export', component: ExportPageComponent, canActivate: [AuthGuard] },

  // ADMIN routes (only for role === 'admin')
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/statistics',
    component: AdminStatisticsComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' },
  },

  // catch‐all
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
