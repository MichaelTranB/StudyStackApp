import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {
  isLoading = false;
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

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
