import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProblemComponent } from './problem.component';
import { ProblemEditComponent } from './problem.edit.component';

const appRoutes = [
  { path: 'problems/create', component: ProblemEditComponent },
  { path: 'problems/edit', component: ProblemEditComponent },
  { path: 'problems/edit/:id', component: ProblemEditComponent },
  { path: 'problems/:id', component: ProblemComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProblemComponent,
    ProblemEditComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
