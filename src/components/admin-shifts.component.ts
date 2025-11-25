import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { Shift, ShiftService } from '../services/shift.service';

@Component({
  selector: 'app-admin-shifts',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header [userType]="'admin'"></app-header>

    <div class="shifts-management">
      <div class="container">
        <div class="page-header">
          <h1>Gestão de Plantões</h1>
          <button class="btn btn-secondary" (click)="navigateTo('/admin/dashboard')">
            Voltar ao Dashboard
          </button>
        </div>

        <div class="content-grid">
          <div class="form-section">
            <h2>Publicar Novo Plantão</h2>
            <form (ngSubmit)="publishShift()" class="shift-form">
              <div class="form-group">
                <label for="hospital">Hospital</label>
                <input
                  type="text"
                  id="hospital"
                  [(ngModel)]="newShift.hospital"
                  name="hospital"
                  placeholder="Nome do Hospital"
                  required
                />
              </div>

              <div class="form-group">
                <label for="date">Data</label>
                <input
                  type="date"
                  id="date"
                  [(ngModel)]="newShift.date"
                  name="date"
                  required
                />
              </div>

              <div class="form-group">
                <label for="time">Horário</label>
                <input
                  type="time"
                  id="time"
                  [(ngModel)]="newShift.time"
                  name="time"
                  required
                />
              </div>

              <div class="form-group">
                <label for="specialty">Especialidade</label>
                <select
                  id="specialty"
                  [(ngModel)]="newShift.specialty"
                  name="specialty"
                  required
                >
                  <option value="">Selecione uma especialidade</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Ortopedia">Ortopedia</option>
                  <option value="Emergência">Emergência</option>
                  <option value="Clínica Geral">Clínica Geral</option>
                  <option value="Cirurgia">Cirurgia</option>
                  <option value="Neurologia">Neurologia</option>
                  <option value="Ginecologia">Ginecologia</option>
                </select>
              </div>

              <div class="form-group">
                <label for="value">Valor (R$)</label>
                <input
                  type="number"
                  id="value"
                  [(ngModel)]="newShift.value"
                  name="value"
                  placeholder="1000"
                  min="0"
                  step="50"
                  required
                />
              </div>

              <button type="submit" class="btn btn-primary btn-full">
                Publicar Plantão
              </button>
            </form>
          </div>

          <div class="list-section">
            <h2>Plantões Publicados</h2>

            <div class="filters">
              <button
                class="filter-btn"
                [class.active]="filter === 'all'"
                (click)="setFilter('all')"
              >
                Todos ({{ shifts.length }})
              </button>
              <button
                class="filter-btn"
                [class.active]="filter === 'open'"
                (click)="setFilter('open')"
              >
                Abertos ({{ getOpenCount() }})
              </button>
              <button
                class="filter-btn"
                [class.active]="filter === 'filled'"
                (click)="setFilter('filled')"
              >
                Preenchidos ({{ getFilledCount() }})
              </button>
            </div>

            <div class="shifts-list">
              <div class="shift-card" *ngFor="let shift of getFilteredShifts()">
                <div class="shift-header">
                  <h3>{{ shift.hospital }}</h3>
                  <span [class]="'status-badge status-' + shift.status">
                    {{ shift.status === 'open' ? 'Aberto' : 'Preenchido' }}
                  </span>
                </div>
                <div class="shift-details">
                  <div class="detail-row">
                    <span class="detail-label">📅 Data/Hora:</span>
                    <span>{{ formatDate(shift.date) }} {{ shift.time }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🏥 Especialidade:</span>
                    <span>{{ shift.specialty }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💰 Valor:</span>
                    <span class="value">R$ {{ shift.value }}</span>
                  </div>
                  <div class="detail-row" *ngIf="shift.assignedDoctor">
                    <span class="detail-label">👨‍⚕️ Médico:</span>
                    <span>{{ shift.assignedDoctor }}</span>
                  </div>
                </div>
                <div class="shift-actions">
                  <button class="btn btn-secondary btn-small" (click)="deleteShift(shift.id)">
                    Remover
                  </button>
                </div>
              </div>

              <div class="empty-state" *ngIf="getFilteredShifts().length === 0">
                <p>Nenhum plantão encontrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shifts-management {
      min-height: calc(100vh - 70px);
      background: var(--color-background-alt);
      padding: var(--spacing-lg) 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
      flex-wrap: wrap;
      gap: var(--spacing-md);
    }

    .page-header h1 {
      color: var(--color-text);
      margin: 0;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .form-section, .list-section {
      background: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
    }

    .form-section h2, .list-section h2 {
      margin-bottom: var(--spacing-md);
      color: var(--color-text);
    }

    .shift-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .form-group label {
      font-weight: 600;
      color: var(--color-text);
      font-size: 0.875rem;
    }

    .btn-full {
      width: 100%;
    }

    .filters {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      background: var(--color-background-alt);
      color: var(--color-text);
      border-radius: var(--border-radius);
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .filter-btn:hover {
      background: var(--color-primary-light);
    }

    .filter-btn.active {
      background: var(--color-primary);
      color: white;
    }

    .shifts-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      max-height: 600px;
      overflow-y: auto;
      padding-right: var(--spacing-xs);
    }

    .shift-card {
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      padding: var(--spacing-md);
      transition: all 0.3s ease;
    }

    .shift-card:hover {
      box-shadow: var(--shadow-sm);
      border-color: var(--color-primary);
    }

    .shift-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
      gap: var(--spacing-sm);
    }

    .shift-header h3 {
      margin: 0;
      color: var(--color-text);
      font-size: 1.1rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-open {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-filled {
      background: #e8f5e9;
      color: #388e3c;
    }

    .shift-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      margin-bottom: var(--spacing-md);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }

    .detail-label {
      color: var(--color-text-light);
      font-weight: 500;
    }

    .value {
      color: var(--color-primary);
      font-weight: 600;
      font-size: 1rem;
    }

    .shift-actions {
      display: flex;
      gap: var(--spacing-sm);
      padding-top: var(--spacing-sm);
      border-top: 1px solid var(--color-border);
    }

    .shift-actions button {
      flex: 1;
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-xl) 0;
      color: var(--color-text-light);
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .page-header button {
        width: 100%;
      }

      .shift-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
    }
  `]
})
export class AdminShiftsComponent implements OnInit {
  newShift = {
    hospital: '',
    date: '',
    time: '',
    specialty: '',
    value: 0
  };

  filter: 'all' | 'open' | 'filled' = 'all';
  shifts: Shift[] = [];

  constructor(
    private router: Router,
    private shiftService: ShiftService
  ) { }

  ngOnInit() {
    this.shiftService.shifts$.subscribe(shifts => {
      this.shifts = shifts;
    });
  }

  publishShift() {
    if (this.newShift.hospital && this.newShift.date && this.newShift.time && this.newShift.specialty && this.newShift.value) {
      this.shiftService.addShift(this.newShift);

      this.newShift = {
        hospital: '',
        date: '',
        time: '',
        specialty: '',
        value: 0
      };

      alert('Plantão publicado com sucesso!');
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  setFilter(filter: 'all' | 'open' | 'filled') {
    this.filter = filter;
  }

  getFilteredShifts(): Shift[] {
    if (this.filter === 'all') return this.shifts;
    return this.shifts.filter(shift => shift.status === this.filter);
  }

  getOpenCount(): number {
    return this.shifts.filter(shift => shift.status === 'open').length;
  }

  getFilledCount(): number {
    return this.shifts.filter(shift => shift.status === 'filled').length;
  }

  deleteShift(id: number) {
    if (confirm('Tem certeza que deseja remover este plantão?')) {
      this.shiftService.deleteShift(id);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
