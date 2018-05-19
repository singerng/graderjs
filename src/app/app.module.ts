import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ProblemComponent } from './problem.component';

const appRoutes = [
  { path: 'problem/:id', component: ProblemComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ProblemComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
