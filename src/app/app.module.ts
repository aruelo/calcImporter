import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule, MatButtonModule, MatGridListModule, MatSelectModule, MatFormFieldModule, MatInputModule,  MatAutocompleteModule,  MatExpansionModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DialogResultadoComponent } from './dialog-resultado/dialog-resultado.component';
import { OnlynumberDirective } from './_directives/numeric_directive';


@NgModule({
  declarations: [
	AppComponent,
	OnlynumberDirective,
    DialogResultadoComponent
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
	MatSelectModule,
	MatInputModule,
	MatCheckboxModule,
	MatAutocompleteModule,
	MatFormFieldModule,
	MatDialogModule
  ],
  entryComponents: [
	DialogResultadoComponent
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
