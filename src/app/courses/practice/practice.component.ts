import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Set } from '../../shared/models/set.model';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  @Input() courseId!: string;
  questions: Set[] = [];  // Assuming Set has a 'question' and 'answer' field
  currentQuestionIndex = 0;
  showAnswer = false;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getCourses().subscribe(courses => {
      const course = courses.find(c => c.id === this.courseId);
      if (course && course.questions) {
        this.questions = course.questions as Set[];
        console.log("Questions loaded:", this.questions);
      } else {
        console.error("No data found for course:", this.courseId);
        this.questions = [];  // Ensure questions is an empty array instead of undefined
      }
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.showAnswer = false; // Reset answer visibility
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.showAnswer = false; // Reset answer visibility
    }
  }

  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;
  }
}
