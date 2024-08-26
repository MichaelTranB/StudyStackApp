import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { Course } from '../shared/models/course.model'; // Adjust the path as necessary

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  courses: Course[] = []; // Specify the type as an array of Course objects

  constructor(
    private configService: ConfigService,
    private router: Router
  ) {}

  ngOnInit() {
    this.configService.getConfig().subscribe(data => {
      if (data && data.courses) {
        this.courses = data.courses as Course[];
      } else {
        console.error('Courses data is missing in the config response.');
      }
    });
  }

  goToFlashcard(mode: string, courseId: string) {
    this.router.navigate(['/flashcard', mode, courseId]);
  }
}
