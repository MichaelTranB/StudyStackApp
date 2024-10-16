import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DiscoverPage } from './discover.page';
import { CategoriesComponent } from './categories/categories.component';
import { DisplayAllComponent } from './display-all/display-all.component';
import { CoursePopupComponent } from './course-popup/course-popup.component';

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
    RouterModule.forChild(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DiscoverPage, CategoriesComponent, DisplayAllComponent, CoursePopupComponent]
})
export class DiscoverPageModule {}