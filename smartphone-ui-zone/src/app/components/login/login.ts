import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { ILogin } from '../../Models/login/ILogin';
import { ILoginResponse } from '../../Models/login/ILoginResponse';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginData: ILogin = {
    email: '',
    password: '',
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  returnUrl = '/smartphones';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return URL from query parameters, default to '/products'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/smartphones';

    // If user is already logged in, redirect to return URL
    if (this.loginService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(loginForm: any) {
    if (loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.loginService.login(this.loginData).subscribe({
        next: (response: ILoginResponse) => {
          this.isLoading = false;
          this.successMessage = 'Login successful!';

          // Store the token if provided
          if (response.accessToken) {
            this.loginService.setAuthToken(response.accessToken);
          }

          // Navigate to return URL after successful login
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage =
            error.error?.message ||
            'Login failed. Please check your credentials.';
          console.error('Login error:', error);
        },
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  onReset(loginForm: any) {
    loginForm.resetForm();
    this.loginData = {
      email: '',
      password: '',
    };
    this.errorMessage = '';
    this.successMessage = '';
  }
}
