import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;
    const firstName = form.value.firstName; // Extracting firstName
    const lastName = form.value.lastName; // Extracting lastName

    console.log('Form values:', { email, password, firstName, lastName }); // Debugging

    this.authenticate(email, password, firstName, lastName);
    form.reset();
  }

  private authenticate(email: string, password: string, firstName: string, lastName: string) {
    this.isLoading = true;
    this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' }).then((loadingEl) => {
      loadingEl.present();

      const authObs = this.isLogin
        ? this.authService.login(email, password)
        : this.authService.signup(email, password, firstName, lastName); // Pass firstName & lastName

      authObs.subscribe(
        () => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        },
        (error) => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.showAlert(error.message || 'An unknown error occurred!');
        }
      );
    });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({ header: 'Authentication failed', message, buttons: ['Okay'] })
      .then((alertEl) => alertEl.present());
  }

  onLoginWithGoogle() {
    this.isLoading = true;
    this.authService.loginWithGoogle().subscribe(
      () => {
        this.isLoading = false;
        this.router.navigateByUrl('/places/tabs/discover');
      },
      () => {
        this.isLoading = false;
        this.showAlert('Google login failed. Please try again.');
      }
    );
  }
}
