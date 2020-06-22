import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatButtonModule, MatGridListModule, MatSelectModule, MatFormFieldModule, MatInputModule,  MatAutocompleteModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
	HttpClientModule,
    BrowserModule,
    AppRoutingModule,
	BrowserAnimationsModule,
	FormsModule,
	ReactiveFormsModule,
	MatCardModule,
	MatButtonModule,
	MatGridListModule,
	MatSelectModule,
	MatInputModule,
	MatAutocompleteModule,
	MatFormFieldModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
