import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Course } from '../../shared/models/course.model';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {
  @Input() courseId!: string;
  questions: any[] = [];  // Consider creating a more specific type for questions if needed
  currentQuestionIndex = 0;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig().subscribe(config => {
      const course = config.courses.find((c: Course) => c.id === this.courseId);
      if (course && course.data) {
        this.questions = course.data;
      }
    });
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.currentQuestionIndex = 0;  // Loop back to the first question
    }
  }

  checkAnswer(selectedAnswer: string): void {
    let correctAnswer = this.questions[this.currentQuestionIndex].answer;
    // Compare selectedAnswer with correctAnswer
  }
}
