import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling'; // Correct import path
import { DiscoverPage } from './discover.page';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DiscoverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ScrollingModule // Add ScrollingModule here
  ],
  declarations: [DiscoverPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DiscoverPageModule {}
