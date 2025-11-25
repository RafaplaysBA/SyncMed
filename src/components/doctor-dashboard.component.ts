import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { Shift, ShiftService } from '../services/shift.service';

interface FinancialSummary {
  title: string;
  value: string;
  icon: string;
  subtitle?: string;
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header [userType]="'doctor'"></app-header>

    <div class="dashboard">
      <div class="container">
        <div class="dashboard-header">
          <div>
            <h1>Olá, {{ doctorName }}</h1>
            <p class="welcome-text">Bem-vindo ao seu painel de controle</p>
          </div>
          <button class="btn btn-primary" (click)="navigateTo('/doctor/marketplace')">
            Ver Plantões Disponíveis
          </button>
        </div>

        <div class="summary-grid">
          <div class="summary-card" *ngFor="let item of financialSummary">
            <div class="summary-icon">{{ item.icon }}</div>
            <div class="summary-content">
              <h3>{{ item.title }}</h3>
              <div class="summary-value">{{ item.value }}</div>
              <div class="summary-subtitle" *ngIf="item.subtitle">{{ item.subtitle }}</div>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <div class="section-card">
            <h2>Próximos Plantões</h2>
            <div class="upcoming-shifts">
              <div class="shift-item" *ngFor="let shift of upcomingShifts">
                <div class="shift-date-badge">
                  <div class="date-day">{{ getDay(shift.date) }}</div>
                  <div class="date-month">{{ getMonth(shift.date) }}</div>
                </div>
                <div class="shift-info">
                  <h4>{{ shift.hospital }}</h4>
                  <p>{{ shift.time }} - {{ shift.specialty }}</p>
                </div>
                <div class="shift-value">
                  <span>R$ {{ shift.value }}</span>
                </div>
              </div>
              <div class="empty-state" *ngIf="upcomingShifts.length === 0">
                <p>Nenhum plantão agendado</p>
              </div>
            </div>
            <button class="btn btn-secondary btn-full" (click)="navigateTo('/doctor/schedule')">
              Ver Agenda Completa
            </button>
          </div>

          <div class="section-card">
            <h2>Atividade Recente</h2>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let activity of recentActivity">
                <div class="activity-icon" [style.background]="activity.color">
                  {{ activity.icon }}
                </div>
                <div class="activity-content">
                  <h4>{{ activity.title }}</h4>
                  <p>{{ activity.description }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section-card">
          <h2>Resumo Mensal</h2>
          <div class="monthly-stats">
            <div class="stat-item">
              <div class="stat-label">Plantões Realizados</div>
              <div class="stat-value">{{ monthlyStats.count }}</div>
              <div class="stat-trend positive">+3 vs mês anterior</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Horas Trabalhadas</div>
              <div class="stat-value">{{ monthlyStats.hours }}h</div>
              <div class="stat-trend positive">+24h vs mês anterior</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Ganhos do Mês</div>
              <div class="stat-value">R$ {{ monthlyStats.earnings }}</div>
              <div class="stat-trend positive">+18% vs mês anterior</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Média por Plantão</div>
              <div class="stat-value">R$ {{ monthlyStats.average }}</div>
              <div class="stat-trend">Estável</div>
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
      margin: 0 0 var(--spacing-xs) 0;
    }

    .welcome-text {
      color: var(--color-text-light);
      margin: 0;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .summary-card {
      background: white;
      padding: var(--spacing-md);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      display: flex;
      gap: var(--spacing-md);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .summary-icon {
      font-size: 2.5rem;
      display: flex;
      align-items: center;
    }

    .summary-content {
      flex: 1;
    }

    .summary-content h3 {
      font-size: 0.875rem;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-xs);
      font-weight: 500;
    }

    .summary-value {
      font-size: 1.75rem;
      font-weight: bold;
      color: var(--color-primary);
      margin-bottom: var(--spacing-xs);
    }

    .summary-subtitle {
      font-size: 0.75rem;
      color: var(--color-text-light);
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .section-card {
      background: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
    }

    .section-card h2 {
      margin-bottom: var(--spacing-md);
      color: var(--color-text);
    }

    .upcoming-shifts {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .shift-item {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: var(--color-background-alt);
      border-radius: var(--border-radius);
      align-items: center;
    }

    .shift-date-badge {
      background: var(--color-primary);
      color: white;
      padding: var(--spacing-sm);
      border-radius: var(--border-radius);
      text-align: center;
      min-width: 60px;
    }

    .date-day {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .date-month {
      font-size: 0.75rem;
      text-transform: uppercase;
    }

    .shift-info {
      flex: 1;
    }

    .shift-info h4 {
      margin: 0 0 var(--spacing-xs) 0;
      color: var(--color-text);
    }

    .shift-info p {
      margin: 0;
      color: var(--color-text-light);
      font-size: 0.875rem;
    }

    .shift-value {
      font-size: 1.25rem;
      font-weight: bold;
      color: var(--color-primary);
    }

    .btn-full {
      width: 100%;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .activity-item {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: var(--color-background-alt);
      border-radius: var(--border-radius);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content h4 {
      margin: 0 0 var(--spacing-xs) 0;
      color: var(--color-text);
      font-size: 0.9rem;
    }

    .activity-content p {
      margin: 0 0 var(--spacing-xs) 0;
      color: var(--color-text-light);
      font-size: 0.875rem;
    }

    .activity-time {
      color: var(--color-text-light);
      font-size: 0.75rem;
    }

    .monthly-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
    }

    .stat-item {
      text-align: center;
      padding: var(--spacing-md);
      background: var(--color-background-alt);
      border-radius: var(--border-radius);
    }

    .stat-label {
      color: var(--color-text-light);
      font-size: 0.875rem;
      margin-bottom: var(--spacing-sm);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: var(--color-text);
      margin-bottom: var(--spacing-xs);
    }

    .stat-trend {
      font-size: 0.875rem;
      color: var(--color-text-light);
    }

    .stat-trend.positive {
      color: var(--color-success);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-md);
      color: var(--color-text-light);
      width: 100%;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .dashboard-header button {
        width: 100%;
      }

      .shift-item {
        flex-wrap: wrap;
      }

      .shift-value {
        width: 100%;
        text-align: right;
      }

      .monthly-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  doctorName = 'Doutor';
  financialSummary: FinancialSummary[] = [];
  upcomingShifts: Shift[] = [];
  monthlyStats = { count: 0, hours: 0, earnings: 0, average: 0 };

  recentActivity = [
    { icon: '✅', title: 'Plantão Aceito', description: 'Hospital São Lucas - 25/11', time: 'Há 2 horas', color: '#e8f5e9' },
    { icon: '💰', title: 'Pagamento Recebido', description: 'R$ 1.200 - Hospital Central', time: 'Há 5 horas', color: '#e3f2fd' },
    { icon: '📋', title: 'Novo Plantão Disponível', description: 'Clínica Santa Maria - 30/11', time: 'Há 1 dia', color: '#fff3e0' }
  ];

  constructor(
    private router: Router,
    private shiftService: ShiftService
  ) { }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.doctorName = user.name;

      this.shiftService.shifts$.subscribe(shifts => {
        // Filtrar plantões atribuídos a este médico (pelo email/id)
        const myShifts = shifts.filter(s => s.assignedDoctorId === user.email);
        this.updateDashboard(myShifts);
      });
    }
  }

  updateDashboard(shifts: Shift[]) {
    // Próximos plantões (ordenados por data)
    this.upcomingShifts = shifts
      .filter(s => new Date(s.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);

    // Estatísticas Mensais (Simuladas com base no total)
    const totalEarnings = shifts.reduce((sum, s) => sum + s.value, 0);
    const totalHours = shifts.length * 12; // Média de 12h por plantão

    this.monthlyStats = {
      count: shifts.length,
      hours: totalHours,
      earnings: totalEarnings,
      average: shifts.length > 0 ? Math.round(totalEarnings / shifts.length) : 0
    };

    this.financialSummary = [
      { title: 'Ganhos do Mês', value: `R$ ${totalEarnings}`, icon: '💰', subtitle: 'Novembro 2025' },
      { title: 'Horas do Mês', value: `${totalHours}h`, icon: '⏱️', subtitle: `${shifts.length} plantões` },
      { title: 'Próximo Plantão', value: this.upcomingShifts[0] ? this.getDay(this.upcomingShifts[0].date) + '/' + this.getMonth(this.upcomingShifts[0].date) : '--/--', icon: '📅', subtitle: this.upcomingShifts[0]?.hospital || 'Nenhum agendado' },
      { title: 'Taxa de Aceitação', value: '100%', icon: '✅', subtitle: 'Últimos 30 dias' }
    ];
  }

  getDay(dateString: string): string {
    return new Date(dateString).getDate().toString().padStart(2, '0');
  }

  getMonth(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
