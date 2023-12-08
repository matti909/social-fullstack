import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchUsersResponse, UsersResponse } from 'src/app/shared/types/user';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss'],
})
export class SearchDialogComponent implements OnInit {
  usersSubscription: Subscription | null = null;
  users: User[] = [];
  fetchMore: (feed: User[]) => void = () => {};

  constructor(
    public dialogRef: MatDialogRef<SearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public response: SearchUsersResponse,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.usersSubscription = this.response.data.subscribe({
      next: (data: UsersResponse | null | undefined) => {
        if (data?.searchUsers) {
          this.users = data.searchUsers;
        }
      },
    });
    this.fetchMore = this.response.fetchMore;
  }

  ngOnDestroy(): void {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }

  goToProfile(profileId: string): void {
    this.router.navigateByUrl(`/users/profile/${profileId}`);
  }

  invokeFetchMore(): void {
    this.fetchMore(this.users);
  }

  close(): void {
    this.dialogRef.close();
  }
}
