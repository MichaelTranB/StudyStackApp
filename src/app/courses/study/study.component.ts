import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../config.service';
import { Set } from '../../shared/models/set.model';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent extends BaseComponent implements OnInit {
  studyMaterials: Set[] = [];

  constructor(private configService: ConfigService) {
    super(); // Call the base class constructor
  }

  ngOnInit(): void {
    this.configService.getCourses().subscribe(courses => {
      const course = courses.find(c => c.id === this.courseId);
      if (course && course.questions) {
        this.studyMaterials = course.questions as Set[];
        console.log("Study materials loaded:", this.studyMaterials);
      } else {
        console.error("No data found for course:", this.courseId);
        this.studyMaterials = [];
      }
    });
  }
}
