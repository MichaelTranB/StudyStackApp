import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CourseTopicsPageRoutingModule } from './course-topics-routing.module';

import { CourseTopicsPage } from './course-topics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CourseTopicsPageRoutingModule
  ],
  declarations: [CourseTopicsPage]
})
export class CourseTopicsPageModule {}
