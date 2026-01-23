import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginResponse } from '../../../shared/types/auth';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  errorMessage: string = '';
  private loginSubscription: Subscription | null = null;

  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  submit() {
    const { email, password } = this.form.value;
    if (!this.form.valid) {
      this.errorMessage = 'Please enter valid email and password';
      return;
    }
    this.loginSubscription = this.authService.login(email, password).subscribe({
      next: (result: LoginResponse | null | undefined) => {
        if (result) {
          const savedUserId = result.signIn.user?.id;
          this.snackBar.open('Login Success!', 'Ok', {
            duration: 5 * 1000,
          });
          this.router.navigateByUrl(`/users/profile/${savedUserId}`);
        }
      },
      error: (err) => {
        console.error(err.message);
        this.snackBar.open(err.message, 'Ok', {
          duration: 5 * 1000,
        });
      },
    });
  }
}
