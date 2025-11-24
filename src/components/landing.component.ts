import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <app-header [userType]="'guest'"></app-header>

    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Gestão de Plantões Médicos Simplificada</h1>
          <p class="hero-subtitle">
            Pare de perder tempo com planilhas e WhatsApp. Gerencie escalas médicas de forma profissional e eficiente.
          </p>
          <div class="hero-cta">
            <button class="btn btn-primary" (click)="navigateTo('/register')">
              Comece Gratuitamente
            </button>
            <button class="btn btn-secondary" (click)="scrollToFeatures()">
              Saiba Mais
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="features" id="features">
      <div class="container">
        <h2 class="section-title">Como o SyncMed Funciona</h2>
        <div class="carousel">
          <div class="carousel-item" *ngFor="let feature of features">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="benefits">
      <div class="container">
        <h2 class="section-title">Benefícios Para Todos</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>Para Hospitais e Coordenadores</h3>
            <ul>
              <li>✓ Publique plantões em segundos</li>
              <li>✓ Visão completa da escala</li>
              <li>✓ Reduza falhas de comunicação</li>
              <li>✓ Métricas e relatórios em tempo real</li>
            </ul>
          </div>
          <div class="benefit-card">
            <h3>Para Médicos</h3>
            <ul>
              <li>✓ Aceite plantões com um clique</li>
              <li>✓ Visualize sua agenda completa</li>
              <li>✓ Acompanhe ganhos e horas trabalhadas</li>
              <li>✓ Marketplace de oportunidades</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="social-proof">
      <div class="container">
        <h2 class="section-title">Confiança e Resultados</h2>
        <div class="stats-grid">
          <div class="stat">
            <div class="stat-number">500+</div>
            <div class="stat-label">Médicos Cadastrados</div>
          </div>
          <div class="stat">
            <div class="stat-number">50+</div>
            <div class="stat-label">Hospitais Parceiros</div>
          </div>
          <div class="stat">
            <div class="stat-number">10k+</div>
            <div class="stat-label">Plantões Gerenciados</div>
          </div>
          <div class="stat">
            <div class="stat-number">98%</div>
            <div class="stat-label">Satisfação</div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-final">
      <div class="container">
        <h2>Pronto para transformar a gestão de plantões?</h2>
        <p>Junte-se a centenas de profissionais que já confiam no SyncMed</p>
        <div class="cta-buttons">
          <button class="btn btn-primary" (click)="navigateTo('/register')">
            Criar Conta Agora
          </button>
          <button class="btn btn-secondary" (click)="navigateTo('/login')">
            Já tenho conta
          </button>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 SyncMed. Todos os direitos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #68ddbd 0%, #4bc9a6 100%);
      color: white;
      padding: var(--spacing-xl) 0;
      min-height: 500px;
      display: flex;
      align-items: center;
    }

    .hero-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: var(--spacing-md);
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-lg);
      opacity: 0.95;
    }

    .hero-cta {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
      flex-wrap: wrap;
    }

    .hero-cta .btn {
      font-size: 1.1rem;
      padding: 1rem 2rem;
    }

    .hero-cta .btn-secondary {
      background: white;
      color: var(--color-primary);
      border: none;
    }

    .hero-cta .btn-secondary:hover {
      background: var(--color-background-alt);
      color: var(--color-primary-dark);
    }

    .features {
      padding: var(--spacing-xl) 0;
      background: var(--color-background-alt);
    }

    .section-title {
      text-align: center;
      margin-bottom: var(--spacing-lg);
      color: var(--color-text);
    }

    .carousel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-lg);
    }

    .carousel-item {
      background: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      text-align: center;
      box-shadow: var(--shadow-sm);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .carousel-item:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: var(--spacing-md);
    }

    .carousel-item h3 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
    }

    .benefits {
      padding: var(--spacing-xl) 0;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .benefit-card {
      background: white;
      padding: var(--spacing-lg);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-sm);
      border: 2px solid var(--color-primary);
    }

    .benefit-card h3 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-md);
    }

    .benefit-card ul {
      list-style: none;
      padding: 0;
    }

    .benefit-card li {
      padding: var(--spacing-xs) 0;
      color: var(--color-text-light);
    }

    .social-proof {
      padding: var(--spacing-xl) 0;
      background: var(--color-background-alt);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
    }

    .stat {
      text-align: center;
      padding: var(--spacing-md);
    }

    .stat-number {
      font-size: 3rem;
      font-weight: bold;
      color: var(--color-primary);
      margin-bottom: var(--spacing-xs);
    }

    .stat-label {
      color: var(--color-text-light);
      font-size: 1rem;
    }

    .cta-final {
      padding: var(--spacing-xl) 0;
      background: var(--color-primary);
      color: white;
      text-align: center;
    }

    .cta-final h2 {
      margin-bottom: var(--spacing-sm);
    }

    .cta-final p {
      margin-bottom: var(--spacing-lg);
      font-size: 1.1rem;
      opacity: 0.95;
    }

    .cta-buttons {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-buttons .btn {
      font-size: 1.1rem;
      padding: 1rem 2rem;
    }

    .cta-buttons .btn-primary {
      background: white;
      color: var(--color-primary);
    }

    .cta-buttons .btn-primary:hover {
      background: var(--color-background-alt);
    }

    .cta-buttons .btn-secondary {
      background: transparent;
      color: white;
      border-color: white;
    }

    .footer {
      background: var(--color-text);
      color: white;
      padding: var(--spacing-md) 0;
      text-align: center;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .stat-number {
        font-size: 2rem;
      }
    }
  `]
})
export class LandingComponent {
  features = [
    {
      icon: '📋',
      title: 'Publicação Rápida',
      description: 'Crie e publique plantões em segundos com formulário intuitivo'
    },
    {
      icon: '📅',
      title: 'Gestão Completa',
      description: 'Visualize todas as escalas e plantões em uma interface limpa'
    },
    {
      icon: '🔔',
      title: 'Notificações em Tempo Real',
      description: 'Receba alertas instantâneos sobre novos plantões e atualizações'
    },
    {
      icon: '💰',
      title: 'Controle Financeiro',
      description: 'Acompanhe valores e horas trabalhadas automaticamente'
    },
    {
      icon: '🏥',
      title: 'Multi-Hospital',
      description: 'Gerencie plantões de múltiplos hospitais em um único lugar'
    },
    {
      icon: '📊',
      title: 'Relatórios Inteligentes',
      description: 'Métricas e insights para otimizar sua gestão'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }
}
