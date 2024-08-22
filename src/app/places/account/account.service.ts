import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { take, tap, switchMap, map } from 'rxjs/operators';

import { Account } from './account.model';
import { AuthService } from 'C:/Users/tran0/Desktop/bookings/src/app/auth/auth.service';

interface AccountData {
    userId: string;
    name: string;
    email: string;
    phone: string;
    items: any[];
  }

@Injectable({ providedIn: 'root' })
export class AccountService {
  private _accounts = new BehaviorSubject<Account[]>([]);

  get account() {
    return this._accounts.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchAccount() {
    return this.http
      .get<{ [key: string]: AccountData }>(  
        `https://bookings-abeec-default-rtdb.firebaseio.com/accounts.json?orderBy="userId"&equalTo="${
          this.authService.userId
        }"`
      )
      .pipe(
        map(accountData => {
            const accounts = []
        for (const key in accountData) {
            if (accountData.hasOwnProperty(key)) {
              accounts.push(
              new Account(
                key,
                accountData[key].userId,
                accountData[key].name,
                accountData[key].email,
                accountData[key].phone,
                accountData[key].items
              )
            );
        }
          }
          return accounts;
        }),
        tap(accounts => {
          this._accounts.next(accounts);
        })
      );
  }

  
  addName(
    userId: string,
    name: string,
    email: string,
    phone: string,
    items: any[]
  ) {
    let generatedId: string;
    const newAccount = new Account(
      Math.random().toString(),
      userId,
      name,
      email,
      phone,
      items
    );
    return this.http
      .post<{ name: string }>(
        'https://bookings-abeec-default-rtdb.firebaseio.com/accounts.json',
        { ...newAccount, id: null }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this._accounts;
        }),
        take(1),
        tap(accounts => {
          newAccount.id = generatedId;
          this._accounts.next(accounts.concat(newAccount));
        })
      );
  }

}
