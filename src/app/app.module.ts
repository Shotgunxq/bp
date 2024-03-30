import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { LoginModalComponent } from './components/Modals/login-modal/login-modal.component';
@NgModule({
  declarations: [
    AppComponent, LoginModalComponent  ],
  imports: [
    BrowserModule,
    MatGridListModule,
    NgbModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule to imports
    HttpClientModule // Add HttpClientModule to imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
