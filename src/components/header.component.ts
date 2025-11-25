import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo" (click)="navigateTo('/')">
            <h2>SyncMed</h2>
          </div>
          <nav class="nav" [class.show]="mobileMenuOpen">
            <ng-container *ngIf="userType === 'guest'">
              <button class="btn btn-secondary btn-small" (click)="navigateTo('/login')">Login</button>
              <button class="btn btn-primary btn-small" (click)="navigateTo('/register')">Cadastro</button>
            </ng-container>
            <ng-container *ngIf="userType === 'admin'">
              <a (click)="navigateTo('/admin/dashboard')">Dashboard</a>
              <a (click)="navigateTo('/admin/shifts')">Plantões</a>
              <button class="btn btn-secondary btn-small" (click)="logout()">Sair</button>
            </ng-container>
            <ng-container *ngIf="userType === 'doctor'">
              <a (click)="navigateTo('/doctor/dashboard')">Dashboard</a>
              <a (click)="navigateTo('/doctor/schedule')">Minha Agenda</a>
              <a (click)="navigateTo('/doctor/marketplace')">Marketplace</a>
              <button class="btn btn-secondary btn-small" (click)="logout()">Sair</button>
            </ng-container>
          </nav>
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: var(--spacing-sm) 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-md);
    }

    .logo {
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    .logo h2 {
      color: var(--color-primary);
      margin: 0;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .nav a {
      color: var(--color-text);
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .nav a:hover {
      color: var(--color-primary);
    }

    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: transparent;
      padding: 0.5rem;
    }

    .mobile-menu-btn span {
      width: 25px;
      height: 3px;
      background: var(--color-text);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: flex;
      }

      .nav {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: var(--spacing-md);
        box-shadow: var(--shadow-md);
        display: none;
      }

      .nav.show {
        display: flex;
      }

      .nav a, .nav button {
        width: 100%;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() userType: 'guest' | 'admin' | 'doctor' = 'guest';
  mobileMenuOpen = false;

  constructor(private router: Router) { }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  navigateTo(route: string) {
    this.mobileMenuOpen = false;
    this.router.navigate([route]);
  }

  logout() {
    this.mobileMenuOpen = false;
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
