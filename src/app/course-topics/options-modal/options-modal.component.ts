import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options-modal',
  templateUrl: './options-modal.component.html',
  styleUrls: ['./options-modal.component.scss']
})
export class OptionsModalComponent {

  constructor(private modalController: ModalController, private router: Router) {}

  closeModal() {
    this.modalController.dismiss();
  }

  selectOption(mode: string) {
    console.log(`Selected option: ${mode}`);
    
    // Navigate to QuizComponent with mode as a query parameter and course ID as a path parameter
    this.router.navigate(['/courses/quiz/1'], { queryParams: { mode } }); // Replace `1` with dynamic course ID if needed
    
    this.closeModal();
  }
}