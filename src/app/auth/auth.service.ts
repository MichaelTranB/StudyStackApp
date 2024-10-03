import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { ConfigService } from '../config.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User | null>(null);
  private activeLogoutTimer: any;

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private configService: ConfigService
  ) {}

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => (user ? !!user.token : false))
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => (user ? user.id : null))
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => (user ? user.token : null))
    );
  }

  get role() {
    return this._user.asObservable().pipe(
      map((user) => (user ? user.role : 'user'))
    );
  }

  autoLogin() {
    const storedData = localStorage.getItem('authData');
    if (!storedData) return of(false);

    const parsedData = JSON.parse(storedData) as {
      token: string;
      tokenExpirationDate: string;
      userId: string;
      email: string;
      role: string;
    };

    const expirationTime = new Date(parsedData.tokenExpirationDate);
    if (expirationTime <= new Date()) return of(false);

    const user = new User(
      parsedData.userId,
      parsedData.email,
      parsedData.token,
      expirationTime,
      parsedData.role
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.configService.updateStreak(user.id);

    return of(true);
  }

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebase.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebase.apiKey}`,
        { email, password, returnSecureToken: true }
      )
      .pipe(
        tap((userData) => {
          this.setUserData(userData);
          this.configService.updateStreak(userData.localId);
        })
      );
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      switchMap(async (result) => {
        if (!result.user) {
          throw new Error('User not found');
        }

        const token = await result.user.getIdToken();
        const tokenResult = await result.user.getIdTokenResult();
        const role = tokenResult.claims['role'] || 'user';  // Fetch role or set to 'user'
        const expirationTime = new Date(new Date().getTime() + 3600 * 1000);

        const user = new User(
          result.user.uid!,
          result.user.email!,
          token,
          expirationTime,
          role
        );
        this._user.next(user);
        this.storeAuthData(user.id, token, expirationTime.toISOString(), user.email!, role);
        this.autoLogout(user.tokenDuration);
        this.configService.updateStreak(user.id);
        return user;
      })
    );
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    localStorage.removeItem('authData');
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const role = 'user'; // Default role for newly registered users
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime,
      role
    );
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email,
      role
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string,
    role: string  // Store the role
  ) {
    const data = JSON.stringify({ userId, token, tokenExpirationDate, email, role });
    localStorage.setItem('authData', data);
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
