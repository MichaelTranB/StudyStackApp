import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, of, Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import { User } from './user.model';
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
    private firestore: AngularFirestore,
    private configService: ConfigService
  ) {}

  get userIsAuthenticated(): Observable<boolean> {
    return this._user.asObservable().pipe(map((user) => !!user?.token));
  }

  get userId(): Observable<string | null> {
    return this._user.asObservable().pipe(map((user) => user?.id || null));
  }

  get token(): Observable<string | null> {
    return this._user.asObservable().pipe(map((user) => user?.token || null));
  }

  get role(): Observable<string> {
    return this._user.asObservable().pipe(map((user) => user?.role || 'user'));
  }

  autoLogin(): Observable<boolean> {
    const storedData = localStorage.getItem('authData');
    if (!storedData) return of(false);

    const parsedData = JSON.parse(storedData) as {
      token: string;
      tokenExpirationDate: string;
      userId: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    };

    const expirationTime = new Date(parsedData.tokenExpirationDate);
    if (expirationTime <= new Date()) return of(false);

    const user = new User(
      parsedData.userId,
      parsedData.firstName,
      parsedData.lastName,
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

  signup(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string = 'user'
  ): Observable<{ [key: string]: any }> {
    console.log('Signup input:', { firstName, lastName });

    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        if (!user) throw new Error('User creation failed.');

        const userData = {
          email: user.email || '',
          firstName,
          lastName,
          role,
          userId: user.uid,
        };

        return this.firestore.collection('accounts').doc(user.uid).set(userData).then(() => {
          console.log('Successfully written to Firestore:', userData);
          return userData;
        });
      }),
      tap((userData) => {
        this.storeAuthData(
          userData.userId,
          userData.email,
          userData.firstName,
          userData.lastName,
          userData.role
        );
      })
    );
  }

  login(email: string, password: string): Observable<{ [key: string]: any }> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((userCredential) => {
        const user = userCredential.user;
        if (!user) throw new Error('Login failed.');

        return this.firestore.collection('accounts').doc(user.uid).get().pipe(
          map((doc) => doc.data() as { [key: string]: any }),
          tap((userData) => {
            console.log('Retrieved User Data:', userData);

            this._user.next(
              new User(
                user.uid,
                userData['firstName'] || '',
                userData['lastName'] || '',
                user.email!,
                '',
                new Date(),
                userData['role'] || 'user'
              )
            );
          })
        );
      })
    );
  }

  loginWithGoogle(): Observable<{ [key: string]: any }> {
    const provider = new GoogleAuthProvider();
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      switchMap((result) => {
        const user = result.user;
        if (!user) throw new Error('Google login failed.');

        const userData = {
          email: user.email || '',
          firstName: user.displayName?.split(' ')[0] || 'FirstName',
          lastName: user.displayName?.split(' ')[1] || 'LastName',
          role: 'user',
          userId: user.uid,
        };

        return this.firestore.collection('accounts').doc(user.uid).set(userData, { merge: true }).then(() => userData);
      }),
      tap((userData) => {
        this.storeAuthData(
          userData.userId,
          userData.email,
          userData.firstName,
          userData.lastName,
          userData.role
        );
      })
    );
  }

  logout(): void {
    if (this.activeLogoutTimer) clearTimeout(this.activeLogoutTimer);
    this._user.next(null);
    localStorage.removeItem('authData');
  }

  private storeAuthData(
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    role: string
  ): void {
    const data = JSON.stringify({ userId, email, firstName, lastName, role });
    localStorage.setItem('authData', data);
  }

  private autoLogout(duration: number): void {
    if (this.activeLogoutTimer) clearTimeout(this.activeLogoutTimer);
    this.activeLogoutTimer = setTimeout(() => this.logout(), duration);
  }

  ngOnDestroy(): void {
    if (this.activeLogoutTimer) clearTimeout(this.activeLogoutTimer);
  }
}
