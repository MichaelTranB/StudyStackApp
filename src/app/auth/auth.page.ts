import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
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

  authenticate(form: NgForm) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;

        const email = form.value.email;
        const password = form.value.password;

        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          const firstName = form.value.firstName;
          const lastName = form.value.lastName;
          authObs = this.authService.signup(email, password, firstName, lastName);
        }

        authObs.subscribe(
          resData => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          },
          errRes => {
            this.isLoading = false;
            loadingEl.dismiss();
            const errorMessage = errRes?.error?.error?.message || 'Could not sign you up, please try again.';
            let message = 'Could not sign you up, please try again.';
            if (errorMessage === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            } else if (errorMessage === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail address could not be found.';
            } else if (errorMessage === 'INVALID_PASSWORD') {
              message = 'This password is not correct.';
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    this.authenticate(form);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

  onLoginWithGoogle() {
    this.isLoading = true;
    this.authService.loginWithGoogle().subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigateByUrl('/places/tabs/discover');
      },
      errRes => {
        this.isLoading = false;
        const message = 'Could not log you in with Google, please try again.';
        this.showAlert(message);
      }
    );
  }
}
