import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  showFallback = false;
  imageLoaded = false;

  constructor(private loginService: LoginService, private router: Router) {}

  /**
   * Check if user is currently logged in
   * @returns boolean indicating login status
   */
  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  /**
   * Handle logout functionality
   */
  onLogout(): void {
    this.loginService.logout();
    this.router.navigate(['/']);
  }

  /**
   * Handle image load error
   */
  onImageError(event: any): void {
    event.target.style.display = 'none';
    this.showFallback = true;
    this.imageLoaded = false;
  }

  /**
   * Handle successful image load
   */
  onImageLoad(): void {
    this.imageLoaded = true;
    this.showFallback = false;
  }
}
