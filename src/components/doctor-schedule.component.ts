import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';

interface ScheduleShift {
  id: number;
  date: string;
  dayOfWeek: string;
  hospital: string;
  time: string;
  specialty: string;
  value: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header [userType]="'doctor'"></app-header>

    <div class="schedule">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>Minha Agenda</h1>
            <p class="subtitle">Visualize todos os seus plantões agendados</p>
          </div>
          <button class="btn btn-secondary" (click)="navigateTo('/doctor/dashboard')">
            Voltar ao Dashboard
          </button>
        </div>

        <div class="schedule-stats">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <div class="stat-value">{{ getTotalShifts() }}</div>
              <div class="stat-label">Total de Plantões</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-value">{{ getUpcomingCount() }}</div>
              <div class="stat-label">Próximos</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-value">{{ getCompletedCount() }}</div>
              <div class="stat-label">Concluídos</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-value">R$ {{ getTotalValue() }}</div>
              <div class="stat-label">Total Ganhos</div>
            </div>
          </div>
        </div>

        <div class="filters">
          <button
            class="filter-btn"
            [class.active]="filter === 'all'"
            (click)="setFilter('all')"
          >
            Todos
          </button>
          <button
            class="filter-btn"
            [class.active]="filter === 'upcoming'"
            (click)="setFilter('upcoming')"
          >
            Próximos
          </button>
          <button
            class="filter-btn"
            [class.active]="filter === 'completed'"
            (click)="setFilter('completed')"
          >
            Concluídos
          </button>
        </div>

        <div class="calendar-view">
          <div class="month-navigation">
            <button class="nav-btn" (click)="previousMonth()">‹</button>
            <h2>{{ currentMonth }}</h2>
            <button class="nav-btn" (click)="nextMonth()">›</button>
          </div>

          <div class="schedule-list">
            <div class="schedule-card" *ngFor="let shift of getFilteredShifts()">
              <div class="schedule-date">
                <div class="date-day">{{ getDay(shift.date) }}</div>
                <div class="date-info">
                  <div class="date-month">{{ getMonthName(shift.date) }}</div>
                  <div class="date-weekday">{{ shift.dayOfWeek }}</div>
                </div>
              </div>

              <div class="schedule-details">
                <div class="schedule-header">
                  <h3>{{ shift.hospital }}</h3>
                  <span [class]="'status-badge status-' + shift.status">
                    {{ getStatusLabel(shift.status) }}
                  </span>
                </div>

                <div class="schedule-info">
                  <div class="info-item">
                    <span class="info-icon">🕐</span>
                    <span>{{ shift.time }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-icon">🏥</span>
                    <span>{{ shift.specialty }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-icon">💰</span>
                    <span class="value">R$ {{ shift.value }}</span>
                  </div>
                </div>

                <div class="schedule-actions" *ngIf="shift.status === 'upcoming'">
                  <button class="btn btn-secondary btn-small" (click)="viewDetails(shift.id)">
                    Ver Detalhes
                  </button>
                  <button class="btn btn-secondary btn-small cancel-btn" (click)="cancelShift(shift.id)">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>

            <div class="empty-state" *ngIf="getFilteredShifts().length === 0">
              <p>Nenhum plantão encontrado</p>
              <button class="btn btn-primary" (click)="navigateTo('/doctor/marketplace')">
                Buscar Plantões
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .schedule {
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
      margin: 0 0 var(--spacing-xs) 0;
    }

    .subtitle {
      color: var(--color-text-light);
      margin: 0;
    }

    .schedule-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .stat-card {
      background: white;
      padding: var(--spacing-md);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: bold;
      color: var(--color-primary);
      margin-bottom: var(--spacing-xs);
    }

    .stat-label {
      color: var(--color-text-light);
      font-size: 0.875rem;
    }

    .filters {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1.5rem;
      background: white;
      color: var(--color-text);
      border-radius: var(--border-radius);
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-sm);
    }

    .filter-btn:hover {
      background: var(--color-primary-light);
    }

    .filter-btn.active {
      background: var(--color-primary);
      color: white;
    }

    .calendar-view {
      background: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
    }

    .month-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md);
      border-bottom: 2px solid var(--color-border);
    }

    .month-navigation h2 {
      margin: 0;
      color: var(--color-text);
    }

    .nav-btn {
      background: var(--color-primary);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .nav-btn:hover {
      background: var(--color-primary-dark);
      transform: scale(1.1);
    }

    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .schedule-card {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      transition: all 0.3s ease;
    }

    .schedule-card:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-sm);
    }

    .schedule-date {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
      padding: var(--spacing-sm);
      background: var(--color-primary);
      color: white;
      border-radius: var(--border-radius);
      min-width: 100px;
    }

    .date-day {
      font-size: 2rem;
      font-weight: bold;
    }

    .date-info {
      display: flex;
      flex-direction: column;
    }

    .date-month {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .date-weekday {
      font-size: 0.75rem;
      opacity: 0.9;
    }

    .schedule-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .schedule-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .schedule-header h3 {
      margin: 0;
      color: var(--color-text);
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-upcoming {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-completed {
      background: #e8f5e9;
      color: #388e3c;
    }

    .status-cancelled {
      background: #ffebee;
      color: #d32f2f;
    }

    .schedule-info {
      display: flex;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-text-light);
      font-size: 0.9rem;
    }

    .info-icon {
      font-size: 1rem;
    }

    .value {
      color: var(--color-primary);
      font-weight: 600;
    }

    .schedule-actions {
      display: flex;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-xs);
    }

    .cancel-btn:hover {
      background: var(--color-error);
      color: white;
      border-color: var(--color-error);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-xl) 0;
    }

    .empty-state p {
      color: var(--color-text-light);
      margin-bottom: var(--spacing-md);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .page-header button {
        width: 100%;
      }

      .schedule-card {
        flex-direction: column;
      }

      .schedule-date {
        width: 100%;
        justify-content: center;
      }

      .schedule-actions {
        flex-direction: column;
      }

      .schedule-actions button {
        width: 100%;
      }
    }
  `]
})
export class DoctorScheduleComponent {
  currentMonth = 'Novembro 2025';
  filter: 'all' | 'upcoming' | 'completed' = 'all';

  shifts: ScheduleShift[] = [
    { id: 1, date: '2025-11-25', dayOfWeek: 'Segunda', hospital: 'Hospital São Lucas', time: '08:00 - 20:00', specialty: 'Cardiologia', value: 1200, status: 'upcoming' },
    { id: 2, date: '2025-11-27', dayOfWeek: 'Quarta', hospital: 'Hospital Central', time: '14:00 - 22:00', specialty: 'Emergência', value: 1500, status: 'upcoming' },
    { id: 3, date: '2025-11-29', dayOfWeek: 'Sexta', hospital: 'Clínica Santa Maria', time: '08:00 - 16:00', specialty: 'Cardiologia', value: 1000, status: 'upcoming' },
    { id: 4, date: '2025-11-23', dayOfWeek: 'Sábado', hospital: 'Hospital São Lucas', time: '20:00 - 08:00', specialty: 'Emergência', value: 1800, status: 'completed' },
    { id: 5, date: '2025-11-20', dayOfWeek: 'Quarta', hospital: 'Hospital Central', time: '08:00 - 18:00', specialty: 'Cardiologia', value: 1200, status: 'completed' },
    { id: 6, date: '2025-11-18', dayOfWeek: 'Segunda', hospital: 'Clínica Santa Maria', time: '14:00 - 22:00', specialty: 'Clínica Geral', value: 900, status: 'completed' }
  ];

  constructor(private router: Router) {}

  setFilter(filter: 'all' | 'upcoming' | 'completed') {
    this.filter = filter;
  }

  getFilteredShifts(): ScheduleShift[] {
    if (this.filter === 'all') return this.shifts;
    return this.shifts.filter(shift => shift.status === this.filter);
  }

  getTotalShifts(): number {
    return this.shifts.length;
  }

  getUpcomingCount(): number {
    return this.shifts.filter(shift => shift.status === 'upcoming').length;
  }

  getCompletedCount(): number {
    return this.shifts.filter(shift => shift.status === 'completed').length;
  }

  getTotalValue(): number {
    return this.shifts.reduce((sum, shift) => sum + shift.value, 0);
  }

  getDay(dateString: string): string {
    const date = new Date(dateString);
    return date.getDate().toString().padStart(2, '0');
  }

  getMonthName(dateString: string): string {
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const date = new Date(dateString);
    return months[date.getMonth()];
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'upcoming': 'Próximo',
      'completed': 'Concluído',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  }

  previousMonth() {
    console.log('Previous month');
  }

  nextMonth() {
    console.log('Next month');
  }

  viewDetails(id: number) {
    console.log('View details:', id);
  }

  cancelShift(id: number) {
    if (confirm('Tem certeza que deseja cancelar este plantão?')) {
      const shift = this.shifts.find(s => s.id === id);
      if (shift) shift.status = 'cancelled';
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
