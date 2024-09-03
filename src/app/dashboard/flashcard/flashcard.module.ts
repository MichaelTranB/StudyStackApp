import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FlashcardPageRoutingModule } from './flashcard-routing.module';
import { FlashcardPage } from './flashcard.page';
import { PracticeComponent } from '../../courses/practice/practice.component';
import { StudyComponent } from '../../courses/study/study.component';
import { WriteModalComponent } from './write-modal/write-modal.component';  // Import the new component

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
    StudyComponent,    
    WriteModalComponent  // Declare the new component
  ]
})
export class FlashcardPageModule {}
