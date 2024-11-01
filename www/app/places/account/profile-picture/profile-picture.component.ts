import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service'; // Adjust path based on your structure

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent implements OnInit {
  firstName = '';
  lastName = '';
  email = '';
  userId = sessionStorage.getItem('userId'); // Pull userId from sessionStorage

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    if (this.userId) {
      this.accountService.fetchAccount().subscribe((accounts) => {
        const account = accounts.find((acc) => acc.userId === this.userId);
        if (account) {
          this.firstName = account.firstName;
          this.lastName = account.lastName;
          this.email = account.email;
        }
      });
    }
  }
}
