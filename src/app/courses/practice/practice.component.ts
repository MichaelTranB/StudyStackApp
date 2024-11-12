import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController } from '@ionic/angular';
import { WriteModalComponent } from '../../dashboard/flashcard/write-modal/write-modal.component';
import { Howl } from 'howler';
import { Question, QuizData } from '../../shared/models/quiz.model';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  @Input() courseId?: string;
  questions: Question[] = [];
  currentQuestionIndex = 0;
  showAnswer = false;
  isReadMode = true;
  isSanskritCourse = false; // Flag for Sanskrit course
  sound!: Howl;

  constructor(
    private modalController: ModalController,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.loadPracticeQuestionsFromFirebase();
  }

  loadPracticeQuestionsFromFirebase(): void {
    const filePath = `json/python1A.json`;
    const fileRef = this.storage.ref(filePath);

    fileRef.getDownloadURL().subscribe(
      (url: string) => {
        fetch(url)
          .then((response) => response.json())
          .then((data: QuizData) => {
            if (data.Python1A && data.Python1A.length > 0) {
              this.questions = data.Python1A[0].questions;
              this.checkIfSanskritCourse();
            } else {
              console.warn("No practice questions available in JSON data.");
            }
          });
      },
      (error: any) => {
        console.error("Error loading JSON file from Firebase:", error);
      }
    );
  }

  checkIfSanskritCourse(): void {
    if (this.courseId === 'sanskrit') {
      this.isSanskritCourse = true;
      this.loadSound();
    }
  }

  loadSound() {
    this.sound = new Howl({
      src: 'assets/sounds/4209177_livepiano__01c0_om-elo.wav',
      html5: true,
      onload: () => console.log("Sound loaded successfully"),
      onplayerror: (error: any) => console.error("Error while trying to play the sound:", error)
    });
  }

  playSound() {
    if (this.sound) {
      this.sound.play();
    }
  }

  switchToReadMode() {
    this.isReadMode = true;
  }

  async openWriteModal() {
    const modal = await this.modalController.create({
      component: WriteModalComponent
    });
    return await modal.present();
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.showAnswer = false;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showAnswer = false;
    }
  }

  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;
  }
}
