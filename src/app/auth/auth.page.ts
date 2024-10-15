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

  authenticate(form: NgForm, email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
  
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          // Log the firstName and lastName values
          console.log('First Name:', form.value.firstName);
          console.log('Last Name:', form.value.lastName);
          
          authObs = this.authService.signup(email, password, form.value.firstName, form.value.lastName);
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
  
            // Check if the structure contains the error message, and handle it gracefully
            let message = 'Could not sign you up, please try again.';
            
            if (errRes && errRes.error && errRes.error.error) {
              const code = errRes.error.error.message;
  
              if (code === 'EMAIL_EXISTS') {
                message = 'This email address exists already!';
              } else if (code === 'EMAIL_NOT_FOUND') {
                message = 'E-Mail address could not be found.';
              } else if (code === 'INVALID_PASSWORD') {
                message = 'This password is not correct.';
              }
            } else {
              // Handle other cases where errRes might not have an error structure
              message = errRes.message || 'An unknown error occurred!';
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
    const email = form.value.email;
    const password = form.value.password;
  
    // Use the authenticate method, which already handles login/signup
    this.authenticate(form, email, password);
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
