import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  template: `
    <app-header [userType]="'guest'"></app-header>
    <div class="auth-container">
      <div class="auth-card">
        <div class="icon-wrapper">
          <!-- Inline SVG medical user icon -->
          <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#68ddbd" />
                <stop offset="100%" stop-color="#4bc9a6" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="30" fill="url(#grad)" />
            <path d="M32 18a8 8 0 110 16 8 8 0 010-16zm0 22c-10 0-18 5-18 12v4h36v-4c0-7-8-12-18-12z" fill="#fff" />
          </svg>
        </div>
        <h2>Bem‑vindo de volta</h2>
        <p class="auth-subtitle">Acesse sua conta para gerenciar plantões</p>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="seu@email.com"
              [class.error]="isFieldInvalid('email')"
            />
            <div class="error-message" *ngIf="isFieldInvalid('email')">
              Email inválido
            </div>
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              [class.error]="isFieldInvalid('password')"
            />
            <div class="error-message" *ngIf="isFieldInvalid('password')">
              Senha é obrigatória
            </div>
          </div>

          <div class="form-actions">
            <a href="#" class="forgot-password">Esqueceu a senha?</a>
          </div>

          <button type="submit" class="btn btn-primary btn-full" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        <div class="lgpd-notice">
          Ao continuar, você concorda com nossa <a href="/lgpd" target="_blank">Política de Privacidade</a>.
        </div>
        <div class="auth-footer">
          Não tem uma conta? <a (click)="navigateTo('/register')">Cadastre‑se</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f4f8; /* Light blue/lavender background */
      padding: var(--spacing-md);
    }

    .auth-card {
      background: white; /* Solid white background */
      padding: var(--spacing-xl);
      border-radius: 24px; /* More rounded corners */
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); /* Soft, large shadow */
      width: 100%;
      max-width: 420px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }

    .icon-wrapper {
      margin-bottom: var(--spacing-md);
    }

    h2 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-xs);
      font-size: 1.75rem;
    }

    .auth-subtitle {
      color: var(--color-text-light);
      margin-bottom: var(--spacing-lg);
      font-size: 0.95rem;
    }

    .form-group {
      margin-bottom: var(--spacing-md);
      text-align: left;
    }

    label {
      display: block;
      margin-bottom: var(--spacing-xs);
      color: var(--color-text);
      font-weight: 600;
      font-size: 0.9rem;
    }

    input {
      width: 100%;
      padding: 0.875rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      transition: all 0.3s ease;
      background: #f8fafc;
    }

    input:focus {
      background: white;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(104, 221, 189, 0.1);
    }

    input.error {
      border-color: var(--color-error);
      background: #fff5f5;
    }

    .error-message {
      color: var(--color-error);
      font-size: 0.8rem;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: var(--spacing-md);
    }

    .forgot-password {
      color: var(--color-text-light);
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.3s ease;
    }

    .forgot-password:hover {
      color: var(--color-primary);
    }

    .btn-full {
      width: 100%;
      margin-bottom: var(--spacing-md);
      padding: 1rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(104, 221, 189, 0.3);
    }

    .btn-full:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(104, 221, 189, 0.4);
    }

    .lgpd-notice {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: var(--spacing-lg);
      line-height: 1.4;
    }

    .lgpd-notice a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 600;
    }

    .lgpd-notice a:hover {
      text-decoration: underline;
    }

    .auth-footer {
      text-align: center;
      font-size: 0.9rem;
      color: var(--color-text-light);
      margin-top: var(--spacing-md);
    }

    .auth-footer a {
      color: var(--color-primary);
      cursor: pointer;
      font-weight: 700;
      text-decoration: none;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email } = this.loginForm.value;
      setTimeout(() => {
        const userType = email.includes('admin') ? 'admin' : 'doctor';
        localStorage.setItem('user', JSON.stringify({
          email,
          type: userType,
          name: userType === 'admin' ? 'Administrador' : 'Dr. Fernando'
        }));
        this.isLoading = false;
        this.router.navigate([userType === 'admin' ? '/admin/dashboard' : '/doctor/dashboard']);
      }, 1000);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
