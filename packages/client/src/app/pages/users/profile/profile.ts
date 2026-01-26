import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfileService } from './services/profile.service';
import { User } from '@ngsocial/graphql/types';
import { Subject } from 'rxjs';
import { BaseComponent } from '../../../core/components/base.component';
import { CreatePost } from '../../../shared/components/create-post/create-post';
import { Post as PostComponent } from '../../../shared/components/post/post';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, CreatePost, PostComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile extends BaseComponent {
  private destroyNotifier: Subject<boolean> = new Subject();
  @ViewChild('bioInput') bioInput: ElementRef | null = null;
  profileUser: Partial<User> | null = null;
  showEditSection: boolean = false;
  isAuthUserProfile: boolean = false;
  fetchMore!: () => void;

  route = inject(ActivatedRoute);
  profileService = inject(ProfileService);

  constructor() {
    super();
  }

  set bioInputValue(value: string) {
    this.bioInput!.nativeElement.value = value;
  }

  get bioInputValue() {
    return this.bioInput!.nativeElement.value;
  }
  get userFirstName() {
    return this.profileUser?.fullName?.split(' ')?.shift();
  }

  enableDisableEditing(): void {
    this.showEditSection = !this.showEditSection;
    if (this.showEditSection && this.profileUser?.bio) {
      this.bioInputValue = this.profileUser.bio;
    }
  }

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.profileService.setUserCover(file).subscribe({
        next: () => this.displayMessage('Cover updated.'),
        error: (err: Error) => this.handleErrors(err),
      });
    }
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.profileService.setUserPhoto(file).subscribe({
        next: () => this.displayMessage('Photo updated.'),
        error: (err: Error) => this.handleErrors(err),
      });
    }
  }

  setBio(): void {
    const bio = this.bioInputValue;
    if (bio) {
      this.profileService.setUserBio(bio).subscribe({
        next: () => {
          this.displayMessage('Bio updated.');
          if (this.profileUser) {
            this.profileUser.bio = bio;
          }
        },
        error: (err: Error) => this.handleErrors(err),
      });
    }
  }
}
