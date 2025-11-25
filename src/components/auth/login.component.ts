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
        <h2>Bem-vindo de volta</h2>
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
            >
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
            >
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

          <div class="auth-footer">
            Não tem uma conta? <a (click)="navigateTo('/register')">Cadastre-se</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-background-alt);
      padding: var(--spacing-md);
    }

    .auth-card {
      background: white;
      padding: var(--spacing-xl);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-md);
      width: 100%;
      max-width: 450px;
    }

    h2 {
      text-align: center;
      color: var(--color-primary);
      margin-bottom: var(--spacing-xs);
    }

    .auth-subtitle {
      text-align: center;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-lg);
    }

    .form-group {
      margin-bottom: var(--spacing-md);
    }

    label {
      display: block;
      margin-bottom: var(--spacing-xs);
      color: var(--color-text);
      font-weight: 500;
    }

    input {
      width: 100%;
    }

    input.error {
      border-color: var(--color-error);
    }

    .error-message {
      color: var(--color-error);
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: var(--spacing-md);
    }

    .forgot-password {
      color: var(--color-primary);
      text-decoration: none;
      font-size: 0.875rem;
    }

    .btn-full {
      width: 100%;
      margin-bottom: var(--spacing-md);
    }

    .auth-footer {
      text-align: center;
      font-size: 0.875rem;
      color: var(--color-text-light);
    }

    .auth-footer a {
      color: var(--color-primary);
      cursor: pointer;
      font-weight: 600;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
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

      // Simulação de Login
      setTimeout(() => {
        // Lógica simples para demo: admin@syncmed.com vira admin, outros viram doctor
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
