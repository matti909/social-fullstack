import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../services';
import {
  AuthState,
  SearchUsersResponse,
  User,
  UsersResponse,
} from 'src/app/shared';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.authState
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (authState: AuthState) => {
          this.isLoggedIn = authState.isLoggedIn;
          this.authUser = authState.currentUser;
          this.changeDetectorRef.markForCheck();
        },
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

  searchUsers(): void {
    const searchText = this.searchInput?.nativeElement.value;
    if (searchText == '') {
      this.snackBar.open('Please enter a search term', 'Ok', {
        duration: 5 * 1000,
      });
      return;
    }
    const result: SearchUsersResponse = this.authService.searchUsers(
      searchText,
      0,
      10
    );
    const dialogConfig = new MatDialogConfig<SearchUsersResponse>();
    dialogConfig.data = result;

    result.data.pipe(first()).subscribe((data: UsersResponse) => {
      if (data.searchUsers.length > 0)
        this.matDialog.open(SearchDialogComponent, dialogConfig);
      else {
        this.snackBar.open('No users found with this search term', 'Ok', {
          duration: 5 * 1000,
        });
      }
    });
  }
}
