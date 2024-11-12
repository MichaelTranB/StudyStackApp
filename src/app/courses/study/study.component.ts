import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage'; 
import { Question, QuizData } from '../../shared/models/quiz.model';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit {
  studyMaterials: Question[] = []; // Array to hold study materials (all questions for the topic)
  private audio: HTMLAudioElement;

  constructor(private storage: AngularFireStorage) {
    this.audio = new Audio();
  }

  ngOnInit(): void {
    this.loadStudyMaterialsFromFirebase();
  }

  loadStudyMaterialsFromFirebase(): void {
    const filePath = `json/python1A.json`;
    const fileRef = this.storage.ref(filePath);

    fileRef.getDownloadURL().subscribe(
      (url: string) => {
        fetch(url)
          .then((response) => response.json())
          .then((data: QuizData) => {
            if (data.Python1A && data.Python1A.length > 0) {
              this.studyMaterials = data.Python1A[0].questions;
              this.playSound('/assets/sounds/study-material.mp3');
            }
          });
      },
      (error: any) => {
        console.error("Error loading JSON file from Firebase:", error);
      }
    );
  }

  playSound(fileUrl: string): void {
    this.audio.src = fileUrl;
    this.audio.load();
    this.audio.play();
  }
}
