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
  ],
  imports: [
    BrowserModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    NgbModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule to imports
    HttpClientModule, // Add HttpClientModule to imports
    MatSlideToggleModule, // Import MatSlideToggleModule here
    MatSelectModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
