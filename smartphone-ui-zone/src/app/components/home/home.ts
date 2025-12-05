import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { PENDING_SMARTPHONE_ACTION_KEY } from '../../constants/storage-keys';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private router: Router, private loginService: LoginService) {}

  onAddSmartphoneClick(): void {
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/smartphones'], {
        queryParams: { action: 'add' },
      });
      return;
    }

    sessionStorage.setItem(
      PENDING_SMARTPHONE_ACTION_KEY,
      JSON.stringify({ type: 'add' })
    );
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/smartphones' },
    });
  }
}
