import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Course } from '../../shared/models/course.model';
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
      const course = courses.find((c: Course) => c.id === this.courseId);
      if (course && course.questions) {
        this.questions = course.questions as Set[];
      } else {
        console.error("No data found for course:", this.courseId);
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
