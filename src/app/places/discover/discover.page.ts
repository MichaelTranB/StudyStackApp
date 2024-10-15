import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces!: any[];
  relevantPlaces!: any[];
  isLoading = false;
  selectedSegment: string = 'Category'; // Default selection is 'Category'
  private placesSub!: Subscription;

  constructor(
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    this.selectedSegment = event.detail.value as string || 'Category';
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}