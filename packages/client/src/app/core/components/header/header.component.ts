import { Component, OnInit, ElementRef, ViewChild, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User, SearchUsersResponse, UsersResponse, AuthState } from 'src/app/shared';
import { AuthService } from 'src/app/core';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('searchInput') searchInput: ElementRef | null = null;

  public isLoggedIn: boolean = false;
  public authUser: User | null = null;
  private destroyNotifier$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public authService: AuthService,
    public matDialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.authService.authState
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (authState: AuthState) => {
          this.isLoggedIn = authState.isLoggedIn;
          this.authUser = authState.currentUser;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyNotifier$.next(true);
    this.destroyNotifier$.complete();
  }

  logOut(): void {
    this.authService.logOut();
    this.router.navigateByUrl('/users/login');
  }

}