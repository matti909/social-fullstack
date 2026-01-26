import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { User } from '@ngsocial/graphql/types';
import { PostEvent } from '../../types';

@Component({
  selector: 'app-create-post',
  imports: [MatCardModule, MatProgressBarModule, MatInputModule, MatButtonModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {
  authUser = input.required<Partial<User>>();
  loading = input<boolean>(false);
  post = output<PostEvent>();
  postText = viewChild.required<ElementRef>('postText');

  imageFile: File | null = null;

  get userFirstName() {
    return this.authUser()?.fullName?.split(' ')?.shift();
  }
  onFileSelected(event: Event): void {
    const files: FileList = (event.target as HTMLInputElement).files!;
    console.log(files);
    if (files.length > 0) {
      this.imageFile = files[0];
    }
  }

  handlePostClick(): void {
    if (this.authUser()?.id) {
      this.post.emit({
        text: this.postText()?.nativeElement.value,
        image: this.imageFile as File,
      });
    }
    if (this.postText().nativeElement) {
      this.postText().nativeElement.value = '';
    }
    this.imageFile = null;
  }
}
