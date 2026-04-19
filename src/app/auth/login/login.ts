import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form: FormGroup;
  showPassword = false;
  errorMessage = '';

  constructor() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  get username() {
    return this.form.get('username')!;
  }
  get password() {
    return this.form.get('password')!;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth
      .login({
        username: this.username.value,
        password: this.password.value,
      })
      .subscribe({
        next: (res) => {
          console.log('logged in', res);
          this.router.navigate(['/dashboard']);
        },
        error: (err: Error) => {
          this.errorMessage = err.message;
          this.form.get('password')?.reset();
        },
      });
  }
}
