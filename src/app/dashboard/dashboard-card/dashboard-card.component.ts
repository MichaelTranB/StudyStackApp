import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() courseId!: string;

  constructor(private router: Router) {}

  goToFlashcard(mode: string, courseId: string) {
    this.router.navigate([`/flashcard/${mode}/${courseId}`]);
  }
}
