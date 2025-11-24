import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';

interface MarketplaceShift {
  id: number;
  hospital: string;
  date: string;
  time: string;
  specialty: string;
  value: number;
  duration: string;
  description: string;
}

@Component({
  selector: 'app-doctor-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header [userType]="'doctor'"></app-header>

    <div class="marketplace">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>Marketplace de Plantões</h1>
            <p class="subtitle">Encontre e aceite plantões disponíveis</p>
          </div>
          <button class="btn btn-secondary" (click)="navigateTo('/doctor/dashboard')">
            Voltar ao Dashboard
          </button>
        </div>

        <div class="marketplace-summary">
          <div class="summary-item">
            <span class="summary-icon">📋</span>
            <div>
              <div class="summary-value">{{ availableShifts.length }}</div>
              <div class="summary-label">Plantões Disponíveis</div>
            </div>
          </div>
          <div class="summary-item">
            <span class="summary-icon">🆕</span>
            <div>
              <div class="summary-value">{{ getNewShiftsCount() }}</div>
              <div class="summary-label">Novos Hoje</div>
            </div>
          </div>
          <div class="summary-item">
            <span class="summary-icon">💰</span>
            <div>
              <div class="summary-value">R$ {{ getAverageValue() }}</div>
              <div class="summary-label">Valor Médio</div>
            </div>
          </div>
        </div>

        <div class="filters-section">
          <h3>Filtros</h3>
          <div class="filters-grid">
            <div class="filter-group">
              <label for="specialty">Especialidade</label>
              <select id="specialty" [(ngModel)]="filters.specialty" (change)="applyFilters()">
                <option value="">Todas</option>
                <option value="Cardiologia">Cardiologia</option>
                <option value="Pediatria">Pediatria</option>
                <option value="Ortopedia">Ortopedia</option>
                <option value="Emergência">Emergência</option>
                <option value="Clínica Geral">Clínica Geral</option>
              </select>
            </div>

            <div class="filter-group">
              <label for="minValue">Valor Mínimo</label>
              <input
                type="number"
                id="minValue"
                [(ngModel)]="filters.minValue"
                (input)="applyFilters()"
                placeholder="R$ 0"
                min="0"
              />
            </div>

            <div class="filter-group">
              <label for="dateFrom">Data Inicial</label>
              <input
                type="date"
                id="dateFrom"
                [(ngModel)]="filters.dateFrom"
                (change)="applyFilters()"
              />
            </div>

            <button class="btn btn-secondary btn-small" (click)="clearFilters()">
              Limpar Filtros
            </button>
          </div>
        </div>

        <div class="shifts-grid">
          <div class="shift-card" *ngFor="let shift of filteredShifts">
            <div class="shift-badge">
              <span class="badge-new" *ngIf="isNew(shift)">NOVO</span>
            </div>

            <div class="shift-header">
              <h3>{{ shift.hospital }}</h3>
              <div class="shift-value-badge">R$ {{ shift.value }}</div>
            </div>

            <div class="shift-info-grid">
              <div class="info-item">
                <span class="info-label">📅 Data</span>
                <span class="info-value">{{ formatDate(shift.date) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🕐 Horário</span>
                <span class="info-value">{{ shift.time }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🏥 Especialidade</span>
                <span class="info-value">{{ shift.specialty }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⏱️ Duração</span>
                <span class="info-value">{{ shift.duration }}</span>
              </div>
            </div>

            <div class="shift-description">
              <p>{{ shift.description }}</p>
            </div>

            <div class="shift-actions">
              <button class="btn btn-primary btn-full" (click)="acceptShift(shift.id)">
                Aceitar Plantão
              </button>
              <button class="btn btn-secondary btn-full" (click)="viewDetails(shift.id)">
                Ver Detalhes
              </button>
            </div>
          </div>

          <div class="empty-state" *ngIf="filteredShifts.length === 0">
            <div class="empty-icon">🔍</div>
            <h3>Nenhum plantão encontrado</h3>
            <p>Tente ajustar os filtros ou volte mais tarde para ver novos plantões</p>
            <button class="btn btn-primary" (click)="clearFilters()">
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .marketplace {
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

    .marketplace-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .summary-item {
      background: white;
      padding: var(--spacing-md);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .summary-icon {
      font-size: 2rem;
    }

    .summary-value {
      font-size: 1.75rem;
      font-weight: bold;
      color: var(--color-primary);
    }

    .summary-label {
      color: var(--color-text-light);
      font-size: 0.875rem;
    }

    .filters-section {
      background: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--spacing-lg);
    }

    .filters-section h3 {
      margin: 0 0 var(--spacing-md) 0;
      color: var(--color-text);
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .filter-group label {
      font-weight: 600;
      color: var(--color-text);
      font-size: 0.875rem;
    }

    .shifts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--spacing-lg);
    }

    .shift-card {
      background: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      transition: all 0.3s ease;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .shift-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }

    .shift-badge {
      position: absolute;
      top: var(--spacing-sm);
      right: var(--spacing-sm);
    }

    .badge-new {
      background: var(--color-primary);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .shift-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: var(--spacing-sm);
      padding-bottom: var(--spacing-md);
      border-bottom: 2px solid var(--color-border);
    }

    .shift-header h3 {
      margin: 0;
      color: var(--color-text);
      flex: 1;
    }

    .shift-value-badge {
      background: var(--color-primary);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      font-size: 1.25rem;
      font-weight: bold;
    }

    .shift-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .info-label {
      color: var(--color-text-light);
      font-size: 0.875rem;
    }

    .info-value {
      color: var(--color-text);
      font-weight: 600;
    }

    .shift-description {
      background: var(--color-background-alt);
      padding: var(--spacing-md);
      border-radius: var(--border-radius);
    }

    .shift-description p {
      margin: 0;
      color: var(--color-text-light);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .shift-actions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      margin-top: auto;
    }

    .btn-full {
      width: 100%;
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--spacing-xl) 0;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: var(--spacing-md);
    }

    .empty-state h3 {
      color: var(--color-text);
      margin-bottom: var(--spacing-sm);
    }

    .empty-state p {
      color: var(--color-text-light);
      margin-bottom: var(--spacing-lg);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .page-header button {
        width: 100%;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .shifts-grid {
        grid-template-columns: 1fr;
      }

      .shift-info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DoctorMarketplaceComponent implements OnInit {
  availableShifts: MarketplaceShift[] = [
    {
      id: 1,
      hospital: 'Hospital São Lucas',
      date: '2025-11-30',
      time: '08:00 - 20:00',
      specialty: 'Cardiologia',
      value: 1200,
      duration: '12 horas',
      description: 'Plantão de cardiologia no pronto socorro. Experiência em emergências cardíacas preferencial.'
    },
    {
      id: 2,
      hospital: 'Hospital Central',
      date: '2025-12-01',
      time: '20:00 - 08:00',
      specialty: 'Emergência',
      value: 1800,
      duration: '12 horas',
      description: 'Plantão noturno de emergência. Hospital de grande porte com UTI.'
    },
    {
      id: 3,
      hospital: 'Clínica Santa Maria',
      date: '2025-11-30',
      time: '14:00 - 22:00',
      specialty: 'Pediatria',
      value: 1000,
      duration: '8 horas',
      description: 'Atendimento pediátrico ambulatorial. Foco em consultas de rotina.'
    },
    {
      id: 4,
      hospital: 'Hospital Regional',
      date: '2025-12-02',
      time: '08:00 - 18:00',
      specialty: 'Ortopedia',
      value: 1400,
      duration: '10 horas',
      description: 'Plantão de ortopedia com atendimento ambulatorial e pequenas cirurgias.'
    },
    {
      id: 5,
      hospital: 'Hospital Central',
      date: '2025-12-03',
      time: '08:00 - 20:00',
      specialty: 'Clínica Geral',
      value: 900,
      duration: '12 horas',
      description: 'Atendimento de clínica geral no ambulatório. Ideal para médicos generalistas.'
    },
    {
      id: 6,
      hospital: 'Hospital São Lucas',
      date: '2025-12-04',
      time: '14:00 - 22:00',
      specialty: 'Cardiologia',
      value: 1300,
      duration: '8 horas',
      description: 'Plantão de cardiologia com foco em pacientes internados.'
    }
  ];

  filteredShifts: MarketplaceShift[] = [];

  filters = {
    specialty: '',
    minValue: 0,
    dateFrom: ''
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.filteredShifts = [...this.availableShifts];
  }

  applyFilters() {
    this.filteredShifts = this.availableShifts.filter(shift => {
      if (this.filters.specialty && shift.specialty !== this.filters.specialty) {
        return false;
      }
      if (this.filters.minValue && shift.value < this.filters.minValue) {
        return false;
      }
      if (this.filters.dateFrom && shift.date < this.filters.dateFrom) {
        return false;
      }
      return true;
    });
  }

  clearFilters() {
    this.filters = {
      specialty: '',
      minValue: 0,
      dateFrom: ''
    };
    this.filteredShifts = [...this.availableShifts];
  }

  getNewShiftsCount(): number {
    return 3;
  }

  getAverageValue(): number {
    const total = this.availableShifts.reduce((sum, shift) => sum + shift.value, 0);
    return Math.round(total / this.availableShifts.length);
  }

  isNew(shift: MarketplaceShift): boolean {
    return shift.id <= 2;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  acceptShift(id: number) {
    if (confirm('Deseja aceitar este plantão?')) {
      alert('Plantão aceito com sucesso! Você pode visualizá-lo na sua agenda.');
      this.availableShifts = this.availableShifts.filter(shift => shift.id !== id);
      this.applyFilters();
    }
  }

  viewDetails(id: number) {
    console.log('View details:', id);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
