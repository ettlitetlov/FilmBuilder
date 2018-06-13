import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatDividerModule, MatLineModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BuilderUIComponent } from './builder-ui/builder-ui.component';
import { StoreUIComponent } from './store-ui/store-ui.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BuilderUIComponent,
    StoreUIComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatLineModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
