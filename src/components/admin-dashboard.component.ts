import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { Shift, ShiftService } from '../services/shift.service';

interface MetricCard {
  title: string;
  value: number;
  icon: string;
  trend?: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header [userType]="'admin'"></app-header>

    <div class="dashboard">
      <div class="container">
        <div class="dashboard-header">
          <h1>Dashboard Administrativo</h1>
          <button class="btn btn-primary" (click)="navigateTo('/admin/shifts')">
            Publicar Novo Plantão
          </button>
        </div>

        <div class="metrics-grid">
          <div class="metric-card" *ngFor="let metric of metrics">
            <div class="metric-icon">{{ metric.icon }}</div>
            <div class="metric-content">
              <h3>{{ metric.title }}</h3>
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-trend" *ngIf="metric.trend">{{ metric.trend }}</div>
            </div>
          </div>
        </div>

        <div class="dashboard-section">
          <h2>Plantões Recentes</h2>
          <div class="shifts-table">
            <div class="table-header">
              <div>Hospital</div>
              <div>Data/Hora</div>
              <div>Especialidade</div>
              <div>Valor</div>
              <div>Status</div>
            </div>
            <div class="table-row" *ngFor="let shift of recentShifts">
              <div class="shift-hospital">{{ shift.hospital }}</div>
              <div class="shift-datetime">{{ formatDate(shift.date) }} {{ shift.time }}</div>
              <div class="shift-specialty">{{ shift.specialty }}</div>
              <div class="shift-value">R$ {{ shift.value }}</div>
              <div class="shift-status">
                <span [class]="'status-badge status-' + shift.status">
                  {{ shift.status === 'open' ? 'Aberto' : 'Preenchido' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-section">
          <h2>Médicos em Lista de Espera</h2>
          <div class="waiting-list">
            <div class="waiting-card" *ngFor="let doctor of waitingDoctors">
              <div class="doctor-info">
                <h4>{{ doctor.name }}</h4>
                <p>{{ doctor.specialty }}</p>
                <p class="doctor-email">{{ doctor.email }}</p>
              </div>
              <div class="doctor-actions">
                <button class="btn btn-primary btn-small" (click)="approveDoctor(doctor.id)">
                  Aprovar
                </button>
                <button class="btn btn-secondary btn-small" (click)="rejectDoctor(doctor.id)">
                  Recusar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: calc(100vh - 70px);
      background: var(--color-background-alt);
      padding: var(--spacing-lg) 0;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
      flex-wrap: wrap;
      gap: var(--spacing-md);
    }

    .dashboard-header h1 {
      color: var(--color-text);
      margin: 0;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .metric-card {
      background: white;
      padding: var(--spacing-md);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      display: flex;
      gap: var(--spacing-md);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .metric-icon {
      font-size: 2.5rem;
      display: flex;
      align-items: center;
    }

    .metric-content {
      flex: 1;
    }

    .metric-content h3 {
      font-size: 0.875rem;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-xs);
      font-weight: 500;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      color: var(--color-text);
      margin-bottom: var(--spacing-xs);
    }

    .metric-trend {
      font-size: 0.875rem;
      color: var(--color-success);
    }

    .dashboard-section {
      background: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--spacing-lg);
    }

    .dashboard-section h2 {
      margin-bottom: var(--spacing-md);
      color: var(--color-text);
    }

    .shifts-table {
      overflow-x: auto;
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr;
      gap: var(--spacing-md);
      padding: var(--spacing-sm);
      background: var(--color-background-alt);
      border-radius: var(--border-radius);
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: var(--spacing-sm);
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--color-border);
      align-items: center;
      transition: background 0.3s ease;
    }

    .table-row:hover {
      background: var(--color-background-alt);
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      display: inline-block;
    }

    .status-open {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-filled {
      background: #e8f5e9;
      color: #388e3c;
    }

    .waiting-list {
      display: grid;
      gap: var(--spacing-md);
    }

    .waiting-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      background: var(--color-background-alt);
      border-radius: var(--border-radius);
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .doctor-info h4 {
      margin-bottom: var(--spacing-xs);
      color: var(--color-text);
    }

    .doctor-info p {
      margin: 0;
      color: var(--color-text-light);
      font-size: 0.875rem;
    }

    .doctor-email {
      color: var(--color-primary);
    }

    .doctor-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .dashboard-header button {
        width: 100%;
      }

      .table-header, .table-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-xs);
      }

      .table-header {
        display: none;
      }

      .table-row > div::before {
        content: attr(data-label);
        font-weight: 600;
        display: inline-block;
        margin-right: var(--spacing-xs);
      }

      .waiting-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .doctor-actions {
        width: 100%;
      }

      .doctor-actions button {
        flex: 1;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  metrics: MetricCard[] = [];
  recentShifts: Shift[] = [];

  waitingDoctors = [
    { id: 1, name: 'Dr. Carlos Silva', specialty: 'Cardiologia', email: 'carlos.silva@email.com' },
    { id: 2, name: 'Dra. Maria Santos', specialty: 'Pediatria', email: 'maria.santos@email.com' },
    { id: 3, name: 'Dr. João Oliveira', specialty: 'Ortopedia', email: 'joao.oliveira@email.com' }
  ];

  constructor(
    private router: Router,
    private shiftService: ShiftService
  ) { }

  ngOnInit() {
    this.shiftService.shifts$.subscribe(shifts => {
      this.recentShifts = shifts.slice(0, 5);
      this.updateMetrics(shifts);
    });
  }

  updateMetrics(shifts: Shift[]) {
    const totalShifts = shifts.length;
    const filledShifts = shifts.filter(s => s.status === 'filled').length;
    const fillRate = totalShifts > 0 ? Math.round((filledShifts / totalShifts) * 100) : 0;

    this.metrics = [
      { title: 'Total de Médicos', value: 48, icon: '👨‍⚕️', trend: '+5 este mês' },
      { title: 'Médicos em Espera', value: this.waitingDoctors.length, icon: '⏳', trend: 'Aguardando aprovação' },
      { title: 'Plantões Ativos', value: totalShifts, icon: '📋', trend: `+${shifts.length} total` },
      { title: 'Taxa de Preenchimento', value: fillRate, icon: '✅', trend: `${fillRate}%` }
    ];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  approveDoctor(id: number) {
    console.log('Approving doctor:', id);
    this.waitingDoctors = this.waitingDoctors.filter(d => d.id !== id);
    this.updateMetrics(this.shiftService.getShifts());
  }

  rejectDoctor(id: number) {
    console.log('Rejecting doctor:', id);
    this.waitingDoctors = this.waitingDoctors.filter(d => d.id !== id);
    this.updateMetrics(this.shiftService.getShifts());
  }
}
