import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { LoginModalComponent } from './components/Modals/login-modal/login-modal.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { TestCreationComponent } from './pages/test-creation/test-creation.component';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StatsPageComponent } from './pages/stats-page/stats-page.component';
import { MaterialsPageComponent } from './pages/materials-page/materials-page.component';
import { TestDoneComponent } from './pages/test-done/test-done.component';
import { TestWritingComponent } from './pages/test-writing/test-writing.component'; // Import MatSlideToggleModule here
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatStepper } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MathjaxModule } from 'mathjax-angular';

import { NgApexchartsModule } from 'ng-apexcharts';
import { DensityComponent } from './components/graphs/density/density.component';
import { DistributionComponent } from './components/graphs/distribution/distribution.component';
import { PoissonComponent } from './components/graphs/poisson/poisson.component';
import { StudentovoComponent } from './components/graphs/studentovo/studentovo.component';
import { ChikvadrantComponent } from './components/graphs/chikvadrant/chikvadrant.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DataTableComponent } from './components/tables/data-table/data-table.component';
import { MatSortModule } from '@angular/material/sort';
import { ConfirmDialogComponent } from './pages/admin-page/adminDialog/confirm-dialog.component';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { EditDialogComponent } from './pages/admin-page/adminDialog/edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginModalComponent,
    MenuPageComponent,
    TestCreationComponent,
    StatsPageComponent,
    MaterialsPageComponent,
    TestDoneComponent,
    TestWritingComponent,
    NavbarComponent,
    DensityComponent,
    DistributionComponent,
    PoissonComponent,
    StudentovoComponent,
    ChikvadrantComponent,
    SidenavComponent,
    AdminPageComponent,
    DataTableComponent,
    ConfirmDialogComponent,
    EditDialogComponent,
  ],
  imports: [
    MathjaxModule.forRoot(),
    MatSnackBarModule,
    MatCheckboxModule,
    BrowserModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatDividerModule,
    NgbModule,
    MatSidenavModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule to imports
    HttpClientModule, // Add HttpClientModule to imports
    MatSlideToggleModule, // Import MatSlideToggleModule here
    MatSelectModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    NgApexchartsModule,
    MatSidenavModule,
    MatTabsModule,
    MatDialogActions,
    MatDialogContent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
