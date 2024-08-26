import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FlashcardPageRoutingModule } from './flashcard-routing.module';
import { FlashcardPage } from './flashcard.page';
import { PracticeComponent } from '../../courses/practice/practice.component';
import { StudyComponent } from '../../courses/study/study.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlashcardPageRoutingModule
  ],
  declarations: [
    FlashcardPage,
    PracticeComponent,  
    StudyComponent      
  ]
})
export class FlashcardPageModule {}
