import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { PieComponent } from './pie/pie.component';
import { ParametersComponent } from './parameters/parameters.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphService } from './graph.service';
import { GraphComponent } from './graph/graph.component';
import { InfectedByAgeComponent } from './infected-by-age/infected-by-age.component';
import { InfectedAccumulatedComponent } from './infected-accumulated/infected-accumulated.component';
import { InfectedStackedLocalComponent } from './infected-stacked-local/infected-stacked-local.component';
import { RInfectionComponent } from './r-infection/r-infection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InfectorByAgeComponent } from './infector-by-age/infector-by-age.component';


@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    PieComponent,
    ParametersComponent,
    GraphComponent,
    InfectedByAgeComponent,
    InfectedAccumulatedComponent,
    InfectedStackedLocalComponent,
    RInfectionComponent,
    InfectorByAgeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [GraphService],
  bootstrap: [AppComponent]
})
export class AppModule { }
