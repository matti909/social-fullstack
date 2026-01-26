import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterResponse } from '../../../shared/types/auth';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup implements OnDestroy {
  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password2: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  errorMessage: string = '';
  private registerSubscription: Subscription | null = null;

  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnDestroy(): void {
    if (this.registerSubscription) {
      this.registerSubscription.unsubscribe();
    }
  }

  submit() {
    const { fullName, username, email, password, password2 } = this.form.value;

    if (password !== password2) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (!this.form.valid) {
      this.errorMessage = 'Please enter valid information';
      return;
    }

    this.registerSubscription = this.authService.register(fullName, username, email, password).subscribe({
      next: (result: RegisterResponse | null | undefined) => {
        const savedUserId = result?.register.user.id;
        this.snackBar.open('Signup Success!', 'Ok', {
          duration: 5 * 1000,
        });
        if (savedUserId) {
          this.router.navigateByUrl(`/users/profile/${savedUserId}`);
        }
      },
      error: (err) => {
        console.error(err.message);
        this.errorMessage = err.message;
        this.snackBar.open(err.message, 'Ok', {
          duration: 5 * 1000,
        });
      },
    });
  }
}
