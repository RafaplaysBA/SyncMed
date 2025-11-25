import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  template: `
    <app-header [userType]="'guest'"></app-header>
    
    <div class="auth-container">
      <div class="auth-card">
        <h2>Crie sua conta</h2>
        <p class="auth-subtitle">Junte-se ao SyncMed hoje mesmo</p>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Nome Completo</label>
            <input 
              id="name" 
              type="text" 
              formControlName="name" 
              placeholder="Dr. João Silva"
              [class.error]="isFieldInvalid('name')"
            >
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              placeholder="seu@email.com"
              [class.error]="isFieldInvalid('email')"
            >
          </div>

          <div class="form-group">
            <label for="userType">Eu sou</label>
            <select id="userType" formControlName="userType">
              <option value="doctor">Médico</option>
              <option value="admin">Coordenador/Hospital</option>
            </select>
          </div>

          <div class="form-group" *ngIf="registerForm.get('userType')?.value === 'doctor'">
            <label for="specialty">Especialidade</label>
            <input 
              id="specialty" 
              type="text" 
              formControlName="specialty" 
              placeholder="Ex: Cardiologia"
            >
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
          </div>

          <button type="submit" class="btn btn-primary btn-full" [disabled]="registerForm.invalid || isLoading">
            {{ isLoading ? 'Criando conta...' : 'Criar Conta' }}
          </button>

          <div class="auth-footer">
            Já tem uma conta? <a (click)="navigateTo('/login')">Fazer Login</a>
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

    input, select {
      width: 100%;
    }

    input.error {
      border-color: var(--color-error);
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userType: ['doctor', Validators.required],
      specialty: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { email, name, userType } = this.registerForm.value;

      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify({
          email,
          type: userType,
          name
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
