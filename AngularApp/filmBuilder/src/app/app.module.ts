import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatDividerModule, 
  MatLineModule, MatProgressSpinnerModule, MatListModule, MatTableModule, MatTabsModule, 
  MatGridListModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Custom components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BuilderUIComponent } from './builder-ui/builder-ui.component';
import { StoreUIComponent } from './store-ui/store-ui.component';
import { ScriptBuilderComponent} from './script-builder/script-builder.component';

// Custom services
import { FilmComposerService } from "./film-composer.service";
import { StoreService } from "./store.service";



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BuilderUIComponent,
    StoreUIComponent,
    ScriptBuilderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [FilmComposerService, StoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
