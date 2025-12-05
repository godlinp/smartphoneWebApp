import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionExpirationService {
  private sessionExpiredSubject = new Subject<boolean>();
  sessionExpired$ = this.sessionExpiredSubject.asObservable();
  private isModalShowing = false;

  /**
   * Trigger session expiration alert
   */
  triggerSessionExpired(): void {
    this.sessionExpiredSubject.next(true);
  }

  /**
   * Show session expired alert
   */
  showSessionExpiredAlert(onLogout: () => void): void {
    // Prevent multiple modals from showing
    if (this.isModalShowing) {
      return;
    }

    this.isModalShowing = true;
    const alertMessage = 'Your session has expired. Please click Logout to continue.';
    
    // Create and show Bootstrap alert modal
    const alertHtml = `
      <div class="modal fade show" id="sessionExpiredModal" tabindex="-1" style="display: block;" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-warning">
              <h5 class="modal-title">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>Session Expired
              </h5>
            </div>
            <div class="modal-body">
              <p class="mb-0">${alertMessage}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="sessionExpiredLogoutBtn">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show"></div>
    `;

    // Remove any existing modal
    const existingModal = document.getElementById('sessionExpiredModal');
    if (existingModal) {
      existingModal.remove();
    }
    const existingBackdrop = document.querySelector('.modal-backdrop');
    if (existingBackdrop) {
      existingBackdrop.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', alertHtml);

    // Add event listener for logout button
    const logoutBtn = document.getElementById('sessionExpiredLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.closeSessionExpiredAlert();
        onLogout();
      });
    }
  }

  /**
   * Close session expired alert
   */
  closeSessionExpiredAlert(): void {
    this.isModalShowing = false;
    const modal = document.getElementById('sessionExpiredModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.remove();
    }
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }
}
